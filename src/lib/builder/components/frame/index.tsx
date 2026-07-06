import type { CSSProperties } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderFrameCanvasNode } from '@/lib/builder/canvas/types';
import { getVisualWidgetsCopy } from '../visual-widgets-copy';

function frameStyle(c: BuilderFrameCanvasNode['content']): CSSProperties {
  switch (c.style) {
    case 'double':
      return {
        border: `${c.width}px double ${c.color}`,
        borderRadius: c.radius,
      };
    case 'corner':
      return {
        border: `${c.width}px solid ${c.color}`,
        borderRadius: c.radius,
        boxShadow: `inset 0 0 0 4px rgba(255,255,255,0.4)`,
        outline: `2px solid ${c.color}`,
        outlineOffset: 6,
      };
    case 'photo':
      return {
        border: `${c.width}px solid ${c.color}`,
        borderRadius: c.radius,
        boxShadow: '0 18px 40px rgba(15,23,42,0.18)',
        background: '#ffffff',
        padding: 14,
      };
    case 'tag':
      return {
        border: `${c.width}px solid ${c.color}`,
        borderRadius: c.radius,
        background: `${c.color}11`,
      };
    case 'solid':
    default:
      return {
        border: `${c.width}px solid ${c.color}`,
        borderRadius: c.radius,
      };
  }
}

function FrameRender({
  node,
}: {
  node: BuilderFrameCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  return (
    <div
      className="builder-decorative-frame"
      data-builder-decorative-widget="frame"
      data-builder-frame-style={c.style}
      style={{ width: '100%', height: '100%', position: 'relative', boxSizing: 'border-box', ...frameStyle(c) }}
    >
      {c.label ? (
        <span
          className="builder-decorative-frame-label"
          style={{
            position: 'absolute',
            top: -10,
            left: 16,
            background: '#ffffff',
            padding: '0 8px',
            color: c.color,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {c.label}
        </span>
      ) : null}
    </div>
  );
}

function FrameInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const fNode = node as BuilderFrameCanvasNode;
  const c = fNode.content;
  const copy = getVisualWidgetsCopy(locale);
  return (
    <>
      <label>
        <span>{copy.frame.inspector.style}</span>
        <select
          value={c.style}
          disabled={disabled}
          onChange={(event) => onUpdate({ style: event.target.value as BuilderFrameCanvasNode['content']['style'] })}
        >
          <option value="solid">{copy.frame.inspector.styles.solid}</option>
          <option value="double">{copy.frame.inspector.styles.double}</option>
          <option value="corner">{copy.frame.inspector.styles.corner}</option>
          <option value="photo">{copy.frame.inspector.styles.photo}</option>
          <option value="tag">{copy.frame.inspector.styles.tag}</option>
        </select>
      </label>
      <label>
        <span>{copy.frame.inspector.color}</span>
        <input type="text" value={c.color} disabled={disabled} onChange={(event) => onUpdate({ color: event.target.value })} />
      </label>
      <label>
        <span>{copy.frame.inspector.width}</span>
        <input
          type="number"
          min={1}
          max={40}
          value={c.width}
          disabled={disabled}
          onChange={(event) => onUpdate({ width: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>{copy.frame.inspector.radius}</span>
        <input
          type="number"
          min={0}
          max={120}
          value={c.radius}
          disabled={disabled}
          onChange={(event) => onUpdate({ radius: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>{copy.frame.inspector.label}</span>
        <input type="text" value={c.label} disabled={disabled} onChange={(event) => onUpdate({ label: event.target.value })} />
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'frame',
  displayName: '프레임',
  category: 'advanced',
  icon: '▢',
  defaultContent: {
    style: 'solid' as const,
    color: '#0f172a',
    width: 4,
    radius: 12,
    label: '',
  },
  defaultStyle: {},
  defaultRect: { width: 220, height: 220 },
  Render: FrameRender,
  Inspector: FrameInspector,
});
