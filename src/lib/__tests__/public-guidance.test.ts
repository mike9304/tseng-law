import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { locales, siteLocales } from '@/lib/locales';
import {
  GUIDANCE_ALL_PAGE_KEYS,
  GUIDANCE_CORE_ROUTE_KEYS,
  GUIDANCE_EXTRA_PAGE_KEYS,
  GUIDANCE_LOCALES_4,
  GUIDANCE_PAGE_KEYS,
  PUBLIC_GUIDANCE_INTERNAL_PAGE_SEGMENT,
  PUBLIC_GUIDANCE_INTERNAL_UNAVAILABLE_SEGMENT,
  PUBLIC_LANGUAGE_AUTONYMS,
  PUBLIC_LOCALES_8,
  buildGuidanceCoreLanguageAlternates,
  classifyGuidanceSlug,
  guidanceCanonicalUrl,
  guidancePageKeyFromSlugPath,
  guidancePublicPath,
  hreflangTagForPublicLocale,
  isGuidanceCoreSlugPath,
  isGuidanceExtraPageKey,
  isGuidanceLocale4,
  isPublicLocale8,
  publicDocumentLanguage,
  resolveGuidanceMiddlewareRewrite,
  resolvePublicDocumentLanguage,
  resolvePublicLanguageSwitchTarget,
  visiblePublicPathname,
  type GuidancePageKey,
} from '@/lib/public-guidance';

const ALLOWED_ROUTE_PAIRS = GUIDANCE_LOCALES_4.flatMap((locale) =>
  GUIDANCE_CORE_ROUTE_KEYS.map((route) => ({
    locale,
    route,
    publicPath: route === '' ? `/${locale}` : `/${locale}/${route}`,
    internalPath:
      route === ''
        ? `/${locale}/${PUBLIC_GUIDANCE_INTERNAL_PAGE_SEGMENT}`
        : `/${locale}/${PUBLIC_GUIDANCE_INTERNAL_PAGE_SEGMENT}/${route}`,
  })),
);

/** Catch-all rewrites except `/columns` + `/columns/*` (file routes own those). */
const REWRITTEN_ROUTE_PAIRS = ALLOWED_ROUTE_PAIRS.filter((pair) => pair.route !== 'columns');

describe('public eight-locale helper isolation', () => {
  it('does not widen Locale3 or SiteLocale4', () => {
    expect(locales).toEqual(['ko', 'zh-hant', 'en']);
    expect(siteLocales).toEqual(['ko', 'zh-hant', 'en', 'ja']);
    expect(PUBLIC_LOCALES_8).toHaveLength(8);
    expect(GUIDANCE_LOCALES_4).toEqual(['vi', 'id', 'th', 'fil']);
  });

  it('keeps helper free of CMS / builder-locale fallback', () => {
    const source = readFileSync(path.join(process.cwd(), 'src/lib/public-guidance.ts'), 'utf8');
    expect(source).not.toContain('toBuilderLocale');
    expect(source).not.toContain('normalizeSiteLocale');
    expect(source).not.toContain('normalizeLocale');
    expect(source).not.toContain('siteContent');
    expect(source).not.toContain('resolvePublishedSitePage');
  });

  it('exposes eight autonyms without flags or nationality labels', () => {
    expect(PUBLIC_LANGUAGE_AUTONYMS).toEqual({
      ko: '한국어',
      'zh-hant': '繁體中文',
      en: 'English',
      ja: '日本語',
      vi: 'Tiếng Việt',
      id: 'Bahasa Indonesia',
      th: 'ไทย',
      fil: 'Filipino',
    });
    const autonyms = Object.values(PUBLIC_LANGUAGE_AUTONYMS);
    expect(autonyms).toHaveLength(8);
    expect(new Set(autonyms).size).toBe(8);
    expect(autonyms.join('')).not.toMatch(/🇰🇷|🇯🇵|🇹🇼|🇺🇸|🇻🇳|🇮🇩|🇹🇭|🇵🇭/);

    const countryQualificationLabels = [
      '대한민국',
      '日本',
      '台灣',
      'United States',
      'Vietnam',
      'Indonesia',
      'Thailand',
      'Philippines',
    ] as const;
    for (const autonym of autonyms) {
      expect(countryQualificationLabels).not.toContain(autonym);
      for (const country of countryQualificationLabels) {
        expect(autonym).not.toMatch(new RegExp(`[(\\uFF08]\\s*${country}\\s*[)\\uFF09]`, 'i'));
        expect(autonym).not.toMatch(new RegExp(`\\s+[-\\u2013\\u2014]\\s*${country}$`, 'i'));
      }
    }
  });
});

describe('document language (html lang 8)', () => {
  it('maps zh-hant URL to zh-Hant HTML and keeps the other seven codes', () => {
    expect(publicDocumentLanguage('zh-hant')).toBe('zh-Hant');
    expect(publicDocumentLanguage('ko')).toBe('ko');
    expect(publicDocumentLanguage('en')).toBe('en');
    expect(publicDocumentLanguage('ja')).toBe('ja');
    expect(publicDocumentLanguage('vi')).toBe('vi');
    expect(publicDocumentLanguage('id')).toBe('id');
    expect(publicDocumentLanguage('th')).toBe('th');
    expect(publicDocumentLanguage('fil')).toBe('fil');
  });

  it('resolves html lang from the public pathname, defaulting unknown to ko', () => {
    expect(resolvePublicDocumentLanguage('/zh-hant/about')).toBe('zh-Hant');
    expect(resolvePublicDocumentLanguage('/vi/services')).toBe('vi');
    expect(resolvePublicDocumentLanguage('/id')).toBe('id');
    expect(resolvePublicDocumentLanguage('/th/columns')).toBe('th');
    expect(resolvePublicDocumentLanguage('/fil/contact')).toBe('fil');
    expect(resolvePublicDocumentLanguage('/ja/faq')).toBe('ja');
    expect(resolvePublicDocumentLanguage('/unknown')).toBe('ko');
    expect(resolvePublicDocumentLanguage(null)).toBe('ko');
  });
});

describe('allowed 48 guidance route pairs', () => {
  it('covers four locales × twelve routable pages', () => {
    expect(ALLOWED_ROUTE_PAIRS).toHaveLength(48);
    // The core ten never grow: the nav labels, the eight-language cluster and
    // the translation-lane content module are all keyed off this list.
    expect(GUIDANCE_PAGE_KEYS).toHaveLength(10);
    expect(GUIDANCE_EXTRA_PAGE_KEYS).toEqual(['company-setup', 'debt-collection']);
    expect(GUIDANCE_ALL_PAGE_KEYS).toHaveLength(12);
    expect(new Set(GUIDANCE_ALL_PAGE_KEYS).size).toBe(12);
    expect(GUIDANCE_CORE_ROUTE_KEYS).toHaveLength(12);
    expect(isGuidanceExtraPageKey('company-setup')).toBe(true);
    expect(isGuidanceExtraPageKey('services')).toBe(false);
  });

  it.each(REWRITTEN_ROUTE_PAIRS)(
    'rewrites $publicPath to the locale catch-all page segment',
    ({ locale, route, publicPath, internalPath }) => {
      expect(isGuidanceLocale4(locale)).toBe(true);
      expect(isGuidanceCoreSlugPath(route)).toBe(true);
      expect(resolveGuidanceMiddlewareRewrite(publicPath)).toEqual({
        allowed: true,
        internalPath,
      });
      expect(resolveGuidanceMiddlewareRewrite(`${publicPath}?utm=1`)).toEqual({
        allowed: true,
        internalPath,
      });
    },
  );

  it('does not rewrite new-four /columns or /columns/[slug] (file routes)', () => {
    for (const locale of GUIDANCE_LOCALES_4) {
      expect(resolveGuidanceMiddlewareRewrite(`/${locale}/columns`)).toBeNull();
      expect(resolveGuidanceMiddlewareRewrite(`/${locale}/columns/taiwan-gym-injury-lawsuit`)).toBeNull();
      expect(resolveGuidanceMiddlewareRewrite(`/${locale}/columns/missing`)).toBeNull();
    }
  });

  it('does not rewrite existing four-locale routes', () => {
    expect(resolveGuidanceMiddlewareRewrite('/ko/services/civil')).toBeNull();
    expect(resolveGuidanceMiddlewareRewrite('/zh-hant/columns/slug')).toBeNull();
    expect(resolveGuidanceMiddlewareRewrite('/en/store')).toBeNull();
    expect(resolveGuidanceMiddlewareRewrite('/ja/faq')).toBeNull();
    expect(resolveGuidanceMiddlewareRewrite('/ko')).toBeNull();
  });

  it.each(GUIDANCE_LOCALES_4)('lets /%s/llms.txt through without rewriting it', (locale) => {
    expect(resolveGuidanceMiddlewareRewrite(`/${locale}/llms.txt`)).toEqual({
      allowed: true,
      internalPath: `/${locale}/llms.txt`,
    });
    expect(resolveGuidanceMiddlewareRewrite(`/${locale}/llms.txt?utm=1`)).toEqual({
      allowed: true,
      internalPath: `/${locale}/llms.txt`,
    });
    expect(resolveGuidanceMiddlewareRewrite(`/${locale}/llms.txt/`)).toEqual({
      allowed: true,
      internalPath: `/${locale}/llms.txt`,
    });
  });

  it('keeps every other guidance path on its existing behaviour', () => {
    expect(resolveGuidanceMiddlewareRewrite('/vi/services')).toEqual({
      allowed: true,
      internalPath: `/vi/${PUBLIC_GUIDANCE_INTERNAL_PAGE_SEGMENT}/services`,
    });
    expect(resolveGuidanceMiddlewareRewrite('/vi')).toEqual({
      allowed: true,
      internalPath: `/vi/${PUBLIC_GUIDANCE_INTERNAL_PAGE_SEGMENT}`,
    });
    expect(resolveGuidanceMiddlewareRewrite('/vi/robots.txt')).toEqual({
      allowed: false,
      internalPath: `/vi/${PUBLIC_GUIDANCE_INTERNAL_UNAVAILABLE_SEGMENT}/robots.txt`,
    });
    expect(resolveGuidanceMiddlewareRewrite('/vi/store')).toEqual({
      allowed: false,
      internalPath: `/vi/${PUBLIC_GUIDANCE_INTERNAL_UNAVAILABLE_SEGMENT}/store`,
    });
    expect(resolveGuidanceMiddlewareRewrite('/ko/llms.txt')).toBeNull();
  });

  it('does not double-rewrite internal catch-all prefixes', () => {
    expect(
      resolveGuidanceMiddlewareRewrite(`/${'vi'}/${PUBLIC_GUIDANCE_INTERNAL_PAGE_SEGMENT}/services`),
    ).toBeNull();
    expect(
      resolveGuidanceMiddlewareRewrite(
        `/${'th'}/${PUBLIC_GUIDANCE_INTERNAL_UNAVAILABLE_SEGMENT}/store`,
      ),
    ).toBeNull();
  });
});

describe('unsupported nested-path guard', () => {
  it.each([
    ['/vi/services/civil', '/vi/__public-guidance-unavailable/services/civil'],
    ['/fil/store', '/fil/__public-guidance-unavailable/store'],
    ['/id/lawyers/wei-tseng', '/id/__public-guidance-unavailable/lawyers/wei-tseng'],
    ['/vi/account', '/vi/__public-guidance-unavailable/account'],
    ['/fil/store/products/guide', '/fil/__public-guidance-unavailable/store/products/guide'],
    ['/id/admin-builder', '/id/__public-guidance-unavailable/admin-builder'],
  ] as const)('maps %s to unavailable catch-all %s', (publicPath, internalPath) => {
    expect(resolveGuidanceMiddlewareRewrite(publicPath)).toEqual({
      allowed: false,
      internalPath,
    });
    expect(guidancePageKeyFromSlugPath(publicPath.replace(/^\/[^/]+\//, ''))).toBeNull();
  });

  it('classifies rewritten slugs without treating nested paths as core pages', () => {
    expect(classifyGuidanceSlug(['__public-guidance', 'services'])).toEqual({
      kind: 'page',
      pageKey: 'services',
    });
    expect(classifyGuidanceSlug(['__public-guidance'])).toEqual({
      kind: 'page',
      pageKey: 'home',
    });
    expect(classifyGuidanceSlug(['__public-guidance', 'services', 'civil'])).toEqual({
      kind: 'unavailable',
    });
    expect(classifyGuidanceSlug(['__public-guidance-unavailable', 'store'])).toEqual({
      kind: 'unavailable',
    });
    expect(classifyGuidanceSlug(['columns', 'slug'])).toEqual({ kind: 'unavailable' });
  });
});

describe('language switch targets', () => {
  it('preserves core paths across all eight locales', () => {
    expect(resolvePublicLanguageSwitchTarget('/vi/about', 'ko')).toEqual({
      status: 'available',
      href: '/ko/about',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/ko/about', 'vi')).toEqual({
      status: 'available',
      href: '/vi/about',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/en/faq', 'th')).toEqual({
      status: 'available',
      href: '/th/faq',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/vi/columns', 'zh-hant')).toEqual({
      status: 'available',
      href: '/zh-hant/columns',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/id', 'ja')).toEqual({
      status: 'available',
      href: '/ja',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/fil/contact', 'en')).toEqual({
      status: 'available',
      href: '/en/contact',
      fallback: 'exact',
    });
  });

  it('keeps the current path for a same-language selection', () => {
    expect(resolvePublicLanguageSwitchTarget('/vi/services', 'vi')).toEqual({
      status: 'available',
      href: '/vi/services',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/ko/about', 'ko')).toEqual({
      status: 'available',
      href: '/ko/about',
      fallback: 'exact',
    });
  });

  /**
   * WO-O22 A: the switcher must offer all eight languages on every public page
   * and must never link to a 404. A page the new four do not publish therefore
   * resolves to the nearest page that does exist, flagged as a fallback so the
   * UI can say so in its accessible label.
   */
  it('lands deep non-translated targets on the nearest existing new-four page', () => {
    expect(resolvePublicLanguageSwitchTarget('/ko/services/civil', 'vi')).toEqual({
      status: 'available',
      href: '/vi',
      fallback: 'home',
    });
    expect(
      resolvePublicLanguageSwitchTarget('/ja/columns/taiwan-company-establishment-basics', 'th'),
    ).toEqual({
      status: 'available',
      href: '/th/columns',
      fallback: 'columns-list',
    });
    expect(resolvePublicLanguageSwitchTarget('/en/store', 'fil')).toEqual({
      status: 'available',
      href: '/fil',
      fallback: 'home',
    });
    expect(resolvePublicLanguageSwitchTarget('/zh-hant/lawyers/wei-tseng', 'id')).toEqual({
      status: 'available',
      href: '/id',
      fallback: 'home',
    });
  });

  it('links the same article when the target language has that translation on disk', () => {
    const columnSlugsByLocale = { vi: ['taiwan-labor-severance-law'], th: [] };
    expect(
      resolvePublicLanguageSwitchTarget('/ja/columns/taiwan-labor-severance-law', 'vi', {
        columnSlugsByLocale,
      }),
    ).toEqual({
      status: 'available',
      href: '/vi/columns/taiwan-labor-severance-law',
      fallback: 'exact',
    });
    // th has no such file, so it degrades to the th column index, not a 404.
    expect(
      resolvePublicLanguageSwitchTarget('/ja/columns/taiwan-labor-severance-law', 'th', {
        columnSlugsByLocale,
      }),
    ).toEqual({
      status: 'available',
      href: '/th/columns',
      fallback: 'columns-list',
    });
  });

  it('does not invent same-language fake article links for the new four', () => {
    // Nothing declares `some-slug` in vi, so the resolver refuses to build
    // `/vi/columns/some-slug` and points at the vi column index instead.
    expect(resolvePublicLanguageSwitchTarget('/ko/columns/some-slug', 'vi')).toEqual({
      status: 'available',
      href: '/vi/columns',
      fallback: 'columns-list',
    });
    expect(
      resolvePublicLanguageSwitchTarget('/ko/columns/some-slug', 'vi', {
        columnSlugsByLocale: { vi: ['taiwan-labor-severance-law'] },
      }),
    ).toEqual({
      status: 'available',
      href: '/vi/columns',
      fallback: 'columns-list',
    });
    expect(guidancePublicPath('vi', 'columns')).toBe('/vi/columns');
    expect(guidancePublicPath('vi', 'home')).toBe('/vi');
  });

  it('consults Japanese public-route-policy for existing JA targets', () => {
    expect(resolvePublicLanguageSwitchTarget('/ko/services/civil', 'ja')).toEqual({
      status: 'available',
      href: '/ja/services/civil',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/vi/about', 'ja')).toEqual({
      status: 'available',
      href: '/ja/about',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/en/store/products/taiwan-business-guide', 'ja')).toEqual({
      status: 'available',
      href: '/ja/columns',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/ko/taiwan-lawyer', 'ja')).toEqual({
      status: 'available',
      href: '/ja/taiwan-lawyer',
      fallback: 'exact',
    });
  });

  it('preserves existing-four same-path and family-list restrictions', () => {
    expect(resolvePublicLanguageSwitchTarget('/ko/about', 'zh-hant')).toEqual({
      status: 'available',
      href: '/zh-hant/about',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/en/portfolio/item', 'ko')).toEqual({
      status: 'available',
      href: '/ko/portfolio',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/zh-hant/store/products/guide', 'en')).toEqual({
      status: 'available',
      href: '/en/store',
      fallback: 'exact',
    });
  });

  it('strips internal rewrite segments before computing switch hrefs', () => {
    expect(
      visiblePublicPathname('/vi/__public-guidance/services'),
    ).toBe('/vi/services');
    expect(
      resolvePublicLanguageSwitchTarget('/vi/__public-guidance/services', 'ko'),
    ).toEqual({ status: 'available', href: '/ko/services', fallback: 'exact' });
    expect(
      resolvePublicLanguageSwitchTarget('/th/__public-guidance-unavailable/store', 'fil'),
    ).toEqual({ status: 'available', href: '/fil', fallback: 'home' });
  });
});

describe('core hreflang helper', () => {
  it('emits actual core corresponding paths for all eight, with zh-Hant HTML tags', () => {
    const languages = buildGuidanceCoreLanguageAlternates('about');
    expect(languages).toMatchObject({
      ko: 'https://tseng-law.com/ko/about',
      'zh-Hant': 'https://tseng-law.com/zh-hant/about',
      en: 'https://tseng-law.com/en/about',
      ja: 'https://tseng-law.com/ja/about',
      vi: 'https://tseng-law.com/vi/about',
      id: 'https://tseng-law.com/id/about',
      th: 'https://tseng-law.com/th/about',
      fil: 'https://tseng-law.com/fil/about',
      'x-default': 'https://tseng-law.com/en/about',
    });
    expect(hreflangTagForPublicLocale('zh-hant')).toBe('zh-Hant');
  });

  it('respects the existing English-noindex policy on faq', () => {
    const languages = buildGuidanceCoreLanguageAlternates('faq');
    expect(languages).not.toHaveProperty('en');
    expect(languages).toMatchObject({
      ko: 'https://tseng-law.com/ko/faq',
      'zh-Hant': 'https://tseng-law.com/zh-hant/faq',
      ja: 'https://tseng-law.com/ja/faq',
      vi: 'https://tseng-law.com/vi/faq',
      'x-default': 'https://tseng-law.com/ko/faq',
    });
  });

  it('keeps a page outside the core ten inside the guidance four, with no x-default', () => {
    for (const pageKey of GUIDANCE_EXTRA_PAGE_KEYS) {
      const languages = buildGuidanceCoreLanguageAlternates(pageKey);
      expect(languages).toEqual({
        vi: `https://tseng-law.com/vi/${pageKey}`,
        id: `https://tseng-law.com/id/${pageKey}`,
        th: `https://tseng-law.com/th/${pageKey}`,
        fil: `https://tseng-law.com/fil/${pageKey}`,
      });
      // No ko/zh-Hant/ja/en URL exists at this path, and an x-default pointing
      // outside the cluster would not be reciprocal — so neither is claimed.
      for (const tag of ['ko', 'zh-Hant', 'ja', 'en', 'x-default']) {
        expect(languages, `${pageKey} must not claim ${tag}`).not.toHaveProperty(tag);
      }
    }
  });

  it('leaves the core ten on their eight-language cluster', () => {
    for (const pageKey of GUIDANCE_PAGE_KEYS) {
      const languages = buildGuidanceCoreLanguageAlternates(pageKey);
      const tags = Object.keys(languages).filter((tag) => tag !== 'x-default');
      // `faq` is English-noindex, so it publishes seven; the rest publish eight.
      expect(tags, `${pageKey} cluster`).toHaveLength(pageKey === 'faq' ? 7 : 8);
      expect(languages, `${pageKey} x-default`).toHaveProperty('x-default');
      expect(languages.vi).toBe(`https://tseng-law.com${guidancePublicPath('vi', pageKey)}`);
    }
  });

  it('routes and classifies the new keys without touching the core ten', () => {
    for (const pageKey of GUIDANCE_EXTRA_PAGE_KEYS) {
      expect(isGuidanceCoreSlugPath(pageKey)).toBe(true);
      expect(guidancePageKeyFromSlugPath(pageKey)).toBe(pageKey);
      expect(classifyGuidanceSlug([PUBLIC_GUIDANCE_INTERNAL_PAGE_SEGMENT, pageKey])).toEqual({
        kind: 'page',
        pageKey,
      });
      for (const locale of GUIDANCE_LOCALES_4) {
        expect(guidancePublicPath(locale, pageKey)).toBe(`/${locale}/${pageKey}`);
        expect(guidanceCanonicalUrl(locale, pageKey)).toBe(
          `https://tseng-law.com/${locale}/${pageKey}`,
        );
        expect(resolveGuidanceMiddlewareRewrite(`/${locale}/${pageKey}`)).toEqual({
          allowed: true,
          internalPath: `/${locale}/${PUBLIC_GUIDANCE_INTERNAL_PAGE_SEGMENT}/${pageKey}`,
        });
      }
      // The existing four publish no such path, so the middleware ignores it.
      expect(resolveGuidanceMiddlewareRewrite(`/ko/${pageKey}`)).toBeNull();
    }
  });

  it('never switches a new-key page into a locale that has no such URL', () => {
    for (const pageKey of GUIDANCE_EXTRA_PAGE_KEYS) {
      for (const target of ['ko', 'zh-hant', 'en', 'ja'] as const) {
        expect(
          resolvePublicLanguageSwitchTarget(`/vi/${pageKey}`, target),
          `${pageKey} -> ${target}`,
        ).toEqual({ status: 'available', href: `/${target}`, fallback: 'home' });
      }
      expect(resolvePublicLanguageSwitchTarget(`/vi/${pageKey}`, 'th')).toEqual({
        status: 'available',
        href: `/th/${pageKey}`,
        fallback: 'exact',
      });
      expect(resolvePublicLanguageSwitchTarget(`/vi/${pageKey}`, 'vi')).toEqual({
        status: 'available',
        href: `/vi/${pageKey}`,
        fallback: 'exact',
      });
    }
  });

  it('builds self-canonical URLs from the page key', () => {
    expect(guidanceCanonicalUrl('vi', 'home')).toBe('https://tseng-law.com/vi');
    expect(guidanceCanonicalUrl('th', 'columns')).toBe('https://tseng-law.com/th/columns');
  });
});

describe('type guards', () => {
  it('distinguishes guidance four from public eight', () => {
    expect(isGuidanceLocale4('vi')).toBe(true);
    expect(isGuidanceLocale4('ko')).toBe(false);
    expect(isPublicLocale8('fil')).toBe(true);
    expect(isPublicLocale8('fr')).toBe(false);
    const keys: GuidancePageKey[] = [...GUIDANCE_PAGE_KEYS];
    expect(keys).toContain('home');
    expect(guidancePageKeyFromSlugPath('')).toBe('home');
    expect(guidancePageKeyFromSlugPath('home')).toBeNull();
  });
});
