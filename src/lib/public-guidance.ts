import { isEnglishNoindexPath } from '@/lib/seo-visibility';
import { jaLanguageSwitchTarget, restrictedPublicFamilyListPath } from '@/lib/public-route-policy';

/** Existing public four — comparison only; never widen `siteLocales`. */
export const EXISTING_SITE_LOCALES_4 = ['ko', 'zh-hant', 'en', 'ja'] as const;
export type ExistingSiteLocale4 = (typeof EXISTING_SITE_LOCALES_4)[number];

/** New guidance four. Independent of Locale / SiteLocale. Never normalized into KO. */
export const GUIDANCE_LOCALES_4 = ['vi', 'id', 'th', 'fil'] as const;
export type GuidanceLocale4 = (typeof GUIDANCE_LOCALES_4)[number];

/** Public eight-language surface. Do not fold this into `siteLocales`. */
export const PUBLIC_LOCALES_8 = [
  'ko',
  'zh-hant',
  'en',
  'ja',
  'vi',
  'id',
  'th',
  'fil',
] as const;
export type PublicLocale8 = (typeof PUBLIC_LOCALES_8)[number];

export const GUIDANCE_PAGE_KEYS = [
  'home',
  'services',
  'about',
  'lawyers',
  'pricing',
  'contact',
  'faq',
  'privacy',
  'disclaimer',
  'columns',
] as const;
export type GuidancePageKey = (typeof GUIDANCE_PAGE_KEYS)[number];

/** Exact core route keys. Home is the empty slug, never `home`. */
export const GUIDANCE_CORE_ROUTE_KEYS = [
  '',
  'services',
  'about',
  'lawyers',
  'pricing',
  'contact',
  'faq',
  'privacy',
  'disclaimer',
  'columns',
] as const;
export type GuidanceCoreRouteKey = (typeof GUIDANCE_CORE_ROUTE_KEYS)[number];

/**
 * Catch-all-only rewrite prefixes. Chosen so they cannot collide with
 * `[locale]/services`, `[locale]/columns`, `[locale]/store`, etc.
 */
export const PUBLIC_GUIDANCE_INTERNAL_PAGE_SEGMENT = '__public-guidance';
export const PUBLIC_GUIDANCE_INTERNAL_UNAVAILABLE_SEGMENT = '__public-guidance-unavailable';

export const PUBLIC_LANGUAGE_AUTONYMS: Record<PublicLocale8, string> = {
  ko: '한국어',
  'zh-hant': '繁體中文',
  en: 'English',
  ja: '日本語',
  vi: 'Tiếng Việt',
  id: 'Bahasa Indonesia',
  th: 'ไทย',
  fil: 'Filipino',
};

export type PublicDocumentLanguage =
  | 'ko'
  | 'zh-Hant'
  | 'en'
  | 'ja'
  | 'vi'
  | 'id'
  | 'th'
  | 'fil';

const DEFAULT_SITE_URL = 'https://tseng-law.com';
const PUBLIC_LOCALE_PATH_RE = /^\/(ko|zh-hant|en|ja|vi|id|th|fil)(?=\/|$)/i;
const PAGE_KEY_BY_ROUTE: Record<GuidanceCoreRouteKey, GuidancePageKey> = {
  '': 'home',
  services: 'services',
  about: 'about',
  lawyers: 'lawyers',
  pricing: 'pricing',
  contact: 'contact',
  faq: 'faq',
  privacy: 'privacy',
  disclaimer: 'disclaimer',
  columns: 'columns',
};

export function isGuidanceLocale4(value?: string | null): value is GuidanceLocale4 {
  return value === 'vi' || value === 'id' || value === 'th' || value === 'fil';
}

export function isPublicLocale8(value?: string | null): value is PublicLocale8 {
  return (
    value === 'ko'
    || value === 'zh-hant'
    || value === 'en'
    || value === 'ja'
    || isGuidanceLocale4(value)
  );
}

export function isExistingSiteLocale4(value?: string | null): value is ExistingSiteLocale4 {
  return value === 'ko' || value === 'zh-hant' || value === 'en' || value === 'ja';
}

export function publicDocumentLanguage(locale: PublicLocale8): PublicDocumentLanguage {
  return locale === 'zh-hant' ? 'zh-Hant' : locale;
}

export function resolvePublicDocumentLanguage(pathname: string | null | undefined): PublicDocumentLanguage {
  const locale = pathname?.split('/').filter(Boolean)[0]?.toLowerCase();
  if (isPublicLocale8(locale)) {
    return publicDocumentLanguage(locale);
  }
  return 'ko';
}

export function normalizePublicPathname(pathname: string): string {
  const noQuery = pathname.split('?')[0]?.split('#')[0] ?? pathname;
  if (!noQuery || noQuery === '/') return '/';
  const withLeading = noQuery.startsWith('/') ? noQuery : `/${noQuery}`;
  return withLeading.replace(/\/+$/, '') || '/';
}

export function parsePublicLocaleFromPathname(pathname: string): PublicLocale8 | null {
  const first = normalizePublicPathname(pathname).split('/').filter(Boolean)[0]?.toLowerCase();
  return isPublicLocale8(first) ? first : null;
}

export function stripPublicLocaleFromPath(pathname: string): string {
  return normalizePublicPathname(pathname).replace(PUBLIC_LOCALE_PATH_RE, '') || '/';
}

export function isGuidanceCoreSlugPath(slugPath: string): slugPath is GuidanceCoreRouteKey {
  return (GUIDANCE_CORE_ROUTE_KEYS as readonly string[]).includes(slugPath);
}

export function guidancePageKeyFromSlugPath(slugPath: string): GuidancePageKey | null {
  if (!isGuidanceCoreSlugPath(slugPath)) return null;
  return PAGE_KEY_BY_ROUTE[slugPath];
}

export function guidanceCorePath(pageKey: GuidancePageKey): string {
  return pageKey === 'home' ? '' : `/${pageKey}`;
}

export function guidancePublicPath(locale: PublicLocale8, pageKey: GuidancePageKey): string {
  return pageKey === 'home' ? `/${locale}` : `/${locale}/${pageKey}`;
}

export function visiblePublicPathname(pathname: string): string {
  const normalized = normalizePublicPathname(pathname);
  const locale = parsePublicLocaleFromPathname(normalized);
  if (!locale) return normalized;

  let rest = stripPublicLocaleFromPath(normalized);
  rest = rest.replace(
    new RegExp(
      `^/(?:${PUBLIC_GUIDANCE_INTERNAL_PAGE_SEGMENT}|${PUBLIC_GUIDANCE_INTERNAL_UNAVAILABLE_SEGMENT})(?=/|$)`,
    ),
    '',
  ) || '/';

  return rest === '/' ? `/${locale}` : `/${locale}${rest}`;
}

export type GuidanceSlugClassification =
  | { kind: 'page'; pageKey: GuidancePageKey }
  | { kind: 'unavailable' };

export function classifyGuidanceSlug(slug?: string[] | null): GuidanceSlugClassification {
  const segments = slug?.filter(Boolean) ?? [];
  if (segments[0] === PUBLIC_GUIDANCE_INTERNAL_UNAVAILABLE_SEGMENT) {
    return { kind: 'unavailable' };
  }

  const rest = segments[0] === PUBLIC_GUIDANCE_INTERNAL_PAGE_SEGMENT
    ? segments.slice(1)
    : segments;
  const pageKey = guidancePageKeyFromSlugPath(rest.join('/'));
  if (!pageKey) return { kind: 'unavailable' };
  return { kind: 'page', pageKey };
}

export type GuidanceMiddlewareRewrite = {
  readonly allowed: boolean;
  readonly internalPath: string;
};

export function resolveGuidanceMiddlewareRewrite(pathname: string): GuidanceMiddlewareRewrite | null {
  const normalized = normalizePublicPathname(pathname);
  const locale = parsePublicLocaleFromPathname(normalized);
  if (!locale || !isGuidanceLocale4(locale)) return null;

  const rest = stripPublicLocaleFromPath(normalized);
  const slugPath = rest === '/' ? '' : rest.replace(/^\//, '');
  const first = slugPath.split('/')[0] ?? '';

  if (
    first === PUBLIC_GUIDANCE_INTERNAL_PAGE_SEGMENT
    || first === PUBLIC_GUIDANCE_INTERNAL_UNAVAILABLE_SEGMENT
  ) {
    return null;
  }

  // File routes own `/columns` and `/columns/[slug]` so translations can
  // render (or 404) without the catch-all folding unknown locales into KO.
  const firstSegment = slugPath.split('/')[0] ?? '';
  if (firstSegment === 'columns') {
    return null;
  }

  if (isGuidanceCoreSlugPath(slugPath)) {
    const internalRest = slugPath ? `/${slugPath}` : '';
    return {
      allowed: true,
      internalPath: `/${locale}/${PUBLIC_GUIDANCE_INTERNAL_PAGE_SEGMENT}${internalRest}`,
    };
  }

  const unavailableRest = slugPath ? `/${slugPath}` : '';
  return {
    allowed: false,
    internalPath: `/${locale}/${PUBLIC_GUIDANCE_INTERNAL_UNAVAILABLE_SEGMENT}${unavailableRest}`,
  };
}

export type PublicLanguageSwitchTarget =
  | { status: 'available'; href: string }
  | { status: 'unavailable' };

export function resolvePublicLanguageSwitchTarget(
  pathname: string,
  targetLocale: PublicLocale8,
): PublicLanguageSwitchTarget {
  const visible = visiblePublicPathname(pathname);
  const currentLocale = parsePublicLocaleFromPathname(visible);
  const pathWithoutLocale = stripPublicLocaleFromPath(visible);
  const slugPath = pathWithoutLocale === '/' ? '' : pathWithoutLocale.replace(/^\//, '');

  if (currentLocale === targetLocale) {
    return { status: 'available', href: visible || `/${targetLocale}` };
  }

  if (isGuidanceLocale4(targetLocale)) {
    const pageKey = guidancePageKeyFromSlugPath(slugPath);
    if (!pageKey) return { status: 'unavailable' };
    return { status: 'available', href: guidancePublicPath(targetLocale, pageKey) };
  }

  if (targetLocale === 'ja') {
    return { status: 'available', href: jaLanguageSwitchTarget(pathWithoutLocale) };
  }

  const familyList = restrictedPublicFamilyListPath(pathWithoutLocale);
  if (familyList) {
    return { status: 'available', href: `/${targetLocale}${familyList}` };
  }

  const suffix = slugPath ? `/${slugPath}` : '';
  return { status: 'available', href: `/${targetLocale}${suffix}` };
}

export function hreflangTagForPublicLocale(locale: PublicLocale8): string {
  return locale === 'zh-hant' ? 'zh-Hant' : locale;
}

export function buildGuidanceCoreLanguageAlternates(
  pageKey: GuidancePageKey,
  siteUrl: string = DEFAULT_SITE_URL,
): Record<string, string> {
  const path = guidanceCorePath(pageKey);
  const englishNoindex = isEnglishNoindexPath(path);
  const origin = siteUrl.replace(/\/+$/, '');
  const locales = englishNoindex
    ? PUBLIC_LOCALES_8.filter((locale) => locale !== 'en')
    : PUBLIC_LOCALES_8;

  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[hreflangTagForPublicLocale(locale)] = `${origin}${guidancePublicPath(locale, pageKey)}`;
  }

  const xDefaultLocale = englishNoindex ? 'ko' : 'en';
  languages['x-default'] = `${origin}${guidancePublicPath(xDefaultLocale, pageKey)}`;
  return languages;
}

export function guidanceCanonicalUrl(
  locale: PublicLocale8,
  pageKey: GuidancePageKey,
  siteUrl: string = DEFAULT_SITE_URL,
): string {
  return `${siteUrl.replace(/\/+$/, '')}${guidancePublicPath(locale, pageKey)}`;
}
