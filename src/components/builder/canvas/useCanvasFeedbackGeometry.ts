import { useMemo } from 'react';
import { unionRects, type InteractionState } from '@/components/builder/canvas/canvasInteraction';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { resolveViewportRect, type Viewport } from '@/lib/builder/canvas/responsive';
import type { ZoomState } from '@/lib/builder/canvas/zoom';

export function useCanvasFeedbackGeometry({
  absoluteRectById,
  geometryViewport,
  interaction,
  selectedNodeIds,
  selectedNodes,
  visibleNodes,
  zoomState,
}: {
  absoluteRectById: Map<string, BuilderCanvasNode['rect']>;
  geometryViewport: Viewport;
  interaction: InteractionState | null;
  selectedNodeIds: string[];
  selectedNodes: BuilderCanvasNode[];
  visibleNodes: BuilderCanvasNode[];
  zoomState: Pick<ZoomState, 'zoom' | 'panX' | 'panY'>;
}) {
  const interactionMode = interaction?.type === 'move' || interaction?.type === 'resize'
    ? interaction.type
    : null;

  const interactionNodeIds = useMemo(() => {
    if (!interaction) return selectedNodeIds;
    if (interaction.type === 'move') return interaction.nodeIds;
    if (interaction.type === 'resize') return [interaction.nodeId];
    return selectedNodeIds;
  }, [interaction, selectedNodeIds]);

  const dragGhostStartRects = useMemo(() => {
    if (!interactionMode || !interaction) return [];
    if (interaction.type === 'move') {
      return Object.values(interaction.startAbsoluteRects);
    }
    if (interaction.type === 'resize') {
      return [interaction.startAbsoluteRect];
    }
    return [];
  }, [interaction, interactionMode]);

  const dragGhostCurrentRects = useMemo(() => (
    interactionNodeIds
      .map((nodeId) => absoluteRectById.get(nodeId))
      .filter((rect): rect is BuilderCanvasNode['rect'] => Boolean(rect))
  ), [absoluteRectById, interactionNodeIds]);

  const resizeCurrentRect = useMemo(() => {
    if (!interaction || interaction.type !== 'resize') return null;
    return absoluteRectById.get(interaction.nodeId) ?? null;
  }, [absoluteRectById, interaction]);

  const interactionActiveRect = useMemo(() => {
    if (!interactionMode) return null;
    return unionRects(dragGhostCurrentRects);
  }, [dragGhostCurrentRects, interactionMode]);

  const snapOtherRects = useMemo(() => {
    const activeIds = new Set(interactionNodeIds);
    return visibleNodes
      .filter((node) => !activeIds.has(node.id))
      .map((node) => absoluteRectById.get(node.id) ?? resolveViewportRect(node, geometryViewport));
  }, [absoluteRectById, geometryViewport, interactionNodeIds, visibleNodes]);

  const selectionBboxStage = useMemo(() => {
    if (selectedNodes.length === 0 || interaction) return null;
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
  }, [absoluteRectById, geometryViewport, interaction, selectedNodes]);

  const selectionBboxScreen = useMemo(() => {
    if (!selectionBboxStage) return null;
    return {
      x: selectionBboxStage.x * zoomState.zoom + zoomState.panX,
      y: selectionBboxStage.y * zoomState.zoom + zoomState.panY,
      width: selectionBboxStage.width * zoomState.zoom,
      height: selectionBboxStage.height * zoomState.zoom,
    };
  }, [selectionBboxStage, zoomState.panX, zoomState.panY, zoomState.zoom]);

  return {
    dragGhostCurrentRects,
    dragGhostStartRects,
    interactionActiveRect,
    interactionMode,
    resizeCurrentRect,
    selectionBboxScreen,
    snapOtherRects,
  };
}
