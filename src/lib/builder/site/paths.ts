import type { Locale } from '@/lib/locales';

function trimSlashes(value: string): string {
  return value.replace(/^\/+|\/+$/g, '');
}

export function buildSitePagePath(locale: Locale | string, slug: string): string {
  const normalizedSlug = trimSlashes(slug);
  return normalizedSlug ? `/${locale}/${normalizedSlug}` : `/${locale}`;
}

export function normalizeSiteHref(href: string, locale: Locale | string): string {
  if (!href) return buildSitePagePath(locale, '');
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;
  if (href === `/${locale}/p` || href === `/${locale}/p/`) return buildSitePagePath(locale, '');
  if (href.startsWith(`/${locale}/p/`)) {
    return buildSitePagePath(locale, href.slice(`/${locale}/p/`.length));
  }
  if (href.startsWith(`/${locale}`)) return href;
  if (href === '/') return buildSitePagePath(locale, '');
  if (href.startsWith('/p/')) return buildSitePagePath(locale, href.slice('/p/'.length));
  if (href.startsWith('/')) return `/${locale}${href}`;
  return buildSitePagePath(locale, href);
}

export function comparableSitePath(href: string, locale: Locale | string): string {
  const normalized = normalizeSiteHref(href, locale);
  const withoutHash = normalized.split('#')[0] ?? normalized;
  const withoutQuery = withoutHash.split('?')[0] ?? withoutHash;
  if (withoutQuery === '/') return buildSitePagePath(locale, '');
  return withoutQuery.replace(/\/+$/g, '') || buildSitePagePath(locale, '');
}
