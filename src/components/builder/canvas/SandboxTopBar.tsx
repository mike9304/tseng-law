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
  draftSaveState,
  selectedSummary,
  selectionCount,
  viewport,
  onViewportChange,
  onPublish,
  onOpenSeo,
  onOpenSettings,
  onOpenHistory,
  onOpenPreview,
  onOpenPages,
  activePageId,
  onLocaleChange,
  siteName,
  currentSlug,
  saveBlockReason,
}: {
  locale: string;
  draftSaveState: 'idle' | 'saving' | 'saved' | 'error';
  selectedSummary: string;
  selectionCount: number;
  viewport: ViewportMode;
  onViewportChange: (mode: ViewportMode) => void;
  onPublish: () => void;
  onOpenSeo?: () => void;
  onOpenSettings?: () => void;
  onOpenHistory?: () => void;
  onOpenPreview?: () => void;
  onOpenPages?: () => void;
  activePageId?: string | null;
  onLocaleChange?: (locale: Locale, linkedPageId: string | null) => void;
  siteName?: string;
  currentSlug?: string;
  saveBlockReason?: string | null;
}) {
  const { document, selectedNodeId, resetResponsiveOverride } = useBuilderCanvasStore();
  const saveLabel = draftSaveState === 'saving' ? 'Saving...' : draftSaveState === 'saved' ? 'Saved' : draftSaveState === 'error' ? 'Save failed' : '';
  const saveClass = draftSaveState === 'saving' ? styles.statusBadgeSaving : draftSaveState === 'saved' ? styles.statusBadgeSaved : draftSaveState === 'error' ? styles.statusBadgeError : '';
  const canOpenSeo = Boolean(onOpenSeo && activePageId);
  const selectedNode = document?.nodes.find((node) => node.id === selectedNodeId) ?? null;
  const hasSelectedOverride = Boolean(selectedNode && hasResponsiveOverride(selectedNode, viewport));
  const canResetViewport = viewport !== 'desktop' && Boolean(selectedNode) && hasSelectedOverride;
  const pageLabel = currentSlug?.trim() ? `/${currentSlug.trim()}` : 'Home';

  return (
    <header className={styles.topBar}>
      <div className={styles.topBarTitle}>
        <button
          type="button"
          className={styles.siteNameButton}
          title="사이트 설정"
          onClick={onOpenSettings}
        >
          <span className={styles.siteMark} aria-hidden="true" />
          <span>{siteName || '호정국제'}</span>
        </button>
        <button
          type="button"
          className={styles.pageDropdownButton}
          title="Pages"
          onClick={onOpenPages}
        >
          <span>{pageLabel}</span>
          <span aria-hidden="true">⌄</span>
        </button>
      </div>

      <div className={styles.topBarMeta}>
        {onLocaleChange ? (
          <LocaleSwitcher
            currentLocale={locale as Locale}
            activePageId={activePageId ?? null}
            onLocaleChange={onLocaleChange}
          />
        ) : (
          <span className={styles.topBarChip}>locale: {locale}</span>
        )}
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
                data-builder-topbar-viewport={option.mode}
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
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className={styles.topBarActions}>
        {selectionCount > 0 ? (
          <span className={styles.selectionPill} title={selectedSummary}>
            {selectionCount} selected
          </span>
        ) : null}
        {draftSaveState === 'saving' && <span className={styles.savingSpinner} />}
        {saveLabel && <span className={`${styles.topBarChip} ${saveClass}`}>{saveLabel}</span>}
        {saveBlockReason ? (
          <span className={`${styles.topBarChip} ${styles.statusBadgeError}`} title={saveBlockReason}>
            저장 차단
          </span>
        ) : null}
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
          title="Preview"
          disabled={!onOpenPreview}
          onClick={onOpenPreview}
        >
          Preview
        </button>
        <button
          type="button"
          className={styles.topBarChip}
          title="현재 페이지 SEO"
          disabled={!canOpenSeo}
          onClick={onOpenSeo}
        >
          SEO
        </button>
        <button
          type="button"
          className={styles.publishButton}
          title="사이트 발행"
          disabled={Boolean(saveBlockReason)}
          onClick={onPublish}
        >
          Publish
        </button>
      </div>
    </header>
  );
}
