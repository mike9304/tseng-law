import type { ComponentLibraryCopy } from './component-library-copy';
import type { ComponentLibraryEntry } from './component-library-panel.helpers';
import type {
  ComponentLibraryRestoreReview as ComponentLibraryRestoreReviewModel,
  ComponentLibraryRestoreReviewVersion,
} from './component-library-restore-review.helpers';
import { ComponentLibraryPanelPreview } from './ComponentLibraryPanelPreview';
import previewStyles from './ComponentLibraryRestoreReviewPreview.module.css';
import styles from './ComponentLibraryUpdateReview.module.css';

interface ComponentLibraryRestoreReviewVersionsProps {
  readonly copy: ComponentLibraryCopy;
  readonly review: ComponentLibraryRestoreReviewModel;
  readonly onSelectVersion: (versionIndex: number) => void;
}

function formatComponentLibraryRestoreDate(savedAt: string, locale: string): string {
  const date = new Date(savedAt);
  if (Number.isNaN(date.getTime())) return savedAt;
  return date.toLocaleDateString(locale);
}

function makeComponentLibraryRestoreVersionPreviewEntry(
  review: ComponentLibraryRestoreReviewModel,
  version: ComponentLibraryRestoreReviewVersion,
  name: string,
): ComponentLibraryEntry {
  return {
    id: `${review.entryId}-version-${version.index}-preview`,
    name,
    nodeJson: version.nodeJson,
    createdAt: version.savedAt,
  };
}

function makeComponentLibraryRestoreVersionInitial(position: number): string {
  return position.toString();
}

export function ComponentLibraryRestoreReviewVersions({
  copy,
  review,
  onSelectVersion,
}: ComponentLibraryRestoreReviewVersionsProps) {
  if (review.versions.length === 0) return null;

  return (
    <div
      className={styles.componentLibraryUpdateReviewVersionGroup}
      data-builder-component-library-restore-review-versions="true"
      aria-label={copy.restoreReviewVersionGroupLabel}
    >
      <strong>{copy.restoreReviewVersionGroupLabel}</strong>
      <div className={styles.componentLibraryUpdateReviewVersions}>
        {review.versions.map((version, index) => {
          const position = index + 1;
          const dateLabel = formatComponentLibraryRestoreDate(version.savedAt, copy.dateLocale);
          const versionLabel = copy.restoreReviewVersionLabel(position, dateLabel, version.label);
          const previewEntry = makeComponentLibraryRestoreVersionPreviewEntry(review, version, versionLabel);
          return (
            <button
              key={`${version.index}-${version.savedAt}`}
              type="button"
              className={`${styles.componentLibraryUpdateReviewVersionButton} ${previewStyles.componentLibraryRestoreReviewVersionButton}`}
              data-builder-component-library-restore-review-version={version.index}
              aria-pressed={version.index === review.selectedVersionIndex}
              aria-label={copy.restoreReviewVersionAriaLabel(position, dateLabel, version.label)}
              onClick={() => onSelectVersion(version.index)}
            >
              <span
                className={previewStyles.componentLibraryRestoreReviewVersionPreview}
                data-builder-component-library-restore-review-version-preview={version.index}
              >
                <ComponentLibraryPanelPreview
                  entry={previewEntry}
                  initial={makeComponentLibraryRestoreVersionInitial(position)}
                />
              </span>
              <span>{versionLabel}</span>
              {version.label ? (
                <span data-builder-component-library-restore-review-version-date={version.index}>{dateLabel}</span>
              ) : null}
              <span>{copy.entryMetaLabel(version.summary.rootKind, version.summary.nodeCount, version.summary.isValid)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
