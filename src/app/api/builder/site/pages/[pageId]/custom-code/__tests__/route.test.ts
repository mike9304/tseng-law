import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { CUSTOM_CODE_MAX_LENGTH } from '@/lib/builder/site/custom-code';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { createDefaultSiteDocument, type BuilderSiteDocument } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/site/pages/[pageId]/custom-code/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

function patchRequest(body: unknown, query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/pages/page-home/custom-code${query}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/builder/site/pages/[pageId]/custom-code', () => {
  let site: BuilderSiteDocument;
  let pageId: string;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
    site = createDefaultSiteDocument('ko', 'default');
    pageId = site.pages[0]?.pageId ?? 'page-home';
    mockedReadSiteDocument.mockResolvedValue(site);
    mockedWriteSiteDocument.mockImplementation(async (nextSite) => {
      site = nextSite;
      mockedReadSiteDocument.mockResolvedValue(site);
    });
  });

  it('saves page custom code without changing the success shape', async () => {
    const response = await route.PATCH(
      patchRequest({ head: '<meta name="page" content="home">' }, '?locale=ko'),
      { params: { pageId } },
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      ok: true,
      customCode: { head: '<meta name="page" content="home">' },
      warnings: [],
    });
    expect(mockedWriteSiteDocument).toHaveBeenCalled();
  });

  it('returns localized stable-code JSON for malformed saves', async () => {
    const response = await route.PATCH(patchRequest('{', '?locale=zh-hant'), { params: { pageId } });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '請確認網站請求格式。',
      errorCode: 'invalid_json',
    });
    expect(mockedWriteSiteDocument).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON for oversized page code', async () => {
    const response = await route.PATCH(
      patchRequest({ bodyEnd: 'x'.repeat(CUSTOM_CODE_MAX_LENGTH + 1) }, '?locale=ko'),
      { params: { pageId } },
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '사용자 지정 코드가 너무 깁니다.',
      errorCode: 'custom_code_too_long',
      maxLength: CUSTOM_CODE_MAX_LENGTH,
    });
    expect(data.warnings).toEqual([
      expect.objectContaining({ code: 'too_long', slot: 'bodyEnd' }),
    ]);
    expect(mockedWriteSiteDocument).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when the target page is missing', async () => {
    const response = await route.PATCH(
      patchRequest({ head: '<meta name="missing" content="x">' }, '?locale=en'),
      { params: { pageId: 'missing-page' } },
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toMatchObject({
      ok: false,
      error: 'Page not found.',
      errorCode: 'page_not_found',
    });
    expect(mockedWriteSiteDocument).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when saving page custom code fails', async () => {
    mockedWriteSiteDocument.mockRejectedValueOnce(new Error('raw page custom code write failure'));
    const response = await route.PATCH(
      patchRequest({ bodyStart: '<script>ok()</script>' }, '?locale=zh-hant'),
      { params: { pageId } },
    );
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: '無法儲存頁面自訂程式碼。',
      errorCode: 'page_custom_code_save_failed',
    });
    expect(data.error).not.toContain('raw page custom code write failure');
  });
});
