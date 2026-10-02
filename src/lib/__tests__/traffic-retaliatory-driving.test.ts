import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { getColumnPost, getAllColumnPosts } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';

const slug = 'taiwan-retaliatory-driving-rear-ended-intentional-injury';

describe('reviewed retaliatory-driving liability column', () => {
  it('preserves the exact reviewed body, case amounts and qualifications', () => {
    const file = fs.readFileSync(`src/content/columns-zh/087-${slug}.md`, 'utf8');
    const body = file.slice(file.indexOf('\n---\n') + 5);
    expect(createHash('sha256').update(body).digest('hex')).toBe('9362f203ed72cec59e38b7107d4d49167d2ea625aca4f6f9a534436ff08ef7fc');
    expect(body).toContain('未另核實確切確定日與執行結果');
    expect(body).toContain('本案兩件刑事裁判沒有裁出雙方的民事責任比例');
  });

  it('automatically joins the liability collection without a false video or language copy', () => {
    const collection = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    const matches = collection.filter(p => p.slug === slug);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ subject: 'liability', hasVideo: false, columnNumber: 87, aiAuthored: true });
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'liability', q: '傷害故意' })).map(p => p.slug)).toEqual([slug]);
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'liability', video: '1' })).some(p => p.slug === slug)).toBe(false);
    expect(getColumnPost(slug, 'zh-hant')!.diagramVideo).toBeUndefined();
    for (const locale of ['ko', 'en', 'ja'] as const) expect(getAllColumnPosts(locale).some(p => p.slug === slug)).toBe(false);
  });
});
