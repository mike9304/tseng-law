import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getAllColumnPosts } from '@/lib/columns';
import { COLUMN_CONTENT_DIR_BY_LOCALE } from '@/lib/column-locales';
import { GUIDANCE_LOCALES_4 } from '@/lib/public-guidance';
import { NATIVE_LOCALE_COLUMN_FILES, isNativeLocaleColumnSlug, isNativeOrExpertiseNativeSlug } from './native-locale-columns';

/**
 * Every translated column carries the same category as its English source —
 * the translation lane wrote the frontmatter phrase in the page language
 * (vi "Thành lập công ty tại Đài Loan", id "Pendirian Perusahaan di Taiwan",
 * th "การจัดตั้งบริษัทในไต้หวัน", fil "Pagtatatag ng Kompanya sa Taiwan").
 * `categoryFromString` only knew ko/zh/ja literals and English regexes, so all
 * 17 columns in each guidance language collapsed to `legal` and the live
 * vi/id/th/fil homes showed company-setup articles as "Legal Information".
 * This pins slug-by-slug parity with English for every guidance language that
 * has column files. de/es use Gesellschaftsgründung / Fallanalyse and
 * Constitución de sociedades / Análisis de casos.
 */
describe('column category parity with English', () => {
  // English-only native columns have no counterpart elsewhere; the baseline is
  // the translated corpus every other locale mirrors.
  const english = new Map(
    getAllColumnPosts('en')
      .filter((post) => !isNativeOrExpertiseNativeSlug('en', post.slug))
      .map((post) => [post.slug, post.category]),
  );

  it('has the English baseline this test compares against', () => {
    // Prior 40 + seven 2026-10-02 (063–069) + traffic 051 + road-rage 099, 109.
    expect(english.size).toBe(49);
    const counts = { formation: 0, legal: 0, case: 0 };
    for (const category of english.values()) counts[category] += 1;
    expect(counts).toEqual({ formation: 9, legal: 39, case: 1 });
  });

  it.each(Object.keys(NATIVE_LOCALE_COLUMN_FILES) as (keyof typeof NATIVE_LOCALE_COLUMN_FILES)[])(
    '%s: native columns parse as Taiwan legal information',
    (locale) => {
      const natives = getAllColumnPosts(locale).filter((post) => isNativeLocaleColumnSlug(post.slug));
      expect(natives).toHaveLength(NATIVE_LOCALE_COLUMN_FILES[locale].length);
      expect(natives.every((post) => post.category === 'legal')).toBe(true);
    },
  );

  for (const locale of GUIDANCE_LOCALES_4) {
    const dir = path.join(process.cwd(), COLUMN_CONTENT_DIR_BY_LOCALE[locale]);
    const hasFiles =
      existsSync(dir) && readdirSync(dir).some((file) => file.endsWith('.md'));
    (hasFiles ? it : it.skip)(`${locale}: every column keeps its English category`, () => {
      const posts = getAllColumnPosts(locale);
      // A locale may ship in batches (ar phase 2 starts with 5 files); every
      // markdown file on disk must still parse into a post.
      const fileCount = readdirSync(dir).filter((file) => file.endsWith('.md')).length;
      expect(posts.length).toBe(fileCount);
      expect(posts.length).toBeGreaterThan(0);
      const translated = posts.filter((post) => !isNativeOrExpertiseNativeSlug(locale, post.slug));
      const mismatches = translated
        .filter((post) => english.get(post.slug) !== post.category)
        .map((post) => `${post.slug}: ${post.category} (en: ${english.get(post.slug)})`);
      expect(mismatches).toEqual([]);
      // Not everything may collapse to one bucket again: a full set must show
      // all three buckets, a partial batch every bucket its English sources use.
      const expected = new Set(translated.map((post) => english.get(post.slug)));
      expect(new Set(translated.map((post) => post.category))).toEqual(expected);
      if (translated.length >= 18) expect(expected.size).toBe(3);
    });
  }
});
