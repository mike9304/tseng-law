import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';
import pending from '@/content/column-embeddings-pending.json';
import { getColumnGeneratedVideo } from '@/data/column-generated-videos';

const cases = [
  ['taiwan-motorcycle-passenger-compulsory-insurance-unlicensed-recourse', '後座乘客', 102, 'compensation', 'passenger-insurance-film-v1-zh-hant'],
  ['taiwan-uninsured-settlement-excludes-compulsory-insurance-fund-deduction', '補償基金', 103, 'compensation', 'uninsured-fund-film-v1-zh-hant'],
] as const;

describe('reviewed passenger recourse and uninsured settlement publication batch', () => {
  it.each(cases)('includes %s once in its reviewed subject, search and video filter', (slug, query, number, subject, videoId) => {
    const items = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    expect(items.filter(item => item.slug === slug)).toMatchObject([
      { subject, hasVideo: true, columnNumber: number, aiAuthored: true },
    ]);
    expect(filterTrafficBoardItems(items, parseTrafficBoardQuery({ subject, q: query })).map(item => item.slug)).toContain(slug);
    expect(filterTrafficBoardItems(items, parseTrafficBoardQuery({ video: '1' })).some(item => item.slug === slug)).toBe(true);
    expect(getColumnGeneratedVideo('zh-hant', slug)?.id).toBe(videoId);
    expect(getColumnPost(slug, 'zh-hant')?.diagramVideo).toBeUndefined();
  });

  it.each(cases)('preserves native language scope and one search entry for %s', slug => {
    for (const locale of ['ko', 'zh-hant', 'en', 'ja'] as const) {
      expect(getAllColumnPosts(locale).some(post => post.slug === slug)).toBe(locale === 'zh-hant');
      if (locale !== 'zh-hant') expect(getColumnGeneratedVideo(locale, slug)).toBeNull();
    }
    expect(pending.columns.filter(post => post.slug === slug)).toEqual([{ locale: 'zh-hant', slug }]);
  });
});
