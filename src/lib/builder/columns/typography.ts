import type { Locale } from '@/lib/locales';
import {
  columnTypographyPresetIdSchema,
  type ColumnTypography,
  type ColumnTypographyPresetId,
} from '@/lib/builder/columns/types';

export type ColumnTypographyRole = 'body-sans' | 'body-readable' | 'display-serif' | 'compact';

export interface ResolvedColumnTypography {
  presetId: ColumnTypographyPresetId;
  className: string;
  bodySize: 'sm' | 'md' | 'lg';
  headingWeight: '500' | '600' | '700';
  lineHeight: 'tight' | 'normal' | 'relaxed';
  role: ColumnTypographyRole;
  locale: Locale;
  familyToken: '--font-body' | '--font-body-zh';
  headingToken: '--font-heading-ko' | '--font-heading-zh' | '--font-heading-en';
  /** Inline CSS custom properties for size/leading/weight overrides. */
  cssVars: Record<string, string>;
}

const ROLE_DEFAULTS: Record<
  ColumnTypographyRole,
  { bodySize: 'sm' | 'md' | 'lg'; headingWeight: '500' | '600' | '700'; lineHeight: 'tight' | 'normal' | 'relaxed' }
> = {
  'body-sans': { bodySize: 'md', headingWeight: '600', lineHeight: 'normal' },
  'body-readable': { bodySize: 'lg', headingWeight: '600', lineHeight: 'relaxed' },
  'display-serif': { bodySize: 'md', headingWeight: '700', lineHeight: 'normal' },
  compact: { bodySize: 'sm', headingWeight: '600', lineHeight: 'tight' },
};

const SIZE_REM: Record<'sm' | 'md' | 'lg', string> = {
  sm: '1rem',
  md: '1.0625rem',
  lg: '1.125rem',
};

const LEADING: Record<Locale, Record<'tight' | 'normal' | 'relaxed', string>> = {
  ko: { tight: '1.65', normal: '1.75', relaxed: '1.85' },
  'zh-hant': { tight: '1.7', normal: '1.8', relaxed: '1.9' },
  en: { tight: '1.6', normal: '1.7', relaxed: '1.8' },
};

const LOCALE_DEFAULT_PRESET: Record<Locale, ColumnTypographyPresetId> = {
  ko: 'ko-body-sans',
  'zh-hant': 'zh-body-sans',
  en: 'en-body-sans',
};

const PRESET_ROLE: Record<ColumnTypographyPresetId, ColumnTypographyRole> = {
  'ko-body-sans': 'body-sans',
  'ko-body-readable': 'body-readable',
  'ko-display-serif': 'display-serif',
  'ko-compact': 'compact',
  'zh-body-sans': 'body-sans',
  'zh-body-readable': 'body-readable',
  'zh-display-serif': 'display-serif',
  'zh-compact': 'compact',
  'en-body-sans': 'body-sans',
  'en-body-readable': 'body-readable',
  'en-display-serif': 'display-serif',
  'en-compact': 'compact',
};

const PRESET_LOCALE: Record<ColumnTypographyPresetId, Locale> = {
  'ko-body-sans': 'ko',
  'ko-body-readable': 'ko',
  'ko-display-serif': 'ko',
  'ko-compact': 'ko',
  'zh-body-sans': 'zh-hant',
  'zh-body-readable': 'zh-hant',
  'zh-display-serif': 'zh-hant',
  'zh-compact': 'zh-hant',
  'en-body-sans': 'en',
  'en-body-readable': 'en',
  'en-display-serif': 'en',
  'en-compact': 'en',
};

export function defaultTypographyForLocale(locale: Locale): ColumnTypography {
  return { presetId: LOCALE_DEFAULT_PRESET[locale] };
}

export function listTypographyPresetsForLocale(locale: Locale): ColumnTypographyPresetId[] {
  const prefix = locale === 'zh-hant' ? 'zh-' : `${locale}-`;
  return columnTypographyPresetIdSchema.options.filter((id) => id.startsWith(prefix));
}

export function presetMatchesLocale(presetId: ColumnTypographyPresetId, locale: Locale): boolean {
  return PRESET_LOCALE[presetId] === locale;
}

export function coercePresetForLocale(
  presetId: string | undefined | null,
  locale: Locale,
): ColumnTypographyPresetId {
  const parsed = columnTypographyPresetIdSchema.safeParse(presetId);
  if (parsed.success && presetMatchesLocale(parsed.data, locale)) {
    return parsed.data;
  }
  return LOCALE_DEFAULT_PRESET[locale];
}

export function columnTypographyClassName(presetId: ColumnTypographyPresetId): string {
  return `column-typo--${presetId}`;
}

function resolveFromParts(
  locale: Locale,
  typography?: ColumnTypography | null,
  presetId?: string | null,
): ResolvedColumnTypography {
  const resolvedPresetId = coercePresetForLocale(
    typography?.presetId ?? presetId,
    locale,
  );
  const role = PRESET_ROLE[resolvedPresetId];
  const defaults = ROLE_DEFAULTS[role];
  const bodySize = typography?.bodySize ?? defaults.bodySize;
  const headingWeight = typography?.headingWeight ?? defaults.headingWeight;
  const lineHeight = typography?.lineHeight ?? defaults.lineHeight;
  const familyToken = locale === 'zh-hant' ? '--font-body-zh' : '--font-body';
  const headingToken =
    locale === 'zh-hant'
      ? '--font-heading-zh'
      : locale === 'en'
        ? '--font-heading-en'
        : '--font-heading-ko';

  return {
    presetId: resolvedPresetId,
    className: columnTypographyClassName(resolvedPresetId),
    bodySize,
    headingWeight,
    lineHeight,
    role,
    locale,
    familyToken,
    headingToken,
    cssVars: {
      '--column-typo-size': SIZE_REM[bodySize],
      '--column-typo-leading': LEADING[locale][lineHeight],
      '--column-typo-heading-weight': headingWeight,
    },
  };
}

/**
 * Resolve document typography for a locale.
 * Supports `resolveTypography(locale, typography?)` and object form.
 * Invalid / wrong-locale presets coerce to the locale default without throwing.
 */
export function resolveTypography(
  localeOrInput:
    | Locale
    | {
        locale: Locale;
        typography?: ColumnTypography | null;
        presetId?: string | null;
      },
  typography?: ColumnTypography | null,
): ResolvedColumnTypography {
  if (typeof localeOrInput === 'string') {
    return resolveFromParts(localeOrInput, typography);
  }
  return resolveFromParts(
    localeOrInput.locale,
    localeOrInput.typography ?? typography,
    localeOrInput.presetId,
  );
}

/** Public/helper class builder used by pages and tests. */
export function publicColumnTypographyClassName(
  locale: Locale,
  typography?: ColumnTypography | null | { presetId?: string | null },
): string {
  return resolveTypography({
    locale,
    typography: typography as ColumnTypography | null | undefined,
    presetId: typography && 'presetId' in typography ? typography.presetId : undefined,
  }).className;
}
