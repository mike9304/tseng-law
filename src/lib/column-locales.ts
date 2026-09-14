import {
  GUIDANCE_LOCALES_4,
  PUBLIC_LOCALES_8,
  isGuidanceLocale4,
  type PublicLocale8,
} from '@/lib/public-guidance';

/** Repo-relative markdown directories. New four are optional (empty until the translation pipeline writes files). */
export const COLUMN_CONTENT_DIR_BY_LOCALE: Record<PublicLocale8, string> = {
  ko: 'src/content/columns',
  'zh-hant': 'src/content/columns-zh',
  en: 'src/content/columns-en',
  ja: 'src/content/columns-ja',
  vi: 'src/content/columns-vi',
  id: 'src/content/columns-id',
  th: 'src/content/columns-th',
  fil: 'src/content/columns-fil',
};

export const OPTIONAL_COLUMN_LOCALES = GUIDANCE_LOCALES_4;

export type ColumnSitemapPost = {
  slug: string;
  date?: string;
};

export type ColumnSitemapRecord = {
  locale: PublicLocale8;
  path: string;
  lastModified?: string;
  alternateLocales: PublicLocale8[];
};

export function isOptionalColumnLocale(locale: string): locale is (typeof GUIDANCE_LOCALES_4)[number] {
  return isGuidanceLocale4(locale);
}

/**
 * Locales that currently have a file for `slug`. Callers inject existence so
 * tests can use a temp directory without writing into `src/content/`.
 */
export function getColumnAlternateLocales(
  slug: string,
  options: {
    hasTranslation: (locale: PublicLocale8, slug: string) => boolean;
  },
): PublicLocale8[] {
  return PUBLIC_LOCALES_8.filter((locale) => options.hasTranslation(locale, slug));
}

/**
 * Sitemap rows for file-backed columns. A locale is included only when
 * `postsForLocale` returns that slug — missing translation files stay out.
 */
export function collectColumnSitemapRecords(options: {
  postsForLocale: (locale: PublicLocale8) => readonly ColumnSitemapPost[];
}): ColumnSitemapRecord[] {
  const postsByLocale = Object.fromEntries(
    PUBLIC_LOCALES_8.map((locale) => [locale, options.postsForLocale(locale)]),
  ) as Record<PublicLocale8, readonly ColumnSitemapPost[]>;

  const slugsByLocale = Object.fromEntries(
    PUBLIC_LOCALES_8.map((locale) => [
      locale,
      new Set(postsByLocale[locale].map((post) => post.slug)),
    ]),
  ) as Record<PublicLocale8, Set<string>>;

  const records: ColumnSitemapRecord[] = [];
  for (const locale of PUBLIC_LOCALES_8) {
    for (const post of postsByLocale[locale]) {
      records.push({
        locale,
        path: `/columns/${post.slug}`,
        lastModified: post.date,
        alternateLocales: PUBLIC_LOCALES_8.filter((other) => slugsByLocale[other].has(post.slug)),
      });
    }
  }
  return records;
}
