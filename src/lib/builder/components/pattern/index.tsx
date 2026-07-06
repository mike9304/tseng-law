import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderPatternCanvasNode } from '@/lib/builder/canvas/types';
import { getNavigationDecorativeCopy } from '../navigation-decorative-copy';

function patternStyle(c: BuilderPatternCanvasNode['content']): React.CSSProperties {
  const size = `${c.scale}px ${c.scale}px`;
  if (c.pattern === 'dots') {
    return {
      backgroundColor: c.background,
      backgroundImage: `radial-gradient(${c.color} 22%, transparent 22%)`,
      backgroundSize: size,
    };
  }
  if (c.pattern === 'grid') {
    return {
      backgroundColor: c.background,
      backgroundImage: `linear-gradient(${c.color} 1px, transparent 1px), linear-gradient(90deg, ${c.color} 1px, transparent 1px)`,
      backgroundSize: size,
    };
  }
  if (c.pattern === 'diagonal') {
    return {
      backgroundColor: c.background,
      backgroundImage: `repeating-linear-gradient(45deg, ${c.color} 0, ${c.color} 2px, transparent 2px, transparent ${c.scale / 2}px)`,
    };
  }
  if (c.pattern === 'stripes') {
    return {
      backgroundColor: c.background,
      backgroundImage: `repeating-linear-gradient(90deg, ${c.color} 0, ${c.color} 4px, transparent 4px, transparent ${c.scale}px)`,
    };
  }
  if (c.pattern === 'waves') {
    return {
      backgroundColor: c.background,
      backgroundImage:
        `radial-gradient(circle at 50% 100%, transparent 28%, ${c.color} 28%, ${c.color} 31%, transparent 31%)`,
      backgroundSize: size,
    };
  }
  if (c.pattern === 'checkerboard') {
    return {
      backgroundColor: c.background,
      backgroundImage: `
        linear-gradient(45deg, ${c.color} 25%, transparent 25%),
        linear-gradient(-45deg, ${c.color} 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, ${c.color} 75%),
        linear-gradient(-45deg, transparent 75%, ${c.color} 75%)
      `,
      backgroundSize: size,
      backgroundPosition: `0 0, 0 ${c.scale / 2}px, ${c.scale / 2}px -${c.scale / 2}px, -${c.scale / 2}px 0`,
    };
  }
  return { backgroundColor: c.background };
}

function PatternRender({
  node,
}: {
  node: BuilderPatternCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  return (
    <div
      className="builder-decorative-pattern"
      data-builder-decorative-widget="pattern"
      data-builder-pattern-kind={c.pattern}
      style={{ width: '100%', height: '100%', ...patternStyle(c) }}
    />
  );
}

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
