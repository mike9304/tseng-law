import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderShapeCanvasNode } from '@/lib/builder/canvas/types';
import { getVisualWidgetsCopy } from '../visual-widgets-copy';

import ShapeRender from './Render';

function ShapeInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const sNode = node as BuilderShapeCanvasNode;
  const c = sNode.content;
  const copy = getVisualWidgetsCopy(locale);
  return (
    <>
      <label>
        <span>{copy.shape.inspector.shape}</span>
        <select
          value={c.shape}
          disabled={disabled}
          onChange={(event) => onUpdate({ shape: event.target.value as BuilderShapeCanvasNode['content']['shape'] })}
        >
          <option value="circle">{copy.shape.inspector.shapes.circle}</option>
          <option value="square">{copy.shape.inspector.shapes.square}</option>
          <option value="triangle">{copy.shape.inspector.shapes.triangle}</option>
          <option value="pentagon">{copy.shape.inspector.shapes.pentagon}</option>
          <option value="hexagon">{copy.shape.inspector.shapes.hexagon}</option>
          <option value="star">{copy.shape.inspector.shapes.star}</option>
          <option value="heart">{copy.shape.inspector.shapes.heart}</option>
          <option value="arrow">{copy.shape.inspector.shapes.arrow}</option>
          <option value="blob">{copy.shape.inspector.shapes.blob}</option>
        </select>
      </label>
      <label>
        <span>{copy.shape.inspector.fill}</span>
        <input type="text" value={c.fill} disabled={disabled} onChange={(event) => onUpdate({ fill: event.target.value })} />
      </label>
      <label>
        <span>{copy.shape.inspector.strokeColor}</span>
        <input type="text" value={c.stroke} disabled={disabled} onChange={(event) => onUpdate({ stroke: event.target.value })} />
      </label>
      <label>
        <span>{copy.shape.inspector.strokeWidth}</span>
        <input
          type="number"
          min={0}
          max={20}
          value={c.strokeWidth}
          disabled={disabled}
          onChange={(event) => onUpdate({ strokeWidth: Number(event.target.value) })}
        />
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'shape',
  displayName: '도형',
  category: 'advanced',
  icon: '◆',
  defaultContent: {
    shape: 'circle' as const,
    fill: '#1d4ed8',
    stroke: '',
    strokeWidth: 0,
  },
  defaultStyle: {},
  defaultRect: { width: 160, height: 160 },
  Render: ShapeRender,
  Inspector: ShapeInspector,
});
