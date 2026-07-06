'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import {
  computeDocumentDiff,
  formatDiffNodeKind,
  formatDocumentDiffSummary,
  summarizeDiffNode,
  summarizeDocumentDiff,
  type DocumentDiff,
  type DocumentDiffSummary,
} from '@/lib/builder/canvas/document-diff';
import { getDocumentDiffCopy } from '@/lib/builder/canvas/document-diff-copy';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import EditorChromeIcon from './EditorChromeIcon';
import styles from './VersionHistoryPanel.module.css';
import {
  getVersionHistoryCopy,
  type VersionHistoryCopy,
  type VersionHistorySource,
} from './version-history-copy';

interface Revision {
  revisionId: string;
  pageId: string;
  savedAt: string;
  nodeCount: number;
  source?: string;
}

interface DraftMeta {
  revision: number;
  savedAt: string;
  updatedBy?: string;
}

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

function formatDate(iso: string, locale: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function formatSourceLabel(copy: VersionHistoryCopy, source?: string): string {
  return copy.sourceLabels[getRevisionSourceKey(source)];
}

function formatSourceBadgeLabel(copy: VersionHistoryCopy, source: string): string {
  const sourceKey = getRevisionSourceKey(source);
  if (sourceKey === 'saved') return copy.sourceLabels.saved;
  return copy.sourceBadgeLabels[sourceKey];
}

function getRevisionSourceKey(source?: string): VersionHistorySource {
  if (source === 'publish' || source === 'rollback-backup' || source === 'manual') return source;
  return 'saved';
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => (
    !element.hidden &&
    !element.closest('[hidden]') &&
    element.getAttribute('aria-hidden') !== 'true' &&
    element.getClientRects().length > 0
  ));
}

export default function VersionHistoryPanel({
  open,
  locale,
  pageId,
  siteId,
  draftMeta,
  onClose,
  onRestored,
}: {
  open: boolean;
  locale?: Locale | string;
  pageId: string;
  siteId: string;
  draftMeta?: DraftMeta | null;
  onClose: () => void;
  onRestored?: (draftMeta: DraftMeta, document?: BuilderCanvasDocument) => void;
}) {
  const copy = getVersionHistoryCopy(locale);
  const diffCopy = getDocumentDiffCopy(locale);
  const siteQuery = useMemo(() => new URLSearchParams({ siteId }).toString(), [siteId]);
  const replaceDocument = useBuilderCanvasStore((s) => s.replaceDocument);
  const currentDocument = useBuilderCanvasStore((s) => s.document);

  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<BuilderCanvasDocument | null>(null);
  const [loadingDoc, setLoadingDoc] = useState(false);
  const [currentDraftMeta, setCurrentDraftMeta] = useState<DraftMeta | null>(draftMeta ?? null);
  const [hoveringId, setHoveringId] = useState<string | null>(null);
  const [hoverSummaries, setHoverSummaries] = useState<Record<string, DocumentDiffSummary>>({});
  const panelRef = useRef<HTMLDivElement | null>(null);
  const confirmRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const confirmReturnFocusRef = useRef<HTMLElement | null>(null);
  const closingRef = useRef(false);

  const activeTrapContainer = useCallback(() => (
    confirmRef.current ?? panelRef.current
  ), []);

  const closePanel = useCallback(() => {
    closingRef.current = true;
    onClose();
  }, [onClose]);

  const openRestoreConfirm = (revisionId: string) => {
    confirmReturnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setConfirmId(revisionId);
  };

  const closeRestoreConfirm = useCallback(() => {
    const returnTarget = confirmReturnFocusRef.current;
    setConfirmId(null);
    window.setTimeout(() => {
      if (returnTarget?.isConnected) returnTarget.focus({ preventScroll: true });
      confirmReturnFocusRef.current = null;
    }, 0);
  }, []);

  const fetchRevisions = useCallback(async () => {
    if (!pageId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/builder/site/pages/${encodeURIComponent(pageId)}/revisions?${siteQuery}`,
        { credentials: 'same-origin' },
      );
      if (res.ok) {
        const data = (await res.json()) as { revisions: Revision[] };
        setRevisions(data.revisions || []);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [pageId, siteQuery]);

  const fetchCurrentDraftMeta = useCallback(async () => {
    if (!pageId) return;
    try {
      const res = await fetch(
        `/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?${siteQuery}`,
        { credentials: 'same-origin' },
      );
      if (res.ok) {
        const data = (await res.json()) as {
          draft?: DraftMeta;
          document?: BuilderCanvasDocument;
        };
        if (data.draft) {
          setCurrentDraftMeta(data.draft);
        } else if (data.document) {
          setCurrentDraftMeta({ revision: 0, savedAt: data.document.updatedAt });
        }
      }
    } catch {
      // silent
    }
  }, [pageId, siteQuery]);

  const loadRevisionDoc = useCallback(
    async (revisionId: string) => {
      setSelectedId(revisionId);
      setLoadingDoc(true);
      setSelectedDoc(null);
      try {
        const res = await fetch(
          `/api/builder/site/pages/${encodeURIComponent(pageId)}/revisions?${new URLSearchParams({ siteId, revisionId }).toString()}`,
          { credentials: 'same-origin' },
        );
        if (res.ok) {
          const data = (await res.json()) as { document?: BuilderCanvasDocument };
          if (data.document) setSelectedDoc(data.document);
        }
      } catch {
        // silent
      } finally {
        setLoadingDoc(false);
      }
    },
    [pageId, siteId],
  );

  const loadHoverSummary = useCallback(
    async (revisionId: string) => {
      if (!currentDocument || hoverSummaries[revisionId]) return;
      try {
        const res = await fetch(
          `/api/builder/site/pages/${encodeURIComponent(pageId)}/revisions?${new URLSearchParams({ siteId, revisionId }).toString()}`,
          { credentials: 'same-origin' },
        );
        if (!res.ok) return;
        const data = (await res.json()) as { document?: BuilderCanvasDocument };
        if (!data.document) return;
        const summary = summarizeDocumentDiff(computeDocumentDiff(currentDocument, data.document, diffCopy));
        setHoverSummaries((current) => ({ ...current, [revisionId]: summary }));
      } catch {
        // silent
      }
    },
    [currentDocument, diffCopy, hoverSummaries, pageId, siteId],
  );

  useEffect(() => {
    if (open) {
      void fetchRevisions();
      void fetchCurrentDraftMeta();
      setSelectedId(null);
      setSelectedDoc(null);
      setHoveringId(null);
      setHoverSummaries({});
    }
  }, [open, fetchCurrentDraftMeta, fetchRevisions]);

  useEffect(() => {
    if (draftMeta) setCurrentDraftMeta(draftMeta);
  }, [draftMeta]);

  useLayoutEffect(() => {
    if (!open) {
      if (closingRef.current) {
        const restoreTarget = restoreFocusRef.current;
        window.setTimeout(() => {
          if (restoreTarget?.isConnected) restoreTarget.focus({ preventScroll: true });
          restoreFocusRef.current = null;
          closingRef.current = false;
          confirmReturnFocusRef.current = null;
        }, 0);
      } else {
        restoreFocusRef.current = null;
        confirmReturnFocusRef.current = null;
      }
      return undefined;
    }

    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closingRef.current = false;
    const panel = panelRef.current;
    if (!panel) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const focusFrame = window.requestAnimationFrame(() => {
      const trapContainer = activeTrapContainer();
      if (!trapContainer) return;
      const focusable = getFocusableElements(trapContainer);
      (focusable[0] ?? trapContainer).focus({ preventScroll: true });
    });
    const handleFocusIn = (event: FocusEvent) => {
      const trapContainer = activeTrapContainer();
      if (!trapContainer) return;
      if (trapContainer.contains(event.target as Node | null)) return;
      const focusable = getFocusableElements(trapContainer);
      (focusable[0] ?? trapContainer).focus({ preventScroll: true });
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener('focusin', handleFocusIn);
    };
  }, [activeTrapContainer, open]);

  useLayoutEffect(() => {
    if (!open || !confirmId) return;
    const confirmPanel = confirmRef.current;
    if (!confirmPanel) return;
    const focusable = getFocusableElements(confirmPanel);
    (focusable[0] ?? confirmPanel).focus({ preventScroll: true });
  }, [confirmId, open]);

  const handlePanelKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      if (confirmId) {
        closeRestoreConfirm();
      } else {
        closePanel();
      }
      return;
    }
    if (event.key !== 'Tab') return;

    const trapContainer = activeTrapContainer();
    if (!trapContainer) return;
    const focusable = getFocusableElements(trapContainer);
    if (focusable.length === 0) {
      event.preventDefault();
      trapContainer.focus({ preventScroll: true });
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus({ preventScroll: true });
      return;
    }
    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  };

  const diff = useMemo<DocumentDiff | null>(() => {
    if (!currentDocument || !selectedDoc) return null;
    return computeDocumentDiff(currentDocument, selectedDoc, diffCopy);
  }, [currentDocument, diffCopy, selectedDoc]);

  const handleRestore = async (revisionId: string) => {
    setRestoring(true);
    try {
      const res = await fetch(
        `/api/builder/site/pages/${encodeURIComponent(pageId)}/revisions/rollback`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ siteId, revisionId }),
        },
      );
      if (res.ok) {
        const data = (await res.json()) as { document?: BuilderCanvasDocument; draft?: DraftMeta | null };
        if (data.document) {
          replaceDocument(data.document);
        }
        if (data.draft) {
          setCurrentDraftMeta(data.draft);
          onRestored?.(data.draft, data.document);
        }
        closePanel();
      }
    } catch {
      // silent
    } finally {
      setRestoring(false);
      setConfirmId(null);
    }
  };

  if (!open) return null;

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) closePanel();
      }}
    >
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={copy.dialogAriaLabel}
        tabIndex={-1}
        data-builder-version-history-dialog="true"
        onKeyDownCapture={handlePanelKeyDown}
      >
        {confirmId && (
          <div
            ref={confirmRef}
            className={styles.confirmOverlay}
            role="alertdialog"
            aria-modal="true"
            aria-label={copy.confirmAriaLabel}
            tabIndex={-1}
            data-builder-version-restore-dialog="true"
          >
            <div className={styles.confirmPanel}>
              <p className={styles.confirmText}>
                {copy.confirmQuestion}<br />
                {copy.confirmWarning}
              </p>
              <div className={styles.confirmActions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={closeRestoreConfirm}
                  disabled={restoring}
                >
                  {copy.cancel}
                </button>
                <button
                  type="button"
                  className={styles.dangerButton}
                  onClick={() => handleRestore(confirmId)}
                  disabled={restoring}
                >
                  {restoring ? copy.restoring : copy.restore}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className={styles.header}>
          <div className={styles.titleBlock}>
            <span className={styles.titleLabel}>{copy.currentDraft}</span>
            <span className={styles.title}>{copy.title}</span>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            title={copy.close}
            aria-label={copy.close}
            onClick={closePanel}
          >
            <EditorChromeIcon name="close" />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.timeline}>
            <span className={styles.timelineRail} aria-hidden="true" />
            <div className={styles.timelineItem} data-current="true">
              <span className={styles.timelineDot} aria-hidden="true" />
              <div className={styles.dateLine}>{copy.currentDraft}</div>
              <div className={styles.metaLine}>
                {copy.revisionLabel(currentDraftMeta?.revision ?? 0)}
                {currentDraftMeta?.savedAt ? ` - ${formatDate(currentDraftMeta.savedAt, copy.dateLocale)}` : ''}
                {' - '}
                {copy.draftMetaLabel(currentDocument?.nodes.length ?? 0)}
              </div>
              <div className={styles.summaryLine}>{copy.liveDraftSummary}</div>
            </div>

            {loading ? (
              <div className={styles.stateMessage}>
                {copy.loadingRevisions}
              </div>
            ) : revisions.length === 0 ? (
              <div className={styles.stateMessage}>
                {copy.noRevisionsTitle}<br />
                {copy.noRevisionsHint}
              </div>
            ) : (
              revisions.map((rev) => {
                const sourceKey = getRevisionSourceKey(rev.source);
                return (
                  <div
                    key={rev.revisionId}
                    className={styles.timelineItem}
                    data-active={rev.revisionId === selectedId ? 'true' : 'false'}
                    data-builder-version-revision-source={sourceKey}
                    onClick={() => loadRevisionDoc(rev.revisionId)}
                    onMouseEnter={() => {
                      setHoveringId(rev.revisionId);
                      void loadHoverSummary(rev.revisionId);
                    }}
                    onMouseLeave={() => setHoveringId((current) => (current === rev.revisionId ? null : current))}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') void loadRevisionDoc(rev.revisionId);
                    }}
                  >
                    <span className={styles.timelineDot} aria-hidden="true" />
                    {hoveringId === rev.revisionId ? (
                      <span className={styles.diffPreviewChip}>{formatDocumentDiffSummary(hoverSummaries[rev.revisionId], diffCopy)}</span>
                    ) : null}
                    <div className={styles.dateLine}>
                      {formatDate(rev.savedAt, copy.dateLocale)}
                      {rev.source ? (
                        <span className={styles.sourceBadge} data-source={sourceKey}>{formatSourceBadgeLabel(copy, rev.source)}</span>
                      ) : null}
                    </div>
                    <div className={styles.metaLine}>{copy.nodeCountLabel(rev.nodeCount)}</div>
                    <div className={styles.summaryLine}>{copy.changeSummaryLabel(formatSourceLabel(copy, rev.source))}</div>
                    <div className={styles.revisionFooter}>
                      <span className={styles.metaLine}>{copy.hoverDiffPreview}</span>
                      <button
                        type="button"
                        className={styles.inlineRestoreButton}
                        disabled={restoring}
                        onClick={(event) => {
                          event.stopPropagation();
                          openRestoreConfirm(rev.revisionId);
                        }}
                      >
                        {copy.restore}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className={styles.preview}>
            {!selectedId ? (
              <div className={styles.previewState}>
                {copy.selectRevisionPrompt}
              </div>
            ) : loadingDoc ? (
              <div className={styles.previewState}>
                {copy.loadingRevisionDocument}
              </div>
            ) : !selectedDoc ? (
              <div className={styles.previewState} data-tone="error">
                {copy.revisionDocumentLoadFailed}
              </div>
            ) : (
              <>
                <div className={styles.diffStats}>
                  <span className={styles.diffStat} data-kind="add">{copy.addedCount(diff?.added.length ?? 0)}</span>
                  <span className={styles.diffStat} data-kind="remove">{copy.removedCount(diff?.removed.length ?? 0)}</span>
                  <span className={styles.diffStat} data-kind="modify">{copy.modifiedCount(diff?.modified.length ?? 0)}</span>
                  <span className={styles.diffStat} data-kind="total">
                    {copy.nodeCountLabel(selectedDoc.nodes.length)}
                  </span>
                </div>

                {diff && diff.added.length > 0 ? (
                  <div className={styles.diffSection}>
                    <div className={styles.sectionHeading} data-kind="add">{copy.addedSection}</div>
                    <ul className={styles.diffList}>
                      {diff.added.map((n) => (
                        <li key={n.id} className={styles.diffItem} data-kind="add">
                          <code className={styles.code}>{n.id}</code> - {summarizeDiffNode(n, diffCopy)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {diff && diff.removed.length > 0 ? (
                  <div className={styles.diffSection}>
                    <div className={styles.sectionHeading} data-kind="remove">{copy.removedSection}</div>
                    <ul className={styles.diffList}>
                      {diff.removed.map((n) => (
                        <li key={n.id} className={styles.diffItem} data-kind="remove">
                          <code className={styles.code}>{n.id}</code> - {summarizeDiffNode(n, diffCopy)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {diff && diff.modified.length > 0 ? (
                  <div className={styles.diffSection}>
                    <div className={styles.sectionHeading} data-kind="modify">{copy.modifiedSection}</div>
                    <ul className={styles.diffList}>
                      {diff.modified.map((n) => (
                        <li key={n.id} className={styles.diffItem} data-kind="modify">
                          <code className={styles.code}>{n.id}</code>
                          {' - '}
                          {formatDiffNodeKind(n.kind, diffCopy)} - {n.changes.join(' / ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {diff && diff.added.length === 0 && diff.removed.length === 0 && diff.modified.length === 0 ? (
                  <div className={styles.previewState}>
                    {copy.sameAsDraft}
                  </div>
                ) : null}

                <div className={styles.restoreActionRow}>
                  <button
                    type="button"
                    className={styles.restoreButton}
                    onClick={() => selectedId && openRestoreConfirm(selectedId)}
                    disabled={!selectedId}
                  >
                    {copy.restoreThisVersion}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
