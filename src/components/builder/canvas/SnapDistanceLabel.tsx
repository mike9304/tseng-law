'use client';

import styles from './SandboxPage.module.css';
import type { OverlayRect } from './DragGhost';

interface DistanceMeasurement {
  key: string;
  gap: number;
  x: number;
  y: number;
  orientation: 'horizontal' | 'vertical';
}

interface SnapDistanceLabelProps {
  activeRect: OverlayRect | null;
  otherRects: OverlayRect[];
  zoom: number;
  panX: number;
  panY: number;
}

const SHOW_THRESHOLD_PX = 64;

function centerX(rect: OverlayRect): number {
  return rect.x + rect.width / 2;
}

function centerY(rect: OverlayRect): number {
  return rect.y + rect.height / 2;
}

function computeDistances(active: OverlayRect, others: OverlayRect[]): DistanceMeasurement[] {
  const result: DistanceMeasurement[] = [];
  const aLeft = active.x;
  const aRight = active.x + active.width;
  const aTop = active.y;
  const aBottom = active.y + active.height;
  let rightBest: { rect: OverlayRect; gap: number } | null = null;
  let leftBest: { rect: OverlayRect; gap: number } | null = null;
  let bottomBest: { rect: OverlayRect; gap: number } | null = null;
  let topBest: { rect: OverlayRect; gap: number } | null = null;

  for (const other of others) {
    const oLeft = other.x;
    const oRight = other.x + other.width;
    const oTop = other.y;
    const oBottom = other.y + other.height;
    const verticalOverlap = oBottom > aTop && oTop < aBottom;
    const horizontalOverlap = oRight > aLeft && oLeft < aRight;

    if (verticalOverlap && oLeft >= aRight) {
      const gap = oLeft - aRight;
      if (gap > 0 && gap <= SHOW_THRESHOLD_PX && (!rightBest || gap < rightBest.gap)) {
        rightBest = { rect: other, gap };
      }
    }
    if (verticalOverlap && oRight <= aLeft) {
      const gap = aLeft - oRight;
      if (gap > 0 && gap <= SHOW_THRESHOLD_PX && (!leftBest || gap < leftBest.gap)) {
        leftBest = { rect: other, gap };
      }
    }
    if (horizontalOverlap && oTop >= aBottom) {
      const gap = oTop - aBottom;
      if (gap > 0 && gap <= SHOW_THRESHOLD_PX && (!bottomBest || gap < bottomBest.gap)) {
        bottomBest = { rect: other, gap };
      }
    }
    if (horizontalOverlap && oBottom <= aTop) {
      const gap = aTop - oBottom;
      if (gap > 0 && gap <= SHOW_THRESHOLD_PX && (!topBest || gap < topBest.gap)) {
        topBest = { rect: other, gap };
      }
    }
  }

  if (rightBest) {
    result.push({
      key: 'right',
      gap: rightBest.gap,
      orientation: 'horizontal',
      x: aRight + rightBest.gap / 2,
      y: (centerY(active) + centerY(rightBest.rect)) / 2,
    });
  }
  if (leftBest) {
    result.push({
      key: 'left',
      gap: leftBest.gap,
      orientation: 'horizontal',
      x: leftBest.rect.x + leftBest.rect.width + leftBest.gap / 2,
      y: (centerY(active) + centerY(leftBest.rect)) / 2,
    });
  }
  if (bottomBest) {
    result.push({
      key: 'bottom',
      gap: bottomBest.gap,
      orientation: 'vertical',
      x: (centerX(active) + centerX(bottomBest.rect)) / 2,
      y: aBottom + bottomBest.gap / 2,
    });
  }
  if (topBest) {
    result.push({
      key: 'top',
      gap: topBest.gap,
      orientation: 'vertical',
      x: (centerX(active) + centerX(topBest.rect)) / 2,
      y: topBest.rect.y + topBest.rect.height + topBest.gap / 2,
    });
  }

  return result;
}

export default function SnapDistanceLabel({
  activeRect,
  otherRects,
  zoom,
  panX,
  panY,
}: SnapDistanceLabelProps) {
  if (!activeRect || otherRects.length === 0) return null;
  const measurements = computeDistances(activeRect, otherRects);
  if (measurements.length === 0) return null;

  return (
    <>
      {measurements.map((measurement) => (
        <div
          key={measurement.key}
          className={`${styles.canvasOverlaySnapDistance} ${
            measurement.orientation === 'vertical' ? styles.canvasOverlaySnapDistanceVertical : ''
          }`}
          style={{
            left: `${measurement.x * zoom + panX}px`,
            top: `${measurement.y * zoom + panY}px`,
          }}
          aria-hidden
        >
          = {Math.round(measurement.gap)}px =
        </div>
      ))}
    </>
  );
}
