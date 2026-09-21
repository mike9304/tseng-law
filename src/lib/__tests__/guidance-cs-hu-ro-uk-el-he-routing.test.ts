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
  RTL_PUBLIC_LOCALES,
  guidanceCanonicalUrl,
  hreflangTagForPublicLocale,
  isGuidanceLocale4,
  isPublicLocale8,
  isRtlDocumentLanguage,
  publicDocumentLanguage,
  resolveGuidanceMiddlewareRewrite,
  resolvePublicDocumentLanguage,
  resolvePublicLanguageSwitchTarget,
} from '@/lib/public-guidance';

const NEW_GUIDANCE = ['cs', 'hu', 'ro', 'uk', 'el', 'he'] as const;

const AUTONYMS = {
  cs: 'Čeština',
  hu: 'Magyar',
  ro: 'Română',
  uk: 'Українська',
  el: 'Ελληνικά',
  he: 'עברית',
} as const;

/**
 * Czech, Hungarian, Romanian, Ukrainian, Greek and Hebrew join the guidance tier.
 * SiteLocale stays four languages. Hebrew is the second RTL locale after Arabic.
 */
describe('cs/hu/ro/uk/el/he guidance routing', () => {
  it('does not widen builder Locale or SiteLocale', () => {
    expect(locales).toEqual(['ko', 'zh-hant', 'en']);
    expect(siteLocales).toEqual(['ko', 'zh-hant', 'en', 'ja']);
  });

  it('registers the six locales as guidance locales at the end of the registry', () => {
    for (const locale of NEW_GUIDANCE) {
      expect(GUIDANCE_LOCALES_4).toContain(locale);
      expect(PUBLIC_LOCALES_8).toContain(locale);
    }
    expect(PUBLIC_LOCALES_8).toHaveLength(4 + GUIDANCE_LOCALES_4.length);
    for (const locale of NEW_GUIDANCE) {
      expect(isGuidanceLocale4(locale)).toBe(true);
      expect(isPublicLocale8(locale)).toBe(true);
    }
  });

  it('keeps autonyms as language names without flags or country qualification', () => {
    for (const locale of NEW_GUIDANCE) {
      expect(PUBLIC_LANGUAGE_AUTONYMS[locale]).toBe(AUTONYMS[locale]);
      expect(PUBLIC_LANGUAGE_AUTONYMS[locale]).not.toMatch(/\p{Regional_Indicator}|\(/u);
    }
  });

  it('maps each locale to its own html lang and hreflang tag', () => {
    for (const locale of NEW_GUIDANCE) {
      expect(publicDocumentLanguage(locale)).toBe(locale);
      expect(hreflangTagForPublicLocale(locale)).toBe(locale);
      expect(resolvePublicDocumentLanguage(`/${locale}`)).toBe(locale);
      expect(resolvePublicDocumentLanguage(`/${locale}/contact`)).toBe(locale);
    }
  });

  it('renders only Arabic and Hebrew right-to-left', () => {
    expect(RTL_PUBLIC_LOCALES).toEqual(['ar', 'he', 'ur', 'fa']);
    expect(isRtlDocumentLanguage('he')).toBe(true);
    expect(isRtlDocumentLanguage('ar')).toBe(true);
    for (const locale of ['cs', 'hu', 'ro', 'uk', 'el'] as const) {
      expect(isRtlDocumentLanguage(locale), locale).toBe(false);
    }
  });

  it.each(NEW_GUIDANCE)('rewrites %s core pages onto the guidance catch-all', (locale) => {
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
  });

  it.each(NEW_GUIDANCE)('lets /%s/columns and column details reach the file route', (locale) => {
    expect(resolveGuidanceMiddlewareRewrite(`/${locale}/columns`)).toBeNull();
    expect(
      resolveGuidanceMiddlewareRewrite(`/${locale}/columns/taiwan-company-establishment-basics`),
    ).toBeNull();
  });

  it('switches from existing locales onto the six new locales', () => {
    expect(resolvePublicLanguageSwitchTarget('/ko/about', 'cs')).toEqual({
      status: 'available',
      href: '/cs/about',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/en/contact', 'hu')).toEqual({
      status: 'available',
      href: '/hu/contact',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/de/faq', 'ro')).toEqual({
      status: 'available',
      href: '/ro/faq',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/ru/pricing', 'uk')).toEqual({
      status: 'available',
      href: '/uk/pricing',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/fi/services', 'el')).toEqual({
      status: 'available',
      href: '/el/services',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/ar/lawyers', 'he')).toEqual({
      status: 'available',
      href: '/he/lawyers',
      fallback: 'exact',
    });
  });

  it('adds sixty self-canonical sitemap URLs for the ten pages in six locales', () => {
    const urls = NEW_GUIDANCE.flatMap((locale) =>
      GUIDANCE_PAGE_KEYS.map((pageKey) => guidanceCanonicalUrl(locale, pageKey)),
    );
    expect(urls).toHaveLength(60);
    expect(new Set(urls).size).toBe(60);
    expect(urls).toContain('https://tseng-law.com/cs');
    expect(urls).toContain('https://tseng-law.com/he/faq');
  });

  it.each(NEW_GUIDANCE)('builds an llms.txt catalog for %s', (locale) => {
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
