'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { buildSitePagePath } from '@/lib/builder/site/paths';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type {
  CheckResult,
  PublishCheckSuite,
} from '@/lib/builder/publish-gate/gate-runner';

type PublishState = 'checking' | 'ready' | 'publishing' | 'success' | 'error';

interface DraftMeta {
  revision: number;
  savedAt: string;
  updatedBy?: string;
}

type ToastTone = 'success' | 'error';

interface PublishErrorBody {
  error?: string;
  errors?: string[];
  blockers?: CheckResult[];
  current?: { revision?: number };
}

function blockerSuite(blockers: CheckResult[]): PublishCheckSuite {
  return {
    results: blockers,
    hasBlocker: blockers.some((result) => result.severity === 'blocker'),
    blockerCount: blockers.filter((result) => result.severity === 'blocker').length,
    warningCount: blockers.filter((result) => result.severity === 'warning').length,
    infoCount: blockers.filter((result) => result.severity === 'info').length,
    checkedAt: new Date().toISOString(),
  };
}

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(15, 23, 42, 0.4)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  animation: 'publishBackdropIn 200ms ease',
};

const modalStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
  width: '100%',
  maxWidth: 560,
  maxHeight: '85vh',
  overflow: 'auto',
  padding: '28px 28px 24px',
  animation: 'publishModalIn 250ms cubic-bezier(0.16, 1, 0.3, 1)',
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: '1.15rem',
  fontWeight: 700,
  color: '#0f172a',
};

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '0.78rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748b',
  margin: '16px 0 6px',
};

const listStyle: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};

function severityBoxStyle(sev: 'blocker' | 'warning' | 'info'): React.CSSProperties {
  if (sev === 'blocker') {
    return {
      padding: '8px 12px',
      borderRadius: 8,
      background: '#fef2f2',
      color: '#991b1b',
      fontSize: '0.82rem',
      border: '1px solid #fca5a5',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 10,
    };
  }
  if (sev === 'warning') {
    return {
      padding: '8px 12px',
      borderRadius: 8,
      background: '#fffbeb',
      color: '#92400e',
      fontSize: '0.82rem',
      border: '1px solid #fde68a',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 10,
    };
  }
  return {
    padding: '8px 12px',
    borderRadius: 8,
    background: '#eff6ff',
    color: '#1e40af',
    fontSize: '0.82rem',
    border: '1px solid #bfdbfe',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  };
}

const fixButtonStyle: React.CSSProperties = {
  flexShrink: 0,
  padding: '4px 10px',
  fontSize: '0.72rem',
  fontWeight: 600,
  border: '1px solid currentColor',
  background: 'rgba(255,255,255,0.7)',
  color: 'inherit',
  borderRadius: 6,
  cursor: 'pointer',
};

const successBoxStyle: React.CSSProperties = {
  padding: '14px 16px',
  borderRadius: 10,
  background: '#f0fdf4',
  border: '1px solid #86efac',
  color: '#166534',
  fontSize: '0.88rem',
  fontWeight: 500,
  textAlign: 'center',
};

const buttonRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  justifyContent: 'flex-end',
  marginTop: 20,
  flexWrap: 'wrap',
};

const cancelButtonStyle: React.CSSProperties = {
  padding: '8px 18px',
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  background: '#fff',
  color: '#334155',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const publishWarnButtonStyle: React.CSSProperties = {
  padding: '8px 16px',
  borderRadius: 8,
  border: '1px solid #f59e0b',
  background: '#fff',
  color: '#92400e',
  fontSize: '0.82rem',
  fontWeight: 600,
  cursor: 'pointer',
};

function publishButtonStyle(enabled: boolean): React.CSSProperties {
  return {
    padding: '8px 20px',
    borderRadius: 8,
    border: 'none',
    background: enabled ? '#123b63' : '#94a3b8',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: enabled ? 'pointer' : 'not-allowed',
    opacity: enabled ? 1 : 0.6,
  };
}

const keyframesCSS = `
@keyframes publishBackdropIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes publishModalIn {
  from { opacity: 0; transform: scale(0.92); }
  to { opacity: 1; transform: scale(1); }
}
`;

function severityIcon(sev: 'blocker' | 'warning' | 'info'): string {
  if (sev === 'blocker') return '✕';
  if (sev === 'warning') return '!';
  return 'ℹ';
}

function CheckListItem({
  result,
  onFix,
}: {
  result: CheckResult;
  onFix?: (nodeId: string) => void;
}): JSX.Element {
  const firstNode = result.affectedNodeIds?.[0];
  return (
    <li style={severityBoxStyle(result.severity)}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', gap: 6, alignItems: 'baseline' }}>
          <span style={{ fontWeight: 700 }}>{severityIcon(result.severity)}</span>
          <span style={{ fontWeight: 600 }}>{result.message}</span>
        </div>
        {result.fixHint ? (
          <div style={{ marginTop: 4, opacity: 0.8, fontSize: '0.74rem' }}>
            ↳ {result.fixHint}
          </div>
        ) : null}
      </div>
      {firstNode && onFix ? (
        <button
          type="button"
          style={fixButtonStyle}
          onClick={() => onFix(firstNode)}
          aria-label="Fix this issue"
        >
          Fix
        </button>
      ) : null}
    </li>
  );
}

export default function PublishModal({
  open,
  document,
  locale,
  activePageId,
  draftMeta,
  onDraftSaved,
  onToast,
  onClose,
}: {
  open: boolean;
  document: BuilderCanvasDocument | null;
  locale: string;
  activePageId?: string | null;
  draftMeta?: DraftMeta | null;
  onDraftSaved?: (draftMeta: DraftMeta, document?: BuilderCanvasDocument) => void;
  onToast?: (message: string, tone: ToastTone) => void;
  onClose: () => void;
}) {
  const setSelectedNodeId = useBuilderCanvasStore((s) => s.setSelectedNodeId);
  const [publishState, setPublishState] = useState<PublishState>('checking');
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null);
  const [suite, setSuite] = useState<PublishCheckSuite | null>(null);
  const [overrideWarnings, setOverrideWarnings] = useState(false);

  const runChecks = useCallback(async () => {
    if (!document) return;
    setPublishState('checking');
    setSuite(null);
    setOverrideWarnings(false);
    if (activePageId) {
      try {
        const res = await fetch('/api/builder/site/publish-checks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            siteId: 'default',
            pageId: activePageId,
            locale,
            document,
          }),
        });
        if (res.ok) {
          const data = (await res.json()) as { ok: boolean; suite?: PublishCheckSuite };
          if (data.ok && data.suite) {
            setSuite(data.suite);
            setPublishState('ready');
            return;
          }
        }
      } catch {
        // fall through to client-side fallback
      }
    }

    // Fallback — minimal client-side check (no SEO/site-aware bits).
    const fallbackSuite: PublishCheckSuite = {
      results: document.nodes.length === 0
        ? [{
            id: 'page-empty',
            severity: 'blocker',
            category: 'performance',
            message: '페이지에 요소가 없습니다.',
          }]
        : [],
      hasBlocker: document.nodes.length === 0,
      blockerCount: document.nodes.length === 0 ? 1 : 0,
      warningCount: 0,
      infoCount: 0,
      checkedAt: new Date().toISOString(),
    };
    setSuite(fallbackSuite);
    setPublishState('ready');
  }, [document, activePageId, locale]);

  useEffect(() => {
    if (!open) {
      setPublishState('checking');
      setPublishError(null);
      setPublishedSlug(null);
      setSuite(null);
      setOverrideWarnings(false);
      return;
    }
    void runChecks();
  }, [open, runChecks]);

  // ESC key handler
  useEffect(() => {
    if (!open) return undefined;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const grouped = useMemo(() => {
    if (!suite) return { blockers: [], warnings: [], infos: [] };
    return {
      blockers: suite.results.filter((r) => r.severity === 'blocker'),
      warnings: suite.results.filter((r) => r.severity === 'warning'),
      infos: suite.results.filter((r) => r.severity === 'info'),
    };
  }, [suite]);

  const canPublish = !!suite && !suite.hasBlocker && publishState === 'ready';
  const hasWarningsOnly = !!suite && !suite.hasBlocker && suite.warningCount > 0;

  const handleFix = useCallback(
    (nodeId: string) => {
      setSelectedNodeId(nodeId);
      onClose();
    },
    [setSelectedNodeId, onClose],
  );

  const handlePublish = useCallback(async () => {
    if (!canPublish || !document) return;
    setPublishState('publishing');
    setPublishError(null);

    try {
      if (activePageId) {
        // ── Site page publish: save draft then call publish API ──
        const saveResponse = await fetch(
          `/api/builder/site/pages/${activePageId}/draft?locale=${locale}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({ expectedRevision: draftMeta?.revision, document }),
          },
        );
        if (!saveResponse.ok) {
          const errData = (await saveResponse.json().catch(() => ({}))) as {
            error?: string;
          };
          const message =
            errData.error === 'draft_conflict'
              ? 'Draft가 다른 탭에서 변경되었습니다. 새로고침 후 다시 발행하세요.'
              : '발행 전 draft 저장에 실패했습니다.';
          setPublishState('error');
          setPublishError(message);
          onToast?.(message, 'error');
          return;
        }
        const saveData = (await saveResponse.json()) as {
          draft?: DraftMeta;
          document?: BuilderCanvasDocument;
        };
        if (saveData.draft) {
          onDraftSaved?.(saveData.draft, saveData.document);
        }
        const expectedDraftRevision = saveData.draft?.revision ?? draftMeta?.revision;

        const publishResponse = await fetch(
          `/api/builder/site/pages/${activePageId}/publish?locale=${locale}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({ expectedDraftRevision }),
          },
        );

        if (!publishResponse.ok) {
          const errData = (await publishResponse.json().catch(() => ({}))) as PublishErrorBody;
          let message = errData.errors?.join(', ') || errData.error || '발행 실패. 다시 시도해 주세요.';
          if (publishResponse.status === 422 && Array.isArray(errData.blockers)) {
            setSuite(blockerSuite(errData.blockers));
            message = '발행 차단 항목을 수정한 뒤 다시 시도하세요.';
          } else if (publishResponse.status === 409 || errData.error === 'draft_stale') {
            const currentRevision =
              typeof errData.current?.revision === 'number'
                ? ` 현재 revision: ${errData.current.revision}.`
                : '';
            message = `Draft가 다른 탭에서 변경되었습니다. 새로고침 후 다시 발행하세요.${currentRevision}`;
          } else if (publishResponse.status >= 500) {
            message = '발행 실패. 다시 시도해 주세요.';
          }
          setPublishState('error');
          setPublishError(message);
          onToast?.(message, 'error');
          return;
        }

        const result = (await publishResponse.json()) as { ok: boolean; slug?: string };
        setPublishState('success');
        const slug = result.slug ?? '';
        setPublishedSlug(buildSitePagePath(locale, slug));
        onToast?.('발행 완료', 'success');
        onClose();
      } else {
        // ── Legacy sandbox publish fallback ──
        const response = await fetch(`/api/builder/sandbox/draft?locale=${locale}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ document }),
        });

        if (!response.ok) {
          setPublishState('error');
          setPublishError('Failed to save draft before publish.');
          return;
        }

        setPublishState('success');
        setPublishedSlug(`/p/sandbox`);
      }
    } catch {
      onToast?.('발행 중 네트워크 오류가 발생했습니다.', 'error');
      setPublishState('error');
      setPublishError('발행 중 네트워크 오류가 발생했습니다.');
    }
  }, [canPublish, document, locale, activePageId, draftMeta?.revision, onDraftSaved, onToast, onClose]);

  if (!open) return null;

  return (
    <>
      <style>{keyframesCSS}</style>
      <div style={backdropStyle} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div style={modalStyle} role="dialog" aria-modal="true">
          <h2 style={titleStyle}>Publish Page</h2>

          {activePageId ? (
            <p style={{ color: '#64748b', fontSize: '0.78rem', margin: '8px 0 0' }}>
              revision {draftMeta?.revision ?? 0} 기준 발행 예정
            </p>
          ) : null}

          {publishState === 'checking' && (
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: 12 }}>
              발행 가능 여부 확인 중...
            </p>
          )}

          {publishState !== 'checking' && suite && (
            <>
              {grouped.blockers.length > 0 && (
                <>
                  <p style={{ ...sectionTitleStyle, color: '#991b1b' }}>
                    Blocker ({grouped.blockers.length}) — 발행 차단
                  </p>
                  <ul style={listStyle}>
                    {grouped.blockers.map((r) => (
                      <CheckListItem key={r.id} result={r} onFix={handleFix} />
                    ))}
                  </ul>
                </>
              )}

              {grouped.warnings.length > 0 && (
                <>
                  <p style={{ ...sectionTitleStyle, color: '#92400e' }}>
                    Warning ({grouped.warnings.length})
                  </p>
                  <ul style={listStyle}>
                    {grouped.warnings.map((r) => (
                      <CheckListItem key={r.id} result={r} onFix={handleFix} />
                    ))}
                  </ul>
                </>
              )}

              {grouped.infos.length > 0 && (
                <>
                  <p style={{ ...sectionTitleStyle, color: '#1e40af' }}>
                    Info ({grouped.infos.length})
                  </p>
                  <ul style={listStyle}>
                    {grouped.infos.map((r) => (
                      <CheckListItem key={r.id} result={r} onFix={handleFix} />
                    ))}
                  </ul>
                </>
              )}

              {suite.results.length === 0 && publishState === 'ready' && (
                <p style={{ ...sectionTitleStyle, color: '#166534' }}>
                  모든 검사 통과 — 발행 가능
                </p>
              )}
            </>
          )}

          {publishState === 'success' && publishedSlug && (
            <div style={{ ...successBoxStyle, marginTop: 16 }}>
              발행 완료!{' '}
              <a
                href={publishedSlug}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#123b63', fontWeight: 700, textDecoration: 'underline' }}
              >
                {publishedSlug} 에서 보기
              </a>
            </div>
          )}

          {publishState === 'error' && publishError && (
            <div style={{ ...severityBoxStyle('blocker'), marginTop: 12 }}>
              {publishError}
            </div>
          )}

          <div style={buttonRowStyle}>
            <button type="button" style={cancelButtonStyle} onClick={onClose}>
              {publishState === 'success' ? '닫기' : '취소'}
            </button>

            {publishState !== 'success' && hasWarningsOnly && !overrideWarnings && (
              <button
                type="button"
                style={publishWarnButtonStyle}
                onClick={() => setOverrideWarnings(true)}
              >
                경고 무시하고 발행
              </button>
            )}

            {publishState !== 'success' && (
              <button
                type="button"
                style={publishButtonStyle(
                  canPublish && ((suite?.warningCount ?? 0) === 0 || overrideWarnings),
                )}
                disabled={
                  !canPublish ||
                  publishState !== 'ready' ||
                  ((suite?.warningCount ?? 0) > 0 && !overrideWarnings)
                }
                onClick={handlePublish}
              >
                {publishState === 'publishing' ? '발행 중...' : '발행'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
