import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { getColumnPost, getAllColumnPosts } from '../columns';
import { buildTrafficCollection } from '../traffic-collection';

const slug = 'taiwan-borrowed-car-owner-driver-key-custody-liability';

describe('reviewed borrowed-car liability column', () => {
  it('preserves the exact reviewed body including factual and legal qualifications', () => {
    const file = fs.readFileSync(`src/content/columns-zh/080-${slug}.md`, 'utf8');
    const body = file.slice(file.indexOf('\n---\n') + 5);
    expect(createHash('sha256').update(body).digest('hex')).toBe('53052322e19d5345c3de5cf6633995e673f2d9719a34e2a89dd367fd1cfd8d54');
    expect(body).toContain('未確認是否確定');
    expect(body).toContain('施行日期由行政院另定');
  });

  it('includes only one native liability article, with the approved photo and no video', () => {
    const matches = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] }).filter(p => p.slug === slug);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ subject: 'liability', hasVideo: false, columnNumber: 80, aiAuthored: true });
    const post = getColumnPost(slug, 'zh-hant')!;
    expect(post.diagramVideo).toBeUndefined();
    expect(post.featuredImage).toBe('/images/columns/20261002/borrowed-car-liability-hero-1600x900.webp');
    for (const locale of ['ko', 'en', 'ja'] as const) expect(getAllColumnPosts(locale).some(p => p.slug === slug)).toBe(false);
  });
});
