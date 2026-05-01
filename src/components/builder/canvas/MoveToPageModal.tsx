'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/locales';

interface PageOption {
  pageId: string;
  slug: string;
  isHomePage?: boolean;
  title?: string;
}

export default function MoveToPageModal({
  pages,
  currentPageId,
  sourceNodeIds,
  locale,
  onMoved,
  onClose,
}: {
  pages: PageOption[];
  currentPageId: string;
  sourceNodeIds: string[];
  locale: Locale;
  onMoved: (result: {
    movedCount: number;
    movedRootIds: string[];
    targetPageId: string;
    targetSlug: string;
  }) => void;
  onClose: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const targets = pages.filter((page) => page.pageId !== currentPageId);

  async function handleMove(target: PageOption) {
    if (submitting) return;
    setSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await fetch(
        `/api/builder/site/pages/${target.pageId}/move-from?locale=${encodeURIComponent(locale)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            sourcePageId: currentPageId,
            nodeIds: sourceNodeIds,
          }),
        },
      );
      const data = (await response.json()) as {
        ok: boolean;
        movedCount?: number;
        movedRootIds?: string[];
        error?: string;
      };
      if (!response.ok || !data.ok) {
        setErrorMessage(data.error ?? '이동에 실패했습니다.');
        return;
      }
      onMoved({
        movedCount: data.movedCount ?? 0,
        movedRootIds: data.movedRootIds ?? [],
        targetPageId: target.pageId,
        targetSlug: target.slug,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '이동에 실패했습니다.';
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-label="페이지로 이동"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(15, 23, 42, 0.5)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.25)',
          padding: 24,
          maxWidth: 480,
          width: '92vw',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 6,
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
            페이지로 이동
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '1.3rem',
              color: '#64748b',
              cursor: 'pointer',
              padding: '2px 8px',
              borderRadius: 8,
            }}
          >
            ×
          </button>
        </div>
        <div style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: 16 }}>
          선택된 {sourceNodeIds.length}개 요소를 다른 페이지로 옮깁니다.
        </div>

        {errorMessage ? (
          <div
            style={{
              padding: '8px 12px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 8,
              color: '#b91c1c',
              fontSize: '0.78rem',
              marginBottom: 12,
            }}
          >
            {errorMessage}
          </div>
        ) : null}

        <div
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            overflow: 'auto',
            maxHeight: 360,
          }}
        >
          {targets.length === 0 ? (
            <div style={{ padding: 24, fontSize: '0.85rem', color: '#94a3b8', textAlign: 'center' }}>
              이동할 다른 페이지가 없습니다.<br />
              먼저 새 페이지를 만들어주세요.
            </div>
          ) : (
            targets.map((page) => (
              <button
                key={page.pageId}
                type="button"
                disabled={submitting}
                onClick={() => { void handleMove(page); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  border: 'none',
                  borderBottom: '1px solid #f1f5f9',
                  background: 'transparent',
                  textAlign: 'left',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontSize: '0.88rem',
                  color: '#0f172a',
                  transition: 'background 120ms ease',
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.background = '#f8fafc';
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.background = 'transparent';
                }}
              >
                <span
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: '#eff6ff',
                    color: '#123b63',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                  }}
                >
                  →
                </span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {page.title || page.slug || 'Untitled'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                    /{page.slug}
                    {page.isHomePage ? ' · HOME' : ''}
                  </div>
                </span>
              </button>
            ))
          )}
        </div>

        {submitting ? (
          <div style={{ marginTop: 12, fontSize: '0.78rem', color: '#64748b', textAlign: 'center' }}>
            이동 중...
          </div>
        ) : (
          <div style={{ marginTop: 12, fontSize: '0.72rem', color: '#94a3b8', textAlign: 'center' }}>
            Esc 또는 화면 바깥 클릭으로 닫기
          </div>
        )}
      </div>
    </div>
  );
}
