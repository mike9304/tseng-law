import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderFormFileCanvasNode } from '@/lib/builder/canvas/types';
import {
  FORM_FILE_KO_DEFAULTS,
  getFormControlsCopy,
  localizedFormControlText,
} from '../form/form-controls-copy';
import {
  FORM_INPUT_VARIANTS,
  normalizeFormInputVariantKey,
} from '@/lib/builder/site/component-variants';
import styles from '../form/FormControlInspector.module.css';

export default function FormFileInspector({
  node,
  locale,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const fileNode = node as BuilderFormFileCanvasNode;
  const c = fileNode.content;
  const copy = getFormControlsCopy(locale ?? 'ko');
  const label = localizedFormControlText(c.label, copy.fieldDefaults.fileLabel, FORM_FILE_KO_DEFAULTS.label);

  return (
    <div className={styles.root} data-builder-form-field-inspector="file">
      <label><span>{copy.fileInspector.fieldNameLabel}</span><input type="text" value={c.name} disabled={disabled} onChange={(event) => onUpdate({ name: event.target.value })} /></label>
      <label><span>{copy.fileInspector.labelLabel}</span><input type="text" value={label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} /></label>
      <label>
        <span>{copy.fileInspector.inputVariantLabel}</span>
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
      <label><span>{copy.fileInspector.acceptLabel}</span><input type="text" value={c.accept} disabled={disabled} onChange={(event) => onUpdate({ accept: event.target.value })} /></label>
      <label><span>{copy.fileInspector.maxSizeLabel}</span><input type="number" min={1} max={50} value={c.maxSizeMb} disabled={disabled} onChange={(event) => onUpdate({ maxSizeMb: Number(event.target.value) })} /></label>
      <label><span>{copy.fileInspector.multipleLabel}</span><input type="checkbox" checked={c.multiple} disabled={disabled} onChange={(event) => onUpdate({ multiple: event.target.checked })} /></label>
      <label><span>{copy.fileInspector.requiredLabel}</span><input type="checkbox" checked={c.required} disabled={disabled} onChange={(event) => onUpdate({ required: event.target.checked })} /></label>
      <label><span>{copy.fileInspector.showIfFieldLabel}</span><input type="text" value={c.showIf?.fieldName ?? ''} disabled={disabled} onChange={(event) => onUpdate({ showIf: event.target.value ? { fieldName: event.target.value, operator: c.showIf?.operator ?? 'equals', value: c.showIf?.value ?? '' } : undefined })} /></label>
      <label><span>{copy.fileInspector.conditionValueLabel}</span><input type="text" value={c.showIf?.value ?? ''} disabled={disabled || !c.showIf} onChange={(event) => c.showIf && onUpdate({ showIf: { ...c.showIf, value: event.target.value } })} /></label>
      <label><span>{copy.fileInspector.customErrorLabel}</span><input type="text" value={c.errorMessage ?? ''} disabled={disabled} onChange={(event) => onUpdate({ errorMessage: event.target.value })} /></label>
    </div>
  );
}
