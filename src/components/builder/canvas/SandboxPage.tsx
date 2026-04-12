'use client';

import { useEffect, useMemo } from 'react';
import CanvasContainer from '@/components/builder/canvas/CanvasContainer';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import styles from './SandboxPage.module.css';

const AUTOSAVE_DEBOUNCE_MS = 1000;

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
    draftSaveState,
    canUndo,
    canRedo,
    replaceDocument,
    setDraftSaveState,
    undo,
    redo,
  } = useBuilderCanvasStore();

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

  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <div>
          <h1>Freeform Sandbox</h1>
          <p>
            Phase 1 canvas runtime MVP 입니다. 이 화면은 section compatibility layer 와 분리된
            실험장으로, text/image/button absolute placement 와 draft autosave 만 검증합니다.
          </p>
        </div>
        <div className={styles.status}>
          <button
            type="button"
            className={styles.commandButton}
            onClick={undo}
            disabled={!canUndo}
          >
            Undo
          </button>
          <button
            type="button"
            className={styles.commandButton}
            onClick={redo}
            disabled={!canRedo}
          >
            Redo
          </button>
          <span className={`${styles.statusBadge} ${
            draftSaveState === 'saving'
              ? styles.statusBadgeSaving
              : draftSaveState === 'saved'
                ? styles.statusBadgeSaved
                : draftSaveState === 'error'
                  ? styles.statusBadgeError
                  : ''
          }`}
          >
            draft: {draftSaveState}
          </span>
          <span className={styles.statusBadge}>backend: {backend}</span>
          <span className={styles.statusBadge}>locale: {locale}</span>
        </div>
      </header>

      <section className={styles.metaGrid}>
        <div className={styles.metaCard}>
          <span>Selected node</span>
          <strong>{selectedNode ? `${selectedNode.kind} · ${selectedNode.id}` : 'none'}</strong>
        </div>
        <div className={styles.metaCard}>
          <span>Document nodes</span>
          <strong>{document?.nodes.length ?? 0}</strong>
        </div>
        <div className={styles.metaCard}>
          <span>Interaction scope</span>
          <strong>select · drag · resize · delete · nudge · undo/redo</strong>
        </div>
        <div className={styles.metaCard}>
          <span>History</span>
          <strong>{canUndo ? 'undo ready' : 'undo empty'} · {canRedo ? 'redo ready' : 'redo empty'}</strong>
        </div>
        <div className={styles.metaCard}>
          <span>Out of scope</span>
          <strong>snap, multi-select, real inspector tabs, inline text edit</strong>
        </div>
      </section>

      <CanvasContainer />
    </main>
  );
}
