import { expect, test } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'scope';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

test('POST /api/builder/ai-generator/page-spec returns a spec with sections', async ({ page }) => {
  test.setTimeout(60_000);
  const token = `pgspec-${Date.now().toString(36)}`;
  await page.setExtraHTTPHeaders(mutationHeaders(token));

  const res = await page.request.post('/api/builder/ai-generator/page-spec', {
    data: {
      purpose: 'Showcase our law firm services and book consultations',
      audience: 'Small business owners in Seoul',
      targetAction: 'Book a free 15-minute consultation',
      locale: 'ko',
      industry: 'legal',
      intent: 'lead-capture',
    },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(res.status()).toBe(200);
  const body = (await res.json()) as {
    ok: boolean;
    usedFallback: boolean;
    model: string;
    spec: {
      pageTitle: string;
      pageDescription: string;
      sections: Array<{ sectionKind: string; headline: string }>;
    };
  };
  expect(body.ok).toBe(true);
  expect(typeof body.usedFallback).toBe('boolean');
  expect(typeof body.model).toBe('string');
  expect(body.spec.sections.length).toBeGreaterThan(0);
  expect(body.spec.pageTitle.length).toBeGreaterThan(0);
});

test('POST /api/builder/ai-generator/page-spec rejects invalid payload', async ({ page }) => {
  await page.setExtraHTTPHeaders(mutationHeaders('pgspec-invalid'));
  const res = await page.request.post('/api/builder/ai-generator/page-spec', {
    data: { purpose: '' },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders('pgspec-invalid') },
  });
  expect(res.status()).toBe(400);
});