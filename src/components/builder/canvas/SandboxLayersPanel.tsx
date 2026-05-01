'use client';

import { useCallback, useEffect, useMemo, useState, type KeyboardEvent, type MouseEvent } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { isContainerLikeKind } from '@/lib/builder/canvas/types';
import LayerSearchInput from './LayerSearchInput';
import LayersTreeRow from './LayersTreeRow';
import styles from './SandboxPage.module.css';

interface FlatLayerRow {
  node: BuilderCanvasNode;
  depth: number;
  childCount: number;
}

type LayerDropMode = 'before' | 'after' | 'inside';

interface LayerDropIntent {
  activeId: string;
  targetId: string;
  mode: LayerDropMode;
}

function getLayerLabel(node: BuilderCanvasNode): string {
  const content = node.content as Record<string, unknown>;
  const text = content.text ?? content.label ?? content.alt ?? content.title;
  if (typeof text === 'string' && text.trim()) {
    return text.trim().slice(0, 64);
  }
  return node.id;
}

function getSearchText(node: BuilderCanvasNode): string {
  const content = node.content as Record<string, unknown>;
  const values = [
    node.id,
    node.kind,
    content.text,
    content.label,
    content.alt,
    content.title,
    content.href,
  ];
  return values
    .filter((value): value is string => typeof value === 'string')
    .join(' ')
    .toLowerCase();
}

function escapeSelectorValue(value: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value);
  }
  return value.replace(/["\\]/g, '\\$&');
}

function isNodeAncestor(
  ancestorId: string,
  nodeId: string,
  nodesById: Map<string, BuilderCanvasNode>,
): boolean {
  if (ancestorId === nodeId) return true;
  const visited = new Set<string>();
  let currentId: string | null = nodeId;

  while (currentId) {
    if (visited.has(currentId)) return false;
    visited.add(currentId);
    const currentNode = nodesById.get(currentId);
    const parentId = currentNode?.parentId ?? null;
    if (!parentId) return false;
    if (parentId === ancestorId) return true;
    currentId = parentId;
  }

  return false;
}

function reorderVisualLayers(
  layers: BuilderCanvasNode[],
  activeId: string,
  targetId: string,
  mode: Exclude<LayerDropMode, 'inside'>,
): BuilderCanvasNode[] {
  const activeNode = layers.find((node) => node.id === activeId);
  if (!activeNode) return layers;
  const withoutActive = layers.filter((node) => node.id !== activeId);
  const targetIndex = withoutActive.findIndex((node) => node.id === targetId);
  if (targetIndex === -1) return layers;
  const insertIndex = mode === 'before' ? targetIndex : targetIndex + 1;
  const nextLayers = [...withoutActive];
  nextLayers.splice(insertIndex, 0, activeNode);
  return nextLayers;
}

export default function SandboxLayersPanel() {
  const {
    document,
    selectedNodeId,
    selectedNodeIds,
    activeGroupId,
    setSelectedNodeId,
    toggleNodeSelection,
    enterGroup,
    updateNode,
    reorderNodes,
    moveNodeIntoContainer,
    moveNodeOutOfContainer,
  } = useBuilderCanvasStore();
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => new Set());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);
  const [dropIntent, setDropIntent] = useState<LayerDropIntent | null>(null);

  const nodes = useMemo(() => document?.nodes ?? [], [document?.nodes]);
  const nodesById = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);
  const normalizedQuery = query.trim().toLowerCase();

  const childrenByParent = useMemo(() => {
    const map = new Map<string | null, BuilderCanvasNode[]>();
    for (const node of nodes) {
      const parentId = node.parentId && nodesById.has(node.parentId) ? node.parentId : null;
      const siblings = map.get(parentId) ?? [];
      siblings.push(node);
      map.set(parentId, siblings);
    }
    for (const siblings of map.values()) {
      siblings.sort((left, right) => right.zIndex - left.zIndex);
    }
    return map;
  }, [nodes, nodesById]);

  const searchState = useMemo(() => {
    const directMatches = new Set<string>();
    const contextMatches = new Set<string>();
    const forcedExpanded = new Set<string>();
    if (!normalizedQuery) {
      return { directMatches, contextMatches, forcedExpanded };
    }

    for (const node of nodes) {
      if (!getSearchText(node).includes(normalizedQuery)) continue;
      directMatches.add(node.id);
      contextMatches.add(node.id);
      let parentId = node.parentId ?? null;
      while (parentId) {
        contextMatches.add(parentId);
        forcedExpanded.add(parentId);
        parentId = nodesById.get(parentId)?.parentId ?? null;
      }
    }
    return { directMatches, contextMatches, forcedExpanded };
  }, [nodes, nodesById, normalizedQuery]);

  const flatRows = useMemo(() => {
    const rows: FlatLayerRow[] = [];
    const visit = (parentId: string | null, depth: number) => {
      const children = childrenByParent.get(parentId) ?? [];
      for (const node of children) {
        const childCount = childrenByParent.get(node.id)?.length ?? 0;
        rows.push({ node, depth, childCount });
        const forcedOpen = searchState.forcedExpanded.has(node.id);
        const expanded = forcedOpen || !collapsedIds.has(node.id);
        if (childCount > 0 && expanded) {
          visit(node.id, depth + 1);
        }
      }
    };
    visit(null, 0);
    return rows;
  }, [childrenByParent, collapsedIds, searchState.forcedExpanded]);

  const allVisualLayers = useMemo(
    () => [...nodes].sort((left, right) => right.zIndex - left.zIndex),
    [nodes],
  );

  const visibleLayerIds = useMemo(() => flatRows.map((row) => row.node.id), [flatRows]);
  useEffect(() => {
    if (!hoveredLayerId) return undefined;
    const selector = `[data-node-id="${escapeSelectorValue(hoveredLayerId)}"]`;
    const element = window.document.querySelector<HTMLElement>(selector);
    element?.setAttribute('data-builder-layer-hover', 'true');
    return () => {
      element?.removeAttribute('data-builder-layer-hover');
    };
  }, [hoveredLayerId]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
    setDropIntent(null);
  }, []);

  const resolveLayerDropIntent = useCallback(
    (event: DragMoveEvent | DragEndEvent): LayerDropIntent | null => {
      const over = event.over;
      if (!over) return null;
      const activeId = String(event.active.id);
      const targetId = String(over.id);
      if (activeId === targetId) return null;

      const activeNode = nodesById.get(activeId);
      const targetNode = nodesById.get(targetId);
      if (!activeNode || !targetNode) return null;

      const translatedRect = event.active.rect.current.translated;
      const pointerY = translatedRect
        ? translatedRect.top + translatedRect.height / 2
        : over.rect.top + over.rect.height / 2;
      const relativeY = over.rect.height > 0
        ? Math.max(0, Math.min(1, (pointerY - over.rect.top) / over.rect.height))
        : 0.5;
      const canDropInside = isContainerLikeKind(targetNode.kind)
        && !isNodeAncestor(activeId, targetId, nodesById);

      if (canDropInside && relativeY >= 0.28 && relativeY <= 0.72) {
        return { activeId, targetId, mode: 'inside' };
      }

      return {
        activeId,
        targetId,
        mode: relativeY < 0.5 ? 'before' : 'after',
      };
    },
    [nodesById],
  );

  const handleDragMove = useCallback(
    (event: DragMoveEvent) => {
      setDropIntent(resolveLayerDropIntent(event));
    },
    [resolveLayerDropIntent],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const resolvedDropIntent = resolveLayerDropIntent(event) ?? dropIntent;
      setDropIntent(null);
      const { active, over } = event;
      if (!over || active.id === over.id || !resolvedDropIntent) return;

      const activeNode = nodesById.get(resolvedDropIntent.activeId);
      const targetNode = nodesById.get(resolvedDropIntent.targetId);
      if (!activeNode || !targetNode) return;

      if (resolvedDropIntent.mode === 'inside') {
        if ((activeNode.parentId ?? null) !== targetNode.id) {
          moveNodeIntoContainer(activeNode.id, targetNode.id);
          setCollapsedIds((current) => {
            const next = new Set(current);
            next.delete(targetNode.id);
            return next;
          });
          setSelectedNodeId(activeNode.id);
        }
        return;
      }

      const activeParentId = activeNode.parentId ?? null;
      const targetParentId = targetNode.parentId ?? null;

      if (targetParentId !== activeParentId) {
        if (targetParentId) {
          if (targetParentId === activeNode.id || isNodeAncestor(activeNode.id, targetParentId, nodesById)) {
            return;
          }
          moveNodeIntoContainer(activeNode.id, targetParentId);
          setCollapsedIds((current) => {
            const next = new Set(current);
            next.delete(targetParentId);
            return next;
          });
        } else {
          moveNodeOutOfContainer(activeNode.id);
        }
        setSelectedNodeId(activeNode.id);
        return;
      }

      const oldIndex = allVisualLayers.findIndex((node) => node.id === active.id);
      const newIndex = allVisualLayers.findIndex((node) => node.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reorderedVisual = reorderVisualLayers(
        allVisualLayers,
        resolvedDropIntent.activeId,
        resolvedDropIntent.targetId,
        resolvedDropIntent.mode,
      );
      const ascendingIds = [...reorderedVisual].reverse().map((node) => node.id);
      reorderNodes(ascendingIds);
    },
    [
      allVisualLayers,
      dropIntent,
      moveNodeIntoContainer,
      moveNodeOutOfContainer,
      nodesById,
      reorderNodes,
      resolveLayerDropIntent,
      setSelectedNodeId,
    ],
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setDropIntent(null);
  }, []);

  const handleSelect = useCallback(
    (nodeId: string, event: MouseEvent | KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey) {
        toggleNodeSelection(nodeId);
        return;
      }
      setSelectedNodeId(nodeId);
    },
    [setSelectedNodeId, toggleNodeSelection],
  );

  const handleToggleExpanded = useCallback((nodeId: string) => {
    setCollapsedIds((current) => {
      const next = new Set(current);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

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

  const handleEnterGroup = useCallback(
    (nodeId: string) => {
      const node = nodesById.get(nodeId);
      if (!node || !isContainerLikeKind(node.kind)) return;
      enterGroup(nodeId);
    },
    [enterGroup, nodesById],
  );

  const activeNode = activeId ? nodesById.get(activeId) ?? null : null;
  const matchCount = searchState.directMatches.size;

  return (
    <section className={styles.panelSection}>
      <header className={styles.panelSectionHeader}>
        <div>
          <span>Layers</span>
          <strong>{nodes.length} nodes</strong>
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
        {nodes.length === 0 ? (
          <p className={styles.panelEmpty}>아직 node 가 없습니다. catalog 에서 추가하세요.</p>
        ) : (
          <>
            <LayerSearchInput value={query} resultCount={matchCount} onChange={setQuery} />
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              <SortableContext items={visibleLayerIds} strategy={verticalListSortingStrategy}>
                <ul className={styles.layerList}>
                  {flatRows.map(({ node, depth, childCount }) => {
                    const isMatched = normalizedQuery
                      ? searchState.directMatches.has(node.id)
                      : false;
                    const isDimmed = normalizedQuery
                      ? !searchState.directMatches.has(node.id) && !searchState.contextMatches.has(node.id)
                      : false;
                    const isExpanded = searchState.forcedExpanded.has(node.id) || !collapsedIds.has(node.id);
                    return (
                      <LayersTreeRow
                        key={node.id}
                        node={node}
                        depth={depth}
                        label={getLayerLabel(node)}
                        childCount={childCount}
                        isExpanded={isExpanded}
                        isSelected={selectedNodeIds.includes(node.id)}
                        isPrimary={selectedNodeId === node.id}
                        isActiveGroup={activeGroupId === node.id}
                        isMatched={isMatched}
                        isDimmed={isDimmed}
                        dropMode={dropIntent?.targetId === node.id ? dropIntent.mode : null}
                        onSelect={handleSelect}
                        onToggleExpanded={handleToggleExpanded}
                        onToggleVisibility={handleToggleVisibility}
                        onToggleLock={handleToggleLock}
                        onHoverStart={setHoveredLayerId}
                        onHoverEnd={() => setHoveredLayerId(null)}
                        onEnterGroup={handleEnterGroup}
                      />
                    );
                  })}
                </ul>
              </SortableContext>
              <DragOverlay>
                {activeNode ? (
                  <div className={styles.layerDragPreview}>
                    <strong>{getLayerLabel(activeNode)}</strong>
                    <small>{activeNode.kind} · z {activeNode.zIndex}</small>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
            <p className={styles.layerPanelHint}>
              Drop on the middle of a container to nest. Drop above or below a row to reorder or move beside that row.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
