import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';
import pending from '@/content/column-embeddings-pending.json';

const pedestrian = 'green-light-red-light-pedestrian-third-person';
const trademark = 'taiwan-distributor-trademark-registration-korean-brand';
const inheritance = 'taiwan-bank-inheritance-us-power-of-attorney';

describe('native pedestrian and Korean trademark publication', () => {
  it('classifies the pedestrian case once as liability without an invented video', () => {
    const collection = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    expect(collection.filter(p => p.slug === pedestrian)).toMatchObject([{ subject: 'liability', hasVideo: false, columnNumber: 90, aiAuthored: true }]);
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'liability', q: '第三人' })).map(p => p.slug)).toContain(pedestrian);
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ video: '1' })).some(p => p.slug === pedestrian)).toBe(false);
    expect(getColumnPost(pedestrian, 'zh-hant')?.diagramVideo).toBeUndefined();
  });

  it('keeps trademark advice out of traffic and maintains native language scope', () => {
    for (const locale of ['ko', 'zh-hant', 'en', 'ja'] as const) {
      const posts = getAllColumnPosts(locale);
      expect(posts.some(p => p.slug === pedestrian)).toBe(locale === 'zh-hant');
      expect(posts.some(p => p.slug === trademark)).toBe(locale === 'ko');
      expect(buildTrafficCollection(locale, { columns: posts, issues: [] }).some(p => p.slug === trademark)).toBe(false);
    }
    expect(getColumnPost(trademark, 'ko')?.diagramVideo).toBeUndefined();
    expect(pending.columns.filter(p => [pedestrian, trademark].includes(p.slug))).toEqual([
      { locale: 'zh-hant', slug: pedestrian }, { locale: 'ko', slug: trademark },
    ]);
  });

  it('publishes US bank-inheritance guidance only in English and outside traffic', () => {
    for (const locale of ['ko', 'zh-hant', 'en', 'ja'] as const) {
      const posts = getAllColumnPosts(locale);
      expect(posts.some(p => p.slug === inheritance)).toBe(locale === 'en');
      expect(buildTrafficCollection(locale, { columns: posts, issues: [] }).some(p => p.slug === inheritance)).toBe(false);
    }
    expect(getColumnPost(inheritance, 'en')).toMatchObject({ aiAuthored: true, topic: 'inheritance' });
    expect(getColumnPost(inheritance, 'en')?.diagramVideo).toBeUndefined();
    expect(pending.columns.filter(p => p.slug === inheritance)).toEqual([{ locale: 'en', slug: inheritance }]);
  });
});
