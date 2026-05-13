'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import {
  computeDocumentDiff,
  formatDocumentDiffSummary,
  summarizeDiffNode,
  summarizeDocumentDiff,
  type DocumentDiff,
  type DocumentDiffSummary,
} from '@/lib/builder/canvas/document-diff';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import {
  backdropStyle,
  bodyStyle,
  cancelBtnStyle,
  closeBtnStyle,
  codeStyle,
  confirmBtnRow,
  confirmOverlayStyle,
  confirmRestoreBtnStyle,
  confirmTextStyle,
  dateStyle,
  diffItemStyle,
  diffListStyle,
  diffPreviewChipStyle,
  diffStatStyle,
  headerStyle,
  inlineRestoreButtonStyle,
  metaStyle,
  panelStyle,
  previewStyle,
  restoreBtnDisabledStyle,
  restoreBtnStyle,
  revisionCardFooterStyle,
  sectionHeading,
  sourceBadgeStyle,
  summaryStyle,
  timelineDotStyle,
  timelineItemStyle,
  timelineRailStyle,
  timelineStyle,
  titleStyle,
} from './VersionHistoryPanel.styles';

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

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('ko-KR', {
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

function formatSourceLabel(source?: string): string {
  if (source === 'publish') return 'published snapshot';
  if (source === 'rollback-backup') return 'rollback backup';
  if (source === 'manual') return 'manual save';
  return 'saved revision';
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
  pageId,
  siteId,
  draftMeta,
  onClose,
  onRestored,
}: {
  open: boolean;
  pageId: string;
  siteId: string;
  draftMeta?: DraftMeta | null;
  onClose: () => void;
  onRestored?: (draftMeta: DraftMeta, document?: BuilderCanvasDocument) => void;
}) {
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
        `/api/builder/site/pages/${encodeURIComponent(pageId)}/revisions`,
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
  }, [pageId]);

  const fetchCurrentDraftMeta = useCallback(async () => {
    if (!pageId) return;
    try {
      const res = await fetch(
        `/api/builder/site/pages/${encodeURIComponent(pageId)}/draft`,
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
  }, [pageId]);

  const loadRevisionDoc = useCallback(
    async (revisionId: string) => {
      setSelectedId(revisionId);
      setLoadingDoc(true);
      setSelectedDoc(null);
      try {
        const res = await fetch(
          `/api/builder/site/pages/${encodeURIComponent(pageId)}/revisions?revisionId=${encodeURIComponent(revisionId)}`,
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
    [pageId],
  );

  const loadHoverSummary = useCallback(
    async (revisionId: string) => {
      if (!currentDocument || hoverSummaries[revisionId]) return;
      try {
        const res = await fetch(
          `/api/builder/site/pages/${encodeURIComponent(pageId)}/revisions?revisionId=${encodeURIComponent(revisionId)}`,
          { credentials: 'same-origin' },
        );
        if (!res.ok) return;
        const data = (await res.json()) as { document?: BuilderCanvasDocument };
        if (!data.document) return;
        const summary = summarizeDocumentDiff(computeDocumentDiff(currentDocument, data.document));
        setHoverSummaries((current) => ({ ...current, [revisionId]: summary }));
      } catch {
        // silent
      }
    },
    [currentDocument, hoverSummaries, pageId],
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
    return computeDocumentDiff(currentDocument, selectedDoc);
  }, [currentDocument, selectedDoc]);

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
      style={backdropStyle}
      onClick={(e) => {
        if (e.target === e.currentTarget) closePanel();
      }}
    >
      <div
        ref={panelRef}
        style={{ ...panelStyle, position: 'relative' }}
        role="dialog"
        aria-modal="true"
        aria-label="버전 히스토리"
        tabIndex={-1}
        data-builder-version-history-dialog="true"
        onKeyDownCapture={handlePanelKeyDown}
      >
        {confirmId && (
          <div
            ref={confirmRef}
            style={confirmOverlayStyle}
            role="alertdialog"
            aria-modal="true"
            aria-label="리비전 복원 확인"
            tabIndex={-1}
            data-builder-version-restore-dialog="true"
          >
            <p style={confirmTextStyle}>
              이 리비전으로 복원하시겠습니까?<br />
              현재 draft 는 자동으로 백업된 후 덮어씌워집니다.
            </p>
            <div style={confirmBtnRow}>
              <button
                type="button"
                style={cancelBtnStyle}
                onClick={closeRestoreConfirm}
                disabled={restoring}
              >
                취소
              </button>
              <button
                type="button"
                style={confirmRestoreBtnStyle}
                onClick={() => handleRestore(confirmId)}
                disabled={restoring}
              >
                {restoring ? '복원 중...' : '복원'}
              </button>
            </div>
          </div>
        )}

        <div style={headerStyle}>
          <span style={titleStyle}>버전 히스토리</span>
          <button type="button" style={closeBtnStyle} onClick={closePanel}>
            닫기
          </button>
        </div>

        <div style={bodyStyle}>
          {/* ── Timeline ── */}
          <div style={timelineStyle}>
            <span style={timelineRailStyle} aria-hidden="true" />
            <div
              style={{
                ...timelineItemStyle(false),
                background: '#fff',
                borderColor: '#116dff',
              }}
            >
              <span style={timelineDotStyle(true)} aria-hidden="true" />
              <div style={dateStyle}>현재 Draft</div>
              <div style={metaStyle}>
                revision {currentDraftMeta?.revision ?? 0}
                {currentDraftMeta?.savedAt ? ` — ${formatDate(currentDraftMeta.savedAt)}` : ''}
                {' — '}
                노드 {currentDocument?.nodes.length ?? 0}개 — 편집 중
              </div>
              <div style={summaryStyle}>Live draft · 마지막 저장본 기준</div>
            </div>

            {loading ? (
              <div style={{ padding: 12, fontSize: '0.82rem', color: '#94a3b8', textAlign: 'center' }}>
                리비전 로딩 중...
              </div>
            ) : revisions.length === 0 ? (
              <div style={{ padding: 12, fontSize: '0.82rem', color: '#94a3b8', textAlign: 'center' }}>
                저장된 리비전이 없습니다.<br />
                발행 또는 수동 스냅샷 시 자동 생성됩니다.
              </div>
            ) : (
              revisions.map((rev) => (
                <div
                  key={rev.revisionId}
                  style={timelineItemStyle(rev.revisionId === selectedId)}
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
                  <span style={timelineDotStyle(rev.revisionId === selectedId)} aria-hidden="true" />
                  {hoveringId === rev.revisionId ? (
                    <span style={diffPreviewChipStyle}>{formatDocumentDiffSummary(hoverSummaries[rev.revisionId])}</span>
                  ) : null}
                  <div style={dateStyle}>
                    {formatDate(rev.savedAt)}
                    {rev.source ? <span style={sourceBadgeStyle(rev.source)}>{rev.source}</span> : null}
                  </div>
                  <div style={metaStyle}>노드 {rev.nodeCount}개</div>
                  <div style={summaryStyle}>
                    변경 요약 · {formatSourceLabel(rev.source)}
                  </div>
                  <div style={revisionCardFooterStyle}>
                    <span style={metaStyle}>hover 시 diff preview</span>
                    <button
                      type="button"
                      style={inlineRestoreButtonStyle}
                      disabled={restoring}
                      onClick={(event) => {
                        event.stopPropagation();
                        openRestoreConfirm(rev.revisionId);
                      }}
                    >
                      복원
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ── Diff preview ── */}
          <div style={previewStyle}>
            {!selectedId ? (
              <div style={{ color: '#94a3b8', fontSize: '0.88rem', padding: 24, textAlign: 'center' }}>
                좌측에서 리비전을 선택하면 현재 draft 와의 차이를 표시합니다.
              </div>
            ) : loadingDoc ? (
              <div style={{ color: '#94a3b8', fontSize: '0.88rem', padding: 24, textAlign: 'center' }}>
                리비전 문서 로딩 중...
              </div>
            ) : !selectedDoc ? (
              <div style={{ color: '#dc2626', fontSize: '0.88rem', padding: 24, textAlign: 'center' }}>
                리비전 문서를 불러오지 못했습니다.
              </div>
            ) : (
              <>
                <div style={diffStatStyle}>
                  <span style={{ color: '#16a34a' }}>+ 추가됨 {diff?.added.length ?? 0}</span>
                  <span style={{ color: '#dc2626' }}>− 삭제됨 {diff?.removed.length ?? 0}</span>
                  <span style={{ color: '#ca8a04' }}>~ 변경됨 {diff?.modified.length ?? 0}</span>
                  <span style={{ color: '#64748b', marginLeft: 'auto' }}>
                    노드 {selectedDoc.nodes.length}개
                  </span>
                </div>

                {diff && diff.added.length > 0 ? (
                  <div>
                    <div style={{ ...sectionHeading, color: '#16a34a' }}>추가된 노드 (현재에만 존재)</div>
                    <ul style={diffListStyle}>
                      {diff.added.map((n) => (
                        <li key={n.id} style={diffItemStyle('add')}>
                          <code style={codeStyle}>{n.id}</code> — {summarizeDiffNode(n)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {diff && diff.removed.length > 0 ? (
                  <div>
                    <div style={{ ...sectionHeading, color: '#dc2626' }}>제거된 노드 (이 리비전에만 존재)</div>
                    <ul style={diffListStyle}>
                      {diff.removed.map((n) => (
                        <li key={n.id} style={diffItemStyle('remove')}>
                          <code style={codeStyle}>{n.id}</code> — {summarizeDiffNode(n)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {diff && diff.modified.length > 0 ? (
                  <div>
                    <div style={{ ...sectionHeading, color: '#ca8a04' }}>변경된 노드</div>
                    <ul style={diffListStyle}>
                      {diff.modified.map((n) => (
                        <li key={n.id} style={diffItemStyle('modify')}>
                          <code style={codeStyle}>{n.id}</code> — {n.kind} · {n.changes.join(' · ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {diff && diff.added.length === 0 && diff.removed.length === 0 && diff.modified.length === 0 ? (
                  <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    현재 draft 와 동일합니다.
                  </div>
                ) : null}

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    style={selectedId ? restoreBtnStyle : restoreBtnDisabledStyle}
                    onClick={() => selectedId && openRestoreConfirm(selectedId)}
                    disabled={!selectedId}
                  >
                    이 버전으로 복원
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
