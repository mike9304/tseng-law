'use client';

import type { Locale } from '@/lib/locales';
import BreakpointBadge from '@/components/builder/editor/BreakpointBadge';
import {
  hasResponsiveOverride,
  VIEWPORT_WIDTHS,
} from '@/lib/builder/canvas/responsive';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import LocaleSwitcher from './LocaleSwitcher';
import styles from './SandboxPage.module.css';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

const VIEWPORT_OPTIONS: Array<{ mode: ViewportMode; label: string; icon: string }> = [
  { mode: 'desktop', label: 'Desktop', icon: 'D' },
  { mode: 'tablet', label: 'Tablet', icon: 'T' },
  { mode: 'mobile', label: 'Mobile', icon: 'M' },
];

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
  onOpenSeo,
  onOpenSettings,
  onOpenHistory,
  onOpenPreview,
  activePageId,
  onLocaleChange,
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
  onOpenSeo?: () => void;
  onOpenSettings?: () => void;
  onOpenHistory?: () => void;
  onOpenPreview?: () => void;
  activePageId?: string | null;
  onLocaleChange?: (locale: Locale, linkedPageId: string | null) => void;
}) {
  const { document, selectedNodeId, resetResponsiveOverride } = useBuilderCanvasStore();
  const saveLabel = draftSaveState === 'saving' ? '저장 중...' : draftSaveState === 'saved' ? '저장됨' : draftSaveState === 'error' ? '저장 실패' : '';
  const saveClass = draftSaveState === 'saving' ? styles.statusBadgeSaving : draftSaveState === 'saved' ? styles.statusBadgeSaved : draftSaveState === 'error' ? styles.statusBadgeError : '';
  const canOpenSeo = Boolean(onOpenSeo && activePageId);
  const selectedNode = document?.nodes.find((node) => node.id === selectedNodeId) ?? null;
  const hasSelectedOverride = Boolean(selectedNode && hasResponsiveOverride(selectedNode, viewport));
  const canResetViewport = viewport !== 'desktop' && Boolean(selectedNode) && hasSelectedOverride;

  return (
    <header className={styles.topBar}>
      <div className={styles.topBarTitle}>
        <strong
          style={{ fontSize: '0.95rem', color: '#0f172a', cursor: onOpenSettings ? 'pointer' : 'default' }}
          title="사이트 설정"
          onClick={onOpenSettings}
        >
          호정국제
        </strong>
        {selectionCount > 0 && <span className={styles.topBarChip}>{selectionCount}개 선택</span>}
      </div>

      <div className={styles.topBarMeta} style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {onLocaleChange ? (
          <LocaleSwitcher
            currentLocale={locale as Locale}
            activePageId={activePageId ?? null}
            onLocaleChange={onLocaleChange}
          />
        ) : (
          <span className={styles.topBarChip}>locale: {locale}</span>
        )}
        <span className={styles.topBarChip}>backend: {backend}</span>
        <span className={styles.topBarChip}>nodes: {nodeCount}</span>
        <span className={styles.topBarChip}>selected: {selectedSummary}</span>
        <span className={styles.topBarChip}>Space + drag: pan</span>
        <div className={styles.breakpointSwitcher} aria-label="Viewport breakpoint switcher">
          {VIEWPORT_OPTIONS.map((option) => {
            const active = viewport === option.mode;
            return (
              <button
                key={option.mode}
                type="button"
                className={`${styles.breakpointButton} ${active ? styles.breakpointButtonActive : ''}`}
                title={`${option.label} (${VIEWPORT_WIDTHS[option.mode]}px)`}
                aria-pressed={active}
                onClick={() => onViewportChange(option.mode)}
              >
                <span className={styles.breakpointIcon}>{option.icon}</span>
                <span>{option.label}</span>
                <small>{VIEWPORT_WIDTHS[option.mode]}px</small>
              </button>
            );
          })}
          <button
            type="button"
            className={styles.breakpointResetButton}
            disabled={!canResetViewport}
            title={selectedNode && viewport !== 'desktop'
              ? `Reset ${viewport} overrides for ${selectedNode.id}`
              : 'Select a node on tablet/mobile to reset overrides'}
            onClick={() => {
              if (!selectedNode || viewport === 'desktop') return;
              resetResponsiveOverride(selectedNode.id, viewport);
            }}
          >
            <BreakpointBadge viewport={viewport} active={hasSelectedOverride} label="override" />
            <span>Reset to desktop</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {draftSaveState === 'saving' && <span className={styles.savingSpinner} />}
        {saveLabel && <span className={`${styles.topBarChip} ${saveClass}`}>{saveLabel}</span>}
        {onOpenHistory && (
          <button
            type="button"
            className={styles.topBarChip}
            title="버전 히스토리"
            style={{ cursor: 'pointer' }}
            onClick={onOpenHistory}
          >
            히스토리
          </button>
        )}
        <button
          type="button"
          className={styles.topBarChip}
          title="미리보기 (디바이스 프레임)"
          style={{
            cursor: onOpenPreview ? 'pointer' : 'not-allowed',
            opacity: onOpenPreview ? 1 : 0.5,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
          disabled={!onOpenPreview}
          onClick={onOpenPreview}
        >
          <span aria-hidden style={{ fontSize: '0.85rem' }}>👁</span>
          <span>미리보기</span>
        </button>
        <button
          type="button"
          className={styles.topBarChip}
          title="현재 페이지 SEO"
          style={{
            cursor: canOpenSeo ? 'pointer' : 'not-allowed',
            opacity: canOpenSeo ? 1 : 0.5,
            borderColor: '#cbd5e1',
            background: '#fff',
            color: '#0f172a',
            fontWeight: 600,
          }}
          disabled={!canOpenSeo}
          onClick={onOpenSeo}
        >
          SEO
        </button>
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
