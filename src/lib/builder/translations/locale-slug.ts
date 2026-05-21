/**
 * F116 — Per-language page slug projection.
 *
 * Mirrors the per-locale override pattern from `seo-projection.ts`:
 * a `BuilderPageMeta` may carry an additive `slugByLocale` map keyed by
 * locale. The effective slug for a given locale is the override when
 * defined, otherwise the source `pageMeta.slug`.
 *
 * The store is additive — older docs without `slugByLocale` keep their
 * current behaviour (single `slug` shared across locales).
 *
 * NOTE: route slug normalization (lowercase / no leading slash) lives in
 * `@/lib/builder/seo/validation` (`normalizeSeoSlugInput`). This helper
 * intentionally trusts its inputs — callers must normalize before write.
 */

import type { Locale } from '@/lib/locales';
import type { BuilderPageMeta } from '@/lib/builder/site/types';

interface LocalizedSlugBag {
  slugByLocale?: Partial<Record<Locale, string>>;
}

function readSlugByLocale(
  pageMeta: BuilderPageMeta,
): Partial<Record<Locale, string>> {
  return (pageMeta as LocalizedSlugBag).slugByLocale ?? {};
}

/**
 * Resolve the effective slug for one (page, locale) pair.
 *
 * Returns the per-locale override when present (and non-empty), else the
 * default `pageMeta.slug`. Empty-string overrides are treated as "no
 * override" so home pages stay reachable as `/`.
 */
export function resolveLocaleSlug(
  pageMeta: BuilderPageMeta,
  locale: Locale,
): string {
  const overrides = readSlugByLocale(pageMeta);
  const candidate = overrides[locale];
  if (typeof candidate === 'string' && candidate.length > 0) return candidate;
  return pageMeta.slug;
}

/**
 * Find the page meta whose effective slug for `locale` matches `slugPath`.
 *
 * Match precedence:
 *   1. `slugByLocale[locale]` exact match (per-locale Wix-style override).
 *   2. `pageMeta.slug` exact match (default fallback).
 *
 * The result is undefined when no page matches — dynamic-item slugs and
 * other URL transforms remain the concern of
 * `findPageMetaForLocaleWithDynamicContext` in `page-resolution.ts`.
 *
 * Both branches respect the same `locale` filter: a page whose own
 * `pageMeta.locale === locale` is preferred when otherwise tied so that
 * authored-locale pages win over projected source-locale pages.
 */
export function findPageMetaForLocaleSlug(
  pages: readonly BuilderPageMeta[],
  locale: Locale,
  slugPath: string,
): BuilderPageMeta | undefined {
  let fallback: BuilderPageMeta | undefined;

  for (const page of pages) {
    const overrideSlug = readSlugByLocale(page)[locale];
    if (typeof overrideSlug === 'string' && overrideSlug === slugPath) {
      return page;
    }
    if (page.slug === slugPath && !fallback) {
      fallback = page;
    }
  }
  return fallback;
}

/**
 * Returns true when the locale-effective slug for `candidate` collides with
 * `proposedSlug` while ignoring the page identified by `ownPageId`. Used by
 * the PATCH route to surface "duplicate slug" before persisting.
 */
export function isLocaleSlugConflict(
  pages: readonly BuilderPageMeta[],
  locale: Locale,
  proposedSlug: string,
  ownPageId: string,
): boolean {
  if (proposedSlug.length === 0) return false;
  return pages.some((candidate) => {
    if (candidate.pageId === ownPageId) return false;
    return resolveLocaleSlug(candidate, locale) === proposedSlug;
  });
}