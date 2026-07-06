'use client';

import { useRef, type CSSProperties } from 'react';
import {
  COMPONENT_DESIGN_PRESETS,
  type ComponentDesignPresetKey,
} from '@/lib/builder/site/component-design-presets';
import type { ThemeSuggestion } from '@/lib/builder/ai-generator/theme-suggestions';
import {
  type BuilderTheme,
} from '@/lib/builder/site/types';
import {
  SITE_THEME_PRESETS,
  THEME_COLOR_TOKENS,
  THEME_RADIUS_PRESETS,
  THEME_SHADOW_PRESETS,
  type SiteThemePreset,
} from '@/lib/builder/site/theme';
import type { Locale } from '@/lib/locales';
import styles from './SiteSettingsPresetsTab.module.css';
import { getSandboxEditorRailCopy } from './sandbox-editor-rail-copy';
import { getSiteSettingsPresetsCopy } from './site-settings-presets-copy';
import { ThemeSuggestionsPanel } from './ThemeSuggestionsPanel';

type RadiusPresetKey = (typeof THEME_RADIUS_PRESETS)[number]['key'];
type ShadowPresetKey = (typeof THEME_SHADOW_PRESETS)[number]['key'];

export type CustomThemePreset = {
  id: string;
  name: string;
  savedAt: string;
  theme: BuilderTheme;
};

interface SiteSettingsPresetsTabProps {
  locale: Locale;
  theme: BuilderTheme;
  customThemePresets: CustomThemePreset[];
  pendingPreset: SiteThemePreset | null;
  onApplyComponentDesignPreset: (presetKey: ComponentDesignPresetKey, presetLabel: string) => void;
  onApplyThemeSuggestion: (suggestion: ThemeSuggestion) => void;
  onExportDesignTokens: () => void;
  onImportDesignTokens: (file: File) => void | Promise<void>;
  onApplyRadiusPreset: (presetKey: RadiusPresetKey, presetLabel: string) => void;
  onApplyShadowPreset: (presetKey: ShadowPresetKey, presetLabel: string) => void;
  onSaveCurrentThemePreset: () => void;
  onApplyCustomThemePreset: (preset: CustomThemePreset) => void;
  onDeleteCustomThemePreset: (id: string) => void;
  onCancelPendingPreset: () => void;
  onApplyPendingPreset: (preset: SiteThemePreset) => void;
  onSelectSiteThemePreset: (preset: SiteThemePreset) => void;
}

type PresetsTabStyleVars = CSSProperties & {
  [key: `--site-presets-${string}`]: string | number | undefined;
};

function radiusPx(value: number): string {
  return `${value}px`;
}

function metaBoxStyle(theme: BuilderTheme): PresetsTabStyleVars {
  return {
    '--site-presets-meta-radius': radiusPx(theme.radii.md),
  };
}

function radiusSwatchStyle(radius: number, border: string, background: string): PresetsTabStyleVars {
  return {
    '--site-presets-radius': radiusPx(radius),
    '--site-presets-radius-border': border,
    '--site-presets-radius-bg': background,
  };
}

function shadowSwatchStyle(theme: BuilderTheme, boxShadow: string): PresetsTabStyleVars {
  return {
    '--site-presets-shadow-radius': radiusPx(theme.radii.md),
    '--site-presets-shadow': boxShadow,
  };
}

function swatchStyle(color: string): PresetsTabStyleVars {
  return {
    '--site-presets-swatch-color': color,
  };
}

function builderThemePreviewStyle(theme: BuilderTheme): PresetsTabStyleVars {
  return {
    '--site-presets-theme-border': theme.colors.muted,
    '--site-presets-theme-radius': radiusPx(theme.radii.md),
    '--site-presets-theme-bg': theme.colors.background,
    '--site-presets-theme-title-color': theme.colors.text,
    '--site-presets-theme-title-font': theme.fonts.heading,
    '--site-presets-theme-body-color': theme.colors.secondary,
    '--site-presets-theme-body-font': theme.fonts.body,
  };
}

function siteThemePreviewStyle(preset: SiteThemePreset): PresetsTabStyleVars {
  return {
    '--site-presets-theme-border': preset.colors.muted,
    '--site-presets-theme-radius': '8px',
    '--site-presets-theme-bg': preset.colors.background,
    '--site-presets-theme-title-color': preset.colors.text,
    '--site-presets-theme-title-font': preset.fonts.title,
    '--site-presets-theme-body-color': preset.colors.secondary,
    '--site-presets-theme-body-font': preset.fonts.body,
  };
}

function siteThemeTitleStyle(preset: SiteThemePreset): PresetsTabStyleVars {
  return {
    '--site-presets-title-color': preset.colors.text,
    '--site-presets-title-font': preset.fonts.title,
    '--site-presets-title-size': '1rem',
  };
}

export function SiteSettingsPresetsTab({
  locale,
  theme,
  customThemePresets,
  pendingPreset,
  onApplyComponentDesignPreset,
  onApplyThemeSuggestion,
  onExportDesignTokens,
  onImportDesignTokens,
  onApplyRadiusPreset,
  onApplyShadowPreset,
  onSaveCurrentThemePreset,
  onApplyCustomThemePreset,
  onDeleteCustomThemePreset,
  onCancelPendingPreset,
  onApplyPendingPreset,
  onSelectSiteThemePreset,
}: SiteSettingsPresetsTabProps) {
  const tokenImportInputRef = useRef<HTMLInputElement | null>(null);
  const copy = getSiteSettingsPresetsCopy(locale);
  const designerPresetCopy = getSandboxEditorRailCopy(locale).design.presets;

  return (
    <>
      <input
        ref={tokenImportInputRef}
        data-design-token-import-input
        type="file"
        accept="application/json,.json"
        className={styles.hiddenInput}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void onImportDesignTokens(file);
          event.currentTarget.value = '';
        }}
      />
      <div className={styles.section}>
        <ThemeSuggestionsPanel locale={locale} onApplySuggestion={onApplyThemeSuggestion} />

        <div className={styles.sectionHeading}>{copy.sections.componentDesignPresets}</div>
        <div className={styles.grid}>
          {COMPONENT_DESIGN_PRESETS.map((preset) => {
            const localizedPreset = designerPresetCopy[preset.key];
            return (
              <section
                key={preset.key}
                data-component-design-preset={preset.key}
                data-component-design-preset-finish={preset.designerFinish}
                data-component-design-preset-rhythm={preset.designerRhythm}
                data-component-design-preset-accent={preset.designerAccent}
                className={styles.card}
              >
                <div>
                  <strong className={styles.title}>
                    {localizedPreset.label}
                  </strong>
                  <span className={styles.descriptionSmall}>
                    {localizedPreset.description}
                  </span>
                </div>
                <div className={styles.metaBox} style={metaBoxStyle(theme)}>
                  <span>{copy.labels.button}: {preset.buttonVariant}</span>
                  <span>{copy.labels.card}: {preset.cardVariant}</span>
                  <span>{copy.labels.form}: {preset.formInputVariant}</span>
                  <span>{copy.labels.finish}: {localizedPreset.finish}</span>
                  <span>{copy.labels.accent}: {localizedPreset.accent}</span>
                </div>
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => onApplyComponentDesignPreset(preset.key, localizedPreset.label)}
                >
                  {copy.labels.applyComponentPreset(localizedPreset.label)}
                </button>
              </section>
            );
          })}
        </div>

        <div className={styles.sectionHeading}>{copy.sections.designTokenBundle}</div>
        <section className={styles.card}>
          <strong className={styles.title}>
            {copy.labels.designTokenTitle}
          </strong>
          <span className={styles.description}>
            {copy.labels.designTokenDescription}
          </span>
          <div className={styles.buttonRow}>
            <button type="button" className={styles.button} onClick={onExportDesignTokens}>
              {copy.labels.exportDesignTokens}
            </button>
            <button type="button" className={styles.button} onClick={() => tokenImportInputRef.current?.click()}>
              {copy.labels.importDesignTokens}
            </button>
          </div>
        </section>

        <div className={styles.sectionHeading}>{copy.sections.radiusShadowPresets}</div>
        <div className={styles.grid}>
          {THEME_RADIUS_PRESETS.map((preset) => {
            const active = (theme.effects?.radiusPreset ?? 'medium') === preset.key;
            return (
              <section
                key={preset.key}
                data-theme-radius-preset={preset.key}
                data-active={active ? 'true' : undefined}
                className={styles.card}
              >
                <div>
                  <strong className={styles.title}>
                    {preset.label} {copy.labels.radius}
                  </strong>
                  <span className={styles.descriptionSmall}>
                    {preset.description}
                  </span>
                </div>
                <div className={styles.radiusPreview}>
                  <span
                    aria-hidden
                    className={styles.radiusSwatch}
                    data-size="sm"
                    style={radiusSwatchStyle(preset.radii.sm, '#bfdbfe', '#eff6ff')}
                  />
                  <span
                    aria-hidden
                    className={styles.radiusSwatch}
                    data-size="md"
                    style={radiusSwatchStyle(preset.radii.md, '#93c5fd', '#dbeafe')}
                  />
                  <span
                    aria-hidden
                    className={styles.radiusSwatch}
                    data-size="lg"
                    style={radiusSwatchStyle(preset.radii.lg, '#60a5fa', '#bfdbfe')}
                  />
                </div>
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => onApplyRadiusPreset(preset.key, preset.label)}
                >
                  {copy.labels.usePreset(preset.label)}
                </button>
              </section>
            );
          })}
        </div>

        <div className={styles.grid}>
          {THEME_SHADOW_PRESETS.map((preset) => {
            const active = (theme.effects?.shadowPreset ?? 'soft') === preset.key;
            return (
              <section
                key={preset.key}
                data-theme-shadow-preset={preset.key}
                data-active={active ? 'true' : undefined}
                className={styles.card}
              >
                <div>
                  <strong className={styles.title}>
                    {preset.label} {copy.labels.shadow}
                  </strong>
                  <span className={styles.descriptionSmall}>
                    {preset.description}
                  </span>
                </div>
                <div className={styles.shadowPreview}>
                  <span
                    aria-hidden
                    className={styles.shadowSwatch}
                    style={shadowSwatchStyle(theme, preset.shadows.md)}
                  />
                </div>
                <button
                  type="button"
                  className={styles.button}
                  onClick={() => onApplyShadowPreset(preset.key, preset.label)}
                >
                  {copy.labels.usePreset(preset.label)}
                </button>
              </section>
            );
          })}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeading}>{copy.sections.myThemes}</div>
        <section className={styles.card}>
          <strong className={styles.title}>
            {copy.labels.saveCurrentTheme}
          </strong>
          <span className={styles.description}>
            {copy.labels.saveCurrentThemeDescription}
          </span>
          <button type="button" className={styles.button} onClick={onSaveCurrentThemePreset}>
            {copy.labels.saveCurrentThemeButton}
          </button>
        </section>

        {customThemePresets.length > 0 ? (
          <div className={styles.grid}>
            {customThemePresets.map((preset) => (
              <section key={preset.id} data-custom-theme-preset={preset.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div>
                    <strong className={styles.title}>
                      {preset.name}
                    </strong>
                    <span className={styles.descriptionSmall}>
                      {copy.labels.savedAt} {new Date(preset.savedAt).toLocaleDateString(locale)}
                    </span>
                  </div>
                  <div className={styles.paletteRow}>
                    {THEME_COLOR_TOKENS.slice(0, 5).map((token) => (
                      <span
                        key={token}
                        aria-hidden
                        className={styles.paletteSwatch}
                        style={swatchStyle(preset.theme.colors[token])}
                      />
                    ))}
                  </div>
                </div>
                <div className={styles.themePreview} style={builderThemePreviewStyle(preset.theme)}>
                  <div className={styles.themePreviewTitle}>
                    Aa
                  </div>
                  <div className={styles.themePreviewBody}>
                    {copy.labels.myThemePreview}
                  </div>
                </div>
                <div className={styles.buttonRow}>
                  <button
                    type="button"
                    className={`${styles.button} ${styles.buttonFull}`}
                    onClick={() => onApplyCustomThemePreset(preset)}
                  >
                    {copy.labels.applyMyTheme}
                  </button>
                  <button
                    type="button"
                    className={`${styles.button} ${styles.buttonDanger}`}
                    onClick={() => onDeleteCustomThemePreset(preset.id)}
                  >
                    {copy.labels.delete}
                  </button>
                </div>
              </section>
            ))}
          </div>
        ) : (
          <span className={styles.emptyText}>
            {copy.labels.noSavedThemes}
          </span>
        )}

        <div className={styles.sectionHeading}>{copy.sections.themePresets}</div>
        {pendingPreset ? (
          <div className={styles.pendingCard}>
            <strong className={styles.pendingTitle}>
              {copy.labels.pendingPresetTitle(pendingPreset.name)}
            </strong>
            <span className={styles.pendingDescription}>
              {copy.labels.pendingPresetDescription}
            </span>
            <div className={styles.buttonRowEnd}>
              <button type="button" className={styles.button} onClick={onCancelPendingPreset}>
                {copy.labels.cancel}
              </button>
              <button
                type="button"
                className={`${styles.button} ${styles.buttonPrimary}`}
                onClick={() => onApplyPendingPreset(pendingPreset)}
              >
                {copy.labels.applyPreset}
              </button>
            </div>
          </div>
        ) : null}

        <div className={styles.grid}>
          {SITE_THEME_PRESETS.map((preset) => (
            <section key={preset.key} className={styles.card}>
              <div className={styles.cardHeader}>
                <div>
                  <strong className={styles.title} style={siteThemeTitleStyle(preset)}>
                    {preset.name}
                  </strong>
                  <span className={styles.descriptionSmall}>
                    {preset.shadowIntensity} {copy.labels.shadow} · {copy.labels.radius} {preset.radiusScale}
                  </span>
                </div>
                <div className={styles.paletteRow}>
                  {THEME_COLOR_TOKENS.slice(0, 5).map((token) => (
                    <span
                      key={token}
                      aria-hidden
                      className={styles.paletteSwatch}
                      style={swatchStyle(preset.colors[token])}
                    />
                  ))}
                </div>
              </div>
              <p className={styles.description}>
                {preset.description}
              </p>
              <div className={styles.themePreview} style={siteThemePreviewStyle(preset)}>
                <div className={styles.themePreviewTitle}>
                  Aa
                </div>
                <div className={styles.themePreviewBody}>
                  {copy.labels.themePresetBody}
                </div>
              </div>
              <button
                type="button"
                className={styles.button}
                onClick={() => onSelectSiteThemePreset(preset)}
              >
                {copy.labels.applyTheme}
              </button>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
