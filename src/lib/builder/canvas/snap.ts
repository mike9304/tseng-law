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
export interface SnapReferenceGuide {
  axis: 'horizontal' | 'vertical';
  position: number;
}

const SNAP_THRESHOLD = 6;
const MAX_SPACING_GUIDE_PX = 96;
const EMPTY_ALIGNMENT_GUIDES: AlignmentGuide[] = [];
type SpacingGuide = AlignmentGuide & { gap: number };

function createEdges(x: number, y: number, width: number, height: number) {
  return {
    left: x,
    right: x + width,
    top: y,
    bottom: y + height,
    centerX: x + width / 2,
    centerY: y + height / 2,
  };
}

type RectEdges = ReturnType<typeof createEdges>;
export type SnapCandidateEdges = RectEdges;
export type SnapEdgeScratch = {
  finalEdges: SnapCandidateEdges;
  movingEdges: SnapCandidateEdges;
  referenceGuideEdges: SnapCandidateEdges;
};

function writeEdges(
  target: SnapCandidateEdges,
  x: number,
  y: number,
  width: number,
  height: number,
): SnapCandidateEdges {
  target.left = x;
  target.right = x + width;
  target.top = y;
  target.bottom = y + height;
  target.centerX = x + width / 2;
  target.centerY = y + height / 2;
  return target;
}

export function createSnapEdgeScratch(): SnapEdgeScratch {
  return {
    finalEdges: createEdges(0, 0, 0, 0),
    movingEdges: createEdges(0, 0, 0, 0),
    referenceGuideEdges: createEdges(0, 0, 0, 0),
  };
}

export function createSnapCandidateEdge(candidate: Rect): SnapCandidateEdges {
  return createEdges(candidate.x, candidate.y, candidate.width, candidate.height);
}

export function createSnapCandidateEdges(candidates: readonly Rect[]): SnapCandidateEdges[] {
  const candidateEdges: SnapCandidateEdges[] = new Array(candidates.length);
  for (let index = 0; index < candidates.length; index += 1) {
    candidateEdges[index] = createSnapCandidateEdge(candidates[index]);
  }
  return candidateEdges;
}

function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return Math.min(aEnd, bEnd) > Math.max(aStart, bStart);
}

function canUseSpacingGuide(current: SpacingGuide | null, gap: number): boolean {
  return gap > 0 && gap <= MAX_SPACING_GUIDE_PX && (!current || gap < current.gap);
}

function considerSpacingGuide(
  current: SpacingGuide | null,
  axis: AlignmentGuide['axis'],
  position: number,
  from: number,
  to: number,
  gap: number,
): SpacingGuide | null {
  if (!canUseSpacingGuide(current, gap)) return current;
  return {
    axis,
    position,
    from,
    to,
    tone: 'spacing',
    label: `${gap}px`,
    gap,
  };
}

function considerHorizontalCandidateSpacingGuide(
  current: SpacingGuide | null,
  finalEdges: RectEdges,
  otherEdges: RectEdges,
  from: number,
  to: number,
  gap: number,
): SpacingGuide | null {
  if (!canUseSpacingGuide(current, gap)) return current;
  return {
    axis: 'horizontal',
    position: (Math.max(finalEdges.top, otherEdges.top) + Math.min(finalEdges.bottom, otherEdges.bottom)) / 2,
    from,
    to,
    tone: 'spacing',
    label: `${gap}px`,
    gap,
  };
}

function considerVerticalCandidateSpacingGuide(
  current: SpacingGuide | null,
  finalEdges: RectEdges,
  otherEdges: RectEdges,
  from: number,
  to: number,
  gap: number,
): SpacingGuide | null {
  if (!canUseSpacingGuide(current, gap)) return current;
  return {
    axis: 'vertical',
    position: (Math.max(finalEdges.left, otherEdges.left) + Math.min(finalEdges.right, otherEdges.right)) / 2,
    from,
    to,
    tone: 'spacing',
    label: `${gap}px`,
    gap,
  };
}

function removeGuideGap(guide: SpacingGuide): AlignmentGuide {
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

export function snapCandidateIntersectsBounds(
  candidate: Rect,
  bounds: SnapCandidateBounds,
): boolean {
  return rectIntersects(candidate, bounds);
}

export function filterSnapCandidatesByBounds(
  candidates: Rect[],
  bounds: SnapCandidateBounds | null | undefined,
): Rect[] {
  if (!bounds) return candidates;
  let filteredCandidates: Rect[] | null = null;
  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    if (snapCandidateIntersectsBounds(candidate, bounds)) {
      filteredCandidates?.push(candidate);
    } else if (!filteredCandidates) {
      filteredCandidates = candidates.slice(0, index);
    }
  }
  return filteredCandidates ?? candidates;
}

function addVerticalAlignmentGuidesForValue(
  guides: AlignmentGuide[] | null,
  finalEdges: RectEdges,
  otherEdges: RectEdges,
  otherVal: number,
): AlignmentGuide[] | null {
  const matchesLeft = Math.abs(finalEdges.left - otherVal) < 1;
  const matchesRight = Math.abs(finalEdges.right - otherVal) < 1;
  const matchesCenterX = Math.abs(finalEdges.centerX - otherVal) < 1;
  if (!matchesLeft && !matchesRight && !matchesCenterX) return guides;

  const from = Math.min(finalEdges.top, otherEdges.top);
  const to = Math.max(finalEdges.bottom, otherEdges.bottom);
  const nextGuides = guides ?? [];
  if (matchesLeft) {
    nextGuides.push({
      axis: 'vertical',
      position: otherVal,
      from,
      to,
      tone: 'alignment',
    });
  }
  if (matchesRight) {
    nextGuides.push({
      axis: 'vertical',
      position: otherVal,
      from,
      to,
      tone: 'alignment',
    });
  }
  if (matchesCenterX) {
    nextGuides.push({
      axis: 'vertical',
      position: otherVal,
      from,
      to,
      tone: 'alignment',
    });
  }
  return nextGuides;
}

function addHorizontalAlignmentGuidesForValue(
  guides: AlignmentGuide[] | null,
  finalEdges: RectEdges,
  otherEdges: RectEdges,
  otherVal: number,
): AlignmentGuide[] | null {
  const matchesTop = Math.abs(finalEdges.top - otherVal) < 1;
  const matchesBottom = Math.abs(finalEdges.bottom - otherVal) < 1;
  const matchesCenterY = Math.abs(finalEdges.centerY - otherVal) < 1;
  if (!matchesTop && !matchesBottom && !matchesCenterY) return guides;

  const from = Math.min(finalEdges.left, otherEdges.left);
  const to = Math.max(finalEdges.right, otherEdges.right);
  const nextGuides = guides ?? [];
  if (matchesTop) {
    nextGuides.push({
      axis: 'horizontal',
      position: otherVal,
      from,
      to,
      tone: 'alignment',
    });
  }
  if (matchesBottom) {
    nextGuides.push({
      axis: 'horizontal',
      position: otherVal,
      from,
      to,
      tone: 'alignment',
    });
  }
  if (matchesCenterY) {
    nextGuides.push({
      axis: 'horizontal',
      position: otherVal,
      from,
      to,
      tone: 'alignment',
    });
  }
  return nextGuides;
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
  referenceGuides: SnapReferenceGuide[] = [],
): SnapResult {
  return computeSnapFromEdges(
    moving,
    createSnapCandidateEdges(others),
    gridSize,
    canvasSize,
    referenceGuides,
  );
}

export function computeSnapFromEdges(
  moving: Rect,
  otherEdges: readonly SnapCandidateEdges[],
  gridSize: number,
  canvasSize: { width: number; height: number },
  referenceGuides: SnapReferenceGuide[] = [],
): SnapResult {
  const snappedRect = { x: 0, y: 0, width: 0, height: 0 };
  const guides = writeSnapFromEdges(
    snappedRect,
    moving,
    otherEdges,
    gridSize,
    canvasSize,
    referenceGuides,
  );
  return {
    snappedRect,
    guides,
  };
}

export function writeSnapFromEdges(
  snappedRect: Rect,
  moving: Rect,
  otherEdges: readonly SnapCandidateEdges[],
  gridSize: number,
  canvasSize: { width: number; height: number },
  referenceGuides: SnapReferenceGuide[] = [],
  scratch?: SnapEdgeScratch,
): AlignmentGuide[] {
  let { x, y } = moving;
  let guides: AlignmentGuide[] | null = null;

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

  const meEdges = scratch
    ? writeEdges(scratch.movingEdges, x, y, moving.width, moving.height)
    : createEdges(x, y, moving.width, moving.height);
  let distance = 0;

  for (let index = 0; index < otherEdges.length; index += 1) {
    const oe = otherEdges[index];
    if (!oe) continue;
    // Vertical guides (snap x-axis)
    distance = Math.abs(meEdges.left - oe.left);
    if (distance < bestDx) {
      bestDx = distance;
      snapX = x + (oe.left - meEdges.left);
    }
    distance = Math.abs(meEdges.left - oe.right);
    if (distance < bestDx) {
      bestDx = distance;
      snapX = x + (oe.right - meEdges.left);
    }
    distance = Math.abs(meEdges.right - oe.left);
    if (distance < bestDx) {
      bestDx = distance;
      snapX = x + (oe.left - meEdges.right);
    }
    distance = Math.abs(meEdges.right - oe.right);
    if (distance < bestDx) {
      bestDx = distance;
      snapX = x + (oe.right - meEdges.right);
    }
    distance = Math.abs(meEdges.centerX - oe.centerX);
    if (distance < bestDx) {
      bestDx = distance;
      snapX = x + (oe.centerX - meEdges.centerX);
    }
    distance = Math.abs(meEdges.left - oe.centerX);
    if (distance < bestDx) {
      bestDx = distance;
      snapX = x + (oe.centerX - meEdges.left);
    }
    distance = Math.abs(meEdges.right - oe.centerX);
    if (distance < bestDx) {
      bestDx = distance;
      snapX = x + (oe.centerX - meEdges.right);
    }

    // Horizontal guides (snap y-axis)
    distance = Math.abs(meEdges.top - oe.top);
    if (distance < bestDy) {
      bestDy = distance;
      snapY = y + (oe.top - meEdges.top);
    }
    distance = Math.abs(meEdges.top - oe.bottom);
    if (distance < bestDy) {
      bestDy = distance;
      snapY = y + (oe.bottom - meEdges.top);
    }
    distance = Math.abs(meEdges.bottom - oe.top);
    if (distance < bestDy) {
      bestDy = distance;
      snapY = y + (oe.top - meEdges.bottom);
    }
    distance = Math.abs(meEdges.bottom - oe.bottom);
    if (distance < bestDy) {
      bestDy = distance;
      snapY = y + (oe.bottom - meEdges.bottom);
    }
    distance = Math.abs(meEdges.centerY - oe.centerY);
    if (distance < bestDy) {
      bestDy = distance;
      snapY = y + (oe.centerY - meEdges.centerY);
    }
    distance = Math.abs(meEdges.top - oe.centerY);
    if (distance < bestDy) {
      bestDy = distance;
      snapY = y + (oe.centerY - meEdges.top);
    }
    distance = Math.abs(meEdges.bottom - oe.centerY);
    if (distance < bestDy) {
      bestDy = distance;
      snapY = y + (oe.centerY - meEdges.bottom);
    }
  }

  for (let index = 0; index < referenceGuides.length; index += 1) {
    const guide = referenceGuides[index];
    if (!guide) continue;
    if (guide.axis === 'vertical') {
      distance = Math.abs(meEdges.left - guide.position);
      if (distance < bestDx) {
        bestDx = distance;
        snapX = x + (guide.position - meEdges.left);
      }
      distance = Math.abs(meEdges.right - guide.position);
      if (distance < bestDx) {
        bestDx = distance;
        snapX = x + (guide.position - meEdges.right);
      }
      distance = Math.abs(meEdges.centerX - guide.position);
      if (distance < bestDx) {
        bestDx = distance;
        snapX = x + (guide.position - meEdges.centerX);
      }
    } else {
      distance = Math.abs(meEdges.top - guide.position);
      if (distance < bestDy) {
        bestDy = distance;
        snapY = y + (guide.position - meEdges.top);
      }
      distance = Math.abs(meEdges.bottom - guide.position);
      if (distance < bestDy) {
        bestDy = distance;
        snapY = y + (guide.position - meEdges.bottom);
      }
      distance = Math.abs(meEdges.centerY - guide.position);
      if (distance < bestDy) {
        bestDy = distance;
        snapY = y + (guide.position - meEdges.centerY);
      }
    }
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
  const finalEdges = scratch
    ? writeEdges(scratch.finalEdges, x, y, moving.width, moving.height)
    : createEdges(x, y, moving.width, moving.height);
  let horizontalSpacingGuide: SpacingGuide | null = null;
  let verticalSpacingGuide: SpacingGuide | null = null;

  for (let index = 0; index < otherEdges.length; index += 1) {
    const oe = otherEdges[index];
    if (!oe) continue;
    // Vertical guides
    guides = addVerticalAlignmentGuidesForValue(guides, finalEdges, oe, oe.left);
    guides = addVerticalAlignmentGuidesForValue(guides, finalEdges, oe, oe.right);
    guides = addVerticalAlignmentGuidesForValue(guides, finalEdges, oe, oe.centerX);

    // Horizontal guides
    guides = addHorizontalAlignmentGuidesForValue(guides, finalEdges, oe, oe.top);
    guides = addHorizontalAlignmentGuidesForValue(guides, finalEdges, oe, oe.bottom);
    guides = addHorizontalAlignmentGuidesForValue(guides, finalEdges, oe, oe.centerY);

    if (rangesOverlap(finalEdges.top, finalEdges.bottom, oe.top, oe.bottom)) {
      if (finalEdges.left >= oe.right) {
        const gap = Math.round(finalEdges.left - oe.right);
        horizontalSpacingGuide = considerHorizontalCandidateSpacingGuide(
          horizontalSpacingGuide,
          finalEdges,
          oe,
          oe.right,
          finalEdges.left,
          gap,
        );
      }
      if (oe.left >= finalEdges.right) {
        const gap = Math.round(oe.left - finalEdges.right);
        horizontalSpacingGuide = considerHorizontalCandidateSpacingGuide(
          horizontalSpacingGuide,
          finalEdges,
          oe,
          finalEdges.right,
          oe.left,
          gap,
        );
      }
    }

    if (rangesOverlap(finalEdges.left, finalEdges.right, oe.left, oe.right)) {
      if (finalEdges.top >= oe.bottom) {
        const gap = Math.round(finalEdges.top - oe.bottom);
        verticalSpacingGuide = considerVerticalCandidateSpacingGuide(
          verticalSpacingGuide,
          finalEdges,
          oe,
          oe.bottom,
          finalEdges.top,
          gap,
        );
      }
      if (oe.top >= finalEdges.bottom) {
        const gap = Math.round(oe.top - finalEdges.bottom);
        verticalSpacingGuide = considerVerticalCandidateSpacingGuide(
          verticalSpacingGuide,
          finalEdges,
          oe,
          finalEdges.bottom,
          oe.top,
          gap,
        );
      }
    }
  }

  for (let index = 0; index < referenceGuides.length; index += 1) {
    const guide = referenceGuides[index];
    if (!guide) continue;
    if (guide.axis === 'vertical') {
      const guideEdges = scratch
        ? writeEdges(scratch.referenceGuideEdges, guide.position, 0, 0, canvasSize.height)
        : createEdges(guide.position, 0, 0, canvasSize.height);
      guides = addVerticalAlignmentGuidesForValue(guides, finalEdges, guideEdges, guide.position);
    } else {
      const guideEdges = scratch
        ? writeEdges(scratch.referenceGuideEdges, 0, guide.position, canvasSize.width, 0)
        : createEdges(0, guide.position, canvasSize.width, 0);
      guides = addHorizontalAlignmentGuidesForValue(guides, finalEdges, guideEdges, guide.position);
    }
  }

  // Canvas center guides
  if (Math.abs(finalEdges.centerX - cx) < 1) {
    guides ??= [];
    guides.push({ axis: 'vertical', position: cx, from: 0, to: canvasSize.height, tone: 'alignment' });
  }
  if (Math.abs(finalEdges.centerY - cy) < 1) {
    guides ??= [];
    guides.push({ axis: 'horizontal', position: cy, from: 0, to: canvasSize.width, tone: 'alignment' });
  }

  let gap = Math.round(finalEdges.left);
  horizontalSpacingGuide = considerSpacingGuide(
    horizontalSpacingGuide,
    'horizontal',
    finalEdges.centerY,
    0,
    finalEdges.left,
    gap,
  );
  gap = Math.round(canvasSize.width - finalEdges.right);
  horizontalSpacingGuide = considerSpacingGuide(
    horizontalSpacingGuide,
    'horizontal',
    finalEdges.centerY,
    finalEdges.right,
    canvasSize.width,
    gap,
  );
  gap = Math.round(finalEdges.top);
  verticalSpacingGuide = considerSpacingGuide(
    verticalSpacingGuide,
    'vertical',
    finalEdges.centerX,
    0,
    finalEdges.top,
    gap,
  );
  gap = Math.round(canvasSize.height - finalEdges.bottom);
  verticalSpacingGuide = considerSpacingGuide(
    verticalSpacingGuide,
    'vertical',
    finalEdges.centerX,
    finalEdges.bottom,
    canvasSize.height,
    gap,
  );

  if (horizontalSpacingGuide) {
    guides ??= [];
    guides.push(removeGuideGap(horizontalSpacingGuide));
  }
  if (verticalSpacingGuide) {
    guides ??= [];
    guides.push(removeGuideGap(verticalSpacingGuide));
  }

  snappedRect.x = x;
  snappedRect.y = y;
  snappedRect.width = moving.width;
  snappedRect.height = moving.height;
  return guides ?? EMPTY_ALIGNMENT_GUIDES;
}
