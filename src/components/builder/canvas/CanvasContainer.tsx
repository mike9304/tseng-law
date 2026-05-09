'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import AlignmentGuides from '@/components/builder/canvas/AlignmentGuides';
import CanvasFeedbackOverlay from '@/components/builder/canvas/CanvasFeedbackOverlay';
import CanvasNode, { type ResizeHandle } from '@/components/builder/canvas/CanvasNode';
import ContextMenu from '@/components/builder/canvas/ContextMenu';
import type { ImageEditTab } from '@/components/builder/canvas/ImageEditDialog';
import SelectionBox from '@/components/builder/canvas/SelectionBox';
import SelectionToolbar from '@/components/builder/canvas/SelectionToolbar';
import type { LinkPickerContext } from '@/components/builder/editor/LinkPicker';
import {
  createCanvasNodeTemplate,
  useBuilderCanvasStore,
} from '@/lib/builder/canvas/store';
import { getCanvasNodesById } from '@/lib/builder/canvas/indexes';
import { linkValueFromLegacy, type LinkValue } from '@/lib/builder/links';
import {
  resolveCanvasNodeAbsoluteRectForViewport,
  resolveCanvasNodeLocalRect,
} from '@/lib/builder/canvas/tree';
import { resolveViewportRect, type Viewport } from '@/lib/builder/canvas/responsive';
import { builderCanvasNodeKinds, isContainerLikeKind, type BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createShortcutHandler, NUDGE_LARGE_PX, NUDGE_PX, type CanvasAction } from '@/lib/builder/canvas/shortcuts';
import { type AlignmentGuide, computeSnap, type Rect } from '@/lib/builder/canvas/snap';
import {
  createDefaultZoomState,
  MAX_ZOOM,
  MIN_ZOOM,
  screenToCanvas,
  zoomIn as stepZoomIn,
  zoomLabel,
  zoomOut as stepZoomOut,
  zoomTo,
  type ZoomState,
} from '@/lib/builder/canvas/zoom';
import styles from './SandboxPage.module.css';

type InteractionState =
  | {
      type: 'move';
      nodeId: string;
      nodeIds: string[];
      viewport: Viewport;
      pointerId: number;
      originX: number;
      originY: number;
      startParentId: string | null;
      startRects: Record<string, BuilderCanvasNode['rect']>;
      startAbsoluteRects: Record<string, BuilderCanvasNode['rect']>;
    }
  | {
      type: 'resize';
      nodeId: string;
      handle: ResizeHandle;
      viewport: Viewport;
      pointerId: number;
      originX: number;
      originY: number;
      startRect: BuilderCanvasNode['rect'];
      startAbsoluteRect: BuilderCanvasNode['rect'];
    }
  | {
      type: 'pan';
      pointerId: number;
      originX: number;
      originY: number;
      startPanX: number;
      startPanY: number;
    }
  | null;

type SelectionBoxState = {
  pointerId: number;
  originX: number;
  originY: number;
  currentX: number;
  currentY: number;
  additive: boolean;
};

type ContextMenuState = {
  nodeId: string;
  x: number;
  y: number;
};

type OverlapPickerState = {
  nodeIds: string[];
  x: number;
  y: number;
  mode: 'hint' | 'list';
};

type InteractionGeometrySnapshot = {
  nodes: BuilderCanvasNode[];
  nodesById: Map<string, BuilderCanvasNode>;
  absoluteRectById: Map<string, BuilderCanvasNode['rect']>;
};

const DEFAULT_STAGE_WIDTH = 1280;
const DEFAULT_STAGE_HEIGHT = 880;
const MIN_WIDTH = 72;
const MIN_HEIGHT = 40;
const POPUP_EDGE_MARGIN = 12;
const CONTEXT_MENU_WIDTH = 276;
const CONTEXT_MENU_MAX_HEIGHT = 520;
const EMPTY_CANVAS_NODES: BuilderCanvasNode[] = [];

function clampPopupAxis(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

function clampViewportPopupPosition(
  rawX: number,
  rawY: number,
  viewportWidth: number,
  viewportHeight: number,
  popupWidth: number,
  popupHeight: number,
  margin = POPUP_EDGE_MARGIN,
): { x: number; y: number } {
  return {
    x: clampPopupAxis(rawX, margin, viewportWidth - popupWidth - margin),
    y: clampPopupAxis(rawY, margin, viewportHeight - popupHeight - margin),
  };
}

function clampVisibleViewportPopupPosition(
  rawX: number,
  rawY: number,
  viewportRect: DOMRect,
  popupWidth: number,
  popupHeight: number,
  margin = POPUP_EDGE_MARGIN,
): { x: number; y: number } {
  const visibleLeft = Math.max(viewportRect.left, 0);
  const visibleTop = Math.max(viewportRect.top, 0);
  const visibleRight = Math.min(viewportRect.right, window.innerWidth);
  const visibleBottom = Math.min(viewportRect.bottom, window.innerHeight);
  return {
    x: clampPopupAxis(
      rawX,
      visibleLeft - viewportRect.left + margin,
      visibleRight - viewportRect.left - popupWidth - margin,
    ),
    y: clampPopupAxis(
      rawY,
      visibleTop - viewportRect.top + margin,
      visibleBottom - viewportRect.top - popupHeight - margin,
    ),
  };
}

function clampRect(
  rect: BuilderCanvasNode['rect'],
  stageWidth: number,
  stageHeight: number,
): BuilderCanvasNode['rect'] {
  const width = Math.max(MIN_WIDTH, Math.min(stageWidth, Math.round(rect.width)));
  const height = Math.max(MIN_HEIGHT, Math.min(stageHeight, Math.round(rect.height)));
  const x = Math.max(0, Math.min(stageWidth - width, Math.round(rect.x)));
  const y = Math.max(0, Math.min(stageHeight - height, Math.round(rect.y)));
  return { x, y, width, height };
}

function clampAspectRect(
  rect: BuilderCanvasNode['rect'],
  startRect: BuilderCanvasNode['rect'],
  handle: ResizeHandle,
  stageWidth: number,
  stageHeight: number,
): BuilderCanvasNode['rect'] {
  const aspect = startRect.width / startRect.height;
  const growsRight = handle === 'ne' || handle === 'e' || handle === 'se';
  const growsDown = handle === 'sw' || handle === 's' || handle === 'se';
  const anchorX = growsRight ? startRect.x : startRect.x + startRect.width;
  const anchorY = growsDown ? startRect.y : startRect.y + startRect.height;
  const maxWidthFromAnchor = growsRight ? stageWidth - anchorX : anchorX;
  const maxHeightFromAnchor = growsDown ? stageHeight - anchorY : anchorY;
  const minWidth = Math.max(MIN_WIDTH, MIN_HEIGHT * aspect);
  const maxWidth = Math.max(minWidth, Math.min(maxWidthFromAnchor, maxHeightFromAnchor * aspect));
  const width = Math.round(Math.max(minWidth, Math.min(maxWidth, rect.width)));
  const height = Math.round(width / aspect);
  const x = growsRight ? anchorX : anchorX - width;
  const y = growsDown ? anchorY : anchorY - height;
  return {
    x: Math.max(0, Math.min(stageWidth - width, Math.round(x))),
    y: Math.max(0, Math.min(stageHeight - height, Math.round(y))),
    width,
    height,
  };
}

function getCanvasNodeLabel(node: BuilderCanvasNode): string {
  const content = node.content as Record<string, unknown>;
  const text = content.text ?? content.label ?? content.alt ?? content.title;
  if (typeof text === 'string' && text.trim()) {
    return text.trim().slice(0, 48);
  }
  return node.id;
}

function getCanvasNodeDepth(
  node: BuilderCanvasNode,
  nodesById: Map<string, BuilderCanvasNode>,
): number {
  let depth = 0;
  const visited = new Set<string>();
  let parentId = node.parentId ?? null;

  while (parentId && !visited.has(parentId)) {
    visited.add(parentId);
    depth += 1;
    parentId = nodesById.get(parentId)?.parentId ?? null;
  }

  return depth;
}

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
  const [interaction, setInteraction] = useState<InteractionState>(null);
  const [activeViewport, setActiveViewport] = useState<Viewport | null>(null);
  const [selectionBox, setSelectionBox] = useState<SelectionBoxState | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [selectionLinkPopoverOpen, setSelectionLinkPopoverOpen] = useState(false);
  const [inlineEditingNodeId, setInlineEditingNodeId] = useState<string | null>(null);
  const [overlapPicker, setOverlapPicker] = useState<OverlapPickerState | null>(null);
  const [guides, setGuides] = useState<AlignmentGuide[]>([]);
  const [interactionPointer, setInteractionPointer] = useState<{ x: number; y: number } | null>(null);
  const [zoomState, setZoomState] = useState<ZoomState>(() => createDefaultZoomState());
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [hoveredContainerId, setHoveredContainerId] = useState<string | null>(null);
  const canceledInteractionPointerIdsRef = useRef<Set<number>>(new Set());
  const interactionGeometrySnapshotRef = useRef<InteractionGeometrySnapshot | null>(null);
  const moveNodeIntoContainer = useBuilderCanvasStore((s) => s.moveNodeIntoContainer);

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

  const handleDuplicate = useCallback(() => {
    const count = useBuilderCanvasStore.getState().selectedNodeIds.length;
    if (count === 0) return;
    duplicateSelectedNode();
    onToast?.('Duplicated', 'success');
  }, [duplicateSelectedNode, onToast]);

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
  const nodesById = useMemo(() => getCanvasNodesById(nodes), [nodes]);
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

  const handleInlineEditingChange = useCallback((nodeId: string, editing: boolean) => {
    setInlineEditingNodeId((current) => {
      if (editing) return nodeId;
      return current === nodeId ? null : current;
    });
  }, []);

  useEffect(() => {
    if (!inlineEditingNodeId) return;
    if (!nodes.some((node) => node.id === inlineEditingNodeId)) {
      setInlineEditingNodeId(null);
    }
  }, [inlineEditingNodeId, nodes]);

  const resolveEditableLinkNode = useCallback(
    (node: BuilderCanvasNode | undefined): BuilderCanvasNode | null => {
      if (!node) return null;
      if (node.kind === 'button' || node.kind === 'image' || node.kind === 'container') return node;

      const matches: BuilderCanvasNode[] = [];
      const visit = (nodeId: string) => {
        for (const childId of childrenMap[nodeId] ?? []) {
          const child = nodesById.get(childId);
          if (!child || !child.visible) continue;
          if (child.kind === 'button') {
            matches.push(child);
          }
          visit(child.id);
        }
      };

      visit(node.id);
      if (matches.length === 0) {
        const nodeRect = absoluteRectById.get(node.id) ?? resolveViewportRect(node, geometryViewport);
        for (const candidate of visibleNodes) {
          if (candidate.id === node.id || candidate.kind !== 'button') continue;
          const candidateRect = absoluteRectById.get(candidate.id) ?? resolveViewportRect(candidate, geometryViewport);
          const centerX = candidateRect.x + candidateRect.width / 2;
          const centerY = candidateRect.y + candidateRect.height / 2;
          const isInside =
            centerX >= nodeRect.x &&
            centerX <= nodeRect.x + nodeRect.width &&
            centerY >= nodeRect.y &&
            centerY <= nodeRect.y + nodeRect.height;
          if (isInside) {
            matches.push(candidate);
          }
        }
      }
      return matches.length === 1 ? matches[0] : null;
    },
    [absoluteRectById, childrenMap, geometryViewport, nodesById, visibleNodes],
  );

  const selectedLinkTargetNode = useMemo(
    () => (selectedNodes.length === 1 ? resolveEditableLinkNode(selectedNodes[0]) : null),
    [resolveEditableLinkNode, selectedNodes],
  );

  const focusSelectedLinkInput = useCallback(() => {
    if (!selectedLinkTargetNode || typeof document === 'undefined') return;
    if (selectedNodeId !== selectedLinkTargetNode.id) {
      setSelectedNodeIds([selectedLinkTargetNode.id], selectedLinkTargetNode.id);
    }
    document.dispatchEvent(
      new CustomEvent('builder:focus-href-input', {
        detail: { nodeId: selectedLinkTargetNode.id },
      }),
    );
  }, [selectedLinkTargetNode, selectedNodeId, setSelectedNodeIds]);

  // nodeBadge link click → inline popover via SelectionToolbar (canvas-side, no inspector jump)
  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ nodeId?: string }>).detail;
      if (!detail?.nodeId) return;
      if (selectedNodeId !== detail.nodeId) {
        setSelectedNodeIds([detail.nodeId], detail.nodeId);
      }
      setSelectionLinkPopoverOpen(true);
    };
    document.addEventListener('builder:open-link-popover', handler);
    return () => document.removeEventListener('builder:open-link-popover', handler);
  }, [selectedNodeId, setSelectedNodeIds]);

  const updateSelectedLink = useCallback(
    (nodeId: string, link: LinkValue | null) => {
      const node = nodesById.get(nodeId);
      if (!node) return;
      if (node.kind === 'button') {
        updateNodeContent(nodeId, {
          link: link ?? undefined,
          href: link?.href ?? '',
          target: link?.target === '_blank' ? '_blank' : undefined,
          rel: link?.rel,
          title: link?.title,
          ariaLabel: link?.ariaLabel,
        });
        return;
      }
      if (node.kind === 'image' || node.kind === 'container') {
        updateNodeContent(nodeId, { link: link ?? undefined });
      }
    },
    [nodesById, updateNodeContent],
  );

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

  useEffect(() => {
    if (!activeViewport || activeViewport === currentViewport) return;
    cancelMutationSession();
    interactionGeometrySnapshotRef.current = null;
    setActiveViewport(null);
    setInteraction(null);
    setInteractionPointer(null);
    setGuides([]);
    setHoveredContainerId(null);
  }, [activeViewport, cancelMutationSession, currentViewport]);

  useEffect(() => {
    if (!interaction) return undefined;
    const activeInteraction = interaction;

    function handleInteractionEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      canceledInteractionPointerIdsRef.current.add(activeInteraction.pointerId);
      cancelMutationSession();
      interactionGeometrySnapshotRef.current = null;
      setInteraction(null);
      setActiveViewport(null);
      setInteractionPointer(null);
      setGuides([]);
      setHoveredContainerId(null);
      setContextMenu(null);
      setOverlapPicker(null);
    }

    window.addEventListener('keydown', handleInteractionEscape, true);
    return () => window.removeEventListener('keydown', handleInteractionEscape, true);
  }, [cancelMutationSession, interaction]);

  useEffect(() => {
    function dispatch(action: NonNullable<CanvasAction>) {
      switch (action) {
        case 'undo':
          handleUndo();
          break;
        case 'redo':
          handleRedo();
          break;
        case 'delete':
          deleteSelectedNode();
          break;
        case 'duplicate':
          handleDuplicate();
          break;
        case 'selectAll': {
          const storeState = useBuilderCanvasStore.getState();
          const allNodes = (storeState.document?.nodes ?? []).filter((node) => (
            node.visible
            && (storeState.activeGroupId ? node.parentId === storeState.activeGroupId : true)
          ));
          setSelectedNodeIds(allNodes.map((node) => node.id), allNodes[allNodes.length - 1]?.id ?? null);
          break;
        }
        case 'deselect':
          setContextMenu(null);
          setOverlapPicker(null);
          if (useBuilderCanvasStore.getState().selectedNodeIds.length > 0) {
            setSelectedNodeIds([], null);
          } else if (useBuilderCanvasStore.getState().activeGroupId) {
            exitGroup();
          }
          break;
        case 'copy':
          handleCopy();
          break;
        case 'paste':
          handlePaste();
          break;
        case 'cut':
          handleCut();
          break;
        case 'zoomIn':
          setZoomState((currentState) => stepZoomIn(currentState));
          break;
        case 'zoomOut':
          setZoomState((currentState) => stepZoomOut(currentState));
          break;
        case 'zoomReset':
          fitCanvas();
          break;
        case 'bringForward':
          bringSelectedNodeForward();
          break;
        case 'sendBackward':
          sendSelectedNodeBackward();
          break;
        case 'bringToFront':
          bringSelectedNodeToFront();
          break;
        case 'sendToBack':
          sendSelectedNodeToBack();
          break;
        case 'nudgeUp':
          nudgeSelectedNode(0, -NUDGE_PX);
          break;
        case 'nudgeDown':
          nudgeSelectedNode(0, NUDGE_PX);
          break;
        case 'nudgeLeft':
          nudgeSelectedNode(-NUDGE_PX, 0);
          break;
        case 'nudgeRight':
          nudgeSelectedNode(NUDGE_PX, 0);
          break;
        case 'nudgeUpLarge':
          nudgeSelectedNode(0, -NUDGE_LARGE_PX);
          break;
        case 'nudgeDownLarge':
          nudgeSelectedNode(0, NUDGE_LARGE_PX);
          break;
        case 'nudgeLeftLarge':
          nudgeSelectedNode(-NUDGE_LARGE_PX, 0);
          break;
        case 'nudgeRightLarge':
          nudgeSelectedNode(NUDGE_LARGE_PX, 0);
          break;
        case 'group':
          groupSelectedNodes();
          break;
        case 'ungroup':
          ungroupSelectedNode();
          break;
        case 'showHelp':
          if (typeof document !== 'undefined') {
            document.dispatchEvent(new CustomEvent('builder:show-help'));
          }
          break;
        case 'editLink':
          if (selectedLinkTargetNode) {
            focusSelectedLinkInput();
          }
          break;
      }
    }

    const handler = createShortcutHandler(dispatch);
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [
    bringSelectedNodeForward,
    bringSelectedNodeToFront,
    deleteSelectedNode,
    fitCanvas,
    focusSelectedLinkInput,
    groupSelectedNodes,
    handleCopy,
    handleCut,
    handleDuplicate,
    handlePaste,
    nudgeSelectedNode,
    handleRedo,
    handleUndo,
    selectedLinkTargetNode,
    sendSelectedNodeBackward,
    sendSelectedNodeToBack,
    exitGroup,
    setSelectedNodeIds,
    undo,
    ungroupSelectedNode,
  ]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code === 'Space' && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement) && !(event.target instanceof HTMLSelectElement) && !(event.target instanceof HTMLElement && event.target.isContentEditable)) {
        setIsSpacePressed(true);
      }
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.code === 'Space') {
        setIsSpacePressed(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!interaction) return undefined;
    const activeInteraction = interaction;
    canceledInteractionPointerIdsRef.current.delete(activeInteraction.pointerId);

    function handlePointerMove(event: PointerEvent) {
      if (canceledInteractionPointerIdsRef.current.has(activeInteraction.pointerId)) return;
      if (activeInteraction.type === 'pan') {
        const deltaX = event.clientX - activeInteraction.originX;
        setZoomState((currentState) => ({
          ...currentState,
          panX: activeInteraction.startPanX + deltaX,
          panY: 0,
        }));
        return;
      }

      const deltaX = (event.clientX - activeInteraction.originX) / zoomState.zoom;
      const deltaY = (event.clientY - activeInteraction.originY) / zoomState.zoom;
      const viewportRect = viewportRef.current?.getBoundingClientRect();
      setInteractionPointer({
        x: viewportRect ? event.clientX - viewportRect.left : event.clientX,
        y: viewportRect ? event.clientY - viewportRect.top : event.clientY,
      });
      if (activeInteraction.type === 'move') {
        setOverlapPicker(null);
        const movingNodeIds = new Set(activeInteraction.nodeIds);
        const geometry = interactionGeometrySnapshotRef.current;
        if (!geometry) return;
        const currentNodesForHover = geometry.nodes;
        const currentNodesById = geometry.nodesById;
        const currentAbsoluteRects = geometry.absoluteRectById;
        if (activeInteraction.nodeIds.length === 1) {
          const nodeId = activeInteraction.nodeIds[0];
          const baseAbsoluteRect = activeInteraction.startAbsoluteRects[nodeId];
          const currentNode = currentNodesById.get(nodeId);
          if (currentNode && baseAbsoluteRect) {
            const tentative: Rect = {
              x: baseAbsoluteRect.x + deltaX,
              y: baseAbsoluteRect.y + deltaY,
              width: baseAbsoluteRect.width,
              height: baseAbsoluteRect.height,
            };
            const centerX = tentative.x + tentative.width / 2;
            const centerY = tentative.y + tentative.height / 2;
            const hitContainer = currentNodesForHover.find(
              (n) =>
                isContainerLikeKind(n.kind) &&
                !movingNodeIds.has(n.id) &&
                n.visible &&
                (() => {
                  const rect = currentAbsoluteRects.get(n.id) ?? resolveViewportRect(n, activeInteraction.viewport);
                  return (
                    centerX >= rect.x
                    && centerX <= rect.x + rect.width
                    && centerY >= rect.y
                    && centerY <= rect.y + rect.height
                  );
                })(),
            );
            setHoveredContainerId(hitContainer?.id ?? null);

            const parentRect = currentNode.parentId
              ? currentAbsoluteRects.get(currentNode.parentId) ?? null
              : null;
            const otherRects: Rect[] = currentNodesForHover
              .filter((node) => (
                node.id !== nodeId
                && node.visible
                && (activeGroupId
                  ? node.parentId === activeGroupId
                  : currentNode.parentId
                    ? node.parentId === currentNode.parentId
                    : !node.parentId)
              ))
              .map((node) => currentAbsoluteRects.get(node.id) ?? resolveViewportRect(node, activeInteraction.viewport));
            if (parentRect) otherRects.push(parentRect);
            const { snappedRect, guides: nextGuides } = computeSnap(tentative, otherRects, 0, {
              width: stageWidth,
              height: stageHeight,
            });
            setGuides(nextGuides);
            updateNodeRectsForViewport(
              new Map([
                [
                  nodeId,
                  clampRect(
                    resolveCanvasNodeLocalRect(snappedRect, parentRect),
                    parentRect?.width ?? stageWidth,
                    parentRect?.height ?? stageHeight,
                  ),
                ],
              ]),
              activeInteraction.viewport,
              'transient',
            );
            return;
          }
        }
        setHoveredContainerId(null);
        setGuides([]);
        const nextRects = new Map<string, BuilderCanvasNode['rect']>();
        for (const nodeId of activeInteraction.nodeIds) {
          const currentNode = currentNodesById.get(nodeId);
          if (!currentNode) continue;
          const baseRect = activeInteraction.startRects[nodeId] ?? resolveViewportRect(currentNode, activeInteraction.viewport);
          const parentRect = currentNode.parentId
            ? currentAbsoluteRects.get(currentNode.parentId) ?? null
            : null;
          nextRects.set(
            nodeId,
            clampRect(
              {
                ...baseRect,
                x: baseRect.x + deltaX,
                y: baseRect.y + deltaY,
              },
              parentRect?.width ?? stageWidth,
              parentRect?.height ?? stageHeight,
            ),
          );
        }
        updateNodeRectsForViewport(nextRects, activeInteraction.viewport, 'transient');
        return;
      }

      setGuides([]);
      const geometry = interactionGeometrySnapshotRef.current;
      if (!geometry) return;
      const currentNodesById = geometry.nodesById;
      const currentAbsoluteRects = geometry.absoluteRectById;
      const targetNode = currentNodesById.get(activeInteraction.nodeId);
      if (!targetNode) return;
      const { handle } = activeInteraction;
      const startRect = activeInteraction.startRect;
      const nextRect = { ...startRect };
      const isCorner = handle === 'nw' || handle === 'ne' || handle === 'sw' || handle === 'se';
      const preserveAspectRatio = isCorner && event.shiftKey;

      if (preserveAspectRatio) {
        const aspect = startRect.width / startRect.height;
        let newWidth: number;
        let newHeight: number;
        if (Math.abs(deltaX) * startRect.height >= Math.abs(deltaY) * startRect.width) {
          if (handle === 'se' || handle === 'ne') {
            newWidth = startRect.width + deltaX;
          } else {
            newWidth = startRect.width - deltaX;
          }
          newHeight = newWidth / aspect;
        } else {
          if (handle === 'se' || handle === 'sw') {
            newHeight = startRect.height + deltaY;
          } else {
            newHeight = startRect.height - deltaY;
          }
          newWidth = newHeight * aspect;
        }
        nextRect.width = newWidth;
        nextRect.height = newHeight;
        if (handle === 'nw') {
          nextRect.x = startRect.x + (startRect.width - newWidth);
          nextRect.y = startRect.y + (startRect.height - newHeight);
        } else if (handle === 'ne') {
          nextRect.y = startRect.y + (startRect.height - newHeight);
        } else if (handle === 'sw') {
          nextRect.x = startRect.x + (startRect.width - newWidth);
        }
      } else {
        if (handle === 'e' || handle === 'ne' || handle === 'se') {
          nextRect.width = startRect.width + deltaX;
        }
        if (handle === 'w' || handle === 'nw' || handle === 'sw') {
          nextRect.x = startRect.x + deltaX;
          nextRect.width = startRect.width - deltaX;
        }
        if (handle === 's' || handle === 'sw' || handle === 'se') {
          nextRect.height = startRect.height + deltaY;
        }
        if (handle === 'n' || handle === 'nw' || handle === 'ne') {
          nextRect.y = startRect.y + deltaY;
          nextRect.height = startRect.height - deltaY;
        }
      }

      const parentRect = targetNode.parentId
        ? currentAbsoluteRects.get(targetNode.parentId) ?? null
        : null;
      const boundsWidth = parentRect?.width ?? stageWidth;
      const boundsHeight = parentRect?.height ?? stageHeight;
      updateNodeRectsForViewport(
        new Map([
          [
            activeInteraction.nodeId,
            preserveAspectRatio
              ? clampAspectRect(nextRect, startRect, handle, boundsWidth, boundsHeight)
              : clampRect(nextRect, boundsWidth, boundsHeight),
          ],
        ]),
        activeInteraction.viewport,
        'transient',
      );
    }

    function handlePointerUp(event: PointerEvent) {
      if (event.pointerId === activeInteraction.pointerId) {
        if (canceledInteractionPointerIdsRef.current.delete(activeInteraction.pointerId)) {
          interactionGeometrySnapshotRef.current = null;
          return;
        }
        const currentHoveredContainerId = (() => {
          if (activeInteraction.type !== 'move' || activeInteraction.nodeIds.length !== 1) return null;
          const nodeId = activeInteraction.nodeIds[0];
          const currentDocument = useBuilderCanvasStore.getState().document;
          const allNodes = currentDocument?.nodes ?? [];
          const nodesById = getCanvasNodesById(allNodes);
          const movedNode = nodesById.get(nodeId);
          if (!movedNode) return null;
          const movedRect = resolveCanvasNodeAbsoluteRectForViewport(
            movedNode,
            nodesById,
            activeInteraction.viewport,
          );
          const cx = movedRect.x + movedRect.width / 2;
          const cy = movedRect.y + movedRect.height / 2;
          return allNodes.find(
            (n) =>
              isContainerLikeKind(n.kind) &&
              n.id !== nodeId &&
              n.visible &&
              (() => {
                const rect = resolveCanvasNodeAbsoluteRectForViewport(
                  n,
                  nodesById,
                  activeInteraction.viewport,
                );
                return (
                  cx >= rect.x
                  && cx <= rect.x + rect.width
                  && cy >= rect.y
                  && cy <= rect.y + rect.height
                );
              })(),
          )?.id ?? null;
        })();
        const willReparent = Boolean(
          currentHoveredContainerId
          && activeInteraction.type === 'move'
          && activeInteraction.nodeIds.length === 1
          && currentHoveredContainerId !== activeInteraction.startParentId,
        );
        if (willReparent && activeInteraction.type === 'move' && activeInteraction.viewport !== 'desktop') {
          cancelMutationSession();
          onToast?.('Reparenting is desktop-only in this build', 'error');
        } else {
          if (
            willReparent
            && activeInteraction.type === 'move'
            && activeInteraction.viewport === 'desktop'
            && currentHoveredContainerId
          ) {
            moveNodeIntoContainer(activeInteraction.nodeIds[0], currentHoveredContainerId);
          }
          if (activeInteraction.type !== 'pan') {
            commitMutationSession();
          }
        }
        setHoveredContainerId(null);
        interactionGeometrySnapshotRef.current = null;
        setInteraction(null);
        setActiveViewport(null);
        setInteractionPointer(null);
        setGuides([]);
      }
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [
    activeGroupId,
    cancelMutationSession,
    commitMutationSession,
    interaction,
    moveNodeIntoContainer,
    onToast,
    updateNodeRectsForViewport,
    zoomState.zoom,
    stageWidth,
    stageHeight,
  ]);

  const resolveStagePosition = useCallback((clientX: number, clientY: number): { x: number; y: number } => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return { x: 48, y: 48 };
    const nextPoint = screenToCanvas(clientX - rect.left, clientY - rect.top, zoomState);
    return {
      x: Math.max(0, Math.min(stageWidth - 80, Math.round(nextPoint.x))),
      y: Math.max(0, Math.min(stageHeight - 48, Math.round(nextPoint.y))),
    };
  }, [zoomState, stageWidth, stageHeight]);

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

  useEffect(() => {
    if (!selectionBox) return undefined;
    const activeSelectionBox = selectionBox;

    function handlePointerMove(event: PointerEvent) {
      const nextPoint = resolveStagePosition(event.clientX, event.clientY);
      setSelectionBox((currentSelectionBox) => (
        currentSelectionBox
          ? {
              ...currentSelectionBox,
              currentX: nextPoint.x,
              currentY: nextPoint.y,
            }
          : currentSelectionBox
      ));
    }

    function handlePointerUp(event: PointerEvent) {
      if (event.pointerId !== activeSelectionBox.pointerId) return;

      const left = Math.min(activeSelectionBox.originX, activeSelectionBox.currentX);
      const top = Math.min(activeSelectionBox.originY, activeSelectionBox.currentY);
      const right = Math.max(activeSelectionBox.originX, activeSelectionBox.currentX);
      const bottom = Math.max(activeSelectionBox.originY, activeSelectionBox.currentY);

      const intersectingNodeIds = selectableNodes
        .filter((node) => {
          const rect = absoluteRectById.get(node.id) ?? resolveViewportRect(node, geometryViewport);
          return (
            rect.x < right
            && rect.x + rect.width > left
            && rect.y < bottom
            && rect.y + rect.height > top
          );
        })
        .map((node) => node.id);
      const nextPrimaryNodeId = intersectingNodeIds[intersectingNodeIds.length - 1] ?? null;

      if (activeSelectionBox.additive) {
        setSelectedNodeIds(
          [...new Set([...selectedNodeIds, ...intersectingNodeIds])],
          nextPrimaryNodeId ?? selectedNodeId,
        );
      } else {
        setSelectedNodeIds(intersectingNodeIds, nextPrimaryNodeId);
      }
      setSelectionBox(null);
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [absoluteRectById, geometryViewport, resolveStagePosition, selectableNodes, selectedNodeId, selectedNodeIds, selectionBox, setSelectedNodeIds]);

  const selectionBoxRect = useMemo(() => {
    if (!selectionBox) return null;
    return {
      left: Math.min(selectionBox.originX, selectionBox.currentX),
      top: Math.min(selectionBox.originY, selectionBox.currentY),
      width: Math.abs(selectionBox.currentX - selectionBox.originX),
      height: Math.abs(selectionBox.currentY - selectionBox.originY),
    };
  }, [selectionBox]);

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
    if (!interactionMode || dragGhostCurrentRects.length === 0) return null;
    const minX = Math.min(...dragGhostCurrentRects.map((rect) => rect.x));
    const minY = Math.min(...dragGhostCurrentRects.map((rect) => rect.y));
    const maxX = Math.max(...dragGhostCurrentRects.map((rect) => rect.x + rect.width));
    const maxY = Math.max(...dragGhostCurrentRects.map((rect) => rect.y + rect.height));
    return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
  }, [dragGhostCurrentRects, interactionMode]);

  const snapOtherRects = useMemo(() => {
    const activeIds = new Set(interactionNodeIds);
    return visibleNodes
      .filter((node) => !activeIds.has(node.id))
      .map((node) => absoluteRectById.get(node.id) ?? resolveViewportRect(node, geometryViewport));
  }, [absoluteRectById, geometryViewport, interactionNodeIds, visibleNodes]);

  const contextMenuTitle = selectedNodeIds.length > 1
    ? `${selectedNodeIds.length} selected`
    : contextMenu?.nodeId ?? 'Context menu';
  const contextMenuNode = useMemo(
    () => (contextMenu ? nodes.find((node) => node.id === contextMenu.nodeId) ?? null : null),
    [contextMenu, nodes],
  );
  const contextPrimaryNode = contextMenuNode ?? selectedNodes[0] ?? null;
  const contextSelectionCount =
    contextMenuNode && !(selectedNodeIds.length > 1 && selectedNodeIds.includes(contextMenuNode.id))
      ? 1
      : selectedNodeIds.length;

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
              const shouldPan = event.button === 1 || (event.button === 0 && isSpacePressed);
              if (shouldPan) {
                event.preventDefault();
                event.stopPropagation();
                setContextMenu(null);
                setOverlapPicker(null);
                setSelectionBox(null);
                interactionGeometrySnapshotRef.current = null;
                setInteraction({
                  type: 'pan',
                  pointerId: event.pointerId,
                  originX: event.clientX,
                  originY: event.clientY,
                  startPanX: zoomState.panX,
                  startPanY: zoomState.panY,
                });
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
              addNode(
                createCanvasNodeTemplate(
                  kind as (typeof builderCanvasNodeKinds)[number],
                  position.x,
                  position.y,
                  nodes.length,
                ),
              );
              setDraftSaveState('saving');
            }}
          >
            <div className={styles.topRuler} aria-hidden>
              {Array.from({ length: Math.floor(stageWidth / 40) + 1 }).map((_, index) => (
                <span
                  key={`top-${index}`}
                  className={styles.rulerMark}
                  style={{ left: `${index * 40}px` }}
                >
                  {index * 40}
                </span>
              ))}
            </div>
            <div className={styles.leftRuler} aria-hidden>
              {Array.from({ length: Math.floor(stageHeight / 40) + 1 }).map((_, index) => (
                <span
                  key={`left-${index}`}
                  className={`${styles.rulerMark} ${styles.rulerMarkVertical}`}
                  style={{ top: `${index * 40}px` }}
                >
                  {index * 40}
                </span>
              ))}
            </div>
            <div className={styles.stageGrid} aria-hidden />
            <AlignmentGuides guides={guides} />
            {/* Container drop zone highlight */}
            {hoveredContainerId ? (() => {
              const hc = visibleNodes.find((n) => n.id === hoveredContainerId);
              const rect = hc ? absoluteRectById.get(hc.id) ?? resolveViewportRect(hc, geometryViewport) : null;
              if (!hc || !rect) return null;
              return (
                <div
                  key="container-drop-highlight"
                  style={{
                    position: 'absolute',
                    left: `${rect.x}px`,
                    top: `${rect.y}px`,
                    width: `${rect.width}px`,
                    height: `${rect.height}px`,
                    border: '2px dashed #116dff',
                    borderRadius: 8,
                    background: 'rgba(17, 109, 255, 0.08)',
                    pointerEvents: 'none',
                    zIndex: 9990,
                    transition: 'all 120ms ease',
                  }}
                />
              );
            })() : null}
            {rootVisibleNodes.map((node) => (
              <CanvasNode
                key={node.id}
                node={node}
                selected={selectedNodeIds.includes(node.id)}
                onSelect={(nodeId, additive) => {
                  if (additive) {
                    toggleNodeSelection(nodeId);
                    return;
                  }
                  setSelectedNodeId(nodeId);
                }}
                onContextMenu={(nodeId, event) => {
                  setOverlapPicker(null);
                  const keepMultiSelection = selectedNodeIds.length > 1 && selectedNodeIds.includes(nodeId);
                  if (!keepMultiSelection) {
                    setSelectedNodeId(nodeId);
                  }
                  const position = resolveContextMenuPosition(event.clientX, event.clientY);
                  setContextMenu({
                    nodeId,
                    x: position.x,
                    y: position.y,
                  });
                }}
                onOpenAssetLibrary={onRequestAssetLibrary}
                onUpdateContent={(nodeId, content) => {
                  updateNodeContent(nodeId, content, 'commit');
                }}
                onInlineEditingChange={handleInlineEditingChange}
                onMoveStart={(nodeId, event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setContextMenu(null);
                  setOverlapPicker((current) => (current?.mode === 'list' ? null : current));
                  const nodeIds = selectedNodeIds.includes(nodeId) && selectedNodeIds.length > 0
                    ? selectedNodeIds.filter((selectedId) => !nodes.find((candidate) => candidate.id === selectedId)?.locked)
                    : [nodeId];
                  if (nodeIds.length === 0) return;
                  const interactionViewport = currentViewport;
                  const startRects = Object.fromEntries(
                    nodes
                      .filter((node) => nodeIds.includes(node.id))
                      .map((node) => [node.id, resolveViewportRect(node, interactionViewport)]),
                  );
                  const startAbsoluteRects = Object.fromEntries(
                    nodes
                      .filter((node) => nodeIds.includes(node.id))
                      .map((node) => [node.id, absoluteRectById.get(node.id) ?? resolveViewportRect(node, interactionViewport)]),
                  );
                  setSelectedNodeIds(nodeIds, nodeId);
                  setActiveViewport(interactionViewport);
                  interactionGeometrySnapshotRef.current = captureInteractionGeometry();
                  beginMutationSession();
                  setInteractionPointer({
                    x: event.clientX - (viewportRef.current?.getBoundingClientRect().left ?? 0),
                    y: event.clientY - (viewportRef.current?.getBoundingClientRect().top ?? 0),
                  });
                  setInteraction({
                    type: 'move',
                    nodeId,
                    nodeIds,
                    viewport: interactionViewport,
                    pointerId: event.pointerId,
                    originX: event.clientX,
                    originY: event.clientY,
                    startParentId: nodesById.get(nodeId)?.parentId ?? null,
                    startRects,
                    startAbsoluteRects,
                  });
                }}
                onResizeStart={(nodeId, handle, event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setOverlapPicker(null);
                  const targetNode = nodesById.get(nodeId);
                  if (!targetNode) return;
                  const interactionViewport = currentViewport;
                  setSelectedNodeId(nodeId);
                  setActiveViewport(interactionViewport);
                  interactionGeometrySnapshotRef.current = captureInteractionGeometry();
                  beginMutationSession();
                  setInteractionPointer({
                    x: event.clientX - (viewportRef.current?.getBoundingClientRect().left ?? 0),
                    y: event.clientY - (viewportRef.current?.getBoundingClientRect().top ?? 0),
                  });
                  setInteraction({
                    type: 'resize',
                    nodeId,
                    handle,
                    viewport: interactionViewport,
                    pointerId: event.pointerId,
                    originX: event.clientX,
                    originY: event.clientY,
                    startRect: resolveViewportRect(targetNode, interactionViewport),
                    startAbsoluteRect: absoluteRectById.get(nodeId) ?? resolveViewportRect(targetNode, interactionViewport),
                  });
                }}
              />
            ))}
            {selectionBoxRect ? <SelectionBox {...selectionBoxRect} /> : null}
            {rootVisibleNodes.length === 0 ? (
              <div className={styles.emptyCanvas}>
                <strong>요소를 드래그해서 추가하세요</strong>
                <span>Text, image, button, heading, container, section 을 자유 캔버스에 바로 배치할 수 있습니다.</span>
              </div>
            ) : null}

            <div className={styles.canvasToolbar}>
              <button
                type="button"
                className={styles.toolbarButton}
                title="실행 취소 (Cmd-Z)"
                onClick={() => {
                  setContextMenu(null);
                  handleUndo();
                }}
                disabled={!canUndo}
              >
                Undo
              </button>
              <button
                type="button"
                className={styles.toolbarButton}
                title="다시 실행 (Cmd-Shift-Z)"
                onClick={() => {
                  setContextMenu(null);
                  handleRedo();
                }}
                disabled={!canRedo}
              >
                Redo
              </button>
            </div>
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

        {selectionBboxScreen && !contextMenu && !inlineEditingNodeId ? (
          <SelectionToolbar
            selectedNodes={selectedNodes}
            bbox={selectionBboxScreen}
            onEditText={() => {
              if (typeof document !== 'undefined' && selectedNodes[0]) {
                document.dispatchEvent(
                  new CustomEvent('builder:start-text-edit', { detail: { nodeId: selectedNodes[0].id } }),
                );
              }
            }}
            onReplaceImage={() => {
              if (selectedNodes[0] && onRequestAssetLibrary) {
                onRequestAssetLibrary(selectedNodes[0].id);
              }
            }}
            onEditLink={() => {
              focusSelectedLinkInput();
            }}
            showEditLink={Boolean(selectedLinkTargetNode)}
            linkTargetNode={selectedLinkTargetNode}
            onChangeLink={updateSelectedLink}
            linkPickerContext={linkPickerContext}
            linkPopoverOpen={selectionLinkPopoverOpen}
            onLinkPopoverChange={setSelectionLinkPopoverOpen}
            onDuplicate={handleDuplicate}
            onDelete={deleteSelectedNode}
            onBringForward={bringSelectedNodeForward}
            onSendBackward={sendSelectedNodeBackward}
            onOpenMoreMenu={(event) => {
              if (selectedNodes[0]) {
                setOverlapPicker(null);
                const position = resolveContextMenuPosition(event.clientX, event.clientY);
                setContextMenu({
                  nodeId: selectedNodes[0].id,
                  x: position.x,
                  y: position.y,
                });
              }
            }}
          />
        ) : null}

        {overlapPicker ? (() => {
          const candidateNodes = overlapPicker.nodeIds
            .map((nodeId) => nodesById.get(nodeId))
            .filter((node): node is BuilderCanvasNode => Boolean(node));
          if (candidateNodes.length < 2) return null;

          if (overlapPicker.mode === 'hint') {
            return (
              <button
                type="button"
                className={styles.overlapHint}
                style={{ left: `${overlapPicker.x}px`, top: `${overlapPicker.y}px` }}
                title="Choose from overlapping layers"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={() => {
                  setOverlapPicker((current) => (current ? { ...current, mode: 'list' } : current));
                }}
              >
                {candidateNodes.length} layers
              </button>
            );
          }

          return (
            <div
              className={styles.overlapPicker}
              style={{ left: `${overlapPicker.x}px`, top: `${overlapPicker.y}px` }}
              role="dialog"
              aria-label="Overlapping layers"
              onPointerDown={(event) => event.stopPropagation()}
            >
              <div className={styles.overlapPickerHeader}>
                <div>
                  <span>Overlapping</span>
                  <strong>{candidateNodes.length} layers</strong>
                </div>
                <button
                  type="button"
                  className={styles.overlapPickerClose}
                  title="Close"
                  onClick={() => setOverlapPicker(null)}
                >
                  x
                </button>
              </div>
              <div className={styles.overlapPickerList}>
                {candidateNodes.map((node) => (
                  <button
                    key={node.id}
                    type="button"
                    className={[
                      styles.overlapPickerItem,
                      selectedNodeIds.includes(node.id) ? styles.overlapPickerItemSelected : '',
                    ].filter(Boolean).join(' ')}
                    title={node.id}
                    onClick={(event) => {
                      if (event.metaKey || event.ctrlKey || event.shiftKey) {
                        toggleNodeSelection(node.id);
                      } else {
                        setSelectedNodeId(node.id);
                      }
                      setOverlapPicker(null);
                    }}
                  >
                    <span>{node.kind}</span>
                    <strong>{getCanvasNodeLabel(node)}</strong>
                    <small>z {node.zIndex}</small>
                  </button>
                ))}
              </div>
            </div>
          );
        })() : null}

        {contextMenu ? (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            title={contextMenuTitle}
            actions={[
              {
                key: 'edit-text',
                label: '텍스트 편집',
                title: '인라인 텍스트 편집 (또는 더블클릭)',
                disabled:
                  contextSelectionCount !== 1 ||
                  (contextPrimaryNode?.kind !== 'text' && contextPrimaryNode?.kind !== 'heading') ||
                  Boolean(contextPrimaryNode?.locked),
                onSelect: () => {
                  setContextMenu(null);
                  if (typeof document !== 'undefined' && contextPrimaryNode) {
                    document.dispatchEvent(
                      new CustomEvent('builder:start-text-edit', {
                        detail: { nodeId: contextPrimaryNode.id },
                      }),
                    );
                  }
                },
              },
              {
                key: 'image-edit',
                label: 'Crop / Filter / Alt...',
                title: '이미지 자르기, 필터, alt 텍스트 편집',
                disabled:
                  contextSelectionCount !== 1 ||
                  contextPrimaryNode?.kind !== 'image' ||
                  Boolean(contextPrimaryNode?.locked) ||
                  !onRequestImageEditor,
                onSelect: () => {
                  setContextMenu(null);
                  if (contextPrimaryNode && onRequestImageEditor) {
                    onRequestImageEditor(contextPrimaryNode.id, 'crop');
                  }
                },
              },
              {
                key: 'replace-image',
                label: '이미지 교체',
                title: '에셋 라이브러리 열기',
                disabled:
                  contextSelectionCount !== 1 ||
                  contextPrimaryNode?.kind !== 'image' ||
                  Boolean(contextPrimaryNode?.locked),
                onSelect: () => {
                  setContextMenu(null);
                  if (contextPrimaryNode && onRequestAssetLibrary) {
                    onRequestAssetLibrary(contextPrimaryNode.id);
                  }
                },
              },
              {
                key: 'edit-alt',
                label: 'Alt 텍스트 편집',
                title: '이미지 alt 텍스트 편집',
                disabled:
                  contextSelectionCount !== 1 ||
                  contextPrimaryNode?.kind !== 'image' ||
                  Boolean(contextPrimaryNode?.locked) ||
                  !onRequestImageEditor,
                onSelect: () => {
                  setContextMenu(null);
                  if (contextPrimaryNode && onRequestImageEditor) {
                    onRequestImageEditor(contextPrimaryNode.id, 'alt');
                  }
                },
              },
              {
                key: 'edit-link',
                label: (() => {
                  const value = selectedLinkTargetNode
                    ? linkValueFromLegacy((selectedLinkTargetNode.content as Parameters<typeof linkValueFromLegacy>[0]) || {})
                    : null;
                  if (value?.href) {
                    const trimmed = value.href.trim();
                    const preview = trimmed.length > 20 ? `${trimmed.slice(0, 18)}…` : trimmed;
                    return `링크 편집 — ${preview}`;
                  }
                  return '링크 편집';
                })(),
                title: '링크 편집 (Cmd+K)',
                shortcut: '⌘K',
                disabled:
                  selectedNodeIds.length !== 1 ||
                  !selectedLinkTargetNode ||
                  Boolean(selectedNodes[0]?.locked) ||
                  Boolean(selectedLinkTargetNode.locked),
                onSelect: () => {
                  setContextMenu(null);
                  focusSelectedLinkInput();
                },
              },
              {
                key: 'remove-link',
                label: '링크 제거',
                title: '현재 링크 제거',
                disabled: (() => {
                  if (!selectedLinkTargetNode || selectedLinkTargetNode.locked) return true;
                  const value = linkValueFromLegacy(
                    (selectedLinkTargetNode.content as Parameters<typeof linkValueFromLegacy>[0]) || {},
                  );
                  return !value?.href;
                })(),
                onSelect: () => {
                  setContextMenu(null);
                  if (selectedLinkTargetNode) {
                    updateSelectedLink(selectedLinkTargetNode.id, null);
                  }
                },
              },
              { key: 'sep-clipboard', label: '', separator: true },
              {
                key: 'copy',
                label: 'Copy',
                shortcut: '⌘C',
                title: '복사 (Cmd-C)',
                disabled: selectedNodeIds.length === 0,
                onSelect: handleCopy,
              },
              {
                key: 'cut',
                label: 'Cut',
                shortcut: '⌘X',
                title: '잘라내기 (Cmd-X)',
                disabled: !hasUnlockedSelection,
                onSelect: handleCut,
              },
              {
                key: 'paste',
                label: 'Paste',
                shortcut: '⌘V',
                title: '붙여넣기 (Cmd-V)',
                disabled: !clipboardHasContent,
                onSelect: handlePaste,
              },
              {
                key: 'duplicate',
                label: 'Duplicate',
                shortcut: '⌘D',
                title: '복제 (Cmd-D)',
                disabled: !hasUnlockedSelection,
                onSelect: handleDuplicate,
              },
              {
                key: 'paste-style',
                label: 'Paste style',
                shortcut: '⌥⇧⌘V',
                title: 'Coming soon — Codex F-track',
                disabled: true,
              },
              {
                key: 'copy-style',
                label: 'Copy style',
                shortcut: '⌥⌘C',
                title: 'Coming soon — Codex F-track',
                disabled: true,
              },
              { key: 'sep-arrange', label: '', separator: true },
              {
                key: 'bring-front',
                label: 'Bring to front',
                shortcut: '⇧⌘]',
                title: '맨 앞으로 가져오기',
                disabled: selectedNodeIds.length !== 1 || !hasUnlockedSelection,
                onSelect: bringSelectedNodeToFront,
              },
              {
                key: 'bring-forward',
                label: 'Bring forward',
                shortcut: '⌘]',
                title: '한 단계 앞으로',
                disabled: selectedNodeIds.length !== 1 || !hasUnlockedSelection,
                onSelect: bringSelectedNodeForward,
              },
              {
                key: 'send-backward',
                label: 'Send backward',
                shortcut: '⌘[',
                title: '한 단계 뒤로',
                disabled: selectedNodeIds.length !== 1 || !hasUnlockedSelection,
                onSelect: sendSelectedNodeBackward,
              },
              {
                key: 'send-back',
                label: 'Send to back',
                shortcut: '⇧⌘[',
                title: '맨 뒤로 보내기',
                disabled: selectedNodeIds.length !== 1 || !hasUnlockedSelection,
                onSelect: sendSelectedNodeToBack,
              },
              {
                key: 'lock',
                label: selectedNodes.every((node) => node.locked) ? 'Unlock selection' : 'Lock selection',
                title: '선택 잠금 토글',
                shortcut: '⌘L',
                disabled: selectedNodeIds.length === 0,
                onSelect: toggleSelectedNodeLock,
              },
              { key: 'sep-align', label: '', separator: true },
              {
                key: 'align-left',
                label: 'Align left',
                title: '왼쪽 정렬',
                disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
                onSelect: () => alignSelectedNodes('left'),
              },
              {
                key: 'align-center',
                label: 'Align center',
                title: '가운데 정렬',
                disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
                onSelect: () => alignSelectedNodes('center'),
              },
              {
                key: 'align-right',
                label: 'Align right',
                title: '오른쪽 정렬',
                disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
                onSelect: () => alignSelectedNodes('right'),
              },
              {
                key: 'align-top',
                label: 'Align top',
                title: '상단 정렬',
                disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
                onSelect: () => alignSelectedNodes('top'),
              },
              {
                key: 'align-middle',
                label: 'Align middle',
                title: '중앙 정렬',
                disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
                onSelect: () => alignSelectedNodes('middle'),
              },
              {
                key: 'align-bottom',
                label: 'Align bottom',
                title: '하단 정렬',
                disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
                onSelect: () => alignSelectedNodes('bottom'),
              },
              { key: 'sep-distribute', label: '', separator: true, onSelect: () => {} },
              {
                key: 'distribute-horizontal',
                label: 'Distribute horizontally',
                title: '가로 균등 분배 (3개 이상)',
                disabled: selectedNodeIds.length < 3 || !hasUnlockedSelection,
                onSelect: () => distributeSelectedNodes('horizontal'),
              },
              {
                key: 'distribute-vertical',
                label: 'Distribute vertically',
                title: '세로 균등 분배 (3개 이상)',
                disabled: selectedNodeIds.length < 3 || !hasUnlockedSelection,
                onSelect: () => distributeSelectedNodes('vertical'),
              },
              {
                key: 'match-width',
                label: 'Match width',
                title: '선택 요소 너비 동일화',
                disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
                onSelect: () => matchSelectedNodesSize('width'),
              },
              {
                key: 'match-height',
                label: 'Match height',
                title: '선택 요소 높이 동일화',
                disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
                onSelect: () => matchSelectedNodesSize('height'),
              },
              { key: 'sep-state', label: '', separator: true },
              {
                key: 'hide-on-viewport',
                label: 'Hide on viewport',
                title: '현재 선택을 특정 viewport에서 숨깁니다',
                disabled: selectedNodeIds.length !== 1 || !hasUnlockedSelection,
                children: [
                  {
                    key: 'hide-desktop',
                    label: 'Hide on desktop',
                    onSelect: () => {
                      if (!selectedNodes[0]) return;
                      updateNode(selectedNodes[0].id, (node) => ({ ...node, visible: false }));
                    },
                  },
                  {
                    key: 'hide-tablet',
                    label: 'Hide on tablet',
                    onSelect: () => {
                      if (!selectedNodes[0]) return;
                      updateResponsiveOverride(selectedNodes[0].id, 'tablet', { hidden: true });
                    },
                  },
                  {
                    key: 'hide-mobile',
                    label: 'Hide on mobile',
                    onSelect: () => {
                      if (!selectedNodes[0]) return;
                      updateResponsiveOverride(selectedNodes[0].id, 'mobile', { hidden: true });
                    },
                  },
                ],
              },
              {
                key: 'pin-to-screen',
                label: 'Pin to screen',
                title: 'Coming soon — Codex F-track',
                disabled: true,
              },
              {
                key: 'anchor-link',
                label: 'Anchor link...',
                title: 'Use the Layout tab to edit anchor name',
                disabled: true,
              },
              {
                key: 'animations',
                label: 'Animations...',
                title: 'Open the Animations tab in the inspector',
                disabled: true,
              },
              {
                key: 'effects',
                label: 'Effects...',
                title: 'Coming soon — Codex F-track',
                disabled: true,
              },
              { key: 'sep-pages', label: '', separator: true, onSelect: () => {} },
              {
                key: 'move-to-page',
                label: 'Move to page...',
                title: '다른 페이지로 이동',
                disabled: selectedNodeIds.length === 0 || !hasUnlockedSelection || !onRequestMoveToPage,
                onSelect: () => {
                  if (onRequestMoveToPage) {
                    onRequestMoveToPage(selectedNodeIds);
                  }
                },
              },
              {
                key: 'save-as-section',
                label: 'Save as section...',
                title: '컨테이너 + 자식을 라이브러리에 저장 (재사용)',
                disabled:
                  selectedNodeIds.length !== 1 ||
                  !selectedNodes[0] ||
                  !isContainerLikeKind(selectedNodes[0].kind) ||
                  !onRequestSaveAsSection,
                onSelect: () => {
                  setContextMenu(null);
                  if (onRequestSaveAsSection && selectedNodes[0]) {
                    onRequestSaveAsSection(selectedNodes[0].id);
                  }
                },
              },
              {
                key: 'add-to-library',
                label: 'Add to library',
                title: 'Coming soon — Codex F-track',
                disabled: true,
              },
              {
                key: 'convert-to-component',
                label: 'Convert to component',
                title: 'Coming soon — Codex F-track',
                disabled: true,
              },
              {
                key: 'style-override',
                label: 'Style override',
                title: 'Coming soon — Codex F-track',
                disabled: true,
                children: [
                  { key: 'override-fill', label: 'Fill override', disabled: true, title: 'Coming soon — Codex F-track' },
                  { key: 'override-typography', label: 'Typography override', disabled: true, title: 'Coming soon — Codex F-track' },
                  { key: 'override-effects', label: 'Effects override', disabled: true, title: 'Coming soon — Codex F-track' },
                ],
              },
              {
                key: 'reset-style',
                label: 'Reset style',
                title: 'Coming soon — Codex F-track',
                disabled: true,
              },
              { key: 'sep-group', label: '', separator: true, onSelect: () => {} },
              {
                key: 'group',
                label: 'Group',
                title: '그룹 만들기 (2개 이상)',
                shortcut: 'Cmd+G',
                disabled: selectedNodeIds.length < 2 || !hasUnlockedSelection,
                onSelect: groupSelectedNodes,
              },
              {
                key: 'ungroup',
                label: 'Ungroup',
                title: '그룹 해제',
                shortcut: 'Cmd+Shift+G',
                disabled:
                  selectedNodeIds.length !== 1 ||
                  selectedNodes[0]?.kind !== 'container' ||
                  (selectedNodes[0]?.id ? (childrenMap[selectedNodes[0].id]?.length ?? 0) === 0 : true),
                onSelect: ungroupSelectedNode,
              },
              { key: 'sep-danger', label: '', separator: true },
              {
                key: 'delete',
                label: 'Delete',
                shortcut: '⌫',
                title: '삭제 (Delete)',
                tone: 'danger',
                disabled: !hasUnlockedSelection,
                onSelect: deleteSelectedNode,
              },
            ]}
            onClose={() => setContextMenu(null)}
          />
        ) : null}
      </div>

      <div className={styles.zoomDock}>
        <button
          type="button"
          className={styles.toolbarButton}
          title="축소 (Cmd--)"
          onClick={() => setZoomState((currentState) => stepZoomOut(currentState))}
        >
          -
        </button>
        <span className={styles.zoomLabel}>{zoomLabel(zoomState)}</span>
        <input
          className={styles.zoomSlider}
          type="range"
          min={25}
          max={400}
          step={5}
          value={Math.round(zoomState.zoom * 100)}
          onChange={(event) => setZoomState((currentState) => zoomTo(currentState, Number(event.target.value) / 100))}
        />
        <button
          type="button"
          className={styles.toolbarButton}
          title="확대 (Cmd-+)"
          onClick={() => setZoomState((currentState) => stepZoomIn(currentState))}
        >
          +
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          title="100%"
          onClick={() => setZoomState((currentState) => zoomTo(currentState, 1))}
        >
          100%
        </button>
        <button
          type="button"
          className={styles.toolbarButton}
          title="화면에 맞추기"
          onClick={fitCanvas}
        >
          Fit
        </button>
      </div>
    </div>
  );
}
