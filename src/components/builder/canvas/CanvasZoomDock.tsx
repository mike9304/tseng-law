'use client';

import {
  memo,
  useCallback,
  useMemo,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from 'react';
import {
  zoomIn as stepZoomIn,
  zoomLabel,
  zoomOut as stepZoomOut,
  zoomTo,
  type ZoomState,
} from '@/lib/builder/canvas/zoom';
import type { Locale } from '@/lib/locales';
import { getCanvasZoomDockCopy } from '@/components/builder/canvas/canvas-zoom-dock-copy';
import { useShortcutLabels, type ShortcutAction } from '@/components/builder/canvas/hooks/useShortcutLabels';
import styles from './SandboxPage.module.css';

const ZOOM_DOCK_SHORTCUT_ACTIONS: ShortcutAction[] = ['zoomOut', 'zoomIn', 'zoomReset'];

type CanvasZoomDockProps = {
  fitCanvas: () => void;
  locale?: Locale;
  setZoomState: Dispatch<SetStateAction<ZoomState>>;
  zoomState: ZoomState;
};

function CanvasZoomDock({
  fitCanvas,
  locale = 'ko',
  setZoomState,
  zoomState,
}: CanvasZoomDockProps) {
  const copy = useMemo(() => getCanvasZoomDockCopy(locale), [locale]);
  const shortcutLabels = useShortcutLabels(ZOOM_DOCK_SHORTCUT_ACTIONS);
  const shortcutTitle = useCallback((title: string, action: ShortcutAction) => {
    const label = shortcutLabels.get(action)?.title;
    return label ? `${title} (${label})` : title;
  }, [shortcutLabels]);
  const currentZoomLabel = useMemo(() => zoomLabel(zoomState), [zoomState]);
  const zoomPercent = Math.round(zoomState.zoom * 100);
  const handleZoomOut = useCallback(() => {
    setZoomState((currentState) => stepZoomOut(currentState));
  }, [setZoomState]);
  const handleZoomIn = useCallback(() => {
    setZoomState((currentState) => stepZoomIn(currentState));
  }, [setZoomState]);
  const handleZoomReset = useCallback(() => {
    setZoomState((currentState) => zoomTo(currentState, 1));
  }, [setZoomState]);
  const handleZoomSliderChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setZoomState((currentState) => zoomTo(currentState, Number(event.target.value) / 100));
  }, [setZoomState]);

  return (
    <div className={styles.zoomDock} data-builder-zoom-dock="true">
      <button
        type="button"
        className={styles.toolbarButton}
        data-builder-zoom-action="out"
        title={shortcutTitle(copy.zoomOutTitle, 'zoomOut')}
        onClick={handleZoomOut}
      >
        -
      </button>
      <span className={styles.zoomLabel} data-builder-zoom-label="true">{currentZoomLabel}</span>
      <input
        className={styles.zoomSlider}
        type="range"
        aria-label={copy.zoomAriaLabel}
        min={25}
        max={200}
        step={5}
        value={zoomPercent}
        onChange={handleZoomSliderChange}
      />
      <button
        type="button"
        className={styles.toolbarButton}
        data-builder-zoom-action="in"
        title={shortcutTitle(copy.zoomInTitle, 'zoomIn')}
        onClick={handleZoomIn}
      >
        +
      </button>
      <button
        type="button"
        className={styles.toolbarButton}
        data-builder-zoom-action="100"
        title={shortcutTitle('100%', 'zoomReset')}
        onClick={handleZoomReset}
      >
        100%
      </button>
      <button
        type="button"
        className={styles.toolbarButton}
        data-builder-zoom-action="fit"
        title={copy.fitTitle}
        onClick={fitCanvas}
      >
        {copy.fitButtonLabel}
      </button>
    </div>
  );
}

export default memo(CanvasZoomDock);
