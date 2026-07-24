import type { MetadataRoute } from 'next';
import { primaryAttorneySlug } from '@/data/attorney-profiles';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readAttorneyProfileSourceRecords } from '@/lib/builder/lawyers/source';
import { readServiceAreaSourceRecords } from '@/lib/builder/services/source';
import { getAllColumnPosts, getAliasSlugs, resolveSlug } from '@/lib/columns';
import { locales, siteLocales } from '@/lib/locales';
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

type LocalizedSitemapRoute = {
  locale: (typeof siteLocales)[number];
  path: string;
};

function getLocalizedSitemapRoute(url: string): LocalizedSitemapRoute | null {
  let pathname: string;
  try {
    pathname = new URL(url).pathname;
  } catch {
    return null;
  }

  const [locale, ...segments] = pathname.split('/').filter(Boolean);
  if (locale !== 'ko' && locale !== 'zh-hant' && locale !== 'en' && locale !== 'ja') {
    return null;
  }

  return {
    locale,
    path: segments.length === 0 ? '' : `/${segments.join('/')}`,
  };
}

/** Routes whose page metadata is noindex only for the English locale. */
function isFileBackedEnglishColumnPath(path: string): boolean {
  const match = path.match(/^\/columns\/([^/]+)$/);
  if (!match) return false;
  const rawSlug = match[1];
  const known = new Set(getAllColumnPosts('ko').map((post) => post.slug));
  // Accept both real slugs and short aliases that resolve to file-backed posts.
  if (known.has(rawSlug) || known.has(resolveSlug(rawSlug))) return true;
  if (getAliasSlugs().includes(rawSlug) && known.has(resolveSlug(rawSlug))) return true;
  return false;
}

function isEnglishNoindexPath(path: string): boolean {
  // Full EN file-backed columns (columns-en) are indexable.
  // Builder/Blob EN column drafts without a file translation stay excluded.
  if (/^\/columns\/[^/]+$/.test(path) && !isFileBackedEnglishColumnPath(path)) {
    return true;
  }
  return path === '/faq'
    || path === '/portfolio'
    || /^\/portfolio\/[^/]+$/.test(path)
    || path === '/events'
    || /^\/events\/[^/]+$/.test(path)
    || path === '/store'
    || /^\/store\/(?:categories|products)\/[^/]+$/.test(path);
}

function applyLocaleIndexabilityRules(
  entries: MetadataRoute.Sitemap,
): MetadataRoute.Sitemap {
  return entries.flatMap((entry) => {
    const route = getLocalizedSitemapRoute(entry.url);
    if (route?.path === '/reviews') {
      return [];
    }

    if (!route || !isEnglishNoindexPath(route.path)) {
      return [entry];
    }

    if (route.locale === 'en') {
      return [];
    }

    if (!entry.alternates?.languages) {
      return [entry];
    }

    return [{
      ...entry,
      alternates: {
        ...entry.alternates,
        languages: Object.fromEntries(
          Object.entries(entry.alternates.languages)
            .filter(([language]) => language.toLowerCase() !== 'en'),
        ),
      },
    }];
  });
}

function createEntry(
  locale: (typeof siteLocales)[number],
  path: string,
  options?: {
    lastModified?: string | Date;
    priority?: number;
    alternateLocales?: readonly (typeof siteLocales)[number][];
  }
): MetadataRoute.Sitemap[number] {
  return {
    url: buildAbsoluteUrl(getLocalizedPath(locale, path)),
    ...(options?.lastModified == null ? {} : { lastModified: options.lastModified }),
    priority: options?.priority ?? 0.8,
    alternates: {
      languages: getLanguageAlternates(path, options?.alternateLocales ?? locales),
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

    for (const post of columns) {
      pages.push(
        createEntry(locale, `/columns/${post.slug}`, {
          lastModified: post.date || undefined,
          priority: 0.68,
          alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
        })
      );
    }
  }

  // Japanese public static and file-backed surfaces.
  pages.push(
    createEntry('ja', '/about', {
      priority: 0.8,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  pages.push(
    createEntry('ja', '/services', {
      priority: 0.8,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  pages.push(
    createEntry('ja', '/services/investment', {
      priority: 0.72,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  pages.push(
    createEntry('ja', '/services/civil', {
      priority: 0.72,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  pages.push(
    createEntry('ja', '/pricing', {
      priority: 0.8,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  pages.push(
    createEntry('ja', '/contact', {
      priority: 0.8,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  pages.push(
    createEntry('ja', '/lawyers', {
      priority: 0.8,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  pages.push(
    createEntry('ja', `/lawyers/${primaryAttorneySlug}`, {
      priority: 0.86,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  pages.push(
    createEntry('ja', '/columns', {
      priority: 0.8,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  for (const post of columns) {
    pages.push(
      createEntry('ja', `/columns/${post.slug}`, {
        lastModified: post.date || undefined,
        priority: 0.68,
        alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
      }),
    );
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

  return applyLocaleIndexabilityRules([...byUrl.values()]);
}
