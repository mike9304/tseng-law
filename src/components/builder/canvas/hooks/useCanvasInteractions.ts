'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type Dispatch, type RefObject, type SetStateAction } from 'react';
import type { ResizeHandle } from '@/components/builder/canvas/CanvasNode';
import {
  clampRect,
  createMoveInteractionCandidates,
  findContainerHitCandidateForPoint,
  isKeyboardTextInputTarget,
  resolveCanvasNodeAbsoluteRectForViewport,
  resolveMaxOverlapSectionId,
  writeClampedAspectRect,
  writeClampedRect,
  writeLocalClampedRectForParent,
  writeClampedMoveRect,
  writeResizeDraftRect,
  MIN_CANVAS_NODE_HEIGHT,
  MIN_CANVAS_NODE_WIDTH,
  type ContainerHitRect,
  type ContextMenuState,
  type InteractionGeometrySnapshot,
  type InteractionState,
  type MoveInteractionCandidates,
  type OverlapPickerState,
  type PointerMoveSnapshot,
  type SelectionBoxState,
} from '@/components/builder/canvas/canvasInteraction';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import { resolveViewportRect, type Viewport } from '@/lib/builder/canvas/responsive';
import { isContainerLikeKind, type BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { isCanvasNodeAncestor, parentUsesFlowLayout } from '@/lib/builder/canvas/tree';
import { createSnapEdgeScratch, writeSnapFromEdges } from '@/lib/builder/canvas/snap';
import type { AlignmentGuide, SnapReferenceGuide } from '@/lib/builder/canvas/snap';
import type { ZoomState } from '@/lib/builder/canvas/zoom';
import {
  isTopLevelFlowSection,
  getFlowSiblingInsertionIndex,
  getFlowSiblingOriginalIndex,
  computeReorderedFlowSiblingRects,
  getFlowGroupKey,
  computeNewZIndexOrderForFlowSiblings,
  computeResizedFlowSiblingRects,
} from '@/lib/builder/canvas/flow';

type UseCanvasInteractionsArgs = {
  activeGroupId: string | null;
  activeViewport: Viewport | null;
  absoluteRectById: Map<string, BuilderCanvasNode['rect']>;
  beginMutationSession: () => void;
  cancelMutationSession: () => void;
  captureInteractionGeometry: () => InteractionGeometrySnapshot;
  childrenMap: Record<string, string[]>;
  commitMutationSession: () => void;
  currentViewport: Viewport;
  gridSnapSize: number;
  interactionResetKey?: string | null;
  nodesById: Map<string, BuilderCanvasNode>;
  onToast?: (message: string, tone: 'success' | 'error') => void;
  selectedNodeIds: string[];
  selectedNodeIdSet: ReadonlySet<string>;
  setContextMenu: Dispatch<SetStateAction<ContextMenuState | null>>;
  setActiveViewport: Dispatch<SetStateAction<Viewport | null>>;
  setOverlapPicker: Dispatch<SetStateAction<OverlapPickerState | null>>;
  setSelectedNodeId: (nodeId: string | null) => void;
  setSelectedNodeIds: (nodeIds: string[], primaryNodeId?: string | null) => void;
  setSelectionBox: Dispatch<SetStateAction<SelectionBoxState | null>>;
  setZoomState: Dispatch<SetStateAction<ZoomState>>;
  rootVisibleNodes: BuilderCanvasNode[];
  stageHeight: number;
  stageWidth: number;
  updateNodeRectsForViewport: (
    rects: Map<string, BuilderCanvasNode['rect']>,
    viewport: Viewport,
    mode?: 'commit' | 'transient',
    zIndexById?: Map<string, number>,
  ) => void;
  updateSingleNodeRectForViewport: (
    nodeId: string,
    rect: BuilderCanvasNode['rect'],
    viewport: Viewport,
    mode?: 'commit' | 'transient',
  ) => void;
  viewportRef: RefObject<HTMLDivElement | null>;
  visibleContainerNodes: BuilderCanvasNode[];
  referenceGuides: SnapReferenceGuide[];
  zoomState: ZoomState;
};

const MOVE_ACTIVATION_THRESHOLD_PX = 4;
const MOVE_ACTIVATION_THRESHOLD_SQUARED = MOVE_ACTIVATION_THRESHOLD_PX * MOVE_ACTIVATION_THRESHOLD_PX;
const EMPTY_ALIGNMENT_GUIDES: AlignmentGuide[] = [];
const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

type MoveInteraction = Extract<NonNullable<InteractionState>, { type: 'move' }>;
type ResizeInteraction = Extract<NonNullable<InteractionState>, { type: 'resize' }>;
type MoveInteractionSession = InteractionGeometrySnapshot & MoveInteractionCandidates & {
  pointerId: number;
};
type DirectMoveFrameInput = {
  height: number;
  nodeId: string;
  pointerId: number;
  width: number;
  x: number;
  y: number;
};
type ResizePreviewStyleSnapshot = {
  height: string;
  left: string;
  top: string;
  width: string;
};
type InteractionPointerPosition = { x: number; y: number };
type DirectPreviewScope = {
  renderKey: string | null | undefined;
  root: HTMLElement;
};

export function areAlignmentGuidesEqual(left: AlignmentGuide[], right: AlignmentGuide[]): boolean {
  if (left === right) return true;
  if (left.length !== right.length) return false;
  for (let index = 0; index < left.length; index += 1) {
    const guide = left[index];
    const other = right[index];
    if (
      guide.axis === other.axis
      && guide.position === other.position
      && guide.from === other.from
      && guide.to === other.to
      && guide.tone === other.tone
      && guide.label === other.label
    ) {
      continue;
    }
    return false;
  }
  return true;
}

function setGuidesIfChanged(
  guidesRef: { current: AlignmentGuide[] },
  setGuides: Dispatch<SetStateAction<AlignmentGuide[]>>,
  nextGuides: AlignmentGuide[],
) {
  if (areAlignmentGuidesEqual(guidesRef.current, nextGuides)) return;
  guidesRef.current = nextGuides;
  setGuides(nextGuides);
}

export function isSameMoveSelection(
  currentNodeIds: readonly string[],
  currentPrimaryNodeId: string | null,
  nextNodeIds: readonly string[],
  nextPrimaryNodeId: string,
): boolean {
  if (currentPrimaryNodeId !== nextPrimaryNodeId) return false;
  if (currentNodeIds.length !== nextNodeIds.length) return false;
  for (let index = 0; index < currentNodeIds.length; index += 1) {
    if (currentNodeIds[index] !== nextNodeIds[index]) return false;
  }
  return true;
}

export function areCanvasRectsEqual(
  left: BuilderCanvasNode['rect'] | null | undefined,
  right: BuilderCanvasNode['rect'] | null | undefined,
): boolean {
  if (left === right) return true;
  if (!left || !right) return false;
  return left.x === right.x
    && left.y === right.y
    && left.width === right.width
    && left.height === right.height;
}

export function createResizePreviewStateSnapshot(
  currentRect: BuilderCanvasNode['rect'] | null | undefined,
  nextRect: BuilderCanvasNode['rect'] | null | undefined,
): BuilderCanvasNode['rect'] | null | undefined {
  if (areCanvasRectsEqual(currentRect, nextRect)) return undefined;
  if (!nextRect) return null;
  return {
    x: nextRect.x,
    y: nextRect.y,
    width: nextRect.width,
    height: nextRect.height,
  };
}

export function areInteractionPointersEqual(
  left: InteractionPointerPosition | null | undefined,
  right: InteractionPointerPosition | null | undefined,
): boolean {
  if (left === right) return true;
  if (!left || !right) return false;
  return left.x === right.x && left.y === right.y;
}

export function isMoveActivationDistanceMet(deltaX: number, deltaY: number): boolean {
  return deltaX * deltaX + deltaY * deltaY >= MOVE_ACTIVATION_THRESHOLD_SQUARED;
}

export function getDirectMovePreviewTranslate(
  startRect: BuilderCanvasNode['rect'],
  rect: BuilderCanvasNode['rect'],
): string {
  return `${rect.x - startRect.x}px ${rect.y - startRect.y}px`;
}

export function areDirectMoveFrameInputsEqual(
  current: DirectMoveFrameInput | null | undefined,
  pointerId: number,
  nodeId: string,
  rect: BuilderCanvasNode['rect'],
): boolean {
  return Boolean(
    current
      && current.pointerId === pointerId
      && current.nodeId === nodeId
      && current.x === Math.round(rect.x)
      && current.y === Math.round(rect.y)
      && current.width === Math.round(rect.width)
      && current.height === Math.round(rect.height),
  );
}

function writeDirectMoveFrameInput(
  target: DirectMoveFrameInput,
  pointerId: number,
  nodeId: string,
  rect: BuilderCanvasNode['rect'],
): DirectMoveFrameInput {
  target.pointerId = pointerId;
  target.nodeId = nodeId;
  target.x = Math.round(rect.x);
  target.y = Math.round(rect.y);
  target.width = Math.round(rect.width);
  target.height = Math.round(rect.height);
  return target;
}

export function getDirectResizePreviewStyles(
  rect: BuilderCanvasNode['rect'],
): ResizePreviewStyleSnapshot {
  return {
    height: `${rect.height}px`,
    left: `${rect.x}px`,
    top: `${rect.y}px`,
    width: `${rect.width}px`,
  };
}

export function getUnlockedMoveNodeIds(
  targetNodeId: string,
  selectedNodeIds: string[],
  selectedNodeIdSet: ReadonlySet<string>,
  nodesById: Map<string, BuilderCanvasNode>,
): string[] {
  if (selectedNodeIds.length === 0 || !selectedNodeIdSet.has(targetNodeId)) {
    return [targetNodeId];
  }

  let unlockedNodeIds: string[] | null = null;
  for (let index = 0; index < selectedNodeIds.length; index += 1) {
    const selectedId = selectedNodeIds[index];
    if (selectedId === undefined) continue;
    if (nodesById.get(selectedId)?.locked) {
      unlockedNodeIds ??= selectedNodeIds.slice(0, index);
      continue;
    }
    if (unlockedNodeIds) {
      unlockedNodeIds.push(selectedId);
    }
  }
  return unlockedNodeIds ?? selectedNodeIds;
}

export function buildMoveStartRectRecords(
  nodeIds: readonly string[],
  nodesById: Map<string, BuilderCanvasNode>,
  absoluteRectById: Map<string, BuilderCanvasNode['rect']>,
  viewport: Viewport,
): Pick<MoveInteraction, 'startRects' | 'startAbsoluteRects'> {
  const startRects: MoveInteraction['startRects'] = {};
  const startAbsoluteRects: MoveInteraction['startAbsoluteRects'] = {};

  for (const nodeId of nodeIds) {
    const node = nodesById.get(nodeId);
    if (!node) continue;
    const viewportRect = resolveViewportRect(node, viewport);
    startRects[node.id] = viewportRect;
    startAbsoluteRects[node.id] = absoluteRectById.get(node.id) ?? viewportRect;
  }

  return { startRects, startAbsoluteRects };
}

export function getMoveSnapCandidateNodes({
  activeGroupId,
  childrenMap,
  movingNode,
  nodesById,
  rootVisibleNodes,
}: {
  activeGroupId: string | null;
  childrenMap: Record<string, string[]>;
  movingNode: BuilderCanvasNode;
  nodesById: Map<string, BuilderCanvasNode>;
  rootVisibleNodes: BuilderCanvasNode[];
}): BuilderCanvasNode[] {
  const movingParentId = movingNode.parentId ?? null;
  const scopeParentId = activeGroupId ?? movingParentId;

  if (!scopeParentId) {
    return rootVisibleNodes;
  }

  const scopedNodes: BuilderCanvasNode[] = [];
  for (const childId of childrenMap[scopeParentId] ?? []) {
    const childNode = nodesById.get(childId);
    if (childNode?.visible) scopedNodes.push(childNode);
  }
  return scopedNodes;
}

function createMoveInteractionSession({
  activeGroupId,
  childrenMap,
  geometry,
  moveInteraction,
  rootVisibleNodes,
  visibleContainerNodes,
}: {
  activeGroupId: string | null;
  childrenMap: Record<string, string[]>;
  geometry: InteractionGeometrySnapshot;
  moveInteraction: MoveInteraction;
  rootVisibleNodes: BuilderCanvasNode[];
  visibleContainerNodes: BuilderCanvasNode[];
}): MoveInteractionSession {
  const movingNode = geometry.nodesById.get(moveInteraction.nodeId);
  const moveCandidates = moveInteraction.nodeIds.length === 1 && movingNode
    ? createMoveInteractionCandidates({
        activeGroupId,
        absoluteRectById: geometry.absoluteRectById,
        containerNodes: visibleContainerNodes,
        movingNode,
        movingNodeIds: moveInteraction.nodeIdSet,
        nodes: getMoveSnapCandidateNodes({
          activeGroupId,
          childrenMap,
          movingNode,
          nodesById: geometry.nodesById,
          rootVisibleNodes,
        }),
        snapBounds: moveInteraction.snapBounds,
        viewport: moveInteraction.viewport,
      })
    : {
        snapRects: moveInteraction.snapRects,
        snapEdges: moveInteraction.snapEdges,
        containerHitRects: moveInteraction.containerHitRects,
      };

  return {
    pointerId: moveInteraction.pointerId,
    nodesById: geometry.nodesById,
    absoluteRectById: geometry.absoluteRectById,
    snapRects: moveCandidates.snapRects,
    snapEdges: moveCandidates.snapEdges,
    containerHitRects: moveCandidates.containerHitRects,
  };
}

export function buildResizeSnapRects({
  absoluteRectById,
  nodesById,
  resizingNodeId,
  viewport,
}: {
  absoluteRectById: Map<string, BuilderCanvasNode['rect']>;
  nodesById: Map<string, BuilderCanvasNode>;
  resizingNodeId: string;
  viewport: Viewport;
}): BuilderCanvasNode['rect'][] {
  const snapRects: BuilderCanvasNode['rect'][] = [];
  for (const node of nodesById.values()) {
    if (!node.visible || node.id === resizingNodeId) continue;
    snapRects.push(absoluteRectById.get(node.id) ?? resolveViewportRect(node, viewport));
  }
  return snapRects;
}

export function resolvePendingMoveAbsoluteRect(
  rect: BuilderCanvasNode['rect'],
  parentAbsoluteRect: BuilderCanvasNode['rect'] | null,
): BuilderCanvasNode['rect'] {
  if (!parentAbsoluteRect) return rect;
  return {
    ...rect,
    x: parentAbsoluteRect.x + rect.x,
    y: parentAbsoluteRect.y + rect.y,
  };
}

export function resolvePendingMoveHoverContainerId({
  containerHitRects,
  parentAbsoluteRect,
  preferredContainerHit,
  rect,
  topLevelSectionHitRects,
  currentTopLevelSectionId,
  preferSectionOverlap = false,
}: {
  containerHitRects: readonly ContainerHitRect[];
  parentAbsoluteRect: BuilderCanvasNode['rect'] | null;
  preferredContainerHit: ContainerHitRect | null;
  rect: BuilderCanvasNode['rect'];
  // Wix-parity cross-section reparent: the hit rects of candidate top-level
  // sections + the moved node's current top-level ancestor. When
  // preferSectionOverlap is set (desktop free move of an absolute node) and the
  // node's drop rect overlaps a DIFFERENT top-level section more than its
  // current one, the reparent target is that section (bigger overlap wins)
  // instead of the center-point container. Absent/false preserves the historical
  // center-point resolution (nested-container drops unchanged).
  topLevelSectionHitRects?: readonly ContainerHitRect[];
  currentTopLevelSectionId?: string | null;
  preferSectionOverlap?: boolean;
}): string | null {
  const absoluteRect = resolvePendingMoveAbsoluteRect(rect, parentAbsoluteRect);
  if (preferSectionOverlap && topLevelSectionHitRects && topLevelSectionHitRects.length > 0) {
    const overlapSectionId = resolveMaxOverlapSectionId(absoluteRect, topLevelSectionHitRects);
    if (overlapSectionId && overlapSectionId !== (currentTopLevelSectionId ?? null)) {
      return overlapSectionId;
    }
  }
  const centerX = absoluteRect.x + absoluteRect.width / 2;
  const centerY = absoluteRect.y + absoluteRect.height / 2;
  return findContainerHitCandidateForPoint(
    centerX,
    centerY,
    containerHitRects,
    preferredContainerHit,
  )?.id ?? null;
}

/**
 * A node is eligible for Wix-parity "free move" (unclamped drag across / beyond
 * its parent section boundary) only on the desktop viewport and only when it is
 * an absolute-positioned widget — i.e. NOT a top-level flow section (those use
 * the flow reorder path) and NOT a direct child of a flex/grid container (those
 * are laid out by the parent). Responsive (tablet/mobile) editing keeps the
 * existing in-bounds clamp + flow reflow pipeline untouched.
 */
export function canFreeMoveNodeOnDesktop(
  node: BuilderCanvasNode,
  nodesById: Map<string, BuilderCanvasNode>,
  viewport: Viewport,
): boolean {
  return viewport === 'desktop'
    && !isTopLevelFlowSection(node)
    && !parentUsesFlowLayout(node, nodesById);
}

export function resolveSelectedDomMoveTargetId(
  nodeId: string,
  eventTarget: EventTarget | null,
  additive: boolean,
): string {
  if (additive || !(eventTarget instanceof HTMLElement)) return nodeId;
  const hitNode = eventTarget.closest<HTMLElement>('[data-node-id]');
  const selectedAncestor = hitNode?.parentElement?.closest<HTMLElement>('[data-node-id][data-selected="true"]');
  const selectedAncestorId = selectedAncestor?.dataset.nodeId ?? null;
  return selectedAncestorId && selectedAncestorId !== nodeId ? selectedAncestorId : nodeId;
}

export function resolveUnactivatedMoveSelectionId(
  nodeId: string,
  moveNodeId: string,
  nodeKind: BuilderCanvasNode['kind'] | undefined,
  options: {
    additive?: boolean;
    pointerType?: string;
    selectedNodeCount?: number;
    moveNodeSelected?: boolean;
  } = {},
): string | null {
  if (options.additive || options.pointerType === 'touch') return null;
  if (moveNodeId === nodeId) {
    return options.selectedNodeCount && options.selectedNodeCount > 1 && options.moveNodeSelected
      ? moveNodeId
      : null;
  }
  if (nodeKind === 'text' || nodeKind === 'heading') return nodeId;
  return null;
}

export function resolveInitialMoveContainerHit(
  containerHitRects: readonly ContainerHitRect[],
  startParentId: string | null,
): ContainerHitRect | null {
  if (!startParentId) return null;
  return containerHitRects.find((candidate) => candidate.id === startParentId) ?? null;
}

export function resolvePreferredMoveContainerHit({
  containerHitRects,
  currentHoveredContainerHit,
  nodesById,
  startParentId,
}: {
  containerHitRects: readonly ContainerHitRect[];
  currentHoveredContainerHit: ContainerHitRect | null;
  nodesById: Map<string, BuilderCanvasNode>;
  startParentId: string | null;
}): ContainerHitRect | null {
  const startParentHit = resolveInitialMoveContainerHit(containerHitRects, startParentId);
  if (!currentHoveredContainerHit) return startParentHit;
  if (
    !startParentId
    || currentHoveredContainerHit.id === startParentId
    || !isCanvasNodeAncestor(currentHoveredContainerHit.id, startParentId, nodesById)
  ) {
    return currentHoveredContainerHit;
  }
  return startParentHit ?? currentHoveredContainerHit;
}

/**
 * Walks up the parentId chain to the top-level ancestor (the node whose parentId
 * is null). Used to know which top-level section a moved node currently lives in
 * so a cross-section drop can be detected. Cycle-guarded.
 */
export function resolveTopLevelAncestorId(
  node: BuilderCanvasNode,
  nodesById: Map<string, BuilderCanvasNode>,
): string | null {
  let current: BuilderCanvasNode | undefined = node;
  const seen = new Set<string>();
  while (current?.parentId && !seen.has(current.id)) {
    seen.add(current.id);
    const parent = nodesById.get(current.parentId);
    if (!parent) break;
    current = parent;
  }
  return current?.id ?? null;
}

/**
 * Builds the subset of container hit rects that are top-level flow sections,
 * used as candidates for bigger-overlap cross-section reparent on drop.
 */
export function collectTopLevelSectionHitRects(
  containerHitRects: readonly ContainerHitRect[],
  nodesById: Map<string, BuilderCanvasNode>,
): ContainerHitRect[] {
  const sections: ContainerHitRect[] = [];
  for (const hit of containerHitRects) {
    const node = nodesById.get(hit.id);
    if (node && isTopLevelFlowSection(node)) {
      sections.push(hit);
    }
  }
  return sections;
}

function cssAttributeValue(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

export function isReusablePreviewElement(
  element: HTMLElement | null | undefined,
  nodeId: string,
  scopeRoot?: HTMLElement | null,
): element is HTMLElement {
  return Boolean(
    element?.isConnected
      && element.getAttribute('data-node-id') === nodeId
      && (!scopeRoot || scopeRoot.contains(element)),
  );
}

export function findScopedPreviewElement(
  nodeId: string,
  previewElements: Map<string, HTMLElement>,
  scopeRoot: HTMLElement | null,
): HTMLElement | null {
  const cached = previewElements.get(nodeId);
  if (isReusablePreviewElement(cached, nodeId, scopeRoot)) {
    return cached;
  }

  // Once an interaction has claimed a concrete element, never replace that
  // identity by globally looking up a newly mounted node with the same id. A
  // page switch can reuse ids while rendering completely different geometry.
  if (cached || !scopeRoot?.isConnected) return null;

  const element = scopeRoot.querySelector<HTMLElement>(`[data-node-id="${cssAttributeValue(nodeId)}"]`);
  if (element) {
    previewElements.set(nodeId, element);
  }
  return element;
}

function getClaimedPreviewElement(
  nodeId: string,
  previewElements: Map<string, HTMLElement>,
): HTMLElement | null {
  const element = previewElements.get(nodeId);
  return element?.getAttribute('data-node-id') === nodeId ? element : null;
}

export function canUseDirectMovePreview(
  nodeIds: readonly string[],
  currentNodesById: Map<string, BuilderCanvasNode>,
): boolean {
  for (const nodeId of nodeIds) {
    if (!currentNodesById.has(nodeId)) return false;
  }
  return true;
}

function applyDirectMovePreview(
  activeInteraction: MoveInteraction,
  rects: Map<string, BuilderCanvasNode['rect']>,
  previewNodeIds: Set<string>,
  previewElements: Map<string, HTMLElement>,
  scopeRoot: HTMLElement | null,
) {
  for (const [nodeId, rect] of rects) {
    const startRect = activeInteraction.startRects[nodeId];
    const element = findScopedPreviewElement(nodeId, previewElements, scopeRoot);
    if (!startRect || !element) continue;
    const nextTranslate = getDirectMovePreviewTranslate(startRect, rect);
    if (element.style.getPropertyValue('translate') !== nextTranslate) {
      element.style.setProperty('translate', nextTranslate);
    }
    if (element.dataset.builderDirectMovePreview !== 'true') {
      element.dataset.builderDirectMovePreview = 'true';
    }
    previewNodeIds.add(nodeId);
  }
}

function applyDirectMovePreviewForNode(
  activeInteraction: MoveInteraction,
  nodeId: string,
  rect: BuilderCanvasNode['rect'],
  previewNodeIds: Set<string>,
  previewElements: Map<string, HTMLElement>,
  scopeRoot: HTMLElement | null,
) {
  const startRect = activeInteraction.startRects[nodeId];
  const element = findScopedPreviewElement(nodeId, previewElements, scopeRoot);
  if (!startRect || !element) return;
  const nextTranslate = getDirectMovePreviewTranslate(startRect, rect);
  if (element.style.getPropertyValue('translate') !== nextTranslate) {
    element.style.setProperty('translate', nextTranslate);
  }
  if (element.dataset.builderDirectMovePreview !== 'true') {
    element.dataset.builderDirectMovePreview = 'true';
  }
  previewNodeIds.add(nodeId);
}

function applyDirectResizePreview(
  activeInteraction: ResizeInteraction,
  rect: BuilderCanvasNode['rect'],
  originalStyles: Map<string, ResizePreviewStyleSnapshot>,
  previewElements: Map<string, HTMLElement>,
  scopeRoot: HTMLElement | null,
) {
  const element = findScopedPreviewElement(activeInteraction.nodeId, previewElements, scopeRoot);
  if (!element) return;
  if (!originalStyles.has(activeInteraction.nodeId)) {
    originalStyles.set(activeInteraction.nodeId, {
      height: element.style.height,
      left: element.style.left,
      top: element.style.top,
      width: element.style.width,
    });
  }
  const nextLeft = `${rect.x}px`;
  const nextTop = `${rect.y}px`;
  const nextWidth = `${rect.width}px`;
  const nextHeight = `${rect.height}px`;
  if (element.style.left !== nextLeft) element.style.left = nextLeft;
  if (element.style.top !== nextTop) element.style.top = nextTop;
  if (element.style.width !== nextWidth) element.style.width = nextWidth;
  if (element.style.height !== nextHeight) element.style.height = nextHeight;
  if (element.dataset.builderDirectResizePreview !== 'true') {
    element.dataset.builderDirectResizePreview = 'true';
  }
}

function clearDirectMovePreview(
  previewNodeIds: Set<string>,
  previewElements: Map<string, HTMLElement>,
) {
  for (const nodeId of previewNodeIds) {
    const element = getClaimedPreviewElement(nodeId, previewElements);
    if (element) {
      element.style.removeProperty('translate');
      delete element.dataset.builderDirectMovePreview;
    }
    previewElements.delete(nodeId);
  }
  previewNodeIds.clear();
}

function clearDirectResizePreviewMarkers(
  originalStyles: Map<string, ResizePreviewStyleSnapshot>,
  previewElements: Map<string, HTMLElement>,
) {
  for (const nodeId of originalStyles.keys()) {
    const element = getClaimedPreviewElement(nodeId, previewElements);
    if (element) {
      delete element.dataset.builderDirectResizePreview;
    }
    previewElements.delete(nodeId);
  }
  originalStyles.clear();
}

function restoreDirectResizePreview(
  originalStyles: Map<string, ResizePreviewStyleSnapshot>,
  previewElements: Map<string, HTMLElement>,
) {
  for (const [nodeId, styles] of originalStyles) {
    const element = getClaimedPreviewElement(nodeId, previewElements);
    if (element) {
      element.style.left = styles.left;
      element.style.top = styles.top;
      element.style.width = styles.width;
      element.style.height = styles.height;
      delete element.dataset.builderDirectResizePreview;
    }
    previewElements.delete(nodeId);
  }
  originalStyles.clear();
}

function discardDirectPreviews(
  previewNodeIds: Set<string>,
  originalResizeStyles: Map<string, ResizePreviewStyleSnapshot>,
  previewElements: Map<string, HTMLElement>,
) {
  previewNodeIds.clear();
  originalResizeStyles.clear();
  previewElements.clear();
}

export type InteractionMutationSessionController = {
  activePointerId: () => number | null;
  begin: (pointerId: number) => boolean;
  cancel: (pointerId?: number) => boolean;
  commit: (pointerId?: number) => boolean;
};

export function createInteractionMutationSessionController(callbacks: {
  begin: () => void;
  cancel: () => void;
  commit: () => void;
}): InteractionMutationSessionController {
  let activePointerId: number | null = null;

  const finish = (mode: 'cancel' | 'commit', pointerId?: number): boolean => {
    if (activePointerId === null) return false;
    if (pointerId !== undefined && pointerId !== activePointerId) return false;
    activePointerId = null;
    callbacks[mode]();
    return true;
  };

  return {
    activePointerId: () => activePointerId,
    begin: (pointerId) => {
      if (activePointerId === pointerId) return false;
      if (activePointerId !== null) finish('cancel');
      activePointerId = pointerId;
      callbacks.begin();
      return true;
    },
    cancel: (pointerId) => finish('cancel', pointerId),
    commit: (pointerId) => finish('commit', pointerId),
  };
}

export type PointerMoveCoalescerRefs = {
  pending: { current: PointerMoveSnapshot };
  hasPending: { current: boolean };
  frame: { current: number | null };
};

export type PointerMoveCoalescer = {
  setSample: (pointerId: number, clientX: number, clientY: number, shiftKey: boolean) => void;
  flush: () => void;
  cancel: () => void;
  isScheduled: () => boolean;
  hasPending: () => boolean;
};

/**
 * Latest-sample-only rAF coalescer for canvas pointermove events. At most one
 * frame is ever scheduled and at most one sample is processed per frame; the
 * most recently written sample wins. Operates on caller-owned refs (shared with
 * the page-reset / unmount lifecycle effects) so it never allocates per pointer
 * sample — it only copies primitives into the existing scratch object.
 */
export function createPointerMoveCoalescer(options: {
  refs: PointerMoveCoalescerRefs;
  process: (sample: PointerMoveSnapshot) => void;
  requestFrame: (callback: () => void) => number;
  cancelFrame: (handle: number) => void;
}): PointerMoveCoalescer {
  const { refs, process, requestFrame, cancelFrame } = options;
  let generation = 0;
  let ownedFrameHandle: number | null = null;

  const cancelOwnedFrame = () => {
    generation += 1;
    if (ownedFrameHandle !== null && refs.frame.current === ownedFrameHandle) {
      cancelFrame(ownedFrameHandle);
      refs.frame.current = null;
    }
    ownedFrameHandle = null;
  };

  return {
    setSample(pointerId, clientX, clientY, shiftKey) {
      const pending = refs.pending.current;
      pending.pointerId = pointerId;
      pending.clientX = clientX;
      pending.clientY = clientY;
      pending.shiftKey = shiftKey;
      refs.hasPending.current = true;
      if (refs.frame.current !== null) return;
      const scheduledGeneration = ++generation;
      const handle = requestFrame(() => {
        if (
          generation !== scheduledGeneration
          || ownedFrameHandle !== handle
          || refs.frame.current !== handle
        ) {
          return;
        }
        ownedFrameHandle = null;
        refs.frame.current = null;
        if (refs.hasPending.current) {
          refs.hasPending.current = false;
          process(refs.pending.current);
        }
      });
      ownedFrameHandle = handle;
      refs.frame.current = handle;
    },
    flush() {
      cancelOwnedFrame();
      if (refs.hasPending.current) {
        refs.hasPending.current = false;
        process(refs.pending.current);
      }
    },
    cancel() {
      cancelOwnedFrame();
      refs.hasPending.current = false;
    },
    isScheduled() {
      return refs.frame.current !== null;
    },
    hasPending() {
      return refs.hasPending.current;
    },
  };
}

export type ActivePanReplacementGuard = {
  begin: (pointerId: number, viewport: ZoomState) => void;
  finish: (pointerId: number) => boolean;
  observe: (pointerId: number, viewport: ZoomState) => boolean;
  publish: (pointerId: number, panX: number, panY: number) => void;
};

/**
 * Tracks the viewport state owned by one active pan. `observe` returns true at
 * most once when a fit/zoom/reset replaces that state, allowing the hook to
 * terminate the stale pointer interaction without rolling the replacement
 * viewport back to the pan's start coordinates.
 */
export function createActivePanReplacementGuard(): ActivePanReplacementGuard {
  let active: { pointerId: number; viewport: ZoomState } | null = null;

  return {
    begin(pointerId, viewport) {
      active = { pointerId, viewport: { ...viewport } };
    },
    finish(pointerId) {
      if (active?.pointerId !== pointerId) return false;
      active = null;
      return true;
    },
    observe(pointerId, viewport) {
      if (active?.pointerId !== pointerId) return false;
      const ownedViewport = active.viewport;
      if (
        ownedViewport.zoom === viewport.zoom
        && ownedViewport.panX === viewport.panX
        && ownedViewport.panY === viewport.panY
      ) {
        return false;
      }
      active = null;
      return true;
    },
    publish(pointerId, panX, panY) {
      if (active?.pointerId !== pointerId) return;
      active.viewport.panX = panX;
      active.viewport.panY = panY;
    },
  };
}

/**
 * Computes the next panX/panY for a processed pan frame. Returns null when the
 * computed coordinates are identical to the last published ones, so the caller
 * can skip invoking the React zoom setter entirely for redundant frames.
 */
export function computePanZoomUpdate(params: {
  startPanX: number;
  startPanY: number;
  deltaX: number;
  deltaY: number;
  lastPublishedPanX: number | null;
  lastPublishedPanY: number | null;
}): { panX: number; panY: number } | null {
  const panX = params.startPanX + params.deltaX;
  const panY = params.startPanY + params.deltaY;
  if (params.lastPublishedPanX === panX && params.lastPublishedPanY === panY) return null;
  return { panX, panY };
}

export type HoveredContainerUpdateDecision = {
  nextHit: ContainerHitRect | null;
  nextId: string | null;
  shouldPublish: boolean;
};

/**
 * Resolves whether a hovered-container hit should publish a new
 * hovered-container state. Equality is by the meaningful id (not by
 * ContainerHitRect object identity), so the same id represented by a fresh rect
 * object does not trigger an extra React state write.
 */
export function resolveHoveredContainerUpdate(params: {
  currentHoveredId: string | null;
  nextHit: ContainerHitRect | null;
}): HoveredContainerUpdateDecision {
  const nextId = params.nextHit?.id ?? null;
  return {
    nextHit: params.nextHit,
    nextId,
    shouldPublish: params.currentHoveredId !== nextId,
  };
}

export function useCanvasInteractions({
  activeGroupId,
  activeViewport,
  absoluteRectById,
  beginMutationSession,
  cancelMutationSession,
  captureInteractionGeometry,
  childrenMap,
  commitMutationSession,
  currentViewport,
  gridSnapSize,
  interactionResetKey,
  nodesById,
  onToast,
  selectedNodeIds,
  setContextMenu,
  setActiveViewport,
  setOverlapPicker,
  setSelectedNodeId,
  setSelectedNodeIds,
  setSelectionBox,
  setZoomState,
  rootVisibleNodes,
  stageHeight,
  stageWidth,
  updateNodeRectsForViewport,
  updateSingleNodeRectForViewport,
  viewportRef,
  visibleContainerNodes,
  referenceGuides,
  zoomState,
  selectedNodeIdSet,
}: UseCanvasInteractionsArgs) {
  const [interaction, setInteraction] = useState<InteractionState>(null);
  const interactionRef = useRef<InteractionState>(interaction);
  interactionRef.current = interaction;
  const [guides, setGuides] = useState<AlignmentGuide[]>(EMPTY_ALIGNMENT_GUIDES);
  const guidesRef = useRef<AlignmentGuide[]>(EMPTY_ALIGNMENT_GUIDES);
  const [interactionPointer, setInteractionPointer] = useState<InteractionPointerPosition | null>(null);
  const interactionPointerRef = useRef<InteractionPointerPosition | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [hoveredContainerId, setHoveredContainerId] = useState<string | null>(null);
  const hoveredContainerIdRef = useRef<string | null>(null);
  const hoveredContainerHitRef = useRef<ContainerHitRect | null>(null);
  const canceledInteractionPointerIdsRef = useRef<Set<number>>(new Set());
  const interactionGeometrySnapshotRef = useRef<InteractionGeometrySnapshot | null>(null);
  const moveInteractionSessionRef = useRef<MoveInteractionSession | null>(null);
  const moveActivationRef = useRef<{ pointerId: number; active: boolean } | null>(null);
  const lastPublishedPanRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const activePanReplacementGuardRef = useRef<ActivePanReplacementGuard | null>(null);
  activePanReplacementGuardRef.current ??= createActivePanReplacementGuard();
  const activePanReplacementGuard = activePanReplacementGuardRef.current;
  const overlapPickerClearedPointerRef = useRef<number | null>(null);
  const pendingPointerMoveRef = useRef<PointerMoveSnapshot>({
    pointerId: 0,
    clientX: 0,
    clientY: 0,
    shiftKey: false,
  });
  const hasPendingPointerMoveRef = useRef(false);
  const pointerMoveFrameRef = useRef<number | null>(null);
  const pendingDirectMoveRectRef = useRef<BuilderCanvasNode['rect'] | null>(null);
  const pendingDirectMoveAbsoluteRectDraftRef = useRef<BuilderCanvasNode['rect']>({ x: 0, y: 0, width: 0, height: 0 });
  const pendingDirectMoveFrameInputDraftRef = useRef<DirectMoveFrameInput>({
    pointerId: 0,
    nodeId: '',
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const lastDirectMoveFrameInputRef = useRef<DirectMoveFrameInput | null>(null);
  const pendingDirectMoveSnappedRectDraftRef = useRef<BuilderCanvasNode['rect']>({ x: 0, y: 0, width: 0, height: 0 });
  const pendingDirectMoveLocalRectDraftRef = useRef<BuilderCanvasNode['rect']>({ x: 0, y: 0, width: 0, height: 0 });
  const pendingDirectMoveSnapEdgeScratchRef = useRef<ReturnType<typeof createSnapEdgeScratch> | null>(null);
  const pendingDirectMoveRectsRef = useRef<Map<string, BuilderCanvasNode['rect']> | null>(null);
  const pendingDirectMoveRectsDraftRef = useRef<Map<string, BuilderCanvasNode['rect']>>(new Map());
  const pendingDirectMoveRectDraftsByIdRef = useRef<Map<string, BuilderCanvasNode['rect']>>(new Map());
  const pendingDirectResizeRectRef = useRef<BuilderCanvasNode['rect'] | null>(null);
  const pendingDirectResizeInputRectDraftRef = useRef<BuilderCanvasNode['rect']>({ x: 0, y: 0, width: 0, height: 0 });
  const pendingDirectResizePreviewRectDraftRef = useRef<BuilderCanvasNode['rect']>({ x: 0, y: 0, width: 0, height: 0 });
  const directPreviewNodeIdsRef = useRef<Set<string>>(new Set());
  const directPreviewElementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const directResizePreviewStylesRef = useRef<Map<string, ResizePreviewStyleSnapshot>>(new Map());
  const directPreviewScopeRef = useRef<DirectPreviewScope | null>(null);
  const [resizePreviewRect, setResizePreviewRect] = useState<BuilderCanvasNode['rect'] | null>(null);
  const resizePreviewRectRef = useRef<BuilderCanvasNode['rect'] | null>(null);
  const mutationCallbacksRef = useRef({
    begin: beginMutationSession,
    cancel: cancelMutationSession,
    commit: commitMutationSession,
  });
  mutationCallbacksRef.current.begin = beginMutationSession;
  mutationCallbacksRef.current.cancel = cancelMutationSession;
  mutationCallbacksRef.current.commit = commitMutationSession;
  const mutationSessionControllerRef = useRef<InteractionMutationSessionController | null>(null);
  mutationSessionControllerRef.current ??= createInteractionMutationSessionController({
    begin: () => mutationCallbacksRef.current.begin(),
    cancel: () => mutationCallbacksRef.current.cancel(),
    commit: () => mutationCallbacksRef.current.commit(),
  });
  const mutationSessionController = mutationSessionControllerRef.current;
  pendingDirectMoveSnapEdgeScratchRef.current ??= createSnapEdgeScratch();
  const moveNodeIntoContainer = useBuilderCanvasStore((state) => state.moveNodeIntoContainer);
  const setHoveredContainerHitIfChanged = useCallback((nextHit: ContainerHitRect | null) => {
    // Always sync the sticky/preferred hit ref (its geometry may change even
    // when the hovered id does not), but only publish hovered-container state
    // when the meaningful id actually changes. Equality is id-based, never
    // ContainerHitRect object identity.
    hoveredContainerHitRef.current = nextHit;
    const decision = resolveHoveredContainerUpdate({
      currentHoveredId: hoveredContainerIdRef.current,
      nextHit,
    });
    if (!decision.shouldPublish) return;
    hoveredContainerIdRef.current = decision.nextId;
    setHoveredContainerId(decision.nextId);
  }, []);
  const setInteractionPointerIfChanged = useCallback((nextPointer: InteractionPointerPosition | null) => {
    if (areInteractionPointersEqual(interactionPointerRef.current, nextPointer)) return;
    interactionPointerRef.current = nextPointer;
    setInteractionPointer(nextPointer);
  }, []);
  const setResizePreviewRectIfChanged = useCallback((nextRect: BuilderCanvasNode['rect'] | null) => {
    const nextStateRect = createResizePreviewStateSnapshot(resizePreviewRectRef.current, nextRect);
    if (nextStateRect === undefined) return;
    resizePreviewRectRef.current = nextStateRect;
    setResizePreviewRect(nextStateRect);
  }, []);
  const previousInteractionResetKeyRef = useRef(interactionResetKey);

  const getDirectPreviewScopeRoot = useCallback((): HTMLElement | null => {
    const scope = directPreviewScopeRef.current;
    return scope && scope.renderKey === interactionResetKey ? scope.root : null;
  }, [interactionResetKey]);

  useIsomorphicLayoutEffect(() => () => {
    const activeInteraction = interactionRef.current;
    if (activeInteraction) {
      canceledInteractionPointerIdsRef.current.add(activeInteraction.pointerId);
    }
    if (activeInteraction?.type === 'pan') {
      activePanReplacementGuard.finish(activeInteraction.pointerId);
    }
    mutationSessionController.cancel();
    if (pointerMoveFrameRef.current !== null) {
      window.cancelAnimationFrame(pointerMoveFrameRef.current);
      pointerMoveFrameRef.current = null;
    }
    hasPendingPointerMoveRef.current = false;
    // The canvas is leaving the tree, so restoring detached inline styles has
    // no user-visible value and risks touching a concurrently remounted node.
    discardDirectPreviews(
      directPreviewNodeIdsRef.current,
      directResizePreviewStylesRef.current,
      directPreviewElementsRef.current,
    );
    directPreviewScopeRef.current = null;
  }, [activePanReplacementGuard, mutationSessionController]);

  useIsomorphicLayoutEffect(() => {
    if (previousInteractionResetKeyRef.current === interactionResetKey) return;
    previousInteractionResetKeyRef.current = interactionResetKey;
    const activeInteraction = interactionRef.current;
    if (activeInteraction) {
      canceledInteractionPointerIdsRef.current.add(activeInteraction.pointerId);
    }
    if (activeInteraction?.type === 'pan') {
      activePanReplacementGuard.finish(activeInteraction.pointerId);
    }
    mutationSessionController.cancel(activeInteraction?.pointerId);
    if (pointerMoveFrameRef.current !== null) {
      window.cancelAnimationFrame(pointerMoveFrameRef.current);
      pointerMoveFrameRef.current = null;
    }
    hasPendingPointerMoveRef.current = false;
    interactionGeometrySnapshotRef.current = null;
    moveInteractionSessionRef.current = null;
    moveActivationRef.current = null;
    overlapPickerClearedPointerRef.current = null;
    pendingDirectMoveRectRef.current = null;
    lastDirectMoveFrameInputRef.current = null;
    pendingDirectMoveRectsRef.current = null;
    pendingDirectMoveRectsDraftRef.current.clear();
    pendingDirectMoveRectDraftsByIdRef.current.clear();
    pendingDirectResizeRectRef.current = null;
    // The render key already belongs to the next page. Never write page-A
    // snapshots during this boundary, even if React or the DOM reuses an id.
    discardDirectPreviews(
      directPreviewNodeIdsRef.current,
      directResizePreviewStylesRef.current,
      directPreviewElementsRef.current,
    );
    directPreviewScopeRef.current = null;
    interactionRef.current = null;
    setInteraction(null);
    setActiveViewport(null);
    setInteractionPointerIfChanged(null);
    setResizePreviewRectIfChanged(null);
    setGuidesIfChanged(guidesRef, setGuides, EMPTY_ALIGNMENT_GUIDES);
    setHoveredContainerHitIfChanged(null);
    setContextMenu(null);
    setOverlapPicker(null);
    setSelectionBox(null);
    setIsSpacePressed(false);
    setSelectedNodeIds([], null);
    useBuilderCanvasStore.getState().setSelectedSurfaceKey(null);
  }, [
    interactionResetKey,
    activePanReplacementGuard,
    mutationSessionController,
    setActiveViewport,
    setContextMenu,
    setHoveredContainerHitIfChanged,
    setInteractionPointerIfChanged,
    setOverlapPicker,
    setResizePreviewRectIfChanged,
    setSelectedNodeIds,
    setSelectionBox,
  ]);

  useIsomorphicLayoutEffect(() => {
    const activeInteraction = interactionRef.current;
    if (
      activeInteraction?.type !== 'pan'
      || !activePanReplacementGuard.observe(activeInteraction.pointerId, zoomState)
    ) {
      return;
    }

    // A fit/zoom/reset owns the new viewport. End the old pan before passive
    // effect recreation and never restore its stale startPan coordinates.
    canceledInteractionPointerIdsRef.current.add(activeInteraction.pointerId);
    if (pointerMoveFrameRef.current !== null) {
      window.cancelAnimationFrame(pointerMoveFrameRef.current);
      pointerMoveFrameRef.current = null;
    }
    hasPendingPointerMoveRef.current = false;
    interactionRef.current = null;
    setInteraction(null);
    setActiveViewport(null);
    setInteractionPointerIfChanged(null);
    setGuidesIfChanged(guidesRef, setGuides, EMPTY_ALIGNMENT_GUIDES);
  }, [
    activePanReplacementGuard,
    setActiveViewport,
    setInteractionPointerIfChanged,
    zoomState,
  ]);

  useEffect(() => {
    if (!activeViewport || activeViewport === currentViewport) return;
    mutationSessionController.cancel(interactionRef.current?.pointerId);
    interactionGeometrySnapshotRef.current = null;
    moveInteractionSessionRef.current = null;
    moveActivationRef.current = null;
    overlapPickerClearedPointerRef.current = null;
    pendingDirectMoveRectRef.current = null;
    lastDirectMoveFrameInputRef.current = null;
    pendingDirectMoveRectsRef.current = null;
    pendingDirectMoveRectsDraftRef.current.clear();
    pendingDirectMoveRectDraftsByIdRef.current.clear();
    pendingDirectResizeRectRef.current = null;
    clearDirectMovePreview(directPreviewNodeIdsRef.current, directPreviewElementsRef.current);
    restoreDirectResizePreview(directResizePreviewStylesRef.current, directPreviewElementsRef.current);
    directPreviewScopeRef.current = null;
    setActiveViewport(null);
    setInteraction(null);
    setInteractionPointerIfChanged(null);
    setResizePreviewRectIfChanged(null);
    setGuidesIfChanged(guidesRef, setGuides, EMPTY_ALIGNMENT_GUIDES);
    setHoveredContainerHitIfChanged(null);
  }, [
    activeViewport,
    currentViewport,
    mutationSessionController,
    setActiveViewport,
    setHoveredContainerHitIfChanged,
    setInteractionPointerIfChanged,
    setResizePreviewRectIfChanged,
  ]);

  useEffect(() => {
    if (!interaction) return undefined;
    const activeInteraction = interaction;

    function handleInteractionEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      canceledInteractionPointerIdsRef.current.add(activeInteraction.pointerId);
      if (activeInteraction.type === 'pan') {
        activePanReplacementGuard.finish(activeInteraction.pointerId);
      }
      mutationSessionController.cancel(activeInteraction.pointerId);
      interactionGeometrySnapshotRef.current = null;
      moveInteractionSessionRef.current = null;
      moveActivationRef.current = null;
      overlapPickerClearedPointerRef.current = null;
      pendingDirectMoveRectRef.current = null;
      lastDirectMoveFrameInputRef.current = null;
      pendingDirectMoveRectsRef.current = null;
      pendingDirectMoveRectsDraftRef.current.clear();
      pendingDirectMoveRectDraftsByIdRef.current.clear();
      pendingDirectResizeRectRef.current = null;
      clearDirectMovePreview(directPreviewNodeIdsRef.current, directPreviewElementsRef.current);
      restoreDirectResizePreview(directResizePreviewStylesRef.current, directPreviewElementsRef.current);
      directPreviewScopeRef.current = null;
      setInteraction(null);
      setActiveViewport(null);
      setInteractionPointerIfChanged(null);
      setResizePreviewRectIfChanged(null);
      setGuidesIfChanged(guidesRef, setGuides, EMPTY_ALIGNMENT_GUIDES);
      setHoveredContainerHitIfChanged(null);
      setContextMenu(null);
      setOverlapPicker(null);
    }

    window.addEventListener('keydown', handleInteractionEscape, true);
    return () => window.removeEventListener('keydown', handleInteractionEscape, true);
  }, [
    activePanReplacementGuard,
    interaction,
    mutationSessionController,
    setActiveViewport,
    setContextMenu,
    setHoveredContainerHitIfChanged,
    setInteractionPointerIfChanged,
    setOverlapPicker,
    setResizePreviewRectIfChanged,
  ]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.code !== 'Space' || isKeyboardTextInputTarget(event.target)) return;
      setIsSpacePressed(true);
    }

    function handleKeyUp(event: KeyboardEvent) {
      if (event.code !== 'Space' || isKeyboardTextInputTarget(event.target)) return;
      setIsSpacePressed(false);
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (!interaction) return undefined;
    const activeInteraction = interaction;
    canceledInteractionPointerIdsRef.current.delete(activeInteraction.pointerId);
    const pendingDirectMoveRectsDraft = pendingDirectMoveRectsDraftRef.current;
    const pendingDirectMoveRectDraftsById = pendingDirectMoveRectDraftsByIdRef.current;
    const directPreviewNodeIds = directPreviewNodeIdsRef.current;
    const directPreviewElements = directPreviewElementsRef.current;
    const directResizePreviewStyles = directResizePreviewStylesRef.current;

    function ensureMoveInteractionSession(moveInteraction: MoveInteraction): MoveInteractionSession | null {
      const currentSession = moveInteractionSessionRef.current;
      if (currentSession?.pointerId === moveInteraction.pointerId) return currentSession;

      const geometry = captureInteractionGeometry();
      interactionGeometrySnapshotRef.current = geometry;
      mutationSessionController.begin(moveInteraction.pointerId);
      const nextSession = createMoveInteractionSession({
        activeGroupId,
        childrenMap,
        geometry,
        moveInteraction,
        rootVisibleNodes,
        visibleContainerNodes,
      });
      if (!hoveredContainerHitRef.current) {
        setHoveredContainerHitIfChanged(resolveInitialMoveContainerHit(
          nextSession.containerHitRects,
          moveInteraction.startParentId,
        ));
      }
      moveInteractionSessionRef.current = nextSession;
      return nextSession;
    }

    function processPointerMove(pointer: PointerMoveSnapshot) {
      if (pointer.pointerId !== activeInteraction.pointerId) return;
      if (canceledInteractionPointerIdsRef.current.has(activeInteraction.pointerId)) return;
      if (activeInteraction.type === 'pan') {
        const deltaX = pointer.clientX - activeInteraction.originX;
        const deltaY = pointer.clientY - activeInteraction.originY;
        const nextPan = computePanZoomUpdate({
          startPanX: activeInteraction.startPanX,
          startPanY: activeInteraction.startPanY,
          deltaX,
          deltaY,
          lastPublishedPanX: lastPublishedPanRef.current.x,
          lastPublishedPanY: lastPublishedPanRef.current.y,
        });
        if (!nextPan) return;
        lastPublishedPanRef.current.x = nextPan.panX;
        lastPublishedPanRef.current.y = nextPan.panY;
        activePanReplacementGuard.publish(
          activeInteraction.pointerId,
          nextPan.panX,
          nextPan.panY,
        );
        setZoomState((currentState) => ({
          ...currentState,
          panX: nextPan.panX,
          panY: nextPan.panY,
        }));
        return;
      }

      const deltaX = (pointer.clientX - activeInteraction.originX) / zoomState.zoom;
      const deltaY = (pointer.clientY - activeInteraction.originY) / zoomState.zoom;
      if (activeInteraction.type === 'move') {
        const rawDeltaX = pointer.clientX - activeInteraction.originX;
        const rawDeltaY = pointer.clientY - activeInteraction.originY;
        const moveActivation = moveActivationRef.current?.pointerId === activeInteraction.pointerId
          ? moveActivationRef.current
          : null;
        if (
          !moveActivation?.active
          && !isMoveActivationDistanceMet(rawDeltaX, rawDeltaY)
        ) {
          return;
        }
        if (!moveActivation?.active) {
          moveActivationRef.current = { pointerId: activeInteraction.pointerId, active: true };
        }
        // A single activated move frame must calculate/apply only the final
        // snapped/clamped preview. The first-frame unsnapped "fast" preview pass
        // used to run here and was immediately overwritten by the snapped path
        // below in the same processed frame (a redundant DOM write).
        // beginMutationSession still happens exactly once via
        // ensureMoveInteractionSession -> mutationSessionController.begin.
        const moveSession = ensureMoveInteractionSession(activeInteraction);
        if (!moveSession) return;
        if (overlapPickerClearedPointerRef.current !== activeInteraction.pointerId) {
          overlapPickerClearedPointerRef.current = activeInteraction.pointerId;
          setOverlapPicker(null);
        }
        const currentNodesById = moveSession.nodesById;
        const currentAbsoluteRects = moveSession.absoluteRectById;
        if (activeInteraction.nodeIds.length === 1) {
          const nodeId = activeInteraction.nodeIds[0];
          const baseAbsoluteRect = activeInteraction.startAbsoluteRects[nodeId];
          const currentNode = currentNodesById.get(nodeId);
          if (currentNode && baseAbsoluteRect) {
            const tentative = pendingDirectMoveAbsoluteRectDraftRef.current;
            tentative.x = baseAbsoluteRect.x + deltaX;
            tentative.y = baseAbsoluteRect.y + deltaY;
            tentative.width = baseAbsoluteRect.width;
            tentative.height = baseAbsoluteRect.height;
            if (
              activeInteraction.canDirectPreview
              && directPreviewNodeIdsRef.current.has(nodeId)
              && areDirectMoveFrameInputsEqual(
                lastDirectMoveFrameInputRef.current,
                activeInteraction.pointerId,
                nodeId,
                tentative,
              )
            ) {
              return;
            }
            lastDirectMoveFrameInputRef.current = writeDirectMoveFrameInput(
              pendingDirectMoveFrameInputDraftRef.current,
              activeInteraction.pointerId,
              nodeId,
              tentative,
            );
            const parentRect = currentNode.parentId
              ? currentAbsoluteRects.get(currentNode.parentId) ?? null
              : null;
            const snappedRect = pendingDirectMoveSnappedRectDraftRef.current;
            const nextGuides = writeSnapFromEdges(
              snappedRect,
              tentative,
              moveSession.snapEdges,
              gridSnapSize,
              activeInteraction.snapBounds,
              referenceGuides,
              pendingDirectMoveSnapEdgeScratchRef.current ?? undefined,
            );
            setGuidesIfChanged(guidesRef, setGuides, nextGuides);
            const allowOverflow = canFreeMoveNodeOnDesktop(currentNode, currentNodesById, activeInteraction.viewport);
            const nextRect = pendingDirectMoveLocalRectDraftRef.current;
            const isFirstDirectMovePreview = pendingDirectMoveRectRef.current !== nextRect;
            const didMovePreviewRectChange = writeLocalClampedRectForParent(
              nextRect,
              snappedRect,
              parentRect,
              parentRect?.width ?? stageWidth,
              parentRect?.height ?? stageHeight,
              allowOverflow,
            );
            const preferredContainerHit = resolvePreferredMoveContainerHit({
              containerHitRects: moveSession.containerHitRects,
              currentHoveredContainerHit: hoveredContainerHitRef.current,
              nodesById: currentNodesById,
              startParentId: activeInteraction.startParentId,
            });
            const centerX = (parentRect?.x ?? 0) + nextRect.x + nextRect.width / 2;
            const centerY = (parentRect?.y ?? 0) + nextRect.y + nextRect.height / 2;
            const hitContainer = findContainerHitCandidateForPoint(
              centerX,
              centerY,
              moveSession.containerHitRects,
              preferredContainerHit,
            );
            setHoveredContainerHitIfChanged(hitContainer);
            if (activeInteraction.canDirectPreview) {
              pendingDirectMoveRectRef.current = nextRect;
              pendingDirectMoveRectsRef.current = null;
              if (didMovePreviewRectChange || isFirstDirectMovePreview || !directPreviewNodeIdsRef.current.has(nodeId)) {
                applyDirectMovePreviewForNode(
                  activeInteraction,
                  nodeId,
                  nextRect,
                  directPreviewNodeIdsRef.current,
                  directPreviewElementsRef.current,
                  getDirectPreviewScopeRoot(),
                );
              }
            } else {
              pendingDirectMoveRectRef.current = null;
              lastDirectMoveFrameInputRef.current = null;
              pendingDirectMoveRectsRef.current = null;
              clearDirectMovePreview(directPreviewNodeIdsRef.current, directPreviewElementsRef.current);
              updateSingleNodeRectForViewport(nodeId, nextRect, activeInteraction.viewport, 'transient');
            }
            return;
          }
        }
        setHoveredContainerHitIfChanged(null);
        setGuidesIfChanged(guidesRef, setGuides, EMPTY_ALIGNMENT_GUIDES);
        const nextRects = activeInteraction.canDirectPreview
          ? pendingDirectMoveRectsDraftRef.current
          : new Map<string, BuilderCanvasNode['rect']>();
        const directMoveRectDraftsById = activeInteraction.canDirectPreview
          ? pendingDirectMoveRectDraftsByIdRef.current
          : null;
        if (activeInteraction.canDirectPreview) {
          nextRects.clear();
        }
        for (const nodeId of activeInteraction.nodeIds) {
          const currentNode = currentNodesById.get(nodeId);
          if (!currentNode) continue;
          const baseRect = activeInteraction.startRects[nodeId] ?? resolveViewportRect(currentNode, activeInteraction.viewport);
          const parentRect = currentNode.parentId
            ? currentAbsoluteRects.get(currentNode.parentId) ?? null
            : null;
          const boundsWidth = parentRect?.width ?? stageWidth;
          const boundsHeight = parentRect?.height ?? stageHeight;
          const allowOverflow = canFreeMoveNodeOnDesktop(currentNode, currentNodesById, activeInteraction.viewport);
          if (directMoveRectDraftsById) {
            let nextRect = directMoveRectDraftsById.get(nodeId);
            if (!nextRect) {
              nextRect = { x: 0, y: 0, width: 0, height: 0 };
              directMoveRectDraftsById.set(nodeId, nextRect);
            }
            nextRects.set(
              nodeId,
              writeClampedMoveRect(nextRect, baseRect, deltaX, deltaY, boundsWidth, boundsHeight, allowOverflow),
            );
            continue;
          }
          nextRects.set(
            nodeId,
            allowOverflow
              ? {
                  x: Math.round(baseRect.x + deltaX),
                  y: Math.round(baseRect.y + deltaY),
                  width: Math.max(MIN_CANVAS_NODE_WIDTH, Math.round(baseRect.width)),
                  height: Math.max(MIN_CANVAS_NODE_HEIGHT, Math.round(baseRect.height)),
                }
              : clampRect(
                  {
                    ...baseRect,
                    x: baseRect.x + deltaX,
                    y: baseRect.y + deltaY,
                  },
                  boundsWidth,
                  boundsHeight,
                ),
          );
        }
        if (activeInteraction.canDirectPreview) {
          pendingDirectMoveRectRef.current = null;
          lastDirectMoveFrameInputRef.current = null;
          pendingDirectMoveRectsRef.current = nextRects;
          applyDirectMovePreview(
            activeInteraction,
            nextRects,
            directPreviewNodeIdsRef.current,
            directPreviewElementsRef.current,
            getDirectPreviewScopeRoot(),
          );
        } else {
          pendingDirectMoveRectRef.current = null;
          lastDirectMoveFrameInputRef.current = null;
          pendingDirectMoveRectsRef.current = null;
          clearDirectMovePreview(directPreviewNodeIdsRef.current, directPreviewElementsRef.current);
          updateNodeRectsForViewport(nextRects, activeInteraction.viewport, 'transient');
        }
        return;
      }

      setInteractionPointerIfChanged({
        x: pointer.clientX - activeInteraction.viewportOriginX,
        y: pointer.clientY - activeInteraction.viewportOriginY,
      });
      setGuidesIfChanged(guidesRef, setGuides, EMPTY_ALIGNMENT_GUIDES);
      const geometry = interactionGeometrySnapshotRef.current;
      if (!geometry) return;
      const currentNodesById = geometry.nodesById;
      const currentAbsoluteRects = geometry.absoluteRectById;
      const targetNode = currentNodesById.get(activeInteraction.nodeId);
      if (!targetNode) return;
      const { handle } = activeInteraction;
      const startRect = activeInteraction.startRect;
      const isCorner = handle === 'nw' || handle === 'ne' || handle === 'sw' || handle === 'se';
      const preserveAspectRatio = isCorner && pointer.shiftKey;
      const nextRect = writeResizeDraftRect(
        pendingDirectResizeInputRectDraftRef.current,
        startRect,
        handle,
        deltaX,
        deltaY,
        preserveAspectRatio,
      );

      const parentRect = targetNode.parentId
        ? currentAbsoluteRects.get(targetNode.parentId) ?? null
        : null;
      const boundsWidth = parentRect?.width ?? stageWidth;
      const boundsHeight = parentRect?.height ?? stageHeight;
      const previewRect = pendingDirectResizePreviewRectDraftRef.current;
      const isFirstDirectResizePreview = pendingDirectResizeRectRef.current !== previewRect;
      const allowResizeOverflow = activeInteraction.viewport === 'desktop' && !isTopLevelFlowSection(targetNode);
      const didResizePreviewRectChange = preserveAspectRatio
        ? writeClampedAspectRect(
            previewRect,
            nextRect,
            startRect,
            handle,
            boundsWidth,
            boundsHeight,
            allowResizeOverflow,
          )
        : writeClampedRect(previewRect, nextRect, boundsWidth, boundsHeight, allowResizeOverflow);
      pendingDirectResizeRectRef.current = previewRect;
      if (didResizePreviewRectChange || isFirstDirectResizePreview || !directResizePreviewStylesRef.current.has(activeInteraction.nodeId)) {
        applyDirectResizePreview(
          activeInteraction,
          previewRect,
          directResizePreviewStylesRef.current,
          directPreviewElementsRef.current,
          getDirectPreviewScopeRoot(),
        );
      }
      setResizePreviewRectIfChanged(previewRect);
    }

    const pointerMoveCoalescer = createPointerMoveCoalescer({
      refs: {
        pending: pendingPointerMoveRef,
        hasPending: hasPendingPointerMoveRef,
        frame: pointerMoveFrameRef,
      },
      process: processPointerMove,
      requestFrame: (callback) => window.requestAnimationFrame(callback),
      cancelFrame: (handle) => window.cancelAnimationFrame(handle),
    });

    function flushPendingPointerMove() {
      pointerMoveCoalescer.flush();
    }

    function handlePointerMove(event: PointerEvent) {
      if (event.pointerId !== activeInteraction.pointerId) return;
      if (canceledInteractionPointerIdsRef.current.has(activeInteraction.pointerId)) return;
      pointerMoveCoalescer.setSample(event.pointerId, event.clientX, event.clientY, event.shiftKey);
    }

    function cancelPointerInteraction(pointerId: number) {
      if (pointerId !== activeInteraction.pointerId) return;
      canceledInteractionPointerIdsRef.current.add(pointerId);
      pointerMoveCoalescer.cancel();
      mutationSessionController.cancel(pointerId);
      if (activeInteraction.type === 'pan') {
        const shouldRestorePanStart = activePanReplacementGuard.finish(pointerId);
        if (shouldRestorePanStart) {
          setZoomState((currentState) => ({
            ...currentState,
            panX: activeInteraction.startPanX,
            panY: activeInteraction.startPanY,
          }));
        }
      }
      interactionGeometrySnapshotRef.current = null;
      moveInteractionSessionRef.current = null;
      moveActivationRef.current = null;
      overlapPickerClearedPointerRef.current = null;
      pendingDirectMoveRectRef.current = null;
      lastDirectMoveFrameInputRef.current = null;
      pendingDirectMoveRectsRef.current = null;
      pendingDirectMoveRectsDraftRef.current.clear();
      pendingDirectMoveRectDraftsByIdRef.current.clear();
      pendingDirectResizeRectRef.current = null;
      clearDirectMovePreview(directPreviewNodeIdsRef.current, directPreviewElementsRef.current);
      restoreDirectResizePreview(directResizePreviewStylesRef.current, directPreviewElementsRef.current);
      directPreviewScopeRef.current = null;
      interactionRef.current = null;
      setHoveredContainerHitIfChanged(null);
      setInteraction(null);
      setActiveViewport(null);
      setInteractionPointerIfChanged(null);
      setResizePreviewRectIfChanged(null);
      setGuidesIfChanged(guidesRef, setGuides, EMPTY_ALIGNMENT_GUIDES);
      setContextMenu(null);
      setOverlapPicker(null);
    }

    function handlePointerCancel(event: PointerEvent) {
      cancelPointerInteraction(event.pointerId);
    }

    function handlePointerUp(event: PointerEvent) {
      if (event.pointerId !== activeInteraction.pointerId) return;
      if (canceledInteractionPointerIdsRef.current.delete(activeInteraction.pointerId)) {
        return;
      }
      flushPendingPointerMove();
      if (activeInteraction.type === 'pan') {
        activePanReplacementGuard.finish(activeInteraction.pointerId);
      }
      const activeMoveActivation = moveActivationRef.current?.pointerId === activeInteraction.pointerId
        ? moveActivationRef.current
        : null;
      if (activeInteraction.type === 'move' && !activeMoveActivation?.active) {
        if (activeInteraction.clickSelectionNodeId) {
          setSelectedNodeIds(
            [activeInteraction.clickSelectionNodeId],
            activeInteraction.clickSelectionNodeId,
          );
        }
        mutationSessionController.cancel(activeInteraction.pointerId);
        interactionGeometrySnapshotRef.current = null;
        moveInteractionSessionRef.current = null;
        moveActivationRef.current = null;
        overlapPickerClearedPointerRef.current = null;
        pendingDirectMoveRectRef.current = null;
        lastDirectMoveFrameInputRef.current = null;
        pendingDirectMoveRectsRef.current = null;
        pendingDirectMoveRectsDraftRef.current.clear();
        pendingDirectMoveRectDraftsByIdRef.current.clear();
        pendingDirectResizeRectRef.current = null;
        clearDirectMovePreview(directPreviewNodeIdsRef.current, directPreviewElementsRef.current);
        restoreDirectResizePreview(directResizePreviewStylesRef.current, directPreviewElementsRef.current);
        directPreviewScopeRef.current = null;
        setHoveredContainerHitIfChanged(null);
        setInteraction(null);
        setActiveViewport(null);
        setInteractionPointerIfChanged(null);
        setResizePreviewRectIfChanged(null);
        setGuidesIfChanged(guidesRef, setGuides, EMPTY_ALIGNMENT_GUIDES);
        return;
      }
      const pendingMoveHoverContainer = (() => {
        if (activeInteraction.type !== 'move' || activeInteraction.nodeIds.length !== 1) {
          return { resolved: false, containerId: null as string | null };
        }
        const nodeId = activeInteraction.nodeIds[0];
        const pendingRect = pendingDirectMoveRectRef.current
          ?? pendingDirectMoveRectsRef.current?.get(nodeId)
          ?? null;
        if (!pendingRect) return { resolved: false, containerId: null as string | null };
        const activeMoveSession = moveInteractionSessionRef.current?.pointerId === activeInteraction.pointerId
          ? moveInteractionSessionRef.current
          : null;
        const geometry = activeMoveSession ?? interactionGeometrySnapshotRef.current;
        const currentNode = geometry?.nodesById.get(nodeId) ?? null;
        const parentAbsoluteRect = currentNode?.parentId
          ? geometry?.absoluteRectById.get(currentNode.parentId) ?? null
          : null;
        const containerHitRects = activeMoveSession?.containerHitRects ?? activeInteraction.containerHitRects;
        // Cross-section reparent (Wix parity): a desktop free-move of an absolute
        // widget that straddles a section boundary should belong to the top-level
        // section with the bigger overlap. Gate keeps flow/responsive drops on the
        // historical center-point resolution.
        const preferSectionOverlap = currentNode !== null && geometry !== null
          && canFreeMoveNodeOnDesktop(currentNode, geometry.nodesById, activeInteraction.viewport);
        const preferredContainerHit = geometry
          ? resolvePreferredMoveContainerHit({
              containerHitRects,
              currentHoveredContainerHit: hoveredContainerHitRef.current,
              nodesById: geometry.nodesById,
              startParentId: activeInteraction.startParentId,
            })
          : hoveredContainerHitRef.current;
        return {
          resolved: true,
          containerId: resolvePendingMoveHoverContainerId({
            containerHitRects,
            parentAbsoluteRect,
            preferredContainerHit,
            rect: pendingRect,
            preferSectionOverlap,
            topLevelSectionHitRects: preferSectionOverlap && geometry
              ? collectTopLevelSectionHitRects(containerHitRects, geometry.nodesById)
              : undefined,
            currentTopLevelSectionId: preferSectionOverlap && currentNode && geometry
              ? resolveTopLevelAncestorId(currentNode, geometry.nodesById)
              : undefined,
          }),
        };
      })();
      if (
        activeInteraction.type === 'move'
        && activeInteraction.nodeIds.length === 1
        && pendingDirectMoveRectRef.current
      ) {
        const pendingDirectMoveRect = pendingDirectMoveRectRef.current;
        pendingDirectMoveRectRef.current = null;
        lastDirectMoveFrameInputRef.current = null;
        clearDirectMovePreview(directPreviewNodeIdsRef.current, directPreviewElementsRef.current);
        updateSingleNodeRectForViewport(
          activeInteraction.nodeIds[0],
          pendingDirectMoveRect,
          activeInteraction.viewport,
          'transient',
        );
      }
      if (activeInteraction.type === 'move' && pendingDirectMoveRectsRef.current) {
        const pendingDirectMoveRects = pendingDirectMoveRectsRef.current;
        pendingDirectMoveRectsRef.current = null;
        clearDirectMovePreview(directPreviewNodeIdsRef.current, directPreviewElementsRef.current);
        updateNodeRectsForViewport(
          pendingDirectMoveRects,
          activeInteraction.viewport,
          'transient',
        );
        pendingDirectMoveRects.clear();
        pendingDirectMoveRectDraftsByIdRef.current.clear();
      }
      if (activeInteraction.type === 'resize' && pendingDirectResizeRectRef.current) {
        const pendingDirectResizeRect = pendingDirectResizeRectRef.current;
        pendingDirectResizeRectRef.current = null;
        updateSingleNodeRectForViewport(
          activeInteraction.nodeId,
          pendingDirectResizeRect,
          activeInteraction.viewport,
          'transient',
        );
      }
      const currentHoveredContainerId = pendingMoveHoverContainer.resolved ? pendingMoveHoverContainer.containerId : (() => {
        if (activeInteraction.type !== 'move' || activeInteraction.nodeIds.length !== 1) return null;
        const nodeId = activeInteraction.nodeIds[0];
        const storeState = useBuilderCanvasStore.getState();
        const allNodes = storeState.document?.nodes ?? [];
        const latestNodesById = storeState.nodesById;
        const movedNode = latestNodesById.get(nodeId);
        if (!movedNode) return null;
        const movedRect = resolveCanvasNodeAbsoluteRectForViewport(
          movedNode,
          latestNodesById,
          activeInteraction.viewport,
        );
        const cx = movedRect.x + movedRect.width / 2;
        const cy = movedRect.y + movedRect.height / 2;
        return allNodes.find(
          (node) =>
            isContainerLikeKind(node.kind) &&
            node.id !== nodeId &&
            node.visible &&
            (() => {
              const rect = resolveCanvasNodeAbsoluteRectForViewport(
                node,
                latestNodesById,
                activeInteraction.viewport,
              );
              return (
                cx >= rect.x
                && cx <= rect.x + rect.width
                && cy >= rect.y
                && cy <= rect.y + rect.height
              );
            })(),
        )?.id ?? null;
      })();
      const willReparent = Boolean(
        currentHoveredContainerId
        && activeInteraction.type === 'move'
        && activeInteraction.nodeIds.length === 1
        && currentHoveredContainerId !== activeInteraction.startParentId,
      );
      if (willReparent && activeInteraction.type === 'move' && activeInteraction.viewport !== 'desktop') {
        mutationSessionController.cancel(activeInteraction.pointerId);
        onToast?.('Reparenting is desktop-only in this build', 'error');
      } else {
        if (
          willReparent
          && activeInteraction.type === 'move'
          && activeInteraction.viewport === 'desktop'
          && currentHoveredContainerId
        ) {
          moveNodeIntoContainer(activeInteraction.nodeIds[0], currentHoveredContainerId);
        } else if (
          // 2-2.3 + P0-03 extension: Special commit path for Live Sibling Reflow (Drop Reorder)
          // for BOTH top-level flow sections AND inner flow children (direct children of
          // flex/grid containers).
          // - Uses generalized insertionIndex (live, y-based among flow siblings) + originalIndex
          //   (from startRects) to detect real reorder.
          // - Same-slot: cancel (no history, snaps back to natural y, no drift).
          // - Different slot: computeReorderedFlowSiblingRects (generalized, uses
          //   computeFlowSiblingMetrics + carries original marginTops) → 'commit' for clean history.
          // This makes drag inside flow containers in responsive viewports (tablet/mobile)
          // feel natural: temporarily absolute (forceAbsoluteDuringInteraction for move/resize), live sibling reflow,
          // drop snaps to correct flow slot.
          // Only for single-node flow moves that did not reparent (reparent remains desktop-only).
          activeInteraction.type === 'move'
          && activeInteraction.nodeIds.length === 1
          && !willReparent
        ) {
          const movedId = activeInteraction.nodeIds[0];
          // Use store.getState for freshest nodes (transient rects are live in the document).
          const storeState = useBuilderCanvasStore.getState();
          const freshNodes = storeState.document?.nodes ?? [];
          const latestNodesById = storeState.nodesById;
          const movedNode = latestNodesById.get(movedId);
          if (movedNode) {
            const isFlowLayoutItem =
              isTopLevelFlowSection(movedNode) ||
              parentUsesFlowLayout(movedNode, latestNodesById);

            if (isFlowLayoutItem) {
              const insertionIndex = getFlowSiblingInsertionIndex(
                freshNodes,
                movedId,
                latestNodesById,
                activeInteraction.viewport,
              );
              const origIndex = getFlowSiblingOriginalIndex(
                freshNodes,
                movedId,
                latestNodesById,
                activeInteraction.startRects,
                activeInteraction.viewport,
              );

              if (origIndex === -1 || origIndex === insertionIndex) {
                // No actual reorder (same slot or invalid). Restore original positions without
                // creating a history entry. Prevents position drift when user drags within a slot.
                mutationSessionController.cancel(activeInteraction.pointerId);
              } else {
                const reorderRects = computeReorderedFlowSiblingRects(
                  freshNodes,
                  movedId,
                  insertionIndex,
                  latestNodesById,
                  activeInteraction.startRects,
                  activeInteraction.viewport,
                );
                if (reorderRects.size > 0) {
                  // P0-03 Phase 2 polish: For successful inner flow-sibling reorders
                  // (not top-level sections), also reassign zIndexes scoped to the
                  // container's direct children so that childrenMap (zIndex-sorted)
                  // exactly matches the new flow order from the responsive drag preview.
                  // This is done atomically with the rect commit (one history entry).
                  const flowGroupKey = getFlowGroupKey(movedNode, latestNodesById);
                  const zIndexById =
                    flowGroupKey !== null
                      ? computeNewZIndexOrderForFlowSiblings(
                          freshNodes,
                          movedId,
                          insertionIndex,
                          latestNodesById,
                          activeInteraction.startRects,
                          activeInteraction.viewport,
                        )
                      : undefined;
                  updateNodeRectsForViewport(
                    reorderRects,
                    activeInteraction.viewport,
                    'commit',
                    zIndexById,
                  );
                } else {
                  mutationSessionController.cancel(activeInteraction.pointerId);
                }
              }
            }
          }
        }

        // A-2 Resize Parity (P0-03): Special commit path for flow layout items (inner flex/grid
        // children or top-level sections) when resizing in non-desktop responsive viewport.
        // - During resize: the node is forced absolute (see CanvasNode), transient height/y updates
        //   cause siblings to live-reflow via recomputed marginTop in computeFlowSiblingMetrics.
        // - On commit: use computeResizedFlowSiblingRects (preserves original marginTops from
        //   startRect, keeps resized's final rect, updates y of subsequent siblings) → one clean
        //   'commit' updateNodeRectsForViewport (single history entry, no drift).
        // - Desktop resize of flow children relies on native flex/grid reflow (no y overrides needed).
        // - Falls back to normal commitMutationSession only if not a responsive flow resize.
        if (
          activeInteraction.type === 'resize'
          && activeInteraction.viewport !== 'desktop'
        ) {
          const resizedId = activeInteraction.nodeId;
          const storeState = useBuilderCanvasStore.getState();
          const freshNodes = storeState.document?.nodes ?? [];
          const latestNodesById = storeState.nodesById;
          const resizedNode = latestNodesById.get(resizedId);
          if (resizedNode) {
            const isFlowLayoutItem =
              isTopLevelFlowSection(resizedNode) ||
              parentUsesFlowLayout(resizedNode, latestNodesById);

            if (isFlowLayoutItem) {
              // A-4 edge case coverage (drag + resize flow in responsive):
              // - Empty/single-child containers: no-op on siblings, just persist resized rect cleanly.
              // - Nested flow containers: each level uses its own parentId flowGroupKey independently.
              // - Mid-interaction viewport switch: use captured interaction.viewport for consistency.
              // - Undo/redo: single atomic 'commit' with all affected rects + no z change for resize.
              // - Same as drag: cancel not needed (height change always meaningful); clamps prevent <0 y.
              // - Locked / multi-select: resize is single-node only (enforced upstream in startResize).
              const startRect = activeInteraction.startRect;
              const finalRectForResized = resolveViewportRect(resizedNode, activeInteraction.viewport);
              const resizeRects = computeResizedFlowSiblingRects(
                freshNodes,
                resizedId,
                latestNodesById,
                startRect,
                finalRectForResized,
                activeInteraction.viewport,
              );
              if (resizeRects.size > 0) {
                updateNodeRectsForViewport(
                  resizeRects,
                  activeInteraction.viewport,
                  'commit',
                );
              }
            }
          }
        }

        if (activeInteraction.type !== 'pan') {
          mutationSessionController.commit(activeInteraction.pointerId);
        }
      }
      setHoveredContainerHitIfChanged(null);
      interactionGeometrySnapshotRef.current = null;
      moveInteractionSessionRef.current = null;
      moveActivationRef.current = null;
      overlapPickerClearedPointerRef.current = null;
      pendingDirectResizeRectRef.current = null;
      clearDirectResizePreviewMarkers(directResizePreviewStylesRef.current, directPreviewElementsRef.current);
      directPreviewScopeRef.current = null;
      interactionRef.current = null;
      setInteraction(null);
      setActiveViewport(null);
      setInteractionPointerIfChanged(null);
      setResizePreviewRectIfChanged(null);
      setGuidesIfChanged(guidesRef, setGuides, EMPTY_ALIGNMENT_GUIDES);
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerCancel);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
      pointerMoveCoalescer.cancel();
      moveInteractionSessionRef.current = null;
      pendingDirectMoveRectRef.current = null;
      lastDirectMoveFrameInputRef.current = null;
      pendingDirectMoveRectsRef.current = null;
      pendingDirectMoveRectsDraft.clear();
      pendingDirectMoveRectDraftsById.clear();
      pendingDirectResizeRectRef.current = null;
      clearDirectMovePreview(directPreviewNodeIds, directPreviewElements);
      restoreDirectResizePreview(directResizePreviewStyles, directPreviewElements);
      setResizePreviewRectIfChanged(null);
    };
  }, [
    absoluteRectById,
    activePanReplacementGuard,
    activeGroupId,
    captureInteractionGeometry,
    childrenMap,
    getDirectPreviewScopeRoot,
    gridSnapSize,
    interaction,
    moveNodeIntoContainer,
    mutationSessionController,
    nodesById,
    onToast,
    referenceGuides,
    setContextMenu,
    setHoveredContainerHitIfChanged,
    setInteractionPointerIfChanged,
    setOverlapPicker,
    setActiveViewport,
    setResizePreviewRectIfChanged,
    setSelectedNodeIds,
    setZoomState,
    stageHeight,
    stageWidth,
    rootVisibleNodes,
    updateNodeRectsForViewport,
    updateSingleNodeRectForViewport,
    visibleContainerNodes,
    viewportRef,
    zoomState.zoom,
  ]);

  const startPan = useCallback((event: React.PointerEvent) => {
    const previousInteraction = interactionRef.current;
    if (previousInteraction && previousInteraction.pointerId !== event.pointerId) {
      canceledInteractionPointerIdsRef.current.add(previousInteraction.pointerId);
    }
    setContextMenu(null);
    setOverlapPicker(null);
    setSelectionBox(null);
    interactionGeometrySnapshotRef.current = null;
    moveInteractionSessionRef.current = null;
    moveActivationRef.current = null;
    overlapPickerClearedPointerRef.current = null;
    pendingDirectMoveRectRef.current = null;
    lastDirectMoveFrameInputRef.current = null;
    pendingDirectMoveRectsRef.current = null;
    pendingDirectMoveRectsDraftRef.current.clear();
    pendingDirectMoveRectDraftsByIdRef.current.clear();
    pendingDirectResizeRectRef.current = null;
    clearDirectMovePreview(directPreviewNodeIdsRef.current, directPreviewElementsRef.current);
    restoreDirectResizePreview(directResizePreviewStylesRef.current, directPreviewElementsRef.current);
    directPreviewScopeRef.current = null;
    mutationSessionController.cancel();
    setHoveredContainerHitIfChanged(null);
    setResizePreviewRectIfChanged(null);
    lastPublishedPanRef.current = { x: zoomState.panX, y: zoomState.panY };
    activePanReplacementGuard.begin(event.pointerId, zoomState);
    setInteraction({
      type: 'pan',
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      startPanX: zoomState.panX,
      startPanY: zoomState.panY,
    });
  }, [activePanReplacementGuard, mutationSessionController, setContextMenu, setHoveredContainerHitIfChanged, setOverlapPicker, setResizePreviewRectIfChanged, setSelectionBox, zoomState]);

  const startMove = useCallback((nodeId: string, event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const previousInteraction = interactionRef.current;
    if (previousInteraction && previousInteraction.pointerId !== event.pointerId) {
      canceledInteractionPointerIdsRef.current.add(previousInteraction.pointerId);
    }
    if (previousInteraction?.type === 'pan') {
      activePanReplacementGuard.finish(previousInteraction.pointerId);
    }
    mutationSessionController.cancel(previousInteraction?.pointerId);
    const hitNodeId = event.target instanceof HTMLElement
      ? event.target.closest<HTMLElement>('[data-node-id]')?.dataset.nodeId ?? nodeId
      : nodeId;
    const additive = event.metaKey || event.ctrlKey || event.shiftKey;
    const moveNodeId = resolveSelectedDomMoveTargetId(
      nodeId,
      event.target,
      additive,
    );
    const clickSelectionNodeId = resolveUnactivatedMoveSelectionId(
      hitNodeId,
      moveNodeId,
      nodesById.get(hitNodeId)?.kind,
      {
        additive,
        pointerType: event.pointerType,
        selectedNodeCount: selectedNodeIds.length,
        moveNodeSelected: selectedNodeIdSet.has(moveNodeId),
      },
    );
    setContextMenu(null);
    setOverlapPicker((current) => (current?.mode === 'list' ? null : current));
    overlapPickerClearedPointerRef.current = null;
    moveInteractionSessionRef.current = null;
    pendingDirectMoveRectRef.current = null;
    lastDirectMoveFrameInputRef.current = null;
    pendingDirectMoveRectsRef.current = null;
    pendingDirectMoveRectsDraftRef.current.clear();
    pendingDirectMoveRectDraftsByIdRef.current.clear();
    pendingDirectResizeRectRef.current = null;
    clearDirectMovePreview(directPreviewNodeIdsRef.current, directPreviewElementsRef.current);
    restoreDirectResizePreview(directResizePreviewStylesRef.current, directPreviewElementsRef.current);
    setHoveredContainerHitIfChanged(null);
    setResizePreviewRectIfChanged(null);
    const nodeIds = getUnlockedMoveNodeIds(moveNodeId, selectedNodeIds, selectedNodeIdSet, nodesById);
    if (nodeIds.length === 0) {
      directPreviewScopeRef.current = null;
      return;
    }
    directPreviewScopeRef.current = viewportRef.current
      ? { renderKey: interactionResetKey, root: viewportRef.current }
      : null;
    const nodeIdSet = nodeIds === selectedNodeIds ? selectedNodeIdSet : new Set(nodeIds);
    const interactionViewport = currentViewport;
    const { startRects, startAbsoluteRects } = buildMoveStartRectRecords(
      nodeIds,
      nodesById,
      absoluteRectById,
      interactionViewport,
    );
    const snapBounds = {
      x: 0,
      y: 0,
      width: stageWidth,
      height: stageHeight,
    };
    const currentSelection = useBuilderCanvasStore.getState();
    if (!isSameMoveSelection(currentSelection.selectedNodeIds, currentSelection.selectedNodeId, nodeIds, moveNodeId)) {
      setSelectedNodeIds(nodeIds, moveNodeId);
    }
    setActiveViewport(interactionViewport);
    moveActivationRef.current = { pointerId: event.pointerId, active: false };
    setInteractionPointerIfChanged(null);
    const nextInteraction: MoveInteraction = {
      type: 'move',
      nodeId: moveNodeId,
      ...(clickSelectionNodeId ? { clickSelectionNodeId } : {}),
      nodeIds,
      nodeIdSet,
      canDirectPreview: canUseDirectMovePreview(nodeIds, nodesById),
      viewport: interactionViewport,
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      startParentId: nodesById.get(moveNodeId)?.parentId ?? null,
      startRects,
      startAbsoluteRects,
      snapBounds,
      snapRects: [],
      snapEdges: [],
      containerHitRects: [],
    };
    interactionGeometrySnapshotRef.current = null;
    setInteraction(nextInteraction);
  }, [
    absoluteRectById,
    activePanReplacementGuard,
    currentViewport,
    interactionResetKey,
    mutationSessionController,
    nodesById,
    selectedNodeIdSet,
    selectedNodeIds,
    setContextMenu,
    setOverlapPicker,
    setActiveViewport,
    setHoveredContainerHitIfChanged,
    setInteractionPointerIfChanged,
    setSelectedNodeIds,
    setResizePreviewRectIfChanged,
    stageHeight,
    stageWidth,
    viewportRef,
  ]);

  const startResize = useCallback((nodeId: string, handle: ResizeHandle, event: React.PointerEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const previousInteraction = interactionRef.current;
    if (previousInteraction && previousInteraction.pointerId !== event.pointerId) {
      canceledInteractionPointerIdsRef.current.add(previousInteraction.pointerId);
    }
    if (previousInteraction?.type === 'pan') {
      activePanReplacementGuard.finish(previousInteraction.pointerId);
    }
    setOverlapPicker(null);
    moveActivationRef.current = null;
    overlapPickerClearedPointerRef.current = null;
    moveInteractionSessionRef.current = null;
    pendingDirectMoveRectRef.current = null;
    lastDirectMoveFrameInputRef.current = null;
    pendingDirectMoveRectsRef.current = null;
    pendingDirectMoveRectsDraftRef.current.clear();
    pendingDirectMoveRectDraftsByIdRef.current.clear();
    pendingDirectResizeRectRef.current = null;
    clearDirectMovePreview(directPreviewNodeIdsRef.current, directPreviewElementsRef.current);
    restoreDirectResizePreview(directResizePreviewStylesRef.current, directPreviewElementsRef.current);
    setHoveredContainerHitIfChanged(null);
    setResizePreviewRectIfChanged(null);
    const targetNode = nodesById.get(nodeId);
    if (!targetNode) {
      directPreviewScopeRef.current = null;
      return;
    }
    directPreviewScopeRef.current = viewportRef.current
      ? { renderKey: interactionResetKey, root: viewportRef.current }
      : null;
    const interactionViewport = currentViewport;
    setSelectedNodeId(nodeId);
    setActiveViewport(interactionViewport);
    interactionGeometrySnapshotRef.current = captureInteractionGeometry();
    mutationSessionController.begin(event.pointerId);
    const viewportRect = viewportRef.current?.getBoundingClientRect();
    const viewportOriginX = viewportRect?.left ?? 0;
    const viewportOriginY = viewportRect?.top ?? 0;
    setInteractionPointerIfChanged({
      x: event.clientX - viewportOriginX,
      y: event.clientY - viewportOriginY,
    });
    setInteraction({
      type: 'resize',
      nodeId,
      handle,
      viewport: interactionViewport,
      pointerId: event.pointerId,
      originX: event.clientX,
      originY: event.clientY,
      viewportOriginX,
      viewportOriginY,
      startRect: resolveViewportRect(targetNode, interactionViewport),
      startAbsoluteRect: absoluteRectById.get(nodeId) ?? resolveViewportRect(targetNode, interactionViewport),
      snapRects: buildResizeSnapRects({
        absoluteRectById,
        nodesById,
        resizingNodeId: nodeId,
        viewport: interactionViewport,
      }),
    });
  }, [
    absoluteRectById,
    activePanReplacementGuard,
    captureInteractionGeometry,
    currentViewport,
    interactionResetKey,
    mutationSessionController,
    nodesById,
    setOverlapPicker,
    setActiveViewport,
    setHoveredContainerHitIfChanged,
    setInteractionPointerIfChanged,
    setResizePreviewRectIfChanged,
    setSelectedNodeId,
    viewportRef,
  ]);

  return {
    guides,
    hoveredContainerId,
    interaction,
    interactionPointer,
    isSpacePressed,
    resizePreviewRect,
    startMove,
    startPan,
    startResize,
  };
}
