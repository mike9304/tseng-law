'use client';

import type { CSSProperties } from 'react';
import ColorPicker from '@/components/builder/editor/ColorPicker';
import FontPicker from '@/components/builder/editor/FontPicker';
import type { Locale } from '@/lib/locales';
import {
  type BuilderTheme,
} from '@/lib/builder/site/types';
import {
  THEME_COLOR_TOKENS,
  THEME_TEXT_PRESET_KEYS,
  type BuilderColorValue,
  type ThemeTextPreset,
  type ThemeTextPresetKey,
  normalizeThemeTextPresets,
  resolveThemeColor,
} from '@/lib/builder/site/theme';
import { resolveTypographyScale } from '@/lib/builder/site/typography-scale';
import { getTextControlsCopy } from '@/components/builder/editor/text-controls-copy';
import { getSiteSettingsCopy } from './site-settings-copy';
import styles from './SiteSettingsTypographyTab.module.css';

type TypographyScaleRatio = NonNullable<BuilderTheme['typographyScale']>['ratio'];

type TypographyTabStyleVars = CSSProperties & {
  '--site-typography-preview-family'?: string;
  '--site-typography-preview-size'?: string;
  '--site-typography-preview-weight'?: number;
  '--site-typography-preset-color'?: string;
  '--site-typography-preset-family'?: string;
  '--site-typography-preset-size'?: string;
};

interface SiteSettingsTypographyTabProps {
  theme: BuilderTheme;
  locale: Locale;
  onChangeThemeFont: (key: 'heading' | 'body', value: string) => void;
  onChangeTypographyScale: (baseSize: number, ratio: TypographyScaleRatio) => void;
  onChangeTextPreset: (key: ThemeTextPresetKey, patch: Partial<ThemeTextPreset>) => void;
}

function scalePreviewSampleStyle(
  theme: BuilderTheme,
  numericSize: number,
  isHeading: boolean,
): TypographyTabStyleVars {
  return {
    '--site-typography-preview-family': isHeading ? theme.fonts.heading : theme.fonts.body,
    '--site-typography-preview-size': `${Math.max(11, Math.min(22, numericSize / 3.5))}px`,
    '--site-typography-preview-weight': isHeading ? 800 : 500,
  };
}

function presetPreviewStyle(preset: ThemeTextPreset, theme: BuilderTheme): TypographyTabStyleVars {
  return {
    '--site-typography-preset-color': resolveThemeColor(preset.color, theme),
    '--site-typography-preset-family': preset.fontFamily,
    '--site-typography-preset-size': `${Math.min(22, Math.max(14, preset.fontSize * 0.48))}px`,
  };
}

export function SiteSettingsTypographyTab({
  theme,
  locale,
  onChangeThemeFont,
  onChangeTypographyScale,
  onChangeTextPreset,
}: SiteSettingsTypographyTabProps) {
  const textPresets = normalizeThemeTextPresets(theme.themeTextPresets);
  const typographyScalePreview = resolveTypographyScale(theme);
  const copy = getTextControlsCopy(locale);
  const siteCopy = getSiteSettingsCopy(locale);
  const paletteTokens = THEME_COLOR_TOKENS.map((token) => ({
    token,
    label: siteCopy.advanced.themeColorLabels[token],
    color: theme.colors[token],
  }));

  return (
    <div className={styles.root}>
      <div className={styles.sectionHeading}>{copy.siteSettingsTypography.siteFontsHeading}</div>
      <div className={styles.fieldGrid}>
        <div className={styles.field}>
          <label className={styles.label}>{copy.siteSettingsTypography.headingFontLabel}</label>
          <FontPicker
            value={theme.fonts.heading}
            locale={locale}
            onChange={(fontFamily) => onChangeThemeFont('heading', fontFamily)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>{copy.siteSettingsTypography.bodyFontLabel}</label>
          <FontPicker
            value={theme.fonts.body}
            locale={locale}
            onChange={(fontFamily) => onChangeThemeFont('body', fontFamily)}
          />
        </div>
      </div>

      <div className={styles.sectionHeading}>{copy.siteSettingsTypography.typographyScaleHeading}</div>
      <div className={styles.fieldGrid}>
        <div className={styles.field}>
          <label className={styles.label}>{copy.siteSettingsTypography.baseSizeLabel}</label>
          <input
            type="number"
            aria-label={copy.siteSettingsTypography.baseSizeLabel}
            min={10}
            max={28}
            value={theme.typographyScale?.baseSize ?? 16}
            onChange={(event) => {
              const baseSize = Number(event.target.value) || 16;
              const ratio = theme.typographyScale?.ratio ?? 1.25;
              onChangeTypographyScale(baseSize, ratio);
            }}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{copy.siteSettingsTypography.ratioLabel}</label>
          <select
            aria-label={copy.siteSettingsTypography.ratioLabel}
            value={theme.typographyScale?.ratio ?? 1.25}
            onChange={(event) => {
              const ratio = Number(event.target.value) as TypographyScaleRatio;
              const baseSize = theme.typographyScale?.baseSize ?? 16;
              onChangeTypographyScale(baseSize, ratio);
            }}
            className={styles.input}
          >
            {copy.siteSettingsTypography.ratioOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className={styles.description}>{copy.siteSettingsTypography.description}</p>

      <div
        data-builder-typography-scale-preview="true"
        className={styles.scalePreview}
      >
        {[
          ['h1', typographyScalePreview.h1],
          ['h2', typographyScalePreview.h2],
          ['h3', typographyScalePreview.h3],
          ['h4', typographyScalePreview.h4],
          ['h5', typographyScalePreview.h5],
          ['h6', typographyScalePreview.h6],
          ['body', typographyScalePreview.body],
        ].map(([rowKey, size]) => {
          const key = rowKey as keyof typeof copy.siteSettingsTypography.scalePreviewRows;
          const isHeading = key !== 'body';
          const label = copy.siteSettingsTypography.scalePreviewRows[key];
          const numericSize = Number(size);
          return (
            <div
              key={key}
              data-builder-typography-scale-preview-row={key}
              className={styles.scalePreviewRow}
            >
              <span className={styles.scalePreviewLabel}>{label}</span>
              <span
                className={styles.scalePreviewSample}
                style={scalePreviewSampleStyle(theme, numericSize, isHeading)}
              >
                {copy.siteSettingsTypography.previewSample}
              </span>
              <span className={styles.scalePreviewSize}>
                {Math.round(numericSize)}px
              </span>
            </div>
          );
        })}
      </div>

      <div className={styles.sectionHeading}>{copy.siteSettingsTypography.themeTextPresetsHeading}</div>
      {THEME_TEXT_PRESET_KEYS.map((key) => {
        const preset = textPresets[key];
        return (
          <section
            key={key}
            className={styles.presetCard}
          >
            <div className={styles.presetHeader}>
              <strong
                className={styles.presetPreview}
                style={presetPreviewStyle(preset, theme)}
              >
                {copy.themePresetPicker.previewText}
              </strong>
              <span className={styles.presetName}>{preset.label}</span>
            </div>

            <div className={styles.fieldGrid}>
              <div className={styles.field}>
                <label className={styles.label}>{copy.siteSettingsTypography.presetLabelLabel}</label>
                <input
                  type="text"
                  value={preset.label}
                  className={styles.input}
                  onChange={(event) => onChangeTextPreset(key, { label: event.target.value })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{copy.siteSettingsTypography.presetFontLabel}</label>
                <FontPicker
                  value={preset.fontFamily}
                  locale={locale}
                  onChange={(fontFamily) => onChangeTextPreset(key, { fontFamily })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{copy.siteSettingsTypography.presetSizeLabel}</label>
                <input
                  type="number"
                  min={12}
                  max={160}
                  value={preset.fontSize}
                  className={styles.input}
                  onChange={(event) => onChangeTextPreset(key, { fontSize: Number(event.target.value) })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{copy.siteSettingsTypography.presetWeightLabel}</label>
                <select
                  value={preset.fontWeight}
                  className={styles.input}
                  onChange={(event) => onChangeTextPreset(key, { fontWeight: event.target.value as ThemeTextPreset['fontWeight'] })}
                >
                  <option value="regular">{copy.textInspector.fontWeightRegular}</option>
                  <option value="medium">{copy.textInspector.fontWeightMedium}</option>
                  <option value="bold">{copy.textInspector.fontWeightBold}</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{copy.textInspector.lineHeightLabel}</label>
                <input
                  type="number"
                  min={0.5}
                  max={4}
                  step={0.05}
                  value={preset.lineHeight}
                  className={styles.input}
                  onChange={(event) => onChangeTextPreset(key, { lineHeight: Number(event.target.value) })}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>{copy.textInspector.letterSpacingLabel}</label>
                <input
                  type="number"
                  min={-2}
                  max={10}
                  step={0.5}
                  value={preset.letterSpacing}
                  className={styles.input}
                  onChange={(event) => onChangeTextPreset(key, { letterSpacing: Number(event.target.value) })}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>{copy.textInspector.colorLabel}</label>
              <ColorPicker
                value={preset.color}
                paletteTokens={paletteTokens}
                locale={locale}
                onChange={(color: BuilderColorValue) => onChangeTextPreset(key, { color })}
              />
            </div>
          </section>
        );
      })}
    </div>
  );
}
