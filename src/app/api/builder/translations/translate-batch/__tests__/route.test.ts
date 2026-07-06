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
      new Error('batch secret leaked'),
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
    expect(JSON.stringify(data)).not.toContain('batch secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/translations/translate-batch] batch failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
