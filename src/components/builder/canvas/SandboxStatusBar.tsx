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
const DENSITY_LABELS: Record<EditorDensity, string> = { compact: '좁게', cozy: '보통', comfortable: '넓게' };

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
        <span className={styles.statusBarItem}>뷰포트: {viewport}</span>
        <span className={styles.statusBarItem}>{selectionCount > 0 ? `${selectionCount}개 선택됨` : ''}</span>
        <span className={`${styles.statusBarItem} ${styles[`statusBarSave_${draftSaveState}` as keyof typeof styles]}`}>
          {draftSaveState === 'saving' ? '저장 중...' : draftSaveState === 'saved' ? '저장됨' : draftSaveState === 'error' ? '저장 실패' : ''}
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
              {DENSITY_LABELS[option]}
            </button>
          ))}
        </div>
        <button
          type="button"
          className={styles.statusBarToggle}
          aria-pressed={themeMode === 'dark'}
          onClick={() => onThemeModeChange(themeMode === 'dark' ? 'light' : 'dark')}
        >
          {themeMode === 'dark' ? '다크' : '라이트'}
        </button>
        <span className={styles.statusBarItem}>단축키: ?</span>
      </div>
    </footer>
  );
}
