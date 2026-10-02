import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { getColumnPost } from '../columns';
import { LEGACY_TRAFFIC_SUBJECT_BY_SLUG, resolveTrafficSubject } from '../traffic-collection';
import { TRAFFIC_DIAGRAMS, splitColumnContentAfterHeading } from '@/data/traffic-diagrams';
import TrafficDiagramFigure from '@/components/TrafficDiagramFigure';

const slug = 'taiwan-chain-rear-end-first-impact-evidence';
const sha = (data: string | Buffer) => createHash('sha256').update(data).digest('hex');

describe('reviewed chain-collision publication', () => {
  it('keeps the approved body and replacement hero bytes intact while adding publication metadata', () => {
    const raw = fs.readFileSync(`src/content/columns-zh/077-${slug}.md`, 'utf8');
    const body = raw.slice(raw.indexOf('\n---\n') + 5).replace(/^\n/, '');
    expect(sha(body)).toBe('d896402a939cfbf7a6598c005b845b5ffcdd6d4f33a50542e7d275c1ddc0ecaf');
    const post = getColumnPost(slug, 'zh-hant')!;
    expect(sha(fs.readFileSync(`public${post.featuredImage}`))).toBe('96df696614cb91dc4a7592e742c8e713c5f59dbf539c8b79f22339d632da2e5b');
    expect(post.featuredImageAlt).toBe('AI生成情境圖：市區道路上可見深灰、銀色與白色三輛小客車的車尾，車身之間沒有可見接觸。');
    expect(post.featuredImageCaption).toBe('AI生成情境圖，非真實事故照片。三車之間有間隔，畫面沒有碰撞或車損；靜止畫面無法判斷車輛正在移動或已停住，也不能證明停車合法或車距安全。');
  });
  it('joins the traffic board by tags without extending the reviewed legacy slug map', () => {
    expect(LEGACY_TRAFFIC_SUBJECT_BY_SLUG[slug]).toBeUndefined();
    const post = getColumnPost(slug, 'zh-hant')!;
    expect(resolveTrafficSubject(post)).toBe('evidence');
    expect(resolveTrafficSubject({ ...post, tags: [] })).toBeNull();
    expect(post.diagramVideo?.id).toBe('chain-collision-hypothetical');
    expect(splitColumnContentAfterHeading(post.content, post.diagramVideo!.afterHeading!)).not.toBeNull();
  });
  it('renders the unchanged PNG stages and makes no initial video request', () => {
    const diagram = TRAFFIC_DIAGRAMS['chain-collision-hypothetical'];
    const html = renderToStaticMarkup(<TrafficDiagramFigure diagramId="chain-collision-hypothetical" locale="zh-hant" />);
    expect(html).not.toContain('<video');
    expect(html).toContain('srcSet="/images/traffic/tw-chain-collision-step-01-mobile.png"');
    expect(html).toContain('data-traffic-diagram-stages');
    expect(diagram.stills).toHaveLength(4);
    for (const stage of diagram.stills) {
      for (const src of [stage.poster, stage.mobilePoster]) {
        expect(html).toContain(src);
        expect(fs.readFileSync(`public${src}`).subarray(1, 4).toString()).toBe('PNG');
      }
    }
    expect(renderToStaticMarkup(<TrafficDiagramFigure diagramId="chain-collision-hypothetical" locale="en" />)).toBe('');
  });
});
