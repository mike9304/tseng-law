import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderShapeCanvasNode } from '@/lib/builder/canvas/types';

function shapePath(shape: BuilderShapeCanvasNode['content']['shape']): string {
  switch (shape) {
    case 'circle': return 'M 50,50 m -45,0 a 45,45 0 1,0 90,0 a 45,45 0 1,0 -90,0';
    case 'square': return 'M 8,8 L 92,8 L 92,92 L 8,92 Z';
    case 'triangle': return 'M 50,8 L 92,90 L 8,90 Z';
    case 'pentagon': return 'M 50,5 L 95,38 L 78,92 L 22,92 L 5,38 Z';
    case 'hexagon': return 'M 25,8 L 75,8 L 95,50 L 75,92 L 25,92 L 5,50 Z';
    case 'star': return 'M 50,5 L 61,38 L 95,38 L 67,58 L 78,92 L 50,72 L 22,92 L 33,58 L 5,38 L 39,38 Z';
    case 'heart': return 'M 50,90 C 8,55 8,20 30,20 C 40,20 50,30 50,40 C 50,30 60,20 70,20 C 92,20 92,55 50,90 Z';
    case 'arrow': return 'M 8,40 L 60,40 L 60,20 L 95,50 L 60,80 L 60,60 L 8,60 Z';
    case 'blob': return 'M 30,12 C 60,5 95,30 92,55 C 90,85 65,98 38,92 C 12,86 5,55 12,38 C 16,25 22,16 30,12 Z';
    default: return 'M 8,8 L 92,8 L 92,92 L 8,92 Z';
  }
}

function ShapeRender({
  node,
}: {
  node: BuilderShapeCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  return (
    <svg
      className="builder-decorative-shape"
      data-builder-decorative-widget="shape"
      data-builder-shape-kind={c.shape}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      style={{ width: '100%', height: '100%' }}
    >
      <path
        d={shapePath(c.shape)}
        fill={c.fill}
        stroke={c.stroke || 'none'}
        strokeWidth={c.strokeWidth}
      />
    </svg>
  );
}

function ShapeInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const sNode = node as BuilderShapeCanvasNode;
  const c = sNode.content;
  return (
    <>
      <label>
        <span>모양</span>
        <select
          value={c.shape}
          disabled={disabled}
          onChange={(event) => onUpdate({ shape: event.target.value as BuilderShapeCanvasNode['content']['shape'] })}
        >
          <option value="circle">Circle</option>
          <option value="square">Square</option>
          <option value="triangle">Triangle</option>
          <option value="pentagon">Pentagon</option>
          <option value="hexagon">Hexagon</option>
          <option value="star">Star</option>
          <option value="heart">Heart</option>
          <option value="arrow">Arrow</option>
          <option value="blob">Blob</option>
        </select>
      </label>
      <label>
        <span>채움</span>
        <input type="text" value={c.fill} disabled={disabled} onChange={(event) => onUpdate({ fill: event.target.value })} />
      </label>
      <label>
        <span>외곽선 색</span>
        <input type="text" value={c.stroke} disabled={disabled} onChange={(event) => onUpdate({ stroke: event.target.value })} />
      </label>
      <label>
        <span>외곽선 두께</span>
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
