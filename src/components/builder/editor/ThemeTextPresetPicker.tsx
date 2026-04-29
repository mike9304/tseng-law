'use client';

import { useEffect, useState } from 'react';
import { fontFamilyCSS } from '@/lib/builder/canvas/fonts';
import {
  THEME_TEXT_PRESET_KEYS,
  type ThemeTextPresetKey,
  getThemeTextPresets,
  resolveThemeColor,
} from '@/lib/builder/site/theme';
import { useBuilderTheme } from './BuilderThemeContext';

const wrapperStyle: React.CSSProperties = {
  position: 'relative',
  width: 220,
  maxWidth: '100%',
};

const triggerStyle: React.CSSProperties = {
  width: '100%',
  height: 36,
  padding: '0 10px',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: '#fff',
  color: '#0f172a',
  fontSize: '0.82rem',
  textAlign: 'left',
  cursor: 'pointer',
};

const popoverStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 6px)',
  left: 0,
  width: 220,
  zIndex: 45,
  padding: 8,
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  background: '#fff',
  boxShadow: '0 16px 40px rgba(15, 23, 42, 0.18)',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

function optionStyle(active: boolean): React.CSSProperties {
  return {
    width: '100%',
    minHeight: 36,
    padding: '6px 8px',
    border: active ? '1px solid #116dff' : '1px solid transparent',
    borderRadius: 8,
    background: active ? '#eff6ff' : 'transparent',
    textAlign: 'left',
    cursor: 'pointer',
  };
}

export default function ThemeTextPresetPicker({
  value,
  disabled = false,
  onChange,
  onClear,
}: {
  value?: ThemeTextPresetKey;
  disabled?: boolean;
  onChange: (key: ThemeTextPresetKey) => void;
  onClear?: () => void;
}) {
  const theme = useBuilderTheme();
  const presets = getThemeTextPresets(theme);
  const [open, setOpen] = useState(false);
  const currentLabel = value ? presets[value].label : 'No preset';

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
    <div style={wrapperStyle} data-theme-text-preset-picker>
      <button
        type="button"
        disabled={disabled}
        style={{ ...triggerStyle, opacity: disabled ? 0.6 : 1 }}
        onClick={() => setOpen((current) => !current)}
      >
        {currentLabel}
      </button>

      {open ? (
        <div style={popoverStyle}>
          {onClear ? (
            <button
              type="button"
              style={optionStyle(!value)}
              onClick={() => {
                onClear();
                setOpen(false);
              }}
            >
              <span style={{ fontSize: '0.78rem', color: '#64748b' }}>No preset</span>
            </button>
          ) : null}

          {THEME_TEXT_PRESET_KEYS.map((key) => {
            const preset = presets[key];
            return (
              <button
                key={key}
                type="button"
                style={optionStyle(value === key)}
                onClick={() => {
                  onChange(key);
                  setOpen(false);
                }}
              >
                <span
                  style={{
                    display: 'block',
                    color: resolveThemeColor(preset.color, theme),
                    fontFamily: fontFamilyCSS(preset.fontFamily),
                    fontSize: Math.min(18, Math.max(13, preset.fontSize * 0.42)),
                    fontWeight:
                      preset.fontWeight === 'bold'
                        ? 700
                        : preset.fontWeight === 'medium'
                          ? 600
                          : 400,
                    lineHeight: 1.15,
                  }}
                >
                  제목 텍스트
                </span>
                <span style={{ display: 'block', marginTop: 2, fontSize: '0.7rem', color: '#64748b' }}>
                  {preset.label}
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
