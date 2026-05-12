'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
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
import type { ImageEditTab } from '@/components/builder/canvas/ImageEditDialog';
import {
  clampViewportPopupPosition,
  clampVisibleViewportPopupPosition,
  getCanvasNodeDepth,
  unionRects,
  type ContextMenuState,
  type InteractionGeometrySnapshot,
  type OverlapPickerState,
  type SelectionBoxState,
} from '@/components/builder/canvas/canvasInteraction';
import { useCanvasInteractions } from '@/components/builder/canvas/hooks/useCanvasInteractions';
import { useCanvasKeyboardShortcuts } from '@/components/builder/canvas/hooks/useCanvasKeyboard';
import { useCanvasLinkEditing } from '@/components/builder/canvas/hooks/useCanvasLinkEditing';
import { useCanvasSelectionBox } from '@/components/builder/canvas/hooks/useCanvasSelectionBox';
import type { LinkPickerContext } from '@/components/builder/editor/LinkPicker';
import {
  createCanvasNodeTemplate,
  useBuilderCanvasStore,
} from '@/lib/builder/canvas/store';
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
  makeGuideId,
  saveAndBroadcastEditorPreferences,
  type EditorPreferences,
  type ReferenceGuide,
} from '@/lib/builder/canvas/editor-prefs';
import {
  resolveCanvasNodeAbsoluteRectForViewport,
} from '@/lib/builder/canvas/tree';
import { resolveViewportRect, type Viewport } from '@/lib/builder/canvas/responsive';
import { builderCanvasNodeKinds, type BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  createDefaultZoomState,
  MAX_ZOOM,
  MIN_ZOOM,
  screenToCanvas,
  zoomIn as stepZoomIn,
  zoomOut as stepZoomOut,
  type ZoomState,
} from '@/lib/builder/canvas/zoom';
import styles from './SandboxPage.module.css';

const DEFAULT_STAGE_WIDTH = 1280;
const DEFAULT_STAGE_HEIGHT = 880;
const CONTEXT_MENU_WIDTH = 276;
const CONTEXT_MENU_MAX_HEIGHT = 520;
const EMPTY_CANVAS_NODES: BuilderCanvasNode[] = [];

export default function CanvasContainer({
  onRequestAssetLibrary,
  onRequestImageEditor,
  onRequestMoveToPage,
  onRequestSaveAsSection,
  onRequestInsertSavedSection,
  onToast,
  onActivity,
  siteLightboxes = [],
  sitePages = [],
  viewportResetKey,
}: {
  onRequestAssetLibrary?: (nodeId: string) => void;
  onRequestImageEditor?: (nodeId: string, initialTab?: ImageEditTab) => void;
  onRequestMoveToPage?: (nodeIds: string[]) => void;
  /** Called when user picks "Save as section..." with the root container nodeId. */
  onRequestSaveAsSection?: (rootNodeId: string) => void;
  /** Called when user drops a saved-section card onto the canvas. */
  onRequestInsertSavedSection?: (sectionId: string, position: { x: number; y: number }) => void;
  onToast?: (message: string, tone: 'success' | 'error') => void;
  onActivity?: (message: string) => void;
  siteLightboxes?: LinkPickerContext['siteLightboxes'];
  sitePages?: LinkPickerContext['sitePages'];
  viewportResetKey?: string | null;
}) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastFitViewportWidthRef = useRef<number | null>(null);
  const {
    selectedNodeId,
    selectedNodeIds,
    activeGroupId,
    canUndo,
    canRedo,
    clipboardHasContent,
    setSelectedNodeId,
    setSelectedNodeIds,
    toggleNodeSelection,
    exitGroup,
    setDraftSaveState,
    beginMutationSession,
    commitMutationSession,
    cancelMutationSession,
    undo,
    redo,
    copySelectedNodesToClipboard,
    cutSelectedNodesToClipboard,
    pasteClipboardNodes,
    alignSelectedNodes,
    distributeSelectedNodes,
    matchSelectedNodesSize,
    groupSelectedNodes,
    ungroupSelectedNode,
    toggleSelectedNodeLock,
    addNode,
    updateNode,
    updateSelectedNodes,
    duplicateSelectedNode,
    bringSelectedNodeForward,
    sendSelectedNodeBackward,
    bringSelectedNodeToFront,
    sendSelectedNodeToBack,
    updateNodeRectsForViewport,
    updateResponsiveOverride,
    updateNodeContent,
    deleteSelectedNode,
    nudgeSelectedNode,
    childrenMap,
    viewport: currentViewport,
  } = useBuilderCanvasStore();
  const [activeViewport, setActiveViewport] = useState<Viewport | null>(null);
  const [selectionBox, setSelectionBox] = useState<SelectionBoxState | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [overlapPicker, setOverlapPicker] = useState<OverlapPickerState | null>(null);
  const [zoomState, setZoomState] = useState<ZoomState>(() => createDefaultZoomState());
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
    const sourceNode = state.document?.nodes.find((node) => node.id === state.selectedNodeId) ?? null;
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
      const node = state.document?.nodes.find((candidate) => candidate.id === nodeId);
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

  const nodes = useBuilderCanvasStore((state) => state.document?.nodes ?? EMPTY_CANVAS_NODES);
  const stageWidth = useBuilderCanvasStore(
    (state) => state.document?.stageWidth ?? DEFAULT_STAGE_WIDTH,
  );
  const stageHeight = useBuilderCanvasStore(
    (state) => state.document?.stageHeight ?? DEFAULT_STAGE_HEIGHT,
  );
  const visibleNodes = useMemo(
    () => nodes.filter((node) => node.visible),
    [nodes],
  );
  const nodesById = useBuilderCanvasStore((state) => state.nodesById);
  const linkPickerContext = useMemo<LinkPickerContext>(
    () => ({
      siteAnchors: nodes
        .map((node) => node.anchorName)
        .filter((anchorName): anchorName is string => Boolean(anchorName)),
      siteLightboxes,
      sitePages,
    }),
    [nodes, siteLightboxes, sitePages],
  );
  const geometryViewport = activeViewport ?? currentViewport;
  const absoluteRectById = useMemo(() => {
    const nextMap = new Map<string, BuilderCanvasNode['rect']>();
    for (const node of nodes) {
      nextMap.set(node.id, resolveCanvasNodeAbsoluteRectForViewport(node, nodesById, geometryViewport));
    }
    return nextMap;
  }, [geometryViewport, nodes, nodesById]);
  const rootVisibleNodes = useMemo(
    () => visibleNodes.filter((node) => !node.parentId),
    [visibleNodes],
  );
  const selectableNodes = useMemo(
    () => (
      activeGroupId
        ? visibleNodes.filter((node) => node.parentId === activeGroupId)
        : visibleNodes
    ),
    [activeGroupId, visibleNodes],
  );
  const selectedNodes = useMemo(
    () => nodes.filter((node) => selectedNodeIds.includes(node.id)),
    [nodes, selectedNodeIds],
  );
  const hasUnlockedSelection = selectedNodes.some((node) => !node.locked);
  const captureInteractionGeometry = useCallback((): InteractionGeometrySnapshot => ({
    nodes: visibleNodes,
    nodesById,
    absoluteRectById,
  }), [absoluteRectById, nodesById, visibleNodes]);

  const {
    guides,
    hoveredContainerId,
    interaction,
    interactionPointer,
    isSpacePressed,
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
    commitMutationSession,
    currentViewport,
    gridSnapSize: editorPrefs.pixelGrid.enabled ? editorPrefs.pixelGrid.size : 0,
    nodes,
    nodesById,
    onToast,
    referenceGuides: editorPrefs.referenceGuides,
    selectedNodeIds,
    setActiveViewport,
    setContextMenu,
    setOverlapPicker,
    setSelectedNodeId,
    setSelectedNodeIds,
    setSelectionBox,
    setZoomState,
    stageHeight,
    stageWidth,
    updateNodeRectsForViewport,
    viewportRef,
    visibleNodes,
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

  const fitCanvas = useCallback(() => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    const availableWidth = Math.max(1, rect.width - 24);
    const nextZoom = Math.max(
      MIN_ZOOM,
      Math.min(1, MAX_ZOOM, availableWidth / stageWidth),
    );
    const roundedZoom = Math.round(nextZoom * 100) / 100;
    const panX = Math.max(0, Math.round((rect.width - stageWidth * roundedZoom) / 2));
    lastFitViewportWidthRef.current = rect.width;
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
    ungroupSelectedNode,
  });

  useEffect(() => {
    fitCanvas();
    window.addEventListener('resize', fitCanvas);
    const observed = viewportRef.current;
    const resizeObserver = typeof ResizeObserver !== 'undefined' && observed
      ? new ResizeObserver(() => {
        const nextWidth = observed.getBoundingClientRect().width;
        const previousWidth = lastFitViewportWidthRef.current;
        if (previousWidth === null || Math.abs(nextWidth - previousWidth) > 1) {
          fitCanvas();
        }
      })
      : null;
    if (observed && resizeObserver) {
      resizeObserver.observe(observed);
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

  const resolveStagePosition = useCallback((clientX: number, clientY: number): { x: number; y: number } => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return { x: 48, y: 48 };
    const nextPoint = screenToCanvas(clientX - rect.left, clientY - rect.top, zoomState);
    return {
      x: Math.max(0, Math.min(stageWidth - 80, Math.round(nextPoint.x))),
      y: Math.max(0, Math.min(stageHeight - 48, Math.round(nextPoint.y))),
    };
  }, [zoomState, stageWidth, stageHeight]);

  const resolveCanvasPoint = useCallback((clientX: number, clientY: number): { x: number; y: number } => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    const point = screenToCanvas(clientX - rect.left, clientY - rect.top, zoomState);
    return {
      x: Math.max(0, Math.min(stageWidth, Math.round(point.x))),
      y: Math.max(0, Math.min(stageHeight, Math.round(point.y))),
    };
  }, [stageHeight, stageWidth, zoomState]);

  const createReferenceGuide = useCallback((axis: ReferenceGuide['axis'], position: number) => {
    const boundedPosition = axis === 'vertical'
      ? Math.max(0, Math.min(stageWidth, position))
      : Math.max(0, Math.min(stageHeight, position));
    const guide: ReferenceGuide = {
      id: makeGuideId(),
      axis,
      position: boundedPosition,
      label: `${axis === 'vertical' ? 'X' : 'Y'} ${Math.round(boundedPosition)}px`,
      color: '#e11d48',
    };
    updateEditorPrefs((current) => ({
      ...current,
      referenceGuides: [...current.referenceGuides, guide],
    }));
    onActivity?.(`Guide added: ${guide.label}`);
  }, [onActivity, stageHeight, stageWidth, updateEditorPrefs]);

  const removeReferenceGuide = useCallback((guideId: string) => {
    updateEditorPrefs((current) => ({
      ...current,
      referenceGuides: current.referenceGuides.filter((guide) => guide.id !== guideId),
    }));
  }, [updateEditorPrefs]);

  const startReferenceGuideDrag = useCallback((guide: ReferenceGuide, event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const pointerId = event.pointerId;
    const moveGuide = (clientX: number, clientY: number) => {
      const point = resolveCanvasPoint(clientX, clientY);
      const position = guide.axis === 'vertical'
        ? Math.max(0, Math.min(stageWidth, point.x))
        : Math.max(0, Math.min(stageHeight, point.y));
      updateEditorPrefs((current) => ({
        ...current,
        referenceGuides: current.referenceGuides.map((item) => (
          item.id === guide.id
            ? {
                ...item,
                position,
                label: `${guide.axis === 'vertical' ? 'X' : 'Y'} ${Math.round(position)}px`,
              }
            : item
        )),
      }), { persist: false });
    };

    function handlePointerMove(pointerEvent: PointerEvent) {
      if (pointerEvent.pointerId !== pointerId) return;
      moveGuide(pointerEvent.clientX, pointerEvent.clientY);
    }

    function handlePointerUp(pointerEvent: PointerEvent) {
      if (pointerEvent.pointerId !== pointerId) return;
      moveGuide(pointerEvent.clientX, pointerEvent.clientY);
      saveAndBroadcastEditorPreferences(editorPrefsRef.current);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  }, [resolveCanvasPoint, stageHeight, stageWidth, updateEditorPrefs]);

  const resolveViewportPopupPosition = useCallback((clientX: number, clientY: number) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    const width = rect?.width ?? stageWidth;
    const height = rect?.height ?? stageHeight;
    const rawX = rect ? clientX - rect.left : clientX;
    const rawY = rect ? clientY - rect.top : clientY;
    return {
      x: Math.max(12, Math.min(width - 244, rawX + 10)),
      y: Math.max(12, Math.min(height - 280, rawY + 10)),
    };
  }, [stageHeight, stageWidth]);

  const resolveContextMenuPosition = useCallback((clientX: number, clientY: number) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    const width = rect?.width ?? stageWidth;
    const height = rect?.height ?? stageHeight;
    const rawX = rect ? clientX - rect.left : clientX;
    const rawY = rect ? clientY - rect.top : clientY;
    if (rect && typeof window !== 'undefined') {
      return clampVisibleViewportPopupPosition(
        rawX,
        rawY,
        rect,
        CONTEXT_MENU_WIDTH,
        CONTEXT_MENU_MAX_HEIGHT,
      );
    }
    return clampViewportPopupPosition(
      rawX,
      rawY,
      width,
      height,
      CONTEXT_MENU_WIDTH,
      CONTEXT_MENU_MAX_HEIGHT,
    );
  }, [stageHeight, stageWidth]);

  const resolveOverlapCandidates = useCallback(
    (clientX: number, clientY: number): BuilderCanvasNode[] => {
      const point = resolveStagePosition(clientX, clientY);
      return selectableNodes
        .filter((node) => {
          const rect = absoluteRectById.get(node.id) ?? resolveViewportRect(node, geometryViewport);
          return (
            point.x >= rect.x
            && point.x <= rect.x + rect.width
            && point.y >= rect.y
            && point.y <= rect.y + rect.height
          );
        })
        .sort((left, right) => {
          const zDelta = right.zIndex - left.zIndex;
          if (zDelta !== 0) return zDelta;
          return getCanvasNodeDepth(right, nodesById) - getCanvasNodeDepth(left, nodesById);
        })
        .slice(0, 8);
    },
    [absoluteRectById, geometryViewport, nodesById, resolveStagePosition, selectableNodes],
  );

  const openOverlapPicker = useCallback(
    (clientX: number, clientY: number, candidates: BuilderCanvasNode[], mode: OverlapPickerState['mode']) => {
      const position = resolveViewportPopupPosition(clientX, clientY);
      setOverlapPicker({
        nodeIds: candidates.map((node) => node.id),
        x: position.x,
        y: position.y,
        mode,
      });
    },
    [resolveViewportPopupPosition],
  );

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

  const interactionMode = interaction?.type === 'move' || interaction?.type === 'resize'
    ? interaction.type
    : null;

  const interactionNodeIds = useMemo(() => {
    if (!interaction) return selectedNodeIds;
    if (interaction.type === 'move') return interaction.nodeIds;
    if (interaction.type === 'resize') return [interaction.nodeId];
    return selectedNodeIds;
  }, [interaction, selectedNodeIds]);

  const dragGhostStartRects = useMemo(() => {
    if (!interactionMode || !interaction) return [];
    if (interaction.type === 'move') {
      return Object.values(interaction.startAbsoluteRects);
    }
    if (interaction.type === 'resize') {
      return [interaction.startAbsoluteRect];
    }
    return [];
  }, [interaction, interactionMode]);

  const dragGhostCurrentRects = useMemo(() => (
    interactionNodeIds
      .map((nodeId) => absoluteRectById.get(nodeId))
      .filter((rect): rect is BuilderCanvasNode['rect'] => Boolean(rect))
  ), [absoluteRectById, interactionNodeIds]);

  const resizeCurrentRect = useMemo(() => {
    if (!interaction || interaction.type !== 'resize') return null;
    return absoluteRectById.get(interaction.nodeId) ?? null;
  }, [absoluteRectById, interaction]);

  const interactionActiveRect = useMemo(() => {
    if (!interactionMode) return null;
    return unionRects(dragGhostCurrentRects);
  }, [dragGhostCurrentRects, interactionMode]);

  const snapOtherRects = useMemo(() => {
    const activeIds = new Set(interactionNodeIds);
    return visibleNodes
      .filter((node) => !activeIds.has(node.id))
      .map((node) => absoluteRectById.get(node.id) ?? resolveViewportRect(node, geometryViewport));
  }, [absoluteRectById, geometryViewport, interactionNodeIds, visibleNodes]);

  // Bounding box of selected nodes in stage coordinates (pre-zoom/pan transform)
  const selectionBboxStage = useMemo(() => {
    if (selectedNodes.length === 0 || interaction) return null;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const node of selectedNodes) {
      const rect = absoluteRectById.get(node.id) ?? resolveViewportRect(node, geometryViewport);
      minX = Math.min(minX, rect.x);
      minY = Math.min(minY, rect.y);
      maxX = Math.max(maxX, rect.x + rect.width);
      maxY = Math.max(maxY, rect.y + rect.height);
    }
    if (!Number.isFinite(minX)) return null;
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }, [absoluteRectById, geometryViewport, interaction, selectedNodes]);

  // Convert stage coords → screen coords (relative to stage container)
  const selectionBboxScreen = useMemo(() => {
    if (!selectionBboxStage) return null;
    return {
      x: selectionBboxStage.x * zoomState.zoom + zoomState.panX,
      y: selectionBboxStage.y * zoomState.zoom + zoomState.panY,
      width: selectionBboxStage.width * zoomState.zoom,
      height: selectionBboxStage.height * zoomState.zoom,
    };
  }, [selectionBboxStage, zoomState.panX, zoomState.panY, zoomState.zoom]);

  return (
    <div className={styles.stageSurface}>
      <div
        ref={viewportRef}
        className={`${styles.stageViewport} ${isSpacePressed ? styles.stageViewportPannable : ''} ${interaction?.type === 'pan' ? styles.stageViewportPanning : ''}`}
        style={{
          flex: '0 0 auto',
          height: Math.max(240, Math.ceil(stageHeight * zoomState.zoom) + 2),
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
              data-canvas-interaction={interaction?.type ?? 'idle'}
              style={{ width: `${stageWidth}px`, height: `${stageHeight}px` }}
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
              const overlapCandidates = resolveOverlapCandidates(event.clientX, event.clientY);
              if (overlapCandidates.length <= 1) {
                setOverlapPicker(null);
                return;
              }

              if (event.altKey) {
                event.preventDefault();
                event.stopPropagation();
                setContextMenu(null);
                setSelectionBox(null);
                openOverlapPicker(event.clientX, event.clientY, overlapCandidates, 'list');
                return;
              }

              openOverlapPicker(event.clientX, event.clientY, overlapCandidates, 'hint');
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
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = 'copy';
            }}
            onDrop={(event) => {
              event.preventDefault();
              const savedSectionId = event.dataTransfer.getData('application/x-builder-saved-section-id');
              if (savedSectionId && onRequestInsertSavedSection) {
                const position = resolveStagePosition(event.clientX, event.clientY);
                onRequestInsertSavedSection(savedSectionId, position);
                setDraftSaveState('saving');
                return;
              }
              const kind = event.dataTransfer.getData('application/x-builder-node-kind');
              if (!builderCanvasNodeKinds.includes(kind as (typeof builderCanvasNodeKinds)[number])) return;
              const position = resolveStagePosition(event.clientX, event.clientY);
              const template = createCanvasNodeTemplate(
                kind as (typeof builderCanvasNodeKinds)[number],
                position.x,
                position.y,
                nodes.length,
              );
              // Honor the hovered container so dropping into a section/form
              // actually nests the new node rather than orphaning it at the
              // page root (with the container highlighted misleadingly).
              if (hoveredContainerId) {
                (template as { parentId?: string }).parentId = hoveredContainerId;
              }
              addNode(template);
              setDraftSaveState('saving');
            }}
          >
            {editorPrefs.rulers.enabled ? (
              <CanvasRulers
                onCreateGuide={createReferenceGuide}
                stageHeight={stageHeight}
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
              guides={editorPrefs.referenceGuides}
              onRemoveGuide={removeReferenceGuide}
              onStartGuideDrag={startReferenceGuideDrag}
              stageHeight={stageHeight}
              stageWidth={stageWidth}
            />
            <AlignmentGuides guides={guides} />
            <CanvasDropHighlight
              absoluteRectById={absoluteRectById}
              geometryViewport={geometryViewport}
              hoveredContainerId={hoveredContainerId}
              visibleNodes={visibleNodes}
            />
            <CanvasStageNodes
              handleInlineEditingChange={handleInlineEditingChange}
              onRequestAssetLibrary={onRequestAssetLibrary}
              resolveContextMenuPosition={resolveContextMenuPosition}
              rootVisibleNodes={rootVisibleNodes}
              selectedNodeIds={selectedNodeIds}
              selectionBoxRect={selectionBoxRect}
              setContextMenu={setContextMenu}
              setOverlapPicker={setOverlapPicker}
              setSelectedNodeId={setSelectedNodeId}
              startMove={startMove}
              startResize={startResize}
              toggleNodeSelection={toggleNodeSelection}
              updateNodeContent={updateNodeContent}
            />

            <CanvasStageToolbar
              canRedo={canRedo}
              canUndo={canUndo}
              gridEnabled={editorPrefs.pixelGrid.enabled}
              gridSize={editorPrefs.pixelGrid.size}
              handleRedo={handleRedo}
              handleUndo={handleUndo}
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
          resizeRect={resizeCurrentRect}
          resizePointer={interactionPointer}
          multiSelectionBbox={selectionBboxScreen}
          selectedCount={selectedNodes.length}
          snapActiveRect={interactionActiveRect}
          snapOtherRects={snapOtherRects}
          zoomState={zoomState}
        />

        <CanvasSelectionToolbarLayer
          bringSelectedNodeForward={bringSelectedNodeForward}
          contextMenuOpen={Boolean(contextMenu)}
          deleteSelectedNode={deleteSelectedNode}
          focusSelectedLinkInput={focusSelectedLinkInput}
          handleDuplicate={handleDuplicate}
          inlineEditingNodeId={inlineEditingNodeId}
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
          selectedNodeIds={selectedNodeIds}
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
          matchSelectedNodesSize={matchSelectedNodesSize}
          nodes={nodes}
          onRequestAssetLibrary={onRequestAssetLibrary}
          onRequestImageEditor={onRequestImageEditor}
          onRequestMoveToPage={onRequestMoveToPage}
          onRequestSaveAsSection={onRequestSaveAsSection}
          selectedLinkTargetNode={selectedLinkTargetNode}
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

      <CanvasZoomDock fitCanvas={fitCanvas} setZoomState={setZoomState} zoomState={zoomState} />
    </div>
  );
}
