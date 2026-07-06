'use client';

import type { ComponentLibraryEntry } from './component-library-panel.helpers';
import { getComponentLibraryEntryPreview } from './component-library-preview';
import styles from './ComponentLibraryPanel.module.css';

type ComponentLibraryPanelPreviewProps = {
  readonly entry: ComponentLibraryEntry;
  readonly initial: string;
};

export function ComponentLibraryPanelPreview({ entry, initial }: ComponentLibraryPanelPreviewProps) {
  const preview = getComponentLibraryEntryPreview(entry);
  return (
    <span
      className={styles.componentLibraryItemPreview}
      data-builder-component-library-preview-tone={preview.tone}
      data-builder-component-library-preview-valid={preview.isValid ? 'true' : 'false'}
      aria-hidden="true"
    >
      <span
        className={styles.componentLibraryPreviewCanvas}
        style={{ backgroundColor: preview.backgroundColor, borderColor: preview.accentColor }}
      >
        <span className={styles.componentLibraryPreviewGlow} style={{ backgroundColor: preview.accentColor }} />
        <span className={styles.componentLibraryPreviewTopLine} style={{ backgroundColor: preview.accentColor }} />
        <span className={styles.componentLibraryPreviewText}>{preview.sampleText}</span>
        <span className={styles.componentLibraryPreviewBottomLine} />
      </span>
      <span className={styles.componentLibraryPreviewInitial}>{preview.isValid ? initial : '!'}</span>
    </span>
  );
}
