import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';
import pending from '@/content/column-embeddings-pending.json';

const slug = 'taiwan-gas-station-tanker-reversing-beeper-liability';

describe('native tanker reversing publication', () => {
  it('appears once in liability and text search without an invented video', () => {
    const items = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    expect(items.filter(item => item.slug === slug)).toMatchObject([
      { subject: 'liability', hasVideo: false, columnNumber: 93, aiAuthored: true },
    ]);
    expect(filterTrafficBoardItems(items, parseTrafficBoardQuery({ subject: 'liability', q: '蜂鳴器' })).map(item => item.slug)).toContain(slug);
    expect(filterTrafficBoardItems(items, parseTrafficBoardQuery({ video: '1' })).some(item => item.slug === slug)).toBe(false);
    expect(getColumnPost(slug, 'zh-hant')?.diagramVideo).toBeUndefined();
  });

  it('keeps native language scope and an explicit pending search embedding', () => {
    for (const locale of ['ko', 'zh-hant', 'en', 'ja'] as const) {
      expect(getAllColumnPosts(locale).some(post => post.slug === slug)).toBe(locale === 'zh-hant');
    }
    expect(pending.columns.filter(post => post.slug === slug)).toEqual([{ locale: 'zh-hant', slug }]);
  });
});
