import { useMemo } from 'react';
import { unionRects, type InteractionState } from '@/components/builder/canvas/canvasInteraction';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { resolveViewportRect, type Viewport } from '@/lib/builder/canvas/responsive';
import type { ZoomState } from '@/lib/builder/canvas/zoom';

export const EMPTY_CANVAS_FEEDBACK_RECTS: BuilderCanvasNode['rect'][] = [];

export function getCanvasFeedbackSnapOtherRects(interaction: InteractionState | null): BuilderCanvasNode['rect'][] {
  if (!interaction) return EMPTY_CANVAS_FEEDBACK_RECTS;
  if (interaction.type === 'move') return interaction.snapRects;
  if (interaction.type === 'resize') return interaction.snapRects;
  return EMPTY_CANVAS_FEEDBACK_RECTS;
}

export function getCanvasFeedbackCurrentRects({
  absoluteRectById,
  interactionMode,
  interactionNodeIds,
}: {
  absoluteRectById: Map<string, BuilderCanvasNode['rect']>;
  interactionMode: 'move' | 'resize' | null;
  interactionNodeIds: readonly string[];
}): BuilderCanvasNode['rect'][] {
  if (!interactionMode) return EMPTY_CANVAS_FEEDBACK_RECTS;
  let currentRects: BuilderCanvasNode['rect'][] | null = null;
  for (const nodeId of interactionNodeIds) {
    const rect = absoluteRectById.get(nodeId);
    if (!rect) continue;
    currentRects ??= [];
    currentRects.push(rect);
  }
  return currentRects ?? EMPTY_CANVAS_FEEDBACK_RECTS;
}

export function getCanvasFeedbackSnapActiveRect(
  interactionMode: 'move' | 'resize' | null,
  interactionActiveRect: BuilderCanvasNode['rect'] | null,
  resizePreviewRect: BuilderCanvasNode['rect'] | null,
): BuilderCanvasNode['rect'] | null {
  return interactionMode === 'resize'
    ? resizePreviewRect ?? interactionActiveRect
    : interactionActiveRect;
}

export function getCanvasFeedbackInteractionActiveRect({
  interactionMode,
  moveCurrentRects,
  resizeCurrentRect,
}: {
  interactionMode: 'move' | 'resize' | null;
  moveCurrentRects: readonly BuilderCanvasNode['rect'][];
  resizeCurrentRect: BuilderCanvasNode['rect'] | null;
}): BuilderCanvasNode['rect'] | null {
  if (interactionMode === 'resize') return resizeCurrentRect;
  if (interactionMode === 'move') {
    if (moveCurrentRects.length === 0) return null;
    if (moveCurrentRects.length === 1) return moveCurrentRects[0];
    return unionRects(moveCurrentRects);
  }
  return null;
}

export function getCanvasFeedbackSelectionBboxStage({
  absoluteRectById,
  geometryViewport,
  interaction,
  selectedNodes,
}: {
  absoluteRectById: Map<string, BuilderCanvasNode['rect']>;
  geometryViewport: Viewport;
  interaction: InteractionState | null;
  selectedNodes: readonly BuilderCanvasNode[];
}): BuilderCanvasNode['rect'] | null {
  if (selectedNodes.length === 0 || interaction) return null;
  if (selectedNodes.length === 1) {
    const node = selectedNodes[0];
    if (!node) return null;
    return absoluteRectById.get(node.id) ?? resolveViewportRect(node, geometryViewport);
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const node of selectedNodes) {
    const rect = absoluteRectById.get(node.id) ?? resolveViewportRect(node, geometryViewport);
    minX = Math.min(minX, rect.x);
    minY = Math.min(minY, rect.y);
    maxX = Math.max(maxX, rect.x + rect.width);
    maxY = Math.max(maxY, rect.y + rect.height);
  }
  if (!Number.isFinite(minX)) return null;
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export function useCanvasFeedbackGeometry({
  absoluteRectById,
  geometryViewport,
  interaction,
  selectedNodes,
  zoomState,
}: {
  absoluteRectById: Map<string, BuilderCanvasNode['rect']>;
  geometryViewport: Viewport;
  interaction: InteractionState | null;
  selectedNodes: BuilderCanvasNode[];
  zoomState: Pick<ZoomState, 'zoom' | 'panX' | 'panY'>;
}) {
  const interactionMode = interaction?.type === 'move' || interaction?.type === 'resize'
    ? interaction.type
    : null;

  const dragGhostStartRects = useMemo(() => {
    if (!interactionMode || !interaction) return EMPTY_CANVAS_FEEDBACK_RECTS;
    if (interaction.type === 'move') {
      return Object.values(interaction.startAbsoluteRects);
    }
    if (interaction.type === 'resize') {
      return [interaction.startAbsoluteRect];
    }
    return EMPTY_CANVAS_FEEDBACK_RECTS;
  }, [interaction, interactionMode]);

  const dragGhostCurrentRects = useMemo(() => {
    if (interaction?.type !== 'move') return EMPTY_CANVAS_FEEDBACK_RECTS;
    return getCanvasFeedbackCurrentRects({
      absoluteRectById,
      interactionMode: 'move',
      interactionNodeIds: interaction.nodeIds,
    });
  }, [absoluteRectById, interaction]);

  const resizeCurrentRect = useMemo(() => {
    if (!interaction || interaction.type !== 'resize') return null;
    return absoluteRectById.get(interaction.nodeId) ?? null;
  }, [absoluteRectById, interaction]);

  const interactionActiveRect = useMemo(() => getCanvasFeedbackInteractionActiveRect({
    interactionMode,
    moveCurrentRects: dragGhostCurrentRects,
    resizeCurrentRect,
  }), [dragGhostCurrentRects, interactionMode, resizeCurrentRect]);

  const snapOtherRects = useMemo(() => getCanvasFeedbackSnapOtherRects(interaction), [interaction]);

  const selectionBboxStage = useMemo(() => getCanvasFeedbackSelectionBboxStage({
    absoluteRectById,
    geometryViewport,
    interaction,
    selectedNodes,
  }), [absoluteRectById, geometryViewport, interaction, selectedNodes]);

  const selectionBboxScreen = useMemo(() => {
    if (!selectionBboxStage) return null;
    return {
      x: selectionBboxStage.x * zoomState.zoom + zoomState.panX,
      y: selectionBboxStage.y * zoomState.zoom + zoomState.panY,
      width: selectionBboxStage.width * zoomState.zoom,
      height: selectionBboxStage.height * zoomState.zoom,
    };
  }, [selectionBboxStage, zoomState.panX, zoomState.panY, zoomState.zoom]);
  const multiSelectionBboxScreen = selectedNodes.length >= 2 ? selectionBboxScreen : null;

  return {
    dragGhostCurrentRects,
    dragGhostStartRects,
    interactionActiveRect,
    interactionMode,
    multiSelectionBboxScreen,
    resizeCurrentRect,
    selectionBboxScreen,
    snapOtherRects,
  };
}
