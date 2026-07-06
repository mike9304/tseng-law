'use client';

import type { SavedSection, SavedSectionCategory } from '@/lib/builder/site/types';
import {
  buildSavedSectionThumbnailSvg,
  sanitizeSvgThumbnail,
} from '@/lib/builder/sections/thumbnail';
import EditorChromeIcon from '@/components/builder/canvas/EditorChromeIcon';
import { BUILDER_SAVED_SECTION_DRAG_MIME } from '@/components/builder/canvas/canvasCatalogDrop';
import styles from './SectionLibraryPanel.module.css';

interface SavedSectionCardCopy {
  cardTitle: (name: string) => string;
  categoryLabels: Record<SavedSectionCategory, string>;
  usage: (count: number) => string;
  insertTitle: string;
  insertLabel: string;
  renameTitle: string;
  renameLabel: string;
  deleteTitle: string;
  deleteLabel: string;
}

interface SavedSectionCardProps {
  section: SavedSection;
  category: SavedSectionCategory;
  copy: SavedSectionCardCopy;
  renaming: boolean;
  renameValue: string;
  onRenameValueChange: (value: string) => void;
  onCommitRename: (section: SavedSection) => void;
  onCancelRename: () => void;
  onStartRename: (section: SavedSection) => void;
  onInsert: (section: SavedSection) => void;
  onDelete: (section: SavedSection) => void;
}

export default function SavedSectionCard({
  section,
  category,
  copy,
  renaming,
  renameValue,
  onRenameValueChange,
  onCommitRename,
  onCancelRename,
  onStartRename,
  onInsert,
  onDelete,
}: SavedSectionCardProps) {
  return (
    <div
      data-builder-saved-section-card={section.sectionId}
      data-builder-saved-section-category={category}
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData(BUILDER_SAVED_SECTION_DRAG_MIME, section.sectionId);
        event.dataTransfer.effectAllowed = 'copy';
      }}
      className={styles.savedCard}
      title={copy.cardTitle(section.name)}
      onDoubleClick={() => onInsert(section)}
    >
      <div
        className={styles.savedThumbnail}
        dangerouslySetInnerHTML={{
          __html:
            sanitizeSvgThumbnail(section.thumbnail)
            ?? buildSavedSectionThumbnailSvg(section.nodes, section.rootNodeId, 200, 70),
        }}
      />

      {renaming ? (
        <input
          type="text"
          autoFocus
          value={renameValue}
          onChange={(event) => onRenameValueChange(event.target.value)}
          onBlur={() => onCommitRename(section)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onCommitRename(section);
              return;
            }
            if (event.key === 'Escape') {
              onCancelRename();
            }
          }}
          className={styles.renameInput}
        />
      ) : (
        <div className={styles.savedName}>
          {section.name}
        </div>
      )}

      <div className={styles.savedMeta}>
        <span
          className={styles.categoryBadge}
          data-category={category}
        >
          {copy.categoryLabels[category]}
        </span>
        <span className={styles.usageText}>
          {copy.usage(section.usage ?? 0)}
        </span>
      </div>

      <div className={styles.savedActions}>
        <button
          type="button"
          data-builder-saved-section-insert={section.sectionId}
          onClick={() => onInsert(section)}
          title={copy.insertTitle}
          aria-label={copy.insertTitle}
          className={styles.iconButton}
          data-tone="primary"
        >
          <EditorChromeIcon name="duplicate" />
          <span className={styles.srOnly}>{copy.insertLabel}</span>
        </button>
        <button
          type="button"
          onClick={() => onStartRename(section)}
          title={copy.renameTitle}
          aria-label={copy.renameTitle}
          className={styles.iconButton}
        >
          <EditorChromeIcon name="text" />
          <span className={styles.srOnly}>{copy.renameLabel}</span>
        </button>
        <button
          type="button"
          onClick={() => onDelete(section)}
          title={copy.deleteTitle}
          aria-label={copy.deleteTitle}
          className={styles.iconButton}
          data-tone="danger"
        >
          <EditorChromeIcon name="trash" />
          <span className={styles.srOnly}>{copy.deleteLabel}</span>
        </button>
      </div>
    </div>
  );
}
