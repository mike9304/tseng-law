'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import CanvasNode, { type ResizeHandle } from '@/components/builder/canvas/CanvasNode';
import ContextMenu from '@/components/builder/canvas/ContextMenu';
import SelectionBox from '@/components/builder/canvas/SelectionBox';
import {
  createCanvasNodeTemplate,
  useBuilderCanvasStore,
} from '@/lib/builder/canvas/store';
import { builderCanvasNodeKinds, type BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createShortcutHandler, NUDGE_PX, NUDGE_LARGE_PX, type CanvasAction } from '@/lib/builder/canvas/shortcuts';
import { computeSnap, type Rect } from '@/lib/builder/canvas/snap';
import styles from './SandboxPage.module.css';

type InteractionState =
  | {
      type: 'move';
      nodeId: string;
      nodeIds: string[];
      pointerId: number;
      originX: number;
      originY: number;
      startRects: Record<string, BuilderCanvasNode['rect']>;
    }
  | {
      type: 'resize';
      nodeId: string;
      handle: ResizeHandle;
      pointerId: number;
      originX: number;
      originY: number;
      startRect: BuilderCanvasNode['rect'];
    }
  | null;

type SelectionBoxState = {
  pointerId: number;
  originX: number;
  originY: number;
  currentX: number;
  currentY: number;
  additive: boolean;
};

type ContextMenuState = {
  nodeId: string;
  x: number;
  y: number;
};

const STAGE_WIDTH = 1280;
const STAGE_HEIGHT = 880;
const MIN_WIDTH = 72;
const MIN_HEIGHT = 40;

function clampRect(rect: BuilderCanvasNode['rect']): BuilderCanvasNode['rect'] {
  const width = Math.max(MIN_WIDTH, Math.min(STAGE_WIDTH, Math.round(rect.width)));
  const height = Math.max(MIN_HEIGHT, Math.min(STAGE_HEIGHT, Math.round(rect.height)));
  const x = Math.max(0, Math.min(STAGE_WIDTH - width, Math.round(rect.x)));
  const y = Math.max(0, Math.min(STAGE_HEIGHT - height, Math.round(rect.y)));
  return { x, y, width, height };
}

export default function CanvasContainer({
  onRequestAssetLibrary,
}: {
  onRequestAssetLibrary?: (nodeId: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const {
    selectedNodeId,
    selectedNodeIds,
    canUndo,
    canRedo,
    setSelectedNodeId,
    setSelectedNodeIds,
    toggleNodeSelection,
    beginMutationSession,
    commitMutationSession,
    undo,
    redo,
    addNode,
    duplicateSelectedNode,
    bringSelectedNodeForward,
    sendSelectedNodeBackward,
    bringSelectedNodeToFront,
    sendSelectedNodeToBack,
    updateSelectedNodes,
    updateNode,
    updateNodeContent,
    deleteSelectedNode,
    nudgeSelectedNode,
  } = useBuilderCanvasStore();
  const [interaction, setInteraction] = useState<InteractionState>(null);
  const [selectionBox, setSelectionBox] = useState<SelectionBoxState | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const nodes = useBuilderCanvasStore((state) => state.document?.nodes ?? []);
  const visibleNodes = useMemo(
    () => nodes.filter((node) => node.visible),
    [nodes],
  );

  useEffect(() => {
    if (!contextMenu) return undefined;

    function handleWindowScroll() {
      setContextMenu(null);
    }

    window.addEventListener('scroll', handleWindowScroll, true);
    return () => window.removeEventListener('scroll', handleWindowScroll, true);
  }, [contextMenu]);

  useEffect(() => {
    function dispatch(action: NonNullable<CanvasAction>) {
      switch (action) {
        case 'undo': undo(); break;
        case 'redo': redo(); break;
        case 'delete': deleteSelectedNode(); break;
        case 'duplicate': duplicateSelectedNode(); break;
        case 'selectAll': {
          const allNodes = useBuilderCanvasStore.getState().document?.nodes.filter((n) => n.visible) ?? [];
          setSelectedNodeIds(allNodes.map((n) => n.id), allNodes[allNodes.length - 1]?.id ?? null);
          break;
        }
        case 'deselect': setSelectedNodeIds([], null); break;
        case 'bringForward': bringSelectedNodeForward(); break;
        case 'sendBackward': sendSelectedNodeBackward(); break;
        case 'bringToFront': bringSelectedNodeToFront(); break;
        case 'sendToBack': sendSelectedNodeToBack(); break;
        case 'nudgeUp': nudgeSelectedNode(0, -NUDGE_PX); break;
        case 'nudgeDown': nudgeSelectedNode(0, NUDGE_PX); break;
        case 'nudgeLeft': nudgeSelectedNode(-NUDGE_PX, 0); break;
        case 'nudgeRight': nudgeSelectedNode(NUDGE_PX, 0); break;
        case 'nudgeUpLarge': nudgeSelectedNode(0, -NUDGE_LARGE_PX); break;
        case 'nudgeDownLarge': nudgeSelectedNode(0, NUDGE_LARGE_PX); break;
        case 'nudgeLeftLarge': nudgeSelectedNode(-NUDGE_LARGE_PX, 0); break;
        case 'nudgeRightLarge': nudgeSelectedNode(NUDGE_LARGE_PX, 0); break;
      }
    }

    const handler = createShortcutHandler(dispatch);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [bringSelectedNodeForward, bringSelectedNodeToFront, deleteSelectedNode, duplicateSelectedNode, nudgeSelectedNode, redo, sendSelectedNodeBackward, sendSelectedNodeToBack, setSelectedNodeIds, undo]);

  useEffect(() => {
    if (!interaction) return undefined;
    const activeInteraction = interaction;

    function handlePointerMove(event: PointerEvent) {
      const deltaX = event.clientX - activeInteraction.originX;
      const deltaY = event.clientY - activeInteraction.originY;
      if (activeInteraction.type === 'move') {
        // Use snap engine for single-node moves
        if (activeInteraction.nodeIds.length === 1) {
          const nodeId = activeInteraction.nodeIds[0];
          const baseRect = activeInteraction.startRects[nodeId];
          if (baseRect) {
            const tentative: Rect = {
              x: baseRect.x + deltaX,
              y: baseRect.y + deltaY,
              width: baseRect.width,
              height: baseRect.height,
            };
            const currentNodes = useBuilderCanvasStore.getState().document?.nodes ?? [];
            const otherRects: Rect[] = currentNodes
              .filter((n) => n.id !== nodeId && n.visible)
              .map((n) => n.rect);
            const { snappedRect } = computeSnap(tentative, otherRects, 0, {
              width: STAGE_WIDTH,
              height: STAGE_HEIGHT,
            });
            updateSelectedNodes(activeInteraction.nodeIds, (node) => ({
              ...node,
              rect: clampRect(snappedRect),
            }), 'transient');
            return;
          }
        }
        updateSelectedNodes(activeInteraction.nodeIds, (node) => {
          const baseRect = activeInteraction.startRects[node.id] ?? node.rect;
          return {
            ...node,
            rect: clampRect({
              ...node.rect,
              x: baseRect.x + deltaX,
              y: baseRect.y + deltaY,
            }),
          };
        }, 'transient');
        return;
      }
      updateNode(activeInteraction.nodeId, (node) => {
        const { handle } = activeInteraction;
        const startRect = activeInteraction.startRect;
        const nextRect = { ...startRect };
        const isCorner = handle === 'nw' || handle === 'ne' || handle === 'sw' || handle === 'se';

        if (isCorner) {
          // Corner handles preserve aspect ratio (P1-03 acceptance)
          const aspect = startRect.width / startRect.height;
          // Determine the dominant delta to derive proportional sizing
          let newWidth: number;
          let newHeight: number;
          if (Math.abs(deltaX) * startRect.height >= Math.abs(deltaY) * startRect.width) {
            // Width-dominant
            if (handle === 'se' || handle === 'ne') {
              newWidth = startRect.width + deltaX;
            } else {
              newWidth = startRect.width - deltaX;
            }
            newHeight = newWidth / aspect;
          } else {
            // Height-dominant
            if (handle === 'se' || handle === 'sw') {
              newHeight = startRect.height + deltaY;
            } else {
              newHeight = startRect.height - deltaY;
            }
            newWidth = newHeight * aspect;
          }
          nextRect.width = newWidth;
          nextRect.height = newHeight;
          // Adjust origin for handles that anchor at right/bottom
          if (handle === 'nw') {
            nextRect.x = startRect.x + (startRect.width - newWidth);
            nextRect.y = startRect.y + (startRect.height - newHeight);
          } else if (handle === 'ne') {
            nextRect.y = startRect.y + (startRect.height - newHeight);
          } else if (handle === 'sw') {
            nextRect.x = startRect.x + (startRect.width - newWidth);
          }
          // 'se' keeps origin unchanged
        } else {
          // Edge handles: resize freely along one axis
          if (handle === 'e') {
            nextRect.width = startRect.width + deltaX;
          }
          if (handle === 'w') {
            nextRect.x = startRect.x + deltaX;
            nextRect.width = startRect.width - deltaX;
          }
          if (handle === 's') {
            nextRect.height = startRect.height + deltaY;
          }
          if (handle === 'n') {
            nextRect.y = startRect.y + deltaY;
            nextRect.height = startRect.height - deltaY;
          }
        }

        return {
          ...node,
          rect: clampRect(nextRect),
        };
      }, 'transient');
    }

    function handlePointerUp(event: PointerEvent) {
      if (event.pointerId === activeInteraction.pointerId) {
        setInteraction(null);
        commitMutationSession();
      }
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [commitMutationSession, interaction, updateNode, updateSelectedNodes]);

  useEffect(() => {
    if (!selectionBox) return undefined;
    const activeSelectionBox = selectionBox;

    function handlePointerMove(event: PointerEvent) {
      setSelectionBox((currentSelectionBox) => (
        currentSelectionBox
          ? {
              ...currentSelectionBox,
              currentX: event.clientX,
              currentY: event.clientY,
            }
          : currentSelectionBox
      ));
    }

    function handlePointerUp(event: PointerEvent) {
      if (event.pointerId !== activeSelectionBox.pointerId) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) {
        setSelectionBox(null);
        return;
      }

      const left = Math.min(activeSelectionBox.originX, activeSelectionBox.currentX) - rect.left;
      const top = Math.min(activeSelectionBox.originY, activeSelectionBox.currentY) - rect.top;
      const right = Math.max(activeSelectionBox.originX, activeSelectionBox.currentX) - rect.left;
      const bottom = Math.max(activeSelectionBox.originY, activeSelectionBox.currentY) - rect.top;

      const intersectingNodeIds = visibleNodes
        .filter((node) => (
          node.rect.x < right
          && node.rect.x + node.rect.width > left
          && node.rect.y < bottom
          && node.rect.y + node.rect.height > top
        ))
        .map((node) => node.id);
      const nextPrimaryNodeId = intersectingNodeIds[intersectingNodeIds.length - 1] ?? null;

      if (activeSelectionBox.additive) {
        setSelectedNodeIds([...new Set([...selectedNodeIds, ...intersectingNodeIds])], nextPrimaryNodeId ?? selectedNodeId);
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
  }, [selectedNodeId, selectedNodeIds, selectionBox, setSelectedNodeIds, visibleNodes]);

  function resolveStagePosition(clientX: number, clientY: number): { x: number; y: number } {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 48, y: 48 };
    return {
      x: Math.max(0, Math.min(STAGE_WIDTH - 80, Math.round(clientX - rect.left))),
      y: Math.max(0, Math.min(STAGE_HEIGHT - 48, Math.round(clientY - rect.top))),
    };
  }

  const selectionBoxRect = useMemo(() => {
    if (!selectionBox) return null;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      left: Math.min(selectionBox.originX, selectionBox.currentX) - rect.left,
      top: Math.min(selectionBox.originY, selectionBox.currentY) - rect.top,
      width: Math.abs(selectionBox.currentX - selectionBox.originX),
      height: Math.abs(selectionBox.currentY - selectionBox.originY),
    };
  }, [selectionBox]);

  return (
    <div className={styles.stageSurface}>
      <div
        ref={containerRef}
        className={styles.stage}
        role="application"
        aria-label="Canvas editor"
        aria-roledescription="freeform canvas"
        onPointerDown={(event) => {
          setContextMenu(null);
          if (event.target === event.currentTarget) {
            setSelectionBox({
              pointerId: event.pointerId,
              originX: event.clientX,
              originY: event.clientY,
              currentX: event.clientX,
              currentY: event.clientY,
              additive: event.metaKey || event.ctrlKey || event.shiftKey,
            });
            if (!event.metaKey && !event.ctrlKey && !event.shiftKey) {
              setSelectedNodeIds([], null);
            }
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'copy';
        }}
        onDrop={(event) => {
          event.preventDefault();
          const kind = event.dataTransfer.getData('application/x-builder-node-kind');
          if (!builderCanvasNodeKinds.includes(kind as (typeof builderCanvasNodeKinds)[number])) return;
          const position = resolveStagePosition(event.clientX, event.clientY);
          addNode(
            createCanvasNodeTemplate(
              kind as (typeof builderCanvasNodeKinds)[number],
              position.x,
              position.y,
              nodes.length,
            ),
          );
        }}
      >
        <div className={styles.topRuler} aria-hidden>
          {Array.from({ length: Math.floor(STAGE_WIDTH / 40) + 1 }).map((_, index) => (
            <span
              key={`top-${index}`}
              className={styles.rulerMark}
              style={{ left: `${index * 40}px` }}
            >
              {index * 40}
            </span>
          ))}
        </div>
        <div className={styles.leftRuler} aria-hidden>
          {Array.from({ length: Math.floor(STAGE_HEIGHT / 40) + 1 }).map((_, index) => (
            <span
              key={`left-${index}`}
              className={`${styles.rulerMark} ${styles.rulerMarkVertical}`}
              style={{ top: `${index * 40}px` }}
            >
              {index * 40}
            </span>
          ))}
        </div>
        <div className={styles.stageGrid} aria-hidden />
        {visibleNodes.map((node) => (
          <CanvasNode
            key={node.id}
            node={node}
            selected={selectedNodeIds.includes(node.id)}
            onSelect={(nodeId, additive) => {
              if (additive) {
                toggleNodeSelection(nodeId);
                return;
              }
              setSelectedNodeId(nodeId);
            }}
            onContextMenu={(nodeId, event) => {
              const selectedNode = nodes.find((candidate) => candidate.id === nodeId);
              if (!selectedNode) return;
              setSelectedNodeId(nodeId);
              const rect = containerRef.current?.getBoundingClientRect();
              const fallbackX = event.clientX;
              const fallbackY = event.clientY;
              const rawX = rect ? event.clientX - rect.left : fallbackX;
              const rawY = rect ? event.clientY - rect.top : fallbackY;
              setContextMenu({
                nodeId,
                x: Math.max(32, Math.min(STAGE_WIDTH - 212, rawX)),
                y: Math.max(32, Math.min(STAGE_HEIGHT - 240, rawY)),
              });
            }}
            onOpenAssetLibrary={onRequestAssetLibrary}
            onUpdateContent={(nodeId, content) => {
              updateNodeContent(nodeId, content, 'commit');
            }}
            onMoveStart={(nodeId, event) => {
              event.preventDefault();
              event.stopPropagation();
              setContextMenu(null);
              const nodeIds = selectedNodeIds.includes(nodeId) && selectedNodeIds.length > 0
                ? selectedNodeIds.filter((selectedId) => !nodes.find((candidate) => candidate.id === selectedId)?.locked)
                : [nodeId];
              if (nodeIds.length === 0) return;
              const startRects = Object.fromEntries(
                nodes
                  .filter((node) => nodeIds.includes(node.id))
                  .map((node) => [node.id, node.rect]),
              );
              setSelectedNodeIds(nodeIds, nodeId);
              beginMutationSession();
              setInteraction({
                type: 'move',
                nodeId,
                nodeIds,
                pointerId: event.pointerId,
                originX: event.clientX,
                originY: event.clientY,
                startRects,
              });
            }}
            onResizeStart={(nodeId, handle, event) => {
              event.preventDefault();
              event.stopPropagation();
              setSelectedNodeId(nodeId);
              beginMutationSession();
              setInteraction({
                type: 'resize',
                nodeId,
                handle,
                pointerId: event.pointerId,
                originX: event.clientX,
                originY: event.clientY,
                startRect: node.rect,
              });
            }}
          />
        ))}
        {selectionBoxRect ? <SelectionBox {...selectionBoxRect} /> : null}
        {contextMenu ? (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            title={contextMenu.nodeId}
            actions={[
              {
                key: 'bring-front',
                label: 'Bring to front',
                title: '맨 앞으로 가져오기',
                disabled: selectedNodeIds.length !== 1 || nodes.find((node) => node.id === contextMenu.nodeId)?.locked,
                onSelect: bringSelectedNodeToFront,
              },
              {
                key: 'bring-forward',
                label: 'Bring forward',
                title: '한 단계 앞으로',
                disabled: selectedNodeIds.length !== 1 || nodes.find((node) => node.id === contextMenu.nodeId)?.locked,
                onSelect: bringSelectedNodeForward,
              },
              {
                key: 'send-backward',
                label: 'Send backward',
                title: '한 단계 뒤로',
                disabled: selectedNodeIds.length !== 1 || nodes.find((node) => node.id === contextMenu.nodeId)?.locked,
                onSelect: sendSelectedNodeBackward,
              },
              {
                key: 'send-back',
                label: 'Send to back',
                title: '맨 뒤로 보내기',
                disabled: selectedNodeIds.length !== 1 || nodes.find((node) => node.id === contextMenu.nodeId)?.locked,
                onSelect: sendSelectedNodeToBack,
              },
            ]}
            onClose={() => setContextMenu(null)}
          />
        ) : null}
        {visibleNodes.length === 0 ? (
          <div className={styles.emptyCanvas}>
            <strong>캔버스가 비어 있습니다</strong>
            <span>좌측 카탈로그에서 요소를 드래그하여 추가하세요.</span>
          </div>
        ) : null}

        <div className={styles.canvasToolbar}>
          <button
            type="button"
            className={styles.toolbarButton}
            title="실행 취소 (Cmd-Z)"
            onClick={() => {
              setContextMenu(null);
              undo();
            }}
            disabled={!canUndo}
          >
            Undo
          </button>
          <button
            type="button"
            className={styles.toolbarButton}
            title="다시 실행 (Cmd-Shift-Z)"
            onClick={() => {
              setContextMenu(null);
              redo();
            }}
            disabled={!canRedo}
          >
            Redo
          </button>
        </div>
      </div>
    </div>
  );
}
