import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { getColumnPost, getAllColumnPosts } from '../columns';
import { buildTrafficCollection, isTrafficVideoDiagram } from '../traffic-collection';
import { splitColumnContentAfterHeading } from '@/data/traffic-diagrams';
import TrafficDiagramFigure from '@/components/TrafficDiagramFigure';

const slug = 'taiwan-accident-stop-dialogue-hit-and-run-evidence';
const id = 'stop-dialogue-timeline';

describe('reviewed accident departure column', () => {
  it('preserves the independently reviewed manuscript when removing only its duplicate H1', () => {
    const file = fs.readFileSync(`src/content/columns-zh/079-${slug}.md`, 'utf8');
    const body = file.split('---\n').slice(2).join('---\n').replace(/^\n/, '');
    const original = '# 車禍後停下交談才離開，為何還有肇事逃逸爭議？\n\n' + body;
    expect(createHash('sha256').update(original).digest('hex')).toBe('b800295ca45dbe742e6d88d73784027754f299e9713bd41efc225d575ecd96b8');
  });

  it('automatically includes the native post as evidence, without a video badge or duplicate', () => {
    const collection = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    const matches = collection.filter(post => post.slug === slug);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ subject: 'evidence', hasVideo: false, columnNumber: 79 });
    expect(isTrafficVideoDiagram(id)).toBe(false);
    for (const locale of ['ko', 'en', 'ja'] as const) expect(getAllColumnPosts(locale).some(post => post.slug === slug)).toBe(false);
  });

  it('server-renders a responsive static image and the complete accessible description without a player', () => {
    const post = getColumnPost(slug, 'zh-hant')!;
    expect(splitColumnContentAfterHeading(post.content, post.diagramVideo!.afterHeading!)).not.toBeNull();
    const html = renderToStaticMarkup(<TrafficDiagramFigure diagramId={id} locale="zh-hant" />);
    expect(html).toContain('media="(max-width: 640px)"');
    expect(html).toContain('stop-dialogue-timeline-portrait.webp');
    expect(html).toContain('data-traffic-diagram-description');
    expect(html).toContain('B車31秒起駛、A車32秒起駛');
    expect(html).toContain('新臺幣1,000元');
    expect(html).toContain('主張｜檢察官上訴意旨');
    expect(html).toContain('不能用來推定已確定');
    expect(html).not.toMatch(/<video|播放影片|DRAFT_FOR_REVIEW|尚未完成獨立最終審核|\.mp4|\.webm/);
    expect(renderToStaticMarkup(<TrafficDiagramFigure diagramId={id} locale="en" />)).toBe('');
  });
});
