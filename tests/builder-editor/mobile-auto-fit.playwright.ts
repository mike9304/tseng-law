import { expect, test } from '@playwright/test';
import { openBuilder } from './helpers/editor';

test.describe('/ko/admin-builder mobile auto-fit', () => {
  test('creates mobile overrides for unforked sections when entering mobile mode', async ({ page }) => {
    await openBuilder(page, `/ko/admin-builder?mobileAutoFit=${Date.now().toString(36)}`);

    await page.locator('[data-builder-topbar-viewport="mobile"]').click();
    await expect(page.locator('[data-builder-topbar-viewport="mobile"]')).toHaveAttribute('aria-pressed', 'true');
    const hamburger = page.locator('[data-builder-mobile-hamburger="true"]').first();
    await expect(hamburger).toBeVisible();
    await hamburger.click();
    await expect(page.locator('[data-builder-mobile-drawer="open"]').first()).toBeVisible();
    await page.keyboard.press('Escape').catch(() => undefined);
    await page.mouse.click(20, 120);

    const servicesRoot = page.locator('[data-node-id="home-services-root"]').first();
    await expect(servicesRoot).toBeVisible();
    await expect(servicesRoot).toHaveCSS('width', '375px');
    await expect(servicesRoot).toHaveCSS('left', '0px');

    const servicesTitle = page.locator('[data-node-id="home-services-title"]').first();
    await expect(servicesTitle).toBeVisible();
    const titleBox = await servicesTitle.boundingBox();
    const rootBox = await servicesRoot.boundingBox();
    expect(titleBox).not.toBeNull();
    expect(rootBox).not.toBeNull();
    expect(titleBox!.x + titleBox!.width).toBeLessThanOrEqual(rootBox!.x + rootBox!.width + 1);

    const mobileFontSize = await servicesTitle.evaluate((element) => {
      const fontSize = window.getComputedStyle(element).fontSize;
      return Number(fontSize.replace('px', ''));
    });
    expect(mobileFontSize).toBeGreaterThanOrEqual(8);
    expect(mobileFontSize).toBeLessThan(16);
  });
});
