'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  BLOG_ADMIN_AUTHORS,
  BLOG_ADMIN_CATEGORIES,
  estimateReadingTime,
  getCategoryLabel,
  getColumnBlogCategory,
} from '@/components/builder/columns/blogAdminMeta';
import { locales, type Locale } from '@/lib/locales';
import type { ColumnFrontmatter, ColumnListItem } from '@/lib/builder/columns/types';

interface ColumnListViewProps {
  routeLocale: Locale;
  contentLocale: Locale;
  initialColumns: ColumnListItem[];
}

const localeLabels: Record<Locale, string> = {
  ko: '한국어',
  'zh-hant': '繁中',
  en: 'EN',
};

const freshnessLabels: Record<ColumnListItem['frontmatter']['freshness'], string> = {
  fresh: 'fresh',
  review_needed: 'review needed',
  unknown: 'unknown',
};

const reviewLabels: Record<ColumnListItem['frontmatter']['attorneyReviewStatus'], string> = {
  pending: 'pending',
  reviewed: 'reviewed',
  'needs-revision': 'needs revision',
};

function formatDate(value: string | null | undefined): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\s+/g, ' ');
}

function buildColumnsApiUrl(slug: string | null, contentLocale: Locale): string {
  if (!slug) return `/api/builder/columns?locale=${contentLocale}`;
  return `/api/builder/columns/${encodeURIComponent(slug)}?locale=${contentLocale}`;
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

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function getPreviewInitials(title: string): string {
  const compact = title.replace(/\s+/g, '').trim();
  return compact.slice(0, 2).toUpperCase() || 'HJ';
}

function getCardSearchText(column: ColumnListItem): string {
  const category = getColumnBlogCategory(column.frontmatter);
  return [
    column.title,
    column.slug,
    column.summary,
    category.label.ko,
    category.label.en,
    column.frontmatter.author?.name,
    column.frontmatter.tags?.join(' '),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export default function ColumnListView({
  routeLocale,
  contentLocale,
  initialColumns,
}: ColumnListViewProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [columns, setColumns] = useState(initialColumns);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createPending, setCreatePending] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const quickCreateStartedRef = useRef(false);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const column of columns) {
      const category = getColumnBlogCategory(column.frontmatter);
      counts.set(category.slug, (counts.get(category.slug) ?? 0) + 1);
    }
    return counts;
  }, [columns]);

  const filteredColumns = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return columns.filter((column) => {
      const category = getColumnBlogCategory(column.frontmatter);
      const categoryMatches = activeCategory === 'all' || category.slug === activeCategory;
      if (!categoryMatches) return false;
      if (!normalized) return true;
      return getCardSearchText(column).includes(normalized);
    });
  }, [columns, query, activeCategory]);

  async function handleCreate(value: {
    slug: string;
    title: string;
    summary: string;
    bodyHtml?: string;
    bodyMarkdown?: string;
    frontmatter?: Partial<ColumnFrontmatter>;
  }) {
    setCreateError(null);
    setCreatePending(true);
    try {
      const response = await fetch(buildColumnsApiUrl(null, contentLocale), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          locale: contentLocale,
          slug: value.slug,
          title: value.title,
          summary: value.summary,
          bodyHtml: value.bodyHtml,
          bodyMarkdown: value.bodyMarkdown,
          frontmatter: value.frontmatter,
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.ok || !payload?.column) {
        throw new Error(payload?.error || '새 글 생성에 실패했습니다.');
      }

      const nextItem: ColumnListItem = {
        slug: payload.column.slug,
        locale: payload.column.locale,
        title: payload.column.title,
        summary: payload.column.summary,
        linkedSlugs: payload.column.linkedSlugs,
        frontmatter: payload.column.frontmatter,
        hasDraft: true,
        hasPublished: false,
        draftRevision: payload.column.revision,
        publishedRevision: null,
        updatedAt: payload.column.updatedAt,
        publishedUpdatedAt: null,
        preferredSource: 'draft',
      };

      setColumns((current) => [nextItem, ...current.filter((item) => item.slug !== nextItem.slug)]);
      setActiveCategory(nextItem.frontmatter.blogCategory ?? activeCategory);
      router.push(`/${routeLocale}/admin-builder/columns/${encodeURIComponent(nextItem.slug)}/edit`);
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : '새 글 생성에 실패했습니다.');
    } finally {
      setCreatePending(false);
    }
  }

  function handleQuickCreate() {
    if (createPending) return;
    const category = BLOG_ADMIN_CATEGORIES[0];
    const author = BLOG_ADMIN_AUTHORS[0];
    void handleCreate({
      slug: buildDraftSlug('post'),
      title: '제목 없는 글',
      summary: '',
      bodyHtml: '<p></p>',
      bodyMarkdown: '',
      frontmatter: {
        category: category.legacyCategory ?? 'legal',
        blogCategory: category.slug,
        author: {
          name: author.name,
          title: author.title,
          ...(author.photo ? { photo: author.photo } : {}),
        },
        tags: [],
        featured: false,
      },
    });
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('new') !== '1' || quickCreateStartedRef.current) return;
    quickCreateStartedRef.current = true;
    handleQuickCreate();
  });

  async function patchFrontmatter(slug: string, frontmatter: Partial<ColumnFrontmatter>) {
    setActionError(null);
    setBusySlug(slug);
    try {
      const response = await fetch(buildColumnsApiUrl(slug, contentLocale), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ frontmatter }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.ok || !payload?.column) {
        throw new Error(payload?.error || '업데이트에 실패했습니다.');
      }
      setColumns((current) =>
        current.map((item) =>
          item.slug === slug
            ? {
                ...item,
                frontmatter: payload.column.frontmatter,
                draftRevision: payload.column.revision,
                hasDraft: true,
                updatedAt: payload.column.updatedAt,
                preferredSource: 'draft',
              }
            : item,
        ),
      );
    } catch (error) {
      setActionError(error instanceof Error ? error.message : '업데이트에 실패했습니다.');
    } finally {
      setBusySlug(null);
    }
  }

  async function handlePublish(slug: string) {
    setActionError(null);
    setBusySlug(slug);
    try {
      const response = await fetch(
        `/api/builder/columns/${encodeURIComponent(slug)}/publish?locale=${encodeURIComponent(contentLocale)}`,
        { method: 'POST', credentials: 'same-origin' },
      );
      const payload = await response.json().catch(() => null);
      if (!response.ok || (!payload?.ok && !payload?.success)) {
        throw new Error(payload?.error || '발행에 실패했습니다.');
      }
      setColumns((current) =>
        current.map((item) =>
          item.slug === slug
            ? {
                ...item,
                hasPublished: true,
                publishedRevision: item.draftRevision,
                publishedUpdatedAt: new Date().toISOString(),
              }
            : item,
        ),
      );
    } catch (error) {
      setActionError(error instanceof Error ? error.message : '발행에 실패했습니다.');
    } finally {
      setBusySlug(null);
    }
  }

  async function handleDelete(slug: string) {
    setActionError(null);
    setBusySlug(slug);
    try {
      const response = await fetch(buildColumnsApiUrl(slug, contentLocale), {
        method: 'DELETE',
        credentials: 'same-origin',
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || '삭제에 실패했습니다.');
      }
      setColumns((current) => current.filter((item) => item.slug !== slug));
    } catch (error) {
      setActionError(error instanceof Error ? error.message : '삭제에 실패했습니다.');
    } finally {
      setBusySlug(null);
    }
  }

  return (
    <main className="admin-console column-manager">
      <header className="column-manager-hero">
        <div>
          <span className="column-manager-eyebrow">Blog manager</span>
          <h1>칼럼 관리</h1>
          <p>카테고리별 칼럼을 검색하고, 초안 작성부터 발행까지 한 화면에서 관리합니다.</p>
        </div>
        <div className="column-manager-hero-actions">
          <Link
            href={`/${routeLocale}/admin-builder`}
            className="admin-console-ghost-btn column-manager-back-btn"
          >
            ← 편집 홈
          </Link>
          <nav className="admin-console-pill-nav" aria-label="Column locale tabs">
            {locales.map((locale) => {
              const href = `/${routeLocale}/admin-builder/columns?contentLocale=${locale}`;
              const active = locale === contentLocale;
              return (
                <Link key={locale} href={href} className={active ? 'is-active' : undefined}>
                  {localeLabels[locale]}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            className="admin-console-primary-btn column-manager-new-btn"
            onClick={handleQuickCreate}
            disabled={createPending}
          >
            {createPending ? '새 글 여는 중...' : '+ 새 글 쓰기'}
          </button>
        </div>
      </header>

      <div className="column-manager-shell">
        <aside className="column-manager-sidebar" aria-label="Column categories">
          <button
            type="button"
            className={activeCategory === 'all' ? 'is-active' : undefined}
            onClick={() => setActiveCategory('all')}
          >
            <span>전체</span>
            <strong>{columns.length}</strong>
          </button>
          {BLOG_ADMIN_CATEGORIES.map((category) => (
            <button
              key={category.slug}
              type="button"
              className={activeCategory === category.slug ? 'is-active' : undefined}
              onClick={() => setActiveCategory(category.slug)}
            >
              <i style={{ background: category.color }} aria-hidden="true" />
              <span>{getCategoryLabel(category, contentLocale)}</span>
              <strong>{categoryCounts.get(category.slug) ?? 0}</strong>
            </button>
          ))}
          <button type="button" className="column-manager-add-category" disabled>
            + 새 카테고리
          </button>
        </aside>

        <section className="column-manager-main">
          <div className="column-manager-toolbar">
            <label className="column-manager-search">
              <span>검색</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="제목, slug, 태그, 저자 검색"
                aria-label="칼럼 검색"
              />
            </label>
            <div className="column-manager-count">
              <strong>{filteredColumns.length}</strong>
              <span>posts</span>
            </div>
          </div>

          {actionError ? <p className="admin-console-form-error">{actionError}</p> : null}
          {createError ? <p className="admin-console-form-error">{createError}</p> : null}

          {filteredColumns.length === 0 ? (
            <div className="admin-console-empty-state column-manager-empty">
              <h3>아직 칼럼이 없습니다.</h3>
              <p>새 글 쓰기를 누르면 바로 본문 작성 화면으로 이동합니다.</p>
              <button
                type="button"
                className="admin-console-primary-btn"
                onClick={handleQuickCreate}
                disabled={createPending}
              >
                {createPending ? '새 글 여는 중...' : '첫 글 쓰기'}
              </button>
            </div>
          ) : (
            <div className="column-post-grid">
              {filteredColumns.map((column) => {
                const category = getColumnBlogCategory(column.frontmatter);
                const deleteBusy = busySlug === column.slug;
                const featured = Boolean(column.frontmatter.featured);
                const readingTime = estimateReadingTime(`${column.summary} ${stripHtml(column.summary)}`);
                const authorName = column.frontmatter.author?.name ?? '호정국제 법률사무소';
                const imageUrl = column.frontmatter.featuredImage;
                return (
                  <article
                    key={`${column.locale}-${column.slug}`}
                    className="column-post-card"
                    style={{ '--column-category-color': category.color } as CSSProperties}
                  >
                    <div className="column-post-card-media">
                      {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageUrl} alt="" />
                      ) : (
                        <div className="column-post-card-placeholder">
                          {getPreviewInitials(column.title)}
                        </div>
                      )}
                      <button
                        type="button"
                        className={featured ? 'column-feature-toggle is-active' : 'column-feature-toggle'}
                        aria-pressed={featured}
                        aria-label={featured ? 'featured 해제' : 'featured 설정'}
                        disabled={deleteBusy}
                        onClick={() => void patchFrontmatter(column.slug, { featured: !featured })}
                      >
                        ★
                      </button>
                    </div>

                    <div className="column-post-card-content">
                      <div className="column-post-card-row">
                        <span className="column-category-chip">
                          {getCategoryLabel(category, contentLocale)}
                        </span>
                        {featured ? <span className="column-featured-label">Featured</span> : null}
                      </div>
                      <h3>
                        <Link href={`/${routeLocale}/admin-builder/columns/${encodeURIComponent(column.slug)}/edit`}>
                          {column.title}
                        </Link>
                      </h3>
                      <p>{column.summary || '요약 없음'}</p>
                      <div className="column-post-card-tags">
                        {(column.frontmatter.tags ?? []).slice(0, 3).map((tag) => (
                          <span key={tag}>#{tag}</span>
                        ))}
                      </div>
                      <div className="column-post-card-footer">
                        <div className="column-author-mini">
                          <span>{authorName.slice(0, 1)}</span>
                          <div>
                            <strong>{authorName}</strong>
                            <em>{formatDate(column.frontmatter.publishedAt ?? column.frontmatter.lastmod)}</em>
                          </div>
                        </div>
                        <span className="column-reading-time">{readingTime}분 읽기</span>
                      </div>
                      <div className="column-post-card-status">
                        <span>{freshnessLabels[column.frontmatter.freshness]}</span>
                        <span>{reviewLabels[column.frontmatter.attorneyReviewStatus]}</span>
                        <span>{column.hasPublished ? 'published' : 'draft'}</span>
                      </div>
                    </div>

                    <details className="column-card-menu">
                      <summary aria-label="칼럼 메뉴">⋯</summary>
                      <div>
                        <Link href={`/${routeLocale}/admin-builder/columns/${encodeURIComponent(column.slug)}/edit`}>
                          편집
                        </Link>
                        <a
                          href={`/${routeLocale}/columns/${encodeURIComponent(column.slug)}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          공개 페이지
                        </a>
                        <button
                          type="button"
                          disabled={deleteBusy || !column.hasDraft}
                          onClick={() => void handlePublish(column.slug)}
                        >
                          발행
                        </button>
                        <a
                          href={buildColumnsApiUrl(column.slug, contentLocale)}
                          target="_blank"
                          rel="noreferrer"
                        >
                          API detail
                        </a>
                        <button
                          type="button"
                          disabled={!column.hasDraft || deleteBusy}
                          onClick={() => {
                            if (!column.hasDraft) return;
                            const accepted = window.confirm(
                              `Delete draft column "${column.title}" (${column.slug})? Published copy, if any, will remain.`,
                            );
                            if (accepted) {
                              void handleDelete(column.slug);
                            }
                          }}
                        >
                          {deleteBusy ? '처리 중' : 'Draft 삭제'}
                        </button>
                      </div>
                    </details>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
