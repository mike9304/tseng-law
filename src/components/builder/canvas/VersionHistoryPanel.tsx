'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 21000,
  background: 'rgba(15, 23, 42, 0.45)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: 'fadeIn 150ms ease',
};

const panelStyle: React.CSSProperties = {
  width: 720,
  maxWidth: '95vw',
  maxHeight: '85vh',
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 24px 64px rgba(15, 23, 42, 0.18)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  animation: 'fadeIn 180ms ease',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  borderBottom: '1px solid #e2e8f0',
};

const titleStyle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  color: '#0f172a',
};

const closeBtnStyle: React.CSSProperties = {
  padding: '4px 12px',
  fontSize: '0.78rem',
  fontWeight: 600,
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: '#fff',
  color: '#64748b',
  cursor: 'pointer',
};

const bodyStyle: React.CSSProperties = {
  flex: 1,
  display: 'grid',
  gridTemplateColumns: '300px 1fr',
  minHeight: 0,
};

const timelineStyle: React.CSSProperties = {
  position: 'relative',
  borderRight: '1px solid #e2e8f0',
  overflowY: 'auto',
  overflowX: 'hidden',
  padding: '16px 14px 16px 28px',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  background: '#f8fafc',
};

const timelineRailStyle: React.CSSProperties = {
  position: 'absolute',
  top: 22,
  bottom: 22,
  left: 16,
  width: 2,
  borderRadius: 999,
  background: '#dbe2ea',
};

const previewStyle: React.CSSProperties = {
  padding: '16px 20px',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
};

function timelineItemStyle(active: boolean): React.CSSProperties {
  return {
    position: 'relative',
    padding: '12px 12px',
    borderRadius: 10,
    border: active ? '1px solid #116dff' : '1px solid #e2e8f0',
    background: active ? '#eff6ff' : '#fff',
    cursor: 'pointer',
    transition: 'background 120ms ease, border-color 120ms ease',
    boxShadow: active ? '0 8px 22px rgba(17, 109, 255, 0.12)' : '0 1px 2px rgba(15, 23, 42, 0.04)',
  };
}

function timelineDotStyle(active: boolean): React.CSSProperties {
  return {
    position: 'absolute',
    top: 17,
    left: -19,
    width: 10,
    height: 10,
    borderRadius: 999,
    border: active ? '2px solid #116dff' : '2px solid #94a3b8',
    background: active ? '#fff' : '#f8fafc',
    boxShadow: '0 0 0 3px #f8fafc',
  };
}

const dateStyle: React.CSSProperties = {
  fontSize: '0.82rem',
  fontWeight: 600,
  color: '#0f172a',
};

const metaStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  color: '#64748b',
  marginTop: 2,
};

const summaryStyle: React.CSSProperties = {
  marginTop: 7,
  color: '#334155',
  fontSize: '0.75rem',
  fontWeight: 650,
};

const revisionCardFooterStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  marginTop: 10,
};

const inlineRestoreButtonStyle: React.CSSProperties = {
  padding: '4px 10px',
  border: '1px solid #c7d2fe',
  borderRadius: 7,
  background: '#fff',
  color: '#1d4ed8',
  fontSize: '0.72rem',
  fontWeight: 750,
  cursor: 'pointer',
};

const diffPreviewChipStyle: React.CSSProperties = {
  position: 'absolute',
  right: 10,
  top: 10,
  padding: '4px 8px',
  borderRadius: 999,
  background: '#0f172a',
  color: '#fff',
  fontSize: '0.68rem',
  fontWeight: 750,
  boxShadow: '0 10px 22px rgba(15, 23, 42, 0.2)',
  pointerEvents: 'none',
};

const sourceBadgeStyle = (source?: string): React.CSSProperties => {
  let bg = '#e2e8f0';
  let fg = '#475569';
  if (source === 'publish') {
    bg = '#dcfce7';
    fg = '#166534';
  } else if (source === 'rollback-backup') {
    bg = '#fef3c7';
    fg = '#92400e';
  } else if (source === 'manual') {
    bg = '#dbeafe';
    fg = '#1e40af';
  }
  return {
    display: 'inline-block',
    padding: '1px 6px',
    fontSize: '0.66rem',
    fontWeight: 700,
    borderRadius: 4,
    background: bg,
    color: fg,
    marginLeft: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  };
};

const restoreBtnStyle: React.CSSProperties = {
  padding: '6px 14px',
  fontSize: '0.8rem',
  fontWeight: 600,
  border: 'none',
  borderRadius: 8,
  background: '#116dff',
  color: '#fff',
  cursor: 'pointer',
};

const restoreBtnDisabledStyle: React.CSSProperties = {
  ...restoreBtnStyle,
  background: '#94a3b8',
  cursor: 'not-allowed',
};

const diffStatStyle: React.CSSProperties = {
  display: 'flex',
  gap: 14,
  padding: '10px 12px',
  borderRadius: 10,
  background: '#f1f5f9',
  border: '1px solid #e2e8f0',
  fontSize: '0.82rem',
  fontWeight: 600,
};

const confirmOverlayStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(255,255,255,0.95)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  borderRadius: 16,
  zIndex: 1,
};

const confirmTextStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  fontWeight: 600,
  color: '#0f172a',
  textAlign: 'center',
};

const confirmBtnRow: React.CSSProperties = {
  display: 'flex',
  gap: 8,
};

const cancelBtnStyle: React.CSSProperties = {
  padding: '6px 16px',
  fontSize: '0.8rem',
  fontWeight: 600,
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: '#fff',
  color: '#334155',
  cursor: 'pointer',
};

const confirmRestoreBtnStyle: React.CSSProperties = {
  padding: '6px 16px',
  fontSize: '0.8rem',
  fontWeight: 600,
  border: 'none',
  borderRadius: 8,
  background: '#116dff',
  color: '#fff',
  cursor: 'pointer',
};

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

  useEffect(() => {
    if (!open) return undefined;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

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
        onClose();
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
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div style={{ ...panelStyle, position: 'relative' }}>
        {confirmId && (
          <div style={confirmOverlayStyle}>
            <p style={confirmTextStyle}>
              이 리비전으로 복원하시겠습니까?<br />
              현재 draft 는 자동으로 백업된 후 덮어씌워집니다.
            </p>
            <div style={confirmBtnRow}>
              <button
                type="button"
                style={cancelBtnStyle}
                onClick={() => setConfirmId(null)}
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
          <button type="button" style={closeBtnStyle} onClick={onClose}>
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
                        setConfirmId(rev.revisionId);
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
                    onClick={() => selectedId && setConfirmId(selectedId)}
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

const sectionHeading: React.CSSProperties = {
  fontSize: '0.78rem',
  fontWeight: 700,
  margin: '6px 0',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
};

const diffListStyle: React.CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

function diffItemStyle(kind: 'add' | 'remove' | 'modify'): React.CSSProperties {
  const base: React.CSSProperties = {
    padding: '6px 10px',
    borderRadius: 6,
    fontSize: '0.78rem',
    border: '1px solid',
  };
  if (kind === 'add') return { ...base, background: '#f0fdf4', borderColor: '#86efac', color: '#166534' };
  if (kind === 'remove') return { ...base, background: '#fef2f2', borderColor: '#fca5a5', color: '#991b1b' };
  return { ...base, background: '#fefce8', borderColor: '#fde68a', color: '#854d0e' };
}

const codeStyle: React.CSSProperties = {
  background: 'rgba(0,0,0,0.06)',
  padding: '1px 4px',
  borderRadius: 4,
  fontSize: '0.74rem',
  fontFamily: 'ui-monospace, SFMono-Regular, monospace',
};
