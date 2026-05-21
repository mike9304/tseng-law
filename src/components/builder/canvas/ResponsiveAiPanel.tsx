'use client';

import { useCallback, useMemo, useState } from 'react';
import styles from './SandboxPage.module.css';
import type {
  ResponsiveSuggestion,
  ResponsiveTargetViewport,
} from '@/lib/builder/ai-generator/responsive-rules';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';

interface ResponsiveAiPanelProps {
  pageId: string;
  locale: Locale;
  targetViewport: ResponsiveTargetViewport;
  canvas: BuilderCanvasDocument;
  onApply: (suggestions: ResponsiveSuggestion[]) => void;
  onClose: () => void;
}

type SuggestionState = 'pending' | 'applied' | 'discarded';

interface PanelRow {
  suggestion: ResponsiveSuggestion;
  state: SuggestionState;
}

const REASON_LABEL: Record<ResponsiveSuggestion['reason'], string> = {
  'text-overflows-viewport': '폭 초과 텍스트 축소',
  'font-too-large': '큰 글꼴 축소',
  'side-by-side-stack': '좌우 컨테이너 세로 정렬',
};

const VIEWPORT_LABEL: Record<ResponsiveTargetViewport, string> = {
  mobile: '모바일',
  tablet: '태블릿',
};

export default function ResponsiveAiPanel({
  pageId,
  locale,
  targetViewport,
  canvas,
  onApply,
  onClose,
}: ResponsiveAiPanelProps) {
  const [rows, setRows] = useState<PanelRow[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  const pendingRows = useMemo(() => rows.filter((row) => row.state === 'pending'), [rows]);
  const appliedCount = useMemo(() => rows.filter((row) => row.state === 'applied').length, [rows]);

  const fetchSuggestions = useCallback(async () => {
    setPending(true);
    setError(null);
    try {
      const response = await fetch('/api/builder/ai-generator/responsive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId, locale, targetViewport, canvas }),
      });
      const body = (await response.json().catch(() => null)) as
        | { ok: true; suggestions: ResponsiveSuggestion[] }
        | { ok: false; error?: string; message?: string }
        | null;
      if (!response.ok || !body || body.ok !== true) {
        const message = body && body.ok === false
          ? body.message ?? body.error ?? '요청에 실패했습니다.'
          : '요청에 실패했습니다.';
        setError(message);
        return;
      }
      setRows(body.suggestions.map((suggestion) => ({ suggestion, state: 'pending' as SuggestionState })));
      setHasFetched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : '반응형 어시스턴트 호출에 실패했습니다.');
    } finally {
      setPending(false);
    }
  }, [canvas, locale, pageId, targetViewport]);

  const applyOne = useCallback(
    (nodeId: string) => {
      const row = rows.find((entry) => entry.suggestion.nodeId === nodeId && entry.state === 'pending');
      if (!row) return;
      onApply([row.suggestion]);
      setRows((prev) =>
        prev.map((entry) =>
          entry.suggestion.nodeId === nodeId ? { ...entry, state: 'applied' } : entry,
        ),
      );
    },
    [onApply, rows],
  );

  const discardOne = useCallback((nodeId: string) => {
    setRows((prev) =>
      prev.map((entry) =>
        entry.suggestion.nodeId === nodeId ? { ...entry, state: 'discarded' } : entry,
      ),
    );
  }, []);

  const applyAll = useCallback(() => {
    const toApply = pendingRows.map((row) => row.suggestion);
    if (toApply.length === 0) return;
    onApply(toApply);
    setRows((prev) => prev.map((entry) => (entry.state === 'pending' ? { ...entry, state: 'applied' } : entry)));
  }, [onApply, pendingRows]);

  return (
    <div
      role="dialog"
      aria-label="반응형 AI 어시스턴트"
      data-builder-responsive-ai-panel="true"
      className={styles.inlineTextAiPanel}
      onMouseDown={(event) => event.stopPropagation()}
      onPointerDown={(event) => event.stopPropagation()}
    >
      <header className={styles.inlineTextAiPanelHeader}>
        <strong>반응형 AI ({VIEWPORT_LABEL[targetViewport]})</strong>
        <button
          type="button"
          className={styles.inlineTextAiPanelClose}
          aria-label="반응형 어시스턴트 닫기"
          onClick={onClose}
        >
          ×
        </button>
      </header>

      <p className={styles.inlineTextAiPreviewText}>
        현재 페이지에서 {VIEWPORT_LABEL[targetViewport]} 안전선({targetViewport === 'mobile' ? '360px' : '720px'})을
        넘는 요소를 찾아 보정 제안을 만듭니다. 각 제안을 개별 또는 일괄 적용할 수 있습니다.
      </p>

      {error ? (
        <p role="alert" className={styles.inlineTextAiError}>
          {error}
        </p>
      ) : null}

      <div className={styles.inlineTextAiActionsRow}>
        <button
          type="button"
          className={styles.inlineTextAiPrimaryButton}
          onClick={fetchSuggestions}
          disabled={pending}
        >
          {pending ? '분석 중...' : hasFetched ? '다시 분석' : '분석 시작'}
        </button>
        <button
          type="button"
          className={styles.inlineTextAiPrimaryButton}
          onClick={applyAll}
          disabled={pendingRows.length === 0 || pending}
        >
          전체 적용 ({pendingRows.length})
        </button>
        {appliedCount > 0 ? (
          <span className={styles.inlineTextAiHistoryLabel}>{appliedCount}개 적용됨</span>
        ) : null}
      </div>

      <ul className={styles.inlineTextAiPreview} aria-live="polite">
        {rows.length === 0 && hasFetched && !pending ? (
          <li className={styles.inlineTextAiPreviewText}>제안이 없습니다. 모바일 안전선을 잘 지키고 있어요.</li>
        ) : null}
        {rows.map(({ suggestion, state }) => (
          <li
            key={`${suggestion.nodeId}-${suggestion.reason}`}
            data-state={state}
            className={styles.inlineTextAiPreviewText}
            style={{
              opacity: state === 'pending' ? 1 : 0.55,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              padding: '8px 0',
              borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
            }}
          >
            <strong>{REASON_LABEL[suggestion.reason]}</strong>
            <span style={{ fontSize: 12 }}>{suggestion.summary}</span>
            <code style={{ fontSize: 11, opacity: 0.85 }}>node: {suggestion.nodeId}</code>
            {state === 'pending' ? (
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  className={styles.inlineTextAiPrimaryButton}
                  onClick={() => applyOne(suggestion.nodeId)}
                  data-builder-responsive-apply-one="true"
                >
                  적용
                </button>
                <button
                  type="button"
                  className={styles.inlineTextAiGhostButton}
                  onClick={() => discardOne(suggestion.nodeId)}
                >
                  제외
                </button>
              </div>
            ) : (
              <span style={{ fontSize: 11 }}>{state === 'applied' ? '적용됨' : '제외됨'}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}