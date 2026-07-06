import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderFormTextareaCanvasNode } from '@/lib/builder/canvas/types';
import {
  FORM_INPUT_VARIANTS,
  normalizeFormInputVariantKey,
} from '@/lib/builder/site/component-variants';
import {
  FORM_TEXTAREA_KO_DEFAULTS,
  getFormControlsCopy,
  localizedFormControlText,
} from '../form/form-controls-copy';
import styles from '../form/FormControlInspector.module.css';

export default function FormTextareaInspector({
  node,
  locale,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const taNode = node as BuilderFormTextareaCanvasNode;
  const c = taNode.content;
  const copy = getFormControlsCopy(locale ?? 'ko');
  const label = localizedFormControlText(c.label, copy.fieldDefaults.textareaLabel, FORM_TEXTAREA_KO_DEFAULTS.label);

  return (
    <div className={styles.root} data-builder-form-field-inspector="textarea">
      <label>
        <span>{copy.fieldInspector.fieldNameLabel}</span>
        <input
          type="text"
          value={c.name}
          disabled={disabled}
          onChange={(event) => onUpdate({ name: event.target.value })}
          placeholder={copy.fieldInspector.fieldNamePlaceholder}
        />
      </label>
      <label>
        <span>{copy.fieldInspector.labelLabel}</span>
        <input
          type="text"
          value={label}
          disabled={disabled}
          onChange={(event) => onUpdate({ label: event.target.value })}
          placeholder={copy.fieldInspector.textareaLabelPlaceholder}
        />
      </label>
      <label>
        <span>{copy.fieldInspector.inputVariantLabel}</span>
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
      <label>
        <span>{copy.fieldInspector.placeholderLabel}</span>
        <input
          type="text"
          value={c.placeholder ?? ''}
          disabled={disabled}
          onChange={(event) => onUpdate({ placeholder: event.target.value || undefined })}
        />
      </label>
      <label>
        <span>{copy.fieldInspector.defaultValueLabel}</span>
        <textarea
          value={c.defaultValue ?? ''}
          rows={2}
          disabled={disabled}
          onChange={(event) => onUpdate({ defaultValue: event.target.value || undefined })}
        />
      </label>
      <label>
        <span>{copy.fieldInspector.rowsLabel}</span>
        <input
          type="number"
          min={2}
          max={20}
          value={c.rows}
          disabled={disabled}
          onChange={(event) => onUpdate({ rows: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>{copy.fieldInspector.requiredLabel}</span>
        <input
          type="checkbox"
          checked={c.required}
          disabled={disabled}
          onChange={(event) => onUpdate({ required: event.target.checked })}
        />
      </label>
      <label>
        <span>{copy.fieldInspector.minLengthLabel}</span>
        <input
          type="number"
          min={0}
          max={5000}
          value={c.minLength ?? ''}
          disabled={disabled}
          onChange={(event) =>
            onUpdate({ minLength: event.target.value === '' ? undefined : Number(event.target.value) })
          }
        />
      </label>
      <label>
        <span>{copy.fieldInspector.maxLengthLabel}</span>
        <input
          type="number"
          min={1}
          max={20000}
          value={c.maxLength ?? ''}
          disabled={disabled}
          onChange={(event) =>
            onUpdate({ maxLength: event.target.value === '' ? undefined : Number(event.target.value) })
          }
        />
      </label>
      <label>
        <span>{copy.fieldInspector.showIfFieldLabel}</span>
        <input
          type="text"
          value={c.showIf?.fieldName ?? ''}
          disabled={disabled}
          placeholder={copy.fieldInspector.conditionalFieldPlaceholder}
          onChange={(event) =>
            onUpdate({
              showIf: event.target.value
                ? { fieldName: event.target.value, operator: c.showIf?.operator ?? 'equals', value: c.showIf?.value ?? '' }
                : undefined,
            })
          }
        />
      </label>
      <label>
        <span>{copy.fieldInspector.conditionValueLabel}</span>
        <input
          type="text"
          value={c.showIf?.value ?? ''}
          disabled={disabled || !c.showIf}
          onChange={(event) => c.showIf && onUpdate({ showIf: { ...c.showIf, value: event.target.value } })}
        />
      </label>
      <label>
        <span>{copy.fieldInspector.customErrorLabel}</span>
        <input
          type="text"
          value={c.errorMessage ?? ''}
          disabled={disabled}
          onChange={(event) => onUpdate({ errorMessage: event.target.value })}
        />
      </label>
    </div>
  );
}
