'use client';

import { memo, useCallback, useMemo, type ChangeEvent } from 'react';
import type { Locale } from '@/lib/locales';
import { getCanvasStageToolbarCopy } from '@/components/builder/canvas/canvas-stage-toolbar-copy';
import { useShortcutLabels, type ShortcutAction } from '@/components/builder/canvas/hooks/useShortcutLabels';
import stageToolbarStyles from './CanvasStageToolbar.module.css';
import shellStyles from './SandboxPage.module.css';

const STAGE_TOOLBAR_SHORTCUT_ACTIONS: ShortcutAction[] = ['undo', 'redo', 'toggleGrid'];

type CanvasStageToolbarProps = {
  canRedo: boolean;
  canUndo: boolean;
  handleRedo: () => void;
  handleUndo: () => void;
  gridEnabled: boolean;
  gridSize: number;
  locale?: Locale;
  setContextMenu: (menu: null) => void;
  onToggleGrid: () => void;
  onGridSizeChange: (size: number) => void;
};

function CanvasStageToolbar({
  canRedo,
  canUndo,
  gridEnabled,
  gridSize,
  handleRedo,
  handleUndo,
  locale = 'ko',
  onGridSizeChange,
  onToggleGrid,
  setContextMenu,
}: CanvasStageToolbarProps) {
  const copy = useMemo(() => getCanvasStageToolbarCopy(locale), [locale]);
  const shortcutLabels = useShortcutLabels(STAGE_TOOLBAR_SHORTCUT_ACTIONS);
  const shortcutTitle = useCallback((title: string, action: ShortcutAction) => {
    const label = shortcutLabels.get(action)?.title;
    return label ? `${title} (${label})` : title;
  }, [shortcutLabels]);
  const handleToggleGridClick = useCallback(() => {
    setContextMenu(null);
    onToggleGrid();
  }, [onToggleGrid, setContextMenu]);
  const handleGridSizeInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onGridSizeChange(Number(event.target.value));
  }, [onGridSizeChange]);
  const handleUndoClick = useCallback(() => {
    setContextMenu(null);
    handleUndo();
  }, [handleUndo, setContextMenu]);
  const handleRedoClick = useCallback(() => {
    setContextMenu(null);
    handleRedo();
  }, [handleRedo, setContextMenu]);

  return (
    <div
      className={`${shellStyles.canvasToolbar} ${stageToolbarStyles.root}`}
      data-builder-floating-ui="true"
      data-builder-stage-toolbar="true"
    >
      <button
        type="button"
        className={stageToolbarStyles.button}
        data-active={gridEnabled ? 'true' : undefined}
        aria-pressed={gridEnabled}
        title={shortcutTitle(copy.gridSnapTitle, 'toggleGrid')}
        onClick={handleToggleGridClick}
      >
        {copy.gridButtonLabel}
      </button>
      <label
        className={stageToolbarStyles.gridSizeControl}
        title={copy.gridSizeTitle}
      >
        <span className={stageToolbarStyles.gridSizePrefix}>px</span>
        <input
          className={stageToolbarStyles.gridSizeInput}
          aria-label={copy.gridSizeAriaLabel}
          disabled={!gridEnabled}
          min={4}
          max={80}
          step={4}
          type="number"
          value={gridSize}
          onChange={handleGridSizeInputChange}
        />
      </label>
      <button
        type="button"
        className={stageToolbarStyles.button}
        title={shortcutTitle(copy.undoTitle, 'undo')}
        onClick={handleUndoClick}
        disabled={!canUndo}
      >
        {copy.undoButtonLabel}
      </button>
      <button
        type="button"
        className={stageToolbarStyles.button}
        title={shortcutTitle(copy.redoTitle, 'redo')}
        onClick={handleRedoClick}
        disabled={!canRedo}
      >
        {copy.redoButtonLabel}
      </button>
    </div>
  );
}

export default memo(CanvasStageToolbar);
