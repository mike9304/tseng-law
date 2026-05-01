import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderHeadingCanvasNode } from '@/lib/builder/canvas/types';
import ColorPicker from '@/components/builder/editor/ColorPicker';
import FontPicker from '@/components/builder/editor/FontPicker';
import ThemeTextPresetPicker from '@/components/builder/editor/ThemeTextPresetPicker';
import { useBuilderTheme } from '@/components/builder/editor/BuilderThemeContext';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import {
  THEME_COLOR_LABELS,
  THEME_COLOR_TOKENS,
  type BuilderColorValue,
  createThemeTextPresetPatch,
  resolveThemeTextTypography,
} from '@/lib/builder/site/theme';

const LEVEL_TO_SIZE = {
  1: 48,
  2: 40,
  3: 32,
  4: 28,
  5: 24,
  6: 20,
} as const;

export default function HeadingInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const headingNode = node as BuilderHeadingCanvasNode;
  const theme = useBuilderTheme();
  const level = Math.max(1, Math.min(6, headingNode.content.level)) as keyof typeof LEVEL_TO_SIZE;
  const typography = resolveThemeTextTypography(
    {
      themePreset: headingNode.content.themePreset,
      fontFamily: headingNode.content.fontFamily,
      fontSize: headingNode.content.fontSize ?? LEVEL_TO_SIZE[level],
      fontWeight: headingNode.content.fontWeight ?? 'bold',
      lineHeight: headingNode.content.lineHeight ?? 1.05,
      letterSpacing: headingNode.content.letterSpacing ?? 0,
      color: headingNode.content.color,
    },
    theme,
  );
  const paletteTokens = THEME_COLOR_TOKENS.map((token) => ({
    token,
    label: THEME_COLOR_LABELS[token],
    color: theme.colors[token],
  }));
  const updateDetachedTypography = (props: Record<string, unknown>) => {
    onUpdate({ ...props, themePreset: undefined });
  };

  return (
    <>
      <label>
        <span>Theme preset</span>
        <ThemeTextPresetPicker
          value={headingNode.content.themePreset}
          disabled={disabled}
          onChange={(key) => onUpdate(createThemeTextPresetPatch(key, theme))}
          onClear={() => onUpdate({ themePreset: undefined })}
        />
      </label>
      <label>
        <span>Heading</span>
        <textarea
          value={headingNode.content.text}
          rows={3}
          disabled={disabled}
          onChange={(event) => {
            const text = event.target.value;
            onUpdate({ text, richText: richTextFromPlainText(text) });
          }}
        />
        <small style={{ color: '#b45309', fontSize: '0.72rem', lineHeight: 1.35 }}>
          ⚠ 텍스트만 편집하면 서식이 사라집니다. 캔버스에서 직접 편집하세요.
        </small>
      </label>
      <label>
        <span>Font</span>
        <FontPicker
          value={typography.fontFamily}
          disabled={disabled}
          onChange={(fontFamily) => updateDetachedTypography({ fontFamily })}
        />
      </label>
      <label>
        <span>Level</span>
        <select
          value={headingNode.content.level}
          disabled={disabled}
          onChange={(event) => onUpdate({ level: Number(event.target.value) })}
        >
          <option value={1}>H1</option>
          <option value={2}>H2</option>
          <option value={3}>H3</option>
          <option value={4}>H4</option>
          <option value={5}>H5</option>
          <option value={6}>H6</option>
        </select>
      </label>
      <label>
        <span>Color</span>
        <ColorPicker
          value={typography.color}
          paletteTokens={paletteTokens}
          disabled={disabled}
          onChange={(color: BuilderColorValue) => updateDetachedTypography({ color })}
        />
      </label>
      <label>
        <span>Font size</span>
        <input
          type="number"
          min={12}
          max={160}
          value={typography.fontSize}
          disabled={disabled}
          onChange={(event) => updateDetachedTypography({ fontSize: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>Weight</span>
        <select
          value={typography.fontWeight}
          disabled={disabled}
          onChange={(event) => updateDetachedTypography({ fontWeight: event.target.value })}
        >
          <option value="regular">Regular</option>
          <option value="medium">Medium</option>
          <option value="bold">Bold</option>
        </select>
      </label>
      <label>
        <span>Line height</span>
        <input
          type="range"
          min={0.5}
          max={4}
          step={0.05}
          value={typography.lineHeight}
          disabled={disabled}
          onChange={(event) => updateDetachedTypography({ lineHeight: Number(event.target.value) })}
        />
        <span>{typography.lineHeight.toFixed(2)}</span>
      </label>
      <label>
        <span>Letter spacing</span>
        <input
          type="number"
          min={-2}
          max={10}
          step={0.5}
          value={typography.letterSpacing}
          disabled={disabled}
          onChange={(event) => updateDetachedTypography({ letterSpacing: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>Align</span>
        <select
          value={headingNode.content.align}
          disabled={disabled}
          onChange={(event) => onUpdate({ align: event.target.value })}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </label>
    </>
  );
}
