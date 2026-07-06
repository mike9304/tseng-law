import type { ComponentLibraryCopy } from './component-library-copy';
import type { ComponentLibraryEntry } from './component-library-panel.helpers';
import type { ComponentLibraryRestoreReview as ComponentLibraryRestoreReviewModel } from './component-library-restore-review.helpers';
import { ComponentLibraryPanelPreview } from './ComponentLibraryPanelPreview';
import styles from './ComponentLibraryReviewPreviews.module.css';

interface ComponentLibraryRestoreReviewPreviewsProps {
  readonly copy: ComponentLibraryCopy;
  readonly review: ComponentLibraryRestoreReviewModel;
}

interface ComponentLibraryRestorePreviewConfig {
  readonly role: 'current' | 'previous';
  readonly label: string;
  readonly entry: ComponentLibraryEntry;
}

function makeComponentLibraryRestorePreviewInitial(label: string): string {
  return label.trim().slice(0, 1).toUpperCase() || '?';
}

function makeComponentLibraryRestorePreviewEntry(
  review: ComponentLibraryRestoreReviewModel,
  role: ComponentLibraryRestorePreviewConfig['role'],
  label: string,
  nodeJson: string,
): ComponentLibraryEntry {
  return {
    id: `${review.entryId}-${role}-preview`,
    name: `${review.entryName} ${label}`,
    nodeJson,
    createdAt: '',
  };
}

function getComponentLibraryRestorePreviewConfigs(
  copy: ComponentLibraryCopy,
  review: ComponentLibraryRestoreReviewModel,
): readonly ComponentLibraryRestorePreviewConfig[] {
  return [
    {
      role: 'current',
      label: copy.restoreReviewCurrentLabel,
      entry: makeComponentLibraryRestorePreviewEntry(
        review,
        'current',
        copy.restoreReviewCurrentLabel,
        review.currentNodeJson,
      ),
    },
    {
      role: 'previous',
      label: copy.restoreReviewPreviousLabel,
      entry: makeComponentLibraryRestorePreviewEntry(
        review,
        'previous',
        copy.restoreReviewPreviousLabel,
        review.restoredNodeJson,
      ),
    },
  ];
}

export function ComponentLibraryRestoreReviewPreviews({
  copy,
  review,
}: ComponentLibraryRestoreReviewPreviewsProps) {
  const previewConfigs = getComponentLibraryRestorePreviewConfigs(copy, review);

  return (
    <div
      className={styles.componentLibraryReviewPreviews}
      data-builder-component-library-restore-review-previews="true"
    >
      {previewConfigs.map((preview) => (
        <span
          key={preview.role}
          className={styles.componentLibraryReviewPreviewCard}
          data-builder-component-library-restore-review-preview={preview.role}
        >
          <strong className={styles.componentLibraryReviewPreviewLabel}>
            {preview.label}
          </strong>
          <span className={styles.componentLibraryReviewPreviewFrame}>
            <ComponentLibraryPanelPreview
              entry={preview.entry}
              initial={makeComponentLibraryRestorePreviewInitial(preview.label)}
            />
          </span>
        </span>
      ))}
    </div>
  );
}
