import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderFrameCanvasNode } from '@/lib/builder/canvas/types';
import { getVisualWidgetsCopy } from '../visual-widgets-copy';

import FrameRender from './Render';

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
