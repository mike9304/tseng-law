'use client';

import {
  getCanvasNodeLabel,
  type OverlapPickerState,
} from '@/components/builder/canvas/canvasInteraction';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import styles from './SandboxPage.module.css';

type CanvasOverlapPickerLayerProps = {
  nodesById: Map<string, BuilderCanvasNode>;
  overlapPicker: OverlapPickerState | null;
  selectedNodeIds: string[];
  setOverlapPicker: (picker: OverlapPickerState | null | ((current: OverlapPickerState | null) => OverlapPickerState | null)) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  toggleNodeSelection: (nodeId: string) => void;
};

export default function CanvasOverlapPickerLayer({
  nodesById,
  overlapPicker,
  selectedNodeIds,
  setOverlapPicker,
  setSelectedNodeId,
  toggleNodeSelection,
}: CanvasOverlapPickerLayerProps) {
  if (!overlapPicker) return null;
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
}
