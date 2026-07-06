'use client';

import { useState, type PointerEvent } from 'react';
import type { ReferenceGuide } from '@/lib/builder/canvas/editor-prefs';
import { isGuideReleaseInsideCanvas } from '@/components/builder/canvas/useCanvasReferenceGuides';
import styles from './SandboxPage.module.css';

type Axis = ReferenceGuide['axis'];

type CanvasRulersProps = {
  /** Pointerdown on a ruler begins a drag-to-create guide (Wix parity). */
  onGuideDragStart?: (axis: Axis) => void;
  /** Live preview position while dragging (axis fixed by the originating ruler). */
  onGuideDragMove?: (axis: Axis, clientX: number, clientY: number) => void;
  /** Released inside the canvas: persist the guide at the resolved position. */
  onGuideDragCommit?: (axis: Axis, clientX: number, clientY: number) => void;
  /** Released over a ruler / outside the canvas: discard the draft guide. */
  onGuideDragCancel?: () => void;
  stageHeight: number;
  stageWidth: number;
  zoom: number;
};

const RULER_Z_INDEX = 45020;
type RulerDrag = { axis: Axis; pointerId: number } | null;

export default function CanvasRulers({
  onGuideDragStart,
  onGuideDragMove,
  onGuideDragCommit,
  onGuideDragCancel,
  stageHeight,
  stageWidth,
  zoom,
}: CanvasRulersProps) {
  const [drag, setDrag] = useState<RulerDrag>(null);
  const interactive = Boolean(onGuideDragStart);

  const beginDrag = (axis: Axis) => (event: PointerEvent<HTMLDivElement>) => {
    if (!interactive || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* releasePointerCapture/setPointerCapture can throw if the node is detached */
    }
    setDrag({ axis, pointerId: event.pointerId });
    onGuideDragStart?.(axis);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    onGuideDragMove?.(drag.axis, event.clientX, event.clientY);
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>, commit: boolean) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      /* ignore */
    }
    const axis = drag.axis;
    setDrag(null);
    if (commit && onGuideDragCommit) {
      onGuideDragCommit(axis, event.clientX, event.clientY);
    } else {
      onGuideDragCancel?.();
    }
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    finishDrag(event, isGuideReleaseInsideCanvas(event.clientX, event.clientY));
  };

  const handlePointerCancel = (event: PointerEvent<HTMLDivElement>) => {
    finishDrag(event, false);
  };

  return (
    <>
      <div
        className={styles.topRuler}
        data-builder-ruler="top"
        data-builder-floating-ui="true"
        aria-label="Horizontal ruler"
        role="presentation"
        style={{
          minHeight: 12 / Math.max(zoom, 0.1),
          cursor: 'crosshair',
          pointerEvents: interactive ? 'auto' : 'none',
          zIndex: RULER_Z_INDEX,
        }}
        onPointerDown={beginDrag('vertical')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {Array.from({ length: Math.floor(stageWidth / 40) + 1 }).map((_, index) => (
          <span
            key={`top-${index}`}
            className={styles.rulerMark}
            style={{ left: `${index * 40}px` }}
          >
            {index * 40}
          </span>
        ))}
      </div>
      <div
        className={styles.leftRuler}
        data-builder-ruler="left"
        data-builder-floating-ui="true"
        aria-label="Vertical ruler"
        role="presentation"
        style={{
          minWidth: 12 / Math.max(zoom, 0.1),
          cursor: 'crosshair',
          pointerEvents: interactive ? 'auto' : 'none',
          zIndex: RULER_Z_INDEX,
        }}
        onPointerDown={beginDrag('horizontal')}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        {Array.from({ length: Math.floor(stageHeight / 40) + 1 }).map((_, index) => (
          <span
            key={`left-${index}`}
            className={`${styles.rulerMark} ${styles.rulerMarkVertical}`}
            style={{ top: `${index * 40}px` }}
          >
            {index * 40}
          </span>
        ))}
      </div>
    </>
  );
}
