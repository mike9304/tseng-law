import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderPatternCanvasNode } from '@/lib/builder/canvas/types';
import { getNavigationDecorativeCopy } from '../navigation-decorative-copy';

import PatternRender from './Render';

function PatternInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const pNode = node as BuilderPatternCanvasNode;
  const c = pNode.content;
  const copy = getNavigationDecorativeCopy(locale);
  return (
    <>
      <label>
        <span>{copy.pattern.inspector.pattern}</span>
        <select
          value={c.pattern}
          disabled={disabled}
          onChange={(event) => onUpdate({ pattern: event.target.value as BuilderPatternCanvasNode['content']['pattern'] })}
        >
          <option value="dots">{copy.pattern.inspector.patterns.dots}</option>
          <option value="grid">{copy.pattern.inspector.patterns.grid}</option>
          <option value="diagonal">{copy.pattern.inspector.patterns.diagonal}</option>
          <option value="stripes">{copy.pattern.inspector.patterns.stripes}</option>
          <option value="waves">{copy.pattern.inspector.patterns.waves}</option>
          <option value="checkerboard">{copy.pattern.inspector.patterns.checkerboard}</option>
        </select>
      </label>
      <label>
        <span>{copy.pattern.inspector.foregroundColor}</span>
        <input type="text" value={c.color} disabled={disabled} onChange={(event) => onUpdate({ color: event.target.value })} />
      </label>
      <label>
        <span>{copy.pattern.inspector.backgroundColor}</span>
        <input type="text" value={c.background} disabled={disabled} onChange={(event) => onUpdate({ background: event.target.value })} />
      </label>
      <label>
        <span>{copy.pattern.inspector.scale}</span>
        <input
          type="number"
          min={4}
          max={120}
          value={c.scale}
          disabled={disabled}
          onChange={(event) => onUpdate({ scale: Number(event.target.value) })}
        />
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'pattern',
  displayName: '패턴',
  category: 'advanced',
  icon: '▦',
  defaultContent: {
    pattern: 'dots' as const,
    color: '#cbd5e1',
    background: '#f8fafc',
    scale: 24,
  },
  defaultStyle: {},
  defaultRect: { width: 360, height: 240 },
  Render: PatternRender,
  Inspector: PatternInspector,
});
