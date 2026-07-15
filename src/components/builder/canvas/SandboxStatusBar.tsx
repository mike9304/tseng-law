'use client';

import type { Locale } from '@/lib/locales';
import type { ViewportMode } from './SandboxTopBar';
import styles from './SandboxPage.module.css';
import chromeStyles from './SandboxChrome.module.css';
import { getSandboxStatusBarCopy } from './sandbox-status-bar-copy';

export type EditorDensity = 'compact' | 'cozy' | 'comfortable';

interface SandboxStatusBarProps {
  locale: Locale;
  viewport: ViewportMode;
  selectionCount: number;
  density: EditorDensity;
  onDensityChange: (density: EditorDensity) => void;
}

const DENSITY_OPTIONS: EditorDensity[] = ['compact', 'cozy', 'comfortable'];

export default function SandboxStatusBar({
  locale,
  viewport,
  selectionCount,
  density,
  onDensityChange,
}: SandboxStatusBarProps) {
  const copy = getSandboxStatusBarCopy(locale);

  return (
    <footer className={`${styles.statusBar} ${chromeStyles.statusBar}`} aria-label={copy.footerAriaLabel}>
      <div className={`${styles.statusBarCluster} ${chromeStyles.statusBarCluster}`}>
        <span className={styles.statusBarItem}>{copy.viewportLabel}: {viewport}</span>
        {selectionCount > 0 ? (
          <span className={styles.statusBarItem}>{copy.selectionCountLabel(selectionCount)}</span>
        ) : null}
      </div>
      <div className={`${styles.statusBarCluster} ${chromeStyles.statusBarCluster}`}>
        <div className={`${styles.statusBarSegmented} ${chromeStyles.statusBarDensity}`} aria-label={copy.densityAriaLabel}>
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
        <span className={styles.statusBarItem} data-builder-status-shortcuts="true">{copy.shortcutsLabel}</span>
      </div>
    </footer>
  );
}
