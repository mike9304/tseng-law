'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AssetLibraryModal from '@/components/builder/editor/AssetLibraryModal';
import CanvasContainer from '@/components/builder/canvas/CanvasContainer';
import NavigationEditor from '@/components/builder/canvas/NavigationEditor';
import PageSwitcher from '@/components/builder/canvas/PageSwitcher';
import PreviewModal from '@/components/builder/canvas/PreviewModal';
import PublishModal from '@/components/builder/canvas/PublishModal';
import SandboxCatalogPanel from '@/components/builder/canvas/SandboxCatalogPanel';
import SandboxInspectorPanel from '@/components/builder/canvas/SandboxInspectorPanel';
import SandboxLayersPanel from '@/components/builder/canvas/SandboxLayersPanel';
import { BuilderThemeProvider } from '@/components/builder/editor/BuilderThemeContext';
import SeoPanel from '@/components/builder/canvas/SeoPanel';
import ShortcutsHelpModal from '@/components/builder/canvas/ShortcutsHelpModal';
import MoveToPageModal from '@/components/builder/canvas/MoveToPageModal';
import SaveSectionModal, { type SaveSectionPayload } from '@/components/builder/sections/SaveSectionModal';
import { insertSavedSection } from '@/lib/builder/sections/insertSection';
import { getCanvasNodeDescendantIds } from '@/lib/builder/canvas/tree';
import SandboxTopBar, { type ViewportMode } from '@/components/builder/canvas/SandboxTopBar';
import SiteSettingsModal from '@/components/builder/canvas/SiteSettingsModal';
import VersionHistoryPanel from '@/components/builder/canvas/VersionHistoryPanel';
import GoogleFontsLoader from '@/components/builder/canvas/GoogleFontsLoader';
import ImageEditDialog from '@/components/builder/canvas/ImageEditDialog';
import SiteHeader from '@/components/builder/published/SiteHeader';
import SiteFooter from '@/components/builder/published/SiteFooter';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { buildSitePagePath, comparableSitePath, normalizeSiteHref } from '@/lib/builder/site/paths';
import { DEFAULT_THEME, type BuilderLightbox, type BuilderNavItem, type BuilderSiteSettings, type BuilderTheme, type SavedSection } from '@/lib/builder/site/types';
import { collectThemeFontFamilies } from '@/lib/builder/site/theme';
import type { Locale } from '@/lib/locales';
import styles from './SandboxPage.module.css';

const AUTOSAVE_DEBOUNCE_MS = 1000;
const TOAST_TTL_MS = 3000;
const SAVE_BADGE_TTL_MS = 1600;

const VIEWPORT_WIDTHS: Record<ViewportMode, number | null> = {
  desktop: null,
  tablet: 768,
  mobile: 375,
};

type SandboxDrawerPanel = 'pages' | 'add' | 'design' | 'layers' | 'nav' | 'history';
type BuilderPageSummary = {
  pageId: string;
  slug: string;
  isHomePage?: boolean;
};

type ToastTone = 'success' | 'error';

interface DraftMeta {
  revision: number;
  savedAt: string;
  updatedBy?: string;
}

interface DraftConflict {
  revision: number;
  savedAt?: string;
}

interface SandboxToast {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ActivityChip {
  id: string;
  message: string;
}

interface DraftResponseBody {
  draft?: DraftMeta;
  document?: BuilderCanvasDocument;
  snapshot?: { document?: BuilderCanvasDocument };
}

const conflictBannerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '10px 16px',
  borderBottom: '1px solid #fecaca',
  background: '#fef2f2',
  color: '#991b1b',
  fontSize: '0.84rem',
  fontWeight: 600,
};

const conflictReloadButtonStyle: React.CSSProperties = {
  flexShrink: 0,
  border: '1px solid #991b1b',
  borderRadius: 6,
  background: '#fff',
  color: '#991b1b',
  cursor: 'pointer',
  fontSize: '0.78rem',
  fontWeight: 700,
  padding: '6px 10px',
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

export default function SandboxPage({
  initialDocument,
  locale,
  initialPageId,
  siteName,
  siteSettings,
  siteTheme,
  navItems,
  currentSlug,
  sitePages,
  siteLightboxes = [],
}: {
  initialDocument: BuilderCanvasDocument;
  locale: Locale;
  backend: 'blob' | 'file';
  initialPageId?: string;
  siteName?: string;
  siteSettings?: BuilderSiteSettings;
  siteTheme?: BuilderTheme;
  navItems?: BuilderNavItem[];
  currentSlug?: string;
  sitePages?: BuilderPageSummary[];
  siteLightboxes?: BuilderLightbox[];
}) {
  const {
    document,
    selectedNodeId,
    selectedNodeIds,
    draftSaveState,
    clipboardCount,
    mutationBaseDocument,
    replaceDocument,
    setDraftSaveState,
    updateNodeContent,
    setViewport: setStoreViewport,
  } = useBuilderCanvasStore();
  const [assetLibraryNodeId, setAssetLibraryNodeId] = useState<string | null>(null);
  const [imageEditorNodeId, setImageEditorNodeId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<SandboxToast[]>([]);
  const [activityChips, setActivityChips] = useState<ActivityChip[]>([]);
  const previousDraftSaveStateRef = useRef(draftSaveState);
  const saveBadgeTimerRef = useRef<number | null>(null);
  const initialDraftLoadedRef = useRef(false);
  const [syncedUpdatedAt, setSyncedUpdatedAt] = useState(initialDocument.updatedAt);
  const [draftMeta, setDraftMeta] = useState<DraftMeta | null>(null);
  const [draftConflict, setDraftConflict] = useState<DraftConflict | null>(null);
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [publishOpen, setPublishOpen] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const [activePageId, setActivePageId] = useState<string | null>(initialPageId ?? null);
  const [siteSettingsState, setSiteSettingsState] = useState<BuilderSiteSettings | undefined>(siteSettings);
  const [siteThemeState, setSiteThemeState] = useState<BuilderTheme>(siteTheme ?? DEFAULT_THEME);
  const [sitePagesState, setSitePagesState] = useState<BuilderPageSummary[]>(sitePages ?? []);
  const [currentSlugState, setCurrentSlugState] = useState(currentSlug ?? '');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<SandboxDrawerPanel | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [movePickerNodeIds, setMovePickerNodeIds] = useState<string[] | null>(null);
  const [saveSectionPayload, setSaveSectionPayload] = useState<SaveSectionPayload | null>(null);
  const childrenMap = useBuilderCanvasStore((state) => state.childrenMap);
  const addNodes = useBuilderCanvasStore((state) => state.addNodes);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => setHelpOpen((prev) => !prev);
    window.document.addEventListener('builder:show-help', handler);
    return () => window.document.removeEventListener('builder:show-help', handler);
  }, []);

  const pushToast = useCallback((message: string, tone: ToastTone) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((currentToasts) => [...currentToasts, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
    }, TOAST_TTL_MS);
  }, []);

  const pushActivityChip = useCallback((message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setActivityChips((currentChips) => [...currentChips, { id, message }].slice(-3));
    window.setTimeout(() => {
      setActivityChips((currentChips) => currentChips.filter((chip) => chip.id !== id));
    }, 1800);
  }, []);

  useEffect(() => {
    replaceDocument(initialDocument);
    setSyncedUpdatedAt(initialDocument.updatedAt);
  }, [initialDocument, replaceDocument]);

  const loadDraft = useCallback(
    async (pageId: string, nextLocale: Locale): Promise<boolean> => {
      const payload = await fetchSiteDraft(pageId, nextLocale);
      if (!payload?.document) return false;
      replaceDocument(payload.document);
      setSyncedUpdatedAt(payload.document.updatedAt);
      setDraftMeta(payload.draft);
      setDraftConflict(null);
      setDraftSaveState('idle');
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
    setStoreViewport(viewport);
  }, [viewport, setStoreViewport]);

  useEffect(() => {
    setSiteSettingsState(siteSettings);
  }, [siteSettings]);

  useEffect(() => {
    setSiteThemeState(siteTheme ?? DEFAULT_THEME);
  }, [siteTheme]);

  useEffect(() => {
    setSitePagesState(sitePages ?? []);
  }, [sitePages]);

  useEffect(() => {
    setCurrentSlugState(currentSlug ?? '');
  }, [currentSlug]);

  const saveDraftDocument = useCallback(
    async (nextDocument: BuilderCanvasDocument): Promise<boolean> => {
      if (!activePageId) {
        const response = await fetch(`/api/builder/sandbox/draft?locale=${locale}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({ document: nextDocument }),
        });
        if (!response.ok) return false;
        setSyncedUpdatedAt(nextDocument.updatedAt);
        setDraftSaveState('saved');
        return true;
      }

      const putDraft = (expectedRevision: number | undefined) =>
        fetch(`/api/builder/site/pages/${activePageId}/draft?locale=${locale}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({
            expectedRevision,
            document: nextDocument,
          }),
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

      if (!response.ok) return false;

      const data = (await response.json()) as DraftResponseBody;
      if (data.draft) setDraftMeta(data.draft);
      if (data.document) {
        setSyncedUpdatedAt(data.document.updatedAt);
      } else {
        setSyncedUpdatedAt(nextDocument.updatedAt);
      }
      setDraftConflict(null);
      setDraftSaveState('saved');
      return true;
    },
    [activePageId, draftMeta?.revision, draftMeta?.savedAt, locale, pushToast, setDraftSaveState],
  );

  useEffect(() => {
    if (!document) return undefined;
    if (mutationBaseDocument) return undefined;
    if (draftConflict) return undefined;
    if (document.updatedAt === syncedUpdatedAt) return undefined;

    if (saveBadgeTimerRef.current) {
      window.clearTimeout(saveBadgeTimerRef.current);
      saveBadgeTimerRef.current = null;
    }
    setDraftSaveState('saving');
    const timer = window.setTimeout(async () => {
      try {
        const saved = await saveDraftDocument(document);
        if (!saved) {
          setDraftSaveState('error');
        }
      } catch {
        setDraftSaveState('error');
      }
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [
    document,
    draftConflict,
    mutationBaseDocument,
    saveDraftDocument,
    setDraftSaveState,
    syncedUpdatedAt,
  ]);

  const selectedNode = useMemo(
    () => document?.nodes.find((node) => node.id === selectedNodeId) ?? null,
    [document, selectedNodeId],
  );
  const linkPickerLightboxes = useMemo(
    () =>
      siteLightboxes
        .filter((lightbox) => lightbox.locale === locale)
        .map((lightbox) => ({
          id: lightbox.id,
          slug: lightbox.slug,
          name: lightbox.name,
        })),
    [locale, siteLightboxes],
  );
  const linkPickerSitePages = useMemo(
    () =>
      sitePagesState.map((page) => ({
        path: page.isHomePage ? `/${locale}` : `/${locale}/${page.slug}`,
        title: page.isHomePage ? 'Home' : page.slug,
        slug: page.slug,
      })),
    [sitePagesState, locale],
  );
  const hasSelection = selectedNodeIds.length > 0;
  const assetLibraryNode = useMemo(
    () => document?.nodes.find((node) => node.id === assetLibraryNodeId) ?? null,
    [assetLibraryNodeId, document],
  );
  const imageEditorNode = useMemo(
    () => document?.nodes.find((node) => node.id === imageEditorNodeId) ?? null,
    [imageEditorNodeId, document],
  );

  useEffect(() => {
    if (assetLibraryNode?.kind !== 'image') {
      setAssetLibraryNodeId(null);
    }
  }, [assetLibraryNode?.kind, assetLibraryNodeId]);

  useEffect(() => {
    const previousState = previousDraftSaveStateRef.current;
    if (draftSaveState === previousState) return;

    if (saveBadgeTimerRef.current) {
      window.clearTimeout(saveBadgeTimerRef.current);
      saveBadgeTimerRef.current = null;
    }

    if (draftSaveState === 'saved') {
      saveBadgeTimerRef.current = window.setTimeout(() => {
        setDraftSaveState('idle');
        saveBadgeTimerRef.current = null;
      }, SAVE_BADGE_TTL_MS);
    }
    if (draftSaveState === 'error') {
      saveBadgeTimerRef.current = window.setTimeout(() => {
        setDraftSaveState('idle');
        saveBadgeTimerRef.current = null;
      }, SAVE_BADGE_TTL_MS);
    }
    previousDraftSaveStateRef.current = draftSaveState;
  }, [draftSaveState, setDraftSaveState]);

  useEffect(() => () => {
    if (saveBadgeTimerRef.current) {
      window.clearTimeout(saveBadgeTimerRef.current);
    }
  }, []);

  const handleLocaleChange = useCallback(async (newLocale: Locale, linkedPageId: string | null) => {
    if (linkedPageId) {
      try {
        const loaded = await loadDraft(linkedPageId, newLocale);
        if (loaded) {
          setActivePageId(linkedPageId);
          pushToast(`Switched to ${newLocale}`, 'success');
        }
      } catch {
        pushToast('Failed to switch locale', 'error');
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
      if (matchingPage) {
        setCurrentSlugState(matchingPage.slug);
      }
    }
    try {
      const loaded = await loadDraft(pageId, locale);
      if (loaded) {
        pushToast(`Loaded page: ${pageId}`, 'success');
      }
    } catch {
      pushToast('Failed to load page', 'error');
    }
  }, [loadDraft, locale, pushToast, sitePagesState]);

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

    window.location.href = normalizedHref;
  }, [handleSelectPage, locale, sitePagesState]);

  const viewportWidth = VIEWPORT_WIDTHS[viewport];

  const toggleDrawer = useCallback((panel: SandboxDrawerPanel) => {
    setActiveDrawer((current) => (current === panel ? null : panel));
  }, []);

  const handleRequestSaveAsSection = useCallback(
    (rootNodeId: string) => {
      const allNodes = document?.nodes ?? [];
      const rootNode = allNodes.find((node) => node.id === rootNodeId);
      if (!rootNode) {
        pushToast('선택한 컨테이너를 찾을 수 없습니다.', 'error');
        return;
      }
      const descendantIds = getCanvasNodeDescendantIds(rootNodeId, childrenMap);
      const collected = [rootNode, ...allNodes.filter((node) => descendantIds.includes(node.id))];
      const snapshot = collected.map((node) =>
        node.id === rootNodeId ? { ...node, parentId: undefined } : node,
      );
      setSaveSectionPayload({
        rootNodeId,
        nodes: snapshot,
      });
    },
    [childrenMap, document?.nodes, pushToast],
  );

  const handleInsertSavedSection = useCallback(
    async (sectionId: string, position: { x: number; y: number }) => {
      try {
        const response = await fetch(
          `/api/builder/site/section-library/${sectionId}?locale=${encodeURIComponent(locale)}`,
          { credentials: 'same-origin' },
        );
        if (!response.ok) {
          pushToast('섹션을 불러오지 못했습니다.', 'error');
          return;
        }
        const data = (await response.json()) as { ok: boolean; section?: SavedSection };
        if (!data.ok || !data.section) {
          pushToast('섹션 데이터가 올바르지 않습니다.', 'error');
          return;
        }
        const result = insertSavedSection(data.section, position);
        if (result.nodes.length === 0) {
          pushToast('섹션을 삽입할 수 없습니다.', 'error');
          return;
        }
        addNodes(result.nodes, result.rootNodeId);
        pushToast(`"${data.section.name}" 섹션을 추가했습니다.`, 'success');
        void fetch(
          `/api/builder/site/section-library/${sectionId}?locale=${encodeURIComponent(locale)}`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({ incrementUsage: true }),
          },
        ).catch(() => undefined);
      } catch (error) {
        const message = error instanceof Error ? error.message : '섹션 추가 오류';
        pushToast(message, 'error');
      }
    },
    [addNodes, locale, pushToast],
  );

  const canvasWrapperStyle: React.CSSProperties = viewportWidth
    ? {
        width: viewportWidth,
        margin: '0 auto',
        position: 'relative',
        transition: 'width 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      }
    : {
        width: '100%',
        position: 'relative',
        transition: 'width 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      };

  const canvasOuterStyle: React.CSSProperties = viewportWidth
    ? {
        flex: 1,
        minWidth: 0,
        background: '#e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'auto',
      }
    : {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
        background: '#f8fafc',
      };

  const handleReloadDraftAfterConflict = useCallback(async () => {
    if (!activePageId) return;
    const loaded = await loadDraft(activePageId, locale);
    if (loaded) {
      pushToast('최신 draft를 불러왔습니다.', 'success');
    } else {
      pushToast('최신 draft를 불러오지 못했습니다.', 'error');
    }
  }, [activePageId, loadDraft, locale, pushToast]);

  const handlePublishDraftSaved = useCallback(
    (nextDraftMeta: DraftMeta, savedDocument?: BuilderCanvasDocument) => {
      setDraftMeta(nextDraftMeta);
      if (savedDocument) {
        setSyncedUpdatedAt(savedDocument.updatedAt);
      }
      setDraftConflict(null);
    },
    [],
  );

  return (
    <BuilderThemeProvider value={siteThemeState}>
      <main className={styles.shell}>
        <GoogleFontsLoader extraFamilies={collectThemeFontFamilies(siteThemeState)} />
        <SandboxTopBar
        locale={locale}
        draftSaveState={draftSaveState}
        selectedSummary={
          selectedNodeIds.length > 1
            ? `${selectedNodeIds.length} nodes`
            : selectedNode
              ? `${selectedNode.kind} · ${selectedNode.id}`
              : 'none'
        }
        selectionCount={selectedNodeIds.length}
        viewport={viewport}
        onViewportChange={setViewport}
        onPublish={() => setPublishOpen(true)}
        onOpenSeo={() => setSeoOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenHistory={() => setHistoryOpen(true)}
        onOpenPreview={() => setPreviewOpen(true)}
        onOpenPages={() => setActiveDrawer('pages')}
        activePageId={activePageId}
        onLocaleChange={handleLocaleChange}
        siteName={siteName}
        currentSlug={currentSlugState}
      />

        {draftConflict ? (
          <div style={conflictBannerStyle} role="alert">
            <span>
              Conflict — 다른 탭에서 저장됨. 새로고침해서 최신본을 가져오거나, 변경사항을 다른 곳에 백업한 뒤 reload 하세요.
            </span>
            <button
              type="button"
              style={conflictReloadButtonStyle}
              onClick={handleReloadDraftAfterConflict}
            >
              새로고침
            </button>
          </div>
        ) : null}

        <section className={styles.editorShell}>
        <div className={styles.iconRail}>
          <button
            type="button"
            className={`${styles.railButton} ${activeDrawer === 'pages' ? styles.railButtonActive : ''}`}
            onClick={() => toggleDrawer('pages')}
            aria-pressed={activeDrawer === 'pages'}
            title="Pages"
          >
            <span className={styles.railButtonIcon} aria-hidden="true">▤</span>
            <span className={styles.railButtonLabel}>Pages</span>
          </button>
          <button
            type="button"
            className={`${styles.railButton} ${activeDrawer === 'add' ? styles.railButtonActive : ''}`}
            onClick={() => toggleDrawer('add')}
            aria-pressed={activeDrawer === 'add'}
            title="Add"
          >
            <span className={styles.railButtonIcon} aria-hidden="true">+</span>
            <span className={styles.railButtonLabel}>Add</span>
          </button>
          <button
            type="button"
            className={`${styles.railButton} ${activeDrawer === 'design' ? styles.railButtonActive : ''}`}
            onClick={() => toggleDrawer('design')}
            aria-pressed={activeDrawer === 'design'}
            title="Design"
          >
            <span className={styles.railButtonIcon} aria-hidden="true">◇</span>
            <span className={styles.railButtonLabel}>Design</span>
          </button>
          <button
            type="button"
            className={`${styles.railButton} ${activeDrawer === 'layers' ? styles.railButtonActive : ''}`}
            onClick={() => toggleDrawer('layers')}
            aria-pressed={activeDrawer === 'layers'}
            title="Layers"
          >
            <span className={styles.railButtonIcon} aria-hidden="true">☰</span>
            <span className={styles.railButtonLabel}>Layers</span>
          </button>
          <button
            type="button"
            className={`${styles.railButton} ${activeDrawer === 'nav' ? styles.railButtonActive : ''}`}
            onClick={() => toggleDrawer('nav')}
            aria-pressed={activeDrawer === 'nav'}
            title="Navigation"
          >
            <span className={styles.railButtonIcon} aria-hidden="true">↗</span>
            <span className={styles.railButtonLabel}>Navigation</span>
          </button>
          <button
            type="button"
            className={`${styles.railButton} ${activeDrawer === 'history' ? styles.railButtonActive : ''}`}
            onClick={() => toggleDrawer('history')}
            aria-pressed={activeDrawer === 'history'}
            title="History"
          >
            <span className={styles.railButtonIcon} aria-hidden="true">↺</span>
            <span className={styles.railButtonLabel}>History</span>
          </button>
        </div>

        <aside
          className={`${styles.drawer} ${!activeDrawer ? styles.drawerHidden : ''}`}
          aria-hidden={!activeDrawer}
        >
          {activeDrawer === 'pages' ? (
            <div className={styles.drawerBody}>
              <PageSwitcher
                locale={locale}
                activePageId={activePageId}
                clipboardCount={clipboardCount}
                onSelectPage={handleSelectPage}
              />
            </div>
          ) : null}

          {activeDrawer === 'add' ? (
            <div className={styles.drawerBody}>
              <SandboxCatalogPanel locale={locale} />
            </div>
          ) : null}

          {activeDrawer === 'design' ? (
            <div className={styles.drawerBody}>
              <section className={styles.panelSection}>
                <header className={styles.panelSectionHeader}>
                  <div>
                    <span>Design</span>
                    <strong>Site settings</strong>
                  </div>
                  <button
                    type="button"
                    className={styles.panelHeaderButton}
                    onClick={() => setSettingsOpen(true)}
                  >
                    Open
                  </button>
                </header>
                <p className={styles.panelCopy}>
                  브랜드, 연락처, 로고, 파비콘 같은 site-level design 설정은 modal에서 편집합니다.
                </p>
              </section>
            </div>
          ) : null}

          {activeDrawer === 'layers' ? (
            <div className={styles.drawerBody}>
              <SandboxLayersPanel />
            </div>
          ) : null}

          {activeDrawer === 'nav' ? (
            <div className={styles.drawerBody}>
              <NavigationEditor locale={locale} />
            </div>
          ) : null}

          {activeDrawer === 'history' ? (
            <div className={styles.drawerBody}>
              <section className={styles.panelSection}>
                <header className={styles.panelSectionHeader}>
                  <div>
                    <span>History</span>
                    <strong>Version history</strong>
                  </div>
                  <button
                    type="button"
                    className={styles.panelHeaderButton}
                    onClick={() => setHistoryOpen(true)}
                  >
                    Open
                  </button>
                </header>
                <p className={styles.panelCopy}>
                  revision timeline과 restore는 existing history modal에서 확인합니다.
                </p>
              </section>
            </div>
          ) : null}
        </aside>

        <div className={styles.canvasColumn} style={canvasOuterStyle}>
          {siteName ? (
            <div style={{ width: viewportWidth ?? '100%', maxWidth: 1280, background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
              <SiteHeader
                siteName={siteName}
                settings={siteSettingsState}
                theme={siteThemeState}
                navItems={navItems || []}
                locale={locale}
                currentSlug={currentSlugState}
                onNavigate={handleHeaderNavigate}
              />
            </div>
          ) : null}
          <div style={{ ...canvasWrapperStyle, flex: '0 0 auto', minHeight: document?.stageHeight ?? 880 }}>
            <CanvasContainer
              onRequestAssetLibrary={setAssetLibraryNodeId}
              onRequestImageEditor={setImageEditorNodeId}
              onRequestMoveToPage={(nodeIds) => setMovePickerNodeIds(nodeIds)}
              onRequestSaveAsSection={handleRequestSaveAsSection}
              onRequestInsertSavedSection={(sectionId, position) => {
                void handleInsertSavedSection(sectionId, position);
              }}
              onToast={pushToast}
              onActivity={pushActivityChip}
              siteLightboxes={linkPickerLightboxes}
              sitePages={linkPickerSitePages}
            />
          </div>
          {siteName ? (
            <div style={{ width: viewportWidth ?? '100%', maxWidth: 1280, background: '#fff', borderTop: '1px solid #e5e7eb' }}>
              <SiteFooter
                siteName={siteName}
                settings={siteSettingsState}
                theme={siteThemeState}
                navItems={navItems || []}
                locale={locale}
              />
            </div>
          ) : null}
        </div>
        <div className={`${styles.inspectorColumn} ${!hasSelection ? styles.inspectorHidden : ''}`}>
          {hasSelection ? (
            <SandboxInspectorPanel
              onRequestAssetLibrary={() => {
                if (selectedNode?.kind === 'image') {
                  setAssetLibraryNodeId(selectedNode.id);
                }
              }}
              onRequestImageEditor={() => {
                if (selectedNode?.kind === 'image') {
                  setImageEditorNodeId(selectedNode.id);
                }
              }}
              siteLightboxes={linkPickerLightboxes}
              sitePages={linkPickerSitePages}
            />
          ) : null}
        </div>
        </section>

        {assetLibraryNode?.kind === 'image' ? (
          <AssetLibraryModal
            open
            locale={locale}
            selectedUrl={assetLibraryNode.content.src}
            onClose={() => setAssetLibraryNodeId(null)}
            onSelect={(asset) => {
              updateNodeContent(assetLibraryNode.id, { src: asset.url });
              setAssetLibraryNodeId(null);
            }}
          />
        ) : null}

        {imageEditorNode?.kind === 'image' ? (
          <ImageEditDialog
            open
            imageSrc={String(imageEditorNode.content.src || '')}
            alt={String(imageEditorNode.content.alt || '')}
            cropAspect={typeof imageEditorNode.content.cropAspect === 'string' ? imageEditorNode.content.cropAspect : 'Free'}
            filters={imageEditorNode.content.filters}
            onClose={() => setImageEditorNodeId(null)}
            onApply={(content) => {
              updateNodeContent(imageEditorNode.id, content);
              setImageEditorNodeId(null);
            }}
          />
        ) : null}

        <PublishModal
          open={publishOpen}
          document={document}
          locale={locale}
          activePageId={activePageId}
          draftMeta={draftMeta}
          onDraftSaved={handlePublishDraftSaved}
          onToast={pushToast}
          onClose={() => setPublishOpen(false)}
        />

        <SeoPanel
          open={seoOpen}
          pageId={activePageId ?? ''}
          locale={locale}
          onClose={() => setSeoOpen(false)}
        />

        <SiteSettingsModal
          open={settingsOpen}
          locale={locale}
          onSaved={({ settings, theme }) => {
            setSiteSettingsState(settings);
            setSiteThemeState(theme);
          }}
          onClose={() => setSettingsOpen(false)}
        />

        <VersionHistoryPanel
          open={historyOpen}
          pageId={activePageId ?? ''}
          siteId="default"
          draftMeta={draftMeta}
          onClose={() => setHistoryOpen(false)}
        />

        {helpOpen ? <ShortcutsHelpModal onClose={() => setHelpOpen(false)} /> : null}

        <PreviewModal
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
          previewUrl={previewOpen ? buildSitePagePath(locale, currentSlugState ?? '') : null}
          initialDevice={viewport === 'mobile' ? 'mobile' : viewport === 'tablet' ? 'tablet' : 'desktop'}
        />

        {saveSectionPayload ? (
          <SaveSectionModal
            payload={saveSectionPayload}
            locale={locale}
            onClose={() => setSaveSectionPayload(null)}
            onSaved={(section) => {
              setSaveSectionPayload(null);
              pushToast(`"${section.name}" 섹션을 저장했습니다.`, 'success');
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('builder:saved-section-changed'));
              }
            }}
          />
        ) : null}

        {movePickerNodeIds && activePageId ? (
          <MoveToPageModal
            pages={sitePagesState.map((page) => ({
              pageId: page.pageId,
              slug: page.slug,
              isHomePage: page.isHomePage,
            }))}
            currentPageId={activePageId}
            sourceNodeIds={movePickerNodeIds}
            locale={locale}
            onClose={() => setMovePickerNodeIds(null)}
            onMoved={async (result) => {
              setMovePickerNodeIds(null);
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
              pushToast(
                `${result.movedCount}개 요소를 /${result.targetSlug}(으)로 이동했습니다`,
                'success',
              );
            }}
          />
        ) : null}

        <div className={styles.lowerLeftChipStack} aria-live="polite" aria-atomic="false">
          {draftSaveState !== 'idle' ? (
            <div className={`${styles.saveStatusChip} ${styles[`saveStatusChip${draftSaveState[0].toUpperCase()}${draftSaveState.slice(1)}` as keyof typeof styles]}`}>
              <span className={styles.saveStatusGlyph} aria-hidden="true" />
              <strong>
                {draftSaveState === 'saving'
                  ? 'Saving…'
                  : draftSaveState === 'saved'
                    ? 'Saved'
                    : 'Save failed'}
              </strong>
            </div>
          ) : null}
          {activityChips.map((chip) => (
            <div key={chip.id} className={styles.activityChip}>
              {chip.message}
            </div>
          ))}
        </div>

        <div className={styles.toastStack} aria-live="polite" aria-atomic="true">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`${styles.toast} ${toast.tone === 'error' ? styles.toastError : styles.toastSuccess}`}
            >
              {toast.message}
            </div>
          ))}
        </div>
      </main>
    </BuilderThemeProvider>
  );
}
