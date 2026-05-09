'use client';

import type { ResizeHandle } from '@/components/builder/canvas/CanvasNode';
import {
  resolveCanvasNodeAbsoluteRectForViewport,
  resolveCanvasNodeLocalRect,
} from '@/lib/builder/canvas/tree';
import { resolveViewportRect, type Viewport } from '@/lib/builder/canvas/responsive';
import { isContainerLikeKind, type BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { filterSnapCandidatesByBounds, type Rect } from '@/lib/builder/canvas/snap';

export type InteractionState =
  | {
      type: 'move';
      nodeId: string;
      nodeIds: string[];
      viewport: Viewport;
      pointerId: number;
      originX: number;
      originY: number;
      startParentId: string | null;
      startRects: Record<string, BuilderCanvasNode['rect']>;
      startAbsoluteRects: Record<string, BuilderCanvasNode['rect']>;
      snapRects: Rect[];
      containerHitRects: Array<{ id: string; rect: Rect }>;
    }
  | {
      type: 'resize';
      nodeId: string;
      handle: ResizeHandle;
      viewport: Viewport;
      pointerId: number;
      originX: number;
      originY: number;
      startRect: BuilderCanvasNode['rect'];
      startAbsoluteRect: BuilderCanvasNode['rect'];
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
  nodes: BuilderCanvasNode[];
  nodesById: Map<string, BuilderCanvasNode>;
  absoluteRectById: Map<string, BuilderCanvasNode['rect']>;
};

export type MoveInteractionCandidates = Pick<
  Extract<NonNullable<InteractionState>, { type: 'move' }>,
  'snapRects' | 'containerHitRects'
>;

export const MIN_CANVAS_NODE_WIDTH = 72;
export const MIN_CANVAS_NODE_HEIGHT = 40;
export const CANVAS_POPUP_EDGE_MARGIN = 12;

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

export function createMoveInteractionCandidates({
  activeGroupId,
  absoluteRectById,
  movingNode,
  movingNodeIds,
  nodes,
  snapBounds,
  viewport,
}: {
  activeGroupId: string | null;
  absoluteRectById: Map<string, BuilderCanvasNode['rect']>;
  movingNode: BuilderCanvasNode;
  movingNodeIds: Set<string>;
  nodes: BuilderCanvasNode[];
  snapBounds?: Rect | null;
  viewport: Viewport;
}): MoveInteractionCandidates {
  const snapRects: Rect[] = [];
  const containerHitRects: Array<{ id: string; rect: Rect }> = [];
  const movingParentId = movingNode.parentId ?? null;

  for (const node of nodes) {
    if (movingNodeIds.has(node.id) || !node.visible) continue;
    const rect = absoluteRectById.get(node.id) ?? resolveViewportRect(node, viewport);
    if (isContainerLikeKind(node.kind)) {
      containerHitRects.push({ id: node.id, rect });
    }
    const sameSnapScope = activeGroupId
      ? node.parentId === activeGroupId
      : movingParentId
        ? node.parentId === movingParentId
        : !node.parentId;
    if (sameSnapScope) snapRects.push(rect);
  }

  const parentRect = movingParentId ? absoluteRectById.get(movingParentId) ?? null : null;
  if (parentRect) snapRects.push(parentRect);

  return {
    snapRects: filterSnapCandidatesByBounds(snapRects, snapBounds),
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
