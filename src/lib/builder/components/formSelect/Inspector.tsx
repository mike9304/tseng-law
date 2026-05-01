import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderFormSelectCanvasNode } from '@/lib/builder/canvas/types';
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

function parseOptions(value: string) {
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
  return options.length > 0 ? options : [{ value: 'option-1', label: '옵션 1' }];
}

function stringifyOptions(options: Array<{ value: string; label: string }>) {
  return options.map((option) => `${option.value}|${option.label}`).join('\n');
}

export default function FormSelectInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const selectNode = node as BuilderFormSelectCanvasNode;
  const c = selectNode.content;

  return (
    <>
      <label>
        <span>Field name</span>
        <input type="text" value={c.name} disabled={disabled} onChange={(event) => onUpdate({ name: event.target.value })} />
      </label>
      <label>
        <span>Label</span>
        <input type="text" value={c.label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} />
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
        <input type="text" value={c.placeholder ?? ''} disabled={disabled} onChange={(event) => onUpdate({ placeholder: event.target.value || undefined })} />
      </label>
      <label>
        <span>Options (value|label per line)</span>
        <textarea
          rows={5}
          value={stringifyOptions(c.options)}
          disabled={disabled}
          onChange={(event) => onUpdate({ options: parseOptions(event.target.value) })}
        />
      </label>
      <label>
        <span>Default value</span>
        <input type="text" value={c.defaultValue ?? ''} disabled={disabled} onChange={(event) => onUpdate({ defaultValue: event.target.value || undefined })} />
      </label>
      <label>
        <span>Required</span>
        <input type="checkbox" checked={c.required} disabled={disabled} onChange={(event) => onUpdate({ required: event.target.checked })} />
      </label>
      <label>
        <span>Multiple</span>
        <input type="checkbox" checked={c.multiple} disabled={disabled} onChange={(event) => onUpdate({ multiple: event.target.checked })} />
      </label>
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
        <>
          <label>
            <span>Condition</span>
            <select
              style={selectStyle}
              value={c.showIf.operator}
              disabled={disabled}
              onChange={(event) => onUpdate({ showIf: { ...c.showIf, operator: event.target.value } })}
            >
              <option value="equals">equals</option>
              <option value="notEquals">not equals</option>
              <option value="contains">contains</option>
              <option value="isEmpty">is empty</option>
              <option value="isNotEmpty">is not empty</option>
            </select>
          </label>
          <label>
            <span>Condition value</span>
            <input type="text" value={c.showIf.value ?? ''} disabled={disabled} onChange={(event) => onUpdate({ showIf: { ...c.showIf, value: event.target.value } })} />
          </label>
        </>
      ) : null}
      <label>
        <span>Custom error</span>
        <input type="text" value={c.errorMessage ?? ''} disabled={disabled} onChange={(event) => onUpdate({ errorMessage: event.target.value })} />
      </label>
    </>
  );
}
