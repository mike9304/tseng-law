import type { MetadataRoute } from 'next';
import { primaryAttorneySlug } from '@/data/attorney-profiles';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { readAttorneyProfileSourceRecords } from '@/lib/builder/lawyers/source';
import { readServiceAreaSourceRecords } from '@/lib/builder/services/source';
import { getAllColumnPosts, getAliasSlugs, resolveSlug } from '@/lib/columns';
import { collectColumnSitemapRecords } from '@/lib/column-locales';
import { locales } from '@/lib/locales';
import {
  GUIDANCE_LOCALES_4,
  GUIDANCE_PAGE_KEYS,
  buildGuidanceCoreLanguageAlternates,
  guidanceCanonicalUrl,
  guidancePageKeyFromSlugPath,
  isGuidanceCoreSlugPath,
  isPublicLocale8,
  type PublicLocale8,
} from '@/lib/public-guidance';
import { buildAbsoluteUrl, getLanguageAlternates, getLocalizedPath, getSiteUrl } from '@/lib/seo';
import { isEnglishNoindexPath } from '@/lib/seo-visibility';
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
  '/ai-intake',
  '/privacy',
  '/disclaimer',
  '/accessibility',
] as const;

type LocalizedSitemapRoute = {
  locale: PublicLocale8;
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
  if (!isPublicLocale8(locale)) {
    return null;
  }

  return {
    locale,
    path: segments.length === 0 ? '' : `/${segments.join('/')}`,
  };
}

function sitemapSlugPath(path: string): string {
  if (!path || path === '/') return '';
  return path.replace(/^\//, '');
}

function isGuidanceLocaleHreflang(tag: string): boolean {
  const lower = tag.toLowerCase();
  return lower === 'vi' || lower === 'id' || lower === 'th' || lower === 'fil';
}

function appendGuidanceLocaleSitemapEntries(pages: MetadataRoute.Sitemap): void {
  const siteUrl = getSiteUrl();
  for (const locale of GUIDANCE_LOCALES_4) {
    for (const pageKey of GUIDANCE_PAGE_KEYS) {
      pages.push({
        url: guidanceCanonicalUrl(locale, pageKey, siteUrl),
        priority: pageKey === 'home' ? 1 : 0.8,
        alternates: {
          languages: buildGuidanceCoreLanguageAlternates(pageKey, siteUrl),
        },
      });
    }
  }
}

/**
 * Core pages advertise the actual eight-language cluster only when that URL
 * exists and is still indexable. Non-core entries keep the existing four-language
 * set (and prior JA/indexability filters) and only drop untrue vi/id/th/fil.
 */
function reconcileGuidanceLanguageAlternates(
  entries: MetadataRoute.Sitemap,
): MetadataRoute.Sitemap {
  const publishedUrls = new Set(entries.map((entry) => entry.url));
  const siteUrl = getSiteUrl();

  return entries.map((entry) => {
    const route = getLocalizedSitemapRoute(entry.url);
    const slugPath = route ? sitemapSlugPath(route.path) : null;
    const isCore = slugPath !== null && isGuidanceCoreSlugPath(slugPath);
    const existingLanguages = entry.alternates?.languages ?? {};
    const nextLanguages: Record<string, string> = {};

    for (const [tag, url] of Object.entries(existingLanguages)) {
      if (typeof url !== 'string') continue;
      if (isGuidanceLocaleHreflang(tag) && !publishedUrls.has(url)) continue;
      if (isCore && !publishedUrls.has(url)) continue;
      nextLanguages[tag] = url;
    }

    if (isCore && slugPath !== null) {
      const pageKey = guidancePageKeyFromSlugPath(slugPath);
      if (pageKey) {
        for (const [tag, url] of Object.entries(buildGuidanceCoreLanguageAlternates(pageKey, siteUrl))) {
          if (typeof url === 'string' && publishedUrls.has(url)) {
            nextLanguages[tag] = url;
          }
        }
      }
    }

    if (!entry.alternates && Object.keys(nextLanguages).length === 0) {
      return entry;
    }

    return {
      ...entry,
      alternates: {
        ...entry.alternates,
        languages: nextLanguages,
      },
    };
  });
}

/**
 * File-backed English column check. Kept here (not in seo-visibility.ts)
 * because it reads the filesystem via src/lib/columns.ts, and
 * seo-visibility.ts must stay importable from the client bundle through
 * src/lib/seo.ts. Injected into isEnglishNoindexPath below.
 */
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

/**
 * Drop locale-specific noindex routes (/reviews everywhere, English-only
 * noindex paths for en) and strip the `en` alternate from their siblings.
 * Shared path classification lives in src/lib/seo-visibility.ts.
 */
function applyLocaleIndexabilityRules(
  entries: MetadataRoute.Sitemap,
): MetadataRoute.Sitemap {
  return entries.flatMap((entry) => {
    const route = getLocalizedSitemapRoute(entry.url);
    if (route?.path === '/reviews') {
      return [];
    }

    if (!route || !isEnglishNoindexPath(route.path, isFileBackedEnglishColumnPath)) {
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

/**
 * Hreflang must be reciprocal. Builder entries can know about the Japanese
 * fallback page while an older static sibling was created without a `ja`
 * alternate. Advertise Japanese only when that exact URL is present in the
 * final sitemap, so unsupported/custom Japanese routes are never invented.
 */
function addReciprocalJapaneseAlternates(
  entries: MetadataRoute.Sitemap,
): MetadataRoute.Sitemap {
  const publishedUrls = new Set(entries.map((entry) => entry.url));

  return entries.map((entry) => {
    const route = getLocalizedSitemapRoute(entry.url);
    if (!route || route.locale === 'ja') return entry;

    const japaneseUrl = buildAbsoluteUrl(getLocalizedPath('ja', route.path));
    if (!publishedUrls.has(japaneseUrl)) return entry;
    if (entry.alternates?.languages?.ja === japaneseUrl) return entry;

    return {
      ...entry,
      alternates: {
        ...entry.alternates,
        languages: {
          ...entry.alternates?.languages,
          ja: japaneseUrl,
        },
      },
    };
  });
}

function createEntry(
  locale: PublicLocale8,
  path: string,
  options?: {
    lastModified?: string | Date;
    priority?: number;
    alternateLocales?: readonly PublicLocale8[];
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
  }

  const columnRecords = collectColumnSitemapRecords({
    postsForLocale: (locale) =>
      getAllColumnPosts(locale).map((post) => ({ slug: post.slug, date: post.date })),
  });
  for (const record of columnRecords) {
    pages.push(
      createEntry(record.locale, record.path, {
        lastModified: record.lastModified || undefined,
        priority: 0.68,
        alternateLocales: record.alternateLocales,
      }),
    );
  }

  // Japanese public static and file-backed surfaces.
  pages.push(
    createEntry('ja', '', {
      priority: 1,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  // /faq is English-noindex: getLanguageAlternates strips the `en`
  // alternate from the final output automatically.
  pages.push(
    createEntry('ja', '/faq', {
      priority: 0.8,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  pages.push(
    createEntry('ja', '/videos', {
      priority: 0.8,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  pages.push(
    createEntry('ja', '/privacy', {
      priority: 0.8,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  pages.push(
    createEntry('ja', '/disclaimer', {
      priority: 0.8,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  pages.push(
    createEntry('ja', '/accessibility', {
      priority: 0.8,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  pages.push(
    createEntry('ja', '/taiwan-lawyer', {
      priority: 0.8,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  pages.push(
    createEntry('ja', '/taiwan-company-setup-lawyer', {
      priority: 0.8,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  pages.push(
    createEntry('ja', '/taiwan-litigation-lawyer', {
      priority: 0.8,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  pages.push(
    createEntry('ja', '/korean-lawyer-in-taiwan', {
      priority: 0.8,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  pages.push(
    createEntry('ja', '/ai-intake', {
      priority: 0.8,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  pages.push(
    createEntry('ja', '/guides/taiwan-company-setup', {
      priority: 0.8,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
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
    createEntry('ja', '/services/family', {
      priority: 0.72,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  pages.push(
    createEntry('ja', '/services/labor', {
      priority: 0.72,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  pages.push(
    createEntry('ja', '/services/criminal', {
      priority: 0.72,
      alternateLocales: ['ko', 'zh-hant', 'en', 'ja'],
    }),
  );
  pages.push(
    createEntry('ja', '/services/ip', {
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

  // Actual new-four core URLs only. Dictionary page identities — never the
  // internal rewrite keys, and never invented article translations.
  appendGuidanceLocaleSitemapEntries(pages);

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

  return reconcileGuidanceLanguageAlternates(
    applyLocaleIndexabilityRules(
      addReciprocalJapaneseAlternates([...byUrl.values()]),
    ),
  );
}
