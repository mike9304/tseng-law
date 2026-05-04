'use client';

import { useEffect, useId, useMemo, useState, type FormEvent } from 'react';
import {
  BLOG_ADMIN_AUTHORS,
  BLOG_ADMIN_CATEGORIES,
  getCategoryLabel,
} from '@/components/builder/columns/blogAdminMeta';
import type { Locale } from '@/lib/locales';
import type { ColumnFrontmatter } from '@/lib/builder/columns/types';

interface NewColumnFormValue {
  slug: string;
  title: string;
  summary: string;
  bodyHtml?: string;
  bodyMarkdown?: string;
  frontmatter?: Partial<ColumnFrontmatter>;
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

function buildDraftSlug(title: string): string {
  const base = slugify(title) || 'post';
  return `${base}-${Date.now().toString(36)}`;
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
  const [categorySlug, setCategorySlug] = useState(BLOG_ADMIN_CATEGORIES[0].slug);
  const [authorId, setAuthorId] = useState(BLOG_ADMIN_AUTHORS[0].id);

  const selectedCategory = useMemo(
    () => BLOG_ADMIN_CATEGORIES.find((category) => category.slug === categorySlug) ?? BLOG_ADMIN_CATEGORIES[0],
    [categorySlug],
  );
  const selectedAuthor = useMemo(
    () => BLOG_ADMIN_AUTHORS.find((author) => author.id === authorId) ?? BLOG_ADMIN_AUTHORS[0],
    [authorId],
  );

  useEffect(() => {
    if (!open) {
      setTitle('');
      setCategorySlug(BLOG_ADMIN_CATEGORIES[0].slug);
      setAuthorId(BLOG_ADMIN_AUTHORS[0].id);
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = title.trim() || '제목 없는 글';
    await onSubmit({
      slug: buildDraftSlug(nextTitle),
      title: nextTitle,
      summary: '',
      bodyHtml: '<p></p>',
      bodyMarkdown: '',
      frontmatter: {
        category: selectedCategory.legacyCategory ?? 'legal',
        blogCategory: selectedCategory.slug,
        author: {
          name: selectedAuthor.name,
          title: selectedAuthor.title,
          ...(selectedAuthor.photo ? { photo: selectedAuthor.photo } : {}),
        },
        tags: [],
        featured: false,
      },
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
        className="admin-console-modal new-column-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
      >
        <div className="admin-console-modal-header">
          <div>
            <span className="column-manager-eyebrow">New post</span>
            <h2 id={titleId}>새 글 쓰기</h2>
            <p id={descriptionId}>
              제목만 정하면 바로 글쓰기 화면으로 이동합니다. 요약과 주소는 자동으로 만들고, 필요할 때만 설정에서 바꿉니다.
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
        <form className="admin-console-form new-column-form" onSubmit={handleSubmit}>
          <label className="admin-console-field new-column-title-field">
            <span>제목</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="제목을 입력하세요"
              autoFocus
              disabled={pending}
            />
          </label>

          <details className="new-column-advanced">
            <summary>글 설정</summary>
            <label className="admin-console-field">
              <span>카테고리</span>
              <select
                value={categorySlug}
                onChange={(event) => setCategorySlug(event.target.value)}
                disabled={pending}
              >
                {BLOG_ADMIN_CATEGORIES.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {getCategoryLabel(category, contentLocale)}
                  </option>
                ))}
              </select>
            </label>
            <label className="admin-console-field">
              <span>저자</span>
              <select value={authorId} onChange={(event) => setAuthorId(event.target.value)} disabled={pending}>
                {BLOG_ADMIN_AUTHORS.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
            </label>
          </details>
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
              {pending ? '글 여는 중...' : '글쓰기 시작'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
