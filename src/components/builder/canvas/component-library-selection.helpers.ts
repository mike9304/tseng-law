import { getCanvasNodeDescendantIds } from '@/lib/builder/canvas/tree';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';

export interface ComponentLibrarySelectionSnapshot {
  readonly canvasDocument: BuilderCanvasDocument | null;
  readonly selectedNodeIds: readonly string[];
  readonly childrenMap: Record<string, string[]>;
  readonly selectedNodeJson: string | undefined;
}

export function serializeComponentLibrarySelection(snapshot: ComponentLibrarySelectionSnapshot): string {
  const { canvasDocument, selectedNodeIds, childrenMap, selectedNodeJson } = snapshot;
  if (selectedNodeJson) return selectedNodeJson;
  if (!canvasDocument || selectedNodeIds.length === 0) return '';
  const ids = new Set<string>();
  for (const nodeId of selectedNodeIds) {
    ids.add(nodeId);
    for (const descendantId of getCanvasNodeDescendantIds(nodeId, childrenMap)) {
      ids.add(descendantId);
    }
  }
  const nodes = canvasDocument.nodes.filter((node) => ids.has(node.id));
  if (nodes.length === 0) return '';
  return JSON.stringify({
    rootNodeId: selectedNodeIds[0] ?? nodes[0]?.id,
    rootNodeIds: selectedNodeIds,
    nodes,
  });
}
