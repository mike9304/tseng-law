import { expect, test, type Locator, type Page } from '@playwright/test';

const YEAR_END_POPUP_HIDE_UNTIL_KEY = 'hojeong-year-end-event-hide-until';

async function expectImageLoaded(locator: Locator): Promise<void> {
  await expect.poll(async () => {
    const info = await locator.evaluate((element) => {
      const img = element.matches('img')
        ? element
        : element.querySelector('img');
      if (!(img instanceof HTMLImageElement)) {
        return { complete: false, naturalWidth: 0 };
      }
      return { complete: img.complete, naturalWidth: img.naturalWidth };
    });
    return info.complete && info.naturalWidth > 0 ? 'loaded' : 'pending';
  }, { timeout: 30_000 }).toBe('loaded');
}

async function expectPublicImageLoaded(page: Page, selector: string): Promise<void> {
  const locator = page.locator(selector).first();
  await expect(locator).toBeVisible({ timeout: 30_000 });
  await locator.scrollIntoViewIfNeeded();
  await expectImageLoaded(locator);
}

async function expectHeroMediaCoversRoot(page: Page): Promise<void> {
  const metrics = await page.evaluate(() => {
    const root = document.querySelector('[data-node-id="home-hero-root"]');
    const media = document.querySelector('[data-node-id="home-hero-media"]');
    const image = document.querySelector('[data-node-id="home-hero-media-image"]');
    if (!(root instanceof HTMLElement) || !(media instanceof HTMLElement) || !(image instanceof HTMLElement)) {
      return null;
    }
    const rootRect = root.getBoundingClientRect();
    const mediaRect = media.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    const mediaOverlapWidth = Math.max(
      0,
      Math.min(rootRect.right, mediaRect.right) - Math.max(rootRect.left, mediaRect.left),
    );
    const mediaOverlapHeight = Math.max(
      0,
      Math.min(rootRect.bottom, mediaRect.bottom) - Math.max(rootRect.top, mediaRect.top),
    );
    const imageOverlapWidth = Math.max(
      0,
      Math.min(rootRect.right, imageRect.right) - Math.max(rootRect.left, imageRect.left),
    );
    const imageOverlapHeight = Math.max(
      0,
      Math.min(rootRect.bottom, imageRect.bottom) - Math.max(rootRect.top, imageRect.top),
    );
    return {
      root: { width: rootRect.width, height: rootRect.height },
      media: { width: mediaRect.width, height: mediaRect.height },
      image: { width: imageRect.width, height: imageRect.height },
      mediaOverlap: { width: mediaOverlapWidth, height: mediaOverlapHeight },
      imageOverlap: { width: imageOverlapWidth, height: imageOverlapHeight },
    };
  });

  expect(metrics).not.toBeNull();
  if (!metrics) {
    throw new Error('Expected published hero root and media nodes to exist.');
  }

  expect(metrics.media.width).toBeGreaterThanOrEqual(metrics.root.width * 0.9);
  expect(metrics.media.height).toBeGreaterThanOrEqual(metrics.root.height * 0.8);
  expect(metrics.image.width).toBeGreaterThanOrEqual(metrics.root.width * 0.9);
  expect(metrics.image.height).toBeGreaterThanOrEqual(metrics.root.height * 0.8);
  expect(metrics.mediaOverlap.width).toBeGreaterThanOrEqual(metrics.root.width * 0.9);
  expect(metrics.mediaOverlap.height).toBeGreaterThanOrEqual(metrics.root.height * 0.8);
  expect(metrics.imageOverlap.width).toBeGreaterThanOrEqual(metrics.root.width * 0.9);
  expect(metrics.imageOverlap.height).toBeGreaterThanOrEqual(metrics.root.height * 0.8);
}

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  const overflowPx = await page.evaluate(() => (
    Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth
  ));
  expect(overflowPx).toBeLessThanOrEqual(2);
}

async function expectHeroContentFitsViewport(page: Page): Promise<void> {
  const clippedNodeIds = await page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    return ['home-hero-label', 'home-hero-title', 'home-hero-search-wrap'].flatMap((nodeId) => {
      const element = document.querySelector(`[data-node-id="${nodeId}"]`);
      if (!(element instanceof HTMLElement)) {
        return [`${nodeId}:missing`];
      }
      const rect = element.getBoundingClientRect();
      return rect.left >= -1 && rect.right <= viewportWidth + 1 ? [] : [nodeId];
    });
  });
  expect(clippedNodeIds).toEqual([]);
}

test.describe('/ko published image nodes hide edit chrome', () => {
  test('no "이미지 변경" overlay leaks and key public images are loaded', async ({ page }) => {
    test.setTimeout(120_000);

    await page.addInitScript((key) => {
      window.localStorage.setItem(key, String(Date.now() + 24 * 60 * 60 * 1000));
    }, YEAR_END_POPUP_HIDE_UNTIL_KEY);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.setViewportSize({ width: 1440, height: 1000 });

    await page.goto('/ko', { waitUntil: 'load' });

    await expect(page.locator('.image-hover-overlay')).toHaveCount(0);
    await expect(page.getByText('이미지 변경')).toHaveCount(0);

    for (const selector of [
      '[data-node-id="home-hero-media-image"], .builder-pub-node[data-node-id="home-hero"] .hero-media-image',
      '[data-node-id="home-insights-featured-image"], img[alt*="대만 화장품"]',
      '[data-node-id="home-attorney-image"], img[alt*="증준외 대표 변호사"]',
    ] as const) {
      await expectPublicImageLoaded(page, selector);
    }
  });

  test('mobile and tablet public home avoids edit chrome and horizontal overflow', async ({ page }) => {
    test.setTimeout(120_000);

    await page.addInitScript((key) => {
      window.localStorage.setItem(key, String(Date.now() + 24 * 60 * 60 * 1000));
    }, YEAR_END_POPUP_HIDE_UNTIL_KEY);
    await page.emulateMedia({ reducedMotion: 'reduce' });

    for (const viewport of [
      { width: 390, height: 900 },
      { width: 768, height: 900 },
    ] as const) {
      await page.setViewportSize(viewport);
      await page.goto(`/ko?publicHomeQaViewport=${viewport.width}`, { waitUntil: 'load' });

      await expect(page.locator('.image-hover-overlay')).toHaveCount(0);
      await expect(page.getByText('이미지 변경')).toHaveCount(0);
      await expectNoHorizontalOverflow(page);
      await expectPublicImageLoaded(
        page,
        '[data-node-id="home-hero-media-image"], .builder-pub-node[data-node-id="home-hero"] .hero-media-image',
      );
    }
  });

  test('mobile and tablet decomposed hero media remains a full-cover background', async ({ page }) => {
    test.setTimeout(120_000);

    await page.addInitScript((key) => {
      window.localStorage.setItem(key, String(Date.now() + 24 * 60 * 60 * 1000));
    }, YEAR_END_POPUP_HIDE_UNTIL_KEY);
    await page.emulateMedia({ reducedMotion: 'reduce' });

    for (const viewport of [
      { width: 390, height: 900 },
      { width: 768, height: 900 },
    ] as const) {
      await page.setViewportSize(viewport);
      await page.goto(`/ko/builder-fixtures/decomposed-home?decomposedHeroQaViewport=${viewport.width}`, { waitUntil: 'load' });

      await expect(page.locator('[data-node-id="home-hero-root"]')).toHaveCount(1);
      await expect(page.locator('[data-node-id="home-hero"]')).toHaveCount(0);
      await expect(page.locator('.image-hover-overlay')).toHaveCount(0);
      await expect(page.getByText('이미지 변경')).toHaveCount(0);
      await expectNoHorizontalOverflow(page);
      await expectPublicImageLoaded(page, '[data-node-id="home-hero-media-image"]');
      await expectHeroMediaCoversRoot(page);
      await expectHeroContentFitsViewport(page);
    }
  });
});
