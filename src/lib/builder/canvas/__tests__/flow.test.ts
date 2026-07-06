import { describe, expect, it } from 'vitest';
import type { BuilderCanvasNode } from '../types';
import {
  compareTopLevelStacking,
  computeNewZIndexOrderForFlowSiblings,
  computeFlowSiblingMetrics,
  computeReorderedFlowSiblingRects,
  computeResizedFlowSiblingRects,
  computeTopLevelFlowSectionMetrics,
  computeTopLevelFlowSectionMetricsFromIndex,
  getFlowSiblingInsertionIndex,
  getFlowSiblingOriginalIndex,
} from '../flow';
import { buildChildrenMap } from '../tree';

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
  it('computes a single flow sibling metric without needing sort work', () => {
    const onlyChild = node({
      id: 'only-child',
      rect: { x: 0, y: 24, width: 300, height: 140 },
      responsive: {
        mobile: {
          rect: { y: 32, height: 120 },
        },
      },
    });

    expect(computeFlowSiblingMetrics([onlyChild]).get('only-child')).toEqual({
      marginTop: 24,
      minHeight: 140,
    });
    expect(computeFlowSiblingMetrics([onlyChild], 'mobile').get('only-child')).toEqual({
      marginTop: 32,
      minHeight: 120,
    });
  });

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

  it('does not let the hidden home hero quick menu inflate the published hero section height', () => {
    const hero = node({
      id: 'home-hero-root',
      kind: 'container',
      content: { as: 'section' },
      rect: { x: 0, y: 0, width: 1280, height: 820 },
    });
    const searchWrapper = node({
      id: 'home-hero-search-wrapper',
      parentId: 'home-hero-root',
      kind: 'container',
      rect: { x: 0, y: 758, width: 1280, height: 62 },
    });
    const searchContainer = node({
      id: 'home-hero-search-container',
      parentId: 'home-hero-search-wrapper',
      kind: 'container',
      rect: { x: 0, y: 0, width: 1151, height: 62 },
    });
    const searchWrap = node({
      id: 'home-hero-search-wrap',
      parentId: 'home-hero-search-container',
      kind: 'container',
      rect: { x: 0, y: 0, width: 760, height: 62 },
    });
    const quickMenu = node({
      id: 'home-hero-quick-menu',
      parentId: 'home-hero-search-wrap',
      kind: 'container',
      rect: { x: 0, y: 70, width: 760, height: 318 },
    });
    const quickMenuItem = node({
      id: 'home-hero-quick-menu-item-0',
      parentId: 'home-hero-quick-menu',
      kind: 'button',
      rect: { x: 0, y: 0, width: 760, height: 53 },
    });

    const metrics = computeTopLevelFlowSectionMetrics([
      hero,
      searchWrapper,
      searchContainer,
      searchWrap,
      quickMenu,
      quickMenuItem,
    ]);

    expect(metrics.get('home-hero-root')?.minHeight).toBe(820);
  });

  it('does not let the mobile-hidden home hero scroll arrow inflate the hero section height', () => {
    const hero = node({
      id: 'home-hero-root',
      kind: 'container',
      content: { as: 'section' },
      rect: { x: 0, y: 0, width: 1280, height: 834 },
      responsive: {
        mobile: {
          rect: { x: 16, y: 0, width: 343, height: 680 },
        },
      },
    });
    const scrollArrow = node({
      id: 'home-hero-scroll-arrow',
      parentId: 'home-hero-root',
      kind: 'button',
      rect: { x: 1216, y: 746, width: 48, height: 48 },
      responsive: {
        mobile: {
          rect: { x: 20, y: 1004, width: 335, height: 48 },
        },
      },
    });

    const metrics = computeTopLevelFlowSectionMetrics([hero, scrollArrow], 'mobile');

    expect(metrics.get('home-hero-root')?.minHeight).toBe(680);
  });

  it('sizes multiple top-level flow sections with one shared descendant index', () => {
    const firstSection = node({
      id: 'section-a',
      kind: 'container',
      content: { as: 'section' },
      rect: { x: 0, y: 0, width: 1280, height: 360 },
    });
    const firstGroup = node({
      id: 'section-a-group',
      parentId: 'section-a',
      kind: 'container',
      rect: { x: 40, y: 300, width: 400, height: 80 },
    });
    const firstNested = node({
      id: 'section-a-nested',
      parentId: 'section-a-group',
      rect: { x: 20, y: 92, width: 220, height: 54 },
    });
    const secondSection = node({
      id: 'section-b',
      kind: 'container',
      content: { as: 'section' },
      rect: { x: 0, y: 430, width: 1280, height: 300 },
    });
    const secondNested = node({
      id: 'section-b-nested',
      parentId: 'section-b',
      rect: { x: 24, y: 280, width: 260, height: 70 },
    });

    const metrics = computeTopLevelFlowSectionMetrics([
      firstSection,
      firstGroup,
      firstNested,
      secondSection,
      secondNested,
    ]);

    expect(metrics.get('section-a')?.minHeight).toBe(446);
    expect(metrics.get('section-b')?.minHeight).toBe(350);
    expect(metrics.get('section-b')?.marginTop).toBe(0);
  });

  it('can reuse caller-owned node and child indexes for top-level flow section metrics', () => {
    const section = node({
      id: 'section-a',
      kind: 'container',
      content: { as: 'section' },
      rect: { x: 0, y: 0, width: 1280, height: 360 },
    });
    const hiddenGroup = node({
      id: 'hidden-group',
      parentId: 'section-a',
      kind: 'container',
      visible: false,
      rect: { x: 0, y: 320, width: 300, height: 80 },
    });
    const visibleNested = node({
      id: 'visible-nested',
      parentId: 'hidden-group',
      rect: { x: 0, y: 92, width: 240, height: 54 },
    });
    const nodes = [section, hiddenGroup, visibleNested];
    const indexedMetrics = computeTopLevelFlowSectionMetricsFromIndex({
      childrenMap: buildChildrenMap(nodes),
      nodes,
      nodesById: nodesById(nodes),
    });

    expect(indexedMetrics).toEqual(computeTopLevelFlowSectionMetrics(nodes));
    expect(indexedMetrics.get('section-a')?.minHeight).toBe(466);
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

  it('emits flow sections first so a widget dropped between two sections paints on top of both', () => {
    const hero = node({
      id: 'hero',
      kind: 'composite',
      rect: { x: 0, y: 0, width: 1280, height: 600 },
    });
    const floatingWidget = node({
      id: 'floating-search',
      kind: 'container',
      rect: { x: 0, y: 640, width: 1280, height: 60 },
      zIndex: 0,
    });
    const nextSection = node({
      id: 'practice',
      kind: 'composite',
      rect: { x: 0, y: 720, width: 1280, height: 400 },
    });

    // Input deliberately interleaves the widget between the two sections.
    const ordered = [hero, floatingWidget, nextSection].sort(compareTopLevelStacking);

    expect(ordered.map((entry) => entry.id)).toEqual(['hero', 'practice', 'floating-search']);
  });

  it('keeps document-flow order for decomposed container sections and tie-breaks widgets by zIndex', () => {
    const sectionA = node({
      id: 'section-a',
      kind: 'container',
      content: { as: 'section' },
      rect: { x: 0, y: 0, width: 1280, height: 300 },
      zIndex: 5,
    });
    const sectionB = node({
      id: 'section-b',
      kind: 'container',
      content: { as: 'section' },
      rect: { x: 0, y: 320, width: 1280, height: 300 },
      zIndex: 1,
    });
    const widgetHigh = node({
      id: 'widget-high',
      kind: 'container',
      rect: { x: 0, y: 40, width: 200, height: 40 },
      zIndex: 9,
    });
    const widgetLow = node({
      id: 'widget-low',
      kind: 'container',
      rect: { x: 0, y: 40, width: 200, height: 40 },
      zIndex: 2,
    });

    const ordered = [sectionB, widgetHigh, sectionA, widgetLow].sort(compareTopLevelStacking);

    expect(ordered.map((entry) => entry.id)).toEqual(['section-a', 'section-b', 'widget-low', 'widget-high']);
  });

  it('treats a composite with a parentId as a non-flow widget so it cannot jump ahead of a real top-level section', () => {
    const childComposite = node({
      id: 'nested-composite',
      parentId: 'some-parent',
      kind: 'composite',
      rect: { x: 0, y: 0, width: 100, height: 100 },
    });
    const topSection = node({
      id: 'top',
      kind: 'composite',
      rect: { x: 0, y: 0, width: 1280, height: 100 },
    });

    const ordered = [childComposite, topSection].sort(compareTopLevelStacking);

    expect(ordered.map((entry) => entry.id)).toEqual(['top', 'nested-composite']);
  });
});
