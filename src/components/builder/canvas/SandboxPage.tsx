'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import AssetLibraryModal from '@/components/builder/editor/AssetLibraryModal';
import CanvasContainer from '@/components/builder/canvas/CanvasContainer';
import NavigationEditor from '@/components/builder/canvas/NavigationEditor';
import PageSwitcher from '@/components/builder/canvas/PageSwitcher';
import PublishModal from '@/components/builder/canvas/PublishModal';
import SandboxCatalogPanel from '@/components/builder/canvas/SandboxCatalogPanel';
import SandboxInspectorPanel from '@/components/builder/canvas/SandboxInspectorPanel';
import SandboxLayersPanel from '@/components/builder/canvas/SandboxLayersPanel';
import { BuilderThemeProvider } from '@/components/builder/editor/BuilderThemeContext';
import SeoPanel from '@/components/builder/canvas/SeoPanel';
import SandboxTopBar, { type ViewportMode } from '@/components/builder/canvas/SandboxTopBar';
import SiteSettingsModal from '@/components/builder/canvas/SiteSettingsModal';
import VersionHistoryPanel from '@/components/builder/canvas/VersionHistoryPanel';
import GoogleFontsLoader from '@/components/builder/canvas/GoogleFontsLoader';
import SiteHeader from '@/components/builder/published/SiteHeader';
import SiteFooter from '@/components/builder/published/SiteFooter';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { buildSitePagePath, comparableSitePath, normalizeSiteHref } from '@/lib/builder/site/paths';
import { DEFAULT_THEME, type BuilderNavItem, type BuilderSiteSettings, type BuilderTheme } from '@/lib/builder/site/types';
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

interface SandboxToast {
  id: string;
  message: string;
  tone: ToastTone;
}

export default function SandboxPage({
  initialDocument,
  locale,
  backend,
  initialPageId,
  siteName,
  siteSettings,
  siteTheme,
  navItems,
  currentSlug,
  sitePages,
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
}) {
  const {
    document,
    selectedNodeId,
    selectedNodeIds,
    draftSaveState,
    replaceDocument,
    setDraftSaveState,
    updateNodeContent,
  } = useBuilderCanvasStore();
  const [assetLibraryNodeId, setAssetLibraryNodeId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<SandboxToast[]>([]);
  const previousDraftSaveStateRef = useRef(draftSaveState);
  const saveBadgeTimerRef = useRef<number | null>(null);
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

  function pushToast(message: string, tone: ToastTone) {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((currentToasts) => [...currentToasts, { id, message, tone }]);
    window.setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
    }, TOAST_TTL_MS);
  }

  useEffect(() => {
    replaceDocument(initialDocument);
  }, [initialDocument, replaceDocument]);

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

  useEffect(() => {
    if (!document) return undefined;
    if (document.updatedAt === initialDocument.updatedAt) return undefined;

    if (saveBadgeTimerRef.current) {
      window.clearTimeout(saveBadgeTimerRef.current);
      saveBadgeTimerRef.current = null;
    }
    setDraftSaveState('saving');
    const timer = window.setTimeout(async () => {
      try {
        const saveUrl = activePageId
          ? `/api/builder/site/pages/${activePageId}/draft?locale=${locale}`
          : `/api/builder/sandbox/draft?locale=${locale}`;
        const response = await fetch(saveUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'same-origin',
          body: JSON.stringify({ document }),
        });
        if (!response.ok) {
          setDraftSaveState('error');
          return;
        }
        setDraftSaveState('saved');
      } catch {
        setDraftSaveState('error');
      }
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [document, initialDocument.updatedAt, locale, setDraftSaveState, activePageId]);

  const selectedNode = useMemo(
    () => document?.nodes.find((node) => node.id === selectedNodeId) ?? null,
    [document, selectedNodeId],
  );
  const hasSelection = selectedNodeIds.length > 0;
  const assetLibraryNode = useMemo(
    () => document?.nodes.find((node) => node.id === assetLibraryNodeId) ?? null,
    [assetLibraryNodeId, document],
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
      pushToast('Draft saved', 'success');
      saveBadgeTimerRef.current = window.setTimeout(() => {
        setDraftSaveState('idle');
        saveBadgeTimerRef.current = null;
      }, SAVE_BADGE_TTL_MS);
    }
    if (draftSaveState === 'error') {
      pushToast('Draft save failed', 'error');
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
      // Load the linked page's document
      try {
        const response = await fetch(
          `/api/builder/site/pages/${linkedPageId}/draft?locale=${newLocale}`,
          { credentials: 'same-origin' },
        );
        if (response.ok) {
          const data = (await response.json()) as { snapshot?: { document?: BuilderCanvasDocument }; document?: BuilderCanvasDocument };
          const doc = data.snapshot?.document || data.document;
          if (doc) {
            replaceDocument(doc);
            setActivePageId(linkedPageId);
            pushToast(`Switched to ${newLocale}`, 'success');
          }
        }
      } catch {
        pushToast('Failed to switch locale', 'error');
      }
    } else {
      pushToast(`No linked page for ${newLocale}`, 'error');
    }
  }, [replaceDocument]);

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
      const response = await fetch(
        `/api/builder/site/pages/${pageId}/draft?locale=${locale}`,
        { credentials: 'same-origin' },
      );
      if (response.ok) {
        const data = (await response.json()) as { snapshot?: { document?: BuilderCanvasDocument }; document?: BuilderCanvasDocument };
        const doc = data.snapshot?.document || data.document;
        if (doc) {
          replaceDocument(doc);
          pushToast(`Loaded page: ${pageId}`, 'success');
        }
      }
    } catch {
      pushToast('Failed to load page', 'error');
    }
  }, [locale, replaceDocument, sitePagesState]);

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

  return (
    <BuilderThemeProvider value={siteThemeState}>
      <main className={styles.shell}>
        <GoogleFontsLoader extraFamilies={collectThemeFontFamilies(siteThemeState)} />
        <SandboxTopBar
        locale={locale}
        backend={backend}
        draftSaveState={draftSaveState}
        nodeCount={document?.nodes.length ?? 0}
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
        activePageId={activePageId}
        onLocaleChange={handleLocaleChange}
      />

        <section className={styles.editorShell}>
        <div className={styles.iconRail}>
          <button
            type="button"
            className={`${styles.railButton} ${activeDrawer === 'pages' ? styles.railButtonActive : ''}`}
            onClick={() => toggleDrawer('pages')}
            aria-pressed={activeDrawer === 'pages'}
            title="Pages"
          >
            <span className={styles.railButtonIcon} aria-hidden="true">📄</span>
            <span className={styles.railButtonLabel}>Pages</span>
          </button>
          <button
            type="button"
            className={`${styles.railButton} ${activeDrawer === 'add' ? styles.railButtonActive : ''}`}
            onClick={() => toggleDrawer('add')}
            aria-pressed={activeDrawer === 'add'}
            title="Add"
          >
            <span className={styles.railButtonIcon} aria-hidden="true">➕</span>
            <span className={styles.railButtonLabel}>Add</span>
          </button>
          <button
            type="button"
            className={`${styles.railButton} ${activeDrawer === 'design' ? styles.railButtonActive : ''}`}
            onClick={() => toggleDrawer('design')}
            aria-pressed={activeDrawer === 'design'}
            title="Design"
          >
            <span className={styles.railButtonIcon} aria-hidden="true">🎨</span>
            <span className={styles.railButtonLabel}>Design</span>
          </button>
          <button
            type="button"
            className={`${styles.railButton} ${activeDrawer === 'layers' ? styles.railButtonActive : ''}`}
            onClick={() => toggleDrawer('layers')}
            aria-pressed={activeDrawer === 'layers'}
            title="Layers"
          >
            <span className={styles.railButtonIcon} aria-hidden="true">🧩</span>
            <span className={styles.railButtonLabel}>Layers</span>
          </button>
          <button
            type="button"
            className={`${styles.railButton} ${activeDrawer === 'nav' ? styles.railButtonActive : ''}`}
            onClick={() => toggleDrawer('nav')}
            aria-pressed={activeDrawer === 'nav'}
            title="Navigation"
          >
            <span className={styles.railButtonIcon} aria-hidden="true">🧭</span>
            <span className={styles.railButtonLabel}>Navigation</span>
          </button>
          <button
            type="button"
            className={`${styles.railButton} ${activeDrawer === 'history' ? styles.railButtonActive : ''}`}
            onClick={() => toggleDrawer('history')}
            aria-pressed={activeDrawer === 'history'}
            title="History"
          >
            <span className={styles.railButtonIcon} aria-hidden="true">🕘</span>
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
                onSelectPage={handleSelectPage}
              />
            </div>
          ) : null}

          {activeDrawer === 'add' ? (
            <div className={styles.drawerBody}>
              <SandboxCatalogPanel />
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
            <CanvasContainer onRequestAssetLibrary={setAssetLibraryNodeId} />
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

        <PublishModal
          open={publishOpen}
          document={document}
          locale={locale}
          activePageId={activePageId}
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
          onClose={() => setHistoryOpen(false)}
        />

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
