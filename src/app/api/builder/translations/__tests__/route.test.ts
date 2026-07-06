import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  saveTranslationValue,
  syncTranslationsForSite,
} from '@/lib/builder/translations/sync';
import { GET, PATCH, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'translator@example.test' })),
}));

vi.mock('@/lib/builder/translations/sync', () => ({
  DEFAULT_TRANSLATION_SOURCE_LOCALE: 'ko',
  saveTranslationValue: vi.fn(),
  syncTranslationsForSite: vi.fn(),
}));

const payload = {
  ok: true,
  siteId: 'default',
  sourceLocale: 'ko',
  targetLocales: ['zh-hant', 'en'],
  entries: [],
  stats: {
    total: 0,
    missing: 0,
    outdated: 0,
    translated: 0,
    reviewed: 0,
  },
};

const entry = {
  key: 'page:home:title',
  sourceLocale: 'ko',
  sourceText: '홈',
  sourceHash: 'hash-1',
  content: { category: 'page' },
  translations: {},
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const guardMutationMock = vi.mocked(guardMutation);
const saveTranslationValueMock = vi.mocked(saveTranslationValue);
const syncTranslationsForSiteMock = vi.mocked(syncTranslationsForSite);

function request(method: string, query = '', body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/translations${query ? `?${query}` : ''}`, {
    method,
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder translations API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'translator@example.test' } as never);
    syncTranslationsForSiteMock.mockResolvedValue(payload as never);
    saveTranslationValueMock.mockResolvedValue({
      payload,
      entry,
      applied: true,
    } as never);
  });

  it('syncs translations while preserving GET success response shape', async () => {
    const response = await GET(request('GET', 'sourceLocale=ko'));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(syncTranslationsForSiteMock).toHaveBeenCalledWith('default', 'ko');
    expect(data).toEqual(payload);
  });

  it('returns localized sync failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    syncTranslationsForSiteMock.mockRejectedValueOnce(new Error('translation sync secret leaked'));

    const response = await POST(request('POST', '', { sourceLocale: 'zh-hant' }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: '無法同步翻譯項目。',
      errorCode: 'translation_sync_failed',
    });
    expect(JSON.stringify(data)).not.toContain('translation sync secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/translations] POST sync failed:', expect.any(Error));
    consoleError.mockRestore();
  });

  it('returns localized validation errors', async () => {
    const response = await PATCH(request('PATCH', 'locale=en', {
      key: 'page:home:title',
      targetLocale: 'ko',
      text: 'Home',
      sourceLocale: 'ko',
    }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: 'Check the translation request.',
      errorCode: 'invalid_request',
    });
    expect(saveTranslationValueMock).not.toHaveBeenCalled();
  });

  it('saves translation values while preserving PATCH success response shape', async () => {
    const response = await PATCH(request('PATCH', '', {
      key: 'page:home:title',
      targetLocale: 'en',
      text: 'Home',
      status: 'translated',
      provider: 'manual',
      sourceLocale: 'ko',
    }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(saveTranslationValueMock).toHaveBeenCalledWith({
      key: 'page:home:title',
      targetLocale: 'en',
      sourceLocale: 'ko',
      text: 'Home',
      status: 'translated',
      provider: 'manual',
      reviewedBy: 'translator@example.test',
    });
    expect(data).toEqual({
      ok: true,
      entry,
      applied: true,
      payload,
    });
  });

  it('returns localized not-found errors', async () => {
    saveTranslationValueMock.mockRejectedValueOnce(new Error('translation_entry_not_found'));

    const response = await PATCH(request('PATCH', '', {
      key: 'missing',
      targetLocale: 'zh-hant',
      text: '您好',
      sourceLocale: 'ko',
    }));
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toEqual({
      ok: false,
      error: '번역 항목을 찾을 수 없습니다.',
      errorCode: 'translation_entry_not_found',
    });
  });

  it('returns localized save failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    saveTranslationValueMock.mockRejectedValueOnce(new Error('translation save secret leaked'));

    const response = await PATCH(request('PATCH', 'locale=en', {
      key: 'page:home:title',
      targetLocale: 'zh-hant',
      text: '您好',
      sourceLocale: 'ko',
    }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: 'Unable to save the translation.',
      errorCode: 'translation_save_failed',
    });
    expect(JSON.stringify(data)).not.toContain('translation save secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/translations] PATCH save failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
