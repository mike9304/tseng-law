import type { SiteLocale } from '@/lib/locales';

/** Public static paths with approved Japanese legacy bodies (Phase 1). */
export const JA_FULL_STATIC_PATHS = new Set([
  '',
  'about',
  'services',
  'contact',
  'lawyers',
  'faq',
  'pricing',
  'reviews',
  'privacy',
  'disclaimer',
  'videos',
  'columns',
  'accessibility',
]);

/** Product surfaces not localized to JA in this phase. */
export const JA_UNSUPPORTED_PREFIXES = [
  'admin-builder',
  'admin-consultation',
  'account',
  'login',
  'bookings',
  'store',
  'portfolio',
  'events',
  'builder-fixtures',
] as const;

export const JA_SAFE_FALLBACK = '/ja/columns';

export function isJaFullStaticPath(slugPath: string): boolean {
  return JA_FULL_STATIC_PATHS.has(slugPath);
}

export function isJaUnsupportedPath(slugPath: string): boolean {
  const first = slugPath.split('/')[0] || '';
  return (JA_UNSUPPORTED_PREFIXES as readonly string[]).includes(first);
}

/**
 * Language switch target for a given path.
 * Columns preserve path; unsupported products fall back to JA columns.
 */
export function jaLanguageSwitchTarget(pathWithoutLocale: string): string {
  const clean = pathWithoutLocale.replace(/^\//, '') || '';
  if (clean === 'services/investment' || clean === 'services/civil') {
    return `/ja/${clean}`;
  }
  if (clean === 'columns' || clean.startsWith('columns/')) {
    return `/ja/${clean}`;
  }
  if (clean === 'lawyers/wei-tseng') {
    return '/ja/lawyers/wei-tseng';
  }
  if (isJaFullStaticPath(clean.split('/')[0] === clean ? clean : clean.split('/')[0] || '') && !clean.includes('/')) {
    return clean === '' ? '/ja' : `/ja/${clean}`;
  }
  // service/lawyer detail etc. — Phase 1 lands on list equivalents when available
  if (clean.startsWith('services')) return '/ja/services';
  if (clean.startsWith('lawyers')) return '/ja/lawyers';
  if (isJaUnsupportedPath(clean)) return JA_SAFE_FALLBACK;
  return JA_SAFE_FALLBACK;
}

export function publicLocalesForPath(_path: string): SiteLocale[] {
  return ['ko', 'zh-hant', 'en', 'ja'];
}
