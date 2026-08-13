import type { BuilderCanvasNode } from './types';
import {
  resolveViewportHidden,
  resolveViewportRect,
  type Viewport,
} from '@/lib/builder/canvas/responsive';
import {
  buildChildrenMap,
  parentUsesFlowLayout,
  resolveCanvasNodeAbsoluteRect,
  resolveCanvasNodeAbsoluteRectForViewport,
} from './tree';

type CanvasRect = BuilderCanvasNode['rect'];
type ResolvedFlowSiblingEntry = {
  node: BuilderCanvasNode;
  y: number;
  height: number;
};

export const CANONICAL_DECOMPOSED_HOME_FLOW_SECTION_IDS = [
  'home-hero-root',
  'home-insights-root',
  'home-services-root',
  'home-attorney-root',
  'home-case-results-root',
  'home-stats-root',
  'home-faq-root',
  'home-offices-root',
  'home-contact-root',
] as const;

type FlowSectionMetric = { marginTop: number; minHeight: number };

function effectiveRect(node: BuilderCanvasNode, viewport?: Viewport): CanvasRect {
  return viewport ? resolveViewportRect(node, viewport) : node.rect;
}

function withRect(node: BuilderCanvasNode, rect: CanvasRect): BuilderCanvasNode {
  return { ...node, rect } as BuilderCanvasNode;
}

function compareFlowNodes(left: BuilderCanvasNode, right: BuilderCanvasNode): number {
  return left.rect.y - right.rect.y ||
    left.zIndex - right.zIndex ||
    left.id.localeCompare(right.id);
}

function compareFlowNodesForViewport(
  left: BuilderCanvasNode,
  right: BuilderCanvasNode,
  viewport?: Viewport,
): number {
  const leftRect = effectiveRect(left, viewport);
  const rightRect = effectiveRect(right, viewport);
  return leftRect.y - rightRect.y ||
    left.zIndex - right.zIndex ||
    left.id.localeCompare(right.id);
}

function hasCanonicalDecomposedHomeSectionOrder(sections: readonly BuilderCanvasNode[]): boolean {
  for (let index = 0; index < sections.length; index += 1) {
    if (sections[index]?.id !== CANONICAL_DECOMPOSED_HOME_FLOW_SECTION_IDS[index]) return false;
  }
  return true;
}

function isFloatingHeroOverlayNode(section: BuilderCanvasNode, node: BuilderCanvasNode): boolean {
  return section.id === 'home-hero-root' && (
    node.id === 'home-hero-search-wrapper' ||
    node.id === 'home-hero-quick-menu' ||
    node.id.startsWith('home-hero-quick-menu-item-') ||
    node.id === 'home-hero-scroll-arrow'
  );
}

export function isCollapsedServicesAccordionDetailNode(node: BuilderCanvasNode): boolean {
  return /^home-services-card-\d+-(?:body|checklist|columns|columns-list|more|detail-\d+|column-\d+|columns-label)$/.test(node.id);
}

function isCollapsedSectionHiddenNode(section: BuilderCanvasNode, node: BuilderCanvasNode): boolean {
  return section.id === 'home-services-root' && isCollapsedServicesAccordionDetailNode(node);
}

function resolveSectionContentHeight(
  section: BuilderCanvasNode,
  nodesById: Map<string, BuilderCanvasNode>,
  childrenMap: Record<string, string[]>,
  viewport?: Viewport,
  respectViewportVisibility = false,
): number {
  const sectionRect = viewport
    ? resolveCanvasNodeAbsoluteRectForViewport(section, nodesById, viewport)
    : resolveCanvasNodeAbsoluteRect(section, nodesById);
  let contentBottom = sectionRect.y + sectionRect.height;
  const stack = [...(childrenMap[section.id] ?? [])];

  while (stack.length > 0) {
    const descendantId = stack.pop();
    if (!descendantId) continue;
    const descendant = nodesById.get(descendantId);
    if (!descendant || isFloatingHeroOverlayNode(section, descendant)) continue;
    if (isCollapsedSectionHiddenNode(section, descendant)) continue;
    if (
      respectViewportVisibility &&
      resolveViewportHidden(descendant, viewport ?? 'desktop')
    ) continue;
    const childIds = childrenMap[descendantId];
    if (childIds) stack.push(...childIds);
    if (descendant.visible === false) continue;
    const descendantRect = viewport
      ? resolveCanvasNodeAbsoluteRectForViewport(descendant, nodesById, viewport)
      : resolveCanvasNodeAbsoluteRect(descendant, nodesById);
    contentBottom = Math.max(contentBottom, descendantRect.y + descendantRect.height);
  }

  return Math.max(1, Math.ceil(contentBottom - sectionRect.y));
}

/**
 * Returns true if the node is a top-level page section that should participate
 * in document flow layout. Older seeded pages use top-level `container` nodes
 * with `as: "section"` for decomposed home sections, while newer generic
 * sections may use `composite`.
 */
export function isTopLevelFlowSection(node: BuilderCanvasNode): boolean {
  if (node.parentId) return false;
  if (node.kind === 'composite') return true;
  const content = node.content as { as?: unknown };
  return content.as === 'section';
}

/**
 * ZH-Hant (and standalone) CSS swap overlays. They stay in the published DOM
 * so media queries can show them, but they are not extra flow siblings — their
 * authored y stack starts at 0 and would otherwise break the 9-root home.
 */
export function isCssParityOverlayFlowSection(node: BuilderCanvasNode): boolean {
  return typeof node.anchorName === 'string' && node.anchorName.startsWith('mobile-parity-');
}

function resolveCanonicalDecomposedHomeFlowSections(
  nodes: readonly BuilderCanvasNode[],
  viewport?: Viewport,
): BuilderCanvasNode[] | null {
  const visibilityViewport = viewport ?? 'desktop';
  const flowSections: BuilderCanvasNode[] = [];

  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    if (!isTopLevelFlowSection(node) || isCssParityOverlayFlowSection(node)) continue;
    flowSections.push(node);
  }

  if (flowSections.length !== CANONICAL_DECOMPOSED_HOME_FLOW_SECTION_IDS.length) return null;
  if (flowSections.some((section) => resolveViewportHidden(section, visibilityViewport))) return null;

  const desktopOrderedSections = [...flowSections]
    .sort((left, right) => compareFlowNodesForViewport(left, right));
  if (!hasCanonicalDecomposedHomeSectionOrder(desktopOrderedSections)) return null;

  if (!viewport || viewport === 'desktop') return desktopOrderedSections;

  const viewportOrderedSections = [...flowSections]
    .sort((left, right) => compareFlowNodesForViewport(left, right, viewport));
  if (!hasCanonicalDecomposedHomeSectionOrder(viewportOrderedSections)) return null;

  return viewportOrderedSections;
}

/**
 * Recognizes only the intact editable home stack. Reordered roots, hidden
 * roots, or an added flow section deliberately fall back to the generic flow
 * model so custom/freeform pages retain their authored geometry.
 */
export function isCanonicalDecomposedHomeFlowStack(
  nodes: readonly BuilderCanvasNode[],
  viewport?: Viewport,
): boolean {
  return resolveCanonicalDecomposedHomeFlowSections(nodes, viewport) !== null;
}

/**
 * The single source of truth for ordering top-level page nodes into DOM paint
 * order. Used by BOTH the published renderer (public-page.tsx) and the editor
 * stage (CanvasStageNodes.tsx) so the two can never drift apart.
 *
 * Rule: flow (composite / `as: section`) nodes are emitted first in
 * document-flow order (rect.y ASC, then zIndex ASC); absolute non-flow
 * widgets are emitted afterwards. Because later DOM siblings win ties when
 * z-indexes match, emitting a non-flow widget AFTER the sections that
 * surround it guarantees the widget paints ON TOP instead of being covered
 * by the next section's relative stacking context. This is the guard against
 * the "node placed between two page sections gets hidden" regression
 * (2026-07-02). Pair with the positive baseline z-index assigned to top-level
 * absolute nodes at render time.
 */
export function compareTopLevelStacking(
  left: BuilderCanvasNode,
  right: BuilderCanvasNode,
): number {
  const leftIsComposite = isTopLevelFlowSection(left);
  const rightIsComposite = isTopLevelFlowSection(right);
  if (leftIsComposite && rightIsComposite) {
    return left.rect.y - right.rect.y || left.zIndex - right.zIndex;
  }
  if (leftIsComposite && !rightIsComposite) return -1;
  if (!leftIsComposite && rightIsComposite) return 1;
  return left.rect.y - right.rect.y || left.zIndex - right.zIndex;
}

/**
 * Generalized computation of marginTop / minHeight metrics for a group of
 * "flow siblings" — nodes that share the same flow parent context.
 * Examples:
 *  - Top-level composites (document flow sections)
 *  - Direct children of a container whose layoutMode is 'flex' or 'grid'
 *
 * When `viewport` is provided (and not 'desktop'), uses resolveViewportRect
 * so that responsive y/height overrides are respected for Live Reflow Preview
 * in Tablet/Mobile viewports (P0-03).
 *
 * This powers both editor rendering (marginTop style) and the published
 * responsive gap stylesheet generation.
 */
export function computeFlowSiblingMetrics(
  siblings: BuilderCanvasNode[],
  viewport?: Viewport,
): Map<string, FlowSectionMetric> {
  if (!siblings || siblings.length === 0) return new Map();

  const metrics = new Map<string, { marginTop: number; minHeight: number }>();
  if (siblings.length === 1) {
    const node = siblings[0];
    const rect = viewport ? resolveViewportRect(node, viewport) : node.rect;
    metrics.set(node.id, {
      marginTop: Math.max(0, rect.y),
      minHeight: rect.height,
    });
    return metrics;
  }

  const resolvedEntries = new Array<ResolvedFlowSiblingEntry>(siblings.length);
  for (let index = 0; index < siblings.length; index += 1) {
    const node = siblings[index];
    const rect = viewport ? resolveViewportRect(node, viewport) : node.rect;
    resolvedEntries[index] = { node, y: rect.y, height: rect.height };
  }
  resolvedEntries.sort((left, right) =>
    left.y - right.y
    || left.node.zIndex - right.node.zIndex
    || left.node.id.localeCompare(right.node.id),
  );

  let previousFlowBottom = 0;

  for (let index = 0; index < resolvedEntries.length; index += 1) {
    const entry = resolvedEntries[index];
    const marginTop = Math.max(0, entry.y - previousFlowBottom);
    metrics.set(entry.node.id, {
      marginTop,
      minHeight: entry.height,
    });
    previousFlowBottom = Math.max(
      previousFlowBottom + marginTop + entry.height,
      entry.y + entry.height
    );
  }

  return metrics;
}

/**
 * Computes marginTop and minHeight for each top-level composite section
 * so that Editor can render them with flow-based stacking (position:relative,
 * width:100%, marginTop) that matches Published exactly.
 *
 * Delegates to the generalized computeFlowSiblingMetrics (with optional
 * viewport support for responsive-in-flow).
 */
export function computeTopLevelFlowSectionMetrics(
  nodes: BuilderCanvasNode[],
  viewport?: Viewport,
): Map<string, FlowSectionMetric> {
  const nodesById = new Map<string, BuilderCanvasNode>();
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    nodesById.set(node.id, node);
  }

  return computeTopLevelFlowSectionMetricsFromIndex({
    childrenMap: buildChildrenMap(nodes),
    nodes,
    nodesById,
    viewport,
  });
}

export function computeTopLevelFlowSectionMetricsFromIndex({
  childrenMap,
  nodes,
  nodesById,
  viewport,
}: {
  childrenMap: Record<string, string[]>;
  nodes: readonly BuilderCanvasNode[];
  nodesById: Map<string, BuilderCanvasNode>;
  viewport?: Viewport;
}): Map<string, FlowSectionMetric> {
  // `CanvasStageNodes` supplies its base-visible node list together with a
  // caller-owned full index. Recognize against the full index so a hidden
  // custom flow root cannot masquerade as the exact nine-root home, while the
  // generic metric path below still uses only rendered nodes.
  const canonicalHomeSections = resolveCanonicalDecomposedHomeFlowSections(
    [...nodesById.values()],
    viewport,
  );
  if (canonicalHomeSections) {
    const metrics = new Map<string, FlowSectionMetric>();
    for (let index = 0; index < canonicalHomeSections.length; index += 1) {
      const section = canonicalHomeSections[index];
      const rect = effectiveRect(section, viewport);
      metrics.set(section.id, {
        // The canonical home is a single continuous page stack. Its authored
        // y values are editor anchors, not intentional whitespace once a
        // descendant expands a preceding section's effective height.
        marginTop: 0,
        minHeight: Math.max(
          rect.height,
          resolveSectionContentHeight(section, nodesById, childrenMap, viewport, true),
        ),
      });
    }
    return metrics;
  }

  const flowTopLevelCompositeNodes: BuilderCanvasNode[] = [];
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    if (node.parentId || !isTopLevelFlowSection(node) || isCssParityOverlayFlowSection(node)) continue;
    const rect = effectiveRect(node, viewport);
    flowTopLevelCompositeNodes.push(withRect(node, {
      ...rect,
      height: Math.max(rect.height, resolveSectionContentHeight(node, nodesById, childrenMap, viewport)),
    }));
  }

  return computeFlowSiblingMetrics(flowTopLevelCompositeNodes);
}

function resolveAbsoluteNonFlowContentBottom(
  nodes: readonly BuilderCanvasNode[],
  nodesById: Map<string, BuilderCanvasNode>,
  childrenMap: Record<string, string[]>,
  viewport: Viewport,
): number {
  let contentBottom = 0;
  const visited = new Set<string>();

  for (let index = 0; index < nodes.length; index += 1) {
    const rootNode = nodes[index];
    if (rootNode.parentId || isTopLevelFlowSection(rootNode)) continue;

    const stack = [rootNode.id];
    while (stack.length > 0) {
      const nodeId = stack.pop();
      if (!nodeId || visited.has(nodeId)) continue;
      visited.add(nodeId);
      const node = nodesById.get(nodeId);
      if (!node || resolveViewportHidden(node, viewport)) continue;

      const rect = resolveCanvasNodeAbsoluteRectForViewport(node, nodesById, viewport);
      contentBottom = Math.max(contentBottom, rect.y + rect.height);

      const childIds = childrenMap[nodeId];
      if (childIds) stack.push(...childIds);
    }
  }

  return Math.max(0, Math.ceil(contentBottom));
}

/**
 * The document model has one shared stageHeight, which may be a mobile floor.
 * For the intact decomposed home, derive the editor stage independently for
 * each viewport from the continuous flow stack plus any absolute/freeform
 * content. Every other page keeps the authored document height unchanged.
 */
export function computeEffectiveViewportStageHeight({
  childrenMap: providedChildrenMap,
  fallbackStageHeight,
  nodes,
  nodesById: providedNodesById,
  viewport,
}: {
  childrenMap?: Record<string, string[]>;
  fallbackStageHeight: number;
  nodes: BuilderCanvasNode[];
  nodesById?: Map<string, BuilderCanvasNode>;
  viewport: Viewport;
}): number {
  const normalizedFallbackHeight = Number.isFinite(fallbackStageHeight)
    ? Math.max(1, Math.ceil(fallbackStageHeight))
    : 1;
  const canonicalHomeSections = resolveCanonicalDecomposedHomeFlowSections(nodes, viewport);
  if (!canonicalHomeSections) return normalizedFallbackHeight;

  const nodesById = providedNodesById ?? new Map(nodes.map((node) => [node.id, node]));
  const childrenMap = providedChildrenMap ?? buildChildrenMap(nodes);
  let flowStackHeight = 0;

  for (let index = 0; index < canonicalHomeSections.length; index += 1) {
    const section = canonicalHomeSections[index];
    const rect = effectiveRect(section, viewport);
    flowStackHeight += Math.max(
      rect.height,
      resolveSectionContentHeight(section, nodesById, childrenMap, viewport, true),
    );
  }

  return Math.max(
    1,
    Math.ceil(flowStackHeight),
    resolveAbsoluteNonFlowContentBottom(nodes, nodesById, childrenMap, viewport),
  );
}

/**
 * Computes the live insertion index for a top-level flow section (composite
 * with no parentId) that is currently being dragged.
 *
 * Purpose: Enables "Live Sibling Reflow Preview" (P0-02.2.2) — while the user
 * drags a section, this tells the UI exactly where in the vertical flow order
 * the dragged section would land if released now. This index is the foundation
 * for rendering a visual preview gap / drop indicator between sibling sections
 * (next micro-step) and for performing the actual reorder + y-recalculation on
 * drop (later step).
 *
 * How it works:
 * - The `nodes` list is the current document nodes; during a drag the store
 *   has already applied the transient (live) `rect.y` to the dragged node.
 * - Only top-level composites participate in flow ordering (same rule as
 *   `isTopLevelFlowSection` and `computeTopLevelFlowSectionMetrics`).
 * - The remaining flow sections are sorted by the canonical order key:
 *     rect.y ASC, zIndex ASC, id ASC (localeCompare) for stability.
 * - The dragged node's *current* rect.y (plus its zIndex/id for tie-breaking)
 *   is located in that sorted order.
 * - Returns the 0-based index the dragged section would occupy in the final
 *   ordered list of flow sections. This is also the insertion index you would
 *   use with `splice(insertionIndex, 0, draggedId)` on the list of the *other*
 *   flow sections (0 = before the first, N = after the last).
 *
 * The function is pure, has no side effects, and is safe to call on every
 * pointer move frame during drag.
 */
export function getFlowSectionInsertionIndex(
  nodes: BuilderCanvasNode[],
  draggedNodeId: string
): number {
  const flowSections = nodes.filter(isTopLevelFlowSection);

  // Locate the dragged node among flow sections (it must have a transient rect.y)
  const draggedIndexInFlow = flowSections.findIndex((n) => n.id === draggedNodeId);
  if (draggedIndexInFlow === -1) {
    // Dragged node is not a top-level flow section — not applicable for reflow.
    return 0;
  }

  // Sort a copy using the exact same comparator used for flow layout everywhere.
  const sorted = [...flowSections].sort((left, right) =>
    left.rect.y - right.rect.y
    || left.zIndex - right.zIndex
    || left.id.localeCompare(right.id),
  );

  // The position of the dragged node in the sorted list *is* the insertion index.
  // Because the transient y is already on the node object, this reflects live drag position.
  return sorted.findIndex((n) => n.id === draggedNodeId);
}

/**
 * Computes the original flow insertion index of a top-level flow section
 * using its *start* rect (pre-drag y) instead of the current (possibly transient)
 * rect. Used to detect "no actual reorder" (same slot) on drop for clean
 * undo/redo (no spurious history entry) and to prevent position drift.
 */
export function getFlowSectionOriginalIndex(
  nodes: BuilderCanvasNode[],
  draggedNodeId: string,
  startRects?: Record<string, BuilderCanvasNode['rect']>
): number {
  const flowSections = nodes.filter(isTopLevelFlowSection);
  const draggedCurrent = flowSections.find((n) => n.id === draggedNodeId);
  if (!draggedCurrent) return -1;

  const draggedStartRect = startRects?.[draggedNodeId] ?? draggedCurrent.rect;

  const origSortable = flowSections.map((n) =>
    n.id === draggedNodeId
      ? ({ ...n, rect: { ...n.rect, y: draggedStartRect.y } } as BuilderCanvasNode)
      : n
  );
  const originalSorted = [...origSortable].sort((left, right) =>
    left.rect.y - right.rect.y ||
    left.zIndex - right.zIndex ||
    left.id.localeCompare(right.id)
  );

  return originalSorted.findIndex((n) => n.id === draggedNodeId);
}

/**
 * 2-2.3 (completed): On drag end for a top-level flow section, compute the final
 * rect.y updates so the dragged section moves to the target slot (from live
 * insertionIndex), and ALL flow sections are re-positioned into a clean vertical
 * stack using the *original* per-section marginTops (computed via
 * computeTopLevelFlowSectionMetrics on pre-drag state).
 *
 * This is the refined 2-2.3.2 logic:
 * - Each section "carries" its original marginTop (the visual gap above it).
 * - New order is built by removing dragged and inserting at targetIndex.
 * - y positions are rebuilt from top by stacking: newY = prevBottom + marginTop_of_this_section.
 * - This preserves original inter-section gaps as much as possible (marginTops travel with sections).
 * - Dragged section always lands at a *natural flow y* for its new slot (not the raw mouse y).
 * - If target slot == original slot, the result y's exactly match start positions (no drift).
 *
 * Only flow sections (top-level composites) are returned in the map; non-flow
 * top-level nodes are untouched. The map is then applied with 'commit' mode
 * (one history entry) or cancelled (no-op case) in useCanvasInteractions.
 *
 * startRects recovers the original y/height of the dragged node.
 */
export function computeReorderedFlowSectionRects(
  nodes: BuilderCanvasNode[],
  draggedNodeId: string,
  insertionIndex: number,
  startRects?: Record<string, BuilderCanvasNode['rect']>
): Map<string, BuilderCanvasNode['rect']> {
  const flowSections = nodes.filter(isTopLevelFlowSection);
  const draggedCurrent = flowSections.find((n) => n.id === draggedNodeId);
  if (!draggedCurrent) return new Map();

  const draggedStartRect = startRects?.[draggedNodeId] ?? draggedCurrent.rect;
  const draggedHeight = draggedStartRect.height;

  // Build original metrics (marginTop per section) using pre-drag positions.
  // We temporarily swap the dragged rect to its start rect for metric computation.
  const metricsSource = nodes.map((n) =>
    n.id === draggedNodeId
      ? ({ ...n, rect: draggedStartRect } as BuilderCanvasNode)
      : n
  );
  const originalMetrics = computeTopLevelFlowSectionMetrics(metricsSource);

  // Original order (with dragged at its start y for stable sort)
  const origSortable = flowSections.map((n) =>
    n.id === draggedNodeId
      ? ({ ...n, rect: { ...n.rect, y: draggedStartRect.y } } as BuilderCanvasNode)
      : n
  );
  const originalSorted = [...origSortable].sort((left, right) =>
    left.rect.y - right.rect.y ||
    left.zIndex - right.zIndex ||
    left.id.localeCompare(right.id)
  );

  const targetIndex = Math.max(0, Math.min(originalSorted.length, insertionIndex));

  // Build new order: others keep their relative order, insert dragged at target slot.
  const others = originalSorted.filter((n) => n.id !== draggedNodeId);
  const insertPos = Math.max(0, Math.min(others.length, targetIndex));
  const newOrder: BuilderCanvasNode[] = [...others];
  // Use a representative object for the dragged (zIndex/id matter only for sort, not here)
  newOrder.splice(insertPos, 0, draggedCurrent);

  // Rebuild y positions from top, carrying each section's original marginTop.
  const newRects = new Map<string, BuilderCanvasNode['rect']>();
  let previousFlowBottom = 0;

  for (const section of newOrder) {
    const id = section.id;
    const isDragged = id === draggedNodeId;
    const height = isDragged ? draggedHeight : section.rect.height;
    const metric = originalMetrics.get(id);
    const marginTop = metric ? metric.marginTop : 0;

    const newY = previousFlowBottom + marginTop;

    const baseRect = isDragged ? draggedStartRect : section.rect;
    const newRect: BuilderCanvasNode['rect'] = {
      ...baseRect,
      y: Math.max(0, newY),
    };
    newRects.set(id, newRect);

    previousFlowBottom = Math.max(
      previousFlowBottom + marginTop + height,
      newY + height
    );
  }

  return newRects;
}

/**
 * Returns the flow group identifier for drag/reorder purposes:
 * - `null` for top-level flow sections
 * - the parent container's id (string) for direct children of a flex/grid container
 * - `null` otherwise (not a flow-layout participant for drag)
 *
 * This enables unified drag behavior for both top-level sections (P0-02)
 * and inner flow children (P0-03 responsive-in-flow drag support).
 */
export function getFlowGroupKey(
  node: BuilderCanvasNode,
  nodesById: Map<string, BuilderCanvasNode>,
): string | null {
  if (isTopLevelFlowSection(node)) return null;
  if (parentUsesFlowLayout(node, nodesById)) return node.parentId ?? null;
  return null;
}

/**
 * Returns the list of sibling nodes that participate in the same flow group.
 * - For `flowGroupKey === null`: top-level page sections
 * - For string key: visible direct children of the container with that id
 *   (caller is responsible for ensuring the container actually uses flex/grid)
 */
export function getFlowSiblings(
  nodes: BuilderCanvasNode[],
  flowGroupKey: string | null,
): BuilderCanvasNode[] {
  if (flowGroupKey === null) {
    return nodes.filter(isTopLevelFlowSection);
  }
  return nodes.filter((n) => n.parentId === flowGroupKey && n.visible !== false);
}

/**
 * Generalized version of getFlowSectionInsertionIndex that works for any
 * flow group (top-level sections or direct children inside a flex/grid container).
 *
 * Used during drag to compute live insertion slot for natural reflow on commit.
 */
export function getFlowSiblingInsertionIndex(
  nodes: BuilderCanvasNode[],
  draggedNodeId: string,
  nodesById: Map<string, BuilderCanvasNode>,
  viewport?: Viewport,
): number {
  const draggedNode = nodes.find((n) => n.id === draggedNodeId);
  if (!draggedNode) return 0;

  const flowGroupKey = getFlowGroupKey(draggedNode, nodesById);
  const siblings = getFlowSiblings(nodes, flowGroupKey);

  if (siblings.length === 0) return 0;

  const draggedInGroup = siblings.find((n) => n.id === draggedNodeId);
  if (!draggedInGroup) return 0;

  // Sort using same canonical order key as computeFlowSiblingMetrics.
  const sorted = siblings
    .map((sibling) => withRect(sibling, effectiveRect(sibling, viewport)))
    .sort(compareFlowNodes);

  return sorted.findIndex((n) => n.id === draggedNodeId);
}

/**
 * Generalized version of getFlowSectionOriginalIndex for any flow group.
 * Recovers pre-drag insertion index using startRects for the dragged node.
 */
export function getFlowSiblingOriginalIndex(
  nodes: BuilderCanvasNode[],
  draggedNodeId: string,
  nodesById: Map<string, BuilderCanvasNode>,
  startRects?: Record<string, BuilderCanvasNode['rect']>,
  viewport?: Viewport,
): number {
  const draggedNodeForKey = nodes.find((n) => n.id === draggedNodeId);
  const flowGroupKey = draggedNodeForKey ? getFlowGroupKey(draggedNodeForKey, nodesById) : null;
  const siblings = getFlowSiblings(nodes, flowGroupKey);

  const draggedCurrent = siblings.find((n) => n.id === draggedNodeId);
  if (!draggedCurrent) return -1;

  const draggedStartRect = startRects?.[draggedNodeId] ?? draggedCurrent.rect;

  const origSortable = siblings.map((n) =>
    withRect(n, n.id === draggedNodeId ? draggedStartRect : effectiveRect(n, viewport))
  );

  const originalSorted = [...origSortable].sort(compareFlowNodes);

  return originalSorted.findIndex((n) => n.id === draggedNodeId);
}

/**
 * Generalized version of computeReorderedFlowSectionRects for any flow group
 * (top-level or inner flex/grid children).
 *
 * On commit for a flow drag in responsive (or desktop), this produces the
 * final rects (primarily updated .y) so the dragged node lands at the natural
 * flow position for its insertion slot, and siblings are restacked preserving
 * their original marginTop gaps (computed from pre-drag state).
 *
 * This makes drop "snap" cleanly without position drift, exactly as for
 * top-level flow sections.
 */
export function computeReorderedFlowSiblingRects(
  nodes: BuilderCanvasNode[],
  draggedNodeId: string,
  insertionIndex: number,
  nodesById: Map<string, BuilderCanvasNode>,
  startRects?: Record<string, BuilderCanvasNode['rect']>,
  viewport?: Viewport,
): Map<string, BuilderCanvasNode['rect']> {
  const draggedNodeForKey = nodes.find((n) => n.id === draggedNodeId);
  const flowGroupKey = draggedNodeForKey ? getFlowGroupKey(draggedNodeForKey, nodesById) : null;
  const siblings = getFlowSiblings(nodes, flowGroupKey);
  const draggedCurrent = siblings.find((n) => n.id === draggedNodeId);
  if (!draggedCurrent) return new Map();

  const draggedStartRect = startRects?.[draggedNodeId] ?? draggedCurrent.rect;

  // Build original metrics using pre-drag rect for the dragged (via computeFlowSiblingMetrics)
  const flowSiblingsForMetrics = siblings.map((n) =>
    withRect(n, n.id === draggedNodeId ? draggedStartRect : effectiveRect(n, viewport))
  );
  const originalMetrics = computeFlowSiblingMetrics(flowSiblingsForMetrics);

  // Original order snapshot (with dragged at start y)
  const origSortable = siblings.map((n) =>
    withRect(n, n.id === draggedNodeId ? draggedStartRect : effectiveRect(n, viewport))
  );
  const originalSorted = [...origSortable].sort(compareFlowNodes);

  const targetIndex = Math.max(0, Math.min(originalSorted.length, insertionIndex));

  const others = originalSorted.filter((n) => n.id !== draggedNodeId);
  const insertPos = Math.max(0, Math.min(others.length, targetIndex));
  const newOrder: BuilderCanvasNode[] = [...others];
  newOrder.splice(insertPos, 0, draggedCurrent);

  const newRects = new Map<string, BuilderCanvasNode['rect']>();
  let previousFlowBottom = 0;

  for (const sibling of newOrder) {
    const id = sibling.id;
    const height = sibling.rect.height;
    const metric = originalMetrics.get(id);
    const marginTop = metric ? metric.marginTop : 0;

    const newY = previousFlowBottom + marginTop;

    const newRect: BuilderCanvasNode['rect'] = {
      ...sibling.rect,
      y: Math.max(0, newY),
    };
    newRects.set(id, newRect);

    previousFlowBottom = Math.max(
      previousFlowBottom + marginTop + height,
      newY + height
    );
  }

  return newRects;
}

/**
 * Computes the new zIndex assignments for the siblings in a flow group (inner flex/grid
 * container children only) after a successful drop reorder in responsive viewport.
 *
 * It reuses the exact same newOrder logic as computeReorderedFlowSiblingRects, then
 * reassigns the sorted existing zIndex values of the group to the nodes in the new
 * visual flow order. This ensures that childrenMap (which sorts siblings by zIndex)
 * will produce exactly the same order as the y+marginTop flow order the user saw
 * in the responsive preview — for true WYSIWYG desktop parity.
 *
 * Only intended for flow *containers* (parentId present); top-level flow sections
 * have separate z handling and are excluded by the caller.
 */
export function computeNewZIndexOrderForFlowSiblings(
  nodes: BuilderCanvasNode[],
  draggedNodeId: string,
  insertionIndex: number,
  nodesById: Map<string, BuilderCanvasNode>,
  startRects?: Record<string, BuilderCanvasNode['rect']>,
  viewport?: Viewport,
): Map<string, number> {
  const draggedNodeForKey = nodes.find((n) => n.id === draggedNodeId);
  const flowGroupKey = draggedNodeForKey ? getFlowGroupKey(draggedNodeForKey, nodesById) : null;
  const siblings = getFlowSiblings(nodes, flowGroupKey);
  const draggedCurrent = siblings.find((n) => n.id === draggedNodeId);
  if (!draggedCurrent || siblings.length === 0) return new Map();

  const draggedStartRect = startRects?.[draggedNodeId] ?? draggedCurrent.rect;

  // Original order snapshot (with dragged at start y) — same as in computeReorderedFlowSiblingRects
  const origSortable = siblings.map((n) =>
    withRect(n, n.id === draggedNodeId ? draggedStartRect : effectiveRect(n, viewport))
  );
  const originalSorted = [...origSortable].sort(compareFlowNodes);

  const targetIndex = Math.max(0, Math.min(originalSorted.length, insertionIndex));

  const others = originalSorted.filter((n) => n.id !== draggedNodeId);
  const insertPos = Math.max(0, Math.min(others.length, targetIndex));
  const newOrder: BuilderCanvasNode[] = [...others];
  newOrder.splice(insertPos, 0, draggedCurrent);

  // Reassign sorted existing z values to the new order (scoped to this sibling group only)
  const sortedZValues = siblings.map((n) => n.zIndex).sort((a, b) => a - b);
  const zMap = new Map<string, number>();
  newOrder.forEach((node, idx) => {
    zMap.set(node.id, sortedZValues[idx] ?? (sortedZValues[sortedZValues.length - 1] ?? 0) + idx + 1);
  });
  return zMap;
}

/**
 * Computes updated rects after a height (or top-handle y) resize of a flow-layout
 * participant (top-level section or direct child of flex/grid container) in a
 * responsive viewport.
 *
 * - The resized node's final rect (y + new height from the resize gesture) is kept.
 * - Siblings after it in the original flow order get their y recalculated from the
 *   new bottom of the resized node + their original marginTop gaps (computed from
 *   pre-resize state via startRect).
 * - Siblings before the resized node are left untouched.
 * - This ensures live reflow preview during resize (via updated marginTop on siblings)
 *   + clean one-history-entry commit of height + sibling y positions.
 * - Reuses the same generalized flow sibling helpers for consistency with drag.
 * - Only meaningful for responsive viewports (desktop flex/grid handles reflow natively).
 */
export function computeResizedFlowSiblingRects(
  nodes: BuilderCanvasNode[],
  resizedNodeId: string,
  nodesById: Map<string, BuilderCanvasNode>,
  startRect: BuilderCanvasNode['rect'],
  finalRect: BuilderCanvasNode['rect'],
  viewport?: Viewport,
): Map<string, BuilderCanvasNode['rect']> {
  const resizedNodeForKey = nodes.find((n) => n.id === resizedNodeId);
  const flowGroupKey = resizedNodeForKey ? getFlowGroupKey(resizedNodeForKey, nodesById) : null;

  const siblings = getFlowSiblings(nodes, flowGroupKey);
  const resizedCurrent = siblings.find((n) => n.id === resizedNodeId);
  if (!resizedCurrent) return new Map();

  // Original metrics (marginTop per sibling) computed with pre-resize rect for the resized node.
  const flowSiblingsForMetrics = siblings.map((n) =>
    withRect(n, n.id === resizedNodeId ? startRect : effectiveRect(n, viewport))
  );
  const originalMetrics = computeFlowSiblingMetrics(flowSiblingsForMetrics);

  // Original stable order (using start y for resized to determine position in flow).
  const origSortable = siblings.map((n) =>
    withRect(n, n.id === resizedNodeId ? startRect : effectiveRect(n, viewport))
  );
  const originalSorted = [...origSortable].sort(compareFlowNodes);

  const resizedIndexInOrder = originalSorted.findIndex((n) => n.id === resizedNodeId);
  if (resizedIndexInOrder === -1) return new Map();

  const newRects = new Map<string, BuilderCanvasNode['rect']>();

  // Always include the resized node's final rect (the one user achieved via handle drag).
  newRects.set(resizedNodeId, finalRect);

  // Start stacking from the resized node's final bottom for all *subsequent* siblings.
  let previousFlowBottom = finalRect.y + finalRect.height;

  for (let i = resizedIndexInOrder + 1; i < originalSorted.length; i++) {
    const sibling = originalSorted[i];
    const metric = originalMetrics.get(sibling.id);
    const marginTop = metric ? metric.marginTop : 0;

    const newY = previousFlowBottom + marginTop;

    const newRect: BuilderCanvasNode['rect'] = {
      ...sibling.rect,
      y: Math.max(0, newY),
    };
    newRects.set(sibling.id, newRect);

    previousFlowBottom = Math.max(
      previousFlowBottom + marginTop + sibling.rect.height,
      newY + sibling.rect.height
    );
  }

  return newRects;
}
