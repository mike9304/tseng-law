import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderFormInputCanvasNode } from '@/lib/builder/canvas/types';
import {
  FORM_INPUT_KO_DEFAULTS,
  getFormControlsCopy,
  localizedFormControlText,
} from '../form/form-controls-copy';
import {
  FORM_INPUT_VARIANTS,
  normalizeFormInputVariantKey,
} from '@/lib/builder/site/component-variants';
import styles from '../form/FormControlInspector.module.css';

export default function FormInputInspector({
  node,
  locale,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const inputNode = node as BuilderFormInputCanvasNode;
  const c = inputNode.content;
  const copy = getFormControlsCopy(locale ?? 'ko');
  const label = localizedFormControlText(c.label, copy.fieldDefaults.inputLabel, FORM_INPUT_KO_DEFAULTS.label);

  return (
    <div className={styles.root} data-builder-form-field-inspector="input">
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
          placeholder={copy.fieldInspector.inputLabelPlaceholder}
        />
      </label>
      <label>
        <span>{copy.fieldInspector.typeLabel}</span>
        <select
          value={c.type}
          disabled={disabled}
          onChange={(event) => onUpdate({ type: event.target.value })}
        >
          <option value="text">{copy.fieldInspector.typeOptions.text}</option>
          <option value="email">{copy.fieldInspector.typeOptions.email}</option>
          <option value="tel">{copy.fieldInspector.typeOptions.tel}</option>
          <option value="number">{copy.fieldInspector.typeOptions.number}</option>
          <option value="url">{copy.fieldInspector.typeOptions.url}</option>
          <option value="password">{copy.fieldInspector.typeOptions.password}</option>
          <option value="date">{copy.fieldInspector.typeOptions.date}</option>
        </select>
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
        <input
          type="text"
          value={c.defaultValue ?? ''}
          disabled={disabled}
          onChange={(event) => onUpdate({ defaultValue: event.target.value || undefined })}
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
          max={1000}
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
          max={5000}
          value={c.maxLength ?? ''}
          disabled={disabled}
          onChange={(event) =>
            onUpdate({ maxLength: event.target.value === '' ? undefined : Number(event.target.value) })
          }
        />
      </label>
      <label>
        <span>{copy.fieldInspector.patternLabel}</span>
        <input
          type="text"
          value={c.pattern ?? ''}
          disabled={disabled}
          onChange={(event) => onUpdate({ pattern: event.target.value || undefined })}
          placeholder={copy.fieldInspector.patternPlaceholder}
        />
      </label>
      {c.type === 'number' ? (
        <>
          <label>
            <span>{copy.fieldInspector.minimumLabel}</span>
            <input
              type="number"
              value={c.numericMin ?? ''}
              disabled={disabled}
              onChange={(event) =>
                onUpdate({ numericMin: event.target.value === '' ? undefined : Number(event.target.value) })
              }
            />
          </label>
          <label>
            <span>{copy.fieldInspector.maximumLabel}</span>
            <input
              type="number"
              value={c.numericMax ?? ''}
              disabled={disabled}
              onChange={(event) =>
                onUpdate({ numericMax: event.target.value === '' ? undefined : Number(event.target.value) })
              }
            />
          </label>
          <label>
            <span>{copy.fieldInspector.stepLabel}</span>
            <input
              type="number"
              min={0}
              value={c.numericStep ?? ''}
              disabled={disabled}
              onChange={(event) =>
                onUpdate({ numericStep: event.target.value === '' ? undefined : Number(event.target.value) })
              }
            />
          </label>
          <label>
            <span>{copy.fieldInspector.allowDecimalsLabel}</span>
            <input
              type="checkbox"
              checked={c.allowDecimals}
              disabled={disabled}
              onChange={(event) => onUpdate({ allowDecimals: event.target.checked })}
            />
          </label>
        </>
      ) : null}
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
      {c.showIf ? (
        <label>
          <span>{copy.fieldInspector.conditionLabel}</span>
          <select
            value={c.showIf.operator}
            disabled={disabled}
            onChange={(event) => onUpdate({ showIf: { ...c.showIf!, operator: event.target.value as typeof c.showIf.operator } })}
          >
            {Object.entries(copy.fieldInspector.conditionOptions).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
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
