'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  type PageTransition,
} from '@/lib/builder/animations/presets';
import {
  DEFAULT_THEME,
  type BrandKitAssets,
  type BrandSettings,
  type BuilderHeaderFooterConfig,
  type BuilderMobileBottomBar,
  type BuilderSiteSettings,
  type BuilderTheme,
  type DarkModeConfig,
} from '@/lib/builder/site/types';
import {
  applyThemeSuggestionToTheme,
  type ThemeSuggestion,
} from '@/lib/builder/ai-generator/theme-suggestions';
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
  sanitizeBrandSettings,
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
import styles from './SiteSettingsModal.module.css';
import { getSiteSettingsCopy } from './site-settings-copy';

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
  brand?: BrandSettings;
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
    brand: sanitizeBrandSettings(settings?.brand),
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
    brand: sanitizeBrandSettings(settings.brand),
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

function readCustomThemePresets(defaultName: string): CustomThemePreset[] {
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
        name: source.name.trim() || defaultName,
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
  const normalizedLocale = normalizeLocale(locale);
  const copy = getSiteSettingsCopy(normalizedLocale);
  const customThemeDefaultName = copy.modal.myThemeName('');
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
      setNotice(copy.modal.componentPresetNoTargets(presetLabel));
      return;
    }
    setNotice(copy.modal.componentPresetApplied(
      presetLabel,
      result.changedNodeIds.length,
      result.counts.buttons,
      result.counts.cards,
      result.counts.formFields,
      result.counts.formSubmits,
    ));
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
        setError(data.error || copy.modal.loadError);
      }
    } catch {
      setError(copy.modal.loadError);
    } finally {
      setLoading(false);
    }
  }, [copy.modal.loadError, locale]);

  useEffect(() => {
    if (open) void fetchSettings();
  }, [open, fetchSettings]);

  useEffect(() => {
    if (open) setCustomThemePresets(readCustomThemePresets(customThemeDefaultName));
  }, [customThemeDefaultName, open]);

  const handleSave = async () => {
    for (const token of THEME_COLOR_TOKENS) {
      if (!isValidHexColor(theme.colors[token])) {
        setError(copy.modal.invalidThemeColor(copy.advanced.themeColorLabels[token]));
        return;
      }
    }
    const resolvedDarkColors = normalizeDarkColors(theme.colors, theme.darkColors);
    for (const token of THEME_COLOR_TOKENS) {
      if (!isValidHexColor(resolvedDarkColors[token])) {
        setError(copy.modal.invalidDarkColor(copy.advanced.themeColorLabels[token]));
        return;
      }
    }

    setSaving(true);
    setError(null);
    try {
      // The PUT schema accepts only the two mobile fields this modal owns.
      // headerCanvasId / footerCanvasId are server-managed and are preserved
      // by the server's merge — sending them back would be rejected as
      // unrecognized strict keys.
      const normalizedHeaderFooter = normalizeHeaderFooterMobileConfig(headerFooter);
      const payload = {
        settings: toSettingsPayload(settings),
        theme: {
          ...theme,
          darkColors: resolvedDarkColors,
        },
        darkMode,
        headerFooter: {
          mobileSticky: normalizedHeaderFooter.mobileSticky,
          mobileHamburger: normalizedHeaderFooter.mobileHamburger,
        },
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
        setError(data.error || copy.modal.saveError);
        return;
      }

      const savedSettings = data.settings ? { ...data.settings } : payload.settings;
      onSaved?.({
        settings: savedSettings,
        theme: data.theme ?? payload.theme,
        darkMode: normalizeDarkModeConfig(data.darkMode),
        headerFooter: data.headerFooter ?? payload.headerFooter,
        mobileBottomBar: data.mobileBottomBar ?? payload.mobileBottomBar,
      });
      onClose();
    } catch {
      setError(copy.modal.saveError);
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
    setNotice(copy.modal.presetApplied(preset.name));
  };

  const applyThemeSuggestion = (suggestion: ThemeSuggestion) => {
    const nextTheme = applyThemeSuggestionToTheme(theme, suggestion);
    setTheme(nextTheme);
    setBrandKit(createBrandKitFromTheme(nextTheme, settings));
    setNotice(copy.modal.presetApplied(`AI ${suggestion.vibe}`));
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
      brand: sanitizeBrandSettings({ customColors: kit.customColors }) ?? prev.brand,
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
    setNotice(copy.modal.brandKitExported);
  };

  const importBrandKit = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      const nextKit = normalizeBrandKit(parsed, brandKit);
      applyBrandKitToState(nextKit, copy.modal.brandKitImported);
      setError(null);
    } catch {
      setError(copy.modal.brandKitReadError);
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
    setNotice(copy.modal.tokenExported);
  };

  const importDesignTokens = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as unknown;
      const nextTheme = normalizeDesignTokenTheme(parsed, theme);
      setTheme(nextTheme);
      setBrandKit(createBrandKitFromTheme(nextTheme, settings));
      setNotice(copy.modal.tokenImported);
      setError(null);
    } catch {
      setError(copy.modal.tokenReadError);
    }
  };

  const saveCurrentThemePreset = () => {
    const name = copy.modal.myThemeName(settings.firmName);
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
    setNotice(copy.modal.themeSaved(name));
  };

  const applyCustomThemePreset = (preset: CustomThemePreset) => {
    const nextTheme = normalizeDesignTokenTheme({ theme: preset.theme }, theme);
    setTheme(nextTheme);
    setBrandKit(createBrandKitFromTheme(nextTheme, settings));
    setNotice(copy.modal.presetApplied(preset.name));
  };

  const deleteCustomThemePreset = (id: string) => {
    const nextPresets = customThemePresets.filter((preset) => preset.id !== id);
    writeCustomThemePresets(nextPresets);
    setCustomThemePresets(nextPresets);
    setNotice(copy.modal.themeDeleted);
  };

  const footerHint = error ? (
    <span className={styles.footerMessage} data-tone="error">{error}</span>
  ) : notice ? (
    <span className={styles.footerMessage} data-tone="success">{notice}</span>
  ) : null;
  const modalActions = [
    { label: copy.modal.cancel, variant: 'secondary' as const, onClick: onClose },
    {
      label: saving ? copy.modal.saving : copy.modal.save,
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
      title={copy.modal.title}
      subtitle={copy.modal.subtitle}
      size="xl"
      bodyFlush
      footerHint={footerHint}
      actions={modalActions}
    >
      <div className={styles.shell} data-site-settings-modal-shell="true">
        <nav
          aria-label={copy.modal.tabAria}
          className={styles.tabRail}
        >
          {([
            { key: 'general', label: copy.modal.tabs.general, icon: 'G' },
            { key: 'brand', label: copy.modal.tabs.brand, icon: 'B' },
            { key: 'typography', label: copy.modal.tabs.typography, icon: 'A' },
            { key: 'presets', label: copy.modal.tabs.presets, icon: 'P' },
            { key: 'dark', label: copy.modal.tabs.dark, icon: 'D' },
            { key: 'mobile', label: copy.modal.tabs.mobile, icon: 'M' },
            { key: 'advanced', label: copy.modal.tabs.advanced, icon: '#' },
          ] as Array<{ key: SiteSettingsTab; label: string; icon: string }>).map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                className={styles.tabButton}
                data-active={active ? 'true' : undefined}
                onClick={() => setActiveTab(tab.key)}
              >
                <span aria-hidden className={styles.tabIndicator} />
                <span aria-hidden className={styles.tabIcon}>{tab.icon}</span>
                <span className={styles.tabLabel}>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>
              {copy.modal.loading}
            </div>
          ) : activeTab === 'general' ? (
            <SiteSettingsGeneralTab settings={settings} onUpdateField={updateField} locale={normalizedLocale} />
          ) : activeTab === 'brand' ? (
            <BrandKitPanel
              value={brandKit}
              locale={normalizeLocale(locale)}
              onChange={setBrandKit}
              onApply={() => applyBrandKitToState(brandKit, copy.modal.brandKitApplied(copy.modal.tabs.brand))}
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
              locale={normalizedLocale}
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
              locale={normalizedLocale}
            />
          ) : activeTab === 'dark' ? (
            <SiteSettingsDarkModeTab
              darkMode={darkMode}
              theme={theme}
              isValidHexColor={isValidHexColor}
              onChangeDarkMode={setDarkMode}
              onChangeDarkThemeColor={updateDarkThemeColor}
              locale={normalizedLocale}
            />
          ) : activeTab === 'typography' ? (
            <SiteSettingsTypographyTab
              theme={theme}
              locale={normalizeLocale(locale)}
              onChangeThemeFont={updateThemeFont}
              onChangeTypographyScale={(baseSize, ratio) => {
                setTheme((prev) => applyTypographyScaleToTheme({ ...prev, typographyScale: { baseSize, ratio } }));
              }}
              onChangeTextPreset={updateTextPreset}
            />
          ) : (
            <SiteSettingsPresetsTab
              locale={normalizedLocale}
              theme={theme}
              customThemePresets={customThemePresets}
              pendingPreset={pendingPreset}
              onApplyComponentDesignPreset={handleComponentDesignPresetApply}
              onApplyThemeSuggestion={applyThemeSuggestion}
              onExportDesignTokens={exportDesignTokens}
              onImportDesignTokens={importDesignTokens}
              onApplyRadiusPreset={(presetKey, presetLabel) => {
                const nextTheme = applyThemeRadiusPreset(theme, presetKey);
                setTheme(nextTheme);
                setBrandKit(createBrandKitFromTheme(nextTheme, settings));
                setNotice(copy.modal.radiusApplied(presetLabel));
              }}
              onApplyShadowPreset={(presetKey, presetLabel) => {
                const nextTheme = applyThemeShadowPreset(theme, presetKey);
                setTheme(nextTheme);
                setBrandKit(createBrandKitFromTheme(nextTheme, settings));
                setNotice(copy.modal.shadowApplied(presetLabel));
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
