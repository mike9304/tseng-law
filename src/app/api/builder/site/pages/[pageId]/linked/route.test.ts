import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderRead } from '@/lib/builder/security/guard';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import { createDefaultSiteDocument, type BuilderSiteDocument } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/site/pages/[pageId]/linked/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderRead: vi.fn(() => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);

function getRequest(pageId = 'page-about', query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/site/pages/${pageId}/linked${query}`);
}

describe('/api/builder/site/pages/[pageId]/linked', () => {
  let site: BuilderSiteDocument;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardBuilderRead).mockReturnValue({ username: 'admin' });
    site = createDefaultSiteDocument('ko', 'default');
    site.pages.push({
      pageId: 'page-about',
      slug: 'about',
      title: { ko: '회사소개', 'zh-hant': '關於我們', en: 'About' },
      locale: 'ko',
      linkedPageIds: { en: 'page-about-en' },
      createdAt: '2026-06-03T00:00:00.000Z',
      updatedAt: '2026-06-03T00:00:00.000Z',
    });
    site.pages.push({
      pageId: 'page-about-en',
      slug: 'about',
      title: { ko: 'About', 'zh-hant': 'About', en: 'About' },
      locale: 'en',
      createdAt: '2026-06-03T00:00:00.000Z',
      updatedAt: '2026-06-03T00:00:00.000Z',
    });
    mockedReadSiteDocument.mockResolvedValue(site);
  });

  it('returns linked locale pages without changing the success shape', async () => {
    const response = await route.GET(getRequest('page-about', '?locale=ko'), {
      params: { pageId: 'page-about' },
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      ok: true,
      linkedPages: {
        ko: { pageId: 'page-about', locale: 'ko', slug: 'about' },
        en: { pageId: 'page-about-en', locale: 'en', slug: 'about' },
      },
    });
  });

  it('loads linked locale pages from the selected workspace site', async () => {
    const response = await route.GET(getRequest('page-about', '?locale=ko&siteId=workspace-site-b'), {
      params: { pageId: 'page-about' },
    });

    expect(response.status).toBe(200);
    expect(mockedReadSiteDocument).toHaveBeenCalledWith('workspace-site-b', 'ko');
  });

  it('returns localized stable-code JSON when the page is missing', async () => {
    const response = await route.GET(getRequest('missing-page', '?locale=zh-hant'), {
      params: { pageId: 'missing-page' },
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toMatchObject({
      ok: false,
      error: '找不到頁面。',
      errorCode: 'page_not_found',
    });
  });

  it('returns localized stable-code JSON when linked pages loading fails', async () => {
    mockedReadSiteDocument.mockRejectedValueOnce(new Error('raw linked pages failure'));
    const response = await route.GET(getRequest('page-about', '?locale=en'), {
      params: { pageId: 'page-about' },
    });
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: 'Unable to load linked locale pages.',
      errorCode: 'linked_pages_load_failed',
    });
    expect(data.error).not.toContain('raw linked pages failure');
  });
});
