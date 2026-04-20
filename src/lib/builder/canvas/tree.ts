import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

export function buildChildrenMap(nodes: BuilderCanvasNode[]): Record<string, string[]> {
  const childrenMap: Record<string, string[]> = {};
  const orderedNodes = [...nodes].sort((left, right) => left.zIndex - right.zIndex);

  for (const node of orderedNodes) {
    if (!node.parentId) continue;
    if (!childrenMap[node.parentId]) {
      childrenMap[node.parentId] = [];
    }
    childrenMap[node.parentId].push(node.id);
  }

  return childrenMap;
}

export function resolveCanvasNodeAbsoluteRect(
  node: BuilderCanvasNode,
  nodesById: Map<string, BuilderCanvasNode>,
  seen = new Set<string>(),
): BuilderCanvasNode['rect'] {
  if (!node.parentId || seen.has(node.id)) {
    return { ...node.rect };
  }

  const parentNode = nodesById.get(node.parentId);
  if (!parentNode) {
    return { ...node.rect };
  }

  seen.add(node.id);
  const parentRect = resolveCanvasNodeAbsoluteRect(parentNode, nodesById, seen);
  seen.delete(node.id);

  return {
    ...node.rect,
    x: parentRect.x + node.rect.x,
    y: parentRect.y + node.rect.y,
  };
}

export function resolveCanvasNodeLocalRect(
  rect: BuilderCanvasNode['rect'],
  parentRect: BuilderCanvasNode['rect'] | null,
): BuilderCanvasNode['rect'] {
  if (!parentRect) return { ...rect };
  return {
    ...rect,
    x: rect.x - parentRect.x,
    y: rect.y - parentRect.y,
  };
}

export function getCanvasNodeDescendantIds(
  nodeId: string,
  childrenMap: Record<string, string[]>,
): string[] {
  const descendants: string[] = [];
  const stack = [...(childrenMap[nodeId] ?? [])];

  while (stack.length > 0) {
    const childId = stack.pop();
    if (!childId) continue;
    descendants.push(childId);
    const grandChildren = childrenMap[childId];
    if (grandChildren) {
      stack.push(...grandChildren);
    }
  }

  return descendants;
}

export function isCanvasNodeAncestor(
  ancestorId: string,
  nodeId: string,
  nodesById: Map<string, BuilderCanvasNode>,
): boolean {
  const visited = new Set<string>();
  let currentNode = nodesById.get(nodeId);

  while (currentNode?.parentId) {
    if (visited.has(currentNode.id)) return false;
    if (currentNode.parentId === ancestorId) return true;
    visited.add(currentNode.id);
    currentNode = nodesById.get(currentNode.parentId);
  }

  return false;
}
