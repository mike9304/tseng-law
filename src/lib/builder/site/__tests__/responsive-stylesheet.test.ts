import { describe, expect, it } from 'vitest';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { buildResponsiveStylesheet } from '@/lib/builder/site/responsive-stylesheet';

function node(overrides: Partial<BuilderCanvasNode>): BuilderCanvasNode {
  return {
    id: 'node-1',
    kind: 'text',
    rect: { x: 10, y: 20, width: 300, height: 80 },
    content: { text: 'Hello' },
    style: {},
    zIndex: 1,
    visible: true,
    ...overrides,
  } as BuilderCanvasNode;
}

describe('published responsive stylesheet', () => {
  it('emits tablet and mobile media rules that override inline desktop rects', () => {
    const css = buildResponsiveStylesheet([
      node({
        responsive: {
          tablet: {
            rect: { x: 32, width: 420 },
            fontSize: 28,
          },
          mobile: {
            rect: { x: 16, y: 44, width: 343, height: 120 },
            hidden: true,
          },
        },
      }),
    ]);

    expect(css).toContain('@media (min-width: 768px) and (max-width: 1023px)');
    expect(css).toContain('@media (max-width: 767px)');
    expect(css).toContain('[data-node-id="node-1"]');
    expect(css).toContain('left: 32px !important');
    expect(css).toContain('font-size: 28px !important');
    expect(css).toContain('left: 16px !important');
    expect(css).toContain('top: 44px !important');
    expect(css).toContain('width: 343px !important');
    expect(css).toContain('height: 120px !important');
    expect(css).toContain('display: none !important');
  });

  it('recomputes flow composite gaps when mobile y or height changes', () => {
    const css = buildResponsiveStylesheet([
      node({
        id: 'section-a',
        kind: 'composite',
        rect: { x: 0, y: 0, width: 1280, height: 400 },
        responsive: { mobile: { rect: { y: 0, height: 220 } } },
      }),
      node({
        id: 'section-b',
        kind: 'composite',
        rect: { x: 0, y: 420, width: 1280, height: 320 },
        responsive: { mobile: { rect: { y: 244, height: 300 } } },
      }),
    ]);

    expect(css).toContain('[data-node-id="section-a"] { margin-top: 0px !important; }');
    expect(css).toContain('[data-node-id="section-b"] { margin-top: 24px !important; }');
  });
});
