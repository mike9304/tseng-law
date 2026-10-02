import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { getColumnPost } from '../columns';
import { extractColumnToc } from '../column-toc';
import { siteLocales } from '../locales';
import ColumnContent from '@/components/ColumnContent';
import TrafficDiagramFigure from '@/components/TrafficDiagramFigure';
import { TRAFFIC_DIAGRAM_ID, trafficColumnSlugsFor } from '@/data/traffic-hub';
import {
  TRAFFIC_DIAGRAMS,
  type TrafficDiagram,
  normalizeColumnDiagramVideo,
  splitColumnContentAfterHeading,
} from '@/data/traffic-diagrams';

const publicFile = (src: string) => path.join(process.cwd(), 'public', src);
const MAX_VIDEO_BYTES = 1.5 * 1024 * 1024;

describe('animated traffic diagrams', () => {
  it('gives each core-language traffic column its own original diagram', () => {
    for (const locale of siteLocales) {
      const slugs = trafficColumnSlugsFor(locale);
      const ids = slugs.map(slug => getColumnPost(slug, locale)?.diagramVideo?.id);
      expect(ids.every(Boolean), locale).toBe(true);
      expect(new Set(ids).size, locale).toBe(slugs.length);
      expect(ids).not.toContain('overtaking-012');
      for (const slug of slugs) {
        const post = getColumnPost(slug, locale)!;
        expect(post.diagramVideo?.afterHeading, `${locale}/${slug}`).toBeTruthy();
        expect(splitColumnContentAfterHeading(post.content, post.diagramVideo!.afterHeading!), `${locale}/${slug}`).not.toBeNull();
      }
    }
  });
  it('ships bounded MP4/WebM loops and WebP posters for every diagram', () => {
    for (const diagram of Object.values(TRAFFIC_DIAGRAMS) as TrafficDiagram[]) {
      if (diagram.kind === 'still') {
        for (const src of [diagram.poster, diagram.mobilePoster]) {
          const bytes = fs.readFileSync(publicFile(src));
          expect(bytes.length, src).toBeLessThan(120 * 1024);
          expect(bytes.subarray(8, 12).toString(), src).toBe('WEBP');
        }
        continue;
      }
      for (const src of [diagram.mp4, diagram.mobileMp4]) {
        const bytes = fs.readFileSync(publicFile(src));
        expect(bytes.length, src).toBeLessThan(MAX_VIDEO_BYTES);
        expect(bytes.subarray(4, 8).toString(), src).toBe('ftyp');
      }
      for (const src of [diagram.webm, diagram.mobileWebm]) {
        const bytes = fs.readFileSync(publicFile(src));
        expect(bytes.length, src).toBeLessThan(MAX_VIDEO_BYTES);
        expect(bytes.readUInt32BE(0), src).toBe(0x1a45dfa3);
      }
      for (const src of [diagram.poster, diagram.mobilePoster]) {
        const bytes = fs.readFileSync(publicFile(src));
        expect(bytes.length, src).toBeLessThan(100 * 1024);
        expect(bytes.subarray(8, 12).toString(), src).toBe('WEBP');
      }
      expect(diagram.durationSeconds).toBeGreaterThanOrEqual(4);
      if (['lane-change-hypothetical', 'right-turn-hypothetical', 'dooring-hypothetical'].includes(diagram.id)) {
        expect(diagram.durationSeconds).toBe(12);
      } else {
        expect(diagram.durationSeconds).toBeLessThanOrEqual(diagram.id === 'flashing-red-yellow-hypothetical' ? 28 : 8);
      }
    }
  });

  it('labels every locale as a hypothetical example', () => {
    const markers = { ko: '가상 예시:', 'zh-hant': '假設示例：', en: 'Hypothetical example:', ja: '仮想の例：' } as const;
    for (const diagram of Object.values(TRAFFIC_DIAGRAMS) as TrafficDiagram[]) {
      if (['lane-change-hypothetical', 'right-turn-hypothetical', 'dooring-hypothetical', 'flashing-red-yellow-hypothetical'].includes(diagram.id)) {
        expect(Object.keys(diagram.copy)).toEqual(['zh-hant']);
        expect(diagram.copy['zh-hant']?.assumption).toContain('假設示意，非事故重建');
        continue;
      }
      for (const locale of siteLocales) {
        const copy = diagram.copy[locale]!;
        if (diagram.kind === 'still') {
          expect(copy.assumption.length).toBeGreaterThan(15);
        } else {
          expect(copy.assumption.startsWith(markers[locale]), `${diagram.id}/${locale}`).toBe(true);
        }
        expect(copy.caption.length).toBeGreaterThan(20);
        expect(copy.alt.length).toBeGreaterThan(20);
      }
    }
  });

  it('keeps the native Taiwan illustration distinct, readable without animation, and out of the existing hub', () => {
    const post = getColumnPost('taiwan-lane-change-side-rear-collision-liability', 'zh-hant')!;
    expect(post.diagramVideo?.id).toBe('lane-change-hypothetical');
    expect(splitColumnContentAfterHeading(post.content, post.diagramVideo!.afterHeading!)).not.toBeNull();
    expect(trafficColumnSlugsFor('zh-hant')).not.toContain(post.slug);
    const html = renderToStaticMarkup(<TrafficDiagramFigure diagramId="lane-change-hypothetical" locale="zh-hant" />);
    expect(html).not.toContain('<video');
    expect(html).toContain('--diagram-aspect:1600 / 1080');
    expect(html).toContain('--diagram-mobile-aspect:1080 / 1350');
    expect(html).toContain('data-traffic-diagram-stages');
    const diagram = TRAFFIC_DIAGRAMS['lane-change-hypothetical'];
    expect(diagram.stills).toHaveLength(4);
    expect(diagram.copy['zh-hant'].stages.alts).toHaveLength(4);
    for (const [index, still] of diagram.stills.entries()) {
      expect(html).toContain(still.poster);
      expect(html).toContain(still.mobilePoster);
      expect(html).toContain(diagram.copy['zh-hant'].stages.alts[index]);
      for (const src of [still.poster, still.mobilePoster]) {
        const bytes = fs.readFileSync(publicFile(src));
        expect(bytes.length).toBeLessThan(100 * 1024);
        expect(bytes.subarray(8, 12).toString()).toBe('WEBP');
      }
    }
    // A native-only figure must never leak Chinese copy onto another locale.
    expect(renderToStaticMarkup(<TrafficDiagramFigure diagramId="lane-change-hypothetical" locale="en" />)).toBe('');
  });

  it('serves the right-turn illustration as a manual player with complete static explanations', () => {
    const post = getColumnPost('taiwan-right-turn-car-straight-motorcycle-evidence', 'zh-hant')!;
    expect(post.diagramVideo?.id).toBe('right-turn-hypothetical');
    expect(splitColumnContentAfterHeading(post.content, post.diagramVideo!.afterHeading!)).not.toBeNull();
    const diagram = TRAFFIC_DIAGRAMS['right-turn-hypothetical'];
    expect(diagram.playback).toBe('manual');
    const html = renderToStaticMarkup(<TrafficDiagramFigure diagramId="right-turn-hypothetical" locale="zh-hant" />);
    expect(html).toContain('data-manual-video');
    expect(html).toContain('播放影片');
    expect(html).not.toContain('<video');
    expect(html).not.toContain('.mp4');
    expect(html).not.toContain('.webm');
    expect(html).toContain(diagram.copy['zh-hant'].assumption);
    expect(html).toContain(diagram.copy['zh-hant'].videoDescription);
    expect(diagram.stills).toHaveLength(4);
    for (const [index, still] of diagram.stills.entries()) {
      expect(html).toContain(still.mobilePoster);
      expect(html).toContain(diagram.copy['zh-hant'].stages.alts[index]);
      for (const src of [still.poster, still.mobilePoster]) {
        const bytes = fs.readFileSync(publicFile(src));
        expect(bytes.length).toBeLessThan(100 * 1024);
        expect(bytes.subarray(8, 12).toString()).toBe('WEBP');
      }
    }
    expect(renderToStaticMarkup(<TrafficDiagramFigure diagramId="right-turn-hypothetical" locale="en" />)).toBe('');
    expect(trafficColumnSlugsFor('zh-hant')).not.toContain(post.slug);
  });


  it.each([
    ['taiwan-flashing-red-yellow-intersection-liability', 'flashing-red-yellow-hypothetical', 6],
    ['taiwan-car-door-opening-motorcycle-liability', 'dooring-hypothetical', 4],
  ] as const)('keeps %s readable and controllable without autoplay', (slug, id, count) => {
    const post = getColumnPost(slug, 'zh-hant')!;
    expect(post.diagramVideo?.id).toBe(id);
    expect(splitColumnContentAfterHeading(post.content, post.diagramVideo!.afterHeading!)).not.toBeNull();
    const diagram = TRAFFIC_DIAGRAMS[id];
    const html = renderToStaticMarkup(<TrafficDiagramFigure diagramId={id} locale="zh-hant" />);
    expect(html).not.toContain('<video');
    expect(html).toContain('從頭播放');
    expect(html).toContain('重複播放');
    expect(html).toContain('影片時間');
    expect(html).toContain(diagram.copy['zh-hant'].assumption);
    expect(diagram.stills).toHaveLength(count);
    expect(diagram.copy['zh-hant'].stages.alts).toHaveLength(count);
    for (const still of diagram.stills) {
      for (const src of [still.poster, still.mobilePoster]) {
        const bytes = fs.readFileSync(publicFile(src));
        expect(bytes.subarray(8, 12).toString()).toBe('WEBP');
        expect(bytes.length).toBeLessThan(100 * 1024);
      }
    }
    expect(renderToStaticMarkup(<TrafficDiagramFigure diagramId={id} locale="en" />)).toBe('');
  });

  it('keeps the withdrawn overtaking-012 reconstruction out of the registry and public assets', () => {
    expect(Object.keys(TRAFFIC_DIAGRAMS)).not.toContain('overtaking-012');
    for (const diagram of Object.values(TRAFFIC_DIAGRAMS) as TrafficDiagram[]) {
      const sources = diagram.kind === 'still' ? [diagram.poster, diagram.mobilePoster]
        : [diagram.mp4, diagram.webm, diagram.mobileMp4, diagram.mobileWebm, diagram.poster, diagram.mobilePoster];
      for (const src of sources) {
        expect(src).not.toMatch(/overtaking/);
      }
    }
  });

  it('renders the hub diagram poster-first with the hypothetical-example note (video mounts on the client only)', () => {
    const html = renderToStaticMarkup(<TrafficDiagramFigure diagramId={TRAFFIC_DIAGRAM_ID} locale="ko" />);
    expect(html).toContain('data-traffic-diagram="passing-hypothetical"');
    expect(html).toContain('passing-hypothetical-poster-mobile.webp');
    expect(html).toContain('가상 예시:');
    expect(html).not.toContain('<video');
  });

  it('places the hypothetical diagram in column 012 after the Article 101 section opening, never in the case section', () => {
    for (const locale of siteLocales) {
      const post = getColumnPost('taiwan-overtaking-accident-liability', locale)!;
      expect(post.diagramVideo?.id, locale).toBe('passing-hypothetical');
      const headings = [...post.content.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
      expect(post.diagramVideo?.afterHeading, locale).toBe(headings[0]);
      expect(splitColumnContentAfterHeading(post.content, post.diagramVideo!.afterHeading!), locale).not.toBeNull();
    }
  });

  it('splits a column body after a section heading without breaking TOC anchors', () => {
    for (const locale of siteLocales) {
      const post = getColumnPost('taiwan-overtaking-accident-liability', locale)!;
      const heading = [...post.content.matchAll(/^## (.+)$/gm)][1]?.[1];
      expect(heading, locale).toBeTruthy();
      const split = splitColumnContentAfterHeading(post.content, heading!);
      expect(split, locale).not.toBeNull();
      const [before, after] = split!;
      expect(`${before}\n\n${after}`.replace(/\s+/g, '')).toBe(post.content.replace(/\s+/g, ''));
      expect(before.trimEnd().endsWith('\n')).toBe(false);
      expect(after.startsWith('#')).toBe(false);
      // Split rendering keeps the TOC anchors continuous.
      const toc = extractColumnToc(post.content).map((entry) => entry.id);
      const offset = extractColumnToc(before).length;
      const ids = [
        ...renderToStaticMarkup(<ColumnContent content={before} locale={locale} />).matchAll(/<h2[^>]* id="([^"]+)"/g),
        ...renderToStaticMarkup(<ColumnContent content={after} locale={locale} sectionIdOffset={offset} />).matchAll(/<h2[^>]* id="([^"]+)"/g),
      ].map((match) => match[1]);
      expect(ids, locale).toEqual(toc);
    }
  });

  it('drops unknown diagram ids and falls back when the heading is missing', () => {
    expect(normalizeColumnDiagramVideo('unknown', 'x')).toBeUndefined();
    expect(normalizeColumnDiagramVideo('overtaking-012', 'x')).toBeUndefined();
    expect(normalizeColumnDiagramVideo(' passing-hypothetical ', '')).toEqual({ id: 'passing-hypothetical' });
    expect(splitColumnContentAfterHeading('## A\n\npara\n\n## B\n\nx', 'Missing')).toBeNull();
    expect(splitColumnContentAfterHeading('## A\n\npara one\nline two\n\nnext\n\n## B', 'A')).toEqual([
      '## A\n\npara one\nline two',
      'next\n\n## B',
    ]);
  });
});
