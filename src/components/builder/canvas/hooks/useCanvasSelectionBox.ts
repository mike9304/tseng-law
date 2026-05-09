'use client';

import { useEffect, useMemo, type Dispatch, type SetStateAction } from 'react';
import {
  type SelectionBoxState,
} from '@/components/builder/canvas/canvasInteraction';
import { resolveViewportRect, type Viewport } from '@/lib/builder/canvas/responsive';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

type SelectionBoxRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type UseCanvasSelectionBoxArgs = {
  absoluteRectById: Map<string, BuilderCanvasNode['rect']>;
  geometryViewport: Viewport;
  resolveStagePosition: (clientX: number, clientY: number) => { x: number; y: number };
  selectableNodes: BuilderCanvasNode[];
  selectedNodeId: string | null;
  selectedNodeIds: string[];
  selectionBox: SelectionBoxState | null;
  setSelectedNodeIds: (nodeIds: string[], primaryNodeId?: string | null) => void;
  setSelectionBox: Dispatch<SetStateAction<SelectionBoxState | null>>;
};

export function useCanvasSelectionBox({
  absoluteRectById,
  geometryViewport,
  resolveStagePosition,
  selectableNodes,
  selectedNodeId,
  selectedNodeIds,
  selectionBox,
  setSelectedNodeIds,
  setSelectionBox,
}: UseCanvasSelectionBoxArgs): SelectionBoxRect | null {
  useEffect(() => {
    if (!selectionBox) return undefined;
    const activeSelectionBox = selectionBox;

    function handlePointerMove(event: PointerEvent) {
      const nextPoint = resolveStagePosition(event.clientX, event.clientY);
      setSelectionBox((currentSelectionBox) => (
        currentSelectionBox
          ? {
              ...currentSelectionBox,
              currentX: nextPoint.x,
              currentY: nextPoint.y,
            }
          : currentSelectionBox
      ));
    }

    function handlePointerUp(event: PointerEvent) {
      if (event.pointerId !== activeSelectionBox.pointerId) return;

      const left = Math.min(activeSelectionBox.originX, activeSelectionBox.currentX);
      const top = Math.min(activeSelectionBox.originY, activeSelectionBox.currentY);
      const right = Math.max(activeSelectionBox.originX, activeSelectionBox.currentX);
      const bottom = Math.max(activeSelectionBox.originY, activeSelectionBox.currentY);

      const intersectingNodeIds = selectableNodes
        .filter((node) => {
          const rect = absoluteRectById.get(node.id) ?? resolveViewportRect(node, geometryViewport);
          return (
            rect.x < right
            && rect.x + rect.width > left
            && rect.y < bottom
            && rect.y + rect.height > top
          );
        })
        .map((node) => node.id);
      const nextPrimaryNodeId = intersectingNodeIds[intersectingNodeIds.length - 1] ?? null;

      if (activeSelectionBox.additive) {
        setSelectedNodeIds(
          [...new Set([...selectedNodeIds, ...intersectingNodeIds])],
          nextPrimaryNodeId ?? selectedNodeId,
        );
      } else {
        setSelectedNodeIds(intersectingNodeIds, nextPrimaryNodeId);
      }
      setSelectionBox(null);
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [
    absoluteRectById,
    geometryViewport,
    resolveStagePosition,
    selectableNodes,
    selectedNodeId,
    selectedNodeIds,
    selectionBox,
    setSelectedNodeIds,
    setSelectionBox,
  ]);

  return useMemo(() => {
    if (!selectionBox) return null;
    return {
      left: Math.min(selectionBox.originX, selectionBox.currentX),
      top: Math.min(selectionBox.originY, selectionBox.currentY),
      width: Math.abs(selectionBox.currentX - selectionBox.originX),
      height: Math.abs(selectionBox.currentY - selectionBox.originY),
    };
  }, [selectionBox]);
}
