import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderDividerCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderTheme } from '@/lib/builder/site/types';
import ColorPicker from '@/components/builder/editor/ColorPicker';
import { useBuilderTheme } from '@/components/builder/editor/BuilderThemeContext';
import {
  THEME_COLOR_LABELS,
  THEME_COLOR_TOKENS,
  type BuilderColorValue,
  resolveThemeColor,
} from '@/lib/builder/site/theme';

function DividerRender({
  node,
  theme,
}: {
  node: BuilderDividerCanvasNode;
  theme?: BuilderTheme;
}) {
  const orientation = node.content.orientation ?? 'horizontal';
  const thickness = Math.max(1, Math.min(10, node.content.thickness ?? 2));
  const style = node.content.style ?? 'solid';
  const color = resolveThemeColor(node.content.color, theme) ?? '#cbd5e1';

  if (orientation === 'vertical') {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: thickness,
            height: '100%',
            borderLeft: `${thickness}px ${style} ${color}`,
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <hr
        style={{
          width: '100%',
          border: 'none',
          borderTop: `${thickness}px ${style} ${color}`,
          margin: 0,
        }}
      />
    </div>
  );
}

function DividerInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const dividerNode = node as BuilderDividerCanvasNode;
  const theme = useBuilderTheme();
  const paletteTokens = THEME_COLOR_TOKENS.map((token) => ({
    token,
    label: THEME_COLOR_LABELS[token],
    color: theme.colors[token],
  }));

  return (
    <>
      <label>
        <span>Orientation</span>
        <select
          value={dividerNode.content.orientation}
          disabled={disabled}
          onChange={(event) => onUpdate({ orientation: event.target.value })}
        >
          <option value="horizontal">Horizontal</option>
          <option value="vertical">Vertical</option>
        </select>
      </label>
      <label>
        <span>Thickness</span>
        <input
          type="number"
          min={1}
          max={10}
          step={1}
          value={dividerNode.content.thickness}
          disabled={disabled}
          onChange={(event) => onUpdate({ thickness: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>Color</span>
        <ColorPicker
          value={dividerNode.content.color}
          paletteTokens={paletteTokens}
          disabled={disabled}
          onChange={(color: BuilderColorValue) => onUpdate({ color })}
        />
      </label>
      <label>
        <span>Style</span>
        <select
          value={dividerNode.content.style}
          disabled={disabled}
          onChange={(event) => onUpdate({ style: event.target.value })}
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'divider',
  displayName: '구분선',
  category: 'advanced',
  icon: '─',
  defaultContent: {
    orientation: 'horizontal' as const,
    thickness: 2,
    color: '#cbd5e1',
    style: 'solid' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 240, height: 2 },
  Render: DividerRender,
  Inspector: DividerInspector,
});
