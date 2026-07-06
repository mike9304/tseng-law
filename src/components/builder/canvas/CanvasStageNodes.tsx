'use client';

import { Fragment, memo, useCallback, useMemo } from 'react';

import CanvasNode, { type CanvasNodeInnerFlowPreviewGapInfo } from '@/components/builder/canvas/CanvasNode';
import SelectionBox from '@/components/builder/canvas/SelectionBox';
import { getCanvasStageNodesCopy } from '@/components/builder/canvas/canvas-stage-nodes-copy';
import type { ContextMenuState, InteractionState, OverlapPickerState } from '@/components/builder/canvas/canvasInteraction';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import { resolveViewportRect, type Viewport } from '@/lib/builder/canvas/responsive';
import type { Locale } from '@/lib/locales';
import {
  compareTopLevelStacking,
  computeFlowSiblingMetrics,
  computeTopLevelFlowSectionMetricsFromIndex,
  getFlowGroupKey,
  isTopLevelFlowSection,
} from '@/lib/builder/canvas/flow';
import { parentUsesFlowLayout } from '@/lib/builder/canvas/tree';
import { PREVIEW_GAP_STYLE } from './previewGapStyle';
import styles from './SandboxPage.module.css';

type SelectionBoxRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type CanvasStageNodesProps = {
  handleInlineEditingChange: (nodeId: string, editing: boolean) => void;
  onRequestAssetLibrary?: (nodeId: string) => void;
  resolveContextMenuPosition: (clientX: number, clientY: number) => { x: number; y: number };
  rootVisibleNodes: BuilderCanvasNode[];
  selectionBoxRect: SelectionBoxRect | null;
  setContextMenu: (menu: ContextMenuState | null) => void;
  setOverlapPicker: (picker: OverlapPickerState | null | ((current: OverlapPickerState | null) => OverlapPickerState | null)) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  startMove: (nodeId: string, event: React.PointerEvent) => void;
  startResize: Parameters<typeof CanvasNode>[0]['onResizeStart'];
  toggleNodeSelection: (nodeId: string) => void;
  updateNodeContent: (nodeId: string, content: Record<string, unknown>, mode?: 'commit' | 'transient') => void;
  viewport: Viewport;
  childrenMap: Record<string, string[]>;
  nodesById: Map<string, BuilderCanvasNode>;
  visibleNodes: BuilderCanvasNode[];
  showEmptyState: boolean;
  onCanvasPageLink?: (href: string) => void;
  interaction?: InteractionState | null;
  locale?: Locale;
};

type SortedRootNodeBuckets = {
  flowSectionNodes: BuilderCanvasNode[];
  nonFlowRootNodes: BuilderCanvasNode[];
};
type FlowMetric = { marginTop: number; minHeight: number };
type InnerFlowLayoutState = {
  flowLayoutChildNodeIds: ReadonlySet<string>;
  siblingMetrics: Map<string, FlowMetric>;
};
type VisibleChildrenByParentId = ReadonlyMap<string, readonly BuilderCanvasNode[]>;
type VisibleNodeRelationshipState = InnerFlowLayoutState & {
  visibleChildrenByParentId: VisibleChildrenByParentId;
};

const EMPTY_SORTED_ROOT_NODE_BUCKETS: SortedRootNodeBuckets = {
  flowSectionNodes: [],
  nonFlowRootNodes: [],
};
const EMPTY_FLOW_LAYOUT_CHILD_NODE_IDS: ReadonlySet<string> = new Set<string>();
const EMPTY_FLOW_METRICS = new Map<string, FlowMetric>();
const EMPTY_INNER_FLOW_LAYOUT_STATE: InnerFlowLayoutState = {
  flowLayoutChildNodeIds: EMPTY_FLOW_LAYOUT_CHILD_NODE_IDS,
  siblingMetrics: EMPTY_FLOW_METRICS,
};
const EMPTY_VISIBLE_CHILDREN_BY_PARENT_ID: VisibleChildrenByParentId = new Map();
const EMPTY_VISIBLE_NODE_RELATIONSHIP_STATE: VisibleNodeRelationshipState = {
  flowLayoutChildNodeIds: EMPTY_FLOW_LAYOUT_CHILD_NODE_IDS,
  siblingMetrics: EMPTY_FLOW_METRICS,
  visibleChildrenByParentId: EMPTY_VISIBLE_CHILDREN_BY_PARENT_ID,
};
const EMPTY_VISIBLE_CHILDREN: readonly BuilderCanvasNode[] = [];

function compareFlowSiblingOrder(
  leftY: number,
  leftZIndex: number,
  leftId: string,
  rightY: number,
  rightZIndex: number,
  rightId: string,
): number {
  return leftY - rightY ||
    leftZIndex - rightZIndex ||
    leftId.localeCompare(rightId);
}

function getSortedRootNodeBuckets(rootVisibleNodes: BuilderCanvasNode[]): SortedRootNodeBuckets {
  if (rootVisibleNodes.length === 0) return EMPTY_SORTED_ROOT_NODE_BUCKETS;
  const flowSectionNodes: BuilderCanvasNode[] = [];
  const nonFlowRootNodes: BuilderCanvasNode[] = [];
  const sortedRootNodes = [...rootVisibleNodes].sort(compareTopLevelStacking);

  for (const node of sortedRootNodes) {
    if (isTopLevelFlowSection(node)) {
      flowSectionNodes.push(node);
    } else {
      nonFlowRootNodes.push(node);
    }
  }

  return { flowSectionNodes, nonFlowRootNodes };
}

export function getInnerFlowLayoutState({
  nodesById,
  viewport,
  visibleNodes,
}: {
  nodesById: Map<string, BuilderCanvasNode>;
  viewport: Viewport;
  visibleNodes: BuilderCanvasNode[];
}): InnerFlowLayoutState {
  const { flowLayoutChildNodeIds, siblingMetrics } = getVisibleNodeRelationshipState({
    nodesById,
    viewport,
    visibleNodes,
  });
  return flowLayoutChildNodeIds.size === 0
    ? EMPTY_INNER_FLOW_LAYOUT_STATE
    : { flowLayoutChildNodeIds, siblingMetrics };
}

export function getVisibleChildrenByParentId(
  visibleNodes: BuilderCanvasNode[],
): VisibleChildrenByParentId {
  if (visibleNodes.length === 0) return EMPTY_VISIBLE_CHILDREN_BY_PARENT_ID;
  const visibleChildrenByParentId = new Map<string, BuilderCanvasNode[]>();
  for (let index = 0; index < visibleNodes.length; index += 1) {
    const node = visibleNodes[index];
    if (!node?.parentId) continue;
    const children = visibleChildrenByParentId.get(node.parentId);
    if (children) {
      children.push(node);
    } else {
      visibleChildrenByParentId.set(node.parentId, [node]);
    }
  }
  return visibleChildrenByParentId.size > 0
    ? visibleChildrenByParentId
    : EMPTY_VISIBLE_CHILDREN_BY_PARENT_ID;
}

export function getVisibleNodeRelationshipState({
  nodesById,
  viewport,
  visibleNodes,
}: {
  nodesById: Map<string, BuilderCanvasNode>;
  viewport: Viewport;
  visibleNodes: BuilderCanvasNode[];
}): VisibleNodeRelationshipState {
  if (visibleNodes.length === 0) return EMPTY_VISIBLE_NODE_RELATIONSHIP_STATE;
  const flowLayoutChildNodeIds = new Set<string>();
  const flowLayoutParentIds = viewport === 'desktop'
    ? null
    : new Set<string>();
  const visibleChildrenByParentId = new Map<string, BuilderCanvasNode[]>();

  for (let index = 0; index < visibleNodes.length; index += 1) {
    const node = visibleNodes[index];
    if (!node?.parentId) continue;
    const children = visibleChildrenByParentId.get(node.parentId);
    if (children) {
      children.push(node);
    } else {
      visibleChildrenByParentId.set(node.parentId, [node]);
    }

    if (!parentUsesFlowLayout(node, nodesById)) continue;
    flowLayoutChildNodeIds.add(node.id);
    flowLayoutParentIds?.add(node.parentId);
  }

  const siblingMetrics = new Map<string, FlowMetric>();
  if (flowLayoutParentIds && flowLayoutParentIds.size > 0) {
    for (const parentId of flowLayoutParentIds) {
      const siblings = visibleChildrenByParentId.get(parentId);
      if (!siblings) continue;
      for (const [nodeId, metric] of computeFlowSiblingMetrics(siblings, viewport)) {
        siblingMetrics.set(nodeId, metric);
      }
    }
  }

  if (
    flowLayoutChildNodeIds.size === 0 &&
    visibleChildrenByParentId.size === 0
  ) {
    return EMPTY_VISIBLE_NODE_RELATIONSHIP_STATE;
  }

  return {
    flowLayoutChildNodeIds: flowLayoutChildNodeIds.size > 0
      ? flowLayoutChildNodeIds
      : EMPTY_FLOW_LAYOUT_CHILD_NODE_IDS,
    siblingMetrics: siblingMetrics.size > 0 ? siblingMetrics : EMPTY_FLOW_METRICS,
    visibleChildrenByParentId: visibleChildrenByParentId.size > 0
      ? visibleChildrenByParentId
      : EMPTY_VISIBLE_CHILDREN_BY_PARENT_ID,
  };
}

function getFlowSiblingInsertionIndexFromVisibleSiblings(
  siblings: readonly BuilderCanvasNode[],
  draggedNodeId: string,
  viewport: Viewport,
): number | null {
  if (siblings.length === 0) return null;
  let draggedY = 0;
  let draggedZIndex = 0;
  let draggedVisible = false;

  for (let index = 0; index < siblings.length; index += 1) {
    const sibling = siblings[index];
    if (sibling.id !== draggedNodeId) continue;
    const rect = viewport === 'desktop' ? sibling.rect : resolveViewportRect(sibling, viewport);
    draggedY = rect.y;
    draggedZIndex = sibling.zIndex;
    draggedVisible = true;
    break;
  }

  if (!draggedVisible) return null;

  let insertionIndex = 0;

  for (let index = 0; index < siblings.length; index += 1) {
    const sibling = siblings[index];
    if (sibling.id === draggedNodeId) continue;
    const rect = viewport === 'desktop' ? sibling.rect : resolveViewportRect(sibling, viewport);
    if (
      compareFlowSiblingOrder(
        rect.y,
        sibling.zIndex,
        sibling.id,
        draggedY,
        draggedZIndex,
        draggedNodeId,
      ) < 0
    ) {
      insertionIndex += 1;
    }
  }

  return insertionIndex;
}

export function getInnerFlowPreviewGapInfo({
  interaction,
  nodesById,
  viewport,
  visibleChildrenByParentId,
}: {
  interaction?: InteractionState | null;
  nodesById: Map<string, BuilderCanvasNode>;
  viewport: Viewport;
  visibleChildrenByParentId: VisibleChildrenByParentId;
}): CanvasNodeInnerFlowPreviewGapInfo | null {
  if (interaction?.type !== 'move' || viewport === 'desktop') return null;
  const draggedId = interaction.nodeId;
  const draggedNode = nodesById.get(draggedId) ?? null;
  const parentId = draggedNode?.parentId ?? null;
  if (!draggedNode || !parentId) return null;
  if (getFlowGroupKey(draggedNode, nodesById) !== parentId) return null;

  const insertionIndex = getFlowSiblingInsertionIndexFromVisibleSiblings(
    visibleChildrenByParentId.get(parentId) ?? EMPTY_VISIBLE_CHILDREN,
    draggedId,
    viewport,
  );
  return insertionIndex === null
    ? null
    : { parentId, insertionIndex, draggedId };
}

export function getTopLevelFlowPreviewGapInfo({
  flowSectionNodes,
  interaction,
  nodesById,
}: {
  flowSectionNodes: readonly BuilderCanvasNode[];
  interaction?: InteractionState | null;
  nodesById: Map<string, BuilderCanvasNode>;
}): { insertionIndex: number; draggedId: string } | null {
  if (interaction?.type !== 'move') return null;
  const draggedId = interaction.nodeId;
  const draggedNode = nodesById.get(draggedId) ?? null;
  if (!draggedNode || !isTopLevelFlowSection(draggedNode)) return null;
  const insertionIndex = getFlowSiblingInsertionIndexFromVisibleSiblings(
    flowSectionNodes,
    draggedId,
    interaction.viewport,
  );
  return insertionIndex === null
    ? null
    : { insertionIndex, draggedId };
}

function CanvasStageNodes({
  handleInlineEditingChange,
  onRequestAssetLibrary,
  resolveContextMenuPosition,
  rootVisibleNodes,
  selectionBoxRect,
  setContextMenu,
  setOverlapPicker,
  setSelectedNodeId,
  startMove,
  startResize,
  toggleNodeSelection,
  updateNodeContent,
  viewport,
  childrenMap,
  nodesById,
  visibleNodes,
  showEmptyState,
  onCanvasPageLink,
  interaction,
  locale = 'ko',
}: CanvasStageNodesProps) {
  const copy = getCanvasStageNodesCopy(locale);
  // Display-sorted root nodes for DOM render order parity with Published.
  // Mirrors the `renderedTopLevelNodes` logic from public-page.tsx:
  // top-level flow sections first, sorted by rect.y then zIndex; non-flow roots after.
  // This ensures widgets placed between flow sections stack correctly in Editor (WYSIWYG).
  // 2-2.1: Live Sibling Reflow Preview — insertion index based visual gap
  // between top-level flow sections (composites) while dragging one.
  const { flowSectionNodes, nonFlowRootNodes } = useMemo(
    () => getSortedRootNodeBuckets(rootVisibleNodes),
    [rootVisibleNodes],
  );
  const flowSectionMetrics = useMemo(
    () => computeTopLevelFlowSectionMetricsFromIndex({
      childrenMap,
      nodes: visibleNodes,
      nodesById,
      viewport,
    }),
    [childrenMap, nodesById, viewport, visibleNodes],
  );
  const visibleNodeRelationshipState = useMemo(
    () => getVisibleNodeRelationshipState({ nodesById, viewport, visibleNodes }),
    [nodesById, viewport, visibleNodes],
  );
  const innerFlowPreviewGapInfo = useMemo(
    () => getInnerFlowPreviewGapInfo({
      interaction,
      nodesById,
      viewport,
      visibleChildrenByParentId: visibleNodeRelationshipState.visibleChildrenByParentId,
    }),
    [interaction, nodesById, viewport, visibleNodeRelationshipState.visibleChildrenByParentId],
  );
  const flowSectionCount = flowSectionNodes.length;

  const previewGapInfo = useMemo(
    () => getTopLevelFlowPreviewGapInfo({
      flowSectionNodes,
      interaction,
      nodesById,
    }),
    [flowSectionNodes, interaction, nodesById],
  );

  const handleSelect = useCallback((nodeId: string, additive: boolean) => {
    if (additive) {
      toggleNodeSelection(nodeId);
      return;
    }
    setSelectedNodeId(nodeId);
  }, [setSelectedNodeId, toggleNodeSelection]);

  const handleContextMenu = useCallback((nodeId: string, event: React.MouseEvent<HTMLDivElement>) => {
    setOverlapPicker(null);
    const { selectedNodeIds, selectedNodeIdSet } = useBuilderCanvasStore.getState();
    const keepMultiSelection = selectedNodeIds.length > 1 && selectedNodeIdSet.has(nodeId);
    if (!keepMultiSelection) {
      setSelectedNodeId(nodeId);
    }
    const position = resolveContextMenuPosition(event.clientX, event.clientY);
    setContextMenu({
      nodeId,
      x: position.x,
      y: position.y,
    });
  }, [resolveContextMenuPosition, setContextMenu, setOverlapPicker, setSelectedNodeId]);

  const handleUpdateContent = useCallback((nodeId: string, content: Record<string, unknown>) => {
    updateNodeContent(nodeId, content, 'commit');
  }, [updateNodeContent]);

  // Helper to avoid duplicating the long CanvasNode prop list in split rendering.
  const renderCanvasNode = (node: BuilderCanvasNode) => (
    <CanvasNode
      key={node.id}
      node={node}
      onSelect={handleSelect}
      onContextMenu={handleContextMenu}
      onOpenAssetLibrary={onRequestAssetLibrary}
      onUpdateContent={handleUpdateContent}
      onInlineEditingChange={handleInlineEditingChange}
      onMoveStart={startMove}
      onResizeStart={startResize}
      onCanvasPageLink={onCanvasPageLink}
      interaction={interaction}
      flowSectionMetrics={flowSectionMetrics}
      flowLayoutChildNodeIds={visibleNodeRelationshipState.flowLayoutChildNodeIds}
      innerFlowSiblingMetrics={visibleNodeRelationshipState.siblingMetrics}
      visibleChildrenByParentId={visibleNodeRelationshipState.visibleChildrenByParentId}
      innerFlowPreviewGapInfo={innerFlowPreviewGapInfo}
      viewport={viewport}
      locale={locale}
    />
  );

  return (
    <>
      {/* Flow sections with preview gap inserted at live insertionIndex */}
      {flowSectionNodes.map((node, flowIdx) => {
        const showGapBefore = previewGapInfo !== null && previewGapInfo.insertionIndex === flowIdx;
        return (
          <Fragment key={`flow-${node.id}`}>
            {showGapBefore && (
              <div
                key={`preview-gap-${flowIdx}`}
                style={PREVIEW_GAP_STYLE}
                aria-hidden
                data-preview-gap="flow-section"
              />
            )}
            {renderCanvasNode(node)}
          </Fragment>
        );
      })}
      {/* Gap after the very last flow section (insertion at end) */}
      {previewGapInfo !== null && previewGapInfo.insertionIndex === flowSectionCount && (
        <div
          key="preview-gap-end"
          style={PREVIEW_GAP_STYLE}
          aria-hidden
          data-preview-gap="flow-section"
        />
      )}
      {/* Non-flow root nodes (widgets etc.) rendered after flow sections — unchanged order */}
      {nonFlowRootNodes.map((node) => renderCanvasNode(node))}
      {selectionBoxRect ? <SelectionBox {...selectionBoxRect} /> : null}
      {showEmptyState && rootVisibleNodes.length === 0 ? (
        <div className={styles.emptyCanvas}>
          <strong>{copy.emptyCanvasTitle}</strong>
          <span>{copy.emptyCanvasBody}</span>
        </div>
      ) : null}
    </>
  );
}

export default memo(CanvasStageNodes);
