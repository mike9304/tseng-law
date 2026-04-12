'use client';

import styles from './SandboxPage.module.css';

export default function SandboxTopBar({
  locale,
  backend,
  draftSaveState,
  nodeCount,
  selectedSummary,
  selectionCount,
}: {
  locale: string;
  backend: 'blob' | 'file';
  draftSaveState: 'idle' | 'saving' | 'saved' | 'error';
  nodeCount: number;
  selectedSummary: string;
  selectionCount: number;
}) {
  return (
    <header className={styles.topBar}>
      <div className={styles.topBarTitle}>
        <span>Builder sandbox</span>
        <strong>Phase 2 shell slice</strong>
      </div>
      <div className={styles.topBarMeta}>
        <span className={styles.topBarChip}>locale: {locale}</span>
        <span className={styles.topBarChip}>backend: {backend}</span>
        <span className={styles.topBarChip}>nodes: {nodeCount}</span>
        <span className={styles.topBarChip}>selection count: {selectionCount}</span>
        <span className={styles.topBarChip}>selected: {selectedSummary}</span>
        <span
          className={`${styles.topBarChip} ${
            draftSaveState === 'saving'
              ? styles.statusBadgeSaving
              : draftSaveState === 'saved'
                ? styles.statusBadgeSaved
                : draftSaveState === 'error'
                  ? styles.statusBadgeError
                  : ''
          }`}
          title={
            draftSaveState === 'saving'
              ? '자동 저장 중...'
              : draftSaveState === 'saved'
                ? '저장 완료'
                : draftSaveState === 'error'
                  ? '저장 실패 — 네트워크를 확인하세요'
                  : '대기 중'
          }
        >
          {draftSaveState === 'saving' ? <span className={styles.savingSpinner} /> : null}
          draft: {draftSaveState}
        </span>
      </div>
    </header>
  );
}
