import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderIconCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderTheme } from '@/lib/builder/site/types';
import ColorPicker from '@/components/builder/editor/ColorPicker';
import { useBuilderTheme } from '@/components/builder/editor/BuilderThemeContext';
import {
  THEME_COLOR_LABELS,
  THEME_COLOR_TOKENS,
  type BuilderColorValue,
  resolveThemeColor,
} from '@/lib/builder/site/theme';

function IconRender({
  node,
  theme,
}: {
  node: BuilderIconCanvasNode;
  theme?: BuilderTheme;
}) {
  const name = node.content.name || '✦';
  const size = Math.max(12, Math.min(120, node.content.size ?? 32));
  const color = resolveThemeColor(node.content.color, theme) ?? '#0f172a';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          fontSize: size,
          color,
          display: 'inline-block',
          lineHeight: 1,
          fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", system-ui, sans-serif',
        }}
      >
        {name}
      </span>
    </div>
  );
}

function IconInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const iconNode = node as BuilderIconCanvasNode;
  const theme = useBuilderTheme();
  const paletteTokens = THEME_COLOR_TOKENS.map((token) => ({
    token,
    label: THEME_COLOR_LABELS[token],
    color: theme.colors[token],
  }));

  return (
    <>
      <label>
        <span>Icon</span>
        <input
          type="text"
          placeholder="이모지 또는 유니코드"
          value={iconNode.content.name}
          disabled={disabled}
          onChange={(event) => onUpdate({ name: event.target.value })}
        />
      </label>
      <label>
        <span>Set</span>
        <select
          value={iconNode.content.set}
          disabled={disabled}
          onChange={(event) => onUpdate({ set: event.target.value })}
        >
          <option value="emoji">Emoji</option>
          <option value="unicode">Unicode</option>
        </select>
      </label>
      <label>
        <span>Size</span>
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
        <span>Color</span>
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
