import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

export function getSelectedCanvasNodes(
  selectedNodeIds: readonly string[],
  nodesById: ReadonlyMap<string, BuilderCanvasNode>,
): BuilderCanvasNode[] {
  const selectedNodes: BuilderCanvasNode[] = [];
  for (const nodeId of selectedNodeIds) {
    const node = nodesById.get(nodeId);
    if (node) selectedNodes.push(node);
  }
  return selectedNodes;
}
