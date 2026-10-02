import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderDividerCanvasNode } from '@/lib/builder/canvas/types';
import ColorPicker from '@/components/builder/editor/ColorPicker';
import { useBuilderTheme } from '@/components/builder/editor/BuilderThemeContext';
import { THEME_COLOR_TOKENS, type BuilderColorValue } from '@/lib/builder/site/theme';
import { getVisualWidgetsCopy } from '../visual-widgets-copy';

import DividerRender from './Render';

function DividerInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const dividerNode = node as BuilderDividerCanvasNode;
  const theme = useBuilderTheme();
  const copy = getVisualWidgetsCopy(locale);
  const paletteTokens = THEME_COLOR_TOKENS.map((token) => ({
    token,
    label: copy.themeColorLabels[token],
    color: theme.colors[token],
  }));

  return (
    <>
      <label>
        <span>{copy.divider.inspector.orientation}</span>
        <select
          value={dividerNode.content.orientation}
          disabled={disabled}
          onChange={(event) => onUpdate({ orientation: event.target.value })}
        >
          <option value="horizontal">{copy.divider.inspector.orientations.horizontal}</option>
          <option value="vertical">{copy.divider.inspector.orientations.vertical}</option>
        </select>
      </label>
      <label>
        <span>{copy.divider.inspector.thickness}</span>
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
        <span>{copy.divider.inspector.color}</span>
        <ColorPicker
          value={dividerNode.content.color}
          paletteTokens={paletteTokens}
          disabled={disabled}
          onChange={(color: BuilderColorValue) => onUpdate({ color })}
        />
      </label>
      <label>
        <span>{copy.divider.inspector.style}</span>
        <select
          value={dividerNode.content.style}
          disabled={disabled}
          onChange={(event) => onUpdate({ style: event.target.value })}
        >
          <option value="solid">{copy.divider.inspector.styles.solid}</option>
          <option value="dashed">{copy.divider.inspector.styles.dashed}</option>
          <option value="dotted">{copy.divider.inspector.styles.dotted}</option>
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
