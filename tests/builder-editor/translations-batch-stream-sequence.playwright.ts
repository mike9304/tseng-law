import { expect, test } from '@playwright/test';

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'translation-stream';
  return { 'x-forwarded-for': `pw-${safeScope}` };
}

test('POST /api/builder/translations/translate-batch/stream emits ordered SSE telemetry', async ({ request }) => {
  const token = `stream-seq-${Date.now().toString(36)}`;
  const response = await request.post('/api/builder/translations/translate-batch/stream', {
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
    data: {
      locale: 'ko',
      sourceLocale: 'ko',
      targetLocale: 'en',
      provider: 'mock',
      entries: [{ key: `page:home:title:${token}`, sourceText: `순서 검증 ${token}` }],
    },
  });
  const body = await response.text();

  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('text/event-stream');
  const progressIndex = body.indexOf('event: progress');
  const resultIndex = body.indexOf('event: result');
  const firstSequenceIndex = body.indexOf('"sequence":1');
  const secondSequenceIndex = body.indexOf('"sequence":2');
  const thirdSequenceIndex = body.indexOf('"sequence":3');
  const providerResultIndex = body.indexOf('"name":"provider-result"');
  const mockCompleteIndex = body.indexOf('"name":"mock-complete"');
  expect(progressIndex).toBeGreaterThanOrEqual(0);
  expect(resultIndex).toBeGreaterThan(progressIndex);
  expect(providerResultIndex).toBeGreaterThan(progressIndex);
  expect(mockCompleteIndex).toBeGreaterThan(providerResultIndex);
  expect(firstSequenceIndex).toBeGreaterThan(progressIndex);
  expect(secondSequenceIndex).toBeGreaterThan(firstSequenceIndex);
  expect(thirdSequenceIndex).toBeGreaterThan(secondSequenceIndex);
  expect(resultIndex).toBeGreaterThan(mockCompleteIndex);
});
