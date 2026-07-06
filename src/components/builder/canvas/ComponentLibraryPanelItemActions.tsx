'use client';

import type { ComponentLibraryCopy } from './component-library-copy';
import type { ComponentLibraryEntry } from './component-library-panel.helpers';
import styles from './ComponentLibraryPanel.module.css';

type ComponentLibraryPanelItemActionsProps = {
  readonly copy: ComponentLibraryCopy;
  readonly entry: ComponentLibraryEntry;
  readonly canInsert: boolean;
  readonly canReplace: boolean;
  readonly canUpdate: boolean;
  readonly isPinned: boolean;
  readonly onInsert: (entry: ComponentLibraryEntry) => void;
  readonly onReplace: (entry: ComponentLibraryEntry) => void;
  readonly onStartRename: (entry: ComponentLibraryEntry) => void;
  readonly onDuplicate: (entry: ComponentLibraryEntry) => void;
  readonly onUpdate: (id: string) => void;
  readonly onRestore: (id: string) => void;
  readonly onTogglePinned: (id: string) => void;
  readonly onRemove: (id: string) => void;
};

function DeleteIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.componentLibraryDeleteIcon} aria-hidden="true">
      <path d="M9 4h6" />
      <path d="M5 7h14" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M7 7l1 13h8l1-13" />
    </svg>
  );
}

function RenameIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.componentLibraryRenameIcon} aria-hidden="true">
      <path d="M4 20h4" />
      <path d="M14.5 4.5 19.5 9.5" />
      <path d="M13 6 6 13v3h3l7-7" />
    </svg>
  );
}

function DuplicateIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.componentLibraryDuplicateIcon} aria-hidden="true">
      <path d="M8 8h9a2 2 0 0 1 2 2v9" />
      <path d="M5 5h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      <path d="M7 11h5" />
      <path d="M9.5 8.5v5" />
    </svg>
  );
}

function ReplaceIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.componentLibraryReplaceIcon} aria-hidden="true">
      <path d="M7 7h11" />
      <path d="M15 4l3 3-3 3" />
      <path d="M17 17H6" />
      <path d="M9 14l-3 3 3 3" />
    </svg>
  );
}

function UpdateIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.componentLibraryUpdateIcon} aria-hidden="true">
      <path d="M20 7v5h-5" />
      <path d="M4 17v-5h5" />
      <path d="M18.5 9.5A7 7 0 0 0 6 7.2" />
      <path d="M5.5 14.5A7 7 0 0 0 18 16.8" />
    </svg>
  );
}

function RestoreIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.componentLibraryRestoreIcon} aria-hidden="true">
      <path d="M7 7H4v3" />
      <path d="M5 8.5A7 7 0 1 1 7.2 18" />
      <path d="M7.2 18H4.8v-2.4" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" className={styles.componentLibraryPinIcon} aria-hidden="true">
      <path d="M8 4h8" />
      <path d="M10 4v5l-3 4h10l-3-4V4" />
      <path d="M12 13v7" />
    </svg>
  );
}

export function ComponentLibraryPanelItemActions({
  copy,
  entry,
  canInsert,
  canReplace,
  canUpdate,
  isPinned,
  onInsert,
  onReplace,
  onStartRename,
  onDuplicate,
  onUpdate,
  onRestore,
  onTogglePinned,
  onRemove,
}: ComponentLibraryPanelItemActionsProps) {
  const hasPreviousVersion = (entry.versions?.length ?? 0) > 0;
  const canReplaceEntry = canInsert && canReplace;

  return (
    <div className={styles.componentLibraryItemActions}>
      <button
        type="button"
        data-builder-component-library-insert={entry.id}
        aria-label={canInsert ? copy.insertAriaLabel(entry.name) : copy.invalidInsertAriaLabel(entry.name)}
        title={canInsert ? copy.insertAction : copy.invalidInsertTitle}
        disabled={!canInsert}
        onClick={() => onInsert(entry)}
        className={styles.componentLibraryInsertButton}
      >
        {copy.insertAction}
      </button>
      <button
        type="button"
        data-builder-component-library-replace={entry.id}
        aria-label={copy.replaceAriaLabel(entry.name)}
        title={!canInsert ? copy.invalidInsertTitle : canReplace ? copy.replaceAction : copy.replaceDisabledTitle}
        disabled={!canReplaceEntry}
        onClick={() => onReplace(entry)}
        className={styles.componentLibraryReplaceButton}
      >
        <ReplaceIcon />
      </button>
      <button
        type="button"
        aria-label={copy.renameAriaLabel(entry.name)}
        title={copy.renameAction}
        onClick={() => onStartRename(entry)}
        className={styles.componentLibraryRenameButton}
      >
        <RenameIcon />
      </button>
      <button
        type="button"
        data-builder-component-library-pin={entry.id}
        aria-pressed={isPinned}
        aria-label={isPinned ? copy.unpinAriaLabel(entry.name) : copy.pinAriaLabel(entry.name)}
        title={isPinned ? copy.unpinAction : copy.pinAction}
        onClick={() => onTogglePinned(entry.id)}
        className={styles.componentLibraryPinButton}
      >
        <PinIcon />
      </button>
      <button
        type="button"
        data-builder-component-library-duplicate={entry.id}
        aria-label={copy.duplicateAriaLabel(entry.name)}
        title={copy.duplicateAction}
        onClick={() => onDuplicate(entry)}
        className={styles.componentLibraryDuplicateButton}
      >
        <DuplicateIcon />
      </button>
      <button
        type="button"
        data-builder-component-library-update={entry.id}
        aria-label={copy.updateAriaLabel(entry.name)}
        title={canUpdate ? copy.updateAction : copy.updateDisabledTitle}
        disabled={!canUpdate}
        onClick={() => onUpdate(entry.id)}
        className={styles.componentLibraryUpdateButton}
      >
        <UpdateIcon />
      </button>
      {hasPreviousVersion ? (
        <button
          type="button"
          data-builder-component-library-restore={entry.id}
          aria-label={copy.restoreAriaLabel(entry.name)}
          title={copy.restoreAction}
          onClick={() => onRestore(entry.id)}
          className={styles.componentLibraryRestoreButton}
        >
          <RestoreIcon />
        </button>
      ) : null}
      <button
        type="button"
        aria-label={copy.deleteAriaLabel(entry.name)}
        title={copy.deleteAction}
        onClick={() => onRemove(entry.id)}
        className={styles.componentLibraryDeleteButton}
      >
        <DeleteIcon />
      </button>
    </div>
  );
}
