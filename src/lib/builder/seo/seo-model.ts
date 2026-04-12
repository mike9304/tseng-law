/**
 * Phase 9 P9-01/P9-02 — SEO data model + utilities.
 * P9-03 — Sitemap generation helpers.
 * P9-04 — hreflang generation.
 * P9-18 (CMS-10) — Dynamic SEO fields + slug templates.
 */

import type { Locale } from '@/lib/locales';
import type { BuilderPageMeta } from '@/lib/builder/site/types';

export interface PageSeoData {
  title: string;
  description: string;
  ogImage?: string;
  canonical: string;
  noIndex: boolean;
  noFollow: boolean;
  hreflang: Array<{ locale: Locale; url: string }>;
  structuredData?: Record<string, unknown>;
}

export function buildPageSeo(
  page: BuilderPageMeta,
  siteUrl: string,
  locale: Locale,
  allPages: BuilderPageMeta[],
): PageSeoData {
  const seo = page.seo || {};
  const slug = page.slug || '';
  const url = `${siteUrl}/${locale}/p/${slug}`.replace(/\/+$/, '');

  const hreflang: Array<{ locale: Locale; url: string }> = [];
  if (page.linkedPageIds) {
    for (const [loc, linkedPageId] of Object.entries(page.linkedPageIds)) {
      if (!linkedPageId) continue;
      const linked = allPages.find((p) => p.pageId === linkedPageId);
      if (linked) {
        hreflang.push({
          locale: loc as Locale,
          url: `${siteUrl}/${loc}/p/${linked.slug}`.replace(/\/+$/, ''),
        });
      }
    }
  }
  hreflang.push({ locale, url });

  return {
    title: seo.title || page.title[locale] || page.title.ko || '',
    description: seo.description || '',
    ogImage: seo.ogImage,
    canonical: seo.canonical || url,
    noIndex: page.noIndex || seo.noIndex || false,
    noFollow: seo.noFollow || false,
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
    .filter((p) => p.publishedAt && !p.noIndex)
    .map((page) => {
      const loc = `${siteUrl}/${page.locale}/p/${page.slug}`.replace(/\/+$/, '');
      const hreflang: Array<{ locale: string; href: string }> = [];
      if (page.linkedPageIds) {
        for (const [loc2, linkedId] of Object.entries(page.linkedPageIds)) {
          if (!linkedId) continue;
          const linked = pages.find((p2) => p2.pageId === linkedId);
          if (linked) {
            hreflang.push({
              locale: loc2,
              href: `${siteUrl}/${loc2}/p/${linked.slug}`.replace(/\/+$/, ''),
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
