'use client';

import { useRef } from 'react';
import {
  COMPONENT_DESIGN_PRESETS,
  type ComponentDesignPresetKey,
} from '@/lib/builder/site/component-design-presets';
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
import {
  cancelBtnStyle,
  presetButtonStyle,
  presetCardStyle,
  presetGridStyle,
  saveBtnStyle,
  sectionHeadingStyle,
  sectionStyle,
} from './SiteSettingsModal.styles';

type RadiusPresetKey = (typeof THEME_RADIUS_PRESETS)[number]['key'];
type ShadowPresetKey = (typeof THEME_SHADOW_PRESETS)[number]['key'];

export type CustomThemePreset = {
  id: string;
  name: string;
  savedAt: string;
  theme: BuilderTheme;
};

interface SiteSettingsPresetsTabProps {
  theme: BuilderTheme;
  customThemePresets: CustomThemePreset[];
  pendingPreset: SiteThemePreset | null;
  onApplyComponentDesignPreset: (presetKey: ComponentDesignPresetKey, presetLabel: string) => void;
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

export function SiteSettingsPresetsTab({
  theme,
  customThemePresets,
  pendingPreset,
  onApplyComponentDesignPreset,
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

  return (
    <>
      <input
        ref={tokenImportInputRef}
        data-design-token-import-input
        type="file"
        accept="application/json,.json"
        style={{ display: 'none' }}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void onImportDesignTokens(file);
          event.currentTarget.value = '';
        }}
      />
      <div style={sectionStyle}>
        <div style={sectionHeadingStyle}>Component design presets (W179)</div>
        <div style={presetGridStyle}>
          {COMPONENT_DESIGN_PRESETS.map((preset) => (
            <section
              key={preset.key}
              data-component-design-preset={preset.key}
              style={presetCardStyle}
            >
              <div>
                <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.9rem' }}>
                  {preset.label}
                </strong>
                <span style={{ color: '#64748b', fontSize: '0.72rem', lineHeight: 1.45 }}>
                  {preset.description}
                </span>
              </div>
              <div
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: theme.radii.md,
                  padding: 10,
                  background: '#f8fafc',
                  display: 'grid',
                  gap: 7,
                  color: '#334155',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                }}
              >
                <span>Button: {preset.buttonVariant}</span>
                <span>Card: {preset.cardVariant}</span>
                <span>Form: {preset.formInputVariant}</span>
              </div>
              <button
                type="button"
                style={presetButtonStyle}
                onClick={() => onApplyComponentDesignPreset(preset.key, preset.label)}
              >
                Apply {preset.label}
              </button>
            </section>
          ))}
        </div>

        <div style={sectionHeadingStyle}>Design token bundle</div>
        <section style={presetCardStyle}>
          <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>
            Theme token JSON
          </strong>
          <span style={{ color: '#64748b', fontSize: '0.76rem', lineHeight: 1.45 }}>
            Colors, dark colors, fonts, typography scale, text presets, radii, and shadow settings move together as one design system file.
          </span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" style={presetButtonStyle} onClick={onExportDesignTokens}>
              Export design tokens
            </button>
            <button type="button" style={presetButtonStyle} onClick={() => tokenImportInputRef.current?.click()}>
              Import design tokens
            </button>
          </div>
        </section>

        <div style={sectionHeadingStyle}>Radius & shadow presets</div>
        <div style={presetGridStyle}>
          {THEME_RADIUS_PRESETS.map((preset) => {
            const active = (theme.effects?.radiusPreset ?? 'medium') === preset.key;
            return (
              <section
                key={preset.key}
                data-theme-radius-preset={preset.key}
                style={{
                  ...presetCardStyle,
                  borderColor: active ? '#116dff' : '#e2e8f0',
                  background: active ? '#f8fbff' : '#fff',
                }}
              >
                <div>
                  <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.9rem' }}>
                    {preset.label} radius
                  </strong>
                  <span style={{ color: '#64748b', fontSize: '0.72rem', lineHeight: 1.45 }}>
                    {preset.description}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'end', gap: 8, minHeight: 46 }}>
                  <span aria-hidden style={{ width: 34, height: 24, borderRadius: preset.radii.sm, border: '1px solid #bfdbfe', background: '#eff6ff' }} />
                  <span aria-hidden style={{ width: 44, height: 32, borderRadius: preset.radii.md, border: '1px solid #93c5fd', background: '#dbeafe' }} />
                  <span aria-hidden style={{ width: 54, height: 40, borderRadius: preset.radii.lg, border: '1px solid #60a5fa', background: '#bfdbfe' }} />
                </div>
                <button
                  type="button"
                  style={presetButtonStyle}
                  onClick={() => onApplyRadiusPreset(preset.key, preset.label)}
                >
                  Use {preset.label}
                </button>
              </section>
            );
          })}
        </div>

        <div style={presetGridStyle}>
          {THEME_SHADOW_PRESETS.map((preset) => {
            const active = (theme.effects?.shadowPreset ?? 'soft') === preset.key;
            return (
              <section
                key={preset.key}
                data-theme-shadow-preset={preset.key}
                style={{
                  ...presetCardStyle,
                  borderColor: active ? '#116dff' : '#e2e8f0',
                  background: active ? '#f8fbff' : '#fff',
                }}
              >
                <div>
                  <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.9rem' }}>
                    {preset.label} shadow
                  </strong>
                  <span style={{ color: '#64748b', fontSize: '0.72rem', lineHeight: 1.45 }}>
                    {preset.description}
                  </span>
                </div>
                <div style={{ minHeight: 56, display: 'grid', placeItems: 'center', background: '#f8fafc', borderRadius: 8 }}>
                  <span
                    aria-hidden
                    style={{
                      width: 72,
                      height: 34,
                      borderRadius: theme.radii.md,
                      border: '1px solid #e2e8f0',
                      background: '#fff',
                      boxShadow: preset.shadows.md,
                    }}
                  />
                </div>
                <button
                  type="button"
                  style={presetButtonStyle}
                  onClick={() => onApplyShadowPreset(preset.key, preset.label)}
                >
                  Use {preset.label}
                </button>
              </section>
            );
          })}
        </div>
      </div>

      <div style={sectionStyle}>
        <div style={sectionHeadingStyle}>My Themes</div>
        <section style={presetCardStyle}>
          <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>
            Save current theme
          </strong>
          <span style={{ color: '#64748b', fontSize: '0.76rem', lineHeight: 1.45 }}>
            Store the current colors, fonts, text presets, radius, and shadow choices as a reusable local theme preset.
          </span>
          <button type="button" style={presetButtonStyle} onClick={onSaveCurrentThemePreset}>
            Save as My Theme
          </button>
        </section>

        {customThemePresets.length > 0 ? (
          <div style={presetGridStyle}>
            {customThemePresets.map((preset) => (
              <section key={preset.id} data-custom-theme-preset={preset.id} style={presetCardStyle}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                  <div>
                    <strong style={{ display: 'block', color: '#0f172a', fontSize: '0.9rem' }}>
                      {preset.name}
                    </strong>
                    <span style={{ color: '#64748b', fontSize: '0.72rem' }}>
                      Saved {new Date(preset.savedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {THEME_COLOR_TOKENS.slice(0, 5).map((token) => (
                      <span
                        key={token}
                        aria-hidden
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 999,
                          border: '1px solid rgba(15,23,42,0.14)',
                          background: preset.theme.colors[token],
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div style={{ borderRadius: preset.theme.radii.md, background: preset.theme.colors.background, border: `1px solid ${preset.theme.colors.muted}`, padding: 10 }}>
                  <div style={{ fontFamily: preset.theme.fonts.heading, color: preset.theme.colors.text, fontSize: 22, lineHeight: 1 }}>
                    Aa
                  </div>
                  <div style={{ fontFamily: preset.theme.fonts.body, color: preset.theme.colors.secondary, fontSize: 12, marginTop: 5 }}>
                    My Theme
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    type="button"
                    style={{ ...presetButtonStyle, flex: 1 }}
                    onClick={() => onApplyCustomThemePreset(preset)}
                  >
                    Apply My Theme
                  </button>
                  <button
                    type="button"
                    style={{ ...presetButtonStyle, color: '#b91c1c' }}
                    onClick={() => onDeleteCustomThemePreset(preset.id)}
                  >
                    Delete
                  </button>
                </div>
              </section>
            ))}
          </div>
        ) : (
          <span style={{ color: '#64748b', fontSize: '0.76rem' }}>
            No saved themes yet.
          </span>
        )}

        <div style={sectionHeadingStyle}>Theme presets</div>
        {pendingPreset ? (
          <div style={{ border: '1px solid #bfdbfe', borderRadius: 10, padding: 12, background: '#eff6ff', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <strong style={{ color: '#1e3a8a', fontSize: '0.86rem' }}>
              Apply {pendingPreset.name} to the whole site?
            </strong>
            <span style={{ color: '#334155', fontSize: '0.78rem', lineHeight: 1.45 }}>
              Colors, site fonts, radii, and theme text presets will be replaced. Element-level raw overrides stay unchanged.
            </span>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button type="button" style={cancelBtnStyle} onClick={onCancelPendingPreset}>
                Cancel
              </button>
              <button type="button" style={saveBtnStyle} onClick={() => onApplyPendingPreset(pendingPreset)}>
                Apply preset
              </button>
            </div>
          </div>
        ) : null}

        <div style={presetGridStyle}>
          {SITE_THEME_PRESETS.map((preset) => (
            <section key={preset.key} style={presetCardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div>
                  <strong style={{ display: 'block', fontFamily: preset.fonts.title, color: preset.colors.text, fontSize: '1rem' }}>
                    {preset.name}
                  </strong>
                  <span style={{ color: '#64748b', fontSize: '0.72rem' }}>
                    {preset.shadowIntensity} shadow · radius {preset.radiusScale}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 3 }}>
                  {THEME_COLOR_TOKENS.slice(0, 5).map((token) => (
                    <span
                      key={token}
                      aria-hidden
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 999,
                        border: '1px solid rgba(15,23,42,0.14)',
                        background: preset.colors[token],
                      }}
                    />
                  ))}
                </div>
              </div>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.76rem', lineHeight: 1.45 }}>
                {preset.description}
              </p>
              <div style={{ borderRadius: 8, background: preset.colors.background, border: `1px solid ${preset.colors.muted}`, padding: 10 }}>
                <div style={{ fontFamily: preset.fonts.title, color: preset.colors.text, fontSize: 22, lineHeight: 1 }}>
                  Aa
                </div>
                <div style={{ fontFamily: preset.fonts.body, color: preset.colors.secondary, fontSize: 12, marginTop: 5 }}>
                  안녕하세요 Hello
                </div>
              </div>
              <button
                type="button"
                style={presetButtonStyle}
                onClick={() => onSelectSiteThemePreset(preset)}
              >
                Apply
              </button>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
