'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { filterVisiblePageSwitcherPages } from '@/components/builder/canvas/PageSwitcher.helpers';
import type { BuilderPageSummary, ColumnPostsSummary } from '@/components/builder/canvas/SandboxEditorRail';
import type { MoveToPageResult } from '@/components/builder/canvas/SandboxModalsRoot';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { DECOMPOSABLE_PAGE_SLUGS } from '@/lib/builder/canvas/decomposable-slugs';
import { createBuilderDynamicListCanvasDocument } from '@/lib/builder/dynamic-list-pages';
import { buildSitePagePath, comparableSitePath, normalizeSiteHref } from '@/lib/builder/site/paths';
import { resolveBuilderSiteSettings } from '@/lib/builder/site/localized-settings';
import { DEFAULT_THEME, type BuilderNavItem, type BuilderSiteSettings, type BuilderTheme } from '@/lib/builder/site/types';
import type { Locale } from '@/lib/locales';

const AUTOSAVE_DEBOUNCE_MS = 1000;
const NETWORK_ERROR_MESSAGE = '네트워크 오류, 다시 시도해주세요';
const PAGE_SWITCH_SAVE_BLOCKED_MESSAGE = '현재 페이지 초안을 저장하지 못해 페이지 전환을 멈췄습니다.';

function siteScopedQuery(locale: Locale | string, siteId: string): string {
  return new URLSearchParams({ locale, siteId }).toString();
}

interface LoadDraftOptions {
  skipIfEditedSinceRequest?: boolean;
  slug?: string;
}

type ReplaceDocumentResult = 'applied' | 'same' | 'skipped-local-history';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

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
  draft?: DraftMeta | null;
  document?: BuilderCanvasDocument;
  snapshot?: { document?: BuilderCanvasDocument };
}

interface CreatePageResponseBody {
  success?: boolean;
  pageId?: string;
  page?: BuilderPageSummary;
  error?: string;
  message?: string;
}

type MissingExpectedRevisionSaveResolution =
  | {
      status: 'accept-saved';
      draft: DraftMeta;
      document: BuilderCanvasDocument;
    }
  | {
      status: 'conflict';
      draft: DraftMeta;
    }
  | {
      status: 'missing';
    };

type ToastOptions = {
  actionLabel?: string;
  onAction?: () => void;
  ttlMs?: number;
};

async function fetchSiteDraft(
  pageId: string,
  locale: Locale,
  siteId: string,
): Promise<{ draft: DraftMeta | null; document: BuilderCanvasDocument | null } | null> {
  const response = await fetch(
    `/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?${siteScopedQuery(locale, siteId)}`,
    { credentials: 'same-origin' },
  );
  if (!response.ok) return null;
  const data = (await response.json()) as DraftResponseBody;
  const document = data.snapshot?.document ?? data.document ?? null;
  const draft = data.draft ?? (document ? { revision: 0, savedAt: document.updatedAt } : null);
  return { draft, document };
}

const AUTO_DECOMPOSE_STANDARD_SLUGS = new Set<string>(
  DECOMPOSABLE_PAGE_SLUGS.filter((slug) => slug !== '' && slug !== 'faq'),
);

function normalizeDraftSlug(slug: string | undefined): string {
  return slug?.trim().replace(/^\/+|\/+$/g, '') ?? '';
}

function isDecomposablePageSlug(slug: string): boolean {
  return DECOMPOSABLE_PAGE_SLUGS.some((candidate) => candidate === slug);
}

function hasCompositeContentOverrides(node: BuilderCanvasDocument['nodes'][number]): boolean {
  if (node.kind !== 'composite') return false;
  const overrides = node.content.config?.overrides;
  return (
    !!overrides
    && typeof overrides === 'object'
    && !Array.isArray(overrides)
    && Object.keys(overrides).length > 0
  );
}

function hasCompositeOverrides(document: BuilderCanvasDocument): boolean {
  return document.nodes.some(hasCompositeContentOverrides);
}

export function shouldAutoDecomposeStandardPageDraft(
  document: BuilderCanvasDocument,
  slug: string | undefined,
): boolean {
  const normalizedSlug = normalizeDraftSlug(slug);
  if (!AUTO_DECOMPOSE_STANDARD_SLUGS.has(normalizedSlug)) return false;
  return isStandardPageLiveCompositeDraft(document, normalizedSlug);
}

function isStandardPageLiveCompositeDraft(
  document: BuilderCanvasDocument,
  normalizedSlug: string,
): boolean {
  if (document.nodes.length !== 2) return false;
  if (hasCompositeOverrides(document)) return false;

  const composites = document.nodes.filter((node) => node.kind === 'composite');
  if (composites.length !== 1) return false;
  const [composite] = composites;
  if (!composite || composite.kind !== 'composite') return false;

  return composite.content.componentKey === `legacy-page-${normalizedSlug}`;
}

export function shouldOfferDecomposeCurrentPage(
  document: BuilderCanvasDocument,
  slug: string | undefined,
): boolean {
  const normalizedSlug = normalizeDraftSlug(slug);
  if (!isDecomposablePageSlug(normalizedSlug)) return false;
  if (hasCompositeOverrides(document)) return false;
  if (shouldAutoDecomposeStandardPageDraft(document, normalizedSlug)) return true;
  if (normalizedSlug !== '') return isStandardPageLiveCompositeDraft(document, normalizedSlug);
  if (document.nodes.some((node) => node.id === 'home-hero-root')) return false;
  return document.nodes.some((node) => node.kind === 'composite');
}

async function decomposeStandardPageDraft(slug: string, locale: Locale, siteId: string): Promise<boolean> {
  const response = await fetch(
    `/api/builder/site/pages/decompose?${siteScopedQuery(locale, siteId)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ siteId, slug, locale }),
    },
  );
  return response.ok;
}

function areCanvasDocumentsSame(left: BuilderCanvasDocument, right: BuilderCanvasDocument): boolean {
  if (left === right) return true;
  return (
    left.version === right.version
    && left.locale === right.locale
    && left.updatedAt === right.updatedAt
    && left.updatedBy === right.updatedBy
    && left.stageWidth === right.stageWidth
    && left.stageHeight === right.stageHeight
    && JSON.stringify(left.nodes) === JSON.stringify(right.nodes)
  );
}

function areDraftMetasSame(left: DraftMeta | null | undefined, right: DraftMeta | null | undefined): boolean {
  if (!left || !right) return false;
  return (
    left.revision === right.revision
    && left.savedAt === right.savedAt
    && left.updatedBy === right.updatedBy
  );
}

export function shouldKeepInitialDocumentForInitialDraftLoad({
  activePageId,
  fetchedDocument,
  fetchedDraft,
  initialDocument,
  initialDraft,
  initialPageId,
}: {
  activePageId: string | null;
  fetchedDocument: BuilderCanvasDocument;
  fetchedDraft: DraftMeta | null | undefined;
  initialDocument: BuilderCanvasDocument;
  initialDraft: DraftMeta | null | undefined;
  initialPageId: string | null;
}): boolean {
  if (activePageId !== initialPageId) return false;
  if (!areDraftMetasSame(fetchedDraft, initialDraft)) return false;
  return !areCanvasDocumentsSame(fetchedDocument, initialDocument);
}

export function areDraftDocumentsEquivalentForStaleRevision(
  left: BuilderCanvasDocument,
  right: BuilderCanvasDocument,
): boolean {
  if (left === right) return true;
  return (
    left.version === right.version
    && left.locale === right.locale
    && left.updatedAt === right.updatedAt
    && left.stageWidth === right.stageWidth
    && left.stageHeight === right.stageHeight
    && JSON.stringify(left.nodes) === JSON.stringify(right.nodes)
  );
}

export function resolveMissingExpectedRevisionDraftSave(
  latest: { draft: DraftMeta | null; document: BuilderCanvasDocument | null } | null,
  nextDocument: BuilderCanvasDocument,
): MissingExpectedRevisionSaveResolution {
  if (!latest?.draft) return { status: 'missing' };
  if (
    latest.document
    && areDraftDocumentsEquivalentForStaleRevision(latest.document, nextDocument)
  ) {
    return {
      status: 'accept-saved',
      draft: latest.draft,
      document: latest.document,
    };
  }
  return {
    status: 'conflict',
    draft: latest.draft,
  };
}

async function isSiteDraftMissing(pageId: string, locale: Locale, siteId: string): Promise<boolean> {
  const response = await fetch(
    `/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?${siteScopedQuery(locale, siteId)}`,
    { credentials: 'same-origin' },
  );
  return response.status === 404;
}

function columnsPageTitle(locale: Locale): string {
  if (locale === 'zh-hant') return '昊鼎專欄';
  if (locale === 'en') return 'Columns';
  return '호정칼럼';
}

export function useSandboxSiteState({
  initialDocument,
  initialDraftMeta,
  locale,
  siteId,
  initialPageId,
  siteSettings,
  siteTheme,
  navItems,
  currentSlug,
  sitePages,
  canvasDocument,
  hasLocalHistory,
  mutationBaseDocument,
  replaceDocument,
  setDraftSaveState,
  pushToast,
  onMissingHeaderPage,
}: {
  initialDocument: BuilderCanvasDocument;
  initialDraftMeta?: DraftMeta | null;
  locale: Locale;
  siteId: string;
  initialPageId?: string;
  siteSettings?: BuilderSiteSettings;
  siteTheme?: BuilderTheme;
  navItems?: BuilderNavItem[];
  currentSlug?: string;
  sitePages?: BuilderPageSummary[];
  canvasDocument: BuilderCanvasDocument | null;
  hasLocalHistory: boolean;
  mutationBaseDocument: BuilderCanvasDocument | null;
  replaceDocument: (document: BuilderCanvasDocument, options?: { preserveSelection?: boolean }) => void;
  setDraftSaveState: (state: 'idle' | 'saving' | 'saved' | 'error') => void;
  pushToast: (message: string, tone: 'success' | 'error', options?: ToastOptions) => void;
  onMissingHeaderPage?: (href: string) => void;
}) {
  const initialDraftLoadedRef = useRef(false);
  const activePageIdRef = useRef<string | null>(initialPageId ?? null);
  const initialPageIdRef = useRef<string | null>(initialPageId ?? null);
  const localeRef = useRef(locale);
  const canvasDocumentRef = useRef<BuilderCanvasDocument | null>(canvasDocument);
  const hasLocalHistoryRef = useRef(hasLocalHistory);
  const autosaveTimerRef = useRef<number | null>(null);
  const [syncedUpdatedAt, setSyncedUpdatedAt] = useState(initialDocument.updatedAt);
  const [draftMeta, setDraftMetaState] = useState<DraftMeta | null>(initialDraftMeta ?? null);
  const draftMetaRef = useRef<DraftMeta | null>(initialDraftMeta ?? null);
  const setDraftMeta = useCallback((nextDraftMeta: DraftMeta | null) => {
    draftMetaRef.current = nextDraftMeta;
    setDraftMetaState(nextDraftMeta);
  }, []);
  const [draftConflict, setDraftConflict] = useState<DraftConflict | null>(null);
  const [activePageId, setActivePageId] = useState<string | null>(initialPageId ?? null);
  const [siteSettingsState, setSiteSettingsState] = useState<BuilderSiteSettings | undefined>(siteSettings);
  const [siteThemeState, setSiteThemeState] = useState<BuilderTheme>(siteTheme ?? DEFAULT_THEME);
  const [navItemsState, setNavItemsState] = useState<BuilderNavItem[]>(navItems ?? []);
  const [sitePagesState, setSitePagesState] = useState<BuilderPageSummary[]>(() => (
    filterVisiblePageSwitcherPages(sitePages ?? [])
  ));
  const [columnPostsSummary, setColumnPostsSummary] = useState<ColumnPostsSummary>({
    loading: true,
    total: null,
    posts: [],
    error: null,
  });
  const [columnsPageLookupPending, setColumnsPageLookupPending] = useState(false);
  const [currentSlugState, setCurrentSlugState] = useState(currentSlug ?? '');
  const [saveBlockReason, setSaveBlockReason] = useState<string | null>(null);
  const canDecomposeCurrentPage = useMemo(
    () => shouldOfferDecomposeCurrentPage(canvasDocument ?? initialDocument, currentSlugState),
    [canvasDocument, currentSlugState, initialDocument],
  );

  useEffect(() => {
    activePageIdRef.current = activePageId;
  }, [activePageId]);

  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  useEffect(() => {
    canvasDocumentRef.current = canvasDocument;
  }, [canvasDocument]);

  useEffect(() => {
    hasLocalHistoryRef.current = hasLocalHistory;
  }, [hasLocalHistory]);

  const replaceDocumentIfChanged = useCallback(
    (
      nextDocument: BuilderCanvasDocument,
      options: {
        preserveSelection?: boolean;
        resetSelectionWhenSame?: boolean;
        skipWhenLocalHistory?: boolean;
      } = {},
    ): ReplaceDocumentResult => {
      const currentDocument = canvasDocumentRef.current;
      if (currentDocument && options.skipWhenLocalHistory && hasLocalHistoryRef.current) {
        return 'skipped-local-history';
      }
      if (currentDocument && areCanvasDocumentsSame(currentDocument, nextDocument)) {
        if (options.resetSelectionWhenSame) {
          replaceDocument(nextDocument);
          return 'applied';
        }
        return 'same';
      }
      replaceDocument(nextDocument, { preserveSelection: options.preserveSelection });
      return 'applied';
    },
    [replaceDocument],
  );

  useIsomorphicLayoutEffect(() => {
    const nextInitialPageId = initialPageId ?? null;
    const pageChanged = initialPageIdRef.current !== nextInitialPageId;
    initialPageIdRef.current = nextInitialPageId;
    if (pageChanged) {
      // Client-side navigation can swap searchParams.pageId without remounting
      // this component; activePageId must follow or autosave keeps PUTting the
      // new page's document onto the previous pageId.
      activePageIdRef.current = nextInitialPageId;
      setActivePageId(nextInitialPageId);
    }
    setDraftMeta(initialDraftMeta ?? null);
    const result = replaceDocumentIfChanged(initialDocument, {
      resetSelectionWhenSame: true,
      skipWhenLocalHistory: !pageChanged,
    });
    if (result !== 'skipped-local-history') {
      setSyncedUpdatedAt(initialDocument.updatedAt);
    }
  }, [initialDocument, initialDraftMeta, initialPageId, replaceDocumentIfChanged, setDraftMeta]);

  const loadDraft = useCallback(
    async (pageId: string, nextLocale: Locale, options: LoadDraftOptions = {}): Promise<boolean> => {
      const requestDocumentUpdatedAt = canvasDocumentRef.current?.updatedAt ?? initialDocument.updatedAt;
      const requestHadLocalHistory = hasLocalHistoryRef.current;
      let payload = await fetchSiteDraft(pageId, nextLocale, siteId);
      if (!payload?.document) return false;
      let draftDocument = payload.document;
      if (activePageIdRef.current !== pageId || localeRef.current !== nextLocale) return false;
      const draftSlug = normalizeDraftSlug(options.slug);
      if (shouldAutoDecomposeStandardPageDraft(draftDocument, draftSlug)) {
        const decomposed = await decomposeStandardPageDraft(draftSlug, nextLocale, siteId);
        if (decomposed) {
          const decomposedPayload = await fetchSiteDraft(pageId, nextLocale, siteId);
          if (activePageIdRef.current !== pageId || localeRef.current !== nextLocale) return false;
          if (decomposedPayload?.document) {
            payload = decomposedPayload;
            draftDocument = decomposedPayload.document;
          }
        }
      }
      if (options.skipIfEditedSinceRequest && !requestHadLocalHistory && hasLocalHistoryRef.current) {
        return false;
      }
      if (
        options.skipIfEditedSinceRequest
        && canvasDocumentRef.current
        && canvasDocumentRef.current.updatedAt !== requestDocumentUpdatedAt
        && canvasDocumentRef.current.updatedAt !== initialDocument.updatedAt
      ) {
        return false;
      }
      if (
        options.skipIfEditedSinceRequest
        && shouldKeepInitialDocumentForInitialDraftLoad({
          activePageId: activePageIdRef.current,
          fetchedDocument: draftDocument,
          fetchedDraft: payload.draft,
          initialDocument,
          initialDraft: initialDraftMeta ?? null,
          initialPageId: initialPageIdRef.current,
        })
      ) {
        setSyncedUpdatedAt(initialDocument.updatedAt);
        setDraftMeta(payload.draft ?? initialDraftMeta ?? null);
        setDraftConflict(null);
        setDraftSaveState('idle');
        setSaveBlockReason(null);
        return true;
      }
      replaceDocumentIfChanged(draftDocument, {
        preserveSelection: options.skipIfEditedSinceRequest === true,
      });
      setSyncedUpdatedAt(draftDocument.updatedAt);
      setDraftMeta(payload.draft);
      setDraftConflict(null);
      setDraftSaveState('idle');
      setSaveBlockReason(null);
      return true;
    },
    [initialDocument, initialDraftMeta, replaceDocumentIfChanged, setDraftMeta, setDraftSaveState, siteId],
  );

  useEffect(() => {
    if (!activePageId || initialDraftLoadedRef.current) return;
    initialDraftLoadedRef.current = true;
    void loadDraft(activePageId, locale, {
      skipIfEditedSinceRequest: true,
      slug: currentSlugState,
    });
  }, [activePageId, currentSlugState, loadDraft, locale]);

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
    setSitePagesState(filterVisiblePageSwitcherPages(sitePages ?? []));
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
        fetch(`/api/builder/site/pages/${activePageId}/draft?${siteScopedQuery(locale, siteId)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ siteId, expectedRevision, document: nextDocument }),
        });

      let response = await putDraft(draftMetaRef.current?.revision);

      if (response.status === 428) {
        const latest = await fetchSiteDraft(activePageId, locale, siteId);
        const resolution = resolveMissingExpectedRevisionDraftSave(latest, nextDocument);
        if (resolution.status === 'missing') return false;
        if (resolution.status === 'accept-saved') {
          setDraftMeta(resolution.draft);
          setSyncedUpdatedAt(resolution.document.updatedAt);
          setDraftConflict(null);
          setDraftSaveState('saved');
          setSaveBlockReason(null);
          return true;
        }
        setDraftMeta(resolution.draft);
        setDraftConflict({
          revision: resolution.draft.revision,
          savedAt: resolution.draft.savedAt,
        });
        setDraftSaveState('error');
        return false;
      }

      let conflictData: {
        current?: { revision?: number; savedAt?: string };
      } | null = null;
      if (response.status === 409) {
        conflictData = (await response.json().catch(() => ({}))) as {
          current?: { revision?: number; savedAt?: string };
        };
        const currentRevision = conflictData.current?.revision;
        if (typeof currentRevision === 'number' && draftMetaRef.current?.revision === currentRevision) {
          conflictData = null;
          response = await putDraft(currentRevision);
        }
      }

      if (response.status === 409) {
        const data = conflictData ?? ((await response.json().catch(() => ({}))) as {
          current?: { revision?: number; savedAt?: string };
        });
        const currentRevision = data.current?.revision;
        if (typeof currentRevision === 'number') {
          const latest = await fetchSiteDraft(activePageId, locale, siteId);
          if (
            latest?.draft
            && latest.document
            && areDraftDocumentsEquivalentForStaleRevision(latest.document, nextDocument)
          ) {
            setDraftMeta(latest.draft);
            setSyncedUpdatedAt(latest.document.updatedAt);
            setDraftConflict(null);
            setDraftSaveState('saved');
            setSaveBlockReason(null);
            return true;
          }
          const current = {
            revision: currentRevision,
            savedAt: data.current?.savedAt,
          };
          setDraftMeta({
            revision: current.revision,
            savedAt: current.savedAt ?? draftMetaRef.current?.savedAt ?? new Date().toISOString(),
          });
          setDraftConflict(current);
        } else {
          setDraftConflict({ revision: draftMetaRef.current?.revision ?? 0 });
        }
        setDraftSaveState('error');
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
    [activePageId, locale, pushToast, setDraftMeta, setDraftSaveState, siteId],
  );

  useEffect(() => {
    if (!canvasDocument) return undefined;
    if (mutationBaseDocument) return undefined;
    if (draftConflict) return undefined;
    if (saveBlockReason) return undefined;
    if (canvasDocument.updatedAt === syncedUpdatedAt) return undefined;

    setDraftSaveState('saving');
    const timer = window.setTimeout(async () => {
      if (autosaveTimerRef.current === timer) autosaveTimerRef.current = null;
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
    autosaveTimerRef.current = timer;

    return () => {
      if (autosaveTimerRef.current === timer) autosaveTimerRef.current = null;
      window.clearTimeout(timer);
    };
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

  const persistCurrentDraftBeforeNavigation = useCallback(async (): Promise<boolean> => {
    const currentDocument = canvasDocumentRef.current;
    if (!currentDocument) return true;
    if (mutationBaseDocument) return false;
    if (draftConflict || saveBlockReason) return false;
    if (currentDocument.updatedAt === syncedUpdatedAt) return true;

    if (autosaveTimerRef.current !== null) {
      window.clearTimeout(autosaveTimerRef.current);
      autosaveTimerRef.current = null;
    }

    setDraftSaveState('saving');
    const saved = await saveDraftDocument(currentDocument);
    if (!saved) setDraftSaveState('error');
    return saved;
  }, [
    draftConflict,
    mutationBaseDocument,
    saveBlockReason,
    saveDraftDocument,
    setDraftSaveState,
    syncedUpdatedAt,
  ]);

  const handleLocaleChange = useCallback(async (newLocale: Locale, linkedPageId: string | null) => {
    if (linkedPageId) {
      try {
        const saved = await persistCurrentDraftBeforeNavigation();
        if (!saved) {
          pushToast(PAGE_SWITCH_SAVE_BLOCKED_MESSAGE, 'error', { ttlMs: 8000 });
          return;
        }
        activePageIdRef.current = linkedPageId;
        localeRef.current = newLocale;
        setActivePageId(linkedPageId);
        const loaded = await loadDraft(linkedPageId, newLocale);
        if (loaded) {
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
  }, [loadDraft, persistCurrentDraftBeforeNavigation, pushToast]);

  const handleSelectPage = useCallback(async (pageId: string, nextSlug?: string) => {
    const previousPageId = activePageIdRef.current;
    const previousSlug = currentSlugState;
    try {
      const saved = await persistCurrentDraftBeforeNavigation();
      if (!saved) {
        pushToast(PAGE_SWITCH_SAVE_BLOCKED_MESSAGE, 'error', { ttlMs: 8000 });
        return false;
      }
      activePageIdRef.current = pageId;
      setActivePageId(pageId);
      if (typeof nextSlug === 'string') {
        setCurrentSlugState(nextSlug);
      } else {
        const matchingPage = sitePagesState.find((page) => page.pageId === pageId);
        if (matchingPage) setCurrentSlugState(matchingPage.slug);
      }
      const loaded = await loadDraft(pageId, locale, { slug: nextSlug ?? sitePagesState.find((page) => page.pageId === pageId)?.slug });
      if (loaded) {
        pushToast(`Loaded page: ${pageId}`, 'success');
        return true;
      }
      if (activePageIdRef.current === pageId) {
        activePageIdRef.current = previousPageId;
        setActivePageId(previousPageId);
        setCurrentSlugState(previousSlug);
      }
      pushToast('페이지 draft를 불러오지 못했습니다. Pages에서 페이지 상태를 확인해주세요.', 'error', {
        ttlMs: 8000,
      });
      return false;
    } catch {
      if (activePageIdRef.current === pageId) {
        activePageIdRef.current = previousPageId;
        setActivePageId(previousPageId);
        setCurrentSlugState(previousSlug);
      }
      pushToast(NETWORK_ERROR_MESSAGE, 'error', {
        ttlMs: 8000,
      });
      return false;
    }
  }, [currentSlugState, loadDraft, locale, persistCurrentDraftBeforeNavigation, pushToast, sitePagesState]);

  const handleDecomposeCurrentPage = useCallback(async (): Promise<boolean> => {
    const pageId = activePageIdRef.current;
    const slug = normalizeDraftSlug(currentSlugState);
    const document = canvasDocumentRef.current ?? initialDocument;
    if (!pageId || !shouldOfferDecomposeCurrentPage(document, slug)) {
      pushToast('이 페이지는 현재 요소 편집으로 전환할 수 없습니다.', 'error', { ttlMs: 7000 });
      return false;
    }

    try {
      const saved = await persistCurrentDraftBeforeNavigation();
      if (!saved) {
        pushToast(PAGE_SWITCH_SAVE_BLOCKED_MESSAGE, 'error', { ttlMs: 8000 });
        return false;
      }
      setDraftSaveState('saving');
      const decomposed = await decomposeStandardPageDraft(slug, locale, siteId);
      if (!decomposed) {
        setDraftSaveState('error');
        pushToast('페이지를 요소 편집으로 전환하지 못했습니다.', 'error', { ttlMs: 8000 });
        return false;
      }
      const loaded = await loadDraft(pageId, locale, { slug });
      if (!loaded) {
        setDraftSaveState('error');
        pushToast('전환된 페이지 draft를 불러오지 못했습니다.', 'error', { ttlMs: 8000 });
        return false;
      }
      pushToast('페이지를 요소 편집으로 전환했습니다.', 'success');
      return true;
    } catch {
      setDraftSaveState('error');
      pushToast(NETWORK_ERROR_MESSAGE, 'error', { ttlMs: 8000 });
      return false;
    }
  }, [
    currentSlugState,
    initialDocument,
    loadDraft,
    locale,
    persistCurrentDraftBeforeNavigation,
    pushToast,
    setDraftSaveState,
    siteId,
  ]);

  const handlePagesChange = useCallback((pages: BuilderPageSummary[]) => {
    const visiblePages = filterVisiblePageSwitcherPages(pages);
    setSitePagesState(visiblePages);

    const active = visiblePages.find((page) => page.pageId === activePageIdRef.current);
    if (active) setCurrentSlugState(active.slug);
  }, []);

  const refreshSitePages = useCallback(async () => {
    const response = await fetch(`/api/builder/site/pages?${siteScopedQuery(locale, siteId)}`, { credentials: 'same-origin' });
    if (!response.ok) throw new Error(`Failed to load pages: ${response.status}`);
    const payload = (await response.json()) as { pages?: BuilderPageSummary[] };
    const pages = Array.isArray(payload.pages) ? payload.pages : [];
    handlePagesChange(pages);
    return pages;
  }, [handlePagesChange, locale, siteId]);

  const handleHeaderNavigate = useCallback((href: string) => {
    const normalizedHref = normalizeSiteHref(href, locale);
    const targetPath = comparableSitePath(normalizedHref, locale);
    const findTargetPage = (pages: typeof sitePagesState) => pages.find((page) => {
      const pagePath = buildSitePagePath(locale, page.isHomePage ? '' : page.slug);
      return comparableSitePath(pagePath, locale) === targetPath;
    });
    const targetPage = findTargetPage(sitePagesState);

    if (targetPage) {
      void handleSelectPage(targetPage.pageId, targetPage.slug);
      return;
    }

    void refreshSitePages()
      .then((pages) => {
        const refreshedTargetPage = findTargetPage(pages);
        if (refreshedTargetPage) {
          void handleSelectPage(refreshedTargetPage.pageId, refreshedTargetPage.slug);
          return;
        }
        onMissingHeaderPage?.(normalizedHref);
        pushToast(`No builder page for ${normalizedHref}`, 'error');
      })
      .catch(() => {
        onMissingHeaderPage?.(normalizedHref);
        pushToast(NETWORK_ERROR_MESSAGE, 'error', {
          ttlMs: 8000,
        });
      });
  }, [handleSelectPage, locale, onMissingHeaderPage, pushToast, refreshSitePages, sitePagesState]);

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

  const updateColumnsNavigationPageId = useCallback((pageId: string) => {
    setNavItemsState((items) => {
      const columnsPath = comparableSitePath(`/${locale}/columns`, locale);
      let updated = false;
      const nextItems = items.map((item) => {
        const itemPath = comparableSitePath(normalizeSiteHref(item.href, locale), locale);
        if (item.id !== 'nav-columns' && item.pageId !== 'external-columns' && itemPath !== columnsPath) {
          return item;
        }
        updated = true;
        return {
          ...item,
          pageId,
          href: '/columns',
          label: {
            ...(typeof item.label === 'object' ? item.label : { ko: item.label, 'zh-hant': item.label, en: item.label }),
            [locale]: columnsPageTitle(locale),
          },
        };
      });
      if (updated) return nextItems;
      return [
        ...nextItems,
        {
          id: 'nav-columns',
          pageId,
          href: '/columns',
          label: { ko: '호정칼럼', 'zh-hant': '昊鼎專欄', en: 'Columns' },
        },
      ];
    });
  }, [locale]);

  const restoreColumnsDraftIfMissing = useCallback(async (pageId: string): Promise<boolean> => {
    const missing = await isSiteDraftMissing(pageId, locale, siteId);
    if (!missing) return false;
    const document = createBuilderDynamicListCanvasDocument({ collectionId: 'columns', locale });
    const response = await fetch(`/api/builder/site/pages/${encodeURIComponent(pageId)}/draft?${siteScopedQuery(locale, siteId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ siteId, document }),
    });
    return response.ok;
  }, [locale, siteId]);

  const createColumnsBuilderPage = useCallback(async (): Promise<BuilderPageSummary | null> => {
    const response = await fetch(`/api/builder/site/pages?${siteScopedQuery(locale, siteId)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        siteId,
        locale,
        slug: 'columns',
        title: columnsPageTitle(locale),
        addToNavigation: true,
        dynamicListCollectionId: 'columns',
        dynamicListLimit: 6,
      }),
    });
    const data = (await response.json().catch(() => ({}))) as CreatePageResponseBody;
    if (!response.ok && response.status !== 409) {
      pushToast(data.message || data.error || '칼럼 페이지를 생성하지 못했습니다.', 'error', {
        ttlMs: 8000,
      });
      return null;
    }

    const pages = await refreshSitePages();
    const createdPageId = data.pageId ?? data.page?.pageId ?? null;
    const targetPage = pages.find((page) => (
      (createdPageId && page.pageId === createdPageId) || page.slug === 'columns'
    )) ?? data.page ?? null;
    if (targetPage?.pageId) {
      updateColumnsNavigationPageId(targetPage.pageId);
    }
    return targetPage;
  }, [locale, pushToast, refreshSitePages, siteId, updateColumnsNavigationPageId]);

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
        if (!targetPage) {
          targetPage = await createColumnsBuilderPage();
        }
      } catch {
        pushToast(NETWORK_ERROR_MESSAGE, 'error', {
          ttlMs: 8000,
        });
      } finally {
        setColumnsPageLookupPending(false);
      }
    }

    if (targetPage) {
      updateColumnsNavigationPageId(targetPage.pageId);
      const opened = await handleSelectPage(targetPage.pageId, targetPage.slug);
      if (opened) return true;
      try {
        const restored = await restoreColumnsDraftIfMissing(targetPage.pageId);
        if (restored) {
          pushToast('칼럼 페이지 draft를 복구했습니다.', 'success');
          return await handleSelectPage(targetPage.pageId, targetPage.slug);
        }
      } catch {
        pushToast(NETWORK_ERROR_MESSAGE, 'error', {
          ttlMs: 8000,
        });
      }
      return false;
    }

    openPagesDrawer();
    pushToast('Columns page not found. Open Pages to create or restore it.', 'error');
    return false;
  }, [
    columnsPage,
    createColumnsBuilderPage,
    handleSelectPage,
    pushToast,
    refreshSitePages,
    restoreColumnsDraftIfMissing,
    updateColumnsNavigationPageId,
  ]);

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
  }, [setDraftMeta]);

  const handleMoveCompleted = useCallback(
    async (result: MoveToPageResult) => {
      try {
        const response = await fetch(
          `/api/builder/site/pages/${activePageId}/draft?${siteScopedQuery(locale, siteId)}`,
          { credentials: 'same-origin' },
        );
        if (response.ok) {
          const data = (await response.json()) as DraftResponseBody;
          if (data.draft) setDraftMeta(data.draft);
          if (data.document) {
            replaceDocumentIfChanged(data.document);
            setSyncedUpdatedAt(data.document.updatedAt);
          }
        }
      } catch {
        // best effort: server already moved nodes; user can refresh manually
      }
      pushToast(`${result.movedCount}개 요소를 /${result.targetSlug}(으)로 이동했습니다`, 'success');
    },
    [activePageId, locale, pushToast, replaceDocumentIfChanged, setDraftMeta, siteId],
  );

  const resolvedSiteSettingsState = resolveBuilderSiteSettings(siteSettingsState, locale);

  return {
    activePageId,
    canDecomposeCurrentPage,
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
    siteSettingsState: resolvedSiteSettingsState,
    siteThemeState,
    handleHeaderNavigate,
    handleLocaleChange,
    handleDecomposeCurrentPage,
    handleMoveCompleted,
    handleOpenColumnsPage,
    handlePagesChange,
    handlePublishDraftSaved,
    handleReloadDraftAfterConflict,
    handleSelectPage,
    refreshColumnsPageIfNeeded,
  };
}
