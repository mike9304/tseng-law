'use client';

import type { Locale } from '@/lib/locales';
import type { ViewportMode } from './SandboxTopBar';
import styles from './SandboxPage.module.css';
import { getSandboxStatusBarCopy } from './sandbox-status-bar-copy';

export type EditorDensity = 'compact' | 'cozy' | 'comfortable';
export type EditorThemeMode = 'light' | 'dark';

interface SandboxStatusBarProps {
  locale: Locale;
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
  locale,
  viewport,
  draftSaveState,
  selectionCount,
  density,
  themeMode,
  onDensityChange,
  onThemeModeChange,
}: SandboxStatusBarProps) {
  const copy = getSandboxStatusBarCopy(locale);

  return (
    <footer className={styles.statusBar} aria-label={copy.footerAriaLabel}>
      <div className={styles.statusBarCluster}>
        <span className={styles.statusBarItem}>{copy.viewportLabel}: {viewport}</span>
        {selectionCount > 0 ? (
          <span className={styles.statusBarItem}>{copy.selectionCountLabel(selectionCount)}</span>
        ) : null}
        {draftSaveState !== 'idle' ? (
          <span className={`${styles.statusBarItem} ${styles[`statusBarSave_${draftSaveState}` as keyof typeof styles]}`}>
            {copy.saveStateLabels[draftSaveState]}
          </span>
        ) : null}
      </div>
      <div className={styles.statusBarCluster}>
        <div className={styles.statusBarSegmented} aria-label={copy.densityAriaLabel}>
          {DENSITY_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              className={option === density ? styles.statusBarSegmentActive : ''}
              aria-pressed={option === density}
              onClick={() => onDensityChange(option)}
            >
              {copy.densityLabels[option]}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={styles.statusBarToggle}
          aria-pressed={themeMode === 'dark'}
          onClick={() => onThemeModeChange(themeMode === 'dark' ? 'light' : 'dark')}
        >
          {copy.themeModeLabels[themeMode]}
        </button>
        <span className={styles.statusBarItem} data-builder-status-shortcuts="true">{copy.shortcutsLabel}</span>
      </div>
    </footer>
  );
}
