'use client';

import { create } from 'zustand';
import type { BuilderCanvasDocument, BuilderCanvasNode, BuilderCanvasNodeKind } from '@/lib/builder/canvas/types';

type DraftSaveState = 'idle' | 'saving' | 'saved' | 'error';
type MutationMode = 'commit' | 'transient';
const HISTORY_LIMIT = 100;

interface BuilderCanvasStoreState {
  document: BuilderCanvasDocument | null;
  selectedNodeId: string | null;
  draftSaveState: DraftSaveState;
  historyPast: BuilderCanvasDocument[];
  historyFuture: BuilderCanvasDocument[];
  mutationBaseDocument: BuilderCanvasDocument | null;
  canUndo: boolean;
  canRedo: boolean;
  replaceDocument: (document: BuilderCanvasDocument) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  setDraftSaveState: (state: DraftSaveState) => void;
  beginMutationSession: () => void;
  commitMutationSession: () => void;
  undo: () => void;
  redo: () => void;
  addNode: (node: BuilderCanvasNode) => void;
  updateNode: (
    nodeId: string,
    updater: (node: BuilderCanvasNode) => BuilderCanvasNode,
    mode?: MutationMode,
  ) => void;
  deleteSelectedNode: () => void;
  nudgeSelectedNode: (deltaX: number, deltaY: number) => void;
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

function sameDocumentContent(left: BuilderCanvasDocument, right: BuilderCanvasDocument): boolean {
  return left.locale === right.locale
    && left.version === right.version
    && JSON.stringify(left.nodes) === JSON.stringify(right.nodes);
}

function clampHistory(history: BuilderCanvasDocument[]): BuilderCanvasDocument[] {
  return history.slice(-HISTORY_LIMIT);
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

function applyTransientDocument(
  state: BuilderCanvasStoreState,
  document: BuilderCanvasDocument,
  selectedNodeId = state.selectedNodeId,
): Partial<BuilderCanvasStoreState> | BuilderCanvasStoreState {
  if (sameDocumentContent(document, state.document ?? document)) return state;
  return {
    document,
    selectedNodeId: resolveSelectedNodeId(document, selectedNodeId),
  };
}

function applyCommittedDocument(
  state: BuilderCanvasStoreState,
  document: BuilderCanvasDocument,
  selectedNodeId = state.selectedNodeId,
): Partial<BuilderCanvasStoreState> | BuilderCanvasStoreState {
  if (!state.document || sameDocumentContent(document, state.document)) return state;
  const historyPast = clampHistory([...state.historyPast, state.document]);
  return {
    document,
    selectedNodeId: resolveSelectedNodeId(document, selectedNodeId),
    historyPast,
    historyFuture: [],
    mutationBaseDocument: null,
    canUndo: historyPast.length > 0,
    canRedo: false,
  };
}

export const useBuilderCanvasStore = create<BuilderCanvasStoreState>((set) => ({
  document: null,
  selectedNodeId: null,
  draftSaveState: 'idle',
  historyPast: [],
  historyFuture: [],
  mutationBaseDocument: null,
  canUndo: false,
  canRedo: false,
  replaceDocument: (document) =>
    set({
      document,
      selectedNodeId: document.nodes[0]?.id ?? null,
      draftSaveState: 'idle',
      historyPast: [],
      historyFuture: [],
      mutationBaseDocument: null,
      canUndo: false,
      canRedo: false,
    }),
  setSelectedNodeId: (selectedNodeId) => set({ selectedNodeId }),
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
      if (!state.document || !state.mutationBaseDocument) return state;
      if (sameDocumentContent(state.document, state.mutationBaseDocument)) {
        return {
          mutationBaseDocument: null,
        };
      }
      const historyPast = clampHistory([...state.historyPast, state.mutationBaseDocument]);
      return {
        historyPast,
        historyFuture: [],
        mutationBaseDocument: null,
        canUndo: historyPast.length > 0,
        canRedo: false,
      };
    }),
  undo: () =>
    set((state) => {
      if (!state.document || state.historyPast.length === 0) return state;
      const previousDocument = state.historyPast[state.historyPast.length - 1];
      const historyPast = state.historyPast.slice(0, -1);
      const historyFuture = [state.document, ...state.historyFuture].slice(0, HISTORY_LIMIT);
      return {
        document: previousDocument,
        selectedNodeId: resolveSelectedNodeId(previousDocument, state.selectedNodeId),
        historyPast,
        historyFuture,
        mutationBaseDocument: null,
        canUndo: historyPast.length > 0,
        canRedo: historyFuture.length > 0,
      };
    }),
  redo: () =>
    set((state) => {
      if (!state.document || state.historyFuture.length === 0) return state;
      const nextDocument = state.historyFuture[0];
      const historyFuture = state.historyFuture.slice(1);
      const historyPast = clampHistory([...state.historyPast, state.document]);
      return {
        document: nextDocument,
        selectedNodeId: resolveSelectedNodeId(nextDocument, state.selectedNodeId),
        historyPast,
        historyFuture,
        mutationBaseDocument: null,
        canUndo: historyPast.length > 0,
        canRedo: historyFuture.length > 0,
      };
    }),
  addNode: (node) =>
    set((state) => {
      if (!state.document) return state;
      const document = updateNodes(state.document, (nodes) => [...nodes, node]);
      return applyCommittedDocument(state, document, node.id);
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
  deleteSelectedNode: () =>
    set((state) => {
      if (!state.document || !state.selectedNodeId) return state;
      const nodes = state.document.nodes.filter((node) => node.id !== state.selectedNodeId);
      const document = updateNodes(state.document, () => nodes);
      return applyCommittedDocument(state, document, document.nodes[0]?.id ?? null);
    }),
  nudgeSelectedNode: (deltaX, deltaY) =>
    set((state) => {
      if (!state.document || !state.selectedNodeId) return state;
      const document = updateNodes(state.document, (nodes) =>
        nodes.map((node) =>
          node.id === state.selectedNodeId
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
}));

export function createCanvasNodeTemplate(
  kind: BuilderCanvasNodeKind,
  x: number,
  y: number,
  zIndex: number,
): BuilderCanvasNode {
  const id = createNodeId(kind);
  switch (kind) {
    case 'text':
      return {
        id,
        kind,
        rect: { x, y, width: 260, height: 72 },
        zIndex,
        locked: false,
        visible: true,
        content: {
          text: '새 텍스트 블록',
          fontSize: 24,
          color: '#0f172a',
          fontWeight: 'medium',
          align: 'left',
        },
      };
    case 'image':
      return {
        id,
        kind,
        rect: { x, y, width: 240, height: 180 },
        zIndex,
        locked: false,
        visible: true,
        content: {
          src: '/images/header-skyline-ratio.webp',
          alt: 'Placeholder image',
          fit: 'cover',
        },
      };
    case 'button':
      return {
        id,
        kind,
        rect: { x, y, width: 180, height: 52 },
        zIndex,
        locked: false,
        visible: true,
        content: {
          label: '새 버튼',
          href: '#',
          style: 'primary',
        },
      };
    default:
      return kind satisfies never;
  }
}
