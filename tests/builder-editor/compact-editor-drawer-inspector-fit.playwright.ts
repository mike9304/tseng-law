import { expect, test, type Locator, type Page } from '@playwright/test';
import { openBuilder } from './helpers/editor';

type Viewport = {
  readonly width: number;
  readonly height: number;
};

type Box = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

async function requiredBox(locator: Locator, label: string): Promise<Box> {
  const box = await locator.boundingBox();
  if (box === null) {
    throw new Error(`Missing ${label} bounds.`);
  }
  return box;
}

function bottom(box: Box): number {
  return box.y + box.height;
}

function right(box: Box): number {
  return box.x + box.width;
}

function boxesMatch(left: Box, rightBox: Box): boolean {
  return Math.abs(left.x - rightBox.x) < 0.25
    && Math.abs(left.y - rightBox.y) < 0.25
    && Math.abs(left.width - rightBox.width) < 0.25
    && Math.abs(left.height - rightBox.height) < 0.25;
}

async function expectMovedAndStable(locator: Locator, before: Box): Promise<void> {
  let previous: Box | null = null;
  let stableSamples = 0;

  await expect.poll(async () => {
    const current = await locator.boundingBox();
    if (!current || boxesMatch(current, before)) {
      previous = current;
      stableSamples = 0;
      return stableSamples;
    }
    stableSamples = previous && boxesMatch(current, previous) ? stableSamples + 1 : 0;
    previous = current;
    return stableSamples;
  }).toBeGreaterThanOrEqual(2);
}

async function expectNoHorizontalOverflow(page: Page, viewport: Viewport): Promise<void> {
  await expect.poll(() => page.locator('html').evaluate(
    (element) => element.scrollWidth <= element.clientWidth,
  )).toBe(true);
  await expect.poll(() => page.locator('html').evaluate(
    (element) => element.clientWidth,
  )).toBeLessThanOrEqual(viewport.width);
}

async function expectCanvasDominantAbovePanel(
  canvas: Locator,
  panel: Locator,
  viewport: Viewport,
): Promise<void> {
  const canvasBox = await requiredBox(canvas, 'canvas scroll root');
  const panelBox = await requiredBox(panel, 'compact panel');
  const visibleCanvasHeight = Math.max(
    0,
    Math.min(panelBox.y, bottom(canvasBox)) - canvasBox.y,
  );

  expect(panelBox.y).toBeGreaterThan(canvasBox.y);
  expect(visibleCanvasHeight).toBeGreaterThanOrEqual(viewport.height * 0.45);
  expect(panelBox.x).toBeGreaterThanOrEqual(0);
  expect(right(panelBox)).toBeLessThanOrEqual(viewport.width + 1);
}

async function expectCompactStatusBarTrimmed(page: Page, viewport: Viewport): Promise<void> {
  const statusBar = page.locator('footer[class*="statusBar"]');
  await expect(statusBar).toBeVisible();
  await expect(page.locator('[data-builder-status-shortcuts="true"]')).toBeHidden();

  const statusBox = await requiredBox(statusBar, 'status bar');
  expect(bottom(statusBox)).toBeLessThanOrEqual(viewport.height);

  const visibleEmptyStatusItems = await page.locator('[class*="statusBarItem"]').evaluateAll((items) =>
    items.filter((item) => {
      const rect = item.getBoundingClientRect();
      const style = window.getComputedStyle(item);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && (item.textContent ?? '').trim() === '';
    }).length,
  );
  expect(visibleEmptyStatusItems).toBe(0);
}

async function openAddDrawer(page: Page): Promise<Locator> {
  const addButton = page.locator('[data-builder-rail-item="add"]');
  await expect(addButton).toBeVisible();
  await addButton.click();

  const drawer = page.locator('aside[data-builder-drawer="add"]');
  await expect(drawer).toBeVisible();
  await expect(drawer.locator('[data-builder-drawer-body="add"]')).toBeVisible();
  await expect(drawer.getByRole('searchbox')).toBeVisible();
  return drawer;
}

async function switchFromDrawerToInspector(page: Page, drawer: Locator): Promise<Locator> {
  const switchButton = page.locator('[data-builder-compact-panel-switch="inspector"]');
  await expect(switchButton).toBeVisible();
  await switchButton.click();
  await expect(drawer).toHaveCount(0);

  const inspector = page.locator('[data-builder-inspector-surface="true"]');
  await expect(inspector).toBeVisible();
  await expect(inspector).toHaveAttribute('data-builder-inspector-collapsed', 'false');
  return inspector;
}

test.describe('/ko/admin-builder compact editor chrome', () => {
  test('keeps Add and inspector as exclusive bottom sheets while the canvas stays dominant', async ({ page }) => {
    const viewport = { width: 390, height: 844 } as const;
    await page.setViewportSize(viewport);
    await openBuilder(page, `/ko/admin-builder?compactDrawerInspector=${Date.now().toString(36)}`);

    const shell = page.locator('[data-builder-compact-shell="true"]');
    const canvas = page.locator('[data-builder-canvas-scroll-root="true"]');
    const inspector = page.locator('[data-builder-inspector-surface="true"]');
    const topbar = page.locator('[data-builder-professional-topbar="true"]');

    await expect(shell).toBeVisible();
    await expect(canvas).toBeVisible();
    await expect(inspector).toBeVisible();
    await expect(topbar).toBeVisible();
    await expect(page.locator('[data-builder-topbar-primary="publish"]')).toBeVisible();
    await expect.poll(async () => (await topbar.boundingBox())?.height ?? Number.POSITIVE_INFINITY)
      .toBeLessThanOrEqual(88);

    const drawer = await openAddDrawer(page);
    await expect(inspector).toBeHidden();
    await expectCanvasDominantAbovePanel(canvas, drawer, viewport);

    const restoredInspector = await switchFromDrawerToInspector(page, drawer);
    await expectCanvasDominantAbovePanel(canvas, restoredInspector, viewport);

    const shellBox = await requiredBox(shell, 'editor shell');
    const inspectorBox = await requiredBox(restoredInspector, 'inspector bottom sheet');
    expect(bottom(inspectorBox)).toBeLessThanOrEqual(bottom(shellBox) + 1);

    await expectCompactStatusBarTrimmed(page, viewport);
    await expectNoHorizontalOverflow(page, viewport);
  });

  test('preserves the 45% canvas contract above both panels on a short mobile viewport', async ({ page }) => {
    const viewport = { width: 360, height: 740 } as const;
    await page.setViewportSize(viewport);
    await openBuilder(page, `/ko/admin-builder?compactShortViewport=${Date.now().toString(36)}`);

    const canvas = page.locator('[data-builder-canvas-scroll-root="true"]');
    const initialInspector = page.locator('[data-builder-inspector-surface="true"]');
    await expect(initialInspector).toBeVisible();
    await expectCanvasDominantAbovePanel(canvas, initialInspector, viewport);

    const drawer = await openAddDrawer(page);
    await expect(initialInspector).toBeHidden();
    await expectCanvasDominantAbovePanel(canvas, drawer, viewport);

    const restoredInspector = await switchFromDrawerToInspector(page, drawer);
    await expectCanvasDominantAbovePanel(canvas, restoredInspector, viewport);
    await expectCompactStatusBarTrimmed(page, viewport);
    await expectNoHorizontalOverflow(page, viewport);
  });

  test('keeps one theme and save surface and leaves the autosave retry toast actionable', async ({ page }) => {
    const viewport = { width: 390, height: 844 } as const;
    let draftPutCount = 0;
    await page.route('**/api/builder/**/draft**', async (route) => {
      if (route.request().method() !== 'PUT') {
        await route.continue();
        return;
      }
      draftPutCount += 1;
      const payload = route.request().postDataJSON() as {
        readonly document?: unknown;
        readonly expectedRevision?: unknown;
      };
      if (draftPutCount > 1) {
        const expectedRevision = typeof payload.expectedRevision === 'number'
          ? payload.expectedRevision
          : 0;
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ok: true,
            draft: {
              revision: expectedRevision + 1,
              savedAt: new Date().toISOString(),
              updatedBy: 'compact-chrome-contract',
            },
            document: payload.document,
          }),
        });
        return;
      }
      await route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'rate_limited' }),
      });
    });

    await page.setViewportSize(viewport);
    await openBuilder(page, `/ko/admin-builder?compactFeedback=${Date.now().toString(36)}`);

    const secondarySummary = page.locator('[data-builder-topbar-secondary-cluster="true"] > summary');
    await expect(secondarySummary).toBeVisible();
    await secondarySummary.click();

    const themeControl = page.locator('[data-builder-editor-theme-toggle]');
    await expect(themeControl).toHaveCount(1);
    await expect(themeControl).toBeVisible();
    await secondarySummary.click();

    const inspectorToggle = page.locator('[data-builder-inspector-toggle="true"]');
    await expect(inspectorToggle).toBeVisible();
    await inspectorToggle.click();
    await expect(page.locator('[data-builder-inspector-surface="true"]'))
      .toHaveAttribute('data-builder-inspector-collapsed', 'true');
    expect(draftPutCount).toBe(0);

    const draggableNode = page.locator('[data-node-id="home-hero-title"]:visible');
    await expect(draggableNode).toHaveCount(1);
    await expect(draggableNode).toBeVisible();
    const nodeBox = await requiredBox(draggableNode, 'home hero title');
    const start = {
      x: nodeBox.x + Math.min(nodeBox.width - 8, Math.max(8, nodeBox.width / 2)),
      y: nodeBox.y + Math.min(nodeBox.height - 8, Math.max(8, nodeBox.height / 2)),
    };

    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    await page.mouse.move(start.x + 24, start.y + 16, { steps: 4 });
    await page.mouse.up();
    await expectMovedAndStable(draggableNode, nodeBox);

    const saveSurface = page.locator('[data-builder-save-status]');
    await expect(saveSurface).toHaveCount(1);
    await expect(saveSurface).toHaveAttribute('data-builder-save-status', /saving|error/);
    await expect.poll(() => draftPutCount).toBe(1);

    const retryAction = page.getByRole('button', { name: '다시 시도', exact: true });
    const errorToast = page.locator('[data-builder-toast="error"]').filter({ has: retryAction });
    await expect(errorToast).toHaveCount(1);
    await expect(errorToast).toBeVisible({ timeout: 15_000 });
    await expect(errorToast).toHaveAttribute('role', 'alert');
    await expect(errorToast).toHaveAttribute('aria-live', 'assertive');
    await expect(errorToast).toHaveCSS('opacity', '1');

    const retry = errorToast.getByRole('button', { name: '다시 시도', exact: true });
    const dismiss = errorToast.locator('[data-builder-toast-dismiss="true"]');
    await expect(retry).toBeVisible();
    await expect(dismiss).toBeVisible();

    const toastBox = await requiredBox(errorToast, 'autosave retry toast');
    const retryBox = await requiredBox(retry, 'autosave retry action');
    expect(toastBox.x).toBeGreaterThanOrEqual(0);
    expect(right(toastBox)).toBeLessThanOrEqual(viewport.width + 1);
    expect(retryBox.y).toBeGreaterThanOrEqual(toastBox.y);
    expect(bottom(retryBox)).toBeLessThanOrEqual(bottom(toastBox) + 1);

    await retry.click();
    await expect(retry).toHaveCount(0);
    await expect.poll(() => draftPutCount).toBe(2);
    await expect.poll(async () => {
      const count = await saveSurface.count();
      if (count === 0) return 'idle';
      return await saveSurface.getAttribute('data-builder-save-status') ?? 'missing';
    }).toMatch(/^(?:saved|idle)$/);
    await expect(page.locator('[data-builder-editor-theme-toggle]')).toHaveCount(1);
    expect(draftPutCount).toBe(2);
    await expectNoHorizontalOverflow(page, viewport);
  });
});
