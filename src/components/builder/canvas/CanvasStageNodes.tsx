'use client';

import { Fragment, useMemo } from 'react';

import CanvasNode from '@/components/builder/canvas/CanvasNode';
import SelectionBox from '@/components/builder/canvas/SelectionBox';
import type { ContextMenuState, InteractionState, OverlapPickerState } from '@/components/builder/canvas/canvasInteraction';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  getFlowSiblingInsertionIndex,
  isTopLevelFlowSection,
} from '@/lib/builder/canvas/flow';
import { PREVIEW_GAP_STYLE } from './previewGapStyle';
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
  interaction?: InteractionState | null;
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
  interaction,
}: CanvasStageNodesProps) {
  // Display-sorted root nodes for DOM render order parity with Published.
  // Mirrors exactly the `renderedTopLevelNodes` logic from public-page.tsx:344-353:
  // composites (top-level) first, sorted by rect.y then zIndex; non-composites after.
  // This ensures widgets placed between flow sections stack correctly in Editor (WYSIWYG).
  const sortedRootNodes = useMemo(() => {
    return [...rootVisibleNodes].sort((left, right) => {
      const leftIsComposite = left.kind === 'composite';
      const rightIsComposite = right.kind === 'composite';
      if (leftIsComposite && rightIsComposite) {
        return left.rect.y - right.rect.y || left.zIndex - right.zIndex;
      }
      if (leftIsComposite && !rightIsComposite) return -1;
      if (!leftIsComposite && rightIsComposite) return 1;
      return left.rect.y - right.rect.y || left.zIndex - right.zIndex;
    });
  }, [rootVisibleNodes]);

  // 2-2.1: Live Sibling Reflow Preview — insertion index based visual gap
  // between top-level flow sections (composites) while dragging one.
  const flowSectionNodes = useMemo(
    () => sortedRootNodes.filter((n) => n.kind === 'composite'),
    [sortedRootNodes]
  );
  const flowSectionCount = flowSectionNodes.length;

  const previewGapInfo = useMemo(() => {
    if (interaction?.type !== 'move') return null;
    const draggedId = interaction.nodeId;
    const draggedNode = rootVisibleNodes.find((n) => n.id === draggedId);
    if (!draggedNode || !isTopLevelFlowSection(draggedNode)) return null;
    // Generalized helper (supports both top-level flowGroupKey===null and inner string keys).
    // For top-level we build a minimal nodesById (sufficient since isTopLevel short-circuits parent lookup).
    const nodesById = new Map(rootVisibleNodes.map((n) => [n.id, n] as const));
    const insertionIndex = getFlowSiblingInsertionIndex(rootVisibleNodes, draggedId, nodesById, interaction.viewport);
    return { insertionIndex, draggedId };
  }, [interaction, rootVisibleNodes]);

  // Helper to avoid duplicating the long CanvasNode prop list in split rendering.
  const renderCanvasNode = (node: BuilderCanvasNode) => (
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
      interaction={interaction}
    />
  );

  return (
    <>
      {/* Flow sections (top-level composites) with preview gap inserted at live insertionIndex */}
      {flowSectionNodes.map((node, flowIdx) => {
        const showGapBefore = previewGapInfo !== null && previewGapInfo.insertionIndex === flowIdx;
        return (
          <Fragment key={`flow-${node.id}`}>
            {showGapBefore && (
              <div
                key={`preview-gap-${flowIdx}`}
                style={PREVIEW_GAP_STYLE}
                aria-hidden
                data-preview-gap="flow-section"
              />
            )}
            {renderCanvasNode(node)}
          </Fragment>
        );
      })}
      {/* Gap after the very last flow section (insertion at end) */}
      {previewGapInfo !== null && previewGapInfo.insertionIndex === flowSectionCount && (
        <div
          key="preview-gap-end"
          style={PREVIEW_GAP_STYLE}
          aria-hidden
          data-preview-gap="flow-section"
        />
      )}
      {/* Non-composite root nodes (widgets etc.) rendered after flow sections — unchanged order */}
      {sortedRootNodes.slice(flowSectionCount).map((node) => renderCanvasNode(node))}
      {selectionBoxRect ? <SelectionBox {...selectionBoxRect} /> : null}
      {rootVisibleNodes.length === 0 ? (
        <div className={styles.emptyCanvas}>
          <strong>페이지가 비어있습니다.</strong>
          <span>좌측 + 패널에서 텍스트, 이미지, 섹션을 추가하세요.</span>
        </div>
      ) : null}
    </>
  );
}
