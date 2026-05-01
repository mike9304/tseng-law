import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderFormCheckboxCanvasNode } from '@/lib/builder/canvas/types';

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
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const checkboxNode = node as BuilderFormCheckboxCanvasNode;
  const c = checkboxNode.content;

  return (
    <>
      <label><span>Field name</span><input type="text" value={c.name} disabled={disabled} onChange={(event) => onUpdate({ name: event.target.value })} /></label>
      <label><span>Label</span><input type="text" value={c.label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} /></label>
      <label><span>Options (optional, value|label per line)</span><textarea rows={4} value={stringifyOptions(c.options)} disabled={disabled} onChange={(event) => onUpdate({ options: parseOptions(event.target.value) })} /></label>
      <label><span>Required</span><input type="checkbox" checked={c.required} disabled={disabled} onChange={(event) => onUpdate({ required: event.target.checked })} /></label>
      <label><span>Default checked</span><input type="checkbox" checked={c.defaultChecked} disabled={disabled} onChange={(event) => onUpdate({ defaultChecked: event.target.checked })} /></label>
      <label><span>Show if field</span><input type="text" value={c.showIf?.fieldName ?? ''} disabled={disabled} onChange={(event) => onUpdate({ showIf: event.target.value ? { fieldName: event.target.value, operator: c.showIf?.operator ?? 'equals', value: c.showIf?.value ?? '' } : undefined })} /></label>
      <label><span>Show if value</span><input type="text" value={c.showIf?.value ?? ''} disabled={disabled || !c.showIf} onChange={(event) => c.showIf && onUpdate({ showIf: { ...c.showIf, value: event.target.value } })} /></label>
      <label><span>Custom error</span><input type="text" value={c.errorMessage ?? ''} disabled={disabled} onChange={(event) => onUpdate({ errorMessage: event.target.value })} /></label>
    </>
  );
}
