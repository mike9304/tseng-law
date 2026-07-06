'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Locale } from '@/lib/locales';
import {
  BUILDER_EDITOR_PREFS_EVENT,
  loadEditorPreferences,
  normalizeEditorPreferences,
} from '@/lib/builder/canvas/editor-prefs';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import { ComponentLibraryPanelPreview } from './ComponentLibraryPanelPreview';
import { ComponentLibraryRemapNotice } from './ComponentLibraryRemapNotice';
import { ComponentLibraryRemapReview } from './ComponentLibraryRemapReview';
import { getComponentLibraryCopy } from './component-library-copy';
import {
  confirmComponentLibraryPendingInsert,
  EMPTY_COMPONENT_LIBRARY_FIELD_OVERRIDES,
  prepareComponentLibraryInsert,
  updateComponentLibraryPendingFieldOverride,
  type ComponentLibraryPendingRemapReview,
} from './component-library-insert-flow.helpers';
import type {
  ComponentLibraryEntry,
  ComponentLibraryFieldRemapSummary,
  ComponentLibraryInsertResult,
} from './component-library-panel.helpers';
import { getComponentLibraryShortcutGroups } from './component-library-shortcut.helpers';
import styles from './ComponentLibraryShortcut.module.css';

interface ComponentLibraryShortcutProps {
  readonly locale?: Locale;
}

function readComponentLibraryEntries(): ComponentLibraryEntry[] {
  return loadEditorPreferences().componentLibrary;
}

function scrollToComponentLibrary(): void {
  const panel = document.querySelector<HTMLElement>('[data-builder-component-library="true"]');
  panel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function entryInitial(name: string): string {
  const trimmed = name.trim();
  return trimmed.length > 0 ? trimmed.slice(0, 1).toUpperCase() : '?';
}

export function ComponentLibraryShortcut({ locale = 'ko' }: ComponentLibraryShortcutProps) {
  const copy = getComponentLibraryCopy(locale);
  const canvasDocument = useBuilderCanvasStore((state) => state.document);
  const selectedNodeIds = useBuilderCanvasStore((state) => state.selectedNodeIds);
  const nodesById = useBuilderCanvasStore((state) => state.nodesById);
  const addNodes = useBuilderCanvasStore((state) => state.addNodes);
  const setSelectedNodeIds = useBuilderCanvasStore((state) => state.setSelectedNodeIds);
  const setDraftSaveState = useBuilderCanvasStore((state) => state.setDraftSaveState);
  const [entries, setEntries] = useState<ComponentLibraryEntry[]>([]);
  const [latestRemapSummary, setLatestRemapSummary] = useState<ComponentLibraryFieldRemapSummary | null>(null);
  const [pendingRemapReview, setPendingRemapReview] = useState<ComponentLibraryPendingRemapReview | null>(null);
  const quickGroups = useMemo(() => getComponentLibraryShortcutGroups(entries, {
    pinnedLimit: 2,
    recentLimit: 3,
  }), [entries]);

  useEffect(() => {
    setEntries(readComponentLibraryEntries());
    function handlePrefsChange(event: Event) {
      const detail: unknown = event instanceof CustomEvent ? event.detail : undefined;
      const prefs = event instanceof CustomEvent ? normalizeEditorPreferences(detail) : loadEditorPreferences();
      setEntries(prefs.componentLibrary);
    }
    window.document.addEventListener(BUILDER_EDITOR_PREFS_EVENT, handlePrefsChange);
    return () => window.document.removeEventListener(BUILDER_EDITOR_PREFS_EVENT, handlePrefsChange);
  }, []);

  function commitInsert(parsed: ComponentLibraryInsertResult, parentNodeId: string | null) {
    if (!parsed || parsed.nodes.length === 0) return;
    setLatestRemapSummary(parsed.fieldRemapSummary);
    addNodes(parsed.nodes, parsed.rootNodeId, parentNodeId);
    if (parsed.selectionNodeIds.length > 0) {
      setSelectedNodeIds([...parsed.selectionNodeIds], parsed.rootNodeId);
    }
    setDraftSaveState('saving');
  }

  function insertEntry(entry: ComponentLibraryEntry) {
    const prepared = prepareComponentLibraryInsert({
      entry,
      selectedNodeIds,
      nodesById,
      canvasNodeCount: canvasDocument?.nodes.length ?? 0,
    });
    if (!prepared) return;
    if (prepared.kind === 'review') {
      setLatestRemapSummary(null);
      setPendingRemapReview(prepared.pending);
      return;
    }
    commitInsert(prepared.parsed, prepared.parentNodeId);
  }

  function confirmPendingRemapReview() {
    if (!pendingRemapReview) return;
    const prepared = confirmComponentLibraryPendingInsert(pendingRemapReview, canvasDocument?.nodes.length ?? 0);
    if (!prepared || prepared.kind !== 'ready') return;
    setPendingRemapReview(null);
    commitInsert(prepared.parsed, prepared.parentNodeId);
  }

  return (
    <section
      className={styles.componentLibraryShortcut}
      data-builder-component-library-shortcut="true"
    >
      <div className={styles.componentLibraryShortcutTop}>
        <span className={styles.componentLibraryShortcutIcon} aria-hidden="true">
          <svg viewBox="0 0 24 24" className={styles.componentLibraryShortcutSvg}>
            <path d="M6 5h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
            <path d="M8 9h8" />
            <path d="M8 13h5" />
            <path d="M16 14.5v3" />
            <path d="M14.5 16h3" />
          </svg>
        </span>
        <span className={styles.componentLibraryShortcutCopy}>
          <strong>{copy.shortcutTitle}</strong>
          <span>{copy.shortcutDescription(entries.length)}</span>
        </span>
        <button
          type="button"
          className={styles.componentLibraryShortcutAction}
          data-builder-component-library-shortcut-open="true"
          aria-label={copy.shortcutAriaLabel}
          onClick={scrollToComponentLibrary}
        >
          {copy.shortcutAction}
        </button>
      </div>

      <ComponentLibraryRemapNotice
        copy={copy}
        summary={latestRemapSummary}
        onDismiss={() => setLatestRemapSummary(null)}
      />

      <ComponentLibraryRemapReview
        copy={copy}
        review={pendingRemapReview?.review ?? null}
        fieldOverrides={pendingRemapReview?.fieldOverrides ?? EMPTY_COMPONENT_LIBRARY_FIELD_OVERRIDES}
        onFieldOverrideChange={(fieldKey, sourceFieldId, targetFieldId) => {
          setPendingRemapReview((current) => current
            ? updateComponentLibraryPendingFieldOverride({ pending: current, fieldKey, sourceFieldId, targetFieldId })
            : current);
        }}
        onConfirm={confirmPendingRemapReview}
        onCancel={() => setPendingRemapReview(null)}
      />

      {quickGroups.pinned.length > 0 ? (
        <div className={styles.componentLibraryShortcutTray} data-builder-component-library-shortcut-tray="true">
          <span
            className={styles.componentLibraryShortcutTrayTitle}
            data-builder-component-library-shortcut-section="pinned"
          >
            {copy.shortcutPinnedTitle}
          </span>
          <div className={styles.componentLibraryShortcutItems}>
            {quickGroups.pinned.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={styles.componentLibraryShortcutItem}
                data-builder-component-library-shortcut-insert={entry.id}
                aria-label={copy.shortcutQuickInsertAriaLabel(entry.name)}
                onClick={() => insertEntry(entry)}
              >
                <ComponentLibraryPanelPreview entry={entry} initial={entryInitial(entry.name)} />
                <span className={styles.componentLibraryShortcutItemName}>{entry.name}</span>
                <span className={styles.componentLibraryShortcutItemAction}>{copy.shortcutQuickInsertAction}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {quickGroups.recent.length > 0 ? (
        <div className={styles.componentLibraryShortcutTray} data-builder-component-library-shortcut-tray="true">
          <span
            className={styles.componentLibraryShortcutTrayTitle}
            data-builder-component-library-shortcut-section="recent"
          >
            {copy.shortcutRecentTitle}
          </span>
          <div className={styles.componentLibraryShortcutItems}>
            {quickGroups.recent.map((entry) => (
              <button
                key={entry.id}
                type="button"
                className={styles.componentLibraryShortcutItem}
                data-builder-component-library-shortcut-insert={entry.id}
                aria-label={copy.shortcutQuickInsertAriaLabel(entry.name)}
                onClick={() => insertEntry(entry)}
              >
                <ComponentLibraryPanelPreview entry={entry} initial={entryInitial(entry.name)} />
                <span className={styles.componentLibraryShortcutItemName}>{entry.name}</span>
                <span className={styles.componentLibraryShortcutItemAction}>{copy.shortcutQuickInsertAction}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {quickGroups.invalidCount > 0 ? (
        <span
          className={styles.componentLibraryShortcutNotice}
          data-builder-component-library-shortcut-invalid="true"
        >
          {copy.shortcutInvalidNotice(quickGroups.invalidCount)}
        </span>
      ) : null}
    </section>
  );
}
