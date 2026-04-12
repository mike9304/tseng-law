'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import NewColumnModal from '@/components/builder/columns/NewColumnModal';
import { locales, type Locale } from '@/lib/locales';
import type { ColumnListItem } from '@/lib/builder/columns/types';

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

function formatDate(value: string | null): string {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date
    .toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    .replace(/\s+/g, ' ');
}

function buildColumnsApiUrl(slug: string | null, contentLocale: Locale): string {
  if (!slug) return `/api/builder/columns?locale=${contentLocale}`;
  return `/api/builder/columns/${encodeURIComponent(slug)}?locale=${contentLocale}`;
}

export default function ColumnListView({
  routeLocale,
  contentLocale,
  initialColumns,
}: ColumnListViewProps) {
  const [query, setQuery] = useState('');
  const [columns, setColumns] = useState(initialColumns);
  const [modalOpen, setModalOpen] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createPending, setCreatePending] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filteredColumns = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return columns;
    return columns.filter((column) =>
      [column.title, column.slug, column.summary]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalized)));
  }, [columns, query]);

  async function handleCreate(value: { slug: string; title: string; summary: string }) {
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
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok || !payload?.ok || !payload?.column) {
        throw new Error(payload?.error || '새 칼럼 생성에 실패했습니다.');
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
      setModalOpen(false);
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : '새 칼럼 생성에 실패했습니다.');
    } finally {
      setCreatePending(false);
    }
  }

  async function handleDelete(slug: string) {
    setDeleteError(null);
    setDeleteTarget(slug);
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
      setDeleteError(error instanceof Error ? error.message : '삭제에 실패했습니다.');
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <main className="admin-console">
      <header className="admin-console-header">
        <div>
          <h1>칼럼 빌더 목록</h1>
          <p>
            현재 활성 기능만 노출합니다. 이 배치에서는 <strong>목록, 검색, locale 전환, 생성,
            삭제</strong>가 중심이고, 기본 TipTap 편집 화면은 기존 route 로 연결됩니다. 복제,
            frontmatter, locale linker 는 아직 다음 단계입니다.
          </p>
        </div>
        <div className="admin-console-actions">
          <button
            type="button"
            className="admin-console-primary-btn"
            onClick={() => setModalOpen(true)}
          >
            새 칼럼
          </button>
        </div>
      </header>

      <section className="admin-console-section">
        <header className="admin-console-section-header-row">
          <div>
            <h2>Locale</h2>
            <p>builder UI locale 는 <strong>{routeLocale}</strong>, column content locale 은 아래 탭에서 전환합니다.</p>
          </div>
          <nav className="admin-console-pill-nav" aria-label="Column locale tabs">
            {locales.map((locale) => {
              const href = `/${routeLocale}/admin-builder/columns?contentLocale=${locale}`;
              const active = locale === contentLocale;
              return (
                <Link
                  key={locale}
                  href={href}
                  className={active ? 'is-active' : undefined}
                >
                  {localeLabels[locale]}
                </Link>
              );
            })}
          </nav>
        </header>

        <div className="admin-console-toolbar">
          <label className="admin-console-search">
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="제목, slug, 요약 검색"
              aria-label="칼럼 검색"
            />
          </label>
          <div className="admin-console-toolbar-meta">
            <span className="admin-console-tag">{contentLocale}</span>
            <span>{filteredColumns.length} items</span>
          </div>
        </div>

        {deleteError ? <p className="admin-console-form-error">{deleteError}</p> : null}

        {filteredColumns.length === 0 ? (
          <div className="admin-console-empty-state">
            <h3>아직 칼럼이 없습니다.</h3>
            <p>이 locale 에는 draft/published 칼럼이 없습니다. 새 칼럼을 만들어 첫 초안을 시작하세요.</p>
            <button
              type="button"
              className="admin-console-primary-btn"
              onClick={() => setModalOpen(true)}
            >
              첫 칼럼 만들기
            </button>
          </div>
        ) : (
          <div className="admin-console-card-grid">
            {filteredColumns.map((column) => {
              const deleteBusy = deleteTarget === column.slug;
              return (
                <article key={`${column.locale}-${column.slug}`} className="admin-console-card">
                  <div className="admin-console-card-meta">
                    <span className="admin-console-tag">{column.slug}</span>
                    <span className="admin-console-tag">{freshnessLabels[column.frontmatter.freshness]}</span>
                    <span className="admin-console-tag">
                      {reviewLabels[column.frontmatter.attorneyReviewStatus]}
                    </span>
                  </div>
                  <h3>{column.title}</h3>
                  <p>{column.summary || '요약 없음'}</p>

                  <dl className="admin-console-kv-list">
                    <div>
                      <dt>Last modified</dt>
                      <dd>{formatDate(column.frontmatter.lastmod)}</dd>
                    </div>
                    <div>
                      <dt>Preferred source</dt>
                      <dd>{column.preferredSource}</dd>
                    </div>
                    <div>
                      <dt>Draft</dt>
                      <dd>{column.hasDraft ? `yes · r${column.draftRevision}` : 'no'}</dd>
                    </div>
                    <div>
                      <dt>Published</dt>
                      <dd>
                        {column.hasPublished
                          ? `yes · r${column.publishedRevision} · ${formatDate(column.publishedUpdatedAt)}`
                          : 'no'}
                      </dd>
                    </div>
                  </dl>

                  <div className="admin-console-card-actions">
                    <Link
                      href={`/${routeLocale}/admin-builder/columns/${encodeURIComponent(column.slug)}/edit`}
                      className="admin-console-primary-btn"
                    >
                      편집
                    </Link>
                    <a
                      href={buildColumnsApiUrl(column.slug, contentLocale)}
                      target="_blank"
                      rel="noreferrer"
                      className="admin-console-ghost-btn"
                    >
                      API detail
                    </a>
                    <button
                      type="button"
                      className="admin-console-danger-btn"
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
                      {deleteBusy ? '삭제 중…' : 'Draft 삭제'}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <NewColumnModal
        contentLocale={contentLocale}
        open={modalOpen}
        pending={createPending}
        error={createError}
        onClose={() => {
          if (createPending) return;
          setModalOpen(false);
          setCreateError(null);
        }}
        onSubmit={handleCreate}
      />
    </main>
  );
}
