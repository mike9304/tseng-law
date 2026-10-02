import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { getColumnPost } from '../columns';
import { LEGACY_TRAFFIC_SUBJECT_BY_SLUG, resolveTrafficSubject } from '../traffic-collection';
import { TRAFFIC_DIAGRAMS, splitColumnContentAfterHeading } from '@/data/traffic-diagrams';
import TrafficDiagramFigure from '@/components/TrafficDiagramFigure';

const slug = 'taiwan-roadside-starting-parking-exit-liability';
const sha = (data: string | Buffer) => createHash('sha256').update(data).digest('hex');

describe('reviewed starting-entry publication', () => {
  it('keeps the approved body and replacement hero bytes intact while adding publication metadata', () => {
    const raw = fs.readFileSync(`src/content/columns-zh/076-${slug}.md`, 'utf8');
    const body = raw.slice(raw.indexOf('\n---\n') + 5);
    expect(sha(body)).toBe('03c711f1506f0d90a64fc2726f583e722d9d0ad8086930de27fec0226c8aea2d');
    const post = getColumnPost(slug, 'zh-hant')!;
    expect(sha(fs.readFileSync(`public${post.featuredImage}`))).toBe('b891ad9efbe8582c39c5af70ddf4ceab90385691cbfd95551cf705318254eb1e');
    expect(post.featuredImageAlt).toBe('AI 生成的假想情境示意圖：銀色轎車停在住宅車棚出口內側，前方為空曠的住宅區道路；非真實事故照片。');
    expect(post.featuredImageCaption).toBe('AI 生成之假想情境示意圖，呈現車輛停放於住宅車棚、面向前方道路的情境；非真實事故照片、現場重建或責任認定依據。');
  });
  it('joins the traffic board by tags without extending the reviewed legacy slug map', () => {
    expect(LEGACY_TRAFFIC_SUBJECT_BY_SLUG[slug]).toBeUndefined();
    const post = getColumnPost(slug, 'zh-hant')!;
    expect(resolveTrafficSubject(post)).toBe('liability');
    expect(resolveTrafficSubject({ ...post, tags: [] })).toBeNull();
    expect(post.diagramVideo?.id).toBe('starting-entry-hypothetical');
    expect(splitColumnContentAfterHeading(post.content, post.diagramVideo!.afterHeading!)).not.toBeNull();
  });
  it('renders the unchanged PNG stages and makes no initial video request', () => {
    const diagram = TRAFFIC_DIAGRAMS['starting-entry-hypothetical'];
    const html = renderToStaticMarkup(<TrafficDiagramFigure diagramId="starting-entry-hypothetical" locale="zh-hant" />);
    expect(html).not.toContain('<video');
    expect(html).toContain('srcSet="/images/traffic/tw-starting-entry-step-01-mobile.png"');
    expect(html).toContain('data-traffic-diagram-stages');
    expect(diagram.stills).toHaveLength(4);
    for (const stage of diagram.stills) {
      for (const src of [stage.poster, stage.mobilePoster]) {
        expect(html).toContain(src);
        expect(fs.readFileSync(`public${src}`).subarray(1, 4).toString()).toBe('PNG');
      }
    }
    expect(renderToStaticMarkup(<TrafficDiagramFigure diagramId="starting-entry-hypothetical" locale="en" />)).toBe('');
  });
});
