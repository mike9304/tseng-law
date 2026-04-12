'use client';

import { useCallback, useEffect, useState } from 'react';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';

interface Revision {
  revisionId: string;
  pageId: string;
  savedAt: string;
  nodeCount: number;
}

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 9000,
  background: 'rgba(15, 23, 42, 0.45)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: 'fadeIn 150ms ease',
};

const panelStyle: React.CSSProperties = {
  width: 420,
  maxHeight: '80vh',
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

const listStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '12px 16px',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const itemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid #e2e8f0',
  background: '#fff',
  transition: 'background 120ms ease',
};

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

const restoreBtnStyle: React.CSSProperties = {
  padding: '5px 12px',
  fontSize: '0.75rem',
  fontWeight: 600,
  border: '1px solid #116dff',
  borderRadius: 8,
  background: '#fff',
  color: '#116dff',
  cursor: 'pointer',
  flexShrink: 0,
  transition: 'background 120ms ease, color 120ms ease',
};

const badgeStyle: React.CSSProperties = {
  padding: '2px 8px',
  fontSize: '0.68rem',
  fontWeight: 700,
  borderRadius: 6,
  background: '#eff6ff',
  color: '#116dff',
  flexShrink: 0,
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

export default function VersionHistoryPanel({
  open,
  pageId,
  siteId,
  onClose,
}: {
  open: boolean;
  pageId: string;
  siteId: string;
  onClose: () => void;
}) {
  const replaceDocument = useBuilderCanvasStore((s) => s.replaceDocument);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [restoring, setRestoring] = useState(false);

  const fetchRevisions = useCallback(async () => {
    if (!pageId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/builder/site/revisions?pageId=${encodeURIComponent(pageId)}`,
        { credentials: 'same-origin' },
      );
      if (res.ok) {
        const data = (await res.json()) as { revisions: Revision[] };
        setRevisions(data.revisions);
      }
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    if (open) fetchRevisions();
  }, [open, fetchRevisions]);

  useEffect(() => {
    if (!open) return undefined;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  const handleRestore = async (revisionId: string) => {
    setRestoring(true);
    try {
      const res = await fetch('/api/builder/site/revisions/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ siteId, pageId, revisionId }),
      });
      if (res.ok) {
        const data = (await res.json()) as { document?: Record<string, unknown> };
        if (data.document) {
          replaceDocument(data.document as Parameters<typeof replaceDocument>[0]);
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
              현재 draft 는 덮어씌워집니다.
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

        <div style={listStyle}>
          {/* Current draft */}
          <div style={{ ...itemStyle, borderColor: '#116dff', background: '#f8faff' }}>
            <div>
              <div style={dateStyle}>현재 Draft</div>
              <div style={metaStyle}>편집 중인 버전</div>
            </div>
            <span style={badgeStyle}>현재</span>
          </div>

          {loading ? (
            <div style={{ padding: 12, fontSize: '0.82rem', color: '#94a3b8', textAlign: 'center' }}>
              리비전 로딩 중...
            </div>
          ) : revisions.length === 0 ? (
            <div style={{ padding: 12, fontSize: '0.82rem', color: '#94a3b8', textAlign: 'center' }}>
              저장된 리비전이 없습니다.
            </div>
          ) : (
            revisions.map((rev) => (
              <div key={rev.revisionId} style={itemStyle}>
                <div>
                  <div style={dateStyle}>{formatDate(rev.savedAt)}</div>
                  <div style={metaStyle}>
                    노드 {rev.nodeCount}개
                  </div>
                </div>
                <button
                  type="button"
                  style={restoreBtnStyle}
                  onClick={() => setConfirmId(rev.revisionId)}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#116dff';
                    (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#fff';
                    (e.currentTarget as HTMLButtonElement).style.color = '#116dff';
                  }}
                >
                  복원
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
