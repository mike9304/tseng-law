'use client';

import { memo, useCallback, type MouseEvent } from 'react';
import SelectionToolbar from '@/components/builder/canvas/SelectionToolbar';
import type { LinkPickerContext } from '@/components/builder/editor/LinkPicker';
import type { LinkValue } from '@/lib/builder/links';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';

type SelectionBboxScreen = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type CanvasSelectionToolbarLayerProps = {
  bringSelectedNodeForward: () => void;
  contextMenuOpen: boolean;
  deleteSelectedNode: () => void;
  focusSelectedLinkInput: () => void;
  inlineEditingNodeId: string | null;
  linkPickerContext: LinkPickerContext;
  onRequestAssetLibrary?: (nodeId: string) => void;
  resolveContextMenuPosition: (clientX: number, clientY: number) => { x: number; y: number };
  selectedLinkTargetNode: BuilderCanvasNode | null;
  selectedNodes: BuilderCanvasNode[];
  selectionBboxScreen: SelectionBboxScreen | null;
  selectionLinkPopoverOpen: boolean;
  sendSelectedNodeBackward: () => void;
  setContextMenu: (menu: { nodeId: string; x: number; y: number } | null) => void;
  setOverlapPicker: (picker: null) => void;
  setSelectionLinkPopoverOpen: (open: boolean) => void;
  updateSelectedLink: (nodeId: string, link: LinkValue | null) => void;
  handleDuplicate: () => void;
  locale?: Locale;
};

function CanvasSelectionToolbarLayer({
  bringSelectedNodeForward,
  contextMenuOpen,
  deleteSelectedNode,
  focusSelectedLinkInput,
  inlineEditingNodeId,
  linkPickerContext,
  onRequestAssetLibrary,
  resolveContextMenuPosition,
  selectedLinkTargetNode,
  selectedNodes,
  selectionBboxScreen,
  selectionLinkPopoverOpen,
  sendSelectedNodeBackward,
  setContextMenu,
  setOverlapPicker,
  setSelectionLinkPopoverOpen,
  updateSelectedLink,
  handleDuplicate,
  locale,
}: CanvasSelectionToolbarLayerProps) {
  const selectedPrimaryNodeId = selectedNodes[0]?.id ?? null;
  const handleEditText = useCallback(() => {
    if (typeof document !== 'undefined' && selectedPrimaryNodeId) {
      document.dispatchEvent(
        new CustomEvent('builder:start-text-edit', { detail: { nodeId: selectedPrimaryNodeId } }),
      );
    }
  }, [selectedPrimaryNodeId]);
  const handleReplaceImage = useCallback(() => {
    if (selectedPrimaryNodeId && onRequestAssetLibrary) {
      onRequestAssetLibrary(selectedPrimaryNodeId);
    }
  }, [onRequestAssetLibrary, selectedPrimaryNodeId]);
  const handleEditLink = useCallback(() => {
    focusSelectedLinkInput();
  }, [focusSelectedLinkInput]);
  const handleOpenMoreMenu = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    if (!selectedPrimaryNodeId) return;
    setOverlapPicker(null);
    const position = resolveContextMenuPosition(event.clientX, event.clientY);
    setContextMenu({
      nodeId: selectedPrimaryNodeId,
      x: position.x,
      y: position.y,
    });
  }, [
    resolveContextMenuPosition,
    selectedPrimaryNodeId,
    setContextMenu,
    setOverlapPicker,
  ]);

  if (!selectionBboxScreen || contextMenuOpen || inlineEditingNodeId) return null;

  return (
    <SelectionToolbar
      selectedNodes={selectedNodes}
      bbox={selectionBboxScreen}
      onEditText={handleEditText}
      onReplaceImage={handleReplaceImage}
      onEditLink={handleEditLink}
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
      onOpenMoreMenu={handleOpenMoreMenu}
      locale={locale}
    />
  );
}

export default memo(CanvasSelectionToolbarLayer);
