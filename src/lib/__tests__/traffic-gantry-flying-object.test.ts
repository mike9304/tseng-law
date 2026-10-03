import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';
import pending from '@/content/column-embeddings-pending.json';

const cases = [
  ['taiwan-lowered-height-gantry-state-compensation-driver-fault', '限高', 100, 'liability', true],
  ['taiwan-flying-object-truck-origin-dashcam-evidence', '鐵片', 101, 'evidence', false],
] as const;

describe('reviewed gantry and flying-object publication batch', () => {
  it.each(cases)('includes %s once in its reviewed subject and search, with the reviewed video state', (slug, query, number, subject, hasVideo) => {
    const items = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    expect(items.filter(item => item.slug === slug)).toMatchObject([
      { subject, hasVideo, columnNumber: number, aiAuthored: true },
    ]);
    expect(filterTrafficBoardItems(items, parseTrafficBoardQuery({ subject, q: query })).map(item => item.slug)).toContain(slug);
    expect(filterTrafficBoardItems(items, parseTrafficBoardQuery({ video: '1' })).some(item => item.slug === slug)).toBe(hasVideo);
    expect(getColumnPost(slug, 'zh-hant')?.diagramVideo).toBeUndefined();
  });

  it.each(cases)('preserves native language scope and one search entry for %s', slug => {
    for (const locale of ['ko', 'zh-hant', 'en', 'ja'] as const) {
      expect(getAllColumnPosts(locale).some(post => post.slug === slug)).toBe(locale === 'zh-hant');
    }
    expect(pending.columns.filter(post => post.slug === slug)).toEqual([{ locale: 'zh-hant', slug }]);
  });
});
