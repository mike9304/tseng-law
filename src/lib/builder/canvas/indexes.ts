import type { BuilderCanvasNode } from './types';

const nodesByIdCache = new WeakMap<readonly BuilderCanvasNode[], Map<string, BuilderCanvasNode>>();

export function getCanvasNodesById(
  nodes: readonly BuilderCanvasNode[],
): Map<string, BuilderCanvasNode> {
  const cached = nodesByIdCache.get(nodes);
  if (cached) return cached;
  const next = new Map(nodes.map((node) => [node.id, node]));
  nodesByIdCache.set(nodes, next);
  return next;
}
