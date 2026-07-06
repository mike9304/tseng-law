import type { ComponentLibraryCopy } from './component-library-copy';
import type {
  ComponentLibraryReviewDiffDetail,
  ComponentLibraryReviewDiffItem,
  ComponentLibraryReviewDiffSummary,
} from './component-library-review-diff.helpers';
import detailStyles from './ComponentLibraryReviewDiffChips.module.css';
import styles from './ComponentLibraryUpdateReview.module.css';

type ComponentLibraryReviewDiffSurface = 'update' | 'restore';

interface ComponentLibraryReviewDiffChipsProps {
  readonly copy: ComponentLibraryCopy;
  readonly diffSummary: ComponentLibraryReviewDiffSummary;
  readonly surface: ComponentLibraryReviewDiffSurface;
}

function formatComponentLibraryReviewDiffItem(
  copy: ComponentLibraryCopy,
  item: ComponentLibraryReviewDiffItem,
): string {
  switch (item.kind) {
    case 'rootKind':
      return copy.reviewDiffRootKindLabel(item.previousRootKind, item.nextRootKind);
    case 'nodeCount':
      return copy.reviewDiffNodeDeltaLabel(item.delta);
    case 'text':
      return copy.reviewDiffTextChangedLabel;
    case 'binding':
      return copy.reviewDiffBindingChangedLabel;
  }
  const exhaustive: never = item;
  return exhaustive;
}

function formatComponentLibraryReviewDiffDetail(
  copy: ComponentLibraryCopy,
  detail: ComponentLibraryReviewDiffDetail,
): string {
  switch (detail.kind) {
    case 'text':
      return copy.reviewDiffTextDetailLabel(detail.previousText, detail.nextText);
    case 'binding':
      return copy.reviewDiffBindingDetailLabel(detail.previousBinding, detail.nextBinding);
  }
  const exhaustive: never = detail;
  return exhaustive;
}

export function ComponentLibraryReviewDiffChips({
  copy,
  diffSummary,
  surface,
}: ComponentLibraryReviewDiffChipsProps) {
  return (
    <div
      className={styles.componentLibraryUpdateReviewDiff}
      data-builder-component-library-update-review-diff={surface === 'update' ? 'true' : undefined}
      data-builder-component-library-restore-review-diff={surface === 'restore' ? 'true' : undefined}
    >
      <strong>{copy.reviewDiffTitle}</strong>
      <span className={styles.componentLibraryUpdateReviewDiffChips}>
        {diffSummary.hasChanges ? diffSummary.items.map((item, index) => (
          <span key={`${item.kind}-${index}`} className={styles.componentLibraryUpdateReviewDiffChip}>
            {formatComponentLibraryReviewDiffItem(copy, item)}
          </span>
        )) : (
          <span className={styles.componentLibraryUpdateReviewDiffChip}>{copy.reviewDiffEmptyLabel}</span>
        )}
      </span>
      {diffSummary.details.length > 0 ? (
        <span
          className={detailStyles.componentLibraryReviewDiffDetails}
          data-builder-component-library-review-diff-details="true"
        >
          <strong className={detailStyles.componentLibraryReviewDiffDetailsTitle}>{copy.reviewDiffDetailsTitle}</strong>
          {diffSummary.details.map((detail, index) => (
            <span
              key={`${detail.kind}-${index}`}
              className={detailStyles.componentLibraryReviewDiffDetail}
              data-builder-component-library-review-diff-detail={detail.kind}
            >
              {formatComponentLibraryReviewDiffDetail(copy, detail)}
            </span>
          ))}
        </span>
      ) : null}
    </div>
  );
}
