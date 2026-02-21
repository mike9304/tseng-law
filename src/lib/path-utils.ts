import type { Locale } from '@/lib/locales';

export function stripLocaleFromPath(pathname: string) {
  return pathname.replace(/^\/(ko|zh-hant|en)(?=\/|$)/, '') || '/';
}

export function buildLocalePath(pathname: string, locale: Locale) {
  const clean = stripLocaleFromPath(pathname);
  const suffix = clean === '/' ? '' : clean;
  return `/${locale}${suffix}`;
}
