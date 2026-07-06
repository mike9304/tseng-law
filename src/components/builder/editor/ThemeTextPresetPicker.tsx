'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { fontFamilyCSS } from '@/lib/builder/canvas/fonts';
import type { Locale } from '@/lib/locales';
import {
  THEME_TEXT_PRESET_KEYS,
  type ThemeTextPresetKey,
  type ThemeTextPreset,
  getThemeTextPresets,
  resolveThemeColor,
} from '@/lib/builder/site/theme';
import {
  getTypographyBindingIndicator,
} from '@/lib/builder/site/theme-bindings';
import ThemeBindingBadge from '@/components/builder/editor/ThemeBindingBadge';
import { useBuilderTheme } from './BuilderThemeContext';
import { getTextControlsCopy } from './text-controls-copy';
import styles from './ThemeTextPresetPicker.module.css';

type ThemeTextPresetStyleVars = CSSProperties & {
  '--theme-text-preset-color'?: string;
  '--theme-text-preset-font-family'?: string;
  '--theme-text-preset-font-size'?: string;
  '--theme-text-preset-font-weight'?: number;
};

function presetPreviewStyle(preset: ThemeTextPreset, theme: ReturnType<typeof useBuilderTheme>): ThemeTextPresetStyleVars {
  return {
    '--theme-text-preset-color': resolveThemeColor(preset.color, theme),
    '--theme-text-preset-font-family': fontFamilyCSS(preset.fontFamily),
    '--theme-text-preset-font-size': `${Math.min(18, Math.max(13, preset.fontSize * 0.42))}px`,
    '--theme-text-preset-font-weight':
      preset.fontWeight === 'bold'
        ? 700
        : preset.fontWeight === 'medium'
          ? 600
          : 400,
  };
}

export default function ThemeTextPresetPicker({
  value,
  disabled = false,
  onChange,
  onClear,
  locale = 'en',
}: {
  value?: ThemeTextPresetKey;
  disabled?: boolean;
  onChange: (key: ThemeTextPresetKey) => void;
  onClear?: () => void;
  locale?: Locale;
}) {
  const theme = useBuilderTheme();
  const copy = getTextControlsCopy(locale);
  const presets = getThemeTextPresets(theme);
  const [open, setOpen] = useState(false);
  const currentLabel = value ? copy.themePresetPicker.presets[value] : copy.themePresetPicker.noPreset;
  const bindingIndicator = getTypographyBindingIndicator(value);

  useEffect(() => {
    if (!open) return undefined;
    const handleWindowClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-theme-text-preset-picker]')) {
        setOpen(false);
      }
    };
    window.addEventListener('click', handleWindowClick, true);
    return () => window.removeEventListener('click', handleWindowClick, true);
  }, [open]);

  return (
    <div className={styles.root} data-theme-text-preset-picker>
      <button
        type="button"
        disabled={disabled}
        className={styles.trigger}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={styles.triggerLabel}>{currentLabel}</span>
        <ThemeBindingBadge indicator={bindingIndicator} />
      </button>

      {open ? (
        <div className={styles.popover} data-theme-text-preset-popover="true">
          {onClear ? (
            <button
              type="button"
              className={styles.option}
              data-active={!value ? 'true' : undefined}
              onClick={() => {
                onClear();
                setOpen(false);
              }}
            >
              <span className={styles.noPresetLabel}>{copy.themePresetPicker.noPreset}</span>
            </button>
          ) : null}

          {THEME_TEXT_PRESET_KEYS.map((key) => {
            const preset = presets[key];
            return (
              <button
                key={key}
                type="button"
                className={styles.option}
                data-active={value === key ? 'true' : undefined}
                onClick={() => {
                  onChange(key);
                  setOpen(false);
                }}
              >
                <span
                  className={styles.previewText}
                  style={presetPreviewStyle(preset, theme)}
                >
                  {copy.themePresetPicker.previewText}
                </span>
                <span className={styles.presetName}>
                  {copy.themePresetPicker.presets[key]}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
