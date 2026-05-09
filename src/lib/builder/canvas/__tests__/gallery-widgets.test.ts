import { describe, expect, it } from 'vitest';
import {
  createDefaultCanvasNodeStyle,
  normalizeCanvasDocument,
} from '@/lib/builder/canvas/types';

const sampleImages = [
  {
    src: '/images/header-skyline-buildings.webp',
    alt: 'Office',
    caption: '상담 공간',
    tags: ['office', 'featured'],
  },
  {
    src: '/images/blog/001-taiwan-company-establishment-basics/featured-01.jpg',
    alt: 'Service',
    caption: '기업 법무',
    tags: ['service'],
  },
];

describe('M13 gallery widget schema', () => {
  it('preserves gallery layouts, captions, filtering, and playback controls', () => {
    const normalized = normalizeCanvasDocument({
      version: 1,
      locale: 'ko',
      updatedAt: '2026-05-10T00:00:00.000Z',
      updatedBy: 'm13-test',
      stageWidth: 1280,
      stageHeight: 880,
      nodes: [
        {
          id: 'gallery-pro',
          kind: 'gallery',
          rect: { x: 100, y: 100, width: 700, height: 420 },
          style: createDefaultCanvasNodeStyle(),
          zIndex: 0,
          rotation: 0,
          locked: false,
          visible: true,
          content: {
            images: sampleImages,
            layout: 'pro',
            columns: 4,
            gap: 12,
            showCaptions: true,
            captionMode: 'overlay',
            activeFilter: 'featured',
            autoplay: true,
            interval: 3600,
            thumbnailPosition: 'right',
            proStyle: 'mosaic',
          },
        },
      ],
    }, 'ko');

    expect(normalized.nodes).toHaveLength(1);
    const node = normalized.nodes[0];
    expect(node?.kind).toBe('gallery');
    if (node?.kind === 'gallery') {
      expect(node.content.layout).toBe('pro');
      expect(node.content.columns).toBe(4);
      expect(node.content.showCaptions).toBe(true);
      expect(node.content.captionMode).toBe('overlay');
      expect(node.content.activeFilter).toBe('featured');
      expect(node.content.autoplay).toBe(true);
      expect(node.content.interval).toBe(3600);
      expect(node.content.thumbnailPosition).toBe('right');
      expect(node.content.proStyle).toBe('mosaic');
      expect(node.content.images[0]?.caption).toBe('상담 공간');
      expect(node.content.images[0]?.tags).toContain('office');
    }
  });
});
