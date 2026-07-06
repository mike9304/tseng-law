import { describe, expect, it } from 'vitest';
import {
  getInnerFlowLayoutState,
  getInnerFlowPreviewGapInfo,
  getTopLevelFlowPreviewGapInfo,
  getVisibleChildrenByParentId,
  getVisibleNodeRelationshipState,
} from '../CanvasStageNodes';
import type { InteractionState } from '../canvasInteraction';
import { createDefaultCanvasNodeStyle, type BuilderCanvasNode } from '@/lib/builder/canvas/types';

function containerNode({
  id,
  layoutMode = 'absolute',
  parentId,
  y,
  zIndex,
}: {
  id: string;
  layoutMode?: 'absolute' | 'flex' | 'grid';
  parentId?: string;
  y: number;
  zIndex: number;
}): BuilderCanvasNode {
  return {
    id,
    kind: 'container',
    parentId,
    rect: { x: 0, y, width: 240, height: 80 },
    style: createDefaultCanvasNodeStyle(),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      label: id,
      background: '#ffffff',
      borderColor: '#e5e7eb',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 0,
      layoutMode,
      padding: 0,
      activeIndex: 0,
      sticky: false,
      variant: 'flat',
    },
  };
}

function moveInteraction(nodeId: string, viewport: 'desktop' | 'tablet' | 'mobile') {
  return {
    type: 'move',
    nodeId,
    nodeIds: [nodeId],
    nodeIdSet: new Set([nodeId]),
    canDirectPreview: true,
    viewport,
    pointerId: 1,
    originX: 0,
    originY: 0,
    startParentId: null,
    startRects: {},
    startAbsoluteRects: {},
    snapBounds: { x: 0, y: 0, width: 1280, height: 1600 },
    snapRects: [],
    snapEdges: [],
    containerHitRects: [],
  } satisfies Extract<NonNullable<InteractionState>, { type: 'move' }>;
}

function sectionNode({
  id,
  y,
  zIndex,
}: {
  id: string;
  y: number;
  zIndex: number;
}): BuilderCanvasNode {
  const base = containerNode({ id, y, zIndex });
  return {
    ...base,
    content: {
      ...base.content,
      as: 'section',
    },
  } as BuilderCanvasNode;
}

describe('canvas stage nodes geometry', () => {
  it('precomputes inner flow sibling metrics per responsive viewport', () => {
    const parent = containerNode({ id: 'parent', layoutMode: 'flex', y: 0, zIndex: 0 });
    const first = containerNode({ id: 'first', parentId: parent.id, y: 12, zIndex: 1 });
    const second = {
      ...containerNode({ id: 'second', parentId: parent.id, y: 128, zIndex: 2 }),
      responsive: {
        mobile: {
          rect: { x: 0, y: 110, width: 240, height: 80 },
        },
      },
    } satisfies BuilderCanvasNode;
    const outside = containerNode({ id: 'outside', y: 16, zIndex: 3 });
    const nodes = [parent, first, second, outside];
    const nodesById = new Map(nodes.map((node) => [node.id, node]));

    const desktopState = getInnerFlowLayoutState({
      nodesById,
      viewport: 'desktop',
      visibleNodes: nodes,
    });
    const mobileState = getInnerFlowLayoutState({
      nodesById,
      viewport: 'mobile',
      visibleNodes: nodes,
    });

    expect(Array.from(desktopState.flowLayoutChildNodeIds)).toEqual(['first', 'second']);
    expect(desktopState.siblingMetrics.size).toBe(0);
    expect(Array.from(mobileState.flowLayoutChildNodeIds)).toEqual(['first', 'second']);
    expect(mobileState.siblingMetrics.get('first')).toEqual({ marginTop: 12, minHeight: 80 });
    expect(mobileState.siblingMetrics.get('second')).toEqual({ marginTop: 18, minHeight: 80 });
    expect(mobileState.siblingMetrics.has('outside')).toBe(false);
  });

  it('groups visible child nodes by parent once for recursive canvas rendering', () => {
    const parent = containerNode({ id: 'parent', y: 0, zIndex: 0 });
    const first = containerNode({ id: 'first', parentId: parent.id, y: 12, zIndex: 1 });
    const second = containerNode({ id: 'second', parentId: parent.id, y: 128, zIndex: 2 });
    const otherParent = containerNode({ id: 'other-parent', y: 260, zIndex: 3 });
    const otherChild = containerNode({ id: 'other-child', parentId: otherParent.id, y: 272, zIndex: 4 });

    const childrenByParent = getVisibleChildrenByParentId([
      parent,
      first,
      second,
      otherParent,
      otherChild,
    ]);

    expect(childrenByParent.get(parent.id)?.map((node) => node.id)).toEqual(['first', 'second']);
    expect(childrenByParent.get(otherParent.id)?.map((node) => node.id)).toEqual(['other-child']);
    expect(childrenByParent.has(first.id)).toBe(false);
  });

  it('derives visible children and inner flow state in one relationship pass', () => {
    const parent = containerNode({ id: 'parent', layoutMode: 'grid', y: 0, zIndex: 0 });
    const first = containerNode({ id: 'first', parentId: parent.id, y: 12, zIndex: 1 });
    const second = {
      ...containerNode({ id: 'second', parentId: parent.id, y: 128, zIndex: 2 }),
      responsive: {
        mobile: {
          rect: { x: 0, y: 110, width: 240, height: 80 },
        },
      },
    } satisfies BuilderCanvasNode;
    const outside = containerNode({ id: 'outside', y: 16, zIndex: 3 });
    const nodes = [parent, first, second, outside];
    const nodesById = new Map(nodes.map((node) => [node.id, node]));

    const state = getVisibleNodeRelationshipState({
      nodesById,
      viewport: 'mobile',
      visibleNodes: nodes,
    });

    expect(state.visibleChildrenByParentId.get(parent.id)?.map((node) => node.id)).toEqual(['first', 'second']);
    expect(Array.from(state.flowLayoutChildNodeIds)).toEqual(['first', 'second']);
    expect(state.siblingMetrics.get('first')).toEqual({ marginTop: 12, minHeight: 80 });
    expect(state.siblingMetrics.get('second')).toEqual({ marginTop: 18, minHeight: 80 });
    expect(state.visibleChildrenByParentId.has(outside.id)).toBe(false);
  });

  it('precomputes the active inner flow preview gap once for the dragged child parent', () => {
    const parent = containerNode({ id: 'parent', layoutMode: 'flex', y: 0, zIndex: 0 });
    const first = containerNode({ id: 'first', parentId: parent.id, y: 12, zIndex: 1 });
    const dragged = {
      ...containerNode({ id: 'dragged', parentId: parent.id, y: 80, zIndex: 2 }),
      responsive: {
        mobile: {
          rect: { x: 0, y: 260, width: 240, height: 80 },
        },
      },
    } satisfies BuilderCanvasNode;
    const second = containerNode({ id: 'second', parentId: parent.id, y: 180, zIndex: 3 });
    const absoluteParent = containerNode({ id: 'absolute-parent', y: 400, zIndex: 4 });
    const absoluteChild = containerNode({ id: 'absolute-child', parentId: absoluteParent.id, y: 24, zIndex: 5 });
    const nodes = [parent, first, dragged, second, absoluteParent, absoluteChild];
    const nodesById = new Map(nodes.map((node) => [node.id, node]));
    const visibleChildrenByParentId = getVisibleChildrenByParentId(nodes);

    expect(getInnerFlowPreviewGapInfo({
      interaction: moveInteraction(dragged.id, 'mobile'),
      nodesById,
      viewport: 'mobile',
      visibleChildrenByParentId,
    })).toEqual({
      parentId: parent.id,
      insertionIndex: 2,
      draggedId: dragged.id,
    });

    expect(getInnerFlowPreviewGapInfo({
      interaction: moveInteraction(dragged.id, 'desktop'),
      nodesById,
      viewport: 'desktop',
      visibleChildrenByParentId,
    })).toBeNull();

    expect(getInnerFlowPreviewGapInfo({
      interaction: moveInteraction(absoluteChild.id, 'mobile'),
      nodesById,
      viewport: 'mobile',
      visibleChildrenByParentId,
    })).toBeNull();
  });

  it('precomputes top-level flow preview gaps from the flow-section list', () => {
    const first = sectionNode({ id: 'first-section', y: 0, zIndex: 1 });
    const dragged = {
      ...sectionNode({ id: 'dragged-section', y: 120, zIndex: 2 }),
      responsive: {
        mobile: {
          rect: { x: 0, y: 420, width: 240, height: 80 },
        },
      },
    } satisfies BuilderCanvasNode;
    const second = sectionNode({ id: 'second-section', y: 260, zIndex: 3 });
    const widget = containerNode({ id: 'floating-widget', y: 80, zIndex: 4 });
    const flowSectionNodes = [first, dragged, second];
    const nodesById = new Map([first, dragged, second, widget].map((node) => [node.id, node]));

    expect(getTopLevelFlowPreviewGapInfo({
      flowSectionNodes,
      interaction: moveInteraction(dragged.id, 'mobile'),
      nodesById,
    })).toEqual({
      insertionIndex: 2,
      draggedId: dragged.id,
    });

    expect(getTopLevelFlowPreviewGapInfo({
      flowSectionNodes,
      interaction: moveInteraction(widget.id, 'mobile'),
      nodesById,
    })).toBeNull();
  });

  it('preserves flow preview insertion ordering without relying on input order', () => {
    const dragged = sectionNode({ id: 'dragged-section', y: 120, zIndex: 2 });
    const lowerY = sectionNode({ id: 'lower-y-section', y: 40, zIndex: 9 });
    const lowerZ = sectionNode({ id: 'lower-z-section', y: 120, zIndex: 1 });
    const lowerId = sectionNode({ id: 'aaa-section', y: 120, zIndex: 2 });
    const higherId = sectionNode({ id: 'zzz-section', y: 120, zIndex: 2 });
    const higherY = sectionNode({ id: 'higher-y-section', y: 220, zIndex: 0 });
    const flowSectionNodes = [higherY, higherId, dragged, lowerId, lowerZ, lowerY];
    const nodesById = new Map(flowSectionNodes.map((node) => [node.id, node]));

    expect(getTopLevelFlowPreviewGapInfo({
      flowSectionNodes,
      interaction: moveInteraction(dragged.id, 'desktop'),
      nodesById,
    })).toEqual({
      insertionIndex: 3,
      draggedId: dragged.id,
    });
  });
});
