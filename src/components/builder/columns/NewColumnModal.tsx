'use client';

import { useEffect, useId, useMemo, useState, type FormEvent } from 'react';
import {
  BLOG_ADMIN_AUTHORS,
  BLOG_ADMIN_CATEGORIES,
  BLOG_ADMIN_TEMPLATES,
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
  const [categorySlug, setCategorySlug] = useState(BLOG_ADMIN_CATEGORIES[0].slug);
  const [authorId, setAuthorId] = useState(BLOG_ADMIN_AUTHORS[0].id);
  const [templateId, setTemplateId] = useState(BLOG_ADMIN_TEMPLATES[0].id);

  const selectedCategory = useMemo(
    () => BLOG_ADMIN_CATEGORIES.find((category) => category.slug === categorySlug) ?? BLOG_ADMIN_CATEGORIES[0],
    [categorySlug],
  );
  const selectedAuthor = useMemo(
    () => BLOG_ADMIN_AUTHORS.find((author) => author.id === authorId) ?? BLOG_ADMIN_AUTHORS[0],
    [authorId],
  );
  const selectedTemplate = useMemo(
    () => BLOG_ADMIN_TEMPLATES.find((template) => template.id === templateId) ?? BLOG_ADMIN_TEMPLATES[0],
    [templateId],
  );

  useEffect(() => {
    if (!open) {
      setTitle('');
      setSlug('');
      setSummary('');
      setCategorySlug(BLOG_ADMIN_CATEGORIES[0].slug);
      setAuthorId(BLOG_ADMIN_AUTHORS[0].id);
      setTemplateId(BLOG_ADMIN_TEMPLATES[0].id);
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSubmit({
      slug: slug.trim(),
      title: title.trim(),
      summary: (summary.trim() || selectedTemplate.summary).trim(),
      bodyHtml: selectedTemplate.bodyHtml,
      bodyMarkdown: selectedTemplate.bodyMarkdown,
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
        <form className="admin-console-form new-column-form" onSubmit={handleSubmit}>
          <div className="new-column-form-grid">
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
          </div>

          <div className="new-column-form-grid">
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
          </div>

          <fieldset className="new-column-template-grid">
            <legend>템플릿</legend>
            {BLOG_ADMIN_TEMPLATES.map((template) => (
              <label key={template.id} className={templateId === template.id ? 'is-selected' : undefined}>
                <input
                  type="radio"
                  name="template"
                  value={template.id}
                  checked={templateId === template.id}
                  onChange={() => {
                    setTemplateId(template.id);
                    setSummary((current) => current || template.summary);
                  }}
                  disabled={pending}
                />
                <strong>{template.title}</strong>
                <span>{template.description}</span>
              </label>
            ))}
          </fieldset>

          <label className="admin-console-field">
            <span>요약</span>
            <textarea
              value={summary}
              onChange={(event) => setSummary(event.target.value)}
              placeholder="목록 카드와 SEO 기본 설명에 보일 한 줄 설명"
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
              {pending ? '생성 중...' : '새 칼럼 생성'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
