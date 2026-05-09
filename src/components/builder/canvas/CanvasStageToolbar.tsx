'use client';

import styles from './SandboxPage.module.css';

type CanvasStageToolbarProps = {
  canRedo: boolean;
  canUndo: boolean;
  handleRedo: () => void;
  handleUndo: () => void;
  setContextMenu: (menu: null) => void;
};

export default function CanvasStageToolbar({
  canRedo,
  canUndo,
  handleRedo,
  handleUndo,
  setContextMenu,
}: CanvasStageToolbarProps) {
  return (
    <div className={styles.canvasToolbar}>
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
