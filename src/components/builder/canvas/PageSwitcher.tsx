'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import type { Locale } from '@/lib/locales';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import TemplateGalleryModal from './TemplateGalleryModal';
import { FOCUSABLE_SELECTOR, readPageResponseError } from './PageSwitcher.helpers';
import {
  actionDotsStyle,
  addButtonStyle,
  clipboardPillStyle,
  columnsQuickActionsStyle,
  columnsQuickButtonStyle,
  columnsQuickCardStyle,
  columnsQuickMetaStyle,
  columnsQuickTitleStyle,
  containerStyle,
  editContainerStyle,
  editHintStyle,
  editInputStyle,
  emptyStateCopyStyle,
  emptyStateStyle,
  emptyStateTitleStyle,
  headerLabelStyle,
  headerStyle,
  homeBadgeStyle,
  menuItemStyle,
  menuStyle,
  moreButtonBaseStyle,
  pageButtonStyle,
  pageRowStyle,
  slugStyle,
  statusDotStyle,
  statusMessageStyle,
  titleTextStyle,
  warningMessageStyle,
} from './PageSwitcher.styles';

interface PageMeta {
  pageId: string;
  slug: string;
  locale: Locale;
  title: Record<string, string>;
  isHomePage?: boolean;
  publishedAt?: string;
  dynamicList?: {
    collectionId: string;
    targetId: string;
  };
  dynamicItem?: {
    collectionId: string;
    targetId: string;
    defaultRecordSlug: string;
  };
}

interface RenamePageResponse {
  ok?: boolean;
  redirectCreated?: boolean;
  redirectWarnings?: Array<{
    from: string;
    to: string;
    message: string;
  }>;
}

type DynamicPageCollectionId = 'columns' | 'service-areas';

interface ColumnQuickSummary {
  loading: boolean;
  total: number | null;
  posts: Array<{ slug: string; title: string }>;
  error: string | null;
}

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
  const [pendingTemplateName, setPendingTemplateName] = useState<string | null>(null);
  const [slugInput, setSlugInput] = useState('');
  const [addToNavigation, setAddToNavigation] = useState(true);
  const [showSlugPrompt, setShowSlugPrompt] = useState(false);
  const [hoveredPageId, setHoveredPageId] = useState<string | null>(null);
  const [openMenuPageId, setOpenMenuPageId] = useState<string | null>(null);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingSlug, setEditingSlug] = useState('');
  const [editingCreateRedirect, setEditingCreateRedirect] = useState(true);
  const [submittingPageId, setSubmittingPageId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const titleInputRef = useRef<HTMLInputElement | null>(null);
  const slugPromptRef = useRef<HTMLDivElement | null>(null);
  const slugPromptRestoreFocusRef = useRef<HTMLElement | null>(null);
  const slugPromptClosingRef = useRef(false);
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

  const clearPendingTemplate = () => {
    setPendingTemplate(undefined);
    setPendingTemplateName(null);
  };

  const closeSlugPrompt = useCallback(() => {
    setShowSlugPrompt(false);
    clearPendingTemplate();
    setAddToNavigation(true);
  }, []);

  const handleTemplateSelect = (templateDocument: BuilderCanvasDocument | null, templateName?: string) => {
    setPendingTemplate(templateDocument);
    setPendingTemplateName(templateName?.trim() || null);
    setSlugInput('');
    setAddToNavigation(true);
    setShowGallery(false);
    setShowSlugPrompt(true);
  };

  useLayoutEffect(() => {
    if (!showSlugPrompt) return undefined;
    slugPromptClosingRef.current = false;
    slugPromptRestoreFocusRef.current = (document.activeElement as HTMLElement | null) ?? null;
    const dialog = slugPromptRef.current;
    if (dialog) {
      const focusables = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      (focusables[0] ?? dialog).focus({ preventScroll: true });
    }
    return () => {
      slugPromptClosingRef.current = true;
      const previous = slugPromptRestoreFocusRef.current;
      if (!previous || typeof previous.focus !== 'function') return;
      try {
        previous.focus({ preventScroll: true });
      } catch {
        // Ignore detached focus targets.
      }
    };
  }, [showSlugPrompt]);

  useEffect(() => {
    if (!showSlugPrompt) return undefined;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        closeSlugPrompt();
        return;
      }
      if (event.key !== 'Tab') return;
      const dialog = slugPromptRef.current;
      if (!dialog) return;
      const focusables = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR))
        .filter((node) => !node.hasAttribute('disabled') && node.tabIndex !== -1);
      if (focusables.length === 0) {
        event.preventDefault();
        dialog.focus({ preventScroll: true });
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (event.shiftKey) {
        if (active === first || active === dialog) {
          event.preventDefault();
          last.focus({ preventScroll: true });
        }
        return;
      }
      if (active === last) {
        event.preventDefault();
        first.focus({ preventScroll: true });
      }
    }
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [closeSlugPrompt, showSlugPrompt]);

  useEffect(() => {
    if (!showSlugPrompt) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showSlugPrompt]);

  useEffect(() => {
    if (!showSlugPrompt) return undefined;
    function handleFocusIn(event: FocusEvent) {
      if (slugPromptClosingRef.current) return;
      const dialog = slugPromptRef.current;
      if (!dialog || !event.target || dialog.contains(event.target as Node)) return;
      event.preventDefault();
      event.stopPropagation();
      const focusables = dialog.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      (focusables[0] ?? dialog).focus({ preventScroll: true });
    }
    document.addEventListener('focusin', handleFocusIn);
    return () => document.removeEventListener('focusin', handleFocusIn);
  }, [showSlugPrompt]);

  const handleCreatePage = async () => {
    if (creating) return;
    const slug = slugInput.trim() || `page-${Date.now().toString(36)}`;
    setCreating(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/builder/site/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          locale,
          slug,
          title: pendingTemplateName ?? slug,
          addToNavigation,
          ...(pendingTemplate ? { document: pendingTemplate } : { blank: true }),
        }),
      });
      if (response.ok) {
        const data = (await response.json()) as { pageId?: string; page?: PageMeta };
        const nextPageId = data.pageId ?? data.page?.pageId ?? null;
        if (!nextPageId) {
          setErrorMessage('페이지를 생성하지 못했습니다.');
          setShowSlugPrompt(true);
          return;
        }
        await fetchPages();
        setShowSlugPrompt(false);
        clearPendingTemplate();
        setSlugInput('');
        setAddToNavigation(true);
        onSelectPage(nextPageId, data.page?.slug);
      } else {
        setErrorMessage(await readPageResponseError(response, '페이지를 생성하지 못했습니다.'));
        setShowSlugPrompt(true);
      }
    } catch {
      setErrorMessage('페이지를 생성하지 못했습니다.');
      setShowSlugPrompt(true);
    } finally {
      setCreating(false);
    }
  };

  const handleCreateDynamicListPage = async (collectionId: DynamicPageCollectionId) => {
    if (creating) return;
    const token = Date.now().toString(36);
    const isColumns = collectionId === 'columns';
    const slug = `${isColumns ? 'columns-list' : 'services-list'}-${token}`;
    setCreating(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/builder/site/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          locale,
          slug,
          title: isColumns ? `칼럼 동적 리스트 ${token}` : `서비스 동적 리스트 ${token}`,
          addToNavigation: false,
          dynamicListCollectionId: collectionId,
          dynamicListLimit: isColumns ? 4 : 6,
        }),
      });
      if (!response.ok) {
        setErrorMessage(await readPageResponseError(response, '동적 리스트 페이지를 생성하지 못했습니다.'));
        return;
      }
      const data = (await response.json()) as { success?: boolean; pageId?: string; page?: PageMeta; error?: string };
      const nextPageId = data.pageId ?? data.page?.pageId ?? null;
      if (!data.success || !nextPageId) {
        setErrorMessage(data.error || '동적 리스트 페이지를 생성하지 못했습니다.');
        return;
      }
      await fetchPages();
      onSelectPage(nextPageId, data.page?.slug ?? slug);
    } catch {
      setErrorMessage('동적 리스트 페이지를 생성하지 못했습니다.');
    } finally {
      setCreating(false);
    }
  };

  const handleCreateDynamicItemPage = async (collectionId: DynamicPageCollectionId) => {
    if (creating) return;
    const token = Date.now().toString(36);
    const isColumns = collectionId === 'columns';
    const slug = `${isColumns ? 'columns-item' : 'services-item'}-${token}`;
    setCreating(true);
    setErrorMessage(null);
    try {
      const response = await fetch('/api/builder/site/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          locale,
          slug,
          title: isColumns ? `칼럼 동적 상세 ${token}` : `서비스 동적 상세 ${token}`,
          addToNavigation: false,
          dynamicItemCollectionId: collectionId,
        }),
      });
      if (!response.ok) {
        setErrorMessage(await readPageResponseError(response, '동적 상세 페이지를 생성하지 못했습니다.'));
        return;
      }
      const data = (await response.json()) as { success?: boolean; pageId?: string; page?: PageMeta; error?: string };
      const nextPageId = data.pageId ?? data.page?.pageId ?? null;
      if (!data.success || !nextPageId) {
        setErrorMessage(data.error || '동적 상세 페이지를 생성하지 못했습니다.');
        return;
      }
      await fetchPages();
      onSelectPage(nextPageId, data.page?.slug ?? slug);
    } catch {
      setErrorMessage('동적 상세 페이지를 생성하지 못했습니다.');
    } finally {
      setCreating(false);
    }
  };

  const startRename = (page: PageMeta) => {
    setEditingPageId(page.pageId);
    setEditingTitle(page.title[page.locale] || page.title[locale] || page.title.ko || page.slug || '');
    setEditingSlug(page.slug);
    setEditingCreateRedirect(true);
    setOpenMenuPageId(null);
    setErrorMessage(null);
    setWarningMessage(null);
  };

  const cancelRename = () => {
    setEditingPageId(null);
    setEditingTitle('');
    setEditingSlug('');
    setEditingCreateRedirect(true);
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
    setWarningMessage(null);
    try {
      const response = await fetch(
        `/api/builder/site/pages/${page.pageId}?locale=${encodeURIComponent(page.locale)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            title: nextTitle,
            slug: nextSlug,
            createRedirect: !page.isHomePage && page.slug !== nextSlug && editingCreateRedirect,
          }),
        },
      );
      if (!response.ok) {
        setErrorMessage(await readPageResponseError(response, '페이지 이름을 저장하지 못했습니다.'));
        return;
      }
      const result = await response.json() as RenamePageResponse;

      await fetchPages();
      cancelRename();
      if (result.redirectWarnings?.length) {
        const warning = result.redirectWarnings[0];
        setWarningMessage(
          `페이지는 저장됐지만 ${warning.from} redirect는 생성되지 않았습니다. 기존 redirect 규칙을 확인하세요. (${warning.message})`,
        );
      }
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

      {!loading ? (
        <section style={columnsQuickCardStyle} aria-label="동적 리스트 페이지 만들기">
          <div style={columnsQuickTitleStyle}>
            <span>CMS 동적 리스트</span>
            <span style={columnsQuickMetaStyle}>draft page</span>
          </div>
          <div style={columnsQuickActionsStyle}>
            <button
              type="button"
              style={columnsQuickButtonStyle}
              disabled={creating}
              data-builder-create-dynamic-list-page="columns"
              onClick={() => { void handleCreateDynamicListPage('columns'); }}
            >
              칼럼 리스트
            </button>
            <button
              type="button"
              style={columnsQuickButtonStyle}
              disabled={creating}
              data-builder-create-dynamic-list-page="service-areas"
              onClick={() => { void handleCreateDynamicListPage('service-areas'); }}
            >
              서비스 리스트
            </button>
            <button
              type="button"
              style={columnsQuickButtonStyle}
              disabled={creating}
              data-builder-create-dynamic-item-page="columns"
              onClick={() => { void handleCreateDynamicItemPage('columns'); }}
            >
              칼럼 상세
            </button>
            <button
              type="button"
              style={columnsQuickButtonStyle}
              disabled={creating}
              data-builder-create-dynamic-item-page="service-areas"
              onClick={() => { void handleCreateDynamicItemPage('service-areas'); }}
            >
              서비스 상세
            </button>
          </div>
        </section>
      ) : null}

      {errorMessage ? (
        <div style={statusMessageStyle} role="status" aria-live="polite">
          {errorMessage}
        </div>
      ) : null}

      {warningMessage ? (
        <div style={warningMessageStyle} role="status" aria-live="polite">
          {warningMessage}
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
          const isDynamicItemPage = Boolean(page.dynamicItem);
          const isDynamicPage = Boolean(page.dynamicList || page.dynamicItem);

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
                  {!page.isHomePage && page.slug !== editingSlug.trim() ? (
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 8,
                        padding: '7px 9px',
                        border: '1px solid #bfdbfe',
                        borderRadius: 8,
                        background: '#eff6ff',
                        color: '#1e3a8a',
                        fontSize: '0.72rem',
                        lineHeight: 1.35,
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={editingCreateRedirect}
                        onChange={(event) => setEditingCreateRedirect(event.target.checked)}
                        style={{ marginTop: 2 }}
                      />
                      <span>
                        <strong>301 redirect 생성</strong><br />
                        저장 시 /{page.locale}/{page.slug} 에서 새 URL로 이동합니다.
                        {isDynamicItemPage ? (
                          <>
                            <br />
                            CMS 레코드 상세 URL은 /old/* 에서 /new/* 로 함께 이동합니다.
                          </>
                        ) : null}
                        <br />
                        기존 redirect 규칙이 같은 URL을 쓰면 페이지는 저장되고 redirect만 건너뜁니다.
                      </span>
                    </label>
                  ) : null}
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
                    {isDynamicPage ? <span style={homeBadgeStyle}>CMS</span> : null}
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
          onSelect={(doc, templateName) => handleTemplateSelect(doc, templateName)}
          onClose={() => setShowGallery(false)}
        />
      ) : null}

      {showSlugPrompt ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="페이지 slug 입력"
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
              closeSlugPrompt();
            }
          }}
        >
          <div
            ref={slugPromptRef}
            tabIndex={-1}
            data-builder-slug-prompt-dialog="true"
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
            {errorMessage ? (
              <div
                role="status"
                aria-live="polite"
                style={{
                  margin: '-4px 0 14px',
                  padding: '8px 10px',
                  borderRadius: 8,
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  lineHeight: 1.35,
                }}
              >
                {errorMessage}
              </div>
            ) : null}
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
            <label
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 8,
                padding: '8px 10px',
                marginBottom: 16,
                border: '1px solid #dbe4ee',
                borderRadius: 10,
                background: '#f8fafc',
                color: '#334155',
                fontSize: '0.8rem',
                fontWeight: 700,
                lineHeight: 1.35,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={addToNavigation}
                onChange={(event) => setAddToNavigation(event.target.checked)}
                style={{ marginTop: 2 }}
              />
              <span>
                메뉴에 추가
                <span style={{ display: 'block', marginTop: 2, color: '#64748b', fontWeight: 500 }}>
                  생성한 페이지를 사이트 상단 메뉴에 바로 연결합니다.
                </span>
              </span>
            </label>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              {pendingTemplate ? (
                <button
                  type="button"
                  data-builder-page-template-back="true"
                  onClick={() => {
                    setShowSlugPrompt(false);
                    clearPendingTemplate();
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
                  closeSlugPrompt();
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
