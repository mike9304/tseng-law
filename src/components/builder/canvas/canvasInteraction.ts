'use client';

import type { ResizeHandle } from '@/components/builder/canvas/CanvasNode';
import {
  resolveCanvasNodeAbsoluteRectForViewport,
  resolveCanvasNodeLocalRect,
} from '@/lib/builder/canvas/tree';
import { isTopLevelFlowSection } from '@/lib/builder/canvas/flow';
import { resolveViewportRect, type Viewport } from '@/lib/builder/canvas/responsive';
import { isContainerLikeKind, type BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  createSnapCandidateEdge,
  snapCandidateIntersectsBounds,
  type Rect,
  type SnapCandidateEdges,
} from '@/lib/builder/canvas/snap';
import {
  MIN_CANVAS_NODE_HEIGHT,
  MIN_CANVAS_NODE_WIDTH,
} from './canvasMoveBounds';
export {
  MIN_CANVAS_NODE_HEIGHT,
  MIN_CANVAS_NODE_WIDTH,
  writeLocalClampedRectForParent,
} from './canvasMoveBounds';

export type InteractionState =
  | {
      type: 'move';
      nodeId: string;
      clickSelectionNodeId?: string;
      nodeIds: string[];
      nodeIdSet: ReadonlySet<string>;
      canDirectPreview: boolean;
      viewport: Viewport;
      pointerId: number;
      originX: number;
      originY: number;
      startParentId: string | null;
      startRects: Record<string, BuilderCanvasNode['rect']>;
      startAbsoluteRects: Record<string, BuilderCanvasNode['rect']>;
      snapBounds: Rect;
      snapRects: Rect[];
      snapEdges: SnapCandidateEdges[];
      containerHitRects: ContainerHitRect[];
    }
  | {
      type: 'resize';
      nodeId: string;
      handle: ResizeHandle;
      viewport: Viewport;
      pointerId: number;
      originX: number;
      originY: number;
      viewportOriginX: number;
      viewportOriginY: number;
      startRect: BuilderCanvasNode['rect'];
      startAbsoluteRect: BuilderCanvasNode['rect'];
      snapRects: Rect[];
    }
  | {
      type: 'pan';
      pointerId: number;
      originX: number;
      originY: number;
      startPanX: number;
      startPanY: number;
    }
  | null;

export type PointerMoveSnapshot = {
  pointerId: number;
  clientX: number;
  clientY: number;
  shiftKey: boolean;
};

export type SelectionBoxState = {
  pointerId: number;
  originX: number;
  originY: number;
  currentX: number;
  currentY: number;
  additive: boolean;
};

export type ContextMenuState = {
  nodeId: string;
  x: number;
  y: number;
};

export type OverlapPickerState = {
  nodeIds: string[];
  x: number;
  y: number;
  mode: 'hint' | 'list';
};

export type InteractionGeometrySnapshot = {
  nodesById: Map<string, BuilderCanvasNode>;
  absoluteRectById: Map<string, BuilderCanvasNode['rect']>;
};

export type ContainerHitRect = { id: string; rect: Rect };

export type MoveInteractionCandidates = Pick<
  Extract<NonNullable<InteractionState>, { type: 'move' }>,
  'snapRects' | 'snapEdges' | 'containerHitRects'
>;

export const CANVAS_POPUP_EDGE_MARGIN = 12;

function isContainerHitCandidate(node: BuilderCanvasNode): boolean {
  return isContainerLikeKind(node.kind) || isTopLevelFlowSection(node);
}

function clampPopupAxis(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

export function clampViewportPopupPosition(
  rawX: number,
  rawY: number,
  viewportWidth: number,
  viewportHeight: number,
  popupWidth: number,
  popupHeight: number,
  margin = CANVAS_POPUP_EDGE_MARGIN,
): { x: number; y: number } {
  return {
    x: clampPopupAxis(rawX, margin, viewportWidth - popupWidth - margin),
    y: clampPopupAxis(rawY, margin, viewportHeight - popupHeight - margin),
  };
}

export function clampVisibleViewportPopupPosition(
  rawX: number,
  rawY: number,
  viewportRect: DOMRect,
  popupWidth: number,
  popupHeight: number,
  margin = CANVAS_POPUP_EDGE_MARGIN,
): { x: number; y: number } {
  const visibleLeft = Math.max(viewportRect.left, 0);
  const visibleTop = Math.max(viewportRect.top, 0);
  const visibleRight = Math.min(viewportRect.right, window.innerWidth);
  const visibleBottom = Math.min(viewportRect.bottom, window.innerHeight);
  return {
    x: clampPopupAxis(
      rawX,
      visibleLeft - viewportRect.left + margin,
      visibleRight - viewportRect.left - popupWidth - margin,
    ),
    y: clampPopupAxis(
      rawY,
      visibleTop - viewportRect.top + margin,
      visibleBottom - viewportRect.top - popupHeight - margin,
    ),
  };
}

export function isKeyboardTextInputTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (
    target instanceof HTMLInputElement
    || target instanceof HTMLTextAreaElement
    || target instanceof HTMLSelectElement
  ) {
    return true;
  }
  return target.isContentEditable;
}

function rectContainsPoint(rect: Rect, x: number, y: number): boolean {
  return x >= rect.x
    && x <= rect.x + rect.width
    && y >= rect.y
    && y <= rect.y + rect.height;
}

export function findContainerHitCandidateForPoint(
  x: number,
  y: number,
  candidates: readonly ContainerHitRect[],
  preferredCandidate: ContainerHitRect | null = null,
): ContainerHitRect | null {
  if (preferredCandidate && rectContainsPoint(preferredCandidate.rect, x, y)) {
    return preferredCandidate;
  }

  for (const candidate of candidates) {
    if (candidate === preferredCandidate) continue;
    if (rectContainsPoint(candidate.rect, x, y)) return candidate;
  }

  return null;
}

export function createMoveInteractionCandidates({
  activeGroupId,
  absoluteRectById,
  containerNodes,
  movingNode,
  movingNodeIds,
  nodes,
  snapBounds,
  viewport,
}: {
  activeGroupId: string | null;
  absoluteRectById: Map<string, BuilderCanvasNode['rect']>;
  containerNodes?: BuilderCanvasNode[];
  movingNode: BuilderCanvasNode;
  movingNodeIds: ReadonlySet<string>;
  nodes: BuilderCanvasNode[];
  snapBounds?: Rect | null;
  viewport: Viewport;
}): MoveInteractionCandidates {
  const snapRects: Rect[] = [];
  const snapEdges: SnapCandidateEdges[] = [];
  const containerHitRects: ContainerHitRect[] = [];
  const movingParentId = movingNode.parentId ?? null;
  const addSnapCandidate = (rect: Rect) => {
    if (snapBounds && !snapCandidateIntersectsBounds(rect, snapBounds)) return;
    snapRects.push(rect);
    snapEdges.push(createSnapCandidateEdge(rect));
  };

  if (containerNodes) {
    for (const node of containerNodes) {
      if (movingNodeIds.has(node.id) || !node.visible || !isContainerHitCandidate(node)) continue;
      const rect = absoluteRectById.get(node.id) ?? resolveViewportRect(node, viewport);
      containerHitRects.push({ id: node.id, rect });
    }
  }

  for (const node of nodes) {
    if (movingNodeIds.has(node.id) || !node.visible) continue;
    const rect = absoluteRectById.get(node.id) ?? resolveViewportRect(node, viewport);
    if (!containerNodes && isContainerHitCandidate(node)) {
      containerHitRects.push({ id: node.id, rect });
    }
    const sameSnapScope = activeGroupId
      ? node.parentId === activeGroupId
      : movingParentId
        ? node.parentId === movingParentId
        : !node.parentId;
    if (sameSnapScope) addSnapCandidate(rect);
  }

  const parentRect = movingParentId ? absoluteRectById.get(movingParentId) ?? null : null;
  if (parentRect) addSnapCandidate(parentRect);

  return {
    snapRects,
    snapEdges,
    containerHitRects,
  };
}

export function clampRect(
  rect: BuilderCanvasNode['rect'],
  stageWidth: number,
  stageHeight: number,
): BuilderCanvasNode['rect'] {
  const width = Math.max(MIN_CANVAS_NODE_WIDTH, Math.min(stageWidth, Math.round(rect.width)));
  const height = Math.max(MIN_CANVAS_NODE_HEIGHT, Math.min(stageHeight, Math.round(rect.height)));
  const x = Math.max(0, Math.min(stageWidth - width, Math.round(rect.x)));
  const y = Math.max(0, Math.min(stageHeight - height, Math.round(rect.y)));
  return { x, y, width, height };
}

export function writeClampedRect(
  target: BuilderCanvasNode['rect'],
  rect: BuilderCanvasNode['rect'],
  stageWidth: number,
  stageHeight: number,
  allowOverflow = false,
): boolean {
  const width = allowOverflow
    ? Math.max(MIN_CANVAS_NODE_WIDTH, Math.round(rect.width))
    : Math.max(MIN_CANVAS_NODE_WIDTH, Math.min(stageWidth, Math.round(rect.width)));
  const height = allowOverflow
    ? Math.max(MIN_CANVAS_NODE_HEIGHT, Math.round(rect.height))
    : Math.max(MIN_CANVAS_NODE_HEIGHT, Math.min(stageHeight, Math.round(rect.height)));
  const x = allowOverflow
    ? Math.round(rect.x)
    : Math.max(0, Math.min(stageWidth - width, Math.round(rect.x)));
  const y = allowOverflow
    ? Math.round(rect.y)
    : Math.max(0, Math.min(stageHeight - height, Math.round(rect.y)));
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

export function writeClampedMoveRect(
  target: BuilderCanvasNode['rect'],
  baseRect: BuilderCanvasNode['rect'],
  deltaX: number,
  deltaY: number,
  stageWidth: number,
  stageHeight: number,
  // Wix-parity free move: when true, position is NOT clamped to the parent/stage
  // bounds (node may straddle/overhang the section boundary) and size is not
  // shrunk to fit the parent. Default false preserves the historical clamp.
  allowOverflow = false,
): BuilderCanvasNode['rect'] {
  if (allowOverflow) {
    target.width = Math.max(MIN_CANVAS_NODE_WIDTH, Math.round(baseRect.width));
    target.height = Math.max(MIN_CANVAS_NODE_HEIGHT, Math.round(baseRect.height));
    target.x = Math.round(baseRect.x + deltaX);
    target.y = Math.round(baseRect.y + deltaY);
    return target;
  }
  target.width = Math.max(MIN_CANVAS_NODE_WIDTH, Math.min(stageWidth, Math.round(baseRect.width)));
  target.height = Math.max(MIN_CANVAS_NODE_HEIGHT, Math.min(stageHeight, Math.round(baseRect.height)));
  target.x = Math.max(0, Math.min(stageWidth - target.width, Math.round(baseRect.x + deltaX)));
  target.y = Math.max(0, Math.min(stageHeight - target.height, Math.round(baseRect.y + deltaY)));
  return target;
}

/**
 * Area of the intersection between two rects (0 when disjoint). Used to pick the
 * top-level section a straddling node "belongs to" on drop (bigger overlap wins).
 */
export function rectIntersectionArea(
  a: BuilderCanvasNode['rect'],
  b: Rect,
): number {
  const left = Math.max(a.x, b.x);
  const right = Math.min(a.x + a.width, b.x + b.width);
  const top = Math.max(a.y, b.y);
  const bottom = Math.min(a.y + a.height, b.y + b.height);
  const width = right - left;
  const height = bottom - top;
  if (width <= 0 || height <= 0) return 0;
  return width * height;
}

/**
 * Given a node's absolute rect and the hit rects of candidate top-level sections,
 * returns the id of the section with the largest overlap area (or null when the
 * node overlaps none). This is the "which section does a boundary-straddling node
 * belong to" rule for cross-section reparent on drop (Wix parity).
 */
export function resolveMaxOverlapSectionId(
  rect: BuilderCanvasNode['rect'],
  sectionHitRects: readonly ContainerHitRect[],
): string | null {
  let bestId: string | null = null;
  let bestArea = 0;
  for (const candidate of sectionHitRects) {
    const area = rectIntersectionArea(rect, candidate.rect);
    if (area > bestArea) {
      bestArea = area;
      bestId = candidate.id;
    }
  }
  return bestArea > 0 ? bestId : null;
}

export function writeResizeDraftRect(
  target: BuilderCanvasNode['rect'],
  startRect: BuilderCanvasNode['rect'],
  handle: ResizeHandle,
  deltaX: number,
  deltaY: number,
  preserveAspectRatio: boolean,
): BuilderCanvasNode['rect'] {
  target.x = startRect.x;
  target.y = startRect.y;
  target.width = startRect.width;
  target.height = startRect.height;

  if (preserveAspectRatio) {
    const aspect = startRect.width / startRect.height;
    let newWidth: number;
    let newHeight: number;
    if (Math.abs(deltaX) * startRect.height >= Math.abs(deltaY) * startRect.width) {
      newWidth = handle === 'se' || handle === 'ne'
        ? startRect.width + deltaX
        : startRect.width - deltaX;
      newHeight = newWidth / aspect;
    } else {
      newHeight = handle === 'se' || handle === 'sw'
        ? startRect.height + deltaY
        : startRect.height - deltaY;
      newWidth = newHeight * aspect;
    }
    target.width = newWidth;
    target.height = newHeight;
    if (handle === 'nw') {
      target.x = startRect.x + (startRect.width - newWidth);
      target.y = startRect.y + (startRect.height - newHeight);
    } else if (handle === 'ne') {
      target.y = startRect.y + (startRect.height - newHeight);
    } else if (handle === 'sw') {
      target.x = startRect.x + (startRect.width - newWidth);
    }
    return target;
  }

  if (handle === 'e' || handle === 'ne' || handle === 'se') {
    target.width = startRect.width + deltaX;
  }
  if (handle === 'w' || handle === 'nw' || handle === 'sw') {
    target.x = startRect.x + deltaX;
    target.width = startRect.width - deltaX;
  }
  if (handle === 's' || handle === 'sw' || handle === 'se') {
    target.height = startRect.height + deltaY;
  }
  if (handle === 'n' || handle === 'nw' || handle === 'ne') {
    target.y = startRect.y + deltaY;
    target.height = startRect.height - deltaY;
  }
  return target;
}

export function unionRects(rects: readonly BuilderCanvasNode['rect'][]): BuilderCanvasNode['rect'] | null {
  if (rects.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const rect of rects) {
    minX = Math.min(minX, rect.x);
    minY = Math.min(minY, rect.y);
    maxX = Math.max(maxX, rect.x + rect.width);
    maxY = Math.max(maxY, rect.y + rect.height);
  }
  if (!Number.isFinite(minX)) return null;
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}

export function clampAspectRect(
  rect: BuilderCanvasNode['rect'],
  startRect: BuilderCanvasNode['rect'],
  handle: ResizeHandle,
  stageWidth: number,
  stageHeight: number,
): BuilderCanvasNode['rect'] {
  const aspect = startRect.width / startRect.height;
  const growsRight = handle === 'ne' || handle === 'e' || handle === 'se';
  const growsDown = handle === 'sw' || handle === 's' || handle === 'se';
  const anchorX = growsRight ? startRect.x : startRect.x + startRect.width;
  const anchorY = growsDown ? startRect.y : startRect.y + startRect.height;
  const maxWidthFromAnchor = growsRight ? stageWidth - anchorX : anchorX;
  const maxHeightFromAnchor = growsDown ? stageHeight - anchorY : anchorY;
  const minWidth = Math.max(MIN_CANVAS_NODE_WIDTH, MIN_CANVAS_NODE_HEIGHT * aspect);
  const maxWidth = Math.max(minWidth, Math.min(maxWidthFromAnchor, maxHeightFromAnchor * aspect));
  const width = Math.round(Math.max(minWidth, Math.min(maxWidth, rect.width)));
  const height = Math.round(width / aspect);
  const x = growsRight ? anchorX : anchorX - width;
  const y = growsDown ? anchorY : anchorY - height;
  return {
    x: Math.max(0, Math.min(stageWidth - width, Math.round(x))),
    y: Math.max(0, Math.min(stageHeight - height, Math.round(y))),
    width,
    height,
  };
}

export function writeClampedAspectRect(
  target: BuilderCanvasNode['rect'],
  rect: BuilderCanvasNode['rect'],
  startRect: BuilderCanvasNode['rect'],
  handle: ResizeHandle,
  stageWidth: number,
  stageHeight: number,
  allowOverflow = false,
): boolean {
  const aspect = startRect.width / startRect.height;
  const growsRight = handle === 'ne' || handle === 'e' || handle === 'se';
  const growsDown = handle === 'sw' || handle === 's' || handle === 'se';
  const anchorX = growsRight ? startRect.x : startRect.x + startRect.width;
  const anchorY = growsDown ? startRect.y : startRect.y + startRect.height;
  const maxWidthFromAnchor = growsRight ? stageWidth - anchorX : anchorX;
  const maxHeightFromAnchor = growsDown ? stageHeight - anchorY : anchorY;
  const minWidth = Math.max(MIN_CANVAS_NODE_WIDTH, MIN_CANVAS_NODE_HEIGHT * aspect);
  const maxWidth = allowOverflow
    ? Number.POSITIVE_INFINITY
    : Math.max(minWidth, Math.min(maxWidthFromAnchor, maxHeightFromAnchor * aspect));
  const width = Math.round(Math.max(minWidth, Math.min(maxWidth, rect.width)));
  const height = Math.round(width / aspect);
  const rawX = growsRight ? anchorX : anchorX - width;
  const rawY = growsDown ? anchorY : anchorY - height;
  const x = allowOverflow
    ? Math.round(rawX)
    : Math.max(0, Math.min(stageWidth - width, Math.round(rawX)));
  const y = allowOverflow
    ? Math.round(rawY)
    : Math.max(0, Math.min(stageHeight - height, Math.round(rawY)));
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

export function getCanvasNodeLabel(node: BuilderCanvasNode): string {
  const content = node.content as Record<string, unknown>;
  const text = content.text ?? content.label ?? content.alt ?? content.title;
  if (typeof text === 'string' && text.trim()) {
    return text.trim().slice(0, 48);
  }
  return node.id;
}

export function getCanvasNodeDepth(
  node: BuilderCanvasNode,
  nodesById: Map<string, BuilderCanvasNode>,
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

export function resolveLocalRectForParent(
  rect: Rect,
  parentRect: BuilderCanvasNode['rect'] | null,
): BuilderCanvasNode['rect'] {
  return resolveCanvasNodeLocalRect(rect, parentRect);
}

export { resolveCanvasNodeAbsoluteRectForViewport };
