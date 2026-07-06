import { expect, test } from '@playwright/test';

const YEAR_END_POPUP_HIDE_UNTIL_KEY = 'hojeong-year-end-event-hide-until';

test.describe('/ko public home attorney portrait', () => {
  for (const viewport of [
    { name: 'mobile', width: 390, height: 844 },
    { name: 'desktop', width: 1440, height: 1000 },
  ]) {
    test(`attorney portrait is loaded and visible without scrolling on ${viewport.name}`, async ({ page }) => {
      test.setTimeout(120_000);

      await page.addInitScript((key) => {
        window.localStorage.setItem(key, String(Date.now() + 24 * 60 * 60 * 1000));
      }, YEAR_END_POPUP_HIDE_UNTIL_KEY);
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: viewport.width, height: viewport.height });

      await page.goto('/ko', { waitUntil: 'load' });

      const portrait = page.locator('#about .split-image--portrait img.person-photo').first();
      await expect(portrait).toHaveCount(1);

      await expect.poll(async () => {
        const info = await portrait.evaluate((element) => {
          if (!(element instanceof HTMLImageElement)) {
            return { complete: false, naturalWidth: 0 };
          }

          return { complete: element.complete, naturalWidth: element.naturalWidth };
        });
        return info.complete && info.naturalWidth > 0 ? 'loaded' : 'pending';
      }, { timeout: 20_000 }).toBe('loaded');

      await portrait.scrollIntoViewIfNeeded();
      await expect(portrait).toBeVisible();
      const box = await portrait.boundingBox();
      expect(box, 'portrait bounding box').toBeTruthy();
      if (box) {
        expect(Math.min(box.width, box.height), 'portrait painted size').toBeGreaterThan(120);
      }
    });
  }
});
