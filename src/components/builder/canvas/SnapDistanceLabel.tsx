'use client';

import { memo, useMemo } from 'react';
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
const EMPTY_DISTANCE_MEASUREMENTS: DistanceMeasurement[] = [];

export function getSnapDistanceMeasurements(
  active: OverlayRect | null,
  others: readonly OverlayRect[],
): DistanceMeasurement[] {
  if (!active || others.length === 0) return EMPTY_DISTANCE_MEASUREMENTS;

  const aLeft = active.x;
  const aRight = active.x + active.width;
  const aTop = active.y;
  const aBottom = active.y + active.height;
  const activeCenterX = active.x + active.width / 2;
  const activeCenterY = active.y + active.height / 2;
  let result: DistanceMeasurement[] | null = null;
  let rightBestRect: OverlayRect | null = null;
  let rightBestGap = Number.POSITIVE_INFINITY;
  let leftBestRect: OverlayRect | null = null;
  let leftBestGap = Number.POSITIVE_INFINITY;
  let bottomBestRect: OverlayRect | null = null;
  let bottomBestGap = Number.POSITIVE_INFINITY;
  let topBestRect: OverlayRect | null = null;
  let topBestGap = Number.POSITIVE_INFINITY;

  for (const other of others) {
    const oLeft = other.x;
    const oRight = other.x + other.width;
    const oTop = other.y;
    const oBottom = other.y + other.height;
    const verticalOverlap = oBottom > aTop && oTop < aBottom;
    const horizontalOverlap = oRight > aLeft && oLeft < aRight;

    if (verticalOverlap && oLeft >= aRight) {
      const gap = oLeft - aRight;
      if (gap > 0 && gap <= SHOW_THRESHOLD_PX && gap < rightBestGap) {
        rightBestRect = other;
        rightBestGap = gap;
      }
    }
    if (verticalOverlap && oRight <= aLeft) {
      const gap = aLeft - oRight;
      if (gap > 0 && gap <= SHOW_THRESHOLD_PX && gap < leftBestGap) {
        leftBestRect = other;
        leftBestGap = gap;
      }
    }
    if (horizontalOverlap && oTop >= aBottom) {
      const gap = oTop - aBottom;
      if (gap > 0 && gap <= SHOW_THRESHOLD_PX && gap < bottomBestGap) {
        bottomBestRect = other;
        bottomBestGap = gap;
      }
    }
    if (horizontalOverlap && oBottom <= aTop) {
      const gap = aTop - oBottom;
      if (gap > 0 && gap <= SHOW_THRESHOLD_PX && gap < topBestGap) {
        topBestRect = other;
        topBestGap = gap;
      }
    }
  }

  if (rightBestRect) {
    result ??= [];
    result.push({
      key: 'right',
      gap: rightBestGap,
      orientation: 'horizontal',
      x: aRight + rightBestGap / 2,
      y: (activeCenterY + rightBestRect.y + rightBestRect.height / 2) / 2,
    });
  }
  if (leftBestRect) {
    result ??= [];
    result.push({
      key: 'left',
      gap: leftBestGap,
      orientation: 'horizontal',
      x: leftBestRect.x + leftBestRect.width + leftBestGap / 2,
      y: (activeCenterY + leftBestRect.y + leftBestRect.height / 2) / 2,
    });
  }
  if (bottomBestRect) {
    result ??= [];
    result.push({
      key: 'bottom',
      gap: bottomBestGap,
      orientation: 'vertical',
      x: (activeCenterX + bottomBestRect.x + bottomBestRect.width / 2) / 2,
      y: aBottom + bottomBestGap / 2,
    });
  }
  if (topBestRect) {
    result ??= [];
    result.push({
      key: 'top',
      gap: topBestGap,
      orientation: 'vertical',
      x: (activeCenterX + topBestRect.x + topBestRect.width / 2) / 2,
      y: topBestRect.y + topBestRect.height + topBestGap / 2,
    });
  }

  return result ?? EMPTY_DISTANCE_MEASUREMENTS;
}

function SnapDistanceLabel({
  activeRect,
  otherRects,
  zoom,
  panX,
  panY,
}: SnapDistanceLabelProps) {
  const measurements = useMemo(
    () => getSnapDistanceMeasurements(activeRect, otherRects),
    [activeRect, otherRects],
  );

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

export default memo(SnapDistanceLabel);
