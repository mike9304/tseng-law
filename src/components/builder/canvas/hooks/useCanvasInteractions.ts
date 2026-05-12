'use client';

import { useCallback, useEffect, useRef, useState, type Dispatch, type RefObject, type SetStateAction } from 'react';
import type { ResizeHandle } from '@/components/builder/canvas/CanvasNode';
import {
  clampAspectRect,
  clampRect,
  createMoveInteractionCandidates,
  isKeyboardTextInputTarget,
  resolveCanvasNodeAbsoluteRectForViewport,
  resolveLocalRectForParent,
  type ContextMenuState,
  type InteractionGeometrySnapshot,
  type InteractionState,
  type OverlapPickerState,
  type PointerMoveSnapshot,
  type SelectionBoxState,
} from '@/components/builder/canvas/canvasInteraction';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import { getCanvasNodesById } from '@/lib/builder/canvas/indexes';
import { resolveViewportRect, type Viewport } from '@/lib/builder/canvas/responsive';
import { isContainerLikeKind, type BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { computeSnap } from '@/lib/builder/canvas/snap';
import type { AlignmentGuide, SnapReferenceGuide } from '@/lib/builder/canvas/snap';
import type { ZoomState } from '@/lib/builder/canvas/zoom';

type UseCanvasInteractionsArgs = {
  activeGroupId: string | null;
  activeViewport: Viewport | null;
  absoluteRectById: Map<string, BuilderCanvasNode['rect']>;
  beginMutationSession: () => void;
  cancelMutationSession: () => void;
  captureInteractionGeometry: () => InteractionGeometrySnapshot;
  commitMutationSession: () => void;
  currentViewport: Viewport;
  gridSnapSize: number;
  nodes: BuilderCanvasNode[];
  nodesById: Map<string, BuilderCanvasNode>;
  onToast?: (message: string, tone: 'success' | 'error') => void;
  selectedNodeIds: string[];
  setContextMenu: Dispatch<SetStateAction<ContextMenuState | null>>;
  setActiveViewport: Dispatch<SetStateAction<Viewport | null>>;
  setOverlapPicker: Dispatch<SetStateAction<OverlapPickerState | null>>;
  setSelectedNodeId: (nodeId: string | null) => void;
  setSelectedNodeIds: (nodeIds: string[], primaryNodeId?: string | null) => void;
  setSelectionBox: Dispatch<SetStateAction<SelectionBoxState | null>>;
  setZoomState: Dispatch<SetStateAction<ZoomState>>;
  stageHeight: number;
  stageWidth: number;
  updateNodeRectsForViewport: (
    rects: Map<string, BuilderCanvasNode['rect']>,
    viewport: Viewport,
    mode?: 'commit' | 'transient',
  ) => void;
  viewportRef: RefObject<HTMLDivElement | null>;
  visibleNodes: BuilderCanvasNode[];
  referenceGuides: SnapReferenceGuide[];
  zoomState: ZoomState;
};

const MOVE_ACTIVATION_THRESHOLD_PX = 4;

export function useCanvasInteractions({
  activeGroupId,
  activeViewport,
  absoluteRectById,
  beginMutationSession,
  cancelMutationSession,
  captureInteractionGeometry,
  commitMutationSession,
  currentViewport,
  gridSnapSize,
  nodes,
  nodesById,
  onToast,
  selectedNodeIds,
  setContextMenu,
  setActiveViewport,
  setOverlapPicker,
  setSelectedNodeId,
  setSelectedNodeIds,
  setSelectionBox,
  setZoomState,
  stageHeight,
  stageWidth,
  updateNodeRectsForViewport,
  viewportRef,
  visibleNodes,
  referenceGuides,
  zoomState,
}: UseCanvasInteractionsArgs) {
  const [interaction, setInteraction] = useState<InteractionState>(null);
  const [guides, setGuides] = useState<AlignmentGuide[]>([]);
  const [interactionPointer, setInteractionPointer] = useState<{ x: number; y: number } | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [hoveredContainerId, setHoveredContainerId] = useState<string | null>(null);
  const canceledInteractionPointerIdsRef = useRef<Set<number>>(new Set());
  const interactionGeometrySnapshotRef = useRef<InteractionGeometrySnapshot | null>(null);
  const moveActivationRef = useRef<{ pointerId: number; active: boolean } | null>(null);
  const pendingPointerMoveRef = useRef<PointerMoveSnapshot | null>(null);
  const pointerMoveFrameRef = useRef<number | null>(null);
  const moveNodeIntoContainer = useBuilderCanvasStore((state) => state.moveNodeIntoContainer);

  useEffect(() => {
    if (!activeViewport || activeViewport === currentViewport) return;
    cancelMutationSession();
    interactionGeometrySnapshotRef.current = null;
    moveActivationRef.current = null;
    setActiveViewport(null);
    setInteraction(null);
    setInteractionPointer(null);
    setGuides([]);
    setHoveredContainerId(null);
  }, [activeViewport, cancelMutationSession, currentViewport, setActiveViewport]);

  useEffect(() => {
    if (!interaction) return undefined;
    const activeInteraction = interaction;

    function handleInteractionEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      canceledInteractionPointerIdsRef.current.add(activeInteraction.pointerId);
      cancelMutationSession();
      interactionGeometrySnapshotRef.current = null;
      moveActivationRef.current = null;
      setInteraction(null);
      setActiveViewport(null);
      setInteractionPointer(null);
      setGuides([]);
      setHoveredContainerId(null);
      setContextMenu(null);
      setOverlapPicker(null);
    }

    window.addEventListener('keydown', handleInteractionEscape, true);
    return () => window.removeEventListener('keydown', handleInteractionEscape, true);
  }, [cancelMutationSession, interaction, setActiveViewport, setContextMenu, setOverlapPicker]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code !== 'Space' || isKeyboardTextInputTarget(event.target)) return;
      setIsSpacePressed(true);
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.code !== 'Space' || isKeyboardTextInputTarget(event.target)) return;
      setIsSpacePressed(false);
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!interaction) return undefined;
    const activeInteraction = interaction;
    canceledInteractionPointerIdsRef.current.delete(activeInteraction.pointerId);

    function processPointerMove(pointer: PointerMoveSnapshot) {
      if (pointer.pointerId !== activeInteraction.pointerId) return;
      if (canceledInteractionPointerIdsRef.current.has(activeInteraction.pointerId)) return;
      if (activeInteraction.type === 'pan') {
        const deltaX = pointer.clientX - activeInteraction.originX;
        setZoomState((currentState) => ({
          ...currentState,
          panX: activeInteraction.startPanX + deltaX,
          panY: 0,
        }));
        return;
      }

      const deltaX = (pointer.clientX - activeInteraction.originX) / zoomState.zoom;
      const deltaY = (pointer.clientY - activeInteraction.originY) / zoomState.zoom;
      const viewportRect = viewportRef.current?.getBoundingClientRect();
      setInteractionPointer({
        x: viewportRect ? pointer.clientX - viewportRect.left : pointer.clientX,
        y: viewportRect ? pointer.clientY - viewportRect.top : pointer.clientY,
      });
      if (activeInteraction.type === 'move') {
        const rawDeltaX = pointer.clientX - activeInteraction.originX;
        const rawDeltaY = pointer.clientY - activeInteraction.originY;
        const moveActivation = moveActivationRef.current?.pointerId === activeInteraction.pointerId
          ? moveActivationRef.current
          : null;
        if (
          !moveActivation?.active
          && Math.hypot(rawDeltaX, rawDeltaY) < MOVE_ACTIVATION_THRESHOLD_PX
        ) {
          return;
        }
        if (!moveActivation?.active) {
          moveActivationRef.current = { pointerId: activeInteraction.pointerId, active: true };
        }
        setOverlapPicker(null);
        const geometry = interactionGeometrySnapshotRef.current;
        if (!geometry) return;
        const currentNodesById = geometry.nodesById;
        const currentAbsoluteRects = geometry.absoluteRectById;
        if (activeInteraction.nodeIds.length === 1) {
          const nodeId = activeInteraction.nodeIds[0];
          const baseAbsoluteRect = activeInteraction.startAbsoluteRects[nodeId];
          const currentNode = currentNodesById.get(nodeId);
          if (currentNode && baseAbsoluteRect) {
            const tentative = {
              x: baseAbsoluteRect.x + deltaX,
              y: baseAbsoluteRect.y + deltaY,
              width: baseAbsoluteRect.width,
              height: baseAbsoluteRect.height,
            };
            const centerX = tentative.x + tentative.width / 2;
            const centerY = tentative.y + tentative.height / 2;
            let hitContainerId: string | null = null;
            for (const candidate of activeInteraction.containerHitRects) {
              const rect = candidate.rect;
              if (
                centerX >= rect.x
                && centerX <= rect.x + rect.width
                && centerY >= rect.y
                && centerY <= rect.y + rect.height
              ) {
                hitContainerId = candidate.id;
                break;
              }
            }
            setHoveredContainerId(hitContainerId);

            const parentRect = currentNode.parentId
              ? currentAbsoluteRects.get(currentNode.parentId) ?? null
              : null;
            const { snappedRect, guides: nextGuides } = computeSnap(tentative, activeInteraction.snapRects, gridSnapSize, {
              width: stageWidth,
              height: stageHeight,
            }, referenceGuides);
            setGuides(nextGuides);
            updateNodeRectsForViewport(
              new Map([
                [
                  nodeId,
                  clampRect(
                    resolveLocalRectForParent(snappedRect, parentRect),
                    parentRect?.width ?? stageWidth,
                    parentRect?.height ?? stageHeight,
                  ),
                ],
              ]),
              activeInteraction.viewport,
              'transient',
            );
            return;
          }
        }
        setHoveredContainerId(null);
        setGuides([]);
        const nextRects = new Map<string, BuilderCanvasNode['rect']>();
        for (const nodeId of activeInteraction.nodeIds) {
          const currentNode = currentNodesById.get(nodeId);
          if (!currentNode) continue;
          const baseRect = activeInteraction.startRects[nodeId] ?? resolveViewportRect(currentNode, activeInteraction.viewport);
          const parentRect = currentNode.parentId
            ? currentAbsoluteRects.get(currentNode.parentId) ?? null
            : null;
          nextRects.set(
            nodeId,
            clampRect(
              {
                ...baseRect,
                x: baseRect.x + deltaX,
                y: baseRect.y + deltaY,
              },
              parentRect?.width ?? stageWidth,
              parentRect?.height ?? stageHeight,
            ),
          );
        }
        updateNodeRectsForViewport(nextRects, activeInteraction.viewport, 'transient');
        return;
      }

      setGuides([]);
      const geometry = interactionGeometrySnapshotRef.current;
      if (!geometry) return;
      const currentNodesById = geometry.nodesById;
      const currentAbsoluteRects = geometry.absoluteRectById;
      const targetNode = currentNodesById.get(activeInteraction.nodeId);
      if (!targetNode) return;
      const { handle } = activeInteraction;
      const startRect = activeInteraction.startRect;
      const nextRect = { ...startRect };
      const isCorner = handle === 'nw' || handle === 'ne' || handle === 'sw' || handle === 'se';
      const preserveAspectRatio = isCorner && pointer.shiftKey;

      if (preserveAspectRatio) {
        const aspect = startRect.width / startRect.height;
        let newWidth: number;
        let newHeight: number;
        if (Math.abs(deltaX) * startRect.height >= Math.abs(deltaY) * startRect.width) {
          if (handle === 'se' || handle === 'ne') {
            newWidth = startRect.width + deltaX;
          } else {
            newWidth = startRect.width - deltaX;
          }
          newHeight = newWidth / aspect;
        } else {
          if (handle === 'se' || handle === 'sw') {
            newHeight = startRect.height + deltaY;
          } else {
            newHeight = startRect.height - deltaY;
          }
          newWidth = newHeight * aspect;
        }
        nextRect.width = newWidth;
        nextRect.height = newHeight;
        if (handle === 'nw') {
          nextRect.x = startRect.x + (startRect.width - newWidth);
          nextRect.y = startRect.y + (startRect.height - newHeight);
        } else if (handle === 'ne') {
          nextRect.y = startRect.y + (startRect.height - newHeight);
        } else if (handle === 'sw') {
          nextRect.x = startRect.x + (startRect.width - newWidth);
        }
      } else {
        if (handle === 'e' || handle === 'ne' || handle === 'se') {
          nextRect.width = startRect.width + deltaX;
        }
        if (handle === 'w' || handle === 'nw' || handle === 'sw') {
          nextRect.x = startRect.x + deltaX;
          nextRect.width = startRect.width - deltaX;
        }
        if (handle === 's' || handle === 'sw' || handle === 'se') {
          nextRect.height = startRect.height + deltaY;
        }
        if (handle === 'n' || handle === 'nw' || handle === 'ne') {
          nextRect.y = startRect.y + deltaY;
          nextRect.height = startRect.height - deltaY;
        }
      }

      const parentRect = targetNode.parentId
        ? currentAbsoluteRects.get(targetNode.parentId) ?? null
        : null;
      const boundsWidth = parentRect?.width ?? stageWidth;
      const boundsHeight = parentRect?.height ?? stageHeight;
      updateNodeRectsForViewport(
        new Map([
          [
            activeInteraction.nodeId,
            preserveAspectRatio
              ? clampAspectRect(nextRect, startRect, handle, boundsWidth, boundsHeight)
              : clampRect(nextRect, boundsWidth, boundsHeight),
          ],
        ]),
        activeInteraction.viewport,
        'transient',
      );
    }

    function flushPendingPointerMove() {
      if (pointerMoveFrameRef.current !== null) {
        window.cancelAnimationFrame(pointerMoveFrameRef.current);
        pointerMoveFrameRef.current = null;
      }
      const pendingPointerMove = pendingPointerMoveRef.current;
      pendingPointerMoveRef.current = null;
      if (pendingPointerMove) {
        processPointerMove(pendingPointerMove);
      }
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerId !== activeInteraction.pointerId) return;
      if (canceledInteractionPointerIdsRef.current.has(activeInteraction.pointerId)) return;

      pendingPointerMoveRef.current = {
        pointerId: event.pointerId,
        clientX: event.clientX,
        clientY: event.clientY,
        shiftKey: event.shiftKey,
      };

      if (pointerMoveFrameRef.current !== null) return;
      pointerMoveFrameRef.current = window.requestAnimationFrame(() => {
        pointerMoveFrameRef.current = null;
        const pendingPointerMove = pendingPointerMoveRef.current;
        pendingPointerMoveRef.current = null;
        if (pendingPointerMove) {
          processPointerMove(pendingPointerMove);
        }
      });
    }

    function handlePointerUp(event: PointerEvent) {
      if (event.pointerId !== activeInteraction.pointerId) return;
      flushPendingPointerMove();
      if (canceledInteractionPointerIdsRef.current.delete(activeInteraction.pointerId)) {
        interactionGeometrySnapshotRef.current = null;
        moveActivationRef.current = null;
        return;
      }
      const activeMoveActivation = moveActivationRef.current?.pointerId === activeInteraction.pointerId
        ? moveActivationRef.current
        : null;
      if (activeInteraction.type === 'move' && !activeMoveActivation?.active) {
        cancelMutationSession();
        interactionGeometrySnapshotRef.current = null;
        moveActivationRef.current = null;
        setHoveredContainerId(null);
        setInteraction(null);
        setActiveViewport(null);
        setInteractionPointer(null);
        setGuides([]);
        return;
      }
      const currentHoveredContainerId = (() => {
        if (activeInteraction.type !== 'move' || activeInteraction.nodeIds.length !== 1) return null;
        const nodeId = activeInteraction.nodeIds[0];
        const currentDocument = useBuilderCanvasStore.getState().document;
        const allNodes = currentDocument?.nodes ?? [];
        const latestNodesById = getCanvasNodesById(allNodes);
        const movedNode = latestNodesById.get(nodeId);
        if (!movedNode) return null;
        const movedRect = resolveCanvasNodeAbsoluteRectForViewport(
          movedNode,
          latestNodesById,
          activeInteraction.viewport,
        );
        const cx = movedRect.x + movedRect.width / 2;
        const cy = movedRect.y + movedRect.height / 2;
        return allNodes.find(
          (node) =>
            isContainerLikeKind(node.kind) &&
            node.id !== nodeId &&
            node.visible &&
            (() => {
              const rect = resolveCanvasNodeAbsoluteRectForViewport(
                node,
                latestNodesById,
                activeInteraction.viewport,
              );
              return (
                cx >= rect.x
                && cx <= rect.x + rect.width
                && cy >= rect.y
                && cy <= rect.y + rect.height
              );
            })(),
        )?.id ?? null;
      })();
      const willReparent = Boolean(
        currentHoveredContainerId
        && activeInteraction.type === 'move'
        && activeInteraction.nodeIds.length === 1
        && currentHoveredContainerId !== activeInteraction.startParentId,
      );
      if (willReparent && activeInteraction.type === 'move' && activeInteraction.viewport !== 'desktop') {
        cancelMutationSession();
        onToast?.('Reparenting is desktop-only in this build', 'error');
      } else {
        if (
          willReparent
          && activeInteraction.type === 'move'
          && activeInteraction.viewport === 'desktop'
          && currentHoveredContainerId
        ) {
          moveNodeIntoContainer(activeInteraction.nodeIds[0], currentHoveredContainerId);
        }
        if (activeInteraction.type !== 'pan') {
          commitMutationSession();
        }
      }
      setHoveredContainerId(null);
      interactionGeometrySnapshotRef.current = null;
      moveActivationRef.current = null;
      setInteraction(null);
      setActiveViewport(null);
      setInteractionPointer(null);
      setGuides([]);
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      if (pointerMoveFrameRef.current !== null) {
        window.cancelAnimationFrame(pointerMoveFrameRef.current);
        pointerMoveFrameRef.current = null;
      }
      pendingPointerMoveRef.current = null;
    };
  }, [
    cancelMutationSession,
    commitMutationSession,
    gridSnapSize,
    interaction,
    moveNodeIntoContainer,
    onToast,
    referenceGuides,
    setOverlapPicker,
    setActiveViewport,
    setZoomState,
    stageHeight,
    stageWidth,
    updateNodeRectsForViewport,
    viewportRef,
    zoomState.zoom,
  ]);

  const startPan = useCallback((event: React.PointerEvent) => {
    setContextMenu(null);
    setOverlapPicker(null);
    setSelectionBox(null);
    interactionGeometrySnapshotRef.current = null;
    moveActivationRef.current = null;
    setInteraction({
      type: 'pan',
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      startPanX: zoomState.panX,
      startPanY: zoomState.panY,
    });
  }, [setContextMenu, setOverlapPicker, setSelectionBox, zoomState.panX, zoomState.panY]);

  const startMove = useCallback((nodeId: string, event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu(null);
    setOverlapPicker((current) => (current?.mode === 'list' ? null : current));
    const nodeIds = selectedNodeIds.includes(nodeId) && selectedNodeIds.length > 0
      ? selectedNodeIds.filter((selectedId) => !nodes.find((candidate) => candidate.id === selectedId)?.locked)
      : [nodeId];
    if (nodeIds.length === 0) return;
    const interactionViewport = currentViewport;
    const startRects = Object.fromEntries(
      nodes
        .filter((node) => nodeIds.includes(node.id))
        .map((node) => [node.id, resolveViewportRect(node, interactionViewport)]),
    );
    const startAbsoluteRects = Object.fromEntries(
      nodes
        .filter((node) => nodeIds.includes(node.id))
        .map((node) => [node.id, absoluteRectById.get(node.id) ?? resolveViewportRect(node, interactionViewport)]),
    );
    const movingNode = nodesById.get(nodeId);
    const moveCandidates = nodeIds.length === 1 && movingNode
      ? createMoveInteractionCandidates({
          activeGroupId,
          absoluteRectById,
          movingNode,
          movingNodeIds: new Set(nodeIds),
          nodes: visibleNodes,
          snapBounds: {
            x: 0,
            y: 0,
            width: stageWidth,
            height: stageHeight,
          },
          viewport: interactionViewport,
        })
      : { snapRects: [], containerHitRects: [] };
    setSelectedNodeIds(nodeIds, nodeId);
    setActiveViewport(interactionViewport);
    interactionGeometrySnapshotRef.current = captureInteractionGeometry();
    beginMutationSession();
    moveActivationRef.current = { pointerId: event.pointerId, active: false };
    setInteractionPointer({
      x: event.clientX - (viewportRef.current?.getBoundingClientRect().left ?? 0),
      y: event.clientY - (viewportRef.current?.getBoundingClientRect().top ?? 0),
    });
    setInteraction({
      type: 'move',
      nodeId,
      nodeIds,
      viewport: interactionViewport,
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      startParentId: nodesById.get(nodeId)?.parentId ?? null,
      startRects,
      startAbsoluteRects,
      snapRects: moveCandidates.snapRects,
      containerHitRects: moveCandidates.containerHitRects,
    });
  }, [
    absoluteRectById,
    activeGroupId,
    beginMutationSession,
    captureInteractionGeometry,
    currentViewport,
    nodes,
    nodesById,
    selectedNodeIds,
    setContextMenu,
    setOverlapPicker,
    setActiveViewport,
    setSelectedNodeIds,
    stageHeight,
    stageWidth,
    viewportRef,
    visibleNodes,
  ]);

  const startResize = useCallback((nodeId: string, handle: ResizeHandle, event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setOverlapPicker(null);
    moveActivationRef.current = null;
    const targetNode = nodesById.get(nodeId);
    if (!targetNode) return;
    const interactionViewport = currentViewport;
    setSelectedNodeId(nodeId);
    setActiveViewport(interactionViewport);
    interactionGeometrySnapshotRef.current = captureInteractionGeometry();
    beginMutationSession();
    setInteractionPointer({
      x: event.clientX - (viewportRef.current?.getBoundingClientRect().left ?? 0),
      y: event.clientY - (viewportRef.current?.getBoundingClientRect().top ?? 0),
    });
    setInteraction({
      type: 'resize',
      nodeId,
      handle,
      viewport: interactionViewport,
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      startRect: resolveViewportRect(targetNode, interactionViewport),
      startAbsoluteRect: absoluteRectById.get(nodeId) ?? resolveViewportRect(targetNode, interactionViewport),
    });
  }, [
    absoluteRectById,
    beginMutationSession,
    captureInteractionGeometry,
    currentViewport,
    nodesById,
    setOverlapPicker,
    setActiveViewport,
    setSelectedNodeId,
    viewportRef,
  ]);

  return {
    guides,
    hoveredContainerId,
    interaction,
    interactionPointer,
    isSpacePressed,
    startMove,
    startPan,
    startResize,
  };
}
