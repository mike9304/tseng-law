/**
 * SEO maturity — hreflang generator.
 *
 * Centralises hreflang URL generation for builder pages so the public
 * page metadata, the dynamic sitemap, and any future surface stay in
 * sync. Reuses `BuilderPageMeta.linkedPageIds` (multilingual track F4)
 * to discover translated siblings, falls back to `x-default` for
 * locales without a linked translation.
 */

import { defaultLocale, locales, siteLocales, type Locale, type SiteLocale } from '@/lib/locales';
import type { BuilderPageMeta } from '@/lib/builder/site/types';
import { buildSitePageAbsoluteUrl } from '@/lib/builder/site/paths';
import { resolveLocaleSlug } from '@/lib/builder/translations/locale-slug';
import { isEnglishNoindexPath } from '@/lib/seo-visibility';

export interface HreflangAlternate {
  /** Locale tag in the IETF form expected by Google (e.g. zh-Hant). */
  hreflang: string;
  /** Internal locale (matches SiteLocale union — public routes also serve ja). */
  locale: SiteLocale;
  /** Absolute URL. */
  href: string;
}

const LOCALE_TO_HREFLANG: Record<SiteLocale, string> = {
  ko: 'ko',
  'zh-hant': 'zh-Hant',
  en: 'en',
  ja: 'ja',
};

export function localeToHreflangTag(locale: SiteLocale): string {
  return LOCALE_TO_HREFLANG[locale] ?? locale;
}

/**
 * Slugs served by the static (legacy) fallback renderer in
 * `src/app/[locale]/(legacy)/index.tsx`. Every site-supported locale
 * resolves these slugs to a live 200 page via the `[locale]/[[...slug]]`
 * route even when no builder page exists for that locale (e.g. `/en` and
 * `/en/about` are served by the legacy renderer while only `/ko` has a
 * builder page). Such locales must still be advertised in hreflang.
 *
 * Keep in sync with the legacy route switch. Note this is intentionally
 * narrower than `REQUIRED_STANDARD_PAGE_SLUGS` (standard-pages.ts) —
 * `columns`/`videos` are dynamic routes, not legacy-fallback slugs.
 */
const STATIC_FALLBACK_PAGE_SLUGS = new Set<string>([
  '',
  'about',
  'services',
  'contact',
  'lawyers',
  'faq',
  'pricing',
  'reviews',
  'privacy',
  'disclaimer',
]);

const PUBLIC_MULTILOCALE_ROUTE_SLUGS = new Set<string>([
  ...STATIC_FALLBACK_PAGE_SLUGS,
  'columns',
  'videos',
]);

const HREFLANG_SORT_RANK: Record<string, number> = {
  ko: 0,
  'zh-Hant': 1,
  en: 2,
  ja: 3,
  'x-default': 4,
};

function pageUrl(siteUrl: string, locale: SiteLocale, slug: string): string {
  return buildSitePageAbsoluteUrl(siteUrl, locale, slug);
}

function sortAlternates(alternates: HreflangAlternate[]): HreflangAlternate[] {
  return [...alternates].sort((left, right) => (
    (HREFLANG_SORT_RANK[left.hreflang] ?? 99) - (HREFLANG_SORT_RANK[right.hreflang] ?? 99)
  ));
}

/**
 * Build the alternate-language URL set for a given builder page.
 *
 * Returns every reachable public locale (ko/zh-hant/en plus ja on shared
 * static-fallback routes) — including an `x-default` entry pointing at the
 * default locale's URL — so callers can hand the result straight to
 * `Metadata.alternates.languages` or to a sitemap entry. English-noindex
 * routes (see src/lib/seo-visibility.ts) never emit an `en` entry.
 */
export function buildHreflangAlternates(
  page: BuilderPageMeta,
  siteUrl: string,
  allPages: BuilderPageMeta[],
): HreflangAlternate[] {
  const out: HreflangAlternate[] = [];
  const seen = new Set<SiteLocale>();

  // Self
  out.push({
    hreflang: localeToHreflangTag(page.locale),
    locale: page.locale,
    href: pageUrl(siteUrl, page.locale, resolveLocaleSlug(page, page.locale) || ''),
  });
  seen.add(page.locale);

  // Linked siblings
  if (page.linkedPageIds) {
    for (const [loc, linkedId] of Object.entries(page.linkedPageIds)) {
      if (!linkedId) continue;
      const localeKey = loc as Locale;
      if (seen.has(localeKey)) continue;
      const linked = allPages.find((p) => p.pageId === linkedId);
      if (!linked) continue;
      const overrideSlug = page.slugByLocale?.[localeKey];
      const hrefSlug = typeof overrideSlug === 'string' && overrideSlug.length > 0
        ? overrideSlug
        : linked.slug || '';
      out.push({
        hreflang: localeToHreflangTag(localeKey),
        locale: localeKey,
        href: pageUrl(siteUrl, localeKey, hrefSlug),
      });
      seen.add(localeKey);
    }
  }

  // Implicit home-page linkage: each locale's home page is the translation
  // of every other locale's home page, even without explicit `linkedPageIds`.
  // Mirrors the convention in translations/page-targets.ts,
  // translations/dashboard-model.ts and translations/publish-warnings.ts so
  // that /ko (home) advertises zh-Hant + en alternates (W193). Non-home pages
  // are NOT auto-linked by slug — hreflang must only point at real translations.
  if (page.isHomePage) {
    for (const localeKey of locales) {
      if (seen.has(localeKey)) continue;
      const home = allPages.find((p) => p.locale === localeKey && p.isHomePage);
      if (!home) continue;
      const overrideSlug = page.slugByLocale?.[localeKey];
      const hrefSlug = typeof overrideSlug === 'string' && overrideSlug.length > 0
        ? overrideSlug
        : home.slug || '';
      out.push({
        hreflang: localeToHreflangTag(localeKey),
        locale: localeKey,
        href: pageUrl(siteUrl, localeKey, hrefSlug),
      });
      seen.add(localeKey);
    }
  }

  const staticSlug = page.slug ?? '';
  // English-noindex routes (e.g. /faq) must never advertise an `en`
  // alternate — the /en/<slug> page is noindex. Mirrors the rule in
  // src/lib/seo.ts getLanguageAlternates (x-default stays, it points at ko).
  const stripEnglish = isEnglishNoindexPath(`/${staticSlug}`);
  if (PUBLIC_MULTILOCALE_ROUTE_SLUGS.has(staticSlug)) {
    // Iterate the public site locales (incl. ja) — /ja/<slug> is served 200
    // by the same static/legacy fallback as the other locales, so builder
    // pages must advertise it for hreflang mutuality with the /ja sitemap.
    for (const localeKey of siteLocales) {
      if (seen.has(localeKey)) continue;
      if (stripEnglish && localeKey === 'en') continue;
      out.push({
        hreflang: localeToHreflangTag(localeKey),
        locale: localeKey,
        href: pageUrl(siteUrl, localeKey, staticSlug),
      });
      seen.add(localeKey);
    }
  }

  // The en-noindex strip also applies to any `en` entry that arrived via
  // linkedPageIds/home linkage — a noindex /en page is never a valid
  // hreflang target regardless of how it was discovered.
  if (stripEnglish) {
    for (let i = out.length - 1; i >= 0; i -= 1) {
      if (out[i].locale === 'en') out.splice(i, 1);
    }
  }

  // x-default — prefer the default-locale link when available, otherwise
  // fall back to the page itself.
  const defaultEntry = out.find((entry) => entry.locale === defaultLocale);
  out.push({
    hreflang: 'x-default',
    locale: defaultEntry?.locale ?? page.locale,
    href: defaultEntry?.href ?? pageUrl(siteUrl, page.locale, resolveLocaleSlug(page, page.locale) || ''),
  });

  return sortAlternates(out);
}

/**
 * Map a hreflang alternate set into the `Record<string, string>` shape
 * Next.js expects on `Metadata.alternates.languages`.
 */
export function alternatesToLanguagesRecord(
  alternates: HreflangAlternate[],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const a of alternates) {
    out[a.hreflang] = a.href;
  }
  return out;
}

/**
 * Given any builder page (or list of pages with linked translations),
 * verify every locale in the supported set is represented. Returns the
 * locales that are missing — useful for the SEO panel "정합성 체크" view.
 */
export function findMissingLocales(
  page: BuilderPageMeta,
  allPages: BuilderPageMeta[],
): Locale[] {
  const seen = new Set<Locale>([page.locale]);
  if (page.linkedPageIds) {
    for (const [loc, linkedId] of Object.entries(page.linkedPageIds)) {
      if (linkedId && allPages.some((p) => p.pageId === linkedId)) {
        seen.add(loc as Locale);
      }
    }
  }
  if (page.isHomePage) {
    for (const localeKey of locales) {
      if (seen.has(localeKey)) continue;
      if (allPages.some((p) => p.locale === localeKey && p.isHomePage)) {
        seen.add(localeKey);
      }
    }
  }
  if (PUBLIC_MULTILOCALE_ROUTE_SLUGS.has(page.slug ?? '')) {
    for (const localeKey of locales) {
      seen.add(localeKey);
    }
  }
  return locales.filter((l) => !seen.has(l));
}
