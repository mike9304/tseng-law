'use client';

import { memo } from 'react';
import { formatMultiSelectionBboxLabel } from './selection-overlay-copy';
import styles from './SandboxPage.module.css';
import type { OverlayRect } from './DragGhost';
import type { Locale } from '@/lib/locales';

const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'] as const;

interface MultiSelectionBoundingBoxProps {
  bbox: OverlayRect | null;
  locale?: Locale;
  selectedCount: number;
}

function MultiSelectionBoundingBox({
  bbox,
  locale,
  selectedCount,
}: MultiSelectionBoundingBoxProps) {
  if (!bbox || selectedCount < 2) return null;
  const label = formatMultiSelectionBboxLabel({
    count: selectedCount,
    height: bbox.height,
    locale,
    width: bbox.width,
  });

  return (
    <div
      className={styles.canvasOverlayMultiBbox}
      data-builder-multi-selection-bbox="true"
      style={{
        left: `${bbox.x}px`,
        top: `${bbox.y}px`,
        width: `${bbox.width}px`,
        height: `${bbox.height}px`,
      }}
      aria-hidden
    >
      <span
        className={styles.canvasOverlayMultiBboxBadge}
        data-builder-multi-selection-badge="true"
      >
        {label}
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

export default memo(MultiSelectionBoundingBox);
