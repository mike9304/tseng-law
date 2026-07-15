import { expect, test, type Locator, type Page } from '@playwright/test';
import { openBuilder } from './helpers/editor';

type Viewport = { width: number; height: number };

async function openCompactBuilder(page: Page, viewport: Viewport, locale = 'ko'): Promise<void> {
  await page.setViewportSize(viewport);
  await openBuilder(page, `/${locale}/admin-builder?compactChrome=${viewport.width}x${viewport.height}`);
  await expect(page.locator('[data-builder-topbar-primary="publish"]')).toBeVisible();
}

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  await expect.poll(async () => page.locator('html').evaluate(
    (element) => element.scrollWidth <= element.clientWidth,
  )).toBe(true);
}

async function expectCanvasDominantAbovePanel(
  canvas: Locator,
  panel: Locator,
  viewport: Viewport,
): Promise<void> {
  await expect.poll(async () => {
    const canvasBox = await canvas.boundingBox();
    const panelBox = await panel.boundingBox();
    if (!canvasBox || !panelBox || panelBox.y <= canvasBox.y) return 0;
    return Math.max(
      0,
      Math.min(panelBox.y, canvasBox.y + canvasBox.height) - canvasBox.y,
    );
  }).toBeGreaterThanOrEqual(viewport.height * 0.45);
}

for (const locale of ['ko', 'en', 'zh-hant'] as const) {
  test(`390px professional chrome groups remain reachable in ${locale}`, async ({ page }) => {
    await openCompactBuilder(page, { width: 390, height: 844 }, locale);
    await expect(page.locator('[data-builder-topbar-identity="true"]')).toBeVisible();
    await expect(page.locator('[data-builder-topbar-primary-cluster="true"]')).toBeVisible();
    await expect(page.locator('[data-builder-topbar-primary="publish"]')).toBeVisible();

    const secondary = page.locator('[data-builder-topbar-secondary-cluster="true"] > summary');
    await expect(secondary).toBeVisible();
    await secondary.click();
    await expect(page.locator('[data-builder-topbar-meta-cluster="navigation"]')).toBeVisible();
    await expect(page.locator('[data-builder-topbar-meta-cluster="preview"]')).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });
}

test('professional topbar stays within its measurable height and overflow contracts', async ({ page }) => {
  await openCompactBuilder(page, { width: 1440, height: 900 });
  const topbar = page.locator('[data-builder-professional-topbar="true"]');
  const publish = page.locator('[data-builder-topbar-primary="publish"]');

  for (const contract of [
    { viewport: { width: 1440, height: 900 }, expectedHeight: 56 },
    { viewport: { width: 1280, height: 900 }, expectedHeight: 56 },
    { viewport: { width: 1024, height: 900 }, expectedHeight: 72 },
    { viewport: { width: 390, height: 844 }, expectedHeight: 88 },
  ]) {
    await page.setViewportSize(contract.viewport);
    await expect(topbar).toBeVisible();
    await expect(publish).toBeVisible();
    await expect(topbar).toHaveCSS('height', `${contract.expectedHeight}px`);
    await expect.poll(async () => (await topbar.boundingBox())?.height ?? Number.POSITIVE_INFINITY)
      .toBe(contract.expectedHeight);
    await expectNoHorizontalOverflow(page);
  }

  const secondary = page.locator('[data-builder-topbar-secondary-cluster="true"] > summary');
  await expect(secondary).toHaveAccessibleName('보조 편집 도구 열기');
  await secondary.click();
  await expect(page.locator('[data-builder-topbar-meta-cluster="navigation"]')).toBeVisible();
  await expect(page.locator('[data-builder-topbar-meta-cluster="preview"]')).toBeVisible();
});

for (const viewport of [
  { width: 960, height: 900 },
  { width: 768, height: 900 },
] as const) {
  test(`compact ${viewport.width}x${viewport.height} drawer and inspector are exclusive overlays`, async ({ page }) => {
    await openCompactBuilder(page, viewport);
    const canvas = page.locator('[data-builder-canvas-scroll-root="true"]');
    const drawerButton = page.locator('[data-builder-rail-item="pages"]');
    const drawer = page.locator('aside[data-builder-drawer]');
    const inspector = page.locator('[data-builder-inspector-surface="true"]');

    await drawerButton.click();
    await expect(drawer).toBeVisible();
    await expect(inspector).not.toBeVisible();
    await expectCanvasDominantAbovePanel(canvas, drawer, viewport);
    await expectNoHorizontalOverflow(page);

    const switchToInspector = page.locator('[data-builder-compact-panel-switch="inspector"]');
    await expect(switchToInspector).toBeVisible();
    await switchToInspector.click();
    await expect(drawer).not.toBeVisible();
    await expect(inspector).toBeVisible();
    await expect(inspector).toHaveAttribute('data-builder-inspector-collapsed', 'false');
    await expectCanvasDominantAbovePanel(canvas, inspector, viewport);

    const inspectorToggle = page.locator('[data-builder-inspector-toggle="true"]');
    await inspectorToggle.click();
    await expect(inspector).toHaveAttribute('data-builder-inspector-collapsed', 'true');
    await inspectorToggle.click();
    await expect(inspector).toHaveAttribute('data-builder-inspector-collapsed', 'false');
    await expectNoHorizontalOverflow(page);
    await expect(page.locator('[data-builder-topbar-primary="publish"]')).toBeVisible();
  });
}
