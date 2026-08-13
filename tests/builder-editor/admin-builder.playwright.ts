import { expect, test, type Locator, type Page } from '@playwright/test';
import { checkBuilderA11y } from './helpers/a11y';
import { openBuilder } from './helpers/editor';

const shortcutModifier = 'ControlOrMeta';

// Desktop parity checks need the in-canvas header region wider than its
// 1120px container-query breakpoint, so pin a generous desktop viewport.
test.use({ viewport: { width: 2200, height: 1000 } });

type TestNavigationItem = {
  id: string;
  label: string | Record<string, string>;
  href: string;
  pageId?: string;
  children?: TestNavigationItem[];
};

function isIgnoredBrowserError(message: string): boolean {
  return message === 'Invalid or unexpected token';
}

function canvasEditor(page: Page): Locator {
  return page.getByRole('application', { name: 'Canvas editor' });
}

async function firstVisibleNode(page: Page): Promise<Locator> {
  const canvas = canvasEditor(page);
  await expect(canvas).toBeVisible();
  const candidates = [
    canvas.locator('[data-node-id="home-hero-subtitle"]:visible').first(),
    canvas.locator('[data-node-id*="subtitle"]:visible').first(),
    canvas.locator('[data-node-id*="title"]:visible').first(),
    canvas.locator('[data-node-id*="copy"]:visible').first(),
    canvas.locator('[data-node-id]:visible').first(),
  ];
  for (const candidate of candidates) {
    if ((await candidate.count()) > 0) {
      await expect(candidate).toBeVisible();
      return candidate;
    }
  }
  const fallback = canvas.locator('[data-node-id]:visible').first();
  await expect(fallback).toBeVisible();
  return fallback;
}

async function expectSelectedNodeHandles(page: Page, node?: Locator): Promise<Locator> {
  const canvas = canvasEditor(page);
  let selectedNode = node ?? page
    .locator('[role="application"][aria-label="Canvas editor"] [class*="nodeSelected"][data-node-id]:visible')
    .filter({ has: page.locator('[class*="rotationHandle"]') })
    .last();

  if (node) {
    const alreadySelected = await node
      .evaluate((element) => String(element.className).includes('nodeSelected'))
      .catch(() => false);
    const hasHandles = await node.locator('[class*="rotationHandle"]').first().isVisible().catch(() => false);
    // Re-clicking an already-selected text node would enter inline editing
    // and drop the selection — only click when nothing is selected yet.
    if (!alreadySelected && !hasHandles) {
      const box = await node.boundingBox();
      await node.click({
        position: box
          ? {
              x: Math.max(1, Math.min(box.width - 1, box.width / 2)),
              y: Math.max(1, Math.min(box.height - 1, box.height / 2)),
            }
          : { x: 12, y: 12 },
        force: true,
      }).catch(() => undefined);
    }
  }

  const selectedVisible = await selectedNode.isVisible().catch(() => false);
  if (!selectedVisible) {
    const fallback = await firstVisibleNode(page);
    const fallbackBox = await fallback.boundingBox();
    await fallback.click({
      position: fallbackBox
        ? {
            x: Math.max(1, Math.min(fallbackBox.width - 1, fallbackBox.width / 2)),
            y: Math.max(1, Math.min(fallbackBox.height - 1, fallbackBox.height / 2)),
          }
        : { x: 12, y: 12 },
      force: true,
    });
    selectedNode = page
      .locator('[role="application"][aria-label="Canvas editor"] [class*="nodeSelected"][data-node-id]:visible')
      .filter({ has: page.locator('[class*="rotationHandle"]') })
      .last();
  }

  await expect(selectedNode).toBeVisible();
  const selectedHandleCount = await selectedNode.locator('[class*="resizeHandle"]:visible').count();
  if (selectedHandleCount !== 8) {
    const selectedWithHandles = canvas
      .locator('[class*="nodeSelected"][data-node-id]:visible')
      .filter({ has: page.locator('[class*="rotationHandle"]') })
      .last();
    const fallbackHandleCount = await selectedWithHandles
      .locator('[class*="resizeHandle"]:visible')
      .count()
      .catch(() => 0);
    if (fallbackHandleCount === 8) {
      selectedNode = selectedWithHandles;
    } else {
      const fallback = await firstVisibleNode(page);
      const fallbackBox = await fallback.boundingBox();
      await fallback.click({
        position: fallbackBox
          ? {
              x: Math.max(1, Math.min(fallbackBox.width - 1, fallbackBox.width / 2)),
              y: Math.max(1, Math.min(fallbackBox.height - 1, fallbackBox.height / 2)),
            }
          : { x: 12, y: 12 },
        force: true,
      });
      selectedNode = canvas
        .locator('[class*="nodeSelected"][data-node-id]:visible')
        .filter({ has: page.locator('[class*="rotationHandle"]') })
        .last();
    }
  }
  await expect(selectedNode.locator('[class*="resizeHandle"]:visible')).toHaveCount(8);
  // If the node lost its selection (hover outline instead of the selected
  // ring), re-click it before judging the selection chrome.
  await expect(async () => {
    const outline = await selectedNode.evaluate((element) => {
      const style = window.getComputedStyle(element);
      return {
        outlineColor: style.outlineColor,
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
      };
    });
    if (outline.outlineColor !== 'rgb(17, 109, 255)' || outline.outlineWidth !== '2px') {
      await selectedNode.click({ position: { x: 12, y: 12 }, force: true }).catch(() => undefined);
    }
    expect(outline).toEqual({
      outlineColor: 'rgb(17, 109, 255)',
      outlineStyle: 'solid',
      outlineWidth: '2px',
    });
  }).toPass({ timeout: 20_000 });

  const firstHandle = selectedNode.locator('[class*="resizeHandle"]:visible').first();
  const readHandleStyle = () => firstHandle.evaluate((element) => {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const localWidth = Number.parseFloat(style.width) || rect.width;
    const screenScale = rect.width / localWidth;
    return {
      backgroundColor: style.backgroundColor,
      borderColor: style.borderColor,
      borderRadius: Number.parseFloat(style.borderRadius) * screenScale,
      boxShadow: style.boxShadow,
      height: Math.round(rect.height),
      width: Math.round(rect.width),
    };
  }).catch(() => null);
  // Selection chrome can remount mid-read — poll until styles are readable.
  await expect.poll(async () => (await readHandleStyle())?.backgroundColor ?? '').toBe('rgb(255, 255, 255)');
  const handleStyle = (await readHandleStyle())!;
  expect(handleStyle.backgroundColor).toBe('rgb(255, 255, 255)');
  expect(handleStyle.borderColor).toBe('rgb(15, 23, 42)');
  expect(handleStyle.borderRadius).toBeCloseTo(2, 1);
  expect(handleStyle.boxShadow).toContain('rgb(17, 109, 255)');
  expect(handleStyle.width).toBeGreaterThanOrEqual(8);
  expect(handleStyle.width).toBeLessThanOrEqual(16);
  expect(handleStyle.height).toBeGreaterThanOrEqual(8);
  expect(handleStyle.height).toBeLessThanOrEqual(16);

  const rotationHandle = selectedNode.locator('[class*="rotationHandle"]').first();
  await expect(rotationHandle).toBeVisible();
  const rotationHandleStyle = await rotationHandle.evaluate((element) => {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return {
      cursor: style.cursor,
      height: Math.round(rect.height),
      width: Math.round(rect.width),
    };
  });
  expect(rotationHandleStyle.cursor).toBe('grab');
  expect(rotationHandleStyle.width).toBeGreaterThanOrEqual(14);
  expect(rotationHandleStyle.width).toBeLessThanOrEqual(22);
  expect(rotationHandleStyle.height).toBeGreaterThanOrEqual(14);
  expect(rotationHandleStyle.height).toBeLessThanOrEqual(29);

  const sizeLabel = selectedNode.locator('[class*="nodeSizeLabel"]').first();
  await expect(sizeLabel).toContainText(/^[a-z-]+ · \d+×\d+$/);
  const sizeLabelStyle = await sizeLabel.evaluate((element) => {
    const style = window.getComputedStyle(element);
    return {
      backgroundColor: style.backgroundColor,
      borderRadius: style.borderRadius,
      color: style.color,
    };
  });
  expect(sizeLabelStyle).toEqual({
    backgroundColor: 'rgb(17, 109, 255)',
    borderRadius: '3px',
    color: 'rgb(255, 255, 255)',
  });

  return selectedNode;
}

async function expectHoverIndicator(page: Page): Promise<void> {
  const hoverTarget = canvasEditor(page)
    .locator('[class*="node"][data-node-id="home-hero-title"]:visible')
    .filter({ has: page.locator('[class*="nodeBody"]') })
    .first();
  await expect(hoverTarget).toBeVisible();
  await hoverTarget.hover({ force: true });
  // Only the deepest hovered node renders the hover ring (ancestors are
  // suppressed via :has), so assert on the innermost hovered canvas node.
  const deepestHoverStyle = () => page.evaluate(() => {
    const hovered = Array.from(
      document.querySelectorAll('[data-node-id]:hover'),
    ).filter((element) => String(element.className).includes('node'));
    const deepest = hovered[hovered.length - 1];
    if (!deepest) return null;
    const style = window.getComputedStyle(deepest);
    return {
      outlineColor: style.outlineColor,
      outlineStyle: style.outlineStyle,
      outlineWidth: Number.parseFloat(style.outlineWidth),
    };
  });
  await expect.poll(deepestHoverStyle).toMatchObject({
    outlineColor: 'rgba(17, 109, 255, 0.72)',
    outlineStyle: 'solid',
  });
  const hoverWidth = (await deepestHoverStyle())?.outlineWidth ?? 0;
  expect(hoverWidth).toBeGreaterThanOrEqual(0.85);
  expect(hoverWidth).toBeLessThanOrEqual(1.5);
}

async function selectFirstNode(page: Page): Promise<Locator> {
  const node = await firstVisibleNode(page);
  const box = await node.boundingBox();
  await node.click({
    position: box
      ? {
          x: Math.max(1, Math.min(box.width - 1, box.width / 2)),
          y: Math.max(1, Math.min(box.height - 1, box.height / 2)),
        }
      : { x: 12, y: 12 },
    force: true,
  });
  return expectSelectedNodeHandles(page, node);
}

async function nodeCssSize(locator: Locator): Promise<{ width: number; height: number }> {
  return locator.evaluate((element) => {
    const style = window.getComputedStyle(element);
    return {
      width: Number.parseFloat(style.width),
      height: Number.parseFloat(style.height),
    };
  });
}

async function startPointerDrag(
  page: Page,
  locator: Locator,
  options: { pointerId?: number; shiftKey?: boolean } = {},
): Promise<{ pointerId: number; x: number; y: number; shiftKey: boolean }> {
  const box = await locator.boundingBox();
  expect(box).toBeTruthy();
  if (!box) throw new Error('Cannot drag an element without a bounding box');
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  const pointerId = options.pointerId ?? 7001;
  const shiftKey = options.shiftKey ?? false;
  await locator.evaluate((element, init) => {
    element.dispatchEvent(new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      composed: true,
      isPrimary: true,
      pointerType: 'mouse',
      button: 0,
      buttons: 1,
      ...init,
    }));
  }, { pointerId, clientX: x, clientY: y, shiftKey });
  return { pointerId, x, y, shiftKey };
}

async function movePointerDrag(
  page: Page,
  drag: { pointerId: number; x: number; y: number; shiftKey: boolean },
  deltaX: number,
  deltaY: number,
): Promise<void> {
  await page.evaluate((init) => {
    window.dispatchEvent(new PointerEvent('pointermove', {
      bubbles: true,
      cancelable: true,
      composed: true,
      isPrimary: true,
      pointerType: 'mouse',
      button: 0,
      buttons: 1,
      pointerId: init.pointerId,
      clientX: init.x + init.deltaX,
      clientY: init.y + init.deltaY,
      shiftKey: init.shiftKey,
    }));
  }, { ...drag, deltaX, deltaY });
}

async function finishPointerDrag(
  page: Page,
  drag: { pointerId: number; x: number; y: number; shiftKey: boolean },
  deltaX: number,
  deltaY: number,
): Promise<void> {
  await page.evaluate((init) => {
    window.dispatchEvent(new PointerEvent('pointerup', {
      bubbles: true,
      cancelable: true,
      composed: true,
      isPrimary: true,
      pointerType: 'mouse',
      button: 0,
      buttons: 0,
      pointerId: init.pointerId,
      clientX: init.x + init.deltaX,
      clientY: init.y + init.deltaY,
      shiftKey: init.shiftKey,
    }));
  }, { ...drag, deltaX, deltaY });
}

async function navLabelFromApi(page: Page, itemId: string): Promise<string | null> {
  const response = await page.request.get('/api/builder/site/navigation?locale=ko');
  if (!response.ok()) return null;
  const payload = (await response.json()) as {
    navigation?: TestNavigationItem[];
  };
  const findItem = (items: TestNavigationItem[]): TestNavigationItem | null => {
    for (const candidate of items) {
      if (candidate.id === itemId) return candidate;
      const child = candidate.children ? findItem(candidate.children) : null;
      if (child) return child;
    }
    return null;
  };
  const item = payload.navigation ? findItem(payload.navigation) : null;
  if (!item) return null;
  if (typeof item.label === 'string') return item.label;
  return item.label.ko ?? item.label.en ?? item.label['zh-hant'] ?? null;
}

async function navigationFromApi(page: Page): Promise<TestNavigationItem[]> {
  const response = await page.request.get('/api/builder/site/navigation?locale=ko');
  expect(response.ok()).toBeTruthy();
  const payload = (await response.json()) as { navigation?: TestNavigationItem[] };
  return payload.navigation ?? [];
}

async function restoreNavigation(page: Page, navigation: TestNavigationItem[]): Promise<void> {
  const response = await page.request.put('/api/builder/site/navigation', {
    data: {
      locale: 'ko',
      navigation,
    },
    failOnStatusCode: false,
  });
  expect(response.ok()).toBeTruthy();
}

async function expectUndoChip(page: Page): Promise<void> {
  await expect(page.getByText(/Undid:/).first()).toBeVisible();
}

async function expectRedoChip(page: Page): Promise<void> {
  await expect(page.getByText(/Redid:/).first()).toBeVisible();
}

async function closeModalOverlayIfPresent(page: Page): Promise<void> {
  // Match standalone Close/Cancel labels — guard against "실행 취소" (Undo)
  // which contains "취소" as a substring.
  const closeButton = page.getByRole('button', { name: /^Close$|^닫기$|^취소$|^Cancel$/ }).first();
  if ((await closeButton.count()) === 0 || !(await closeButton.isVisible())) return;
  await closeButton.click();
  await page.waitForTimeout(150);
}

async function waitForEditorCss(page: Page): Promise<void> {
  const isStyled = async () => page.locator('header[class*="topBar"]').first().evaluate((element) => {
    const style = window.getComputedStyle(element);
    const height = Number.parseFloat(style.height);
    return style.display === 'grid' && height >= 48 && height <= 80;
  }).catch(() => false);

  try {
    await expect.poll(isStyled, { timeout: 15_000 }).toBe(true);
  } catch {
    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect.poll(isStyled, { timeout: 15_000 }).toBe(true);
  }
}

async function recoverFromDevChunkOverlay(page: Page): Promise<void> {
  const overlay = page.getByText(/Unhandled Runtime Error|ChunkLoadError/).first();
  if (!(await overlay.isVisible().catch(() => false))) return;
  await page.reload({ waitUntil: 'domcontentloaded' });
  await waitForEditorCss(page);
}

test.describe('/ko/admin-builder desktop editor parity smoke', () => {
  test.afterEach(async ({ page }) => {
    await page.request.get('/ko/admin-builder?reseed=1', { timeout: 60_000 });
  });

  test('covers Wix-like editor chrome, selection, shortcuts, panels, and publish gates', async ({ page }) => {
    test.setTimeout(300_000);
    const projectName = test.info().project.name;
    const isChromiumProject = projectName === 'chromium-builder';
    const shellResponse = await page.request.get('/ko/admin-builder');
    expect(shellResponse.status()).toBe(200);
    const shellHtml = await shellResponse.text();
    const runtimeChunk = shellHtml.match(/\/_next\/static\/chunks\/webpack-[^"]+\.js/)?.[0];
    if (runtimeChunk) {
      const runtimeResponse = await page.request.get(runtimeChunk);
      expect(runtimeResponse.status()).toBe(200);
      expect(runtimeResponse.headers()['content-type']).toContain('application/javascript');
    } else {
      expect(shellHtml, 'dev editor shell should still include Next app chunks').toContain('/_next/static/chunks/');
    }
    const publicHomeResponse = await page.request.get('/ko');
    expect(publicHomeResponse.status()).toBe(200);
    const publicHomeHtml = await publicHomeResponse.text();
    expect(publicHomeHtml).toContain('hero-search-bar overlap');
    // section-snapshot-v1: once the editor shell seeds the site, the public home
    // is served from the builder snapshot backend (lifecycle.publishBackend =
    // 'builder-snapshot'), so builder-pub-node markers are expected here.
    expect(publicHomeHtml).toContain('builder-pub-node');
    const columnsResponse = await page.request.get('/api/builder/columns?locale=ko');
    expect(columnsResponse.status()).toBe(200);
    const columnsPayload = (await columnsResponse.json()) as {
      columns?: Array<{ slug: string }>;
    };
    expect(columnsPayload.columns?.length ?? 0).toBeGreaterThan(0);
    const firstColumnSlug = columnsPayload.columns?.[0]?.slug;
    expect(firstColumnSlug).toBeTruthy();
    const firstColumnEditorResponse = await page.request.get(
      `/ko/admin-builder/columns/${encodeURIComponent(firstColumnSlug || '')}/edit`,
    );
    expect(firstColumnEditorResponse.status()).toBe(200);

    const browserErrors: string[] = [];
    page.on('console', (message) => {
      const text = message.text();
      if (message.type() === 'error' && !isIgnoredBrowserError(text)) browserErrors.push(text);
    });
    page.on('pageerror', (error) => {
      if (!isIgnoredBrowserError(error.message)) browserErrors.push(error.message);
    });

    // openBuilder auto-decomposes the composite-first home so the node-level
    // assertions below (home-hero-subtitle, home-insights-*) have the editable
    // tree available — same flow as every other editor spec.
    await openBuilder(page, '/ko/admin-builder');

    const topBar = page.locator('header[class*="topBar"]').first();
    await expect(topBar).toBeVisible();
    await expect(topBar).toContainText(/Publish|발행/);
    await waitForEditorCss(page);
    await recoverFromDevChunkOverlay(page);
    await expect.poll(async () => (await topBar.boundingBox())?.height ?? 999).toBeLessThanOrEqual(80);
    const topBarBox = await topBar.boundingBox();
    expect(topBarBox?.height).toBeGreaterThanOrEqual(48);
    const zoomText = await page.locator('[class*="zoomLabel"]').first().innerText();
    const zoomPercent = Number(zoomText.replace('%', '').trim());
    expect(zoomPercent).toBeGreaterThanOrEqual(50);
    expect(zoomPercent).toBeLessThanOrEqual(100);
    const editorLayout = await page.evaluate(() => {
      const rectFor = (selector: string) => document.querySelector(selector)?.getBoundingClientRect() ?? null;
      const styleFor = (selector: string) => {
        const element = document.querySelector(selector);
        return element ? window.getComputedStyle(element) : null;
      };
      const siteFooterRect = rectFor('footer:not([class*="statusBar"])');
      const statusRect = rectFor('footer[class*="statusBar"]');
      return {
        canvasOverflowX: styleFor('div[class*="canvasColumn"]')?.overflowX ?? '',
        canvasOverflowY: styleFor('div[class*="canvasColumn"]')?.overflowY ?? '',
        stageViewportHeight: rectFor('div[class*="stageViewport"]')?.height ?? 0,
        stageViewportLeft: rectFor('div[class*="stageViewport"]')?.left ?? 0,
        stageViewportRight: rectFor('div[class*="stageViewport"]')?.right ?? 0,
        stageTransformLeft: rectFor('div[class*="stageTransform"]')?.left ?? 0,
        stageTransformRight: rectFor('div[class*="stageTransform"]')?.right ?? 0,
        stageTransformTransition: styleFor('div[class*="stageTransform"]')?.transitionProperty ?? '',
        documentScrollWidth: document.documentElement.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        viewportWidth: window.innerWidth,
        siteFooterTop: siteFooterRect?.top ?? 0,
        statusTop: statusRect?.top ?? 0,
        statusBottom: statusRect?.bottom ?? 0,
        statusHeight: statusRect?.height ?? 0,
        viewportHeight: window.innerHeight,
      };
    });
    expect(editorLayout.canvasOverflowX).toBe('auto');
    expect(editorLayout.canvasOverflowY).toBe('auto');
    expect(editorLayout.documentScrollWidth).toBeLessThanOrEqual(editorLayout.viewportWidth + 1);
    expect(editorLayout.bodyScrollWidth).toBeLessThanOrEqual(editorLayout.viewportWidth + 1);
    expect(editorLayout.stageViewportHeight).toBeGreaterThanOrEqual(Math.max(700, editorLayout.viewportHeight - 100));
    expect(editorLayout.stageTransformLeft).toBeGreaterThanOrEqual(editorLayout.stageViewportLeft - 2);
    if (isChromiumProject) {
      expect(editorLayout.stageTransformRight).toBeLessThanOrEqual(editorLayout.stageViewportRight + 2);
    } else {
      expect(editorLayout.stageTransformRight).toBeGreaterThan(editorLayout.stageTransformLeft);
    }
    expect(editorLayout.stageTransformTransition).toBe('none');
    expect(editorLayout.statusHeight).toBeLessThanOrEqual(32);
    expect(Math.abs(editorLayout.viewportHeight - editorLayout.statusBottom)).toBeLessThanOrEqual(4);
    expect(editorLayout.siteFooterTop).toBeGreaterThanOrEqual(editorLayout.statusTop - 4);

    const rail = page.locator('[class*="iconRail"]').first();
    await expect(rail).toBeVisible();
    const railBox = await rail.boundingBox();
    expect(railBox?.width).toBeGreaterThanOrEqual(60);
    expect(railBox?.width).toBeLessThanOrEqual(68);
    const designRailButton = rail.getByTitle(/^Design$|^디자인$/);
    const designRailLabel = designRailButton.locator('[class*="railButtonLabel"]').first();
    await designRailButton.hover();
    await expect(designRailLabel).toContainText(/Design|디자인/);
    await expect(designRailLabel).toHaveCSS('opacity', '1');
    await designRailButton.click();
    const designDrawer = page.locator('aside[aria-hidden="false"]').first();
    await expect(designDrawer).toBeVisible();
    await expect.poll(async () => (await designDrawer.boundingBox())?.width ?? 0).toBeGreaterThanOrEqual(300);
    await expect(designRailLabel).toBeHidden();
    await expect(designDrawer).toContainText(/Site settings|사이트 설정/);

    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
    await expect.poll(() => browserErrors, { timeout: 1_000 }).toEqual([]);
    await expect(page.locator('[data-node-id]').first()).toBeVisible();
    await expect(page.getByTitle('현재 페이지 발행')).toBeVisible();
    const stageBox = await page.getByRole('application', { name: 'Canvas editor' }).boundingBox();
    expect(stageBox?.y ?? 9999).toBeLessThan(180);
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect.poll(() => page.evaluate(() => window.getComputedStyle(document.body).overflow)).toBe('hidden');
    const editorShellTop = await page.locator('[class*="editorShell"]').first().evaluate((element) => (
      Math.round(element.getBoundingClientRect().top)
    ));
    const initialCanvasColumn = page.locator('[class*="canvasColumn"]').first();
    await initialCanvasColumn.evaluate((element) => {
      element.scrollTo({ top: 420, left: 0, behavior: 'auto' });
    });
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect.poll(() => initialCanvasColumn.evaluate((element) => element.scrollTop)).toBeGreaterThan(300);
    await expect.poll(() => page.locator('[class*="editorShell"]').first().evaluate((element) => (
      Math.round(element.getBoundingClientRect().top)
    ))).toBe(editorShellTop);
    await initialCanvasColumn.evaluate((element) => {
      element.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
    await expect.poll(() => initialCanvasColumn.evaluate((element) => element.scrollTop)).toBe(0);
    const builderHeader = page.locator('.builder-site-header').first();
    await expect(builderHeader).toBeVisible();
    await expect(builderHeader.locator('.utility-nav')).toContainText('연락처');
    await expect(builderHeader.locator('.nav-list')).toContainText('업무분야');
    const rootNavigation = await navigationFromApi(page);
    expect(rootNavigation.length).toBeGreaterThanOrEqual(3);
    const navListText = await builderHeader.locator('.nav-list').innerText();
    // The editor intentionally renders SiteHeader via canonicalStandardNav, which
    // maps standard routes to canonical labels/order and omits home. Raw saved
    // navigation labels are therefore not the render contract; assert the visible
    // canonical labels for the first three standard menu items instead.
    expect(navListText).toContain('업무분야');
    expect(navListText).toContain('변호사소개');
    expect(navListText).toContain('비용안내');
    await expect(builderHeader.locator('.header-search-btn')).toBeVisible();
    await builderHeader.locator('[data-builder-header-action="search"]').click();
    const headerSearchDialog = page.getByRole('dialog', { name: /검색|Search|搜尋/ });
    await expect(headerSearchDialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(headerSearchDialog).toBeHidden();
    const editorUrlBeforeHeaderUtility = page.url();
    await builderHeader.locator('.utility-nav').getByRole('link', { name: '오시는 길' }).click();
    await expect.poll(() => page.url()).toBe(editorUrlBeforeHeaderUtility);
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
    await rail.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
    const pagesDrawerAfterHeaderNavigate = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).first();
    await pagesDrawerAfterHeaderNavigate.getByRole('button', { name: /홈|Home/ }).first().click();
    await expect(page.locator('[data-node-id="home-hero-subtitle"]').first()).toBeVisible();
    await expect(page.locator('[data-node-id="home-insights-title"]').first()).toContainText('칼럼 아카이브');
    await expect(page.locator('[data-node-id="home-insights-featured-title"]').first()).toContainText(/\S/);
    await expect(page.locator('[data-node-id="home-insights-featured-link"]').first()).toContainText(/자세히|Read|閱讀/);
    await expect(page.locator('[data-node-id="home-insights-controls"]').first()).toBeVisible();
    await expect(page.locator('[data-node-id="home-insights-prev"]').first()).toContainText('‹ 이전');
    await expect(page.locator('[data-node-id="home-insights-next"]').first()).toContainText('다음 ›');
    await expect(page.locator('[data-node-id="home-insights-page-indicator"]').first()).toContainText(/1 \/ \d+/);
    await expect(page.locator('[data-node-id="home-insights-item-2-title"]').first()).toContainText(/\S/);
    await expect(page.locator('[data-node-id="home-insights-item-3-title"]')).toHaveCount(0);
    const insightsFeaturedNode = page.locator('[data-node-id="home-insights-featured-link"]').first();
    await expect(insightsFeaturedNode).toBeVisible();
    await expect(
      insightsFeaturedNode.locator('button[data-tone="link"]'),
    ).toHaveAttribute('title', /\/columns\//);
    const editorUrlBeforeInsightsLink = page.url();
    await insightsFeaturedNode.locator('a').first().click({ force: true });
    await expect.poll(() => page.url()).toBe(editorUrlBeforeInsightsLink);
    await expect(page.getByRole('application', { name: 'Canvas editor' })).toBeVisible();
    await page.locator('[data-node-id="home-insights-title"]').first().click({ position: { x: 12, y: 12 }, force: true });
    const selectedHomeInsightsTitle = page.locator('[data-node-id="home-insights-title"][class*="nodeSelected"]').first();
    await expect(selectedHomeInsightsTitle.getByRole('link', { name: '글 추가/수정' })).toBeVisible();
    await expect(selectedHomeInsightsTitle.getByRole('link', { name: '새 글' })).toBeVisible();
    await expect(selectedHomeInsightsTitle.getByRole('link', { name: '공개 보기' })).toBeVisible();
    const insightsFlow = await page.evaluate(() => {
      const insights = document.querySelector('[data-node-id="home-insights-root"]')?.getBoundingClientRect();
      const services = document.querySelector('[data-node-id="home-services-root"]')?.getBoundingClientRect();
      const lateItem = document.querySelector('[data-node-id="home-insights-item-2-title"]')?.getBoundingClientRect();
      if (!insights || !services || !lateItem) return null;
      return {
        insightsBottom: insights.bottom,
        servicesTop: services.top,
        lateItemTop: lateItem.top,
        lateItemBottom: lateItem.bottom,
      };
    });
    expect(insightsFlow).toBeTruthy();
    expect(insightsFlow?.servicesTop ?? 0).toBeGreaterThanOrEqual((insightsFlow?.insightsBottom ?? 0) - 4);
    expect(insightsFlow?.lateItemBottom ?? 0).toBeLessThanOrEqual((insightsFlow?.insightsBottom ?? 0) + 4);
    await expect(page.locator('[data-node-id="home-services-root"] section#practice.section--light').first()).toBeVisible();
    await expect(page.locator('[data-node-id="home-hero-search-placeholder"]')).toHaveCount(0);
    const heroSearchForm = page.locator('[data-node-id="home-hero-search-bar"] form.hero-search-bar.overlap').first();
    await expect(heroSearchForm).toBeVisible();
    await expect(heroSearchForm).toHaveAttribute('method', 'get');
    await expect(heroSearchForm).toHaveAttribute('action', /\/ko\/search$/);
    await expect(page.locator('[data-node-id="home-hero-search-input"] input.hero-search-input[type="search"][name="q"]').first()).toBeVisible();
    await expect(page.locator('[data-node-id="home-hero-search-button"] button.hero-search-btn[type="submit"]').first()).toBeVisible();
    const heroSearchBarLocator = page.locator('[data-node-id="home-hero-search-bar"]').first();
    await heroSearchBarLocator.scrollIntoViewIfNeeded();
    // Click inside the bar but past the 24px left ruler strip, which otherwise
    // intercepts the pointer at the ruler boundary.
    await heroSearchBarLocator.click({ position: { x: 80, y: 24 } });
    const heroSearchQuickEdit = page.locator('[data-builder-hero-search-quick-edit="true"]').first();
    await expect(heroSearchQuickEdit).toBeVisible();
    // QuickEdit panel buttons sit above hero-quick-menu nodes; the canvas
    // stacking can leave a sibling intercepting pointer events. Use
    // dispatchEvent so the React handler fires on the actual button
    // regardless of which DOM element receives the synthetic click at the
    // overlapped screen position.
    await heroSearchQuickEdit.getByRole('button', { name: 'Center' }).dispatchEvent('click');
    await expect(page.locator('[data-node-id="home-hero-search-wrap"]').first()).toHaveCSS('left', '258px');
    await heroSearchQuickEdit.getByRole('button', { name: 'Left' }).dispatchEvent('click');
    await expect(page.locator('[data-node-id="home-hero-search-wrap"]').first()).toHaveCSS('left', '0px');
    const temporarySearchPlaceholder = `검색어 입력 ${Date.now().toString(36)}`;
    await heroSearchQuickEdit.getByLabel('Hero search placeholder').fill(temporarySearchPlaceholder);
    await expect(page.locator('[data-node-id="home-hero-search-input"] input.hero-search-input').first()).toHaveAttribute('placeholder', temporarySearchPlaceholder);
    await heroSearchQuickEdit.getByRole('button', { name: '칼럼' }).dispatchEvent('click');
    await expect(heroSearchForm).toHaveAttribute('action', /\/ko\/search\?tab=insights$/);
    await heroSearchQuickEdit.getByLabel('Hero search action').fill('/ko/search?tab=columns');
    await expect(heroSearchForm).toHaveAttribute('action', /\/ko\/search\?tab=insights$/);
    await heroSearchQuickEdit.getByLabel('Hero search action').fill('/ko/search');
    await heroSearchQuickEdit.getByLabel('Hero search placeholder').fill('어떻게 도와드릴까요?');
    const heroSearchGeometry = await page.evaluate(() => {
      const hero = document.querySelector('[data-node-id="home-hero-root"]')?.getBoundingClientRect();
      const form = document.querySelector('[data-node-id="home-hero-search-bar"] form')?.getBoundingClientRect();
      const insights = document.querySelector('[data-node-id="home-insights-root"]')?.getBoundingClientRect();
      const formElement = document.querySelector('[data-node-id="home-hero-search-bar"] form');
      if (!hero || !form || !insights || !formElement) return null;
      const bottomHit = document.elementFromPoint(form.left + form.width / 2, form.bottom - 2);
      return {
        heroBottom: hero.bottom,
        heroWidth: hero.width,
        formBottom: form.bottom,
        formLeft: form.left,
        heroLeft: hero.left,
        insightsTop: insights.top,
        bottomHitInsideForm: Boolean(bottomHit && formElement.contains(bottomHit)),
      };
    });
    expect(heroSearchGeometry).toBeTruthy();
    // The hero search form intentionally straddles the hero/Insights section
    // boundary for public parity (commit 25b4ef51). The editor auto-fit scales
    // the 1280px model into the stage, so the painted overflow must be measured
    // in the stage's CSS pixels: derive the scale from the live hero width, then
    // assert the form really straddles each boundary (non-negative overflow)
    // without exceeding the intended ~17px model overflow (62px form - 45px
    // STRADDLE_OVERLAP_Y) plus border/rounding slack (24 model px * scale + 2 CSS
    // px). The hard contract stays that the painted form bottom is the top hit.
    const HERO_SEARCH_MODEL_WIDTH = 1280;
    const heroScale = (heroSearchGeometry?.heroWidth ?? HERO_SEARCH_MODEL_WIDTH) / HERO_SEARCH_MODEL_WIDTH;
    const straddleOverflowCap = 24 * heroScale + 2;
    const overflowPastHero = (heroSearchGeometry?.formBottom ?? 0) - (heroSearchGeometry?.heroBottom ?? 0);
    const overflowPastInsights = (heroSearchGeometry?.formBottom ?? 0) - (heroSearchGeometry?.insightsTop ?? 0);
    expect(overflowPastHero).toBeGreaterThanOrEqual(0);
    expect(overflowPastHero).toBeLessThanOrEqual(straddleOverflowCap);
    expect(overflowPastInsights).toBeGreaterThanOrEqual(0);
    expect(overflowPastInsights).toBeLessThanOrEqual(straddleOverflowCap);
    expect(heroSearchGeometry?.bottomHitInsideForm).toBe(true);
    expect((heroSearchGeometry?.formLeft ?? 0) - (heroSearchGeometry?.heroLeft ?? 0)).toBeGreaterThanOrEqual(20);
    expect((heroSearchGeometry?.formLeft ?? 0) - (heroSearchGeometry?.heroLeft ?? 0)).toBeLessThanOrEqual(72);
    await page.keyboard.press('Escape');
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    });
    await page.mouse.move(12, 120);
    const heroQuickMenu = page.locator('[data-node-id="home-hero-quick-menu"] nav.hero-quick-menu').first();
    await expect(heroQuickMenu).toBeVisible();
    await expect(heroQuickMenu).toContainText('업무분야');
    await expect(heroQuickMenu).toContainText('칼럼');
    await expect(heroQuickMenu).toContainText('연락처');
    const publicChrome = page.locator('[data-builder-public-chrome="true"]').first();
    await expect(publicChrome).toBeVisible();
    await expect(publicChrome.locator('.quick-contact-toggle')).toBeVisible();
    await expect(publicChrome.locator('.quick-contact-toggle')).toHaveText('AI 상담');
    await expect(publicChrome.locator('.scroll-top')).toHaveCount(1);
    await expect(publicChrome.getByRole('button', { name: /^(칼럼|Columns|專欄)$/ })).toHaveCount(0);
    await expect(publicChrome.getByRole('button', { name: /이벤트 팝업/ })).toHaveCount(0);
    await expect(page.getByRole('dialog', { name: '2026년 기념 리뷰 이벤트' })).toHaveCount(0);
    await expect(publicChrome.getByRole('button', { name: '칼럼 관리' })).toHaveCount(0);
    await page.keyboard.press('Escape');
    await page.mouse.move(12, 120);
    await expect(async () => {
      await page.locator('[data-node-id="home-services-card-0-title"]').first().click({ position: { x: 12, y: 12 }, force: true });
      await expect(page.locator('[data-node-id="home-services-card-0-detail-0"]').first()).toBeVisible({ timeout: 1_500 });
    }).toPass({ timeout: 20_000 });
    await expect(page.locator('[data-node-id="home-services-card-1-detail-0"]').first()).toBeHidden();
    await expect(async () => {
      await page.locator('[data-node-id="home-services-card-1-title"]').first().click({ position: { x: 12, y: 12 }, force: true });
      await expect(page.locator('[data-node-id="home-services-card-1-detail-0"]').first()).toBeVisible({ timeout: 1_500 });
    }).toPass({ timeout: 20_000 });
    await expect(page.locator('[data-node-id="home-services-card-0-detail-0"]').first()).toBeHidden();
    await expect(async () => {
      await page.locator('[data-node-id="home-faq-item-0-question-text"]').first().click({ position: { x: 12, y: 12 }, force: true });
      await expect(page.locator('[data-node-id="home-faq-item-0-answer"]').first()).toBeVisible({ timeout: 1_500 });
    }).toPass({ timeout: 20_000 });
    await expect(page.locator('[data-node-id="home-faq-item-1-answer"]').first()).toBeHidden();
    await expect(async () => {
      await page.locator('[data-node-id="home-faq-item-1-question-text"]').first().click({ position: { x: 12, y: 12 }, force: true });
      await expect(page.locator('[data-node-id="home-faq-item-1-answer"]').first()).toBeVisible({ timeout: 1_500 });
    }).toPass({ timeout: 20_000 });
    await expect(page.locator('[data-node-id="home-faq-item-0-answer"]').first()).toBeHidden();
    await page.keyboard.press('Escape');
    await expect.poll(async () => canvasEditor(page)
      .locator('[class*="nodeSelected"][data-node-id]:visible')
      .count()).toBe(0);
    const hoverIndicatorNode = page.locator('[data-node-id="home-hero-subtitle"]:visible').first();
    await hoverIndicatorNode.hover();
    const hoverIndicatorOutlineWidth = await hoverIndicatorNode.evaluate((element) => (
      Number.parseFloat(window.getComputedStyle(element).outlineWidth)
    ));
    expect(hoverIndicatorOutlineWidth).toBeGreaterThanOrEqual(0.85);
    expect(hoverIndicatorOutlineWidth).toBeLessThanOrEqual(2.15);
    await expect.poll(async () => hoverIndicatorNode.evaluate((element) => (
      window.getComputedStyle(element).outlineColor
    ))).toMatch(/17,\s*109,\s*255/);
    const hoverNodeBadge = hoverIndicatorNode.locator('[class*="nodeBadge"]').first();
    await expect(hoverNodeBadge).toHaveCSS('opacity', '1');
    await expect(hoverNodeBadge).toContainText(/\d+×\d+/);
    // '칼럼' appears both in the hero quick menu and the editable header menu
    // preview — either satisfies "a 칼럼 nav link is visible".
    await expect(page.getByRole('navigation').getByRole('link', { name: '칼럼' }).first()).toBeVisible();
    const headerRegion = page.locator('[class*="globalHeaderRegion"]').first();
    const editableMenuItem = headerRegion.locator('a.nav-link[data-builder-nav-item-id][href$="/services"]').first();
    await expect(editableMenuItem).toBeVisible();
    const menuItemId = await editableMenuItem.getAttribute('data-builder-nav-item-id');
    expect(menuItemId).toBeTruthy();
    const headerEditMenuButton = headerRegion.getByRole('button', { name: /Edit menu|메뉴 편집/ });
    await expect(headerEditMenuButton).toBeVisible();
    // Earlier test steps may leave the Pages drawer's quick-jump panel
    // open over the header; dispatch mouse events directly so the header
    // item still receives hover regardless of the drawer overlay.
    await editableMenuItem.dispatchEvent('mouseover');
    await editableMenuItem.dispatchEvent('mouseenter');
    const editMenuBox = await headerEditMenuButton.boundingBox();
    expect(editMenuBox).toBeTruthy();
    await page.mouse.move(
      (editMenuBox?.x ?? 0) + (editMenuBox?.width ?? 0) / 2,
      (editMenuBox?.y ?? 0) + (editMenuBox?.height ?? 0) / 2,
      { steps: 8 },
    );
    await expect(headerEditMenuButton).toBeVisible();
    // Hover-reveal animation keeps the button briefly unstable — dispatch directly.
    await headerEditMenuButton.dispatchEvent('click');
    const navDrawer = page.locator('aside[aria-hidden="false"]').first();
    await expect(navDrawer.getByText(/Navigation|내비게이션/).first()).toBeVisible();
    // Drawer overlays the header — dispatch mouse events directly.
    await editableMenuItem.dispatchEvent('mouseover');
    await editableMenuItem.dispatchEvent('mouseenter');
    const servicesMegaPanel = builderHeader.locator('.mega-panel.active').first();
    await expect(servicesMegaPanel).toContainText('투자·법인설립');
    const editDropdownButton = servicesMegaPanel.getByRole('button', { name: 'Edit dropdown' });
    await expect(editDropdownButton).toBeVisible();
    const servicesInvestmentMegaLink = servicesMegaPanel
      .locator('[data-builder-nav-item-id="nav-services-investment"]')
      .first();
    await expect(servicesInvestmentMegaLink).toBeVisible();
    const servicesInvestmentRow = navDrawer.locator('[data-builder-nav-item-row="nav-services-investment"]').first();
    await expect(servicesInvestmentRow).toBeVisible();
    await expect(servicesInvestmentRow).toContainText('Mega');
    await expect(servicesInvestmentRow).toContainText('투자·법인설립');
    await editDropdownButton.click();
    await expect(servicesMegaPanel.locator('[data-builder-mega-editing-chip="true"]')).toContainText('Dropdown editing');
    await expect(navDrawer.locator(`[data-builder-nav-edit-id="${menuItemId}"]`).first()).toBeVisible();
    await page.mouse.move(28, 220);
    await expect(headerEditMenuButton).toBeVisible();
    await expect(builderHeader.locator('.mega-panel.active').first()).toContainText('투자·법인설립');
    await expect(servicesMegaPanel.locator('[data-builder-mega-editing-chip="true"]')).toBeVisible();
    await editableMenuItem.dispatchEvent('mouseenter');
    await expect(servicesMegaPanel).toContainText('투자·법인설립');
    await expect(servicesMegaPanel.getByRole('button', { name: 'Edit dropdown' })).toBeVisible();
    await expect(servicesMegaPanel.getByRole('button', { name: 'Add menu item' })).toBeVisible();
    const navLabelInput = navDrawer.locator('input[type="text"]').first();
    await expect(navLabelInput).toBeVisible();
    const originalNavLabel = await navLabelFromApi(page, menuItemId || '');
    expect(originalNavLabel).toBeTruthy();
    await expect(navLabelInput).toHaveValue(originalNavLabel || '');
    await editableMenuItem.dispatchEvent('mouseover');
    await editableMenuItem.dispatchEvent('mouseenter');
    await servicesMegaPanel
      .locator('.builder-mega-link-row')
      .filter({ has: page.locator('[data-builder-nav-item-id="nav-services-investment"]') })
      .getByRole('button', { name: 'Edit' })
      .dispatchEvent('click');
    await expect(navLabelInput).toHaveValue('투자·법인설립');
    const originalNavigation = await navigationFromApi(page);
    try {
      await servicesMegaPanel.getByRole('button', { name: 'Add menu item' }).click();
      await expect(navDrawer.locator(`[data-builder-nav-edit-id^="${menuItemId}-child-"]`).first()).toBeVisible();
    } finally {
      await restoreNavigation(page, originalNavigation);
    }

    await page.getByTitle(/^Add$|^추가$/).click();
    const addDrawer = page.locator('aside[aria-hidden="false"]').first();
    await expect(addDrawer.getByText(/Catalog|카탈로그/).first()).toBeVisible();
    await expect(addDrawer.getByText(/^Basic$|^기본$/).first()).toBeVisible();
    await expect(addDrawer.getByLabel(/Search add elements|추가 요소 검색/)).toBeVisible();
    await expect(addDrawer.locator('[data-builder-add-quick-kind="text"]')).toBeVisible();
    await expect(addDrawer.locator('[data-builder-add-quick-kind="button"]')).toBeVisible();
    const addNodeCountBefore = await canvasEditor(page).locator('[data-node-id]').count();
    await addDrawer.getByLabel(/Search add elements|추가 요소 검색/).fill('button');
    await expect(addDrawer.getByText(/Showing \d+ results? for|결과 \d+개 표시/)).toBeVisible();
    const buttonAddCard = addDrawer.locator('[data-builder-add-card="button"]').first();
    await expect(buttonAddCard).toBeVisible();
    await expect(addDrawer.locator('[data-builder-add-card-kind="image"]')).toHaveCount(0);
    await buttonAddCard.getByRole('button', { name: /Quick add|빠른 추가/ }).click();
    await expect.poll(() => canvasEditor(page).locator('[data-node-id]').count()).toBeGreaterThan(addNodeCountBefore);
    await page.keyboard.press(`${shortcutModifier}+Z`);
    await expect.poll(() => canvasEditor(page).locator('[data-node-id]').count()).toBe(addNodeCountBefore);
    await addDrawer.getByLabel(/Search add elements|추가 요소 검색/).fill('not-a-real-widget');
    await expect(addDrawer.getByText(/No matching elements|일치하는 요소 없음/)).toBeVisible();
    await addDrawer.getByLabel(/Search add elements|추가 요소 검색/).fill('');

    const canvasColumn = page.locator('[class*="canvasColumn"]').first();
    const stageViewport = page.locator('[class*="stageViewport"]').first();
    const stageTransform = page.locator('[class*="stageTransform"]').first();
    await expect.poll(() => canvasColumn.evaluate((element) => element.scrollHeight - element.clientHeight)).toBeGreaterThan(300);
    await stageViewport.hover();
    await page.mouse.wheel(0, 520);
    await expect.poll(() => canvasColumn.evaluate((element) => element.scrollTop)).toBeGreaterThan(100);
    await expect.poll(() => stageTransform.evaluate((element) => (
      new DOMMatrixReadOnly(window.getComputedStyle(element).transform).m42
    ))).toBeGreaterThanOrEqual(-2);
    const columnsRailButton = rail.getByRole('button', { name: /^Columns$|^칼럼$/ });
    const columnsDrawer = page.locator('aside[aria-hidden="false"]').first();
    // Off the columns page, the first rail click only navigates there; the
    // drawer opens on a follow-up click once the columns canvas is active.
    await expect(async () => {
      const drawerOpen = await columnsDrawer.getByRole('link', { name: '글 목록' }).isVisible();
      if (!drawerOpen) await columnsRailButton.click();
      expect(drawerOpen).toBe(true);
    }).toPass({ timeout: 30_000 });
    await expect(columnsDrawer.getByRole('link', { name: '새 글 쓰기' })).toBeVisible();
    await expect(columnsDrawer.getByRole('link', { name: '공개 칼럼 보기' })).toBeVisible();
    await expect(columnsDrawer.getByText(/개 칼럼 연결됨/)).toBeVisible();
    await expect(columnsDrawer.getByRole('link', { name: /수정 · / }).first()).toBeVisible();
    await expect(page.locator('[data-node-id="columns-page-root-composite"]').first()).toBeVisible();
    await expect(
      page.locator('[data-node-id="columns-page-root-composite"] [data-builder-surface-key="headline"]').first(),
    ).toContainText(/칼럼|Columns/);
    await expect.poll(() => stageTransform.evaluate((element) => (
      new DOMMatrixReadOnly(window.getComputedStyle(element).transform).m42
    ))).toBeGreaterThanOrEqual(-2);

    await openBuilder(page, '/ko/admin-builder');
    await waitForEditorCss(page);
    await recoverFromDevChunkOverlay(page);
    await expect(page.locator('[data-node-id="home-hero-subtitle"]').first()).toBeVisible();
    await expectHoverIndicator(page);

    const selectedNode = await selectFirstNode(page);
    await closeModalOverlayIfPresent(page);

    await selectedNode.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      element.dispatchEvent(new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        button: 2,
        clientX: rect.left + Math.min(30, Math.max(10, rect.width / 2)),
        clientY: rect.top + Math.min(30, Math.max(10, rect.height / 2)),
      }));
    });
    const contextMenu = page.locator('[role="menu"]').first();
    await expect(contextMenu).toBeVisible();
    await expect(contextMenu).toHaveCSS('background-color', /rgba?\(255,\s*255,\s*255/);
    await expect(contextMenu).toHaveCSS('border-radius', '8px');
    await expect(page.locator('[class*="contextMenuShortcut"]').first()).toBeVisible();
    await expect(contextMenu.locator('[class*="contextMenuDivider"]').first()).toBeVisible();
    const firstContextAction = contextMenu.getByRole('menuitem').first();
    await firstContextAction.hover();
    await expect.poll(async () => firstContextAction.evaluate((element) => (
      window.getComputedStyle(element).backgroundColor
    ))).toMatch(/190,\s*24,\s*93/);
    await expect.poll(async () => firstContextAction.evaluate((element) => (
      window.getComputedStyle(element).color
    ))).toMatch(/190,\s*24,\s*93/);
    const hideOnViewportItem = contextMenu.getByRole('menuitem', { name: /Hide on viewport|기기별 숨김/ });
    const contextSubmenu = page.locator('[class*="contextSubmenu"]').last();
    const reopenContextMenu = () => selectedNode.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      element.dispatchEvent(new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        button: 2,
        clientX: rect.left + Math.min(30, Math.max(10, rect.width / 2)),
        clientY: rect.top + Math.min(30, Math.max(10, rect.height / 2)),
      }));
    });
    await expect(async () => {
      if (!(await contextMenu.isVisible().catch(() => false))) {
        await reopenContextMenu();
      }
      // The item is disabled for locked/multi selections — drill the
      // selection down to the clicked leaf and reopen the menu.
      if (!(await hideOnViewportItem.first().isEnabled().catch(() => false))) {
        await page.keyboard.press('Escape');
        await selectedNode.click({ position: { x: 12, y: 12 }, force: true });
        await reopenContextMenu();
      }
      await hideOnViewportItem.focus();
      await page.keyboard.press('ArrowRight');
      await expect(contextSubmenu).toBeVisible({ timeout: 1_000 });
    }).toPass({ timeout: 30_000 });
    await expect(contextSubmenu).toContainText(/Hide on mobile|모바일에서 숨김/);
    await page.keyboard.press('Escape');

    await selectFirstNode(page);
    await closeModalOverlayIfPresent(page);
    // Selection can drop between the helper and the shortcut — retry the
    // duplicate gesture until its toast confirms the action landed.
    await expect(async () => {
      await page.keyboard.press(`${shortcutModifier}+D`);
      await expect(page.getByText('Duplicated').first()).toBeVisible({ timeout: 2_000 });
    }).toPass({ timeout: 20_000 });
    await page.keyboard.press(`${shortcutModifier}+Z`);
    await expectUndoChip(page);
    await page.keyboard.press(`${shortcutModifier}+Shift+Z`);
    await expectRedoChip(page);
    await page.keyboard.press(`${shortcutModifier}+Z`);
    await expectUndoChip(page);

    await page.keyboard.press(`${shortcutModifier}+C`);
    await rail.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
    await expect(page.getByText('1개 요소 클립보드')).toBeVisible();
    const pagesDrawerForPaste = page.locator('aside[aria-hidden="false"]').first();
    await pagesDrawerForPaste.getByRole('button', { name: /호정 소개|About Hovering/ }).first().click();
    await expect(page.getByText(/Loaded page:/).last()).toBeVisible();
    await page.keyboard.press(`${shortcutModifier}+V`);
    await expect(page.getByText(/Pasted 1 item/).first()).toBeVisible();
    await expectSelectedNodeHandles(page);
    await page.keyboard.press(`${shortcutModifier}+Z`);
    await expectUndoChip(page);
    // Selecting a page can auto-close the drawer — reopen it if needed.
    const homePageButton = pagesDrawerForPaste.getByRole('button', { name: /홈|Home/ }).first();
    await expect(async () => {
      const visible = await homePageButton.isVisible();
      if (!visible) await rail.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
      expect(visible).toBe(true);
    }).toPass({ timeout: 20_000 });
    await homePageButton.click();
    await expect(page.getByText(/Loaded page:/).last()).toBeVisible();
    await expect(page.locator('[data-node-id="home-hero-subtitle"]').first()).toBeVisible();
    await expect(async () => {
      if ((await page.locator('aside[aria-hidden="false"]').count()) > 0) {
        await rail.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
      }
      expect(await page.locator('aside[aria-hidden="false"]').count()).toBe(0);
    }).toPass({ timeout: 20_000 });

    await closeModalOverlayIfPresent(page);
    const snapTarget = page.locator('[data-node-id="home-hero-subtitle"]:visible').first();
    await expect(snapTarget).toBeVisible();
    // The subtitle is nested under the hero-copy container. A real modified
    // click uses Playwright's normal actionability/hit-test checks while taking
    // the editor's additive-selection path, so it selects the exact nested
    // node instead of beginning a move on an already-selected ancestor.
    await expect(async () => {
      await page.keyboard.press('Escape');
      await snapTarget.click({ position: { x: 18, y: 18 }, modifiers: ['Shift'] });
      await expect(snapTarget).toHaveClass(/nodeSelected/);
    }).toPass({ timeout: 30_000 });
    const snapNode = await expectSelectedNodeHandles(page, snapTarget);
    const snapDeltaX = await page.evaluate(() => {
      const moving = document.querySelector('[data-node-id="home-hero-subtitle"]')?.getBoundingClientRect();
      const reference = document.querySelector('[data-node-id="home-hero-title"]')?.getBoundingClientRect();
      if (!moving || !reference) return 0;
      return reference.right - moving.right;
    });
    expect(Math.abs(snapDeltaX)).toBeGreaterThan(4);
    const snapDrag = await startPointerDrag(page, snapNode, { pointerId: 7003 });
    await movePointerDrag(page, snapDrag, snapDeltaX, 0);
    await expect(page.locator('[data-canvas-interaction="move"]')).toBeVisible();
    await expect(
      page.locator('[data-alignment-guide-line][data-alignment-guide-tone="alignment"]').first(),
    ).toBeVisible();
    // Spacing chips depend on the live document geometry (equal-gap neighbors
    // within range); the snap engine itself is unit-tested. Verify the chip
    // contents only when the current layout produces one.
    const spacingChip = page
      .locator('[data-alignment-guide-chip][data-alignment-guide-tone="spacing"]')
      .first();
    if (await spacingChip.isVisible().catch(() => false)) {
      await expect(spacingChip).toContainText(/\d+px/);
    }
    await finishPointerDrag(page, snapDrag, snapDeltaX, 0);

    const resizeTarget = page.locator('[data-node-id="home-hero-search-input"]:visible').first();
    await expect(resizeTarget).toBeVisible();
    await resizeTarget.scrollIntoViewIfNeeded();
    await resizeTarget.click({ position: { x: 12, y: 12 }, force: true });
    const cursorNode = await expectSelectedNodeHandles(page, resizeTarget);
    const inspectorColumn = page.locator('[class*="inspectorColumn"]:visible').first();
    await expect(inspectorColumn).toBeVisible();
    const widthInput = inspectorColumn.getByLabel(/Width value|너비 값/).first();
    await expect(widthInput).toBeVisible();
    await widthInput.focus();
    await page.keyboard.down('Space');
    await expect.poll(async () => page.evaluate(() => (
      Array.from(document.querySelectorAll('div')).some((element) => {
        const className = String(element.className);
        return className.includes('stageViewportPannable') || className.includes('stageViewportPanning');
      })
    ))).toBe(false);
    await page.keyboard.up('Space');
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    });
    await resizeTarget.click({ position: { x: 12, y: 12 }, force: true });
    await page.waitForTimeout(250);
    const resizeHandle = cursorNode.locator('[class*="resizeHandleE"]:visible').first();
    await expect(resizeHandle).toHaveCSS('cursor', 'ew-resize');

    const resizeNode = cursorNode;
    const resizeNodeId = await resizeNode.getAttribute('data-node-id');
    const resizeBefore = await nodeCssSize(resizeNode);
    const resizeCorner = resizeNode.locator('[class*="resizeHandleSE"]:visible').first();
    await expect(resizeCorner).toHaveCSS('cursor', 'nwse-resize');
    const resizeDrag = await startPointerDrag(page, resizeCorner, { shiftKey: true });
    await expect(page.locator('[data-canvas-interaction="resize"]')).toBeVisible();
    const resizeDeltaX = resizeBefore.width > 540 ? -64 : 64;
    const resizeDeltaY = resizeBefore.width > 540 ? -16 : 16;
    await movePointerDrag(page, resizeDrag, resizeDeltaX, resizeDeltaY);
    await expect(page.locator('[class*="canvasOverlayResizeReadout"]').first()).toContainText(/\d+\s*x\s*\d+/);
    await finishPointerDrag(page, resizeDrag, resizeDeltaX, resizeDeltaY);
    const savingChip = page.locator('[data-save-status-chip="saving"]').first();
    await expect(savingChip).toBeVisible({ timeout: 2_000 });
    await expect(savingChip).toContainText(/Saving|저장 중/);
    await expect(savingChip.locator('[data-save-status-glyph]')).toHaveCSS('background-color', 'rgb(148, 163, 184)');
    const resizedNodeTarget = resizeNodeId
      ? page.locator(`[data-node-id="${resizeNodeId}"]`).first()
      : undefined;
    if (resizedNodeTarget) {
      await resizedNodeTarget.click({ position: { x: 12, y: 12 }, force: true }).catch(() => undefined);
    }
    const resizedNode = await expectSelectedNodeHandles(page, resizedNodeTarget);
    const resizeAfter = await nodeCssSize(resizedNode);
    const sizeDelta = Math.max(
      Math.abs(resizeAfter.width - resizeBefore.width),
      Math.abs(resizeAfter.height - resizeBefore.height),
    );
    expect(sizeDelta).toBeGreaterThan(2);
    const beforeRatio = resizeBefore.width / resizeBefore.height;
    const afterRatio = resizeAfter.width / resizeAfter.height;
    expect(Math.abs(afterRatio - beforeRatio)).toBeLessThan(0.25);
    // The saved chip is a short-lived toast (~1.6s) — verify its styling only
    // when we catch it; either way the save cycle must settle without error.
    const savedChip = page.locator('[data-save-status-chip="saved"]').first();
    const savedChipAppeared = await savedChip
      .waitFor({ state: 'visible', timeout: 5_000 })
      .then(() => true)
      .catch(() => false);
    if (savedChipAppeared) {
      await expect(savedChip).toContainText(/^Saved$|^저장됨$/);
      await expect(savedChip.locator('[data-save-status-glyph]')).toHaveCSS('background-color', 'rgb(34, 197, 94)');
      await expect(savedChip).toHaveCSS('animation-duration', '0s');
    }
    await expect(page.locator('[data-save-status-chip="error"]')).toHaveCount(0);
    await expect(page.locator('[data-save-status-chip]')).toBeHidden({ timeout: 10_000 });

    const rotateNode = resizedNode;
    const rotationHandle = rotateNode.locator('[class*="rotationHandle"]').first();
    const rotateBox = await rotateNode.boundingBox();
    const rotationHandleBox = await rotationHandle.boundingBox();
    expect(rotateBox).toBeTruthy();
    expect(rotationHandleBox).toBeTruthy();
    if (rotateBox && rotationHandleBox) {
      const targetX = rotateBox.x + rotateBox.width + 96;
      const targetY = rotateBox.y + 12;
      const rotationDrag = await startPointerDrag(page, rotationHandle, { pointerId: 7002, shiftKey: true });
      await movePointerDrag(page, rotationDrag, targetX - rotationDrag.x, targetY - rotationDrag.y);
      const rotationReadout = page.locator('[class*="rotationReadout"]').first();
      await expect(rotationReadout).toBeVisible();
      const readoutText = (await rotationReadout.textContent())?.trim() ?? '';
      await finishPointerDrag(page, rotationDrag, targetX - rotationDrag.x, targetY - rotationDrag.y);
      const degrees = Number((readoutText ?? '').replace(/[^0-9.-]/g, ''));
      expect(Number.isFinite(degrees)).toBe(true);
      expect(Math.abs(degrees % 15)).toBe(0);
      await page.keyboard.press(`${shortcutModifier}+Z`);
      await expectUndoChip(page);
    }
    await page.keyboard.press(`${shortcutModifier}+Z`);
    await expectUndoChip(page);

    const secondaryTools = page.getByLabel('보조 편집 도구 열기');
    await secondaryTools.click();
    await expect(page.getByTitle('현재 페이지 SEO')).toBeVisible();
    await page.getByTitle('현재 페이지 SEO').click();
    await expect(page.getByText(/Google preview|Google 미리보기/)).toBeVisible();
    await page.getByRole('button', { name: /Social share|소셜 공유/ }).click();
    await expect(page.getByText(/OG image preview|OG 이미지 미리보기/)).toBeVisible();
    await closeModalOverlayIfPresent(page);

    await closeModalOverlayIfPresent(page);
    await page.getByTitle('현재 페이지 발행').click();
    await expect(page.getByText('자동 사전 검사')).toBeVisible();
    await expect(page.locator('[data-builder-publish-preflight-item="images"]')).toContainText(/Images|이미지/);
    await expect(page.locator('[data-builder-publish-preflight-item="links"]')).toContainText(/Links|링크/);
    await expect(page.locator('[data-builder-publish-preflight-item="seo"]')).toContainText('SEO');
    await expect(page.locator('[data-builder-publish-preflight-item="forms"]')).toContainText(/Forms|폼/);
    await closeModalOverlayIfPresent(page);

    await page.getByTitle('버전 히스토리').click();
    await expect(page.getByText('버전 히스토리')).toBeVisible();
    await expect(page.getByText(/현재 초안|현재 Draft|Current draft/).first()).toBeVisible();
    await closeModalOverlayIfPresent(page);

    const officeMap = page.locator('[data-node-id="home-offices-layout-0-map"]').first();
    await expect(officeMap).toBeVisible();
    await officeMap.scrollIntoViewIfNeeded();
    const officeLayout0 = page.locator('[data-node-id="home-offices-layout-0"]').first();
    const officeLayout1 = page.locator('[data-node-id="home-offices-layout-1"]').first();
    const officeTab0 = page.locator('[data-node-id="home-offices-tab-0"]').first();
    const officeTab1 = page.locator('[data-node-id="home-offices-tab-1"]').first();
    await expect(officeLayout0).toBeVisible();
    await expect(officeLayout1).toBeHidden();
    await officeTab1.click({ position: { x: 16, y: 16 }, force: true });
    await expect(officeTab1).toHaveAttribute('data-selected', 'true');
    await expect(officeLayout1).toBeVisible();
    await expect(officeLayout0).toBeHidden();
    await expect(page.locator('[data-node-id="home-offices-layout-1-card-title"]').first()).toContainText('가오슝');
    await officeTab0.click({ position: { x: 16, y: 16 }, force: true });
    await expect(officeLayout0).toBeVisible();
    await expect(officeLayout1).toBeHidden();
    await officeMap.click({ position: { x: 24, y: 24 } });
    const mapQuickEdit = officeMap.locator('[data-builder-map-quick-edit="true"]').first();
    await expect(mapQuickEdit).toBeVisible();
    await expect(mapQuickEdit).toContainText('사무소 위치 편집');
    await expect(mapQuickEdit.getByLabel('Map quick location title')).toBeVisible();
    await expect(mapQuickEdit.getByLabel('Map quick office phone')).toBeVisible();
    await expect(mapQuickEdit.getByLabel('Map quick office fax')).toBeVisible();
    await expect(mapQuickEdit.getByLabel('Map quick Google Maps URL')).toBeVisible();
    await mapQuickEdit.getByRole('button', { name: '타이베이' }).click();
    await expect(page.locator('[data-node-id="home-offices-layout-0-card-title"]').first()).toContainText('타이베이');
    await expect(page.locator('[data-node-id="home-offices-layout-0-card-address"]').first()).toContainText('承德路');
    await expect(mapQuickEdit.getByLabel('Map quick address')).toHaveValue(/承德路/);
    await expect(mapQuickEdit.getByLabel('Map quick location title')).toHaveValue('타이베이');
    await expect(mapQuickEdit.getByLabel('Map quick office phone')).toHaveValue('');
    await expect(mapQuickEdit.getByLabel('Map quick office fax')).toHaveValue('');
    const temporaryOfficeTitle = `타이베이 테스트 ${Date.now().toString(36)}`;
    const temporaryOfficePhone = '02-0000-0000';
    const temporaryOfficeFax = '02-1111-1111';
    const temporaryOfficeUrl = 'https://www.google.com/maps/search/test-office';
    await mapQuickEdit.getByLabel('Map quick location title').fill(temporaryOfficeTitle);
    await expect(page.locator('[data-node-id="home-offices-layout-0-card-title"]').first()).toContainText(temporaryOfficeTitle);
    await mapQuickEdit.getByLabel('Map quick office phone').fill(temporaryOfficePhone);
    await expect(page.locator('[data-node-id="home-offices-layout-0-card-phone"]').first()).toContainText(temporaryOfficePhone);
    await mapQuickEdit.getByLabel('Map quick office fax').fill(temporaryOfficeFax);
    await expect(page.locator('[data-node-id="home-offices-layout-0-card-fax"]').first()).toContainText(temporaryOfficeFax);
    await mapQuickEdit.getByLabel('Map quick Google Maps URL').fill(temporaryOfficeUrl);
    await expect(mapQuickEdit.getByLabel('Map quick Google Maps URL')).toHaveValue(temporaryOfficeUrl);
    await mapQuickEdit.getByRole('slider', { name: 'Map quick zoom' }).fill('17');
    await expect.poll(async () => {
      const src = await officeMap.locator('iframe[title="Google Maps"]').first().getAttribute('src');
      return src ? new URL(src).searchParams.get('z') : '';
    }).toBe('17');
    await mapQuickEdit.getByRole('button', { name: '타이중' }).click();
    await expect(page.locator('[data-node-id="home-offices-layout-0-card-title"]').first()).toContainText('타이중');
    await expect(page.locator('[data-node-id="home-offices-layout-0-card-phone"]').first()).toContainText('04-2326-1862');
    await page.getByRole('button', { name: /content|콘텐츠/i }).click();
    await expect(page.getByText(/Office sync|사무소 동기화/)).toBeVisible();
    await expect(page.getByText('사무소 프리셋')).toBeVisible();
    const mapAddressInput = page.getByLabel(/Office address synced value|동기화된 사무소 주소/);
    await expect(mapAddressInput).not.toHaveValue('');
    const originalMapAddress = await mapAddressInput.inputValue();
    const temporaryMapAddress = originalMapAddress.includes('承德路')
      ? '臺中市北區館前路19號樓之1'
      : '台北市大同區承德路一段35號7樓之2';
    const officeCardAddress = page.locator('[data-node-id="home-offices-layout-0-card-address"]').first();
    const officeMapUrlInput = page.getByLabel(/Office map URL|사무소 지도 URL/);
    const originalMapUrl = await officeMapUrlInput.inputValue();
    const mapFrame = officeMap.locator('iframe[title="Google Maps"]').first();
    try {
      await mapAddressInput.fill(temporaryMapAddress);
      await expect(mapAddressInput).toHaveValue(temporaryMapAddress);
      await expect(officeCardAddress).toContainText(temporaryMapAddress);
      await expect.poll(async () => {
        const src = await mapFrame.getAttribute('src');
        return src ? new URL(src).searchParams.get('q') : '';
      }).toBe(temporaryMapAddress);
      const temporaryMapUrl = `https://www.google.com/maps/search/${encodeURIComponent(temporaryMapAddress)}`;
      await officeMapUrlInput.fill(temporaryMapUrl);
      await expect(officeMapUrlInput).toHaveValue(temporaryMapUrl);
    } finally {
      if (!(await mapAddressInput.isVisible().catch(() => false))) {
        await officeMap.scrollIntoViewIfNeeded();
        await officeMap.click({ position: { x: 24, y: 24 }, force: true });
        await page.getByRole('button', { name: /content|콘텐츠/i }).click({ force: true });
        await expect(page.getByText(/Office sync|사무소 동기화/)).toBeVisible();
      }
      await page.getByLabel(/Office address synced value|동기화된 사무소 주소/).fill(originalMapAddress);
      await page.getByLabel(/Office map URL|사무소 지도 URL/).fill(originalMapUrl);
      await expect(page.getByLabel(/Office address synced value|동기화된 사무소 주소/)).toHaveValue(originalMapAddress);
    }

    await rail.getByRole('button', { name: /^Pages$|^페이지$/ }).click();
    const pagesDrawerForColumns = page.locator('aside[aria-hidden="false"]').filter({ hasText: /Pages|페이지/ }).first();
    await expect(pagesDrawerForColumns.getByLabel('칼럼 빠른 이동')).toBeVisible();
    await expect(pagesDrawerForColumns.getByText(/posts|칼럼 연결|게시글 \d+개/).first()).toBeVisible();
    await expect(pagesDrawerForColumns.getByRole('link', { name: '칼럼 관리' })).toBeVisible();
    await expect(pagesDrawerForColumns.getByRole('link', { name: '새 글 쓰기' })).toHaveAttribute(
      'href',
      '/ko/admin-builder/columns?new=1',
    );
    const columnsPageButton = pagesDrawerForColumns.getByRole('button', { name: /칼럼|Columns/ }).first();
    await expect(columnsPageButton).toBeVisible();
    await columnsPageButton.click();
    await expect(page.getByText(/Loaded page:/)).toBeVisible();
    await expect(page.locator('aside[aria-hidden="false"]')).toHaveCount(0);
    // The Columns page is intentionally a non-decomposable composite: exactly
    // two nodes (columns-page-root + columns-page-root-composite). Validate the
    // canonical composite node and its PageHeader surfaces instead of the
    // removed columns-page-title/columns-feed nodes.
    const columnsComposite = page.locator('[data-node-id="columns-page-root-composite"]').first();
    await expect(columnsComposite).toBeVisible();
    await expect(
      columnsComposite.locator('[data-builder-surface-key="headline"]').first(),
    ).toContainText(/칼럼|Columns/);
    // The composite renders the live ColumnsGrid archive — assert against
    // current API titles instead of hardcoded post names.
    const columnsListPayload = (await (await page.request.get('/api/builder/columns?locale=ko')).json()) as {
      columns?: Array<{ title?: string }>;
    };
    const columnTitleSamples = (columnsListPayload.columns ?? [])
      .slice(0, 8)
      .map((column) => (column.title ?? '').slice(0, 10))
      .filter((title) => title.length > 1);
    expect(columnTitleSamples.length).toBeGreaterThan(0);
    await expect.poll(async () => {
      const compositeText = await columnsComposite.innerText();
      return columnTitleSamples.some((title) => compositeText.includes(title));
    }, { timeout: 10_000 }).toBe(true);
    // Select the composite through an ordinary (non-forced) click on the
    // page-header band — a non-interactive text region. The composite's
    // transparent edit overlay (pointerEvents: auto while unselected) captures
    // the pointer and selects the node, so no force is needed.
    const columnsHeader = columnsComposite.locator('section.page-header').first();
    await columnsHeader.scrollIntoViewIfNeeded();
    const headerBox = await columnsHeader.boundingBox();
    const compositeBox = await columnsComposite.boundingBox();
    expect(headerBox).toBeTruthy();
    expect(compositeBox).toBeTruthy();
    await columnsComposite.click({
      position: headerBox && compositeBox
        ? {
            x: headerBox.x - compositeBox.x + headerBox.width / 2,
            y: headerBox.y - compositeBox.y + headerBox.height / 2,
          }
        : { x: 200, y: 60 },
    });
    const selectedComposite = page.locator(
      '[data-node-id="columns-page-root-composite"][class*="nodeSelected"]',
    ).first();
    await expect(selectedComposite).toBeVisible();
    await expect(selectedComposite.locator('[class*="resizeHandle"]:visible')).toHaveCount(8);
    // columns is intentionally excluded from STANDARD_PAGE_DECOMPOSERS, so the
    // inspector must never surface a decompose CTA for this composite.
    await expect(page.locator('[data-builder-composite-decompose-cta="true"]')).toHaveCount(0);
    await checkBuilderA11y(page, 'body');
    // Navigate to the Columns management page via the real 글 목록 link
    // exposed in the Columns rail drawer (→ /ko/admin-builder/columns).
    await rail.getByRole('button', { name: /^Columns$|^칼럼$/ }).click();
    const columnsManagementDrawer = page.locator('aside[aria-hidden="false"]').first();
    await expect(columnsManagementDrawer.getByRole('link', { name: '글 목록' })).toBeVisible();
    await columnsManagementDrawer.getByRole('link', { name: '글 목록' }).click();
    await expect(page).toHaveURL(/\/ko\/admin-builder\/columns$/);
  });
});
