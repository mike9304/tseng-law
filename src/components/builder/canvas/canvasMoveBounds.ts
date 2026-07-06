import type { Rect } from '@/lib/builder/canvas/snap';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

export const MIN_CANVAS_NODE_WIDTH = 72;
export const MIN_CANVAS_NODE_HEIGHT = 40;

const MIN_VISIBLE_MOVE_EDGE = 24;

function clampMoveAxis(rawPosition: number, itemSize: number, stageSize: number): number {
  const position = Math.round(rawPosition);
  const size = Math.max(1, Math.round(itemSize));
  const containerSize = Math.max(1, Math.round(stageSize));
  const maxInside = containerSize - size;
  if (maxInside > 0) return Math.max(0, Math.min(maxInside, position));

  const visibleEdge = Math.min(MIN_VISIBLE_MOVE_EDGE, containerSize, size);
  const min = Math.min(0, -size + visibleEdge);
  const max = Math.max(0, containerSize - visibleEdge);
  return Math.max(min, Math.min(max, position));
}

export function writeLocalClampedRectForParent(
  target: BuilderCanvasNode['rect'],
  rect: Rect,
  parentRect: BuilderCanvasNode['rect'] | null,
  stageWidth: number,
  stageHeight: number,
  // Wix-parity free move (P1 cross-section drag): when true, the node's local
  // x/y are NOT clamped to the parent bounds, so a desktop absolute node can be
  // dragged past / straddling its parent section boundary (negative or overhang
  // local coords allowed). Size is still min-clamped. Default false preserves
  // the historical in-bounds clamp for all existing callers/tests.
  allowOverflow = false,
): boolean {
  const rawX = parentRect ? rect.x - parentRect.x : rect.x;
  const rawY = parentRect ? rect.y - parentRect.y : rect.y;
  const width = Math.max(MIN_CANVAS_NODE_WIDTH, Math.round(rect.width));
  const height = Math.max(MIN_CANVAS_NODE_HEIGHT, Math.round(rect.height));
  const x = allowOverflow ? Math.round(rawX) : clampMoveAxis(rawX, width, stageWidth);
  const y = allowOverflow ? Math.round(rawY) : clampMoveAxis(rawY, height, stageHeight);
  const changed = target.x !== x
    || target.y !== y
    || target.width !== width
    || target.height !== height;
  target.x = x;
  target.y = y;
  target.width = width;
  target.height = height;
  return changed;
}
