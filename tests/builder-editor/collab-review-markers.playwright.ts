import { expect, test } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'scope';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

test('review markers: POST creates, PATCH resolve, DELETE removes', async ({ page }) => {
  test.setTimeout(60_000);
  const token = `marker-${Date.now().toString(36)}`;
  const pageId = `pw-page-${token}`;
  const nodeId = `pw-node-${token}`;
  await page.setExtraHTTPHeaders(mutationHeaders(token));

  const createRes = await page.request.post('/api/builder/collab/review-markers', {
    data: { pageId, nodeId, kind: 'comment', text: 'Needs a clearer CTA' },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(createRes.status()).toBe(200);
  const created = (await createRes.json()) as {
    ok: boolean;
    marker: { id: string; pageId: string; nodeId: string; kind: string; resolvedAt?: string | null };
  };
  expect(created.ok).toBe(true);
  expect(created.marker.id).toBeTruthy();
  expect(created.marker.kind).toBe('comment');

  const resolveRes = await page.request.patch(
    `/api/builder/collab/review-markers/${encodeURIComponent(created.marker.id)}`,
    {
      data: { action: 'resolve' },
      headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
    },
  );
  expect(resolveRes.status()).toBe(200);
  const resolved = (await resolveRes.json()) as { ok: boolean; marker: { resolvedAt?: string | null } };
  expect(resolved.marker.resolvedAt).toBeTruthy();

  const deleteRes = await page.request.delete(
    `/api/builder/collab/review-markers/${encodeURIComponent(created.marker.id)}`,
    { headers: mutationHeaders(token) },
  );
  expect(deleteRes.status()).toBe(200);
  const deleted = (await deleteRes.json()) as { ok: boolean };
  expect(deleted.ok).toBe(true);
});

test('review markers: POST rejects invalid kind', async ({ page }) => {
  await page.setExtraHTTPHeaders(mutationHeaders('marker-invalid'));
  const res = await page.request.post('/api/builder/collab/review-markers', {
    data: { pageId: 'p1', nodeId: 'n1', kind: 'bogus', text: 'x' },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders('marker-invalid') },
  });
  expect(res.status()).toBe(400);
});