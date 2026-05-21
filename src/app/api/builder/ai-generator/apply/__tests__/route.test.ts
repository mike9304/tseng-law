import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { generateSiteDraft } from '@/lib/builder/ai-generator/orchestrator';
import {
  draftToCanvasNodes,
  draftToSitemapPageCanvasNodes,
} from '@/lib/builder/ai-generator/canvas-import';
import {
  createPage,
  deletePage,
  readSiteDocument,
  writeSiteDocument,
  writePageCanvas,
} from '@/lib/builder/site/persistence';
import type { SiteSpec } from '@/lib/builder/ai-generator/site-spec';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1', email: 'admin@example.test' } })),
}));

vi.mock('@/lib/builder/ai-generator/orchestrator', () => ({
  generateSiteDraft: vi.fn(),
}));

vi.mock('@/lib/builder/ai-generator/canvas-import', () => ({
  draftToCanvasNodes: vi.fn(() => []),
  draftToSitemapPageCanvasNodes: vi.fn(() => []),
}));

vi.mock('@/lib/builder/site/persistence', () => ({
  createPage: vi.fn(),
  deletePage: vi.fn(),
  readSiteDocument: vi.fn(),
  writeSiteDocument: vi.fn(),
  writePageCanvas: vi.fn(),
}));

const spec: SiteSpec = {
  industry: 'law',
  companyName: '호정국제법률사무소',
  goals: ['상담 문의 증가'],
  desiredPages: ['홈', '칼럼'],
  brandKeywords: ['대만 법률'],
  tone: 'professional',
  colorPreference: 'cool',
  locale: 'ko',
};

const createdPage = {
  pageId: 'page-created',
  slug: 'ai-rollback',
  title: { ko: '호정국제법률사무소', 'zh-hant': '호정국제법률사무소', en: '호정국제법률사무소' },
  locale: 'ko',
  createdAt: '2026-05-21T00:00:00.000Z',
  updatedAt: '2026-05-21T00:00:00.000Z',
} as Awaited<ReturnType<typeof createPage>>;

const roadmapPage = {
  ...createdPage,
  pageId: 'page-roadmap',
  slug: 'roadmap-ai',
  title: { ko: 'Roadmap AI', 'zh-hant': 'Roadmap AI', en: 'Roadmap AI' },
} as Awaited<ReturnType<typeof createPage>>;

const guidesPage = {
  ...createdPage,
  pageId: 'page-guides',
  slug: 'guides-ai',
  title: { ko: 'Guides AI', 'zh-hant': 'Guides AI', en: 'Guides AI' },
} as Awaited<ReturnType<typeof createPage>>;

function siteDocumentWithPages(pages: unknown[] = []) {
  return {
    version: 1,
    siteId: 'default',
    locale: 'ko',
    name: 'Test site',
    pages,
    navigation: [],
    settings: {},
    theme: {},
    createdAt: '2026-05-21T00:00:00.000Z',
    updatedAt: '2026-05-21T00:00:00.000Z',
  } as unknown as Awaited<ReturnType<typeof readSiteDocument>>;
}

function mockReadSiteForCreate() {
  vi.mocked(readSiteDocument)
    .mockResolvedValueOnce(siteDocumentWithPages())
    .mockResolvedValueOnce(siteDocumentWithPages([createdPage]));
}

function postRequest(body: unknown): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/ai-generator/apply', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

describe('/api/builder/ai-generator/apply', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(guardMutation).mockResolvedValue({
      user: { id: 'admin-1', email: 'admin@example.test' },
    } as unknown as Awaited<ReturnType<typeof guardMutation>>);
    vi.mocked(readSiteDocument).mockResolvedValue(siteDocumentWithPages());
    vi.mocked(generateSiteDraft).mockResolvedValue({
      spec,
      content: {
        hero: {
          sectionId: 'hero',
          headline: '대만 법률 상담을 빠르게 시작하세요',
          body: '한국 기업을 위한 대만 법률 자문과 분쟁 대응을 한 곳에서 제공합니다.',
          ctaLabel: '문의하기',
        },
        sections: [],
        metaDescription: '대만 법률 상담',
      },
      plan: {
        sitemap: [{
          title: 'Home',
          slug: '/',
          purpose: '전문성과 상담 전환을 함께 보여주는 홈입니다.',
          sections: ['hero', 'services'],
        }],
        contentPlan: [],
        brandBrief: {
          audience: '대만 진출 한국 기업',
          goals: ['상담 문의 증가'],
          keywords: ['대만 법률'],
          constraints: '모바일 CTA 우선',
        },
      },
      blueprint: { heroHeadlineHint: '전문 상담', sections: ['hero'], palettes: {} },
      palette: { primary: '#123b63', secondary: '#1f8a85', accent: '#d9a441', background: '#f8fafc' },
      generatedAt: '2026-05-21T00:00:00.000Z',
    } as unknown as Awaited<ReturnType<typeof generateSiteDraft>>);
    vi.mocked(createPage).mockResolvedValue(createdPage);
    vi.mocked(draftToCanvasNodes).mockReturnValue([]);
    vi.mocked(draftToSitemapPageCanvasNodes).mockReturnValue([]);
    vi.mocked(deletePage).mockResolvedValue(undefined);
    vi.mocked(writeSiteDocument).mockResolvedValue(undefined);
  });

  it('rolls back the created page when draft canvas write fails', async () => {
    mockReadSiteForCreate();
    vi.mocked(writePageCanvas).mockRejectedValue(new Error('disk full'));

    const route = await import('../route');
    const response = await route.POST(postRequest({ spec, slug: 'ai-rollback' }));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.ok).toBe(false);
    expect(payload.error).toBe('apply_failed');
    expect(createPage).toHaveBeenCalledWith('default', 'ko', 'ai-rollback', spec.companyName);
    expect(writePageCanvas).toHaveBeenCalledTimes(1);
    expect(deletePage).toHaveBeenCalledWith('default', 'page-created', 'ko');
  });

  it('seeds SEO metadata on the generated draft page', async () => {
    mockReadSiteForCreate();
    vi.mocked(writePageCanvas).mockResolvedValue(undefined);

    const route = await import('../route');
    const response = await route.POST(postRequest({ spec, slug: 'ai-rollback' }));
    const payload = await response.json();
    const seededSite = vi.mocked(writeSiteDocument).mock.calls[0]?.[0];
    const seededPage = seededSite?.pages.find((page) => page.pageId === 'page-created');

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.seoSeeded).toBe(true);
    expect(seededPage?.seo).toMatchObject({
      title: expect.stringContaining('대만 법률 상담'),
      description: expect.stringContaining('한국 기업을 위한 대만 법률 자문'),
      ogTitle: expect.stringContaining('대만 법률 상담'),
      twitterTitle: expect.stringContaining('대만 법률 상담'),
      focusKeyword: '대만 법률',
    });
  });

  it('rejects duplicate single draft slug before generating AI content', async () => {
    vi.mocked(readSiteDocument).mockResolvedValueOnce(siteDocumentWithPages([
      { ...createdPage, pageId: 'page-columns', slug: 'columns' },
    ]));

    const route = await import('../route');
    const response = await route.POST(postRequest({ spec, slug: 'columns' }));
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload.error).toBe('duplicate_slug');
    expect(generateSiteDraft).not.toHaveBeenCalled();
    expect(createPage).not.toHaveBeenCalled();
  });

  it('creates selected sitemap draft pages and reports skipped selected slugs', async () => {
    vi.mocked(readSiteDocument)
      .mockResolvedValueOnce(siteDocumentWithPages([{ ...createdPage, pageId: 'page-columns', slug: 'columns' }]))
      .mockResolvedValueOnce(siteDocumentWithPages([roadmapPage]))
      .mockResolvedValueOnce(siteDocumentWithPages([roadmapPage]));
    vi.mocked(generateSiteDraft).mockResolvedValue({
      spec,
      content: {
        hero: {
          sectionId: 'hero',
          headline: '대만 법률 상담을 빠르게 시작하세요',
          body: '한국 기업을 위한 대만 법률 자문과 분쟁 대응을 한 곳에서 제공합니다.',
          ctaLabel: '문의하기',
        },
        sections: [],
        metaDescription: '대만 법률 상담',
      },
      plan: {
        sitemap: [
          { title: 'Home', slug: '/', purpose: '홈 목적', sections: ['hero'] },
          { title: 'Roadmap AI', slug: '/roadmap-ai', purpose: 'Roadmap 목적', sections: ['hero', 'details'] },
          { title: 'Guides AI', slug: '/guides-ai', purpose: 'Guides 목적', sections: ['hero', 'faq'] },
          { title: 'Columns', slug: '/columns', purpose: '이미 있는 칼럼', sections: ['hero'] },
        ],
        contentPlan: [],
        brandBrief: {
          audience: '대만 진출 한국 기업',
          goals: ['상담 문의 증가'],
          keywords: ['대만 법률'],
          constraints: '모바일 CTA 우선',
        },
      },
      blueprint: { heroHeadlineHint: '전문 상담', sections: ['hero'], palettes: {} },
      palette: { primary: '#123b63', secondary: '#1f8a85', accent: '#d9a441', background: '#f8fafc' },
      generatedAt: '2026-05-21T00:00:00.000Z',
    } as unknown as Awaited<ReturnType<typeof generateSiteDraft>>);
    vi.mocked(createPage)
      .mockResolvedValueOnce(roadmapPage);
    vi.mocked(writePageCanvas).mockResolvedValue(undefined);

    const route = await import('../route');
    const response = await route.POST(postRequest({
      spec,
      scope: 'sitemap',
      pageSlugs: ['roadmap-ai', 'columns'],
      addToNavigation: true,
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.ok).toBe(true);
    expect(payload.scope).toBe('sitemap');
    expect(payload.pages).toEqual([
      expect.objectContaining({ pageId: 'page-roadmap', slug: 'roadmap-ai' }),
    ]);
    expect(payload.skippedPages).toEqual(expect.arrayContaining([
      expect.objectContaining({ slug: 'columns', reason: 'duplicate_slug' }),
    ]));
    expect(payload.navigationAdded).toEqual(['roadmap-ai']);
    expect(createPage).toHaveBeenCalledTimes(1);
    expect(createPage).toHaveBeenCalledWith('default', 'ko', 'roadmap-ai', 'Roadmap AI');
    expect(draftToSitemapPageCanvasNodes).toHaveBeenCalledTimes(1);
    expect(writeSiteDocument).toHaveBeenCalledTimes(2);
    const navigationSite = vi.mocked(writeSiteDocument).mock.calls[1]?.[0];
    expect(navigationSite?.navigation).toEqual([
      expect.objectContaining({
        pageId: 'page-roadmap',
        href: '/ko/roadmap-ai',
      }),
    ]);
  });

  it('rolls back every created sitemap page when one canvas write fails', async () => {
    vi.mocked(readSiteDocument)
      .mockResolvedValueOnce(siteDocumentWithPages())
      .mockResolvedValueOnce(siteDocumentWithPages([roadmapPage]))
      .mockResolvedValueOnce(siteDocumentWithPages([guidesPage]));
    vi.mocked(generateSiteDraft).mockResolvedValue({
      spec,
      content: {
        hero: {
          sectionId: 'hero',
          headline: '대만 법률 상담을 빠르게 시작하세요',
          body: '한국 기업을 위한 대만 법률 자문과 분쟁 대응을 한 곳에서 제공합니다.',
          ctaLabel: '문의하기',
        },
        sections: [],
        metaDescription: '대만 법률 상담',
      },
      plan: {
        sitemap: [
          { title: 'Roadmap AI', slug: '/roadmap-ai', purpose: 'Roadmap 목적', sections: ['hero', 'details'] },
          { title: 'Guides AI', slug: '/guides-ai', purpose: 'Guides 목적', sections: ['hero', 'faq'] },
        ],
        contentPlan: [],
        brandBrief: {
          audience: '대만 진출 한국 기업',
          goals: ['상담 문의 증가'],
          keywords: ['대만 법률'],
          constraints: '모바일 CTA 우선',
        },
      },
      blueprint: { heroHeadlineHint: '전문 상담', sections: ['hero'], palettes: {} },
      palette: { primary: '#123b63', secondary: '#1f8a85', accent: '#d9a441', background: '#f8fafc' },
      generatedAt: '2026-05-21T00:00:00.000Z',
    } as unknown as Awaited<ReturnType<typeof generateSiteDraft>>);
    vi.mocked(createPage)
      .mockResolvedValueOnce(roadmapPage)
      .mockResolvedValueOnce(guidesPage);
    vi.mocked(writePageCanvas)
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error('second write failed'));

    const route = await import('../route');
    const response = await route.POST(postRequest({ spec, scope: 'sitemap' }));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload.error).toBe('apply_failed');
    expect(deletePage).toHaveBeenCalledWith('default', 'page-roadmap', 'ko');
    expect(deletePage).toHaveBeenCalledWith('default', 'page-guides', 'ko');
  });

  it('rejects sitemap apply when the selected page list is empty', async () => {
    vi.mocked(readSiteDocument).mockResolvedValueOnce(siteDocumentWithPages());

    const route = await import('../route');
    const response = await route.POST(postRequest({ spec, scope: 'sitemap', pageSlugs: [] }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.ok).toBe(false);
    expect(payload.error).toBe('no_selected_sitemap_pages');
    expect(createPage).not.toHaveBeenCalled();
    expect(writePageCanvas).not.toHaveBeenCalled();
  });
});
