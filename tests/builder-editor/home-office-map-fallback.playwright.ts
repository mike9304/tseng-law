import { expect, test, type Page } from '@playwright/test';
import sharp from 'sharp';

const YEAR_END_POPUP_HIDE_UNTIL_KEY = 'hojeong-year-end-event-hide-until';

type PixelSummary = {
  readonly whiteRatio: number;
};

async function summarizePng(buffer: Buffer): Promise<PixelSummary> {
  const { data, info } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });
  const totalPixels = info.width * info.height;
  let whitePixels = 0;

  for (let offset = 0; offset < data.length; offset += info.channels) {
    const r = data[offset] ?? 0;
    const g = data[offset + 1] ?? 0;
    const b = data[offset + 2] ?? 0;
    if (r > 245 && g > 245 && b > 245) whitePixels += 1;
  }

  return {
    whiteRatio: whitePixels / totalPixels,
  };
}

async function closeHomePopupIfPresent(page: Page): Promise<void> {
  const popup = page.locator('.year-end-popup-backdrop').first();
  if (await popup.isVisible().catch(() => false)) {
    await popup.getByRole('button', { name: '닫기' }).click();
    await expect(popup).toBeHidden();
  }
}

async function blockExternalMapFrames(page: Page): Promise<void> {
  await page.route(/https:\/\/(?:www\.google\.com\/maps|maps\.google\.com\/maps|maps\.gstatic\.com\/)/, (route) => route.abort());
}

async function expectOfficeMapFallbackCoversPanel(page: Page): Promise<void> {
  await expect.poll(async () => page.locator('#offices .office-map-wrap').first().evaluate((map) => {
    const fallback = map.querySelector('[data-office-map-fallback]');
    if (!fallback) return 'missing';
    const mapBox = map.getBoundingClientRect();
    const fallbackBox = fallback.getBoundingClientRect();
    const coverage = (fallbackBox.width * fallbackBox.height) / (mapBox.width * mapBox.height);
    return coverage > 0.65 ? 'covered' : `small:${coverage.toFixed(2)}`;
  }), { timeout: 5_000 }).toBe('covered');
}

test.describe('/ko office map fallback', () => {
  test('shows visible map content when the external map frame is blocked', async ({ page }) => {
    await blockExternalMapFrames(page);
    await page.addInitScript((key) => {
      window.localStorage.setItem(key, String(Date.now() + 24 * 60 * 60 * 1000));
    }, YEAR_END_POPUP_HIDE_UNTIL_KEY);
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto('/ko', { waitUntil: 'domcontentloaded' });
    await closeHomePopupIfPresent(page);

    const map = page.locator('#offices .office-map-wrap').first();
    const fallback = map.locator('[data-office-map-fallback]').first();
    await map.scrollIntoViewIfNeeded();
    await expect(fallback).toBeVisible();
    await expect(fallback).toContainText('타이중');
    await expect(fallback.getByRole('link', { name: '지도 열기' })).toBeVisible();
    await expectOfficeMapFallbackCoversPanel(page);

    const pixels = await summarizePng(await map.screenshot());
    expect(pixels.whiteRatio).toBeLessThan(0.85);
  });
});
