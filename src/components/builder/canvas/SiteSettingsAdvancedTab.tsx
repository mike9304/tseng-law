'use client';

import {
  type PageTransition,
} from '@/lib/builder/animations/presets';
import {
  DEFAULT_THEME,
  type BuilderTheme,
} from '@/lib/builder/site/types';
import {
  THEME_COLOR_TOKENS,
} from '@/lib/builder/site/theme';
import type { Locale } from '@/lib/locales';
import { getSiteSettingsCopy } from './site-settings-copy';
import styles from './SiteSettingsAdvancedTab.module.css';
import { TranslationReleaseSettingsPanel } from './TranslationReleaseSettingsPanel';

interface SiteSettingsAdvancedTabProps {
  pageTransition: PageTransition;
  pageTransitionDurationMs: number;
  theme: BuilderTheme;
  isValidHexColor: (value: string) => boolean;
  onChangePageTransition: (value: PageTransition) => void;
  onChangePageTransitionDurationMs: (value: number) => void;
  onChangeThemeColor: (key: keyof BuilderTheme['colors'], value: string) => void;
  locale: Locale;
}

export function SiteSettingsAdvancedTab({
  pageTransition,
  pageTransitionDurationMs,
  theme,
  isValidHexColor,
  onChangePageTransition,
  onChangePageTransitionDurationMs,
  onChangeThemeColor,
  locale,
}: SiteSettingsAdvancedTabProps) {
  const copy = getSiteSettingsCopy(locale);
  return (
    <div className={styles.root}>
      <div className={styles.sectionHeading}>{copy.advanced.motionHeading}</div>
      <div className={styles.fieldGrid}>
        <div className={styles.field}>
          <label className={styles.label}>{copy.advanced.pageTransitionLabel}</label>
          <select
            aria-label={copy.advanced.pageTransitionLabel}
            value={pageTransition}
            className={styles.input}
            onChange={(event) => onChangePageTransition(event.target.value as PageTransition)}
          >
            {(Object.keys(copy.advanced.pageTransitionOptions) as PageTransition[]).map((value) => (
              <option key={value} value={value}>
                {copy.advanced.pageTransitionOptions[value]}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>{copy.advanced.pageTransitionDurationLabel}</label>
          <input
            aria-label={copy.advanced.pageTransitionDurationLabel}
            type="number"
            min={80}
            max={3000}
            step={20}
            value={pageTransitionDurationMs}
            className={styles.input}
            disabled={pageTransition === 'none'}
            onChange={(event) => {
              const raw = Number(event.target.value);
              const next = Number.isFinite(raw)
                ? Math.max(80, Math.min(3000, Math.round(raw)))
                : 280;
              onChangePageTransitionDurationMs(next);
            }}
          />
        </div>
      </div>
      <p className={styles.description}>{copy.advanced.pageTransitionDescription}</p>

      <TranslationReleaseSettingsPanel locale={locale} />

      <div className={styles.sectionHeading}>{copy.advanced.themeColorsHeading}</div>
      {THEME_COLOR_TOKENS.map((token) => (
        <div key={token} className={styles.field}>
          <label className={styles.label}>{copy.advanced.themeColorLabels[token]}</label>
          <div className={styles.colorRow}>
            <input
              type="color"
              value={isValidHexColor(theme.colors[token]) ? theme.colors[token] : DEFAULT_THEME.colors[token]}
              className={styles.colorInput}
              onChange={(event) => onChangeThemeColor(token, event.target.value)}
            />
            <input
              type="text"
              value={theme.colors[token]}
              placeholder="#123B63"
              className={styles.input}
              onChange={(event) => onChangeThemeColor(token, event.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
