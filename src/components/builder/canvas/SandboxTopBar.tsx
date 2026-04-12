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
  backend: string;
  draftSaveState: 'idle' | 'saving' | 'saved' | 'error';
  nodeCount: number;
  selectedSummary: string;
  selectionCount: number;
}) {
  const saveLabel = draftSaveState === 'saving' ? '저장 중...' : draftSaveState === 'saved' ? '저장됨' : draftSaveState === 'error' ? '저장 실패' : '';
  const saveClass = draftSaveState === 'saving' ? styles.statusBadgeSaving : draftSaveState === 'saved' ? styles.statusBadgeSaved : draftSaveState === 'error' ? styles.statusBadgeError : '';

  return (
    <header className={styles.topBar}>
      <div className={styles.topBarTitle}>
        <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>호정국제</strong>
        {selectionCount > 0 && <span className={styles.topBarChip}>{selectionCount}개 선택</span>}
      </div>

      <div className={styles.topBarMeta} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        <span className={styles.topBarChip}>locale: {locale}</span>
        <span className={styles.topBarChip}>backend: {backend}</span>
        <span className={styles.topBarChip}>nodes: {nodeCount}</span>
        <span className={styles.topBarChip}>selected: {selectedSummary}</span>
        <span className={styles.topBarChip}>Space + drag: pan</span>
        <button type="button" className={styles.topBarChip} title="Desktop" style={{ fontWeight: 'bold' }}>🖥</button>
        <button type="button" className={styles.topBarChip} title="Tablet" style={{ opacity: 0.5 }}>📱</button>
        <button type="button" className={styles.topBarChip} title="Mobile" style={{ opacity: 0.5 }}>📲</button>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {draftSaveState === 'saving' && <span className={styles.savingSpinner} />}
        {saveLabel && <span className={`${styles.topBarChip} ${saveClass}`}>{saveLabel}</span>}
        <button type="button" className={styles.topBarChip} title="미리보기" style={{ cursor: 'pointer' }}>미리보기</button>
        <button type="button" style={{ padding: '6px 16px', background: '#123b63', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }} title="사이트 발행">발행</button>
      </div>
    </header>
  );
}
