import type { ComponentLibraryCopy } from './component-library-copy';
import type { ComponentLibraryEntry } from './component-library-panel.helpers';
import type { ComponentLibraryUpdateReview as ComponentLibraryUpdateReviewModel } from './component-library-update-review.helpers';
import { ComponentLibraryPanelPreview } from './ComponentLibraryPanelPreview';
import styles from './ComponentLibraryReviewPreviews.module.css';

interface ComponentLibraryUpdateReviewPreviewsProps {
  readonly copy: ComponentLibraryCopy;
  readonly review: ComponentLibraryUpdateReviewModel;
}

interface ComponentLibraryUpdatePreviewConfig {
  readonly role: 'saved' | 'current';
  readonly label: string;
  readonly entry: ComponentLibraryEntry;
}

function makeComponentLibraryUpdatePreviewInitial(label: string): string {
  return label.trim().slice(0, 1).toUpperCase() || '?';
}

function makeComponentLibraryUpdatePreviewEntry(
  review: ComponentLibraryUpdateReviewModel,
  role: ComponentLibraryUpdatePreviewConfig['role'],
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

function getComponentLibraryUpdatePreviewConfigs(
  copy: ComponentLibraryCopy,
  review: ComponentLibraryUpdateReviewModel,
): readonly ComponentLibraryUpdatePreviewConfig[] {
  return [
    {
      role: 'saved',
      label: copy.updateReviewSavedLabel,
      entry: makeComponentLibraryUpdatePreviewEntry(
        review,
        'saved',
        copy.updateReviewSavedLabel,
        review.savedNodeJson,
      ),
    },
    {
      role: 'current',
      label: copy.updateReviewCurrentLabel,
      entry: makeComponentLibraryUpdatePreviewEntry(
        review,
        'current',
        copy.updateReviewCurrentLabel,
        review.nextNodeJson,
      ),
    },
  ];
}

export function ComponentLibraryUpdateReviewPreviews({
  copy,
  review,
}: ComponentLibraryUpdateReviewPreviewsProps) {
  const previewConfigs = getComponentLibraryUpdatePreviewConfigs(copy, review);

  return (
    <div
      className={styles.componentLibraryReviewPreviews}
      data-builder-component-library-update-review-previews="true"
    >
      {previewConfigs.map((preview) => (
        <span
          key={preview.role}
          className={styles.componentLibraryReviewPreviewCard}
          data-builder-component-library-update-review-preview={preview.role}
        >
          <strong className={styles.componentLibraryReviewPreviewLabel}>
            {preview.label}
          </strong>
          <span className={styles.componentLibraryReviewPreviewFrame}>
            <ComponentLibraryPanelPreview
              entry={preview.entry}
              initial={makeComponentLibraryUpdatePreviewInitial(preview.label)}
            />
          </span>
        </span>
      ))}
    </div>
  );
}
