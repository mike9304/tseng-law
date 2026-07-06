import { describe, expect, it } from 'vitest';
import { buildColumnsPageCanvas } from '../seed-pages';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '../types';

type Viewport = 'mobile' | 'tablet';

function nodesById(doc: BuilderCanvasDocument): Map<string, BuilderCanvasNode> {
  return new Map(doc.nodes.map((node) => [node.id, node]));
}

function requireNode(doc: BuilderCanvasDocument, id: string): BuilderCanvasNode {
  const node = nodesById(doc).get(id);
  if (!node) {
    throw new Error(`missing node ${id}`);
  }
  return node;
}

function rect(node: BuilderCanvasNode, viewport: Viewport): BuilderCanvasNode['rect'] {
  return {
    ...node.rect,
    ...(node.responsive?.[viewport]?.rect ?? {}),
  };
}

describe('columns page responsive decomposition', () => {
  it('uses the live fallback columns composite instead of a divergent blog-feed layout', () => {
    const doc = buildColumnsPageCanvas('ko');

    expect(doc.stageHeight).toBe(2660);

    const root = requireNode(doc, 'columns-page-root');
    const composite = requireNode(doc, 'columns-page-root-composite');
    expect(root.rect).toMatchObject({ x: 0, y: 0, width: 1280, height: 2660 });
    expect(composite.kind).toBe('composite');
    expect(composite.parentId).toBe('columns-page-root');
    expect(composite.rect).toMatchObject({ x: 0, y: 0, width: 1280, height: 2660 });
    expect(composite.content).toMatchObject({ componentKey: 'legacy-page-columns' });
    expect(doc.nodes.some((node) => node.kind === 'blog-feed')).toBe(false);
  });

  it('lets the live columns component determine mobile height naturally', () => {
    const doc = buildColumnsPageCanvas('ko');

    const root = requireNode(doc, 'columns-page-root');
    const composite = requireNode(doc, 'columns-page-root-composite');

    expect(root.responsive).toBeUndefined();
    expect(composite.responsive).toBeUndefined();
    expect(rect(root, 'mobile')).toEqual(root.rect);
    expect(rect(composite, 'tablet')).toEqual(composite.rect);
  });

  it('does not seed the old custom columns hero or feed section', () => {
    const doc = buildColumnsPageCanvas('ko');

    expect(doc.nodes.some((node) => node.id === 'columns-hero')).toBe(false);
    expect(doc.nodes.some((node) => node.id === 'columns-feed-section')).toBe(false);
    expect(doc.nodes).toHaveLength(2);
  });
});
