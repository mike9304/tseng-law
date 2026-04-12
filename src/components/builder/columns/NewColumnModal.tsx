'use client';

import { useEffect, useId, useState } from 'react';
import type { Locale } from '@/lib/locales';

interface NewColumnFormValue {
  slug: string;
  title: string;
  summary: string;
}

interface NewColumnModalProps {
  contentLocale: Locale;
  open: boolean;
  pending?: boolean;
  error?: string | null;
  onClose: () => void;
  onSubmit: (value: NewColumnFormValue) => Promise<void> | void;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function NewColumnModal({
  contentLocale,
  open,
  pending = false,
  error,
  onClose,
  onSubmit,
}: NewColumnModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    if (!open) {
      setTitle('');
      setSlug('');
      setSummary('');
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({
      slug: slug.trim(),
      title: title.trim(),
      summary: summary.trim(),
    });
  }

  return (
    <div
      className="admin-console-modal-backdrop"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget && !pending) onClose();
      }}
    >
      <div
        className="admin-console-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div className="admin-console-modal-header">
          <div>
            <h2 id={titleId}>새 칼럼 만들기</h2>
            <p id={descriptionId}>
              현재 locale <strong>{contentLocale}</strong> 에 draft column 을 생성합니다.
            </p>
          </div>
          <button
            type="button"
            className="admin-console-ghost-btn"
            onClick={onClose}
            disabled={pending}
          >
            닫기
          </button>
        </div>
        <form className="admin-console-form" onSubmit={handleSubmit}>
          <label className="admin-console-field">
            <span>제목</span>
            <input
              type="text"
              value={title}
              onChange={(event) => {
                const nextTitle = event.target.value;
                setTitle(nextTitle);
                setSlug((current) => (current ? current : slugify(nextTitle)));
              }}
              placeholder="예: 대만 투자 계약 분쟁 대응"
              required
              disabled={pending}
            />
          </label>
          <label className="admin-console-field">
            <span>Slug</span>
            <input
              type="text"
              value={slug}
              onChange={(event) => setSlug(slugify(event.target.value))}
              placeholder="taiwan-investment-dispute"
              required
              disabled={pending}
            />
            <small>영문 소문자, 숫자, 하이픈만 허용됩니다.</small>
          </label>
          <label className="admin-console-field">
            <span>요약</span>
            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="목록 카드에 보일 한 줄 설명"
              rows={4}
              disabled={pending}
            />
          </label>
          {error ? <p className="admin-console-form-error">{error}</p> : null}
          <div className="admin-console-form-actions">
            <button
              type="button"
              className="admin-console-ghost-btn"
              onClick={onClose}
              disabled={pending}
            >
              취소
            </button>
            <button type="submit" className="admin-console-primary-btn" disabled={pending}>
              {pending ? '생성 중…' : '새 칼럼 생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
