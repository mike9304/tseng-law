'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  PAGE_TRANSITION_OPTIONS,
  type PageTransition,
} from '@/lib/builder/animations/presets';
import {
  DEFAULT_THEME,
  type BrandKitAssets,
  type BuilderHeaderFooterConfig,
  type BuilderMobileBottomBar,
  type BuilderMobileBottomBarAction,
  type BuilderSiteSettings,
  type BuilderTheme,
  type DarkModeConfig,
} from '@/lib/builder/site/types';
import {
  normalizeHeaderFooterMobileConfig,
  normalizeMobileBottomBar,
} from '@/lib/builder/site/mobile-schema';
import { normalizeLocale } from '@/lib/locales';
import BrandKitPanel from '@/components/builder/editor/BrandKitPanel';
import ColorPicker from '@/components/builder/editor/ColorPicker';
import FontPicker from '@/components/builder/editor/FontPicker';
import ModalShell from './ModalShell';
import {
  THEME_COLOR_LABELS,
  THEME_COLOR_TOKENS,
  THEME_RADIUS_PRESETS,
  THEME_SHADOW_PRESETS,
  THEME_TEXT_PRESET_KEYS,
  SITE_THEME_PRESETS,
  applyThemeRadiusPreset,
  applyThemeShadowPreset,
  applyTypographyScaleToTheme,
  createDesignTokenBundle,
  type BuilderColorValue,
  type SiteThemePreset,
  type ThemeTextPreset,
  type ThemeTextPresetKey,
  createBrandKitFromTheme,
  createDarkColorsFromLight,
  createThemeFromBrandKit,
  normalizeBrandKit,
  normalizeDarkColors,
  normalizeDesignTokenTheme,
  normalizeThemeEffects,
  normalizeThemeTextPresets,
  normalizeThemeTypographyScale,
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
  pageTransition: PageTransition;
  pageTransitionDurationMs: number;
  assets?: BrandKitAssets;
}

type SiteSettingsFieldKey = Exclude<keyof SiteSettingsForm, 'assets' | 'pageTransition' | 'pageTransitionDurationMs'>;
type SiteSettingsTab = 'general' | 'brand' | 'typography' | 'presets' | 'dark' | 'mobile' | 'advanced';

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
  pageTransition: 'none',
  pageTransitionDurationMs: 280,
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

const twoColumnStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 12,
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

const SETTINGS_TABS: Array<{ key: SiteSettingsTab; label: string; icon: string }> = [
  { key: 'general', label: 'General', icon: 'G' },
  { key: 'brand', label: 'Brand kit', icon: 'B' },
  { key: 'typography', label: 'Typography', icon: 'A' },
  { key: 'presets', label: 'Presets', icon: 'P' },
  { key: 'dark', label: 'Dark mode', icon: 'D' },
  { key: 'mobile', label: 'Mobile', icon: 'M' },
  { key: 'advanced', label: 'Advanced', icon: '#' },
];

function mergeTheme(theme?: Partial<BuilderTheme>): BuilderTheme {
  const colors = { ...DEFAULT_THEME.colors, ...theme?.colors };
  return applyTypographyScaleToTheme({
    colors,
    darkColors: normalizeDarkColors(colors, theme?.darkColors),
    fonts: { ...DEFAULT_THEME.fonts, ...theme?.fonts },
    radii: { ...DEFAULT_THEME.radii, ...theme?.radii },
    themeTextPresets: normalizeThemeTextPresets(theme?.themeTextPresets),
    typographyScale: normalizeThemeTypographyScale(theme),
    effects: normalizeThemeEffects(theme),
  });
}

function themeFromPreset(preset: SiteThemePreset): BuilderTheme {
  const radius = Math.max(0, Math.round(preset.radiusScale));
  return applyTypographyScaleToTheme({
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
    effects: {
      radiusPreset: radius <= 2 ? 'sharp' : radius >= 12 ? 'soft' : 'medium',
      shadowPreset: preset.shadowIntensity === 'subtle' ? 'soft' : preset.shadowIntensity,
    },
    themeTextPresets: preset.textPresets,
  });
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
    pageTransition: settings?.pageTransition ?? 'none',
    pageTransitionDurationMs: settings?.pageTransitionDurationMs ?? 280,
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
    pageTransition: settings.pageTransition,
    pageTransitionDurationMs: settings.pageTransitionDurationMs,
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
  headerFooter?: BuilderHeaderFooterConfig;
  mobileBottomBar?: BuilderMobileBottomBar;
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
  onSaved?: (payload: {
    settings: BuilderSiteSettings;
    theme: BuilderTheme;
    darkMode: Required<DarkModeConfig>;
    headerFooter: BuilderHeaderFooterConfig;
    mobileBottomBar: BuilderMobileBottomBar;
  }) => void;
  onClose: () => void;
}) {
  const [settings, setSettings] = useState<SiteSettingsForm>(EMPTY_SETTINGS);
  const [theme, setTheme] = useState<BuilderTheme>(DEFAULT_THEME);
  const [brandKit, setBrandKit] = useState<BrandKit>(() => createBrandKitFromTheme(DEFAULT_THEME, EMPTY_SETTINGS));
  const [darkMode, setDarkMode] = useState<Required<DarkModeConfig>>(() => normalizeDarkModeConfig());
  const [headerFooter, setHeaderFooter] = useState<BuilderHeaderFooterConfig>(() => normalizeHeaderFooterMobileConfig(undefined));
  const [mobileBottomBar, setMobileBottomBar] = useState<BuilderMobileBottomBar>(() => normalizeMobileBottomBar(undefined, EMPTY_SETTINGS));
  const [activeTab, setActiveTab] = useState<SiteSettingsTab>('general');
  const [pendingPreset, setPendingPreset] = useState<SiteThemePreset | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tokenImportInputRef = useRef<HTMLInputElement | null>(null);

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
        setHeaderFooter(normalizeHeaderFooterMobileConfig(data.headerFooter));
        setMobileBottomBar(normalizeMobileBottomBar(data.mobileBottomBar, nextSettings));
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
        headerFooter: normalizeHeaderFooterMobileConfig(headerFooter),
        mobileBottomBar: normalizeMobileBottomBar(mobileBottomBar, settings),
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
        headerFooter: payload.headerFooter,
        mobileBottomBar: payload.mobileBottomBar,
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

  const updateMobileBottomAction = (
    index: number,
    patch: Partial<BuilderMobileBottomBarAction>,
  ) => {
    setMobileBottomBar((prev) => {
      const normalized = normalizeMobileBottomBar(prev, settings);
      const actions = normalized.actions.map((action, actionIndex) => (
        actionIndex === index ? { ...action, ...patch } : action
      ));
      return { ...normalized, actions };
    });
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
    const nextTheme = applyTypographyScaleToTheme({
      ...themeFromPreset(preset),
      typographyScale: theme.typographyScale,
    });
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

  const exportDesignTokens = () => {
    const payload = createDesignTokenBundle(
      {
        ...theme,
        darkColors: normalizeDarkColors(theme.colors, theme.darkColors),
        themeTextPresets: normalizeThemeTextPresets(theme.themeTextPresets),
      },
      settings.firmName || brandKit.metadata?.siteName,
    );
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'hojeong-design-tokens.json';
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice('Design token JSON을 내보냈습니다.');
  };

  const importDesignTokens = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      const nextTheme = normalizeDesignTokenTheme(parsed, theme);
      setTheme(nextTheme);
      setBrandKit(createBrandKitFromTheme(nextTheme, settings));
      setNotice('Design token JSON을 불러와 적용했습니다. 저장을 눌러 사이트에 반영하세요.');
      setError(null);
    } catch {
      setError('Design token JSON을 읽지 못했습니다.');
    }
  };

  const paletteTokens = THEME_COLOR_TOKENS.map((token) => ({
    token,
    label: THEME_COLOR_LABELS[token],
    color: theme.colors[token],
  }));
  const textPresets = normalizeThemeTextPresets(theme.themeTextPresets);
  const darkColors = normalizeDarkColors(theme.colors, theme.darkColors);
  const footerHint = error ? (
    <span style={{ color: '#dc2626' }}>{error}</span>
  ) : notice ? (
    <span style={{ color: '#0f766e' }}>{notice}</span>
  ) : null;
  const modalActions = [
    { label: '취소', variant: 'secondary' as const, onClick: onClose },
    {
      label: saving ? '저장 중...' : '저장',
      variant: 'primary' as const,
      loading: saving,
      disabled: saving || loading,
      onClick: handleSave,
    },
  ];
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

  if (!open) return null;

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="사이트 설정"
      subtitle="Brand kit, Typography, Dark, Presets로 사이트 전체 디자인을 한 화면에서 통제합니다."
      size="xl"
      bodyFlush
      footerHint={footerHint}
      actions={modalActions}
    >
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <nav
          aria-label="설정 탭"
          style={{
            width: 220,
            flex: '0 0 220px',
            borderRight: '1px solid #e2e8f0',
            background: '#ffffff',
            padding: '16px 10px',
            overflowY: 'auto',
          }}
        >
          {SETTINGS_TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
            <button
              key={tab.key}
              type="button"
              style={{
                width: '100%',
                display: 'grid',
                gridTemplateColumns: '4px 32px minmax(0, 1fr)',
                alignItems: 'center',
                gap: 9,
                minHeight: 40,
                marginBottom: 4,
                border: `1px solid ${active ? '#bfdbfe' : 'transparent'}`,
                borderRadius: 9,
                background: active ? '#eff6ff' : 'transparent',
                color: active ? '#123b63' : '#475569',
                cursor: 'pointer',
                fontSize: '0.8rem',
                fontWeight: 800,
                textAlign: 'left',
              }}
              onClick={() => setActiveTab(tab.key)}
            >
              <span aria-hidden style={{ width: 4, height: 22, borderRadius: 2, background: active ? '#116dff' : 'transparent' }} />
              <span aria-hidden style={{ textAlign: 'center' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
            );
          })}
        </nav>

        <div style={{ ...formStyle, padding: 24 }}>
          {loading ? (
            <div style={{ padding: 16, textAlign: 'center', color: '#475569', fontSize: '0.85rem' }}>
              로딩 중...
            </div>
          ) : activeTab === 'general' ? (
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
          ) : activeTab === 'mobile' ? (
            <div style={sectionStyle}>
              <div style={sectionHeadingStyle}>Mobile header</div>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', fontWeight: 800, color: '#334155' }}>
                <input
                  type="checkbox"
                  checked={headerFooter.mobileSticky === true}
                  onChange={(event) => {
                    setHeaderFooter((prev) => ({
                      ...normalizeHeaderFooterMobileConfig(prev),
                      mobileSticky: event.target.checked,
                    }));
                  }}
                />
                Sticky mobile header
              </label>
              <div style={fieldStyle}>
                <label style={labelStyle}>Hamburger mode</label>
                <select
                  value={headerFooter.mobileHamburger ?? 'auto'}
                  style={inputStyle}
                  onChange={(event) => {
                    const value = event.target.value;
                    setHeaderFooter((prev) => ({
                      ...normalizeHeaderFooterMobileConfig(prev),
                      mobileHamburger: value === 'off' || value === 'force' ? value : 'auto',
                    }));
                  }}
                >
                  <option value="auto">Auto</option>
                  <option value="force">Force hamburger</option>
                  <option value="off">Desktop menu on mobile</option>
                </select>
              </div>

              <div style={sectionHeadingStyle}>Mobile bottom CTA</div>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: '0.82rem', fontWeight: 800, color: '#334155' }}>
                <input
                  type="checkbox"
                  checked={mobileBottomBar.enabled}
                  onChange={(event) => {
                    setMobileBottomBar((prev) => ({
                      ...normalizeMobileBottomBar(prev, settings),
                      enabled: event.target.checked,
                    }));
                  }}
                />
                Show fixed bottom action bar
              </label>
              {normalizeMobileBottomBar(mobileBottomBar, settings).actions.map((action, index) => (
                <section
                  key={action.id || index}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 10,
                    padding: 12,
                    display: 'grid',
                    gridTemplateColumns: '110px 1fr',
                    gap: 10,
                    alignItems: 'end',
                  }}
                >
                  <div style={fieldStyle}>
                    <label style={labelStyle}>Type</label>
                    <select
                      value={action.kind}
                      style={inputStyle}
                      onChange={(event) => {
                        const value = event.target.value;
                        updateMobileBottomAction(index, {
                          kind: value === 'phone' || value === 'booking' ? value : 'custom',
                        });
                      }}
                    >
                      <option value="phone">Phone</option>
                      <option value="booking">Booking</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div style={twoColumnStyle}>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Label</label>
                      <input
                        type="text"
                        value={action.label}
                        style={inputStyle}
                        onChange={(event) => updateMobileBottomAction(index, { label: event.target.value })}
                      />
                    </div>
                    <div style={fieldStyle}>
                      <label style={labelStyle}>Link</label>
                      <input
                        type="text"
                        value={action.href}
                        style={inputStyle}
                        onChange={(event) => updateMobileBottomAction(index, { href: event.target.value })}
                      />
                    </div>
                  </div>
                </section>
              ))}
            </div>
          ) : activeTab === 'advanced' ? (
            <div style={sectionStyle}>
              <div style={sectionHeadingStyle}>Motion</div>
              <div style={twoColumnStyle}>
                <div style={fieldStyle}>
                  <label style={labelStyle}>Page transition</label>
                  <select
                    aria-label="Page transition"
                    value={settings.pageTransition}
                    style={inputStyle}
                    onChange={(event) => {
                      const value = event.target.value as PageTransition;
                      setSettings((prev) => ({
                        ...prev,
                        pageTransition: value,
                      }));
                    }}
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
                    value={settings.pageTransitionDurationMs}
                    style={inputStyle}
                    disabled={settings.pageTransition === 'none'}
                    onChange={(event) => {
                      const raw = Number(event.target.value);
                      const next = Number.isFinite(raw)
                        ? Math.max(80, Math.min(3000, Math.round(raw)))
                        : 280;
                      setSettings((prev) => ({
                        ...prev,
                        pageTransitionDurationMs: next,
                      }));
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
              <div style={sectionHeadingStyle}>Site fonts</div>
              <div style={twoColumnStyle}>
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
                      setTheme((prev) => applyTypographyScaleToTheme({ ...prev, typographyScale: { baseSize, ratio } }));
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
                      const ratio = Number(event.target.value) as 1.125 | 1.2 | 1.25 | 1.333 | 1.414 | 1.5;
                      const baseSize = theme.typographyScale?.baseSize ?? 16;
                      setTheme((prev) => applyTypographyScaleToTheme({ ...prev, typographyScale: { baseSize, ratio } }));
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
            <>
            <input
              ref={tokenImportInputRef}
              data-design-token-import-input
              type="file"
              accept="application/json,.json"
              style={{ display: 'none' }}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void importDesignTokens(file);
                event.currentTarget.value = '';
              }}
            />
            <div style={sectionStyle}>
              <div style={sectionHeadingStyle}>Design token bundle</div>
              <section style={presetCardStyle}>
                <strong style={{ color: '#0f172a', fontSize: '0.9rem' }}>
                  Theme token JSON
                </strong>
                <span style={{ color: '#64748b', fontSize: '0.76rem', lineHeight: 1.45 }}>
                  Colors, dark colors, fonts, typography scale, text presets, radii, and shadow settings move together as one design system file.
                </span>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button type="button" style={presetButtonStyle} onClick={exportDesignTokens}>
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
                        onClick={() => {
                          const nextTheme = applyThemeRadiusPreset(theme, preset.key);
                          setTheme(nextTheme);
                          setBrandKit(createBrandKitFromTheme(nextTheme, settings));
                          setNotice(`${preset.label} radius preset applied. 저장을 눌러 사이트에 반영하세요.`);
                        }}
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
                        onClick={() => {
                          const nextTheme = applyThemeShadowPreset(theme, preset.key);
                          setTheme(nextTheme);
                          setBrandKit(createBrandKitFromTheme(nextTheme, settings));
                          setNotice(`${preset.label} shadow preset applied. 저장을 눌러 사이트에 반영하세요.`);
                        }}
                      >
                        Use {preset.label}
                      </button>
                    </section>
                  );
                })}
              </div>
            </div>
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
            </>
          )}
        </div>
      </div>
    </ModalShell>
  );
}
