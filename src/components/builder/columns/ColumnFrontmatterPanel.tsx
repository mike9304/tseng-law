'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BLOG_ADMIN_AUTHORS,
  BLOG_ADMIN_CATEGORIES,
  getCategoryLabel,
  getColumnBlogCategory,
} from '@/components/builder/columns/blogAdminMeta';
import type { Locale } from '@/lib/locales';
import type { ColumnFrontmatter } from '@/lib/builder/columns/types';

interface ColumnFrontmatterPanelProps {
  slug: string;
  locale: Locale;
  initial: ColumnFrontmatter;
  onSaveStatus?: (status: 'saving' | 'saved' | 'error') => void;
}

const DEBOUNCE_MS = 1000;

function toDateValue(value?: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 10);
  return date.toISOString().slice(0, 10);
}

function toDateTimeValue(value?: string): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(0, 16);
  return date.toISOString().slice(0, 16);
}

function fromDateTimeValue(value: string): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function uniqueTags(tags: string[]): string[] {
  return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))].slice(0, 20);
}

export default function ColumnFrontmatterPanel({
  slug,
  locale,
  initial,
  onSaveStatus,
}: ColumnFrontmatterPanelProps) {
  const initialCategory = getColumnBlogCategory(initial);
  const [lastmod, setLastmod] = useState(toDateValue(initial.lastmod));
  const [reviewStatus, setReviewStatus] = useState(initial.attorneyReviewStatus || 'pending');
  const [freshness, setFreshness] = useState(initial.freshness || 'unknown');
  const [blogCategory, setBlogCategory] = useState(initialCategory.slug);
  const [tags, setTags] = useState<string[]>(initial.tags ?? []);
  const [tagDraft, setTagDraft] = useState('');
  const [authorName, setAuthorName] = useState(initial.author?.name ?? BLOG_ADMIN_AUTHORS[0].name);
  const [authorTitle, setAuthorTitle] = useState(initial.author?.title ?? BLOG_ADMIN_AUTHORS[0].title);
  const [authorPhoto, setAuthorPhoto] = useState(initial.author?.photo ?? '');
  const [featured, setFeatured] = useState(Boolean(initial.featured));
  const [featuredImage, setFeaturedImage] = useState(initial.featuredImage ?? '');
  const [publishedAt, setPublishedAt] = useState(toDateTimeValue(initial.publishedAt));
  const [seoTitle, setSeoTitle] = useState(initial.seo?.title ?? '');
  const [seoDescription, setSeoDescription] = useState(initial.seo?.description ?? '');
  const [seoOgImage, setSeoOgImage] = useState(initial.seo?.ogImage ?? '');
  const [seoNoIndex, setSeoNoIndex] = useState(Boolean(initial.seo?.noIndex));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef('');
  const hydratedRef = useRef(false);

  const selectedCategory = useMemo(
    () => BLOG_ADMIN_CATEGORIES.find((category) => category.slug === blogCategory) ?? BLOG_ADMIN_CATEGORIES[6],
    [blogCategory],
  );

  const buildPayload = useCallback(() => {
    const isoLastmod = lastmod
      ? new Date(`${lastmod}T00:00:00+09:00`).toISOString()
      : new Date().toISOString();
    const payload = {
      frontmatter: {
        lastmod: isoLastmod,
        attorneyReviewStatus: reviewStatus,
        freshness,
        category: selectedCategory.legacyCategory ?? 'legal',
        blogCategory,
        tags: uniqueTags(tags),
        author: {
          name: authorName.trim() || BLOG_ADMIN_AUTHORS[0].name,
          ...(authorTitle.trim() ? { title: authorTitle.trim() } : {}),
          ...(authorPhoto.trim() ? { photo: authorPhoto.trim() } : {}),
        },
        featured,
        featuredImage: featuredImage.trim() || null,
        publishedAt: fromDateTimeValue(publishedAt),
        seo: {
          ...(seoTitle.trim() ? { title: seoTitle.trim() } : {}),
          ...(seoDescription.trim() ? { description: seoDescription.trim() } : {}),
          ...(seoOgImage.trim() ? { ogImage: seoOgImage.trim() } : {}),
          noIndex: seoNoIndex,
        },
      },
    };
    const serialized = JSON.stringify(payload);
    return { payload, serialized };
  }, [
    lastmod,
    reviewStatus,
    freshness,
    selectedCategory,
    blogCategory,
    tags,
    authorName,
    authorTitle,
    authorPhoto,
    featured,
    featuredImage,
    publishedAt,
    seoTitle,
    seoDescription,
    seoOgImage,
    seoNoIndex,
  ]);

  const save = useCallback(async () => {
    const { serialized } = buildPayload();
    if (!hydratedRef.current) {
      lastSavedRef.current = serialized;
      hydratedRef.current = true;
      return;
    }
    if (serialized === lastSavedRef.current) return;

    onSaveStatus?.('saving');
    try {
      const res = await fetch(
        `/api/builder/columns/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: serialized,
        },
      );
      if (res.ok) {
        lastSavedRef.current = serialized;
        onSaveStatus?.('saved');
      } else {
        onSaveStatus?.('error');
      }
    } catch {
      onSaveStatus?.('error');
    }
  }, [
    slug,
    locale,
    buildPayload,
    onSaveStatus,
  ]);

  const scheduleSave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, DEBOUNCE_MS);
  }, [save]);

  useEffect(() => {
    if (!hydratedRef.current) {
      lastSavedRef.current = buildPayload().serialized;
      hydratedRef.current = true;
      return undefined;
    }
    scheduleSave();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [buildPayload, scheduleSave]);

  function addTag(value: string) {
    const next = value.trim().replace(/^#/, '');
    if (!next) return;
    setTags((current) => uniqueTags([...current, next]));
    setTagDraft('');
  }

  return (
    <aside className="column-frontmatter-panel">
      <div className="column-panel-heading">
        <span>Settings</span>
        <h3>글 설정</h3>
      </div>

      <details className="column-panel-section column-panel-details" open>
        <summary>발행</summary>
        <label className="column-toggle-row">
          <span>
            <strong>Featured</strong>
            <em>목록과 위젯에서 우선 노출</em>
          </span>
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
          />
        </label>

        <label className="column-editor-field">
          <span>발행일</span>
          <input
            type="datetime-local"
            value={publishedAt}
            onChange={(event) => setPublishedAt(event.target.value)}
          />
        </label>

        <label className="column-editor-field">
          <span>최종 수정일</span>
          <input type="date" value={lastmod} onChange={(event) => setLastmod(event.target.value)} />
        </label>
      </details>

      <details className="column-panel-section column-panel-details" open>
        <summary>분류</summary>
        <label className="column-editor-field">
          <span>카테고리</span>
          <select value={blogCategory} onChange={(event) => setBlogCategory(event.target.value)}>
            {BLOG_ADMIN_CATEGORIES.map((category) => (
              <option key={category.slug} value={category.slug}>
                {getCategoryLabel(category, locale)}
              </option>
            ))}
          </select>
        </label>

        <label className="column-editor-field">
          <span>태그</span>
          <div className="column-tag-editor">
            <div>
              {tags.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                  aria-label={`${tag} 태그 제거`}
                >
                  #{tag}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={tagDraft}
              onChange={(event) => setTagDraft(event.target.value)}
              onBlur={(event) => addTag(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ',') {
                  event.preventDefault();
                  addTag(tagDraft);
                }
              }}
              placeholder="태그 입력 후 Enter"
            />
          </div>
        </label>
      </details>

      <details className="column-panel-section column-panel-details">
        <summary>저자</summary>
        <label className="column-editor-field">
          <span>프리셋</span>
          <select
            value={authorName}
            onChange={(event) => {
              const author = BLOG_ADMIN_AUTHORS.find((item) => item.name === event.target.value);
              setAuthorName(event.target.value);
              if (author) {
                setAuthorTitle(author.title);
                setAuthorPhoto(author.photo);
              }
            }}
          >
            {BLOG_ADMIN_AUTHORS.map((author) => (
              <option key={author.id} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </label>
        <label className="column-editor-field">
          <span>저자명</span>
          <input value={authorName} onChange={(event) => setAuthorName(event.target.value)} />
        </label>
        <label className="column-editor-field">
          <span>직책</span>
          <input value={authorTitle} onChange={(event) => setAuthorTitle(event.target.value)} />
        </label>
        <label className="column-editor-field">
          <span>사진 URL</span>
          <input value={authorPhoto} onChange={(event) => setAuthorPhoto(event.target.value)} />
        </label>
      </details>

      <details className="column-panel-section column-panel-details">
        <summary>대표 이미지</summary>
        <label className="column-editor-field">
          <span>Featured image URL</span>
          <input
            value={featuredImage}
            onChange={(event) => setFeaturedImage(event.target.value)}
            placeholder="https://..."
          />
        </label>
      </details>

      <details className="column-panel-section column-panel-details">
        <summary>SEO</summary>
        <label className="column-editor-field">
          <span>SEO title</span>
          <input value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} maxLength={200} />
        </label>
        <label className="column-editor-field">
          <span>SEO description</span>
          <textarea
            value={seoDescription}
            onChange={(event) => setSeoDescription(event.target.value)}
            rows={3}
            maxLength={500}
          />
        </label>
        <label className="column-editor-field">
          <span>OG image URL</span>
          <input value={seoOgImage} onChange={(event) => setSeoOgImage(event.target.value)} />
        </label>
        <label className="column-toggle-row">
          <span>
            <strong>No index</strong>
            <em>검색엔진 색인 제외</em>
          </span>
          <input
            type="checkbox"
            checked={seoNoIndex}
            onChange={(event) => setSeoNoIndex(event.target.checked)}
          />
        </label>
      </details>

      <details className="column-panel-section column-panel-details">
        <summary>검토</summary>
        <label className="column-editor-field">
          <span>변호사 검토</span>
          <select
            value={reviewStatus}
            onChange={(event) => setReviewStatus(event.target.value as ColumnFrontmatter['attorneyReviewStatus'])}
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
            onChange={(event) => setFreshness(event.target.value as ColumnFrontmatter['freshness'])}
          >
            <option value="fresh">최신</option>
            <option value="review_needed">재검토 필요</option>
            <option value="unknown">불명</option>
          </select>
        </label>
      </details>
    </aside>
  );
}
