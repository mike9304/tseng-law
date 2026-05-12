'use client';

import type { Dispatch, SetStateAction } from 'react';
import {
  zoomIn as stepZoomIn,
  zoomLabel,
  zoomOut as stepZoomOut,
  zoomTo,
  type ZoomState,
} from '@/lib/builder/canvas/zoom';
import { useShortcutLabels } from '@/components/builder/canvas/hooks/useShortcutLabels';
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
  const shortcutLabels = useShortcutLabels(['zoomOut', 'zoomIn', 'zoomReset']);
  const shortcutTitle = (title: string, action: 'zoomOut' | 'zoomIn' | 'zoomReset') => {
    const label = shortcutLabels.get(action)?.title;
    return label ? `${title} (${label})` : title;
  };

  return (
    <div className={styles.zoomDock} data-builder-zoom-dock="true">
      <button
        type="button"
        className={styles.toolbarButton}
        data-builder-zoom-action="out"
        title={shortcutTitle('축소', 'zoomOut')}
        onClick={() => setZoomState((currentState) => stepZoomOut(currentState))}
      >
        -
      </button>
      <span className={styles.zoomLabel} data-builder-zoom-label="true">{zoomLabel(zoomState)}</span>
      <input
        className={styles.zoomSlider}
        type="range"
        aria-label="Canvas zoom"
        min={25}
        max={200}
        step={5}
        value={Math.round(zoomState.zoom * 100)}
        onChange={(event) => setZoomState((currentState) => zoomTo(currentState, Number(event.target.value) / 100))}
      />
      <button
        type="button"
        className={styles.toolbarButton}
        data-builder-zoom-action="in"
        title={shortcutTitle('확대', 'zoomIn')}
        onClick={() => setZoomState((currentState) => stepZoomIn(currentState))}
      >
        +
      </button>
      <button
        type="button"
        className={styles.toolbarButton}
        data-builder-zoom-action="100"
        title={shortcutTitle('100%', 'zoomReset')}
        onClick={() => setZoomState((currentState) => zoomTo(currentState, 1))}
      >
        100%
      </button>
      <button
        type="button"
        className={styles.toolbarButton}
        data-builder-zoom-action="fit"
        title="화면에 맞추기"
        onClick={fitCanvas}
      >
        Fit
      </button>
    </div>
  );
}
