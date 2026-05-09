import { describe, expect, it } from 'vitest';
import {
  createDefaultCanvasNodeStyle,
  normalizeCanvasDocument,
} from '@/lib/builder/canvas/types';

const baseTextContent = {
  text: 'Text widget',
  fontSize: 18,
  color: '#0f172a',
  fontWeight: 'regular' as const,
  align: 'left' as const,
  lineHeight: 1.4,
  letterSpacing: 0,
  fontFamily: 'system-ui',
};

describe('M11 text widget schema', () => {
  it('preserves Wix-style text widget controls through normalization', () => {
    const normalized = normalizeCanvasDocument({
      version: 1,
      locale: 'ko',
      updatedAt: '2026-05-10T00:00:00.000Z',
      updatedBy: 'm11-test',
      stageWidth: 1280,
      stageHeight: 880,
      nodes: [
        {
          id: 'text-columns',
          kind: 'text',
          rect: { x: 100, y: 100, width: 520, height: 180 },
          style: createDefaultCanvasNodeStyle(),
          zIndex: 0,
          rotation: 0,
          locked: false,
          visible: true,
          content: {
            ...baseTextContent,
            columns: 3,
            columnGap: 32,
            quoteStyle: 'pull',
            link: { href: '/ko/contact', target: '_self' },
          },
        },
        {
          id: 'text-marquee',
          kind: 'text',
          rect: { x: 100, y: 320, width: 520, height: 56 },
          style: createDefaultCanvasNodeStyle(),
          zIndex: 1,
          rotation: 0,
          locked: false,
          visible: true,
          content: {
            ...baseTextContent,
            text: 'Moving announcement',
            marquee: { enabled: true, speed: 18, direction: 'left' },
          },
        },
        {
          id: 'text-path',
          kind: 'text',
          rect: { x: 100, y: 420, width: 520, height: 120 },
          style: createDefaultCanvasNodeStyle(),
          zIndex: 2,
          rotation: 0,
          locked: false,
          visible: true,
          content: {
            ...baseTextContent,
            text: 'Text on path',
            textPath: { enabled: true, curve: 'wave', baseline: 58 },
          },
        },
      ],
    }, 'ko');

    expect(normalized.nodes).toHaveLength(3);
    expect(normalized.nodes[0]?.kind).toBe('text');
    if (normalized.nodes[0]?.kind === 'text') {
      expect(normalized.nodes[0].content.columns).toBe(3);
      expect(normalized.nodes[0].content.columnGap).toBe(32);
      expect(normalized.nodes[0].content.quoteStyle).toBe('pull');
      expect(normalized.nodes[0].content.link?.href).toBe('/ko/contact');
    }
    if (normalized.nodes[1]?.kind === 'text') {
      expect(normalized.nodes[1].content.marquee).toMatchObject({
        enabled: true,
        speed: 18,
        direction: 'left',
      });
    }
    if (normalized.nodes[2]?.kind === 'text') {
      expect(normalized.nodes[2].content.textPath).toMatchObject({
        enabled: true,
        curve: 'wave',
        baseline: 58,
      });
    }
  });
});
