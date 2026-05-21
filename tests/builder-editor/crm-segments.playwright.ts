import { expect, test } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'scope';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

test('POST creates a CRM segment, GET lists it', async ({ page }) => {
  test.setTimeout(60_000);
  const token = `seg-${Date.now().toString(36)}`;
  await page.setExtraHTTPHeaders(mutationHeaders(token));

  const createRes = await page.request.post('/api/builder/crm/segments', {
    data: {
      name: `pw-segment-${token}`,
      description: 'pw test segment',
      matchMode: 'all',
      rules: [{ kind: 'tag', tag: 'lead' }],
    },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(createRes.status()).toBe(201);
  const created = (await createRes.json()) as {
    ok: boolean;
    segment: { id: string; name: string; rules: Array<{ kind: string }> };
  };
  expect(created.ok).toBe(true);
  expect(created.segment.id).toBeTruthy();
  expect(created.segment.rules.length).toBe(1);

  const listRes = await page.request.get('/api/builder/crm/segments');
  expect(listRes.status()).toBe(200);
  const list = (await listRes.json()) as {
    ok: boolean;
    segments: Array<{ id: string; name: string }>;
    total: number;
  };
  expect(list.ok).toBe(true);
  expect(list.segments.some((s) => s.id === created.segment.id)).toBe(true);
});

test('POST rejects invalid segment payload (no rules)', async ({ page }) => {
  await page.setExtraHTTPHeaders(mutationHeaders('seg-invalid'));
  const res = await page.request.post('/api/builder/crm/segments', {
    data: { name: 'bad', rules: [] },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders('seg-invalid') },
  });
  expect(res.status()).toBe(400);
});