'use client';

import styles from './SandboxPage.module.css';

type CanvasStageToolbarProps = {
  canRedo: boolean;
  canUndo: boolean;
  handleRedo: () => void;
  handleUndo: () => void;
  gridEnabled: boolean;
  gridSize: number;
  setContextMenu: (menu: null) => void;
  onToggleGrid: () => void;
  onGridSizeChange: (size: number) => void;
};

export default function CanvasStageToolbar({
  canRedo,
  canUndo,
  gridEnabled,
  gridSize,
  handleRedo,
  handleUndo,
  onGridSizeChange,
  onToggleGrid,
  setContextMenu,
}: CanvasStageToolbarProps) {
  return (
    <div
      className={styles.canvasToolbar}
      data-builder-floating-ui="true"
      style={{ pointerEvents: 'auto', zIndex: 10030 }}
    >
      <button
        type="button"
        className={styles.toolbarButton}
        data-active={gridEnabled ? 'true' : undefined}
        aria-pressed={gridEnabled}
        title="Grid snap (Shift-G)"
        style={gridEnabled ? {
          background: '#116dff',
          borderColor: '#116dff',
          color: '#fff',
          boxShadow: '0 12px 28px rgba(17, 109, 255, 0.22)',
        } : undefined}
        onClick={() => {
          setContextMenu(null);
          onToggleGrid();
        }}
      >
        Grid
      </button>
      <label
        title="Grid size"
        style={{
          alignItems: 'center',
          display: 'inline-flex',
          gap: 4,
          minHeight: 34,
          padding: '0 8px',
          border: '1px solid rgba(148, 163, 184, 0.45)',
          borderRadius: 999,
          background: 'rgba(255, 255, 255, 0.92)',
          color: '#334155',
          fontSize: 11,
          fontWeight: 800,
        }}
      >
        <span>px</span>
        <input
          aria-label="Grid size"
          disabled={!gridEnabled}
          min={4}
          max={80}
          step={4}
          type="number"
          value={gridSize}
          style={{
            width: 48,
            border: 0,
            background: 'transparent',
            color: '#0f172a',
            font: 'inherit',
          }}
          onChange={(event) => onGridSizeChange(Number(event.target.value))}
        />
      </label>
      <button
        type="button"
        className={styles.toolbarButton}
        title="실행 취소 (Cmd-Z)"
        onClick={() => {
          setContextMenu(null);
          handleUndo();
        }}
        disabled={!canUndo}
      >
        Undo
      </button>
      <button
        type="button"
        className={styles.toolbarButton}
        title="다시 실행 (Cmd-Shift-Z)"
        onClick={() => {
          setContextMenu(null);
          handleRedo();
        }}
        disabled={!canRedo}
      >
        Redo
      </button>
    </div>
  );
}
