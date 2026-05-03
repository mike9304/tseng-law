'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/locales';
import ModalShell from './ModalShell';

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
    <ModalShell
      title="페이지로 이동"
      description={`선택된 ${sourceNodeIds.length}개 요소를 다른 페이지로 옮깁니다.`}
      ariaLabel="페이지로 이동"
      size="sm"
      onClose={onClose}
    >
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
    </ModalShell>
  );
}
