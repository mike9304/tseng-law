import { resolveViewportRect, type Viewport } from '@/lib/builder/canvas/responsive';
import { isContainerLikeKind } from '@/lib/builder/canvas/types';
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

/**
 * Returns the layoutMode of the node's direct parent container (if any).
 * Used to determine whether children participate in flex/grid flow vs absolute.
 * Mirrors the computation in CanvasNode.tsx and public-page.tsx.
 */
export function getParentLayoutMode(
  node: BuilderCanvasNode,
  nodesById: Map<string, BuilderCanvasNode>,
): 'absolute' | 'flex' | 'grid' | undefined {
  if (!node.parentId) return undefined;
  const parent = nodesById.get(node.parentId);
  if (!parent || !isContainerLikeKind(parent.kind)) return undefined;
  const content = parent.content as { layoutMode?: 'absolute' | 'flex' | 'grid' } | undefined;
  return content?.layoutMode ?? 'absolute';
}

/**
 * Returns true if this node's direct parent container uses flex or grid layout.
 * In that case, the node's rect.x / rect.y (including responsive overrides)
 * should NOT be used as positioning offsets — layout is driven by the
 * parent's flex/grid rules + DOM order. This is the core guard for M177
 * responsive-in-flow fixes.
 */
export function parentUsesFlowLayout(
  node: BuilderCanvasNode,
  nodesById: Map<string, BuilderCanvasNode>,
): boolean {
  const mode = getParentLayoutMode(node, nodesById);
  return mode === 'flex' || mode === 'grid';
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

  const usesFlow = parentUsesFlowLayout(node, nodesById);
  const localX = usesFlow ? 0 : node.rect.x;
  const localY = usesFlow ? 0 : node.rect.y;

  return {
    x: parentRect.x + localX,
    y: parentRect.y + localY,
    width: node.rect.width,
    height: node.rect.height,
  };
}

export function resolveCanvasNodeAbsoluteRectForViewport(
  node: BuilderCanvasNode,
  nodesById: Map<string, BuilderCanvasNode>,
  viewport: Viewport,
  seen = new Set<string>(),
): BuilderCanvasNode['rect'] {
  const nodeRect = resolveViewportRect(node, viewport);
  if (!node.parentId || seen.has(node.id)) {
    return { ...nodeRect };
  }

  const parentNode = nodesById.get(node.parentId);
  if (!parentNode) {
    return { ...nodeRect };
  }

  seen.add(node.id);
  const parentRect = resolveCanvasNodeAbsoluteRectForViewport(parentNode, nodesById, viewport, seen);
  seen.delete(node.id);

  const usesFlow = parentUsesFlowLayout(node, nodesById);
  const localX = usesFlow ? 0 : nodeRect.x;
  const localY = usesFlow ? 0 : nodeRect.y;

  return {
    x: parentRect.x + localX,
    y: parentRect.y + localY,
    width: nodeRect.width,
    height: nodeRect.height,
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
