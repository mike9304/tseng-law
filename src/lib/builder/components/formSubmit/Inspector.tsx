import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderFormSubmitCanvasNode } from '@/lib/builder/canvas/types';

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '4px 6px',
  fontSize: '0.85rem',
  border: '1px solid #e2e8f0',
  borderRadius: 6,
  background: '#fff',
};

export default function FormSubmitInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const submitNode = node as BuilderFormSubmitCanvasNode;
  const c = submitNode.content;

  return (
    <>
      <label>
        <span>Label</span>
        <input
          type="text"
          value={c.label}
          disabled={disabled}
          onChange={(event) => onUpdate({ label: event.target.value })}
          placeholder="제출"
        />
      </label>
      <label>
        <span>Style</span>
        <select
          style={selectStyle}
          value={c.style}
          disabled={disabled}
          onChange={(event) => onUpdate({ style: event.target.value })}
        >
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="outline">Outline</option>
          <option value="ghost">Ghost</option>
        </select>
      </label>
      <label>
        <span>Loading label</span>
        <input
          type="text"
          value={c.loadingLabel}
          disabled={disabled}
          onChange={(event) => onUpdate({ loadingLabel: event.target.value })}
          placeholder="전송 중..."
        />
      </label>
      <label>
        <span>Full width</span>
        <input
          type="checkbox"
          checked={c.fullWidth}
          disabled={disabled}
          onChange={(event) => onUpdate({ fullWidth: event.target.checked })}
        />
      </label>
    </>
  );
}
