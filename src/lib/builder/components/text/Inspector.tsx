import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderTextCanvasNode } from '@/lib/builder/canvas/types';
import ColorPicker from '@/components/builder/editor/ColorPicker';
import FontPicker from '@/components/builder/editor/FontPicker';
import LinkPicker from '@/components/builder/editor/LinkPicker';
import ThemeTextPresetPicker from '@/components/builder/editor/ThemeTextPresetPicker';
import { useBuilderTheme } from '@/components/builder/editor/BuilderThemeContext';
import { getTextControlsCopy } from '@/components/builder/editor/text-controls-copy';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import { localizedTextDefault } from './text-copy';
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
import styles from './TextInspector.module.css';

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

export function bulletListRichText(text: string, fallbackItems: string[]): BuilderRichText {
  const lines = text
    .split(/\r\n?|\n/g)
    .map((line) => line.trim())
    .filter(Boolean);
  const items = lines.length > 0 ? lines : fallbackItems;
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
  locale = 'en',
}: BuilderComponentInspectorProps) {
  const textNode = node as BuilderTextCanvasNode;
  const theme = useBuilderTheme();
  const copy = getTextControlsCopy(locale);
  const text = localizedTextDefault(textNode.content.text, locale);
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
    <div className={styles.root} data-builder-text-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.textInspector.themePresetLabel}</span>
        <ThemeTextPresetPicker
          value={textNode.content.themePreset}
          disabled={disabled}
          locale={locale}
          onChange={(key) => onUpdate(createThemeTextPresetPatch(key, theme))}
          onClear={() => onUpdate({ themePreset: undefined })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.textInspector.textLabel}</span>
        <textarea
          value={text}
          rows={4}
          disabled={disabled}
          className={`${styles.control} ${styles.textarea}`}
          onChange={(event) => {
            const text = event.target.value;
            onUpdate({ text, richText: richTextFromPlainText(text) });
          }}
        />
        <small className={styles.warning}>{copy.textInspector.warning}</small>
      </label>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{copy.textInspector.shortcutHeading}</legend>
        <div className={styles.actionRow}>
          <button
            type="button"
            className={styles.actionButton}
            disabled={disabled}
            onClick={() => {
              const richText = quoteRichText(text);
              onUpdate({ richText, text: richText.plainText, quoteStyle: 'classic', themePreset: 'quote' });
            }}
          >
            {copy.textInspector.quoteLabel}
          </button>
          <button
            type="button"
            className={styles.actionButton}
            disabled={disabled}
            onClick={() => {
              const richText = bulletListRichText(text, copy.textInspector.bulletListFallbackItems);
              onUpdate({ richText, text: richText.plainText, quoteStyle: 'none', columns: 1 });
            }}
          >
            {copy.textInspector.bulletListLabel}
          </button>
          <button
            type="button"
            className={styles.actionButton}
            disabled={disabled}
            onClick={() => onUpdate({ richText: richTextFromPlainText(text) })}
          >
            {copy.textInspector.plainBlockLabel}
          </button>
        </div>
      </fieldset>
      <label className={styles.field}>
        <span className={styles.label}>{copy.textInspector.fontLabel}</span>
        <FontPicker
          value={typography.fontFamily}
          disabled={disabled}
          locale={locale}
          onChange={(fontFamily) => updateDetachedTypography({ fontFamily })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.textInspector.fontSizeLabel}</span>
        <input
          type="number"
          min={12}
          max={160}
          value={typography.fontSize}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => updateDetachedTypography({ fontSize: Number(event.target.value) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.textInspector.colorLabel}</span>
        <ColorPicker
          value={typography.color}
          paletteTokens={paletteTokens}
          disabled={disabled}
          onChange={(color: BuilderColorValue) => updateDetachedTypography({ color })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.textInspector.weightLabel}</span>
        <select
          value={typography.fontWeight}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => updateDetachedTypography({ fontWeight: event.target.value })}
        >
          <option value="regular">{copy.textInspector.fontWeightRegular}</option>
          <option value="medium">{copy.textInspector.fontWeightMedium}</option>
          <option value="bold">{copy.textInspector.fontWeightBold}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.textInspector.numericWeightLabel}</span>
        <div className={styles.rangeRow}>
          <input
            type="range"
            min={100}
            max={900}
            step={100}
            value={textNode.content.fontWeightNumeric ?? 0}
            disabled={disabled}
            onChange={(event) => {
              const next = Number(event.target.value);
              updateDetachedTypography({
                fontWeightNumeric: next === 0 ? undefined : next,
              });
            }}
            className={styles.range}
          />
          <span className={styles.value}>
            {textNode.content.fontWeightNumeric ?? '—'}
          </span>
          {textNode.content.fontWeightNumeric !== undefined ? (
            <button
              type="button"
              disabled={disabled}
              className={styles.clearButton}
              onClick={() => updateDetachedTypography({ fontWeightNumeric: undefined })}
            >
              {copy.textInspector.clearLabel}
            </button>
          ) : null}
        </div>
        <small className={styles.helpText}>{copy.textInspector.numericWeightHelp}</small>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.textInspector.styleLabel}</span>
        <select
          value={textNode.content.fontStyle ?? 'normal'}
          disabled={disabled}
          className={styles.control}
          onChange={(event) =>
            updateDetachedTypography({
              fontStyle: event.target.value === 'italic' ? 'italic' : undefined,
            })
          }
        >
          <option value="normal">{copy.textInspector.styleNormal}</option>
          <option value="italic">{copy.textInspector.styleItalic}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.textInspector.decorationLabel}</span>
        <select
          value={textNode.content.textDecoration ?? 'none'}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => {
            const v = event.target.value;
            updateDetachedTypography({
              textDecoration: v === 'none' ? undefined : v,
            });
          }}
        >
          <option value="none">{copy.textInspector.decorationNone}</option>
          <option value="underline">{copy.textInspector.decorationUnderline}</option>
          <option value="line-through">{copy.textInspector.decorationLineThrough}</option>
          <option value="underline line-through">{copy.textInspector.decorationBoth}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.textInspector.alignLabel}</span>
        <select
          value={textNode.content.align}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ align: event.target.value })}
        >
          <option value="left">{copy.textInspector.alignOptionLeft}</option>
          <option value="center">{copy.textInspector.alignOptionCenter}</option>
          <option value="right">{copy.textInspector.alignOptionRight}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.textInspector.lineHeightLabel}</span>
        <input
          type="range"
          min={0.5}
          max={4}
          step={0.05}
          value={typography.lineHeight}
          disabled={disabled}
          className={styles.range}
          onChange={(event) => updateDetachedTypography({ lineHeight: Number(event.target.value) })}
        />
        <span className={styles.value}>{typography.lineHeight.toFixed(2)}</span>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.textInspector.letterSpacingLabel}</span>
        <input
          type="number"
          min={-2}
          max={10}
          step={0.5}
          value={typography.letterSpacing}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => updateDetachedTypography({ letterSpacing: Number(event.target.value) })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.textInspector.verticalAlignLabel}</span>
        <select
          value={textNode.content.verticalAlign ?? 'top'}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ verticalAlign: event.target.value })}
        >
          <option value="top">{copy.textInspector.verticalAlignTop}</option>
          <option value="center">{copy.textInspector.verticalAlignCenter}</option>
          <option value="bottom">{copy.textInspector.verticalAlignBottom}</option>
        </select>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.textInspector.textTransformLabel}</span>
        <select
          value={textNode.content.textTransform ?? 'none'}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ textTransform: event.target.value })}
        >
          <option value="none">{copy.textInspector.textTransformNone}</option>
          <option value="uppercase">{copy.textInspector.textTransformUppercase}</option>
          <option value="lowercase">{copy.textInspector.textTransformLowercase}</option>
          <option value="capitalize">{copy.textInspector.textTransformCapitalize}</option>
        </select>
      </label>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{copy.textInspector.textEffectsHeading}</legend>
        <label className={styles.field}>
          <span className={styles.label}>{copy.textInspector.columnsLabel}</span>
          <input
            type="number"
            min={1}
            max={4}
            value={textNode.content.columns ?? 1}
            disabled={disabled}
            className={styles.control}
            onChange={(event) => onUpdate({ columns: Number(event.target.value) })}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{copy.textInspector.columnGapLabel}</span>
          <input
            type="number"
            min={0}
            max={96}
            value={textNode.content.columnGap ?? 24}
            disabled={disabled || (textNode.content.columns ?? 1) <= 1}
            className={styles.control}
            onChange={(event) => onUpdate({ columnGap: Number(event.target.value) })}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>{copy.textInspector.quoteStyleLabel}</span>
          <select
            value={textNode.content.quoteStyle ?? 'none'}
            disabled={disabled}
            className={styles.control}
            onChange={(event) => onUpdate({ quoteStyle: event.target.value })}
          >
            <option value="none">{copy.textInspector.quoteStyleNone}</option>
            <option value="classic">{copy.textInspector.quoteStyleClassic}</option>
            <option value="pull">{copy.textInspector.quoteStylePull}</option>
          </select>
        </label>
        <label className={styles.checkboxRow}>
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
          <span>{copy.textInspector.marqueeLabel}</span>
        </label>
        {textNode.content.marquee?.enabled ? (
          <>
            <label className={styles.field}>
              <span className={styles.label}>{copy.textInspector.marqueeSpeedLabel}</span>
              <input
                type="number"
                min={5}
                max={120}
                value={textNode.content.marquee.speed ?? 22}
                disabled={disabled}
                className={styles.control}
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
            <label className={styles.field}>
              <span className={styles.label}>{copy.textInspector.directionLabel}</span>
              <select
                value={textNode.content.marquee.direction ?? 'left'}
                disabled={disabled}
                className={styles.control}
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
                <option value="left">{copy.textInspector.marqueeDirectionLeft}</option>
                <option value="right">{copy.textInspector.marqueeDirectionRight}</option>
              </select>
            </label>
          </>
        ) : null}
        <label className={styles.checkboxRow}>
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
          <span>{copy.textInspector.textOnPathLabel}</span>
        </label>
        {textNode.content.textPath?.enabled ? (
          <>
            <label className={styles.field}>
              <span className={styles.label}>{copy.textInspector.pathCurveLabel}</span>
              <select
                value={textNode.content.textPath.curve ?? 'arc'}
                disabled={disabled}
                className={styles.control}
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
                <option value="arc">{copy.textInspector.pathCurveArc}</option>
                <option value="wave">{copy.textInspector.pathCurveWave}</option>
              </select>
            </label>
            <label className={styles.field}>
              <span className={styles.label}>{copy.textInspector.pathBaselineLabel}</span>
              <input
                type="range"
                min={20}
                max={90}
                value={textNode.content.textPath.baseline ?? 62}
                disabled={disabled}
                className={styles.range}
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
              <span className={styles.value}>{textNode.content.textPath.baseline ?? 62}</span>
            </label>
          </>
        ) : null}
      </fieldset>
      <label className={styles.field}>
        <span className={styles.label}>{copy.textInspector.backgroundColorLabel}</span>
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
            className={styles.clearButton}
            onClick={() => onUpdate({ backgroundColor: '' })}
          >
            {copy.textInspector.clearLabel}
          </button>
        )}
      </label>
      <div className={styles.linkSection}>
        <span className={styles.sectionLabel}>{copy.textInspector.linkLabel}</span>
        <LinkPicker
          value={(textNode.content.link ?? null) as LinkValue | null}
          onChange={(link) => onUpdate({ link: link ?? undefined })}
          context={linkPickerContext}
          disabled={disabled}
          locale={locale}
        />
      </div>
      <fieldset className={styles.fieldset}>
        <legend className={styles.legend}>{copy.textInspector.textShadowHeading}</legend>
        <label className={styles.field}>
          <span className={styles.label}>{copy.textInspector.xLabel}</span>
          <input
            type="number"
            min={-50}
            max={50}
            step={1}
            value={textNode.content.textShadow?.x ?? 0}
            disabled={disabled}
            className={styles.control}
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
        <label className={styles.field}>
          <span className={styles.label}>{copy.textInspector.yLabel}</span>
          <input
            type="number"
            min={-50}
            max={50}
            step={1}
            value={textNode.content.textShadow?.y ?? 0}
            disabled={disabled}
            className={styles.control}
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
        <label className={styles.field}>
          <span className={styles.label}>{copy.textInspector.blurLabel}</span>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            value={textNode.content.textShadow?.blur ?? 0}
            disabled={disabled}
            className={styles.control}
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
        <label className={styles.field}>
          <span className={styles.label}>{copy.textInspector.colorLabel}</span>
          <input
            type="color"
            value={normalizeHex(resolveThemeColor(textNode.content.textShadow?.color ?? '#000000', theme))}
            disabled={disabled}
            className={`${styles.control} ${styles.colorInput}`}
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
            className={styles.clearButton}
            onClick={() => onUpdate({ textShadow: undefined })}
          >
            {copy.textInspector.clearShadowLabel}
          </button>
        )}
      </fieldset>
    </div>
  );
}

function normalizeHex(value: string): string {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value;
  return '#0f172a';
}
