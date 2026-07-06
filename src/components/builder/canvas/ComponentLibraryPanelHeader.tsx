'use client';

import type { ComponentLibraryCopy } from './component-library-copy';
import styles from './ComponentLibraryPanel.module.css';

interface ComponentLibraryPanelHeaderProps {
  readonly copy: ComponentLibraryCopy;
  readonly entriesCount: number;
}

export function ComponentLibraryPanelHeader({ copy, entriesCount }: ComponentLibraryPanelHeaderProps) {
  return (
    <header className={styles.componentLibraryHeader}>
      <span className={styles.componentLibraryMark} aria-hidden="true">
        <svg viewBox="0 0 24 24" className={styles.componentLibraryMarkIcon}>
          <path d="M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z" />
          <path d="M8 9h8" />
          <path d="M8 13h5" />
          <path d="M16 15.5v3" />
          <path d="M14.5 17h3" />
        </svg>
      </span>
      <div className={styles.componentLibraryHeaderCopy}>
        <span>{copy.eyebrow}</span>
        <strong>{copy.title(entriesCount)}</strong>
        <p>{copy.description}</p>
      </div>
    </header>
  );
}
