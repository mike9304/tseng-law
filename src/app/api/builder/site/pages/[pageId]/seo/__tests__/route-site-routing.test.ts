import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/site/pages/[pageId]/seo/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

const SELECTED_SITE_ID = 'workspace-page-seo';
const SELECTED_SITE_REFERER =
  `https://law.example.test/ko/admin-builder?siteId=${SELECTED_SITE_ID}&pageId=page-1`;

function createSite(siteId: string): BuilderSiteDocument {
  return {
    version: 1,
    siteId,
    name: '호정국제',
    locale: 'ko',
    navigation: [],
    theme: {
      colors: {
        primary: '#123b63',
        secondary: '#1e5a96',
        accent: '#e8a838',
        background: '#ffffff',
        text: '#1f2937',
        muted: '#f3f4f6',
      },
      fonts: { heading: 'system-ui', body: 'system-ui' },
      radii: { sm: 2, md: 8, lg: 12 },
    },
    pages: [
      {
        pageId: 'page-1',
        slug: 'about',
        title: { ko: '소개', en: 'About', 'zh-hant': '關於' },
        locale: 'ko',
        seo: {
          title: '소개',
          description: '한국어 설명',
        },
        createdAt: '2026-05-29T00:00:00.000Z',
        updatedAt: '2026-05-29T00:00:00.000Z',
        publishedAt: '2026-05-29T00:00:00.000Z',
      },
    ],
    createdAt: '2026-05-29T00:00:00.000Z',
    updatedAt: '2026-05-29T00:00:00.000Z',
  };
}

function getRequest(): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/site/pages/page-1/seo?locale=ko', {
    headers: { referer: SELECTED_SITE_REFERER },
  });
}

function patchRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/site/pages/page-1/seo?locale=ko', {
    method: 'PATCH',
    headers: {
      'content-type': 'application/json',
      referer: SELECTED_SITE_REFERER,
    },
    body: JSON.stringify(body),
  });
}

describe('/api/builder/site/pages/[pageId]/seo selected site routing', () => {
  let site: BuilderSiteDocument;

  beforeEach(() => {
    vi.clearAllMocks();
    site = createSite(SELECTED_SITE_ID);
    mockedReadSiteDocument.mockResolvedValue(site);
    mockedWriteSiteDocument.mockImplementation(async (nextSite) => {
      site = nextSite;
      mockedReadSiteDocument.mockResolvedValue(site);
    });
  });

  it('routes page SEO GET to the selected workspace site from the editor referer', async () => {
    const response = await route.GET(getRequest(), { params: Promise.resolve({ pageId: 'page-1' }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.page.pageId).toBe('page-1');
    expect(mockedReadSiteDocument).toHaveBeenCalledWith(SELECTED_SITE_ID, 'ko');
  });

  it('routes page SEO PATCH writes to the selected workspace site from the editor referer', async () => {
    const response = await route.PATCH(
      patchRequest({ seo: { title: 'Workspace SEO title' } }),
      { params: Promise.resolve({ pageId: 'page-1' }) },
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.seo.title).toBe('Workspace SEO title');
    expect(mockedReadSiteDocument).toHaveBeenCalledWith(SELECTED_SITE_ID, 'ko');
    expect(mockedWriteSiteDocument).toHaveBeenCalledWith(
      expect.objectContaining({ siteId: SELECTED_SITE_ID }),
    );
  });
});
