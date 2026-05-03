import { describe, expect, it } from 'vitest';
import {
  deriveHeuristicAnimation,
  deriveHeuristicHoverStyle,
} from '@/lib/builder/site/heuristic-defaults';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';

function mk(overrides: Record<string, unknown>): BuilderCanvasNode {
  return {
    id: 'n1',
    kind: 'text',
    parentId: null,
    rect: { x: 0, y: 0, width: 200, height: 40 },
    style: createDefaultCanvasNodeStyle(),
    content: {},
    visible: true,
    locked: false,
    rotation: 0,
    zIndex: 0,
    ...overrides,
  } as unknown as BuilderCanvasNode;
}

describe('deriveHeuristicAnimation', () => {
  it('returns user-specified animation as-is (never overrides)', () => {
    const userAnim = {
      entrance: {
        preset: 'fade-in' as const,
        duration: 1000,
        delay: 0,
        easing: 'linear' as const,
        triggerOnce: false,
      },
    };
    const node = mk({ animation: userAnim, content: { className: 'hero-title' } });
    expect(deriveHeuristicAnimation(node)).toBe(userAnim);
  });

  it.each([
    'hero-title',
    'hero-subtitle',
    'hero-eyebrow',
    'section-label',
    'hero-cta',
  ])('hero hint "%s" on text → slide-up entrance', (hint) => {
    const node = mk({ kind: 'text', content: { className: `prefix ${hint} suffix` } });
    const result = deriveHeuristicAnimation(node);
    expect(result?.entrance?.preset).toBe('slide-up');
    expect(result?.entrance?.duration).toBe(520);
    expect(result?.entrance?.triggerOnce).toBe(true);
  });

  it('hero hint on heading kind also matches', () => {
    const node = mk({ kind: 'heading', content: { className: 'hero-title big' } });
    expect(deriveHeuristicAnimation(node)?.entrance?.preset).toBe('slide-up');
  });

  it('text without hero hint → undefined', () => {
    const node = mk({ kind: 'text', content: { className: 'body-md' } });
    expect(deriveHeuristicAnimation(node)).toBeUndefined();
  });

  it('text without className field → undefined (no crash)', () => {
    const node = mk({ kind: 'text', content: {} });
    expect(deriveHeuristicAnimation(node)).toBeUndefined();
  });

  it.each([
    'office-card',
    'services-detail-card',
    'stat-card',
    'split-text',
    'split-image',
    'card-title',
  ])('card-like hint "%s" on container → slide-up 480ms', (hint) => {
    const node = mk({
      kind: 'container',
      content: { className: `wrap ${hint}` },
      rect: { x: 0, y: 0, width: 320, height: 200 },
    });
    const result = deriveHeuristicAnimation(node);
    expect(result?.entrance?.preset).toBe('slide-up');
    expect(result?.entrance?.duration).toBe(480);
  });

  it('container without card-like hint → undefined', () => {
    const node = mk({ kind: 'container', content: { className: 'plain-wrap' } });
    expect(deriveHeuristicAnimation(node)).toBeUndefined();
  });

  it('large image (≥400×240) → fade-in 600ms', () => {
    const node = mk({
      kind: 'image',
      content: { src: '/x.jpg' },
      rect: { x: 0, y: 0, width: 800, height: 480 },
    });
    const result = deriveHeuristicAnimation(node);
    expect(result?.entrance?.preset).toBe('fade-in');
    expect(result?.entrance?.duration).toBe(600);
  });

  it('image just under threshold (399×239) → undefined', () => {
    const node = mk({
      kind: 'image',
      rect: { x: 0, y: 0, width: 399, height: 239 },
    });
    expect(deriveHeuristicAnimation(node)).toBeUndefined();
  });

  it('image exactly at threshold (400×240) → fade-in', () => {
    const node = mk({
      kind: 'image',
      rect: { x: 0, y: 0, width: 400, height: 240 },
    });
    expect(deriveHeuristicAnimation(node)?.entrance?.preset).toBe('fade-in');
  });

  it('button kind → undefined (button uses hover, not entrance)', () => {
    const node = mk({ kind: 'button' });
    expect(deriveHeuristicAnimation(node)).toBeUndefined();
  });

  it('non-string className → undefined (no crash)', () => {
    const node = mk({ kind: 'text', content: { className: 123 as unknown as string } });
    expect(deriveHeuristicAnimation(node)).toBeUndefined();
  });
});

describe('deriveHeuristicHoverStyle', () => {
  it('returns user-specified hoverStyle as-is', () => {
    const userHover = {
      transitionMs: 500,
      translateY: -10,
      shadowBlur: 30,
    };
    const node = mk({ kind: 'button', hoverStyle: userHover as never });
    expect(deriveHeuristicHoverStyle(node)).toBe(userHover);
  });

  it('button kind → translateY -2 + shadow lift', () => {
    const node = mk({ kind: 'button' });
    const result = deriveHeuristicHoverStyle(node);
    expect(result?.translateY).toBe(-2);
    expect(result?.shadowBlur).toBe(18);
    expect(result?.transitionMs).toBe(200);
  });

  it.each(['text', 'heading', 'image', 'container'])(
    'non-button kind "%s" → undefined',
    (kind) => {
      const node = mk({ kind: kind as BuilderCanvasNode['kind'] });
      expect(deriveHeuristicHoverStyle(node)).toBeUndefined();
    },
  );
});
