'use client';

import type { PointerEvent as ReactPointerEvent } from 'react';
import { RESIZE_HANDLES, type ResizeHandle } from './canvasNodeTypes';
import styles from './CanvasNodeSelectionOverlay.module.css';

type RotationReadout = { degrees: number; x: number; y: number } | null;

type CanvasNodeSelectionOverlayProps = {
  show: boolean;
  nodeId: string;
  nodeKind: string;
  width: number;
  height: number;
  rotationReadout: RotationReadout;
  onRotationPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void;
  onResizeStart: (
    nodeId: string,
    handle: ResizeHandle,
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => void;
};

export function CanvasNodeSelectionOverlay({
  show,
  nodeId,
  nodeKind,
  width,
  height,
  rotationReadout,
  onRotationPointerDown,
  onResizeStart,
}: CanvasNodeSelectionOverlayProps) {
  if (!show) return null;

  return (
    <>
      <div className={styles.rotationLine} />
      <div
        className={styles.rotationHandle}
        onPointerDown={onRotationPointerDown}
        role="button"
        aria-label={`Rotate ${nodeKind} node`}
      />
      {RESIZE_HANDLES.map((handle) => (
        <button
          key={handle}
          type="button"
          className={`${styles.resizeHandle} ${styles[`resizeHandle${handle.toUpperCase()}` as keyof typeof styles]}`}
          onPointerDown={(event) => {
            event.stopPropagation();
            onResizeStart(nodeId, handle, event);
          }}
          aria-label={`Resize ${nodeKind} node ${handle}`}
        />
      ))}
      <div className={styles.nodeSizeLabel} aria-hidden>
        {nodeKind} · {Math.round(width)}×{Math.round(height)}
      </div>
      {rotationReadout ? (
        <div
          className={styles.rotationReadout}
          style={{
            left: `${rotationReadout.x}px`,
            top: `${rotationReadout.y}px`,
          }}
          aria-live="polite"
        >
          {rotationReadout.degrees}°
        </div>
      ) : null}
    </>
  );
}
