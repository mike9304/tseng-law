import { describe, expect, it } from 'vitest';
import {
  MARKET_BOARD_LOCALES,
  MARKET_BOARD_REVIEWED_SHARED_SLUGS,
  MARKET_BOARD_SHARED_COLUMN_SLUGS,
  filterMarketBoardColumns,
  isMarketBoardColumn,
} from '@/data/market-column-curation';
import { columnAudienceRank } from '@/lib/column-audience';
import { getAllColumnPosts } from '@/lib/columns';

// Off every market board (2026-10-24): Korean tax-treaty/banking premises, Korea-read massage law, Korean gym case.
const OFF_EVERY_BOARD = [
  'taiwan-company-establishment-basics',
  'taiwan-company-subsidiary-vs-branch',
  'taiwan-company-establishment-advanced-2',
  'taiwan-massage-history-law',
  'taiwan-gym-injury-lawsuit',
];

describe('market column boards (2026-10-24)', () => {
  it.each(MARKET_BOARD_LOCALES)('%s: every file without its own or a global audience was reviewed for the board', (locale) => {
    const untagged = getAllColumnPosts(locale)
      .filter((post) => columnAudienceRank(locale, post.audience) === 2)
      .map((post) => post.slug);
    // A new column without `audience` must be tagged or added to the reviewed shared list before it can appear.
    expect(untagged.filter((slug) => !MARKET_BOARD_REVIEWED_SHARED_SLUGS.includes(slug))).toEqual([]);
  });

  it.each(MARKET_BOARD_LOCALES)('%s: picked shared columns exist in the locale and were reviewed', (locale) => {
    const slugs = new Set(getAllColumnPosts(locale).map((post) => post.slug));
    for (const slug of MARKET_BOARD_SHARED_COLUMN_SLUGS[locale]) {
      expect(slugs.has(slug), slug).toBe(true);
      expect(MARKET_BOARD_REVIEWED_SHARED_SLUGS).toContain(slug);
    }
  });

  it.each(MARKET_BOARD_LOCALES)('%s: lists every column written for it and none of the excluded shared columns', (locale) => {
    const all = getAllColumnPosts(locale);
    const listed = filterMarketBoardColumns(locale, all).map((post) => post.slug);
    const own = all.filter((post) => columnAudienceRank(locale, post.audience) === 0).map((post) => post.slug);
    // Nine markets carry five or more own columns; the world-columns locales three or more.
    expect(own.length).toBeGreaterThanOrEqual(3);
    expect(listed).toEqual(expect.arrayContaining(own));
    for (const slug of OFF_EVERY_BOARD) expect(listed).not.toContain(slug);
    expect(listed).toHaveLength(own.length + MARKET_BOARD_SHARED_COLUMN_SLUGS[locale].length);
  });

  it.each(MARKET_BOARD_LOCALES)('%s: shared columns its own columns link to are listed, unless off every board', (locale) => {
    const all = getAllColumnPosts(locale);
    const listed = new Set(filterMarketBoardColumns(locale, all).map((post) => post.slug));
    const linked = all
      .filter((post) => columnAudienceRank(locale, post.audience) === 0)
      .flatMap((post) => [...post.content.matchAll(new RegExp(`\\]\\(/${locale}/columns/([a-z0-9-]+)\\)`, 'g'))].map((m) => m[1]))
      .filter((slug) => MARKET_BOARD_REVIEWED_SHARED_SLUGS.includes(slug) && !OFF_EVERY_BOARD.includes(slug));
    expect([...new Set(linked)].filter((slug) => !listed.has(slug))).toEqual([]);
  });

  it('keeps global columns and leaves other locales unchanged', () => {
    expect(isMarketBoardColumn('de', { slug: 'any-new-column', audience: ['global'] })).toBe(true);
    expect(isMarketBoardColumn('de', { slug: 'any-new-column', audience: ['th'] })).toBe(false);
    expect(isMarketBoardColumn('de', { slug: 'taiwan-gym-injury-lawsuit' })).toBe(false);
    for (const locale of ['vi', 'en', 'ko', 'ja', 'zh-hant'] as const) {
      const all = getAllColumnPosts(locale);
      expect(filterMarketBoardColumns(locale, all)).toEqual(all);
    }
  });
});
