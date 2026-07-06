import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderFormSubmitCanvasNode } from '@/lib/builder/canvas/types';
import {
  FORM_SUBMIT_KO_DEFAULTS,
  getFormControlsCopy,
  localizedFormControlText,
} from '../form/form-controls-copy';
import styles from './FormSubmitInspector.module.css';

export default function FormSubmitInspector({
  node,
  locale,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const submitNode = node as BuilderFormSubmitCanvasNode;
  const c = submitNode.content;
  const copy = getFormControlsCopy(locale ?? 'ko');
  const label = localizedFormControlText(c.label, copy.fieldDefaults.submitLabel, FORM_SUBMIT_KO_DEFAULTS.label);
  const loadingLabel = localizedFormControlText(
    c.loadingLabel,
    copy.fieldDefaults.submitLoadingLabel,
    FORM_SUBMIT_KO_DEFAULTS.loadingLabel,
  );

  return (
    <div className={styles.root} data-builder-form-submit-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.submitInspector.labelLabel}</span>
        <input
          type="text"
          value={label}
          disabled={disabled}
          onChange={(event) => onUpdate({ label: event.target.value })}
          placeholder={copy.submitInspector.labelPlaceholder}
          className={styles.control}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.submitInspector.styleLabel}</span>
        <select
          value={c.style}
          disabled={disabled}
          onChange={(event) => onUpdate({ style: event.target.value })}
          className={styles.control}
        >
          <option value="primary">{copy.submitInspector.styleOptions.primary}</option>
          <option value="secondary">{copy.submitInspector.styleOptions.secondary}</option>
          <option value="outline">{copy.submitInspector.styleOptions.outline}</option>
          <option value="ghost">{copy.submitInspector.styleOptions.ghost}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.submitInspector.loadingLabelLabel}</span>
        <input
          type="text"
          value={loadingLabel}
          disabled={disabled}
          onChange={(event) => onUpdate({ loadingLabel: event.target.value })}
          placeholder={copy.submitInspector.loadingLabelPlaceholder}
          className={styles.control}
        />
      </label>
      <label className={styles.checkboxField}>
        <input
          type="checkbox"
          checked={c.fullWidth}
          disabled={disabled}
          onChange={(event) => onUpdate({ fullWidth: event.target.checked })}
          className={styles.checkbox}
        />
        <span>{copy.submitInspector.fullWidthLabel}</span>
      </label>
    </div>
  );
}
