'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import TemplateGalleryModal from './TemplateGalleryModal';

interface PageMeta {
  pageId: string;
  slug: string;
  locale: Locale;
  title: Record<string, string>;
  isHomePage?: boolean;
  publishedAt?: string;
}

interface ColumnQuickSummary {
  loading: boolean;
  total: number | null;
  posts: Array<{ slug: string; title: string }>;
  error: string | null;
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: '8px 0',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 8px',
  marginBottom: 4,
};

const headerLabelStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: '#64748b',
};

const addButtonStyle: React.CSSProperties = {
  padding: '2px 10px',
  fontSize: '0.75rem',
  fontWeight: 600,
  border: '1px solid #cbd5e1',
  borderRadius: 6,
  background: '#fff',
  color: '#334155',
  cursor: 'pointer',
};

function pageRowStyle(active: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '2px 6px',
    borderRadius: 8,
    border: active ? '1px solid #123b63' : '1px solid transparent',
    background: active ? '#eff6ff' : 'transparent',
    transition: 'background 150ms ease, border-color 150ms ease',
    position: 'relative',
  };
}

function pageButtonStyle(active: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
    flex: 1,
    padding: '6px 4px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: '0.82rem',
    fontWeight: active ? 600 : 400,
    color: active ? '#123b63' : '#334155',
    textAlign: 'left',
  };
}

const moreButtonBaseStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: 6,
  border: 'none',
  background: 'transparent',
  color: '#64748b',
  cursor: 'pointer',
  fontSize: '1rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 120ms ease, background 120ms ease',
};

const menuStyle: React.CSSProperties = {
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: 6,
  minWidth: 120,
  background: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  boxShadow: '0 12px 30px rgba(15, 23, 42, 0.16)',
  padding: 4,
  zIndex: 30,
};

function menuItemStyle(destructive = false, disabled = false): React.CSSProperties {
  return {
    width: '100%',
    padding: '8px 10px',
    border: 'none',
    borderRadius: 8,
    background: 'transparent',
    color: disabled ? '#94a3b8' : destructive ? '#b91c1c' : '#334155',
    fontSize: '0.8rem',
    fontWeight: 500,
    textAlign: 'left',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };
}

function readPageErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') return fallback;
  const body = payload as {
    error?: unknown;
    message?: unknown;
    issues?: unknown;
    validation?: unknown;
  };

  if (body.error === 'duplicate_slug') {
    return '같은 locale 안에 동일한 slug를 쓰는 페이지가 있습니다.';
  }

  const issueSource = Array.isArray(body.issues)
    ? body.issues
    : Array.isArray(body.validation)
      ? body.validation
      : [];
  const firstIssue = issueSource.find((issue): issue is { message?: unknown; fixHint?: unknown; field?: unknown } => (
    Boolean(issue) && typeof issue === 'object'
  ));
  if (firstIssue) {
    if (typeof firstIssue.message === 'string' && firstIssue.message.trim()) {
      return firstIssue.message;
    }
    if (typeof firstIssue.fixHint === 'string' && firstIssue.fixHint.trim()) {
      return firstIssue.fixHint;
    }
  }

  if (typeof body.message === 'string' && body.message.trim()) return body.message;
  if (typeof body.error === 'string' && body.error.trim()) return body.error;
  return fallback;
}

async function readPageResponseError(response: Response, fallback: string): Promise<string> {
  const payload = await response.json().catch(() => null) as unknown;
  return readPageErrorMessage(payload, fallback);
}

const editContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  width: '100%',
  padding: '8px 6px',
};

const editInputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  fontSize: '0.82rem',
  color: '#0f172a',
  outline: 'none',
  boxSizing: 'border-box',
};

const editHintStyle: React.CSSProperties = {
  fontSize: '0.72rem',
  color: '#64748b',
};

const statusMessageStyle: React.CSSProperties = {
  padding: '0 8px 4px',
  fontSize: '0.75rem',
  color: '#b91c1c',
};

const emptyStateStyle: React.CSSProperties = {
  display: 'grid',
  gap: 8,
  margin: '4px 8px',
  padding: 12,
  border: '1px dashed #cbd5e1',
  borderRadius: 10,
  background: '#f8fafc',
  color: '#334155',
};

const emptyStateTitleStyle: React.CSSProperties = {
  fontSize: '0.82rem',
  fontWeight: 800,
  color: '#0f172a',
};

const emptyStateCopyStyle: React.CSSProperties = {
  fontSize: '0.73rem',
  lineHeight: 1.45,
  color: '#64748b',
};

const titleTextStyle: React.CSSProperties = {
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const homeBadgeStyle: React.CSSProperties = {
  fontSize: '0.65rem',
  color: '#123b63',
  fontWeight: 700,
};

const actionDotsStyle: React.CSSProperties = {
  fontSize: '0.9rem',
  lineHeight: 1,
};

const slugStyle: React.CSSProperties = {
  fontSize: '0.7rem',
  color: '#475569',
  marginLeft: 'auto',
  flexShrink: 0,
};

const statusDotStyle = (published: boolean): React.CSSProperties => ({
  width: 6,
  height: 6,
  borderRadius: '50%',
  background: published ? '#22c55e' : '#e2e8f0',
  flexShrink: 0,
});

const clipboardPillStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  alignSelf: 'flex-start',
  gap: 6,
  minHeight: 24,
  margin: '0 8px 8px',
  padding: '0 9px',
  border: '1px solid #bfdbfe',
  borderRadius: 999,
  background: '#eff6ff',
  color: '#1d4ed8',
  fontSize: '0.72rem',
  fontWeight: 800,
};

const columnsQuickCardStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: 8,
  margin: '0 8px 10px',
  padding: 10,
  border: '1px solid #bfdbfe',
  borderRadius: 10,
  background: '#eff6ff',
  color: '#0f172a',
};

const columnsQuickTitleStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  fontSize: '0.8rem',
  fontWeight: 800,
};

const columnsQuickMetaStyle: React.CSSProperties = {
  color: '#475569',
  fontSize: '0.72rem',
  fontWeight: 600,
};

const columnsQuickActionsStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 6,
};

const columnsQuickButtonStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 30,
  padding: '0 8px',
  border: '1px solid #93c5fd',
  borderRadius: 8,
  background: '#fff',
  color: '#1d4ed8',
  fontSize: '0.73rem',
  fontWeight: 800,
  textDecoration: 'none',
  cursor: 'pointer',
};

export default function PageSwitcher({
  locale,
  activePageId,
  clipboardCount = 0,
  columnPostsSummary,
  templateGalleryInitialSearch = '',
  templateGalleryRequestId,
  onSelectPage,
  onPagesChange,
  onToast,
}: {
  locale: Locale;
  activePageId: string | null;
  clipboardCount?: number;
  columnPostsSummary?: ColumnQuickSummary;
  templateGalleryInitialSearch?: string;
  templateGalleryRequestId?: number;
  onSelectPage: (pageId: string, nextSlug?: string) => void;
  onPagesChange?: (pages: PageMeta[]) => void;
  onToast?: (message: string, tone: 'success' | 'error') => void;
}) {
  const [pages, setPages] = useState<PageMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [templateGalleryOpenSearch, setTemplateGalleryOpenSearch] = useState(templateGalleryInitialSearch.trim());
  const [templateGalleryLastSearch, setTemplateGalleryLastSearch] = useState(templateGalleryInitialSearch.trim());
  const [pendingTemplate, setPendingTemplate] = useState<BuilderCanvasDocument | null | undefined>(undefined);
  const [slugInput, setSlugInput] = useState('');
  const [showSlugPrompt, setShowSlugPrompt] = useState(false);
  const [hoveredPageId, setHoveredPageId] = useState<string | null>(null);
  const [openMenuPageId, setOpenMenuPageId] = useState<string | null>(null);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingSlug, setEditingSlug] = useState('');
  const [submittingPageId, setSubmittingPageId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const columnsPage = pages.find((page) => page.slug === 'columns') ?? null;

  const fetchPages = useCallback(async (): Promise<PageMeta[]> => {
    try {
      const response = await fetch(`/api/builder/site/pages?locale=${locale}`, {
        credentials: 'same-origin',
      });
      if (response.ok) {
        const data = (await response.json()) as { pages: PageMeta[] };
        setPages(data.pages);
        onPagesChange?.(data.pages);
        return data.pages;
      }
      setErrorMessage('페이지 목록을 불러오지 못했습니다.');
      onToast?.('네트워크 오류, 다시 시도해주세요', 'error');
    } catch {
      setErrorMessage('페이지 목록을 불러오지 못했습니다.');
      onToast?.('네트워크 오류, 다시 시도해주세요', 'error');
    } finally {
      setLoading(false);
    }
    return [];
  }, [locale, onPagesChange, onToast]);

  useEffect(() => {
    void fetchPages();
  }, [fetchPages]);

  useEffect(() => {
    if (!editingPageId) return;
    window.setTimeout(() => titleInputRef.current?.focus(), 0);
  }, [editingPageId]);

  const openTemplateGallery = useCallback((search = '') => {
    const normalizedSearch = search.trim();
    setTemplateGalleryOpenSearch(normalizedSearch);
    setTemplateGalleryLastSearch(normalizedSearch);
    setShowGallery(true);
  }, []);

  const handleTemplateGallerySearchChange = useCallback((query: string) => {
    setTemplateGalleryLastSearch(query.trim());
  }, []);

  useEffect(() => {
    if (!templateGalleryRequestId) return;
    openTemplateGallery(templateGalleryInitialSearch);
  }, [openTemplateGallery, templateGalleryInitialSearch, templateGalleryRequestId]);

  useEffect(() => {
    if (!openMenuPageId) return;
    const handleWindowClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-page-switcher-menu]')) {
        setOpenMenuPageId(null);
      }
    };
    window.addEventListener('click', handleWindowClick, true);
    return () => window.removeEventListener('click', handleWindowClick, true);
  }, [openMenuPageId]);

  const handleTemplateSelect = (templateDocument: BuilderCanvasDocument | null) => {
    setPendingTemplate(templateDocument);
    setSlugInput('');
    setShowGallery(false);
    setShowSlugPrompt(true);
  };

  const handleCreatePage = async () => {
    if (creating) return;
    const slug = slugInput.trim() || `page-${Date.now().toString(36)}`;
    setCreating(true);
    setShowSlugPrompt(false);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/builder/site/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          locale,
          slug,
          title: slug,
          ...(pendingTemplate ? { document: pendingTemplate } : { blank: true }),
        }),
      });
      if (response.ok) {
        const data = (await response.json()) as { pageId?: string; page?: PageMeta };
        await fetchPages();
        if (data.pageId) {
          onSelectPage(data.pageId, data.page?.slug);
        }
      } else {
        setErrorMessage(await readPageResponseError(response, '페이지를 생성하지 못했습니다.'));
      }
    } catch {
      setErrorMessage('페이지를 생성하지 못했습니다.');
    } finally {
      setCreating(false);
      setPendingTemplate(undefined);
    }
  };

  const startRename = (page: PageMeta) => {
    setEditingPageId(page.pageId);
    setEditingTitle(page.title[page.locale] || page.title[locale] || page.title.ko || page.slug || '');
    setEditingSlug(page.slug);
    setOpenMenuPageId(null);
    setErrorMessage(null);
  };

  const cancelRename = () => {
    setEditingPageId(null);
    setEditingTitle('');
    setEditingSlug('');
  };

  const handleRename = async (page: PageMeta) => {
    const nextTitle = editingTitle.trim();
    const nextSlug = editingSlug.trim();
    if (!nextTitle) {
      setErrorMessage('페이지 이름은 비워둘 수 없습니다.');
      return;
    }

    setSubmittingPageId(page.pageId);
    setErrorMessage(null);
    try {
      const response = await fetch(
        `/api/builder/site/pages/${page.pageId}?locale=${encodeURIComponent(page.locale)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ title: nextTitle, slug: nextSlug }),
        },
      );
      if (!response.ok) {
        setErrorMessage(await readPageResponseError(response, '페이지 이름을 저장하지 못했습니다.'));
        return;
      }

      await fetchPages();
      cancelRename();
    } catch {
      setErrorMessage('페이지 이름을 저장하지 못했습니다.');
    } finally {
      setSubmittingPageId(null);
    }
  };

  const handleDelete = async (page: PageMeta) => {
    if (page.isHomePage) return;
    const confirmed = window.confirm('정말 삭제하시겠습니까?');
    if (!confirmed) return;

    setSubmittingPageId(page.pageId);
    setOpenMenuPageId(null);
    setErrorMessage(null);
    try {
      const response = await fetch(
        `/api/builder/site/pages/${page.pageId}?locale=${encodeURIComponent(page.locale)}`,
        {
          method: 'DELETE',
          credentials: 'same-origin',
        },
      );
      if (!response.ok) {
        setErrorMessage(await readPageResponseError(response, '페이지를 삭제하지 못했습니다.'));
        return;
      }

      const nextPages = await fetchPages();
      if (page.pageId === activePageId && nextPages.length > 0) {
        onSelectPage(nextPages[0].pageId, nextPages[0].slug);
      }
    } catch {
      setErrorMessage('페이지를 삭제하지 못했습니다.');
    } finally {
      setSubmittingPageId(null);
    }
  };

  const handleEditKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
    page: PageMeta,
  ) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelRename();
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      await handleRename(page);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span style={headerLabelStyle}>Pages</span>
        <button
          type="button"
          style={addButtonStyle}
          disabled={creating}
          onClick={() => openTemplateGallery()}
        >
          {creating ? '...' : '+ New'}
        </button>
      </div>
      {clipboardCount > 0 ? (
        <span style={clipboardPillStyle}>
          <span aria-hidden="true">⌘V</span>
          <span>{clipboardCount}개 요소 클립보드</span>
        </span>
      ) : null}

      {!loading && columnsPage ? (
        <section style={columnsQuickCardStyle} aria-label="칼럼 빠른 이동">
          <div style={columnsQuickTitleStyle}>
            <span>칼럼</span>
            <span style={columnsQuickMetaStyle}>
              {columnPostsSummary?.loading
                ? 'loading'
                : columnPostsSummary?.error
                  ? `/${columnsPage.slug}`
                  : `${columnPostsSummary?.total ?? columnPostsSummary?.posts.length ?? 0} posts`}
            </span>
          </div>
          {columnPostsSummary?.posts.length ? (
            <div style={{ display: 'grid', gap: 4 }}>
              {columnPostsSummary.posts.slice(0, 2).map((post) => (
                <a
                  key={post.slug}
                  href={`/${locale}/admin-builder/columns/${encodeURIComponent(post.slug)}/edit`}
                  style={{ ...columnsQuickMetaStyle, color: '#1d4ed8', textDecoration: 'none' }}
                  title={post.title}
                >
                  수정 · {post.title}
                </a>
              ))}
            </div>
          ) : null}
          <div style={columnsQuickActionsStyle}>
            <button
              type="button"
              style={columnsQuickButtonStyle}
              onClick={() => onSelectPage(columnsPage.pageId, columnsPage.slug)}
            >
              칼럼 페이지로 이동
            </button>
            <a
              href={`/${locale}/admin-builder/columns`}
              style={columnsQuickButtonStyle}
            >
              칼럼 관리
            </a>
            <a
              href={`/${locale}/admin-builder/columns?new=1`}
              style={{
                ...columnsQuickButtonStyle,
                gridColumn: '1 / -1',
                background: '#116dff',
                borderColor: '#116dff',
                color: '#fff',
              }}
            >
              새 글 쓰기
            </a>
          </div>
        </section>
      ) : null}

      {errorMessage ? (
        <div style={statusMessageStyle} role="status" aria-live="polite">
          {errorMessage}
        </div>
      ) : null}

      {loading ? (
        <div style={{ padding: '8px 10px', fontSize: '0.8rem', color: '#94a3b8' }}>
          Loading...
        </div>
      ) : pages.length === 0 ? (
        <div style={emptyStateStyle}>
          <strong style={emptyStateTitleStyle}>페이지가 없습니다.</strong>
          <span style={emptyStateCopyStyle}>새 페이지를 만들거나 템플릿으로 시작하세요.</span>
          <button
            type="button"
            style={{ ...addButtonStyle, width: 'fit-content', minHeight: 28 }}
            disabled={creating}
            onClick={() => openTemplateGallery()}
          >
            첫 페이지 만들기
          </button>
        </div>
      ) : (
        pages.map((page) => {
          const isActive = page.pageId === activePageId;
          const isEditing = page.pageId === editingPageId;
          const menuOpen = page.pageId === openMenuPageId;
          const showMoreButton = hoveredPageId === page.pageId || menuOpen;
          const isBusy = submittingPageId === page.pageId;

          return (
            <div
              key={page.pageId}
              data-builder-page-row={page.pageId}
              data-builder-page-slug={page.slug}
              style={pageRowStyle(isActive)}
              onMouseEnter={() => setHoveredPageId(page.pageId)}
              onMouseLeave={() => setHoveredPageId((current) => (current === page.pageId ? null : current))}
            >
              {isEditing ? (
                <div style={editContainerStyle}>
                  <input
                    ref={titleInputRef}
                    type="text"
                    aria-label="페이지 이름"
                    value={editingTitle}
                    placeholder="페이지 이름"
                    style={editInputStyle}
                    onChange={(event) => setEditingTitle(event.target.value)}
                    onKeyDown={(event) => { void handleEditKeyDown(event, page); }}
                  />
                  <input
                    type="text"
                    aria-label="페이지 slug"
                    value={editingSlug}
                    placeholder="slug"
                    style={editInputStyle}
                    onChange={(event) => setEditingSlug(event.target.value)}
                    onKeyDown={(event) => { void handleEditKeyDown(event, page); }}
                  />
                  <div style={editHintStyle}>
                    {isBusy ? '저장 중...' : 'Enter 저장 · Esc 취소'}
                  </div>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    style={pageButtonStyle(isActive)}
                    onClick={() => onSelectPage(page.pageId, page.slug)}
                  >
                    <span style={statusDotStyle(!!page.publishedAt)} title={page.publishedAt ? 'Published' : 'Draft'} />
                    <span style={titleTextStyle}>{page.title[locale] || page.title[page.locale] || page.title.ko || page.slug || 'Untitled'}</span>
                    {page.isHomePage ? <span style={homeBadgeStyle}>HOME</span> : null}
                    <span style={slugStyle}>/{page.slug}</span>
                  </button>

                  <div style={{ position: 'relative' }} data-page-switcher-menu>
                    <button
                      type="button"
                      aria-label="페이지 메뉴"
                      style={{
                        ...moreButtonBaseStyle,
                        opacity: showMoreButton ? 1 : 0,
                        pointerEvents: showMoreButton ? 'auto' : 'none',
                        background: menuOpen ? '#e2e8f0' : 'transparent',
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        setOpenMenuPageId((current) => (current === page.pageId ? null : page.pageId));
                      }}
                    >
                      <span style={actionDotsStyle}>⋯</span>
                    </button>

                    {menuOpen ? (
                      <div style={menuStyle}>
                        <button
                          type="button"
                          style={menuItemStyle()}
                          onClick={() => startRename(page)}
                        >
                          이름 변경
                        </button>
                        <button
                          type="button"
                          style={menuItemStyle(true, Boolean(page.isHomePage))}
                          disabled={page.isHomePage}
                          onClick={() => { void handleDelete(page); }}
                        >
                          삭제
                        </button>
                      </div>
                    ) : null}
                  </div>
                </>
              )}
            </div>
          );
        })
      )}

      {showGallery ? (
        <TemplateGalleryModal
          initialSearch={templateGalleryOpenSearch}
          onSearchChange={handleTemplateGallerySearchChange}
          onSelect={(doc) => handleTemplateSelect(doc)}
          onClose={() => setShowGallery(false)}
        />
      ) : null}

      {showSlugPrompt ? (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            zIndex: 10000,
          }}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowSlugPrompt(false);
              setPendingTemplate(undefined);
            }
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 24px 64px rgba(0,0,0,.18)',
              padding: 32,
              maxWidth: 400,
              width: '90vw',
            }}
          >
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>
              페이지 Slug 입력
            </div>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: 16 }}>
              {pendingTemplate ? '선택한 템플릿으로 새 페이지를 생성합니다.' : '빈 페이지를 생성합니다.'}
            </div>
            <input
              type="text"
              placeholder="예: about, services, contact"
              value={slugInput}
              onChange={(event) => setSlugInput(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Enter') void handleCreatePage(); }}
              autoFocus
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                fontSize: '0.9rem',
                marginBottom: 16,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              {pendingTemplate ? (
                <button
                  type="button"
                  data-builder-page-template-back="true"
                  onClick={() => {
                    setShowSlugPrompt(false);
                    setPendingTemplate(undefined);
                    setTemplateGalleryOpenSearch(templateGalleryLastSearch);
                    setShowGallery(true);
                  }}
                  style={{ padding: '6px 16px', background: '#eff6ff', color: '#123b63', border: '1px solid #bfdbfe', borderRadius: 8, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  다른 템플릿 선택
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => {
                  setShowSlugPrompt(false);
                  setPendingTemplate(undefined);
                }}
                style={{ padding: '6px 16px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: 8, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => { void handleCreatePage(); }}
                disabled={creating}
                style={{ padding: '6px 16px', background: '#123b63', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}
              >
                {creating ? '생성 중...' : '생성'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
