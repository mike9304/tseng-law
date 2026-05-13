'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  type PageTransition,
} from '@/lib/builder/animations/presets';
import {
  DEFAULT_THEME,
  type BrandKitAssets,
  type BuilderHeaderFooterConfig,
  type BuilderMobileBottomBar,
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
import ModalShell from './ModalShell';
import {
  type ComponentDesignPresetKey,
  type ComponentDesignPresetPatchResult,
} from '@/lib/builder/site/component-design-presets';
import {
  THEME_COLOR_LABELS,
  THEME_COLOR_TOKENS,
  applyThemeRadiusPreset,
  applyThemeShadowPreset,
  applyTypographyScaleToTheme,
  createDesignTokenBundle,
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
  type BrandKit,
} from '@/lib/builder/site/theme';
import { SiteSettingsDarkModeTab } from './SiteSettingsDarkModeTab';
import {
  SiteSettingsGeneralTab,
  type SiteSettingsGeneralFieldKey,
} from './SiteSettingsGeneralTab';
import { SiteSettingsAdvancedTab } from './SiteSettingsAdvancedTab';
import { SiteSettingsMobileTab } from './SiteSettingsMobileTab';
import {
  SiteSettingsPresetsTab,
  type CustomThemePreset,
} from './SiteSettingsPresetsTab';
import { SiteSettingsTypographyTab } from './SiteSettingsTypographyTab';
import {
  formStyle,
} from './SiteSettingsModal.styles';

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

type SiteSettingsTab = 'general' | 'brand' | 'typography' | 'presets' | 'dark' | 'mobile' | 'advanced';

const CUSTOM_THEME_PRESETS_STORAGE_KEY = 'builder:custom-theme-presets:v1';

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

function safeStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

function readCustomThemePresets(): CustomThemePreset[] {
  const storage = safeStorage();
  if (!storage) return [];
  try {
    const parsed = JSON.parse(storage.getItem(CUSTOM_THEME_PRESETS_STORAGE_KEY) ?? '[]') as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((item) => {
      if (!item || typeof item !== 'object') return [];
      const source = item as Partial<CustomThemePreset>;
      if (!source.theme || typeof source.name !== 'string') return [];
      return [{
        id: typeof source.id === 'string' ? source.id : `theme-${source.name}`,
        name: source.name.trim() || 'My Theme',
        savedAt: typeof source.savedAt === 'string' ? source.savedAt : new Date(0).toISOString(),
        theme: normalizeDesignTokenTheme({ theme: source.theme }, DEFAULT_THEME),
      }];
    });
  } catch {
    return [];
  }
}

function writeCustomThemePresets(presets: CustomThemePreset[]): void {
  const storage = safeStorage();
  if (!storage) return;
  storage.setItem(CUSTOM_THEME_PRESETS_STORAGE_KEY, JSON.stringify(presets.slice(0, 12)));
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
  onApplyComponentDesignPreset,
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
  onApplyComponentDesignPreset?: (presetKey: ComponentDesignPresetKey) => ComponentDesignPresetPatchResult;
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
  const [customThemePresets, setCustomThemePresets] = useState<CustomThemePreset[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleComponentDesignPresetApply(presetKey: ComponentDesignPresetKey, presetLabel: string) {
    const result = onApplyComponentDesignPreset?.(presetKey);
    if (!result || result.changedNodeIds.length === 0) {
      setNotice(`${presetLabel} preset: 변경할 button/card/form 요소가 현재 페이지에 없습니다.`);
      return;
    }
    setNotice(
      `${presetLabel} preset applied to ${result.changedNodeIds.length} components`
      + ` (${result.counts.buttons} buttons, ${result.counts.cards} cards, ${result.counts.formFields} fields, ${result.counts.formSubmits} submits).`,
    );
  }

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

  useEffect(() => {
    if (open) setCustomThemePresets(readCustomThemePresets());
  }, [open]);

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

  const updateField = (key: SiteSettingsGeneralFieldKey, value: string) => {
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

  const saveCurrentThemePreset = () => {
    const name = settings.firmName ? `${settings.firmName} My Theme` : 'My Theme';
    const preset: CustomThemePreset = {
      id: `theme-${Date.now()}`,
      name,
      savedAt: new Date().toISOString(),
      theme: createDesignTokenBundle(
        {
          ...theme,
          darkColors: normalizeDarkColors(theme.colors, theme.darkColors),
          themeTextPresets: normalizeThemeTextPresets(theme.themeTextPresets),
        },
        name,
      ).theme,
    };
    const nextPresets = [preset, ...customThemePresets.filter((item) => item.name !== name)].slice(0, 12);
    writeCustomThemePresets(nextPresets);
    setCustomThemePresets(nextPresets);
    setNotice(`${name} saved. 다른 사이트 설정에서도 My Themes에서 불러올 수 있습니다.`);
  };

  const applyCustomThemePreset = (preset: CustomThemePreset) => {
    const nextTheme = normalizeDesignTokenTheme({ theme: preset.theme }, theme);
    setTheme(nextTheme);
    setBrandKit(createBrandKitFromTheme(nextTheme, settings));
    setNotice(`${preset.name} preset applied. 저장을 눌러 사이트에 반영하세요.`);
  };

  const deleteCustomThemePreset = (id: string) => {
    const nextPresets = customThemePresets.filter((preset) => preset.id !== id);
    writeCustomThemePresets(nextPresets);
    setCustomThemePresets(nextPresets);
    setNotice('My Theme preset deleted.');
  };

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
            <SiteSettingsGeneralTab settings={settings} onUpdateField={updateField} />
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
            <SiteSettingsMobileTab
              headerFooter={headerFooter}
              mobileBottomBar={mobileBottomBar}
              settings={settings}
              onChangeHeaderFooter={setHeaderFooter}
              onChangeMobileBottomBar={setMobileBottomBar}
            />
          ) : activeTab === 'advanced' ? (
            <SiteSettingsAdvancedTab
              pageTransition={settings.pageTransition}
              pageTransitionDurationMs={settings.pageTransitionDurationMs}
              theme={theme}
              isValidHexColor={isValidHexColor}
              onChangePageTransition={(value) => {
                setSettings((prev) => ({
                  ...prev,
                  pageTransition: value,
                }));
              }}
              onChangePageTransitionDurationMs={(value) => {
                setSettings((prev) => ({
                  ...prev,
                  pageTransitionDurationMs: value,
                }));
              }}
              onChangeThemeColor={updateThemeColor}
            />
          ) : activeTab === 'dark' ? (
            <SiteSettingsDarkModeTab
              darkMode={darkMode}
              theme={theme}
              isValidHexColor={isValidHexColor}
              onChangeDarkMode={setDarkMode}
              onChangeDarkThemeColor={updateDarkThemeColor}
            />
          ) : activeTab === 'typography' ? (
            <SiteSettingsTypographyTab
              theme={theme}
              onChangeThemeFont={updateThemeFont}
              onChangeTypographyScale={(baseSize, ratio) => {
                setTheme((prev) => applyTypographyScaleToTheme({ ...prev, typographyScale: { baseSize, ratio } }));
              }}
              onChangeTextPreset={updateTextPreset}
            />
          ) : (
            <SiteSettingsPresetsTab
              theme={theme}
              customThemePresets={customThemePresets}
              pendingPreset={pendingPreset}
              onApplyComponentDesignPreset={handleComponentDesignPresetApply}
              onExportDesignTokens={exportDesignTokens}
              onImportDesignTokens={importDesignTokens}
              onApplyRadiusPreset={(presetKey, presetLabel) => {
                const nextTheme = applyThemeRadiusPreset(theme, presetKey);
                setTheme(nextTheme);
                setBrandKit(createBrandKitFromTheme(nextTheme, settings));
                setNotice(`${presetLabel} radius preset applied. 저장을 눌러 사이트에 반영하세요.`);
              }}
              onApplyShadowPreset={(presetKey, presetLabel) => {
                const nextTheme = applyThemeShadowPreset(theme, presetKey);
                setTheme(nextTheme);
                setBrandKit(createBrandKitFromTheme(nextTheme, settings));
                setNotice(`${presetLabel} shadow preset applied. 저장을 눌러 사이트에 반영하세요.`);
              }}
              onSaveCurrentThemePreset={saveCurrentThemePreset}
              onApplyCustomThemePreset={applyCustomThemePreset}
              onDeleteCustomThemePreset={deleteCustomThemePreset}
              onCancelPendingPreset={() => setPendingPreset(null)}
              onApplyPendingPreset={applyPreset}
              onSelectSiteThemePreset={setPendingPreset}
            />
          )}
        </div>
      </div>
    </ModalShell>
  );
}
