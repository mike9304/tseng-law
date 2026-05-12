'use client';

import { useEffect, type Dispatch, type SetStateAction } from 'react';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import { createShortcutHandler, NUDGE_LARGE_PX, NUDGE_PX, type CanvasAction } from '@/lib/builder/canvas/shortcuts';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { ZoomState } from '@/lib/builder/canvas/zoom';
import { zoomIn as stepZoomIn, zoomOut as stepZoomOut } from '@/lib/builder/canvas/zoom';

type UseCanvasKeyboardShortcutsArgs = {
  bringSelectedNodeForward: () => void;
  bringSelectedNodeToFront: () => void;
  deleteSelectedNode: () => void;
  exitGroup: () => void;
  fitCanvas: () => void;
  focusSelectedLinkInput: () => void;
  groupSelectedNodes: () => void;
  handleCopy: () => void;
  handleCopyStyle: () => void;
  handleCut: () => void;
  handleDuplicate: () => void;
  handlePaste: () => void;
  handlePasteStyle: () => void;
  handleRedo: () => void;
  handleUndo: () => void;
  nudgeSelectedNode: (deltaX: number, deltaY: number) => void;
  selectedLinkTargetNode: BuilderCanvasNode | null;
  sendSelectedNodeBackward: () => void;
  sendSelectedNodeToBack: () => void;
  setContextMenu: (value: null) => void;
  setOverlapPicker: (value: null) => void;
  setSelectedNodeIds: (nodeIds: string[], primaryNodeId?: string | null) => void;
  setZoomState: Dispatch<SetStateAction<ZoomState>>;
  toggleGrid: () => void;
  ungroupSelectedNode: () => void;
};

export function useCanvasKeyboardShortcuts({
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
  toggleGrid,
  ungroupSelectedNode,
}: UseCanvasKeyboardShortcutsArgs) {
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
        case 'copyStyle':
          handleCopyStyle();
          break;
        case 'paste':
          handlePaste();
          break;
        case 'pasteStyle':
          handlePasteStyle();
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
        case 'toggleGrid':
          toggleGrid();
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
    toggleGrid,
    ungroupSelectedNode,
  ]);
}
