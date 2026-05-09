'use client';

import type { Dispatch, SetStateAction } from 'react';
import {
  zoomIn as stepZoomIn,
  zoomLabel,
  zoomOut as stepZoomOut,
  zoomTo,
  type ZoomState,
} from '@/lib/builder/canvas/zoom';
import styles from './SandboxPage.module.css';

type CanvasZoomDockProps = {
  fitCanvas: () => void;
  setZoomState: Dispatch<SetStateAction<ZoomState>>;
  zoomState: ZoomState;
};

export default function CanvasZoomDock({
  fitCanvas,
  setZoomState,
  zoomState,
}: CanvasZoomDockProps) {
  return (
    <div className={styles.zoomDock}>
      <button
        type="button"
        className={styles.toolbarButton}
        title="축소 (Cmd--)"
        onClick={() => setZoomState((currentState) => stepZoomOut(currentState))}
      >
        -
      </button>
      <span className={styles.zoomLabel}>{zoomLabel(zoomState)}</span>
      <input
        className={styles.zoomSlider}
        type="range"
        min={25}
        max={400}
        step={5}
        value={Math.round(zoomState.zoom * 100)}
        onChange={(event) => setZoomState((currentState) => zoomTo(currentState, Number(event.target.value) / 100))}
      />
      <button
        type="button"
        className={styles.toolbarButton}
        title="확대 (Cmd-+)"
        onClick={() => setZoomState((currentState) => stepZoomIn(currentState))}
      >
        +
      </button>
      <button
        type="button"
        className={styles.toolbarButton}
        title="100%"
        onClick={() => setZoomState((currentState) => zoomTo(currentState, 1))}
      >
        100%
      </button>
      <button
        type="button"
        className={styles.toolbarButton}
        title="화면에 맞추기"
        onClick={fitCanvas}
      >
        Fit
      </button>
    </div>
  );
}
