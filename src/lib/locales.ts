export const locales = ['ko', 'zh-hant', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ko';

export function isLocale(value?: string): value is Locale {
  return value === 'ko' || value === 'zh-hant' || value === 'en';
}

export function normalizeLocale(value?: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}
