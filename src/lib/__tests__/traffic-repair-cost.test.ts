import { describe, expect, it } from 'vitest';
import { getColumnGeneratedVideo } from '@/data/column-generated-videos';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { getColumnPost, getAllColumnPosts } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';

const slug = 'taiwan-car-repair-cost-estimate-parts-depreciation';

describe('reviewed repair-cost depreciation column', () => {
  it('preserves the exact reviewed body, case amounts and qualifications', () => {
    const file = fs.readFileSync(`src/content/columns-zh/081-${slug}.md`, 'utf8');
    const body = file.slice(file.indexOf('\n---\n') + 5);
    expect(createHash('sha256').update(body).digest('hex')).toBe('b99475456c846c65240c749cc8e26c08fb189ef7d28b1d6e706b68897bcda728');
    expect(body).toContain('是否上訴、是否確定，尚未確認');
    expect(body).toContain('判決未另列金額');
  });

  it('automatically enables the compensation collection with its reviewed video and no language copy', () => {
    const collection = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    const matches = collection.filter(p => p.slug === slug);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ subject: 'compensation', hasVideo: true, columnNumber: 81, aiAuthored: true });
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'compensation', q: '折舊' })).map(p => p.slug)).toEqual([slug]);
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'compensation', video: '1' })).map(p => p.slug)).toEqual([
      'taiwan-road-rage-baseball-bat-fracture-damages',
      'taiwan-car-repair-rental-cost-repair-period-evidence',
      slug,
    ]);
    // 2026-10-03: reviewed generated video; no diagram frontmatter.
    expect(getColumnGeneratedVideo('zh-hant', slug)?.id).toBe('repair-workshop-v1-zh-hant');
    expect(getColumnPost(slug, 'zh-hant')!.diagramVideo).toBeUndefined();
    for (const locale of ['ko', 'en', 'ja'] as const) expect(getAllColumnPosts(locale).some(p => p.slug === slug)).toBe(false);
  });
});
