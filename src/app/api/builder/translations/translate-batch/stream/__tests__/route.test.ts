import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { translateBatchViaRouter } from '@/lib/builder/translations/providers/router';
import { POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'translator@example.test' })),
}));

vi.mock('@/lib/builder/translations/providers/router', () => ({
  translateBatchViaRouter: vi.fn(),
}));

const translateBatchViaRouterMock = vi.mocked(translateBatchViaRouter);

const sensitiveFailureFragments = [
  '<html>',
  'provider body',
  'super-secret',
  'query-secret',
  '민감한 고객 사실관계',
  'ECONNRESET',
  'STACK_TRACE_MARKER',
] as const;
const rawProviderFailure = [
  '<html>provider body</html>',
  'Authorization: Bearer super-secret',
  'https://provider.example/v2?api_key=query-secret',
  '민감한 고객 사실관계',
  'ECONNRESET network failure',
  'STACK_TRACE_MARKER at sendRequest',
].join(' | ');

function expectNoSensitiveFailureDetails(serialized: string): void {
  for (const fragment of sensitiveFailureFragments) {
    expect(serialized).not.toContain(fragment);
  }
}

function request(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/translations/translate-batch/stream', {
    method: 'POST',
    headers: {
      cookie: 'session=abc',
      authorization: 'Bearer token',
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder translations translate-batch stream API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('streams provider progress before final batch results', async () => {
    translateBatchViaRouterMock.mockImplementationOnce(async (args) => {
      args.onProgress?.({
        provider: 'mock',
        mode: 'native-batch',
        requested: 1,
        succeeded: 0,
        failed: 0,
      });
      return {
        results: [{ key: 'page:home:title', ok: true, provider: 'mock', text: 'Hello' }],
        summary: {
          provider: 'mock',
          mode: 'native-batch',
          requested: 1,
          succeeded: 1,
          failed: 0,
        },
      };
    });

    const response = await POST(request({
      sourceLocale: 'ko',
      targetLocale: 'en',
      locale: 'ko',
      provider: 'mock',
      entries: [{ key: 'page:home:title', sourceText: '안녕하세요' }],
    }));
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toBe('text/event-stream');
    expect(body.indexOf('event: progress')).toBeGreaterThanOrEqual(0);
    expect(body.indexOf('event: result')).toBeGreaterThan(body.indexOf('event: progress'));
    expect(body.indexOf('"sequence":1')).toBeGreaterThan(body.indexOf('event: progress'));
    expect(body.indexOf('"sequence":2')).toBeGreaterThan(body.indexOf('"sequence":1'));
    expect(body).toContain('"succeeded":0');
    expect(body).toContain('"succeeded":1');
  });

  it('rejects equal normalized source and target locales before opening a stream', async () => {
    const response = await POST(request({
      locale: 'en',
      sourceLocale: 'en',
      targetLocale: 'en',
      entries: [{ key: 'page:home:title', sourceText: 'Title' }],
    }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(response.headers.get('content-type')).toContain('application/json');
    expect(data).toEqual({
      ok: false,
      error: 'Check the translation request.',
      errorCode: 'invalid_request',
    });
    expect(translateBatchViaRouterMock).not.toHaveBeenCalled();
  });

  it('streams sanitized stable failure fields in a final ok false payload', async () => {
    translateBatchViaRouterMock.mockResolvedValueOnce({
      results: [
        { key: 'title', ok: true, provider: 'deepl', text: 'Title' },
        { key: 'body', ok: false, provider: 'deepl', reason: 'network', error: rawProviderFailure },
      ],
      summary: {
        provider: 'deepl',
        mode: 'native-batch',
        requested: 2,
        succeeded: 1,
        failed: 1,
      },
    });

    const response = await POST(request({
      locale: 'en',
      sourceLocale: 'ko',
      targetLocale: 'en',
      entries: [
        { key: 'title', sourceText: '제목' },
        { key: 'body', sourceText: '본문' },
      ],
    }));
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain('event: result');
    expect(body).toContain('"payload":{"ok":false');
    expect(body).toContain('"succeeded":1');
    expect(body).toContain('"failed":1');
    expect(body).toContain(
      '"key":"body","ok":false,"error":"Unable to complete the translation provider request.",'
      + '"errorCode":"translation_provider_failed"',
    );
    expectNoSensitiveFailureDetails(body);
  });

  it('streams and logs only generic details when the provider router throws', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    translateBatchViaRouterMock.mockRejectedValueOnce(new Error(rawProviderFailure));

    const response = await POST(request({
      locale: 'en',
      sourceLocale: 'ko',
      targetLocale: 'en',
      entries: [{ key: 'title', sourceText: '민감한 고객 사실관계' }],
    }));
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(body).toContain('event: error');
    expect(body).toContain('"type":"error"');
    expect(body).toContain('"error":"Unable to complete the batch translation."');
    expectNoSensitiveFailureDetails(body);
    expect(consoleError.mock.calls).toEqual([[
      '[builder/translations/translate-batch/stream] batch failed',
      { code: 'translation_batch_failed' },
    ]]);
    expectNoSensitiveFailureDetails(JSON.stringify(consoleError.mock.calls));
    consoleError.mockRestore();
  });
});
