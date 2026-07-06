import { expect, test } from '@playwright/test';

test('desktop first visit to /ko/reviews keeps the AI chat collapsed and the review form clear', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });

  await page.addInitScript(() => {
    window.localStorage.removeItem('hojeong-ai-chat-collapsed');
    window.localStorage.setItem(
      'hojeong-year-end-event-hide-until',
      String(Date.now() + 24 * 60 * 60 * 1000),
    );
    window.sessionStorage.removeItem('hojeong-year-end-event-dismissed-session');
  });

  try {
    await page.goto('/ko/reviews', { waitUntil: 'commit' });
    await page.waitForLoadState('load');

    await expect(page.locator('.floating-ai-chat')).toHaveCount(0);
    await expect(page.getByRole('dialog', { name: 'AI 상담사' })).toHaveCount(0);

    const toggle = page.locator('.quick-contact-toggle').first();
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');

    const nicknameInput = page.locator('#rv-nick').first();
    await expect(nicknameInput).toBeVisible();
    await expect.poll(async () => nicknameInput.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const topElement = document.elementFromPoint(centerX, centerY);

      return Boolean(topElement?.closest('.floating-ai-chat'));
    })).toBe(false);

    await toggle.click();
    const dialog = page.getByRole('dialog', { name: 'AI 상담사' });
    await expect(dialog).toBeVisible();
    await expect(page.locator('.floating-ai-chat')).toHaveCount(1);
  } finally {
    await page.evaluate(() => {
      window.localStorage.removeItem('hojeong-ai-chat-collapsed');
      window.localStorage.removeItem('hojeong-year-end-event-hide-until');
      window.sessionStorage.removeItem('hojeong-year-end-event-dismissed-session');
    }).catch(() => undefined);
  }
});

test('honors an explicit open preference for the floating AI chat on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });

  await page.addInitScript(() => {
    window.localStorage.setItem('hojeong-ai-chat-collapsed', 'false');
    window.localStorage.setItem(
      'hojeong-year-end-event-hide-until',
      String(Date.now() + 24 * 60 * 60 * 1000),
    );
    window.sessionStorage.removeItem('hojeong-year-end-event-dismissed-session');
  });

  try {
    await page.goto('/ko/reviews', { waitUntil: 'commit' });
    await page.waitForLoadState('load');

    const dialog = page.getByRole('dialog', { name: 'AI 상담사' });
    await expect(dialog).toBeVisible();
    await expect(page.locator('.floating-ai-chat')).toHaveCount(1);
  } finally {
    await page.evaluate(() => {
      window.localStorage.removeItem('hojeong-ai-chat-collapsed');
      window.localStorage.removeItem('hojeong-year-end-event-hide-until');
      window.sessionStorage.removeItem('hojeong-year-end-event-dismissed-session');
    }).catch(() => undefined);
  }
});

test('honors an explicit collapsed preference for the floating AI chat on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });

  await page.addInitScript(() => {
    window.localStorage.setItem('hojeong-ai-chat-collapsed', 'true');
    window.localStorage.setItem(
      'hojeong-year-end-event-hide-until',
      String(Date.now() + 24 * 60 * 60 * 1000),
    );
    window.sessionStorage.removeItem('hojeong-year-end-event-dismissed-session');
  });

  try {
    await page.goto('/ko/reviews', { waitUntil: 'commit' });
    await page.waitForLoadState('load');

    await expect(page.locator('.floating-ai-chat')).toHaveCount(0);
    await expect(page.getByRole('dialog', { name: 'AI 상담사' })).toHaveCount(0);

    const toggle = page.locator('.quick-contact-toggle').first();
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  } finally {
    await page.evaluate(() => {
      window.localStorage.removeItem('hojeong-ai-chat-collapsed');
      window.localStorage.removeItem('hojeong-year-end-event-hide-until');
      window.sessionStorage.removeItem('hojeong-year-end-event-dismissed-session');
    }).catch(() => undefined);
  }
});

test('footer skyline image renders eagerly with a real natural width', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem('hojeong-ai-chat-collapsed', 'true');
    window.localStorage.setItem(
      'hojeong-year-end-event-hide-until',
      String(Date.now() + 24 * 60 * 60 * 1000),
    );
    window.sessionStorage.removeItem('hojeong-year-end-event-dismissed-session');
  });

  try {
    await page.goto('/ko', { waitUntil: 'commit' });
    await page.waitForLoadState('load');

    const skyline = page.locator('.skyline-image img').first();
    await expect(skyline).toBeAttached();
    await expect(skyline).toHaveAttribute('loading', 'eager');
    await expect.poll(async () => skyline.evaluate((element) => {
      if (!(element instanceof HTMLImageElement)) {
        return 0;
      }

      return element.naturalWidth;
    })).toBeGreaterThan(0);
  } finally {
    await page.evaluate(() => {
      window.localStorage.removeItem('hojeong-ai-chat-collapsed');
      window.localStorage.removeItem('hojeong-year-end-event-hide-until');
      window.sessionStorage.removeItem('hojeong-year-end-event-dismissed-session');
    }).catch(() => undefined);
  }
});
