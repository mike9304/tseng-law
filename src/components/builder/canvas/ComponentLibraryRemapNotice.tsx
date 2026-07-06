import type { ComponentLibraryCopy } from './component-library-copy';
import type { ComponentLibraryFieldRemapSummary } from './component-library-panel.helpers';
import styles from './ComponentLibraryRemapNotice.module.css';

interface ComponentLibraryRemapNoticeProps {
  readonly copy: ComponentLibraryCopy;
  readonly summary: ComponentLibraryFieldRemapSummary | null;
  readonly onDismiss: () => void;
}

export function ComponentLibraryRemapNotice({
  copy,
  summary,
  onDismiss,
}: ComponentLibraryRemapNoticeProps) {
  if (!summary) return null;

  return (
    <aside
      className={styles.componentLibraryRemapNotice}
      data-builder-component-library-remap-notice="true"
      data-builder-component-library-remap-target={summary.targetId}
      role="status"
    >
      <div className={styles.componentLibraryRemapNoticeHeader}>
        <span className={styles.componentLibraryRemapNoticeTitle}>
          <strong>{copy.remapNoticeTitle}</strong>
          <span>
            {copy.remapNoticeSummary(summary.remappedFields.length, summary.droppedFields.length)}
            {' · '}
            {copy.remapNoticeTargetLabel(summary.targetId)}
          </span>
        </span>
        <button
          type="button"
          className={styles.componentLibraryRemapNoticeDismiss}
          data-builder-component-library-remap-dismiss="true"
          aria-label={copy.remapNoticeDismissAction}
          onClick={onDismiss}
        >
          {copy.remapNoticeDismissAction}
        </button>
      </div>

      <ul className={styles.componentLibraryRemapNoticeList}>
        {summary.remappedFields.map((field) => (
          <li
            key={`remapped-${field.fieldKey}-${field.sourceFieldId}-${field.targetFieldId}`}
            className={styles.componentLibraryRemapNoticeChip}
            data-builder-component-library-remap-changed="true"
          >
            {copy.remapNoticeChangedLabel(field.sourceFieldId, field.targetFieldId)}
          </li>
        ))}
        {summary.droppedFields.map((field) => (
          <li
            key={`dropped-${field.fieldKey}-${field.sourceFieldId}`}
            className={styles.componentLibraryRemapNoticeChip}
            data-builder-component-library-remap-dropped="true"
          >
            {copy.remapNoticeDroppedLabel(field.sourceFieldId)}
          </li>
        ))}
      </ul>
    </aside>
  );
}
