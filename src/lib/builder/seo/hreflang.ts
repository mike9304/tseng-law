/**
 * SEO maturity — hreflang generator.
 *
 * Centralises hreflang URL generation for builder pages so the public
 * page metadata, the dynamic sitemap, and any future surface stay in
 * sync. Reuses `BuilderPageMeta.linkedPageIds` (multilingual track F4)
 * to discover translated siblings, falls back to `x-default` for
 * locales without a linked translation.
 */

import { defaultLocale, locales, type Locale } from '@/lib/locales';
import type { BuilderPageMeta } from '@/lib/builder/site/types';
import { buildSitePageAbsoluteUrl } from '@/lib/builder/site/paths';

export interface HreflangAlternate {
  /** Locale tag in the IETF form expected by Google (e.g. zh-Hant). */
  hreflang: string;
  /** Internal locale (matches Locale union). */
  locale: Locale;
  /** Absolute URL. */
  href: string;
}

const LOCALE_TO_HREFLANG: Record<Locale, string> = {
  ko: 'ko',
  'zh-hant': 'zh-Hant',
  en: 'en',
};

export function localeToHreflangTag(locale: Locale): string {
  return LOCALE_TO_HREFLANG[locale] ?? locale;
}

function pageUrl(siteUrl: string, locale: Locale, slug: string): string {
  return buildSitePageAbsoluteUrl(siteUrl, locale, slug);
}

/**
 * Build the alternate-language URL set for a given builder page.
 *
 * Returns ALL locales — including an `x-default` entry pointing at the
 * default locale's URL — so callers can hand the result straight to
 * `Metadata.alternates.languages` or to a sitemap entry.
 */
export function buildHreflangAlternates(
  page: BuilderPageMeta,
  siteUrl: string,
  allPages: BuilderPageMeta[],
): HreflangAlternate[] {
  const out: HreflangAlternate[] = [];
  const seen = new Set<Locale>();

  // Self
  out.push({
    hreflang: localeToHreflangTag(page.locale),
    locale: page.locale,
    href: pageUrl(siteUrl, page.locale, page.slug || ''),
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
      out.push({
        hreflang: localeToHreflangTag(localeKey),
        locale: localeKey,
        href: pageUrl(siteUrl, localeKey, linked.slug || ''),
      });
      seen.add(localeKey);
    }
  }

  // x-default — prefer the default-locale link when available, otherwise
  // fall back to the page itself.
  const defaultEntry = out.find((entry) => entry.locale === defaultLocale);
  out.push({
    hreflang: 'x-default',
    locale: defaultEntry?.locale ?? page.locale,
    href: defaultEntry?.href ?? pageUrl(siteUrl, page.locale, page.slug || ''),
  });

  return out;
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
  return locales.filter((l) => !seen.has(l));
}
