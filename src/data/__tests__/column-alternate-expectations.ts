/**
 * Shared hreflang expectation derivation for the column reference-sync suites.
 *
 * The public four (ko/zh-hant/en/ja) are always file-backed, so they stay exact.
 * The guidance languages (vi/id/th/fil/ar) are optional and file-present only: a newly
 * landed `src/content/columns-<locale>/NNN-<slug>.md` legitimately adds an
 * alternate. Freezing "four-language alternates" in each test therefore breaks
 * as translations land, so the expected set is read off disk instead.
 */
import fs from 'node:fs';
import path from 'node:path';

import { COLUMN_CONTENT_DIR_BY_LOCALE, OPTIONAL_COLUMN_LOCALES } from '@/lib/column-locales';
import type { GuidanceLocale4, PublicLocale8 } from '@/lib/public-guidance';

/** Always-published public four. */
export const BASE_COLUMN_LOCALES = ['ko', 'zh-hant', 'en', 'ja'] as const;

/**
 * Literal hreflang tags. Deliberately spelled out here rather than imported
 * from `@/lib/seo`, so the expectation cannot drift together with the code
 * under test.
 */
const HREFLANG_TAG_BY_LOCALE: Record<PublicLocale8, string> = {
  ko: 'ko',
  'zh-hant': 'zh-Hant',
  en: 'en',
  ja: 'ja',
  vi: 'vi',
  id: 'id',
  th: 'th',
  fil: 'fil',
  ar: 'ar',
  de: 'de',
  es: 'es',
  fr: 'fr',
  pt: 'pt',
  'zh-hans': 'zh-Hans',
  ms: 'ms',
  ru: 'ru',
  tr: 'tr',
  it: 'it',
  nl: 'nl',
  pl: 'pl',
  hi: 'hi',
  sv: 'sv',
  da: 'da',
  nb: 'nb',
  fi: 'fi',
  cs: 'cs',
  hu: 'hu',
  ro: 'ro',
  uk: 'uk',
  el: 'el',
  he: 'he',
  bn: 'hi', // SCAFFOLD(hi)
  ur: 'ur',
  fa: 'fa',
  my: 'th', // SCAFFOLD(th)
  ta: 'hi', // SCAFFOLD(hi)
  ne: 'hi', // SCAFFOLD(hi)
  km: 'th', // SCAFFOLD(th)
  mn: 'ru', // SCAFFOLD(ru)
  sk: 'cs', // SCAFFOLD(cs)
  bg: 'bg',
  hr: 'hr',
  sr: 'cs', // SCAFFOLD(cs)
  sl: 'sl',
  lt: 'lt',
  lv: 'cs', // SCAFFOLD(cs)
  et: 'cs', // SCAFFOLD(cs)
  ca: 'cs', // SCAFFOLD(cs)
  is: 'cs', // SCAFFOLD(cs)
};

/** Mirrors `slugFromFilename` in src/lib/columns.ts (`NNN-<slug>.md`). */
function slugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '').replace(/^\d{3}-/, '');
}

function hasColumnFile(locale: PublicLocale8, slug: string): boolean {
  const dir = path.join(process.cwd(), COLUMN_CONTENT_DIR_BY_LOCALE[locale]);
  if (!fs.existsSync(dir)) return false;
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .some((file) => slugFromFilename(file) === slug);
}

/** vi/id/th/fil that currently have a markdown file for `slug`. */
export function presentOptionalColumnLocales(slug: string): GuidanceLocale4[] {
  return OPTIONAL_COLUMN_LOCALES.filter((locale) => hasColumnFile(locale, slug));
}

/** vi/id/th/fil that have no markdown file for `slug` and must emit no alternate. */
export function absentOptionalColumnLocales(slug: string): GuidanceLocale4[] {
  return OPTIONAL_COLUMN_LOCALES.filter((locale) => !hasColumnFile(locale, slug));
}

export function columnUrl(siteUrl: string, locale: PublicLocale8, slug: string): string {
  return `${siteUrl}/${locale}/columns/${slug}`;
}

/**
 * Base four + every file-present new-locale alternate, plus the `x-default`
 * English fallback. Absent new-locale files contribute no key at all.
 */
export function buildExpectedColumnAlternates(
  siteUrl: string,
  slug: string,
): Record<string, string> {
  const languages: Record<string, string> = {};
  const locales: PublicLocale8[] = [
    ...BASE_COLUMN_LOCALES,
    ...presentOptionalColumnLocales(slug),
  ];

  for (const locale of locales) {
    languages[HREFLANG_TAG_BY_LOCALE[locale]] = columnUrl(siteUrl, locale, slug);
  }
  languages['x-default'] = columnUrl(siteUrl, 'en', slug);

  return languages;
}
