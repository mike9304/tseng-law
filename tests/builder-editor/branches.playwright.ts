import { expect, test } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'scope';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

test('branches: POST creates, GET lists, PATCH discards', async ({ page }) => {
  test.setTimeout(60_000);
  const token = `branch-${Date.now().toString(36)}`;
  await page.setExtraHTTPHeaders(mutationHeaders(token));

  const createRes = await page.request.post('/api/builder/branches', {
    data: { name: `pw-branch-${token}`, baseRevisionId: `rev-${token}` },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(createRes.status()).toBe(201);
  const created = (await createRes.json()) as {
    ok: boolean;
    branch: { id: string; name: string; status: string };
  };
  expect(created.ok).toBe(true);
  expect(created.branch.id).toBeTruthy();
  expect(created.branch.status).toBe('draft');

  const listRes = await page.request.get('/api/builder/branches');
  expect(listRes.status()).toBe(200);
  const list = (await listRes.json()) as {
    ok: boolean;
    branches: Array<{ id: string }>;
  };
  expect(list.branches.some((b) => b.id === created.branch.id)).toBe(true);

  const patchRes = await page.request.patch(`/api/builder/branches/${encodeURIComponent(created.branch.id)}`, {
    data: { action: 'discard', reason: 'pw cleanup' },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(patchRes.status()).toBe(200);
  const patched = (await patchRes.json()) as { ok: boolean; branch: { status: string } };
  expect(patched.branch.status).toBe('discarded');
});

test('branches: POST rejects missing name', async ({ page }) => {
  await page.setExtraHTTPHeaders(mutationHeaders('branch-invalid'));
  const res = await page.request.post('/api/builder/branches', {
    data: { baseRevisionId: 'rev-x' },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders('branch-invalid') },
  });
  expect(res.status()).toBe(400);
});