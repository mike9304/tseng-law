import { describe, expect, it } from 'vitest';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { buildResponsiveStylesheet } from '@/lib/builder/site/responsive-stylesheet';

type TestNodeOverrides = Partial<Omit<BuilderCanvasNode, 'content'>> & {
  content?: Record<string, unknown>;
};

function node(overrides: TestNodeOverrides): BuilderCanvasNode {
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
    expect(css).toContain('position: absolute !important');
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

    expect(css).toContain('.builder-pub-node[data-node-id="section-a"] { margin-top: 0px !important; min-height: 220px !important; }');
    expect(css).toContain('.builder-pub-node[data-node-id="section-b"] { margin-top: 24px !important; min-height: 300px !important; }');
  });

  it('excludes viewport-hidden flow sections from mobile gap calculations', () => {
    const css = buildResponsiveStylesheet([
      node({
        id: 'section-a',
        kind: 'composite',
        rect: { x: 0, y: 0, width: 1280, height: 240 },
        responsive: { mobile: { rect: { y: 0, height: 120 } } },
      }),
      node({
        id: 'section-hidden',
        kind: 'composite',
        rect: { x: 0, y: 260, width: 1280, height: 400 },
        responsive: { mobile: { rect: { y: 140, height: 300 }, hidden: true } },
      }),
      node({
        id: 'section-b',
        kind: 'composite',
        rect: { x: 0, y: 680, width: 1280, height: 300 },
        responsive: { mobile: { rect: { y: 164, height: 180 } } },
      }),
    ]);

    expect(css).toContain('.builder-pub-node[data-node-id="section-hidden"] { min-height: 300px !important; display: none !important; }');
    expect(css).toContain('.builder-pub-node[data-node-id="section-b"] { margin-top: 44px !important; min-height: 180px !important; }');
    expect(css).not.toContain('.builder-pub-node[data-node-id="section-b"] { margin-top: 0px !important; min-height: 180px !important; }');
  });

  it('uses flow gaps instead of left/top offsets for responsive flex children', () => {
    const css = buildResponsiveStylesheet([
      node({
        id: 'flow-parent',
        kind: 'container',
        content: { layoutMode: 'flex' },
        rect: { x: 0, y: 0, width: 640, height: 420 },
      }),
      node({
        id: 'flow-a',
        parentId: 'flow-parent',
        zIndex: 1,
        responsive: { mobile: { rect: { x: 50, y: 80, width: 220, height: 120 } } },
      }),
      node({
        id: 'flow-b',
        parentId: 'flow-parent',
        zIndex: 2,
        responsive: { mobile: { rect: { y: 230, height: 90 } } },
      }),
    ]);

    const flowARules = css.split('\n').filter((line) => line.includes('[data-node-id="flow-a"]'));
    expect(flowARules.some((line) => line.includes('position: absolute'))).toBe(false);
    expect(flowARules.some((line) => line.includes('left:'))).toBe(false);
    expect(flowARules.some((line) => line.includes('top:') && !line.includes('margin-top'))).toBe(false);
    expect(flowARules.some((line) => line.includes('width: 220px !important'))).toBe(true);
    expect(flowARules.some((line) => line.includes('height: 120px !important'))).toBe(true);
    expect(flowARules.some((line) => line.includes('margin-top: 80px !important'))).toBe(true);
    expect(css).toContain('.builder-pub-node[data-node-id="flow-b"] { margin-top: 30px !important; }');
  });

  it('keeps a top-level page root in flow when responsive height reserves footer space', () => {
    const css = buildResponsiveStylesheet([
      node({
        id: 'columns-page-root',
        kind: 'container',
        content: { as: 'main', layoutMode: 'absolute' },
        rect: { x: 0, y: 0, width: 1280, height: 2660 },
        responsive: {
          tablet: { rect: { x: 0, y: 0, width: 768, height: 3610 } },
          mobile: { rect: { x: 0, y: 0, width: 375, height: 6408 } },
        },
      }),
    ]);

    const rootRules = css.split('\n').filter((line) => line.includes('[data-node-id="columns-page-root"]'));
    expect(rootRules.some((line) => line.includes('position: relative !important'))).toBe(true);
    expect(rootRules.some((line) => line.includes('position: absolute'))).toBe(false);
    expect(rootRules.some((line) => line.includes('left:'))).toBe(false);
    expect(rootRules.some((line) => line.includes('top:'))).toBe(false);
    expect(rootRules.some((line) => line.includes('height: 6408px !important'))).toBe(true);
  });

});
