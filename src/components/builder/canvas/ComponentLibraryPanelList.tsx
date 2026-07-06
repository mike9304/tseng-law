'use client';

import type { ComponentLibraryCopy } from './component-library-copy';
import { ComponentLibraryPanelItem } from './ComponentLibraryPanelItem';
import type { ComponentLibraryEntry, ComponentLibraryViewMode } from './component-library-panel.helpers';
import styles from './ComponentLibraryPanel.module.css';

interface ComponentLibraryPanelListProps {
  copy: ComponentLibraryCopy;
  entries: readonly ComponentLibraryEntry[];
  visibleEntries: readonly ComponentLibraryEntry[];
  viewMode: ComponentLibraryViewMode;
  searchQuery: string;
  editingEntryId: string | null;
  editingName: string;
  onEditingNameChange: (value: string) => void;
  onStartRename: (entry: ComponentLibraryEntry) => void;
  onCancelRename: () => void;
  onSaveRename: (id: string) => void;
  onInsert: (entry: ComponentLibraryEntry) => void;
  onDuplicate: (entry: ComponentLibraryEntry) => void;
  canReplace: boolean;
  onReplace: (entry: ComponentLibraryEntry) => void;
  canUpdate: boolean;
  onUpdate: (id: string) => void;
  onRestore: (id: string) => void;
  onTogglePinned: (id: string) => void;
  onRemove: (id: string) => void;
}

function EmptyLibraryIcon() {
  return (
    <span className={styles.componentLibraryEmptyIcon} aria-hidden="true">
      <svg viewBox="0 0 24 24" className={styles.componentLibraryEmptySvg}>
        <path d="M5 7.5A2.5 2.5 0 0 1 7.5 5h9A2.5 2.5 0 0 1 19 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-9A2.5 2.5 0 0 1 5 16.5v-9Z" />
        <path d="M8.5 10h7" />
        <path d="M8.5 13h4" />
      </svg>
    </span>
  );
}

export function ComponentLibraryPanelList({
  copy,
  entries,
  visibleEntries,
  viewMode,
  searchQuery,
  editingEntryId,
  editingName,
  onEditingNameChange,
  onStartRename,
  onCancelRename,
  onSaveRename,
  onInsert,
  onDuplicate,
  canReplace,
  onReplace,
  canUpdate,
  onUpdate,
  onRestore,
  onTogglePinned,
  onRemove,
}: ComponentLibraryPanelListProps) {
  if (entries.length === 0) {
    return (
      <ul className={styles.componentLibraryList}>
        <li className={styles.componentLibraryEmptyState}>
          <EmptyLibraryIcon />
          <strong>{copy.emptyTitle}</strong>
          <span>{copy.emptyState}</span>
        </li>
      </ul>
    );
  }

  if (visibleEntries.length === 0) {
    return (
      <ul className={styles.componentLibraryList}>
        <li className={styles.componentLibraryEmptyState}>
          <EmptyLibraryIcon />
          <strong>{copy.emptyTitle}</strong>
          <span>{copy.searchEmptyState(searchQuery.trim())}</span>
        </li>
      </ul>
    );
  }

  return (
    <ul className={styles.componentLibraryList} data-builder-component-library-view={viewMode}>
      {visibleEntries.map((entry) => (
        <ComponentLibraryPanelItem
          key={entry.id}
          copy={copy}
          entry={entry}
          viewMode={viewMode}
          isEditing={editingEntryId === entry.id}
          editingName={editingName}
          onEditingNameChange={onEditingNameChange}
          onStartRename={onStartRename}
          onCancelRename={onCancelRename}
          onSaveRename={onSaveRename}
          onInsert={onInsert}
          onDuplicate={onDuplicate}
          canReplace={canReplace}
          onReplace={onReplace}
          canUpdate={canUpdate}
          onUpdate={onUpdate}
          onRestore={onRestore}
          onTogglePinned={onTogglePinned}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
}
