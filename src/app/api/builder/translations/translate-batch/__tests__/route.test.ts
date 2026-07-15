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
  return new NextRequest('https://law.example.test/api/builder/translations/translate-batch', {
    method: 'POST',
    headers: {
      cookie: 'session=abc',
      authorization: 'Bearer token',
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder translations translate-batch API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
    translateBatchViaRouterMock.mockResolvedValue({
      results: [{ key: 'page:home:title', ok: true, provider: 'mock', text: 'Hello' }],
      summary: {
        provider: 'mock',
        mode: 'native-batch',
        requested: 1,
        succeeded: 1,
        failed: 0,
      },
    });
  });

  it('returns localized validation errors', async () => {
    const response = await POST(request({ locale: 'zh-hant' }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: '請確認翻譯請求。',
      errorCode: 'invalid_request',
    });
  });

  it('rejects equal normalized source and target locales before invoking the router', async () => {
    const response = await POST(request({
      locale: 'zh-hant',
      sourceLocale: 'zh-hant',
      targetLocale: 'zh-hant',
      entries: [{ key: 'page:home:title', sourceText: '標題' }],
    }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: '請確認翻譯請求。',
      errorCode: 'invalid_request',
    });
    expect(translateBatchViaRouterMock).not.toHaveBeenCalled();
  });

  it('returns batch results through one provider-native router call without recursive translate HTTP calls', async () => {
    const fetchMock = vi.fn(async () => {
      throw new Error('recursive translate HTTP should not be called');
    });
    vi.stubGlobal('fetch', fetchMock);
    translateBatchViaRouterMock.mockResolvedValueOnce({
      results: [
        { key: 'page:home:title', ok: true, provider: 'mock', text: 'Hello' },
        { key: 'page:home:body', ok: true, provider: 'mock', text: 'World' },
      ],
      summary: {
        provider: 'mock',
        mode: 'native-batch',
        requested: 2,
        succeeded: 2,
        failed: 0,
      },
    });

    const response = await POST(request({
      sourceLocale: 'ko',
      targetLocale: 'en',
      locale: 'en',
      provider: 'mock',
      entries: [
        { key: 'page:home:title', sourceText: '안녕하세요' },
        { key: 'page:home:body', sourceText: '세계' },
      ],
    }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      ok: true,
      results: [
        { key: 'page:home:title', ok: true, text: 'Hello' },
        { key: 'page:home:body', ok: true, text: 'World' },
      ],
      summary: {
        provider: 'mock',
        mode: 'native-batch',
        requested: 2,
        succeeded: 2,
        failed: 0,
      },
    });
    expect(fetchMock).not.toHaveBeenCalled();
    expect(translateBatchViaRouterMock).toHaveBeenCalledTimes(1);
    expect(translateBatchViaRouterMock).toHaveBeenCalledWith({
      sourceLocale: 'ko',
      targetLocale: 'en',
      preferProvider: 'mock',
      items: [
        { key: 'page:home:title', sourceText: '안녕하세요' },
        { key: 'page:home:body', sourceText: '세계' },
      ],
    });
  });

  it('returns localized batch failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    translateBatchViaRouterMock.mockRejectedValueOnce(
      new Error(rawProviderFailure),
    );

    const response = await POST(request({
      sourceLocale: 'ko',
      targetLocale: 'en',
      locale: 'en',
      entries: [{ key: 'page:home:title', sourceText: '안녕하세요' }],
    }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: 'Unable to complete the batch translation.',
      errorCode: 'translation_batch_failed',
    });
    expectNoSensitiveFailureDetails(JSON.stringify(data));
    expect(consoleError.mock.calls).toEqual([[
      '[builder/translations/translate-batch] batch failed',
      { code: 'translation_batch_failed' },
    ]]);
    expectNoSensitiveFailureDetails(JSON.stringify(consoleError.mock.calls));
    consoleError.mockRestore();
  });

  it('returns ok false and 503 when every entry fails because the provider is unconfigured', async () => {
    translateBatchViaRouterMock.mockResolvedValueOnce({
      results: [
        { key: 'title', ok: false, provider: 'openai', reason: 'unconfigured', error: rawProviderFailure },
        { key: 'body', ok: false, provider: 'openai', reason: 'unconfigured', error: rawProviderFailure },
      ],
      summary: {
        provider: 'openai',
        mode: 'native-batch',
        requested: 2,
        succeeded: 0,
        failed: 2,
      },
    });

    const response = await POST(request({
      locale: 'en',
      sourceLocale: 'ko',
      targetLocale: 'en',
      provider: 'openai',
      entries: [
        { key: 'title', sourceText: '제목' },
        { key: 'body', sourceText: '본문' },
      ],
    }));
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data).toEqual({
      ok: false,
      results: [
        {
          key: 'title',
          ok: false,
          error: 'No translation provider is configured.',
          errorCode: 'translation_provider_unconfigured',
        },
        {
          key: 'body',
          ok: false,
          error: 'No translation provider is configured.',
          errorCode: 'translation_provider_unconfigured',
        },
      ],
      summary: {
        provider: 'openai',
        mode: 'native-batch',
        requested: 2,
        succeeded: 0,
        failed: 2,
      },
    });
    expectNoSensitiveFailureDetails(JSON.stringify(data));
  });

  it('replaces malformed provider fields with a sanitized stable failure DTO and a 502 status', async () => {
    translateBatchViaRouterMock.mockResolvedValueOnce({
      results: [
        { key: 'title', ok: true, provider: 'deepl', text: 'Title' },
        {
          key: 'body',
          ok: false,
          provider: rawProviderFailure as never,
          reason: rawProviderFailure as never,
          error: rawProviderFailure,
        },
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
    const data = await response.json();

    expect(response.status).toBe(502);
    expect(data.ok).toBe(false);
    expect(data.results).toEqual([
      { key: 'title', ok: true, text: 'Title' },
      {
        key: 'body',
        ok: false,
        error: 'Unable to complete the translation provider request.',
        errorCode: 'translation_provider_failed',
      },
    ]);
    expect(data.summary).toMatchObject({ succeeded: 1, failed: 1 });
    expectNoSensitiveFailureDetails(JSON.stringify(data));
  });
});
