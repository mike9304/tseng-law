'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { BuilderCanvasNode, BuilderCanvasNodeKind } from '@/lib/builder/canvas/types';
import styles from './SandboxPage.module.css';

/* ------------------------------------------------------------------ */
/*  Grip icon                                                          */
/* ------------------------------------------------------------------ */

function GripIcon() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor" aria-hidden="true">
      <circle cx="3" cy="2" r="1.25" />
      <circle cx="7" cy="2" r="1.25" />
      <circle cx="3" cy="7" r="1.25" />
      <circle cx="7" cy="7" r="1.25" />
      <circle cx="3" cy="12" r="1.25" />
      <circle cx="7" cy="12" r="1.25" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Kind icon helper                                                   */
/* ------------------------------------------------------------------ */

function getLayerNodeKindGlyph(kind: BuilderCanvasNodeKind) {
  switch (kind) {
    case 'text':
      return 'T';
    case 'heading':
      return 'H';
    case 'image':
      return '🖼';
    case 'button':
      return '▢';
    case 'container':
      return '◻';
    case 'section':
      return '▬';
    default:
      return '·';
  }
}

/* ------------------------------------------------------------------ */
/*  Static layer row (used inside DragOverlay)                         */
/* ------------------------------------------------------------------ */

function LayerRowOverlay({
  node,
  isSelected,
  isPrimary,
}: {
  node: BuilderCanvasNode;
  isSelected: boolean;
  isPrimary: boolean;
}) {
  return (
    <div className={`${styles.layerRow} ${isSelected ? styles.layerRowSelected : ''} ${styles.layerDragOverlay}`}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
        <span className={styles.layerGripHandle}>
          <GripIcon />
        </span>
        <div className={styles.layerRowMain} style={{ flex: 1, minWidth: 0 }}>
          <span className={styles.layerRowKind} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 14, textAlign: 'center', fontSize: '0.75rem' }}>
              {getLayerNodeKindGlyph(node.kind)}
            </span>
            {node.kind}
          </span>
          <strong>{node.id}</strong>
          <small>
            x {node.rect.x} · y {node.rect.y} · z {node.zIndex}
            {isPrimary ? ' · primary' : ''}
            {!node.visible ? ' · hidden' : ''}
            {node.locked ? ' · locked' : ''}
          </small>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sortable layer item                                                */
/* ------------------------------------------------------------------ */

function SortableLayerItem({
  node,
  isSelected,
  isPrimary,
  onSelect,
  onToggleVisibility,
  onToggleLock,
}: {
  node: BuilderCanvasNode;
  isSelected: boolean;
  isPrimary: boolean;
  onSelect: (nodeId: string, event: React.MouseEvent) => void;
  onToggleVisibility: (nodeId: string) => void;
  onToggleLock: (nodeId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: node.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition ?? undefined,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={isDragging ? styles.layerDragging : undefined}
    >
      <button
        type="button"
        className={`${styles.layerRow} ${isSelected ? styles.layerRowSelected : ''}`}
        title={`${node.kind} ${node.id} 선택 (Cmd-click 으로 다중선택)`}
        onClick={(event) => onSelect(node.id, event)}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
          <span
            ref={setActivatorNodeRef}
            className={styles.layerGripHandle}
            {...attributes}
            {...listeners}
          >
            <GripIcon />
          </span>
          <div className={styles.layerRowMain} style={{ flex: 1, minWidth: 0 }}>
            <span className={styles.layerRowKind} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 14, textAlign: 'center', fontSize: '0.75rem' }}>
                {getLayerNodeKindGlyph(node.kind)}
              </span>
              {node.kind}
            </span>
            <strong>{node.id}</strong>
            <small>
              x {node.rect.x} · y {node.rect.y} · z {node.zIndex}
              {isPrimary ? ' · primary' : ''}
              {!node.visible ? ' · hidden' : ''}
              {node.locked ? ' · locked' : ''}
            </small>
          </div>
        </div>
        <div className={styles.layerRowActions}>
          <button
            type="button"
            className={styles.layerQuickAction}
            title={node.visible ? '캔버스에서 숨기기' : '캔버스에 다시 표시'}
            onClick={(event) => {
              event.stopPropagation();
              onToggleVisibility(node.id);
            }}
          >
            {node.visible ? '👁' : '👁‍🗨'}
          </button>
          <button
            type="button"
            className={styles.layerQuickAction}
            title={node.locked ? '잠금 해제' : '잠금'}
            onClick={(event) => {
              event.stopPropagation();
              onToggleLock(node.id);
            }}
          >
            {node.locked ? '🔒' : '🔓'}
          </button>
        </div>
      </button>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  Main panel                                                         */
/* ------------------------------------------------------------------ */

export default function SandboxLayersPanel() {
  const {
    document,
    selectedNodeId,
    selectedNodeIds,
    setSelectedNodeId,
    toggleNodeSelection,
    updateNode,
    reorderNodes,
  } = useBuilderCanvasStore();
  const [open, setOpen] = useState(true);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Layers sorted descending by zIndex (highest = top of visual list)
  const layers = useMemo(
    () => [...(document?.nodes ?? [])].sort((left, right) => right.zIndex - left.zIndex),
    [document?.nodes],
  );

  const layerIds = useMemo(() => layers.map((node) => node.id), [layers]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = layers.findIndex((node) => node.id === active.id);
      const newIndex = layers.findIndex((node) => node.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      // layers is sorted descending by zIndex (highest first).
      // After arrayMove we get the new visual order (top-to-bottom).
      // Reverse it so index 0 = lowest zIndex, last = highest zIndex.
      const reorderedVisual = arrayMove(layers, oldIndex, newIndex);
      const ascendingIds = [...reorderedVisual].reverse().map((node) => node.id);
      reorderNodes(ascendingIds);
    },
    [layers, reorderNodes],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleSelect = useCallback(
    (nodeId: string, event: React.MouseEvent) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey) {
        toggleNodeSelection(nodeId);
        return;
      }
      setSelectedNodeId(nodeId);
    },
    [setSelectedNodeId, toggleNodeSelection],
  );

  const handleToggleVisibility = useCallback(
    (nodeId: string) => {
      updateNode(nodeId, (currentNode) => ({
        ...currentNode,
        visible: !currentNode.visible,
      }));
    },
    [updateNode],
  );

  const handleToggleLock = useCallback(
    (nodeId: string) => {
      updateNode(nodeId, (currentNode) => ({
        ...currentNode,
        locked: !currentNode.locked,
      }));
    },
    [updateNode],
  );

  const activeNode = activeId ? layers.find((node) => node.id === activeId) ?? null : null;

  return (
    <section className={styles.panelSection}>
      <header className={styles.panelSectionHeader}>
        <div>
          <span>Layers</span>
          <strong>{layers.length} nodes</strong>
        </div>
        <button
          type="button"
          className={styles.panelHeaderButton}
          title={open ? '레이어 패널 접기' : '레이어 패널 열기'}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? 'Hide' : 'Show'}
        </button>
      </header>
      <div className={`${styles.panelBody} ${!open ? styles.panelBodyCollapsed : ''}`}>
        {layers.length === 0 ? (
          <p className={styles.panelEmpty}>아직 node 가 없습니다. catalog 에서 추가하세요.</p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <SortableContext items={layerIds} strategy={verticalListSortingStrategy}>
              <ul className={styles.layerList}>
                {layers.map((node) => (
                  <SortableLayerItem
                    key={node.id}
                    node={node}
                    isSelected={selectedNodeIds.includes(node.id)}
                    isPrimary={selectedNodeId === node.id}
                    onSelect={handleSelect}
                    onToggleVisibility={handleToggleVisibility}
                    onToggleLock={handleToggleLock}
                  />
                ))}
              </ul>
            </SortableContext>
            <DragOverlay>
              {activeNode ? (
                <LayerRowOverlay
                  node={activeNode}
                  isSelected={selectedNodeIds.includes(activeNode.id)}
                  isPrimary={selectedNodeId === activeNode.id}
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </section>
  );
}
