import type { ComponentLibraryCopy } from './component-library-copy';
import type {
  ComponentLibraryEntrySummary,
} from './component-library-panel.helpers';
import type { ComponentLibraryUpdateReview as ComponentLibraryUpdateReviewModel } from './component-library-update-review.helpers';
import { ComponentLibraryReviewDiffChips } from './ComponentLibraryReviewDiffChips';
import { ComponentLibraryUpdateReviewPreviews } from './ComponentLibraryUpdateReviewPreviews';
import styles from './ComponentLibraryUpdateReview.module.css';

interface ComponentLibraryUpdateReviewProps {
  readonly copy: ComponentLibraryCopy;
  readonly review: ComponentLibraryUpdateReviewModel | null;
  readonly snapshotLabel: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly onSnapshotLabelChange: (label: string) => void;
}

interface ComponentLibraryUpdateReviewSummaryProps {
  readonly copy: ComponentLibraryCopy;
  readonly label: string;
  readonly summary: ComponentLibraryEntrySummary;
  readonly dataRole: 'saved' | 'current';
}

function ComponentLibraryUpdateReviewSummary({
  copy,
  label,
  summary,
  dataRole,
}: ComponentLibraryUpdateReviewSummaryProps) {
  return (
    <span
      className={styles.componentLibraryUpdateReviewSummary}
      data-builder-component-library-update-review-summary={dataRole}
    >
      <strong>{label}</strong>
      <span>{copy.entryMetaLabel(summary.rootKind, summary.nodeCount, summary.isValid)}</span>
    </span>
  );
}

export function ComponentLibraryUpdateReview({
  copy,
  review,
  snapshotLabel,
  onConfirm,
  onCancel,
  onSnapshotLabelChange,
}: ComponentLibraryUpdateReviewProps) {
  if (!review) return null;

  return (
    <aside
      className={`${styles.componentLibraryUpdateReview} ${styles.componentLibraryUpdateReviewScrollable}`}
      data-builder-component-library-update-review="true"
      data-builder-component-library-update-review-entry={review.entryId}
      aria-label={copy.updateReviewTitle}
    >
      <div className={styles.componentLibraryUpdateReviewHeader}>
        <span className={styles.componentLibraryUpdateReviewTitle}>
          <strong>{copy.updateReviewTitle}</strong>
          <span>{copy.updateReviewDescription(review.entryName)}</span>
        </span>
      </div>

      <div className={styles.componentLibraryUpdateReviewSummaries}>
        <ComponentLibraryUpdateReviewSummary
          copy={copy}
          label={copy.updateReviewSavedLabel}
          summary={review.savedSummary}
          dataRole="saved"
        />
        <ComponentLibraryUpdateReviewSummary
          copy={copy}
          label={copy.updateReviewCurrentLabel}
          summary={review.nextSummary}
          dataRole="current"
        />
      </div>

      <ComponentLibraryUpdateReviewPreviews copy={copy} review={review} />

      <ComponentLibraryReviewDiffChips
        copy={copy}
        diffSummary={review.diffSummary}
        surface="update"
      />

      <label className={styles.componentLibraryUpdateReviewSnapshotField}>
        <span>{copy.updateReviewSnapshotLabel}</span>
        <input
          type="text"
          value={snapshotLabel}
          maxLength={80}
          placeholder={copy.updateReviewSnapshotPlaceholder}
          aria-label={copy.updateReviewSnapshotLabel}
          data-builder-component-library-update-review-snapshot-label="true"
          onChange={(event) => onSnapshotLabelChange(event.currentTarget.value)}
        />
      </label>

      <div className={`${styles.componentLibraryUpdateReviewActions} ${styles.componentLibraryUpdateReviewPrimaryActions}`}>
        <button
          type="button"
          className={styles.componentLibraryUpdateReviewCancel}
          data-builder-component-library-update-review-cancel="true"
          onClick={onCancel}
        >
          {copy.updateReviewCancelAction}
        </button>
        <button
          type="button"
          className={styles.componentLibraryUpdateReviewConfirm}
          data-builder-component-library-update-review-confirm="true"
          onClick={onConfirm}
        >
          {copy.updateReviewConfirmAction}
        </button>
      </div>
    </aside>
  );
}
