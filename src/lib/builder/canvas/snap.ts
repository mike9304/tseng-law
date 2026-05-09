/**
 * Phase 2 — Snap engine for the freeform canvas editor.
 *
 * Pure functions — no React, no store dependency. The canvas container
 * calls `computeSnap` during drag/resize and renders the returned
 * `guides` array via the AlignmentGuides component.
 */

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AlignmentGuide {
  axis: 'horizontal' | 'vertical';
  position: number;
  from: number;
  to: number;
  tone?: 'alignment' | 'spacing';
  label?: string;
}

export interface SnapResult {
  snappedRect: Rect;
  guides: AlignmentGuide[];
}

export type SnapCandidateBounds = Rect;

const SNAP_THRESHOLD = 6;
const MAX_SPACING_GUIDE_PX = 96;

function edges(r: Rect) {
  return {
    left: r.x,
    right: r.x + r.width,
    top: r.y,
    bottom: r.y + r.height,
    centerX: r.x + r.width / 2,
    centerY: r.y + r.height / 2,
  };
}

type RectEdges = ReturnType<typeof edges>;

function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return Math.min(aEnd, bEnd) > Math.max(aStart, bStart);
}

function considerGuide(
  current: (AlignmentGuide & { gap: number }) | null,
  guide: AlignmentGuide & { gap: number },
) {
  if (guide.gap <= 0 || guide.gap > MAX_SPACING_GUIDE_PX) return current;
  if (!current || guide.gap < current.gap) return guide;
  return current;
}

function removeGuideGap(guide: AlignmentGuide & { gap: number }): AlignmentGuide {
  return {
    axis: guide.axis,
    position: guide.position,
    from: guide.from,
    to: guide.to,
    tone: guide.tone,
    label: guide.label,
  };
}

function rectIntersects(a: Rect, b: Rect): boolean {
  return (
    a.x < b.x + b.width
    && a.x + a.width > b.x
    && a.y < b.y + b.height
    && a.y + a.height > b.y
  );
}

export function filterSnapCandidatesByBounds(
  candidates: Rect[],
  bounds: SnapCandidateBounds | null | undefined,
): Rect[] {
  if (!bounds) return candidates;
  return candidates.filter((candidate) => rectIntersects(candidate, bounds));
}

function addVerticalAlignmentGuide(
  guides: AlignmentGuide[],
  finalEdges: RectEdges,
  otherEdges: RectEdges,
  meVal: number,
  otherVal: number,
) {
  if (Math.abs(meVal - otherVal) >= 1) return;
  guides.push({
    axis: 'vertical',
    position: otherVal,
    from: Math.min(finalEdges.top, otherEdges.top),
    to: Math.max(finalEdges.bottom, otherEdges.bottom),
    tone: 'alignment',
  });
}

function addHorizontalAlignmentGuide(
  guides: AlignmentGuide[],
  finalEdges: RectEdges,
  otherEdges: RectEdges,
  meVal: number,
  otherVal: number,
) {
  if (Math.abs(meVal - otherVal) >= 1) return;
  guides.push({
    axis: 'horizontal',
    position: otherVal,
    from: Math.min(finalEdges.left, otherEdges.left),
    to: Math.max(finalEdges.right, otherEdges.right),
    tone: 'alignment',
  });
}

/**
 * Compute snapped position for a node being dragged/resized.
 *
 * @param moving  The rect of the node being moved (pre-snap).
 * @param others  Rects of all OTHER nodes on the canvas (excluding the moving one).
 * @param gridSize  Grid snap interval in px (0 to disable).
 * @param canvasSize  Canvas viewport size for center-of-canvas snaps.
 */
export function computeSnap(
  moving: Rect,
  others: Rect[],
  gridSize: number,
  canvasSize: { width: number; height: number },
): SnapResult {
  let { x, y } = moving;
  const guides: AlignmentGuide[] = [];

  // 1. Grid snap
  if (gridSize > 0) {
    x = Math.round(x / gridSize) * gridSize;
    y = Math.round(y / gridSize) * gridSize;
  }

  // 2. Element snap — check edges + centers of other elements
  let bestDx = SNAP_THRESHOLD + 1;
  let bestDy = SNAP_THRESHOLD + 1;
  let snapX = x;
  let snapY = y;

  const meEdges = edges({ ...moving, x, y });
  const considerX = (meVal: number, otherVal: number) => {
    const d = Math.abs(meVal - otherVal);
    if (d < bestDx) {
      bestDx = d;
      snapX = x + (otherVal - meVal);
    }
  };
  const considerY = (meVal: number, otherVal: number) => {
    const d = Math.abs(meVal - otherVal);
    if (d < bestDy) {
      bestDy = d;
      snapY = y + (otherVal - meVal);
    }
  };

  for (const other of others) {
    const oe = edges(other);

    // Vertical guides (snap x-axis)
    considerX(meEdges.left, oe.left);
    considerX(meEdges.left, oe.right);
    considerX(meEdges.right, oe.left);
    considerX(meEdges.right, oe.right);
    considerX(meEdges.centerX, oe.centerX);
    considerX(meEdges.left, oe.centerX);
    considerX(meEdges.right, oe.centerX);

    // Horizontal guides (snap y-axis)
    considerY(meEdges.top, oe.top);
    considerY(meEdges.top, oe.bottom);
    considerY(meEdges.bottom, oe.top);
    considerY(meEdges.bottom, oe.bottom);
    considerY(meEdges.centerY, oe.centerY);
    considerY(meEdges.top, oe.centerY);
    considerY(meEdges.bottom, oe.centerY);
  }

  // 3. Canvas center snap
  const cx = canvasSize.width / 2;
  const cy = canvasSize.height / 2;
  const dCenterX = Math.abs(meEdges.centerX - cx);
  const dCenterY = Math.abs(meEdges.centerY - cy);
  if (dCenterX < bestDx) {
    bestDx = dCenterX;
    snapX = x + (cx - meEdges.centerX);
  }
  if (dCenterY < bestDy) {
    bestDy = dCenterY;
    snapY = y + (cy - meEdges.centerY);
  }

  if (bestDx <= SNAP_THRESHOLD) x = snapX;
  if (bestDy <= SNAP_THRESHOLD) y = snapY;

  // Build guide lines for snapped axes
  const finalEdges = edges({ x, y, width: moving.width, height: moving.height });
  let horizontalSpacingGuide: (AlignmentGuide & { gap: number }) | null = null;
  let verticalSpacingGuide: (AlignmentGuide & { gap: number }) | null = null;

  for (const other of others) {
    const oe = edges(other);
    // Vertical guides
    addVerticalAlignmentGuide(guides, finalEdges, oe, finalEdges.left, oe.left);
    addVerticalAlignmentGuide(guides, finalEdges, oe, finalEdges.right, oe.left);
    addVerticalAlignmentGuide(guides, finalEdges, oe, finalEdges.centerX, oe.left);
    addVerticalAlignmentGuide(guides, finalEdges, oe, finalEdges.left, oe.right);
    addVerticalAlignmentGuide(guides, finalEdges, oe, finalEdges.right, oe.right);
    addVerticalAlignmentGuide(guides, finalEdges, oe, finalEdges.centerX, oe.right);
    addVerticalAlignmentGuide(guides, finalEdges, oe, finalEdges.left, oe.centerX);
    addVerticalAlignmentGuide(guides, finalEdges, oe, finalEdges.right, oe.centerX);
    addVerticalAlignmentGuide(guides, finalEdges, oe, finalEdges.centerX, oe.centerX);

    // Horizontal guides
    addHorizontalAlignmentGuide(guides, finalEdges, oe, finalEdges.top, oe.top);
    addHorizontalAlignmentGuide(guides, finalEdges, oe, finalEdges.bottom, oe.top);
    addHorizontalAlignmentGuide(guides, finalEdges, oe, finalEdges.centerY, oe.top);
    addHorizontalAlignmentGuide(guides, finalEdges, oe, finalEdges.top, oe.bottom);
    addHorizontalAlignmentGuide(guides, finalEdges, oe, finalEdges.bottom, oe.bottom);
    addHorizontalAlignmentGuide(guides, finalEdges, oe, finalEdges.centerY, oe.bottom);
    addHorizontalAlignmentGuide(guides, finalEdges, oe, finalEdges.top, oe.centerY);
    addHorizontalAlignmentGuide(guides, finalEdges, oe, finalEdges.bottom, oe.centerY);
    addHorizontalAlignmentGuide(guides, finalEdges, oe, finalEdges.centerY, oe.centerY);

    if (rangesOverlap(finalEdges.top, finalEdges.bottom, oe.top, oe.bottom)) {
      const yPosition = (Math.max(finalEdges.top, oe.top) + Math.min(finalEdges.bottom, oe.bottom)) / 2;
      if (finalEdges.left >= oe.right) {
        const gap = Math.round(finalEdges.left - oe.right);
        horizontalSpacingGuide = considerGuide(horizontalSpacingGuide, {
          axis: 'horizontal',
          position: yPosition,
          from: oe.right,
          to: finalEdges.left,
          tone: 'spacing',
          label: `${gap}px`,
          gap,
        });
      }
      if (oe.left >= finalEdges.right) {
        const gap = Math.round(oe.left - finalEdges.right);
        horizontalSpacingGuide = considerGuide(horizontalSpacingGuide, {
          axis: 'horizontal',
          position: yPosition,
          from: finalEdges.right,
          to: oe.left,
          tone: 'spacing',
          label: `${gap}px`,
          gap,
        });
      }
    }

    if (rangesOverlap(finalEdges.left, finalEdges.right, oe.left, oe.right)) {
      const xPosition = (Math.max(finalEdges.left, oe.left) + Math.min(finalEdges.right, oe.right)) / 2;
      if (finalEdges.top >= oe.bottom) {
        const gap = Math.round(finalEdges.top - oe.bottom);
        verticalSpacingGuide = considerGuide(verticalSpacingGuide, {
          axis: 'vertical',
          position: xPosition,
          from: oe.bottom,
          to: finalEdges.top,
          tone: 'spacing',
          label: `${gap}px`,
          gap,
        });
      }
      if (oe.top >= finalEdges.bottom) {
        const gap = Math.round(oe.top - finalEdges.bottom);
        verticalSpacingGuide = considerGuide(verticalSpacingGuide, {
          axis: 'vertical',
          position: xPosition,
          from: finalEdges.bottom,
          to: oe.top,
          tone: 'spacing',
          label: `${gap}px`,
          gap,
        });
      }
    }
  }

  // Canvas center guides
  if (Math.abs(finalEdges.centerX - cx) < 1) {
    guides.push({ axis: 'vertical', position: cx, from: 0, to: canvasSize.height, tone: 'alignment' });
  }
  if (Math.abs(finalEdges.centerY - cy) < 1) {
    guides.push({ axis: 'horizontal', position: cy, from: 0, to: canvasSize.width, tone: 'alignment' });
  }

  horizontalSpacingGuide = considerGuide(horizontalSpacingGuide, {
    axis: 'horizontal',
    position: finalEdges.centerY,
    from: 0,
    to: finalEdges.left,
    tone: 'spacing',
    label: `${Math.round(finalEdges.left)}px`,
    gap: Math.round(finalEdges.left),
  });
  horizontalSpacingGuide = considerGuide(horizontalSpacingGuide, {
    axis: 'horizontal',
    position: finalEdges.centerY,
    from: finalEdges.right,
    to: canvasSize.width,
    tone: 'spacing',
    label: `${Math.round(canvasSize.width - finalEdges.right)}px`,
    gap: Math.round(canvasSize.width - finalEdges.right),
  });
  verticalSpacingGuide = considerGuide(verticalSpacingGuide, {
    axis: 'vertical',
    position: finalEdges.centerX,
    from: 0,
    to: finalEdges.top,
    tone: 'spacing',
    label: `${Math.round(finalEdges.top)}px`,
    gap: Math.round(finalEdges.top),
  });
  verticalSpacingGuide = considerGuide(verticalSpacingGuide, {
    axis: 'vertical',
    position: finalEdges.centerX,
    from: finalEdges.bottom,
    to: canvasSize.height,
    tone: 'spacing',
    label: `${Math.round(canvasSize.height - finalEdges.bottom)}px`,
    gap: Math.round(canvasSize.height - finalEdges.bottom),
  });

  if (horizontalSpacingGuide) {
    guides.push(removeGuideGap(horizontalSpacingGuide));
  }
  if (verticalSpacingGuide) {
    guides.push(removeGuideGap(verticalSpacingGuide));
  }

  return {
    snappedRect: { x, y, width: moving.width, height: moving.height },
    guides,
  };
}
