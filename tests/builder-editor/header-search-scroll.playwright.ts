import { expect, test } from '@playwright/test';
import { openBuilder } from './helpers/editor';

test('/ko/admin-builder header search preserves canvas horizontal scroll', async ({ page }) => {
  await openBuilder(page, `/ko/admin-builder?headerSearchScroll=${Date.now().toString(36)}`);

  const canvasColumn = page.locator('[class*="canvasColumn"]').first();
  await expect(canvasColumn).toBeVisible();
  await expect.poll(() => canvasColumn.evaluate((element) => element.scrollLeft)).toBe(0);

  await page.locator('.builder-site-header .header-search-btn').first().click();
  await expect(page.locator('.search-overlay[data-open="true"]')).toBeVisible();
  await expect.poll(() => canvasColumn.evaluate((element) => element.scrollLeft)).toBe(0);

  await page.locator('.search-overlay button[aria-label="닫기"]').click();
  await expect(page.locator('.search-overlay')).toHaveCount(0);
  await expect.poll(() => canvasColumn.evaluate((element) => element.scrollLeft)).toBe(0);
});
