import type { ComponentLibraryCopy } from './component-library-copy';
import { getComponentLibraryKindLabel } from './component-library-kind-labels';

const EN_KIND_LABELS: Readonly<Record<string, string>> = {
  button: 'Button',
  composite: 'Section',
  container: 'Container',
  form: 'Form',
  heading: 'Heading',
  image: 'Image',
  repeaterTemplateGroup: 'Template group',
  section: 'Section',
  text: 'Text',
};

function formatElementCount(count: number): string {
  return `${count} ${count === 1 ? 'element' : 'elements'}`;
}

export function getEnComponentLibraryCopy(): ComponentLibraryCopy {
  return {
    eyebrow: 'My designs',
    title: (count) => `Component library · ${count}`,
    description: 'Save selected elements or sections and reuse them across pages.',
    namePlaceholder: 'Name',
    saveAction: 'Save',
    selectFirstHint: 'Select a node first to save it to the library.',
    emptyTitle: 'No saved items yet',
    emptyState: 'No saved components yet.',
    searchLabel: 'Search',
    searchPlaceholder: 'Search saved components',
    sortLabel: 'Sort',
    sortRecent: 'Recent',
    sortName: 'Name',
    viewLabel: 'View',
    viewList: 'List',
    viewGrid: 'Grid',
    viewListAriaLabel: 'List view',
    viewGridAriaLabel: 'Grid view',
    shortcutTitle: 'My designs shortcut',
    shortcutDescription: (count) => `Open ${count} saved ${count === 1 ? 'component' : 'components'}`,
    shortcutAction: 'Open',
    shortcutAriaLabel: 'Go to component library',
    shortcutRecentTitle: 'Recent designs',
    shortcutPinnedTitle: 'Pinned designs',
    shortcutInvalidNotice: (count) => `${count} saved ${count === 1 ? 'item needs' : 'items need'} review in the full library.`,
    shortcutQuickInsertAction: 'Insert',
    shortcutQuickInsertAriaLabel: (name) => `Quick insert "${name}"`,
    remapNoticeTitle: 'Data fields adjusted',
    remapNoticeSummary: (remappedCount, droppedCount) => `${remappedCount} changed · ${droppedCount} removed`,
    remapNoticeTargetLabel: (targetId) => `Target: ${targetId}`,
    remapNoticeChangedLabel: (sourceFieldId, targetFieldId) => `${sourceFieldId} -> ${targetFieldId}`,
    remapNoticeDroppedLabel: (sourceFieldId) => `${sourceFieldId} removed`,
    remapNoticeDismissAction: 'Close',
    remapReviewTitle: 'Review fields',
    remapReviewDescription: (fieldCount, targetId) => `${fieldCount} fields for ${targetId}`,
    remapReviewFieldLabel: (sourceFieldLabel, fieldKey) => `${sourceFieldLabel} · ${fieldKey}`,
    remapReviewCurrentLabel: (targetFieldId) => (targetFieldId ? `Current: ${targetFieldId}` : 'Current: removed'),
    remapReviewSelectAriaLabel: (sourceFieldLabel) => `Choose target field for ${sourceFieldLabel}`,
    remapReviewDropOption: 'Remove this field',
    remapReviewNoOptions: 'No compatible fields',
    remapReviewConfirmAction: 'Insert',
    remapReviewCancelAction: 'Cancel',
    resultsLabel: (visible, total) => `Showing ${visible}/${total}`,
    searchEmptyState: (query) => `No saved components match "${query}".`,
    insertAction: 'Insert',
    insertAriaLabel: (name) => `Insert "${name}"`,
    invalidInsertAriaLabel: (name) => `"${name}" needs review before it can be inserted`,
    invalidInsertTitle: 'Review the saved data before inserting.',
    replaceAction: 'Replace',
    replaceAriaLabel: (name) => `Replace selected element with "${name}"`,
    replaceDisabledTitle: 'Select one canvas element to replace.',
    duplicateAction: 'Duplicate',
    duplicateAriaLabel: (name) => `Duplicate "${name}"`,
    duplicateName: (name) => `${name} copy`,
    updateAction: 'Update from current selection',
    updateAriaLabel: (name) => `Update "${name}" from current selection`,
    updateDisabledTitle: 'Select an element on the canvas first.',
    updateReviewTitle: 'Review update',
    updateReviewDescription: (name) => `Compare before replacing "${name}" with the current selection.`,
    updateReviewSavedLabel: 'Saved',
    updateReviewCurrentLabel: 'Current selection',
    updateReviewSnapshotLabel: 'Snapshot name',
    updateReviewSnapshotPlaceholder: 'Example: original hero',
    reviewDiffTitle: 'Structure changes',
    reviewDiffEmptyLabel: 'No changes',
    reviewDiffRootKindLabel: (previousRootKind, nextRootKind) => (
      `${getComponentLibraryKindLabel(EN_KIND_LABELS, 'Widget', previousRootKind)} → ${getComponentLibraryKindLabel(EN_KIND_LABELS, 'Widget', nextRootKind)}`
    ),
    reviewDiffNodeDeltaLabel: (delta) => (
      delta > 0 ? `${formatElementCount(delta)} added` : `${formatElementCount(Math.abs(delta))} removed`
    ),
    reviewDiffTextChangedLabel: 'Text changed',
    reviewDiffBindingChangedLabel: 'Bindings changed',
    reviewDiffDetailsTitle: 'Change details',
    reviewDiffTextDetailLabel: (previousText, nextText) => `Text: ${previousText} → ${nextText}`,
    reviewDiffBindingDetailLabel: (previousBinding, nextBinding) => `Binding: ${previousBinding} → ${nextBinding}`,
    updateReviewConfirmAction: 'Update',
    updateReviewCancelAction: 'Cancel',
    updatedBadge: 'Updated',
    restoreAction: 'Restore previous version',
    restoreAriaLabel: (name) => `Restore previous version of "${name}"`,
    restoreReviewTitle: 'Review restore',
    restoreReviewDescription: (name) => `Compare before restoring the previous version of "${name}".`,
    restoreReviewCurrentLabel: 'Current saved',
    restoreReviewPreviousLabel: 'Previous version',
    restoreReviewVersionGroupLabel: 'Version to restore',
    restoreReviewVersionLabel: (position, dateLabel, snapshotLabel) => (
      snapshotLabel ? `Version ${position} · ${snapshotLabel}` : `Version ${position} · ${dateLabel}`
    ),
    restoreReviewVersionAriaLabel: (position, dateLabel, snapshotLabel) => (
      snapshotLabel
        ? `Select version ${position}, ${snapshotLabel}, from ${dateLabel}`
        : `Select version ${position} from ${dateLabel}`
    ),
    restoreReviewSnapshotLabel: 'Snapshot name',
    restoreReviewSnapshotPlaceholder: 'Example: original hero',
    restoreReviewSnapshotSaveAction: 'Save name',
    restoreReviewSnapshotDeleteAction: 'Delete version',
    restoreReviewSnapshotDeleteAriaLabel: (position) => `Delete version ${position}`,
    restoreReviewConfirmAction: 'Restore',
    restoreReviewCancelAction: 'Cancel',
    versionBadge: (count) => `${count} previous ${count === 1 ? 'version' : 'versions'}`,
    entryMetaLabel: (rootKind, nodeCount, isValid) => (
      isValid
        ? `${getComponentLibraryKindLabel(EN_KIND_LABELS, 'Widget', rootKind)} · ${nodeCount} ${nodeCount === 1 ? 'element' : 'elements'}`
        : 'Saved data needs review'
    ),
    pinAction: 'Pin',
    pinAriaLabel: (name) => `Pin "${name}"`,
    unpinAction: 'Unpin',
    unpinAriaLabel: (name) => `Unpin "${name}"`,
    pinnedBadge: 'Pinned',
    renameAction: 'Rename',
    renameAriaLabel: (name) => `Rename "${name}"`,
    renamePlaceholder: 'New name',
    renameSaveAction: 'Save',
    renameCancelAction: 'Cancel',
    deleteAction: 'Delete',
    deleteAriaLabel: (name) => `Delete "${name}"`,
    dateLocale: 'en-US',
  };
}
