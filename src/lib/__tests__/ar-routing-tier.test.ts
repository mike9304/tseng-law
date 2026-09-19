import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  GUIDANCE_LOCALES_4,
  PUBLIC_LANGUAGE_AUTONYMS,
  PUBLIC_LOCALES_8,
  ROUTED_ONLY_LOCALES,
  ROUTED_PUBLIC_LOCALES,
  RTL_PUBLIC_LOCALES,
  isGuidanceLocale4,
  isGuidanceRoutedLocale,
  isPublicLocale8,
  isRoutedOnlyLocale,
  isRoutedPublicLocale,
  isRtlDocumentLanguage,
  isRtlPublicLocale,
  parsePublicLocaleFromPathname,
  parseRoutedLocaleFromPathname,
  resolveGuidanceMiddlewareRewrite,
  resolvePublicDocumentLanguage,
  stripPublicLocaleFromPath,
} from '@/lib/public-guidance';
import { getSynchronizedDocumentLocaleState } from '@/components/DocumentLocaleSync';

const read = (rel: string) => readFileSync(path.join(process.cwd(), rel), 'utf8');

/**
 * WO-M2 registered `ar` (Arabic, right-to-left) in a *routing tier* ahead of
 * its content pack: middleware, `<html lang dir>`, fonts and the SEO
 * predicates knew it while every `Record<PublicLocale8, …>` content map stayed
 * typed on the eight shipped languages. WO-M3B landed the Arabic pack and
 * flipped `ar` into PUBLIC_LOCALES_8 / GUIDANCE_LOCALES_4, so the routing tier
 * is empty again and `/ar` is advertised like any other guidance language.
 * Everything below the first case is the routing behaviour that must survive
 * the flip unchanged.
 */
describe('ar routing tier', () => {
  it('has flipped ar into the content tier and emptied the routing-only tier', () => {
    expect(ROUTED_ONLY_LOCALES).toEqual([]);
    expect(ROUTED_PUBLIC_LOCALES).toEqual([...PUBLIC_LOCALES_8]);
    expect(RTL_PUBLIC_LOCALES).toEqual(['ar', 'he']);
    // Content tier now carries ar.
    expect(PUBLIC_LOCALES_8).toContain('ar');
    expect(GUIDANCE_LOCALES_4).toContain('ar');
    expect(isPublicLocale8('ar')).toBe(true);
    expect(isGuidanceLocale4('ar')).toBe(true);
    // Nothing is routed-only any more.
    expect(isRoutedOnlyLocale('ar')).toBe(false);
    expect(isRoutedPublicLocale('ar')).toBe(true);
    expect(isGuidanceRoutedLocale('ar')).toBe(true);
    for (const locale of GUIDANCE_LOCALES_4) expect(isGuidanceRoutedLocale(locale)).toBe(true);
    expect(isGuidanceRoutedLocale('en')).toBe(false);
    expect(PUBLIC_LANGUAGE_AUTONYMS.ar).toBe('العربية');
  });

  it('resolves /ar paths to the Arabic document language and right-to-left', () => {
    expect(resolvePublicDocumentLanguage('/ar')).toBe('ar');
    expect(resolvePublicDocumentLanguage('/ar/services')).toBe('ar');
    expect(resolvePublicDocumentLanguage('/AR/faq')).toBe('ar');
    expect(isRtlDocumentLanguage('ar')).toBe(true);
    for (const language of ['ko', 'zh-Hant', 'en', 'ja', 'vi', 'id', 'th', 'fil'] as const) {
      expect(isRtlDocumentLanguage(language)).toBe(false);
    }
    expect(isRtlPublicLocale('ar')).toBe(true);
    expect(isRtlPublicLocale('vi')).toBe(false);
    // Unknown locales still fall back to Korean, as before.
    expect(resolvePublicDocumentLanguage('/xx/anything')).toBe('ko');
  });

  it('strips the /ar prefix and parses it as a public locale', () => {
    expect(parseRoutedLocaleFromPathname('/ar/contact')).toBe('ar');
    expect(parsePublicLocaleFromPathname('/ar/contact')).toBe('ar');
    expect(stripPublicLocaleFromPath('/ar/contact')).toBe('/contact');
    expect(stripPublicLocaleFromPath('/ar')).toBe('/');
  });

  it('rewrites /ar core pages onto the guidance catch-all like the other four', () => {
    const services = resolveGuidanceMiddlewareRewrite('/ar/services');
    expect(services).toEqual({ allowed: true, internalPath: '/ar/__public-guidance/services' });
    expect(resolveGuidanceMiddlewareRewrite('/ar')).toEqual({ allowed: true, internalPath: '/ar/__public-guidance' });
    expect(resolveGuidanceMiddlewareRewrite('/ar/llms.txt')).toEqual({ allowed: true, internalPath: '/ar/llms.txt' });
    expect(resolveGuidanceMiddlewareRewrite('/ar/videos')?.allowed).toBe(false);
    // Existing four are untouched.
    expect(resolveGuidanceMiddlewareRewrite('/vi/services')).toEqual({ allowed: true, internalPath: '/vi/__public-guidance/services' });
    expect(resolveGuidanceMiddlewareRewrite('/en/services')).toBeNull();
  });

  it('keeps the middleware matcher and the root layout in step with the predicate', () => {
    const middleware = read('src/middleware.ts');
    expect(middleware).toContain("'/:locale(vi|id|th|fil|ar)'");
    expect(middleware).toContain("'/:locale(vi|id|th|fil|ar)/:path*'");
    const layout = read('src/app/layout.tsx');
    expect(layout).toMatch(/<html lang=\{language\} dir=\{direction\}/);
    expect(layout).toContain("isRtlDocumentLanguage(language) ? 'rtl' : 'ltr'");
  });

  it('moves <html dir> together with lang on client-side locale switches', () => {
    const ar = getSynchronizedDocumentLocaleState('', 'ar', '--font-noto-sans-arabic-loaded --font-noto-sans-latin-loaded', []);
    expect(ar.direction).toBe('rtl');
    const vi = getSynchronizedDocumentLocaleState('', 'vi', '--font-noto-sans-latin-loaded', []);
    expect(vi.direction).toBe('ltr');
    const sync = read('src/components/DocumentLocaleSync.tsx');
    expect(sync).toContain('root.dir = nextState.direction;');
  });

  it('binds an Arabic font stack and ships the generated RTL mirrors', () => {
    const css = read('src/app/globals.css');
    expect(css).toMatch(/--font-body-ar:\s*var\(--font-noto-sans-arabic-loaded, 'Noto Sans Arabic'\)/);
    expect(css).toMatch(/html\[lang='ar'\] \{[^}]*--font-body:\s*var\(--font-body-ar\)/);
    expect(css).toMatch(/\.site\[data-locale='ar'\] \{[^}]*--font-body:\s*var\(--font-body-ar\)/);
    const rtlBlock = css.slice(css.indexOf("RTL — html[dir='rtl']"));
    expect(rtlBlock.length).toBeGreaterThan(0);
    // Public chrome the guidance pages render must have mirrors…
    for (const sel of ['.skip-link', '.header-actions', '.mega-panel', '.faq-question button']) {
      expect(rtlBlock, sel).toContain(`html[dir='rtl'] ${sel}`);
    }
    // …but the JS-positioned nav indicator must not: its inline `left` is
    // computed from getBoundingClientRect and a CSS `right` would beat it in RTL.
    expect(rtlBlock).not.toContain("html[dir='rtl'] .nav-indicator");
    for (const mod of ['InternationalGuidance', 'InternationalInquiryForm', 'LocaleFlagSwitcher']) {
      expect(read(`src/components/${mod}.module.css`), mod).toContain("html[dir='rtl']");
    }
  });

  it('derives the sitemap, llms and og:locale guards from the locale sets instead of literals', () => {
    expect(read('src/app/sitemap.ts')).toContain('isGuidanceRoutedLocale(tag.toLowerCase())');
    const llms = read('src/lib/llms-txt.ts');
    expect(llms).not.toMatch(/length !== 4/);
    expect(llms).toContain('guidanceEntries.length !== GUIDANCE_LOCALES_4.length');
    expect(read('src/lib/seo.ts')).toMatch(/ar:\s*'ar_AR'/);
  });
});
