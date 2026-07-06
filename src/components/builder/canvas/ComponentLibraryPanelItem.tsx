'use client';

import type { FormEvent } from 'react';
import type { ComponentLibraryCopy } from './component-library-copy';
import { ComponentLibraryPanelItemActions } from './ComponentLibraryPanelItemActions';
import { ComponentLibraryPanelPreview } from './ComponentLibraryPanelPreview';
import {
  getComponentLibraryEntrySummary,
  type ComponentLibraryEntry,
  type ComponentLibraryViewMode,
} from './component-library-panel.helpers';
import styles from './ComponentLibraryPanel.module.css';

type ComponentLibraryPanelItemProps = {
  readonly copy: ComponentLibraryCopy;
  readonly entry: ComponentLibraryEntry;
  readonly viewMode: ComponentLibraryViewMode;
  readonly isEditing: boolean;
  readonly editingName: string;
  readonly onEditingNameChange: (value: string) => void;
  readonly onStartRename: (entry: ComponentLibraryEntry) => void;
  readonly onCancelRename: () => void;
  readonly onSaveRename: (id: string) => void;
  readonly onInsert: (entry: ComponentLibraryEntry) => void;
  readonly onDuplicate: (entry: ComponentLibraryEntry) => void;
  readonly canReplace: boolean;
  readonly onReplace: (entry: ComponentLibraryEntry) => void;
  readonly canUpdate: boolean;
  readonly onUpdate: (id: string) => void;
  readonly onRestore: (id: string) => void;
  readonly onTogglePinned: (id: string) => void;
  readonly onRemove: (id: string) => void;
};

export function ComponentLibraryPanelItem({
  copy,
  entry,
  viewMode,
  isEditing,
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
}: ComponentLibraryPanelItemProps) {
  const isPinned = entry.pinned === true;
  const versionCount = entry.versions?.length ?? 0;
  const summary = getComponentLibraryEntrySummary(entry);
  const canInsert = summary.isValid && summary.nodeCount > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSaveRename(entry.id);
  }

  return (
    <li className={styles.componentLibraryItem} data-builder-component-library-item-view={viewMode}>
      <ComponentLibraryPanelPreview
        entry={entry}
        initial={entry.name.trim().slice(0, 1).toLocaleUpperCase(copy.dateLocale)}
      />
      {isEditing ? (
        <form className={styles.componentLibraryRenameForm} onSubmit={handleSubmit}>
          <input
            type="text"
            value={editingName}
            onChange={(event) => onEditingNameChange(event.target.value)}
            placeholder={copy.renamePlaceholder}
            data-builder-component-library-rename-input={entry.id}
            className={styles.componentLibraryInput}
          />
          <div className={styles.componentLibraryRenameActions}>
            <button
              type="submit"
              disabled={!editingName.trim()}
              data-builder-component-library-rename-save={entry.id}
              className={styles.componentLibraryRenameSaveButton}
            >
              {copy.renameSaveAction}
            </button>
            <button type="button" onClick={onCancelRename} className={styles.componentLibraryRenameCancelButton}>
              {copy.renameCancelAction}
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className={styles.componentLibraryItemCopy}>
            <strong>{entry.name}</strong>
            <span>{new Date(entry.createdAt).toLocaleDateString(copy.dateLocale)}</span>
            <span
              className={styles.componentLibraryItemMeta}
              data-builder-component-library-valid={summary.isValid ? 'true' : 'false'}
            >
              {copy.entryMetaLabel(summary.rootKind, summary.nodeCount, summary.isValid)}
            </span>
            {entry.updatedAt ? (
              <span className={styles.componentLibraryUpdatedBadge} data-builder-component-library-updated="true">
                {copy.updatedBadge}
              </span>
            ) : null}
            {versionCount > 0 ? (
              <span
                className={styles.componentLibraryVersionBadge}
                data-builder-component-library-versions={versionCount}
              >
                {copy.versionBadge(versionCount)}
              </span>
            ) : null}
            {isPinned ? <span className={styles.componentLibraryPinnedBadge}>{copy.pinnedBadge}</span> : null}
          </div>
          <ComponentLibraryPanelItemActions
            copy={copy}
            entry={entry}
            canInsert={canInsert}
            canReplace={canReplace}
            canUpdate={canUpdate}
            isPinned={isPinned}
            onInsert={onInsert}
            onReplace={onReplace}
            onStartRename={onStartRename}
            onDuplicate={onDuplicate}
            onUpdate={onUpdate}
            onRestore={onRestore}
            onTogglePinned={onTogglePinned}
            onRemove={onRemove}
          />
        </>
      )}
    </li>
  );
}
