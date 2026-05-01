import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderFormRadioCanvasNode } from '@/lib/builder/canvas/types';

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
      return { value: optionValue, label: labelParts.join('|').trim() || optionValue };
    });
  return options.length >= 2 ? options : [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ];
}

function stringifyOptions(options: Array<{ value: string; label: string }>) {
  return options.map((option) => `${option.value}|${option.label}`).join('\n');
}

export default function FormRadioInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const radioNode = node as BuilderFormRadioCanvasNode;
  const c = radioNode.content;

  return (
    <>
      <label><span>Field name</span><input type="text" value={c.name} disabled={disabled} onChange={(event) => onUpdate({ name: event.target.value })} /></label>
      <label><span>Label</span><input type="text" value={c.label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} /></label>
      <label><span>Options (value|label per line)</span><textarea rows={5} value={stringifyOptions(c.options)} disabled={disabled} onChange={(event) => onUpdate({ options: parseOptions(event.target.value) })} /></label>
      <label><span>Default value</span><input type="text" value={c.defaultValue ?? ''} disabled={disabled} onChange={(event) => onUpdate({ defaultValue: event.target.value || undefined })} /></label>
      <label><span>Layout</span><select style={selectStyle} value={c.layout} disabled={disabled} onChange={(event) => onUpdate({ layout: event.target.value })}><option value="vertical">Vertical</option><option value="horizontal">Horizontal</option></select></label>
      <label><span>Required</span><input type="checkbox" checked={c.required} disabled={disabled} onChange={(event) => onUpdate({ required: event.target.checked })} /></label>
      <label><span>Show if field</span><input type="text" value={c.showIf?.fieldName ?? ''} disabled={disabled} onChange={(event) => onUpdate({ showIf: event.target.value ? { fieldName: event.target.value, operator: c.showIf?.operator ?? 'equals', value: c.showIf?.value ?? '' } : undefined })} /></label>
      <label><span>Show if value</span><input type="text" value={c.showIf?.value ?? ''} disabled={disabled || !c.showIf} onChange={(event) => c.showIf && onUpdate({ showIf: { ...c.showIf, value: event.target.value } })} /></label>
      <label><span>Custom error</span><input type="text" value={c.errorMessage ?? ''} disabled={disabled} onChange={(event) => onUpdate({ errorMessage: event.target.value })} /></label>
    </>
  );
}
