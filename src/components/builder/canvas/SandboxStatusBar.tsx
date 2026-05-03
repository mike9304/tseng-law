'use client';

import type { ViewportMode } from './SandboxTopBar';
import styles from './SandboxPage.module.css';

export type EditorDensity = 'compact' | 'cozy' | 'comfortable';
export type EditorThemeMode = 'light' | 'dark';

interface SandboxStatusBarProps {
  viewport: ViewportMode;
  draftSaveState: 'idle' | 'saving' | 'saved' | 'error';
  selectionCount: number;
  density: EditorDensity;
  themeMode: EditorThemeMode;
  onDensityChange: (density: EditorDensity) => void;
  onThemeModeChange: (mode: EditorThemeMode) => void;
}

const DENSITY_OPTIONS: EditorDensity[] = ['compact', 'cozy', 'comfortable'];

export default function SandboxStatusBar({
  viewport,
  draftSaveState,
  selectionCount,
  density,
  themeMode,
  onDensityChange,
  onThemeModeChange,
}: SandboxStatusBarProps) {
  return (
    <footer className={styles.statusBar} aria-label="Editor status">
      <div className={styles.statusBarCluster}>
        <span className={styles.statusBarItem}>Viewport: {viewport}</span>
        <span className={styles.statusBarItem}>{selectionCount} selected</span>
        <span className={`${styles.statusBarItem} ${styles[`statusBarSave_${draftSaveState}` as keyof typeof styles]}`}>
          {draftSaveState === 'idle' ? 'Autosave idle' : draftSaveState}
        </span>
      </div>
      <div className={styles.statusBarCluster}>
        <div className={styles.statusBarSegmented} aria-label="Editor density">
          {DENSITY_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={option === density ? styles.statusBarSegmentActive : ''}
              aria-pressed={option === density}
              onClick={() => onDensityChange(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={styles.statusBarToggle}
          aria-pressed={themeMode === 'dark'}
          onClick={() => onThemeModeChange(themeMode === 'dark' ? 'light' : 'dark')}
        >
          {themeMode === 'dark' ? 'Dark' : 'Light'}
        </button>
        <span className={styles.statusBarItem}>Press ? for shortcuts</span>
      </div>
    </footer>
  );
}
