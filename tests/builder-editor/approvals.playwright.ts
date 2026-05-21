import { expect, test } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'scope';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

test('approvals: POST requests approval on a fresh branch, PATCH approves it', async ({ page }) => {
  test.setTimeout(60_000);
  const token = `appr-${Date.now().toString(36)}`;
  await page.setExtraHTTPHeaders(mutationHeaders(token));

  const branchRes = await page.request.post('/api/builder/branches', {
    data: { name: `pw-appr-branch-${token}`, baseRevisionId: `rev-${token}` },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(branchRes.status()).toBe(201);
  const branch = (await branchRes.json()) as { branch: { id: string } };

  const reqRes = await page.request.post('/api/builder/approvals', {
    data: { branchId: branch.branch.id, comment: 'please review' },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(reqRes.status()).toBe(201);
  const approval = (await reqRes.json()) as {
    ok: boolean;
    approval: { id: string; status: string; branchId: string };
  };
  expect(approval.ok).toBe(true);
  expect(approval.approval.status).toBe('pending');
  expect(approval.approval.branchId).toBe(branch.branch.id);

  const decideRes = await page.request.patch(`/api/builder/approvals/${encodeURIComponent(approval.approval.id)}`, {
    data: { decision: 'approve', comment: 'lgtm' },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(decideRes.status()).toBe(200);
  const decided = (await decideRes.json()) as { ok: boolean; approval: { status: string } };
  expect(decided.approval.status).toBe('approved');
});

test('approvals: POST rejects missing branchId', async ({ page }) => {
  await page.setExtraHTTPHeaders(mutationHeaders('appr-invalid'));
  const res = await page.request.post('/api/builder/approvals', {
    data: {},
    headers: { 'Content-Type': 'application/json', ...mutationHeaders('appr-invalid') },
  });
  expect(res.status()).toBe(400);
});