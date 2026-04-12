'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import CanvasNode, { type ResizeHandle } from '@/components/builder/canvas/CanvasNode';
import {
  createCanvasNodeTemplate,
  useBuilderCanvasStore,
} from '@/lib/builder/canvas/store';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import styles from './SandboxPage.module.css';

type InteractionState =
  | {
      type: 'move';
      nodeId: string;
      pointerId: number;
      originX: number;
      originY: number;
      startRect: BuilderCanvasNode['rect'];
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

function resolveCenteredNode(
  kind: 'text' | 'image' | 'button',
  existingCount: number,
): BuilderCanvasNode {
  const seed = createCanvasNodeTemplate(kind, 0, 0, existingCount);
  const cascadeOffset = (existingCount % 6) * 18;
  return {
    ...seed,
    rect: {
      ...seed.rect,
      x: Math.round((STAGE_WIDTH - seed.rect.width) / 2 + cascadeOffset),
      y: Math.round((STAGE_HEIGHT - seed.rect.height) / 2 + cascadeOffset),
    },
  };
}

export default function CanvasContainer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const {
    document,
    selectedNodeId,
    canUndo,
    canRedo,
    setSelectedNodeId,
    beginMutationSession,
    commitMutationSession,
    undo,
    redo,
    addNode,
    updateNode,
    deleteSelectedNode,
    nudgeSelectedNode,
  } = useBuilderCanvasStore();
  const [interaction, setInteraction] = useState<InteractionState>(null);

  const nodes = useMemo(() => document?.nodes ?? [], [document]);

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
  }, [deleteSelectedNode, nudgeSelectedNode, redo, undo]);

  useEffect(() => {
    if (!interaction) return undefined;
    const activeInteraction = interaction;

    function handlePointerMove(event: PointerEvent) {
      const deltaX = event.clientX - activeInteraction.originX;
      const deltaY = event.clientY - activeInteraction.originY;
      updateNode(activeInteraction.nodeId, (node) => {
        if (activeInteraction.type === 'move') {
          return {
            ...node,
            rect: clampRect({
              ...node.rect,
              x: activeInteraction.startRect.x + deltaX,
              y: activeInteraction.startRect.y + deltaY,
            }),
          };
        }

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
  }, [commitMutationSession, interaction, updateNode]);

  function resolveStagePosition(clientX: number, clientY: number): { x: number; y: number } {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 48, y: 48 };
    return {
      x: Math.max(0, Math.min(STAGE_WIDTH - 80, Math.round(clientX - rect.left))),
      y: Math.max(0, Math.min(STAGE_HEIGHT - 48, Math.round(clientY - rect.top))),
    };
  }

  return (
    <div className={styles.stageShell}>
      <aside className={styles.catalog}>
        <header>
          <span>Component catalog</span>
          <strong>Phase 1 sandbox</strong>
        </header>
        <p>Drag a node into the canvas. Scope is intentionally limited to text, image, and button only.</p>
        {(['text', 'image', 'button'] as const).map((kind) => (
          <div key={kind} className={styles.catalogItemRow}>
            <button
              type="button"
              className={styles.catalogItem}
              draggable
              onDragStart={(event) => {
                event.dataTransfer.setData('application/x-builder-node-kind', kind);
                event.dataTransfer.effectAllowed = 'copy';
              }}
            >
              <span>{kind}</span>
              <small>drag to canvas</small>
            </button>
            <button
              type="button"
              className={styles.catalogQuickAdd}
              onClick={() => {
                addNode(resolveCenteredNode(kind, nodes.length));
              }}
            >
              추가
            </button>
          </div>
        ))}
        <ul className={styles.catalogHints}>
          <li>Click to select</li>
          <li>Drag to move</li>
          <li>Corner handles resize</li>
          <li>Arrow keys nudge</li>
          <li>Cmd/Ctrl+Z undo</li>
          <li>Shift+Cmd/Ctrl+Z redo</li>
          <li>Delete removes node</li>
        </ul>
      </aside>

      <div
        ref={containerRef}
        className={styles.stage}
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) {
            setSelectedNodeId(null);
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          event.dataTransfer.dropEffect = 'copy';
        }}
        onDrop={(event) => {
          event.preventDefault();
          const kind = event.dataTransfer.getData('application/x-builder-node-kind');
          if (kind !== 'text' && kind !== 'image' && kind !== 'button') return;
          const position = resolveStagePosition(event.clientX, event.clientY);
          addNode(
            createCanvasNodeTemplate(
              kind,
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
        {nodes.map((node) => (
          <CanvasNode
            key={node.id}
            node={node}
            selected={selectedNodeId === node.id}
            onSelect={setSelectedNodeId}
            onMoveStart={(nodeId, event) => {
              event.preventDefault();
              event.stopPropagation();
              setSelectedNodeId(nodeId);
              beginMutationSession();
              setInteraction({
                type: 'move',
                nodeId,
                pointerId: event.pointerId,
                originX: event.clientX,
                originY: event.clientY,
                startRect: node.rect,
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
        {nodes.length === 0 ? (
          <div className={styles.emptyCanvas}>
            <strong>Canvas is empty</strong>
            <span>Drag a text, image, or button node from the catalog to begin.</span>
          </div>
        ) : null}

        <div className={styles.canvasToolbar}>
          <button
            type="button"
            className={styles.toolbarButton}
            onClick={undo}
            disabled={!canUndo}
          >
            Undo
          </button>
          <button
            type="button"
            className={styles.toolbarButton}
            onClick={redo}
            disabled={!canRedo}
          >
            Redo
          </button>
        </div>
      </div>

      <aside className={styles.inspectorPlaceholder}>
        <header>
          <span>Selection</span>
          <strong>Phase 2 inspector placeholder</strong>
        </header>
        {selectedNodeId ? (
          (() => {
            const selectedNode = nodes.find((node) => node.id === selectedNodeId) ?? null;
            if (!selectedNode) {
              return <p className={styles.inspectorEmpty}>선택된 노드를 찾을 수 없습니다.</p>;
            }
            return (
              <dl className={styles.inspectorGrid}>
                <div>
                  <dt>id</dt>
                  <dd>{selectedNode.id}</dd>
                </div>
                <div>
                  <dt>kind</dt>
                  <dd>{selectedNode.kind}</dd>
                </div>
                <div>
                  <dt>x</dt>
                  <dd>{selectedNode.rect.x}</dd>
                </div>
                <div>
                  <dt>y</dt>
                  <dd>{selectedNode.rect.y}</dd>
                </div>
                <div>
                  <dt>w</dt>
                  <dd>{selectedNode.rect.width}</dd>
                </div>
                <div>
                  <dt>h</dt>
                  <dd>{selectedNode.rect.height}</dd>
                </div>
                <div>
                  <dt>z</dt>
                  <dd>{selectedNode.zIndex}</dd>
                </div>
              </dl>
            );
          })()
        ) : (
          <p className={styles.inspectorEmpty}>
            캔버스에서 node 를 선택하면 x/y/w/h 정보가 여기 표시됩니다.
          </p>
        )}
      </aside>
    </div>
  );
}
