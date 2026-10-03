import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';
import pending from '@/content/column-embeddings-pending.json';

const articles = [
  { slug: 'taiwan-video-timing-sidewalk-bicycle-alley-scooter-evidence', number: 172, subject: 'evidence' },
  { slug: 'taiwan-manhole-pothole-road-authority-utility-internal-recourse', number: 173, subject: 'liability' },
] as const;

describe('video timing and road maintenance columns', () => {
  it.each(articles)('finds $slug once in its native subject, with its reviewed film and no translated fallback', (a) => {
    const collection = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    const matches = collection.filter(post => post.slug === a.slug);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ subject: a.subject, columnNumber: a.number, hasVideo: true, publicationDate: '2026-10-04' });
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: a.subject, q: matches[0].title })).map(post => post.slug)).toEqual([a.slug]);
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ video: '1' })).some(post => post.slug === a.slug)).toBe(true);
    expect(pending.columns.filter(post => post.slug === a.slug)).toEqual([{ locale: 'zh-hant', slug: a.slug }]);
    for (const locale of ['ko', 'en', 'ja'] as const) expect(getAllColumnPosts(locale).some(post => post.slug === a.slug)).toBe(false);
  });

  it('keeps the appealed first-instance and video timing limitations together', () => {
    const post = getColumnPost(articles[0].slug, 'zh-hant')!;
    expect(post.content).toContain('這是已提起上訴的一審判決');
    expect(post.content).toContain('未提供該案裁判日期及全文連結');
    expect(post.content).toContain('不是精確測速結果');
    expect(post.content).toContain('本文沒有取得或觀看本案原始影音');
    expect(post.content).toContain('[S10]: https://nvlpubs.nist.gov/nistpubs/ir/2022/NIST.IR.8387.pdf');
  });

  it('keeps internal recourse distinct from rider fault, with its payment and finality limits', () => {
    const post = getColumnPost(articles[1].slug, 'zh-hant')!;
    expect(post.content).toContain('這個四成是養工處的責任，不是騎士的過失');
    expect(post.content).toContain('如果已超過自己應分擔的部分，並使另一方同免責任');
    expect(post.content).toContain('這不等同已確認判決確定');
    expect(post.content).toContain('公布後三個月施行');
    expect(post.content).toContain('| 中華電信應分擔的六成 | 168 萬 6,000 元');
    expect(post.content).toContain('| 養工處自己應分擔的四成 | 112 萬 4,000 元');
  });
});
