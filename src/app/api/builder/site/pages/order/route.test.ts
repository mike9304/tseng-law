import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  projectPagesForLocale,
  readSiteDocument,
  writeSiteDocument,
} from '@/lib/builder/site/persistence';
import { createDefaultSiteDocument, type BuilderSiteDocument } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/site/pages/order/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  projectPagesForLocale: vi.fn(),
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedProjectPagesForLocale = vi.mocked(projectPagesForLocale);
const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

function patchRequest(body: unknown, query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/pages/order${query}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/builder/site/pages/order', () => {
  let site: BuilderSiteDocument;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
    site = createDefaultSiteDocument('ko', 'default');
    site.pages.push({
      pageId: 'page-about',
      slug: 'about',
      title: { ko: '회사소개', 'zh-hant': '關於我們', en: 'About' },
      locale: 'ko',
      createdAt: '2026-06-03T00:00:00.000Z',
      updatedAt: '2026-06-03T00:00:00.000Z',
    });
    mockedReadSiteDocument.mockResolvedValue(site);
    mockedProjectPagesForLocale.mockImplementation((pages) => pages);
    mockedWriteSiteDocument.mockResolvedValue(undefined);
  });

  it('returns localized stable-code JSON for malformed page order payloads', async () => {
    const response = await route.PATCH(patchRequest('{', '?locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '請確認網站請求格式。',
      errorCode: 'invalid_json',
    });
    expect(mockedWriteSiteDocument).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON for invalid page order payloads', async () => {
    const response = await route.PATCH(patchRequest({ orderedPageIds: [] }, '?locale=en'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: 'Check the site request.',
      errorCode: 'validation_error',
    });
    expect(data.issues).toBeDefined();
    expect(mockedWriteSiteDocument).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON for unknown page ids', async () => {
    const response = await route.PATCH(patchRequest({ orderedPageIds: ['missing-page'] }, '?locale=ko'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '정렬할 페이지를 찾을 수 없습니다.',
      errorCode: 'page_order_unknown_page',
      pageId: 'missing-page',
    });
    expect(mockedWriteSiteDocument).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON for duplicate page ids', async () => {
    const pageId = site.pages[0].pageId;
    const response = await route.PATCH(patchRequest({ orderedPageIds: [pageId, pageId] }, '?locale=zh-hant'));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '頁面排序清單中有重複項目。',
      errorCode: 'page_order_duplicate_page',
      pageId,
    });
    expect(mockedWriteSiteDocument).not.toHaveBeenCalled();
  });

  it('saves page order in the selected workspace site', async () => {
    site.siteId = 'workspace-site-b';
    const response = await route.PATCH(patchRequest(
      { siteId: 'workspace-site-b', orderedPageIds: ['page-about'] },
      '?locale=ko',
    ));

    expect(response.status).toBe(200);
    expect(mockedReadSiteDocument).toHaveBeenCalledWith('workspace-site-b', 'ko');
    expect(mockedWriteSiteDocument).toHaveBeenCalledWith(expect.objectContaining({
      siteId: 'workspace-site-b',
    }));
  });

  it('returns localized stable-code JSON when saving page order fails', async () => {
    mockedWriteSiteDocument.mockRejectedValueOnce(new Error('raw order write failure'));
    const response = await route.PATCH(patchRequest({ orderedPageIds: ['page-about'] }, '?locale=en'));
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: 'Unable to save the page order.',
      errorCode: 'page_order_save_failed',
    });
    expect(data.error).not.toContain('raw order write failure');
  });
});
