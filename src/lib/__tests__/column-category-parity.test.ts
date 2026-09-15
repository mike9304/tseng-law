import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getAllColumnPosts } from '@/lib/columns';
import { COLUMN_CONTENT_DIR_BY_LOCALE } from '@/lib/column-locales';
import { GUIDANCE_LOCALES_4 } from '@/lib/public-guidance';

/**
 * Every translated column carries the same category as its English source —
 * the translation lane wrote the frontmatter phrase in the page language
 * (vi "Thành lập công ty tại Đài Loan", id "Pendirian Perusahaan di Taiwan",
 * th "การจัดตั้งบริษัทในไต้หวัน", fil "Pagtatatag ng Kompanya sa Taiwan").
 * `categoryFromString` only knew ko/zh/ja literals and English regexes, so all
 * 17 columns in each guidance language collapsed to `legal` and the live
 * vi/id/th/fil homes showed company-setup articles as "Legal Information".
 * This pins slug-by-slug parity with English for every guidance language that
 * has column files (ar is phase 2: no directory, nothing to compare yet).
 */
describe('column category parity with English', () => {
  const english = new Map(getAllColumnPosts('en').map((post) => [post.slug, post.category]));

  it('has the English baseline this test compares against', () => {
    expect(english.size).toBe(17);
    const counts = { formation: 0, legal: 0, case: 0 };
    for (const category of english.values()) counts[category] += 1;
    expect(counts).toEqual({ formation: 8, legal: 8, case: 1 });
  });

  for (const locale of GUIDANCE_LOCALES_4) {
    const dir = path.join(process.cwd(), COLUMN_CONTENT_DIR_BY_LOCALE[locale]);
    const hasFiles = existsSync(dir);
    (hasFiles ? it : it.skip)(`${locale}: every column keeps its English category`, () => {
      const posts = getAllColumnPosts(locale);
      expect(posts.length).toBe(17);
      const mismatches = posts
        .filter((post) => english.get(post.slug) !== post.category)
        .map((post) => `${post.slug}: ${post.category} (en: ${english.get(post.slug)})`);
      expect(mismatches).toEqual([]);
      // Not everything may collapse to one bucket again.
      expect(new Set(posts.map((post) => post.category)).size).toBe(3);
    });
  }
});
