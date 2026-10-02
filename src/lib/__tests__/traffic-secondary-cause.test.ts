import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { getColumnPost, getAllColumnPosts } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';

const slug = 'taiwan-accident-assessment-secondary-cause-compensation-ratio';

describe('reviewed secondary-cause compensation column', () => {
  it('preserves the exact reviewed body, case amounts and qualifications', () => {
    const file = fs.readFileSync(`src/content/columns-zh/083-${slug}.md`, 'utf8');
    const body = file.slice(file.indexOf('\n---\n') + 5);
    expect(createHash('sha256').update(body).digest('hex')).toBe('37192731d8ff9f738d94a0ca3dac52ad0af7bdfad25cfaf199f2134cfef45852');
    expect(body).toContain('未確認本件民事判決是否上訴或已確定');
    expect(body).toContain('不是法院的結論');
  });

  it('automatically joins the evidence collection without a false video or language copy', () => {
    const collection = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    const matches = collection.filter(p => p.slug === slug);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ subject: 'evidence', hasVideo: false, columnNumber: 83, aiAuthored: true });
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'evidence', q: '次因' })).map(p => p.slug)).toEqual([slug]);
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'evidence', video: '1' })).some(p => p.slug === slug)).toBe(false);
    expect(getColumnPost(slug, 'zh-hant')!.diagramVideo).toBeUndefined();
    for (const locale of ['ko', 'en', 'ja'] as const) expect(getAllColumnPosts(locale).some(p => p.slug === slug)).toBe(false);
  });
});
