'use client';

import { memo, useCallback, useEffect, useMemo, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import { normalizeLocale, type Locale } from '@/lib/locales';
import BreakpointBadge from '@/components/builder/editor/BreakpointBadge';
import ModalShell from '@/components/builder/canvas/ModalShell';
import {
  hasResponsiveOverride,
  VIEWPORT_WIDTHS,
} from '@/lib/builder/canvas/responsive';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import LocaleSwitcher from './LocaleSwitcher';
import EditorThemeToggle from './EditorThemeToggle';
import EditorPrefsButton from './EditorPrefsButton';
import EditorChromeIcon, { type EditorChromeIconName } from './EditorChromeIcon';
import {
  ADMIN_NAV_TREE,
} from '@/lib/builder/admin-nav/nav-config';
import {
  pushRecentAdminNav,
  readRecentAdminNav,
  writeRecentAdminNav,
  type AdminNavHistoryEntry,
} from '@/lib/builder/admin-nav/recent-nav';
import {
  buildAdminQuickJumpGroups,
  buildAdminQuickJumpResults,
  stepAdminQuickJumpIndex,
  type AdminQuickJumpResult,
} from '@/lib/builder/admin-nav/quick-jump';
import { getSandboxTopBarCopy } from './sandbox-top-bar-copy';
import styles from './SandboxPage.module.css';
import chromeStyles from './SandboxChrome.module.css';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';
export type MemberPreviewMode = 'signed-out' | 'free' | 'premium' | 'admin';
export type CollabPresenceEntry = {
  sessionId: string;
  username: string;
  color: string;
  lastSeenAt: string;
  nodeId?: string;
};

const VIEWPORT_OPTIONS: Array<{ mode: ViewportMode; icon: EditorChromeIconName }> = [
  { mode: 'desktop', icon: 'desktop' },
  { mode: 'tablet', icon: 'tablet' },
  { mode: 'mobile', icon: 'mobile' },
];

const MEMBER_PREVIEW_OPTIONS: Array<{ mode: MemberPreviewMode }> = [
  { mode: 'signed-out' },
  { mode: 'free' },
  { mode: 'premium' },
  { mode: 'admin' },
];

function SandboxTopBar({
  locale,
  siteId,
  selectedSummary,
  selectionCount,
  viewport,
  onViewportChange,
  onPublish,
  onOpenSeo,
  onOpenSettings,
  onOpenHistory,
  onOpenPreview,
  onOpenResponsiveAi,
  canOpenResponsiveAi,
  onOpenPages,
  activePageId,
  onLocaleChange,
  siteName,
  currentSlug,
  saveBlockReason,
  draftConflictActive = false,
  draftConflictNavigationReason,
  draftConflictPublishReason,
  memberPreviewMode,
  onMemberPreviewModeChange,
  presenceEntries = [],
}: {
  locale: string;
  siteId: string;
  selectedSummary: string;
  selectionCount: number;
  viewport: ViewportMode;
  onViewportChange: (mode: ViewportMode) => void;
  onPublish: () => void;
  onOpenSeo?: () => void;
  onOpenSettings?: () => void;
  onOpenHistory?: () => void;
  onOpenPreview?: () => void;
  onOpenResponsiveAi?: () => void;
  canOpenResponsiveAi?: boolean;
  onOpenPages?: () => void;
  activePageId?: string | null;
  onLocaleChange?: (locale: Locale, linkedPageId: string | null) => void;
  siteName?: string;
  currentSlug?: string;
  saveBlockReason?: string | null;
  draftConflictActive?: boolean;
  draftConflictNavigationReason?: string;
  draftConflictPublishReason?: string;
  memberPreviewMode: MemberPreviewMode;
  onMemberPreviewModeChange: (mode: MemberPreviewMode) => void;
  presenceEntries?: CollabPresenceEntry[];
}) {
  const router = useRouter();
  const selectedNodeId = useBuilderCanvasStore((state) => state.selectedNodeId);
  const canUndo = useBuilderCanvasStore((state) => state.canUndo);
  const canRedo = useBuilderCanvasStore((state) => state.canRedo);
  const undo = useBuilderCanvasStore((state) => state.undo);
  const redo = useBuilderCanvasStore((state) => state.redo);
  const hasSelectedOverride = useBuilderCanvasStore((state) => {
    const selectedNode = state.selectedNodeId ? state.nodesById.get(state.selectedNodeId) ?? null : null;
    return Boolean(selectedNode && hasResponsiveOverride(selectedNode, viewport));
  });
  const hasPageViewportOverride = useBuilderCanvasStore((state) => (
    viewport !== 'desktop'
      ? Boolean(state.document?.nodes.some((node) => hasResponsiveOverride(node, viewport)))
      : false
  ));
  const resetResponsiveOverride = useBuilderCanvasStore((state) => state.resetResponsiveOverride);
  const resetResponsiveOverridesForViewport = useBuilderCanvasStore((state) => state.resetResponsiveOverridesForViewport);
  const normalizedLocale = normalizeLocale(locale);
  const copy = getSandboxTopBarCopy(normalizedLocale);
  const canOpenSeo = Boolean(onOpenSeo && activePageId);
  const canResetSelectedViewport = viewport !== 'desktop' && Boolean(selectedNodeId) && hasSelectedOverride;
  const canResetPageViewport = viewport !== 'desktop' && hasPageViewportOverride;
  const responsiveAiEnabled = Boolean(onOpenResponsiveAi && canOpenResponsiveAi);
  const navigationBlockedReason = draftConflictActive
    ? draftConflictNavigationReason ?? copy.saveBlockedLabel
    : saveBlockReason ?? null;
  const publishBlockedReason = draftConflictActive
    ? draftConflictPublishReason ?? copy.saveBlockedLabel
    : saveBlockReason;
  const pageLabel = currentSlug?.trim() ? `/${currentSlug.trim()}` : copy.homePageLabel;
  const viewportLabel = copy.viewportLabels[viewport];
  const [recentNav, setRecentNav] = useState<AdminNavHistoryEntry[]>([]);
  const [quickJumpOpen, setQuickJumpOpen] = useState(false);
  const [quickJumpQuery, setQuickJumpQuery] = useState('');
  const [quickJumpActiveIndex, setQuickJumpActiveIndex] = useState(-1);
  const quickJumpSections = useMemo(
    () => buildAdminQuickJumpGroups(normalizedLocale, recentNav, ADMIN_NAV_TREE, quickJumpQuery),
    [normalizedLocale, quickJumpQuery, recentNav],
  );
  const quickJumpResults = useMemo(
    () => buildAdminQuickJumpResults(normalizedLocale, recentNav, ADMIN_NAV_TREE, quickJumpQuery),
    [normalizedLocale, quickJumpQuery, recentNav],
  );

  useEffect(() => {
    setRecentNav(readRecentAdminNav());
  }, []);

  const navigateToAdminHref = useCallback((entry: AdminNavHistoryEntry) => {
    if (navigationBlockedReason) return;
    setRecentNav((current) => {
      const next = pushRecentAdminNav(current, entry);
      writeRecentAdminNav(next);
      return next;
    });
    router.push(entry.href);
    setQuickJumpOpen(false);
  }, [navigationBlockedReason, router]);

  const openQuickJump = useCallback(() => {
    if (navigationBlockedReason) return;
    setQuickJumpQuery('');
    setQuickJumpOpen(true);
  }, [navigationBlockedReason]);

  useEffect(() => {
    if (navigationBlockedReason) setQuickJumpOpen(false);
  }, [navigationBlockedReason]);

  useEffect(() => {
    if (!quickJumpOpen) {
      setQuickJumpActiveIndex(-1);
      return;
    }
    setQuickJumpActiveIndex(quickJumpResults.length > 0 ? 0 : -1);
  }, [quickJumpOpen, quickJumpResults]);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = Boolean(target && (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.isContentEditable
      ));
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k' && !isTyping) {
        event.preventDefault();
        openQuickJump();
        return;
      }
      if (quickJumpOpen && event.key === 'Escape') {
        event.preventDefault();
        setQuickJumpOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [openQuickJump, quickJumpOpen]);

  const navigateByResult = useCallback((result: AdminQuickJumpResult) => {
    navigateToAdminHref({
      label: result.label,
      href: result.href,
      sectionHeading: result.groupHeading,
    });
  }, [navigateToAdminHref]);

  const getQuickJumpResultIndex = useCallback((sectionHeading: string, href: string) => {
    return quickJumpResults.findIndex(
      (result) => result.href === href && result.groupHeading === sectionHeading,
    );
  }, [quickJumpResults]);

  const handleQuickJumpKeyDown = useCallback((event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (quickJumpResults.length === 0) return;
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter'].includes(event.key)) return;
    event.preventDefault();

    if (event.key === 'Enter') {
      const selected = quickJumpResults[Math.max(0, quickJumpActiveIndex)] ?? quickJumpResults[0];
      if (selected) navigateByResult(selected);
      return;
    }

    setQuickJumpActiveIndex((current) => stepAdminQuickJumpIndex(current, event.key, quickJumpResults.length));
  }, [navigateByResult, quickJumpActiveIndex, quickJumpResults]);

  const pageSelectorLabel = `${copy.pageControlLabel} ${pageLabel}`;
  const pageSelectorAriaLabel = normalizedLocale === 'ko'
    ? `현재: ${pageSelectorLabel}`
    : normalizedLocale === 'zh-hant'
      ? `目前：${pageSelectorLabel}`
      : `Current: ${pageSelectorLabel}`;

  return (
    <header
      className={`${styles.topBar} ${chromeStyles.topBar}`}
      data-builder-professional-topbar="true"
    >
      <div className={`${styles.topBarTitle} ${chromeStyles.identityCluster}`} data-builder-topbar-identity="true">
        <button
          type="button"
          className={styles.siteNameButton}
          title={copy.siteSettingsTitle}
          onClick={onOpenSettings}
        >
          <span className={styles.siteMark} aria-hidden="true" />
          <span>{siteName || copy.defaultSiteName}</span>
        </button>
        <button
          type="button"
          className={styles.pageDropdownButton}
          aria-label={pageSelectorAriaLabel}
          data-builder-topbar-page-selector="true"
          title={navigationBlockedReason ?? copy.pageSelectTitle}
          disabled={Boolean(navigationBlockedReason || !onOpenPages)}
          onClick={onOpenPages}
        >
          <span className={styles.pageDropdownKicker}>{copy.pageControlLabel} </span>
          <span className={styles.pageDropdownCurrent}>{pageLabel}</span>
          <EditorChromeIcon name="chevronDown" className={styles.pageDropdownChevron} />
        </button>
      </div>

      <div
        className={chromeStyles.primaryCluster}
        role="group"
        aria-label={copy.primaryActionsAriaLabel}
        data-builder-topbar-primary-cluster="true"
      >
        <button
          type="button"
          className={chromeStyles.primaryIconButton}
          aria-label={copy.undoLabel}
          title={copy.undoTitle}
          disabled={!canUndo}
          data-builder-topbar-primary="undo"
          onClick={undo}
        >
          <EditorChromeIcon name="undo" className={chromeStyles.primaryIcon} />
        </button>
        <button
          type="button"
          className={chromeStyles.primaryIconButton}
          aria-label={copy.redoLabel}
          title={copy.redoTitle}
          disabled={!canRedo}
          data-builder-topbar-primary="redo"
          onClick={redo}
        >
          <EditorChromeIcon name="redo" className={chromeStyles.primaryIcon} />
        </button>
        <button
          type="button"
          className={chromeStyles.previewButton}
          data-builder-topbar-secondary="true"
          data-builder-topbar-primary="preview"
          title={copy.previewTitle}
          disabled={!onOpenPreview}
          onClick={onOpenPreview}
        >
          <EditorChromeIcon name="preview" className={chromeStyles.primaryIcon} />
          <span>{copy.previewLabel}</span>
        </button>
        <button
          type="button"
          className={`${styles.publishButton} ${chromeStyles.publishButton}`}
          title={publishBlockedReason ?? copy.publishTitle}
          data-builder-publish-conflict-blocked={draftConflictActive ? 'true' : 'false'}
          data-builder-topbar-primary="publish"
          disabled={Boolean(publishBlockedReason)}
          onClick={onPublish}
        >
          <EditorChromeIcon name="publish" className={styles.publishButtonIcon} />
          <span>{copy.publishLabel}</span>
        </button>
      </div>

      <details
        className={chromeStyles.secondaryCluster}
        data-builder-topbar-secondary-cluster="true"
      >
        <summary
          className={chromeStyles.secondarySummary}
          title={copy.secondaryActionsTitle}
          aria-label={copy.secondaryActionsTitle}
        >
          <EditorChromeIcon name="moreHorizontal" className={chromeStyles.primaryIcon} />
          <span>{copy.secondaryActionsLabel}</span>
        </summary>
        <div className={chromeStyles.secondaryPanel}>
          <div className={`${styles.topBarMeta} ${chromeStyles.secondaryMeta}`}>
            <div className={styles.topBarMetaCluster} data-builder-topbar-meta-cluster="navigation">
          {onLocaleChange && !navigationBlockedReason ? (
            <LocaleSwitcher
              currentLocale={normalizedLocale}
              siteId={siteId}
              activePageId={activePageId ?? null}
              onLocaleChange={onLocaleChange}
            />
          ) : (
            <span className={styles.topBarChip} title={navigationBlockedReason ?? undefined}>
              {copy.localeFallbackLabel(locale)}
            </span>
          )}
          <label className={styles.quickJumpControl} title={copy.quickJumpSelectTitle}>
            <span>{copy.quickJumpSelectLabel}</span>
            <select
              aria-label={copy.quickJumpSelectTitle}
              disabled={Boolean(navigationBlockedReason)}
              title={navigationBlockedReason ?? copy.quickJumpSelectTitle}
              value=""
              onChange={(event) => {
                const target = event.target.value;
                if (!target) return;
                event.currentTarget.value = '';
                const matched = quickJumpSections
                  .flatMap((section) => section.items.map((item) => ({ ...item, sectionHeading: section.heading })))
                  .find((item) => item.href === target);
                if (matched) {
                  navigateToAdminHref(matched);
                  return;
                }
                const recent = recentNav.find((item) => item.href === target);
                if (recent) {
                  navigateToAdminHref(recent);
                }
              }}
            >
              <option value="">{copy.quickJumpSelectPlaceholder}</option>
              {quickJumpSections.map((section) => (
                <optgroup key={section.heading} label={section.heading}>
                  {section.items.map((item) => (
                    <option key={item.href} value={item.href}>
                      {item.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <button
            type="button"
            className={styles.topBarChip}
            data-builder-admin-quickjump-open="true"
            title={navigationBlockedReason ?? copy.quickJumpButtonTitle}
            disabled={Boolean(navigationBlockedReason)}
            onClick={openQuickJump}
          >
            {copy.quickJumpButtonLabel}
          </button>
            </div>
            <div className={styles.topBarMetaCluster} data-builder-topbar-meta-cluster="preview">
          <div
            className={`${styles.topBarChip} ${styles.topBarPresenceChip}`}
            data-builder-topbar-presence="true"
            role="status"
            aria-live="polite"
            title={copy.presenceTitle(
              presenceEntries.length,
              presenceEntries.slice(0, 3).map((entry) => entry.username),
            )}
          >
            <span className={styles.topBarPresenceLabel}>{copy.collaborationLabel}</span>
            <span className={styles.topBarPresenceAvatars} aria-hidden="true">
              {presenceEntries.slice(0, 3).map((entry) => {
                const initials = entry.username
                  .trim()
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0]?.toUpperCase() ?? '')
                  .join('')
                  .slice(0, 2) || '•';
                return (
                  <span
                    key={entry.sessionId}
                    className={styles.topBarPresenceAvatar}
                    style={{ background: entry.color }}
                  >
                    {initials}
                  </span>
                );
              })}
            </span>
            <span>{copy.presenceActiveLabel(presenceEntries.length)}</span>
          </div>
          <label className={styles.memberPreviewControl} title={copy.memberPreviewTitle}>
            <span>{copy.memberPreviewLabel}</span>
            <select
              aria-label={copy.memberPreviewAriaLabel}
              data-builder-member-preview-mode="true"
              value={memberPreviewMode}
              onChange={(event) => onMemberPreviewModeChange(event.target.value as MemberPreviewMode)}
            >
              {MEMBER_PREVIEW_OPTIONS.map((option) => (
                <option key={option.mode} value={option.mode}>
                  {copy.memberPreviewLabels[option.mode]}
                </option>
              ))}
            </select>
          </label>
          <div className={styles.breakpointSwitcher} aria-label={copy.viewportGroupAriaLabel}>
            {VIEWPORT_OPTIONS.map((option) => {
              const active = viewport === option.mode;
              const label = copy.viewportLabels[option.mode];
              return (
                <button
                  key={option.mode}
                  type="button"
                  className={`${styles.breakpointButton} ${active ? styles.breakpointButtonActive : ''}`}
                  title={copy.viewportTitle(label, VIEWPORT_WIDTHS[option.mode])}
                  aria-pressed={active}
                  data-builder-topbar-viewport={option.mode}
                  onClick={() => onViewportChange(option.mode)}
                >
                  <span className={styles.breakpointIcon}>
                    <EditorChromeIcon name={option.icon} className={styles.topBarSvgIcon} />
                  </span>
                  <span>{label}</span>
                  <small>{VIEWPORT_WIDTHS[option.mode]}px</small>
                </button>
              );
            })}
            <button
              type="button"
              className={styles.breakpointResetButton}
              disabled={!canResetSelectedViewport}
              data-builder-selected-override-reset={viewport}
              title={selectedNodeId && viewport !== 'desktop'
                ? copy.responsiveResetTitle(viewportLabel)
                : copy.responsiveResetDisabledTitle}
              onClick={() => {
                if (!selectedNodeId || viewport === 'desktop') return;
                resetResponsiveOverride(selectedNodeId, viewport);
              }}
            >
              <BreakpointBadge
                viewport={viewport}
                active={hasSelectedOverride}
                label={copy.responsiveOverrideBadgeLabel}
                title={copy.responsiveOverrideBadgeTitle(viewportLabel)}
                ariaLabel={copy.responsiveOverrideBadgeTitle(viewportLabel)}
              />
              <span className={styles.breakpointResetLabel}>{copy.responsiveResetLabel}</span>
            </button>
            <button
              type="button"
              className={`${styles.breakpointResetButton} ${styles.breakpointPageResetButton}`}
              disabled={!canResetPageViewport}
              data-builder-page-reset={viewport}
              title={viewport !== 'desktop'
                ? copy.responsivePageResetTitle(viewportLabel)
                : copy.responsivePageResetDisabledTitle}
              onClick={() => {
                if (viewport === 'desktop') return;
                resetResponsiveOverridesForViewport(viewport);
              }}
            >
              <BreakpointBadge
                viewport={viewport}
                active={hasPageViewportOverride}
                label=""
                title={copy.responsivePageResetTitle(viewportLabel)}
                ariaLabel={copy.responsivePageResetTitle(viewportLabel)}
              />
              <span className={styles.breakpointResetLabel}>{copy.responsivePageResetLabel}</span>
            </button>
            <button
              type="button"
              className={`${styles.breakpointResetButton} ${styles.breakpointAiButton}`}
              disabled={!responsiveAiEnabled}
              data-builder-responsive-ai-open="true"
              title={responsiveAiEnabled ? copy.responsiveAiTitle(viewportLabel) : copy.responsiveAiDisabledTitle}
              onClick={onOpenResponsiveAi}
            >
              <EditorChromeIcon name="sparkles" className={styles.breakpointIcon} />
              <span className={styles.breakpointResetLabel}>{copy.responsiveAiLabel}</span>
            </button>
          </div>
            </div>
          </div>

          <div className={`${styles.topBarActions} ${chromeStyles.secondaryActions}`}>
            <EditorPrefsButton />
            <EditorThemeToggle />
            {selectionCount > 0 ? (
              <span className={styles.selectionPill} title={selectedSummary} data-builder-topbar-selection="true">
                {copy.selectionCountLabel(selectionCount)}
              </span>
            ) : null}
            {onOpenHistory && (
              <button
                type="button"
                className={`${styles.topBarChip} ${styles.topBarActionChip}`}
                data-builder-topbar-secondary="true"
                title={copy.historyTitle}
                onClick={onOpenHistory}
              >
                <EditorChromeIcon name="history" className={styles.topBarActionIcon} />
                <span>{copy.historyLabel}</span>
              </button>
            )}
            <button
              type="button"
              className={`${styles.topBarChip} ${styles.topBarActionChip}`}
              data-builder-topbar-secondary="true"
              title={copy.seoTitle}
              disabled={!canOpenSeo}
              onClick={onOpenSeo}
            >
              <EditorChromeIcon name="seo" className={styles.topBarActionIcon} />
              <span>SEO</span>
            </button>
          </div>
        </div>
      </details>

      {quickJumpOpen ? (
        <ModalShell
          open
          size="md"
          title={copy.quickJumpModalTitle}
          description={copy.quickJumpModalDescription}
          ariaLabel={copy.quickJumpModalAriaLabel}
          closeAriaLabel={copy.quickJumpModalCloseAriaLabel}
          onClose={() => setQuickJumpOpen(false)}
          bodyFlush
        >
          <div
            className={styles.quickJumpPalette}
            onKeyDown={handleQuickJumpKeyDown}
          >
            <input
              autoFocus
              type="search"
              value={quickJumpQuery}
              onChange={(event) => setQuickJumpQuery(event.target.value)}
              placeholder={copy.quickJumpSearchPlaceholder}
              aria-label={copy.quickJumpSearchAriaLabel}
              className={styles.quickJumpSearchInput}
            />
            <div className={styles.quickJumpResults}>
              {quickJumpSections.length === 0 ? (
                <div className={styles.quickJumpEmptyState}>{copy.quickJumpEmptyState}</div>
              ) : quickJumpSections.map((section) => (
                <section key={section.heading} className={styles.quickJumpSection}>
                  <h3>{section.heading}</h3>
                  <div className={styles.quickJumpSectionItems}>
                    {section.items.map((item) => {
                      const resultIndex = getQuickJumpResultIndex(section.heading, item.href);
                      const active = resultIndex === quickJumpActiveIndex;
                      return (
                        <button
                          key={item.href}
                          type="button"
                          onClick={() => navigateToAdminHref({ label: item.label, href: item.href, sectionHeading: section.heading })}
                          className={styles.quickJumpResult}
                          data-active={active ? 'true' : 'false'}
                          aria-current={active ? 'true' : undefined}
                        >
                          <span className={styles.quickJumpResultLabel}>{item.label}</span>
                          <span className={styles.quickJumpResultHref}>{item.href}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </ModalShell>
      ) : null}
    </header>
  );
}

export default memo(SandboxTopBar);
