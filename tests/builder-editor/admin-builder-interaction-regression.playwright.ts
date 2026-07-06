import { expect, test, type Page } from '@playwright/test';
import { openBuilder } from './helpers/editor';

const TARGET_NODE_ID = 'home-hero-title';
const shortcutModifier = 'ControlOrMeta';

type SmokeState = {
  exactHomeTextControls: number;
  homeNodes: number;
  required: Record<string, boolean>;
  topMenuOverlapPairs: number;
  topMenuSample: string[];
  totalNodes: number;
};

type PreviewState = {
  dragGhosts: number;
  dragOrigins: number;
  movePreviewCount: number;
  movePreviewIds: Array<string | null>;
  resizePreviewCount: number;
};

type DirectMoveProbe = {
  dragStart: number;
  firstPreview: number;
};

declare global {
  interface Window {
    __builderDirectMoveProbe?: DirectMoveProbe;
  }
}

type ResizeState = PreviewState & {
  readoutText: string[];
  readouts: number;
  resizePreviewIds: Array<string | null>;
};

function getStableNodeHitPoint(box: { x: number; y: number; width: number; height: number }) {
  return {
    x: box.x + box.width / 2,
    y: box.y + Math.min(24, box.height / 4),
  };
}

async function getNodeClientRect(page: Page, nodeId: string) {
  return page.locator(`[data-node-id="${nodeId}"]`).first().evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      height: Math.round(rect.height),
      width: Math.round(rect.width),
      x: Math.round(rect.x),
      y: Math.round(rect.y),
    };
  });
}

async function getNodeLocalRect(page: Page, nodeId: string) {
  return page.locator(`[data-node-id="${nodeId}"]`).first().evaluate((element) => {
    const htmlElement = element as HTMLElement;
    return {
      height: Number.parseFloat(htmlElement.style.height),
      width: Number.parseFloat(htmlElement.style.width),
      x: Number.parseFloat(htmlElement.style.left),
      y: Number.parseFloat(htmlElement.style.top),
    };
  });
}

async function getSelectedNodeIds(page: Page): Promise<string[]> {
  return page.evaluate(() => Array.from(document.querySelectorAll<HTMLElement>('[data-node-id][data-selected="true"]'))
    .map((element) => element.dataset.nodeId ?? '')
    .filter(Boolean)
    .sort());
}

function collectCriticalBrowserErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => {
    errors.push(`pageerror: ${error.message}`);
  });
  return errors;
}

async function getInitialSmokeState(page: Page): Promise<SmokeState> {
  return page.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('[data-node-id]'));
    const topControls = Array.from(document.querySelectorAll('a,button,[role="button"]'))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          bottom: rect.bottom,
          height: rect.height,
          left: rect.left,
          right: rect.right,
          text: (element.textContent || element.getAttribute('aria-label') || '').trim(),
          top: rect.top,
          width: rect.width,
        };
      })
      .filter((item) => item.top < 100 && item.bottom > 0 && item.width > 4 && item.height > 4);
    let topMenuOverlapPairs = 0;
    for (let index = 0; index < topControls.length; index += 1) {
      const current = topControls[index];
      if (!current) continue;
      for (let nextIndex = index + 1; nextIndex < topControls.length; nextIndex += 1) {
        const next = topControls[nextIndex];
        if (!next) continue;
        const overlapX = Math.max(0, Math.min(current.right, next.right) - Math.max(current.left, next.left));
        const overlapY = Math.max(0, Math.min(current.bottom, next.bottom) - Math.max(current.top, next.top));
        if (overlapX > 2 && overlapY > 2) topMenuOverlapPairs += 1;
      }
    }

    const required: Record<string, boolean> = {};
    for (const id of ['home-hero-title', 'home-hero-subtitle', 'home-services-root', 'home-case-results-root', 'home-faq-root']) {
      required[id] = Boolean(document.querySelector(`[data-node-id="${id}"]`));
    }

    return {
      // Count the topbar page selector that currently shows the home page.
      // The selector renders a "페이지" kicker label + the current page name
      // (SandboxTopBar pageDropdownKicker + pageDropdownCurrent), so its button
      // textContent is "페이지 홈" — matching the current-page span keeps the
      // original "exactly one home page indicator" intent without being broken
      // by the kicker, and still catches a missing (0) or duplicated (>1) one.
      exactHomeTextControls: Array.from(
        document.querySelectorAll('[data-builder-topbar-page-selector="true"]'),
      ).filter((element) => {
        const current = element.querySelector('[class*="pageDropdownCurrent"]');
        return ((current ?? element).textContent || '').trim() === '홈';
      }).length,
      homeNodes: nodes.filter((node) => (node.getAttribute('data-node-id') || '').startsWith('home-')).length,
      required,
      topMenuOverlapPairs,
      topMenuSample: topControls.slice(0, 12).map((item) => item.text),
      totalNodes: nodes.length,
    };
  });
}

async function getVisibleCanvasToolbars(page: Page) {
  return page.evaluate(() => Array.from(document.querySelectorAll('[role="toolbar"]'))
    .map((element) => {
      const rect = element.getBoundingClientRect();
      return {
        height: rect.height,
        left: rect.left,
        text: (element.textContent || '').replace(/\s+/g, ''),
        top: rect.top,
        width: rect.width,
      };
    })
    .filter((item) => item.width > 0 && item.height > 0 && item.top > 100));
}

async function getRotationHitTarget(page: Page, point: { x: number; y: number }) {
  return page.evaluate(({ x, y }) => {
    const element = document.elementFromPoint(x, y);
    const htmlElement = element instanceof HTMLElement ? element : null;
    return {
      ariaLabel: element?.getAttribute('aria-label') ?? '',
      className: htmlElement?.className?.toString() ?? '',
      closestNodeId: htmlElement?.closest('[data-node-id]')?.getAttribute('data-node-id') ?? '',
      tagName: element?.tagName ?? '',
    };
  }, point);
}

async function getMovePreviewState(page: Page): Promise<PreviewState> {
  return page.evaluate(() => ({
    dragGhosts: document.querySelectorAll('[class*="canvasOverlayDragGhost"]').length,
    dragOrigins: document.querySelectorAll('[class*="canvasOverlayDragOrigin"]').length,
    movePreviewCount: document.querySelectorAll('[data-builder-direct-move-preview="true"]').length,
    movePreviewIds: Array.from(document.querySelectorAll('[data-builder-direct-move-preview="true"]'))
      .map((element) => element.getAttribute('data-node-id')),
    resizePreviewCount: document.querySelectorAll('[data-builder-direct-resize-preview="true"]').length,
  }));
}

async function startDirectMoveProbe(page: Page, nodeId: string): Promise<void> {
  await page.evaluate((targetNodeId) => {
    const node = document.querySelector<HTMLElement>(`[data-node-id="${CSS.escape(targetNodeId)}"]`);
    const probe: DirectMoveProbe = {
      dragStart: performance.now(),
      firstPreview: 0,
    };
    window.__builderDirectMoveProbe = probe;
    if (!node) return;
    const observer = new MutationObserver(() => {
      if (probe.firstPreview > 0) return;
      if (node.dataset.builderDirectMovePreview === 'true') {
        probe.firstPreview = performance.now();
        observer.disconnect();
      }
    });
    observer.observe(node, {
      attributes: true,
      attributeFilter: ['data-builder-direct-move-preview'],
    });
  }, nodeId);
}

async function readDirectMovePreviewMs(page: Page): Promise<number | null> {
  return page.evaluate(() => {
    const probe = window.__builderDirectMoveProbe;
    if (!probe || probe.dragStart <= 0 || probe.firstPreview <= 0) return null;
    return probe.firstPreview - probe.dragStart;
  });
}

async function getResizePreviewState(page: Page): Promise<ResizeState> {
  return page.evaluate(() => ({
    dragGhosts: document.querySelectorAll('[class*="canvasOverlayDragGhost"]').length,
    dragOrigins: document.querySelectorAll('[class*="canvasOverlayDragOrigin"]').length,
    movePreviewCount: document.querySelectorAll('[data-builder-direct-move-preview="true"]').length,
    movePreviewIds: Array.from(document.querySelectorAll('[data-builder-direct-move-preview="true"]'))
      .map((element) => element.getAttribute('data-node-id')),
    readoutText: Array.from(document.querySelectorAll('[class*="canvasOverlayResizeReadout"]'))
      .map((element) => (element.textContent || '').replace(/\s+/g, ' ').trim()),
    readouts: document.querySelectorAll('[class*="canvasOverlayResizeReadout"]').length,
    resizePreviewCount: document.querySelectorAll('[data-builder-direct-resize-preview="true"]').length,
    resizePreviewIds: Array.from(document.querySelectorAll('[data-builder-direct-resize-preview="true"]'))
      .map((element) => element.getAttribute('data-node-id')),
  }));
}

test('/ko/admin-builder keeps home, menu, and direct interaction previews stable', async ({ page }) => {
  test.setTimeout(90_000);
  const browserErrors = collectCriticalBrowserErrors(page);

  await page.setViewportSize({ width: 1440, height: 950 });
  await openBuilder(page);

  const initial = await getInitialSmokeState(page);
  expect(initial.totalNodes).toBeGreaterThanOrEqual(380);
  expect(initial.homeNodes).toBeGreaterThanOrEqual(360);
  expect(initial.required).toMatchObject({
    'home-faq-root': true,
    'home-case-results-root': true,
    'home-hero-subtitle': true,
    'home-hero-title': true,
    'home-services-root': true,
  });
  expect(initial.exactHomeTextControls).toBe(1);
  expect(initial.topMenuOverlapPairs, initial.topMenuSample.join(' | ')).toBe(0);
  await expect(page.locator('[data-node-id="case-results-root"]')).toHaveCount(0);
  await expect(page.locator('[data-node-id="home-case-results-root"]')).toBeVisible();

  const target = page.locator(`[data-node-id="${TARGET_NODE_ID}"]`).first();
  await expect(target).toBeVisible();
  const box = await target.boundingBox();
  expect(box).not.toBeNull();
  if (!box) throw new Error(`Missing target bounds for ${TARGET_NODE_ID}`);
  const targetPoint = getStableNodeHitPoint(box);

  await page.mouse.click(targetPoint.x, targetPoint.y);
  await page.waitForTimeout(150);
  const toolbars = await getVisibleCanvasToolbars(page);
  expect(toolbars).toHaveLength(1);

  await startDirectMoveProbe(page, TARGET_NODE_ID);
  await page.mouse.move(targetPoint.x, targetPoint.y);
  await page.mouse.down();
  await page.mouse.move(targetPoint.x + 34, targetPoint.y + 22, { steps: 4 });
  await page.waitForTimeout(80);
  const moveState = await getMovePreviewState(page);
  const firstMovePreviewMs = await readDirectMovePreviewMs(page);
  expect(moveState.movePreviewIds).toContain(TARGET_NODE_ID);
  expect(moveState.movePreviewCount).toBe(1);
  expect(moveState.resizePreviewCount).toBe(0);
  expect(moveState.dragGhosts).toBe(1);
  expect(moveState.dragOrigins).toBe(1);
  expect(firstMovePreviewMs ?? Number.POSITIVE_INFINITY).toBeLessThan(160);

  await page.mouse.up();
  await page.waitForTimeout(120);
  const moveCleanup = await getMovePreviewState(page);
  expect(moveCleanup.movePreviewCount).toBe(0);
  expect(moveCleanup.resizePreviewCount).toBe(0);
  expect(moveCleanup.dragGhosts).toBe(0);
  expect(moveCleanup.dragOrigins).toBe(0);

  const resizedBox = await target.boundingBox();
  expect(resizedBox).not.toBeNull();
  if (!resizedBox) throw new Error(`Missing target bounds after move for ${TARGET_NODE_ID}`);
  const resizedTargetPoint = getStableNodeHitPoint(resizedBox);
  await page.mouse.click(resizedTargetPoint.x, resizedTargetPoint.y);
  await page.waitForTimeout(120);
  const resizeBeforeRect = await getNodeLocalRect(page, TARGET_NODE_ID);
  const handleBox = await page.getByLabel(/Resize .* se/).first().boundingBox();
  expect(handleBox).not.toBeNull();
  if (!handleBox) throw new Error('Missing southeast resize handle.');

  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(handleBox.x + handleBox.width / 2 + 28, handleBox.y + handleBox.height / 2 + 18, { steps: 4 });
  await page.waitForTimeout(80);
  const resizeState = await getResizePreviewState(page);
  expect(resizeState.resizePreviewIds).toContain(TARGET_NODE_ID);
  expect(resizeState.resizePreviewCount).toBe(1);
  expect(resizeState.movePreviewCount).toBe(0);
  expect(resizeState.dragGhosts).toBe(0);
  expect(resizeState.dragOrigins).toBe(1);
  expect(resizeState.readouts).toBeGreaterThanOrEqual(1);
  expect(resizeState.readoutText.some((text) => /\d+ x \d+/.test(text))).toBe(true);

  await page.mouse.up();
  await page.waitForTimeout(120);
  const resizeAfterRect = await getNodeLocalRect(page, TARGET_NODE_ID);
  expect(resizeAfterRect.width).toBeGreaterThan(resizeBeforeRect.width);
  expect(resizeAfterRect.height).toBeGreaterThan(resizeBeforeRect.height);
  const resizeCleanup = await getResizePreviewState(page);
  expect(resizeCleanup.movePreviewCount).toBe(0);
  expect(resizeCleanup.resizePreviewCount).toBe(0);
  expect(resizeCleanup.dragGhosts).toBe(0);
  expect(resizeCleanup.dragOrigins).toBe(0);
  expect(resizeCleanup.readouts).toBe(0);

  await page.keyboard.press(`${shortcutModifier}+Z`);
  await expect.poll(
    async () => getNodeLocalRect(page, TARGET_NODE_ID),
    { timeout: 10_000 },
  ).toEqual(resizeBeforeRect);

  await page.mouse.click(resizedTargetPoint.x, resizedTargetPoint.y);
  await page.locator('[data-node-id="home-hero-subtitle"]').first().click({
    force: true,
    modifiers: ['Shift'],
  });
  await expect.poll(async () => getSelectedNodeIds(page), { timeout: 10_000 }).toEqual([
    'home-hero-subtitle',
    TARGET_NODE_ID,
  ].sort());

  expect(browserErrors).toEqual([]);
});

test('/ko/admin-builder drags the selected ancestor when a child surface is grabbed', async ({ page }) => {
  test.setTimeout(60_000);
  const browserErrors = collectCriticalBrowserErrors(page);

  await page.setViewportSize({ width: 1440, height: 950 });
  await openBuilder(page, `/ko/admin-builder?selectedAncestorDrag=${Date.now().toString(36)}`);

  await page.locator('[data-builder-rail-item="layers"]').click();
  await page.locator('[data-builder-layer-search="true"]').fill('home-hero-search-wrap');
  await page.locator('[data-builder-layer-row="home-hero-search-wrap"]').click();
  await expect.poll(async () => getSelectedNodeIds(page), { timeout: 10_000 }).toEqual(['home-hero-search-wrap']);
  await page.locator('[data-builder-rail-item="layers"]').click();

  const parentBefore = await getNodeClientRect(page, 'home-hero-search-wrap');
  const childBox = await page.locator('[data-node-id="home-hero-search-input"]').first().boundingBox();
  expect(childBox).not.toBeNull();
  if (!childBox) throw new Error('Missing selected-child hit surface.');

  const start = {
    x: childBox.x + childBox.width / 2,
    y: childBox.y + childBox.height / 2,
  };
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + 44, start.y + 28, { steps: 5 });
  await page.mouse.up();
  await page.waitForTimeout(120);

  const parentAfter = await getNodeClientRect(page, 'home-hero-search-wrap');
  const childAfter = await getNodeClientRect(page, 'home-hero-search-input');
  expect(parentAfter.x).toBeGreaterThan(parentBefore.x + 8);
  expect(parentAfter.y).toBeGreaterThan(parentBefore.y + 8);
  expect(childAfter.x).toBeGreaterThan(parentBefore.x + 8);
  await expect.poll(async () => getSelectedNodeIds(page), { timeout: 10_000 }).toEqual(['home-hero-search-wrap']);

  await page.keyboard.press(`${shortcutModifier}+Z`);
  await expect.poll(
    async () => getNodeClientRect(page, 'home-hero-search-wrap'),
    { timeout: 10_000 },
  ).toEqual(parentBefore);
  expect(browserErrors).toEqual([]);
});

test('/ko/admin-builder rotates selected nodes with a real mouse drag', async ({ page }) => {
  test.setTimeout(45_000);
  const browserErrors = collectCriticalBrowserErrors(page);

  await page.setViewportSize({ width: 1440, height: 950 });
  await openBuilder(page, `/ko/admin-builder?rotationRealMouse=${Date.now().toString(36)}`);

  const node = page.locator('[data-node-id="home-hero-label"]').first();
  await expect(node).toBeVisible();
  await node.click({ force: true });

  const rotationHandle = page.locator('[class*="rotationHandle"]').first();
  await expect(rotationHandle).toBeVisible();
  const handleBox = await rotationHandle.boundingBox();
  expect(handleBox).not.toBeNull();
  if (!handleBox) throw new Error('Missing rotation handle bounds.');

  const handleCenter = {
    x: handleBox.x + handleBox.width / 2,
    y: handleBox.y + handleBox.height / 2,
  };
  const hitTarget = await getRotationHitTarget(page, handleCenter);
  expect(hitTarget.ariaLabel).toMatch(/^Rotate /);

  const beforeTransform = await node.evaluate((element) => window.getComputedStyle(element).transform);
  await page.mouse.move(handleCenter.x, handleCenter.y);
  await page.mouse.down();
  await page.mouse.move(handleCenter.x + 96, handleCenter.y + 96, { steps: 8 });
  await expect(page.locator('[class*="rotationReadout"]').first()).toBeVisible();
  await page.mouse.up();
  await page.waitForTimeout(120);

  const afterTransform = await node.evaluate((element) => window.getComputedStyle(element).transform);
  expect(afterTransform).not.toBe(beforeTransform);
  expect(afterTransform).not.toBe('none');

  const shortcutModifier = process.platform === 'darwin' ? 'Meta' : 'Control';
  await page.keyboard.press(`${shortcutModifier}+Z`);
  expect(browserErrors).toEqual([]);
});

test('/ko/admin-builder top bar does not overlap at compact desktop width', async ({ page }) => {
  test.setTimeout(45_000);
  const browserErrors = collectCriticalBrowserErrors(page);

  await page.setViewportSize({ width: 1024, height: 900 });
  await openBuilder(page);

  const compact = await getInitialSmokeState(page);
  expect(compact.required).toMatchObject({
    'home-faq-root': true,
    'home-case-results-root': true,
    'home-hero-subtitle': true,
    'home-hero-title': true,
    'home-services-root': true,
  });
  expect(compact.exactHomeTextControls).toBe(1);
  expect(compact.topMenuOverlapPairs, compact.topMenuSample.join(' | ')).toBe(0);
  await expect(page.locator('[data-node-id="case-results-root"]')).toHaveCount(0);
  await expect(page.locator('[data-node-id="home-case-results-root"]')).toBeVisible();
  await expect(page.locator('[data-builder-topbar-viewport="desktop"]')).toBeVisible();
  await expect(page.locator('[data-builder-topbar-viewport="tablet"]')).toBeVisible();
  await expect(page.locator('[data-builder-topbar-viewport="mobile"]')).toBeVisible();
  expect(browserErrors).toEqual([]);
});

test('/ko/admin-builder keeps layers panel rows readable and actions quiet', async ({ page }) => {
  test.setTimeout(60_000);
  const browserErrors = collectCriticalBrowserErrors(page);

  await page.setViewportSize({ width: 1440, height: 950 });
  await openBuilder(page, `/ko/admin-builder?layerRows=${Date.now().toString(36)}`);

  await page.locator('[data-builder-rail-item="layers"]').click();
  await page.locator('[data-builder-layer-search="true"]').fill('hero');
  await expect(page.locator('[data-builder-layer-row="home-hero-root"]')).toBeVisible();
  await expect(page.locator('[data-builder-layer-row="home-hero-quick-menu-item-0"]')).toBeVisible();

  const defaultState = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-builder-layer-row]')).slice(0, 30);
    const rowMetrics = rows.map((row) => {
      const text = row.querySelector<HTMLElement>('[class*="layerTreeText"]');
      const actions = row.querySelector<HTMLElement>('[class*="layerRowActions"]');
      return {
        id: row.dataset.builderLayerRow ?? '',
        textWidth: Math.round(text?.getBoundingClientRect().width ?? 0),
        actionsOpacity: actions ? window.getComputedStyle(actions).opacity : '0',
        actionsPointerEvents: actions ? window.getComputedStyle(actions).pointerEvents : 'none',
      };
    });
    return {
      minTextWidth: Math.min(...rowMetrics.map((row) => row.textWidth)),
      zeroTextRows: rowMetrics.filter((row) => row.textWidth < 80).map((row) => row.id),
      visibleActionRows: rowMetrics.filter((row) => row.actionsOpacity !== '0' || row.actionsPointerEvents !== 'none').map((row) => row.id),
    };
  });

  expect(defaultState.zeroTextRows).toEqual([]);
  expect(defaultState.minTextWidth).toBeGreaterThanOrEqual(80);
  expect(defaultState.visibleActionRows).toEqual([]);

  const deepRow = page.locator('[data-builder-layer-row="home-hero-quick-menu-item-0"]').first();
  await deepRow.hover();
  const hoverState = await deepRow.evaluate((row) => {
    const actions = row.querySelector<HTMLElement>('[class*="layerRowActions"]');
    const buttons = Array.from(row.querySelectorAll<HTMLElement>('[class*="layerQuickAction"]'));
    return {
      actionsOpacity: actions ? window.getComputedStyle(actions).opacity : '0',
      actionsPointerEvents: actions ? window.getComputedStyle(actions).pointerEvents : 'none',
      minActionSize: Math.min(...buttons.map((button) => {
        const rect = button.getBoundingClientRect();
        return Math.min(rect.width, rect.height);
      })),
    };
  });

  expect(hoverState.actionsOpacity).toBe('1');
  expect(hoverState.actionsPointerEvents).toBe('auto');
  expect(hoverState.minActionSize).toBeGreaterThanOrEqual(28);
  expect(browserErrors).toEqual([]);
});
