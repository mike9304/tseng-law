import { ROUTED_PUBLIC_LOCALES, type RoutedPublicLocale } from '@/lib/public-guidance';

/**
 * Bare-domain language negotiation (user request 2026-10-01: "browser language decides").
 * `/` sends a visitor to the public locale that best matches their `Accept-Language`.
 * No header, or no language the site publishes, keeps the long-standing default
 * (`/ko`), so crawlers that send no language see the same target as before.
 */
export const ROOT_FALLBACK_LOCALE: RoutedPublicLocale = 'ko';

/** Legacy or alternate primary subtags that map onto a published locale. */
const PRIMARY_ALIASES: Readonly<Record<string, RoutedPublicLocale>> = {
  no: 'nb',
  nn: 'nb',
  tl: 'fil',
  iw: 'he',
  in: 'id',
};

const TRADITIONAL_CHINESE_REGIONS = new Set(['tw', 'hk', 'mo']);
const SIMPLIFIED_CHINESE_REGIONS = new Set(['cn', 'sg', 'my']);

function isRoutedLocale(value: string): value is RoutedPublicLocale {
  return (ROUTED_PUBLIC_LOCALES as readonly string[]).includes(value);
}

/** Maps one BCP 47 language tag onto a published locale, or null if none fits. */
export function localeForLanguageTag(tag: string): RoutedPublicLocale | null {
  const parts = tag.trim().toLowerCase().replace(/_/g, '-').split('-').filter(Boolean);
  const primary = parts[0];
  if (!primary || primary === '*') return null;

  if (primary === 'zh') {
    const subtags = parts.slice(1);
    if (subtags.includes('hant')) return 'zh-hant';
    if (subtags.includes('hans')) return 'zh-hans';
    if (subtags.some((subtag) => TRADITIONAL_CHINESE_REGIONS.has(subtag))) return 'zh-hant';
    if (subtags.some((subtag) => SIMPLIFIED_CHINESE_REGIONS.has(subtag))) return 'zh-hans';
    // A bare or unknown-region `zh`: the firm practises in Taiwan.
    return 'zh-hant';
  }

  if (isRoutedLocale(primary)) return primary;
  return PRIMARY_ALIASES[primary] ?? null;
}

type WeightedTag = { tag: string; q: number; order: number };

function parseAcceptLanguage(header: string): WeightedTag[] {
  return header
    .split(',')
    .map((entry, order) => {
      const [rawTag, ...params] = entry.split(';');
      let q = 1;
      for (const param of params) {
        const [key, value] = param.split('=').map((part) => part.trim());
        if (key?.toLowerCase() === 'q') {
          const parsed = Number(value);
          q = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 1) : 0;
        }
      }
      return { tag: (rawTag ?? '').trim(), q, order };
    })
    .filter(({ tag, q }) => tag.length > 0 && q > 0)
    .sort((a, b) => b.q - a.q || a.order - b.order);
}

/** Picks the locale `/` should open for this `Accept-Language` header. */
export function negotiateRootLocale(acceptLanguage: string | null | undefined): RoutedPublicLocale {
  if (!acceptLanguage) return ROOT_FALLBACK_LOCALE;
  for (const { tag } of parseAcceptLanguage(acceptLanguage)) {
    const locale = localeForLanguageTag(tag);
    if (locale) return locale;
  }
  return ROOT_FALLBACK_LOCALE;
}
