import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderTextCanvasNode } from '@/lib/builder/canvas/types';

export default function TextInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const textNode = node as BuilderTextCanvasNode;

  return (
    <>
      <label>
        <span>Text</span>
        <textarea
          value={textNode.content.text}
          rows={4}
          disabled={disabled}
          onChange={(event) => onUpdate({ text: event.target.value })}
        />
      </label>
      <label>
        <span>Font size</span>
        <input
          type="number"
          min={12}
          max={72}
          value={textNode.content.fontSize}
          disabled={disabled}
          onChange={(event) => onUpdate({ fontSize: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>Color</span>
        <input
          type="color"
          value={normalizeHex(textNode.content.color)}
          disabled={disabled}
          onChange={(event) => onUpdate({ color: event.target.value })}
        />
      </label>
      <label>
        <span>Weight</span>
        <select
          value={textNode.content.fontWeight}
          disabled={disabled}
          onChange={(event) => onUpdate({ fontWeight: event.target.value })}
        >
          <option value="regular">Regular</option>
          <option value="medium">Medium</option>
          <option value="bold">Bold</option>
        </select>
      </label>
      <label>
        <span>Align</span>
        <select
          value={textNode.content.align}
          disabled={disabled}
          onChange={(event) => onUpdate({ align: event.target.value })}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </label>
      <label>
        <span>Line height</span>
        <input
          type="range"
          min={0.5}
          max={4}
          step={0.05}
          value={textNode.content.lineHeight ?? 1.25}
          disabled={disabled}
          onChange={(event) => onUpdate({ lineHeight: Number(event.target.value) })}
        />
        <span>{(textNode.content.lineHeight ?? 1.25).toFixed(2)}</span>
      </label>
      <label>
        <span>Letter spacing</span>
        <input
          type="number"
          min={-2}
          max={10}
          step={0.5}
          value={textNode.content.letterSpacing ?? 0}
          disabled={disabled}
          onChange={(event) => onUpdate({ letterSpacing: Number(event.target.value) })}
        />
      </label>
    </>
  );
}

function normalizeHex(value: string): string {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value;
  return '#0f172a';
}
