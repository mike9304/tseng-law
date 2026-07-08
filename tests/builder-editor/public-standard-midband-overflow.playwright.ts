import { expect, test, type Page } from '@playwright/test';

const MIDBAND_ROUTES = [
  '/ko/privacy',
  '/ko/disclaimer',
  '/zh-hant',
  '/zh-hant/services',
  '/zh-hant/privacy',
  '/zh-hant/disclaimer',
] as const;

async function documentOverflowPx(page: Page): Promise<number> {
  return page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
}

test.describe('published standard pages at 1024px', () => {
  test.use({ viewport: { width: 1024, height: 900 } });

  for (const route of MIDBAND_ROUTES) {
    test(`${route} does not overflow horizontally`, async ({ page }) => {
      const response = await page.goto(route, { waitUntil: 'load' });

      expect(response?.status()).toBe(200);
      await expect.poll(() => documentOverflowPx(page)).toBeLessThanOrEqual(2);
    });
  }
});
