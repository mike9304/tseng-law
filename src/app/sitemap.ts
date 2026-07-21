import type { MetadataRoute } from 'next';
import { primaryAttorneySlug } from '@/data/attorney-profiles';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readAttorneyProfileSourceRecords } from '@/lib/builder/lawyers/source';
import { readServiceAreaSourceRecords } from '@/lib/builder/services/source';
import { getAllColumnPosts } from '@/lib/columns';
import { locales } from '@/lib/locales';
import { buildAbsoluteUrl, getLanguageAlternates, getLocalizedPath } from '@/lib/seo';
import { collectAllBuilderSitemapEntries } from '@/lib/builder/seo/sitemap-builder';

export const dynamic = 'force-dynamic';

const STATIC_PATHS = [
  '',
  '/about',
  '/services',
  '/pricing',
  '/lawyers',
  '/columns',
  '/videos',
  '/faq',
  '/contact',
  '/taiwan-lawyer',
  '/taiwan-company-setup-lawyer',
  '/taiwan-litigation-lawyer',
  '/guides/taiwan-company-setup',
  '/korean-lawyer-in-taiwan',
  '/privacy',
  '/disclaimer',
  '/accessibility',
] as const;

function createEntry(
  locale: (typeof locales)[number],
  path: string,
  options?: {
    lastModified?: string | Date;
    priority?: number;
    alternateLocales?: (typeof locales)[number][];
  }
): MetadataRoute.Sitemap[number] {
  return {
    url: buildAbsoluteUrl(getLocalizedPath(locale, path)),
    ...(options?.lastModified == null ? {} : { lastModified: options.lastModified }),
    priority: options?.priority ?? 0.8,
    alternates: {
      languages: getLanguageAlternates(path, options?.alternateLocales),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages: MetadataRoute.Sitemap = [];
  const columns = getAllColumnPosts('ko');
  const serviceAreaRecords = await readServiceAreaSourceRecords(DEFAULT_BUILDER_SITE_ID, 'ko');
  const attorneyRecords = await readAttorneyProfileSourceRecords(DEFAULT_BUILDER_SITE_ID, 'ko');

  for (const locale of locales) {
    for (const path of STATIC_PATHS) {
      pages.push(
        createEntry(locale, path, {
          priority: path === '' ? 1 : 0.8,
        })
      );
    }

    for (const attorney of attorneyRecords) {
      pages.push(
        createEntry(locale, `/lawyers/${attorney.slug || primaryAttorneySlug}`, {
          priority: 0.86,
        })
      );
    }

    for (const area of serviceAreaRecords) {
      pages.push(
        createEntry(locale, `/services/${area.slug}`, {
          priority: 0.72,
        })
      );
    }

    if (locale === 'en') {
      continue;
    }

    for (const post of columns) {
      pages.push(
        createEntry(locale, `/columns/${post.slug}`, {
          lastModified: post.date || undefined,
          priority: 0.68,
          alternateLocales: ['ko', 'zh-hant'],
        })
      );
    }
  }

  // SEO maturity — append builder-published pages. Failures here must
  // never block the rest of the sitemap from rendering, so swallow + log
  // any unexpected error.
  try {
    const builderEntries = await collectAllBuilderSitemapEntries();
    for (const entry of builderEntries) {
      pages.push({
        url: entry.url,
        lastModified: entry.lastModified,
        priority: entry.priority,
        alternates: entry.alternates,
      });
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[sitemap] builder pages collection failed:', error);
  }

  // Deduplicate by URL: the STATIC_PATHS loop and the builder-published
  // collection both emit home/about/services/… for ko & zh-hant (22 dupes),
  // producing conflicting lastmod/priority for the same <loc>. Keep one entry
  // per URL — prefer the freshest lastModified, then the higher priority.
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();
  const ts = (v: string | Date | undefined): number =>
    v == null ? 0 : (v instanceof Date ? v.getTime() : new Date(v).getTime());
  for (const entry of pages) {
    const existing = byUrl.get(entry.url);
    if (!existing) {
      byUrl.set(entry.url, entry);
      continue;
    }
    const takeNew = ts(entry.lastModified) > ts(existing.lastModified)
      || (ts(entry.lastModified) === ts(existing.lastModified)
        && (entry.priority ?? 0) > (existing.priority ?? 0));
    if (takeNew) byUrl.set(entry.url, entry);
  }

  return [...byUrl.values()];
}
