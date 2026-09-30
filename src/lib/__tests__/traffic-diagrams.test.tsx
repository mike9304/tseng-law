import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { getColumnPost } from '../columns';
import { extractColumnToc } from '../column-toc';
import { siteLocales } from '../locales';
import ColumnContent from '@/components/ColumnContent';
import {
  TRAFFIC_DIAGRAMS,
  type TrafficDiagram,
  normalizeColumnDiagramVideo,
  splitColumnContentAfterHeading,
} from '@/data/traffic-diagrams';

const publicFile = (src: string) => path.join(process.cwd(), 'public', src);
const MAX_VIDEO_BYTES = 1.5 * 1024 * 1024;

describe('animated traffic diagrams', () => {
  it('ships bounded MP4/WebM loops and WebP posters for every diagram', () => {
    for (const diagram of Object.values(TRAFFIC_DIAGRAMS) as TrafficDiagram[]) {
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

  it('captions every locale with the illustrative-assumption note', () => {
    const markers = { ko: '설명용 가정값', 'zh-hant': '說明用假設值', en: 'Illustrative assumptions', ja: '説明用の仮定値' } as const;
    for (const diagram of Object.values(TRAFFIC_DIAGRAMS) as TrafficDiagram[]) {
      for (const locale of siteLocales) {
        const copy = diagram.copy[locale];
        expect(copy.assumption.startsWith(markers[locale]), `${diagram.id}/${locale}`).toBe(true);
        expect(copy.caption.length).toBeGreaterThan(20);
        expect(copy.alt.length).toBeGreaterThan(20);
      }
    }
  });

  it('keeps the withdrawn overtaking-012 reconstruction out of every column and the registry', () => {
    expect(Object.keys(TRAFFIC_DIAGRAMS)).not.toContain('overtaking-012');
    for (const locale of siteLocales) {
      const post = getColumnPost('taiwan-overtaking-accident-liability', locale)!;
      expect(post.diagramVideo, locale).toBeUndefined();
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
    expect(splitColumnContentAfterHeading('## A\n\npara\n\n## B\n\nx', 'Missing')).toBeNull();
    expect(splitColumnContentAfterHeading('## A\n\npara one\nline two\n\nnext\n\n## B', 'A')).toEqual([
      '## A\n\npara one\nline two',
      'next\n\n## B',
    ]);
  });
});
