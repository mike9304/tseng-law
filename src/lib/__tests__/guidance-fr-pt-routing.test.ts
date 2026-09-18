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
  isGuidanceLocale4,
  isPublicLocale8,
  publicDocumentLanguage,
  resolveGuidanceMiddlewareRewrite,
  resolvePublicDocumentLanguage,
  resolvePublicLanguageSwitchTarget,
} from '@/lib/public-guidance';

/**
 * French and Portuguese join the guidance tier (page language, not consultation
 * language). SiteLocale stays four languages.
 */
describe('fr/pt guidance routing', () => {
  it('does not widen builder Locale or SiteLocale', () => {
    expect(locales).toEqual(['ko', 'zh-hant', 'en']);
    expect(siteLocales).toEqual(['ko', 'zh-hant', 'en', 'ja']);
  });

  it('registers fr and pt as guidance locales', () => {
    expect(GUIDANCE_LOCALES_4).toEqual(['vi', 'id', 'th', 'fil', 'ar', 'de', 'es', 'fr', 'pt']);
    expect(isGuidanceLocale4('fr')).toBe(true);
    expect(isGuidanceLocale4('pt')).toBe(true);
    expect(isPublicLocale8('fr')).toBe(true);
    expect(isPublicLocale8('pt')).toBe(true);
  });

  it('keeps autonyms as language names without flags or country qualification', () => {
    expect(PUBLIC_LANGUAGE_AUTONYMS.fr).toBe('Français');
    expect(PUBLIC_LANGUAGE_AUTONYMS.pt).toBe('Português');
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
    ]);
    expect(PUBLIC_LANGUAGE_AUTONYMS.fr).not.toMatch(/🇫🇷|France|French/);
    expect(PUBLIC_LANGUAGE_AUTONYMS.pt).not.toMatch(/🇵🇹|Portugal|Brazil|Portuguese/);
  });

  it('maps /fr and /pt to html lang fr and pt', () => {
    expect(publicDocumentLanguage('fr')).toBe('fr');
    expect(publicDocumentLanguage('pt')).toBe('pt');
    expect(resolvePublicDocumentLanguage('/fr')).toBe('fr');
    expect(resolvePublicDocumentLanguage('/pt/contact')).toBe('pt');
  });

  it.each(['fr', 'pt'] as const)(
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

  it('lets /fr/columns and /pt/columns reach the file route', () => {
    expect(resolveGuidanceMiddlewareRewrite('/fr/columns')).toBeNull();
    expect(resolveGuidanceMiddlewareRewrite('/pt/columns/taiwan-company-establishment-basics')).toBeNull();
  });

  it('switches from /ko/about onto /fr/about and /pt/about', () => {
    expect(resolvePublicLanguageSwitchTarget('/ko/about', 'fr')).toEqual({
      status: 'available',
      href: '/fr/about',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/en/contact', 'pt')).toEqual({
      status: 'available',
      href: '/pt/contact',
      fallback: 'exact',
    });
  });

  it('adds twenty self-canonical sitemap URLs for the ten French and Portuguese pages', () => {
    const urls = (['fr', 'pt'] as const).flatMap((locale) =>
      GUIDANCE_PAGE_KEYS.map((pageKey) => guidanceCanonicalUrl(locale, pageKey)),
    );
    expect(urls).toHaveLength(20);
    expect(new Set(urls).size).toBe(20);
    expect(urls).toContain('https://tseng-law.com/fr');
    expect(urls).toContain('https://tseng-law.com/pt/faq');
  });

  it.each(['fr', 'pt'] as const)('builds an llms.txt catalog for %s without requiring columns', (locale) => {
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
