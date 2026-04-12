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
import SandboxTopBar, { type ViewportMode } from '@/components/builder/canvas/SandboxTopBar';
import SiteSettingsModal from '@/components/builder/canvas/SiteSettingsModal';
import VersionHistoryPanel from '@/components/builder/canvas/VersionHistoryPanel';
import GoogleFontsLoader from '@/components/builder/canvas/GoogleFontsLoader';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import styles from './SandboxPage.module.css';

const AUTOSAVE_DEBOUNCE_MS = 1000;
const TOAST_TTL_MS = 3000;

const VIEWPORT_WIDTHS: Record<ViewportMode, number | null> = {
  desktop: null,
  tablet: 768,
  mobile: 375,
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
}: {
  initialDocument: BuilderCanvasDocument;
  locale: Locale;
  backend: 'blob' | 'file';
  initialPageId?: string;
}) {
  const {
    document,
    selectedNodeId,
    selectedNodeIds,
    draftSaveState,
    canUndo,
    canRedo,
    replaceDocument,
    setDraftSaveState,
    updateNodeContent,
  } = useBuilderCanvasStore();
  const [assetLibraryNodeId, setAssetLibraryNodeId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<SandboxToast[]>([]);
  const previousDraftSaveStateRef = useRef(draftSaveState);
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [publishOpen, setPublishOpen] = useState(false);
  const [activePageId, setActivePageId] = useState<string | null>(initialPageId ?? null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

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
    if (!document) return undefined;
    if (document.updatedAt === initialDocument.updatedAt) return undefined;

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
  }, [document, initialDocument.updatedAt, locale, setDraftSaveState]);

  const selectedNode = useMemo(
    () => document?.nodes.find((node) => node.id === selectedNodeId) ?? null,
    [document, selectedNodeId],
  );
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

    if (draftSaveState === 'saved') {
      pushToast('Draft saved', 'success');
    }
    if (draftSaveState === 'error') {
      pushToast('Draft save failed', 'error');
    }
    previousDraftSaveStateRef.current = draftSaveState;
  }, [draftSaveState]);

  const handleLocaleChange = useCallback(async (newLocale: Locale, linkedPageId: string | null) => {
    if (linkedPageId) {
      // Load the linked page's document
      try {
        const response = await fetch(
          `/api/builder/sites/default/pages/${linkedPageId}/draft?locale=${newLocale}`,
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

  const handleSelectPage = useCallback(async (pageId: string) => {
    setActivePageId(pageId);
    try {
      const response = await fetch(
        `/api/builder/sites/default/pages/${pageId}/draft?locale=${locale}`,
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
  }, [locale, replaceDocument]);

  const viewportWidth = VIEWPORT_WIDTHS[viewport];

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
        justifyContent: 'center',
        overflow: 'auto',
      }
    : {
        flex: 1,
        minWidth: 0,
      };

  return (
    <main className={styles.shell}>
      <GoogleFontsLoader />
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
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenHistory={() => setHistoryOpen(true)}
        activePageId={activePageId}
        onLocaleChange={handleLocaleChange}
      />

      <section className={styles.metaGrid}>
        <div className={styles.metaCard}>
          <span>Selected node</span>
          <strong>
            {selectedNodeIds.length > 1
              ? `${selectedNodeIds.length} selected`
              : selectedNode
                ? `${selectedNode.kind} · ${selectedNode.id}`
                : 'none'}
          </strong>
        </div>
        <div className={styles.metaCard}>
          <span>Document nodes</span>
          <strong>{document?.nodes.length ?? 0}</strong>
        </div>
        <div className={styles.metaCard}>
          <span>Interaction scope</span>
          <strong>select · drag · resize · rotate · lock/hide · delete · nudge · undo/redo</strong>
        </div>
        <div className={styles.metaCard}>
          <span>History</span>
          <strong>{canUndo ? 'undo ready' : 'undo empty'} · {canRedo ? 'redo ready' : 'redo empty'}</strong>
        </div>
        <div className={styles.metaCard}>
          <span>Out of scope</span>
          <strong>asset history, nested container semantics, main builder integration</strong>
        </div>
      </section>

      <section className={styles.editorShell}>
        <div className={styles.leftColumn}>
          <PageSwitcher
            locale={locale}
            activePageId={activePageId}
            onSelectPage={handleSelectPage}
          />
          <NavigationEditor locale={locale} />
          <SandboxLayersPanel />
          <SandboxCatalogPanel />
        </div>
        <div style={canvasOuterStyle}>
          <div style={canvasWrapperStyle}>
            <CanvasContainer onRequestAssetLibrary={setAssetLibraryNodeId} />
          </div>
        </div>
        <SandboxInspectorPanel
          onRequestAssetLibrary={() => {
            if (selectedNode?.kind === 'image') {
              setAssetLibraryNodeId(selectedNode.id);
            }
          }}
        />
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
        onClose={() => setPublishOpen(false)}
      />

      <SiteSettingsModal
        open={settingsOpen}
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
  );
}
