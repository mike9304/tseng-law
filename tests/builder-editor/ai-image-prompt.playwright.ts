import { expect, test } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'scope';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

test('POST /api/builder/ai-generator/image-prompt returns prompt and register', async ({ page }) => {
  test.setTimeout(60_000);
  const token = `imgprm-${Date.now().toString(36)}`;
  await page.setExtraHTTPHeaders(mutationHeaders(token));

  const res = await page.request.post('/api/builder/ai-generator/image-prompt', {
    data: {
      pagePurpose: 'Hero image for a law firm consultation landing page',
      sectionKind: 'hero',
      locale: 'ko',
      industry: 'legal',
      visualDirection: 'calm, professional, soft natural light',
      aspect: '16:9',
    },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(res.status()).toBe(200);
  const body = (await res.json()) as {
    ok: boolean;
    prompt: string;
    register: string;
    modifiers: string[];
    composition: string;
    lighting: string;
    negativeSpace: string;
    usedSavedBrandVoice: boolean;
  };
  expect(body.ok).toBe(true);
  expect(body.prompt.length).toBeGreaterThan(10);
  expect(typeof body.register).toBe('string');
  expect(Array.isArray(body.modifiers)).toBe(true);
  expect(typeof body.usedSavedBrandVoice).toBe('boolean');
});

test('POST /api/builder/ai-generator/image-prompt rejects invalid sectionKind', async ({ page }) => {
  await page.setExtraHTTPHeaders(mutationHeaders('imgprm-invalid'));
  const res = await page.request.post('/api/builder/ai-generator/image-prompt', {
    data: { pagePurpose: 'x', sectionKind: 'not-real', locale: 'ko' },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders('imgprm-invalid') },
  });
  expect(res.status()).toBe(400);
});