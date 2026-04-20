import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderHeadingCanvasNode } from '@/lib/builder/canvas/types';
import FontPicker from '@/components/builder/editor/FontPicker';

export default function HeadingInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const headingNode = node as BuilderHeadingCanvasNode;

  return (
    <>
      <label>
        <span>Heading</span>
        <textarea
          value={headingNode.content.text}
          rows={3}
          disabled={disabled}
          onChange={(event) => onUpdate({ text: event.target.value })}
        />
      </label>
      <label>
        <span>Font</span>
        <FontPicker
          value={headingNode.content.fontFamily || 'system-ui'}
          disabled={disabled}
          onChange={(fontFamily) => onUpdate({ fontFamily })}
        />
      </label>
      <label>
        <span>Level</span>
        <select
          value={headingNode.content.level}
          disabled={disabled}
          onChange={(event) => onUpdate({ level: Number(event.target.value) })}
        >
          <option value={1}>H1</option>
          <option value={2}>H2</option>
          <option value={3}>H3</option>
          <option value={4}>H4</option>
          <option value={5}>H5</option>
          <option value={6}>H6</option>
        </select>
      </label>
      <label>
        <span>Color</span>
        <input
          type="color"
          value={normalizeHex(headingNode.content.color)}
          disabled={disabled}
          onChange={(event) => onUpdate({ color: event.target.value })}
        />
      </label>
      <label>
        <span>Align</span>
        <select
          value={headingNode.content.align}
          disabled={disabled}
          onChange={(event) => onUpdate({ align: event.target.value })}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </label>
    </>
  );
}

function normalizeHex(value: string): string {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value;
  return '#0f172a';
}
