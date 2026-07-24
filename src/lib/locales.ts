/** Builder/admin authoring locales (do not widen without full builder i18n). */
export const locales = ['ko', 'zh-hant', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ko';

/** Public site locales including Japanese column surface. */
export const siteLocales = ['ko', 'zh-hant', 'en', 'ja'] as const;
export type SiteLocale = (typeof siteLocales)[number];
export const defaultSiteLocale: SiteLocale = 'ko';

export function isLocale(value?: string): value is Locale {
  return value === 'ko' || value === 'zh-hant' || value === 'en';
}

export function normalizeLocale(value?: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function isSiteLocale(value?: string): value is SiteLocale {
  return value === 'ko' || value === 'zh-hant' || value === 'en' || value === 'ja';
}

export function normalizeSiteLocale(value?: string): SiteLocale {
  return isSiteLocale(value) ? value : defaultSiteLocale;
}

/** Map public site locale to the closest builder/admin Locale. */
export function toBuilderLocale(locale: SiteLocale): Locale {
  return locale === 'ja' ? 'en' : locale;
}
