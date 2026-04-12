'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import AssetLibraryModal from '@/components/builder/editor/AssetLibraryModal';
import CanvasContainer from '@/components/builder/canvas/CanvasContainer';
import SandboxCatalogPanel from '@/components/builder/canvas/SandboxCatalogPanel';
import SandboxInspectorPanel from '@/components/builder/canvas/SandboxInspectorPanel';
import SandboxLayersPanel from '@/components/builder/canvas/SandboxLayersPanel';
import SandboxTopBar from '@/components/builder/canvas/SandboxTopBar';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import styles from './SandboxPage.module.css';

const AUTOSAVE_DEBOUNCE_MS = 1000;
const TOAST_TTL_MS = 3000;

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
}: {
  initialDocument: BuilderCanvasDocument;
  locale: Locale;
  backend: 'blob' | 'file';
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
        const response = await fetch(`/api/builder/sandbox/draft?locale=${locale}`, {
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

  return (
    <main className={styles.shell}>
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
          <SandboxLayersPanel />
          <SandboxCatalogPanel />
        </div>
        <CanvasContainer onRequestAssetLibrary={setAssetLibraryNodeId} />
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
