import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';
import { getColumnGeneratedVideo } from '@/data/column-generated-videos';
import pending from '@/content/column-embeddings-pending.json';

const articles = [
  { slug: 'taiwan-detached-tire-delayed-treatment-criminal-injury-causation', number: 205, video: 'detached-tire-impact-v3-zh-hant' },
  { slug: 'taiwan-freeway-warning-triangle-time-ability-evidence', number: 206, video: 'warning-triangle-rear-end-v2-zh-hant' },
] as const;

describe('reviewed tire injury and warning-triangle columns', () => {
  it.each(articles)('includes $slug once in native search and liability with its reviewed video', (a) => {
    const items = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    const matches = items.filter(p => p.slug === a.slug);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ columnNumber: a.number, subject: 'liability', hasVideo: true, publicationDate: '2026-10-04' });
    expect(filterTrafficBoardItems(items, parseTrafficBoardQuery({ subject: 'liability', q: matches[0].title })).map(p => p.slug)).toEqual([a.slug]);
    expect(filterTrafficBoardItems(items, parseTrafficBoardQuery({ video: '1' })).some(p => p.slug === a.slug)).toBe(true);
    expect(pending.columns.filter(p => p.slug === a.slug)).toEqual([{ locale: 'zh-hant', slug: a.slug }]);
    expect(getColumnGeneratedVideo('zh-hant', a.slug)).toMatchObject({ id: a.video, src: `/videos/columns/${a.video}.mp4` });
    for (const locale of ['ko', 'en', 'ja'] as const) expect(getAllColumnPosts(locale).some(p => p.slug === a.slug)).toBe(false);
  });
  it('preserves injury causation, statutory-version and appeal limits', () => {
    const post = getColumnPost(articles[0].slug, 'zh-hant')!;
    for (const phrase of ['並未認定創傷後壓力症', '未取得確定證明或執行資料', '並非支付給被害人的賠償金', '未符合第三審上訴的法定要求', '事故當時已適用上述文字', '不宜為蒐證而拖延就醫']) expect(post.content).toContain(phrase);
  });
  it('preserves distinct timing, case-specific estimate and safety limits', () => {
    const post = getColumnPost(articles[1].slug, 'zh-hant')!;
    for (const phrase of ['06:05:18停定到06:06:50後撞', '06:05:14的首次碰撞', '不是法律給每個人的寬限期', '沒有另取得確定證明', '不能只用錄影持續', '並非示範應站在車道上舉牌']) expect(post.content).toContain(phrase);
    expect(post.content).not.toContain('尚待獨立審查');
    expect(post.content.match(/^\| 06:/gm)).toHaveLength(9);
  });
  it.each(articles)('resolves every reviewed reference and retains the photo disclosure for $slug', (a) => {
    const post = getColumnPost(a.slug, 'zh-hant')!;
    const definitions = new Map([...post.content.matchAll(/^\[([^\]]+)\]: (https:\/\/\S+)$/gm)].map(m => [m[1], m[2]]));
    for (const m of post.content.matchAll(/\]\[([^\]]+)\]/g)) expect(definitions.has(m[1])).toBe(true);
    expect(definitions.size).toBe(a.number === 205 ? 10 : 9);
    expect(post.content).not.toMatch(/\*\*|<strong|<b\b/);
    expect(post.featuredImageCaption).toContain('AI 生成虛構示意圖');
  });
});
