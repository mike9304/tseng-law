'use client';

import { create } from 'zustand';
import { getComponent, listComponents } from '@/lib/builder/components/registry';
import {
  createDefaultCanvasNodeStyle,
  type BuilderCanvasDocument,
  type BuilderCanvasNode,
  type BuilderCanvasNodeKind,
  type BuilderCanvasNodeStyle,
} from '@/lib/builder/canvas/types';
import {
  createHistory,
  pushHistory,
  undoHistory,
  redoHistory,
  type HistoryState,
} from '@/lib/builder/canvas/history';

type DraftSaveState = 'idle' | 'saving' | 'saved' | 'error';
type MutationMode = 'commit' | 'transient';

interface BuilderCanvasStoreState {
  document: BuilderCanvasDocument | null;
  selectedNodeId: string | null;
  selectedNodeIds: string[];
  draftSaveState: DraftSaveState;
  history: HistoryState<BuilderCanvasDocument> | null;
  mutationBaseDocument: BuilderCanvasDocument | null;
  canUndo: boolean;
  canRedo: boolean;
  replaceDocument: (document: BuilderCanvasDocument) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setSelectedNodeIds: (nodeIds: string[], primaryNodeId?: string | null) => void;
  toggleNodeSelection: (nodeId: string) => void;
  setDraftSaveState: (state: DraftSaveState) => void;
  beginMutationSession: () => void;
  commitMutationSession: () => void;
  undo: () => void;
  redo: () => void;
  addNode: (node: BuilderCanvasNode) => void;
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
  updateNodeContent: (nodeId: string, content: Record<string, unknown>, mode?: MutationMode) => void;
  updateNodeStyle: (nodeId: string, style: Partial<BuilderCanvasNodeStyle>, mode?: MutationMode) => void;
  deleteSelectedNode: () => void;
  nudgeSelectedNode: (deltaX: number, deltaY: number) => void;
  bringSelectedNodeForward: () => void;
  sendSelectedNodeBackward: () => void;
  bringSelectedNodeToFront: () => void;
  sendSelectedNodeToBack: () => void;
}

function sortNodes(nodes: BuilderCanvasNode[]): BuilderCanvasNode[] {
  return [...nodes]
    .sort((left, right) => left.zIndex - right.zIndex)
    .map((node, index) => ({ ...node, zIndex: index }));
}

function updateNodes(
  document: BuilderCanvasDocument,
  updater: (nodes: BuilderCanvasNode[]) => BuilderCanvasNode[],
): BuilderCanvasDocument {
  return {
    ...document,
    updatedAt: new Date().toISOString(),
    nodes: sortNodes(updater(document.nodes)),
  };
}

function createNodeId(kind: BuilderCanvasNodeKind): string {
  return `${kind}-${Math.random().toString(36).slice(2, 9)}`;
}

function cloneDefaultContent(content: Record<string, unknown>): Record<string, unknown> {
  return JSON.parse(JSON.stringify(content)) as Record<string, unknown>;
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
  return left.locale === right.locale
    && left.version === right.version
    && JSON.stringify(left.nodes) === JSON.stringify(right.nodes);
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

function applyTransientDocument(
  state: BuilderCanvasStoreState,
  document: BuilderCanvasDocument,
  selectedNodeId = state.selectedNodeId,
  selectedNodeIds = state.selectedNodeIds,
): Partial<BuilderCanvasStoreState> | BuilderCanvasStoreState {
  if (sameDocumentContent(document, state.document ?? document)) return state;
  const nextSelectedNodeId = resolveSelectedNodeId(document, selectedNodeId);
  return {
    document,
    selectedNodeId: nextSelectedNodeId,
    selectedNodeIds: resolveSelectedNodeIds(document, selectedNodeIds, nextSelectedNodeId),
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
  return {
    document,
    selectedNodeId: nextSelectedNodeId,
    selectedNodeIds: resolveSelectedNodeIds(document, selectedNodeIds, nextSelectedNodeId),
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
  draftSaveState: 'idle',
  history: null,
  mutationBaseDocument: null,
  canUndo: false,
  canRedo: false,
  replaceDocument: (document) =>
    set({
      document,
      selectedNodeId: document.nodes[0]?.id ?? null,
      selectedNodeIds: document.nodes[0]?.id ? [document.nodes[0].id] : [],
      draftSaveState: 'idle',
      history: createHistory(document),
      mutationBaseDocument: null,
      canUndo: false,
      canRedo: false,
    }),
  setSelectedNodeId: (selectedNodeId) =>
    set({ selectedNodeId, selectedNodeIds: selectedNodeId ? [selectedNodeId] : [] }),
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
      const nextHistory = pushHistory(state.history, state.document);
      return {
        history: nextHistory,
        mutationBaseDocument: null,
        canUndo: nextHistory.canUndo,
        canRedo: nextHistory.canRedo,
      };
    }),
  undo: () =>
    set((state) => {
      if (!state.document || !state.history) return state;
      const result = undoHistory(state.history);
      if (!result) return state;
      const previousDocument = result.snapshot;
      const nextSelectedNodeId = resolveSelectedNodeId(previousDocument, state.selectedNodeId);
      return {
        document: previousDocument,
        selectedNodeId: nextSelectedNodeId,
        selectedNodeIds: resolveSelectedNodeIds(previousDocument, state.selectedNodeIds, nextSelectedNodeId),
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
      return {
        document: nextDocument,
        selectedNodeId: nextSelectedNodeId,
        selectedNodeIds: resolveSelectedNodeIds(nextDocument, state.selectedNodeIds, nextSelectedNodeId),
        history: result.state,
        mutationBaseDocument: null,
        canUndo: result.state.canUndo,
        canRedo: result.state.canRedo,
      };
    }),
  addNode: (node) =>
    set((state) => {
      if (!state.document) return state;
      const document = updateNodes(state.document, (nodes) => [...nodes, node]);
      return applyCommittedDocument(state, document, node.id);
    }),
  duplicateSelectedNode: () =>
    set((state) => {
      if (!state.document || state.selectedNodeIds.length === 0) return state;
      const selectedNodes = state.document.nodes.filter(
        (node) => state.selectedNodeIds.includes(node.id) && !node.locked,
      );
      if (selectedNodes.length === 0) return state;
      const duplicatedNodes = selectedNodes.map((selectedNode) => ({
        ...selectedNode,
        id: createNodeId(selectedNode.kind),
        rect: {
          ...selectedNode.rect,
          x: Math.max(0, selectedNode.rect.x + 24),
          y: Math.max(0, selectedNode.rect.y + 24),
        },
      }));
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
        nodes.map((node) => (targetNodeIds.has(node.id) ? updater(node) : node)));
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
        nodes.map((node) => (node.id === nodeId ? updater(node) : node)));
      return mode === 'transient'
        ? applyTransientDocument(state, document)
        : applyCommittedDocument(state, document);
    }),
  updateNodeContent: (nodeId, content, mode = 'commit') =>
    set((state) => {
      if (!state.document) return state;
      const existingNode = state.document.nodes.find((node) => node.id === nodeId);
      if (!existingNode) return state;
      // Only merge keys that already exist in the node's content (guard against unknown keys)
      const validContent: Record<string, unknown> = {};
      for (const key of Object.keys(content)) {
        if (key in existingNode.content) {
          validContent[key] = content[key];
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
        )));
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
        )));
      return mode === 'transient'
        ? applyTransientDocument(state, document)
        : applyCommittedDocument(state, document);
    }),
  deleteSelectedNode: () =>
    set((state) => {
      if (!state.document || state.selectedNodeIds.length === 0) return state;
      const selectedNodeIds = new Set(
        state.document.nodes
          .filter((node) => state.selectedNodeIds.includes(node.id) && !node.locked)
          .map((node) => node.id),
      );
      if (selectedNodeIds.size === 0) return state;
      const nodes = state.document.nodes.filter((node) => !selectedNodeIds.has(node.id));
      const document = updateNodes(state.document, () => nodes);
      return applyCommittedDocument(state, document, document.nodes[0]?.id ?? null);
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
