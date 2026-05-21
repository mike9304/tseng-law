import { expect, test } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'scope';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

test('POST /api/builder/ai-generator/theme suggest returns a palette', async ({ page }) => {
  test.setTimeout(60_000);
  const token = `theme-sug-${Date.now().toString(36)}`;
  await page.setExtraHTTPHeaders(mutationHeaders(token));

  const res = await page.request.post('/api/builder/ai-generator/theme', {
    data: { action: 'suggest', prompt: 'modern minimal law firm with calm blue accents' },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(res.status()).toBe(200);
  const body = (await res.json()) as {
    ok: boolean;
    suggestion: { colors: { primary: string; secondary: string; accent: string; background: string; text: string; muted: string } };
  };
  expect(body.ok).toBe(true);
  expect(typeof body.suggestion.colors.primary).toBe('string');
  expect(typeof body.suggestion.colors.accent).toBe('string');
});

test('POST /api/builder/ai-generator/theme analyze returns issues array', async ({ page }) => {
  const token = `theme-ana-${Date.now().toString(36)}`;
  await page.setExtraHTTPHeaders(mutationHeaders(token));
  const res = await page.request.post('/api/builder/ai-generator/theme', {
    data: {
      action: 'analyze',
      theme: {
        colors: {
          primary: '#ffffff',
          secondary: '#eeeeee',
          accent: '#dddddd',
          background: '#ffffff',
          text: '#f0f0f0',
          muted: '#fafafa',
        },
      },
    },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(res.status()).toBe(200);
  const body = (await res.json()) as { ok: boolean; issues: Array<{ severity?: string }> };
  expect(body.ok).toBe(true);
  expect(Array.isArray(body.issues)).toBe(true);
  // Low-contrast palette should produce at least one issue.
  expect(body.issues.length).toBeGreaterThan(0);
});