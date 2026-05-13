import {
  useCallback,
  useEffect,
  type Dispatch,
  type RefObject,
  type SetStateAction,
} from 'react';
import {
  clampViewportPopupPosition,
  clampVisibleViewportPopupPosition,
  getCanvasNodeDepth,
  type OverlapPickerState,
} from '@/components/builder/canvas/canvasInteraction';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { resolveViewportRect, type Viewport } from '@/lib/builder/canvas/responsive';
import { screenToCanvas, type ZoomState } from '@/lib/builder/canvas/zoom';

const CONTEXT_MENU_WIDTH = 276;
const CONTEXT_MENU_MAX_HEIGHT = 520;

type Point = { x: number; y: number };

export function useCanvasStageGeometry({
  absoluteRectById,
  geometryViewport,
  nodesById,
  selectableNodes,
  setOverlapPicker,
  setZoomState,
  stageHeight,
  stageWidth,
  viewportRef,
  zoomState,
}: {
  absoluteRectById: Map<string, BuilderCanvasNode['rect']>;
  geometryViewport: Viewport;
  nodesById: Map<string, BuilderCanvasNode>;
  selectableNodes: BuilderCanvasNode[];
  setOverlapPicker: Dispatch<SetStateAction<OverlapPickerState | null>>;
  setZoomState: Dispatch<SetStateAction<ZoomState>>;
  stageHeight: number;
  stageWidth: number;
  viewportRef: RefObject<HTMLDivElement | null>;
  zoomState: ZoomState;
}) {
  const resolveStagePosition = useCallback((clientX: number, clientY: number): Point => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return { x: 48, y: 48 };
    const nextPoint = screenToCanvas(clientX - rect.left, clientY - rect.top, zoomState);
    return {
      x: Math.max(0, Math.min(stageWidth - 80, Math.round(nextPoint.x))),
      y: Math.max(0, Math.min(stageHeight - 48, Math.round(nextPoint.y))),
    };
  }, [stageHeight, stageWidth, viewportRef, zoomState]);

  const resolveCanvasPoint = useCallback((clientX: number, clientY: number): Point => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const point = screenToCanvas(clientX - rect.left, clientY - rect.top, zoomState);
    return {
      x: Math.max(0, Math.min(stageWidth, Math.round(point.x))),
      y: Math.max(0, Math.min(stageHeight, Math.round(point.y))),
    };
  }, [stageHeight, stageWidth, viewportRef, zoomState]);

  const focusCanvasNodeInViewport = useCallback((nodeId: string) => {
    const nodeRect = absoluteRectById.get(nodeId)
      ?? (nodesById.get(nodeId) ? resolveViewportRect(nodesById.get(nodeId)!, geometryViewport) : null);
    const viewportRect = viewportRef.current?.getBoundingClientRect();
    if (!nodeRect || !viewportRect) return;

    setZoomState((currentState) => {
      const scaledStageWidth = stageWidth * currentState.zoom;
      const centeredPanX = Math.round(
        (viewportRect.width - nodeRect.width * currentState.zoom) / 2
        - nodeRect.x * currentState.zoom,
      );
      const minPanX = Math.min(0, Math.round(viewportRect.width - scaledStageWidth));
      const maxPanX = scaledStageWidth <= viewportRect.width
        ? Math.round((viewportRect.width - scaledStageWidth) / 2)
        : 0;
      const nextPanX = Math.max(minPanX, Math.min(maxPanX, centeredPanX));
      if (nextPanX === currentState.panX) return currentState;
      return { ...currentState, panX: nextPanX };
    });
  }, [absoluteRectById, geometryViewport, nodesById, setZoomState, stageWidth, viewportRef]);

  useEffect(() => {
    function handleFocusCanvasNode(event: Event) {
      const nodeId = (event as CustomEvent<{ nodeId?: unknown }>).detail?.nodeId;
      if (typeof nodeId !== 'string' || !nodeId) return;
      focusCanvasNodeInViewport(nodeId);
    }

    document.addEventListener('builder:focus-canvas-node', handleFocusCanvasNode);
    return () => document.removeEventListener('builder:focus-canvas-node', handleFocusCanvasNode);
  }, [focusCanvasNodeInViewport]);

  const resolveViewportPopupPosition = useCallback((clientX: number, clientY: number): Point => {
    const rect = viewportRef.current?.getBoundingClientRect();
    const width = rect?.width ?? stageWidth;
    const height = rect?.height ?? stageHeight;
    const rawX = rect ? clientX - rect.left : clientX;
    const rawY = rect ? clientY - rect.top : clientY;
    return {
      x: Math.max(12, Math.min(width - 244, rawX + 10)),
      y: Math.max(12, Math.min(height - 280, rawY + 10)),
    };
  }, [stageHeight, stageWidth, viewportRef]);

  const resolveContextMenuPosition = useCallback((clientX: number, clientY: number): Point => {
    const rect = viewportRef.current?.getBoundingClientRect();
    const width = rect?.width ?? stageWidth;
    const height = rect?.height ?? stageHeight;
    const rawX = rect ? clientX - rect.left : clientX;
    const rawY = rect ? clientY - rect.top : clientY;
    if (rect && typeof window !== 'undefined') {
      return clampVisibleViewportPopupPosition(
        rawX,
        rawY,
        rect,
        CONTEXT_MENU_WIDTH,
        CONTEXT_MENU_MAX_HEIGHT,
      );
    }
    return clampViewportPopupPosition(
      rawX,
      rawY,
      width,
      height,
      CONTEXT_MENU_WIDTH,
      CONTEXT_MENU_MAX_HEIGHT,
    );
  }, [stageHeight, stageWidth, viewportRef]);

  const resolveOverlapCandidates = useCallback(
    (clientX: number, clientY: number): BuilderCanvasNode[] => {
      const point = resolveStagePosition(clientX, clientY);
      return selectableNodes
        .filter((node) => {
          const rect = absoluteRectById.get(node.id) ?? resolveViewportRect(node, geometryViewport);
          return (
            point.x >= rect.x
            && point.x <= rect.x + rect.width
            && point.y >= rect.y
            && point.y <= rect.y + rect.height
          );
        })
        .sort((left, right) => {
          const zDelta = right.zIndex - left.zIndex;
          if (zDelta !== 0) return zDelta;
          return getCanvasNodeDepth(right, nodesById) - getCanvasNodeDepth(left, nodesById);
        })
        .slice(0, 8);
    },
    [absoluteRectById, geometryViewport, nodesById, resolveStagePosition, selectableNodes],
  );

  const openOverlapPicker = useCallback(
    (clientX: number, clientY: number, candidates: BuilderCanvasNode[], mode: OverlapPickerState['mode']) => {
      const position = resolveViewportPopupPosition(clientX, clientY);
      setOverlapPicker({
        nodeIds: candidates.map((node) => node.id),
        x: position.x,
        y: position.y,
        mode,
      });
    },
    [resolveViewportPopupPosition, setOverlapPicker],
  );

  return {
    openOverlapPicker,
    resolveCanvasPoint,
    resolveContextMenuPosition,
    resolveOverlapCandidates,
    resolveStagePosition,
  };
}
