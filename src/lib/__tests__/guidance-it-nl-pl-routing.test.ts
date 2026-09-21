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

const NEW_GUIDANCE = ['it', 'nl', 'pl'] as const;

/**
 * Italian, Dutch and Polish join the guidance tier.
 * SiteLocale stays four languages. html lang stays it / nl / pl.
 */
describe('it/nl/pl guidance routing', () => {
  it('does not widen builder Locale or SiteLocale', () => {
    expect(locales).toEqual(['ko', 'zh-hant', 'en']);
    expect(siteLocales).toEqual(['ko', 'zh-hant', 'en', 'ja']);
  });

  it('registers the three new locales as guidance locales', () => {
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
    expect(PUBLIC_LANGUAGE_AUTONYMS.it).toBe('Italiano');
    expect(PUBLIC_LANGUAGE_AUTONYMS.nl).toBe('Nederlands');
    expect(PUBLIC_LANGUAGE_AUTONYMS.pl).toBe('Polski');
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
    expect(PUBLIC_LANGUAGE_AUTONYMS.it).not.toMatch(/🇮🇹|\bItalia\b|\bItalian\b/);
    expect(PUBLIC_LANGUAGE_AUTONYMS.nl).not.toMatch(/🇳🇱|\bNederland\b|\bDutch\b/);
    expect(PUBLIC_LANGUAGE_AUTONYMS.pl).not.toMatch(/🇵🇱|\bPolska\b|\bPolish\b/);
  });

  it('maps /it, /nl and /pl to their own html lang tags', () => {
    expect(publicDocumentLanguage('it')).toBe('it');
    expect(publicDocumentLanguage('nl')).toBe('nl');
    expect(publicDocumentLanguage('pl')).toBe('pl');
    expect(resolvePublicDocumentLanguage('/it')).toBe('it');
    expect(resolvePublicDocumentLanguage('/nl/contact')).toBe('nl');
    expect(resolvePublicDocumentLanguage('/pl/faq')).toBe('pl');
    expect(hreflangTagForPublicLocale('it')).toBe('it');
    expect(hreflangTagForPublicLocale('nl')).toBe('nl');
    expect(hreflangTagForPublicLocale('pl')).toBe('pl');
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

  it('lets /it/columns and sibling column routes reach the file route', () => {
    expect(resolveGuidanceMiddlewareRewrite('/it/columns')).toBeNull();
    expect(resolveGuidanceMiddlewareRewrite('/nl/columns/taiwan-company-establishment-basics')).toBeNull();
    expect(resolveGuidanceMiddlewareRewrite('/pl/columns')).toBeNull();
    expect(resolveGuidanceMiddlewareRewrite('/it/columns/x')).toBeNull();
  });

  it('switches from /ko/about onto the three new locales', () => {
    expect(resolvePublicLanguageSwitchTarget('/ko/about', 'it')).toEqual({
      status: 'available',
      href: '/it/about',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/en/contact', 'nl')).toEqual({
      status: 'available',
      href: '/nl/contact',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/fr/faq', 'pl')).toEqual({
      status: 'available',
      href: '/pl/faq',
      fallback: 'exact',
    });
  });

  it('adds thirty self-canonical sitemap URLs for the ten pages in three locales', () => {
    const urls = NEW_GUIDANCE.flatMap((locale) =>
      GUIDANCE_PAGE_KEYS.map((pageKey) => guidanceCanonicalUrl(locale, pageKey)),
    );
    expect(urls).toHaveLength(30);
    expect(new Set(urls).size).toBe(30);
    expect(urls).toContain('https://tseng-law.com/it');
    expect(urls).toContain('https://tseng-law.com/nl/faq');
    expect(urls).toContain('https://tseng-law.com/pl/contact');
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
