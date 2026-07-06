import type { ComponentLibraryCopy } from './component-library-copy';
import type { ComponentLibraryBindingFieldKey, ComponentLibraryFieldOverrideMap } from './component-library-field-remap.helpers';
import type {
  ComponentLibraryEntry,
  ComponentLibraryFieldRemapSummary,
  ComponentLibrarySortMode,
  ComponentLibraryViewMode,
} from './component-library-panel.helpers';
import type { ComponentLibraryFieldRemapReview } from './component-library-remap-review.helpers';
import type { ComponentLibraryRestoreReview as ComponentLibraryRestoreReviewModel } from './component-library-restore-review.helpers';
import type { ComponentLibraryUpdateReview as ComponentLibraryUpdateReviewModel } from './component-library-update-review.helpers';
import { ComponentLibraryPanelControls } from './ComponentLibraryPanelControls';
import { ComponentLibraryPanelHeader } from './ComponentLibraryPanelHeader';
import { ComponentLibraryPanelList } from './ComponentLibraryPanelList';
import { ComponentLibraryPanelReviews } from './ComponentLibraryPanelReviews';
import styles from './ComponentLibraryPanel.module.css';

interface ComponentLibraryPanelContentProps {
  readonly copy: ComponentLibraryCopy;
  readonly entries: readonly ComponentLibraryEntry[];
  readonly visibleEntries: readonly ComponentLibraryEntry[];
  readonly name: string;
  readonly searchQuery: string;
  readonly sortMode: ComponentLibrarySortMode;
  readonly viewMode: ComponentLibraryViewMode;
  readonly canSave: boolean;
  readonly hasSelection: boolean;
  readonly latestRemapSummary: ComponentLibraryFieldRemapSummary | null;
  readonly remapReview: ComponentLibraryFieldRemapReview | null;
  readonly remapFieldOverrides: ComponentLibraryFieldOverrideMap;
  readonly restoreReview: ComponentLibraryRestoreReviewModel | null;
  readonly restoreSnapshotLabel: string;
  readonly updateReview: ComponentLibraryUpdateReviewModel | null;
  readonly updateSnapshotLabel: string;
  readonly editingEntryId: string | null;
  readonly editingName: string;
  readonly canReplace: boolean;
  readonly onNameChange: (name: string) => void;
  readonly onSearchQueryChange: (query: string) => void;
  readonly onSortModeChange: (mode: ComponentLibrarySortMode) => void;
  readonly onViewModeChange: (mode: ComponentLibraryViewMode) => void;
  readonly onSave: () => void;
  readonly onDismissRemapNotice: () => void;
  readonly onRemapFieldOverrideChange: (
    fieldKey: ComponentLibraryBindingFieldKey,
    sourceFieldId: string,
    targetFieldId: string | null,
  ) => void;
  readonly onConfirmRemapReview: () => void;
  readonly onCancelRemapReview: () => void;
  readonly onConfirmRestoreReview: () => void;
  readonly onCancelRestoreReview: () => void;
  readonly onSelectRestoreVersion: (versionIndex: number) => void;
  readonly onRestoreSnapshotLabelChange: (label: string) => void;
  readonly onSaveRestoreSnapshotLabel: () => void;
  readonly onDeleteRestoreVersion: () => void;
  readonly onConfirmUpdateReview: () => void;
  readonly onCancelUpdateReview: () => void;
  readonly onUpdateSnapshotLabelChange: (label: string) => void;
  readonly onEditingNameChange: (name: string) => void;
  readonly onStartRename: (entry: ComponentLibraryEntry) => void;
  readonly onCancelRename: () => void;
  readonly onSaveRename: (id: string) => void;
  readonly onInsert: (entry: ComponentLibraryEntry) => void;
  readonly onDuplicate: (entry: ComponentLibraryEntry) => void;
  readonly onReplace: (entry: ComponentLibraryEntry) => void;
  readonly onUpdate: (id: string) => void;
  readonly onRestore: (id: string, versionIndex?: number) => void;
  readonly onTogglePinned: (id: string) => void;
  readonly onRemove: (id: string) => void;
}

export function ComponentLibraryPanelContent({
  copy,
  entries,
  visibleEntries,
  name,
  searchQuery,
  sortMode,
  viewMode,
  canSave,
  hasSelection,
  latestRemapSummary,
  remapReview,
  remapFieldOverrides,
  restoreReview,
  restoreSnapshotLabel,
  updateReview,
  updateSnapshotLabel,
  editingEntryId,
  editingName,
  canReplace,
  onNameChange,
  onSearchQueryChange,
  onSortModeChange,
  onViewModeChange,
  onSave,
  onDismissRemapNotice,
  onRemapFieldOverrideChange,
  onConfirmRemapReview,
  onCancelRemapReview,
  onConfirmRestoreReview,
  onCancelRestoreReview,
  onSelectRestoreVersion,
  onRestoreSnapshotLabelChange,
  onSaveRestoreSnapshotLabel,
  onDeleteRestoreVersion,
  onConfirmUpdateReview,
  onCancelUpdateReview,
  onUpdateSnapshotLabelChange,
  onEditingNameChange,
  onStartRename,
  onCancelRename,
  onSaveRename,
  onInsert,
  onDuplicate,
  onReplace,
  onUpdate,
  onRestore,
  onTogglePinned,
  onRemove,
}: ComponentLibraryPanelContentProps) {
  return (
    <section data-builder-component-library="true" className={styles.componentLibraryPanel}>
      <ComponentLibraryPanelHeader copy={copy} entriesCount={entries.length} />
      <ComponentLibraryPanelControls
        copy={copy}
        name={name}
        searchQuery={searchQuery}
        sortMode={sortMode}
        viewMode={viewMode}
        visibleCount={visibleEntries.length}
        totalCount={entries.length}
        canSave={canSave}
        hasSelection={hasSelection}
        onNameChange={onNameChange}
        onSearchQueryChange={onSearchQueryChange}
        onSortModeChange={onSortModeChange}
        onViewModeChange={onViewModeChange}
        onSave={onSave}
      />
      <ComponentLibraryPanelReviews
        copy={copy}
        latestRemapSummary={latestRemapSummary}
        remapReview={remapReview}
        remapFieldOverrides={remapFieldOverrides}
        restoreReview={restoreReview}
        restoreSnapshotLabel={restoreSnapshotLabel}
        updateReview={updateReview}
        updateSnapshotLabel={updateSnapshotLabel}
        onDismissRemapNotice={onDismissRemapNotice}
        onRemapFieldOverrideChange={onRemapFieldOverrideChange}
        onConfirmRemapReview={onConfirmRemapReview}
        onCancelRemapReview={onCancelRemapReview}
        onConfirmRestoreReview={onConfirmRestoreReview}
        onCancelRestoreReview={onCancelRestoreReview}
        onSelectRestoreVersion={onSelectRestoreVersion}
        onRestoreSnapshotLabelChange={onRestoreSnapshotLabelChange}
        onSaveRestoreSnapshotLabel={onSaveRestoreSnapshotLabel}
        onDeleteRestoreVersion={onDeleteRestoreVersion}
        onConfirmUpdateReview={onConfirmUpdateReview}
        onCancelUpdateReview={onCancelUpdateReview}
        onUpdateSnapshotLabelChange={onUpdateSnapshotLabelChange}
      />
      <ComponentLibraryPanelList
        copy={copy}
        entries={entries}
        visibleEntries={visibleEntries}
        viewMode={viewMode}
        searchQuery={searchQuery}
        editingEntryId={editingEntryId}
        editingName={editingName}
        onEditingNameChange={onEditingNameChange}
        onStartRename={onStartRename}
        onCancelRename={onCancelRename}
        onSaveRename={onSaveRename}
        onInsert={onInsert}
        onDuplicate={onDuplicate}
        canReplace={canReplace}
        onReplace={onReplace}
        canUpdate={hasSelection}
        onUpdate={onUpdate}
        onRestore={onRestore}
        onTogglePinned={onTogglePinned}
        onRemove={onRemove}
      />
    </section>
  );
}
