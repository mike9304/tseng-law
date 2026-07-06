'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Locale } from '@/lib/locales';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import {
  insertSavedSection,
  type SavedSectionInsertResult,
} from '@/lib/builder/sections/insertSection';
import {
  type SavedSection,
  type SavedSectionCategory,
} from '@/lib/builder/site/types';
import SavedSectionCard from './SavedSectionCard';
import { getSavedSectionsPanelCopy } from './section-panel-copy';
import styles from './SectionLibraryPanel.module.css';

export default function SavedSectionsPanel({ locale }: { locale: Locale }) {
  const copy = getSavedSectionsPanelCopy(locale);
  const [sections, setSections] = useState<SavedSection[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const addNodes = useBuilderCanvasStore((s) => s.addNodes);
  const document = useBuilderCanvasStore((s) => s.document);
  const setDraftSaveState = useBuilderCanvasStore((s) => s.setDraftSaveState);
  const setSelectedNodeId = useBuilderCanvasStore((s) => s.setSelectedNodeId);

  const reload = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch(
        `/api/builder/site/section-library?locale=${encodeURIComponent(locale)}`,
        { credentials: 'same-origin' },
      );
      if (response.ok) {
        const data = (await response.json()) as { sections?: SavedSection[] };
        setSections(data.sections ?? []);
      } else {
        setErrorMessage(copy.loadListFailed);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : copy.loadListError);
    } finally {
      setLoading(false);
    }
  }, [copy.loadListError, copy.loadListFailed, locale]);

  useEffect(() => {
    void reload();
  }, [reload]);

  // Listen for "section saved" event so the panel auto-refreshes after save.
  useEffect(() => {
    function handleEvent() {
      void reload();
    }
    window.addEventListener('builder:saved-section-changed', handleEvent);
    return () => window.removeEventListener('builder:saved-section-changed', handleEvent);
  }, [reload]);

  const grouped = useMemo(() => {
    const buckets = new Map<SavedSectionCategory, SavedSection[]>();
    for (const section of sections) {
      const key: SavedSectionCategory = section.category ?? 'custom';
      const arr = buckets.get(key) ?? [];
      arr.push(section);
      buckets.set(key, arr);
    }
    return [...buckets.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [sections]);

  async function handleInsert(section: SavedSection) {
    if (!document) return;
    const result: SavedSectionInsertResult = insertSavedSection(section);
    if (result.nodes.length === 0) {
      setErrorMessage(copy.insertFailed);
      return;
    }
    addNodes(result.nodes, result.rootNodeId);
    setSelectedNodeId(result.rootNodeId);
    setDraftSaveState('saving');
    // Optimistic usage bump.
    setSections((current) =>
      current.map((s) =>
        s.sectionId === section.sectionId
          ? { ...s, usage: (s.usage ?? 0) + 1 }
          : s,
      ),
    );
    try {
      const response = await fetch(
        `/api/builder/site/section-library/${section.sectionId}?locale=${encodeURIComponent(locale)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ incrementUsage: true }),
        },
      );
      if (!response.ok) {
        setErrorMessage(copy.usageUpdateFailed);
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        return;
      }
      throw error;
    }
  }

  async function handleDelete(section: SavedSection) {
    if (!window.confirm(copy.deleteConfirm(section.name))) return;
    try {
      const response = await fetch(
        `/api/builder/site/section-library/${section.sectionId}?locale=${encodeURIComponent(locale)}`,
        {
          method: 'DELETE',
          credentials: 'same-origin',
        },
      );
      if (response.ok) {
        setSections((current) => current.filter((s) => s.sectionId !== section.sectionId));
      } else {
        setErrorMessage(copy.deleteFailed);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : copy.deleteError);
    }
  }

  async function commitRename(section: SavedSection) {
    const next = renameValue.trim();
    setRenamingId(null);
    if (!next || next === section.name) return;
    try {
      const response = await fetch(
        `/api/builder/site/section-library/${section.sectionId}?locale=${encodeURIComponent(locale)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ name: next }),
        },
      );
      if (response.ok) {
        const data = (await response.json()) as { section?: SavedSection };
        if (data.section) {
          setSections((current) =>
            current.map((s) => (s.sectionId === section.sectionId ? data.section! : s)),
          );
        }
      } else {
        setErrorMessage(copy.renameFailed);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : copy.renameError);
    }
  }

  return (
    <div className={styles.savedRoot} data-builder-saved-section-library="true">
      <div className={styles.savedHeader}>
        <strong className={styles.savedTitle}>
          {copy.title(sections.length)}
        </strong>
        <button
          type="button"
          onClick={() => { void reload(); }}
          className={styles.refreshButton}
        >
          {copy.refresh}
        </button>
      </div>

      {errorMessage ? (
        <div
          className={styles.errorMessage}
        >
          {errorMessage}
        </div>
      ) : null}

      {loading ? (
        <div className={styles.stateMessage}>
          {copy.loading}
        </div>
      ) : sections.length === 0 ? (
        <div className={styles.emptyState}>
          {copy.emptyTitle}
          <br />
          {copy.emptyHint}
        </div>
      ) : (
        grouped.map(([category, items]) => (
          <div key={category} className={styles.savedGroup}>
            <div className={styles.savedGroupHeader}>
              {copy.categoryLabels[category]} · {items.length}
            </div>
            <div className={styles.savedGrid}>
              {items.map((section) => (
                <SavedSectionCard
                  key={section.sectionId}
                  section={section}
                  category={category}
                  copy={copy}
                  renaming={renamingId === section.sectionId}
                  renameValue={renameValue}
                  onRenameValueChange={setRenameValue}
                  onCommitRename={(target) => { void commitRename(target); }}
                  onCancelRename={() => setRenamingId(null)}
                  onStartRename={(target) => {
                    setRenamingId(target.sectionId);
                    setRenameValue(target.name);
                  }}
                  onInsert={(target) => { void handleInsert(target); }}
                  onDelete={(target) => { void handleDelete(target); }}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
