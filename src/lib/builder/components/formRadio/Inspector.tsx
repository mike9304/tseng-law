import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderFormRadioCanvasNode } from '@/lib/builder/canvas/types';
import {
  FORM_RADIO_KO_DEFAULTS,
  getFormControlsCopy,
  localizedFormControlText,
  localizedFormSelectOptionLabel,
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
  return options.length >= 2 ? options : undefined;
}

function stringifyOptions(options: Array<{ value: string; label: string }>, localized: (index: number) => string) {
  return options.map((option) => `${option.value}|${localizedFormSelectOptionLabel(option.label, localized)}`).join('\n');
}

export default function FormRadioInspector({
  node,
  locale,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const radioNode = node as BuilderFormRadioCanvasNode;
  const c = radioNode.content;
  const copy = getFormControlsCopy(locale ?? 'ko');
  const label = localizedFormControlText(c.label, copy.fieldDefaults.radioLabel, FORM_RADIO_KO_DEFAULTS.label);
  const defaultOptions = [
    { value: 'yes', label: copy.radioInspector.yesLabel },
    { value: 'no', label: copy.radioInspector.noLabel },
  ];
  const options = c.options.length > 0 ? c.options : defaultOptions;

  return (
    <div className={styles.root} data-builder-form-field-inspector="radio">
      <label><span>{copy.radioInspector.fieldNameLabel}</span><input type="text" value={c.name} disabled={disabled} onChange={(event) => onUpdate({ name: event.target.value })} /></label>
      <label><span>{copy.radioInspector.labelLabel}</span><input type="text" value={label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} /></label>
      <label><span>{copy.radioInspector.optionsLabel}</span><textarea rows={5} value={stringifyOptions(options, copy.fieldDefaults.selectOptionLabel)} disabled={disabled} onChange={(event) => onUpdate({ options: parseOptions(event.target.value) || defaultOptions })} /></label>
      <label><span>{copy.radioInspector.defaultValueLabel}</span><input type="text" value={c.defaultValue ?? ''} disabled={disabled} onChange={(event) => onUpdate({ defaultValue: event.target.value || undefined })} /></label>
      <label><span>{copy.radioInspector.layoutLabel}</span><select value={c.layout} disabled={disabled} onChange={(event) => onUpdate({ layout: event.target.value })}><option value="vertical">{copy.radioInspector.verticalLabel}</option><option value="horizontal">{copy.radioInspector.horizontalLabel}</option></select></label>
      <label><span>{copy.radioInspector.requiredLabel}</span><input type="checkbox" checked={c.required} disabled={disabled} onChange={(event) => onUpdate({ required: event.target.checked })} /></label>
      <label><span>{copy.radioInspector.showIfFieldLabel}</span><input type="text" value={c.showIf?.fieldName ?? ''} disabled={disabled} onChange={(event) => onUpdate({ showIf: event.target.value ? { fieldName: event.target.value, operator: c.showIf?.operator ?? 'equals', value: c.showIf?.value ?? '' } : undefined })} /></label>
      <label><span>{copy.radioInspector.conditionValueLabel}</span><input type="text" value={c.showIf?.value ?? ''} disabled={disabled || !c.showIf} onChange={(event) => c.showIf && onUpdate({ showIf: { ...c.showIf, value: event.target.value } })} /></label>
      <label><span>{copy.radioInspector.customErrorLabel}</span><input type="text" value={c.errorMessage ?? ''} disabled={disabled} onChange={(event) => onUpdate({ errorMessage: event.target.value })} /></label>
    </div>
  );
}
