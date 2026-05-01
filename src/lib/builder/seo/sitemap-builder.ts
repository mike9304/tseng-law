/**
 * SEO maturity — dynamic sitemap collector for builder-published pages.
 *
 * The repo already serves `/sitemap.xml` via the Next.js MetadataRoute
 * convention (`src/app/sitemap.ts`) covering the legacy hand-written
 * pages. This module pulls in the additional URLs that come from the
 * site builder document — pages flagged `publishedAt && !noIndex` —
 * so the existing sitemap can append them without re-implementing the
 * crawl logic.
 *
 * Lightboxes are intentionally excluded (they're modal overlays
 * triggered from buttons, not navigable pages).
 */

import type { MetadataRoute } from 'next';
import {
  alternatesToLanguagesRecord,
  buildHreflangAlternates,
} from '@/lib/builder/seo/hreflang';
import { readSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';
import { defaultLocale, locales, type Locale } from '@/lib/locales';
import { buildAbsoluteUrl, getSiteUrl } from '@/lib/seo';

export interface BuilderSitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
  alternates: { languages: Record<string, string> };
}

function isPublic(page: BuilderPageMeta): boolean {
  if (!page.publishedAt) return false;
  if (page.noIndex) return false;
  if (page.seo?.noIndex) return false;
  if (page.password) return false;
  return true;
}

/**
 * Read the site doc for one locale and project its public pages into
 * sitemap entries. Each entry already carries its hreflang alternates.
 */
export async function collectBuilderSitemapEntriesForLocale(
  locale: Locale,
): Promise<BuilderSitemapEntry[]> {
  let site: BuilderSiteDocument;
  try {
    site = await readSiteDocument('default', locale);
  } catch {
    return [];
  }

  const siteUrl = getSiteUrl();
  const out: BuilderSitemapEntry[] = [];

  for (const page of site.pages) {
    if (page.locale !== locale) continue;
    if (!isPublic(page)) continue;

    const alternates = buildHreflangAlternates(page, siteUrl, site.pages);
    const slug = page.slug || '';
    const path = `/${locale}/p/${slug}`.replace(/\/+$/, '') || `/${locale}`;

    out.push({
      url: buildAbsoluteUrl(path),
      lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
      changeFrequency: page.isHomePage ? 'daily' : 'weekly',
      priority: page.isHomePage ? 1 : 0.7,
      alternates: { languages: alternatesToLanguagesRecord(alternates) },
    });
  }

  return out;
}

/**
 * Convenience wrapper — collect entries across ALL supported locales
 * and de-duplicate by URL (the home page is reachable from each locale
 * but shows up once per locale, which is what we want).
 */
export async function collectAllBuilderSitemapEntries(): Promise<BuilderSitemapEntry[]> {
  const buckets = await Promise.all(
    locales.map((l) => collectBuilderSitemapEntriesForLocale(l)),
  );
  const flat = buckets.flat();
  const seen = new Map<string, BuilderSitemapEntry>();
  for (const entry of flat) {
    if (!seen.has(entry.url)) seen.set(entry.url, entry);
  }
  return [...seen.values()];
}

/**
 * Synchronous default-locale shortcut — useful for places that just
 * want a count or a peek without awaiting all locales (e.g. SeoPanel).
 */
export async function collectDefaultLocaleSitemapEntries(): Promise<BuilderSitemapEntry[]> {
  return collectBuilderSitemapEntriesForLocale(defaultLocale);
}
