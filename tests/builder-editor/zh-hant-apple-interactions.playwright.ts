import { expect, test, type Locator, type Page } from '@playwright/test';

// zh-hant Apple pass (2026-10-01): browser regressions found by Astra in rounds 2 and 3.
// Runs in chromium-builder and webkit-public (WebKit was where both defects showed).

const YEAR_END_POPUP_HIDE_UNTIL_KEY = 'hojeong-year-end-event-hide-until';

async function preparePage(page: Page) {
  await page.addInitScript((key) => {
    window.localStorage.setItem(key, String(Date.now() + 24 * 60 * 60 * 1000));
    window.sessionStorage.setItem('hojeong.cinematic.seen', '1');
  }, YEAR_END_POPUP_HIDE_UNTIL_KEY);
}

/** Poster visible, or the mounted video has a frame to show. */
async function backgroundIsPainted(player: Locator): Promise<boolean> {
  return player.evaluate((root) => {
    const video = root.querySelector('video');
    const poster = root.querySelector<HTMLElement>('.decorative-autoplay-video__poster');
    const ready = root.getAttribute('data-video-ready') === 'true';
    if (ready) return Boolean(video && video.readyState >= 2);
    return Boolean(poster && Number(getComputedStyle(poster).opacity) > 0.5);
  });
}

async function videoPaused(player: Locator): Promise<boolean> {
  return player.evaluate((root) => root.querySelector('video')?.paused ?? true);
}

test.describe('zh-hant Apple pass — decorative video across breakpoint changes', () => {
  test('a paused hero keeps its background and a working Play control after rotating', async ({ page }) => {
    test.setTimeout(120_000);
    await preparePage(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/zh-hant', { waitUntil: 'load' });

    const player = page.locator('#hero .decorative-autoplay-video').first();
    const control = player.locator('.decorative-autoplay-video__control');
    await expect(control).toHaveAttribute('aria-label', '暫停影片', { timeout: 30_000 });
    await control.click();
    await expect(control).toHaveAttribute('aria-label', '播放影片');

    await page.setViewportSize({ width: 844, height: 390 });
    await expect.poll(() => player.evaluate((root) => root.querySelector('video')?.currentSrc ?? '')).not.toContain('portrait');
    await page.waitForTimeout(1500);
    expect(await videoPaused(player)).toBe(true);
    expect(await backgroundIsPainted(player)).toBe(true);
    await expect(control).toHaveAttribute('aria-label', '播放影片');

    await control.click();
    await expect.poll(() => videoPaused(player), { timeout: 20_000 }).toBe(false);
    await expect(player).toHaveAttribute('data-video-ready', 'true', { timeout: 20_000 });
    await expect(control).toHaveAttribute('aria-label', '暫停影片');
  });

  test('an ended one-shot keeps its background and a Replay control after resizing', async ({ page }) => {
    test.setTimeout(120_000);
    await preparePage(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/zh-hant', { waitUntil: 'load' });

    const player = page.locator('.home-results-media-player').first();
    await player.scrollIntoViewIfNeeded();
    const control = player.locator('.decorative-autoplay-video__control');
    await expect(control).toBeVisible({ timeout: 30_000 });
    await player.evaluate((root) => {
      const video = root.querySelector('video');
      if (video && Number.isFinite(video.duration)) video.currentTime = Math.max(0, video.duration - 0.3);
    });
    await expect(control).toHaveAttribute('aria-label', '重新播放影片', { timeout: 20_000 });

    await page.setViewportSize({ width: 390, height: 844 });
    await player.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1500);
    expect(await backgroundIsPainted(player)).toBe(true);
    await expect(control).toBeVisible();
    await expect(control).toHaveAttribute('aria-label', '重新播放影片');

    await control.click();
    await expect.poll(() => videoPaused(player), { timeout: 20_000 }).toBe(false);
  });
});

async function visibleShare(row: Locator, index: number): Promise<number> {
  return row.evaluate((element, i) => {
    const item = element.children[i] as HTMLElement | undefined;
    if (!item) return 0;
    const box = item.getBoundingClientRect();
    const frame = element.getBoundingClientRect();
    const width = Math.max(0, Math.min(box.right, frame.right) - Math.max(box.left, frame.left));
    return width / box.width;
  }, index);
}

async function focusItem(row: Locator, index: number) {
  await row.evaluate((element, i) => {
    const item = element.children[i] as HTMLElement;
    const target = item.matches('a[href], button') ? item : item.querySelector<HTMLElement>('a[href], button');
    target?.focus();
  }, index);
}

async function pressUntilFocusIn(page: Page, row: Locator, index: number, key: 'Tab' | 'Shift+Tab', browserName: string) {
  // WebKit (like Safari's default setting) leaves links out of plain Tab; Option+Tab walks them.
  const pressed = browserName === 'webkit' ? `Alt+${key}` : key;
  for (let presses = 0; presses < 8; presses += 1) {
    await page.keyboard.press(pressed);
    const inside = await row.evaluate((element, i) => {
      const item = element.children[i];
      return Boolean(item && document.activeElement && item.contains(document.activeElement));
    }, index);
    if (inside) return;
  }
  throw new Error(`focus never reached item ${index} with ${key}`);
}

for (const motion of ['no-preference', 'reduce'] as const) {
  test.describe(`zh-hant Apple pass — keyboard focus in swipe rows (${motion} motion)`, () => {
    for (const [path, rowSelector] of [
      ['/zh-hant', '#zh-hant-home #practice .services-card-grid'],
      ['/zh-hant/columns', '#zh-hant-columns .columns-topic-section:nth-child(2) > .columns-grid'],
    ] as const) {
      test(`${path}: Tab and Shift+Tab bring the focused card fully into view`, async ({ page, browserName }) => {
        test.setTimeout(120_000);
        await preparePage(page);
        await page.emulateMedia({ reducedMotion: motion });
        await page.setViewportSize({ width: 390, height: 844 });
        await page.goto(path, { waitUntil: 'load' });

        const row = page.locator(rowSelector).first();
        await row.scrollIntoViewIfNeeded();
        await focusItem(row, 0);
        await pressUntilFocusIn(page, row, 1, 'Tab', browserName);
        await expect.poll(() => visibleShare(row, 1), { timeout: 5_000 }).toBeGreaterThan(0.98);
        await pressUntilFocusIn(page, row, 0, 'Shift+Tab', browserName);
        await expect.poll(() => visibleShare(row, 0), { timeout: 5_000 }).toBeGreaterThan(0.98);
      });
    }
  });
}
