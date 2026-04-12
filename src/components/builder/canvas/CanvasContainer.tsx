'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AlignmentGuides from '@/components/builder/canvas/AlignmentGuides';
import CanvasNode, { type ResizeHandle } from '@/components/builder/canvas/CanvasNode';
import ContextMenu from '@/components/builder/canvas/ContextMenu';
import SelectionBox from '@/components/builder/canvas/SelectionBox';
import {
  createCanvasNodeTemplate,
  useBuilderCanvasStore,
} from '@/lib/builder/canvas/store';
import { builderCanvasNodeKinds, type BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createShortcutHandler, NUDGE_LARGE_PX, NUDGE_PX, type CanvasAction } from '@/lib/builder/canvas/shortcuts';
import { type AlignmentGuide, computeSnap, type Rect } from '@/lib/builder/canvas/snap';
import {
  createDefaultZoomState,
  screenToCanvas,
  zoomIn as stepZoomIn,
  zoomLabel,
  zoomOut as stepZoomOut,
  zoomTo,
  zoomToFit,
  type ZoomState,
} from '@/lib/builder/canvas/zoom';
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
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const {
    selectedNodeId,
    selectedNodeIds,
    canUndo,
    canRedo,
    clipboardHasContent,
    setSelectedNodeId,
    setSelectedNodeIds,
    toggleNodeSelection,
    setDraftSaveState,
    beginMutationSession,
    commitMutationSession,
    undo,
    redo,
    copySelectedNodesToClipboard,
    cutSelectedNodesToClipboard,
    pasteClipboardNodes,
    alignSelectedNodes,
    toggleSelectedNodeLock,
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
  const [guides, setGuides] = useState<AlignmentGuide[]>([]);
  const [zoomState, setZoomState] = useState<ZoomState>(() => createDefaultZoomState());

  const nodes = useBuilderCanvasStore((state) => state.document?.nodes ?? []);
  const visibleNodes = useMemo(
    () => nodes.filter((node) => node.visible),
    [nodes],
  );
  const selectedNodes = useMemo(
    () => nodes.filter((node) => selectedNodeIds.includes(node.id)),
    [nodes, selectedNodeIds],
  );
  const hasUnlockedSelection = selectedNodes.some((node) => !node.locked);

  const fitCanvas = useCallback(() => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    setZoomState((currentState) =>
      zoomToFit(currentState, STAGE_WIDTH, STAGE_HEIGHT, rect.width - 24, rect.height - 24));
  }, []);

  useEffect(() => {
    fitCanvas();
    window.addEventListener('resize', fitCanvas);
    return () => window.removeEventListener('resize', fitCanvas);
  }, [fitCanvas]);

  useEffect(() => {
    if (!contextMenu) return undefined;

    function handleWindowScroll() {
      setContextMenu(null);
    }

    window.addEventListener('scroll', handleWindowScroll, true);
    window.addEventListener('resize', handleWindowScroll);
    return () => {
      window.removeEventListener('scroll', handleWindowScroll, true);
      window.removeEventListener('resize', handleWindowScroll);
    };
  }, [contextMenu]);

  useEffect(() => {
    function dispatch(action: NonNullable<CanvasAction>) {
      switch (action) {
        case 'undo':
          undo();
          break;
        case 'redo':
          redo();
          break;
        case 'delete':
          deleteSelectedNode();
          break;
        case 'duplicate':
          duplicateSelectedNode();
          break;
        case 'selectAll': {
          const allNodes = useBuilderCanvasStore.getState().document?.nodes.filter((node) => node.visible) ?? [];
          setSelectedNodeIds(allNodes.map((node) => node.id), allNodes[allNodes.length - 1]?.id ?? null);
          break;
        }
        case 'deselect':
          setContextMenu(null);
          setSelectedNodeIds([], null);
          break;
        case 'copy':
          copySelectedNodesToClipboard();
          break;
        case 'paste':
          pasteClipboardNodes();
          break;
        case 'cut':
          cutSelectedNodesToClipboard();
          break;
        case 'zoomIn':
          setZoomState((currentState) => stepZoomIn(currentState));
          break;
        case 'zoomOut':
          setZoomState((currentState) => stepZoomOut(currentState));
          break;
        case 'zoomReset':
          fitCanvas();
          break;
        case 'bringForward':
          bringSelectedNodeForward();
          break;
        case 'sendBackward':
          sendSelectedNodeBackward();
          break;
        case 'bringToFront':
          bringSelectedNodeToFront();
          break;
        case 'sendToBack':
          sendSelectedNodeToBack();
          break;
        case 'nudgeUp':
          nudgeSelectedNode(0, -NUDGE_PX);
          break;
        case 'nudgeDown':
          nudgeSelectedNode(0, NUDGE_PX);
          break;
        case 'nudgeLeft':
          nudgeSelectedNode(-NUDGE_PX, 0);
          break;
        case 'nudgeRight':
          nudgeSelectedNode(NUDGE_PX, 0);
          break;
        case 'nudgeUpLarge':
          nudgeSelectedNode(0, -NUDGE_LARGE_PX);
          break;
        case 'nudgeDownLarge':
          nudgeSelectedNode(0, NUDGE_LARGE_PX);
          break;
        case 'nudgeLeftLarge':
          nudgeSelectedNode(-NUDGE_LARGE_PX, 0);
          break;
        case 'nudgeRightLarge':
          nudgeSelectedNode(NUDGE_LARGE_PX, 0);
          break;
        case 'group':
        case 'ungroup':
          break;
      }
    }

    const handler = createShortcutHandler(dispatch);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [
    bringSelectedNodeForward,
    bringSelectedNodeToFront,
    copySelectedNodesToClipboard,
    cutSelectedNodesToClipboard,
    deleteSelectedNode,
    duplicateSelectedNode,
    fitCanvas,
    nudgeSelectedNode,
    pasteClipboardNodes,
    redo,
    sendSelectedNodeBackward,
    sendSelectedNodeToBack,
    setSelectedNodeIds,
    undo,
  ]);

  useEffect(() => {
    if (!interaction) return undefined;
    const activeInteraction = interaction;

    function handlePointerMove(event: PointerEvent) {
      const deltaX = (event.clientX - activeInteraction.originX) / zoomState.zoom;
      const deltaY = (event.clientY - activeInteraction.originY) / zoomState.zoom;
      if (activeInteraction.type === 'move') {
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
              .filter((node) => node.id !== nodeId && node.visible)
              .map((node) => node.rect);
            const { snappedRect, guides: nextGuides } = computeSnap(tentative, otherRects, 0, {
              width: STAGE_WIDTH,
              height: STAGE_HEIGHT,
            });
            setGuides(nextGuides);
            updateSelectedNodes(activeInteraction.nodeIds, (node) => ({
              ...node,
              rect: clampRect(snappedRect),
            }), 'transient');
            return;
          }
        }
        setGuides([]);
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

      setGuides([]);
      updateNode(activeInteraction.nodeId, (node) => {
        const { handle } = activeInteraction;
        const startRect = activeInteraction.startRect;
        const nextRect = { ...startRect };
        const isCorner = handle === 'nw' || handle === 'ne' || handle === 'sw' || handle === 'se';

        if (isCorner) {
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
        setGuides([]);
        commitMutationSession();
      }
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [commitMutationSession, interaction, updateNode, updateSelectedNodes, zoomState.zoom]);

  const resolveStagePosition = useCallback((clientX: number, clientY: number): { x: number; y: number } => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return { x: 48, y: 48 };
    const nextPoint = screenToCanvas(clientX - rect.left, clientY - rect.top, zoomState);
    return {
      x: Math.max(0, Math.min(STAGE_WIDTH - 80, Math.round(nextPoint.x))),
      y: Math.max(0, Math.min(STAGE_HEIGHT - 48, Math.round(nextPoint.y))),
    };
  }, [zoomState]);

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
  }, [resolveStagePosition, selectedNodeId, selectedNodeIds, selectionBox, setSelectedNodeIds, visibleNodes]);

  const selectionBoxRect = useMemo(() => {
    if (!selectionBox) return null;
    return {
      left: Math.min(selectionBox.originX, selectionBox.currentX),
      top: Math.min(selectionBox.originY, selectionBox.currentY),
      width: Math.abs(selectionBox.currentX - selectionBox.originX),
      height: Math.abs(selectionBox.currentY - selectionBox.originY),
    };
  }, [selectionBox]);

  const dragGhostRects = useMemo(() => {
    if (!interaction) return [];
    if (interaction.type === 'move') {
      return Object.values(interaction.startRects);
    }
    return [interaction.startRect];
  }, [interaction]);

  const contextMenuTitle = selectedNodeIds.length > 1
    ? `${selectedNodeIds.length} selected`
    : contextMenu?.nodeId ?? 'Context menu';

  return (
    <div className={styles.stageSurface}>
      <div
        ref={viewportRef}
        className={styles.stageViewport}
        onWheel={(event) => {
          if (!event.metaKey && !event.ctrlKey) return;
          event.preventDefault();
          setZoomState((currentState) => (
            event.deltaY < 0 ? stepZoomIn(currentState) : stepZoomOut(currentState)
          ));
        }}
      >
        <div
          className={styles.stageTransform}
          style={{
            transform: `translate(${zoomState.panX}px, ${zoomState.panY}px) scale(${zoomState.zoom})`,
          }}
        >
          <div
            ref={containerRef}
            className={styles.stage}
            role="application"
            aria-label="Canvas editor"
            aria-roledescription="freeform canvas"
            onPointerDown={(event) => {
              setContextMenu(null);
              if (event.target === event.currentTarget) {
                const point = resolveStagePosition(event.clientX, event.clientY);
                setSelectionBox({
                  pointerId: event.pointerId,
                  originX: point.x,
                  originY: point.y,
                  currentX: point.x,
                  currentY: point.y,
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
              setDraftSaveState('saving');
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
            <AlignmentGuides guides={guides} />
            {dragGhostRects.map((rect, index) => (
              <div
                key={`ghost-${index}`}
                className={styles.dragGhost}
                style={{
                  left: `${rect.x}px`,
                  top: `${rect.y}px`,
                  width: `${rect.width}px`,
                  height: `${rect.height}px`,
                }}
              />
            ))}
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
                  const keepMultiSelection = selectedNodeIds.length > 1 && selectedNodeIds.includes(nodeId);
                  if (!keepMultiSelection) {
                    setSelectedNodeId(nodeId);
                  }
                  const rect = viewportRef.current?.getBoundingClientRect();
                  const width = rect?.width ?? STAGE_WIDTH;
                  const height = rect?.height ?? STAGE_HEIGHT;
                  const rawX = rect ? event.clientX - rect.left : event.clientX;
                  const rawY = rect ? event.clientY - rect.top : event.clientY;
                  setContextMenu({
                    nodeId,
                    x: Math.max(32, Math.min(width - 236, rawX)),
                    y: Math.max(32, Math.min(height - 420, rawY)),
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
            {visibleNodes.length === 0 ? (
              <div className={styles.emptyCanvas}>
                <strong>요소를 드래그해서 추가하세요</strong>
                <span>Text, image, button, heading, container, section 을 자유 캔버스에 바로 배치할 수 있습니다.</span>
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

        {contextMenu ? (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            title={contextMenuTitle}
            actions={[
              {
                key: 'copy',
                label: 'Copy',
                title: '복사 (Cmd-C)',
                disabled: selectedNodeIds.length === 0,
                onSelect: copySelectedNodesToClipboard,
              },
              {
                key: 'cut',
                label: 'Cut',
                title: '잘라내기 (Cmd-X)',
                disabled: !hasUnlockedSelection,
                onSelect: cutSelectedNodesToClipboard,
              },
              {
                key: 'paste',
                label: 'Paste',
                title: '붙여넣기 (Cmd-V)',
                disabled: !clipboardHasContent,
                onSelect: pasteClipboardNodes,
              },
              {
                key: 'duplicate',
                label: 'Duplicate',
                title: '복제 (Cmd-D)',
                disabled: !hasUnlockedSelection,
                onSelect: duplicateSelectedNode,
              },
              {
                key: 'delete',
                label: 'Delete',
                title: '삭제 (Delete)',
                disabled: !hasUnlockedSelection,
                onSelect: deleteSelectedNode,
              },
              {
                key: 'lock',
                label: selectedNodes.every((node) => node.locked) ? 'Unlock selection' : 'Lock selection',
                title: '선택 잠금 토글',
                disabled: selectedNodeIds.length === 0,
                onSelect: toggleSelectedNodeLock,
              },
              {
                key: 'bring-front',
                label: 'Bring to front',
                title: '맨 앞으로 가져오기',
                disabled: selectedNodeIds.length !== 1 || !hasUnlockedSelection,
                onSelect: bringSelectedNodeToFront,
              },
              {
                key: 'bring-forward',
                label: 'Bring forward',
                title: '한 단계 앞으로',
                disabled: selectedNodeIds.length !== 1 || !hasUnlockedSelection,
                onSelect: bringSelectedNodeForward,
              },
              {
                key: 'send-backward',
                label: 'Send backward',
                title: '한 단계 뒤로',
                disabled: selectedNodeIds.length !== 1 || !hasUnlockedSelection,
                onSelect: sendSelectedNodeBackward,
              },
              {
                key: 'send-back',
                label: 'Send to back',
                title: '맨 뒤로 보내기',
                disabled: selectedNodeIds.length !== 1 || !hasUnlockedSelection,
                onSelect: sendSelectedNodeToBack,
              },
              {
                key: 'align-left',
                label: 'Align left',
                title: '왼쪽 정렬',
                disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
                onSelect: () => alignSelectedNodes('left'),
              },
              {
                key: 'align-center',
                label: 'Align center',
                title: '가운데 정렬',
                disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
                onSelect: () => alignSelectedNodes('center'),
              },
              {
                key: 'align-right',
                label: 'Align right',
                title: '오른쪽 정렬',
                disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
                onSelect: () => alignSelectedNodes('right'),
              },
              {
                key: 'align-top',
                label: 'Align top',
                title: '상단 정렬',
                disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
                onSelect: () => alignSelectedNodes('top'),
              },
              {
                key: 'align-middle',
                label: 'Align middle',
                title: '중앙 정렬',
                disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
                onSelect: () => alignSelectedNodes('middle'),
              },
              {
                key: 'align-bottom',
                label: 'Align bottom',
                title: '하단 정렬',
                disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
                onSelect: () => alignSelectedNodes('bottom'),
              },
            ]}
            onClose={() => setContextMenu(null)}
          />
        ) : null}
      </div>

      <div className={styles.zoomDock}>
        <button
          type="button"
          className={styles.toolbarButton}
          title="축소 (Cmd--)"
          onClick={() => setZoomState((currentState) => stepZoomOut(currentState))}
        >
          -
        </button>
        <span className={styles.zoomLabel}>{zoomLabel(zoomState)}</span>
        <input
          className={styles.zoomSlider}
          type="range"
          min={25}
          max={400}
          step={5}
          value={Math.round(zoomState.zoom * 100)}
          onChange={(event) => setZoomState((currentState) => zoomTo(currentState, Number(event.target.value) / 100))}
        />
        <button
          type="button"
          className={styles.toolbarButton}
          title="확대 (Cmd-+)"
          onClick={() => setZoomState((currentState) => stepZoomIn(currentState))}
        >
          +
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          title="100%"
          onClick={() => setZoomState((currentState) => zoomTo(currentState, 1))}
        >
          100%
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          title="화면에 맞추기"
          onClick={fitCanvas}
        >
          Fit
        </button>
      </div>
    </div>
  );
}
