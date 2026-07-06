'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  type BuilderPageSummary,
  type SandboxDrawerPanel,
} from '@/components/builder/canvas/SandboxEditorRail';
import SandboxFeedbackOverlay from '@/components/builder/canvas/SandboxFeedbackOverlay';
import SandboxEditorWorkspace from '@/components/builder/canvas/SandboxEditorWorkspace';
import type { SiteHeaderMemberNavPreview } from '@/components/builder/published/SiteHeader';
import SandboxStatusBar, {
  type EditorDensity,
  type EditorThemeMode,
} from '@/components/builder/canvas/SandboxStatusBar';
import { BuilderThemeProvider } from '@/components/builder/editor/BuilderThemeContext';
import SandboxModalsRoot, {
  type ImageEditorRequest,
} from '@/components/builder/canvas/SandboxModalsRoot';
import type { CanvasCollabCursor } from '@/components/builder/canvas/CanvasCollabCursorsLayer';
import type { SaveSectionPayload } from '@/components/builder/sections/SaveSectionModal';
import type { BuilderRegisteredAppWidget } from '@/lib/builder/apps/widgets';
import { insertSavedSection } from '@/lib/builder/sections/insertSection';
import { getCanvasNodeDescendantIds } from '@/lib/builder/canvas/tree';
import SandboxTopBar, { type CollabPresenceEntry, type ViewportMode } from '@/components/builder/canvas/SandboxTopBar';
import type { MemberPreviewMode } from '@/components/builder/canvas/SandboxTopBar';
import GoogleFontsLoader from '@/components/builder/canvas/GoogleFontsLoader';
import ResponsiveAiPanel from '@/components/builder/canvas/ResponsiveAiPanel';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type {
  ResponsiveSuggestion,
  ResponsiveTargetViewport,
} from '@/lib/builder/ai-generator/responsive-rules';
import type { BuilderDataBindingPreviewTarget } from '@/lib/builder/datasets';
import type { BuilderFaqCategory, BuilderFaqItem } from '@/lib/builder/faq/faq-shared';
import {
  applyComponentDesignPresetToNodes,
  getComponentDesignPreset,
  summarizeComponentDesignTargets,
  type ComponentDesignPresetKey,
  type ComponentDesignPresetPatchResult,
} from '@/lib/builder/site/component-design-presets';
import { normalizeSiteHref } from '@/lib/builder/site/paths';
import { type BuilderLightbox, type BuilderNavItem, type BuilderPopup, type BuilderSiteSettings, type BuilderTheme, type SavedSection } from '@/lib/builder/site/types';
import { collectThemeFontFamilies } from '@/lib/builder/site/theme';
import type { ColumnPost } from '@/lib/columns';
import type { Locale } from '@/lib/locales';
import { useSandboxSiteState } from './hooks/useSandboxSiteState';
import type { DraftMeta } from './hooks/useSandboxSiteState';
import styles from './SandboxPage.module.css';
import {
  SAVE_BADGE_TTL_MS,
  TOAST_TTL_MS,
  VIEWPORT_WIDTHS,
  conflictBannerStyle,
  conflictReloadButtonStyle,
  getDraftConflictCopy,
  getPublicChromeCopy,
  getSandboxPageFeedbackCopy,
  type ActivityChip,
  type SandboxToast,
  type ToastOptions,
  type ToastTone,
} from '@/components/builder/canvas/SandboxPageChrome';
import { getNavigationCopy } from '@/components/builder/canvas/navigation-copy';

function memberPreviewModeFromParam(value: string | null): MemberPreviewMode {
  if (value === 'free' || value === 'premium' || value === 'admin') return value;
  return 'signed-out';
}

function memberNavPreviewFromMode(mode: MemberPreviewMode): SiteHeaderMemberNavPreview | undefined {
  if (mode === 'premium' || mode === 'admin') {
    return {
      authenticated: true,
      member: {
        name: mode === 'admin' ? 'Builder Admin Preview' : 'Builder Premium Preview',
        role: mode,
      },
    };
  }
  if (mode === 'free') {
    return {
      authenticated: true,
      member: {
        name: 'Builder Member Preview',
        role: 'free',
      },
    };
  }
  return undefined;
}

function responsiveTargetViewportFrom(viewport: ViewportMode): ResponsiveTargetViewport | null {
  if (viewport === 'mobile' || viewport === 'tablet') return viewport;
  return null;
}

function findNavigationItemIdByHref(
  items: BuilderNavItem[],
  href: string,
  locale: Locale,
): string | null {
  const targetHref = normalizeSiteHref(href, locale);
  for (const item of items) {
    if (normalizeSiteHref(item.href, locale) === targetHref) return item.id;
    if (item.children?.length) {
      const childId = findNavigationItemIdByHref(item.children, href, locale);
      if (childId) return childId;
    }
  }
  return null;
}

function moveNavigationItemWithinSiblings(
  items: BuilderNavItem[],
  itemId: string,
  direction: 'up' | 'down',
): { items: BuilderNavItem[]; moved: boolean } {
  const index = items.findIndex((item) => item.id === itemId);
  if (index >= 0) {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return { items, moved: false };
    const nextItems = [...items];
    [nextItems[index], nextItems[targetIndex]] = [nextItems[targetIndex], nextItems[index]];
    return { items: nextItems, moved: true };
  }

  let moved = false;
  const nextItems = items.map((item) => {
    if (moved || !item.children?.length) return item;
    const result = moveNavigationItemWithinSiblings(item.children, itemId, direction);
    if (!result.moved) return item;
    moved = true;
    return {
      ...item,
      children: result.items,
    };
  });
  return { items: moved ? nextItems : items, moved };
}

function localizedNavigationLabel(
  currentLabel: BuilderNavItem['label'],
  labels: Record<Locale, string>,
  untitled: string,
): BuilderNavItem['label'] {
  const fallback = labels.ko || labels.en || labels['zh-hant'] || untitled;
  if (typeof currentLabel === 'string') {
    return {
      ko: labels.ko || fallback,
      'zh-hant': labels['zh-hant'] || fallback,
      en: labels.en || fallback,
    };
  }
  return {
    ...currentLabel,
    ko: labels.ko || currentLabel.ko || fallback,
    'zh-hant': labels['zh-hant'] || currentLabel['zh-hant'] || fallback,
    en: labels.en || currentLabel.en || fallback,
  };
}

function renameNavigationItemLabels(
  items: BuilderNavItem[],
  itemId: string,
  labels: Record<Locale, string>,
  untitled: string,
): { items: BuilderNavItem[]; renamed: boolean } {
  let renamed = false;
  const nextItems = items.map((item) => {
    if (item.id === itemId) {
      renamed = true;
      return {
        ...item,
        label: localizedNavigationLabel(item.label, labels, untitled),
      };
    }
    if (!item.children?.length) return item;
    const result = renameNavigationItemLabels(item.children, itemId, labels, untitled);
    if (!result.renamed) return item;
    renamed = true;
    return {
      ...item,
      children: result.items,
    };
  });
  return { items: renamed ? nextItems : items, renamed };
}

export default function SandboxPage({
  initialDocument,
  initialDraftMeta,
  locale,
  siteId,
  initialPageId,
  siteName,
  siteSettings,
  siteTheme,
  navItems,
  currentSlug,
  sitePages,
  columnPosts = [],
  faqCategories = [],
  faqItems = [],
  datasetPreviewTargets = [],
  siteLightboxes = [],
  sitePopups = [],
  appWidgets = [],
}: {
  initialDocument: BuilderCanvasDocument;
  initialDraftMeta?: DraftMeta | null;
  locale: Locale;
  siteId: string;
  backend: 'blob' | 'file';
  initialPageId?: string;
  siteName?: string;
  siteSettings?: BuilderSiteSettings;
  siteTheme?: BuilderTheme;
  navItems?: BuilderNavItem[];
  currentSlug?: string;
  sitePages?: BuilderPageSummary[];
  columnPosts?: ColumnPost[];
  faqCategories?: BuilderFaqCategory[];
  faqItems?: BuilderFaqItem[];
  datasetPreviewTargets?: BuilderDataBindingPreviewTarget[];
  siteLightboxes?: BuilderLightbox[];
  sitePopups?: BuilderPopup[];
  appWidgets?: BuilderRegisteredAppWidget[];
}) {
  const searchParams = useSearchParams();
  const canvasDocument = useBuilderCanvasStore((state) => state.document);
  const nodesById = useBuilderCanvasStore((state) => state.nodesById);
  const selectedNodeId = useBuilderCanvasStore((state) => state.selectedNodeId);
  const selectedNodeIds = useBuilderCanvasStore((state) => state.selectedNodeIds);
  const draftSaveState = useBuilderCanvasStore((state) => state.draftSaveState);
  const clipboardCount = useBuilderCanvasStore((state) => state.clipboardCount);
  const mutationBaseDocument = useBuilderCanvasStore((state) => state.mutationBaseDocument);
  const hasLocalHistory = useBuilderCanvasStore((state) => state.canUndo || state.canRedo);
  const replaceDocument = useBuilderCanvasStore((state) => state.replaceDocument);
  const pasteClipboardNodes = useBuilderCanvasStore((state) => state.pasteClipboardNodes);
  const setSelectedNodeId = useBuilderCanvasStore((state) => state.setSelectedNodeId);
  const setDraftSaveState = useBuilderCanvasStore((state) => state.setDraftSaveState);
  const updateNode = useBuilderCanvasStore((state) => state.updateNode);
  const updateNodeContent = useBuilderCanvasStore((state) => state.updateNodeContent);
  const updateSelectedNodes = useBuilderCanvasStore((state) => state.updateSelectedNodes);
  const updateResponsiveOverride = useBuilderCanvasStore((state) => state.updateResponsiveOverride);
  const beginMutationSession = useBuilderCanvasStore((state) => state.beginMutationSession);
  const commitMutationSession = useBuilderCanvasStore((state) => state.commitMutationSession);
  const cancelMutationSession = useBuilderCanvasStore((state) => state.cancelMutationSession);
  const undo = useBuilderCanvasStore((state) => state.undo);
  const canUndo = useBuilderCanvasStore((state) => state.canUndo);
  const setStoreViewport = useBuilderCanvasStore((state) => state.setViewport);
  const applyMobileAutoFit = useBuilderCanvasStore((state) => state.applyMobileAutoFit);
  const [assetLibraryNodeId, setAssetLibraryNodeId] = useState<string | null>(null);
  const [imageEditorRequest, setImageEditorRequest] = useState<ImageEditorRequest>(null);
  const [toasts, setToasts] = useState<SandboxToast[]>([]);
  const [activityChips, setActivityChips] = useState<ActivityChip[]>([]);
  const previousDraftSaveStateRef = useRef(draftSaveState);
  const saveBadgeTimerRef = useRef<number | null>(null);
  const mobileAutoFitKeyRef = useRef<string | null>(null);
  const canvasColumnRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [publishOpen, setPublishOpen] = useState(false);
  const [seoOpen, setSeoOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [activeDrawer, setActiveDrawer] = useState<SandboxDrawerPanel | null>(null);
  const [clientReady, setClientReady] = useState(false);
  const usesColumnsShortcutFlow = useMemo(
    () => searchParams.get('publicChromeColumnsShortcut') !== '0',
    [searchParams],
  );
  const queryMemberPreviewMode = useMemo(
    () => memberPreviewModeFromParam(searchParams.get('memberPreview')),
    [searchParams],
  );
  const [memberPreviewMode, setMemberPreviewMode] = useState<MemberPreviewMode>(queryMemberPreviewMode);
  const memberNavPreview = useMemo(() => memberNavPreviewFromMode(memberPreviewMode), [memberPreviewMode]);
  const [activeNavItemId, setActiveNavItemId] = useState<string | null>(null);
  const [focusedNavItemId, setFocusedNavItemId] = useState<string | null>(null);
  const [addNavChildParentId, setAddNavChildParentId] = useState<string | null>(null);
  const [missingPageHref, setMissingPageHref] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [responsiveAiOpen, setResponsiveAiOpen] = useState(false);
  const [editorDensity, setEditorDensity] = useState<EditorDensity>('cozy');
  const [editorThemeMode, setEditorThemeMode] = useState<EditorThemeMode>('light');
  const [movePickerNodeIds, setMovePickerNodeIds] = useState<string[] | null>(null);
  const [saveSectionPayload, setSaveSectionPayload] = useState<SaveSectionPayload | null>(null);
  const [presenceEntries, setPresenceEntries] = useState<CollabPresenceEntry[]>([]);
  const [collabCursors, setCollabCursors] = useState<CanvasCollabCursor[]>([]);
  const childrenMap = useBuilderCanvasStore((state) => state.childrenMap);
  const addNodes = useBuilderCanvasStore((state) => state.addNodes);
  const storeViewport = useBuilderCanvasStore((state) => state.viewport);
  const navigationCopy = useMemo(() => getNavigationCopy(locale), [locale]);
  const publicChromeCopy = useMemo(() => getPublicChromeCopy(locale), [locale]);
  const draftConflictCopy = useMemo(() => getDraftConflictCopy(locale), [locale]);
  const pageFeedbackCopy = useMemo(() => getSandboxPageFeedbackCopy(locale), [locale]);
  const handleViewportChange = useCallback((nextViewport: ViewportMode) => {
    setViewport(nextViewport);
    setStoreViewport(nextViewport);
  }, [setStoreViewport]);
  const openPublishPanel = useCallback(() => setPublishOpen(true), []);
  const openSeoPanel = useCallback(() => setSeoOpen(true), []);
  const openSettingsPanel = useCallback(() => setSettingsOpen(true), []);
  const openHistoryPanel = useCallback(() => setHistoryOpen(true), []);
  const openPreviewPanel = useCallback(() => setPreviewOpen(true), []);
  const openResponsiveAiPanel = useCallback(() => setResponsiveAiOpen(true), []);
  const closeResponsiveAiPanel = useCallback(() => setResponsiveAiOpen(false), []);
  const openPagesDrawer = useCallback(() => setActiveDrawer('pages'), []);

  useEffect(() => {
    setClientReady(true);
  }, []);

  useEffect(() => {
    setMemberPreviewMode(queryMemberPreviewMode);
  }, [queryMemberPreviewMode]);

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

  const pushToast = useCallback((message: string, tone: ToastTone, options: ToastOptions = {}) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((currentToasts) => [
      ...currentToasts,
      {
        id,
        message,
        tone,
        actionLabel: options.actionLabel,
        onAction: options.onAction,
      },
    ]);
    window.setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
    }, options.ttlMs ?? TOAST_TTL_MS);
  }, []);

  const pushActivityChip = useCallback((message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setActivityChips((currentChips) => [...currentChips, { id, message }].slice(-3));
    window.setTimeout(() => {
      setActivityChips((currentChips) => currentChips.filter((chip) => chip.id !== id));
    }, 1800);
  }, []);

  const dismissToast = useCallback((toastId: string) => {
    setToasts((currentToasts) => currentToasts.filter((candidate) => candidate.id !== toastId));
  }, []);

  const {
    activePageId,
    canDecomposeCurrentPage,
    columnPostsSummary,
    columnsPageLookupPending,
    currentSlugState,
    draftConflict,
    draftMeta,
    headerNavItems,
    linkPickerSitePages,
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
    handleDecomposeCurrentPage,
    handleMoveCompleted,
    handleOpenColumnsPage,
    handlePagesChange,
    handlePublishDraftSaved,
    handleReloadDraftAfterConflict,
    handleSelectPage,
    refreshColumnsPageIfNeeded,
  } = useSandboxSiteState({
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
    onMissingHeaderPage: (href) => {
      setMissingPageHref(href);
      setActiveDrawer('pages');
    },
  });

  const responsiveAiTargetViewport = responsiveTargetViewportFrom(viewport);
  const canOpenResponsiveAi = Boolean(responsiveAiTargetViewport && canvasDocument && activePageId);

  const previewResponsiveSuggestions = useCallback((suggestions: ResponsiveSuggestion[]) => {
    if (!responsiveAiTargetViewport || suggestions.length === 0) return;
    beginMutationSession();
    for (const suggestion of suggestions) {
      updateResponsiveOverride(
        suggestion.nodeId,
        responsiveAiTargetViewport,
        suggestion.mobileOverride,
        'transient',
      );
    }
  }, [beginMutationSession, responsiveAiTargetViewport, updateResponsiveOverride]);

  const applyResponsiveSuggestions = useCallback((suggestions: ResponsiveSuggestion[]) => {
    if (!responsiveAiTargetViewport || suggestions.length === 0) return;
    beginMutationSession();
    for (const suggestion of suggestions) {
      updateResponsiveOverride(
        suggestion.nodeId,
        responsiveAiTargetViewport,
        suggestion.mobileOverride,
        'transient',
      );
    }
    commitMutationSession();
  }, [beginMutationSession, commitMutationSession, responsiveAiTargetViewport, updateResponsiveOverride]);

  const getResponsiveAnalysisCanvas = useCallback((): BuilderCanvasDocument => {
    const currentDocument = useBuilderCanvasStore.getState().document;
    if (currentDocument) return currentDocument;
    if (canvasDocument) return canvasDocument;
    throw new Error('Canvas document is not loaded.');
  }, [canvasDocument]);

  useEffect(() => {
    if (canOpenResponsiveAi || !responsiveAiOpen) return;
    setResponsiveAiOpen(false);
    cancelMutationSession();
  }, [canOpenResponsiveAi, cancelMutationSession, responsiveAiOpen]);

  useEffect(() => {
    if (!clientReady || !activePageId) {
      setPresenceEntries([]);
      return undefined;
    }

    const storageKey = 'builder:collab-session-id';
    let sessionId = '';
    try {
      sessionId = window.sessionStorage.getItem(storageKey) ?? '';
      if (!sessionId) {
        sessionId = window.crypto?.randomUUID?.() ?? `sess-${Math.random().toString(36).slice(2, 10)}`;
        window.sessionStorage.setItem(storageKey, sessionId);
      }
    } catch {
      sessionId = `sess-${Math.random().toString(36).slice(2, 10)}`;
    }

    let cancelled = false;
    const syncPresence = async () => {
      try {
        const response = await fetch(`/api/builder/collab/presence?${new URLSearchParams({ locale, siteId }).toString()}`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            siteId,
            pageId: activePageId,
            sessionId,
            nodeId: selectedNodeId ?? undefined,
          }),
        });
        if (!response.ok || cancelled) return;
        const payload = await response.json().catch(() => null) as { active?: CollabPresenceEntry[] } | null;
        if (!payload || !Array.isArray(payload.active) || cancelled) return;
        setPresenceEntries(payload.active);
      } catch {
        if (!cancelled) setPresenceEntries([]);
      }
    };

    void syncPresence();
    const timer = window.setInterval(syncPresence, 15_000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [activePageId, clientReady, locale, selectedNodeId, siteId]);

  useEffect(() => {
    if (!clientReady || !activePageId) {
      setCollabCursors([]);
      return undefined;
    }

    let cancelled = false;
    const syncCursors = async () => {
      try {
        const response = await fetch(`/api/builder/collab/cursors?${new URLSearchParams({ siteId, pageId: activePageId }).toString()}`, {
          credentials: 'include',
        });
        if (!response.ok || cancelled) return;
        const payload = await response.json().catch(() => null) as { cursors?: CanvasCollabCursor[] } | null;
        if (!payload || !Array.isArray(payload.cursors) || cancelled) return;
        setCollabCursors(payload.cursors);
      } catch {
        if (!cancelled) setCollabCursors([]);
      }
    };

    void syncCursors();
    const timer = window.setInterval(syncCursors, 7_500);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [activePageId, clientReady, siteId]);

  const handleApplyComponentDesignPreset = useCallback((presetKey: ComponentDesignPresetKey): ComponentDesignPresetPatchResult => {
    const preset = getComponentDesignPreset(presetKey);
    if (!canvasDocument) {
      const emptyResult: ComponentDesignPresetPatchResult = {
        nodes: [],
        changedNodeIds: [],
        counts: { buttons: 0, cards: 0, formFields: 0, formSubmits: 0 },
      };
      pushToast(pageFeedbackCopy.currentPageNotLoaded, 'error');
      return emptyResult;
    }

    const result = applyComponentDesignPresetToNodes(canvasDocument.nodes, preset.key);
    if (result.changedNodeIds.length === 0) {
      const componentTargetCount = summarizeComponentDesignTargets(canvasDocument.nodes).total;
      pushToast(
        componentTargetCount > 0
          ? pageFeedbackCopy.componentPresetAlreadyMatches(preset.label)
          : pageFeedbackCopy.componentPresetNoTargets,
        componentTargetCount > 0 ? 'success' : 'error',
      );
      return result;
    }

    const nextNodeById = new Map(result.nodes.map((node) => [node.id, node]));
    updateSelectedNodes(result.changedNodeIds, (node) => nextNodeById.get(node.id) ?? node);
    pushToast(pageFeedbackCopy.componentPresetApplied(preset.label, result.changedNodeIds.length), 'success');
    return result;
  }, [canvasDocument, pageFeedbackCopy, pushToast, updateSelectedNodes]);

  const handlePagesPanelPaste = useCallback(() => {
    const state = useBuilderCanvasStore.getState();
    if (state.clipboardCount <= 0) return;
    pasteClipboardNodes();
    const pastedCount = state.clipboardCount;
    pushActivityChip(pageFeedbackCopy.pastedItems(pastedCount));
  }, [pageFeedbackCopy, pasteClipboardNodes, pushActivityChip]);

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
    setViewport((currentViewport) => (
      currentViewport === storeViewport ? currentViewport : storeViewport
    ));
  }, [storeViewport]);

  useEffect(() => {
    if (viewport !== 'mobile') {
      mobileAutoFitKeyRef.current = null;
      return;
    }
    const autoFitKey = `${activePageId ?? 'page'}:${canvasDocument?.nodes.length ?? 0}`;
    if (mobileAutoFitKeyRef.current === autoFitKey) return;
    mobileAutoFitKeyRef.current = autoFitKey;
    applyMobileAutoFit(VIEWPORT_WIDTHS.mobile ?? 375);
  }, [applyMobileAutoFit, canvasDocument?.nodes.length, activePageId, viewport]);

  useEffect(() => {
    const column = canvasColumnRef.current;
    if (!column) return;
    column.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [activePageId, currentSlugState]);

  const selectedNode = useMemo(
    () => (selectedNodeId ? nodesById.get(selectedNodeId) ?? null : null),
    [nodesById, selectedNodeId],
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
  const linkPickerPopups = useMemo(
    () =>
      sitePopups
        .filter((popup) => popup.locale === locale)
        .map((popup) => ({
          id: popup.id,
          slug: popup.slug,
          name: popup.name,
        })),
    [locale, sitePopups],
  );
  const assetLibraryNode = useMemo(
    () => (assetLibraryNodeId ? nodesById.get(assetLibraryNodeId) ?? null : null),
    [assetLibraryNodeId, nodesById],
  );
  const imageEditorNode = useMemo(
    () => (imageEditorRequest?.nodeId ? nodesById.get(imageEditorRequest.nodeId) ?? null : null),
    [imageEditorRequest?.nodeId, nodesById],
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

  const viewportWidth = VIEWPORT_WIDTHS[viewport];

  const toggleDrawer = useCallback((panel: SandboxDrawerPanel) => {
    setActiveDrawer((current) => (current === panel && panel !== 'pages' ? null : panel));
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

  const handleRequestRenameNavItem = useCallback(async (itemId: string, labels: Record<Locale, string>) => {
    const fallbackLabel = labels.ko.trim() || labels.en.trim() || labels['zh-hant'].trim() || navigationCopy.titles.untitled;
    const nextLabels: Record<Locale, string> = {
      ko: labels.ko.trim() || fallbackLabel,
      'zh-hant': labels['zh-hant'].trim() || fallbackLabel,
      en: labels.en.trim() || fallbackLabel,
    };
    const result = renameNavigationItemLabels(headerNavItems, itemId, nextLabels, navigationCopy.titles.untitled);
    if (!result.renamed) {
      pushToast(pageFeedbackCopy.navItemNotFound, 'error');
      return false;
    }

    setNavItemsState(result.items);
    setActiveNavItemId(itemId);
    try {
      const response = await fetch('/api/builder/site/navigation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          locale,
          navigation: result.items,
        }),
      });
      if (!response.ok) throw new Error('Navigation save failed');
      const payload = (await response.json().catch(() => null)) as { navigation?: BuilderNavItem[] } | null;
      if (Array.isArray(payload?.navigation)) {
        setNavItemsState(payload.navigation);
      }
      pushActivityChip(pageFeedbackCopy.navNameSaved);
      return true;
    } catch {
      setNavItemsState(headerNavItems);
      pushToast(pageFeedbackCopy.navNameSaveFailed, 'error');
      return false;
    }
  }, [headerNavItems, locale, navigationCopy.titles.untitled, pageFeedbackCopy, pushActivityChip, pushToast, setNavItemsState]);

  const handleRequestAddNavChild = useCallback((parentItemId: string) => {
    setActiveDrawer('nav');
    setActiveNavItemId(parentItemId);
    setFocusedNavItemId(parentItemId);
    setAddNavChildParentId(parentItemId);
  }, []);

  const handleRequestMoveNavItem = useCallback((itemId: string, direction: 'up' | 'down') => {
    const result = moveNavigationItemWithinSiblings(headerNavItems, itemId, direction);
    if (!result.moved) {
      pushToast(pageFeedbackCopy.navMoveUnavailable, 'error');
      return;
    }

    setNavItemsState(result.items);
    setActiveNavItemId(itemId);
    void fetch('/api/builder/site/navigation', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({
        locale,
        navigation: result.items,
      }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error('Navigation save failed');
        const payload = (await response.json().catch(() => null)) as { navigation?: BuilderNavItem[] } | null;
        if (Array.isArray(payload?.navigation)) {
          setNavItemsState(payload.navigation);
        }
        pushActivityChip(pageFeedbackCopy.navOrderSaved);
      })
      .catch(() => {
        setNavItemsState(headerNavItems);
        pushToast(pageFeedbackCopy.navOrderSaveFailed, 'error');
      });
  }, [headerNavItems, locale, pageFeedbackCopy, pushActivityChip, pushToast, setNavItemsState]);

  const handleRequestSaveAsSection = useCallback(
    (rootNodeId: string) => {
      const allNodes = canvasDocument?.nodes ?? [];
      const rootNode = allNodes.find((node) => node.id === rootNodeId);
      if (!rootNode) {
        pushToast(pageFeedbackCopy.selectedContainerNotFound, 'error');
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
    [childrenMap, canvasDocument?.nodes, pageFeedbackCopy, pushToast],
  );

  const handleInsertSavedSection = useCallback(
    async (sectionId: string, position: { x: number; y: number }, parentNodeId: string | null = null) => {
      try {
        const response = await fetch(
          `/api/builder/site/section-library/${sectionId}?locale=${encodeURIComponent(locale)}`,
          { credentials: 'same-origin' },
        );
        if (!response.ok) {
          pushToast(pageFeedbackCopy.savedSectionLoadFailed, 'error');
          return;
        }
        const data = (await response.json()) as { ok: boolean; section?: SavedSection };
        if (!data.ok || !data.section) {
          pushToast(pageFeedbackCopy.savedSectionInvalid, 'error');
          return;
        }
        const result = insertSavedSection(data.section, position);
        if (result.nodes.length === 0) {
          pushToast(pageFeedbackCopy.savedSectionInsertFailed, 'error');
          return;
        }
        addNodes(result.nodes, result.rootNodeId, parentNodeId);
        setSelectedNodeId(result.rootNodeId);
        pushToast(pageFeedbackCopy.savedSectionAdded(data.section.name), 'success');
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
        const message = error instanceof Error ? error.message : pageFeedbackCopy.savedSectionAddError;
        pushToast(message, 'error');
      }
    },
    [addNodes, locale, pageFeedbackCopy, pushToast, setSelectedNodeId],
  );

  const canvasWrapperStyle: React.CSSProperties = viewportWidth
    ? {
        width: viewportWidth,
        margin: '0 auto',
        position: 'relative',
        display: 'flex',
        flex: '0 0 auto',
        flexDirection: 'column',
        minHeight: 'max(640px, calc(100vh - var(--editor-topbar-h, 56px) - var(--editor-statusbar-h, 28px) - 60px))',
        transition: 'width 300ms cubic-bezier(0.16, 1, 0.3, 1)',
      }
    : {
        width: 'min(100%, 1280px)',
        margin: '0 auto',
        position: 'relative',
        display: 'flex',
        flex: '0 0 auto',
        flexDirection: 'column',
        minHeight: 'max(640px, calc(100vh - var(--editor-topbar-h, 56px) - var(--editor-statusbar-h, 28px) - 60px))',
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
    if (currentSlugState !== 'columns') {
      setActiveDrawer(null);
      void handleOpenColumnsPage(() => setActiveDrawer('pages'));
      return;
    }

    const nextDrawer = activeDrawer === 'columns' ? null : 'columns';
    setActiveDrawer(nextDrawer);
  }, [activeDrawer, currentSlugState, handleOpenColumnsPage]);

  const handleCanvasHeaderNavigate = useCallback((href: string) => {
    setMissingPageHref(null);
    setActiveDrawer(null);
    window.setTimeout(() => {
      setActiveDrawer(null);
    }, 0);
    handleHeaderNavigate(href);
  }, [handleHeaderNavigate]);

  const handleEditorFooterLinkActivation = useCallback((event: {
    target: EventTarget | null;
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const footerLink = target.closest<HTMLAnchorElement>('a[href]');
    if (!footerLink) return;

    event.preventDefault();
    event.stopPropagation();

    const href = footerLink.getAttribute('href') ?? '';
    if (/^(mailto:|tel:)/.test(href)) {
      setActiveDrawer(null);
      setSettingsOpen(true);
      pushToast(pageFeedbackCopy.footerContactSettings, 'success');
      return;
    }

    if (!href || /^(https?:|mailto:|tel:|#)/.test(href)) {
      const navItemId = findNavigationItemIdByHref(headerNavItems, href, locale);
      setActiveDrawer('nav');
      if (navItemId) {
        setActiveNavItemId(navItemId);
        setFocusedNavItemId(navItemId);
      }
      pushToast(
        navItemId
          ? pageFeedbackCopy.footerNavigationOpened
          : pageFeedbackCopy.footerNavigationFallback,
        navItemId ? 'success' : 'error',
      );
      return;
    }

    handleCanvasHeaderNavigate(href);
  }, [handleCanvasHeaderNavigate, headerNavItems, locale, pageFeedbackCopy, pushToast]);

  useEffect(() => {
    if (activeDrawer === 'columns') refreshColumnsPageIfNeeded();
  }, [activeDrawer, refreshColumnsPageIfNeeded]);

  return (
    <BuilderThemeProvider value={siteThemeState}>
      <main
        className={styles.shell}
        data-editor-shell
        data-editor-ready={clientReady ? 'true' : 'false'}
        data-editor-density={editorDensity}
        data-editor-theme={editorThemeMode}
      >
        <GoogleFontsLoader extraFamilies={collectThemeFontFamilies(siteThemeState)} />
        <SandboxTopBar
          locale={locale}
          siteId={siteId}
          draftSaveState={draftSaveState}
          selectedSummary={
            selectedNodeIds.length > 1
              ? pageFeedbackCopy.selectionSummaryMultiple(selectedNodeIds.length)
              : selectedNode
                ? `${selectedNode.kind} · ${selectedNode.id}`
                : pageFeedbackCopy.selectionSummaryNone
          }
          selectionCount={selectedNodeIds.length}
          viewport={viewport}
          onViewportChange={handleViewportChange}
          onPublish={openPublishPanel}
          onOpenSeo={openSeoPanel}
          onOpenSettings={openSettingsPanel}
          onOpenHistory={openHistoryPanel}
          onOpenPreview={openPreviewPanel}
          onOpenResponsiveAi={openResponsiveAiPanel}
          canOpenResponsiveAi={canOpenResponsiveAi}
          onOpenPages={openPagesDrawer}
          activePageId={activePageId}
          onLocaleChange={handleLocaleChange}
          siteName={siteName}
          currentSlug={currentSlugState}
          saveBlockReason={saveBlockReason}
          memberPreviewMode={memberPreviewMode}
          onMemberPreviewModeChange={setMemberPreviewMode}
          presenceEntries={presenceEntries}
        />

        {responsiveAiOpen && responsiveAiTargetViewport && canvasDocument && activePageId ? (
          <ResponsiveAiPanel
            pageId={activePageId}
            locale={locale}
            targetViewport={responsiveAiTargetViewport}
            getAnalysisCanvas={getResponsiveAnalysisCanvas}
            canUndoLast={canUndo}
            onPreview={previewResponsiveSuggestions}
            onCancelPreview={cancelMutationSession}
            onCommitPreview={commitMutationSession}
            onApply={applyResponsiveSuggestions}
            onUndoLast={undo}
            onClose={closeResponsiveAiPanel}
          />
        ) : null}

        {draftConflict ? (
          <div style={conflictBannerStyle} role="alert">
            <span>
              {draftConflictCopy.message}
            </span>
            <button
              type="button"
              style={conflictReloadButtonStyle}
              onClick={handleReloadDraftAfterConflict}
            >
              {draftConflictCopy.reloadLabel}
            </button>
          </div>
        ) : null}

        <SandboxEditorWorkspace
          locale={locale}
          siteId={siteId}
          activeDrawer={activeDrawer}
          activePageId={activePageId}
          clipboardCount={clipboardCount}
          columnPostsSummary={columnPostsSummary}
          columnsPageLookupPending={columnsPageLookupPending}
          document={canvasDocument ?? initialDocument}
          nodesById={nodesById}
          selectedNode={selectedNode}
          focusedNavItemId={focusedNavItemId}
          addNavChildParentId={addNavChildParentId}
          siteName={siteName}
          siteSettings={siteSettingsState}
          siteTheme={siteThemeState}
          headerNavItems={headerNavItems}
          currentSlug={currentSlugState}
          activeNavItemId={activeNavItemId}
          missingPageHref={missingPageHref}
          viewportWidth={viewportWidth}
          canvasOuterStyle={canvasOuterStyle}
          canvasWrapperStyle={canvasWrapperStyle}
          canvasColumnRef={canvasColumnRef}
          publicChromeCopy={publicChromeCopy}
          publicChromeColumnsShortcut={usesColumnsShortcutFlow}
          collabCursors={collabCursors}
          linkPickerLightboxes={linkPickerLightboxes}
          linkPickerPopups={linkPickerPopups}
          linkPickerSitePages={linkPickerSitePages}
          columnPosts={columnPosts}
          faqCategories={faqCategories}
          faqItems={faqItems}
          datasetPreviewTargets={datasetPreviewTargets}
          appWidgets={appWidgets}
          memberNavPreview={memberNavPreview}
          onToggleDrawer={toggleDrawer}
          onOpenColumnsPanel={handleOpenColumnsPanel}
          onOpenColumnsPage={() => {
            void handleOpenColumnsPage(() => setActiveDrawer('pages')).then((opened) => {
              if (opened) setActiveDrawer(null);
            });
          }}
          onOpenSettings={openSettingsPanel}
          onOpenHistory={openHistoryPanel}
          onApplyComponentDesignPreset={handleApplyComponentDesignPreset}
          onSetActiveDrawer={setActiveDrawer}
          onSelectPage={handleSelectPage}
          onPagesChange={handlePagesChange}
          onMissingPageHandled={() => setMissingPageHref(null)}
          onNavigationChange={setNavItemsState}
          onNavFocusHandled={() => setFocusedNavItemId(null)}
          onNavAddChildHandled={() => setAddNavChildParentId(null)}
          onSelectNode={setSelectedNodeId}
          onUpdateNodeContent={updateNodeContent}
          onHeaderNavigate={handleCanvasHeaderNavigate}
          onRequestEditNavItem={handleRequestEditNavItem}
          onRequestRenameNavItem={handleRequestRenameNavItem}
          onRequestAddNavChild={handleRequestAddNavChild}
          onRequestMoveNavItem={handleRequestMoveNavItem}
          onFooterLinkActivation={handleEditorFooterLinkActivation}
          onRequestAssetLibrary={setAssetLibraryNodeId}
          onRequestImageEditor={setImageEditorRequest}
          onRequestMoveToPage={setMovePickerNodeIds}
          onRequestSaveAsSection={handleRequestSaveAsSection}
          canDecomposeCurrentPage={canDecomposeCurrentPage}
          onDecomposeCurrentPage={handleDecomposeCurrentPage}
          onRequestInsertSavedSection={(sectionId, position, parentNodeId) => {
            void handleInsertSavedSection(sectionId, position, parentNodeId);
          }}
          onCanvasPageLink={handleCanvasHeaderNavigate}
          onToast={pushToast}
          onActivity={pushActivityChip}
        />

        <SandboxModalsRoot
          locale={locale}
          siteId={siteId}
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
          onApplyComponentDesignPreset={handleApplyComponentDesignPreset}
          onCloseHistory={() => setHistoryOpen(false)}
          onCloseHelp={() => setHelpOpen(false)}
          onClosePreview={() => setPreviewOpen(false)}
          onCloseSaveSection={() => setSaveSectionPayload(null)}
          onSectionSaved={(section) => {
            pushToast(pageFeedbackCopy.savedSectionSaved(section.name), 'success');
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('builder:saved-section-changed'));
            }
          }}
          onCloseMovePicker={() => setMovePickerNodeIds(null)}
          onMoveCompleted={handleMoveCompleted}
          onToast={pushToast}
        />

        <SandboxFeedbackOverlay
          locale={locale}
          draftSaveState={draftSaveState}
          activityChips={activityChips}
          toasts={toasts}
          onDismissToast={dismissToast}
        />
        <SandboxStatusBar
          locale={locale}
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
