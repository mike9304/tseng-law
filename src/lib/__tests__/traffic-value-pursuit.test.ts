import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';
import { getColumnGeneratedVideo } from '@/data/column-generated-videos';
import pending from '@/content/column-embeddings-pending.json';

const articles = [
  { slug: 'taiwan-repaired-car-diminished-value-appraisal-evidence', number: 189, subject: 'compensation', film: 'diminished-value-film-v1-zh-hant' },
  { slug: 'taiwan-pursuit-fatal-self-crash-vacated-judgment', number: 190, subject: 'liability', film: 'pursuit-vacatur-film-v2-zh-hant' },
] as const;

describe('reviewed diminished value and vacated pursuit judgment columns', () => {
  it.each(articles)('includes $slug once in native search with its reviewed video availability', (a) => {
    const items = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    const matches = items.filter(p => p.slug === a.slug);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ columnNumber: a.number, subject: a.subject, hasVideo: Boolean(a.film), publicationDate: '2026-10-04' });
    expect(filterTrafficBoardItems(items, parseTrafficBoardQuery({ subject: a.subject, q: matches[0].title })).map(p => p.slug)).toEqual([a.slug]);
    expect(filterTrafficBoardItems(items, parseTrafficBoardQuery({ video: '1' })).some(p => p.slug === a.slug)).toBe(Boolean(a.film));
    expect(pending.columns.filter(p => p.slug === a.slug)).toEqual([{ locale: 'zh-hant', slug: a.slug }]);
    expect(getColumnGeneratedVideo('zh-hant', a.slug)?.id).toBe(a.film);
    for (const locale of ['ko', 'en', 'ja'] as const) expect(getAllColumnPosts(locale).some(p => p.slug === a.slug)).toBe(false);
  });

  it('keeps the case-specific valuation, proof prerequisite and limited fault allocation', () => {
    const post = getColumnPost(articles[0].slug, 'zh-hant')!;
    expect(post.content).toContain('這個 2% 是本案的判斷，不能拿來當所有事故車的固定折價率');
    expect(post.content).toContain('不能把其餘 30% 全部說成車主的過失');
    expect(post.content).toContain('已證明受有損害，只是數額不能證明，或證明顯有重大困難');
    expect(post.content).toContain('本稿未取得確定證明');
  });

  it('opens with vacatur, preserves appeal uncertainty and resolves every source citation', () => {
    const post = getColumnPost(articles[1].slug, 'zh-hant')!;
    const film = getColumnGeneratedVideo('zh-hant', articles[1].slug)!;
    expect(film.chapters?.[0].title).toContain('一審九年已撤銷');
    expect(film.chapters?.[0].text).toContain('不是實體無罪');
    expect(film).toMatchObject({ durationSeconds: 3937 / 24, sceneCount: 17 });
    expect(film.chapters?.[0].title).toContain('自摔假想');
    expect(film.chapters?.[1].title).toContain('一審九年已撤銷');
    expect(film.chapters?.slice(1).map(chapter => chapter.start)).toEqual(
      Array.from({ length: 16 }, (_, chapter) => chapter * 10 + 97 / 24),
    );
    expect(film.disclosure).toContain('不是確定有罪結論');
    expect(post.content.replace(/^# .*\n\n/, '')).toMatch(/^> 本文討論的一審九年有罪判決，已經被撤銷。/);
    expect(post.summary).toContain('因被告死亡遭撤銷');
    for (const phrase of ['二審也沒有作成實體無罪判斷', '不能描述成「全程沒有碰到」', '本案一審未明引第17條', '最高時速78公里，來自被告汽車', '並不是「不得上訴」', '本文未取得確定證明或後續上訴資料']) expect(post.content).toContain(phrase);
    const definitions = [...post.content.matchAll(/^\[(s\d)\]: (https:\/\/\S+)$/gm)];
    expect(definitions.map(m => m[1])).toEqual(['s1', 's2', 's3', 's4', 's5', 's6']);
    for (const match of post.content.matchAll(/\]\[(s\d)\]/g)) expect(definitions.some(m => m[1] === match[1])).toBe(true);
    expect(post.content).not.toMatch(/href=|\]\(#s\d\)|<strong|\*\*/);
  });
});
