import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';
import pending from '@/content/column-embeddings-pending.json';

const cases = [
  ['taiwan-parking-wheelstop-latch-service-safety-causation', '鎖扣', 97],
  ['taiwan-motorway-blocking-no-collision-public-danger', '國道', 98],
] as const;

describe('reviewed parking and motorway publication batch', () => {
  it.each(cases)('includes %s exactly once in liability and search without a fabricated video', (slug, query, number) => {
    const items = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    expect(items.filter(item => item.slug === slug)).toMatchObject([
      { subject: 'liability', hasVideo: false, columnNumber: number, aiAuthored: true },
    ]);
    expect(filterTrafficBoardItems(items, parseTrafficBoardQuery({ subject: 'liability', q: query })).map(item => item.slug)).toContain(slug);
    expect(filterTrafficBoardItems(items, parseTrafficBoardQuery({ video: '1' })).some(item => item.slug === slug)).toBe(false);
    expect(getColumnPost(slug, 'zh-hant')?.diagramVideo).toBeUndefined();
  });

  it.each(cases)('preserves native language scope and one pending search entry for %s', slug => {
    for (const locale of ['ko', 'zh-hant', 'en', 'ja'] as const) {
      expect(getAllColumnPosts(locale).some(post => post.slug === slug)).toBe(locale === 'zh-hant');
    }
    expect(pending.columns.filter(post => post.slug === slug)).toEqual([{ locale: 'zh-hant', slug }]);
  });
});
