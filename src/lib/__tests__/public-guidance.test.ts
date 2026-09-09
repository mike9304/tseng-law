import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { locales, siteLocales } from '@/lib/locales';
import {
  GUIDANCE_CORE_ROUTE_KEYS,
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

describe('allowed 40 guidance route pairs', () => {
  it('covers four locales × ten core pages', () => {
    expect(ALLOWED_ROUTE_PAIRS).toHaveLength(40);
    expect(GUIDANCE_PAGE_KEYS).toHaveLength(10);
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
    });
    expect(resolvePublicLanguageSwitchTarget('/ko/about', 'vi')).toEqual({
      status: 'available',
      href: '/vi/about',
    });
    expect(resolvePublicLanguageSwitchTarget('/en/faq', 'th')).toEqual({
      status: 'available',
      href: '/th/faq',
    });
    expect(resolvePublicLanguageSwitchTarget('/vi/columns', 'zh-hant')).toEqual({
      status: 'available',
      href: '/zh-hant/columns',
    });
    expect(resolvePublicLanguageSwitchTarget('/id', 'ja')).toEqual({
      status: 'available',
      href: '/ja',
    });
    expect(resolvePublicLanguageSwitchTarget('/fil/contact', 'en')).toEqual({
      status: 'available',
      href: '/en/contact',
    });
  });

  it('keeps the current path for a same-language selection', () => {
    expect(resolvePublicLanguageSwitchTarget('/vi/services', 'vi')).toEqual({
      status: 'available',
      href: '/vi/services',
    });
    expect(resolvePublicLanguageSwitchTarget('/ko/about', 'ko')).toEqual({
      status: 'available',
      href: '/ko/about',
    });
  });

  it('marks deep non-translated targets into the new four as unavailable', () => {
    expect(resolvePublicLanguageSwitchTarget('/ko/services/civil', 'vi')).toEqual({
      status: 'unavailable',
    });
    expect(resolvePublicLanguageSwitchTarget('/ja/columns/taiwan-company-establishment-basics', 'th')).toEqual({
      status: 'unavailable',
    });
    expect(resolvePublicLanguageSwitchTarget('/en/store', 'fil')).toEqual({
      status: 'unavailable',
    });
    expect(resolvePublicLanguageSwitchTarget('/zh-hant/lawyers/wei-tseng', 'id')).toEqual({
      status: 'unavailable',
    });
    expect(resolvePublicLanguageSwitchTarget('/ko/columns/some-slug', 'vi')).toEqual({
      status: 'unavailable',
    });
  });

  it('does not invent same-language fake article links for the new four', () => {
    expect(resolvePublicLanguageSwitchTarget('/ko/columns/some-slug', 'vi').status).toBe('unavailable');
    expect(guidancePublicPath('vi', 'columns')).toBe('/vi/columns');
    expect(guidancePublicPath('vi', 'home')).toBe('/vi');
  });

  it('consults Japanese public-route-policy for existing JA targets', () => {
    expect(resolvePublicLanguageSwitchTarget('/ko/services/civil', 'ja')).toEqual({
      status: 'available',
      href: '/ja/services/civil',
    });
    expect(resolvePublicLanguageSwitchTarget('/vi/about', 'ja')).toEqual({
      status: 'available',
      href: '/ja/about',
    });
    expect(resolvePublicLanguageSwitchTarget('/en/store/products/taiwan-business-guide', 'ja')).toEqual({
      status: 'available',
      href: '/ja/columns',
    });
    expect(resolvePublicLanguageSwitchTarget('/ko/taiwan-lawyer', 'ja')).toEqual({
      status: 'available',
      href: '/ja/taiwan-lawyer',
    });
  });

  it('preserves existing-four same-path and family-list restrictions', () => {
    expect(resolvePublicLanguageSwitchTarget('/ko/about', 'zh-hant')).toEqual({
      status: 'available',
      href: '/zh-hant/about',
    });
    expect(resolvePublicLanguageSwitchTarget('/en/portfolio/item', 'ko')).toEqual({
      status: 'available',
      href: '/ko/portfolio',
    });
    expect(resolvePublicLanguageSwitchTarget('/zh-hant/store/products/guide', 'en')).toEqual({
      status: 'available',
      href: '/en/store',
    });
  });

  it('strips internal rewrite segments before computing switch hrefs', () => {
    expect(
      visiblePublicPathname('/vi/__public-guidance/services'),
    ).toBe('/vi/services');
    expect(
      resolvePublicLanguageSwitchTarget('/vi/__public-guidance/services', 'ko'),
    ).toEqual({ status: 'available', href: '/ko/services' });
    expect(
      resolvePublicLanguageSwitchTarget('/th/__public-guidance-unavailable/store', 'fil'),
    ).toEqual({ status: 'unavailable' });
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
