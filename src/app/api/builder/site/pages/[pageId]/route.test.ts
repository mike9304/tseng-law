import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { deletePage, readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { createDefaultSiteDocument, type BuilderPageMeta, type BuilderSiteDocument } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/site/pages/[pageId]/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  deletePage: vi.fn(),
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

vi.mock('@/lib/builder/site/redirects', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/site/redirects')>();
  return {
    ...actual,
    generateRedirectId: vi.fn(() => 'redirect-1'),
    validateRedirectInput: vi.fn(() => null),
  };
});

const mockedDeletePage = vi.mocked(deletePage);
const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

function patchRequest(body: unknown, query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/pages/page-about${query}`, {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function deleteRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/pages/page-about${query}`, {
    method: 'DELETE',
  });
}

function pageMeta(overrides: Partial<BuilderPageMeta> = {}): BuilderPageMeta {
  return {
    pageId: 'page-about',
    slug: 'about',
    title: { ko: '회사소개', 'zh-hant': '關於我們', en: 'About' },
    locale: 'ko',
    createdAt: '2026-06-03T00:00:00.000Z',
    updatedAt: '2026-06-03T00:00:00.000Z',
    ...overrides,
  };
}

describe('/api/builder/site/pages/[pageId]', () => {
  let site: BuilderSiteDocument;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'a@b' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
    site = createDefaultSiteDocument('ko', 'default');
    site.pages.push(pageMeta());
    mockedReadSiteDocument.mockResolvedValue(site);
    mockedWriteSiteDocument.mockResolvedValue(undefined);
    mockedDeletePage.mockResolvedValue(undefined);
  });

  it('returns localized stable-code JSON for malformed update payloads', async () => {
    const response = await route.PATCH(patchRequest('{', '?locale=zh-hant'), {
      params: { pageId: 'page-about' },
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '請確認網站請求格式。',
      errorCode: 'invalid_json',
    });
    expect(mockedWriteSiteDocument).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when updating a missing page', async () => {
    const response = await route.PATCH(patchRequest({ title: 'Missing' }, '?locale=ko'), {
      params: { pageId: 'missing-page' },
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toMatchObject({
      ok: false,
      error: '페이지를 찾을 수 없습니다.',
      errorCode: 'page_not_found',
    });
    expect(mockedWriteSiteDocument).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON for invalid localized slugs', async () => {
    const response = await route.PATCH(patchRequest({ slugByLocale: { en: 'Bad Slug!' } }, '?locale=ko'), {
      params: { pageId: 'page-about' },
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '다국어 페이지 주소 형식을 확인해 주세요.',
      errorCode: 'localized_slug_invalid',
    });
    expect(mockedWriteSiteDocument).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON for duplicate localized slugs', async () => {
    site.pages.push(pageMeta({ pageId: 'page-other', locale: 'en', slug: 'about' }));
    const response = await route.PATCH(patchRequest({ slugByLocale: { en: 'about' } }, '?locale=en'), {
      params: { pageId: 'page-about' },
    });
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data).toMatchObject({
      ok: false,
      error: 'A localized page slug already exists in the same language.',
      errorCode: 'localized_slug_duplicate',
    });
    expect(mockedWriteSiteDocument).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when saving an update fails', async () => {
    mockedWriteSiteDocument.mockRejectedValueOnce(new Error('raw update failure'));
    const response = await route.PATCH(patchRequest({ title: 'Updated' }, '?locale=en'), {
      params: { pageId: 'page-about' },
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: 'Unable to update the page.',
      errorCode: 'page_update_failed',
    });
    expect(data.error).not.toContain('raw update failure');
  });

  it('preserves the page update success shape', async () => {
    const response = await route.PATCH(patchRequest({ title: '새 제목' }, '?locale=ko'), {
      params: { pageId: 'page-about' },
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      ok: true,
      page: { pageId: 'page-about', title: { ko: '새 제목' } },
      redirectCreated: false,
      redirectWarnings: [],
    });
  });

  it('updates pages in the selected workspace site', async () => {
    site.siteId = 'workspace-site-b';
    const response = await route.PATCH(
      patchRequest({ siteId: 'workspace-site-b', title: '사이트 B 제목' }, '?locale=ko'),
      { params: { pageId: 'page-about' } },
    );

    expect(response.status).toBe(200);
    expect(mockedReadSiteDocument).toHaveBeenCalledWith('workspace-site-b', 'ko');
    expect(mockedWriteSiteDocument).toHaveBeenCalledWith(expect.objectContaining({
      siteId: 'workspace-site-b',
    }));
  });

  it('returns localized stable-code JSON when deleting the home page is blocked', async () => {
    site.pages[1] = { ...site.pages[1], isHomePage: true };
    const response = await route.DELETE(deleteRequest('?locale=zh-hant'), {
      params: { pageId: 'page-about' },
    });
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '首頁無法刪除。',
      errorCode: 'home_page_delete_blocked',
    });
    expect(mockedDeletePage).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when deleting a missing page', async () => {
    const response = await route.DELETE(deleteRequest('?locale=ko'), {
      params: { pageId: 'missing-page' },
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toMatchObject({
      ok: false,
      error: '페이지를 찾을 수 없습니다.',
      errorCode: 'page_not_found',
    });
    expect(mockedDeletePage).not.toHaveBeenCalled();
  });

  it('returns localized stable-code JSON when deleting a page fails', async () => {
    mockedDeletePage.mockRejectedValueOnce(new Error('raw delete failure'));
    const response = await route.DELETE(deleteRequest('?locale=en'), {
      params: { pageId: 'page-about' },
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: 'Unable to delete the page.',
      errorCode: 'page_delete_failed',
    });
    expect(data.error).not.toContain('raw delete failure');
  });

  it('deletes pages from the selected workspace site', async () => {
    site.siteId = 'workspace-site-b';
    const response = await route.DELETE(deleteRequest('?locale=ko&siteId=workspace-site-b'), {
      params: { pageId: 'page-about' },
    });

    expect(response.status).toBe(200);
    expect(mockedReadSiteDocument).toHaveBeenCalledWith('workspace-site-b', 'ko');
    expect(mockedDeletePage).toHaveBeenCalledWith('workspace-site-b', 'page-about', 'ko');
  });
});
