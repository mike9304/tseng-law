import { expect, test } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'scope';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

test('GET /api/builder/notifications returns inbox shape', async ({ page }) => {
  test.setTimeout(60_000);
  await page.setExtraHTTPHeaders(mutationHeaders('notif-list'));

  const res = await page.request.get('/api/builder/notifications?limit=10');
  expect(res.status()).toBe(200);
  const body = (await res.json()) as {
    ok: boolean;
    notifications: Array<{ id: string; readAt: string | null }>;
    total: number;
    unread: number;
  };
  expect(body.ok).toBe(true);
  expect(Array.isArray(body.notifications)).toBe(true);
  expect(typeof body.total).toBe('number');
  expect(typeof body.unread).toBe('number');
});

test('PUT /api/builder/notifications bulk marks all read', async ({ page }) => {
  const token = `notif-${Date.now().toString(36)}`;
  await page.setExtraHTTPHeaders(mutationHeaders(token));

  const res = await page.request.put('/api/builder/notifications', {
    data: {},
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(res.status()).toBe(200);
  const body = (await res.json()) as { ok: boolean; updated: number };
  expect(body.ok).toBe(true);
  expect(typeof body.updated).toBe('number');
});

test('PATCH /api/builder/notifications/:id returns 404 for unknown id', async ({ page }) => {
  await page.setExtraHTTPHeaders(mutationHeaders('notif-404'));
  const res = await page.request.patch('/api/builder/notifications/pw-no-such-id-xyz', {
    data: {},
    headers: { 'Content-Type': 'application/json', ...mutationHeaders('notif-404') },
  });
  expect(res.status()).toBe(404);
});