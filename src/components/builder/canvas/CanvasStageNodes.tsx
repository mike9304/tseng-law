'use client';

import CanvasNode from '@/components/builder/canvas/CanvasNode';
import SelectionBox from '@/components/builder/canvas/SelectionBox';
import type { ContextMenuState, OverlapPickerState } from '@/components/builder/canvas/canvasInteraction';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import styles from './SandboxPage.module.css';

type SelectionBoxRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type CanvasStageNodesProps = {
  handleInlineEditingChange: (nodeId: string, editing: boolean) => void;
  onRequestAssetLibrary?: (nodeId: string) => void;
  resolveContextMenuPosition: (clientX: number, clientY: number) => { x: number; y: number };
  rootVisibleNodes: BuilderCanvasNode[];
  selectedNodeIds: string[];
  selectionBoxRect: SelectionBoxRect | null;
  setContextMenu: (menu: ContextMenuState | null) => void;
  setOverlapPicker: (picker: OverlapPickerState | null | ((current: OverlapPickerState | null) => OverlapPickerState | null)) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  startMove: (nodeId: string, event: React.PointerEvent) => void;
  startResize: Parameters<typeof CanvasNode>[0]['onResizeStart'];
  toggleNodeSelection: (nodeId: string) => void;
  updateNodeContent: (nodeId: string, content: Record<string, unknown>, mode?: 'commit' | 'transient') => void;
};

export default function CanvasStageNodes({
  handleInlineEditingChange,
  onRequestAssetLibrary,
  resolveContextMenuPosition,
  rootVisibleNodes,
  selectedNodeIds,
  selectionBoxRect,
  setContextMenu,
  setOverlapPicker,
  setSelectedNodeId,
  startMove,
  startResize,
  toggleNodeSelection,
  updateNodeContent,
}: CanvasStageNodesProps) {
  return (
    <>
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
          onMoveStart={startMove}
          onResizeStart={startResize}
        />
      ))}
      {selectionBoxRect ? <SelectionBox {...selectionBoxRect} /> : null}
      {rootVisibleNodes.length === 0 ? (
        <div className={styles.emptyCanvas}>
          <strong>요소를 드래그해서 추가하세요</strong>
          <span>Text, image, button, heading, container, section 을 자유 캔버스에 바로 배치할 수 있습니다.</span>
        </div>
      ) : null}
    </>
  );
}
