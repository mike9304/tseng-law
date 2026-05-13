'use client';

import {
  PAGE_TRANSITION_OPTIONS,
  type PageTransition,
} from '@/lib/builder/animations/presets';
import {
  DEFAULT_THEME,
  type BuilderTheme,
} from '@/lib/builder/site/types';
import {
  THEME_COLOR_LABELS,
  THEME_COLOR_TOKENS,
} from '@/lib/builder/site/theme';
import {
  fieldStyle,
  inputStyle,
  labelStyle,
  sectionHeadingStyle,
  sectionStyle,
  twoColumnStyle,
} from './SiteSettingsModal.styles';

interface SiteSettingsAdvancedTabProps {
  pageTransition: PageTransition;
  pageTransitionDurationMs: number;
  theme: BuilderTheme;
  isValidHexColor: (value: string) => boolean;
  onChangePageTransition: (value: PageTransition) => void;
  onChangePageTransitionDurationMs: (value: number) => void;
  onChangeThemeColor: (key: keyof BuilderTheme['colors'], value: string) => void;
}

export function SiteSettingsAdvancedTab({
  pageTransition,
  pageTransitionDurationMs,
  theme,
  isValidHexColor,
  onChangePageTransition,
  onChangePageTransitionDurationMs,
  onChangeThemeColor,
}: SiteSettingsAdvancedTabProps) {
  return (
    <div style={sectionStyle}>
      <div style={sectionHeadingStyle}>Motion</div>
      <div style={twoColumnStyle}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Page transition</label>
          <select
            aria-label="Page transition"
            value={pageTransition}
            style={inputStyle}
            onChange={(event) => onChangePageTransition(event.target.value as PageTransition)}
          >
            {PAGE_TRANSITION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Duration</label>
          <input
            aria-label="Page transition duration"
            type="number"
            min={80}
            max={3000}
            step={20}
            value={pageTransitionDurationMs}
            style={inputStyle}
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
      <p style={{ margin: 0, color: '#64748b', fontSize: '0.76rem', lineHeight: 1.45 }}>
        Published 페이지 wrapper에 fade/slide/scale 전환을 적용합니다. 방문자가 reduced motion을 켜면 자동으로 꺼집니다.
      </p>

      <div style={sectionHeadingStyle}>Theme colors</div>
      {THEME_COLOR_TOKENS.map((token) => (
        <div key={token} style={fieldStyle}>
          <label style={labelStyle}>{THEME_COLOR_LABELS[token]}</label>
          <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: 8, alignItems: 'center' }}>
            <input
              type="color"
              value={isValidHexColor(theme.colors[token]) ? theme.colors[token] : DEFAULT_THEME.colors[token]}
              style={{ width: 56, height: 38, padding: 4, border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer' }}
              onChange={(event) => onChangeThemeColor(token, event.target.value)}
            />
            <input
              type="text"
              value={theme.colors[token]}
              placeholder="#123B63"
              style={inputStyle}
              onChange={(event) => onChangeThemeColor(token, event.target.value)}
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
