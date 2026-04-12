'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface FrontmatterState {
  lastmod: string;
  attorneyReviewStatus: 'pending' | 'reviewed' | 'needs-revision';
  freshness: 'fresh' | 'review_needed' | 'unknown';
  category: string;
}

interface ColumnFrontmatterPanelProps {
  slug: string;
  locale: string;
  initial: FrontmatterState;
  onSaveStatus?: (status: 'saving' | 'saved' | 'error') => void;
}

const DEBOUNCE_MS = 1000;

export default function ColumnFrontmatterPanel({
  slug,
  locale,
  initial,
  onSaveStatus,
}: ColumnFrontmatterPanelProps) {
  const [lastmod, setLastmod] = useState(initial.lastmod?.slice(0, 10) || '');
  const [reviewStatus, setReviewStatus] = useState(initial.attorneyReviewStatus || 'pending');
  const [freshness, setFreshness] = useState(initial.freshness || 'unknown');
  const [category, setCategory] = useState(initial.category || 'legal');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(async () => {
    onSaveStatus?.('saving');
    try {
      const res = await fetch(
        `/api/builder/columns/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            frontmatter: {
              lastmod: lastmod ? new Date(`${lastmod}T00:00:00+08:00`).toISOString() : new Date().toISOString(),
              attorneyReviewStatus: reviewStatus,
              freshness,
              category: category || undefined,
            },
          }),
        },
      );
      onSaveStatus?.(res.ok ? 'saved' : 'error');
    } catch {
      onSaveStatus?.('error');
    }
  }, [slug, locale, lastmod, reviewStatus, freshness, category, onSaveStatus]);

  const scheduleSave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, DEBOUNCE_MS);
  }, [save]);

  useEffect(() => {
    scheduleSave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastmod, reviewStatus, freshness, category]);

  return (
    <aside className="column-frontmatter-panel">
      <h3>문서 정보</h3>

      <label className="column-editor-field">
        <span>최종 수정일</span>
        <input
          type="date"
          value={lastmod}
          onChange={(e) => setLastmod(e.target.value)}
        />
      </label>

      <label className="column-editor-field">
        <span>변호사 검토</span>
        <select
          value={reviewStatus}
          onChange={(e) => setReviewStatus(e.target.value as FrontmatterState['attorneyReviewStatus'])}
        >
          <option value="pending">검토 대기</option>
          <option value="reviewed">검토 완료</option>
          <option value="needs-revision">수정 필요</option>
        </select>
      </label>

      <label className="column-editor-field">
        <span>신선도</span>
        <select
          value={freshness}
          onChange={(e) => setFreshness(e.target.value as FrontmatterState['freshness'])}
        >
          <option value="fresh">최신</option>
          <option value="review_needed">재검토 필요</option>
          <option value="unknown">불명</option>
        </select>
      </label>

      <label className="column-editor-field">
        <span>카테고리</span>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="formation">법인설립</option>
          <option value="legal">법률정보</option>
          <option value="case">소송사례</option>
        </select>
      </label>
    </aside>
  );
}
