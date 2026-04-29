'use client';

import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_THEME, type BuilderSiteSettings, type BuilderTheme } from '@/lib/builder/site/types';
import ColorPicker from '@/components/builder/editor/ColorPicker';
import FontPicker from '@/components/builder/editor/FontPicker';
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

interface SiteSettingsForm {
  firmName: string;
  phone: string;
  email: string;
  address: string;
  businessHours: string;
  businessRegNumber: string;
  logo: string;
  favicon: string;
}

const EMPTY_SETTINGS: SiteSettingsForm = {
  firmName: '',
  phone: '',
  email: '',
  address: '',
  businessHours: '',
  businessRegNumber: '',
  logo: '',
  favicon: '',
};

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 9000,
  background: 'rgba(15, 23, 42, 0.45)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: 'fadeIn 150ms ease',
};

const panelStyle: React.CSSProperties = {
  width: 560,
  maxWidth: '92vw',
  maxHeight: '85vh',
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 24px 64px rgba(15, 23, 42, 0.18)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  animation: 'fadeIn 180ms ease',
  transform: 'scale(1)',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  borderBottom: '1px solid #e2e8f0',
};

const titleStyle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  color: '#0f172a',
};

const closeBtnStyle: React.CSSProperties = {
  padding: '4px 12px',
  fontSize: '0.78rem',
  fontWeight: 600,
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: '#fff',
  color: '#64748b',
  cursor: 'pointer',
};

const formStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '16px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
};

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: '0.76rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: '#64748b',
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.78rem',
  fontWeight: 600,
  color: '#334155',
};

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  fontSize: '0.85rem',
  color: '#0f172a',
  outline: 'none',
  transition: 'border-color 150ms ease',
  boxSizing: 'border-box',
};

const footerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  padding: '12px 20px',
  borderTop: '1px solid #e2e8f0',
};

const tabRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 6,
  padding: '10px 20px 0',
  borderBottom: '1px solid #e2e8f0',
};

function tabButtonStyle(active: boolean): React.CSSProperties {
  return {
    padding: '7px 12px',
    border: '1px solid transparent',
    borderBottom: active ? '2px solid #116dff' : '2px solid transparent',
    background: 'transparent',
    color: active ? '#0f172a' : '#64748b',
    fontSize: '0.8rem',
    fontWeight: 700,
    cursor: 'pointer',
  };
}

const twoColumnStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
};

const statusStyle: React.CSSProperties = {
  minHeight: 18,
  fontSize: '0.78rem',
  color: '#dc2626',
};

const cancelBtnStyle: React.CSSProperties = {
  padding: '8px 18px',
  fontSize: '0.82rem',
  fontWeight: 600,
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: '#fff',
  color: '#334155',
  cursor: 'pointer',
};

const saveBtnStyle: React.CSSProperties = {
  padding: '8px 18px',
  fontSize: '0.82rem',
  fontWeight: 600,
  border: 'none',
  borderRadius: 8,
  background: '#116dff',
  color: '#fff',
  cursor: 'pointer',
  transition: 'background 120ms ease',
};

interface FieldDef {
  key: keyof SiteSettingsForm;
  label: string;
  placeholder: string;
  type?: string;
}

const FIELDS: FieldDef[] = [
  { key: 'firmName', label: '사무소 이름', placeholder: '예: 호정국제법률사무소' },
  { key: 'phone', label: '전화번호', placeholder: '예: +886-2-1234-5678', type: 'tel' },
  { key: 'email', label: '이메일', placeholder: '예: contact@example.com', type: 'email' },
  { key: 'address', label: '주소', placeholder: '사무소 주소' },
  { key: 'businessHours', label: '영업 시간', placeholder: '예: 월~금 09:00-18:00' },
  { key: 'businessRegNumber', label: '사업자 등록번호', placeholder: '사업자 등록번호' },
  { key: 'logo', label: '로고 URL', placeholder: 'https://example.com/logo.png', type: 'url' },
  { key: 'favicon', label: '파비콘 URL', placeholder: 'https://example.com/favicon.ico', type: 'url' },
];

function mergeTheme(theme?: Partial<BuilderTheme>): BuilderTheme {
  return {
    colors: { ...DEFAULT_THEME.colors, ...theme?.colors },
    fonts: { ...DEFAULT_THEME.fonts, ...theme?.fonts },
    radii: { ...DEFAULT_THEME.radii, ...theme?.radii },
    themeTextPresets: normalizeThemeTextPresets(theme?.themeTextPresets),
  };
}

function toSettingsForm(settings?: Partial<BuilderSiteSettings>): SiteSettingsForm {
  return {
    firmName: settings?.firmName ?? '',
    phone: settings?.phone ?? '',
    email: settings?.email ?? '',
    address: settings?.address ?? '',
    businessHours: settings?.businessHours ?? '',
    businessRegNumber: settings?.businessRegNumber ?? '',
    logo: settings?.logo ?? '',
    favicon: settings?.favicon ?? '',
  };
}

function toSettingsPayload(settings: SiteSettingsForm): BuilderSiteSettings {
  return {
    firmName: settings.firmName,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    businessHours: settings.businessHours,
    businessRegNumber: settings.businessRegNumber,
    logo: settings.logo,
    favicon: settings.favicon,
  };
}

function isValidHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value.trim());
}

interface SiteSettingsResponse {
  ok?: boolean;
  settings?: Partial<BuilderSiteSettings>;
  theme?: BuilderTheme;
  error?: string;
}

export default function SiteSettingsModal({
  open,
  locale,
  onSaved,
  onClose,
}: {
  open: boolean;
  locale: string;
  onSaved?: (payload: { settings: BuilderSiteSettings; theme: BuilderTheme }) => void;
  onClose: () => void;
}) {
  const [settings, setSettings] = useState<SiteSettingsForm>(EMPTY_SETTINGS);
  const [theme, setTheme] = useState<BuilderTheme>(DEFAULT_THEME);
  const [activeTab, setActiveTab] = useState<'settings' | 'colors' | 'typography'>('settings');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/builder/site/settings?locale=${encodeURIComponent(locale)}`, {
        credentials: 'same-origin',
      });
      const data = (await response.json().catch(() => ({}))) as SiteSettingsResponse;
      if (response.ok) {
        setSettings(toSettingsForm(data.settings));
        setTheme(mergeTheme(data.theme));
      } else {
        setError(data.error || '사이트 설정을 불러오지 못했습니다.');
      }
    } catch {
      setError('사이트 설정을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    if (open) void fetchSettings();
  }, [open, fetchSettings]);

  useEffect(() => {
    if (!open) return undefined;
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  const handleSave = async () => {
    for (const token of THEME_COLOR_TOKENS) {
      if (!isValidHexColor(theme.colors[token])) {
        setError(`${THEME_COLOR_LABELS[token]} color는 #RRGGBB 형식이어야 합니다.`);
        return;
      }
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        settings: toSettingsPayload(settings),
        theme,
      };
      const response = await fetch(`/api/builder/site/settings?locale=${encodeURIComponent(locale)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as SiteSettingsResponse;
      if (!response.ok) {
        setError(data.error || '사이트 설정을 저장하지 못했습니다.');
        return;
      }

      onSaved?.({
        settings: payload.settings,
        theme: payload.theme,
      });
      onClose();
    } catch {
      setError('사이트 설정을 저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: keyof SiteSettingsForm, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateThemeColor = (key: keyof BuilderTheme['colors'], value: string) => {
    setTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value,
      },
    }));
  };

  const updateThemeFont = (key: 'heading' | 'body', value: string) => {
    setTheme((prev) => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [key]: value,
      },
    }));
  };

  const updateTextPreset = (
    key: ThemeTextPresetKey,
    patch: Partial<ThemeTextPreset>,
  ) => {
    setTheme((prev) => ({
      ...prev,
      themeTextPresets: {
        ...normalizeThemeTextPresets(prev.themeTextPresets),
        [key]: {
          ...normalizeThemeTextPresets(prev.themeTextPresets)[key],
          ...patch,
        },
      },
    }));
  };

  const paletteTokens = THEME_COLOR_TOKENS.map((token) => ({
    token,
    label: THEME_COLOR_LABELS[token],
    color: theme.colors[token],
  }));
  const textPresets = normalizeThemeTextPresets(theme.themeTextPresets);

  if (!open) return null;

  return (
    <div
      style={backdropStyle}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div style={panelStyle}>
        <div style={headerStyle}>
          <span style={titleStyle}>사이트 설정</span>
          <button type="button" style={closeBtnStyle} onClick={onClose}>
            닫기
          </button>
        </div>

        <div style={tabRowStyle}>
          {([
            ['settings', 'Settings'],
            ['colors', 'Colors'],
            ['typography', 'Typography'],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              type="button"
              style={tabButtonStyle(activeTab === key)}
              onClick={() => setActiveTab(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={formStyle}>
          {loading ? (
            <div style={{ padding: 16, textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
              로딩 중...
            </div>
          ) : activeTab === 'settings' ? (
            <>
              <div style={sectionStyle}>
                <div style={sectionHeadingStyle}>기본 정보</div>
                {FIELDS.map((field) => (
                  <div key={field.key} style={fieldStyle}>
                    <label style={labelStyle}>{field.label}</label>
                    <input
                      type={field.type || 'text'}
                      value={settings[field.key]}
                      placeholder={field.placeholder}
                      style={inputStyle}
                      onChange={(event) => updateField(field.key, event.target.value)}
                      onFocus={(event) => {
                        event.currentTarget.style.borderColor = '#116dff';
                      }}
                      onBlur={(event) => {
                        event.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : activeTab === 'colors' ? (
            <div style={sectionStyle}>
              <div style={sectionHeadingStyle}>Theme colors</div>
              {THEME_COLOR_TOKENS.map((token) => (
                <div key={token} style={fieldStyle}>
                  <label style={labelStyle}>{THEME_COLOR_LABELS[token]}</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: 8, alignItems: 'center' }}>
                    <input
                      type="color"
                      value={isValidHexColor(theme.colors[token]) ? theme.colors[token] : DEFAULT_THEME.colors[token]}
                      style={{ width: 56, height: 38, padding: 4, border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer' }}
                      onChange={(event) => updateThemeColor(token, event.target.value)}
                    />
                    <input
                      type="text"
                      value={theme.colors[token]}
                      placeholder="#123B63"
                      style={inputStyle}
                      onChange={(event) => updateThemeColor(token, event.target.value)}
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

              <div style={sectionStyle}>
                <div style={sectionHeadingStyle}>Site fonts</div>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Heading font</label>
                  <FontPicker
                    value={theme.fonts.heading}
                    onChange={(fontFamily) => updateThemeFont('heading', fontFamily)}
                  />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Body font</label>
                  <FontPicker
                    value={theme.fonts.body}
                    onChange={(fontFamily) => updateThemeFont('body', fontFamily)}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div style={sectionStyle}>
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
                          onChange={(event) => updateTextPreset(key, { label: event.target.value })}
                        />
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Font</label>
                        <FontPicker
                          value={preset.fontFamily}
                          onChange={(fontFamily) => updateTextPreset(key, { fontFamily })}
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
                          onChange={(event) => updateTextPreset(key, { fontSize: Number(event.target.value) })}
                        />
                      </div>
                      <div style={fieldStyle}>
                        <label style={labelStyle}>Weight</label>
                        <select
                          value={preset.fontWeight}
                          style={inputStyle}
                          onChange={(event) => updateTextPreset(key, { fontWeight: event.target.value as ThemeTextPreset['fontWeight'] })}
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
                          onChange={(event) => updateTextPreset(key, { lineHeight: Number(event.target.value) })}
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
                          onChange={(event) => updateTextPreset(key, { letterSpacing: Number(event.target.value) })}
                        />
                      </div>
                    </div>

                    <div style={fieldStyle}>
                      <label style={labelStyle}>Color</label>
                      <ColorPicker
                        value={preset.color}
                        paletteTokens={paletteTokens}
                        onChange={(color: BuilderColorValue) => updateTextPreset(key, { color })}
                      />
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>

        <div style={footerStyle}>
          <span style={statusStyle}>{error ?? ''}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" style={cancelBtnStyle} onClick={onClose}>
              취소
            </button>
            <button
              type="button"
              style={saveBtnStyle}
              onClick={handleSave}
              disabled={saving || loading}
              onMouseEnter={(event) => {
                event.currentTarget.style.background = '#0b5cdb';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = '#116dff';
              }}
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
