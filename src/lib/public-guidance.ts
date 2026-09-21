import { isEnglishNoindexPath } from '@/lib/seo-visibility';
import { jaLanguageSwitchTarget, restrictedPublicFamilyListPath } from '@/lib/public-route-policy';

/** Existing public four — comparison only; never widen `siteLocales`. */
export const EXISTING_SITE_LOCALES_4 = ['ko', 'zh-hant', 'en', 'ja'] as const;
export type ExistingSiteLocale4 = (typeof EXISTING_SITE_LOCALES_4)[number];

/**
 * Guidance-language surface. Independent of Locale / SiteLocale. Never
 * normalized into KO. The `_4` suffix is historical — the set grew past four
 * (Arabic, then German and Spanish, then French and Portuguese, then
 * Simplified Chinese, Malay, Russian and Turkish, then Italian, Dutch and
 * Polish, then Hindi, Swedish, Danish, Norwegian and Finnish) and the name
 * was kept so the flip touched the locale data instead of every import in the
 * repo.
 */
export const GUIDANCE_LOCALES_4 = [
  'vi',
  'id',
  'th',
  'fil',
  'ar',
  'de',
  'es',
  'fr',
  'pt',
  'zh-hans',
  'ms',
  'ru',
  'tr',
  'it',
  'nl',
  'pl',
  'hi',
  'sv',
  'da',
  'nb',
  'fi',
  'cs',
  'hu',
  'ro',
  'uk',
  'el',
  'he',
  'bn',
  'ur',
  'fa',
  'my',
  'ta',
  'ne',
  'km',
  'mn',
  'sk',
  'bg',
  'hr',
  'sr',
  'sl',
  'lt',
  'lv',
  'et',
  'ca',
  'is',
] as const;
export type GuidanceLocale4 = (typeof GUIDANCE_LOCALES_4)[number];

/**
 * Guidance locales whose page language overlaps a consultation language.
 * Only Simplified Chinese (`zh-hans`) sits in this set: 中文 is one of the
 * four attorney languages. Other guidance locales remain page languages only.
 */
export const GUIDANCE_CONSULTATION_LANGUAGE_LOCALES = ['zh-hans'] as const;
export type GuidanceConsultationLanguageLocale =
  (typeof GUIDANCE_CONSULTATION_LANGUAGE_LOCALES)[number];

/**
 * Public language surface. Do not fold this into `siteLocales`. The `_8`
 * suffix is historical (see {@link GUIDANCE_LOCALES_4}); the set is
 * twenty-five since Hindi, Swedish, Danish, Norwegian and Finnish joined the
 * guidance tier after Italian, Dutch and Polish.
 */
export const PUBLIC_LOCALES_8 = [
  'ko',
  'zh-hant',
  'en',
  'ja',
  'vi',
  'id',
  'th',
  'fil',
  'ar',
  'de',
  'es',
  'fr',
  'pt',
  'zh-hans',
  'ms',
  'ru',
  'tr',
  'it',
  'nl',
  'pl',
  'hi',
  'sv',
  'da',
  'nb',
  'fi',
  'cs',
  'hu',
  'ro',
  'uk',
  'el',
  'he',
  'bn',
  'ur',
  'fa',
  'my',
  'ta',
  'ne',
  'km',
  'mn',
  'sk',
  'bg',
  'hr',
  'sr',
  'sl',
  'lt',
  'lv',
  'et',
  'ca',
  'is',
] as const;
export type PublicLocale8 = (typeof PUBLIC_LOCALES_8)[number];

/**
 * Routing tier for locales that are *registered* before their content pack
 * exists. `ar` (Arabic, right-to-left) used to live here while every
 * `Record<PublicLocale8, …>` content map stayed typed on the eight shipped
 * languages. WO-M3B landed the Arabic pack and moved `ar` into
 * `PUBLIC_LOCALES_8`/`GUIDANCE_LOCALES_4`, so the tier is empty again: the
 * routed set and the public set are now the same set. The names are kept so a
 * future language can be routed before its content lands without re-deriving
 * the predicates.
 */
export const ROUTED_ONLY_LOCALES = [] as const;
export type RoutedOnlyLocale = (typeof ROUTED_ONLY_LOCALES)[number];
export const ROUTED_PUBLIC_LOCALES = [...PUBLIC_LOCALES_8, ...ROUTED_ONLY_LOCALES] as const;
export type RoutedPublicLocale = (typeof ROUTED_PUBLIC_LOCALES)[number];

/** Right-to-left public languages. Drives `<html dir>` and RTL CSS. */
/** Right-to-left scripts: Arabic and Hebrew. The `html[dir='rtl']` rules in
 * `globals.css` were written for Arabic but are script-agnostic, so Hebrew
 * needs no new CSS — only this registry entry and the document-language check. */
export const RTL_PUBLIC_LOCALES = ['ar', 'he', 'ur', 'fa'] as const;

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
  ar: 'العربية',
  de: 'Deutsch',
  es: 'Español',
  fr: 'Français',
  pt: 'Português',
  'zh-hans': '简体中文',
  ms: 'Bahasa Melayu',
  ru: 'Русский',
  tr: 'Türkçe',
  it: 'Italiano',
  nl: 'Nederlands',
  pl: 'Polski',
  hi: 'हिन्दी',
  sv: 'Svenska',
  da: 'Dansk',
  nb: 'Norsk',
  fi: 'Suomi',
  cs: 'Čeština',
  hu: 'Magyar',
  ro: 'Română',
  uk: 'Українська',
  el: 'Ελληνικά',
  he: 'עברית',
  bn: 'বাংলা',
  ur: 'اردو',
  fa: 'فارسی',
  my: 'မြန်မာ',
  ta: 'தமிழ்',
  ne: 'नेपाली',
  km: 'ខ្មែរ',
  mn: 'Монгол',
  sk: 'Slovenčina',
  bg: 'Български',
  hr: 'Hrvatski',
  sr: 'Srpski',
  sl: 'Slovenščina',
  lt: 'Lietuvių',
  lv: 'Latviešu',
  et: 'Eesti',
  ca: 'Català',
  is: 'Íslenska',
};

export type PublicDocumentLanguage =
  | 'ko'
  | 'zh-Hant'
  | 'en'
  | 'ja'
  | 'vi'
  | 'id'
  | 'th'
  | 'fil'
  | 'ar'
  | 'de'
  | 'es'
  | 'fr'
  | 'pt'
  | 'zh-Hans'
  | 'ms'
  | 'ru'
  | 'tr'
  | 'it'
  | 'nl'
  | 'pl'
  | 'hi'
  | 'sv'
  | 'da'
  | 'nb'
  | 'fi'
  | 'cs'
  | 'hu'
  | 'ro'
  | 'uk'
  | 'el'
  | 'he'
  | 'bn'
  | 'ur'
  | 'fa'
  | 'my'
  | 'ta'
  | 'ne'
  | 'km'
  | 'mn'
  | 'sk'
  | 'bg'
  | 'hr'
  | 'sr'
  | 'sl'
  | 'lt'
  | 'lv'
  | 'et'
  | 'ca'
  | 'is';

const DEFAULT_SITE_URL = 'https://tseng-law.com';
const PUBLIC_LOCALE_PATH_RE = /^\/(ko|zh-hant|zh-hans|en|ja|vi|id|th|fil|ar|de|es|fr|pt|ms|ru|tr|it|nl|pl|hi|sv|da|nb|fi|cs|hu|ro|uk|el|he|bn|ur|fa|my|ta|ne|km|mn|sk|bg|hr|sr|sl|lt|lv|et|ca|is)(?=\/|$)/i;
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
  return (
    value === 'vi'
    || value === 'id'
    || value === 'th'
    || value === 'fil'
    || value === 'ar'
    || value === 'de'
    || value === 'es'
    || value === 'fr'
    || value === 'pt'
    || value === 'zh-hans'
    || value === 'ms'
    || value === 'ru'
    || value === 'tr'
    || value === 'it'
    || value === 'nl'
    || value === 'pl'
    || value === 'hi'
    || value === 'sv'
    || value === 'da'
    || value === 'nb'
    || value === 'fi'
    || value === 'cs'
    || value === 'hu'
    || value === 'ro'
    || value === 'uk'
    || value === 'el'
    || value === 'he'
    || value === 'bn'
    || value === 'ur'
    || value === 'fa'
    || value === 'my'
    || value === 'ta'
    || value === 'ne'
    || value === 'km'
    || value === 'mn'
    || value === 'sk'
    || value === 'bg'
    || value === 'hr'
    || value === 'sr'
    || value === 'sl'
    || value === 'lt'
    || value === 'lv'
    || value === 'et'
    || value === 'ca'
    || value === 'is'
  );
}

export function isGuidanceConsultationLanguageLocale(
  value?: string | null,
): value is GuidanceConsultationLanguageLocale {
  return (GUIDANCE_CONSULTATION_LANGUAGE_LOCALES as readonly string[]).includes(value ?? '');
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

export function isRoutedOnlyLocale(value?: string | null): value is RoutedOnlyLocale {
  return (ROUTED_ONLY_LOCALES as readonly string[]).includes(value ?? '');
}

/** Every locale the middleware and root layout route, content pack or not. */
export function isRoutedPublicLocale(value?: string | null): value is RoutedPublicLocale {
  return isPublicLocale8(value) || isRoutedOnlyLocale(value);
}

/** Guidance-shaped routing (rewrite onto the guidance catch-all) for the four plus `ar`. */
export function isGuidanceRoutedLocale(value?: string | null): value is GuidanceLocale4 | RoutedOnlyLocale {
  return isGuidanceLocale4(value) || isRoutedOnlyLocale(value);
}

export function isRtlPublicLocale(value?: string | null): boolean {
  return (RTL_PUBLIC_LOCALES as readonly string[]).includes(value ?? '');
}

export function isRtlDocumentLanguage(language: PublicDocumentLanguage): boolean {
  return language === 'ar' || language === 'he' || language === 'ur' || language === 'fa';
}

export function isExistingSiteLocale4(value?: string | null): value is ExistingSiteLocale4 {
  return value === 'ko' || value === 'zh-hant' || value === 'en' || value === 'ja';
}

export function publicDocumentLanguage(locale: RoutedPublicLocale): PublicDocumentLanguage {
  if (locale === 'zh-hant') return 'zh-Hant';
  if (locale === 'zh-hans') return 'zh-Hans';
  return locale;
}

export function resolvePublicDocumentLanguage(pathname: string | null | undefined): PublicDocumentLanguage {
  const locale = pathname?.split('/').filter(Boolean)[0]?.toLowerCase();
  if (isRoutedPublicLocale(locale)) {
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

/** Like {@link parsePublicLocaleFromPathname} but also recognises routed-only locales. */
export function parseRoutedLocaleFromPathname(pathname: string): RoutedPublicLocale | null {
  const first = normalizePublicPathname(pathname).split('/').filter(Boolean)[0]?.toLowerCase();
  return isRoutedPublicLocale(first) ? first : null;
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

/**
 * Machine-readable files that must reach their own route handler untouched.
 * Only `llms.txt` for now: every other dotted path keeps the unavailable
 * guard, so this list is deliberately not a generic "has a dot" rule.
 */
const GUIDANCE_PASSTHROUGH_FILES: readonly string[] = ['llms.txt'];

export function resolveGuidanceMiddlewareRewrite(pathname: string): GuidanceMiddlewareRewrite | null {
  const normalized = normalizePublicPathname(pathname);
  const locale = parseRoutedLocaleFromPathname(normalized);
  if (!locale || !isGuidanceRoutedLocale(locale)) return null;

  const rest = stripPublicLocaleFromPath(normalized);
  const slugPath = rest === '/' ? '' : rest.replace(/^\//, '');
  const first = slugPath.split('/')[0] ?? '';

  if (
    first === PUBLIC_GUIDANCE_INTERNAL_PAGE_SEGMENT
    || first === PUBLIC_GUIDANCE_INTERNAL_UNAVAILABLE_SEGMENT
  ) {
    return null;
  }

  // `/{vi|id|th|fil}/llms.txt` is served by its own route handler. Rewriting it
  // onto the guidance catch-all would replace the manifest with the
  // "unavailable" page, so keep the original path and let it through.
  const slugSegments = slugPath.split('/');
  const lastSegment = slugSegments[slugSegments.length - 1] ?? '';
  if (GUIDANCE_PASSTHROUGH_FILES.includes(lastSegment)) {
    return { allowed: true, internalPath: normalized };
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

/**
 * WO-O22 A: the switcher must offer all eight languages on every public page
 * and must never link to a 404. When the exact page does not exist in the
 * target language we degrade to the nearest page that does, and say so:
 *
 *   `exact`        — the same page in the target language
 *   `columns-list` — the target language's `/columns` index
 *   `home`         — the target language's home page
 */
export type PublicLanguageSwitchFallback = 'exact' | 'columns-list' | 'home';

export type PublicLanguageSwitchTarget = {
  status: 'available';
  href: string;
  fallback: PublicLanguageSwitchFallback;
};

export type PublicLanguageSwitchOptions = {
  /**
   * Column slugs that actually have a markdown file in the target language.
   * Injected by the caller (the public layout reads them off disk) so this
   * module stays pure and client-safe. When it is omitted the resolver refuses
   * to guess an article URL and lands on the target language's column index
   * instead — a real page, never a 404.
   */
  readonly columnSlugsByLocale?: Partial<
    Record<PublicLocale8, readonly string[] | ReadonlySet<string>>
  >;
};

function hasKnownColumnSlug(
  options: PublicLanguageSwitchOptions | undefined,
  targetLocale: PublicLocale8,
  slug: string,
): boolean {
  const known = options?.columnSlugsByLocale?.[targetLocale];
  if (!known) return false;
  return known instanceof Set ? known.has(slug) : (known as readonly string[]).includes(slug);
}

/** `columns/<slug>` → `<slug>`; anything deeper or shorter → null. */
function columnDetailSlug(slugPath: string): string | null {
  const segments = slugPath.split('/');
  if (segments.length !== 2 || segments[0] !== 'columns' || !segments[1]) return null;
  return segments[1];
}

export function resolvePublicLanguageSwitchTarget(
  pathname: string,
  targetLocale: PublicLocale8,
  options?: PublicLanguageSwitchOptions,
): PublicLanguageSwitchTarget {
  const visible = visiblePublicPathname(pathname);
  const currentLocale = parsePublicLocaleFromPathname(visible);
  const pathWithoutLocale = stripPublicLocaleFromPath(visible);
  const slugPath = pathWithoutLocale === '/' ? '' : pathWithoutLocale.replace(/^\//, '');

  if (currentLocale === targetLocale) {
    return { status: 'available', href: visible || `/${targetLocale}`, fallback: 'exact' };
  }

  if (isGuidanceLocale4(targetLocale)) {
    const pageKey = guidancePageKeyFromSlugPath(slugPath);
    if (pageKey) {
      return {
        status: 'available',
        href: guidancePublicPath(targetLocale, pageKey),
        fallback: 'exact',
      };
    }

    const columnSlug = columnDetailSlug(slugPath);
    if (columnSlug && hasKnownColumnSlug(options, targetLocale, columnSlug)) {
      return {
        status: 'available',
        href: `/${targetLocale}/columns/${columnSlug}`,
        fallback: 'exact',
      };
    }
    if (slugPath === 'columns' || slugPath.startsWith('columns/')) {
      return {
        status: 'available',
        href: guidancePublicPath(targetLocale, 'columns'),
        fallback: 'columns-list',
      };
    }

    return {
      status: 'available',
      href: guidancePublicPath(targetLocale, 'home'),
      fallback: 'home',
    };
  }

  // The existing four keep the behaviour they already shipped: their targets are
  // resolved by `public-route-policy` and are labelled `exact` so the switcher
  // markup for ko/zh-hant/en/ja is unchanged.
  if (targetLocale === 'ja') {
    return { status: 'available', href: jaLanguageSwitchTarget(pathWithoutLocale), fallback: 'exact' };
  }

  const familyList = restrictedPublicFamilyListPath(pathWithoutLocale);
  if (familyList) {
    return { status: 'available', href: `/${targetLocale}${familyList}`, fallback: 'exact' };
  }

  const suffix = slugPath ? `/${slugPath}` : '';
  return { status: 'available', href: `/${targetLocale}${suffix}`, fallback: 'exact' };
}

export function hreflangTagForPublicLocale(locale: PublicLocale8): string {
  if (locale === 'zh-hant') return 'zh-Hant';
  if (locale === 'zh-hans') return 'zh-Hans';
  return locale;
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
