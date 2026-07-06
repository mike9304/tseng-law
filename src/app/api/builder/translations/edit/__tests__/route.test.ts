import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  applyImageOverridesToLocaleDraft,
  applyTranslationToLocaleDraft,
  setPageLocaleSeoOverride,
} from '@/lib/builder/translations/edit-store';
import { POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'translator@example.test' })),
}));

vi.mock('@/lib/builder/translations/edit-store', () => ({
  applyImageOverridesToLocaleDraft: vi.fn(),
  applyTranslationToLocaleDraft: vi.fn(),
  setPageLocaleSeoOverride: vi.fn(),
}));

const guardMutationMock = vi.mocked(guardMutation);
const applyImageOverridesToLocaleDraftMock = vi.mocked(applyImageOverridesToLocaleDraft);
const applyTranslationToLocaleDraftMock = vi.mocked(applyTranslationToLocaleDraft);
const setPageLocaleSeoOverrideMock = vi.mocked(setPageLocaleSeoOverride);

function request(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/translations/edit', {
    method: 'POST',
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder translations edit API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'translator@example.test' } as never);
    applyTranslationToLocaleDraftMock.mockResolvedValue({
      ok: true,
      appliedCount: 1,
      skipped: [],
      targetPageId: 'page-home-en',
    } as never);
    applyImageOverridesToLocaleDraftMock.mockResolvedValue({
      ok: true,
      appliedCount: 1,
      targetPageId: 'page-home-en',
    } as never);
    setPageLocaleSeoOverrideMock.mockResolvedValue(true as never);
  });

  it('applies node translation edits while preserving success response shape', async () => {
    const response = await POST(request({
      siteId: 'default',
      pageId: 'page-home-ko',
      sourceLocale: 'ko',
      targetLocale: 'en',
      nodeUpdates: {
        heroTitle: { text: 'Home', path: 'content.text' },
      },
    }));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(applyTranslationToLocaleDraftMock).toHaveBeenCalledWith(
      'default',
      'ko',
      'en',
      'page-home-ko',
      { heroTitle: { text: 'Home', path: 'content.text' } },
    );
    expect(data).toEqual({
      ok: true,
      nodeUpdates: {
        appliedCount: 1,
        skipped: [],
        targetPageId: 'page-home-en',
      },
      seoApplied: false,
      imageOverrides: null,
    });
  });

  it('returns localized invalid JSON errors', async () => {
    const response = await POST(request('{'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: '번역 요청 형식을 확인해 주세요.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized validation errors', async () => {
    const response = await POST(request({
      locale: 'zh-hant',
      pageId: 'page-home-ko',
      sourceLocale: 'ko',
      targetLocale: 'ko',
      nodeUpdates: { heroTitle: { text: '首頁' } },
    }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: '請確認翻譯請求。',
      errorCode: 'invalid_request',
    });
    expect(applyTranslationToLocaleDraftMock).not.toHaveBeenCalled();
  });

  it('returns localized no-update errors', async () => {
    const response = await POST(request({
      locale: 'en',
      pageId: 'page-home-ko',
      sourceLocale: 'ko',
      targetLocale: 'en',
    }));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      error: 'There are no translation changes to save.',
      errorCode: 'no_updates_provided',
    });
  });

  it('returns localized edit failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    applyTranslationToLocaleDraftMock.mockRejectedValueOnce(new Error('translation edit secret leaked'));

    const response = await POST(request({
      locale: 'en',
      pageId: 'page-home-ko',
      sourceLocale: 'ko',
      targetLocale: 'en',
      nodeUpdates: {
        heroTitle: { text: 'Home' },
      },
    }));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({
      ok: false,
      error: 'Unable to save translation edits.',
      errorCode: 'translation_edit_failed',
    });
    expect(JSON.stringify(data)).not.toContain('translation edit secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/translations/edit] save failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
