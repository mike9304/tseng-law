'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
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
import type { Locale } from '@/lib/locales';
import LayerSearchInput from './LayerSearchInput';
import LayersTreeRow from './LayersTreeRow';
import { getSandboxLayersPanelCopy, type SandboxLayersPanelCopy } from './sandbox-layers-panel-copy';
import styles from './SandboxPage.module.css';

const EMPTY_LAYER_NODES: BuilderCanvasNode[] = [];

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

function sameDropIntent(left: LayerDropIntent | null, right: LayerDropIntent | null): boolean {
  if (left === right) return true;
  if (!left || !right) return false;
  return left.activeId === right.activeId
    && left.targetId === right.targetId
    && left.mode === right.mode;
}

function getDefaultCollapsedLayerIds(
  childrenByParent: Map<string | null, BuilderCanvasNode[]>,
): Set<string> {
  const rootIds = new Set((childrenByParent.get(null) ?? []).map((node) => node.id));
  const collapsed = new Set<string>();

  for (const [parentId, children] of childrenByParent) {
    if (!parentId || rootIds.has(parentId) || children.length === 0) continue;
    collapsed.add(parentId);
  }

  return collapsed;
}

function getLayerLabel(node: BuilderCanvasNode, copy: SandboxLayersPanelCopy): string {
  const content = node.content as Record<string, unknown>;
  const semanticLabel = resolveLayerTechnicalLabel(content.label, copy)
    ?? resolveLayerTechnicalLabel(node.id, copy);
  const text = content.text ?? content.alt ?? content.title;
  if (typeof text === 'string' && text.trim()) {
    return text.trim().slice(0, 64);
  }
  if (semanticLabel) {
    return semanticLabel;
  }
  if (typeof content.label === 'string' && content.label.trim()) {
    return content.label.trim().slice(0, 64);
  }
  return copy.kindLabels[node.kind] ?? node.kind;
}

export function resolveLayerTechnicalLabel(value: unknown, copy: SandboxLayersPanelCopy): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ');
  if (!normalized || !/^[a-z0-9 ]+$/.test(normalized)) return null;

  const tokens = normalized.split(' ');
  if (tokens[0] === 'home') tokens.shift();

  const labels: string[] = [];
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    const nextToken = tokens[index + 1];
    const compositeKey = nextToken ? `${token}-${nextToken}` : token;
    const compositeSection = copy.row.semanticLabels.sections[compositeKey];
    if (compositeSection) {
      labels.push(compositeSection);
      index += 1;
      continue;
    }

    const sectionLabel = copy.row.semanticLabels.sections[token];
    if (sectionLabel) {
      labels.push(sectionLabel);
      continue;
    }

    const roleLabel = copy.row.semanticLabels.roles[token];
    if (roleLabel) {
      labels.push(roleLabel);
      continue;
    }

    if (/^\d+$/.test(token)) {
      labels.push(token);
      continue;
    }

    return null;
  }

  return labels.length > 0 ? labels.join(' ').slice(0, 64) : null;
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

function requestCanvasNodeFocus(nodeId: string) {
  if (typeof document === 'undefined') return;
  document.dispatchEvent(new CustomEvent('builder:focus-canvas-node', {
    detail: { nodeId },
  }));
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

export default function SandboxLayersPanel({ locale = 'ko' }: { locale?: Locale }) {
  const nodes = useBuilderCanvasStore((state) => state.document?.nodes ?? EMPTY_LAYER_NODES);
  const nodesById = useBuilderCanvasStore((state) => state.nodesById);
  const selectedNodeId = useBuilderCanvasStore((state) => state.selectedNodeId);
  const selectedNodeIdSet = useBuilderCanvasStore((state) => state.selectedNodeIdSet);
  const activeGroupId = useBuilderCanvasStore((state) => state.activeGroupId);
  const setSelectedNodeId = useBuilderCanvasStore((state) => state.setSelectedNodeId);
  const toggleNodeSelection = useBuilderCanvasStore((state) => state.toggleNodeSelection);
  const enterGroup = useBuilderCanvasStore((state) => state.enterGroup);
  const updateNode = useBuilderCanvasStore((state) => state.updateNode);
  const reorderNodes = useBuilderCanvasStore((state) => state.reorderNodes);
  const moveNodeIntoContainer = useBuilderCanvasStore((state) => state.moveNodeIntoContainer);
  const moveNodeOutOfContainer = useBuilderCanvasStore((state) => state.moveNodeOutOfContainer);
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState('');
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => new Set());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);
  const [dropIntent, setDropIntent] = useState<LayerDropIntent | null>(null);
  const dropIntentRef = useRef<LayerDropIntent | null>(null);
  const collapsedTreeSignatureRef = useRef('');
  const copy = useMemo(() => getSandboxLayersPanelCopy(locale), [locale]);

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

  const topLevelTreeSignature = useMemo(
    () => (childrenByParent.get(null) ?? []).map((node) => node.id).join('|'),
    [childrenByParent],
  );

  useEffect(() => {
    if (!nodes.length || !topLevelTreeSignature) return;
    if (collapsedTreeSignatureRef.current === topLevelTreeSignature) return;
    collapsedTreeSignatureRef.current = topLevelTreeSignature;
    setCollapsedIds(getDefaultCollapsedLayerIds(childrenByParent));
  }, [childrenByParent, nodes, topLevelTreeSignature]);

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
    dropIntentRef.current = null;
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
      const nextDropIntent = resolveLayerDropIntent(event);
      if (sameDropIntent(dropIntentRef.current, nextDropIntent)) return;
      dropIntentRef.current = nextDropIntent;
      setDropIntent(nextDropIntent);
    },
    [resolveLayerDropIntent],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveId(null);
      const resolvedDropIntent = resolveLayerDropIntent(event) ?? dropIntentRef.current;
      dropIntentRef.current = null;
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
    dropIntentRef.current = null;
    setDropIntent(null);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setHoveredLayerId(null);
  }, []);

  const handleSelect = useCallback(
    (nodeId: string, event: MouseEvent | KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey) {
        toggleNodeSelection(nodeId);
        requestCanvasNodeFocus(nodeId);
        return;
      }
      setSelectedNodeId(nodeId);
      requestCanvasNodeFocus(nodeId);
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
    <section className={styles.panelSection} data-builder-layers-panel="true">
      <header className={styles.panelSectionHeader}>
        <div>
          <span>{copy.title}</span>
          <strong>{copy.nodeCountLabel(nodes.length)}</strong>
        </div>
        <button
          type="button"
          className={styles.panelHeaderButton}
          title={open ? copy.collapseTitle : copy.expandTitle}
          onClick={() => setOpen((current) => !current)}
        >
          {open ? copy.hideLabel : copy.showLabel}
        </button>
      </header>
      <div className={`${styles.panelBody} ${!open ? styles.panelBodyCollapsed : ''}`}>
        {nodes.length === 0 ? (
          <p className={styles.panelEmpty}>{copy.emptyLabel}</p>
        ) : (
          <>
            <LayerSearchInput
              value={query}
              resultCount={matchCount}
              copy={copy.search}
              onChange={setQuery}
            />
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
                        label={getLayerLabel(node, copy)}
                        childCount={childCount}
                        isExpanded={isExpanded}
                        isSelected={selectedNodeIdSet.has(node.id)}
                        isPrimary={selectedNodeId === node.id}
                        isActiveGroup={activeGroupId === node.id}
                        isMatched={isMatched}
                        isDimmed={isDimmed}
                        dropMode={dropIntent?.targetId === node.id ? dropIntent.mode : null}
                        copy={copy}
                        onSelect={handleSelect}
                        onToggleExpanded={handleToggleExpanded}
                        onToggleVisibility={handleToggleVisibility}
                        onToggleLock={handleToggleLock}
                        onHoverStart={setHoveredLayerId}
                        onHoverEnd={handleHoverEnd}
                        onEnterGroup={handleEnterGroup}
                      />
                    );
                  })}
                </ul>
              </SortableContext>
              <DragOverlay>
                {activeNode ? (
                  <div className={styles.layerDragPreview}>
                    <strong>{getLayerLabel(activeNode, copy)}</strong>
                    <small>{copy.kindLabels[activeNode.kind] ?? activeNode.kind} · z {activeNode.zIndex}</small>
                  </div>
                ) : null}
              </DragOverlay>
            </DndContext>
            <p className={styles.layerPanelHint}>
              {copy.dropHintLabel}
            </p>
          </>
        )}
      </div>
    </section>
  );
}
