import { describe, expect, it } from 'vitest';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { buildPublishedResponsiveStylesheet } from '@/lib/builder/site/responsive-stylesheet';

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

describe('published responsive auto-fit', () => {
  it('derives mobile rules for published desktop-only authored nodes', () => {
    const css = buildPublishedResponsiveStylesheet([
      node({
        id: 'section-a',
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 400 },
        content: { as: 'section', label: 'Section A' },
      }),
      node({
        id: 'wide-cta',
        kind: 'button',
        parentId: 'section-a',
        rect: { x: 80, y: 60, width: 900, height: 64 },
        content: { label: 'Wide CTA', href: '#contact' },
      }),
    ]);

    expect(css).toContain('@media (max-width: 767px)');
    expect(css).toContain('[data-node-id="section-a"] { width: 375px !important; min-height: 117px !important; }');
    expect(css).toContain('[data-node-id="wide-cta"] { position: absolute !important; left: 23px !important; top: 18px !important; width: 264px !important; height: 19px !important; }');
  });

  it('derives tablet rules for published desktop-only authored nodes', () => {
    const css = buildPublishedResponsiveStylesheet([
      node({
        id: 'section-a',
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 400 },
        content: { as: 'section', label: 'Section A' },
      }),
      node({
        id: 'wide-cta',
        kind: 'button',
        parentId: 'section-a',
        rect: { x: 80, y: 60, width: 900, height: 64 },
        content: { label: 'Wide CTA', href: '#contact' },
      }),
    ]);

    expect(css).toContain('@media (min-width: 768px) and (max-width: 1023px)');
    expect(css).toContain('[data-node-id="section-a"] { width: 768px !important; min-height: 240px !important; }');
    expect(css).toContain('[data-node-id="wide-cta"] { position: absolute !important; left: 48px !important; top: 36px !important; width: 540px !important; height: 38px !important; }');
  });

  it('keeps standalone top-level absolute widgets from stretching full-width when published', () => {
    const css = buildPublishedResponsiveStylesheet([
      node({
        id: 'section-a',
        kind: 'composite',
        rect: { x: 0, y: 0, width: 1280, height: 400 },
      }),
      node({
        id: 'floating-button',
        kind: 'button',
        rect: { x: 1180, y: 760, width: 64, height: 64 },
        content: { label: 'Top', href: '#top' },
      }),
    ]);

    expect(css).toContain('[data-node-id="floating-button"] { position: absolute !important; left: 704px !important; top: 456px !important; width: 64px !important; height: 64px !important; }');
    expect(css).toContain('[data-node-id="floating-button"] { position: absolute !important; left: 311px !important; top: 223px !important; width: 64px !important; height: 64px !important; }');
    expect(css).not.toContain('width: 768px !important; height: 64px !important');
    expect(css).not.toContain('width: 375px !important; height: 64px !important');
  });

  it('preserves explicit published mobile overrides while deriving missing ones', () => {
    const css = buildPublishedResponsiveStylesheet([
      node({
        id: 'text-with-mobile',
        content: { text: 'Already tuned', fontSize: 40 },
        responsive: {
          mobile: {
            rect: { x: 7, y: 11, width: 333, height: 44 },
            fontSize: 24,
          },
        },
      }),
    ]);

    expect(css).toContain('[data-node-id="text-with-mobile"]');
    expect(css).toContain('left: 7px !important');
    expect(css).toContain('top: 11px !important');
    expect(css).toContain('width: 333px !important');
    expect(css).toContain('height: 44px !important');
    expect(css).toContain('font-size: 24px !important');
    expect(css).not.toContain('font-size: 12px !important');
  });

  it('preserves explicit published tablet overrides while deriving missing tablet fields', () => {
    const css = buildPublishedResponsiveStylesheet([
      node({
        id: 'section-a',
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 400 },
        content: { as: 'section', label: 'Section A' },
      }),
      node({
        id: 'text-with-tablet',
        parentId: 'section-a',
        content: { text: 'Tablet tuned', fontSize: 40 },
        rect: { x: 80, y: 60, width: 900, height: 80 },
        responsive: {
          tablet: {
            rect: { x: 10, y: 11, width: 500, height: 55 },
          },
        },
      }),
    ]);

    expect(css).toContain('[data-node-id="text-with-tablet"]');
    expect(css).toContain('left: 10px !important');
    expect(css).toContain('top: 11px !important');
    expect(css).toContain('width: 500px !important');
    expect(css).toContain('height: 55px !important');
    expect(css).toContain('font-size: 24px !important');
  });

  it('derives published tablet rules when only mobile overrides already exist', () => {
    const css = buildPublishedResponsiveStylesheet([
      node({
        id: 'section-a',
        kind: 'container',
        rect: { x: 0, y: 0, width: 1280, height: 400 },
        content: { as: 'section', label: 'Section A' },
      }),
      node({
        id: 'wide-cta',
        kind: 'button',
        parentId: 'section-a',
        rect: { x: 80, y: 60, width: 900, height: 64 },
        content: { label: 'Wide CTA', href: '#contact' },
        responsive: {
          mobile: {
            rect: { x: 7, y: 9, width: 333, height: 44 },
          },
        },
      }),
    ]);

    expect(css).toContain('[data-node-id="wide-cta"] { position: absolute !important; left: 48px !important; top: 36px !important; width: 540px !important; height: 38px !important; }');
    expect(css).toContain('[data-node-id="wide-cta"] { position: absolute !important; left: 7px !important; top: 9px !important; width: 333px !important; height: 44px !important; }');
  });
});
