import { expect, test } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'scope';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

test('billing-documents/templates: POST creates, GET lists', async ({ page }) => {
  test.setTimeout(60_000);
  const token = `bill-tpl-${Date.now().toString(36)}`;
  await page.setExtraHTTPHeaders(mutationHeaders(token));

  const createRes = await page.request.post('/api/builder/billing-documents/templates', {
    data: {
      name: `pw-template-${token}`,
      language: 'ko',
      headerHtml: '<h1>Header</h1>',
      footerHtml: '<p>Footer</p>',
      accentColor: '#336699',
      includeQrCode: false,
      isDefault: false,
    },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(createRes.status()).toBe(201);
  const created = (await createRes.json()) as {
    ok: boolean;
    template: { id: string; name: string; language: string };
  };
  expect(created.ok).toBe(true);
  expect(created.template.id).toBeTruthy();
  expect(created.template.language).toBe('ko');

  const listRes = await page.request.get('/api/builder/billing-documents/templates');
  expect(listRes.status()).toBe(200);
  const list = (await listRes.json()) as {
    ok: boolean;
    templates: Array<{ id: string }>;
    total: number;
  };
  expect(list.ok).toBe(true);
  expect(list.templates.some((t) => t.id === created.template.id)).toBe(true);
});

test('billing-documents/templates: POST rejects invalid language', async ({ page }) => {
  await page.setExtraHTTPHeaders(mutationHeaders('bill-tpl-invalid'));
  const res = await page.request.post('/api/builder/billing-documents/templates', {
    data: { name: 'bad', language: 'fr' },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders('bill-tpl-invalid') },
  });
  expect(res.status()).toBe(400);
});