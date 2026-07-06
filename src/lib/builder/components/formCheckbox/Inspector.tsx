import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderFormCheckboxCanvasNode } from '@/lib/builder/canvas/types';
import {
  FORM_CHECKBOX_KO_DEFAULTS,
  getFormControlsCopy,
  localizedFormControlText,
} from '../form/form-controls-copy';
import styles from '../form/FormControlInspector.module.css';

function parseOptions(value: string) {
  const options = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [rawValue, ...labelParts] = line.split('|');
      const optionValue = rawValue.trim();
      return { value: optionValue, label: labelParts.join('|').trim() || optionValue };
    });
  return options.length > 0 ? options : undefined;
}

function stringifyOptions(options?: Array<{ value: string; label: string }>) {
  return (options ?? []).map((option) => `${option.value}|${option.label}`).join('\n');
}

export default function FormCheckboxInspector({
  node,
  locale,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const checkboxNode = node as BuilderFormCheckboxCanvasNode;
  const c = checkboxNode.content;
  const copy = getFormControlsCopy(locale ?? 'ko');
  const label = localizedFormControlText(c.label, copy.fieldDefaults.checkboxLabel, FORM_CHECKBOX_KO_DEFAULTS.label);

  return (
    <div className={styles.root} data-builder-form-field-inspector="checkbox">
      <label><span>{copy.checkboxInspector.fieldNameLabel}</span><input type="text" value={c.name} disabled={disabled} onChange={(event) => onUpdate({ name: event.target.value })} /></label>
      <label><span>{copy.checkboxInspector.labelLabel}</span><input type="text" value={label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} /></label>
      <label><span>{copy.checkboxInspector.optionsLabel}</span><textarea rows={4} value={stringifyOptions(c.options)} disabled={disabled} onChange={(event) => onUpdate({ options: parseOptions(event.target.value) })} /></label>
      <label><span>{copy.checkboxInspector.requiredLabel}</span><input type="checkbox" checked={c.required} disabled={disabled} onChange={(event) => onUpdate({ required: event.target.checked })} /></label>
      <label><span>{copy.checkboxInspector.defaultCheckedLabel}</span><input type="checkbox" checked={c.defaultChecked} disabled={disabled} onChange={(event) => onUpdate({ defaultChecked: event.target.checked })} /></label>
      <label><span>{copy.checkboxInspector.showIfFieldLabel}</span><input type="text" value={c.showIf?.fieldName ?? ''} disabled={disabled} onChange={(event) => onUpdate({ showIf: event.target.value ? { fieldName: event.target.value, operator: c.showIf?.operator ?? 'equals', value: c.showIf?.value ?? '' } : undefined })} /></label>
      <label><span>{copy.checkboxInspector.conditionValueLabel}</span><input type="text" value={c.showIf?.value ?? ''} disabled={disabled || !c.showIf} onChange={(event) => c.showIf && onUpdate({ showIf: { ...c.showIf, value: event.target.value } })} /></label>
      <label><span>{copy.checkboxInspector.customErrorLabel}</span><input type="text" value={c.errorMessage ?? ''} disabled={disabled} onChange={(event) => onUpdate({ errorMessage: event.target.value })} /></label>
    </div>
  );
}
