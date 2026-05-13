'use client';

import {
  type BuilderTheme,
  type DarkModeConfig,
} from '@/lib/builder/site/types';
import {
  THEME_COLOR_LABELS,
  THEME_COLOR_TOKENS,
  createDarkColorsFromLight,
  normalizeDarkColors,
} from '@/lib/builder/site/theme';
import {
  fieldStyle,
  inputStyle,
  labelStyle,
  sectionHeadingStyle,
  sectionStyle,
  twoColumnStyle,
} from './SiteSettingsModal.styles';

interface SiteSettingsDarkModeTabProps {
  darkMode: Required<DarkModeConfig>;
  theme: BuilderTheme;
  isValidHexColor: (value: string) => boolean;
  onChangeDarkMode: (next: Required<DarkModeConfig>) => void;
  onChangeDarkThemeColor: (key: keyof BuilderTheme['colors'], value: string) => void;
}

export function SiteSettingsDarkModeTab({
  darkMode,
  theme,
  isValidHexColor,
  onChangeDarkMode,
  onChangeDarkThemeColor,
}: SiteSettingsDarkModeTabProps) {
  const darkColors = normalizeDarkColors(theme.colors, theme.darkColors);

  const renderThemePreview = (
    label: string,
    colors: BuilderTheme['colors'],
  ) => (
    <div
      style={{
        border: `1px solid ${colors.muted}`,
        borderRadius: 12,
        background: colors.background,
        color: colors.text,
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        minHeight: 144,
      }}
    >
      <strong style={{ fontFamily: theme.fonts.heading, color: colors.text }}>
        {label}
      </strong>
      <span style={{ color: colors.secondary, fontSize: '0.78rem', lineHeight: 1.45 }}>
        Published 페이지의 DarkModeToggle이 이 색상 세트 사이를 전환합니다.
      </span>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ padding: '7px 10px', borderRadius: theme.radii.md, background: colors.primary, color: colors.background, fontSize: '0.78rem', fontWeight: 800 }}>
          Primary
        </span>
        <span style={{ padding: '7px 10px', borderRadius: theme.radii.md, border: `1px solid ${colors.secondary}`, color: colors.secondary, fontSize: '0.78rem', fontWeight: 800 }}>
          Secondary
        </span>
        <span style={{ padding: '7px 10px', borderRadius: theme.radii.md, background: colors.muted, color: colors.text, fontSize: '0.78rem', fontWeight: 800 }}>
          Muted
        </span>
      </div>
    </div>
  );

  return (
    <div style={sectionStyle}>
      <div style={sectionStyle}>
        <div style={sectionHeadingStyle}>Dark mode runtime</div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Default mode</label>
          <select
            value={darkMode.defaultMode}
            style={inputStyle}
            onChange={(event) => {
              const value = event.target.value;
              onChangeDarkMode({
                ...darkMode,
                defaultMode: value === 'dark' || value === 'auto' ? value : 'light',
              });
            }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="auto">Auto</option>
          </select>
        </div>
        <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
          <input
            type="checkbox"
            checked={darkMode.allowVisitorToggle}
            onChange={(event) => {
              onChangeDarkMode({
                ...darkMode,
                allowVisitorToggle: event.target.checked,
              });
            }}
          />
          Allow visitor toggle
        </label>
      </div>

      <div style={sectionHeadingStyle}>Light / Dark simultaneous preview</div>
      <div style={twoColumnStyle}>
        {renderThemePreview('Light preview', theme.colors)}
        {renderThemePreview('Dark preview', darkColors)}
      </div>

      {THEME_COLOR_TOKENS.map((token) => (
        <div key={token} style={fieldStyle}>
          <label style={labelStyle}>Dark {THEME_COLOR_LABELS[token]}</label>
          <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: 8, alignItems: 'center' }}>
            <input
              type="color"
              value={isValidHexColor(darkColors[token]) ? darkColors[token] : createDarkColorsFromLight(theme.colors)[token]}
              style={{ width: 56, height: 38, padding: 4, border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer' }}
              onChange={(event) => onChangeDarkThemeColor(token, event.target.value)}
            />
            <input
              type="text"
              value={darkColors[token]}
              placeholder="#0f172a"
              style={inputStyle}
              onChange={(event) => onChangeDarkThemeColor(token, event.target.value)}
              onFocus={(event) => {
                event.currentTarget.style.borderColor = '#116dff';
              }}
              onBlur={(event) => {
                event.currentTarget.style.borderColor = '#e2e8f0';
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
