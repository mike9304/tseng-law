'use client';

import styles from './SandboxPage.module.css';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

function viewportButtonStyle(active: boolean): React.CSSProperties {
  return {
    fontWeight: active ? 'bold' : 'normal',
    opacity: active ? 1 : 0.5,
    cursor: 'pointer',
    background: active ? '#eff6ff' : undefined,
    borderColor: active ? '#123b63' : undefined,
    color: active ? '#123b63' : undefined,
  };
}

export default function SandboxTopBar({
  locale,
  backend,
  draftSaveState,
  nodeCount,
  selectedSummary,
  selectionCount,
  viewport,
  onViewportChange,
  onPublish,
}: {
  locale: string;
  backend: string;
  draftSaveState: 'idle' | 'saving' | 'saved' | 'error';
  nodeCount: number;
  selectedSummary: string;
  selectionCount: number;
  viewport: ViewportMode;
  onViewportChange: (mode: ViewportMode) => void;
  onPublish: () => void;
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
        <button
          type="button"
          className={styles.topBarChip}
          title="Desktop"
          style={viewportButtonStyle(viewport === 'desktop')}
          onClick={() => onViewportChange('desktop')}
        >
          Desktop
        </button>
        <button
          type="button"
          className={styles.topBarChip}
          title="Tablet (768px)"
          style={viewportButtonStyle(viewport === 'tablet')}
          onClick={() => onViewportChange('tablet')}
        >
          Tablet
        </button>
        <button
          type="button"
          className={styles.topBarChip}
          title="Mobile (375px)"
          style={viewportButtonStyle(viewport === 'mobile')}
          onClick={() => onViewportChange('mobile')}
        >
          Mobile
        </button>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {draftSaveState === 'saving' && <span className={styles.savingSpinner} />}
        {saveLabel && <span className={`${styles.topBarChip} ${saveClass}`}>{saveLabel}</span>}
        <button type="button" className={styles.topBarChip} title="미리보기" style={{ cursor: 'pointer' }}>미리보기</button>
        <button
          type="button"
          style={{ padding: '6px 16px', background: '#123b63', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
          title="사이트 발행"
          onClick={onPublish}
        >
          발행
        </button>
      </div>
    </header>
  );
}
