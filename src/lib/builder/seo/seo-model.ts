/**
 * Phase 9 P9-01/P9-02 — SEO data model + utilities.
 * P9-03 — Sitemap generation helpers.
 * P9-04 — hreflang generation.
 * P9-18 (CMS-10) — Dynamic SEO fields + slug templates.
 */

import type { Locale } from '@/lib/locales';
import type { BuilderPageMeta, BuilderSeoAdditionalMetaTag, BuilderSiteDocument } from '@/lib/builder/site/types';
import {
  buildHreflangAlternates,
  type HreflangAlternate,
} from '@/lib/builder/seo/hreflang';
import { buildSitePageAbsoluteUrl } from '@/lib/builder/site/paths';
import { buildDefaultSeoMetadata, mergeSeoWithDefaults } from '@/lib/builder/seo/defaults';
import { resolveLocaleSeo } from '@/lib/builder/translations/seo-projection';
import { resolveLocaleSlug } from '@/lib/builder/translations/locale-slug';
import { isInternalSandboxPage } from '@/lib/builder/site/internal-pages';
import { resolveLiveRouteSeoDefault } from '@/lib/builder/seo/live-route-defaults';

export interface PageSeoData {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage?: string;
  twitterCard: 'summary' | 'summary_large_image';
  twitterTitle: string;
  twitterDescription: string;
  twitterImage?: string;
  canonical: string;
  noIndex: boolean;
  noFollow: boolean;
  additionalMetaTags: BuilderSeoAdditionalMetaTag[];
  hreflang: HreflangAlternate[];
  structuredData?: Record<string, unknown>;
}

export const OPEN_GRAPH_LOCALE: Record<Locale, string> = {
  ko: 'ko_KR',
  'zh-hant': 'zh_TW',
  en: 'en_US',
};

export function buildBuilderPageAbsoluteUrl(
  siteUrl: string,
  locale: Locale,
  slug: string,
): string {
  return buildSitePageAbsoluteUrl(siteUrl, locale, slug);
}

/**
 * Normalize a canonical URL: strip query string, strip trailing slash
 * (except for the bare origin), preserve hash if present.
 */
export function normalizeCanonicalUrl(input: string): string {
  if (!input) return input;
  try {
    const u = new URL(input);
    u.search = '';
    let pathname = u.pathname.replace(/\/+$/, '');
    if (!pathname) pathname = '/';
    u.pathname = pathname;
    return u.toString().replace(/\/$/, '');
  } catch {
    return input.split('?')[0]?.replace(/\/+$/, '') || input;
  }
}

export function buildPageSeo(
  page: BuilderPageMeta,
  siteUrl: string,
  locale: Locale,
  allPages: BuilderPageMeta[],
  site?: BuilderSiteDocument | null,
): PageSeoData {
  const localizedSeo = resolveLocaleSeo(page, locale);
  const seo = mergeSeoWithDefaults({
    page,
    site,
    siteUrl,
    locale,
    seo: {
      ...(page.seo ?? {}),
      ...localizedSeo,
    },
  });
  const slug = resolveLocaleSlug(page, locale) || '';
  const url = buildBuilderPageAbsoluteUrl(siteUrl, locale, slug);
  const effectiveSeo = {
    ...(page.seo ?? {}),
    ...localizedSeo,
  };
  const routeSeoDefault = resolveLiveRouteSeoDefault(locale, slug);
  const explicitTitle = effectiveSeo.title?.trim() || undefined;
  const explicitDescription = effectiveSeo.description?.trim() || undefined;
  const explicitOgTitle = effectiveSeo.ogTitle?.trim() || undefined;
  const explicitOgDescription = effectiveSeo.ogDescription?.trim() || undefined;
  const explicitTwitterTitle = effectiveSeo.twitterTitle?.trim() || undefined;
  const explicitTwitterDescription = effectiveSeo.twitterDescription?.trim() || undefined;
  const title =
    explicitTitle ||
    routeSeoDefault?.title ||
    seo.title ||
    page.title[locale] ||
    page.title.ko ||
    '';
  const defaultDescription =
    buildDefaultSeoMetadata({ page, site, siteUrl, locale }).description || '';
  const description =
    explicitDescription ||
    routeSeoDefault?.description ||
    seo.description ||
    defaultDescription;
  const ogImage = seo.ogImage;
  const hasRouteTitle = Boolean(!explicitTitle && routeSeoDefault?.title);
  const hasRouteDescription = Boolean(!explicitDescription && routeSeoDefault?.description);
  const ogTitle =
    explicitOgTitle ||
    (explicitTitle || hasRouteTitle ? title : seo.ogTitle) ||
    title;
  const ogDescription =
    explicitOgDescription ||
    (explicitDescription || hasRouteDescription ? description : seo.ogDescription) ||
    description;

  // Centralised hreflang generation — includes x-default + every linked
  // sibling reachable via `linkedPageIds`.
  const hreflang = buildHreflangAlternates(page, siteUrl, allPages);

  return {
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard: seo.twitterCard || (seo.twitterImage || ogImage ? 'summary_large_image' : 'summary'),
    twitterTitle:
      explicitTwitterTitle ||
      (explicitTitle || hasRouteTitle ? ogTitle : seo.twitterTitle) ||
      ogTitle,
    twitterDescription:
      explicitTwitterDescription ||
      (explicitDescription || hasRouteDescription ? ogDescription : seo.twitterDescription) ||
      ogDescription,
    twitterImage: seo.twitterImage || ogImage,
    canonical: normalizeCanonicalUrl(seo.canonical || url),
    noIndex: page.noIndex || seo.noIndex || false,
    noFollow: seo.noFollow || false,
    additionalMetaTags: seo.additionalMetaTags ?? [],
    hreflang,
  };
}

export interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  hreflang?: Array<{ locale: string; href: string }>;
}

export function buildSitemapEntries(
  pages: BuilderPageMeta[],
  siteUrl: string,
): SitemapEntry[] {
  return pages
    .filter((p) => p.publishedAt && !p.noIndex && !p.seo?.noIndex && !isInternalSandboxPage(p))
    .map((page) => {
      const loc = buildBuilderPageAbsoluteUrl(siteUrl, page.locale, page.slug);
      const hreflang: Array<{ locale: string; href: string }> = [];
      if (page.linkedPageIds) {
        for (const [loc2, linkedId] of Object.entries(page.linkedPageIds)) {
          if (!linkedId) continue;
          const linked = pages.find((p2) => p2.pageId === linkedId);
          if (linked) {
            hreflang.push({
              locale: loc2,
              href: buildBuilderPageAbsoluteUrl(siteUrl, loc2 as Locale, linked.slug),
            });
          }
        }
      }
      return {
        loc,
        lastmod: page.updatedAt,
        changefreq: 'weekly' as const,
        priority: page.isHomePage ? 1.0 : 0.7,
        hreflang: hreflang.length > 0 ? hreflang : undefined,
      };
    });
}

export function sitemapToXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map((e) => {
      let xml = `  <url>\n    <loc>${e.loc}</loc>`;
      if (e.lastmod) xml += `\n    <lastmod>${e.lastmod}</lastmod>`;
      if (e.changefreq) xml += `\n    <changefreq>${e.changefreq}</changefreq>`;
      if (e.priority != null) xml += `\n    <priority>${e.priority}</priority>`;
      if (e.hreflang) {
        for (const h of e.hreflang) {
          xml += `\n    <xhtml:link rel="alternate" hreflang="${h.locale}" href="${h.href}" />`;
        }
      }
      xml += '\n  </url>';
      return xml;
    })
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>`;
}

export interface DynamicSeoTemplate {
  titleTemplate: string;
  descriptionTemplate: string;
  slugTemplate: string;
}

export function applyDynamicSeoTemplate(
  template: DynamicSeoTemplate,
  record: Record<string, string>,
): { title: string; description: string; slug: string } {
  const apply = (tmpl: string) =>
    tmpl.replace(/\{\{(\w+)\}\}/g, (_, key) => record[key] || '');
  return {
    title: apply(template.titleTemplate),
    description: apply(template.descriptionTemplate),
    slug: apply(template.slugTemplate),
  };
}
