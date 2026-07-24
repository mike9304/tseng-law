import type { Locale, SiteLocale } from '@/lib/locales';

export function stripLocaleFromPath(pathname: string) {
  return pathname.replace(/^\/(ko|zh-hant|en|ja)(?=\/|$)/, '') || '/';
}

export function buildLocalePath(pathname: string, locale: Locale | SiteLocale) {
  const clean = stripLocaleFromPath(pathname);
  const suffix = clean === '/' ? '' : clean;
  return `/${locale}${suffix}`;
}
