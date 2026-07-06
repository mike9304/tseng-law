'use client';

import type { CSSProperties } from 'react';
import {
  type BuilderTheme,
  type DarkModeConfig,
} from '@/lib/builder/site/types';
import {
  THEME_COLOR_TOKENS,
  createDarkColorsFromLight,
  normalizeDarkColors,
} from '@/lib/builder/site/theme';
import type { Locale } from '@/lib/locales';
import { getSiteSettingsCopy } from './site-settings-copy';
import styles from './SiteSettingsDarkModeTab.module.css';

type DarkModePreviewStyleVars = CSSProperties & {
  '--site-dark-preview-border'?: string;
  '--site-dark-preview-bg'?: string;
  '--site-dark-preview-text'?: string;
  '--site-dark-preview-secondary'?: string;
  '--site-dark-preview-muted'?: string;
  '--site-dark-preview-primary'?: string;
  '--site-dark-preview-heading-font'?: string;
  '--site-dark-preview-chip-radius'?: string;
};

function themePreviewStyle(
  theme: BuilderTheme,
  colors: BuilderTheme['colors'],
): DarkModePreviewStyleVars {
  return {
    '--site-dark-preview-border': colors.muted,
    '--site-dark-preview-bg': colors.background,
    '--site-dark-preview-text': colors.text,
    '--site-dark-preview-secondary': colors.secondary,
    '--site-dark-preview-muted': colors.muted,
    '--site-dark-preview-primary': colors.primary,
    '--site-dark-preview-heading-font': theme.fonts.heading,
    '--site-dark-preview-chip-radius': `${theme.radii.md}px`,
  };
}

interface SiteSettingsDarkModeTabProps {
  darkMode: Required<DarkModeConfig>;
  theme: BuilderTheme;
  isValidHexColor: (value: string) => boolean;
  onChangeDarkMode: (next: Required<DarkModeConfig>) => void;
  onChangeDarkThemeColor: (key: keyof BuilderTheme['colors'], value: string) => void;
  locale: Locale;
}

export function SiteSettingsDarkModeTab({
  darkMode,
  theme,
  isValidHexColor,
  onChangeDarkMode,
  onChangeDarkThemeColor,
  locale,
}: SiteSettingsDarkModeTabProps) {
  const darkColors = normalizeDarkColors(theme.colors, theme.darkColors);
  const copy = getSiteSettingsCopy(locale);

  const renderThemePreview = (
    label: string,
    colors: BuilderTheme['colors'],
  ) => (
    <div
      className={styles.previewCard}
      style={themePreviewStyle(theme, colors)}
    >
      <strong className={styles.previewTitle}>
        {label}
      </strong>
      <span className={styles.previewDescription}>{copy.dark.lightModeDescription}</span>
      <div className={styles.previewChipRow}>
        <span className={styles.previewChip} data-tone="primary">
          {copy.dark.previewPrimary}
        </span>
        <span className={styles.previewChip} data-tone="secondary">
          {copy.dark.previewSecondary}
        </span>
        <span className={styles.previewChip} data-tone="muted">
          {copy.dark.previewMuted}
        </span>
      </div>
    </div>
  );

  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <div className={styles.sectionHeading}>{copy.dark.runtimeHeading}</div>
        <div className={styles.field}>
          <label className={styles.label}>{copy.dark.defaultModeLabel}</label>
          <select
            value={darkMode.defaultMode}
            className={styles.input}
            onChange={(event) => {
              const value = event.target.value;
              onChangeDarkMode({
                ...darkMode,
                defaultMode: value === 'dark' || value === 'auto' ? value : 'light',
              });
            }}
          >
            <option value="light">{copy.dark.light}</option>
            <option value="dark">{copy.dark.dark}</option>
            <option value="auto">{copy.dark.auto}</option>
          </select>
        </div>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={darkMode.allowVisitorToggle}
            className={styles.checkbox}
            onChange={(event) => {
              onChangeDarkMode({
                ...darkMode,
                allowVisitorToggle: event.target.checked,
              });
            }}
          />
          {copy.dark.allowToggle}
        </label>
      </div>

      <div className={styles.sectionHeading}>{copy.dark.lightDarkPreviewHeading}</div>
      <div className={styles.previewGrid}>
        {renderThemePreview(copy.dark.previewHeader('light'), theme.colors)}
        {renderThemePreview(copy.dark.previewHeader('dark'), darkColors)}
      </div>

      {THEME_COLOR_TOKENS.map((token) => (
        <div key={token} className={styles.field}>
          <label className={styles.label}>{copy.dark.colorLabel(copy.advanced.themeColorLabels[token])}</label>
          <div className={styles.colorRow}>
            <input
              type="color"
              value={isValidHexColor(darkColors[token]) ? darkColors[token] : createDarkColorsFromLight(theme.colors)[token]}
              className={styles.colorInput}
              onChange={(event) => onChangeDarkThemeColor(token, event.target.value)}
            />
            <input
              type="text"
              value={darkColors[token]}
              placeholder="#0f172a"
              className={styles.input}
              onChange={(event) => onChangeDarkThemeColor(token, event.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
