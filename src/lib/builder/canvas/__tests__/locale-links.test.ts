import { describe, expect, it } from 'vitest';

import {
  createDefaultCanvasNodeStyle,
  normalizeCanvasDocument,
} from '@/lib/builder/canvas/types';

const baseStyle = createDefaultCanvasNodeStyle();

describe('canvas locale link normalization', () => {
  it('rewrites locale-prefixed internal hrefs when applying templates to another locale', () => {
    const normalized = normalizeCanvasDocument({
      version: 1,
      locale: 'ko',
      updatedAt: '2026-05-13T00:00:00.000Z',
      updatedBy: 'locale-link-test',
      stageWidth: 1280,
      stageHeight: 880,
      nodes: [
        {
          id: 'button-ko-contact',
          kind: 'button',
          rect: { x: 100, y: 100, width: 180, height: 48 },
          style: baseStyle,
          zIndex: 0,
          rotation: 0,
          locked: false,
          visible: true,
          content: {
            label: '상담 요청',
            href: '/ko/contact',
            style: 'primary',
            link: { href: '/ko?source=template', target: '_self' },
          },
        },
        {
          id: 'image-hotspot',
          kind: 'image',
          rect: { x: 100, y: 180, width: 320, height: 180 },
          style: baseStyle,
          zIndex: 1,
          rotation: 0,
          locked: false,
          visible: true,
          content: {
            src: '/images/header-skyline-buildings.webp',
            alt: 'office',
            fit: 'cover',
            hotspots: [
              { x: 50, y: 50, label: '문의', href: '/ko/about' },
              { x: 65, y: 55, label: '외부', href: 'https://example.com/ko/about' },
              { x: 70, y: 60, label: '홈 앵커', href: '/ko#top' },
            ],
            link: { href: '#contact', target: '_self' },
          },
        },
      ],
    }, 'zh-hant');

    expect(normalized.locale).toBe('zh-hant');
    const button = normalized.nodes.find((node) => node.id === 'button-ko-contact');
    expect(button?.kind).toBe('button');
    if (button?.kind === 'button') {
      expect(button.content.href).toBe('/zh-hant/contact');
      expect(button.content.link?.href).toBe('/zh-hant?source=template');
    }

    const image = normalized.nodes.find((node) => node.id === 'image-hotspot');
    expect(image?.kind).toBe('image');
    if (image?.kind === 'image') {
      expect(image.content.hotspots?.[0]?.href).toBe('/zh-hant/about');
      expect(image.content.hotspots?.[1]?.href).toBe('https://example.com/ko/about');
      expect(image.content.hotspots?.[2]?.href).toBe('/zh-hant#top');
      expect(image.content.link?.href).toBe('#contact');
    }
  });
});
