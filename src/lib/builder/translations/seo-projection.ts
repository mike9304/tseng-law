/**
 * F117 — Per-language SEO projection.
 *
 * Given a page meta, returns a record keyed by locale containing the
 * effective `{ title, description, ogImage }` for that locale. If a
 * `pageMeta.seo.localizedOverrides[locale]` value exists, it wins on a
 * per-field basis. Otherwise the source-locale SEO values are inherited.
 *
 * The shape `localizedOverrides` is an additive optional field on
 * BuilderSeoMetadata — see the patch in "Files to modify".
 */

import { locales, type Locale } from '@/lib/locales';
import type {
  BuilderPageMeta,
  BuilderSeoMetadata,
} from '@/lib/builder/site/types';

export interface ProjectedSeoValue {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  focusKeyword?: string;
}

export type ProjectedSeoMap = Partial<Record<Locale, ProjectedSeoValue>>;

interface LocalizedSeoOverrideBag {
  localizedOverrides?: Partial<Record<Locale, ProjectedSeoValue>>;
}

function readLocalizedOverrides(
  seo: BuilderSeoMetadata | undefined,
): Partial<Record<Locale, ProjectedSeoValue>> {
  if (!seo) return {};
  return (seo as LocalizedSeoOverrideBag).localizedOverrides ?? {};
}

export function projectSeoToLocales(
  pageMeta: BuilderPageMeta,
  targetLocales: readonly Locale[] = locales,
): ProjectedSeoMap {
  const seo = pageMeta.seo;
  const overrides = readLocalizedOverrides(seo);
  const source: ProjectedSeoValue = {
    title: seo?.title,
    description: seo?.description,
    ogTitle: seo?.ogTitle,
    ogDescription: seo?.ogDescription,
    ogImage: seo?.ogImage,
    twitterTitle: seo?.twitterTitle,
    twitterDescription: seo?.twitterDescription,
    twitterImage: seo?.twitterImage,
    focusKeyword: seo?.focusKeyword,
  };
  const out: ProjectedSeoMap = {};
  for (const locale of targetLocales) {
    const override = overrides[locale] ?? {};
    out[locale] = {
      title: override.title ?? source.title,
      description: override.description ?? source.description,
      ogTitle: override.ogTitle ?? source.ogTitle,
      ogDescription: override.ogDescription ?? source.ogDescription,
      ogImage: override.ogImage ?? source.ogImage,
      twitterTitle: override.twitterTitle ?? source.twitterTitle,
      twitterDescription: override.twitterDescription ?? source.twitterDescription,
      twitterImage: override.twitterImage ?? source.twitterImage,
      focusKeyword: override.focusKeyword ?? source.focusKeyword,
    };
  }
  return out;
}

/**
 * Convenience: returns the effective SEO for a single (page, locale)
 * pair. Equivalent to `projectSeoToLocales(page, [locale])[locale]`.
 */
export function resolveLocaleSeo(
  pageMeta: BuilderPageMeta,
  locale: Locale,
): ProjectedSeoValue {
  return projectSeoToLocales(pageMeta, [locale])[locale] ?? {};
}
