'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  type BuilderPageSummary,
  type SandboxDrawerPanel,
} from '@/components/builder/canvas/SandboxEditorRail';
import SandboxEditorWorkspace from '@/components/builder/canvas/SandboxEditorWorkspace';
import SandboxStatusBar, {
  type EditorDensity,
  type EditorThemeMode,
} from '@/components/builder/canvas/SandboxStatusBar';
import { BuilderThemeProvider } from '@/components/builder/editor/BuilderThemeContext';
import SandboxModalsRoot, {
  type ImageEditorRequest,
} from '@/components/builder/canvas/SandboxModalsRoot';
import type { SaveSectionPayload } from '@/components/builder/sections/SaveSectionModal';
import { insertSavedSection } from '@/lib/builder/sections/insertSection';
import { getCanvasNodeDescendantIds } from '@/lib/builder/canvas/tree';
import SandboxTopBar, { type ViewportMode } from '@/components/builder/canvas/SandboxTopBar';
import GoogleFontsLoader from '@/components/builder/canvas/GoogleFontsLoader';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import { type BuilderLightbox, type BuilderNavItem, type BuilderSiteSettings, type BuilderTheme, type SavedSection } from '@/lib/builder/site/types';
import { collectThemeFontFamilies } from '@/lib/builder/site/theme';
import type { Locale } from '@/lib/locales';
import { useSandboxSiteState } from './hooks/useSandboxSiteState';
import styles from './SandboxPage.module.css';

const TOAST_TTL_MS = 3000;
const SAVE_BADGE_TTL_MS = 1600;

const VIEWPORT_WIDTHS: Record<ViewportMode, number | null> = {
  desktop: null,
  tablet: 768,
  mobile: 375,
};

type PublicChromePanel = 'chat' | 'event' | null;
type ToastTone = 'success' | 'error';

interface SandboxToast {
  id: string;
  message: string;
  tone: ToastTone;
}

interface ActivityChip {
  id: string;
  message: string;
}

function getPublicChromeCopy(locale: Locale) {
  if (locale === 'zh-hant') {
    return {
      label: '公共浮動工具',
      chat: 'AI 諮詢',
      event: '2026 EVENT',
      top: '回到頂部',
      chatTitle: 'AI 諮詢',
      chatBody: '此浮動入口會在正式網站右下角顯示，連接公開 AI 諮詢視窗。',
      eventTitle: '2026年紀念評論活動',
      eventBody: '正式網站首次造訪時顯示的評論活動彈窗。',
      editSettings: '網站設定',
      editColumns: '專欄管理',
    };
  }

  if (locale === 'en') {
    return {
      label: 'Public floating tools',
      chat: 'AI Chat',
      event: '2026 EVENT',
      top: 'Back to top',
      chatTitle: 'AI Chat',
      chatBody: 'This floating entry appears on the public site and opens the AI consultation chat.',
      eventTitle: '2026 Commemorative Review Event',
      eventBody: 'The public event popup shown to first-time visitors before they dismiss it.',
      editSettings: 'Site settings',
      editColumns: 'Columns',
    };
  }

  return {
    label: '공개 사이트 플로팅 도구',
    chat: 'AI 상담',
    event: '2026 EVENT',
    top: '상단',
    chatTitle: 'AI 상담',
    chatBody: '실제 사이트 우측 하단에 뜨는 공개 AI 상담 진입 버튼입니다.',
    eventTitle: '2026년 기념 리뷰 이벤트',
    eventBody: '방문자에게 표시되는 리뷰 이벤트 팝업입니다.',
    editSettings: '사이트 설정',
    editColumns: '칼럼 관리',
  };
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
    document: canvasDocument,
    selectedNodeId,
    selectedNodeIds,
    draftSaveState,
    clipboardCount,
    mutationBaseDocument,
    replaceDocument,
    pasteClipboardNodes,
    setDraftSaveState,
    updateNode,
    updateNodeContent,
    setViewport: setStoreViewport,
  } = useBuilderCanvasStore();
  const [assetLibraryNodeId, setAssetLibraryNodeId] = useState<string | null>(null);
  const [imageEditorRequest, setImageEditorRequest] = useState<ImageEditorRequest>(null);
  const [toasts, setToasts] = useState<SandboxToast[]>([]);
  const [activityChips, setActivityChips] = useState<ActivityChip[]>([]);
  const previousDraftSaveStateRef = useRef(draftSaveState);
  const saveBadgeTimerRef = useRef<number | null>(null);
  const canvasColumnRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [publishOpen, setPublishOpen] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<SandboxDrawerPanel | null>(null);
  const [publicChromePanel, setPublicChromePanel] = useState<PublicChromePanel>(null);
  const [activeNavItemId, setActiveNavItemId] = useState<string | null>(null);
  const [focusedNavItemId, setFocusedNavItemId] = useState<string | null>(null);
  const [addNavChildParentId, setAddNavChildParentId] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [editorDensity, setEditorDensity] = useState<EditorDensity>('cozy');
  const [editorThemeMode, setEditorThemeMode] = useState<EditorThemeMode>('light');
  const [movePickerNodeIds, setMovePickerNodeIds] = useState<string[] | null>(null);
  const [saveSectionPayload, setSaveSectionPayload] = useState<SaveSectionPayload | null>(null);
  const childrenMap = useBuilderCanvasStore((state) => state.childrenMap);
  const addNodes = useBuilderCanvasStore((state) => state.addNodes);
  const publicChromeCopy = useMemo(() => getPublicChromeCopy(locale), [locale]);

  useEffect(() => {
    const pageDocument = window.document;
    const previousBodyOverflow = pageDocument.body.style.overflow;
    const previousBodyOverscroll = pageDocument.body.style.overscrollBehavior;
    const previousHtmlOverflow = pageDocument.documentElement.style.overflow;
    const previousScrollRestoration = window.history.scrollRestoration;
    window.scrollTo({ top: 0, left: 0 });
    pageDocument.body.style.overflow = 'hidden';
    pageDocument.body.style.overscrollBehavior = 'none';
    pageDocument.documentElement.style.overflow = 'hidden';
    window.history.scrollRestoration = 'manual';

    return () => {
      pageDocument.body.style.overflow = previousBodyOverflow;
      pageDocument.body.style.overscrollBehavior = previousBodyOverscroll;
      pageDocument.documentElement.style.overflow = previousHtmlOverflow;
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  useEffect(() => {
    try {
      const savedDensity = window.localStorage.getItem('builder:editor-density') as EditorDensity | null;
      const savedTheme = window.localStorage.getItem('builder:editor-theme') as EditorThemeMode | null;
      if (savedDensity === 'compact' || savedDensity === 'cozy' || savedDensity === 'comfortable') {
        setEditorDensity(savedDensity);
      }
      if (savedTheme === 'light' || savedTheme === 'dark') {
        setEditorThemeMode(savedTheme);
      }
    } catch {
      // localStorage is optional in private or restricted browser contexts.
    }
  }, []);

  const updateEditorDensity = useCallback((density: EditorDensity) => {
    setEditorDensity(density);
    try {
      window.localStorage.setItem('builder:editor-density', density);
    } catch {
      // best effort
    }
  }, []);

  const updateEditorThemeMode = useCallback((mode: EditorThemeMode) => {
    setEditorThemeMode(mode);
    try {
      window.localStorage.setItem('builder:editor-theme', mode);
    } catch {
      // best effort
    }
  }, []);

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

  const {
    activePageId,
    columnPostsSummary,
    columnsPageLookupPending,
    currentSlugState,
    draftConflict,
    draftMeta,
    headerNavItems,
    linkPickerSitePages,
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
  } = useSandboxSiteState({
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
    onMissingHeaderPage: () => setActiveDrawer('pages'),
  });

  const handlePagesPanelPaste = useCallback(() => {
    const state = useBuilderCanvasStore.getState();
    if (state.clipboardCount <= 0) return;
    pasteClipboardNodes();
    const pastedCount = state.clipboardCount;
    pushActivityChip(`Pasted ${pastedCount} item${pastedCount === 1 ? '' : 's'}`);
  }, [pasteClipboardNodes, pushActivityChip]);

  useEffect(() => {
    if (activeDrawer !== 'pages') return undefined;

    function handlePagesPasteShortcut(event: KeyboardEvent) {
      const target = event.target;
      const isTypingTarget = target instanceof HTMLElement
        && (
          target.tagName === 'INPUT'
          || target.tagName === 'TEXTAREA'
          || target.tagName === 'SELECT'
          || target.isContentEditable
        );
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (isTypingTarget || !(event.metaKey || event.ctrlKey) || event.shiftKey || key !== 'v') return;
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      handlePagesPanelPaste();
    }

    window.addEventListener('keydown', handlePagesPasteShortcut, true);
    return () => window.removeEventListener('keydown', handlePagesPasteShortcut, true);
  }, [activeDrawer, handlePagesPanelPaste]);

  useEffect(() => {
    setStoreViewport(viewport);
  }, [viewport, setStoreViewport]);

  useEffect(() => {
    const column = canvasColumnRef.current;
    if (!column) return;
    column.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [activePageId, currentSlugState]);

  const selectedNode = useMemo(
    () => canvasDocument?.nodes.find((node) => node.id === selectedNodeId) ?? null,
    [canvasDocument, selectedNodeId],
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
  const assetLibraryNode = useMemo(
    () => canvasDocument?.nodes.find((node) => node.id === assetLibraryNodeId) ?? null,
    [assetLibraryNodeId, canvasDocument],
  );
  const imageEditorNode = useMemo(
    () => canvasDocument?.nodes.find((node) => node.id === imageEditorRequest?.nodeId) ?? null,
    [imageEditorRequest?.nodeId, canvasDocument],
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

  const handleEditorFooterLinkActivation = useCallback((event: {
    target: EventTarget | null;
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    const target = event.target;
    if (!(target instanceof Element) || !target.closest('a[href]')) return;
    event.preventDefault();
    event.stopPropagation();
    setActiveDrawer('nav');
    pushToast('Footer links stay in the editor. Use Navigation to edit them.', 'error');
  }, [pushToast]);

  const viewportWidth = VIEWPORT_WIDTHS[viewport];

  const toggleDrawer = useCallback((panel: SandboxDrawerPanel) => {
    setActiveDrawer((current) => (current === panel ? null : panel));
  }, []);

  useEffect(() => {
    if (activeDrawer === 'nav') return;
    setActiveNavItemId(null);
    setFocusedNavItemId(null);
    setAddNavChildParentId(null);
  }, [activeDrawer]);

  const handleRequestEditNavItem = useCallback((itemId: string) => {
    setActiveDrawer('nav');
    setActiveNavItemId(itemId);
    setFocusedNavItemId(itemId);
  }, []);

  const handleRequestAddNavChild = useCallback((parentItemId: string) => {
    setActiveDrawer('nav');
    setActiveNavItemId(parentItemId);
    setFocusedNavItemId(parentItemId);
    setAddNavChildParentId(parentItemId);
  }, []);

  const handleRequestSaveAsSection = useCallback(
    (rootNodeId: string) => {
      const allNodes = canvasDocument?.nodes ?? [];
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
    [childrenMap, canvasDocument?.nodes, pushToast],
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
        display: 'flex',
        flex: '0 0 auto',
        flexDirection: 'column',
        minHeight: 'max(640px, calc(100vh - var(--editor-topbar-h, 32px) - var(--editor-statusbar-h, 28px) - 60px))',
        transition: 'width 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      }
    : {
        width: 'min(100%, 1280px)',
        margin: '0 auto',
        position: 'relative',
        display: 'flex',
        flex: '0 0 auto',
        flexDirection: 'column',
        minHeight: 'max(640px, calc(100vh - var(--editor-topbar-h, 32px) - var(--editor-statusbar-h, 28px) - 60px))',
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
        overflowX: 'auto',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
      }
    : {
        flex: 1,
        minWidth: 0,
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'auto',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
        background: '#f8fafc',
      };

  const handleOpenColumnsPanel = useCallback(() => {
    setActiveDrawer((current) => (current === 'columns' ? null : 'columns'));
  }, []);

  useEffect(() => {
    if (activeDrawer === 'columns') refreshColumnsPageIfNeeded();
  }, [activeDrawer, refreshColumnsPageIfNeeded]);

  return (
    <BuilderThemeProvider value={siteThemeState}>
      <main
        className={styles.shell}
        data-editor-shell
        data-editor-density={editorDensity}
        data-editor-theme={editorThemeMode}
      >
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

        <SandboxEditorWorkspace
          locale={locale}
          activeDrawer={activeDrawer}
          activePageId={activePageId}
          clipboardCount={clipboardCount}
          columnPostsSummary={columnPostsSummary}
          columnsPageLookupPending={columnsPageLookupPending}
          document={canvasDocument}
          selectedNode={selectedNode}
          focusedNavItemId={focusedNavItemId}
          addNavChildParentId={addNavChildParentId}
          siteName={siteName}
          siteSettings={siteSettingsState}
          siteTheme={siteThemeState}
          headerNavItems={headerNavItems}
          currentSlug={currentSlugState}
          activeNavItemId={activeNavItemId}
          viewportWidth={viewportWidth}
          canvasOuterStyle={canvasOuterStyle}
          canvasWrapperStyle={canvasWrapperStyle}
          canvasColumnRef={canvasColumnRef}
          publicChromeCopy={publicChromeCopy}
          publicChromePanel={publicChromePanel}
          linkPickerLightboxes={linkPickerLightboxes}
          linkPickerSitePages={linkPickerSitePages}
          onToggleDrawer={toggleDrawer}
          onOpenColumnsPanel={handleOpenColumnsPanel}
          onOpenColumnsPage={() => { void handleOpenColumnsPage(() => setActiveDrawer('pages')); }}
          onOpenSettings={() => setSettingsOpen(true)}
          onOpenHistory={() => setHistoryOpen(true)}
          onSetActiveDrawer={setActiveDrawer}
          onSelectPage={handleSelectPage}
          onPagesChange={handlePagesChange}
          onNavigationChange={setNavItemsState}
          onNavFocusHandled={() => setFocusedNavItemId(null)}
          onNavAddChildHandled={() => setAddNavChildParentId(null)}
          onUpdateNodeContent={updateNodeContent}
          onHeaderNavigate={handleHeaderNavigate}
          onRequestEditNavItem={handleRequestEditNavItem}
          onRequestAddNavChild={handleRequestAddNavChild}
          onFooterLinkActivation={handleEditorFooterLinkActivation}
          onSetPublicChromePanel={setPublicChromePanel}
          onRequestAssetLibrary={setAssetLibraryNodeId}
          onRequestImageEditor={setImageEditorRequest}
          onRequestMoveToPage={setMovePickerNodeIds}
          onRequestSaveAsSection={handleRequestSaveAsSection}
          onRequestInsertSavedSection={(sectionId, position) => {
            void handleInsertSavedSection(sectionId, position);
          }}
          onToast={pushToast}
          onActivity={pushActivityChip}
        />

        <SandboxModalsRoot
          locale={locale}
          document={canvasDocument}
          siteName={siteName}
          currentSlug={currentSlugState}
          viewport={viewport}
          activePageId={activePageId}
          draftMeta={draftMeta}
          sitePages={sitePagesState.map((page) => ({
            pageId: page.pageId,
            slug: page.slug,
            isHomePage: page.isHomePage,
          }))}
          assetLibraryNode={assetLibraryNode}
          imageEditorNode={imageEditorNode}
          imageEditorRequest={imageEditorRequest}
          publishOpen={publishOpen}
          seoOpen={seoOpen}
          settingsOpen={settingsOpen}
          historyOpen={historyOpen}
          helpOpen={helpOpen}
          previewOpen={previewOpen}
          saveSectionPayload={saveSectionPayload}
          movePickerNodeIds={movePickerNodeIds}
          onCloseAssetLibrary={() => setAssetLibraryNodeId(null)}
          onSelectAsset={(nodeId, url) => updateNodeContent(nodeId, { src: url })}
          onCloseImageEditor={() => setImageEditorRequest(null)}
          onApplyImageEdit={(nodeId, content) => {
            updateNode(nodeId, (node) => ({
              ...node,
              content: {
                ...node.content,
                ...content,
              },
            } as typeof node));
          }}
          onClosePublish={() => setPublishOpen(false)}
          onDraftSaved={handlePublishDraftSaved}
          onCloseSeo={() => setSeoOpen(false)}
          onSeoSaved={(page) => {
            setCurrentSlugState(page.slug);
            setSitePagesState((pages) => pages.map((entry) => (
              entry.pageId === page.pageId ? { ...entry, slug: page.slug } : entry
            )));
          }}
          onCloseSettings={() => setSettingsOpen(false)}
          onSettingsSaved={({ settings, theme }) => {
            setSiteSettingsState(settings);
            setSiteThemeState(theme);
          }}
          onCloseHistory={() => setHistoryOpen(false)}
          onCloseHelp={() => setHelpOpen(false)}
          onClosePreview={() => setPreviewOpen(false)}
          onCloseSaveSection={() => setSaveSectionPayload(null)}
          onSectionSaved={(section) => {
            pushToast(`"${section.name}" 섹션을 저장했습니다.`, 'success');
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('builder:saved-section-changed'));
            }
          }}
          onCloseMovePicker={() => setMovePickerNodeIds(null)}
          onMoveCompleted={handleMoveCompleted}
          onToast={pushToast}
        />

        <div className={styles.lowerLeftChipStack} aria-live="polite" aria-atomic="false">
          {draftSaveState !== 'idle' ? (
            <div
              className={`${styles.saveStatusChip} ${styles[`saveStatusChip${draftSaveState[0].toUpperCase()}${draftSaveState.slice(1)}` as keyof typeof styles]}`}
              data-save-status-chip={draftSaveState}
            >
              <span className={styles.saveStatusGlyph} data-save-status-glyph aria-hidden="true" />
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
        <SandboxStatusBar
          viewport={viewport}
          draftSaveState={draftSaveState}
          selectionCount={selectedNodeIds.length}
          density={editorDensity}
          themeMode={editorThemeMode}
          onDensityChange={updateEditorDensity}
          onThemeModeChange={updateEditorThemeMode}
        />
      </main>
    </BuilderThemeProvider>
  );
}
