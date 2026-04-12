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
}

export interface SnapResult {
  snappedRect: Rect;
  guides: AlignmentGuide[];
}

const SNAP_THRESHOLD = 5;

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

  for (const other of others) {
    const oe = edges(other);

    // Vertical guides (snap x-axis)
    const xPairs: Array<[number, number]> = [
      [meEdges.left, oe.left],
      [meEdges.left, oe.right],
      [meEdges.right, oe.left],
      [meEdges.right, oe.right],
      [meEdges.centerX, oe.centerX],
      [meEdges.left, oe.centerX],
      [meEdges.right, oe.centerX],
    ];
    for (const [meVal, otherVal] of xPairs) {
      const d = Math.abs(meVal - otherVal);
      if (d < bestDx) {
        bestDx = d;
        snapX = x + (otherVal - meVal);
      }
    }

    // Horizontal guides (snap y-axis)
    const yPairs: Array<[number, number]> = [
      [meEdges.top, oe.top],
      [meEdges.top, oe.bottom],
      [meEdges.bottom, oe.top],
      [meEdges.bottom, oe.bottom],
      [meEdges.centerY, oe.centerY],
      [meEdges.top, oe.centerY],
      [meEdges.bottom, oe.centerY],
    ];
    for (const [meVal, otherVal] of yPairs) {
      const d = Math.abs(meVal - otherVal);
      if (d < bestDy) {
        bestDy = d;
        snapY = y + (otherVal - meVal);
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
  const finalEdges = edges({ x, y, width: moving.width, height: moving.height });

  for (const other of others) {
    const oe = edges(other);
    // Vertical guides
    for (const val of [oe.left, oe.right, oe.centerX]) {
      for (const meVal of [finalEdges.left, finalEdges.right, finalEdges.centerX]) {
        if (Math.abs(meVal - val) < 1) {
          guides.push({
            axis: 'vertical',
            position: val,
            from: Math.min(finalEdges.top, oe.top),
            to: Math.max(finalEdges.bottom, oe.bottom),
          });
        }
      }
    }
    // Horizontal guides
    for (const val of [oe.top, oe.bottom, oe.centerY]) {
      for (const meVal of [finalEdges.top, finalEdges.bottom, finalEdges.centerY]) {
        if (Math.abs(meVal - val) < 1) {
          guides.push({
            axis: 'horizontal',
            position: val,
            from: Math.min(finalEdges.left, oe.left),
            to: Math.max(finalEdges.right, oe.right),
          });
        }
      }
    }
  }

  // Canvas center guides
  if (Math.abs(finalEdges.centerX - cx) < 1) {
    guides.push({ axis: 'vertical', position: cx, from: 0, to: canvasSize.height });
  }
  if (Math.abs(finalEdges.centerY - cy) < 1) {
    guides.push({ axis: 'horizontal', position: cy, from: 0, to: canvasSize.width });
  }

  return {
    snappedRect: { x, y, width: moving.width, height: moving.height },
    guides,
  };
}
