import {
  setLocalizedBuilderSiteSeoChecklistOverride,
  setLocalizedBuilderSiteSettingOverride,
} from '@/lib/builder/site/localized-settings';
import { sanitizeBrandSettings } from '@/lib/builder/site/theme';
import type {
  BrandKitAssets,
  BuilderSiteSettings,
} from '@/lib/builder/site/types';
import { locales, type Locale } from '@/lib/locales';

function sanitizeBrandKitAssets(assets?: BrandKitAssets): BrandKitAssets | undefined {
  if (!assets) return undefined;
  const nextAssets: BrandKitAssets = {};
  for (const key of ['logoLightAssetId', 'logoDarkAssetId', 'faviconAssetId', 'ogImageAssetId'] as const) {
    const value = assets[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      nextAssets[key] = value.trim();
    }
  }
  return Object.keys(nextAssets).length > 0 ? nextAssets : undefined;
}

function sanitizeSettings(settings?: BuilderSiteSettings): BuilderSiteSettings | undefined {
  if (!settings) return undefined;

  const nextSettings: BuilderSiteSettings = {};
  const stringKeys = [
    'favicon',
    'logo',
    'logoDark',
    'firmName',
    'phone',
    'email',
    'address',
    'businessHours',
    'businessRegNumber',
    'ogImage',
  ] as const;

  for (const key of stringKeys) {
    const value = settings[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      nextSettings[key] = value.trim();
    }
  }

  if (settings.seoChecklist) {
    const seoKeywords = (settings.seoChecklist.keywords ?? [])
      .map((keyword) => keyword.trim())
      .filter(Boolean)
      .slice(0, 5);
    nextSettings.seoChecklist = {
      ...(settings.seoChecklist.businessName?.trim()
        ? { businessName: settings.seoChecklist.businessName.trim() }
        : {}),
      ...(seoKeywords.length > 0
        ? { keywords: seoKeywords }
        : {}),
      ...(settings.seoChecklist.serviceMode ? { serviceMode: settings.seoChecklist.serviceMode } : {}),
    };
  }

  const assets = sanitizeBrandKitAssets(settings.assets);
  if (assets) {
    nextSettings.assets = assets;
  }
  const brand = sanitizeBrandSettings(settings.brand);
  if (brand) {
    nextSettings.brand = brand;
  }
  if (settings.pageTransition === 'none'
    || settings.pageTransition === 'fade'
    || settings.pageTransition === 'slide-up'
    || settings.pageTransition === 'slide-left'
    || settings.pageTransition === 'scale') {
    nextSettings.pageTransition = settings.pageTransition;
  }
  if (typeof settings.pageTransitionDurationMs === 'number' && Number.isFinite(settings.pageTransitionDurationMs)) {
    nextSettings.pageTransitionDurationMs = Math.max(80, Math.min(3000, Math.round(settings.pageTransitionDurationMs)));
  }
  return Object.keys(nextSettings).length > 0 ? nextSettings : undefined;
}

export function mergeSettings(
  current: BuilderSiteSettings | undefined,
  patch: BuilderSiteSettings,
): BuilderSiteSettings | undefined {
  const nextSettings: BuilderSiteSettings = { ...(current ?? {}) };
  const stringKeys = [
    'favicon',
    'logo',
    'logoDark',
    'firmName',
    'phone',
    'email',
    'address',
    'businessHours',
    'businessRegNumber',
    'ogImage',
  ] as const;

  for (const key of stringKeys) {
    if (!Object.prototype.hasOwnProperty.call(patch, key)) continue;
    const value = patch[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      nextSettings[key] = value.trim();
    } else {
      delete nextSettings[key];
    }
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'assets')) {
    const assets = sanitizeBrandKitAssets(patch.assets);
    if (assets) {
      nextSettings.assets = assets;
    } else {
      delete nextSettings.assets;
    }
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'brand')) {
    const brand = sanitizeBrandSettings(patch.brand);
    if (brand) {
      nextSettings.brand = brand;
    } else {
      delete nextSettings.brand;
    }
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'pageTransition')) {
    if (patch.pageTransition === 'none'
      || patch.pageTransition === 'fade'
      || patch.pageTransition === 'slide-up'
      || patch.pageTransition === 'slide-left'
      || patch.pageTransition === 'scale') {
      nextSettings.pageTransition = patch.pageTransition;
    } else {
      delete nextSettings.pageTransition;
    }
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'pageTransitionDurationMs')) {
    if (typeof patch.pageTransitionDurationMs === 'number' && Number.isFinite(patch.pageTransitionDurationMs)) {
      nextSettings.pageTransitionDurationMs = Math.max(80, Math.min(3000, Math.round(patch.pageTransitionDurationMs)));
    } else {
      delete nextSettings.pageTransitionDurationMs;
    }
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'localizedOverrides')) {
    const nextOverrides = { ...(nextSettings.localizedOverrides ?? {}) };
    const patchOverrides = patch.localizedOverrides ?? {};
    for (const locale of locales) {
      if (!Object.prototype.hasOwnProperty.call(patchOverrides, locale)) continue;
      const override = patchOverrides[locale];
      if (override && typeof override === 'object' && !Array.isArray(override)) {
        nextOverrides[locale] = override;
      } else {
        delete nextOverrides[locale];
      }
    }
    if (Object.keys(nextOverrides).length > 0) {
      nextSettings.localizedOverrides = nextOverrides;
    } else {
      delete nextSettings.localizedOverrides;
    }
  }

  return Object.keys(nextSettings).length > 0 ? nextSettings : undefined;
}

export function stripLocalizedSettingsPatch(patch?: BuilderSiteSettings): BuilderSiteSettings | undefined {
  if (!patch) return undefined;
  const nextSettings: BuilderSiteSettings = {};
  const stringKeys = ['favicon', 'logo', 'logoDark', 'ogImage'] as const;
  for (const key of stringKeys) {
    const value = patch[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      nextSettings[key] = value.trim();
    }
  }

  const assets = sanitizeBrandKitAssets(patch.assets);
  if (assets) {
    nextSettings.assets = assets;
  }

  const brand = sanitizeBrandSettings(patch.brand);
  if (brand) {
    nextSettings.brand = brand;
  }

  if (Object.prototype.hasOwnProperty.call(patch, 'seoChecklist')) {
    const sanitized = sanitizeSettings({ seoChecklist: patch.seoChecklist });
    if (sanitized?.seoChecklist && Object.keys(sanitized.seoChecklist).length > 0) {
      nextSettings.seoChecklist = sanitized.seoChecklist;
    }
  }

  if (patch.pageTransition === 'none'
    || patch.pageTransition === 'fade'
    || patch.pageTransition === 'slide-up'
    || patch.pageTransition === 'slide-left'
    || patch.pageTransition === 'scale') {
    nextSettings.pageTransition = patch.pageTransition;
  }

  if (typeof patch.pageTransitionDurationMs === 'number' && Number.isFinite(patch.pageTransitionDurationMs)) {
    nextSettings.pageTransitionDurationMs = Math.max(80, Math.min(3000, Math.round(patch.pageTransitionDurationMs)));
  }

  if (patch.seoDefaults) {
    const { patterns: _patterns, ...seoDefaultsRest } = patch.seoDefaults;
    if (Object.keys(seoDefaultsRest).length > 0) {
      nextSettings.seoDefaults = seoDefaultsRest;
    }
  }

  return Object.keys(nextSettings).length > 0 ? nextSettings : undefined;
}

export function applyLocalizedSettingsPatch(
  settings: BuilderSiteSettings,
  patch: BuilderSiteSettings,
  locale: Locale,
): boolean {
  let changed = false;
  for (const key of ['firmName', 'phone', 'email', 'address', 'businessHours', 'businessRegNumber'] as const) {
    if (!Object.prototype.hasOwnProperty.call(patch, key)) continue;
    const value = patch[key];
    const applied = setLocalizedBuilderSiteSettingOverride(settings, locale, `settings.${key}`, typeof value === 'string' ? value : '');
    changed = changed || applied;
  }
  if (Object.prototype.hasOwnProperty.call(patch, 'seoChecklist')) {
    changed = setLocalizedBuilderSiteSeoChecklistOverride(settings, locale, patch.seoChecklist) || changed;
  }
  const patterns = patch.seoDefaults?.patterns;
  if (patterns) {
    for (const key of [
      'titleTemplate',
      'descriptionTemplate',
      'ogTitleTemplate',
      'ogDescriptionTemplate',
      'twitterTitleTemplate',
      'twitterDescriptionTemplate',
    ] as const) {
      if (!Object.prototype.hasOwnProperty.call(patterns, key)) continue;
      const value = patterns[key];
      const applied = setLocalizedBuilderSiteSettingOverride(
        settings,
        locale,
        `settings.seoDefaults.patterns.${key}`,
        typeof value === 'string' ? value : '',
      );
      changed = changed || applied;
    }
  }
  return changed;
}
