import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderFormSelectCanvasNode } from '@/lib/builder/canvas/types';
import {
  FORM_INPUT_VARIANTS,
  normalizeFormInputVariantKey,
} from '@/lib/builder/site/component-variants';
import {
  FORM_SELECT_KO_DEFAULTS,
  getFormControlsCopy,
  localizedFormControlText,
  localizedFormSelectOptionLabel,
} from '../form/form-controls-copy';
import styles from '../form/FormControlInspector.module.css';

type FormControlsCopy = ReturnType<typeof getFormControlsCopy>;

function parseOptions(value: string, copy: FormControlsCopy) {
  const options = value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [rawValue, ...labelParts] = line.split('|');
      const optionValue = rawValue.trim();
      return {
        value: optionValue,
        label: (labelParts.join('|').trim() || optionValue).slice(0, 200),
      };
    });
  return options.length > 0 ? options : [{ value: 'option-1', label: copy.fieldInspector.selectFallbackOptionLabel }];
}

function stringifyOptions(options: Array<{ value: string; label: string }>, copy: FormControlsCopy) {
  return options
    .map((option) => `${option.value}|${localizedFormSelectOptionLabel(option.label, copy.fieldDefaults.selectOptionLabel)}`)
    .join('\n');
}

export default function FormSelectInspector({
  node,
  locale,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const selectNode = node as BuilderFormSelectCanvasNode;
  const c = selectNode.content;
  const copy = getFormControlsCopy(locale ?? 'ko');
  const label = localizedFormControlText(c.label, copy.fieldDefaults.selectLabel, FORM_SELECT_KO_DEFAULTS.label);
  const placeholder = localizedFormControlText(
    c.placeholder,
    copy.fieldDefaults.selectPlaceholder,
    FORM_SELECT_KO_DEFAULTS.placeholder,
  );

  return (
    <div className={styles.root} data-builder-form-field-inspector="select">
      <label>
        <span>{copy.fieldInspector.fieldNameLabel}</span>
        <input type="text" value={c.name} disabled={disabled} onChange={(event) => onUpdate({ name: event.target.value })} />
      </label>
      <label>
        <span>{copy.fieldInspector.labelLabel}</span>
        <input type="text" value={label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} />
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
        <input type="text" value={placeholder} disabled={disabled} onChange={(event) => onUpdate({ placeholder: event.target.value || undefined })} />
      </label>
      <label>
        <span>{copy.fieldInspector.optionsLabel}</span>
        <textarea
          rows={5}
          value={stringifyOptions(c.options, copy)}
          disabled={disabled}
          onChange={(event) => onUpdate({ options: parseOptions(event.target.value, copy) })}
        />
      </label>
      <label>
        <span>{copy.fieldInspector.defaultValueLabel}</span>
        <input type="text" value={c.defaultValue ?? ''} disabled={disabled} onChange={(event) => onUpdate({ defaultValue: event.target.value || undefined })} />
      </label>
      <label>
        <span>{copy.fieldInspector.requiredLabel}</span>
        <input type="checkbox" checked={c.required} disabled={disabled} onChange={(event) => onUpdate({ required: event.target.checked })} />
      </label>
      <label>
        <span>{copy.fieldInspector.multipleLabel}</span>
        <input type="checkbox" checked={c.multiple} disabled={disabled} onChange={(event) => onUpdate({ multiple: event.target.checked })} />
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
      {c.showIf ? (
        <>
          <label>
            <span>{copy.fieldInspector.conditionLabel}</span>
            <select
              value={c.showIf.operator}
              disabled={disabled}
              onChange={(event) => onUpdate({ showIf: { ...c.showIf, operator: event.target.value } })}
            >
              <option value="equals">{copy.fieldInspector.conditionOptions.equals}</option>
              <option value="notEquals">{copy.fieldInspector.conditionOptions.notEquals}</option>
              <option value="contains">{copy.fieldInspector.conditionOptions.contains}</option>
              <option value="isEmpty">{copy.fieldInspector.conditionOptions.isEmpty}</option>
              <option value="isNotEmpty">{copy.fieldInspector.conditionOptions.isNotEmpty}</option>
            </select>
          </label>
          <label>
            <span>{copy.fieldInspector.conditionValueLabel}</span>
            <input type="text" value={c.showIf.value ?? ''} disabled={disabled} onChange={(event) => onUpdate({ showIf: { ...c.showIf, value: event.target.value } })} />
          </label>
        </>
      ) : null}
      <label>
        <span>{copy.fieldInspector.customErrorLabel}</span>
        <input type="text" value={c.errorMessage ?? ''} disabled={disabled} onChange={(event) => onUpdate({ errorMessage: event.target.value })} />
      </label>
    </div>
  );
}
