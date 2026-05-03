'use client';

import styles from './SandboxPage.module.css';
import type { OverlayRect } from './DragGhost';

interface ResizeReadoutProps {
  currentRect: OverlayRect | null;
  pointer: { x: number; y: number } | null;
  zoom: number;
  panX: number;
  panY: number;
}

export default function ResizeReadout({
  currentRect,
  pointer,
  zoom,
  panX,
  panY,
}: ResizeReadoutProps) {
  if (!currentRect) return null;

  const left = pointer ? pointer.x + 12 : (currentRect.x + currentRect.width) * zoom + panX + 12;
  const top = pointer ? pointer.y + 12 : (currentRect.y + currentRect.height) * zoom + panY + 12;

  return (
    <div
      className={styles.canvasOverlayResizeReadout}
      style={{ left: `${left}px`, top: `${top}px` }}
      aria-live="polite"
    >
      {Math.round(currentRect.width)}{' '}
      <span className={styles.canvasOverlayResizeReadoutTimes}>x</span>{' '}
      {Math.round(currentRect.height)}
    </div>
  );
}
