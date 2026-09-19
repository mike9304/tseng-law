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

const NEW_GUIDANCE = ['hi', 'sv', 'da', 'nb', 'fi'] as const;

/**
 * Hindi, Swedish, Danish, Norwegian and Finnish join the guidance tier.
 * SiteLocale stays four languages.
 */
describe('hi/sv/da/nb/fi guidance routing', () => {
  it('does not widen builder Locale or SiteLocale', () => {
    expect(locales).toEqual(['ko', 'zh-hant', 'en']);
    expect(siteLocales).toEqual(['ko', 'zh-hant', 'en', 'ja']);
  });

  it('registers the five new locales as guidance locales', () => {
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
    ]);
    for (const locale of NEW_GUIDANCE) {
      expect(isGuidanceLocale4(locale)).toBe(true);
      expect(isPublicLocale8(locale)).toBe(true);
    }
  });

  it('keeps autonyms as language names without flags or country qualification', () => {
    expect(PUBLIC_LANGUAGE_AUTONYMS.hi).toBe('हिन्दी');
    expect(PUBLIC_LANGUAGE_AUTONYMS.sv).toBe('Svenska');
    expect(PUBLIC_LANGUAGE_AUTONYMS.da).toBe('Dansk');
    expect(PUBLIC_LANGUAGE_AUTONYMS.nb).toBe('Norsk');
    expect(PUBLIC_LANGUAGE_AUTONYMS.fi).toBe('Suomi');
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
    ]);
    expect(PUBLIC_LANGUAGE_AUTONYMS.hi).not.toMatch(/🇮🇳|\bIndia\b|\bHindi\b/);
    expect(PUBLIC_LANGUAGE_AUTONYMS.sv).not.toMatch(/🇸🇪|\bSverige\b|\bSwedish\b/);
    expect(PUBLIC_LANGUAGE_AUTONYMS.da).not.toMatch(/🇩🇰|\bDanmark\b|\bDanish\b/);
    expect(PUBLIC_LANGUAGE_AUTONYMS.nb).not.toMatch(/🇳🇴|\bNorge\b|\bNorwegian\b/);
    expect(PUBLIC_LANGUAGE_AUTONYMS.fi).not.toMatch(/🇫🇮|\bFinland\b|\bFinnish\b/);
  });

  it('maps /hi, /sv, /da, /nb and /fi to their own html lang tags', () => {
    expect(publicDocumentLanguage('hi')).toBe('hi');
    expect(publicDocumentLanguage('sv')).toBe('sv');
    expect(publicDocumentLanguage('da')).toBe('da');
    expect(publicDocumentLanguage('nb')).toBe('nb');
    expect(publicDocumentLanguage('fi')).toBe('fi');
    expect(resolvePublicDocumentLanguage('/hi')).toBe('hi');
    expect(resolvePublicDocumentLanguage('/sv/contact')).toBe('sv');
    expect(resolvePublicDocumentLanguage('/da/faq')).toBe('da');
    expect(resolvePublicDocumentLanguage('/nb/about')).toBe('nb');
    expect(resolvePublicDocumentLanguage('/fi/lawyers')).toBe('fi');
    expect(hreflangTagForPublicLocale('hi')).toBe('hi');
    expect(hreflangTagForPublicLocale('sv')).toBe('sv');
    expect(hreflangTagForPublicLocale('da')).toBe('da');
    expect(hreflangTagForPublicLocale('nb')).toBe('nb');
    expect(hreflangTagForPublicLocale('fi')).toBe('fi');
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

  it('lets /hi/columns and sibling column routes reach the file route', () => {
    expect(resolveGuidanceMiddlewareRewrite('/hi/columns')).toBeNull();
    expect(resolveGuidanceMiddlewareRewrite('/sv/columns/taiwan-company-establishment-basics')).toBeNull();
    expect(resolveGuidanceMiddlewareRewrite('/da/columns')).toBeNull();
    expect(resolveGuidanceMiddlewareRewrite('/nb/columns/x')).toBeNull();
    expect(resolveGuidanceMiddlewareRewrite('/fi/columns')).toBeNull();
  });

  it('switches from existing locales onto the five new locales', () => {
    expect(resolvePublicLanguageSwitchTarget('/ko/about', 'hi')).toEqual({
      status: 'available',
      href: '/hi/about',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/en/contact', 'sv')).toEqual({
      status: 'available',
      href: '/sv/contact',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/it/faq', 'da')).toEqual({
      status: 'available',
      href: '/da/faq',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/nl/pricing', 'nb')).toEqual({
      status: 'available',
      href: '/nb/pricing',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/pl/services', 'fi')).toEqual({
      status: 'available',
      href: '/fi/services',
      fallback: 'exact',
    });
  });

  it('adds fifty self-canonical sitemap URLs for the ten pages in five locales', () => {
    const urls = NEW_GUIDANCE.flatMap((locale) =>
      GUIDANCE_PAGE_KEYS.map((pageKey) => guidanceCanonicalUrl(locale, pageKey)),
    );
    expect(urls).toHaveLength(50);
    expect(new Set(urls).size).toBe(50);
    expect(urls).toContain('https://tseng-law.com/hi');
    expect(urls).toContain('https://tseng-law.com/sv/faq');
    expect(urls).toContain('https://tseng-law.com/da/contact');
    expect(urls).toContain('https://tseng-law.com/nb/about');
    expect(urls).toContain('https://tseng-law.com/fi/lawyers');
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
