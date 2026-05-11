import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderFormInputCanvasNode } from '@/lib/builder/canvas/types';
import {
  FORM_INPUT_VARIANTS,
  normalizeFormInputVariantKey,
} from '@/lib/builder/site/component-variants';

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '4px 6px',
  fontSize: '0.85rem',
  border: '1px solid #e2e8f0',
  borderRadius: 6,
  background: '#fff',
};

const CONDITION_OPTIONS = [
  { value: 'equals', label: 'equals' },
  { value: 'notEquals', label: 'not equals' },
  { value: 'contains', label: 'contains' },
  { value: 'isEmpty', label: 'is empty' },
  { value: 'isNotEmpty', label: 'is not empty' },
] as const;

export default function FormInputInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const inputNode = node as BuilderFormInputCanvasNode;
  const c = inputNode.content;

  return (
    <>
      <label>
        <span>Field name</span>
        <input
          type="text"
          value={c.name}
          disabled={disabled}
          onChange={(event) => onUpdate({ name: event.target.value })}
          placeholder="email"
        />
      </label>
      <label>
        <span>Label</span>
        <input
          type="text"
          value={c.label}
          disabled={disabled}
          onChange={(event) => onUpdate({ label: event.target.value })}
          placeholder="이메일"
        />
      </label>
      <label>
        <span>Type</span>
        <select
          style={selectStyle}
          value={c.type}
          disabled={disabled}
          onChange={(event) => onUpdate({ type: event.target.value })}
        >
          <option value="text">Text</option>
          <option value="email">Email</option>
          <option value="tel">Tel</option>
          <option value="number">Number</option>
          <option value="url">URL</option>
          <option value="password">Password</option>
          <option value="date">Date</option>
        </select>
      </label>
      <label>
        <span>Input variant</span>
        <select
          style={selectStyle}
          value={normalizeFormInputVariantKey(c.variant)}
          disabled={disabled}
          onChange={(event) => onUpdate({ variant: event.target.value })}
        >
          {FORM_INPUT_VARIANTS.map((variant) => (
            <option key={variant.key} value={variant.key}>
              {variant.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Placeholder</span>
        <input
          type="text"
          value={c.placeholder ?? ''}
          disabled={disabled}
          onChange={(event) => onUpdate({ placeholder: event.target.value || undefined })}
        />
      </label>
      <label>
        <span>Default value</span>
        <input
          type="text"
          value={c.defaultValue ?? ''}
          disabled={disabled}
          onChange={(event) => onUpdate({ defaultValue: event.target.value || undefined })}
        />
      </label>
      <label>
        <span>Required</span>
        <input
          type="checkbox"
          checked={c.required}
          disabled={disabled}
          onChange={(event) => onUpdate({ required: event.target.checked })}
        />
      </label>
      <label>
        <span>Min length</span>
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
        <span>Max length</span>
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
        <span>Pattern (regex)</span>
        <input
          type="text"
          value={c.pattern ?? ''}
          disabled={disabled}
          onChange={(event) => onUpdate({ pattern: event.target.value || undefined })}
          placeholder="^[a-zA-Z0-9]+$"
        />
      </label>
      {c.type === 'number' ? (
        <>
          <label>
            <span>Minimum</span>
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
            <span>Maximum</span>
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
            <span>Step</span>
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
            <span>Allow decimals</span>
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
        <span>Show if field</span>
        <input
          type="text"
          value={c.showIf?.fieldName ?? ''}
          disabled={disabled}
          placeholder="caseType"
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
          <span>Condition</span>
          <select
            style={selectStyle}
            value={c.showIf.operator}
            disabled={disabled}
            onChange={(event) => onUpdate({ showIf: { ...c.showIf!, operator: event.target.value as typeof c.showIf.operator } })}
          >
            {CONDITION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label>
        <span>Show if value</span>
        <input
          type="text"
          value={c.showIf?.value ?? ''}
          disabled={disabled || !c.showIf}
          onChange={(event) => c.showIf && onUpdate({ showIf: { ...c.showIf, value: event.target.value } })}
        />
      </label>
      <label>
        <span>Custom error</span>
        <input
          type="text"
          value={c.errorMessage ?? ''}
          disabled={disabled}
          onChange={(event) => onUpdate({ errorMessage: event.target.value })}
        />
      </label>
    </>
  );
}
