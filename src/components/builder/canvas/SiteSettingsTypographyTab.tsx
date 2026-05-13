'use client';

import ColorPicker from '@/components/builder/editor/ColorPicker';
import FontPicker from '@/components/builder/editor/FontPicker';
import {
  type BuilderTheme,
} from '@/lib/builder/site/types';
import {
  THEME_COLOR_LABELS,
  THEME_COLOR_TOKENS,
  THEME_TEXT_PRESET_KEYS,
  type BuilderColorValue,
  type ThemeTextPreset,
  type ThemeTextPresetKey,
  normalizeThemeTextPresets,
  resolveThemeColor,
} from '@/lib/builder/site/theme';
import { resolveTypographyScale } from '@/lib/builder/site/typography-scale';
import {
  fieldStyle,
  inputStyle,
  labelStyle,
  sectionHeadingStyle,
  sectionStyle,
  twoColumnStyle,
} from './SiteSettingsModal.styles';

type TypographyScaleRatio = NonNullable<BuilderTheme['typographyScale']>['ratio'];

interface SiteSettingsTypographyTabProps {
  theme: BuilderTheme;
  onChangeThemeFont: (key: 'heading' | 'body', value: string) => void;
  onChangeTypographyScale: (baseSize: number, ratio: TypographyScaleRatio) => void;
  onChangeTextPreset: (key: ThemeTextPresetKey, patch: Partial<ThemeTextPreset>) => void;
}

export function SiteSettingsTypographyTab({
  theme,
  onChangeThemeFont,
  onChangeTypographyScale,
  onChangeTextPreset,
}: SiteSettingsTypographyTabProps) {
  const textPresets = normalizeThemeTextPresets(theme.themeTextPresets);
  const typographyScalePreview = resolveTypographyScale(theme);
  const paletteTokens = THEME_COLOR_TOKENS.map((token) => ({
    token,
    label: THEME_COLOR_LABELS[token],
    color: theme.colors[token],
  }));

  return (
    <div style={sectionStyle}>
      <div style={sectionHeadingStyle}>Site fonts</div>
      <div style={twoColumnStyle}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Heading font</label>
          <FontPicker
            value={theme.fonts.heading}
            onChange={(fontFamily) => onChangeThemeFont('heading', fontFamily)}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Body font</label>
          <FontPicker
            value={theme.fonts.body}
            onChange={(fontFamily) => onChangeThemeFont('body', fontFamily)}
          />
        </div>
      </div>

      <div style={sectionHeadingStyle}>Typography scale (W184)</div>
      <div style={twoColumnStyle}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Base size (px)</label>
          <input
            type="number"
            aria-label="Typography base size"
            min={10}
            max={28}
            value={theme.typographyScale?.baseSize ?? 16}
            onChange={(event) => {
              const baseSize = Number(event.target.value) || 16;
              const ratio = theme.typographyScale?.ratio ?? 1.25;
              onChangeTypographyScale(baseSize, ratio);
            }}
            style={{ padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Ratio</label>
          <select
            aria-label="Typography scale ratio"
            value={theme.typographyScale?.ratio ?? 1.25}
            onChange={(event) => {
              const ratio = Number(event.target.value) as TypographyScaleRatio;
              const baseSize = theme.typographyScale?.baseSize ?? 16;
              onChangeTypographyScale(baseSize, ratio);
            }}
            style={{ padding: '6px 8px', border: '1px solid #cbd5e1', borderRadius: 6, fontSize: 13 }}
          >
            <option value={1.125}>1.125 — Major Second</option>
            <option value={1.2}>1.2 — Minor Third</option>
            <option value={1.25}>1.25 — Major Third</option>
            <option value={1.333}>1.333 — Perfect Fourth</option>
            <option value={1.414}>1.414 — Aug. Fourth</option>
            <option value={1.5}>1.5 — Perfect Fifth</option>
          </select>
        </div>
      </div>
      <p style={{ fontSize: 11, color: '#64748b', margin: '4px 0 12px' }}>
        기본 heading 사이즈(h1~h6)를 base × ratio^level 로 자동 계산합니다.
        노드 인스펙터에서 fontSize 를 직접 입력하면 그 값이 우선합니다.
      </p>

      <div
        data-builder-typography-scale-preview="true"
        style={{
          display: 'grid',
          gap: 6,
          border: '1px solid #e2e8f0',
          borderRadius: 10,
          padding: 10,
          background: '#f8fafc',
          marginBottom: 14,
        }}
      >
        {[
          ['H1', typographyScalePreview.h1],
          ['H2', typographyScalePreview.h2],
          ['H3', typographyScalePreview.h3],
          ['H4', typographyScalePreview.h4],
          ['H5', typographyScalePreview.h5],
          ['H6', typographyScalePreview.h6],
          ['Body', typographyScalePreview.body],
        ].map(([label, size]) => {
          const numericSize = Number(size);
          return (
            <div
              key={label}
              data-builder-typography-scale-preview-row={String(label).toLowerCase()}
              style={{
                display: 'grid',
                gridTemplateColumns: '48px minmax(0, 1fr) 52px',
                alignItems: 'center',
                gap: 10,
                minHeight: 30,
              }}
            >
              <span style={{ color: '#64748b', fontSize: 11, fontWeight: 800 }}>{label}</span>
              <span
                style={{
                  minWidth: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: '#0f172a',
                  fontFamily: String(label).startsWith('H') ? theme.fonts.heading : theme.fonts.body,
                  fontSize: Math.max(11, Math.min(22, numericSize / 3.5)),
                  fontWeight: String(label).startsWith('H') ? 800 : 500,
                }}
              >
                호정국제 법률사무소
              </span>
              <span style={{ color: '#334155', fontSize: 11, fontWeight: 800, textAlign: 'right' }}>
                {Math.round(numericSize)}px
              </span>
            </div>
          );
        })}
      </div>

      <div style={sectionHeadingStyle}>Theme text presets</div>
      {THEME_TEXT_PRESET_KEYS.map((key) => {
        const preset = textPresets[key];
        return (
          <section
            key={key}
            style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: 12, display: 'flex', flexDirection: 'column', gap: 12 }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
              <strong
                style={{
                  fontFamily: preset.fontFamily,
                  fontSize: Math.min(22, Math.max(14, preset.fontSize * 0.48)),
                  color: resolveThemeColor(preset.color, theme),
                  lineHeight: 1.1,
                }}
              >
                제목 텍스트
              </strong>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>{preset.label}</span>
            </div>

            <div style={twoColumnStyle}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Label</label>
                <input
                  type="text"
                  value={preset.label}
                  style={inputStyle}
                  onChange={(event) => onChangeTextPreset(key, { label: event.target.value })}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Font</label>
                <FontPicker
                  value={preset.fontFamily}
                  onChange={(fontFamily) => onChangeTextPreset(key, { fontFamily })}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Size</label>
                <input
                  type="number"
                  min={12}
                  max={160}
                  value={preset.fontSize}
                  style={inputStyle}
                  onChange={(event) => onChangeTextPreset(key, { fontSize: Number(event.target.value) })}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Weight</label>
                <select
                  value={preset.fontWeight}
                  style={inputStyle}
                  onChange={(event) => onChangeTextPreset(key, { fontWeight: event.target.value as ThemeTextPreset['fontWeight'] })}
                >
                  <option value="regular">Regular</option>
                  <option value="medium">Medium</option>
                  <option value="bold">Bold</option>
                </select>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Line height</label>
                <input
                  type="number"
                  min={0.5}
                  max={4}
                  step={0.05}
                  value={preset.lineHeight}
                  style={inputStyle}
                  onChange={(event) => onChangeTextPreset(key, { lineHeight: Number(event.target.value) })}
                />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Letter spacing</label>
                <input
                  type="number"
                  min={-2}
                  max={10}
                  step={0.5}
                  value={preset.letterSpacing}
                  style={inputStyle}
                  onChange={(event) => onChangeTextPreset(key, { letterSpacing: Number(event.target.value) })}
                />
              </div>
            </div>

            <div style={fieldStyle}>
              <label style={labelStyle}>Color</label>
              <ColorPicker
                value={preset.color}
                paletteTokens={paletteTokens}
                onChange={(color: BuilderColorValue) => onChangeTextPreset(key, { color })}
              />
            </div>
          </section>
        );
      })}
    </div>
  );
}
