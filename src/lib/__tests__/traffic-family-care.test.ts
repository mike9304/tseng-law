import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { getColumnPost, getAllColumnPosts } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';

const slug = 'taiwan-accident-family-care-necessity-period';

describe('reviewed family-care compensation column', () => {
  it('preserves the exact reviewed body, case amounts and qualifications', () => {
    const file = fs.readFileSync(`src/content/columns-zh/085-${slug}.md`, 'utf8');
    const body = file.slice(file.indexOf('\n---\n') + 5);
    expect(createHash('sha256').update(body).digest('hex')).toBe('ef6305aed4de829f3cbfcff02462e73c9a21dfba80d7eaadbc785cd0b5c44d41');
    expect(body).toContain('本文未另取得確定證明書或查核非常救濟程序');
    expect(body).toContain('並非全國統一或現行行情');
  });

  it('automatically joins the compensation collection without a false video or language copy', () => {
    const collection = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    const matches = collection.filter(p => p.slug === slug);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ subject: 'compensation', hasVideo: false, columnNumber: 85, aiAuthored: true });
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'compensation', q: '家人' })).map(p => p.slug)).toEqual([slug]);
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'compensation', video: '1' })).some(p => p.slug === slug)).toBe(false);
    expect(getColumnPost(slug, 'zh-hant')!.diagramVideo).toBeUndefined();
    for (const locale of ['ko', 'en', 'ja'] as const) expect(getAllColumnPosts(locale).some(p => p.slug === slug)).toBe(false);
  });
});
