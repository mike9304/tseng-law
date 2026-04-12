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

export default function CanvasContainer() {
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
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable)) {
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        redo();
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'd') {
        event.preventDefault();
        duplicateSelectedNode();
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'a') {
        event.preventDefault();
        setSelectedNodeIds(visibleNodes.map((node) => node.id), visibleNodes[visibleNodes.length - 1]?.id ?? null);
        return;
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        deleteSelectedNode();
        return;
      }

      const step = event.shiftKey ? 10 : 1;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        nudgeSelectedNode(-step, 0);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        nudgeSelectedNode(step, 0);
      } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        nudgeSelectedNode(0, -step);
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        nudgeSelectedNode(0, step);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteSelectedNode, duplicateSelectedNode, nudgeSelectedNode, redo, setSelectedNodeIds, undo, visibleNodes]);

  useEffect(() => {
    if (!interaction) return undefined;
    const activeInteraction = interaction;

    function handlePointerMove(event: PointerEvent) {
      const deltaX = event.clientX - activeInteraction.originX;
      const deltaY = event.clientY - activeInteraction.originY;
      if (activeInteraction.type === 'move') {
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
        const nextRect = { ...activeInteraction.startRect };
        if (handle === 'e') {
          nextRect.width = activeInteraction.startRect.width + deltaX;
        }
        if (handle === 'w') {
          nextRect.x = activeInteraction.startRect.x + deltaX;
          nextRect.width = activeInteraction.startRect.width - deltaX;
        }
        if (handle === 's') {
          nextRect.height = activeInteraction.startRect.height + deltaY;
        }
        if (handle === 'n') {
          nextRect.y = activeInteraction.startRect.y + deltaY;
          nextRect.height = activeInteraction.startRect.height - deltaY;
        }
        if (handle === 'se' || handle === 'ne') {
          nextRect.width = activeInteraction.startRect.width + deltaX;
        }
        if (handle === 'se' || handle === 'sw') {
          nextRect.height = activeInteraction.startRect.height + deltaY;
        }
        if (handle === 'nw' || handle === 'sw') {
          nextRect.x = activeInteraction.startRect.x + deltaX;
          nextRect.width = activeInteraction.startRect.width - deltaX;
        }
        if (handle === 'nw' || handle === 'ne') {
          nextRect.y = activeInteraction.startRect.y + deltaY;
          nextRect.height = activeInteraction.startRect.height - deltaY;
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
                disabled: selectedNodeIds.length !== 1 || nodes.find((node) => node.id === contextMenu.nodeId)?.locked,
                onSelect: bringSelectedNodeToFront,
              },
              {
                key: 'bring-forward',
                label: 'Bring forward',
                disabled: selectedNodeIds.length !== 1 || nodes.find((node) => node.id === contextMenu.nodeId)?.locked,
                onSelect: bringSelectedNodeForward,
              },
              {
                key: 'send-backward',
                label: 'Send backward',
                disabled: selectedNodeIds.length !== 1 || nodes.find((node) => node.id === contextMenu.nodeId)?.locked,
                onSelect: sendSelectedNodeBackward,
              },
              {
                key: 'send-back',
                label: 'Send to back',
                disabled: selectedNodeIds.length !== 1 || nodes.find((node) => node.id === contextMenu.nodeId)?.locked,
                onSelect: sendSelectedNodeToBack,
              },
            ]}
            onClose={() => setContextMenu(null)}
          />
        ) : null}
        {visibleNodes.length === 0 ? (
          <div className={styles.emptyCanvas}>
            <strong>Canvas is empty</strong>
            <span>Drag a text, image, or button node from the catalog to begin.</span>
          </div>
        ) : null}

        <div className={styles.canvasToolbar}>
          <button
            type="button"
            className={styles.toolbarButton}
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
