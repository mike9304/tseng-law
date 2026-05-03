'use client';

import styles from './SandboxPage.module.css';
import type { OverlayRect } from './DragGhost';

const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const;

interface MultiSelectionBoundingBoxProps {
  bbox: OverlayRect | null;
  selectedCount: number;
}

export default function MultiSelectionBoundingBox({
  bbox,
  selectedCount,
}: MultiSelectionBoundingBoxProps) {
  if (!bbox || selectedCount < 2) return null;

  return (
    <div
      className={styles.canvasOverlayMultiBbox}
      style={{
        left: `${bbox.x}px`,
        top: `${bbox.y}px`,
        width: `${bbox.width}px`,
        height: `${bbox.height}px`,
      }}
      aria-hidden
    >
      <span className={styles.canvasOverlayMultiBboxBadge}>
        {selectedCount} selected · {Math.round(bbox.width)} x {Math.round(bbox.height)}
      </span>
      {HANDLES.map((handle) => (
        <span
          key={handle}
          className={`${styles.canvasOverlayMultiBboxHandle} ${
            styles[`canvasOverlayMultiBboxHandle_${handle}`]
          }`}
          aria-hidden
        />
      ))}
    </div>
  );
}
