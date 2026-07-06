import type { BuilderComponentInspectorProps } from '../define';
import type { BuilderHeadingCanvasNode } from '@/lib/builder/canvas/types';
import ColorPicker from '@/components/builder/editor/ColorPicker';
import FontPicker from '@/components/builder/editor/FontPicker';
import ThemeTextPresetPicker from '@/components/builder/editor/ThemeTextPresetPicker';
import { useBuilderTheme } from '@/components/builder/editor/BuilderThemeContext';
import { getTextControlsCopy } from '@/components/builder/editor/text-controls-copy';
import { richTextFromPlainText } from '@/lib/builder/rich-text/sanitize';
import { localizedHeadingText } from './heading-copy';
import {
  THEME_COLOR_LABELS,
  THEME_COLOR_TOKENS,
  type BuilderColorValue,
  createThemeTextPresetPatch,
  resolveThemeTextTypography,
} from '@/lib/builder/site/theme';
import { headingFontSizeFromTheme } from '@/lib/builder/site/typography-scale';
import styles from './HeadingInspector.module.css';

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
  locale = 'en',
}: BuilderComponentInspectorProps) {
  const headingNode = node as BuilderHeadingCanvasNode;
  const theme = useBuilderTheme();
  const copy = getTextControlsCopy(locale);
  const text = localizedHeadingText(headingNode.content.text, locale);
  const level = Math.max(1, Math.min(6, headingNode.content.level)) as keyof typeof LEVEL_TO_SIZE;
  const scaledDefaultSize = theme.typographyScale
    ? headingFontSizeFromTheme(theme, level)
    : LEVEL_TO_SIZE[level];
  const typography = resolveThemeTextTypography(
    {
      themePreset: headingNode.content.themePreset,
      fontFamily: headingNode.content.fontFamily,
      fontSize: headingNode.content.fontSize ?? scaledDefaultSize,
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
    <div className={styles.root} data-builder-heading-inspector="true">
      <label className={styles.field}>
        <span className={styles.label}>{copy.headingInspector.themePresetLabel}</span>
        <ThemeTextPresetPicker
          value={headingNode.content.themePreset}
          disabled={disabled}
          locale={locale}
          onChange={(key) => onUpdate(createThemeTextPresetPatch(key, theme))}
          onClear={() => onUpdate({ themePreset: undefined })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.headingInspector.headingLabel}</span>
        <textarea
          value={text}
          rows={3}
          disabled={disabled}
          className={`${styles.control} ${styles.textarea}`}
          onChange={(event) => {
            const text = event.target.value;
            onUpdate({ text, richText: richTextFromPlainText(text) });
          }}
        />
        <small className={styles.warning}>{copy.headingInspector.warning}</small>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.headingInspector.fontLabel}</span>
        <FontPicker
          value={typography.fontFamily}
          disabled={disabled}
          locale={locale}
          onChange={(fontFamily) => updateDetachedTypography({ fontFamily })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.headingInspector.levelLabel}</span>
        <select
          value={headingNode.content.level}
          disabled={disabled}
          className={styles.control}
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
      <label className={styles.field}>
        <span className={styles.label}>{copy.headingInspector.colorLabel}</span>
        <ColorPicker
          value={typography.color}
          paletteTokens={paletteTokens}
          disabled={disabled}
          onChange={(color: BuilderColorValue) => updateDetachedTypography({ color })}
        />
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.headingInspector.fontSizeLabel}</span>
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
        <span className={styles.label}>{copy.headingInspector.weightLabel}</span>
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
        <span className={styles.label}>{copy.headingInspector.numericWeightLabel}</span>
        <div className={styles.rangeRow}>
          <input
            type="range"
            min={100}
            max={900}
            step={100}
            value={headingNode.content.fontWeightNumeric ?? 0}
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
            {headingNode.content.fontWeightNumeric ?? '—'}
          </span>
          {headingNode.content.fontWeightNumeric !== undefined ? (
            <button
              type="button"
              disabled={disabled}
              className={styles.clearButton}
              onClick={() => updateDetachedTypography({ fontWeightNumeric: undefined })}
            >
              {copy.headingInspector.clearLabel}
            </button>
          ) : null}
        </div>
        <small className={styles.helpText}>{copy.headingInspector.numericWeightHelp}</small>
      </label>
      <label className={styles.field}>
        <span className={styles.label}>{copy.headingInspector.styleLabel}</span>
        <select
          value={headingNode.content.fontStyle ?? 'normal'}
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
        <span className={styles.label}>{copy.headingInspector.decorationLabel}</span>
        <select
          value={headingNode.content.textDecoration ?? 'none'}
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
        <span className={styles.label}>{copy.headingInspector.lineHeightLabel}</span>
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
        <span className={styles.label}>{copy.textInspector.alignLabel}</span>
        <select
          value={headingNode.content.align}
          disabled={disabled}
          className={styles.control}
          onChange={(event) => onUpdate({ align: event.target.value })}
        >
          <option value="left">{copy.textInspector.alignOptionLeft}</option>
          <option value="center">{copy.textInspector.alignOptionCenter}</option>
          <option value="right">{copy.textInspector.alignOptionRight}</option>
        </select>
      </label>
    </div>
  );
}
