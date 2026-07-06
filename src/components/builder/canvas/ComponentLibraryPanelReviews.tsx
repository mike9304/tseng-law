import type { ComponentLibraryCopy } from './component-library-copy';
import {
  type ComponentLibraryBindingFieldKey,
  type ComponentLibraryFieldOverrideMap,
} from './component-library-field-remap.helpers';
import type { ComponentLibraryFieldRemapSummary } from './component-library-panel.helpers';
import type { ComponentLibraryFieldRemapReview } from './component-library-remap-review.helpers';
import type { ComponentLibraryRestoreReview as ComponentLibraryRestoreReviewModel } from './component-library-restore-review.helpers';
import type { ComponentLibraryUpdateReview as ComponentLibraryUpdateReviewModel } from './component-library-update-review.helpers';
import { ComponentLibraryRemapNotice } from './ComponentLibraryRemapNotice';
import { ComponentLibraryRemapReview } from './ComponentLibraryRemapReview';
import { ComponentLibraryRestoreReview } from './ComponentLibraryRestoreReview';
import { ComponentLibraryUpdateReview } from './ComponentLibraryUpdateReview';

interface ComponentLibraryPanelReviewsProps {
  readonly copy: ComponentLibraryCopy;
  readonly latestRemapSummary: ComponentLibraryFieldRemapSummary | null;
  readonly remapReview: ComponentLibraryFieldRemapReview | null;
  readonly remapFieldOverrides: ComponentLibraryFieldOverrideMap;
  readonly restoreReview: ComponentLibraryRestoreReviewModel | null;
  readonly restoreSnapshotLabel: string;
  readonly updateReview: ComponentLibraryUpdateReviewModel | null;
  readonly updateSnapshotLabel: string;
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
}

export function ComponentLibraryPanelReviews({
  copy,
  latestRemapSummary,
  remapReview,
  remapFieldOverrides,
  restoreReview,
  restoreSnapshotLabel,
  updateReview,
  updateSnapshotLabel,
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
}: ComponentLibraryPanelReviewsProps) {
  return (
    <>
      <ComponentLibraryRemapNotice
        copy={copy}
        summary={latestRemapSummary}
        onDismiss={onDismissRemapNotice}
      />

      <ComponentLibraryRemapReview
        copy={copy}
        review={remapReview}
        fieldOverrides={remapFieldOverrides}
        onFieldOverrideChange={onRemapFieldOverrideChange}
        onConfirm={onConfirmRemapReview}
        onCancel={onCancelRemapReview}
      />

      <ComponentLibraryRestoreReview
        copy={copy}
        review={restoreReview}
        snapshotLabel={restoreSnapshotLabel}
        onConfirm={onConfirmRestoreReview}
        onCancel={onCancelRestoreReview}
        onSelectVersion={onSelectRestoreVersion}
        onSnapshotLabelChange={onRestoreSnapshotLabelChange}
        onSaveSnapshotLabel={onSaveRestoreSnapshotLabel}
        onDeleteVersion={onDeleteRestoreVersion}
      />

      <ComponentLibraryUpdateReview
        copy={copy}
        review={updateReview}
        snapshotLabel={updateSnapshotLabel}
        onConfirm={onConfirmUpdateReview}
        onCancel={onCancelUpdateReview}
        onSnapshotLabelChange={onUpdateSnapshotLabelChange}
      />
    </>
  );
}
