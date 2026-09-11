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

/**
 * The original ten. This list stays exactly ten keys: the guidance nav, the
 * eight-language hreflang cluster and the translation-lane content module
 * (`international-guidance-content.ts`) are all keyed off it. Pages added
 * later go in {@link GUIDANCE_EXTRA_PAGE_KEYS}.
 */
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
export type GuidanceCorePageKey = (typeof GUIDANCE_PAGE_KEYS)[number];

/**
 * Guidance pages outside the original ten.
 *
 * Three rules hold for every key on this list:
 *   - its four bodies live in `src/data/international-guidance-extra.ts`,
 *     because the translation lane owns `international-guidance-content.ts`;
 *   - it never appears in the header nav or the footer columns, whose labels
 *     come from that same translation-lane module;
 *   - its hreflang cluster is the guidance four plus the ko/zh-hant/en/ja
 *     page named in {@link GUIDANCE_EXTRA_SITE_COUNTERPART_PATHS} — see
 *     {@link buildGuidanceCoreLanguageAlternates}.
 */
export const GUIDANCE_EXTRA_PAGE_KEYS = ['company-setup', 'debt-collection'] as const;
export type GuidanceExtraPageKey = (typeof GUIDANCE_EXTRA_PAGE_KEYS)[number];

/**
 * The ko/zh-hant/en/ja intent landing that answers the same question as each
 * guidance page outside the original ten. Paths are locale-less: prefix with
 * `/{siteLocale}`.
 *
 * WO-B2B-R1 §3. These pages have no `/{siteLocale}/company-setup` URL, so
 * before this the cluster was the guidance four alone and the eight editions of
 * one intent were read as two unrelated groups. The landing is not a
 * translation of the guidance page, but it is the same intent for the same
 * reader, which is what an alternate claims — and it is where the consultation
 * itself happens, so it is also the honest `x-default`.
 *
 * The mapping lives here rather than in `international-guidance-extra.ts`
 * because that module already imports this one; the reverse direction would be
 * a cycle. `GUIDANCE_EXTRA_ENGLISH_LANDING_PATHS` is derived from it there.
 */
export const GUIDANCE_EXTRA_SITE_COUNTERPART_PATHS: Record<GuidanceExtraPageKey, string> = {
  'company-setup': '/taiwan-company-setup-lawyer',
  'debt-collection': '/taiwan-litigation-lawyer',
};

export type GuidancePageKey = GuidanceCorePageKey | GuidanceExtraPageKey;

/** Every routable guidance page key, core first. */
export const GUIDANCE_ALL_PAGE_KEYS = [
  ...GUIDANCE_PAGE_KEYS,
  ...GUIDANCE_EXTRA_PAGE_KEYS,
] as const satisfies readonly GuidancePageKey[];

export function isGuidanceExtraPageKey(value: string): value is GuidanceExtraPageKey {
  return (GUIDANCE_EXTRA_PAGE_KEYS as readonly string[]).includes(value);
}

/** Exact routable slug keys. Home is the empty slug, never `home`. */
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
  'company-setup',
  'debt-collection',
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
  'company-setup': 'company-setup',
  'debt-collection': 'debt-collection',
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

/**
 * Machine-readable files that must reach their own route handler untouched.
 * Only `llms.txt` for now: every other dotted path keeps the unavailable
 * guard, so this list is deliberately not a generic "has a dot" rule.
 */
const GUIDANCE_PASSTHROUGH_FILES: readonly string[] = ['llms.txt'];

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

    // The reverse of the extra-key branch further down. The hreflang cluster
    // declares the intent landing and the four guidance pages to be alternates
    // of one another, so a reader on `/en/taiwan-company-setup-lawyer` who
    // picks vi belongs on `/vi/company-setup`. Without this the landing
    // resolves no guidance page key and falls through to the home page below,
    // which leaves the cluster reciprocal in the tags and one-way in the chrome
    // the reader actually clicks.
    const counterpartPageKey = guidanceExtraPageKeyFromSiteCounterpartPath(pathWithoutLocale);
    if (counterpartPageKey) {
      return {
        status: 'available',
        href: guidancePublicPath(targetLocale, counterpartPageKey),
        fallback: 'exact',
      };
    }

    return {
      status: 'available',
      href: guidancePublicPath(targetLocale, 'home'),
      fallback: 'home',
    };
  }

  // A guidance page outside the original ten has no ko/zh-hant/en/ja URL at the
  // same path, so the switcher must not link one into existence. It goes to the
  // intent landing named in GUIDANCE_EXTRA_SITE_COUNTERPART_PATHS instead of
  // the home page: that landing is the same intent in the target language, and
  // the hreflang cluster already declares the two reciprocal alternates, so the
  // switcher and the cluster now name the same URL. `exact` for the same reason
  // — the reader lands on the page they asked for, not a degraded stand-in.
  if (isGuidanceExtraPageKey(slugPath)) {
    return {
      status: 'available',
      href: `/${targetLocale}${GUIDANCE_EXTRA_SITE_COUNTERPART_PATHS[slugPath]}`,
      fallback: 'exact',
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
  return locale === 'zh-hant' ? 'zh-Hant' : locale;
}

export function buildGuidanceCoreLanguageAlternates(
  pageKey: GuidancePageKey,
  siteUrl: string = DEFAULT_SITE_URL,
): Record<string, string> {
  const origin = siteUrl.replace(/\/+$/, '');

  // Pages outside the original ten publish no `/{siteLocale}/<key>` URL, so the
  // ko/zh-hant/en/ja half of the cluster is the intent landing that answers the
  // same question — see GUIDANCE_EXTRA_SITE_COUNTERPART_PATHS. `getLanguageAlternates`
  // adds the four guidance URLs to that landing's own cluster, which is what
  // makes the eight reciprocal. x-default is the English landing, the one page
  // of the eight where the consultation itself is held.
  if (isGuidanceExtraPageKey(pageKey)) {
    const counterpart = GUIDANCE_EXTRA_SITE_COUNTERPART_PATHS[pageKey];
    const extraLanguages: Record<string, string> = {};
    for (const locale of GUIDANCE_LOCALES_4) {
      extraLanguages[hreflangTagForPublicLocale(locale)] = `${origin}${guidancePublicPath(locale, pageKey)}`;
    }
    for (const locale of EXISTING_SITE_LOCALES_4) {
      extraLanguages[hreflangTagForPublicLocale(locale)] = `${origin}/${locale}${counterpart}`;
    }
    extraLanguages['x-default'] = `${origin}/en${counterpart}`;
    return extraLanguages;
  }

  const path = guidanceCorePath(pageKey);
  const englishNoindex = isEnglishNoindexPath(path);
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

/**
 * The guidance page key whose cluster a ko/zh-hant/en/ja path belongs to, or
 * `null` for every other path. `path` is locale-less, the same shape
 * {@link getLanguageAlternates} takes.
 */
export function guidanceExtraPageKeyFromSiteCounterpartPath(
  path: string,
): GuidanceExtraPageKey | null {
  const normalized = normalizePublicPathname(path);
  return GUIDANCE_EXTRA_PAGE_KEYS.find(
    (pageKey) => GUIDANCE_EXTRA_SITE_COUNTERPART_PATHS[pageKey] === normalized,
  ) ?? null;
}

/**
 * The vi/id/th/fil half of the cluster, for the ko/zh-hant/en/ja counterpart
 * landing at `path`. Empty for any other path.
 *
 * Hreflang has to be reciprocal to be believed, so the landing that
 * {@link buildGuidanceCoreLanguageAlternates} names as the guidance page's
 * ko/zh-hant/en/ja alternate has to name the four guidance URLs back. This is
 * the second half; `getLanguageAlternates` merges it into the landing's
 * existing set rather than replacing it, so the four site locales and the
 * x-default that path already published are untouched.
 */
export function guidanceExtraSiteCounterpartLanguageAlternates(
  path: string,
  siteUrl: string = DEFAULT_SITE_URL,
): Record<string, string> {
  const pageKey = guidanceExtraPageKeyFromSiteCounterpartPath(path);
  if (!pageKey) return {};

  const origin = siteUrl.replace(/\/+$/, '');
  const languages: Record<string, string> = {};
  for (const locale of GUIDANCE_LOCALES_4) {
    languages[hreflangTagForPublicLocale(locale)] = `${origin}${guidancePublicPath(locale, pageKey)}`;
  }
  return languages;
}

export function guidanceCanonicalUrl(
  locale: PublicLocale8,
  pageKey: GuidancePageKey,
  siteUrl: string = DEFAULT_SITE_URL,
): string {
  return `${siteUrl.replace(/\/+$/, '')}${guidancePublicPath(locale, pageKey)}`;
}
