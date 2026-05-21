import { describe, expect, it } from 'vitest';
import type { BuilderCanvasNode } from '../types';
import {
  computeNewZIndexOrderForFlowSiblings,
  computeReorderedFlowSiblingRects,
  computeResizedFlowSiblingRects,
  computeTopLevelFlowSectionMetrics,
  getFlowSiblingInsertionIndex,
  getFlowSiblingOriginalIndex,
} from '../flow';

type TestNodeOverrides = Partial<Omit<BuilderCanvasNode, 'content'>> & {
  content?: Record<string, unknown>;
};

function node(overrides: TestNodeOverrides): BuilderCanvasNode {
  return {
    id: 'node',
    kind: 'text',
    rect: { x: 0, y: 0, width: 300, height: 100 },
    content: { text: 'Node' },
    style: {},
    zIndex: 0,
    visible: true,
    ...overrides,
  } as BuilderCanvasNode;
}

function nodesById(nodes: BuilderCanvasNode[]): Map<string, BuilderCanvasNode> {
  return new Map(nodes.map((item) => [item.id, item]));
}

describe('builder canvas flow helpers', () => {
  it('sizes top-level flow sections around overflowing descendants', () => {
    const firstSection = node({
      id: 'section-a',
      kind: 'container',
      content: { as: 'section' },
      rect: { x: 0, y: 0, width: 1280, height: 420 },
    });
    const overflowingCta = node({
      id: 'section-a-cta',
      parentId: 'section-a',
      kind: 'button',
      rect: { x: 960, y: 390, width: 180, height: 72 },
    });
    const secondSection = node({
      id: 'section-b',
      kind: 'container',
      content: { as: 'section' },
      rect: { x: 0, y: 440, width: 1280, height: 320 },
    });

    const metrics = computeTopLevelFlowSectionMetrics([firstSection, overflowingCta, secondSection]);

    expect(metrics.get('section-a')?.minHeight).toBe(462);
    expect(metrics.get('section-b')?.marginTop).toBe(0);
  });

  it('uses responsive viewport rects when reordering children inside flex containers', () => {
    const container = node({
      id: 'flow-parent',
      kind: 'container',
      content: { layoutMode: 'flex' },
      rect: { x: 0, y: 0, width: 360, height: 520 },
    });
    const first = node({
      id: 'first',
      parentId: 'flow-parent',
      zIndex: 10,
      rect: { x: 0, y: 0, width: 300, height: 100 },
      responsive: { tablet: { rect: { y: 0, height: 100 } } },
    });
    const second = node({
      id: 'second',
      parentId: 'flow-parent',
      zIndex: 20,
      rect: { x: 0, y: 200, width: 300, height: 100 },
      responsive: { tablet: { rect: { y: 120, height: 100 } } },
    });
    const dragged = node({
      id: 'dragged',
      parentId: 'flow-parent',
      zIndex: 30,
      rect: { x: 0, y: 400, width: 300, height: 100 },
      responsive: { tablet: { rect: { y: 40, height: 100 } } },
    });
    const nodes = [container, first, second, dragged];
    const lookup = nodesById(nodes);
    const startRects = {
      dragged: { x: 0, y: 240, width: 300, height: 100 },
    };

    expect(getFlowSiblingInsertionIndex(nodes, 'dragged', lookup, 'tablet')).toBe(1);
    expect(getFlowSiblingOriginalIndex(nodes, 'dragged', lookup, startRects, 'tablet')).toBe(2);

    const rects = computeReorderedFlowSiblingRects(nodes, 'dragged', 1, lookup, startRects, 'tablet');
    expect(rects.get('first')?.y).toBe(0);
    expect(rects.get('dragged')?.y).toBe(120);
    expect(rects.get('second')?.y).toBe(240);

    const zOrder = computeNewZIndexOrderForFlowSiblings(nodes, 'dragged', 1, lookup, startRects, 'tablet');
    expect(zOrder.get('first')).toBe(10);
    expect(zOrder.get('dragged')).toBe(20);
    expect(zOrder.get('second')).toBe(30);
  });

  it('keeps resized responsive flow items and pushes following siblings down', () => {
    const container = node({
      id: 'flow-parent',
      kind: 'container',
      content: { layoutMode: 'grid' },
    });
    const first = node({
      id: 'first',
      parentId: 'flow-parent',
      zIndex: 10,
      responsive: { tablet: { rect: { y: 0, height: 100 } } },
    });
    const resized = node({
      id: 'resized',
      parentId: 'flow-parent',
      zIndex: 20,
      responsive: { tablet: { rect: { y: 120, height: 180 } } },
    });
    const after = node({
      id: 'after',
      parentId: 'flow-parent',
      zIndex: 30,
      responsive: { tablet: { rect: { y: 240, height: 100 } } },
    });
    const nodes = [container, first, resized, after];
    const rects = computeResizedFlowSiblingRects(
      nodes,
      'resized',
      nodesById(nodes),
      { x: 0, y: 120, width: 300, height: 100 },
      { x: 0, y: 120, width: 300, height: 180 },
      'tablet',
    );

    expect(rects.get('resized')).toEqual({ x: 0, y: 120, width: 300, height: 180 });
    expect(rects.get('after')?.y).toBe(320);
    expect(rects.has('first')).toBe(false);
  });
});
