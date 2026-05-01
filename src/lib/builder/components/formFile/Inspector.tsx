import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderFormFileCanvasNode } from '@/lib/builder/canvas/types';
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

export default function FormFileInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const fileNode = node as BuilderFormFileCanvasNode;
  const c = fileNode.content;

  return (
    <>
      <label><span>Field name</span><input type="text" value={c.name} disabled={disabled} onChange={(event) => onUpdate({ name: event.target.value })} /></label>
      <label><span>Label</span><input type="text" value={c.label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} /></label>
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
      <label><span>Accept</span><input type="text" value={c.accept} disabled={disabled} onChange={(event) => onUpdate({ accept: event.target.value })} /></label>
      <label><span>Max size MB</span><input type="number" min={1} max={50} value={c.maxSizeMb} disabled={disabled} onChange={(event) => onUpdate({ maxSizeMb: Number(event.target.value) })} /></label>
      <label><span>Multiple</span><input type="checkbox" checked={c.multiple} disabled={disabled} onChange={(event) => onUpdate({ multiple: event.target.checked })} /></label>
      <label><span>Required</span><input type="checkbox" checked={c.required} disabled={disabled} onChange={(event) => onUpdate({ required: event.target.checked })} /></label>
      <label><span>Show if field</span><input type="text" value={c.showIf?.fieldName ?? ''} disabled={disabled} onChange={(event) => onUpdate({ showIf: event.target.value ? { fieldName: event.target.value, operator: c.showIf?.operator ?? 'equals', value: c.showIf?.value ?? '' } : undefined })} /></label>
      <label><span>Show if value</span><input type="text" value={c.showIf?.value ?? ''} disabled={disabled || !c.showIf} onChange={(event) => c.showIf && onUpdate({ showIf: { ...c.showIf, value: event.target.value } })} /></label>
      <label><span>Custom error</span><input type="text" value={c.errorMessage ?? ''} disabled={disabled} onChange={(event) => onUpdate({ errorMessage: event.target.value })} /></label>
    </>
  );
}
