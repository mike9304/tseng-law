import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderTextCanvasNode } from '@/lib/builder/canvas/types';
import ColorPicker from '@/components/builder/editor/ColorPicker';
import FontPicker from '@/components/builder/editor/FontPicker';
import LinkPicker from '@/components/builder/editor/LinkPicker';
import ThemeTextPresetPicker from '@/components/builder/editor/ThemeTextPresetPicker';
import { useBuilderTheme } from '@/components/builder/editor/BuilderThemeContext';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import {
  BUILDER_RICH_TEXT_FORMAT,
  type BuilderRichText,
  type TipTapDocJson,
} from '@/lib/builder/rich-text/types';
import type { LinkValue } from '@/lib/builder/links';
import {
  THEME_COLOR_LABELS,
  THEME_COLOR_TOKENS,
  type BuilderColorValue,
  createThemeTextPresetPatch,
  resolveThemeColor,
  resolveThemeTextTypography,
} from '@/lib/builder/site/theme';
import styles from '@/components/builder/canvas/SandboxPage.module.css';

function richTextFromDoc(plainText: string, doc: TipTapDocJson): BuilderRichText {
  return {
    format: BUILDER_RICH_TEXT_FORMAT,
    doc,
    plainText,
  };
}

function quoteRichText(text: string): BuilderRichText {
  return richTextFromDoc(text, {
    type: 'doc',
    content: [
      {
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: text ? [{ type: 'text', text }] : undefined,
          },
        ],
      },
    ],
  });
}

function bulletListRichText(text: string): BuilderRichText {
  const lines = text
    .split(/\r\n?|\n/g)
    .map((line) => line.trim())
    .filter(Boolean);
  const items = lines.length > 0 ? lines : ['첫 번째 항목', '두 번째 항목', '세 번째 항목'];
  return richTextFromDoc(items.join('\n'), {
    type: 'doc',
    content: [
      {
        type: 'bulletList',
        content: items.map((item) => ({
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: item }],
            },
          ],
        })),
      },
    ],
  });
}

export default function TextInspector({
  node,
  onUpdate,
  disabled = false,
  linkPickerContext,
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
          onChange={(event) => {
            const text = event.target.value;
            onUpdate({ text, richText: richTextFromPlainText(text) });
          }}
        />
        <small style={{ color: '#b45309', fontSize: '0.72rem', lineHeight: 1.35 }}>
          ⚠ 텍스트만 편집하면 서식이 사라집니다. 캔버스에서 직접 편집하세요.
        </small>
      </label>
      <fieldset style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 10px', margin: 0 }}>
        <legend style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', padding: '0 4px' }}>Rich text shortcuts</legend>
        <div className={styles.inspectorActionRow}>
          <button
            type="button"
            className={styles.actionButton}
            disabled={disabled}
            onClick={() => {
              const richText = quoteRichText(textNode.content.text);
              onUpdate({ richText, text: richText.plainText, quoteStyle: 'classic', themePreset: 'quote' });
            }}
          >
            Quote
          </button>
          <button
            type="button"
            className={styles.actionButton}
            disabled={disabled}
            onClick={() => {
              const richText = bulletListRichText(textNode.content.text);
              onUpdate({ richText, text: richText.plainText, quoteStyle: 'none', columns: 1 });
            }}
          >
            Bullet list
          </button>
          <button
            type="button"
            className={styles.actionButton}
            disabled={disabled}
            onClick={() => onUpdate({ richText: richTextFromPlainText(textNode.content.text) })}
          >
            Plain block
          </button>
        </div>
      </fieldset>
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
      <fieldset style={{ border: '1px solid #e2e8f0', borderRadius: 8, padding: '8px 10px', margin: 0 }}>
        <legend style={{ fontSize: '0.75rem', fontWeight: 600, color: '#334155', padding: '0 4px' }}>Text effects</legend>
        <label>
          <span>Columns</span>
          <input
            type="number"
            min={1}
            max={4}
            value={textNode.content.columns ?? 1}
            disabled={disabled}
            onChange={(event) => onUpdate({ columns: Number(event.target.value) })}
          />
        </label>
        <label>
          <span>Column gap</span>
          <input
            type="number"
            min={0}
            max={96}
            value={textNode.content.columnGap ?? 24}
            disabled={disabled || (textNode.content.columns ?? 1) <= 1}
            onChange={(event) => onUpdate({ columnGap: Number(event.target.value) })}
          />
        </label>
        <label>
          <span>Quote style</span>
          <select
            value={textNode.content.quoteStyle ?? 'none'}
            disabled={disabled}
            onChange={(event) => onUpdate({ quoteStyle: event.target.value })}
          >
            <option value="none">None</option>
            <option value="classic">Classic rule</option>
            <option value="pull">Pull quote</option>
          </select>
        </label>
        <label>
          <span>Marquee</span>
          <input
            type="checkbox"
            checked={Boolean(textNode.content.marquee?.enabled)}
            disabled={disabled}
            onChange={(event) =>
              onUpdate({
                marquee: event.target.checked
                  ? {
                      enabled: true,
                      speed: textNode.content.marquee?.speed ?? 22,
                      direction: textNode.content.marquee?.direction ?? 'left',
                    }
                  : undefined,
              })
            }
          />
        </label>
        {textNode.content.marquee?.enabled ? (
          <>
            <label>
              <span>Marquee speed</span>
              <input
                type="number"
                min={5}
                max={120}
                value={textNode.content.marquee.speed ?? 22}
                disabled={disabled}
                onChange={(event) =>
                  onUpdate({
                    marquee: {
                      enabled: true,
                      speed: Number(event.target.value),
                      direction: textNode.content.marquee?.direction ?? 'left',
                    },
                  })
                }
              />
            </label>
            <label>
              <span>Direction</span>
              <select
                value={textNode.content.marquee.direction ?? 'left'}
                disabled={disabled}
                onChange={(event) =>
                  onUpdate({
                    marquee: {
                      enabled: true,
                      speed: textNode.content.marquee?.speed ?? 22,
                      direction: event.target.value,
                    },
                  })
                }
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </label>
          </>
        ) : null}
        <label>
          <span>Text on path</span>
          <input
            type="checkbox"
            checked={Boolean(textNode.content.textPath?.enabled)}
            disabled={disabled}
            onChange={(event) =>
              onUpdate({
                textPath: event.target.checked
                  ? {
                      enabled: true,
                      curve: textNode.content.textPath?.curve ?? 'arc',
                      baseline: textNode.content.textPath?.baseline ?? 62,
                    }
                  : undefined,
              })
            }
          />
        </label>
        {textNode.content.textPath?.enabled ? (
          <>
            <label>
              <span>Path curve</span>
              <select
                value={textNode.content.textPath.curve ?? 'arc'}
                disabled={disabled}
                onChange={(event) =>
                  onUpdate({
                    textPath: {
                      enabled: true,
                      curve: event.target.value,
                      baseline: textNode.content.textPath?.baseline ?? 62,
                    },
                  })
                }
              >
                <option value="arc">Arc</option>
                <option value="wave">Wave</option>
              </select>
            </label>
            <label>
              <span>Path baseline</span>
              <input
                type="range"
                min={20}
                max={90}
                value={textNode.content.textPath.baseline ?? 62}
                disabled={disabled}
                onChange={(event) =>
                  onUpdate({
                    textPath: {
                      enabled: true,
                      curve: textNode.content.textPath?.curve ?? 'arc',
                      baseline: Number(event.target.value),
                    },
                  })
                }
              />
              <span>{textNode.content.textPath.baseline ?? 62}</span>
            </label>
          </>
        ) : null}
      </fieldset>
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569' }}>
          Link
        </span>
        <LinkPicker
          value={(textNode.content.link ?? null) as LinkValue | null}
          onChange={(link) => onUpdate({ link: link ?? undefined })}
          context={linkPickerContext}
          disabled={disabled}
        />
      </div>
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
