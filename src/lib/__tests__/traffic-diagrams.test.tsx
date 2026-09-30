import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { getColumnPost } from '../columns';
import { extractColumnToc } from '../column-toc';
import { siteLocales } from '../locales';
import ColumnContent from '@/components/ColumnContent';
import TrafficDiagramFigure from '@/components/TrafficDiagramFigure';
import { TRAFFIC_DIAGRAM_ID, TRAFFIC_COLUMN_SLUGS } from '@/data/traffic-hub';
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
    const slugs = TRAFFIC_COLUMN_SLUGS;
    for (const locale of siteLocales) {
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
      expect(diagram.durationSeconds).toBeLessThanOrEqual(8);
    }
  });

  it('labels every locale as a hypothetical example', () => {
    const markers = { ko: '가상 예시:', 'zh-hant': '假設示例：', en: 'Hypothetical example:', ja: '仮想の例：' } as const;
    for (const diagram of Object.values(TRAFFIC_DIAGRAMS) as TrafficDiagram[]) {
      for (const locale of siteLocales) {
        const copy = diagram.copy[locale];
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
