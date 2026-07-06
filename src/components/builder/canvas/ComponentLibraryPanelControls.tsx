'use client';

import type { ComponentLibraryCopy } from './component-library-copy';
import {
  parseComponentLibrarySortMode,
  type ComponentLibrarySortMode,
  type ComponentLibraryViewMode,
} from './component-library-panel.helpers';
import styles from './ComponentLibraryPanel.module.css';

interface ComponentLibraryPanelControlsProps {
  readonly copy: ComponentLibraryCopy;
  readonly name: string;
  readonly searchQuery: string;
  readonly sortMode: ComponentLibrarySortMode;
  readonly viewMode: ComponentLibraryViewMode;
  readonly visibleCount: number;
  readonly totalCount: number;
  readonly canSave: boolean;
  readonly hasSelection: boolean;
  readonly onNameChange: (value: string) => void;
  readonly onSearchQueryChange: (value: string) => void;
  readonly onSortModeChange: (value: ComponentLibrarySortMode) => void;
  readonly onViewModeChange: (value: ComponentLibraryViewMode) => void;
  readonly onSave: () => void;
}

export function ComponentLibraryPanelControls({
  copy,
  name,
  searchQuery,
  sortMode,
  viewMode,
  visibleCount,
  totalCount,
  canSave,
  hasSelection,
  onNameChange,
  onSearchQueryChange,
  onSortModeChange,
  onViewModeChange,
  onSave,
}: ComponentLibraryPanelControlsProps) {
  return (
    <>
      <div className={styles.componentLibrarySaveRow}>
        <input
          type="text"
          value={name}
          onChange={(event) => onNameChange(event.target.value)}
          placeholder={copy.namePlaceholder}
          data-builder-component-library-name="true"
          className={styles.componentLibraryInput}
        />
        <button
          type="button"
          data-builder-component-library-save="true"
          disabled={!canSave}
          onClick={onSave}
          className={styles.componentLibrarySaveButton}
        >
          {copy.saveAction}
        </button>
      </div>

      <div className={styles.componentLibraryFilterRow}>
        <label className={styles.componentLibraryFilterField}>
          <span>{copy.searchLabel}</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder={copy.searchPlaceholder}
            className={styles.componentLibraryInput}
          />
        </label>
        <label className={styles.componentLibraryFilterField}>
          <span>{copy.sortLabel}</span>
          <select
            value={sortMode}
            onChange={(event) => onSortModeChange(parseComponentLibrarySortMode(event.target.value))}
            className={styles.componentLibrarySelect}
          >
            <option value="recent">{copy.sortRecent}</option>
            <option value="name">{copy.sortName}</option>
          </select>
        </label>
      </div>
      <div className={styles.componentLibraryToolbarRow}>
        <p className={styles.componentLibraryResults}>{copy.resultsLabel(visibleCount, totalCount)}</p>
        <div className={styles.componentLibraryViewToggle} role="group" aria-label={copy.viewLabel}>
          <button
            type="button"
            data-builder-component-library-view-toggle="list"
            aria-label={copy.viewListAriaLabel}
            aria-pressed={viewMode === 'list'}
            onClick={() => onViewModeChange('list')}
            className={styles.componentLibraryViewToggleButton}
          >
            {copy.viewList}
          </button>
          <button
            type="button"
            data-builder-component-library-view-toggle="grid"
            aria-label={copy.viewGridAriaLabel}
            aria-pressed={viewMode === 'grid'}
            onClick={() => onViewModeChange('grid')}
            className={styles.componentLibraryViewToggleButton}
          >
            {copy.viewGrid}
          </button>
        </div>
      </div>

      {!hasSelection ? (
        <p className={styles.componentLibraryHint}>{copy.selectFirstHint}</p>
      ) : null}
    </>
  );
}
