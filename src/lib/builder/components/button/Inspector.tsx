import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderButtonCanvasNode } from '@/lib/builder/canvas/types';

export default function ButtonInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const buttonNode = node as BuilderButtonCanvasNode;

  return (
    <>
      <label>
        <span>Label</span>
        <input
          type="text"
          value={buttonNode.content.label}
          disabled={disabled}
          onChange={(event) => onUpdate({ label: event.target.value })}
        />
      </label>
      <label>
        <span>Href</span>
        <input
          type="text"
          value={buttonNode.content.href}
          disabled={disabled}
          onChange={(event) => onUpdate({ href: event.target.value })}
        />
      </label>
      <label>
        <span>Variant</span>
        <select
          value={buttonNode.content.style}
          disabled={disabled}
          onChange={(event) => onUpdate({ style: event.target.value })}
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="outline">Outline</option>
          <option value="ghost">Ghost</option>
          <option value="link">Link</option>
        </select>
      </label>
    </>
  );
}
