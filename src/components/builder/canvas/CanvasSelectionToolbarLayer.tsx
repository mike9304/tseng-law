'use client';

import SelectionToolbar from '@/components/builder/canvas/SelectionToolbar';
import type { LinkPickerContext } from '@/components/builder/editor/LinkPicker';
import type { LinkValue } from '@/lib/builder/links';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

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
};

export default function CanvasSelectionToolbarLayer({
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
}: CanvasSelectionToolbarLayerProps) {
  if (!selectionBboxScreen || contextMenuOpen || inlineEditingNodeId) return null;

  return (
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
  );
}
