'use client';

import { memo } from 'react';
import styles from './SandboxPage.module.css';
import type { OverlayRect } from './DragGhost';

interface ResizeReadoutProps {
  currentRect: OverlayRect | null;
  pointer: { x: number; y: number } | null;
  zoom: number;
  panX: number;
  panY: number;
}

function ResizeReadout({
  currentRect,
  pointer,
  zoom,
  panX,
  panY,
}: ResizeReadoutProps) {
  if (!currentRect) return null;
  const readoutLeft = pointer
    ? pointer.x + 12
    : (currentRect.x + currentRect.width) * zoom + panX + 12;
  const readoutTop = pointer
    ? pointer.y + 12
    : (currentRect.y + currentRect.height) * zoom + panY + 12;

  return (
    <div
      className={styles.canvasOverlayResizeReadout}
      style={{ left: `${readoutLeft}px`, top: `${readoutTop}px` }}
      aria-live="polite"
    >
      {Math.round(currentRect.width)}{' '}
      <span className={styles.canvasOverlayResizeReadoutTimes}>x</span>{' '}
      {Math.round(currentRect.height)}
    </div>
  );
}

export default memo(ResizeReadout);
