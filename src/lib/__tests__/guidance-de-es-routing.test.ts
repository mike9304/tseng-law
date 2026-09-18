import { describe, expect, it } from 'vitest';
import { locales, siteLocales } from '@/lib/locales';
import {
  GUIDANCE_CORE_ROUTE_KEYS,
  GUIDANCE_LOCALES_4,
  GUIDANCE_PAGE_KEYS,
  PUBLIC_GUIDANCE_INTERNAL_PAGE_SEGMENT,
  PUBLIC_LANGUAGE_AUTONYMS,
  PUBLIC_LOCALES_8,
  isGuidanceLocale4,
  isPublicLocale8,
  publicDocumentLanguage,
  resolveGuidanceMiddlewareRewrite,
  resolvePublicDocumentLanguage,
  resolvePublicLanguageSwitchTarget,
} from '@/lib/public-guidance';

/**
 * German and Spanish join the guidance tier (page language, not consultation
 * language). SiteLocale stays four languages.
 */
describe('de/es guidance routing', () => {
  it('does not widen builder Locale or SiteLocale', () => {
    expect(locales).toEqual(['ko', 'zh-hant', 'en']);
    expect(siteLocales).toEqual(['ko', 'zh-hant', 'en', 'ja']);
  });

  it('registers de and es as guidance locales', () => {
    expect(GUIDANCE_LOCALES_4).toEqual(['vi', 'id', 'th', 'fil', 'ar', 'de', 'es', 'fr', 'pt', 'zh-hans', 'ms', 'ru', 'tr']);
    expect(isGuidanceLocale4('de')).toBe(true);
    expect(isGuidanceLocale4('es')).toBe(true);
    expect(isPublicLocale8('de')).toBe(true);
    expect(isPublicLocale8('es')).toBe(true);
  });

  it('keeps autonyms as language names without flags or country qualification', () => {
    expect(PUBLIC_LANGUAGE_AUTONYMS.de).toBe('Deutsch');
    expect(PUBLIC_LANGUAGE_AUTONYMS.es).toBe('Español');
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
    ]);
    expect(PUBLIC_LANGUAGE_AUTONYMS.de).not.toMatch(/🇩🇪|Deutschland|German/);
    expect(PUBLIC_LANGUAGE_AUTONYMS.es).not.toMatch(/🇪🇸|España|Spanish|Latinoamérica/);
  });

  it('maps /de and /es to html lang de and es', () => {
    expect(publicDocumentLanguage('de')).toBe('de');
    expect(publicDocumentLanguage('es')).toBe('es');
    expect(resolvePublicDocumentLanguage('/de')).toBe('de');
    expect(resolvePublicDocumentLanguage('/es/contact')).toBe('es');
  });

  it.each(['de', 'es'] as const)(
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

  it('lets /de/columns and /es/columns reach the file route', () => {
    expect(resolveGuidanceMiddlewareRewrite('/de/columns')).toBeNull();
    expect(resolveGuidanceMiddlewareRewrite('/es/columns/taiwan-company-establishment-basics')).toBeNull();
  });

  it('switches from /ko/about onto /de/about and /es/about', () => {
    expect(resolvePublicLanguageSwitchTarget('/ko/about', 'de')).toEqual({
      status: 'available',
      href: '/de/about',
      fallback: 'exact',
    });
    expect(resolvePublicLanguageSwitchTarget('/en/contact', 'es')).toEqual({
      status: 'available',
      href: '/es/contact',
      fallback: 'exact',
    });
  });
});
