import { describe, expect, it } from 'vitest';
import type { InteractionState } from '../canvasInteraction';
import {
  EMPTY_CANVAS_FEEDBACK_RECTS,
  getCanvasFeedbackCurrentRects,
  getCanvasFeedbackInteractionActiveRect,
  getCanvasFeedbackSelectionBboxStage,
  getCanvasFeedbackSnapActiveRect,
  getCanvasFeedbackSnapOtherRects,
} from '../useCanvasFeedbackGeometry';
import { getSnapDistanceMeasurements } from '../SnapDistanceLabel';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createSnapCandidateEdges } from '@/lib/builder/canvas/snap';

type TestNodeOverrides = Partial<Omit<BuilderCanvasNode, 'content'>> & {
  content?: Record<string, unknown>;
};

function node(overrides: TestNodeOverrides): BuilderCanvasNode {
  return {
    id: 'node',
    kind: 'text',
    rect: { x: 0, y: 0, width: 120, height: 80 },
    content: { text: 'Node' },
    style: {},
    zIndex: 0,
    visible: true,
    ...overrides,
  } as BuilderCanvasNode;
}

describe('canvas feedback geometry', () => {
  it('reuses an empty rect array when feedback is inactive', () => {
    const absoluteRectById = new Map([['selected', { x: 10, y: 20, width: 80, height: 40 }]]);

    expect(getCanvasFeedbackCurrentRects({
      absoluteRectById,
      interactionMode: null,
      interactionNodeIds: ['selected'],
    })).toBe(EMPTY_CANVAS_FEEDBACK_RECTS);

    expect(getCanvasFeedbackSnapOtherRects(null)).toBe(EMPTY_CANVAS_FEEDBACK_RECTS);
  });

  it('returns current rects only for active move or resize feedback', () => {
    const selectedRect = { x: 10, y: 20, width: 80, height: 40 };
    const absoluteRectById = new Map([['selected', selectedRect]]);

    expect(getCanvasFeedbackCurrentRects({
      absoluteRectById,
      interactionMode: 'move',
      interactionNodeIds: ['selected', 'missing'],
    })).toEqual([selectedRect]);

    expect(getCanvasFeedbackCurrentRects({
      absoluteRectById,
      interactionMode: 'move',
      interactionNodeIds: ['missing'],
    })).toBe(EMPTY_CANVAS_FEEDBACK_RECTS);
  });

  it('uses the live resize preview rect for snap distance feedback', () => {
    const committedRect = { x: 10, y: 20, width: 80, height: 40 };
    const resizePreviewRect = { x: 10, y: 20, width: 120, height: 70 };

    expect(getCanvasFeedbackSnapActiveRect('resize', committedRect, resizePreviewRect)).toBe(resizePreviewRect);
    expect(getCanvasFeedbackSnapActiveRect('resize', committedRect, null)).toBe(committedRect);
    expect(getCanvasFeedbackSnapActiveRect('move', committedRect, resizePreviewRect)).toBe(committedRect);
    expect(getCanvasFeedbackSnapActiveRect(null, null, resizePreviewRect)).toBe(null);
  });

  it('uses the single resize current rect instead of unioning current rect arrays', () => {
    const resizeCurrentRect = { x: 10, y: 20, width: 80, height: 40 };
    const moveCurrentRect = { x: 100, y: 120, width: 80, height: 40 };

    expect(getCanvasFeedbackInteractionActiveRect({
      interactionMode: 'resize',
      moveCurrentRects: [moveCurrentRect],
      resizeCurrentRect,
    })).toBe(resizeCurrentRect);

    expect(getCanvasFeedbackInteractionActiveRect({
      interactionMode: 'move',
      moveCurrentRects: [moveCurrentRect],
      resizeCurrentRect,
    })).toBe(moveCurrentRect);

    expect(getCanvasFeedbackInteractionActiveRect({
      interactionMode: 'move',
      moveCurrentRects: [],
      resizeCurrentRect,
    })).toBe(null);

    expect(getCanvasFeedbackInteractionActiveRect({
      interactionMode: null,
      moveCurrentRects: [moveCurrentRect],
      resizeCurrentRect,
    })).toBe(null);
  });

  it('keeps single-selection bbox for toolbar and only unions multi-selection bbox', () => {
    const selectedRect = { x: 10, y: 20, width: 80, height: 40 };
    const secondRect = { x: 120, y: 5, width: 40, height: 70 };
    const selected = node({ id: 'selected', rect: { x: 0, y: 0, width: 1, height: 1 } });
    const second = node({ id: 'second', rect: { x: 200, y: 200, width: 20, height: 20 } });
    const absoluteRectById = new Map([
      ['selected', selectedRect],
      ['second', secondRect],
    ]);
    const moveInteraction: NonNullable<InteractionState> = {
      type: 'move',
      nodeId: selected.id,
      nodeIds: [selected.id],
      nodeIdSet: new Set([selected.id]),
      canDirectPreview: true,
      viewport: 'desktop',
      pointerId: 1,
      originX: 0,
      originY: 0,
      startParentId: null,
      startRects: {},
      startAbsoluteRects: {},
      snapBounds: { x: 0, y: 0, width: 1280, height: 1200 },
      snapRects: [],
      snapEdges: createSnapCandidateEdges([]),
      containerHitRects: [],
    };

    expect(getCanvasFeedbackSelectionBboxStage({
      absoluteRectById,
      geometryViewport: 'desktop',
      interaction: null,
      selectedNodes: [],
    })).toBe(null);

    expect(getCanvasFeedbackSelectionBboxStage({
      absoluteRectById,
      geometryViewport: 'desktop',
      interaction: null,
      selectedNodes: [selected],
    })).toBe(selectedRect);

    expect(getCanvasFeedbackSelectionBboxStage({
      absoluteRectById,
      geometryViewport: 'desktop',
      interaction: null,
      selectedNodes: [selected, second],
    })).toEqual({ x: 10, y: 5, width: 150, height: 70 });

    expect(getCanvasFeedbackSelectionBboxStage({
      absoluteRectById,
      geometryViewport: 'desktop',
      interaction: moveInteraction,
      selectedNodes: [selected],
    })).toBe(null);
  });

  it('reuses narrowed move snap rects instead of scanning visible nodes', () => {
    const snapRects = [{ x: 32, y: 48, width: 80, height: 60 }];
    const interaction: NonNullable<InteractionState> = {
      type: 'move',
      nodeId: 'moving',
      nodeIds: ['moving'],
      nodeIdSet: new Set(['moving']),
      canDirectPreview: true,
      viewport: 'desktop',
      pointerId: 1,
      originX: 0,
      originY: 0,
      startParentId: null,
      startRects: {},
      startAbsoluteRects: {},
      snapBounds: { x: 0, y: 0, width: 1280, height: 1200 },
      snapRects,
      snapEdges: createSnapCandidateEdges(snapRects),
      containerHitRects: [],
    };

    expect(getCanvasFeedbackSnapOtherRects(interaction)).toBe(snapRects);
  });

  it('reuses precomputed resize snap rects instead of scanning visible nodes', () => {
    const resizing = node({ id: 'resizing' });
    const sibling = node({ id: 'sibling', rect: { x: 200, y: 0, width: 120, height: 80 } });
    const snapRects = [
      sibling.rect,
      { x: 480, y: 16, width: 90, height: 70 },
    ];
    const interaction: NonNullable<InteractionState> = {
      type: 'resize',
      nodeId: resizing.id,
      handle: 'se',
      viewport: 'desktop',
      pointerId: 1,
      originX: 0,
      originY: 0,
      viewportOriginX: 0,
      viewportOriginY: 0,
      startRect: resizing.rect,
      startAbsoluteRect: resizing.rect,
      snapRects,
    };

    expect(getCanvasFeedbackSnapOtherRects(interaction)).toBe(snapRects);
  });

  it('reuses empty snap distance measurements and keeps nearest gaps', () => {
    const active = { x: 100, y: 100, width: 50, height: 40 };

    expect(getSnapDistanceMeasurements(null, [])).toBe(getSnapDistanceMeasurements(null, []));
    expect(getSnapDistanceMeasurements(active, [])).toBe(getSnapDistanceMeasurements(active, []));
    expect(getSnapDistanceMeasurements(active, [
      { x: 400, y: 400, width: 50, height: 40 },
    ])).toBe(getSnapDistanceMeasurements(active, [
      { x: 400, y: 400, width: 50, height: 40 },
    ]));
    expect(getSnapDistanceMeasurements(active, [
      { x: 170, y: 100, width: 20, height: 40 },
      { x: 190, y: 100, width: 20, height: 40 },
      { x: 100, y: 155, width: 50, height: 20 },
      { x: 100, y: 230, width: 50, height: 20 },
    ])).toEqual([
      {
        key: 'right',
        gap: 20,
        orientation: 'horizontal',
        x: 160,
        y: 120,
      },
      {
        key: 'bottom',
        gap: 15,
        orientation: 'vertical',
        x: 125,
        y: 147.5,
      },
    ]);
  });
});
