import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import ImageElement from '@/components/builder/canvas/elements/ImageElement';
import {
  builderCanvasNodeSchema,
  type BuilderImageCanvasNode,
} from '@/lib/builder/canvas/types';

const heavyImageSrc = '/images/002-withdraw-capital-taiwan-company/featured-01.png';

function createImageNode(content: Partial<BuilderImageCanvasNode['content']> = {}): BuilderImageCanvasNode {
  const node = builderCanvasNodeSchema.parse({
    id: 'image-1',
    kind: 'image',
    rect: { x: 0, y: 0, width: 320, height: 180 },
    zIndex: 1,
    content: {
      src: '/images/placeholder-image.svg',
      alt: '',
      fit: 'cover',
      cropAspect: '',
      clickAction: 'none',
      hoverSrc: undefined,
      hotspots: undefined,
      compare: undefined,
      svg: undefined,
      gif: undefined,
      filters: undefined,
      link: undefined,
      ...content,
    },
  });
  if (node.kind !== 'image') throw new Error('Expected image node fixture.');
  return node;
}

function getMediaFrameStyle(html: string): string {
  const match = html.match(/class="builder-image-media-frame"[^>]*style="([^"]*)"/);
  if (!match?.[1]) throw new Error('builder-image-media-frame style missing');
  return match[1];
}

describe('image published fallback rendering', () => {
  test('renders optimized image without raw background fallback in published non-hero nodes', () => {
    const html = renderToStaticMarkup(
      React.createElement(ImageElement, {
        node: createImageNode({
          src: heavyImageSrc,
          alt: 'Capital withdrawal illustration',
        }),
        mode: 'published',
      }),
    );
    const frameStyle = getMediaFrameStyle(html);

    expect(html).toContain('<img');
    expect(frameStyle).not.toMatch(/background-image\s*:\s*url/i);
    expect(frameStyle).not.toContain(heavyImageSrc);
  });

  test.each(['edit', 'preview'] as const)('keeps raw background fallback in %s mode non-hero nodes', (mode) => {
    const html = renderToStaticMarkup(
      React.createElement(ImageElement, {
        node: createImageNode({
          src: heavyImageSrc,
          alt: 'Capital withdrawal illustration',
        }),
        mode,
      }),
    );
    const frameStyle = getMediaFrameStyle(html);

    expect(frameStyle).toMatch(/background-image\s*:\s*url/i);
    expect(frameStyle).toContain(heavyImageSrc);
  });

  test('keeps raw background fallback in published hero image nodes', () => {
    const heroNode: BuilderImageCanvasNode = {
      ...createImageNode({
        src: heavyImageSrc,
        alt: 'Home hero media',
      }),
      id: 'home-hero-media-image',
    };
    const html = renderToStaticMarkup(
      React.createElement(ImageElement, {
        node: heroNode,
        mode: 'published',
      }),
    );
    const frameStyle = getMediaFrameStyle(html);

    expect(frameStyle).toMatch(/background-image\s*:\s*url/i);
    expect(frameStyle).toContain(heavyImageSrc);
  });
});
