import { expect, test } from '@playwright/test';

test('GET /api/builder/crm/tracking/open/:token returns a 1x1 GIF (even for invalid token)', async ({ page }) => {
  test.setTimeout(60_000);

  const res = await page.request.get('/api/builder/crm/tracking/open/pw-bogus-token-xyz');
  expect(res.status()).toBe(200);
  const contentType = res.headers()['content-type'] || '';
  expect(contentType).toContain('image/gif');

  // Cache-Control header should prevent caching so opens get recounted.
  const cacheControl = res.headers()['cache-control'] || '';
  expect(cacheControl).toContain('no-store');

  const bytes = await res.body();
  expect(bytes.length).toBeGreaterThan(0);
  // GIF header magic — first 3 bytes should be ASCII "GIF"
  expect(bytes.slice(0, 3).toString('ascii')).toBe('GIF');
});