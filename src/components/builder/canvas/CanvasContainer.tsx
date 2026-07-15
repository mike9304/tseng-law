'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import AlignmentGuides from '@/components/builder/canvas/AlignmentGuides';
import CanvasFeedbackOverlay from '@/components/builder/canvas/CanvasFeedbackOverlay';
import CanvasContextMenuLayer from '@/components/builder/canvas/CanvasContextMenuLayer';
import CanvasDropHighlight from '@/components/builder/canvas/CanvasDropHighlight';
import CanvasOverlapPickerLayer from '@/components/builder/canvas/CanvasOverlapPickerLayer';
import CanvasRulers from '@/components/builder/canvas/CanvasRulers';
import CustomGuidesOverlay from '@/components/builder/canvas/CustomGuidesOverlay';
import CanvasSelectionToolbarLayer from '@/components/builder/canvas/CanvasSelectionToolbarLayer';
import CanvasStageNodes from '@/components/builder/canvas/CanvasStageNodes';
import CanvasStageToolbar from '@/components/builder/canvas/CanvasStageToolbar';
import CanvasZoomDock from '@/components/builder/canvas/CanvasZoomDock';
import CanvasCollabCursorsLayer, { type CanvasCollabCursor } from '@/components/builder/canvas/CanvasCollabCursorsLayer';
import type { ImageEditTab } from '@/components/builder/canvas/ImageEditDialog';
import {
  type ContextMenuState,
  type InteractionGeometrySnapshot,
  type OverlapPickerState,
  type SelectionBoxState,
} from '@/components/builder/canvas/canvasInteraction';
import { getSelectedCanvasNodes } from '@/components/builder/canvas/canvasSelection';
import { useCanvasInteractions } from '@/components/builder/canvas/hooks/useCanvasInteractions';
import { useCanvasKeyboardShortcuts } from '@/components/builder/canvas/hooks/useCanvasKeyboard';
import { useCanvasLinkEditing } from '@/components/builder/canvas/hooks/useCanvasLinkEditing';
import { useCanvasSelectionBox } from '@/components/builder/canvas/hooks/useCanvasSelectionBox';
import type { LinkPickerContext } from '@/components/builder/editor/LinkPicker';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import {
  copyNodeStyleToClipboard,
  hasStyleClipboard,
  readStyleClipboard,
} from '@/lib/builder/canvas/style-clipboard';
import {
  applyEditorPreferencesToDocument,
  BUILDER_EDITOR_PREFS_EVENT,
  DEFAULT_EDITOR_PREFS,
  loadEditorPreferences,
  saveAndBroadcastEditorPreferences,
  type EditorPreferences,
} from '@/lib/builder/canvas/editor-prefs';
import {
  buildChildrenMap,
  getCanvasNodeDescendantIds,
  resolveCanvasNodeAbsoluteRectForViewport,
} from '@/lib/builder/canvas/tree';
import {
  computeEffectiveViewportStageHeight,
  isTopLevelFlowSection,
} from '@/lib/builder/canvas/flow';
import { getCanvasNodesById } from '@/lib/builder/canvas/indexes';
import {
  BUILDER_FAQ_ACCORDION_SECTION_HEIGHT,
  BUILDER_SERVICES_ACCORDION_SECTION_HEIGHT,
  accordionPreviewExtra,
  hasAccordionPreviewOpen,
} from '@/lib/builder/canvas/accordion-preview';
import { resolveViewportRect, VIEWPORT_WIDTHS, type Viewport } from '@/lib/builder/canvas/responsive';
import { isContainerLikeKind, type BuilderCanvasDocument, type BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  createDefaultZoomState,
  MAX_ZOOM,
  MIN_ZOOM,
  zoomIn as stepZoomIn,
  zoomOut as stepZoomOut,
  type ZoomState,
} from '@/lib/builder/canvas/zoom';
import { useCanvasReferenceGuides } from './useCanvasReferenceGuides';
import { resolveCanvasDropTargetContext } from './canvasCatalogDrop';
import { getCanvasFeedbackSnapActiveRect, useCanvasFeedbackGeometry } from './useCanvasFeedbackGeometry';
import { useCanvasStageDrop } from './useCanvasStageDrop';
import { useCanvasStageGeometry } from './useCanvasStageGeometry';
import type { Locale } from '@/lib/locales';
import styles from './SandboxPage.module.css';

const DEFAULT_STAGE_WIDTH = 1280;
const DEFAULT_STAGE_HEIGHT = 880;
const CANVAS_FIT_PADDING_X = 24;
const EMPTY_CANVAS_NODES: BuilderCanvasNode[] = [];
const EMPTY_NODES_BY_ID = new Map<string, BuilderCanvasNode>();
const EMPTY_CHILDREN_MAP: Record<string, string[]> = {};
type VisibleCanvasNodeBuckets = {
  rootVisibleNodes: BuilderCanvasNode[];
  visibleContainerNodes: BuilderCanvasNode[];
  visibleNodes: BuilderCanvasNode[];
};
const EMPTY_VISIBLE_CANVAS_NODE_BUCKETS: VisibleCanvasNodeBuckets = {
  rootVisibleNodes: EMPTY_CANVAS_NODES,
  visibleContainerNodes: EMPTY_CANVAS_NODES,
  visibleNodes: EMPTY_CANVAS_NODES,
};

function getVisibleCanvasFitWidth(viewport: HTMLElement): number {
  const viewportRect = viewport.getBoundingClientRect();
  const scrollRoot = viewport.closest('[data-builder-canvas-scroll-root="true"]');
  if (!scrollRoot) return Math.max(1, viewportRect.width);

  const rootRect = scrollRoot.getBoundingClientRect();
  const visibleLeft = Math.max(viewportRect.left, rootRect.left);
  const visibleRight = Math.min(viewportRect.right, rootRect.right);
  const clippedWidth = visibleRight - visibleLeft;

  return Math.max(1, clippedWidth > 0 ? clippedWidth : viewportRect.width);
}

function getVisibleCanvasNodeBuckets(nodes: BuilderCanvasNode[]): VisibleCanvasNodeBuckets {
  if (nodes.length === 0) return EMPTY_VISIBLE_CANVAS_NODE_BUCKETS;
  const visibleNodes: BuilderCanvasNode[] = [];
  const visibleContainerNodes: BuilderCanvasNode[] = [];
  const rootVisibleNodes: BuilderCanvasNode[] = [];

  for (const node of nodes) {
    if (!node.visible) continue;
    visibleNodes.push(node);
    if (!node.parentId) rootVisibleNodes.push(node);
    if (isContainerLikeKind(node.kind) || isTopLevelFlowSection(node)) visibleContainerNodes.push(node);
  }

  return {
    rootVisibleNodes,
    visibleContainerNodes,
    visibleNodes,
  };
}

export default function CanvasContainer({
  fallbackDocument,
  onRequestAssetLibrary,
  onRequestImageEditor,
  onRequestMoveToPage,
  onRequestSaveAsSection,
  onRequestInsertSavedSection,
  onCanvasPageLink,
  onToast,
  onActivity,
  collabCursors = [],
  siteLightboxes = [],
  sitePopups = [],
  sitePages = [],
  viewportResetKey,
  locale,
}: {
  fallbackDocument?: BuilderCanvasDocument | null;
  onRequestAssetLibrary?: (nodeId: string) => void;
  onRequestImageEditor?: (nodeId: string, initialTab?: ImageEditTab) => void;
  onRequestMoveToPage?: (nodeIds: string[]) => void;
  /** Called when user picks "Save as section..." with the root container nodeId. */
  onRequestSaveAsSection?: (rootNodeId: string) => void;
  /** Called when user drops a saved-section card onto the canvas. */
  onRequestInsertSavedSection?: (sectionId: string, position: { x: number; y: number }, parentNodeId: string | null) => void;
  onCanvasPageLink?: (href: string) => void;
  onToast?: (message: string, tone: 'success' | 'error') => void;
  onActivity?: (message: string) => void;
  collabCursors?: CanvasCollabCursor[];
  siteLightboxes?: LinkPickerContext['siteLightboxes'];
  sitePopups?: LinkPickerContext['sitePopups'];
  sitePages?: LinkPickerContext['sitePages'];
  viewportResetKey?: string | null;
  locale?: Locale;
}) {
  const [isHydrated, setIsHydrated] = useState(false);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastFitViewportWidthRef = useRef<number | null>(null);
  const selectedNodeId = useBuilderCanvasStore((state) => state.selectedNodeId);
  const selectedNodeIds = useBuilderCanvasStore((state) => state.selectedNodeIds);
  const selectedNodeIdSet = useBuilderCanvasStore((state) => state.selectedNodeIdSet);
  const activeGroupId = useBuilderCanvasStore((state) => state.activeGroupId);
  const canUndo = useBuilderCanvasStore((state) => state.canUndo);
  const canRedo = useBuilderCanvasStore((state) => state.canRedo);
  const clipboardHasContent = useBuilderCanvasStore((state) => state.clipboardHasContent);
  const setSelectedNodeId = useBuilderCanvasStore((state) => state.setSelectedNodeId);
  const setSelectedNodeIds = useBuilderCanvasStore((state) => state.setSelectedNodeIds);
  const toggleNodeSelection = useBuilderCanvasStore((state) => state.toggleNodeSelection);
  const exitGroup = useBuilderCanvasStore((state) => state.exitGroup);
  const setDraftSaveState = useBuilderCanvasStore((state) => state.setDraftSaveState);
  const beginMutationSession = useBuilderCanvasStore((state) => state.beginMutationSession);
  const commitMutationSession = useBuilderCanvasStore((state) => state.commitMutationSession);
  const cancelMutationSession = useBuilderCanvasStore((state) => state.cancelMutationSession);
  const undo = useBuilderCanvasStore((state) => state.undo);
  const redo = useBuilderCanvasStore((state) => state.redo);
  const copySelectedNodesToClipboard = useBuilderCanvasStore((state) => state.copySelectedNodesToClipboard);
  const cutSelectedNodesToClipboard = useBuilderCanvasStore((state) => state.cutSelectedNodesToClipboard);
  const pasteClipboardNodes = useBuilderCanvasStore((state) => state.pasteClipboardNodes);
  const alignSelectedNodes = useBuilderCanvasStore((state) => state.alignSelectedNodes);
  const distributeSelectedNodes = useBuilderCanvasStore((state) => state.distributeSelectedNodes);
  const matchSelectedNodesSize = useBuilderCanvasStore((state) => state.matchSelectedNodesSize);
  const groupSelectedNodes = useBuilderCanvasStore((state) => state.groupSelectedNodes);
  const ungroupSelectedNode = useBuilderCanvasStore((state) => state.ungroupSelectedNode);
  const toggleSelectedNodeLock = useBuilderCanvasStore((state) => state.toggleSelectedNodeLock);
  const addNode = useBuilderCanvasStore((state) => state.addNode);
  const addNodes = useBuilderCanvasStore((state) => state.addNodes);
  const updateNode = useBuilderCanvasStore((state) => state.updateNode);
  const updateSelectedNodes = useBuilderCanvasStore((state) => state.updateSelectedNodes);
  const duplicateSelectedNode = useBuilderCanvasStore((state) => state.duplicateSelectedNode);
  const bringSelectedNodeForward = useBuilderCanvasStore((state) => state.bringSelectedNodeForward);
  const sendSelectedNodeBackward = useBuilderCanvasStore((state) => state.sendSelectedNodeBackward);
  const bringSelectedNodeToFront = useBuilderCanvasStore((state) => state.bringSelectedNodeToFront);
  const sendSelectedNodeToBack = useBuilderCanvasStore((state) => state.sendSelectedNodeToBack);
  const updateNodeRectsForViewport = useBuilderCanvasStore((state) => state.updateNodeRectsForViewport);
  const updateSingleNodeRectForViewport = useBuilderCanvasStore((state) => state.updateSingleNodeRectForViewport);
  const updateResponsiveOverride = useBuilderCanvasStore((state) => state.updateResponsiveOverride);
  const updateNodeContent = useBuilderCanvasStore((state) => state.updateNodeContent);
  const deleteSelectedNodeAction = useBuilderCanvasStore((state) => state.deleteSelectedNode);
  // Deleting a container silently removes every descendant with it. On a
  // decomposed page a single mis-click can select a section wrapper, and one
  // Delete wipes dozens of nodes (observed: hero copy block, 7 nodes). Ask
  // before any delete that would remove more nodes than were selected.
  const deleteSelectedNode = useCallback(() => {
    const state = useBuilderCanvasStore.getState();
    if (!state.document || state.selectedNodeIds.length === 0) return;
    const unlockedRootIds = state.document.nodes
      .filter((node) => state.selectedNodeIdSet.has(node.id) && !node.locked)
      .map((node) => node.id);
    const descendantCount = unlockedRootIds.reduce(
      (sum, nodeId) => sum + getCanvasNodeDescendantIds(nodeId, state.childrenMap).length,
      0,
    );
    if (descendantCount > 0 && typeof window !== 'undefined') {
      const messages: Record<string, string> = {
        ko: `선택한 ${unlockedRootIds.length}개 요소에 포함된 하위 요소 ${descendantCount}개도 함께 삭제됩니다. 계속할까요? (실행 취소 가능)`,
        'zh-hant': `選取的 ${unlockedRootIds.length} 個元素包含 ${descendantCount} 個子元素，將一併刪除。要繼續嗎？（可復原）`,
        en: `Deleting ${unlockedRootIds.length} selected element(s) will also remove ${descendantCount} nested element(s). Continue? (Undo available)`,
      };
      if (!window.confirm(messages[locale ?? 'ko'] ?? messages.ko)) return;
    }
    deleteSelectedNodeAction();
  }, [deleteSelectedNodeAction, locale]);
  const nudgeSelectedNode = useBuilderCanvasStore((state) => state.nudgeSelectedNode);
  const storeChildrenMap = useBuilderCanvasStore((state) => state.childrenMap);
  const currentViewport = useBuilderCanvasStore((state) => state.viewport);
  const [activeViewport, setActiveViewport] = useState<Viewport | null>(null);
  const [selectionBox, setSelectionBox] = useState<SelectionBoxState | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [overlapPicker, setOverlapPicker] = useState<OverlapPickerState | null>(null);
  const [zoomState, setZoomState] = useState<ZoomState>(() => createDefaultZoomState());
  const [externalDropTargetId, setExternalDropTargetId] = useState<string | null>(null);
  const [editorPrefs, setEditorPrefs] = useState<EditorPreferences>(DEFAULT_EDITOR_PREFS);
  const [styleClipboardAvailable, setStyleClipboardAvailable] = useState(false);
  const editorPrefsRef = useRef<EditorPreferences>(DEFAULT_EDITOR_PREFS);

  const describeHistorySelection = useCallback(() => {
    const count = useBuilderCanvasStore.getState().selectedNodeIds.length;
    if (count > 1) return `${count} nodes`;
    if (count === 1) return '1 node';
    return 'canvas';
  }, []);

  const handleUndo = useCallback(() => {
    if (!useBuilderCanvasStore.getState().canUndo) return;
    undo();
    onActivity?.(`Undid: move ${describeHistorySelection()}`);
  }, [describeHistorySelection, onActivity, undo]);

  const handleRedo = useCallback(() => {
    if (!useBuilderCanvasStore.getState().canRedo) return;
    redo();
    onActivity?.(`Redid: move ${describeHistorySelection()}`);
  }, [describeHistorySelection, onActivity, redo]);

  const describeClipboardCount = useCallback((count: number) => (
    `${count} item${count === 1 ? '' : 's'}`
  ), []);

  const handleCopy = useCallback(() => {
    const count = useBuilderCanvasStore.getState().selectedNodeIds.length;
    if (count === 0) return;
    copySelectedNodesToClipboard();
    onActivity?.(`${describeClipboardCount(count)} copied`);
  }, [copySelectedNodesToClipboard, describeClipboardCount, onActivity]);

  const handleCut = useCallback(() => {
    const count = useBuilderCanvasStore.getState().selectedNodeIds.length;
    if (count === 0) return;
    cutSelectedNodesToClipboard();
    onActivity?.(`${describeClipboardCount(count)} cut`);
  }, [cutSelectedNodesToClipboard, describeClipboardCount, onActivity]);

  const handlePaste = useCallback(() => {
    const state = useBuilderCanvasStore.getState();
    if (state.clipboardCount <= 0) return;
    pasteClipboardNodes();
    const pastedCount = state.clipboardCount;
    onActivity?.(`Pasted ${describeClipboardCount(pastedCount)}`);
  }, [describeClipboardCount, onActivity, pasteClipboardNodes]);

  const handleCopyStyle = useCallback(() => {
    const state = useBuilderCanvasStore.getState();
    const sourceNode = state.selectedNodeId ? state.nodesById.get(state.selectedNodeId) ?? null : null;
    if (!sourceNode) return;
    const payload = copyNodeStyleToClipboard(sourceNode);
    if (!payload) return;
    setStyleClipboardAvailable(true);
    onActivity?.(`Copied style: ${sourceNode.kind}`);
  }, [onActivity]);

  const handlePasteStyle = useCallback(() => {
    const payload = readStyleClipboard();
    if (!payload) return;
    const state = useBuilderCanvasStore.getState();
    const targetIds = state.selectedNodeIds.filter((nodeId) => {
      const node = state.nodesById.get(nodeId);
      return node && !node.locked;
    });
    if (targetIds.length === 0) return;
    updateSelectedNodes(targetIds, (node) => ({
      ...node,
      style: { ...payload.style },
      hoverStyle: payload.hoverStyle ? { ...payload.hoverStyle } : undefined,
    }));
    setDraftSaveState('saving');
    onActivity?.(`Pasted style to ${targetIds.length} node${targetIds.length === 1 ? '' : 's'}`);
  }, [onActivity, setDraftSaveState, updateSelectedNodes]);

  const handleDuplicate = useCallback(() => {
    const count = useBuilderCanvasStore.getState().selectedNodeIds.length;
    if (count === 0) return;
    duplicateSelectedNode();
    onToast?.('Duplicated', 'success');
  }, [duplicateSelectedNode, onToast]);

  const updateEditorPrefs = useCallback((
    updater: (current: EditorPreferences) => EditorPreferences,
    options: { persist?: boolean } = {},
  ) => {
    const next = updater(editorPrefsRef.current);
    editorPrefsRef.current = next;
    setEditorPrefs(next);
    if (options.persist !== false) {
      saveAndBroadcastEditorPreferences(next);
    }
  }, []);

  const handleToggleGrid = useCallback(() => {
    updateEditorPrefs((current) => ({
      ...current,
      pixelGrid: {
        ...current.pixelGrid,
        enabled: !current.pixelGrid.enabled,
      },
    }));
    onActivity?.('Toggled grid snap');
  }, [onActivity, updateEditorPrefs]);

  const handleGridSizeChange = useCallback((size: number) => {
    const nextSize = Math.max(4, Math.min(80, Number.isFinite(size) ? Math.round(size / 4) * 4 : 16));
    updateEditorPrefs((current) => ({
      ...current,
      pixelGrid: {
        ...current.pixelGrid,
        enabled: true,
        size: nextSize,
      },
    }));
  }, [updateEditorPrefs]);

  const geometryViewport = activeViewport ?? currentViewport;
  const storeDocument = useBuilderCanvasStore((state) => state.document);
  const displayDocument = storeDocument ?? fallbackDocument ?? null;
  const fallbackNodesById = useMemo(
    () => (fallbackDocument ? getCanvasNodesById(fallbackDocument.nodes) : EMPTY_NODES_BY_ID),
    [fallbackDocument],
  );
  const fallbackChildrenMap = useMemo(
    () => (fallbackDocument ? buildChildrenMap(fallbackDocument.nodes) : EMPTY_CHILDREN_MAP),
    [fallbackDocument],
  );
  const hasCanvasDocument = displayDocument !== null;
  const nodes = displayDocument?.nodes ?? EMPTY_CANVAS_NODES;
  const documentStageWidth = displayDocument?.stageWidth ?? DEFAULT_STAGE_WIDTH;
  const stageWidth = currentViewport === 'desktop'
    ? documentStageWidth
    : VIEWPORT_WIDTHS[currentViewport];
  const documentStageHeight = displayDocument?.stageHeight ?? DEFAULT_STAGE_HEIGHT;
  const interactivePreview = useBuilderCanvasStore((state) => state.interactivePreview);
  const storeNodesById = useBuilderCanvasStore((state) => state.nodesById);
  const nodesById = storeDocument ? storeNodesById : fallbackNodesById;
  const childrenMap = storeDocument ? storeChildrenMap : fallbackChildrenMap;
  const viewportStageHeight = useMemo(() => computeEffectiveViewportStageHeight({
    childrenMap,
    fallbackStageHeight: documentStageHeight,
    nodes,
    nodesById,
    viewport: currentViewport,
  }), [childrenMap, currentViewport, documentStageHeight, nodes, nodesById]);
  const previewStageExtra = useMemo(() => {
    const servicesRoot = nodesById.get('home-services-root');
    const faqRoot = nodesById.get('home-faq-root');
    return accordionPreviewExtra(
      servicesRoot ? resolveViewportRect(servicesRoot, geometryViewport).height : undefined,
      BUILDER_SERVICES_ACCORDION_SECTION_HEIGHT,
      hasAccordionPreviewOpen(interactivePreview.servicesRevealedIndices),
    ) + accordionPreviewExtra(
      faqRoot ? resolveViewportRect(faqRoot, geometryViewport).height : undefined,
      BUILDER_FAQ_ACCORDION_SECTION_HEIGHT,
      hasAccordionPreviewOpen(interactivePreview.faqRevealedIndices),
    );
  }, [
    geometryViewport,
    interactivePreview.faqRevealedIndices,
    interactivePreview.servicesRevealedIndices,
    nodesById,
  ]);
  const effectiveStageHeight = viewportStageHeight + previewStageExtra;
  const { rootVisibleNodes, visibleContainerNodes, visibleNodes } = useMemo(
    () => getVisibleCanvasNodeBuckets(nodes),
    [nodes],
  );
  const linkPickerContext = useMemo<LinkPickerContext>(
    () => ({
      siteAnchors: nodes
        .map((node) => node.anchorName)
        .filter((anchorName): anchorName is string => Boolean(anchorName)),
      siteLightboxes,
      sitePopups,
      sitePages,
    }),
    [nodes, siteLightboxes, sitePages, sitePopups],
  );
  const absoluteRectById = useMemo(() => {
    const nextMap = new Map<string, BuilderCanvasNode['rect']>();
    for (const node of nodes) {
      nextMap.set(node.id, resolveCanvasNodeAbsoluteRectForViewport(node, nodesById, geometryViewport));
    }
    return nextMap;
  }, [geometryViewport, nodes, nodesById]);
  const selectableNodes = useMemo(
    () => (
      activeGroupId
        ? visibleNodes.filter((node) => node.parentId === activeGroupId)
        : visibleNodes
    ),
    [activeGroupId, visibleNodes],
  );
  const selectedNodes = useMemo(
    () => getSelectedCanvasNodes(selectedNodeIds, nodesById),
    [nodesById, selectedNodeIds],
  );
  const hasUnlockedSelection = selectedNodes.some((node) => !node.locked);
  const captureInteractionGeometry = useCallback((): InteractionGeometrySnapshot => ({
    nodesById,
    absoluteRectById,
  }), [absoluteRectById, nodesById]);

  const {
    guides,
    hoveredContainerId,
    interaction,
    interactionPointer,
    isSpacePressed,
    resizePreviewRect,
    startMove,
    startPan,
    startResize,
  } = useCanvasInteractions({
    activeGroupId,
    activeViewport,
    absoluteRectById,
    beginMutationSession,
    cancelMutationSession,
    captureInteractionGeometry,
    childrenMap,
    commitMutationSession,
    currentViewport,
    gridSnapSize: editorPrefs.pixelGrid.enabled ? editorPrefs.pixelGrid.size : 0,
    interactionResetKey: viewportResetKey,
    nodesById,
    onToast,
    referenceGuides: editorPrefs.referenceGuides,
    rootVisibleNodes,
    selectedNodeIdSet,
    selectedNodeIds,
    setActiveViewport,
    setContextMenu,
    setOverlapPicker,
    setSelectedNodeId,
    setSelectedNodeIds,
    setSelectionBox,
    setZoomState,
    stageHeight: effectiveStageHeight,
    stageWidth,
    updateNodeRectsForViewport,
    updateSingleNodeRectForViewport,
    viewportRef,
    visibleContainerNodes,
    zoomState,
  });

  const {
    focusSelectedLinkInput,
    handleInlineEditingChange,
    inlineEditingNodeId,
    selectedLinkTargetNode,
    selectionLinkPopoverOpen,
    setSelectionLinkPopoverOpen,
    updateSelectedLink,
  } = useCanvasLinkEditing({
    absoluteRectById,
    childrenMap,
    geometryViewport,
    nodes,
    nodesById,
    selectedNodeId,
    selectedNodes,
    setSelectedNodeIds,
    updateNodeContent,
    visibleNodes,
  });

  const inlineEditingNodeIdRef = useRef(inlineEditingNodeId);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    inlineEditingNodeIdRef.current = inlineEditingNodeId;
  }, [inlineEditingNodeId]);

  useEffect(() => {
    const handlePointerDownOutsideInlineEditor = (event: PointerEvent) => {
      // Gate via ref so the listener stays registered while the editor commits
      // on this same pointerdown; removing it mid-dispatch skips the deselect.
      if (!inlineEditingNodeIdRef.current) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest('[data-builder-inline-text-editor="true"]')) return;
      if (target.closest('[data-node-id]')) return;

      window.setTimeout(() => {
        setSelectedNodeIds([], null);
      }, 0);
    };

    document.addEventListener('pointerdown', handlePointerDownOutsideInlineEditor, true);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDownOutsideInlineEditor, true);
    };
  }, [setSelectedNodeIds]);

  const fitCanvas = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const fitWidth = getVisibleCanvasFitWidth(viewport);
    const availableWidth = Math.max(1, fitWidth - CANVAS_FIT_PADDING_X);
    const nextZoom = Math.max(
      MIN_ZOOM,
      Math.min(1, MAX_ZOOM, availableWidth / stageWidth),
    );
    const roundedZoom = Math.round(nextZoom * 100) / 100;
    const panX = Math.max(0, Math.round((fitWidth - stageWidth * roundedZoom) / 2));
    lastFitViewportWidthRef.current = fitWidth;
    setZoomState({ zoom: roundedZoom, panX, panY: 0 });
  }, [stageWidth]);

  useCanvasKeyboardShortcuts({
    bringSelectedNodeForward,
    bringSelectedNodeToFront,
    deleteSelectedNode,
    exitGroup,
    fitCanvas,
    focusSelectedLinkInput,
    groupSelectedNodes,
    handleCopy,
    handleCopyStyle,
    handleCut,
    handleDuplicate,
    handlePaste,
    handlePasteStyle,
    handleRedo,
    handleUndo,
    nudgeSelectedNode,
    selectedLinkTargetNode,
    sendSelectedNodeBackward,
    sendSelectedNodeToBack,
    setContextMenu,
    setOverlapPicker,
    setSelectedNodeIds,
    setZoomState,
    toggleGrid: handleToggleGrid,
    toggleSelectedNodeLock,
    ungroupSelectedNode,
  });

  useEffect(() => {
    fitCanvas();
    window.addEventListener('resize', fitCanvas);
    const observed = viewportRef.current;
    const observedScrollRoot = observed?.closest('[data-builder-canvas-scroll-root="true"]') ?? null;
    const resizeObserver = typeof ResizeObserver !== 'undefined' && observed
      ? new ResizeObserver(() => {
        const nextWidth = getVisibleCanvasFitWidth(observed);
        const previousWidth = lastFitViewportWidthRef.current;
        if (previousWidth === null || Math.abs(nextWidth - previousWidth) > 1) {
          fitCanvas();
        }
      })
      : null;
    if (observed && resizeObserver) {
      resizeObserver.observe(observed);
      if (observedScrollRoot && observedScrollRoot !== observed) {
        resizeObserver.observe(observedScrollRoot);
      }
    }
    return () => {
      window.removeEventListener('resize', fitCanvas);
      resizeObserver?.disconnect();
    };
  }, [fitCanvas, viewportResetKey]);

  useEffect(() => {
    const loaded = loadEditorPreferences();
    editorPrefsRef.current = loaded;
    setEditorPrefs(loaded);
    applyEditorPreferencesToDocument(loaded);

    function handlePrefsChange(event: Event) {
      const next = (event as CustomEvent<EditorPreferences>).detail ?? loadEditorPreferences();
      editorPrefsRef.current = next;
      setEditorPrefs(next);
    }

    document.addEventListener(BUILDER_EDITOR_PREFS_EVENT, handlePrefsChange);
    return () => document.removeEventListener(BUILDER_EDITOR_PREFS_EVENT, handlePrefsChange);
  }, []);

  useEffect(() => {
    setStyleClipboardAvailable(hasStyleClipboard());
  }, []);

  useEffect(() => {
    if (!contextMenu) return undefined;

    function handleWindowResize() {
      setContextMenu(null);
    }

    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [contextMenu]);

  useEffect(() => {
    if (!overlapPicker) return undefined;

    function handleWindowScroll() {
      setOverlapPicker(null);
    }

    window.addEventListener('scroll', handleWindowScroll, true);
    window.addEventListener('resize', handleWindowScroll);
    return () => {
      window.removeEventListener('scroll', handleWindowScroll, true);
      window.removeEventListener('resize', handleWindowScroll);
    };
  }, [overlapPicker]);

  const {
    openOverlapPicker,
    resolveCanvasPoint,
    resolveContextMenuPosition,
    resolveOverlapCandidates,
    resolveStagePosition,
  } = useCanvasStageGeometry({
    absoluteRectById,
    geometryViewport,
    nodesById,
    selectableNodes,
    setOverlapPicker,
    setZoomState,
    stageHeight: effectiveStageHeight,
    stageWidth,
    viewportRef,
    zoomState,
  });

  const {
    removeReferenceGuide,
    startReferenceGuideDrag,
    draftGuide,
    beginRulerGuideDrag,
    updateDraftGuidePosition,
    commitRulerGuideDraft,
    cancelRulerGuideDraft,
  } = useCanvasReferenceGuides({
    editorPrefsRef,
    onActivity,
    resolveCanvasPoint,
    stageHeight: effectiveStageHeight,
    stageWidth,
    updateEditorPrefs,
  });
  const resolveDropTargetContext = useCallback((clientX: number, clientY: number) => (
    resolveCanvasDropTargetContext({
      absoluteRectById,
      nodesById,
      position: resolveStagePosition(clientX, clientY),
      viewport: geometryViewport,
      visibleContainerNodes,
    })
  ), [absoluteRectById, geometryViewport, nodesById, resolveStagePosition, visibleContainerNodes]);
  const { handleStageDragLeave, handleStageDragOver, handleStageDrop } = useCanvasStageDrop({
    addNode,
    addNodes,
    nodeCount: nodes.length,
    onRequestInsertSavedSection,
    resolveDropTargetContext,
    setExternalDropTargetId,
    setDraftSaveState,
    setSelectedNodeId,
  });

  const selectionBoxRect = useCanvasSelectionBox({
    absoluteRectById,
    geometryViewport,
    resolveStagePosition,
    selectableNodes,
    selectedNodeId,
    selectedNodeIds,
    selectionBox,
    setSelectedNodeIds,
    setSelectionBox,
  });

  const {
    dragGhostCurrentRects,
    dragGhostStartRects,
    interactionActiveRect,
    interactionMode,
    multiSelectionBboxScreen,
    resizeCurrentRect,
    selectionBboxScreen,
    snapOtherRects,
  } = useCanvasFeedbackGeometry({
    absoluteRectById,
    geometryViewport,
    interaction,
    selectedNodes,
    zoomState,
  });
  const snapActiveRect = getCanvasFeedbackSnapActiveRect(
    interactionMode,
    interactionActiveRect,
    resizePreviewRect,
  );

  return (
    <div className={styles.stageSurface}>
      <div
        ref={viewportRef}
        className={`${styles.stageViewport} ${isSpacePressed ? styles.stageViewportPannable : ''} ${interaction?.type === 'pan' ? styles.stageViewportPanning : ''}`}
        style={{
          flex: '0 0 auto',
          height: Math.max(240, Math.ceil(effectiveStageHeight * zoomState.zoom) + 2),
          minHeight: 'calc(100dvh - var(--editor-topbar-h, 58px) - var(--editor-statusbar-h, 28px) - 12px)',
        }}
        onWheel={(event) => {
          if (event.metaKey || event.ctrlKey) {
            event.preventDefault();
            setZoomState((currentState) => (
              event.deltaY < 0 ? stepZoomIn(currentState) : stepZoomOut(currentState)
            ));
            return;
          }
        }}
      >
        <div
          className={styles.stageTransform}
          style={{
            transform: `translate(${zoomState.panX}px, ${zoomState.panY}px) scale(${zoomState.zoom})`,
            '--canvas-zoom': zoomState.zoom,
          } as CSSProperties}
        >
            <div
              ref={containerRef}
              className={styles.stage}
              data-builder-canvas-viewport={currentViewport}
              data-builder-hydrated={isHydrated ? 'true' : undefined}
              data-canvas-interaction={interaction?.type ?? 'idle'}
              style={{ width: `${stageWidth}px`, height: `${effectiveStageHeight}px` }}
            role="application"
            aria-label="Canvas editor"
            aria-roledescription="freeform canvas"
            onPointerDownCapture={(event) => {
              if (event.target instanceof Element && event.target.closest('[data-builder-floating-ui="true"]')) return;

              const shouldPan = event.button === 1 || (event.button === 0 && isSpacePressed);
              if (shouldPan) {
                event.preventDefault();
                event.stopPropagation();
                startPan(event);
                return;
              }

              if (event.button !== 0 || event.target === event.currentTarget) return;

              // Plain click selects the topmost hit through each node's own
              // handler. Alt-click opens the explicit overlap layer picker
              // for ambiguous cases — the previous always-on "N layers"
              // hint was visual noise on every nested click.
              if (event.altKey) {
                const overlapCandidates = resolveOverlapCandidates(event.clientX, event.clientY);
                if (overlapCandidates.length <= 1) {
                  setOverlapPicker(null);
                  return;
                }
                event.preventDefault();
                event.stopPropagation();
                setContextMenu(null);
                setSelectionBox(null);
                openOverlapPicker(event.clientX, event.clientY, overlapCandidates, 'list');
                return;
              }

              setOverlapPicker(null);
            }}
            onPointerDown={(event) => {
              if (event.target instanceof Element && event.target.closest('[data-builder-floating-ui="true"]')) return;

              setContextMenu(null);
              if (event.target === event.currentTarget) {
                setOverlapPicker(null);
                if (activeGroupId) {
                  exitGroup();
                  return;
                }
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
            onDragOver={handleStageDragOver}
            onDragLeave={handleStageDragLeave}
            onDrop={handleStageDrop}
          >
            {editorPrefs.rulers.enabled ? (
              <CanvasRulers
                onGuideDragStart={beginRulerGuideDrag}
                onGuideDragMove={updateDraftGuidePosition}
                onGuideDragCommit={commitRulerGuideDraft}
                onGuideDragCancel={cancelRulerGuideDraft}
                stageHeight={effectiveStageHeight}
                stageWidth={stageWidth}
                zoom={zoomState.zoom}
              />
            ) : null}
            {editorPrefs.pixelGrid.enabled ? (
              <div
                className={styles.stageGrid}
                data-builder-grid="true"
                aria-hidden
                style={{
                  backgroundImage: `radial-gradient(circle, ${editorPrefs.pixelGrid.color} ${1 / zoomState.zoom}px, transparent ${1 / zoomState.zoom}px)`,
                  backgroundSize: `${editorPrefs.pixelGrid.size}px ${editorPrefs.pixelGrid.size}px`,
                  opacity: editorPrefs.pixelGrid.opacity / 100,
                }}
              />
            ) : null}
            <CustomGuidesOverlay
              draftGuide={draftGuide}
              guides={editorPrefs.referenceGuides}
              onRemoveGuide={removeReferenceGuide}
              onStartGuideDrag={startReferenceGuideDrag}
              stageHeight={effectiveStageHeight}
              stageWidth={stageWidth}
            />
            <AlignmentGuides guides={guides} />
            <CanvasDropHighlight
              absoluteRectById={absoluteRectById}
              geometryViewport={geometryViewport}
              hoveredContainerId={externalDropTargetId ?? hoveredContainerId}
              nodesById={nodesById}
            />
            <CanvasStageNodes
              handleInlineEditingChange={handleInlineEditingChange}
              onRequestAssetLibrary={onRequestAssetLibrary}
              resolveContextMenuPosition={resolveContextMenuPosition}
              rootVisibleNodes={rootVisibleNodes}
              selectionBoxRect={selectionBoxRect}
              setContextMenu={setContextMenu}
              setOverlapPicker={setOverlapPicker}
              setSelectedNodeId={setSelectedNodeId}
              showEmptyState={hasCanvasDocument}
              startMove={startMove}
              startResize={startResize}
              toggleNodeSelection={toggleNodeSelection}
              updateNodeContent={updateNodeContent}
              childrenMap={childrenMap}
              nodesById={nodesById}
              visibleNodes={visibleNodes}
              viewport={currentViewport}
              onCanvasPageLink={onCanvasPageLink}
              interaction={interaction}
              locale={locale}
              renderScopeKey={viewportResetKey}
            />

            <CanvasCollabCursorsLayer
              cursors={collabCursors}
              zoom={zoomState.zoom}
            />

            <CanvasStageToolbar
              canRedo={canRedo}
              canUndo={canUndo}
              gridEnabled={editorPrefs.pixelGrid.enabled}
              gridSize={editorPrefs.pixelGrid.size}
              handleRedo={handleRedo}
              handleUndo={handleUndo}
              locale={locale}
              onGridSizeChange={handleGridSizeChange}
              onToggleGrid={handleToggleGrid}
              setContextMenu={setContextMenu}
            />
          </div>
        </div>

        <CanvasFeedbackOverlay
          interactionMode={interactionMode}
          startRects={dragGhostStartRects}
          currentRects={dragGhostCurrentRects}
          locale={locale}
          resizeRect={resizePreviewRect ?? resizeCurrentRect}
          resizePointer={interactionMode === 'resize' ? interactionPointer : null}
          multiSelectionBbox={multiSelectionBboxScreen}
          selectedCount={selectedNodes.length}
          snapActiveRect={snapActiveRect}
          snapOtherRects={snapOtherRects}
          zoom={zoomState.zoom}
          panX={zoomState.panX}
          panY={zoomState.panY}
        />

        <CanvasSelectionToolbarLayer
          bringSelectedNodeForward={bringSelectedNodeForward}
          contextMenuOpen={Boolean(contextMenu)}
          deleteSelectedNode={deleteSelectedNode}
          focusSelectedLinkInput={focusSelectedLinkInput}
          handleDuplicate={handleDuplicate}
          inlineEditingNodeId={inlineEditingNodeId}
          locale={locale}
          linkPickerContext={linkPickerContext}
          onRequestAssetLibrary={onRequestAssetLibrary}
          resolveContextMenuPosition={resolveContextMenuPosition}
          selectedLinkTargetNode={selectedLinkTargetNode}
          selectedNodes={selectedNodes}
          selectionBboxScreen={selectionBboxScreen}
          selectionLinkPopoverOpen={selectionLinkPopoverOpen}
          sendSelectedNodeBackward={sendSelectedNodeBackward}
          setContextMenu={setContextMenu}
          setOverlapPicker={setOverlapPicker}
          setSelectionLinkPopoverOpen={setSelectionLinkPopoverOpen}
          updateSelectedLink={updateSelectedLink}
        />

        <CanvasOverlapPickerLayer
          nodesById={nodesById}
          overlapPicker={overlapPicker}
          selectedNodeIdSet={selectedNodeIdSet}
          setOverlapPicker={setOverlapPicker}
          setSelectedNodeId={setSelectedNodeId}
          toggleNodeSelection={toggleNodeSelection}
        />

        <CanvasContextMenuLayer
          alignSelectedNodes={alignSelectedNodes}
          bringSelectedNodeForward={bringSelectedNodeForward}
          bringSelectedNodeToFront={bringSelectedNodeToFront}
          childrenMap={childrenMap}
          clipboardHasContent={clipboardHasContent}
          contextMenu={contextMenu}
          deleteSelectedNode={deleteSelectedNode}
          distributeSelectedNodes={distributeSelectedNodes}
          focusSelectedLinkInput={focusSelectedLinkInput}
          groupSelectedNodes={groupSelectedNodes}
          handleCopy={handleCopy}
          handleCopyStyle={handleCopyStyle}
          handleCut={handleCut}
          handleDuplicate={handleDuplicate}
          handlePaste={handlePaste}
          handlePasteStyle={handlePasteStyle}
          hasUnlockedSelection={hasUnlockedSelection}
          locale={locale}
          matchSelectedNodesSize={matchSelectedNodesSize}
          nodesById={nodesById}
          onRequestAssetLibrary={onRequestAssetLibrary}
          onRequestImageEditor={onRequestImageEditor}
          onRequestMoveToPage={onRequestMoveToPage}
          onRequestSaveAsSection={onRequestSaveAsSection}
          selectedLinkTargetNode={selectedLinkTargetNode}
          selectedNodeIdSet={selectedNodeIdSet}
          selectedNodeIds={selectedNodeIds}
          selectedNodes={selectedNodes}
          sendSelectedNodeBackward={sendSelectedNodeBackward}
          sendSelectedNodeToBack={sendSelectedNodeToBack}
          setContextMenu={setContextMenu}
          styleClipboardHasContent={styleClipboardAvailable}
          toggleSelectedNodeLock={toggleSelectedNodeLock}
          ungroupSelectedNode={ungroupSelectedNode}
          updateNode={updateNode}
          updateResponsiveOverride={updateResponsiveOverride}
          updateSelectedLink={updateSelectedLink}
        />
      </div>

      <CanvasZoomDock
        fitCanvas={fitCanvas}
        locale={locale}
        setZoomState={setZoomState}
        zoomState={zoomState}
      />
    </div>
  );
}
