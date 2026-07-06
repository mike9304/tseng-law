import type { ComponentLibraryCopy } from './component-library-copy';
import type { ComponentLibraryEntrySummary } from './component-library-panel.helpers';
import type { ComponentLibraryRestoreReview as ComponentLibraryRestoreReviewModel } from './component-library-restore-review.helpers';
import { ComponentLibraryReviewDiffChips } from './ComponentLibraryReviewDiffChips';
import { ComponentLibraryRestoreReviewPreviews } from './ComponentLibraryRestoreReviewPreviews';
import { ComponentLibraryRestoreReviewVersions } from './ComponentLibraryRestoreReviewVersions';
import previewStyles from './ComponentLibraryRestoreReviewPreview.module.css';
import styles from './ComponentLibraryUpdateReview.module.css';

interface ComponentLibraryRestoreReviewProps {
  readonly copy: ComponentLibraryCopy;
  readonly review: ComponentLibraryRestoreReviewModel | null;
  readonly snapshotLabel: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly onSelectVersion: (versionIndex: number) => void;
  readonly onSnapshotLabelChange: (label: string) => void;
  readonly onSaveSnapshotLabel: () => void;
  readonly onDeleteVersion: () => void;
}

interface ComponentLibraryRestoreReviewSummaryProps {
  readonly copy: ComponentLibraryCopy;
  readonly label: string;
  readonly summary: ComponentLibraryEntrySummary;
  readonly dataRole: 'current' | 'previous';
}

function ComponentLibraryRestoreReviewSummary({
  copy,
  label,
  summary,
  dataRole,
}: ComponentLibraryRestoreReviewSummaryProps) {
  return (
    <span
      className={styles.componentLibraryUpdateReviewSummary}
      data-builder-component-library-restore-review-summary={dataRole}
    >
      <strong>{label}</strong>
      <span>{copy.entryMetaLabel(summary.rootKind, summary.nodeCount, summary.isValid)}</span>
    </span>
  );
}

export function ComponentLibraryRestoreReview({
  copy,
  review,
  snapshotLabel,
  onConfirm,
  onCancel,
  onSelectVersion,
  onSnapshotLabelChange,
  onSaveSnapshotLabel,
  onDeleteVersion,
}: ComponentLibraryRestoreReviewProps) {
  if (!review) return null;
  const selectedPosition = Math.max(
    1,
    review.versions.findIndex((version) => version.index === review.selectedVersionIndex) + 1,
  );

  return (
    <aside
      className={`${styles.componentLibraryUpdateReview} ${previewStyles.componentLibraryRestoreReview}`}
      data-builder-component-library-restore-review="true"
      data-builder-component-library-restore-review-entry={review.entryId}
      aria-label={copy.restoreReviewTitle}
    >
      <div className={styles.componentLibraryUpdateReviewHeader}>
        <span className={styles.componentLibraryUpdateReviewTitle}>
          <strong>{copy.restoreReviewTitle}</strong>
          <span>{copy.restoreReviewDescription(review.entryName)}</span>
        </span>
      </div>

      <div className={styles.componentLibraryUpdateReviewSummaries}>
        <ComponentLibraryRestoreReviewSummary
          copy={copy}
          label={copy.restoreReviewCurrentLabel}
          summary={review.currentSummary}
          dataRole="current"
        />
        <ComponentLibraryRestoreReviewSummary
          copy={copy}
          label={copy.restoreReviewPreviousLabel}
          summary={review.previousSummary}
          dataRole="previous"
        />
      </div>

      <ComponentLibraryReviewDiffChips
        copy={copy}
        diffSummary={review.diffSummary}
        surface="restore"
      />

      <ComponentLibraryRestoreReviewPreviews copy={copy} review={review} />

      <ComponentLibraryRestoreReviewVersions
        copy={copy}
        review={review}
        onSelectVersion={onSelectVersion}
      />

      <label className={styles.componentLibraryUpdateReviewSnapshotField}>
        <span>{copy.restoreReviewSnapshotLabel}</span>
        <input
          type="text"
          value={snapshotLabel}
          maxLength={80}
          placeholder={copy.restoreReviewSnapshotPlaceholder}
          aria-label={copy.restoreReviewSnapshotLabel}
          data-builder-component-library-restore-review-snapshot-label="true"
          onChange={(event) => onSnapshotLabelChange(event.currentTarget.value)}
        />
      </label>

      <div className={styles.componentLibraryUpdateReviewActions}>
        <button
          type="button"
          className={styles.componentLibraryUpdateReviewConfirm}
          data-builder-component-library-restore-review-snapshot-save="true"
          onClick={onSaveSnapshotLabel}
        >
          {copy.restoreReviewSnapshotSaveAction}
        </button>
        <button
          type="button"
          className={styles.componentLibraryUpdateReviewDanger}
          data-builder-component-library-restore-review-snapshot-delete="true"
          aria-label={copy.restoreReviewSnapshotDeleteAriaLabel(selectedPosition)}
          onClick={onDeleteVersion}
        >
          {copy.restoreReviewSnapshotDeleteAction}
        </button>
      </div>

      <div className={`${styles.componentLibraryUpdateReviewActions} ${previewStyles.componentLibraryRestoreReviewPrimaryActions}`}>
        <button
          type="button"
          className={styles.componentLibraryUpdateReviewCancel}
          data-builder-component-library-restore-review-cancel="true"
          onClick={onCancel}
        >
          {copy.restoreReviewCancelAction}
        </button>
        <button
          type="button"
          className={styles.componentLibraryUpdateReviewConfirm}
          data-builder-component-library-restore-review-confirm="true"
          onClick={onConfirm}
        >
          {copy.restoreReviewConfirmAction}
        </button>
      </div>
    </aside>
  );
}
