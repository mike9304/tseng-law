'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  SAVED_SECTION_CATEGORIES,
  type SavedSection,
  type SavedSectionCategory,
} from '@/lib/builder/site/types';
import { normalizeSavedSectionSnapshot } from '@/lib/builder/sections/normalize';
import { buildSavedSectionThumbnailSvg } from '@/lib/builder/sections/thumbnail';

export { buildSavedSectionThumbnailSvg as buildThumbnailSvg } from '@/lib/builder/sections/thumbnail';

const CATEGORY_LABELS: Record<SavedSectionCategory, string> = {
  hero: 'Hero',
  features: 'Features',
  testimonials: 'Testimonials',
  cta: 'CTA',
  footer: 'Footer',
  custom: 'Custom',
};

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export interface SaveSectionPayload {
  rootNodeId: string;
  /** Snapshot — root + descendants. The modal/server normalize before storage. */
  nodes: BuilderCanvasNode[];
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter((element) => (
    !element.hidden &&
    !element.closest('[hidden]') &&
    element.getAttribute('aria-hidden') !== 'true' &&
    element.getClientRects().length > 0
  ));
}

export default function SaveSectionModal({
  payload,
  locale,
  onSaved,
  onClose,
}: {
  payload: SaveSectionPayload;
  locale: Locale;
  onSaved: (section: SavedSection) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<SavedSectionCategory>('custom');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const closingRef = useRef(false);

  const closeModal = useCallback(() => {
    closingRef.current = true;
    onClose();
  }, [onClose]);

  useLayoutEffect(() => {
    restoreFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closingRef.current = false;
    const panel = panelRef.current;
    if (!panel) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const focusFrame = window.requestAnimationFrame(() => {
      (nameInputRef.current ?? getFocusableElements(panel)[0] ?? panel).focus({ preventScroll: true });
    });
    const handleFocusIn = (event: FocusEvent) => {
      if (panel.contains(event.target as Node | null)) return;
      (nameInputRef.current ?? getFocusableElements(panel)[0] ?? panel).focus({ preventScroll: true });
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener('focusin', handleFocusIn);
      if (!closingRef.current) return;
      const restoreTarget = restoreFocusRef.current;
      window.setTimeout(() => {
        if (restoreTarget?.isConnected) restoreTarget.focus({ preventScroll: true });
        restoreFocusRef.current = null;
        closingRef.current = false;
      }, 0);
    };
  }, []);

  const handleDialogKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      closeModal();
      return;
    }
    if (event.key !== 'Tab') return;

    const panel = panelRef.current;
    if (!panel) return;
    const focusable = getFocusableElements(panel);
    if (focusable.length === 0) {
      event.preventDefault();
      panel.focus({ preventScroll: true });
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

  const normalizedPayload = useMemo(
    () => ({
      rootNodeId: payload.rootNodeId,
      nodes: normalizeSavedSectionSnapshot(payload.nodes, payload.rootNodeId),
    }),
    [payload.nodes, payload.rootNodeId],
  );
  const thumbnailSvg = useMemo(
    () => buildSavedSectionThumbnailSvg(normalizedPayload.nodes, normalizedPayload.rootNodeId),
    [normalizedPayload],
  );

  async function handleSave() {
    if (submitting) return;
    if (!name.trim()) {
      setErrorMessage('이름을 입력하세요.');
      return;
    }
    if (normalizedPayload.nodes.length === 0) {
      setErrorMessage('선택한 섹션 데이터가 올바르지 않습니다.');
      return;
    }
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `/api/builder/site/section-library?locale=${encodeURIComponent(locale)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim() || undefined,
            category,
            rootNodeId: normalizedPayload.rootNodeId,
            nodes: normalizedPayload.nodes,
            locale,
          }),
        },
      );
      const data = (await response.json()) as { ok: boolean; section?: SavedSection; error?: string };
      if (!response.ok || !data.ok || !data.section) {
        setErrorMessage(data.error ?? '저장에 실패했습니다.');
        return;
      }
      closingRef.current = true;
      onSaved(data.section);
    } catch (error) {
      const message = error instanceof Error ? error.message : '저장에 실패했습니다.';
      setErrorMessage(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="presentation"
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
        if (event.target === event.currentTarget) closeModal();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="섹션으로 저장"
        tabIndex={-1}
        data-builder-save-section-dialog="true"
        onKeyDownCapture={handleDialogKeyDown}
        style={{
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 32px 80px rgba(0, 0, 0, 0.25)',
          padding: 24,
          maxWidth: 520,
          width: '92vw',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
            섹션으로 저장
          </h2>
          <button
            type="button"
            onClick={closeModal}
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

        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
          선택한 컨테이너와 자식 요소를 라이브러리에 저장합니다. 다른 페이지에서 재사용할 수 있습니다.
        </div>

        <div
          style={{
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            background: '#f8fafc',
            height: 140,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
          dangerouslySetInnerHTML={{ __html: thumbnailSvg }}
        />

        <label style={labelStyle}>
          <span style={labelTextStyle}>이름 *</span>
          <input
            ref={nameInputRef}
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={200}
            autoFocus
            placeholder="예) 호정 hero 섹션"
            style={inputStyle}
          />
        </label>

        <label style={labelStyle}>
          <span style={labelTextStyle}>설명 (선택)</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            maxLength={1000}
            rows={2}
            placeholder="섹션 용도, 사용 위치 등"
            style={{ ...inputStyle, fontFamily: 'inherit', resize: 'vertical' }}
          />
        </label>

        <label style={labelStyle}>
          <span style={labelTextStyle}>카테고리</span>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as SavedSectionCategory)}
            style={inputStyle}
          >
            {SAVED_SECTION_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_LABELS[cat]}
              </option>
            ))}
          </select>
        </label>

        {errorMessage ? (
          <div
            style={{
              padding: '8px 12px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 8,
              color: '#b91c1c',
              fontSize: '0.78rem',
            }}
          >
            {errorMessage}
          </div>
        ) : null}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
          <button
            type="button"
            onClick={closeModal}
            disabled={submitting}
            style={{
              padding: '8px 14px',
              border: '1px solid #cbd5e1',
              borderRadius: 8,
              background: '#fff',
              color: '#334155',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: submitting ? 'not-allowed' : 'pointer',
            }}
          >
            취소
          </button>
          <button
            type="button"
            onClick={() => { void handleSave(); }}
            disabled={submitting || !name.trim()}
            style={{
              padding: '8px 16px',
              border: 'none',
              borderRadius: 8,
              background: submitting || !name.trim() ? '#94a3b8' : '#123b63',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: submitting || !name.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {submitting ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const labelTextStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#475569',
  fontWeight: 600,
};

const inputStyle: React.CSSProperties = {
  padding: '8px 10px',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: '#fff',
  fontSize: '0.85rem',
  color: '#0f172a',
  outline: 'none',
};
