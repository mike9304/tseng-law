import type { ComponentLibraryCopy } from './component-library-copy';
import {
  makeComponentLibraryFieldOverrideKey,
  type ComponentLibraryBindingFieldKey,
  type ComponentLibraryFieldOverrideMap,
} from './component-library-field-remap.helpers';
import type { ComponentLibraryFieldRemapReview } from './component-library-remap-review.helpers';
import styles from './ComponentLibraryRemapReview.module.css';

interface ComponentLibraryRemapReviewProps {
  readonly copy: ComponentLibraryCopy;
  readonly review: ComponentLibraryFieldRemapReview | null;
  readonly fieldOverrides: ComponentLibraryFieldOverrideMap;
  readonly onFieldOverrideChange: (
    fieldKey: ComponentLibraryBindingFieldKey,
    sourceFieldId: string,
    targetFieldId: string | null,
  ) => void;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export function ComponentLibraryRemapReview({
  copy,
  review,
  fieldOverrides,
  onFieldOverrideChange,
  onConfirm,
  onCancel,
}: ComponentLibraryRemapReviewProps) {
  if (!review) return null;

  return (
    <aside
      className={styles.componentLibraryRemapReview}
      data-builder-component-library-remap-review="true"
      data-builder-component-library-remap-review-target={review.targetId}
      aria-label={copy.remapReviewTitle}
    >
      <div className={styles.componentLibraryRemapReviewHeader}>
        <span className={styles.componentLibraryRemapReviewTitle}>
          <strong>{copy.remapReviewTitle}</strong>
          <span>{copy.remapReviewDescription(review.fields.length, review.targetId)}</span>
        </span>
      </div>

      <div className={styles.componentLibraryRemapReviewRows}>
        {review.fields.map((field) => {
          const overrideKey = makeComponentLibraryFieldOverrideKey(field.fieldKey, field.sourceFieldId);
          const selectedValue = fieldOverrides[overrideKey] ?? '';
          return (
            <label
              key={overrideKey}
              className={styles.componentLibraryRemapReviewRow}
              data-builder-component-library-remap-review-field={field.fieldKey}
              data-builder-component-library-remap-review-source-field={field.sourceFieldId}
            >
              <span className={styles.componentLibraryRemapReviewSource}>
                <strong>{copy.remapReviewFieldLabel(field.sourceFieldLabel, field.fieldKey)}</strong>
                <span>{copy.remapReviewCurrentLabel(field.currentFieldId)}</span>
              </span>
              <select
                className={styles.componentLibraryRemapReviewSelect}
                data-builder-component-library-remap-review-select="true"
                value={selectedValue ?? ''}
                disabled={field.options.length === 0}
                aria-label={copy.remapReviewSelectAriaLabel(field.sourceFieldLabel)}
                onChange={(event) => {
                  const nextValue = event.currentTarget.value;
                  onFieldOverrideChange(field.fieldKey, field.sourceFieldId, nextValue.length > 0 ? nextValue : null);
                }}
              >
                <option value="">
                  {field.options.length > 0 ? copy.remapReviewDropOption : copy.remapReviewNoOptions}
                </option>
                {field.options.map((option) => (
                  <option key={option.fieldId} value={option.fieldId}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          );
        })}
      </div>

      <div className={styles.componentLibraryRemapReviewActions}>
        <button
          type="button"
          className={styles.componentLibraryRemapReviewCancel}
          data-builder-component-library-remap-review-cancel="true"
          onClick={onCancel}
        >
          {copy.remapReviewCancelAction}
        </button>
        <button
          type="button"
          className={styles.componentLibraryRemapReviewConfirm}
          data-builder-component-library-remap-review-confirm="true"
          onClick={onConfirm}
        >
          {copy.remapReviewConfirmAction}
        </button>
      </div>
    </aside>
  );
}
