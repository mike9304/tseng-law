import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderTextCanvasNode } from '@/lib/builder/canvas/types';
import ColorPicker from '@/components/builder/editor/ColorPicker';
import FontPicker from '@/components/builder/editor/FontPicker';
import ThemeTextPresetPicker from '@/components/builder/editor/ThemeTextPresetPicker';
import { useBuilderTheme } from '@/components/builder/editor/BuilderThemeContext';
import {
  THEME_COLOR_LABELS,
  THEME_COLOR_TOKENS,
  type BuilderColorValue,
  createThemeTextPresetPatch,
  resolveThemeColor,
  resolveThemeTextTypography,
} from '@/lib/builder/site/theme';

export default function TextInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const textNode = node as BuilderTextCanvasNode;
  const theme = useBuilderTheme();
  const typography = resolveThemeTextTypography(textNode.content, theme);
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
          value={textNode.content.themePreset}
          disabled={disabled}
          onChange={(key) => onUpdate(createThemeTextPresetPatch(key, theme))}
          onClear={() => onUpdate({ themePreset: undefined })}
        />
      </label>
      <label>
        <span>Text</span>
        <textarea
          value={textNode.content.text}
          rows={4}
          disabled={disabled}
          onChange={(event) => onUpdate({ text: event.target.value })}
        />
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
        <span>Color</span>
        <ColorPicker
          value={typography.color}
          paletteTokens={paletteTokens}
          disabled={disabled}
          onChange={(color: BuilderColorValue) => updateDetachedTypography({ color })}
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
        <span>Align</span>
        <select
          value={textNode.content.align}
          disabled={disabled}
          onChange={(event) => onUpdate({ align: event.target.value })}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
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
        <span>Vertical align</span>
        <select
          value={textNode.content.verticalAlign ?? 'top'}
          disabled={disabled}
          onChange={(event) => onUpdate({ verticalAlign: event.target.value })}
        >
          <option value="top">Top</option>
          <option value="center">Center</option>
          <option value="bottom">Bottom</option>
        </select>
      </label>
      <label>
        <span>Text transform</span>
        <select
          value={textNode.content.textTransform ?? 'none'}
          disabled={disabled}
          onChange={(event) => onUpdate({ textTransform: event.target.value })}
        >
          <option value="none">None</option>
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="capitalize">Capitalize</option>
        </select>
      </label>
      <label>
        <span>Background color</span>
        <ColorPicker
          value={textNode.content.backgroundColor}
          paletteTokens={paletteTokens}
          disabled={disabled}
          onChange={(color: BuilderColorValue) => onUpdate({ backgroundColor: color })}
        />
        {textNode.content.backgroundColor && (
          <button
            type="button"
            disabled={disabled}
            style={{ fontSize: '0.72rem', marginTop: 2, cursor: 'pointer', background: 'none', border: '1px solid #cbd5e1', borderRadius: 4, padding: '2px 6px', color: '#64748b' }}
            onClick={() => onUpdate({ backgroundColor: '' })}
          >
            Clear
          </button>
        )}
      </label>
      <fieldset style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 10px', margin: 0 }}>
        <legend style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', padding: '0 4px' }}>Text shadow</legend>
        <label>
          <span>X</span>
          <input
            type="number"
            min={-50}
            max={50}
            step={1}
            value={textNode.content.textShadow?.x ?? 0}
            disabled={disabled}
            onChange={(event) =>
              onUpdate({
                textShadow: {
                  x: Number(event.target.value),
                  y: textNode.content.textShadow?.y ?? 0,
                  blur: textNode.content.textShadow?.blur ?? 0,
                  color: textNode.content.textShadow?.color ?? 'rgba(0,0,0,0.3)',
                },
              })
            }
          />
        </label>
        <label>
          <span>Y</span>
          <input
            type="number"
            min={-50}
            max={50}
            step={1}
            value={textNode.content.textShadow?.y ?? 0}
            disabled={disabled}
            onChange={(event) =>
              onUpdate({
                textShadow: {
                  x: textNode.content.textShadow?.x ?? 0,
                  y: Number(event.target.value),
                  blur: textNode.content.textShadow?.blur ?? 0,
                  color: textNode.content.textShadow?.color ?? 'rgba(0,0,0,0.3)',
                },
              })
            }
          />
        </label>
        <label>
          <span>Blur</span>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            value={textNode.content.textShadow?.blur ?? 0}
            disabled={disabled}
            onChange={(event) =>
              onUpdate({
                textShadow: {
                  x: textNode.content.textShadow?.x ?? 0,
                  y: textNode.content.textShadow?.y ?? 0,
                  blur: Number(event.target.value),
                  color: textNode.content.textShadow?.color ?? 'rgba(0,0,0,0.3)',
                },
              })
            }
          />
        </label>
        <label>
          <span>Color</span>
          <input
            type="color"
            value={normalizeHex(resolveThemeColor(textNode.content.textShadow?.color ?? '#000000', theme))}
            disabled={disabled}
            onChange={(event) =>
              onUpdate({
                textShadow: {
                  x: textNode.content.textShadow?.x ?? 0,
                  y: textNode.content.textShadow?.y ?? 0,
                  blur: textNode.content.textShadow?.blur ?? 0,
                  color: event.target.value,
                },
              })
            }
          />
        </label>
        {textNode.content.textShadow && (
          <button
            type="button"
            disabled={disabled}
            style={{ fontSize: '0.72rem', marginTop: 4, cursor: 'pointer', background: 'none', border: '1px solid #cbd5e1', borderRadius: 4, padding: '2px 6px', color: '#64748b' }}
            onClick={() => onUpdate({ textShadow: undefined })}
          >
            Clear shadow
          </button>
        )}
      </fieldset>
    </>
  );
}

function normalizeHex(value: string): string {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value;
  return '#0f172a';
}
