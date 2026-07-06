'use client';

import { useEffect, useState } from 'react';
import {
  BUILDER_EDITOR_PREFS_EVENT,
  DEFAULT_EDITOR_PREFS,
  loadEditorPreferences,
  normalizeEditorPreferences,
  saveAndBroadcastEditorPreferences,
} from '@/lib/builder/canvas/editor-prefs';
import type { ComponentLibraryCopy } from './component-library-copy';
import {
  deleteComponentLibraryEntryVersion,
  duplicateComponentLibraryEntry,
  renameComponentLibraryEntry,
  renameComponentLibraryEntryVersion,
  restoreComponentLibraryEntryVersion,
  toggleComponentLibraryEntryPinned,
  updateComponentLibraryEntryPayload,
  type ComponentLibraryEntry,
} from './component-library-panel.helpers';

function makeComponentLibraryEntryId(): string {
  return `lib-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function useComponentLibraryEntries(copy: ComponentLibraryCopy) {
  const [entries, setEntries] = useState<ComponentLibraryEntry[]>([]);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    setEntries(loadEditorPreferences().componentLibrary);
    function handlePrefsChange(event: Event) {
      const detail: unknown = event instanceof CustomEvent ? event.detail : undefined;
      const prefs = event instanceof CustomEvent ? normalizeEditorPreferences(detail) : loadEditorPreferences();
      setEntries(prefs.componentLibrary);
    }
    window.document.addEventListener(BUILDER_EDITOR_PREFS_EVENT, handlePrefsChange);
    return () => window.document.removeEventListener(BUILDER_EDITOR_PREFS_EVENT, handlePrefsChange);
  }, []);

  function persist(next: readonly ComponentLibraryEntry[]) {
    const prefs = loadEditorPreferences() ?? DEFAULT_EDITOR_PREFS;
    saveAndBroadcastEditorPreferences({ ...prefs, componentLibrary: [...next] });
    setEntries([...next]);
  }

  function saveEntry(name: string, nodeJson: string): boolean {
    if (!nodeJson || !name.trim()) return false;
    const entry: ComponentLibraryEntry = {
      id: makeComponentLibraryEntryId(),
      name: name.trim().slice(0, 80),
      nodeJson,
      createdAt: new Date().toISOString(),
    };
    persist([...entries, entry]);
    return true;
  }

  function removeEntry(id: string) {
    persist(entries.filter((entry) => entry.id !== id));
    if (editingEntryId === id) {
      setEditingEntryId(null);
      setEditingName('');
    }
  }

  function duplicateEntry(entry: ComponentLibraryEntry) {
    const duplicated = duplicateComponentLibraryEntry(
      entries,
      entry.id,
      makeComponentLibraryEntryId(),
      new Date().toISOString(),
      copy.duplicateName(entry.name),
    );
    if (duplicated !== entries) persist(duplicated);
  }

  function togglePinnedEntry(id: string) {
    const updated = toggleComponentLibraryEntryPinned(entries, id);
    if (updated !== entries) persist(updated);
  }

  function updateEntryPayload(options: {
    readonly id: string;
    readonly nextNodeJson: string;
    readonly snapshotLabel?: string;
  }) {
    const updated = updateComponentLibraryEntryPayload(entries, {
      id: options.id,
      nextNodeJson: options.nextNodeJson,
      updatedAt: new Date().toISOString(),
      snapshotLabel: options.snapshotLabel,
    });
    if (updated !== entries) persist(updated);
  }

  function restoreEntryVersion(id: string, versionIndex = 0) {
    const updated = restoreComponentLibraryEntryVersion(entries, {
      id,
      restoredAt: new Date().toISOString(),
      versionIndex,
    });
    if (updated !== entries) persist(updated);
  }

  function renameEntryVersion(options: {
    readonly id: string;
    readonly versionIndex: number;
    readonly label: string;
  }) {
    const updated = renameComponentLibraryEntryVersion(entries, options);
    if (updated !== entries) persist(updated);
  }

  function deleteEntryVersion(options: {
    readonly id: string;
    readonly versionIndex: number;
  }) {
    const updated = deleteComponentLibraryEntryVersion(entries, options);
    if (updated !== entries) persist(updated);
  }

  function startRename(entry: ComponentLibraryEntry) {
    setEditingEntryId(entry.id);
    setEditingName(entry.name);
  }

  function cancelRename() {
    setEditingEntryId(null);
    setEditingName('');
  }

  function saveRename(id: string) {
    const renamed = renameComponentLibraryEntry(entries, id, editingName);
    if (renamed !== entries) persist(renamed);
    cancelRename();
  }

  return {
    entries,
    editingEntryId,
    editingName,
    setEditingName,
    saveEntry,
    removeEntry,
    duplicateEntry,
    togglePinnedEntry,
    updateEntryPayload,
    restoreEntryVersion,
    renameEntryVersion,
    deleteEntryVersion,
    startRename,
    cancelRename,
    saveRename,
  };
}
