import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

type ResponsiveConfig = BuilderCanvasNode['responsive'];

/**
 * Build a self-contained saved-section snapshot:
 * - only the requested root subtree is retained
 * - the root is detached and stored at local origin
 * - descendants keep their existing parent-local rects and parent links
 */
export function normalizeSavedSectionSnapshot(
  nodes: BuilderCanvasNode[],
  rootNodeId: string,
): BuilderCanvasNode[] {
  const nodesById = new Map<string, BuilderCanvasNode>();
  for (const node of nodes) {
    nodesById.set(node.id, node);
  }

  const root = nodesById.get(rootNodeId);
  if (!root) return [];

  const childrenByParentId = new Map<string, BuilderCanvasNode[]>();
  for (const node of nodes) {
    if (!node.parentId || !nodesById.has(node.parentId) || node.id === node.parentId) {
      continue;
    }
    const children = childrenByParentId.get(node.parentId) ?? [];
    children.push(node);
    childrenByParentId.set(node.parentId, children);
  }

  const reachableIds = new Set<string>();
  const stack = [root];
  while (stack.length > 0) {
    const node = stack.pop();
    if (!node || reachableIds.has(node.id)) continue;
    reachableIds.add(node.id);

    for (const child of childrenByParentId.get(node.id) ?? []) {
      if (!reachableIds.has(child.id)) stack.push(child);
    }
  }

  const ordered = [
    root,
    ...nodes.filter((node) => node.id !== rootNodeId && reachableIds.has(node.id)),
  ];

  return ordered.map((node) => {
    const cloned = structuredClone(node) as BuilderCanvasNode;
    if (node.id === rootNodeId) {
      return {
        ...cloned,
        parentId: undefined,
        rect: {
          ...cloned.rect,
          x: 0,
          y: 0,
        },
        responsive: normalizeRootResponsive(cloned.responsive),
      } as BuilderCanvasNode;
    }

    return {
      ...cloned,
      parentId: cloned.parentId && reachableIds.has(cloned.parentId)
        ? cloned.parentId
        : undefined,
    } as BuilderCanvasNode;
  });
}

function normalizeRootResponsive(responsive: ResponsiveConfig): ResponsiveConfig {
  if (!responsive) return responsive;

  let changed = false;
  const next: NonNullable<ResponsiveConfig> = { ...responsive };
  for (const viewport of ['tablet', 'mobile'] as const) {
    const override = responsive[viewport];
    if (!override?.rect) continue;

    const rect = { ...override.rect };
    if (rect.x !== undefined) {
      rect.x = 0;
      changed = true;
    }
    if (rect.y !== undefined) {
      rect.y = 0;
      changed = true;
    }
    next[viewport] = { ...override, rect };
  }

  return changed ? next : responsive;
}
