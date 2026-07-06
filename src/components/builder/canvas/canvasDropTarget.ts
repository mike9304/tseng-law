import { resolveViewportRect, type Viewport } from '@/lib/builder/canvas/responsive';
import { isContainerLikeKind, type BuilderCanvasNode } from '@/lib/builder/canvas/types';

export interface StagePoint {
  readonly x: number;
  readonly y: number;
}

export interface CanvasDropTargetContext {
  readonly parentId: string | null;
  readonly position: StagePoint;
  readonly stagePosition: StagePoint;
}

type DropTargetCandidate = {
  readonly node: BuilderCanvasNode;
  readonly rect: BuilderCanvasNode['rect'];
  readonly depth: number;
};

export function resolveCanvasDropTargetContext({
  absoluteRectById,
  nodesById,
  position,
  viewport,
  visibleContainerNodes,
}: {
  readonly absoluteRectById: ReadonlyMap<string, BuilderCanvasNode['rect']>;
  readonly nodesById: ReadonlyMap<string, BuilderCanvasNode>;
  readonly position: StagePoint;
  readonly viewport: Viewport;
  readonly visibleContainerNodes: readonly BuilderCanvasNode[];
}): CanvasDropTargetContext {
  const target = findBestContainerDropTarget({
    absoluteRectById,
    nodesById,
    position,
    viewport,
    visibleContainerNodes,
  });
  if (!target) {
    return {
      parentId: null,
      position,
      stagePosition: position,
    };
  }

  return {
    parentId: target.node.id,
    position: {
      x: Math.max(0, Math.round(position.x - target.rect.x)),
      y: Math.max(0, Math.round(position.y - target.rect.y)),
    },
    stagePosition: position,
  };
}

function findBestContainerDropTarget({
  absoluteRectById,
  nodesById,
  position,
  viewport,
  visibleContainerNodes,
}: {
  readonly absoluteRectById: ReadonlyMap<string, BuilderCanvasNode['rect']>;
  readonly nodesById: ReadonlyMap<string, BuilderCanvasNode>;
  readonly position: StagePoint;
  readonly viewport: Viewport;
  readonly visibleContainerNodes: readonly BuilderCanvasNode[];
}): DropTargetCandidate | null {
  let best: DropTargetCandidate | null = null;

  for (const node of visibleContainerNodes) {
    if (!node.visible || node.locked || !isContainerLikeKind(node.kind)) continue;
    const rect = absoluteRectById.get(node.id) ?? resolveViewportRect(node, viewport);
    if (!rectContainsPoint(rect, position)) continue;
    const depth = getCanvasDropNodeDepth(node, nodesById);
    if (!best || isBetterContainerDropTarget(node, depth, best.node, best.depth)) {
      best = { depth, node, rect };
    }
  }

  return best;
}

function rectContainsPoint(rect: BuilderCanvasNode['rect'], point: StagePoint): boolean {
  return point.x >= rect.x
    && point.x <= rect.x + rect.width
    && point.y >= rect.y
    && point.y <= rect.y + rect.height;
}

function isBetterContainerDropTarget(
  candidate: BuilderCanvasNode,
  candidateDepth: number,
  current: BuilderCanvasNode,
  currentDepth: number,
): boolean {
  if (candidateDepth !== currentDepth) return candidateDepth > currentDepth;
  return candidate.zIndex > current.zIndex;
}

function getCanvasDropNodeDepth(
  node: BuilderCanvasNode,
  nodesById: ReadonlyMap<string, BuilderCanvasNode>,
): number {
  let depth = 0;
  const visited = new Set<string>();
  let parentId = node.parentId ?? null;

  while (parentId && !visited.has(parentId)) {
    visited.add(parentId);
    depth += 1;
    parentId = nodesById.get(parentId)?.parentId ?? null;
  }

  return depth;
}
