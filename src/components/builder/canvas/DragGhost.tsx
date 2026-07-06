'use client';

import { memo } from 'react';
import styles from './SandboxPage.module.css';

export interface OverlayRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface DragGhostProps {
  mode: 'move' | 'resize';
  startRects: OverlayRect[];
  currentRects: OverlayRect[];
  zoom: number;
  panX: number;
  panY: number;
}

const DragOriginRects = memo(function DragOriginRects({
  panX,
  panY,
  rects,
  zoom,
}: {
  panX: number;
  panY: number;
  rects: OverlayRect[];
  zoom: number;
}) {
  return (
    <>
      {rects.map((rect, index) => (
        <div
          key={`origin-${index}`}
          className={styles.canvasOverlayDragOrigin}
          style={{
            left: `${rect.x * zoom + panX}px`,
            top: `${rect.y * zoom + panY}px`,
            width: `${rect.width * zoom}px`,
            height: `${rect.height * zoom}px`,
          }}
          aria-hidden
        />
      ))}
    </>
  );
});

const DragCurrentRects = memo(function DragCurrentRects({
  panX,
  panY,
  rects,
  zoom,
}: {
  panX: number;
  panY: number;
  rects: OverlayRect[];
  zoom: number;
}) {
  return (
    <>
      {rects.map((rect, index) => (
        <div
          key={`ghost-${index}`}
          className={styles.canvasOverlayDragGhost}
          style={{
            left: `${rect.x * zoom + panX}px`,
            top: `${rect.y * zoom + panY}px`,
            width: `${rect.width * zoom}px`,
            height: `${rect.height * zoom}px`,
          }}
          aria-hidden
        />
      ))}
    </>
  );
});

function DragGhost({
  mode,
  startRects,
  currentRects,
  zoom,
  panX,
  panY,
}: DragGhostProps) {
  if (startRects.length === 0) return null;

  return (
    <>
      <DragOriginRects rects={startRects} zoom={zoom} panX={panX} panY={panY} />
      {mode === 'move' ? (
        <DragCurrentRects rects={currentRects} zoom={zoom} panX={panX} panY={panY} />
      ) : null}
    </>
  );
}

export default memo(DragGhost);
