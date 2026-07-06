import { expect, test } from '@playwright/test';
import { createDefaultCanvasDocument } from '@/lib/builder/canvas/types';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'responsive-ai';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function numberField(record: Record<string, unknown>, key: string): number | null {
  const value = record[key];
  return typeof value === 'number' ? value : null;
}

function recordField(record: Record<string, unknown>, key: string): Record<string, unknown> | null {
  const value = record[key];
  return isRecord(value) ? value : null;
}

test('POST /api/builder/ai-generator/responsive surfaces media viewport overflow suggestions', async ({ page }) => {
  const token = `responsive-overflow-${Date.now().toString(36)}`;
  await page.setExtraHTTPHeaders(mutationHeaders(token));

  const response = await page.request.post('/api/builder/ai-generator/responsive', {
    data: {
      pageId: 'home',
      locale: 'ko',
      targetViewport: 'mobile',
      canvas: createDefaultCanvasDocument('ko'),
      safeWidth: 360,
    },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(response.status()).toBe(200);

  const payload: unknown = await response.json();
  expect(isRecord(payload) ? payload.ok : undefined).toBe(true);
  const suggestions = isRecord(payload) && Array.isArray(payload.suggestions)
    ? payload.suggestions.filter(isRecord)
    : [];
  const imageSuggestion = suggestions.find((suggestion) => (
    suggestion.nodeId === 'hero-image-1'
    && suggestion.reason === 'node-overflows-viewport'
  ));
  expect(imageSuggestion).toBeTruthy();
  const rect = imageSuggestion ? recordField(recordField(imageSuggestion, 'mobileOverride') ?? {}, 'rect') : null;
  expect(rect ? numberField(rect, 'x') : null).toBeGreaterThanOrEqual(16);
  expect(rect ? numberField(rect, 'width') : null).toBeLessThanOrEqual(360);
});
