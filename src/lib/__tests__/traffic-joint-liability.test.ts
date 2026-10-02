import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { getColumnPost, getAllColumnPosts } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';
import pendingEmbeddings from '@/content/column-embeddings-pending.json';

const slug = 'taiwan-racing-no-contact-joint-tort-liability';

describe('reviewed joint-tort liability column', () => {
  it('preserves the exact reviewed body, case amounts and qualifications', () => {
    const file = fs.readFileSync(`src/content/columns-zh/088-${slug}.md`, 'utf8');
    const body = file.slice(file.indexOf('\n---\n') + 5);
    expect(createHash('sha256').update(body).digest('hex')).toBe('49ef83cfbe01be0e4a3db89bf5df9c40b362ef5af8e4f20c67905f5839c79951');
    expect(body).toContain('尚無法確認確定狀態');
    expect(body).toContain('本案兩人實際應如何分擔，這兩份判決並未判定');
  });

  it('automatically joins the liability collection without a false video or language copy', () => {
    const collection = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    const matches = collection.filter(p => p.slug === slug);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ subject: 'liability', hasVideo: false, columnNumber: 88, aiAuthored: true });
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'liability', q: '共同原因' })).map(p => p.slug)).toEqual([slug]);
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'liability', video: '1' })).some(p => p.slug === slug)).toBe(false);
    expect(getColumnPost(slug, 'zh-hant')!.diagramVideo).toBeUndefined();
    expect(pendingEmbeddings.columns.filter(p => p.slug === slug)).toEqual([{ locale: 'zh-hant', slug }]);
    for (const locale of ['ko', 'en', 'ja'] as const) expect(getAllColumnPosts(locale).some(p => p.slug === slug)).toBe(false);
  });
});
