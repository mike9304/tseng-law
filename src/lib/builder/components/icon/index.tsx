import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderIconCanvasNode } from '@/lib/builder/canvas/types';
import ColorPicker from '@/components/builder/editor/ColorPicker';
import { useBuilderTheme } from '@/components/builder/editor/BuilderThemeContext';
import { THEME_COLOR_TOKENS, type BuilderColorValue } from '@/lib/builder/site/theme';
import { getVisualWidgetsCopy } from '../visual-widgets-copy';

import IconRender from './Render';

function IconInspector({
  node,
  locale = 'ko',
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const iconNode = node as BuilderIconCanvasNode;
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
        <span>{copy.icon.inspector.icon}</span>
        <input
          type="text"
          placeholder={copy.icon.inspector.placeholder}
          value={iconNode.content.name}
          disabled={disabled}
          onChange={(event) => onUpdate({ name: event.target.value })}
        />
      </label>
      <label>
        <span>{copy.icon.inspector.set}</span>
        <select
          value={iconNode.content.set}
          disabled={disabled}
          onChange={(event) => onUpdate({ set: event.target.value })}
        >
          <option value="emoji">{copy.icon.inspector.sets.emoji}</option>
          <option value="unicode">{copy.icon.inspector.sets.unicode}</option>
          <option value="lucide">{copy.icon.inspector.sets.lucide}</option>
          <option value="fontawesome">{copy.icon.inspector.sets.fontawesome}</option>
        </select>
      </label>
      <label>
        <span>{copy.icon.inspector.size}</span>
        <input
          type="number"
          min={12}
          max={120}
          step={1}
          value={iconNode.content.size}
          disabled={disabled}
          onChange={(event) => onUpdate({ size: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>{copy.icon.inspector.color}</span>
        <ColorPicker
          value={iconNode.content.color}
          paletteTokens={paletteTokens}
          disabled={disabled}
          onChange={(color: BuilderColorValue) => onUpdate({ color })}
        />
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'icon',
  displayName: '아이콘',
  category: 'media',
  icon: '✦',
  defaultContent: {
    name: '✦',
    size: 32,
    color: '#0f172a',
    set: 'emoji' as const,
  },
  defaultStyle: {},
  defaultRect: { width: 64, height: 64 },
  Render: IconRender,
  Inspector: IconInspector,
});
