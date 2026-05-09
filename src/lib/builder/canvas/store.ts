'use client';

import { create } from 'zustand';
import { getComponent, listComponents } from '@/lib/builder/components/registry';
import {
  alignBottom,
  alignCenter,
  alignLeft,
  alignMiddle,
  alignRight,
  alignTop,
  distributeHorizontal,
  distributeVertical,
  matchHeight,
  matchWidth,
} from '@/lib/builder/canvas/align';
import {
  copyNodes,
  cutNodes,
  getClipboardCount,
  hasClipboard,
  pasteNodes,
} from '@/lib/builder/canvas/clipboard';
import {
  createDefaultCanvasNodeStyle,
  isContainerLikeKind,
  type BuilderCanvasDocument,
  type BuilderCanvasNode,
  type BuilderCanvasNodeKind,
  type BuilderCanvasNodeStyle,
  type ResponsiveConfig,
  type ResponsiveOverride,
} from '@/lib/builder/canvas/types';
import type { Viewport } from '@/lib/builder/canvas/responsive';
import {
  createHistory,
  pushHistory,
  undoHistory,
  redoHistory,
  type HistoryState,
} from '@/lib/builder/canvas/history';
import {
  buildChildrenMap,
  getCanvasNodeDescendantIds,
  isCanvasNodeAncestor,
  resolveCanvasNodeAbsoluteRect,
  resolveCanvasNodeLocalRect,
} from '@/lib/builder/canvas/tree';
import { getCanvasNodesById } from '@/lib/builder/canvas/indexes';
import {
  isBuilderRichText,
  richTextFromPlainText,
} from '@/lib/builder/rich-text/sanitize';

type DraftSaveState = 'idle' | 'saving' | 'saved' | 'error';
type MutationMode = 'commit' | 'transient';
type CanvasNodeRect = BuilderCanvasNode['rect'];
type ResponsiveConfigValue = NonNullable<ResponsiveConfig>;
type ResponsiveOverrideValue = NonNullable<ResponsiveOverride>;
type UpdateNodesOptions = {
  normalize?: boolean;
  touchUpdatedAt?: boolean;
};
export type BuilderCanvasNodeRectsById =
  | ReadonlyMap<string, CanvasNodeRect>
  | Record<string, CanvasNodeRect>;
export type BuilderCanvasAlignmentAction =
  | 'left'
  | 'center'
  | 'right'
  | 'top'
  | 'middle'
  | 'bottom';
export type BuilderCanvasDistributeAction = 'horizontal' | 'vertical';
export type BuilderCanvasMatchSizeAction = 'width' | 'height';

interface BuilderCanvasStoreState {
  document: BuilderCanvasDocument | null;
  selectedNodeId: string | null;
  selectedNodeIds: string[];
  selectedSurfaceKey: string | null;
  setSelectedSurfaceKey: (key: string | null) => void;
  activeGroupId: string | null;
  draftSaveState: DraftSaveState;
  clipboardHasContent: boolean;
  clipboardCount: number;
  history: HistoryState<BuilderCanvasDocument> | null;
  mutationBaseDocument: BuilderCanvasDocument | null;
  canUndo: boolean;
  canRedo: boolean;
  /** Maps container node IDs to arrays of child node IDs (MVP nesting). */
  childrenMap: Record<string, string[]>;
  /** Reference-stable node lookup for the current document node array. */
  nodesById: Map<string, BuilderCanvasNode>;
  /** Active editing viewport — determines which `responsive.<vp>` overrides Inspector writes. */
  viewport: Viewport;
  setViewport: (viewport: Viewport) => void;
  replaceDocument: (document: BuilderCanvasDocument) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setSelectedNodeIds: (nodeIds: string[], primaryNodeId?: string | null) => void;
  toggleNodeSelection: (nodeId: string) => void;
  enterGroup: (groupId: string) => void;
  exitGroup: () => void;
  setDraftSaveState: (state: DraftSaveState) => void;
  beginMutationSession: () => void;
  commitMutationSession: () => void;
  cancelMutationSession: () => void;
  undo: () => void;
  redo: () => void;
  copySelectedNodesToClipboard: () => void;
  cutSelectedNodesToClipboard: () => void;
  pasteClipboardNodes: () => void;
  alignSelectedNodes: (action: BuilderCanvasAlignmentAction) => void;
  distributeSelectedNodes: (action: BuilderCanvasDistributeAction) => void;
  matchSelectedNodesSize: (action: BuilderCanvasMatchSizeAction) => void;
  groupSelectedNodes: () => void;
  ungroupSelectedNode: () => void;
  toggleSelectedNodeLock: () => void;
  addNode: (node: BuilderCanvasNode) => void;
  /**
   * Insert a connected set of nodes (root + descendants) atomically.
   * Caller is responsible for assigning fresh, unique ids and consistent
   * `parentId` references inside the set. The store will append them
   * with rising zIndex values and select the root.
   */
  addNodes: (nodes: BuilderCanvasNode[], rootNodeId?: string | null) => void;
  duplicateSelectedNode: () => void;
  updateSelectedNodes: (
    nodeIds: string[],
    updater: (node: BuilderCanvasNode) => BuilderCanvasNode,
    mode?: MutationMode,
  ) => void;
  updateNode: (
    nodeId: string,
    updater: (node: BuilderCanvasNode) => BuilderCanvasNode,
    mode?: MutationMode,
  ) => void;
  updateNodeRectsForViewport: (
    rectsById: BuilderCanvasNodeRectsById,
    viewport: Viewport,
    mode?: MutationMode,
  ) => void;
  updateNodeContent: (nodeId: string, content: Record<string, unknown>, mode?: MutationMode) => void;
  updateNodeStyle: (nodeId: string, style: Partial<BuilderCanvasNodeStyle>, mode?: MutationMode) => void;
  deleteSelectedNode: () => void;
  nudgeSelectedNode: (deltaX: number, deltaY: number) => void;
  bringSelectedNodeForward: () => void;
  sendSelectedNodeBackward: () => void;
  bringSelectedNodeToFront: () => void;
  sendSelectedNodeToBack: () => void;
  reorderNodes: (orderedIds: string[]) => void;
  moveNodeIntoContainer: (nodeId: string, containerId: string) => void;
  moveNodeOutOfContainer: (nodeId: string) => void;
  /** Apply a partial override to the node's responsive override for the active viewport. */
  updateResponsiveOverride: (
    nodeId: string,
    viewport: Viewport,
    patch: NonNullable<ResponsiveOverride>,
    mode?: MutationMode,
  ) => void;
  /** Clear all responsive overrides for a node at the given viewport. */
  resetResponsiveOverride: (nodeId: string, viewport: Viewport) => void;
}

function sortNodes(nodes: BuilderCanvasNode[]): BuilderCanvasNode[] {
  return [...nodes]
    .sort((left, right) => left.zIndex - right.zIndex)
    .map((node, index) => (node.zIndex === index ? node : { ...node, zIndex: index }));
}

const TRANSIENT_UPDATE_NODES_OPTIONS: UpdateNodesOptions = {
  normalize: false,
  touchUpdatedAt: false,
};
const EMPTY_NODES_BY_ID = new Map<string, BuilderCanvasNode>();

function updateNodesOptionsForMode(mode: MutationMode): UpdateNodesOptions | undefined {
  return mode === 'transient' ? TRANSIENT_UPDATE_NODES_OPTIONS : undefined;
}

function updateNodes(
  document: BuilderCanvasDocument,
  updater: (nodes: BuilderCanvasNode[]) => BuilderCanvasNode[],
  options: UpdateNodesOptions = {},
): BuilderCanvasDocument {
  const nextNodes = updater(document.nodes);
  const normalize = options.normalize ?? true;
  const touchUpdatedAt = options.touchUpdatedAt ?? true;

  return {
    ...document,
    updatedAt: touchUpdatedAt ? new Date().toISOString() : document.updatedAt,
    nodes: normalize ? sortNodes(nextNodes) : nextNodes,
  };
}

function createNodeId(kind: BuilderCanvasNodeKind): string {
  return `${kind}-${Math.random().toString(36).slice(2, 9)}`;
}

function normalizeRichTextContentPatch(
  node: BuilderCanvasNode,
  content: Record<string, unknown>,
): Record<string, unknown> {
  if (node.kind !== 'text' && node.kind !== 'heading') return content;

  const next = { ...content };
  if (typeof next.text === 'string') {
    next.richText = isBuilderRichText(next.richText)
      ? { ...next.richText, plainText: next.text }
      : richTextFromPlainText(next.text);
    return next;
  }

  if (isBuilderRichText(next.richText)) {
    next.text = next.richText.plainText;
  }

  return next;
}

function cloneDefaultContent(content: Record<string, unknown>): Record<string, unknown> {
  return JSON.parse(JSON.stringify(content)) as Record<string, unknown>;
}

function cloneNodeSet(nodes: BuilderCanvasNode[], offset: number): BuilderCanvasNode[] {
  const idMap = new Map<string, string>();

  for (const node of nodes) {
    idMap.set(node.id, createNodeId(node.kind));
  }

  return nodes.map((node) => ({
    ...node,
    id: idMap.get(node.id)!,
    parentId: node.parentId && idMap.has(node.parentId) ? idMap.get(node.parentId)! : node.parentId,
    rect: {
      ...node.rect,
      x: node.rect.x + offset,
      y: node.rect.y + offset,
    },
  }));
}

function reorderNodeSequence(
  nodes: BuilderCanvasNode[],
  selectedNodeId: string,
  nextIndex: number,
): BuilderCanvasNode[] {
  const currentIndex = nodes.findIndex((node) => node.id === selectedNodeId);
  if (currentIndex === -1) return nodes;
  const clampedIndex = Math.max(0, Math.min(nodes.length - 1, nextIndex));
  if (currentIndex === clampedIndex) return nodes;
  const nextNodes = [...nodes];
  const [selectedNode] = nextNodes.splice(currentIndex, 1);
  nextNodes.splice(clampedIndex, 0, selectedNode);
  return nextNodes;
}

function sameDocumentContent(left: BuilderCanvasDocument, right: BuilderCanvasDocument): boolean {
  if (left === right) return true;
  if (left.nodes === right.nodes && left.locale === right.locale && left.version === right.version) return true;
  if (left.locale !== right.locale || left.version !== right.version) return false;
  if (left.nodes.length !== right.nodes.length) return false;

  for (let index = 0; index < left.nodes.length; index += 1) {
    const leftNode = left.nodes[index];
    const rightNode = right.nodes[index];
    if (!leftNode || !rightNode) return false;
    if (leftNode === rightNode) continue;
    if (leftNode.id !== rightNode.id) return false;
    if (!sameCanvasNodeContent(leftNode, rightNode)) return false;
  }

  return true;
}

function sameJsonContent(left: unknown, right: unknown): boolean {
  return left === right || JSON.stringify(left) === JSON.stringify(right);
}

function sameCanvasNodeContent(left: BuilderCanvasNode, right: BuilderCanvasNode): boolean {
  if (left === right) return true;
  if (
    left.id !== right.id
    || left.kind !== right.kind
    || left.parentId !== right.parentId
    || left.zIndex !== right.zIndex
    || left.rotation !== right.rotation
    || left.locked !== right.locked
    || left.visible !== right.visible
    || left.anchorName !== right.anchorName
    || !areCanvasNodeRectsEqual(left.rect, right.rect)
  ) {
    return false;
  }

  return sameJsonContent(left.style, right.style)
    && sameJsonContent(left.sticky, right.sticky)
    && sameJsonContent(left.hoverStyle, right.hoverStyle)
    && sameJsonContent(left.animation, right.animation)
    && sameJsonContent(left.responsive, right.responsive)
    && sameJsonContent(left.content, right.content);
}

function sameDocumentIdentity(left: BuilderCanvasDocument, right: BuilderCanvasDocument): boolean {
  return left === right
    || (left.nodes === right.nodes && left.locale === right.locale && left.version === right.version);
}

function cloneCanvasNodeRect(rect: CanvasNodeRect): CanvasNodeRect {
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  };
}

function areCanvasNodeRectsEqual(left: CanvasNodeRect, right: CanvasNodeRect): boolean {
  return left.x === right.x
    && left.y === right.y
    && left.width === right.width
    && left.height === right.height;
}

function getCanvasNodeRectById(
  rectsById: BuilderCanvasNodeRectsById,
  nodeId: string,
): CanvasNodeRect | undefined {
  const mapReader = (rectsById as ReadonlyMap<string, CanvasNodeRect>).get;
  if (typeof mapReader === 'function') {
    return mapReader.call(rectsById, nodeId);
  }
  return (rectsById as Record<string, CanvasNodeRect>)[nodeId];
}

function applyCanvasNodeRectForViewport(
  node: BuilderCanvasNode,
  rect: CanvasNodeRect,
  viewport: Viewport,
): BuilderCanvasNode {
  const nextRect = cloneCanvasNodeRect(rect);
  if (viewport === 'desktop') {
    return areCanvasNodeRectsEqual(node.rect, nextRect)
      ? node
      : { ...node, rect: nextRect };
  }

  const responsive = (node.responsive ?? {}) as ResponsiveConfigValue;
  const previousOverride = (responsive[viewport] ?? {}) as ResponsiveOverrideValue;
  const previousRect = previousOverride.rect;
  const previousFullRect = previousRect
    && previousRect.x !== undefined
    && previousRect.y !== undefined
    && previousRect.width !== undefined
    && previousRect.height !== undefined
    ? {
        x: previousRect.x,
        y: previousRect.y,
        width: previousRect.width,
        height: previousRect.height,
      }
    : null;

  if (previousFullRect && areCanvasNodeRectsEqual(previousFullRect, nextRect)) {
    return node;
  }

  const nextOverride: ResponsiveOverrideValue = {
    ...previousOverride,
    rect: nextRect,
  };
  const nextResponsive: ResponsiveConfigValue = {
    ...responsive,
    [viewport]: nextOverride,
  };

  return {
    ...node,
    responsive: nextResponsive,
  } as BuilderCanvasNode;
}

function resolveSelectedNodeId(
  document: BuilderCanvasDocument,
  preferredNodeId: string | null,
): string | null {
  if (preferredNodeId && document.nodes.some((node) => node.id === preferredNodeId)) {
    return preferredNodeId;
  }
  return document.nodes[0]?.id ?? null;
}

function resolveSelectedNodeIds(
  document: BuilderCanvasDocument,
  preferredNodeIds: string[],
  selectedNodeId: string | null,
): string[] {
  const existingIds = new Set(document.nodes.map((node) => node.id));
  const filteredNodeIds = preferredNodeIds.filter((nodeId) => existingIds.has(nodeId));
  if (filteredNodeIds.length > 0) return filteredNodeIds;
  if (selectedNodeId && existingIds.has(selectedNodeId)) return [selectedNodeId];
  return [];
}

function resolveActiveGroupId(
  document: BuilderCanvasDocument,
  preferredGroupId: string | null,
): string | null {
  if (!preferredGroupId) return null;
  const node = document.nodes.find((candidate) => candidate.id === preferredGroupId);
  if (!node) return null;
  return isContainerLikeKind(node.kind) || node.kind === 'composite' ? node.id : null;
}

function resolveTreeState(
  document: BuilderCanvasDocument,
  preferredGroupId: string | null,
): Pick<BuilderCanvasStoreState, 'activeGroupId' | 'childrenMap' | 'nodesById'> {
  return {
    activeGroupId: resolveActiveGroupId(document, preferredGroupId),
    childrenMap: buildChildrenMap(document.nodes),
    nodesById: getCanvasNodesById(document.nodes),
  };
}

function alignNodeRects(
  action: BuilderCanvasAlignmentAction,
  nodes: Array<{ id: string; rect: BuilderCanvasNode['rect'] }>,
) {
  switch (action) {
    case 'left':
      return alignLeft(nodes);
    case 'center':
      return alignCenter(nodes);
    case 'right':
      return alignRight(nodes);
    case 'top':
      return alignTop(nodes);
    case 'middle':
      return alignMiddle(nodes);
    case 'bottom':
      return alignBottom(nodes);
    default:
      return nodes;
  }
}

function applyTransientDocument(
  state: BuilderCanvasStoreState,
  document: BuilderCanvasDocument,
  selectedNodeId = state.selectedNodeId,
  selectedNodeIds = state.selectedNodeIds,
): Partial<BuilderCanvasStoreState> | BuilderCanvasStoreState {
  if (state.document && sameDocumentIdentity(document, state.document)) return state;
  const nextSelectedNodeId = resolveSelectedNodeId(document, selectedNodeId);
  const nextTreeState = resolveTreeState(document, state.activeGroupId);
  return {
    document,
    selectedNodeId: nextSelectedNodeId,
    selectedNodeIds: resolveSelectedNodeIds(document, selectedNodeIds, nextSelectedNodeId),
    ...nextTreeState,
  };
}

function applyCommittedDocument(
  state: BuilderCanvasStoreState,
  document: BuilderCanvasDocument,
  selectedNodeId = state.selectedNodeId,
  selectedNodeIds = state.selectedNodeIds,
): Partial<BuilderCanvasStoreState> | BuilderCanvasStoreState {
  if (!state.document || !state.history || sameDocumentContent(document, state.document)) return state;
  const nextHistory = pushHistory(state.history, document);
  const nextSelectedNodeId = resolveSelectedNodeId(document, selectedNodeId);
  const nextTreeState = resolveTreeState(document, state.activeGroupId);
  return {
    document,
    selectedNodeId: nextSelectedNodeId,
    selectedNodeIds: resolveSelectedNodeIds(document, selectedNodeIds, nextSelectedNodeId),
    ...nextTreeState,
    history: nextHistory,
    mutationBaseDocument: null,
    canUndo: nextHistory.canUndo,
    canRedo: nextHistory.canRedo,
  };
}

export const useBuilderCanvasStore = create<BuilderCanvasStoreState>((set) => ({
  document: null,
  selectedNodeId: null,
  selectedNodeIds: [],
  selectedSurfaceKey: null,
  setSelectedSurfaceKey: (key) => set({ selectedSurfaceKey: key }),
  activeGroupId: null,
  draftSaveState: 'idle',
  clipboardHasContent: hasClipboard(),
  clipboardCount: getClipboardCount(),
  history: null,
  mutationBaseDocument: null,
  canUndo: false,
  canRedo: false,
  childrenMap: {},
  nodesById: EMPTY_NODES_BY_ID,
  viewport: 'desktop' as Viewport,
  setViewport: (viewport) => set({ viewport }),
  replaceDocument: (document) =>
    set({
      document,
      selectedNodeId: null,
      selectedNodeIds: [],
      activeGroupId: null,
      draftSaveState: 'idle',
      history: createHistory(document),
      mutationBaseDocument: null,
      canUndo: false,
      canRedo: false,
      childrenMap: buildChildrenMap(document.nodes),
      nodesById: getCanvasNodesById(document.nodes),
    }),
  setSelectedNodeId: (selectedNodeId) =>
    set({
      selectedNodeId,
      selectedNodeIds: selectedNodeId ? [selectedNodeId] : [],
      selectedSurfaceKey: null,
    }),
  setSelectedNodeIds: (selectedNodeIds, primaryNodeId = null) =>
    set((state) => {
      if (!state.document) return state;
      if (selectedNodeIds.length === 0) {
        return {
          selectedNodeId: null,
          selectedNodeIds: [],
        };
      }
      const selectedId = primaryNodeId ?? selectedNodeIds[selectedNodeIds.length - 1] ?? null;
      return {
        selectedNodeId: selectedId,
        selectedNodeIds: resolveSelectedNodeIds(state.document, selectedNodeIds, selectedId),
      };
    }),
  toggleNodeSelection: (nodeId) =>
    set((state) => {
      if (!state.document) return state;
      const exists = state.selectedNodeIds.includes(nodeId);
      const selectedNodeIds = exists
        ? state.selectedNodeIds.filter((candidateId) => candidateId !== nodeId)
        : [...state.selectedNodeIds, nodeId];
      if (selectedNodeIds.length === 0) {
        return {
          selectedNodeId: null,
          selectedNodeIds: [],
        };
      }
      return {
        selectedNodeId: exists
          ? selectedNodeIds[selectedNodeIds.length - 1] ?? null
          : nodeId,
        selectedNodeIds,
      };
    }),
  enterGroup: (groupId) =>
    set((state) => {
      if (!state.document) return state;
      const groupNode = state.document.nodes.find((node) => node.id === groupId);
      if (!groupNode || (!isContainerLikeKind(groupNode.kind) && groupNode.kind !== 'composite')) {
        return state;
      }
      return {
        activeGroupId: groupId,
        selectedNodeId: null,
        selectedNodeIds: [],
      };
    }),
  exitGroup: () =>
    set((state) => {
      if (!state.document || !state.activeGroupId) return state;
      const groupNode = state.document.nodes.find((node) => node.id === state.activeGroupId);
      return {
        activeGroupId: null,
        selectedNodeId: groupNode?.id ?? null,
        selectedNodeIds: groupNode ? [groupNode.id] : [],
      };
    }),
  setDraftSaveState: (draftSaveState) => set({ draftSaveState }),
  beginMutationSession: () =>
    set((state) => {
      if (!state.document || state.mutationBaseDocument) return state;
      return {
        mutationBaseDocument: state.document,
      };
    }),
  commitMutationSession: () =>
    set((state) => {
      if (!state.document || !state.mutationBaseDocument || !state.history) return state;
      if (sameDocumentContent(state.document, state.mutationBaseDocument)) {
        return {
          mutationBaseDocument: null,
        };
      }
      const document: BuilderCanvasDocument = {
        ...state.document,
        updatedAt: new Date().toISOString(),
      };
      const nextHistory = pushHistory(state.history, document);
      return {
        document,
        history: nextHistory,
        mutationBaseDocument: null,
        canUndo: nextHistory.canUndo,
        canRedo: nextHistory.canRedo,
      };
    }),
  cancelMutationSession: () =>
    set((state) => {
      if (!state.mutationBaseDocument) return state;
      const document = state.mutationBaseDocument;
      const nextSelectedNodeId = resolveSelectedNodeId(document, state.selectedNodeId);
      const nextTreeState = resolveTreeState(document, state.activeGroupId);
      return {
        document,
        selectedNodeId: nextSelectedNodeId,
        selectedNodeIds: resolveSelectedNodeIds(document, state.selectedNodeIds, nextSelectedNodeId),
        ...nextTreeState,
        mutationBaseDocument: null,
      };
    }),
  undo: () =>
    set((state) => {
      if (!state.document || !state.history) return state;
      const result = undoHistory(state.history);
      if (!result) return state;
      const previousDocument = result.snapshot;
      const nextSelectedNodeId = resolveSelectedNodeId(previousDocument, state.selectedNodeId);
      const nextTreeState = resolveTreeState(previousDocument, state.activeGroupId);
      return {
        document: previousDocument,
        selectedNodeId: nextSelectedNodeId,
        selectedNodeIds: resolveSelectedNodeIds(previousDocument, state.selectedNodeIds, nextSelectedNodeId),
        ...nextTreeState,
        history: result.state,
        mutationBaseDocument: null,
        canUndo: result.state.canUndo,
        canRedo: result.state.canRedo,
      };
    }),
  redo: () =>
    set((state) => {
      if (!state.document || !state.history) return state;
      const result = redoHistory(state.history);
      if (!result) return state;
      const nextDocument = result.snapshot;
      const nextSelectedNodeId = resolveSelectedNodeId(nextDocument, state.selectedNodeId);
      const nextTreeState = resolveTreeState(nextDocument, state.activeGroupId);
      return {
        document: nextDocument,
        selectedNodeId: nextSelectedNodeId,
        selectedNodeIds: resolveSelectedNodeIds(nextDocument, state.selectedNodeIds, nextSelectedNodeId),
        ...nextTreeState,
        history: result.state,
        mutationBaseDocument: null,
        canUndo: result.state.canUndo,
        canRedo: result.state.canRedo,
      };
    }),
  copySelectedNodesToClipboard: () =>
    set((state) => {
      if (!state.document || state.selectedNodeIds.length === 0) return state;
      const selectedNodeIds = new Set([
        ...state.selectedNodeIds,
        ...state.selectedNodeIds.flatMap((nodeId) => getCanvasNodeDescendantIds(nodeId, state.childrenMap)),
      ]);
      const selectedNodes = state.document.nodes.filter((node) => selectedNodeIds.has(node.id));
      if (selectedNodes.length === 0) return state;
      copyNodes(selectedNodes);
      return {
        clipboardHasContent: hasClipboard(),
        clipboardCount: getClipboardCount(),
      };
    }),
  cutSelectedNodesToClipboard: () =>
    set((state) => {
      if (!state.document || state.selectedNodeIds.length === 0) return state;
      const unlockedRootIds = state.document.nodes
        .filter((node) => state.selectedNodeIds.includes(node.id) && !node.locked)
        .map((node) => node.id);
      const selectedNodes = state.document.nodes.filter(
        (node) => unlockedRootIds.includes(node.id)
          || unlockedRootIds.some((rootId) => getCanvasNodeDescendantIds(rootId, state.childrenMap).includes(node.id)),
      );
      if (selectedNodes.length === 0) return state;
      cutNodes(selectedNodes);
      const selectedNodeIds = new Set(selectedNodes.map((node) => node.id));
      const document = updateNodes(state.document, (nodes) =>
        nodes.filter((node) => !selectedNodeIds.has(node.id)));
      const nextState = applyCommittedDocument(state, document, document.nodes[0]?.id ?? null);
      if (nextState === state) {
        return {
          clipboardHasContent: hasClipboard(),
          clipboardCount: getClipboardCount(),
        };
      }
      return {
        ...nextState,
        clipboardHasContent: hasClipboard(),
        clipboardCount: getClipboardCount(),
      };
    }),
  pasteClipboardNodes: () =>
    set((state) => {
      if (!state.document) return state;
      const activeGroupNode = state.activeGroupId
        ? state.document.nodes.find((node) => node.id === state.activeGroupId) ?? null
        : null;
      const nodesById = getCanvasNodesById(state.document.nodes);
      const activeGroupRect = activeGroupNode
        ? resolveCanvasNodeAbsoluteRect(activeGroupNode, nodesById)
        : null;
      const pastedNodes = pasteNodes(20).map((node, index, collection) => {
        const pastedIds = new Set(collection.map((candidate) => candidate.id));
        const isPastedRoot = !node.parentId || !pastedIds.has(node.parentId);
        const shouldReparentToActiveGroup = Boolean(activeGroupNode && isPastedRoot);
        const nextRect = shouldReparentToActiveGroup
          ? resolveCanvasNodeLocalRect(node.rect, activeGroupRect)
          : node.rect;
        return {
          ...node,
          parentId: shouldReparentToActiveGroup ? activeGroupNode!.id : node.parentId,
          rect: nextRect,
          zIndex: state.document!.nodes.length + index,
        };
      });
      if (pastedNodes.length === 0) {
        return {
          clipboardHasContent: hasClipboard(),
          clipboardCount: getClipboardCount(),
        };
      }
      const pastedNodeIds = new Set(pastedNodes.map((node) => node.id));
      const pastedRootIds = pastedNodes
        .filter((node) => !node.parentId || !pastedNodeIds.has(node.parentId))
        .map((node) => node.id);
      const document = updateNodes(state.document, (nodes) => [...nodes, ...pastedNodes]);
      const nextState = applyCommittedDocument(
        state,
        document,
        pastedRootIds[pastedRootIds.length - 1] ?? pastedNodes[pastedNodes.length - 1]?.id ?? null,
        pastedRootIds.length > 0 ? pastedRootIds : pastedNodes.map((node) => node.id),
      );
      if (nextState === state) {
        return {
          clipboardHasContent: hasClipboard(),
          clipboardCount: getClipboardCount(),
        };
      }
      return {
        ...nextState,
        clipboardHasContent: hasClipboard(),
        clipboardCount: getClipboardCount(),
      };
    }),
  alignSelectedNodes: (action) =>
    set((state) => {
      if (!state.document || state.selectedNodeIds.length < 2) return state;
      const targetNodes = state.document.nodes.filter(
        (node) => state.selectedNodeIds.includes(node.id) && !node.locked,
      );
      if (targetNodes.length < 2) return state;
      const nextRects = new Map(
        alignNodeRects(
          action,
          targetNodes.map((node) => ({ id: node.id, rect: node.rect })),
        ).map((node) => [node.id, node.rect]),
      );
      const document = updateNodes(state.document, (nodes) =>
        nodes.map((node) => (
          nextRects.has(node.id)
            ? {
                ...node,
                rect: nextRects.get(node.id)!,
              }
            : node
        )));
      return applyCommittedDocument(state, document);
    }),
  distributeSelectedNodes: (action) =>
    set((state) => {
      if (!state.document || state.selectedNodeIds.length < 3) return state;
      const targetNodes = state.document.nodes.filter(
        (node) => state.selectedNodeIds.includes(node.id) && !node.locked,
      );
      if (targetNodes.length < 3) return state;
      const distributor = action === 'horizontal' ? distributeHorizontal : distributeVertical;
      const nextRects = new Map(
        distributor(targetNodes.map((node) => ({ id: node.id, rect: node.rect }))).map(
          (node) => [node.id, node.rect],
        ),
      );
      const document = updateNodes(state.document, (nodes) =>
        nodes.map((node) => (
          nextRects.has(node.id)
            ? { ...node, rect: nextRects.get(node.id)! }
            : node
        )));
      return applyCommittedDocument(state, document);
    }),
  matchSelectedNodesSize: (action) =>
    set((state) => {
      if (!state.document || state.selectedNodeIds.length < 2) return state;
      const targetNodes = state.document.nodes.filter(
        (node) => state.selectedNodeIds.includes(node.id) && !node.locked,
      );
      if (targetNodes.length < 2) return state;
      const matcher = action === 'width' ? matchWidth : matchHeight;
      const nextRects = new Map(
        matcher(targetNodes.map((node) => ({ id: node.id, rect: node.rect }))).map(
          (node) => [node.id, node.rect],
        ),
      );
      const document = updateNodes(state.document, (nodes) =>
        nodes.map((node) => (
          nextRects.has(node.id)
            ? { ...node, rect: nextRects.get(node.id)! }
            : node
        )));
      return applyCommittedDocument(state, document);
    }),
  groupSelectedNodes: () =>
    set((state) => {
      if (!state.document || state.selectedNodeIds.length < 2) return state;
      const selectedSet = new Set(state.selectedNodeIds);
      const targetNodes = state.document.nodes.filter(
        (node) => selectedSet.has(node.id) && !node.locked,
      );
      if (targetNodes.length < 2) return state;
      const sharedParentId = targetNodes[0]!.parentId ?? null;
      const allShareParent = targetNodes.every((node) => (node.parentId ?? null) === sharedParentId);
      if (!allShareParent) return state;
      const nodesById = getCanvasNodesById(state.document.nodes);
      const absoluteRects = new Map(
        targetNodes.map((node) => [node.id, resolveCanvasNodeAbsoluteRect(node, nodesById)]),
      );
      const minX = Math.min(...targetNodes.map((node) => absoluteRects.get(node.id)!.x));
      const minY = Math.min(...targetNodes.map((node) => absoluteRects.get(node.id)!.y));
      const maxX = Math.max(...targetNodes.map((node) => {
        const rect = absoluteRects.get(node.id)!;
        return rect.x + rect.width;
      }));
      const maxY = Math.max(...targetNodes.map((node) => {
        const rect = absoluteRects.get(node.id)!;
        return rect.y + rect.height;
      }));
      const maxZ = Math.max(...targetNodes.map((node) => node.zIndex));
      const groupRect = { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
      const groupId = `group-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const groupParentNode = sharedParentId ? nodesById.get(sharedParentId) ?? null : null;
      const groupParentAbsoluteRect = groupParentNode
        ? resolveCanvasNodeAbsoluteRect(groupParentNode, nodesById)
        : null;
      const localGroupRect = resolveCanvasNodeLocalRect(groupRect, groupParentAbsoluteRect);
      const groupNode: BuilderCanvasNode = {
        id: groupId,
        kind: 'container',
        ...(sharedParentId ? { parentId: sharedParentId } : {}),
        rect: localGroupRect,
        style: createDefaultCanvasNodeStyle(),
        zIndex: maxZ,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: 'Group',
          background: 'transparent',
          borderColor: 'transparent',
          borderStyle: 'solid' as const,
          borderWidth: 0,
          borderRadius: 0,
          padding: 0,
          layoutMode: 'absolute' as const,
        },
      };
      const targetIds = new Set(targetNodes.map((node) => node.id));
      const document = updateNodes(state.document, (nodes) => [
        ...nodes.map((node) => {
          if (!targetIds.has(node.id)) return node;
          const absRect = absoluteRects.get(node.id)!;
          return {
            ...node,
            parentId: groupId,
            rect: {
              x: absRect.x - minX,
              y: absRect.y - minY,
              width: absRect.width,
              height: absRect.height,
            },
          };
        }),
        groupNode,
      ]);
      return applyCommittedDocument(state, document, groupId);
    }),
  ungroupSelectedNode: () =>
    set((state) => {
      if (!state.document || state.selectedNodeIds.length !== 1) return state;
      const targetId = state.selectedNodeIds[0]!;
      const groupNode = state.document.nodes.find((node) => node.id === targetId);
      if (!groupNode || groupNode.kind !== 'container') return state;
      const childIds = state.childrenMap[targetId] ?? [];
      if (childIds.length === 0) return state;
      const nodesById = getCanvasNodesById(state.document.nodes);
      const groupAbsoluteRect = resolveCanvasNodeAbsoluteRect(groupNode, nodesById);
      const groupParentNode = groupNode.parentId ? nodesById.get(groupNode.parentId) ?? null : null;
      const groupParentAbsoluteRect = groupParentNode
        ? resolveCanvasNodeAbsoluteRect(groupParentNode, nodesById)
        : null;
      const childIdSet = new Set(childIds);
      const document = updateNodes(state.document, (nodes) =>
        nodes
          .filter((node) => node.id !== targetId)
          .map((node) => {
            if (!childIdSet.has(node.id)) return node;
            const absX = groupAbsoluteRect.x + node.rect.x;
            const absY = groupAbsoluteRect.y + node.rect.y;
            const localRect = resolveCanvasNodeLocalRect(
              { x: absX, y: absY, width: node.rect.width, height: node.rect.height },
              groupParentAbsoluteRect,
            );
            const nextNode: BuilderCanvasNode = {
              ...node,
              rect: localRect,
            };
            if (groupNode.parentId) {
              nextNode.parentId = groupNode.parentId;
            } else {
              delete (nextNode as { parentId?: string }).parentId;
            }
            return nextNode;
          }),
      );
      const next = applyCommittedDocument(state, document);
      return {
        ...next,
        selectedNodeIds: childIds,
        selectedNodeId: childIds[0] ?? null,
      };
    }),
  toggleSelectedNodeLock: () =>
    set((state) => {
      if (!state.document || state.selectedNodeIds.length === 0) return state;
      const selectedNodeIds = new Set(state.selectedNodeIds);
      const selectedNodes = state.document.nodes.filter((node) => selectedNodeIds.has(node.id));
      if (selectedNodes.length === 0) return state;
      const shouldLock = selectedNodes.some((node) => !node.locked);
      const document = updateNodes(state.document, (nodes) =>
        nodes.map((node) => (
          selectedNodeIds.has(node.id)
            ? {
                ...node,
                locked: shouldLock,
              }
            : node
        )));
      return applyCommittedDocument(state, document);
    }),
  addNode: (node) =>
    set((state) => {
      if (!state.document) return state;
      const activeGroupNode = state.activeGroupId
        ? state.document.nodes.find((candidate) => candidate.id === state.activeGroupId) ?? null
        : null;
      const nodesById = getCanvasNodesById(state.document.nodes);
      const activeGroupRect = activeGroupNode
        ? resolveCanvasNodeAbsoluteRect(activeGroupNode, nodesById)
        : null;
      const nextNode = activeGroupNode
        ? {
            ...node,
            parentId: activeGroupNode.id,
            rect: resolveCanvasNodeLocalRect(node.rect, activeGroupRect),
          }
        : node;
      const document = updateNodes(state.document, (nodes) => [...nodes, nextNode]);
      return applyCommittedDocument(state, document, nextNode.id);
    }),
  addNodes: (incomingNodes, rootNodeId) =>
    set((state) => {
      if (!state.document || incomingNodes.length === 0) return state;
      const incomingIds = new Set(incomingNodes.map((n) => n.id));
      const activeGroupNode = state.activeGroupId
        ? state.document.nodes.find((candidate) => candidate.id === state.activeGroupId) ?? null
        : null;
      const nodesById = getCanvasNodesById(state.document.nodes);
      const activeGroupRect = activeGroupNode
        ? resolveCanvasNodeAbsoluteRect(activeGroupNode, nodesById)
        : null;

      const baseZ = state.document.nodes.length;
      const adjustedNodes = incomingNodes.map((node, index) => {
        // Roots — nodes whose parentId points outside the incoming set.
        const isRoot = !node.parentId || !incomingIds.has(node.parentId);
        if (isRoot) {
          // Reparent root to active group if any (and translate rect to group-local).
          if (activeGroupNode) {
            return {
              ...node,
              parentId: activeGroupNode.id,
              rect: resolveCanvasNodeLocalRect(node.rect, activeGroupRect),
              zIndex: baseZ + index,
            };
          }
          return {
            ...node,
            parentId: undefined,
            zIndex: baseZ + index,
          };
        }
        return {
          ...node,
          zIndex: baseZ + index,
        };
      });

      const document = updateNodes(state.document, (nodes) => [...nodes, ...adjustedNodes]);
      const primarySelectedId = rootNodeId && incomingIds.has(rootNodeId)
        ? rootNodeId
        : adjustedNodes[adjustedNodes.length - 1]?.id ?? null;
      return applyCommittedDocument(
        state,
        document,
        primarySelectedId,
        adjustedNodes.map((n) => n.id),
      );
    }),
  duplicateSelectedNode: () =>
    set((state) => {
      if (!state.document || state.selectedNodeIds.length === 0) return state;
      const rootNodeIds = state.document.nodes
        .filter((node) => state.selectedNodeIds.includes(node.id) && !node.locked)
        .map((node) => node.id);
      const selectedNodeIds = new Set([
        ...rootNodeIds,
        ...rootNodeIds.flatMap((nodeId) => getCanvasNodeDescendantIds(nodeId, state.childrenMap)),
      ]);
      const selectedNodes = state.document.nodes.filter((node) => selectedNodeIds.has(node.id));
      if (selectedNodes.length === 0) return state;
      const duplicatedNodes = cloneNodeSet(selectedNodes, 20);
      const document = updateNodes(state.document, (nodes) => [...nodes, ...duplicatedNodes]);
      return applyCommittedDocument(
        state,
        document,
        duplicatedNodes[duplicatedNodes.length - 1]?.id ?? null,
        duplicatedNodes.map((node) => node.id),
      );
    }),
  updateSelectedNodes: (nodeIds, updater, mode = 'commit') =>
    set((state) => {
      if (!state.document || nodeIds.length === 0) return state;
      const targetNodeIds = new Set(nodeIds);
      const hasMatch = state.document.nodes.some((node) => targetNodeIds.has(node.id));
      if (!hasMatch) return state;
      const document = updateNodes(state.document, (nodes) =>
        nodes.map((node) => (targetNodeIds.has(node.id) ? updater(node) : node)),
        updateNodesOptionsForMode(mode));
      return mode === 'transient'
        ? applyTransientDocument(state, document)
        : applyCommittedDocument(state, document);
    }),
  updateNode: (nodeId, updater, mode = 'commit') =>
    set((state) => {
      if (!state.document) return state;
      const existingNode = state.document.nodes.find((node) => node.id === nodeId);
      if (!existingNode) return state;
      const document = updateNodes(state.document, (nodes) =>
        nodes.map((node) => (node.id === nodeId ? updater(node) : node)),
        updateNodesOptionsForMode(mode));
      return mode === 'transient'
        ? applyTransientDocument(state, document)
        : applyCommittedDocument(state, document);
    }),
  updateNodeRectsForViewport: (rectsById, viewport, mode = 'commit') =>
    set((state) => {
      if (!state.document) return state;
      let changed = false;
      const document = updateNodes(state.document, (nodes) =>
        nodes.map((node) => {
          const rect = getCanvasNodeRectById(rectsById, node.id);
          if (!rect) return node;
          const nextNode = applyCanvasNodeRectForViewport(node, rect, viewport);
          if (nextNode !== node) changed = true;
          return nextNode;
        }),
        updateNodesOptionsForMode(mode));
      if (!changed) return state;
      return mode === 'transient'
        ? applyTransientDocument(state, document)
        : applyCommittedDocument(state, document);
    }),
  updateNodeContent: (nodeId, content, mode = 'commit') =>
    set((state) => {
      if (!state.document) return state;
      const existingNode = state.document.nodes.find((node) => node.id === nodeId);
      if (!existingNode) return state;
      // Merge keys that exist in the node's content or the component's default content
      const componentDef = getComponent(existingNode.kind);
      const defaultContent = componentDef?.defaultContent ?? {};
      const normalizedContent = normalizeRichTextContentPatch(existingNode, content);
      const validContent: Record<string, unknown> = {};
      for (const key of Object.keys(normalizedContent)) {
        if (key in existingNode.content || key in defaultContent) {
          validContent[key] = normalizedContent[key];
        }
      }
      if (Object.keys(validContent).length === 0) return state;
      const document = updateNodes(state.document, (nodes) =>
        nodes.map((node) => (
          node.id === nodeId
            ? {
                ...node,
                content: {
                  ...node.content,
                  ...validContent,
                },
              } as BuilderCanvasNode
            : node
        )),
        updateNodesOptionsForMode(mode));
      return mode === 'transient'
        ? applyTransientDocument(state, document)
        : applyCommittedDocument(state, document);
    }),
  updateNodeStyle: (nodeId, style, mode = 'commit') =>
    set((state) => {
      if (!state.document) return state;
      const existingNode = state.document.nodes.find((node) => node.id === nodeId);
      if (!existingNode) return state;
      const document = updateNodes(state.document, (nodes) =>
        nodes.map((node) => (
          node.id === nodeId
            ? {
                ...node,
                style: {
                  ...node.style,
                  ...style,
                },
              } as BuilderCanvasNode
            : node
        )),
        updateNodesOptionsForMode(mode));
      return mode === 'transient'
        ? applyTransientDocument(state, document)
        : applyCommittedDocument(state, document);
    }),
  deleteSelectedNode: () =>
    set((state) => {
      if (!state.document || state.selectedNodeIds.length === 0) return state;
      const unlockedRootIds = state.document.nodes
        .filter((node) => state.selectedNodeIds.includes(node.id) && !node.locked)
        .map((node) => node.id);
      const selectedNodeIds = new Set([
        ...unlockedRootIds,
        ...unlockedRootIds.flatMap((nodeId) => getCanvasNodeDescendantIds(nodeId, state.childrenMap)),
      ]);
      if (selectedNodeIds.size === 0) return state;
      const nodes = state.document.nodes.filter((node) => !selectedNodeIds.has(node.id));
      const document = updateNodes(state.document, () => nodes);
      const shouldExitGroup = Boolean(
        state.activeGroupId
        && !selectedNodeIds.has(state.activeGroupId)
        && !nodes.some((node) => node.parentId === state.activeGroupId),
      );
      const nextSelectedNodeId = shouldExitGroup
        ? state.activeGroupId
        : document.nodes[0]?.id ?? null;
      const nextState = applyCommittedDocument(
        state,
        document,
        nextSelectedNodeId,
        nextSelectedNodeId ? [nextSelectedNodeId] : [],
      );
      if (nextState === state) return state;
      return shouldExitGroup
        ? {
            ...nextState,
            activeGroupId: null,
            selectedNodeId: nextSelectedNodeId,
            selectedNodeIds: nextSelectedNodeId ? [nextSelectedNodeId] : [],
          }
        : nextState;
    }),
  nudgeSelectedNode: (deltaX, deltaY) =>
    set((state) => {
      if (!state.document || state.selectedNodeIds.length === 0) return state;
      const selectedNodeIds = new Set(
        state.document.nodes
          .filter((node) => state.selectedNodeIds.includes(node.id) && !node.locked)
          .map((node) => node.id),
      );
      if (selectedNodeIds.size === 0) return state;
      const document = updateNodes(state.document, (nodes) =>
        nodes.map((node) =>
          selectedNodeIds.has(node.id)
            ? {
                ...node,
                rect: {
                  ...node.rect,
                  x: Math.max(0, Math.round(node.rect.x + deltaX)),
                  y: Math.max(0, Math.round(node.rect.y + deltaY)),
                },
              }
            : node));
      return applyCommittedDocument(state, document);
    }),
  bringSelectedNodeForward: () =>
    set((state) => {
      if (!state.document || !state.selectedNodeId) return state;
      const selectedNode = state.document.nodes.find((node) => node.id === state.selectedNodeId);
      if (!selectedNode || selectedNode.locked) return state;
      const currentIndex = state.document.nodes.findIndex((node) => node.id === state.selectedNodeId);
      if (state.selectedNodeIds.length !== 1) return state;
      if (currentIndex === -1) return state;
      const document = updateNodes(state.document, (nodes) =>
        reorderNodeSequence(nodes, state.selectedNodeId!, currentIndex + 1));
      return applyCommittedDocument(state, document);
    }),
  sendSelectedNodeBackward: () =>
    set((state) => {
      if (!state.document || !state.selectedNodeId) return state;
      const selectedNode = state.document.nodes.find((node) => node.id === state.selectedNodeId);
      if (!selectedNode || selectedNode.locked) return state;
      const currentIndex = state.document.nodes.findIndex((node) => node.id === state.selectedNodeId);
      if (state.selectedNodeIds.length !== 1) return state;
      if (currentIndex === -1) return state;
      const document = updateNodes(state.document, (nodes) =>
        reorderNodeSequence(nodes, state.selectedNodeId!, currentIndex - 1));
      return applyCommittedDocument(state, document);
    }),
  bringSelectedNodeToFront: () =>
    set((state) => {
      if (!state.document || !state.selectedNodeId || state.selectedNodeIds.length !== 1) return state;
      const selectedNode = state.document.nodes.find((node) => node.id === state.selectedNodeId);
      if (!selectedNode || selectedNode.locked) return state;
      const document = updateNodes(state.document, (nodes) =>
        reorderNodeSequence(nodes, state.selectedNodeId!, nodes.length - 1));
      return applyCommittedDocument(state, document);
    }),
  sendSelectedNodeToBack: () =>
    set((state) => {
      if (!state.document || !state.selectedNodeId || state.selectedNodeIds.length !== 1) return state;
      const selectedNode = state.document.nodes.find((node) => node.id === state.selectedNodeId);
      if (!selectedNode || selectedNode.locked) return state;
      const document = updateNodes(state.document, (nodes) =>
        reorderNodeSequence(nodes, state.selectedNodeId!, 0));
      return applyCommittedDocument(state, document);
    }),
  reorderNodes: (orderedIds) =>
    set((state) => {
      if (!state.document) return state;
      const nodeMap = new Map(getCanvasNodesById(state.document.nodes));
      const reordered: BuilderCanvasNode[] = [];
      for (const id of orderedIds) {
        const node = nodeMap.get(id);
        if (node) {
          reordered.push({ ...node, zIndex: reordered.length });
          nodeMap.delete(id);
        }
      }
      for (const node of nodeMap.values()) {
        reordered.push({ ...node, zIndex: reordered.length });
      }
      const nextDocument: BuilderCanvasDocument = {
        ...state.document,
        updatedAt: new Date().toISOString(),
        nodes: reordered,
      };
      return applyCommittedDocument(state, nextDocument);
    }),
  moveNodeIntoContainer: (nodeId, containerId) =>
    set((state) => {
      if (!state.document) return state;
      const nodesById = getCanvasNodesById(state.document.nodes);
      const node = nodesById.get(nodeId);
      const container = nodesById.get(containerId);
      if (!node || !container || !isContainerLikeKind(container.kind) || nodeId === containerId) return state;
      if (isCanvasNodeAncestor(nodeId, containerId, nodesById)) return state;

      const absoluteNodeRect = resolveCanvasNodeAbsoluteRect(node, nodesById);
      const absoluteContainerRect = resolveCanvasNodeAbsoluteRect(container, nodesById);
      const document = updateNodes(state.document, (nodes) =>
        nodes.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                parentId: containerId,
                rect: resolveCanvasNodeLocalRect(absoluteNodeRect, absoluteContainerRect),
              }
            : n,
        ),
      );
      return applyCommittedDocument(state, document);
    }),
  moveNodeOutOfContainer: (nodeId) =>
    set((state) => {
      if (!state.document) return state;
      const nodesById = getCanvasNodesById(state.document.nodes);
      const node = nodesById.get(nodeId);
      if (!node || !node.parentId) return state;
      const absoluteNodeRect = resolveCanvasNodeAbsoluteRect(node, nodesById);
      const document = updateNodes(state.document, (nodes) =>
        nodes.map((n) =>
          n.id === nodeId
            ? {
                ...n,
                parentId: undefined,
                rect: {
                  ...n.rect,
                  x: Math.max(0, absoluteNodeRect.x),
                  y: Math.max(0, absoluteNodeRect.y),
                },
              }
            : n,
        ),
      );
      return applyCommittedDocument(state, document);
    }),
  updateResponsiveOverride: (nodeId, viewport, patch, mode = 'commit') =>
    set((state) => {
      if (!state.document) return state;
      if (viewport === 'desktop') return state; // desktop edits go to node.rect directly
      const existingNode = state.document.nodes.find((node) => node.id === nodeId);
      if (!existingNode) return state;
      const document = updateNodes(state.document, (nodes) =>
        nodes.map((node) => {
          if (node.id !== nodeId) return node;
          const responsive: ResponsiveConfig = (node.responsive ?? {}) as ResponsiveConfig;
          const previousOverride = (responsive?.[viewport] ?? {}) as ResponsiveOverride;
          const nextOverride: ResponsiveOverride = {
            ...previousOverride,
            ...patch,
            rect: patch.rect !== undefined
              ? { ...(previousOverride?.rect ?? {}), ...patch.rect }
              : previousOverride?.rect,
          };
          // Drop the override entirely if it's now empty
          const isEmpty = !nextOverride
            || (
              !nextOverride.rect
              && nextOverride.hidden === undefined
              && nextOverride.fontSize === undefined
            );
          const nextResponsive: ResponsiveConfig = {
            ...responsive,
            [viewport]: isEmpty ? undefined : nextOverride,
          };
          // Drop the responsive field entirely if both buckets are empty
          const allEmpty = !nextResponsive?.tablet && !nextResponsive?.mobile;
          const nextNode: BuilderCanvasNode = {
            ...node,
            responsive: allEmpty ? undefined : nextResponsive,
          } as BuilderCanvasNode;
          return nextNode;
        }),
        updateNodesOptionsForMode(mode));
      return mode === 'transient'
        ? applyTransientDocument(state, document)
        : applyCommittedDocument(state, document);
    }),
  resetResponsiveOverride: (nodeId, viewport) =>
    set((state) => {
      if (!state.document) return state;
      if (viewport === 'desktop') return state;
      const existingNode = state.document.nodes.find((node) => node.id === nodeId);
      if (!existingNode || !existingNode.responsive) return state;
      const document = updateNodes(state.document, (nodes) =>
        nodes.map((node) => {
          if (node.id !== nodeId) return node;
          const responsive = node.responsive as ResponsiveConfig | undefined;
          if (!responsive) return node;
          const nextResponsive: ResponsiveConfig = {
            ...responsive,
            [viewport]: undefined,
          };
          const allEmpty = !nextResponsive?.tablet && !nextResponsive?.mobile;
          const nextNode: BuilderCanvasNode = {
            ...node,
            responsive: allEmpty ? undefined : nextResponsive,
          } as BuilderCanvasNode;
          return nextNode;
        }));
      return applyCommittedDocument(state, document);
    }),
}));

export function createCanvasNodeTemplate(
  kind: BuilderCanvasNodeKind,
  x: number,
  y: number,
  zIndex: number,
): BuilderCanvasNode {
  const id = createNodeId(kind);
  const component = getComponent(kind) ?? listComponents().find((entry) => entry.kind === kind);
  if (!component) {
    throw new Error(`Unknown canvas node kind: ${kind}`);
  }

  return {
    id,
    kind,
    rect: {
      x,
      y,
      width: component.defaultRect.width,
      height: component.defaultRect.height,
    },
    style: createDefaultCanvasNodeStyle(component.defaultStyle as Partial<BuilderCanvasNodeStyle>),
    zIndex,
    rotation: 0,
    locked: false,
    visible: true,
    content: cloneDefaultContent(component.defaultContent),
  } as BuilderCanvasNode;
}
