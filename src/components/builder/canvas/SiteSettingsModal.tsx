'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_THEME,
  type BrandKitAssets,
  type BuilderSiteSettings,
  type BuilderTheme,
  type DarkModeConfig,
} from '@/lib/builder/site/types';
import { normalizeLocale } from '@/lib/locales';
import BrandKitPanel from '@/components/builder/editor/BrandKitPanel';
import ColorPicker from '@/components/builder/editor/ColorPicker';
import FontPicker from '@/components/builder/editor/FontPicker';
import {
  THEME_COLOR_LABELS,
  THEME_COLOR_TOKENS,
  THEME_TEXT_PRESET_KEYS,
  SITE_THEME_PRESETS,
  type BuilderColorValue,
  type SiteThemePreset,
  type ThemeTextPreset,
  type ThemeTextPresetKey,
  createBrandKitFromTheme,
  createDarkColorsFromLight,
  createThemeFromBrandKit,
  normalizeBrandKit,
  normalizeDarkColors,
  normalizeThemeTextPresets,
  resolveThemeColor,
  type BrandKit,
} from '@/lib/builder/site/theme';

interface SiteSettingsForm {
  firmName: string;
  phone: string;
  email: string;
  address: string;
  businessHours: string;
  businessRegNumber: string;
  logo: string;
  logoDark: string;
  favicon: string;
  ogImage: string;
  assets?: BrandKitAssets;
}

type SiteSettingsFieldKey = Exclude<keyof SiteSettingsForm, 'assets'>;

const EMPTY_SETTINGS: SiteSettingsForm = {
  firmName: '',
  phone: '',
  email: '',
  address: '',
  businessHours: '',
  businessRegNumber: '',
  logo: '',
  logoDark: '',
  favicon: '',
  ogImage: '',
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

const noticeStyle: React.CSSProperties = {
  minHeight: 18,
  fontSize: '0.78rem',
  color: '#0f766e',
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

const presetGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 10,
};

const presetCardStyle: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  background: '#fff',
  padding: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
};

const presetButtonStyle: React.CSSProperties = {
  padding: '7px 10px',
  border: '1px solid #cbd5e1',
  borderRadius: 7,
  background: '#f8fafc',
  color: '#0f172a',
  fontSize: '0.78rem',
  fontWeight: 700,
  cursor: 'pointer',
};

interface FieldDef {
  key: SiteSettingsFieldKey;
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
  { key: 'logoDark', label: '다크 로고 URL', placeholder: 'https://example.com/logo-dark.png', type: 'url' },
  { key: 'favicon', label: '파비콘 URL', placeholder: 'https://example.com/favicon.ico', type: 'url' },
  { key: 'ogImage', label: 'OG 이미지 URL', placeholder: 'https://example.com/social-card.png', type: 'url' },
];

function mergeTheme(theme?: Partial<BuilderTheme>): BuilderTheme {
  const colors = { ...DEFAULT_THEME.colors, ...theme?.colors };
  return {
    colors,
    darkColors: normalizeDarkColors(colors, theme?.darkColors),
    fonts: { ...DEFAULT_THEME.fonts, ...theme?.fonts },
    radii: { ...DEFAULT_THEME.radii, ...theme?.radii },
    themeTextPresets: normalizeThemeTextPresets(theme?.themeTextPresets),
  };
}

function themeFromPreset(preset: SiteThemePreset): BuilderTheme {
  const radius = Math.max(0, Math.round(preset.radiusScale));
  return {
    colors: preset.colors,
    fonts: {
      heading: preset.fonts.title,
      body: preset.fonts.body,
    },
    darkColors: createDarkColorsFromLight(preset.colors),
    radii: {
      sm: Math.max(0, Math.round(radius * 0.5)),
      md: radius,
      lg: Math.max(radius, Math.round(radius * 1.5)),
    },
    themeTextPresets: preset.textPresets,
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
    logoDark: settings?.logoDark ?? '',
    favicon: settings?.favicon ?? '',
    ogImage: settings?.ogImage ?? '',
    assets: settings?.assets,
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
    logoDark: settings.logoDark,
    favicon: settings.favicon,
    ogImage: settings.ogImage,
    assets: settings.assets,
  };
}

function normalizeDarkModeConfig(value?: Partial<DarkModeConfig>): Required<DarkModeConfig> {
  const defaultMode = value?.defaultMode === 'dark' || value?.defaultMode === 'auto'
    ? value.defaultMode
    : 'light';
  return {
    defaultMode,
    allowVisitorToggle: value?.allowVisitorToggle !== false,
  };
}

function isValidHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value.trim());
}

interface SiteSettingsResponse {
  ok?: boolean;
  settings?: Partial<BuilderSiteSettings>;
  theme?: BuilderTheme;
  darkMode?: DarkModeConfig;
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
  onSaved?: (payload: { settings: BuilderSiteSettings; theme: BuilderTheme; darkMode: Required<DarkModeConfig> }) => void;
  onClose: () => void;
}) {
  const [settings, setSettings] = useState<SiteSettingsForm>(EMPTY_SETTINGS);
  const [theme, setTheme] = useState<BuilderTheme>(DEFAULT_THEME);
  const [brandKit, setBrandKit] = useState<BrandKit>(() => createBrandKitFromTheme(DEFAULT_THEME, EMPTY_SETTINGS));
  const [darkMode, setDarkMode] = useState<Required<DarkModeConfig>>(() => normalizeDarkModeConfig());
  const [activeTab, setActiveTab] = useState<'settings' | 'brand' | 'colors' | 'dark' | 'typography' | 'presets'>('settings');
  const [previewDark, setPreviewDark] = useState(false);
  const [pendingPreset, setPendingPreset] = useState<SiteThemePreset | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
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
        const nextSettings = toSettingsForm(data.settings);
        const nextTheme = mergeTheme(data.theme);
        setSettings(nextSettings);
        setTheme(nextTheme);
        setDarkMode(normalizeDarkModeConfig(data.darkMode));
        setBrandKit(createBrandKitFromTheme(nextTheme, nextSettings));
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
    const resolvedDarkColors = normalizeDarkColors(theme.colors, theme.darkColors);
    for (const token of THEME_COLOR_TOKENS) {
      if (!isValidHexColor(resolvedDarkColors[token])) {
        setError(`Dark ${THEME_COLOR_LABELS[token]} color는 #RRGGBB 형식이어야 합니다.`);
        return;
      }
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        settings: toSettingsPayload(settings),
        theme: {
          ...theme,
          darkColors: resolvedDarkColors,
        },
        darkMode,
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
        darkMode: payload.darkMode,
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

  const updateDarkThemeColor = (key: keyof BuilderTheme['colors'], value: string) => {
    setTheme((prev) => {
      const darkColors = normalizeDarkColors(prev.colors, prev.darkColors);
      return {
        ...prev,
        darkColors: {
          ...darkColors,
          [key]: value,
        },
      };
    });
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

  const applyPreset = (preset: SiteThemePreset) => {
    const nextTheme = themeFromPreset(preset);
    setTheme(nextTheme);
    setBrandKit(createBrandKitFromTheme(nextTheme, settings));
    setPendingPreset(null);
    setNotice(`${preset.name} preset applied. 저장을 눌러 사이트에 반영하세요.`);
  };

  const applyBrandKitToState = (kit: BrandKit, message: string) => {
    const nextTheme = createThemeFromBrandKit(kit, theme);
    setTheme(nextTheme);
    setSettings((prev) => ({
      ...prev,
      logo: kit.logoLight ?? prev.logo,
      logoDark: kit.logoDark ?? prev.logoDark,
      favicon: kit.favicon ?? prev.favicon,
      ogImage: kit.ogImage ?? prev.ogImage,
      assets: kit.assets,
    }));
    setBrandKit(kit);
    setNotice(message);
  };

  const exportBrandKit = () => {
    const payload = {
      ...brandKit,
      metadata: {
        exportedAt: new Date().toISOString(),
        siteName: settings.firmName || brandKit.metadata?.siteName,
      },
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'hojeong-brand-kit.json';
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice('Brand kit JSON을 내보냈습니다.');
  };

  const importBrandKit = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      const nextKit = normalizeBrandKit(parsed, brandKit);
      applyBrandKitToState(nextKit, 'Brand kit JSON을 불러와 적용했습니다. 저장을 눌러 사이트에 반영하세요.');
      setError(null);
    } catch {
      setError('Brand kit JSON을 읽지 못했습니다.');
    }
  };

  const paletteTokens = THEME_COLOR_TOKENS.map((token) => ({
    token,
    label: THEME_COLOR_LABELS[token],
    color: theme.colors[token],
  }));
  const textPresets = normalizeThemeTextPresets(theme.themeTextPresets);
  const darkColors = normalizeDarkColors(theme.colors, theme.darkColors);
  const previewColors = previewDark ? darkColors : theme.colors;

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
            ['brand', 'Brand kit'],
            ['colors', 'Colors'],
            ['dark', 'Dark'],
            ['typography', 'Typography'],
            ['presets', 'Presets'],
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
          ) : activeTab === 'brand' ? (
            <BrandKitPanel
              value={brandKit}
              locale={normalizeLocale(locale)}
              onChange={setBrandKit}
              onApply={() => applyBrandKitToState(brandKit, 'Brand kit을 현재 사이트 테마에 적용했습니다. 저장을 눌러 사이트에 반영하세요.')}
              onExport={exportBrandKit}
              onImport={(file) => void importBrandKit(file)}
            />
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
          ) : activeTab === 'dark' ? (
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
                      setDarkMode((prev) => ({
                        ...prev,
                        defaultMode: value === 'dark' || value === 'auto' ? value : 'light',
                      }));
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
                      setDarkMode((prev) => ({
                        ...prev,
                        allowVisitorToggle: event.target.checked,
                      }));
                    }}
                  />
                  Allow visitor toggle
                </label>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={sectionHeadingStyle}>Dark mode colors</div>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>
                  <input
                    type="checkbox"
                    checked={previewDark}
                    onChange={(event) => setPreviewDark(event.target.checked)}
                  />
                  Preview dark
                </label>
              </div>

              <div
                style={{
                  border: `1px solid ${previewDark ? darkColors.muted : '#e2e8f0'}`,
                  borderRadius: 12,
                  background: previewColors.background,
                  color: previewColors.text,
                  padding: 14,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  transition: 'background 200ms ease, color 200ms ease, border-color 200ms ease',
                }}
              >
                <strong style={{ fontFamily: theme.fonts.heading, color: previewColors.text }}>
                  Dark preview
                </strong>
                <span style={{ color: previewColors.secondary, fontSize: '0.78rem', lineHeight: 1.45 }}>
                  Published 페이지의 DarkModeToggle이 이 색상 세트로 전환됩니다.
                </span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ padding: '7px 10px', borderRadius: theme.radii.md, background: previewColors.primary, color: previewColors.background, fontSize: '0.78rem', fontWeight: 800 }}>
                    Primary
                  </span>
                  <span style={{ padding: '7px 10px', borderRadius: theme.radii.md, border: `1px solid ${previewColors.secondary}`, color: previewColors.secondary, fontSize: '0.78rem', fontWeight: 800 }}>
                    Secondary
                  </span>
                  <span style={{ padding: '7px 10px', borderRadius: theme.radii.md, background: previewColors.muted, color: previewColors.text, fontSize: '0.78rem', fontWeight: 800 }}>
                    Muted
                  </span>
                </div>
              </div>

              {THEME_COLOR_TOKENS.map((token) => (
                <div key={token} style={fieldStyle}>
                  <label style={labelStyle}>Dark {THEME_COLOR_LABELS[token]}</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: 8, alignItems: 'center' }}>
                    <input
                      type="color"
                      value={isValidHexColor(darkColors[token]) ? darkColors[token] : createDarkColorsFromLight(theme.colors)[token]}
                      style={{ width: 56, height: 38, padding: 4, border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer' }}
                      onChange={(event) => updateDarkThemeColor(token, event.target.value)}
                    />
                    <input
                      type="text"
                      value={darkColors[token]}
                      placeholder="#0f172a"
                      style={inputStyle}
                      onChange={(event) => updateDarkThemeColor(token, event.target.value)}
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
          ) : activeTab === 'typography' ? (
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
          ) : (
            <div style={sectionStyle}>
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
                    <button type="button" style={cancelBtnStyle} onClick={() => setPendingPreset(null)}>
                      Cancel
                    </button>
                    <button type="button" style={saveBtnStyle} onClick={() => applyPreset(pendingPreset)}>
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
                      onClick={() => setPendingPreset(preset)}
                    >
                      Apply
                    </button>
                  </section>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={footerStyle}>
          <span style={error ? statusStyle : noticeStyle}>{error ?? notice ?? ''}</span>
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
