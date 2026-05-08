import { describe, expect, it } from 'vitest';
import {
  buildPublishedSurfaceFrame,
  publishedThemePrimaryColor,
} from '@/lib/builder/site/published-node-frame';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';

function mk(overrides: Record<string, unknown>): BuilderCanvasNode {
  return {
    id: 'node-x',
    kind: 'container',
    parentId: undefined,
    rect: { x: 0, y: 0, width: 200, height: 100 },
    style: createDefaultCanvasNodeStyle(),
    content: {},
    visible: true,
    locked: false,
    rotation: 0,
    zIndex: 0,
    ...overrides,
  } as unknown as BuilderCanvasNode;
}

describe('buildPublishedSurfaceFrame', () => {
  it('returns "builder-pub-node" className for any node', () => {
    const frame = buildPublishedSurfaceFrame(mk({ kind: 'text' }));
    expect(frame.className).toBe('builder-pub-node');
  });

  it('attrs include data-node-id', () => {
    const frame = buildPublishedSurfaceFrame(mk({ id: 'unique-id-42' }));
    expect(frame.attrs['data-node-id']).toBe('unique-id-42');
  });

  it('button kind → data-builder-hover="true" (heuristic hover applied)', () => {
    const frame = buildPublishedSurfaceFrame(mk({ kind: 'button' }));
    expect(frame.attrs['data-builder-hover']).toBe('true');
    expect(frame.hoverStyle).toBeDefined();
  });

  it('non-button kind without hoverStyle → data-builder-hover absent', () => {
    const frame = buildPublishedSurfaceFrame(mk({ kind: 'text' }));
    expect(frame.attrs['data-builder-hover']).toBeUndefined();
    expect(frame.hoverStyle).toBeUndefined();
  });

  it('hero-title text → data-anim-entrance="slide-up" (heuristic entrance)', () => {
    const frame = buildPublishedSurfaceFrame(
      mk({ kind: 'text', content: { className: 'hero-title' } }),
    );
    expect(frame.attrs['data-anim-entrance']).toBe('slide-up');
    expect(frame.effectiveAnimation?.entrance?.preset).toBe('slide-up');
  });

  it('plain text → no entrance attr (no heuristic match)', () => {
    const frame = buildPublishedSurfaceFrame(
      mk({ kind: 'text', content: { className: 'body-md' } }),
    );
    expect(frame.attrs['data-anim-entrance']).toBeUndefined();
    expect(frame.effectiveAnimation).toBeUndefined();
  });

  it('anchor name → data-anchor attr', () => {
    const frame = buildPublishedSurfaceFrame(mk({ anchorName: 'contact-section' }));
    expect(frame.attrs['data-anchor']).toBe('contact-section');
  });

  it('stateful home section roots expose template and variant attrs', () => {
    const frame = buildPublishedSurfaceFrame(
      mk({
        id: 'home-faq-root',
        kind: 'container',
        content: { variant: 'glass' },
      }),
    );
    expect(frame.attrs['data-builder-section-template']).toBe('faq');
    expect(frame.attrs['data-section-variant']).toBe('glass');
  });

  it('no anchor name → no data-anchor', () => {
    const frame = buildPublishedSurfaceFrame(mk({ anchorName: undefined }));
    expect(frame.attrs['data-anchor']).toBeUndefined();
  });

  it('user-specified node.animation overrides heuristic', () => {
    const userAnim = {
      entrance: {
        preset: 'zoom-in' as const,
        duration: 1500,
        delay: 0,
        easing: 'ease-in-out' as const,
        triggerOnce: false,
      },
    };
    const frame = buildPublishedSurfaceFrame(
      mk({ kind: 'text', content: { className: 'hero-title' }, animation: userAnim }),
    );
    expect(frame.effectiveAnimation).toBe(userAnim);
    expect(frame.attrs['data-anim-entrance']).toBe('zoom-in');
  });

  it('node without entrance/scroll/hover → empty style (caller applies inline transform)', () => {
    // buildPublishedAnimationStyle returns {} when there's no animation.
    // Surface positioning (rotation, opacity, etc.) is handled by the caller's
    // inline `style={...}` rather than by this helper.
    const frame = buildPublishedSurfaceFrame(mk({ rotation: 15 }));
    expect(frame.style).toEqual({});
  });

  it('hero-title (heuristic entrance) produces rotation/opacity-aware CSS vars', () => {
    const node = mk({
      kind: 'text',
      content: { className: 'hero-title' },
      rotation: 15,
      style: { ...createDefaultCanvasNodeStyle(), opacity: 50 },
    });
    const frame = buildPublishedSurfaceFrame(node);
    const styleJson = JSON.stringify(frame.style);
    // base transform & opacity show up only when an animation is being plumbed.
    expect(styleJson).toMatch(/rotate\(15deg\)/);
    expect(styleJson).toMatch(/0\.5/);
  });

  it('respects custom primaryColor option', () => {
    const node = mk({ kind: 'text', content: { className: 'hero-title' } });
    const frame = buildPublishedSurfaceFrame(node, { primaryColor: '#ff0000' });
    expect(JSON.stringify(frame.style)).toContain('#ff0000');
  });
});

describe('publishedThemePrimaryColor', () => {
  it('returns CSS var fallback chain (theme arg currently consumed via CSS vars)', () => {
    expect(publishedThemePrimaryColor()).toContain('--builder-color-primary');
  });

  it('always returns the same fallback regardless of theme arg', () => {
    const a = publishedThemePrimaryColor();
    const b = publishedThemePrimaryColor({ /* fake */ } as unknown as never);
    expect(b).toBe(a);
  });
});
