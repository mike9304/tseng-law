import { expect, test, type Locator, type Page } from '@playwright/test';
import { openBuilder, openCatalogDrawer } from './helpers/editor';

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

async function expectCompactStatusBarTrimmed(page: Page): Promise<void> {
  await expect(page.getByText('단축키: ?', { exact: true })).toBeHidden();

  const visibleEmptyStatusItems = await page.locator('[class*="statusBarItem"]').evaluateAll((items) =>
    items.filter((item) => {
      const rect = item.getBoundingClientRect();
      const style = window.getComputedStyle(item);
      return rect.width > 0 && rect.height > 0 && style.display !== 'none' && (item.textContent ?? '').trim() === '';
    }).length,
  );
  expect(visibleEmptyStatusItems).toBe(0);
}

test.describe('/ko/admin-builder compact editor chrome', () => {
  test('keeps Add drawer, canvas, and inspector usable inside the mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await openBuilder(page, `/ko/admin-builder?compactDrawerInspector=${Date.now().toString(36)}`);

    const drawer = await openCatalogDrawer(page);
    const shell = page.locator('[class*="editorShell"]').first();
    const rail = page.locator('[class*="iconRail"]').first();
    const canvasColumn = page.locator('[data-builder-canvas-scroll-root="true"]').first();
    const stageViewport = page.locator('[class*="stageViewport"]').first();
    const inspectorColumn = page.locator('[class*="inspectorColumn"]').first();
    const statusBar = page.locator('footer[class*="statusBar"]').first();

    await expect(shell).toBeVisible();
    await expect(rail).toBeVisible();
    await expect(drawer).toBeVisible();
    await expect(canvasColumn).toBeVisible();
    await expect(stageViewport).toBeVisible();
    await expect(inspectorColumn).toBeVisible();
    await expect(statusBar).toBeVisible();

    const shellBox = await requiredBox(shell, 'editor shell');
    const railBox = await requiredBox(rail, 'rail');
    const drawerBox = await requiredBox(drawer, 'Add drawer');
    const canvasBox = await requiredBox(canvasColumn, 'canvas column');
    const stageBox = await requiredBox(stageViewport, 'stage viewport');
    const inspectorBox = await requiredBox(inspectorColumn, 'inspector column');
    const statusBox = await requiredBox(statusBar, 'status bar');

    expect(drawerBox.y).toBeGreaterThanOrEqual(bottom(railBox) - 1);
    expect(canvasBox.y).toBeGreaterThanOrEqual(bottom(drawerBox) - 1);
    expect(inspectorBox.y).toBeGreaterThanOrEqual(bottom(canvasBox) - 1);
    expect(bottom(inspectorBox)).toBeLessThanOrEqual(bottom(shellBox) + 1);
    expect(statusBox.y).toBeGreaterThanOrEqual(bottom(shellBox) - 1);
    expect(bottom(statusBox)).toBeLessThanOrEqual(844);

    expect(drawerBox.height).toBeGreaterThanOrEqual(180);
    expect(canvasBox.height).toBeGreaterThanOrEqual(220);
    expect(stageBox.height).toBeGreaterThanOrEqual(180);
    expect(inspectorBox.height).toBeGreaterThanOrEqual(204);
    expect(statusBox.height).toBeLessThanOrEqual(24);

    await expectCompactStatusBarTrimmed(page);

    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
    await page.screenshot({
      path: '/tmp/tseng-law-compact-editor-drawer-inspector-fit.png',
      fullPage: true,
    });
  });

  test('keeps the inspector above the status bar on short mobile viewports', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await openBuilder(page, `/ko/admin-builder?compactShortViewport=${Date.now().toString(36)}`);

    const drawer = await openCatalogDrawer(page);
    const shell = page.locator('[class*="editorShell"]').first();
    const canvasColumn = page.locator('[data-builder-canvas-scroll-root="true"]').first();
    const inspectorColumn = page.locator('[class*="inspectorColumn"]').first();
    const statusBar = page.locator('footer[class*="statusBar"]').first();

    await expect(shell).toBeVisible();
    await expect(drawer).toBeVisible();
    await expect(canvasColumn).toBeVisible();
    await expect(inspectorColumn).toBeVisible();
    await expect(statusBar).toBeVisible();

    const shellBox = await requiredBox(shell, 'editor shell');
    const canvasBox = await requiredBox(canvasColumn, 'canvas column');
    const inspectorBox = await requiredBox(inspectorColumn, 'inspector column');
    const statusBox = await requiredBox(statusBar, 'status bar');

    expect(canvasBox.height).toBeGreaterThanOrEqual(220);
    expect(inspectorBox.height).toBeGreaterThanOrEqual(168);
    expect(bottom(inspectorBox)).toBeLessThanOrEqual(bottom(shellBox) + 1);
    expect(statusBox.y).toBeGreaterThanOrEqual(bottom(shellBox) - 1);
    expect(bottom(statusBox)).toBeLessThanOrEqual(740);
    expect(statusBox.height).toBeLessThanOrEqual(24);

    await expectCompactStatusBarTrimmed(page);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(360);
  });
});
