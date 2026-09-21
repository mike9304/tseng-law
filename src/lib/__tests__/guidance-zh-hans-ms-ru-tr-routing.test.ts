import { describe, expect, it } from 'vitest';
import { locales, siteLocales } from '@/lib/locales';
import { GUIDANCE_LLMS_NOTICES, buildGuidanceLlmsTxt } from '@/lib/llms-txt';
import {
  GUIDANCE_CORE_ROUTE_KEYS,
  GUIDANCE_LOCALES_4,
  GUIDANCE_PAGE_KEYS,
  PUBLIC_GUIDANCE_INTERNAL_PAGE_SEGMENT,
  PUBLIC_LANGUAGE_AUTONYMS,
  PUBLIC_LOCALES_8,
  guidanceCanonicalUrl,
  hreflangTagForPublicLocale,
  isGuidanceLocale4,
  isPublicLocale8,
  publicDocumentLanguage,
  resolveGuidanceMiddlewareRewrite,
  resolvePublicDocumentLanguage,
  resolvePublicLanguageSwitchTarget,
} from '@/lib/public-guidance';

const NEW_GUIDANCE = ['zh-hans', 'ms', 'ru', 'tr'] as const;

/**
 * Simplified Chinese, Malay, Russian and Turkish join the guidance tier.
 * SiteLocale stays four languages. zh-hans maps to html lang zh-Hans.
 */
describe('zh-hans/ms/ru/tr guidance routing', () => {
  it('does not widen builder Locale or SiteLocale', () => {
    expect(locales).toEqual(['ko', 'zh-hant', 'en']);
    expect(siteLocales).toEqual(['ko', 'zh-hant', 'en', 'ja']);
  });

  it('registers the four new locales as guidance locales', () => {
    expect(GUIDANCE_LOCALES_4).toEqual([
      'vi',
      'id',
      'th',
      'fil',
      'ar',
      'de',
      'es',
      'fr',
      'pt',
      'zh-hans',
      'ms',
      'ru',
      'tr',
      'it',
      'nl',
      'pl',
      'hi',
      'sv',
      'da',
      'nb',
      'fi',
      'cs',
      'hu',
      'ro',
      'uk',
      'el',
      'he',
      'bn',
      'ur',
      'fa',
      'my',
      'ta',
      'ne',
      'km',
      'mn',
      'sk',
      'bg',
      'hr',
      'sr',
      'sl',
      'lt',
      'lv',
      'et',
      'ca',
      'is',
    ]);
    for (const locale of NEW_GUIDANCE) {
      expect(isGuidanceLocale4(locale)).toBe(true);
      expect(isPublicLocale8(locale)).toBe(true);
    }
  });

  it('keeps autonyms as language names without flags or country qualification', () => {
    expect(PUBLIC_LANGUAGE_AUTONYMS['zh-hans']).toBe('简体中文');
    expect(PUBLIC_LANGUAGE_AUTONYMS.ms).toBe('Bahasa Melayu');
    expect(PUBLIC_LANGUAGE_AUTONYMS.ru).toBe('Русский');
    expect(PUBLIC_LANGUAGE_AUTONYMS.tr).toBe('Türkçe');
    expect(PUBLIC_LOCALES_8).toEqual([
      'ko',
      'zh-hant',
      'en',
      'ja',
      'vi',
      'id',
      'th',
      'fil',
      'ar',
      'de',
      'es',
      'fr',
      'pt',
      'zh-hans',
      'ms',
      'ru',
      'tr',
      'it',
      'nl',
      'pl',
      'hi',
      'sv',
      'da',
      'nb',
      'fi',
      'cs',
      'hu',
      'ro',
      'uk',
      'el',
      'he',
      'bn',
      'ur',
      'fa',
      'my',
      'ta',
      'ne',
      'km',
      'mn',
      'sk',
      'bg',
      'hr',
      'sr',
      'sl',
      'lt',
      'lv',
      'et',
      'ca',
      'is',
    ]);
    expect(PUBLIC_LANGUAGE_AUTONYMS['zh-hans']).not.toMatch(/中国台湾|台湾省|大陆/);
    expect(PUBLIC_LANGUAGE_AUTONYMS.ms).not.toMatch(/🇲🇾|Malaysia|Malay/);
    expect(PUBLIC_LANGUAGE_AUTONYMS.ru).not.toMatch(/🇷🇺|Russia|Russian/);
    expect(PUBLIC_LANGUAGE_AUTONYMS.tr).not.toMatch(/🇹🇷|Turkey|Turkish/);
  });

  it('maps /zh-hans to html lang zh-Hans and the others to their own tags', () => {
    expect(publicDocumentLanguage('zh-hans')).toBe('zh-Hans');
    expect(publicDocumentLanguage('ms')).toBe('ms');
    expect(publicDocumentLanguage('ru')).toBe('ru');
    expect(publicDocumentLanguage('tr')).toBe('tr');
    expect(resolvePublicDocumentLanguage('/zh-hans')).toBe('zh-Hans');
    expect(resolvePublicDocumentLanguage('/ms/contact')).toBe('ms');
    expect(resolvePublicDocumentLanguage('/ru/faq')).toBe('ru');
    expect(resolvePublicDocumentLanguage('/tr/about')).toBe('tr');
    expect(hreflangTagForPublicLocale('zh-hans')).toBe('zh-Hans');
    expect(hreflangTagForPublicLocale('ms')).toBe('ms');
  });

  it.each(NEW_GUIDANCE)(
    'rewrites %s core pages onto the guidance catch-all',
    (locale) => {
      expect(GUIDANCE_PAGE_KEYS).toHaveLength(10);
      for (const route of GUIDANCE_CORE_ROUTE_KEYS) {
        if (route === 'columns') continue;
        const publicPath = route === '' ? `/${locale}` : `/${locale}/${route}`;
        const internalRest = route ? `/${route}` : '';
        expect(resolveGuidanceMiddlewareRewrite(publicPath)).toEqual({
          allowed: true,
          internalPath: `/${locale}/${PUBLIC_GUIDANCE_INTERNAL_PAGE_SEGMENT}${internalRest}`,
        });
      }
    },
  );

  it('lets /zh-hans/columns and sibling column routes reach the file route', () => {
    expect(resolveGuidanceMiddlewareRewrite('/zh-hans/columns')).toBeNull();
    expect(resolveGuidanceMiddlewareRewrite('/ms/columns/taiwan-company-establishment-basics')).toBeNull();
    expect(resolveGuidanceMiddlewareRewrite('/ru/columns')).toBeNull();
    expect(resolveGuidanceMiddlewareRewrite('/tr/columns/x')).toBeNull();
  });

  it('switches from /ko/about onto the four new locales', () => {
    expect(resolvePublicLanguageSwitchTarget('/ko/about', 'zh-hans')).toEqual({
      status: 'available',
      href: '/zh-hans/about',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/en/contact', 'ms')).toEqual({
      status: 'available',
      href: '/ms/contact',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/fr/faq', 'ru')).toEqual({
      status: 'available',
      href: '/ru/faq',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/pt/services', 'tr')).toEqual({
      status: 'available',
      href: '/tr/services',
      fallback: 'exact',
    });
  });

  it('adds forty self-canonical sitemap URLs for the ten pages in four locales', () => {
    const urls = NEW_GUIDANCE.flatMap((locale) =>
      GUIDANCE_PAGE_KEYS.map((pageKey) => guidanceCanonicalUrl(locale, pageKey)),
    );
    expect(urls).toHaveLength(40);
    expect(new Set(urls).size).toBe(40);
    expect(urls).toContain('https://tseng-law.com/zh-hans');
    expect(urls).toContain('https://tseng-law.com/ms/faq');
    expect(urls).toContain('https://tseng-law.com/ru/contact');
    expect(urls).toContain('https://tseng-law.com/tr/about');
  });

  it.each(NEW_GUIDANCE)('builds an llms.txt catalog for %s without requiring columns', (locale) => {
    const body = buildGuidanceLlmsTxt(locale);
    expect(body).toContain(GUIDANCE_LLMS_NOTICES[locale].consultationNotice);
    for (const pageKey of GUIDANCE_PAGE_KEYS) {
      const url =
        pageKey === 'home'
          ? `https://tseng-law.com/${locale}`
          : `https://tseng-law.com/${locale}/${pageKey}`;
      expect(body.split(`](${url}):`).length - 1, url).toBe(1);
    }
  });
});
