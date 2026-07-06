import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderFormDateCanvasNode } from '@/lib/builder/canvas/types';
import {
  FORM_DATE_KO_DEFAULTS,
  getFormControlsCopy,
  localizedFormControlText,
} from '../form/form-controls-copy';
import {
  FORM_INPUT_VARIANTS,
  normalizeFormInputVariantKey,
} from '@/lib/builder/site/component-variants';
import styles from '../form/FormControlInspector.module.css';

export default function FormDateInspector({
  node,
  locale,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const dateNode = node as BuilderFormDateCanvasNode;
  const c = dateNode.content;
  const copy = getFormControlsCopy(locale ?? 'ko');
  const label = localizedFormControlText(c.label, copy.fieldDefaults.dateLabel, FORM_DATE_KO_DEFAULTS.label);

  return (
    <div className={styles.root} data-builder-form-field-inspector="date">
      <label><span>{copy.dateInspector.fieldNameLabel}</span><input type="text" value={c.name} disabled={disabled} onChange={(event) => onUpdate({ name: event.target.value })} /></label>
      <label><span>{copy.dateInspector.labelLabel}</span><input type="text" value={label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} /></label>
      <label><span>{copy.dateInspector.typeLabel}</span><select value={c.type} disabled={disabled} onChange={(event) => onUpdate({ type: event.target.value })}><option value="date">{copy.dateInspector.typeOptions.date}</option><option value="datetime-local">{copy.dateInspector.typeOptions['datetime-local']}</option><option value="time">{copy.dateInspector.typeOptions.time}</option><option value="month">{copy.dateInspector.typeOptions.month}</option></select></label>
      <label>
        <span>{copy.dateInspector.inputVariantLabel}</span>
        <select
          value={normalizeFormInputVariantKey(c.variant)}
          disabled={disabled}
          onChange={(event) => onUpdate({ variant: event.target.value })}
        >
          {FORM_INPUT_VARIANTS.map((variant) => (
            <option key={variant.key} value={variant.key}>
              {copy.fieldInspector.inputVariantLabels[variant.key]}
            </option>
          ))}
        </select>
      </label>
      <label><span>{copy.dateInspector.defaultValueLabel}</span><input type="text" value={c.defaultValue ?? ''} disabled={disabled} onChange={(event) => onUpdate({ defaultValue: event.target.value || undefined })} /></label>
      <label><span>{copy.dateInspector.minLabel}</span><input type="text" value={c.min ?? ''} disabled={disabled} onChange={(event) => onUpdate({ min: event.target.value || undefined })} /></label>
      <label><span>{copy.dateInspector.maxLabel}</span><input type="text" value={c.max ?? ''} disabled={disabled} onChange={(event) => onUpdate({ max: event.target.value || undefined })} /></label>
      <label><span>{copy.dateInspector.requiredLabel}</span><input type="checkbox" checked={c.required} disabled={disabled} onChange={(event) => onUpdate({ required: event.target.checked })} /></label>
      <label><span>{copy.dateInspector.showIfFieldLabel}</span><input type="text" value={c.showIf?.fieldName ?? ''} disabled={disabled} onChange={(event) => onUpdate({ showIf: event.target.value ? { fieldName: event.target.value, operator: c.showIf?.operator ?? 'equals', value: c.showIf?.value ?? '' } : undefined })} /></label>
      <label><span>{copy.dateInspector.conditionValueLabel}</span><input type="text" value={c.showIf?.value ?? ''} disabled={disabled || !c.showIf} onChange={(event) => c.showIf && onUpdate({ showIf: { ...c.showIf, value: event.target.value } })} /></label>
      <label><span>{copy.dateInspector.customErrorLabel}</span><input type="text" value={c.errorMessage ?? ''} disabled={disabled} onChange={(event) => onUpdate({ errorMessage: event.target.value })} /></label>
    </div>
  );
}
