import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { getColumnPost, getAllColumnPosts } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';

const slug = 'taiwan-car-repair-rental-cost-repair-period-evidence';

describe('reviewed rental-repair compensation column', () => {
  it('preserves the exact reviewed body, case amounts and qualifications', () => {
    const file = fs.readFileSync(`src/content/columns-zh/086-${slug}.md`, 'utf8');
    const body = file.slice(file.indexOf('\n---\n') + 5);
    expect(createHash('sha256').update(body).digest('hex')).toBe('6ea09674069efddc774a209b6993b4d6b159616c02f9df61bd4b2b373d683803');
    expect(body).toContain('本文未確認是否上訴、上訴結果或是否確定');
    expect(body).toContain('不能據此宣稱租期與修車日期已逐日吻合');
  });

  it('automatically joins the compensation collection without a false video or language copy', () => {
    const collection = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    const matches = collection.filter(p => p.slug === slug);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ subject: 'compensation', hasVideo: false, columnNumber: 86, aiAuthored: true });
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'compensation', q: '租車單' })).map(p => p.slug)).toEqual([slug]);
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'compensation', video: '1' })).some(p => p.slug === slug)).toBe(false);
    expect(getColumnPost(slug, 'zh-hant')!.diagramVideo).toBeUndefined();
    for (const locale of ['ko', 'en', 'ja'] as const) expect(getAllColumnPosts(locale).some(p => p.slug === slug)).toBe(false);
  });
});
