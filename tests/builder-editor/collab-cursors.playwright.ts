import { expect, test } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'scope';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

test('collab cursors: POST sets cursor, GET lists active cursors for the page', async ({ page }) => {
  test.setTimeout(60_000);
  const token = `cursor-${Date.now().toString(36)}`;
  const pageId = `pw-page-${token}`;
  await page.setExtraHTTPHeaders(mutationHeaders(token));

  const postRes = await page.request.post('/api/builder/collab/cursors', {
    data: { pageId, x: 120, y: 240, label: 'PW' },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(postRes.status()).toBe(200);
  const posted = (await postRes.json()) as {
    ok: boolean;
    cursor: { userId: string; pageId: string; x: number; y: number; updatedAt: string };
    cursors: Array<{ pageId: string }>;
  };
  expect(posted.ok).toBe(true);
  expect(posted.cursor.pageId).toBe(pageId);
  expect(posted.cursor.x).toBe(120);
  expect(posted.cursor.y).toBe(240);

  const getRes = await page.request.get(`/api/builder/collab/cursors?pageId=${encodeURIComponent(pageId)}`);
  expect(getRes.status()).toBe(200);
  const listed = (await getRes.json()) as {
    ok: boolean;
    cursors: Array<{ pageId: string; userId: string }>;
  };
  expect(listed.ok).toBe(true);
  expect(listed.cursors.some((c) => c.pageId === pageId)).toBe(true);
});

test('collab cursors: GET requires pageId', async ({ page }) => {
  await page.setExtraHTTPHeaders(mutationHeaders('cursor-invalid'));
  const res = await page.request.get('/api/builder/collab/cursors');
  expect(res.status()).toBe(400);
});