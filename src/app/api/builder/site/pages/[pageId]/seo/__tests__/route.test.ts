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

describe('/api/builder/site/pages/[pageId]/seo', () => {
  let site: BuilderSiteDocument;

  beforeEach(() => {
    vi.clearAllMocks();
    site = {
      version: 1,
      siteId: 'default',
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
            localizedOverrides: {
              en: {
                title: 'About us',
                description: 'English description',
                ogTitle: 'About OG',
                twitterDescription: 'English tweet description',
                focusKeyword: 'international law',
              },
            },
          },
          createdAt: '2026-05-29T00:00:00.000Z',
          updatedAt: '2026-05-29T00:00:00.000Z',
          publishedAt: '2026-05-29T00:00:00.000Z',
        },
      ],
      createdAt: '2026-05-29T00:00:00.000Z',
      updatedAt: '2026-05-29T00:00:00.000Z',
    };
    mockedReadSiteDocument.mockResolvedValue(site);
    mockedWriteSiteDocument.mockImplementation(async (nextSite) => {
      site = nextSite;
      mockedReadSiteDocument.mockResolvedValue(site);
    });
  });

  it('returns locale-specific seo overrides on GET', async () => {
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/site/pages/page-1/seo?locale=en'),
      { params: Promise.resolve({ pageId: 'page-1' }) },
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.seo.title).toBe('About us');
    expect(data.seo.description).toBe('English description');
    expect(data.seo.ogTitle).toBe('About OG');
    expect(data.seo.twitterDescription).toBe('English tweet description');
    expect(data.seo.focusKeyword).toBe('international law');
  });

  it('stores non-source locale seo fields as localized overrides on PATCH', async () => {
    const response = await route.PATCH(
      new NextRequest('https://law.example.test/api/builder/site/pages/page-1/seo?locale=en', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          seo: {
            title: 'About updated',
            description: 'English description updated',
            ogTitle: 'About OG updated',
            twitterDescription: 'English tweet updated',
            focusKeyword: 'cross-border law',
          },
        }),
      }),
      { params: Promise.resolve({ pageId: 'page-1' }) },
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.seo.title).toBe('About updated');
    expect(site.pages[0].seo?.title).toBe('소개');
    expect(site.pages[0].seo?.localizedOverrides?.en?.title).toBe('About updated');
    expect(site.pages[0].seo?.localizedOverrides?.en?.twitterDescription).toBe('English tweet updated');
    expect(site.pages[0].seo?.localizedOverrides?.en?.focusKeyword).toBe('cross-border law');
  });

  it('uses locale-specific seo values for validation on GET', async () => {
    site.pages[0].seo = {
      localizedOverrides: {
        en: {
          title: 'About us',
          description: 'English description',
        },
      },
    };
    mockedReadSiteDocument.mockResolvedValue(site);

    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/site/pages/page-1/seo?locale=en'),
      { params: Promise.resolve({ pageId: 'page-1' }) },
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.validation.some((issue: { id: string }) => issue.id === 'seo-title-missing')).toBe(false);
    expect(data.validation.some((issue: { id: string }) => issue.id === 'seo-description-missing')).toBe(false);
  });

  it('returns localized missing page errors on GET', async () => {
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/site/pages/missing-page/seo?locale=ko'),
      { params: Promise.resolve({ pageId: 'missing-page' }) },
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('페이지를 찾을 수 없습니다: missing-page');
    expect(data.errorCode).toBe('page_not_found');
    expect(data.pageId).toBe('missing-page');
  });

  it('returns zh-hant invalid JSON errors on PATCH without Hangul', async () => {
    const response = await route.PATCH(
      new NextRequest('https://law.example.test/api/builder/site/pages/page-1/seo?locale=zh-hant', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: '{',
      }),
      { params: Promise.resolve({ pageId: 'page-1' }) },
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('JSON 請求內容格式不正確。');
    expect(data.errorCode).toBe('invalid_json');
    expect(data.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns localized stable-code JSON for invalid SEO payloads', async () => {
    const response = await route.PATCH(
      new NextRequest('https://law.example.test/api/builder/site/pages/page-1/seo?locale=en', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ seo: { title: 'x'.repeat(301) } }),
      }),
      { params: Promise.resolve({ pageId: 'page-1' }) },
    );
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

  it('returns localized fallback errors without leaking internal GET errors', async () => {
    mockedReadSiteDocument.mockRejectedValueOnce(new Error('database exploded 내부 오류'));

    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/site/pages/page-1/seo?locale=en'),
      { params: Promise.resolve({ pageId: 'page-1' }) },
    );
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Could not process the page SEO request.');
    expect(data.errorCode).toBe('page_seo_request_failed');
    expect(data.error).not.toContain('database exploded');
    expect(data.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });

  it('returns localized stable-code JSON without leaking internal PATCH errors', async () => {
    mockedWriteSiteDocument.mockRejectedValueOnce(new Error('raw seo write failure'));

    const response = await route.PATCH(
      new NextRequest('https://law.example.test/api/builder/site/pages/page-1/seo?locale=ko', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ seo: { title: '새 제목' } }),
      }),
      { params: Promise.resolve({ pageId: 'page-1' }) },
    );
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: '페이지 SEO 요청을 처리하지 못했습니다.',
      errorCode: 'page_seo_request_failed',
    });
    expect(data.error).not.toContain('raw seo write failure');
  });
});
