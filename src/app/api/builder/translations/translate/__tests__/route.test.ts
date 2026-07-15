import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getUsageSnapshot,
  listAvailableProviders,
  translateViaRouter,
} from '@/lib/builder/translations/providers/router';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'translator@example.test' })),
}));

vi.mock('@/lib/builder/translations/providers/router', () => ({
  getUsageSnapshot: vi.fn(() => ({ total: 0, byProvider: {}, charactersBilled: 0, cacheHits: 0, errors: 0 })),
  listAvailableProviders: vi.fn(() => [{ id: 'mock', configured: true }]),
  translateViaRouter: vi.fn(),
}));

const guardMutationMock = vi.mocked(guardMutation);
const getUsageSnapshotMock = vi.mocked(getUsageSnapshot);
const listAvailableProvidersMock = vi.mocked(listAvailableProviders);
const translateViaRouterMock = vi.mocked(translateViaRouter);

function request(method: string, body?: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/translations/translate', {
    method,
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder translations translate API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'translator@example.test' } as never);
    getUsageSnapshotMock.mockReturnValue({ total: 0, byProvider: {}, charactersBilled: 0, cacheHits: 0, errors: 0 } as never);
    listAvailableProvidersMock.mockReturnValue([{ id: 'mock', configured: true }] as never);
    translateViaRouterMock.mockResolvedValue({ ok: true, provider: 'mock', text: 'Hello' } as never);
  });

  it('returns provider metadata while preserving GET success response shape', async () => {
    const response = await GET(request('GET'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({
      ok: true,
      providers: [{ id: 'mock', configured: true }],
      usage: { total: 0, byProvider: {}, charactersBilled: 0, cacheHits: 0, errors: 0 },
    });
  });

  it('translates text while preserving POST success response shape', async () => {
    const response = await POST(request('POST', {
      sourceLocale: 'ko',
      targetLocale: 'en',
      sourceText: '안녕하세요',
      provider: 'mock',
      locale: 'en',
    }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(translateViaRouterMock).toHaveBeenCalledWith({
      sourceLocale: 'ko',
      targetLocale: 'en',
      sourceText: '안녕하세요',
      preferProvider: 'mock',
    });
    expect(data).toEqual({ ok: true, provider: 'mock', text: 'Hello' });
  });

  it('returns localized validation errors', async () => {
    const response = await POST(request('POST', {
      sourceLocale: 'ko',
      targetLocale: 'ko',
      sourceText: '안녕하세요',
      locale: 'zh-hant',
    }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: '請確認翻譯請求。',
      errorCode: 'invalid_request',
    });
    expect(translateViaRouterMock).not.toHaveBeenCalled();
  });

  it('returns localized provider-unconfigured errors without provider details as copy', async () => {
    translateViaRouterMock.mockResolvedValueOnce({
      ok: false,
      provider: 'openai',
      reason: 'unconfigured',
      error: 'OPENAI_API_KEY missing',
    } as never);

    const response = await POST(request('POST', {
      sourceLocale: 'ko',
      targetLocale: 'en',
      sourceText: '안녕하세요',
      provider: 'openai',
      locale: 'en',
    }));
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data).toEqual({
      ok: false,
      error: 'No translation provider is configured.',
      errorCode: 'translation_provider_unconfigured',
      provider: 'openai',
    });
    expect(JSON.stringify(data)).not.toContain('OPENAI_API_KEY');
  });

  it('preserves fail-closed mock-provider errors without returning source text', async () => {
    translateViaRouterMock.mockResolvedValueOnce({
      ok: false,
      provider: 'mock',
      reason: 'unconfigured',
    } as never);

    const response = await POST(request('POST', {
      sourceLocale: 'ko',
      targetLocale: 'en',
      sourceText: '안녕하세요',
      provider: 'mock',
      locale: 'en',
    }));
    const data = await response.json();

    expect(response.status).toBe(503);
    expect(data).toEqual({
      ok: false,
      error: 'No translation provider is configured.',
      errorCode: 'translation_provider_unconfigured',
      provider: 'mock',
    });
    expect(JSON.stringify(data)).not.toContain('안녕하세요');
  });

  it('returns localized provider failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    translateViaRouterMock.mockRejectedValueOnce(new Error('translation provider secret leaked'));

    const response = await POST(request('POST', {
      sourceLocale: 'ko',
      targetLocale: 'en',
      sourceText: '안녕하세요',
      locale: 'en',
    }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: 'Unable to complete the translation provider request.',
      errorCode: 'translation_provider_failed',
    });
    expect(JSON.stringify(data)).not.toContain('translation provider secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/translations/translate] provider request failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
