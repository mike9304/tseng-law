'use client';

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

function toScreen(rect: OverlayRect, zoom: number, panX: number, panY: number): OverlayRect {
  return {
    x: rect.x * zoom + panX,
    y: rect.y * zoom + panY,
    width: rect.width * zoom,
    height: rect.height * zoom,
  };
}

export default function DragGhost({
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
      {startRects.map((rect, index) => {
        const screen = toScreen(rect, zoom, panX, panY);
        return (
          <div
            key={`origin-${index}`}
            className={styles.canvasOverlayDragOrigin}
            style={{
              left: `${screen.x}px`,
              top: `${screen.y}px`,
              width: `${screen.width}px`,
              height: `${screen.height}px`,
            }}
            aria-hidden
          />
        );
      })}

      {mode === 'move' && currentRects.map((rect, index) => {
        const screen = toScreen(rect, zoom, panX, panY);
        return (
          <div
            key={`ghost-${index}`}
            className={styles.canvasOverlayDragGhost}
            style={{
              left: `${screen.x}px`,
              top: `${screen.y}px`,
              width: `${screen.width}px`,
              height: `${screen.height}px`,
            }}
            aria-hidden
          />
        );
      })}
    </>
  );
}
