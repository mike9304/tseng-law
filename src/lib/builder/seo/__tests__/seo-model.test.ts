import { describe, expect, it } from 'vitest';
import type { BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';
import { DEFAULT_THEME } from '@/lib/builder/site/types';
import { buildHreflangAlternates } from '@/lib/builder/seo/hreflang';
import { buildBuilderSeoOverview } from '@/lib/builder/seo/overview';
import { buildPageSeo, buildSitemapEntries } from '@/lib/builder/seo/seo-model';
import { buildSeoAssistantTasks } from '@/lib/builder/seo/assistant';
import {
  buildDefaultSeoMetadata,
  expandSeoTemplate,
  getBuilderSeoDefaults,
} from '@/lib/builder/seo/defaults';
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
  it.each(['ko', 'zh-hant', 'en'] as const)(
    'forces the public reviews page to noindex in %s',
    (locale) => {
      const seo = buildPageSeo(
        page({
          slug: 'reviews',
          locale,
          noIndex: false,
          seo: { noIndex: false },
        }),
        'https://example.com',
        locale,
        [],
      );

      expect(seo.canonical).toBe(`https://example.com/${locale}/reviews`);
      expect(seo.noIndex).toBe(true);
    },
  );

  it('keeps a localized reviews slug noindex based on the underlying page', () => {
    const seo = buildPageSeo(
      page({
        slug: 'reviews',
        slugByLocale: { en: 'client-reviews' },
        seo: {
          noIndex: false,
          localizedOverrides: {
            en: { noIndex: false },
          },
        } as never,
      }),
      'https://example.com',
      'en',
      [],
    );

    expect(seo.canonical).toBe('https://example.com/en/client-reviews');
    expect(seo.noIndex).toBe(true);
  });

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

  it('uses locale-specific SEO overrides when rendering public metadata', () => {
    const seo = buildPageSeo(
      page({
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
            },
          },
        } as never,
      }),
      'https://example.com',
      'en',
      [],
    );

    expect(seo.title).toBe('About us');
    expect(seo.description).toBe('English description');
    expect(seo.ogTitle).toBe('About OG');
    expect(seo.twitterDescription).toBe('English tweet description');
  });

  it('uses localized slugs for public canonical and hreflang URLs', () => {
    const ko = page({
      slug: 'about',
      seo: {
        localizedOverrides: {
          en: { title: 'About us' },
        },
      } as never,
      slugByLocale: { en: 'about-us' },
      linkedPageIds: { en: 'page-en' },
    } as Partial<BuilderPageMeta>);
    const en = page({
      pageId: 'page-en',
      locale: 'en',
      slug: 'about',
      title: { ko: '소개', en: 'About', 'zh-hant': '服務' },
    });

    const seo = buildPageSeo(ko, 'https://example.com', 'en', [ko, en]);
    expect(seo.canonical).toBe('https://example.com/en/about-us');
    expect(seo.title).toBe('About us');

    const alternates = buildHreflangAlternates(ko, 'https://example.com', [ko, en]);
    expect(alternates.map((entry) => entry.href)).toContain('https://example.com/en/about-us');
    expect(alternates.map((entry) => entry.href)).toContain('https://example.com/ko/about');
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

  it('emits hreflang for every locale for a home page without explicit linkedPageIds', () => {
    const koHome = page({
      pageId: 'home-ko',
      slug: '',
      isHomePage: true,
      locale: 'ko',
      title: { ko: '홈', en: 'Home', 'zh-hant': '首頁' },
    });
    const zhHome = page({
      pageId: 'home-zh',
      slug: '',
      isHomePage: true,
      locale: 'zh-hant',
      title: { ko: '홈', en: 'Home', 'zh-hant': '首頁' },
    });
    const enHome = page({
      pageId: 'home-en',
      slug: '',
      isHomePage: true,
      locale: 'en',
      title: { ko: '홈', en: 'Home', 'zh-hant': '首頁' },
    });
    const all = [koHome, zhHome, enHome];

    const alternates = buildHreflangAlternates(koHome, 'https://example.com', all);
    const tags = alternates.map((a) => a.hreflang);

    expect(tags).toEqual(expect.arrayContaining(['ko', 'zh-Hant', 'en', 'x-default']));
    expect(alternates.map((a) => a.href)).toEqual(
      expect.arrayContaining([
        'https://example.com/ko',
        'https://example.com/zh-hant',
        'https://example.com/en',
      ]),
    );
    expect(alternates.find((a) => a.hreflang === 'x-default')?.href).toBe('https://example.com/ko');
  });

  it('advertises static-fallback locales for the home page even without a builder en home', () => {
    // Reproduces the reported /ko hreflang bug: /en home is served 200 by
    // the legacy/static fallback route even though no builder en home page
    // exists, so the implicit home linkage previously dropped `en`.
    const koHome = page({
      pageId: 'home-ko',
      slug: '',
      isHomePage: true,
      locale: 'ko',
      title: { ko: '홈', en: 'Home', 'zh-hant': '首頁' },
    });
    const zhHome = page({
      pageId: 'home-zh',
      slug: '',
      isHomePage: true,
      locale: 'zh-hant',
      title: { ko: '홈', en: 'Home', 'zh-hant': '首頁' },
    });
    // NOTE: no builder en home page — only ko + zh-hant.
    const all = [koHome, zhHome];

    const alternates = buildHreflangAlternates(koHome, 'https://example.com', all);
    const tags = alternates.map((a) => a.hreflang);

    expect(tags).toEqual(expect.arrayContaining(['ko', 'zh-Hant', 'en', 'x-default']));
    expect(alternates.find((a) => a.hreflang === 'en')?.href).toBe('https://example.com/en');
    expect(alternates.find((a) => a.hreflang === 'x-default')?.href).toBe('https://example.com/ko');
  });

  it('keeps a ko-only page ko-only (self + x-default, no other locales)', () => {
    const koOnly = page({
      pageId: 'page-ko-only',
      slug: 'ko-only-page',
      locale: 'ko',
    });

    const alternates = buildHreflangAlternates(koOnly, 'https://example.com', [koOnly]);
    const tags = alternates.map((a) => a.hreflang);

    expect(tags).toEqual(['ko', 'x-default']);
    expect(tags).not.toContain('zh-Hant');
    expect(tags).not.toContain('en');
  });

  it('advertises ja (5 tags) for a standard-slug page like about', () => {
    // /ja/about is served 200 by the static/legacy fallback and listed in the
    // /ja sitemap, so the builder-published /ko/about must advertise it for
    // hreflang mutuality (WO#3b).
    const aboutKo = page({
      pageId: 'about-ko',
      slug: 'about',
      locale: 'ko',
    });

    const alternates = buildHreflangAlternates(aboutKo, 'https://example.com', [aboutKo]);
    const tags = alternates.map((a) => a.hreflang);

    expect(tags).toEqual(['ko', 'zh-Hant', 'en', 'ja', 'x-default']);
    expect(alternates.find((a) => a.hreflang === 'ja')?.href).toBe('https://example.com/ja/about');
    expect(alternates.find((a) => a.hreflang === 'x-default')?.href).toBe('https://example.com/ko/about');
  });

  it('advertises ja on the home page even without a builder ja home', () => {
    const koHome = page({
      pageId: 'home-ko',
      slug: '',
      isHomePage: true,
      locale: 'ko',
      title: { ko: '홈', en: 'Home', 'zh-hant': '首頁' },
    });

    const alternates = buildHreflangAlternates(koHome, 'https://example.com', [koHome]);
    const tags = alternates.map((a) => a.hreflang);

    expect(tags).toEqual(['ko', 'zh-Hant', 'en', 'ja', 'x-default']);
    expect(alternates.find((a) => a.hreflang === 'ja')?.href).toBe('https://example.com/ja');
    expect(alternates.find((a) => a.hreflang === 'x-default')?.href).toBe('https://example.com/ko');
  });

  it('strips the en alternate on English-noindex routes (faq) but keeps ja + x-default', () => {
    // /en/faq is noindex — advertising it as an hreflang target is an SEO
    // defect. /ja/faq IS indexable, so it must stay. Mirrors
    // getLanguageAlternates in src/lib/seo.ts.
    const faqKo = page({
      pageId: 'faq-ko',
      slug: 'faq',
      locale: 'ko',
      // Even a real linked EN translation must not leak: /en/faq is noindex.
      linkedPageIds: { en: 'faq-en' },
    });
    const faqEn = page({
      pageId: 'faq-en',
      slug: 'faq',
      locale: 'en',
      title: { ko: 'FAQ', en: 'FAQ', 'zh-hant': '常見問題' },
    });

    const alternates = buildHreflangAlternates(faqKo, 'https://example.com', [faqKo, faqEn]);
    const tags = alternates.map((a) => a.hreflang);

    expect(tags).toEqual(['ko', 'zh-Hant', 'ja', 'x-default']);
    expect(tags).not.toContain('en');
    expect(alternates.find((a) => a.hreflang === 'ja')?.href).toBe('https://example.com/ja/faq');
    expect(alternates.find((a) => a.hreflang === 'x-default')?.href).toBe('https://example.com/ko/faq');
  });

  it('advertises static-fallback locales for a standard-slug page without translations', () => {
    // A builder page whose slug is a legacy-fallback slug (e.g. services)
    // is reachable at /<locale>/services for every supported locale via the
    // static fallback, so hreflang must point at them even with no linked
    // builder translations. `slugByLocale` overrides are intentionally
    // ignored for the static URL (the legacy route uses the canonical slug).
    const servicesKo = page({
      pageId: 'services-ko',
      slug: 'services',
      locale: 'ko',
      slugByLocale: { en: 'our-services' } as never,
    });

    const alternates = buildHreflangAlternates(servicesKo, 'https://example.com', [servicesKo]);
    const tags = alternates.map((a) => a.hreflang);

    expect(tags).toEqual(expect.arrayContaining(['ko', 'zh-Hant', 'en', 'x-default']));
    expect(alternates.find((a) => a.hreflang === 'en')?.href).toBe('https://example.com/en/services');
    expect(alternates.find((a) => a.hreflang === 'zh-Hant')?.href).toBe('https://example.com/zh-hant/services');
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

  it('uses locale-resolved firm name in the SEO overview checklist', () => {
    const current = page({
      locale: 'en',
      title: { ko: '서비스', en: 'Services', 'zh-hant': '服務' },
      seo: {
        title: 'Services | Tseng Law',
        description: 'Services page for Tseng Law.',
      },
    });
    const overview = buildBuilderSeoOverview({
      site: {
        ...site([current]),
        locale: 'en',
        settings: {
          firmName: '호정국제',
          seoChecklist: {
            businessName: '호정국제',
            keywords: ['국제 법률'],
            serviceMode: 'both',
          },
          localizedOverrides: {
            en: {
              firmName: 'Tseng Law',
              seoChecklist: {
                businessName: 'Tseng Law',
                keywords: ['international law'],
                serviceMode: 'online',
              },
            },
          },
        },
      },
      canvasesByPageId: new Map(),
    });

    expect(overview.checklist.find((item) => item.id === 'business-name')?.status).toBe('done');
    expect(overview.checklist.find((item) => item.id === 'business-name')?.detail).toBe('Tseng Law');
    expect(overview.checklistSettings).toMatchObject({
      businessName: 'Tseng Law',
      keywords: ['international law'],
      serviceMode: 'online',
    });
  });

  it('uses locale-specific page SEO values in the SEO overview validation', () => {
    const current = page({
      locale: 'en',
      seo: {
        localizedOverrides: {
          en: {
            title: 'About us',
            description: 'English description',
          },
        },
      } as never,
    });
    const overview = buildBuilderSeoOverview({
      site: {
        ...site([current]),
        locale: 'en',
      },
      canvasesByPageId: new Map(),
    });

    expect(overview.pages[0].issues.some((issue) => issue.id === 'seo-title-missing')).toBe(false);
    expect(overview.pages[0].issues.some((issue) => issue.id === 'seo-description-missing')).toBe(false);
    expect(overview.pages[0].title).toBe('Services');
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

  it('resolves locale-specific SEO defaults from localized site settings', () => {
    const current = page({ seo: undefined, locale: 'en' });
    const doc = {
      ...site([current]),
      settings: {
        firmName: '호정국제',
        localizedOverrides: {
          en: {
            firmName: 'Tseng Law',
            seoDefaults: {
              patterns: {
                titleTemplate: '{{pageName}} | Tseng Law',
              },
            },
          },
        },
        seoDefaults: {
          patterns: {
            titleTemplate: '{{pageName}} | {{siteName}}',
            descriptionTemplate: '{{pageName}} - {{businessName}}',
          },
        },
      },
    };

    expect(getBuilderSeoDefaults(doc, 'en').patterns?.titleTemplate).toBe('{{pageName}} | Tseng Law');
    const defaults = buildDefaultSeoMetadata({
      page: current,
      site: doc,
      siteUrl: 'https://example.com',
      locale: 'en',
    });

    expect(defaults.title).toBe('Services | Tseng Law');
    expect(defaults.description).toBe('Services - Tseng Law');
  });

  it('uses locale-specific focus keyword when building SEO defaults', () => {
    const current = page({
      locale: 'en',
      seo: {
        focusKeyword: '국제 소송',
        localizedOverrides: {
          en: {
            focusKeyword: 'international law',
          },
        },
      } as never,
    });
    const defaults = buildDefaultSeoMetadata({
      page: current,
      site: site([current]),
      siteUrl: 'https://example.com',
      locale: 'en',
    });

    expect(defaults.focusKeyword).toBe('international law');
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
