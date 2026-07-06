import type { Locale } from '@/lib/locales';

export function localizedMarketingApiPath(locale: Locale, path: string): string {
  if (locale === 'ko') return path;
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}locale=${locale}`;
}
