import type { Locale } from '@/lib/locales';
import type {
  BuilderLocalizedSiteSettingsOverride,
  BuilderSeoChecklistSettings,
  BuilderSeoPatternSettings,
  BuilderSiteSettings,
} from './types';

const LOCALIZED_TEXT_FIELDS = new Set([
  'firmName',
  'phone',
  'email',
  'address',
  'businessHours',
  'businessRegNumber',
]);

function cloneChecklist(
  checklist: BuilderSeoChecklistSettings | undefined,
): BuilderSeoChecklistSettings | undefined {
  if (!checklist) return undefined;
  return {
    ...(checklist.businessName?.trim()
      ? { businessName: checklist.businessName.trim() }
      : {}),
    ...(Array.isArray(checklist.keywords)
      ? { keywords: checklist.keywords.map((keyword) => keyword.trim()).filter(Boolean) }
      : {}),
    ...(checklist.serviceMode
      ? { serviceMode: checklist.serviceMode }
      : {}),
  };
}

function cloneOverride(
  override: BuilderLocalizedSiteSettingsOverride | undefined,
): BuilderLocalizedSiteSettingsOverride {
  if (!override) return {};
  return {
    ...override,
    ...(override.seoChecklist ? { seoChecklist: cloneChecklist(override.seoChecklist) } : {}),
    ...(override.seoDefaults?.patterns
      ? {
          seoDefaults: {
            ...(override.seoDefaults ?? {}),
            patterns: { ...(override.seoDefaults.patterns ?? {}) },
          },
        }
      : override.seoDefaults
        ? { seoDefaults: { ...override.seoDefaults } }
        : {}),
  };
}

function isEmptyOverride(override: BuilderLocalizedSiteSettingsOverride): boolean {
  const hasTextField = Object.keys(override).some((key) => key !== 'seoDefaults' && key !== 'seoChecklist');
  if (hasTextField) return false;
  const checklist = override.seoChecklist;
  if (checklist) {
    const hasChecklistValue = Boolean(checklist.businessName?.trim())
      || Boolean(checklist.keywords?.some((keyword) => keyword.trim()))
      || Boolean(checklist.serviceMode);
    if (hasChecklistValue) return false;
  }
  const patterns = override.seoDefaults?.patterns ?? {};
  return Object.keys(patterns).length === 0;
}

function mergeSeoDefaults(
  base: BuilderSiteSettings['seoDefaults'],
  override: BuilderLocalizedSiteSettingsOverride['seoDefaults'],
): BuilderSiteSettings['seoDefaults'] {
  if (!base && !override) return undefined;
  return {
    ...(base ?? {}),
    ...(override ?? {}),
    patterns: {
      ...(base?.patterns ?? {}),
      ...(override?.patterns ?? {}),
    },
  };
}

function mergeSeoChecklist(
  base: BuilderSeoChecklistSettings | undefined,
  override: BuilderSeoChecklistSettings | undefined,
): BuilderSeoChecklistSettings | undefined {
  if (!base && !override) return undefined;
  return {
    ...(base ?? {}),
    ...(override ?? {}),
    ...(override?.keywords
      ? { keywords: override.keywords.map((keyword) => keyword.trim()).filter(Boolean) }
      : {}),
  };
}

export function resolveBuilderSiteSettings(
  settings: BuilderSiteSettings | undefined,
  locale: Locale,
): BuilderSiteSettings | undefined {
  if (!settings) return undefined;
  const override = settings.localizedOverrides?.[locale];
  if (!override) return settings;

  const next: BuilderSiteSettings = {
    ...settings,
    seoDefaults: mergeSeoDefaults(settings.seoDefaults, override.seoDefaults),
    seoChecklist: mergeSeoChecklist(settings.seoChecklist, override.seoChecklist),
  };

  for (const key of LOCALIZED_TEXT_FIELDS) {
    const value = override[key as keyof BuilderLocalizedSiteSettingsOverride];
    if (typeof value === 'string' && value.trim().length > 0) {
      const cleaned = value.trim();
      switch (key) {
        case 'firmName':
          next.firmName = cleaned;
          break;
        case 'phone':
          next.phone = cleaned;
          break;
        case 'email':
          next.email = cleaned;
          break;
        case 'address':
          next.address = cleaned;
          break;
        case 'businessHours':
          next.businessHours = cleaned;
          break;
        case 'businessRegNumber':
          next.businessRegNumber = cleaned;
          break;
        default:
          break;
      }
    }
  }

  return next;
}

export function setLocalizedBuilderSiteSeoChecklistOverride(
  settings: BuilderSiteSettings,
  locale: Locale,
  checklist: BuilderSeoChecklistSettings | undefined,
): boolean {
  const currentOverrides = settings.localizedOverrides ?? {};
  const current = cloneOverride(currentOverrides[locale]);
  const nextChecklist = cloneChecklist(checklist);
  const normalized = nextChecklist && (
    nextChecklist.businessName?.trim()
    || nextChecklist.keywords?.length
    || nextChecklist.serviceMode
  )
    ? nextChecklist
    : undefined;

  const currentSerialized = JSON.stringify(current.seoChecklist ?? null);
  const nextSerialized = JSON.stringify(normalized ?? null);
  if (currentSerialized === nextSerialized) return false;

  if (normalized) {
    current.seoChecklist = normalized;
  } else {
    delete current.seoChecklist;
  }

  const nextOverrides = { ...currentOverrides };
  if (isEmptyOverride(current)) {
    delete nextOverrides[locale];
  } else {
    nextOverrides[locale] = current;
  }
  if (Object.keys(nextOverrides).length > 0) {
    settings.localizedOverrides = nextOverrides;
  } else {
    delete settings.localizedOverrides;
  }
  return true;
}

export function setLocalizedBuilderSiteSettingOverride(
  settings: BuilderSiteSettings,
  locale: Locale,
  contentPath: string,
  text: string,
): boolean {
  const path = contentPath.startsWith('settings.')
    ? contentPath.slice('settings.'.length)
    : contentPath;
  const trimmed = text.trim();
  const currentOverrides = settings.localizedOverrides ?? {};
  const current = cloneOverride(currentOverrides[locale]);
  let changed = false;

  const setTextField = (key: keyof BuilderLocalizedSiteSettingsOverride) => {
    if (trimmed) {
      if (current[key] !== trimmed) {
        current[key] = trimmed;
        changed = true;
      }
      return true;
    }
    if (key in current) {
      delete current[key];
      changed = true;
    }
    return true;
  };

  if (LOCALIZED_TEXT_FIELDS.has(path)) {
    setTextField(path as keyof BuilderLocalizedSiteSettingsOverride);
  } else if (path.startsWith('seoDefaults.patterns.')) {
    const patternKey = path.slice('seoDefaults.patterns.'.length) as keyof BuilderSeoPatternSettings;
    if (!patternKey) return false;
    current.seoDefaults = {
      ...(current.seoDefaults ?? {}),
      patterns: {
        ...(current.seoDefaults?.patterns ?? {}),
      },
    };
    const patterns = current.seoDefaults.patterns ?? {};
    if (trimmed) {
      if (patterns[patternKey] !== trimmed) {
        patterns[patternKey] = trimmed;
        changed = true;
      }
    } else if (patternKey in patterns) {
      delete patterns[patternKey];
      changed = true;
    }
    current.seoDefaults.patterns = patterns;
    if (Object.keys(patterns).length === 0) {
      delete current.seoDefaults.patterns;
      if (Object.keys(current.seoDefaults).length === 0) {
        delete current.seoDefaults;
      }
    }
  } else {
    return false;
  }

  if (!changed) return false;
  const nextOverrides = { ...currentOverrides };
  if (isEmptyOverride(current)) {
    delete nextOverrides[locale];
  } else {
    nextOverrides[locale] = current;
  }
  if (Object.keys(nextOverrides).length > 0) {
    settings.localizedOverrides = nextOverrides;
  } else {
    delete settings.localizedOverrides;
  }
  return true;
}
