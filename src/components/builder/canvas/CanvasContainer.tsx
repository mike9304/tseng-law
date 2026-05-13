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
import type { ImageEditTab } from '@/components/builder/canvas/ImageEditDialog';
import {
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
  resolveCanvasNodeAbsoluteRectForViewport,
} from '@/lib/builder/canvas/tree';
import type { Viewport } from '@/lib/builder/canvas/responsive';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  createDefaultZoomState,
  MAX_ZOOM,
  MIN_ZOOM,
  zoomIn as stepZoomIn,
  zoomOut as stepZoomOut,
  type ZoomState,
} from '@/lib/builder/canvas/zoom';
import { useCanvasReferenceGuides } from './useCanvasReferenceGuides';
import { useCanvasFeedbackGeometry } from './useCanvasFeedbackGeometry';
import { useCanvasStageDrop } from './useCanvasStageDrop';
import { useCanvasStageGeometry } from './useCanvasStageGeometry';
import styles from './SandboxPage.module.css';

const DEFAULT_STAGE_WIDTH = 1280;
const DEFAULT_STAGE_HEIGHT = 880;
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
    toggleSelectedNodeLock,
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
    stageHeight,
    stageWidth,
    viewportRef,
    zoomState,
  });

  const {
    createReferenceGuide,
    removeReferenceGuide,
    startReferenceGuideDrag,
  } = useCanvasReferenceGuides({
    editorPrefsRef,
    onActivity,
    resolveCanvasPoint,
    stageHeight,
    stageWidth,
    updateEditorPrefs,
  });
  const { handleStageDragOver, handleStageDrop } = useCanvasStageDrop({
    addNode,
    hoveredContainerId,
    nodeCount: nodes.length,
    onRequestInsertSavedSection,
    resolveStagePosition,
    setDraftSaveState,
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
    resizeCurrentRect,
    selectionBboxScreen,
    snapOtherRects,
  } = useCanvasFeedbackGeometry({
    absoluteRectById,
    geometryViewport,
    interaction,
    selectedNodeIds,
    selectedNodes,
    visibleNodes,
    zoomState,
  });

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
            onDragOver={handleStageDragOver}
            onDrop={handleStageDrop}
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
