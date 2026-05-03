import { describe, expect, it } from 'vitest';
import type { BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';
import { DEFAULT_THEME } from '@/lib/builder/site/types';
import { buildHreflangAlternates } from '@/lib/builder/seo/hreflang';
import { buildBuilderSeoOverview } from '@/lib/builder/seo/overview';
import { buildPageSeo, buildSitemapEntries } from '@/lib/builder/seo/seo-model';
import { buildSeoAssistantTasks } from '@/lib/builder/seo/assistant';
import { buildDefaultSeoMetadata, expandSeoTemplate } from '@/lib/builder/seo/defaults';
import {
  normalizeStructuredDataSettings,
  validateBuilderPageSeo,
} from '@/lib/builder/seo/validation';

const now = '2026-05-03T00:00:00.000Z';

function page(overrides: Partial<BuilderPageMeta> = {}): BuilderPageMeta {
  return {
    pageId: 'page-1',
    slug: 'services',
    title: { ko: '서비스', en: 'Services', 'zh-hant': '服務' },
    locale: 'ko',
    createdAt: now,
    updatedAt: now,
    publishedAt: now,
    ...overrides,
  };
}

function site(pages: BuilderPageMeta[]): BuilderSiteDocument {
  return {
    version: 1,
    siteId: 'default',
    name: '호정국제',
    locale: 'ko',
    navigation: [],
    theme: DEFAULT_THEME,
    pages,
    createdAt: now,
    updatedAt: now,
  };
}

describe('builder SEO model', () => {
  it('builds canonical and social fallbacks from the public non-/p URL', () => {
    const seo = buildPageSeo(
      page({
        seo: {
          title: '국제 법률 서비스 상담 | 호정국제',
          description: '대만과 한국을 오가는 국제 법률 이슈를 한국어와 중국어로 상담합니다.',
          ogImage: 'https://example.com/og.png',
        },
      }),
      'https://example.com',
      'ko',
      [],
    );

    expect(seo.canonical).toBe('https://example.com/ko/services');
    expect(seo.canonical).not.toContain('/p/');
    expect(seo.ogTitle).toBe(seo.title);
    expect(seo.twitterCard).toBe('summary_large_image');
    expect(seo.twitterImage).toBe('https://example.com/og.png');
  });

  it('uses public non-/p URLs for hreflang and sitemap entries', () => {
    const ko = page({
      linkedPageIds: { en: 'page-en' },
    });
    const en = page({
      pageId: 'page-en',
      slug: 'services-en',
      locale: 'en',
      title: { ko: '서비스', en: 'Services', 'zh-hant': '服務' },
    });
    const pages = [ko, en];

    const alternates = buildHreflangAlternates(ko, 'https://example.com', pages);
    expect(alternates.map((entry) => entry.href)).toContain('https://example.com/ko/services');
    expect(alternates.map((entry) => entry.href)).toContain('https://example.com/en/services-en');
    expect(alternates.some((entry) => entry.href.includes('/p/'))).toBe(false);

    const entries = buildSitemapEntries(pages, 'https://example.com');
    expect(entries.map((entry) => entry.loc)).toContain('https://example.com/ko/services');
    expect(entries.some((entry) => entry.loc.includes('/p/'))).toBe(false);
  });

  it('flags duplicate slugs and invalid canonical URLs as blockers', () => {
    const current = page({
      seo: {
        title: '국제 법률 서비스 상담 | 호정국제',
        description: '대만과 한국을 오가는 국제 법률 이슈를 한국어와 중국어로 상담합니다.',
        canonical: 'notaurl',
      },
    });
    const other = page({ pageId: 'page-2', slug: 'services' });

    const issues = validateBuilderPageSeo({
      page: current,
      site: site([current, other]),
      seo: current.seo,
    });

    expect(issues.some((issue) => issue.id === 'seo-slug-duplicate' && issue.severity === 'blocker')).toBe(true);
    expect(issues.some((issue) => issue.id === 'seo-canonical-invalid' && issue.severity === 'blocker')).toBe(true);
  });

  it('keeps structured data defaults compatible with existing pages', () => {
    expect(normalizeStructuredDataSettings()).toEqual({
      legalService: true,
      organization: false,
      localBusiness: false,
      faqPage: 'auto',
      breadcrumbList: true,
    });
  });

  it('preserves additional meta tags for public metadata projection', () => {
    const seo = buildPageSeo(
      page({
        seo: {
          title: '국제 법률 서비스 상담 | 호정국제',
          description: '대만과 한국을 오가는 국제 법률 이슈를 한국어와 중국어로 상담합니다.',
          additionalMetaTags: [
            { id: 'meta-1', name: 'google-site-verification', content: 'abc123' },
          ],
        },
      }),
      'https://example.com',
      'ko',
      [],
    );

    expect(seo.additionalMetaTags).toEqual([
      { id: 'meta-1', name: 'google-site-verification', content: 'abc123' },
    ]);
  });

  it('builds a Wix-style SEO overview with checklist and page scores', () => {
    const current = page({
      seo: {
        title: '국제 법률 서비스 상담 | 호정국제',
        description: '대만과 한국을 오가는 국제 법률 이슈를 한국어와 중국어로 상담합니다.',
      },
    });
    const overview = buildBuilderSeoOverview({
      site: {
        ...site([current]),
        settings: {
          firmName: '호정국제',
          seoChecklist: {
            businessName: '호정국제',
            keywords: ['국제 법률'],
            serviceMode: 'both',
          },
        },
      },
      canvasesByPageId: new Map([
        [
          current.pageId,
          {
            version: 1,
            locale: 'ko',
            updatedAt: now,
            updatedBy: 'test',
            stageWidth: 1200,
            stageHeight: 800,
            nodes: [],
          },
        ],
      ]),
    });

    expect(overview.pages).toHaveLength(1);
    expect(overview.totals.pages).toBe(1);
    expect(overview.checklist.some((item) => item.id === 'keywords' && item.status === 'done')).toBe(true);
  });

  it('expands Wix-style SEO variables from site defaults', () => {
    const current = page({ seo: undefined });
    const doc = {
      ...site([current]),
      settings: {
        firmName: '호정국제',
        seoChecklist: {
          businessName: '호정국제',
          keywords: ['국제 소송'],
        },
        seoDefaults: {
          patterns: {
            titleTemplate: '{{pageName}} | {{businessName}}',
            descriptionTemplate: '{{primaryKeyword}} 상담은 {{businessName}}의 {{pageName}} 페이지에서 확인하세요.',
          },
        },
      },
    };

    const defaults = buildDefaultSeoMetadata({
      page: current,
      site: doc,
      siteUrl: 'https://example.com',
      locale: 'ko',
    });

    expect(defaults.title).toBe('서비스 | 호정국제');
    expect(defaults.description).toContain('국제 소송');
    expect(expandSeoTemplate('{{pageName}}/{{siteName}}', {
      pageName: '서비스',
      pageUrl: '/ko/services',
      slug: 'services',
      siteName: '호정국제',
      businessName: '호정국제',
      businessDescription: '',
      primaryKeyword: '',
      locale: 'ko',
      titleTag: '',
      metaDescription: '',
    })).toBe('서비스/호정국제');
  });

  it('creates SEO assistant tasks from focus keyword and page content', () => {
    const current = page({
      seo: {
        focusKeyword: '국제 소송',
        title: '서비스 | 호정국제',
        description: '대만과 한국을 오가는 법률 이슈를 상담합니다.',
      },
    });
    const tasks = buildSeoAssistantTasks({
      page: current,
      site: site([current]),
      canvas: {
        version: 1,
        locale: 'ko',
        updatedAt: now,
        updatedBy: 'test',
        stageWidth: 1200,
        stageHeight: 800,
        nodes: [
          {
            id: 'h1',
            kind: 'heading',
            rect: { x: 0, y: 0, width: 100, height: 40 },
            style: {} as never,
            rotation: 0,
            locked: false,
            visible: true,
            zIndex: 1,
            content: { level: 1, text: '국제 소송 서비스', color: '#0f172a', align: 'left' },
          },
        ],
      },
    });

    expect(tasks.some((task) => task.id === 'assistant-keyword-title' && task.status === 'todo')).toBe(true);
    expect(tasks.some((task) => task.id === 'assistant-h1' && task.status === 'done')).toBe(true);
  });
});
