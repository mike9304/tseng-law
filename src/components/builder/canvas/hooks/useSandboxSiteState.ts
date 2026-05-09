'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { BuilderPageSummary, ColumnPostsSummary } from '@/components/builder/canvas/SandboxEditorRail';
import type { MoveToPageResult } from '@/components/builder/canvas/SandboxModalsRoot';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { buildSitePagePath, comparableSitePath, normalizeSiteHref } from '@/lib/builder/site/paths';
import { DEFAULT_THEME, type BuilderNavItem, type BuilderSiteSettings, type BuilderTheme } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';

const AUTOSAVE_DEBOUNCE_MS = 1000;
const NETWORK_ERROR_MESSAGE = '네트워크 오류, 다시 시도해주세요';

export interface DraftMeta {
  revision: number;
  savedAt: string;
  updatedBy?: string;
}

export interface DraftConflict {
  revision: number;
  savedAt?: string;
}

interface DraftResponseBody {
  draft?: DraftMeta;
  document?: BuilderCanvasDocument;
  snapshot?: { document?: BuilderCanvasDocument };
}

type ToastOptions = {
  actionLabel?: string;
  onAction?: () => void;
  ttlMs?: number;
};

async function fetchSiteDraft(
  pageId: string,
  locale: Locale,
): Promise<{ draft: DraftMeta | null; document: BuilderCanvasDocument | null } | null> {
  const response = await fetch(
    `/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?locale=${locale}`,
    { credentials: 'same-origin' },
  );
  if (!response.ok) return null;
  const data = (await response.json()) as DraftResponseBody;
  const document = data.snapshot?.document ?? data.document ?? null;
  const draft = data.draft ?? (document ? { revision: 0, savedAt: document.updatedAt } : null);
  return { draft, document };
}

export function useSandboxSiteState({
  initialDocument,
  locale,
  initialPageId,
  siteSettings,
  siteTheme,
  navItems,
  currentSlug,
  sitePages,
  canvasDocument,
  mutationBaseDocument,
  replaceDocument,
  setDraftSaveState,
  pushToast,
  onMissingHeaderPage,
}: {
  initialDocument: BuilderCanvasDocument;
  locale: Locale;
  initialPageId?: string;
  siteSettings?: BuilderSiteSettings;
  siteTheme?: BuilderTheme;
  navItems?: BuilderNavItem[];
  currentSlug?: string;
  sitePages?: BuilderPageSummary[];
  canvasDocument: BuilderCanvasDocument | null;
  mutationBaseDocument: BuilderCanvasDocument | null;
  replaceDocument: (document: BuilderCanvasDocument) => void;
  setDraftSaveState: (state: 'idle' | 'saving' | 'saved' | 'error') => void;
  pushToast: (message: string, tone: 'success' | 'error', options?: ToastOptions) => void;
  onMissingHeaderPage?: () => void;
}) {
  const initialDraftLoadedRef = useRef(false);
  const activePageIdRef = useRef<string | null>(initialPageId ?? null);
  const localeRef = useRef(locale);
  const [syncedUpdatedAt, setSyncedUpdatedAt] = useState(initialDocument.updatedAt);
  const [draftMeta, setDraftMeta] = useState<DraftMeta | null>(null);
  const [draftConflict, setDraftConflict] = useState<DraftConflict | null>(null);
  const [activePageId, setActivePageId] = useState<string | null>(initialPageId ?? null);
  const [siteSettingsState, setSiteSettingsState] = useState<BuilderSiteSettings | undefined>(siteSettings);
  const [siteThemeState, setSiteThemeState] = useState<BuilderTheme>(siteTheme ?? DEFAULT_THEME);
  const [navItemsState, setNavItemsState] = useState<BuilderNavItem[]>(navItems ?? []);
  const [sitePagesState, setSitePagesState] = useState<BuilderPageSummary[]>(sitePages ?? []);
  const [columnPostsSummary, setColumnPostsSummary] = useState<ColumnPostsSummary>({
    loading: true,
    total: null,
    posts: [],
    error: null,
  });
  const [columnsPageLookupPending, setColumnsPageLookupPending] = useState(false);
  const [currentSlugState, setCurrentSlugState] = useState(currentSlug ?? '');
  const [saveBlockReason, setSaveBlockReason] = useState<string | null>(null);

  useEffect(() => {
    activePageIdRef.current = activePageId;
  }, [activePageId]);

  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  useEffect(() => {
    replaceDocument(initialDocument);
    setSyncedUpdatedAt(initialDocument.updatedAt);
  }, [initialDocument, replaceDocument]);

  const loadDraft = useCallback(
    async (pageId: string, nextLocale: Locale): Promise<boolean> => {
      const payload = await fetchSiteDraft(pageId, nextLocale);
      if (!payload?.document) return false;
      if (activePageIdRef.current !== pageId || localeRef.current !== nextLocale) return false;
      replaceDocument(payload.document);
      setSyncedUpdatedAt(payload.document.updatedAt);
      setDraftMeta(payload.draft);
      setDraftConflict(null);
      setDraftSaveState('idle');
      setSaveBlockReason(null);
      return true;
    },
    [replaceDocument, setDraftSaveState],
  );

  useEffect(() => {
    if (!activePageId || initialDraftLoadedRef.current) return;
    initialDraftLoadedRef.current = true;
    void loadDraft(activePageId, locale);
  }, [activePageId, loadDraft, locale]);

  useEffect(() => {
    setSiteSettingsState(siteSettings);
  }, [siteSettings]);

  useEffect(() => {
    setSiteThemeState(siteTheme ?? DEFAULT_THEME);
  }, [siteTheme]);

  useEffect(() => {
    setNavItemsState(navItems ?? []);
  }, [navItems]);

  useEffect(() => {
    setSitePagesState(sitePages ?? []);
  }, [sitePages]);

  useEffect(() => {
    let cancelled = false;
    setColumnPostsSummary((state) => ({ ...state, loading: true, error: null }));
    const params = new URLSearchParams({
      locale,
      scope: 'all',
      limit: '5',
    });

    fetch(`/api/builder/blog/posts?${params.toString()}`, { credentials: 'same-origin' })
      .then((response) => response.json())
      .then((payload: unknown) => {
        if (cancelled) return;
        if (!payload || typeof payload !== 'object') throw new Error('invalid_response');
        const result = payload as {
          ok?: boolean;
          total?: number;
          error?: string;
          posts?: Array<{ slug?: string; title?: string }>;
        };
        if (!result.ok || !Array.isArray(result.posts)) {
          throw new Error(result.error || 'columns_unavailable');
        }

        setColumnPostsSummary({
          loading: false,
          total: typeof result.total === 'number' ? result.total : result.posts.length,
          posts: result.posts
            .filter((post): post is { slug: string; title: string } => Boolean(post.slug && post.title))
            .map((post) => ({ slug: post.slug, title: post.title })),
          error: null,
        });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setColumnPostsSummary({
          loading: false,
          total: null,
          posts: [],
          error: error instanceof Error ? error.message : 'columns_unavailable',
        });
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  useEffect(() => {
    setCurrentSlugState(currentSlug ?? '');
  }, [currentSlug]);

  const saveDraftDocument = useCallback(
    async (nextDocument: BuilderCanvasDocument): Promise<boolean> => {
      if (!activePageId) {
        const response = await fetch(`/api/builder/sandbox/draft?locale=${locale}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ document: nextDocument }),
        });
        if (!response.ok) return false;
        setSyncedUpdatedAt(nextDocument.updatedAt);
        setDraftSaveState('saved');
        setSaveBlockReason(null);
        return true;
      }

      const putDraft = (expectedRevision: number | undefined) =>
        fetch(`/api/builder/site/pages/${activePageId}/draft?locale=${locale}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ expectedRevision, document: nextDocument }),
        });

      let response = await putDraft(draftMeta?.revision);

      if (response.status === 428) {
        const latest = await fetchSiteDraft(activePageId, locale);
        if (!latest?.draft) return false;
        setDraftMeta(latest.draft);
        response = await putDraft(latest.draft.revision);
      }

      if (response.status === 409) {
        const data = (await response.json().catch(() => ({}))) as {
          current?: { revision?: number; savedAt?: string };
        };
        const currentRevision = data.current?.revision;
        if (typeof currentRevision === 'number') {
          const current = {
            revision: currentRevision,
            savedAt: data.current?.savedAt,
          };
          setDraftMeta({
            revision: current.revision,
            savedAt: current.savedAt ?? draftMeta?.savedAt ?? new Date().toISOString(),
          });
          setDraftConflict(current);
        } else {
          setDraftConflict({ revision: draftMeta?.revision ?? 0 });
        }
        setDraftSaveState('error');
        pushToast('Draft conflict — 다른 탭에서 저장됨', 'error');
        return false;
      }

      if (response.status === 401 || response.status === 403) {
        const reason = '로그인이 만료되어 저장할 수 없습니다. 다시 로그인한 뒤 시도해주세요.';
        setSaveBlockReason(reason);
        setDraftSaveState('error');
        pushToast(reason, 'error', { ttlMs: 7000 });
        return false;
      }

      if (response.status >= 500) {
        const reason = '서버 오류로 저장을 멈췄습니다. 잠시 후 다시 시도해주세요.';
        setSaveBlockReason(reason);
        setDraftSaveState('error');
        pushToast(reason, 'error', { ttlMs: 8000 });
        return false;
      }

      if (!response.ok) return false;

      const data = (await response.json()) as DraftResponseBody;
      if (data.draft) setDraftMeta(data.draft);
      setSyncedUpdatedAt(data.document?.updatedAt ?? nextDocument.updatedAt);
      setDraftConflict(null);
      setDraftSaveState('saved');
      setSaveBlockReason(null);
      return true;
    },
    [activePageId, draftMeta?.revision, draftMeta?.savedAt, locale, pushToast, setDraftSaveState],
  );

  useEffect(() => {
    if (!canvasDocument) return undefined;
    if (mutationBaseDocument) return undefined;
    if (draftConflict) return undefined;
    if (saveBlockReason) return undefined;
    if (canvasDocument.updatedAt === syncedUpdatedAt) return undefined;

    setDraftSaveState('saving');
    const timer = window.setTimeout(async () => {
      try {
        const saved = await saveDraftDocument(canvasDocument);
        if (!saved) setDraftSaveState('error');
      } catch {
        setDraftSaveState('error');
        pushToast(NETWORK_ERROR_MESSAGE, 'error', {
          actionLabel: '다시 시도',
          ttlMs: 8000,
          onAction: () => {
            setDraftSaveState('saving');
            void saveDraftDocument(canvasDocument).catch(() => {
              setDraftSaveState('error');
              pushToast(NETWORK_ERROR_MESSAGE, 'error', { ttlMs: 6000 });
            });
          },
        });
      }
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [
    canvasDocument,
    draftConflict,
    mutationBaseDocument,
    saveDraftDocument,
    saveBlockReason,
    setDraftSaveState,
    pushToast,
    syncedUpdatedAt,
  ]);

  const handleLocaleChange = useCallback(async (newLocale: Locale, linkedPageId: string | null) => {
    if (linkedPageId) {
      try {
        const loaded = await loadDraft(linkedPageId, newLocale);
        if (loaded) {
          setActivePageId(linkedPageId);
          pushToast(`Switched to ${newLocale}`, 'success');
        }
      } catch {
        pushToast(NETWORK_ERROR_MESSAGE, 'error', {
          ttlMs: 8000,
        });
      }
    } else {
      pushToast(`No linked page for ${newLocale}`, 'error');
    }
  }, [loadDraft, pushToast]);

  const handleSelectPage = useCallback(async (pageId: string, nextSlug?: string) => {
    setActivePageId(pageId);
    if (typeof nextSlug === 'string') {
      setCurrentSlugState(nextSlug);
    } else {
      const matchingPage = sitePagesState.find((page) => page.pageId === pageId);
      if (matchingPage) setCurrentSlugState(matchingPage.slug);
    }
    try {
      const loaded = await loadDraft(pageId, locale);
      if (loaded) pushToast(`Loaded page: ${pageId}`, 'success');
    } catch {
      pushToast(NETWORK_ERROR_MESSAGE, 'error', {
        ttlMs: 8000,
      });
    }
  }, [loadDraft, locale, pushToast, sitePagesState]);

  const handlePagesChange = useCallback((pages: BuilderPageSummary[]) => {
    setSitePagesState(pages.map((page) => ({
      pageId: page.pageId,
      slug: page.slug,
      isHomePage: page.isHomePage,
    })));

    const active = pages.find((page) => page.pageId === activePageIdRef.current);
    if (active) setCurrentSlugState(active.slug);
  }, []);

  const refreshSitePages = useCallback(async () => {
    const response = await fetch(`/api/builder/site/pages?locale=${locale}`, { credentials: 'same-origin' });
    if (!response.ok) throw new Error(`Failed to load pages: ${response.status}`);
    const payload = (await response.json()) as { pages?: BuilderPageSummary[] };
    const pages = Array.isArray(payload.pages) ? payload.pages : [];
    handlePagesChange(pages);
    return pages;
  }, [handlePagesChange, locale]);

  const handleHeaderNavigate = useCallback((href: string) => {
    const normalizedHref = normalizeSiteHref(href, locale);
    const targetPath = comparableSitePath(normalizedHref, locale);
    const targetPage = sitePagesState.find((page) => {
      const pagePath = buildSitePagePath(locale, page.isHomePage ? '' : page.slug);
      return comparableSitePath(pagePath, locale) === targetPath;
    });

    if (targetPage) {
      void handleSelectPage(targetPage.pageId, targetPage.slug);
      return;
    }

    onMissingHeaderPage?.();
    pushToast(`No builder page for ${normalizedHref}`, 'error');
  }, [handleSelectPage, locale, onMissingHeaderPage, pushToast, sitePagesState]);

  const headerNavItems = useMemo<BuilderNavItem[]>(() => {
    const hasColumns = navItemsState.some((item) => (
      comparableSitePath(normalizeSiteHref(item.href, locale), locale) === comparableSitePath(`/${locale}/columns`, locale)
    ));
    if (hasColumns) return navItemsState;
    return [
      ...navItemsState,
      {
        id: 'nav-columns',
        pageId: 'external-columns',
        href: '/columns',
        label: { ko: '칼럼', 'zh-hant': '專欄', en: 'Columns' },
      },
    ];
  }, [locale, navItemsState]);

  const linkPickerSitePages = useMemo(() => {
    const pages = sitePagesState.map((page) => ({
      path: page.isHomePage ? `/${locale}` : `/${locale}/${page.slug}`,
      title: page.isHomePage ? 'Home' : page.slug,
      slug: page.slug,
    }));
    if (!pages.some((page) => page.slug === 'columns')) {
      pages.push({ path: `/${locale}/columns`, title: 'Columns', slug: 'columns' });
    }
    return pages;
  }, [sitePagesState, locale]);

  const columnsPage = sitePagesState.find((page) => page.slug === 'columns') ?? null;

  const refreshColumnsPageIfNeeded = useCallback(() => {
    if (columnsPage || columnsPageLookupPending) return;
    setColumnsPageLookupPending(true);
    refreshSitePages()
      .catch(() => pushToast(NETWORK_ERROR_MESSAGE, 'error', {
        ttlMs: 8000,
      }))
      .finally(() => setColumnsPageLookupPending(false));
  }, [columnsPage, columnsPageLookupPending, pushToast, refreshSitePages]);

  const handleOpenColumnsPage = useCallback(async (openPagesDrawer: () => void) => {
    let targetPage = columnsPage;
    if (!targetPage) {
      setColumnsPageLookupPending(true);
      try {
        const pages = await refreshSitePages();
        targetPage = pages.find((page) => page.slug === 'columns') ?? null;
      } catch {
        pushToast(NETWORK_ERROR_MESSAGE, 'error', {
          ttlMs: 8000,
        });
      } finally {
        setColumnsPageLookupPending(false);
      }
    }

    if (targetPage) {
      await handleSelectPage(targetPage.pageId, targetPage.slug);
      return;
    }

    openPagesDrawer();
    pushToast('Columns page not found. Open Pages to create or restore it.', 'error');
  }, [columnsPage, handleSelectPage, pushToast, refreshSitePages]);

  const handleReloadDraftAfterConflict = useCallback(async () => {
    if (!activePageId) return;
    const loaded = await loadDraft(activePageId, locale);
    pushToast(
      loaded ? '최신 draft를 불러왔습니다.' : '최신 draft를 불러오지 못했습니다.',
      loaded ? 'success' : 'error',
    );
  }, [activePageId, loadDraft, locale, pushToast]);

  const handlePublishDraftSaved = useCallback((nextDraftMeta: DraftMeta, savedDocument?: BuilderCanvasDocument) => {
    setDraftMeta(nextDraftMeta);
    if (savedDocument) setSyncedUpdatedAt(savedDocument.updatedAt);
    setDraftConflict(null);
  }, []);

  const handleMoveCompleted = useCallback(
    async (result: MoveToPageResult) => {
      try {
        const response = await fetch(
          `/api/builder/site/pages/${activePageId}/draft?locale=${locale}`,
          { credentials: 'same-origin' },
        );
        if (response.ok) {
          const data = (await response.json()) as DraftResponseBody;
          if (data.draft) setDraftMeta(data.draft);
          if (data.document) {
            replaceDocument(data.document);
            setSyncedUpdatedAt(data.document.updatedAt);
          }
        }
      } catch {
        // best effort: server already moved nodes; user can refresh manually
      }
      pushToast(`${result.movedCount}개 요소를 /${result.targetSlug}(으)로 이동했습니다`, 'success');
    },
    [activePageId, locale, pushToast, replaceDocument],
  );

  return {
    activePageId,
    columnPostsSummary,
    columnsPage,
    columnsPageLookupPending,
    currentSlugState,
    draftConflict,
    draftMeta,
    headerNavItems,
    linkPickerSitePages,
    navItemsState,
    saveBlockReason,
    setCurrentSlugState,
    setNavItemsState,
    setSitePagesState,
    setSiteSettingsState,
    setSiteThemeState,
    sitePagesState,
    siteSettingsState,
    siteThemeState,
    handleHeaderNavigate,
    handleLocaleChange,
    handleMoveCompleted,
    handleOpenColumnsPage,
    handlePagesChange,
    handlePublishDraftSaved,
    handleReloadDraftAfterConflict,
    handleSelectPage,
    refreshColumnsPageIfNeeded,
  };
}
