import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { readPageCanvas, readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderSiteDocument } from '@/lib/builder/site/types';
import * as route from '@/app/api/builder/site/pages/[pageId]/seo-assistant/route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'a@b' } })),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  readSiteDocument: vi.fn(),
  readPageCanvas: vi.fn(),
  writeSiteDocument: vi.fn(),
}));

const mockedReadPageCanvas = vi.mocked(readPageCanvas);
const mockedReadSiteDocument = vi.mocked(readSiteDocument);
const mockedWriteSiteDocument = vi.mocked(writeSiteDocument);

describe('/api/builder/site/pages/[pageId]/seo-assistant', () => {
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
            focusKeyword: '국제 소송',
            localizedOverrides: {
              en: {
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
    mockedReadPageCanvas.mockResolvedValue({
      version: 1,
      locale: 'ko',
      updatedAt: '2026-05-29T00:00:00.000Z',
      updatedBy: 'test',
      stageWidth: 1200,
      stageHeight: 800,
      nodes: [],
    });
    mockedWriteSiteDocument.mockImplementation(async (nextSite) => {
      site = nextSite;
      mockedReadSiteDocument.mockResolvedValue(site);
    });
  });

  it('returns locale-specific focus keyword on GET', async () => {
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/site/pages/page-1/seo-assistant?locale=en'),
      { params: { pageId: 'page-1' } },
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.focusKeyword).toBe('international law');
  });

  it('reads selected workspace site from the editor referrer on GET', async () => {
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/site/pages/page-1/seo-assistant?locale=ko', {
        headers: {
          referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-page-seo',
        },
      }),
      { params: { pageId: 'page-1' } },
    );

    expect(response.status).toBe(200);
    expect(mockedReadSiteDocument).toHaveBeenCalledWith('workspace-page-seo', 'ko');
    expect(mockedReadPageCanvas).toHaveBeenCalledWith('workspace-page-seo', 'page-1', 'draft');
  });

  it('stores non-source locale focus keyword as a localized override on PATCH', async () => {
    const response = await route.PATCH(
      new NextRequest('https://law.example.test/api/builder/site/pages/page-1/seo-assistant?locale=en', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ focusKeyword: 'cross-border law' }),
      }),
      { params: { pageId: 'page-1' } },
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.focusKeyword).toBe('cross-border law');
    expect(site.pages[0].seo?.focusKeyword).toBe('국제 소송');
    expect(site.pages[0].seo?.localizedOverrides?.en?.focusKeyword).toBe('cross-border law');
  });

  it('writes selected workspace site from the editor referrer on PATCH', async () => {
    site = { ...site, siteId: 'workspace-page-seo' };
    mockedReadSiteDocument.mockResolvedValue(site);

    const response = await route.PATCH(
      new NextRequest('https://law.example.test/api/builder/site/pages/page-1/seo-assistant?locale=ko', {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
          referer: 'https://law.example.test/ko/admin-builder?siteId=workspace-page-seo',
        },
        body: JSON.stringify({ focusKeyword: 'workspace keyword' }),
      }),
      { params: { pageId: 'page-1' } },
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.focusKeyword).toBe('workspace keyword');
    expect(mockedReadSiteDocument).toHaveBeenCalledWith('workspace-page-seo', 'ko');
    expect(mockedReadPageCanvas).toHaveBeenCalledWith('workspace-page-seo', 'page-1', 'draft');
    expect(mockedWriteSiteDocument).toHaveBeenCalledWith(expect.objectContaining({ siteId: 'workspace-page-seo' }));
  });

  it('returns zh-hant missing page errors on GET without Hangul', async () => {
    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/site/pages/missing-page/seo-assistant?locale=zh-hant'),
      { params: { pageId: 'missing-page' } },
    );
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('找不到頁面：missing-page');
    expect(data.errorCode).toBe('page_not_found');
    expect(data.pageId).toBe('missing-page');
    expect(data.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en invalid JSON errors on PATCH without CJK', async () => {
    const response = await route.PATCH(
      new NextRequest('https://law.example.test/api/builder/site/pages/page-1/seo-assistant?locale=en', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: '{',
      }),
      { params: { pageId: 'page-1' } },
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid JSON payload.');
    expect(data.errorCode).toBe('invalid_json');
    expect(data.error).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });

  it('returns localized stable-code JSON for invalid assistant payloads', async () => {
    const response = await route.PATCH(
      new NextRequest('https://law.example.test/api/builder/site/pages/page-1/seo-assistant?locale=zh-hant', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ focusKeyword: 'x'.repeat(81) }),
      }),
      { params: { pageId: 'page-1' } },
    );
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toMatchObject({
      ok: false,
      error: '請確認網站請求。',
      errorCode: 'validation_error',
    });
    expect(data.issues).toBeDefined();
    expect(mockedWriteSiteDocument).not.toHaveBeenCalled();
  });

  it('returns localized fallback errors without leaking internal GET errors', async () => {
    mockedReadPageCanvas.mockRejectedValueOnce(new Error('canvas exploded 내부 오류'));

    const response = await route.GET(
      new NextRequest('https://law.example.test/api/builder/site/pages/page-1/seo-assistant?locale=ko'),
      { params: { pageId: 'page-1' } },
    );
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('SEO 도우미 요청을 처리하지 못했습니다.');
    expect(data.errorCode).toBe('seo_assistant_request_failed');
    expect(data.error).not.toContain('canvas exploded');
  });

  it('returns localized stable-code JSON without leaking internal PATCH errors', async () => {
    mockedWriteSiteDocument.mockRejectedValueOnce(new Error('raw assistant write failure'));

    const response = await route.PATCH(
      new NextRequest('https://law.example.test/api/builder/site/pages/page-1/seo-assistant?locale=en', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ focusKeyword: 'cross-border law' }),
      }),
      { params: { pageId: 'page-1' } },
    );
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toMatchObject({
      ok: false,
      error: 'Could not process the SEO assistant request.',
      errorCode: 'seo_assistant_request_failed',
    });
    expect(data.error).not.toContain('raw assistant write failure');
  });
});
