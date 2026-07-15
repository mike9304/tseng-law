import { defaultLocale, isLocale, locales, type Locale } from '@/lib/locales';
import { isInternalSandboxPage } from '@/lib/builder/site/internal-pages';
import type { BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';

export type SiteInvariantIssueCode =
  | 'SITE_PAGES_EMPTY'
  | 'PAGE_ID_INVALID'
  | 'PAGE_ID_EMPTY'
  | 'PAGE_ID_NOT_NORMALIZED'
  | 'PAGE_ID_UNSAFE'
  | 'PAGE_ID_DUPLICATE'
  | 'PAGE_LOCALE_INVALID'
  | 'PAGE_LOCALE_UNSUPPORTED'
  | 'PAGE_SLUG_INVALID'
  | 'SLUG_LOCALE_UNSUPPORTED'
  | 'LINKED_PAGE_LOCALE_UNSUPPORTED'
  | 'INTERNAL_SANDBOX_PAGE_FORBIDDEN'
  | 'AUTHORED_HOME_MISSING'
  | 'AUTHORED_HOME_MULTIPLE'
  | 'HOME_ROUTE_NONEMPTY'
  | 'NON_HOME_ROUTE_EMPTY'
  | 'ROUTE_NOT_NORMALIZED'
  | 'ROUTE_UNSAFE'
  | 'ROUTE_DUPLICATE';

export interface SiteInvariantIssue {
  code: SiteInvariantIssueCode;
  message: string;
  pageId?: string;
  conflictingPageId?: string;
  locale?: Locale;
  localeKey?: string;
  slug?: string;
  field?: 'pageId' | 'slug' | 'slugByLocale' | 'isHomePage';
}

export class SiteInvariantError extends Error {
  readonly issues: readonly SiteInvariantIssue[];

  constructor(issues: readonly SiteInvariantIssue[]) {
    super(`Builder site invariant validation failed (${issues.length} issue${issues.length === 1 ? '' : 's'})`);
    this.name = 'SiteInvariantError';
    this.issues = issues;
  }
}

export interface SiteInvariantValidationOptions {
  forbidInternalSandboxPages?: boolean;
}

const SAFE_PAGE_ID = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
const SAFE_ROUTE_SEGMENT = /^[\p{L}\p{N}\p{M}._~-]+$/u;
const FORBIDDEN_ROUTE_CHARACTER = /[\u0000-\u001F\u007F?#\\]/u;

function routeIsSafe(slug: string): boolean {
  if (FORBIDDEN_ROUTE_CHARACTER.test(slug)) return false;
  const segments = slug.split('/');
  return segments.every((segment) => (
    segment.length > 0
    && segment !== '.'
    && segment !== '..'
    && SAFE_ROUTE_SEGMENT.test(segment)
  ));
}

interface EffectiveRoute {
  page: BuilderPageMeta;
  locale: Locale;
  slug: string;
  field: 'slug' | 'slugByLocale';
}

function resolveLocaleSlugForInvariant(page: BuilderPageMeta, locale: Locale): string {
  const candidate = page.slugByLocale?.[locale];
  return typeof candidate === 'string' && candidate.length > 0 ? candidate : page.slug;
}

function pageLocaleProjectionKey(page: BuilderPageMeta, locale: Locale): string {
  return page.isHomePage || page.slug === ''
    ? '__home__'
    : resolveLocaleSlugForInvariant(page, locale);
}

function hasLocaleEquivalentPage(
  pages: readonly BuilderPageMeta[],
  sourcePage: BuilderPageMeta,
  locale: Locale,
): boolean {
  const linkedPageId = sourcePage.linkedPageIds?.[locale];
  if (linkedPageId && pages.some((page) => (
    page.pageId === linkedPageId
    && page.locale === locale
    && resolveLocaleSlugForInvariant(page, locale) === resolveLocaleSlugForInvariant(sourcePage, locale)
  ))) {
    return true;
  }
  const sourceKey = sourcePage.isHomePage
    ? '__home__'
    : resolveLocaleSlugForInvariant(sourcePage, locale);
  return pages.some((page) => (
    page.locale === locale && pageLocaleProjectionKey(page, locale) === sourceKey
  ));
}

function canProjectPageToLocale(
  page: BuilderPageMeta,
  pages: readonly BuilderPageMeta[],
  locale: Locale,
): boolean {
  if (page.locale === locale) return true;
  if (locale === defaultLocale || page.locale !== defaultLocale) return false;
  return !hasLocaleEquivalentPage(pages, page, locale);
}

function collectEffectiveRoutes(pages: readonly BuilderPageMeta[]): EffectiveRoute[] {
  const routes: EffectiveRoute[] = [];
  for (const locale of locales) {
    for (const page of pages) {
      if (!canProjectPageToLocale(page, pages, locale)) continue;
      const override = page.slugByLocale?.[locale];
      const effectiveSlug = resolveLocaleSlugForInvariant(page, locale);
      const field = typeof override === 'string' && override.length > 0 ? 'slugByLocale' : 'slug';
      const isRuntimeHome = page.isHomePage || page.slug === '';
      if (isRuntimeHome) {
        routes.push({ page, locale, slug: '', field });
      }
      if (!isRuntimeHome || effectiveSlug.length > 0) routes.push({
        page,
        locale,
        slug: effectiveSlug,
        field,
      });
    }
  }
  return routes;
}

function validateStoredRoute(
  issues: SiteInvariantIssue[],
  page: BuilderPageMeta,
  locale: Locale,
  slug: string,
  field: 'slug' | 'slugByLocale',
): void {
  if (slug !== slug.trim() || slug.startsWith('/') || slug.endsWith('/')) {
    issues.push({
      code: 'ROUTE_NOT_NORMALIZED',
      message: `Route slug must be stored trimmed without a leading or trailing slash (${locale}).`,
      pageId: page.pageId,
      locale,
      slug,
      field,
    });
  }
  if (slug.length > 0 && !routeIsSafe(slug)) {
    issues.push({
      code: 'ROUTE_UNSAFE',
      message: `Route slug contains an unsafe path segment (${locale}).`,
      pageId: page.pageId,
      locale,
      slug,
      field,
    });
  }
}

export function validateSiteDocumentInvariants(
  site: Pick<BuilderSiteDocument, 'pages'>,
  options: SiteInvariantValidationOptions = {},
): SiteInvariantIssue[] {
  const issues: SiteInvariantIssue[] = [];
  const pageIds = new Map<string, BuilderPageMeta>();
  const authoredLocales = new Set<Locale>();
  const homesByLocale = new Map<Locale, BuilderPageMeta[]>();

  if (!site.pages?.length) {
    issues.push({
      code: 'SITE_PAGES_EMPTY',
      message: 'A builder site must contain at least one authored page.',
    });
  }

  for (const page of site.pages ?? []) {
    const rawPageId = typeof page.pageId === 'string' ? page.pageId : null;
    if (rawPageId === null) {
      issues.push({
        code: 'PAGE_ID_INVALID',
        message: 'Page id must be a string.',
        field: 'pageId',
      });
    } else if (rawPageId.length === 0 || rawPageId.trim().length === 0) {
      issues.push({
        code: 'PAGE_ID_EMPTY',
        message: 'Page id must not be empty.',
        pageId: rawPageId,
        field: 'pageId',
      });
    } else {
      if (rawPageId !== rawPageId.trim()) {
        issues.push({
          code: 'PAGE_ID_NOT_NORMALIZED',
          message: 'Page id must be stored without surrounding whitespace.',
          pageId: rawPageId ?? undefined,
          field: 'pageId',
        });
      }
      if (!SAFE_PAGE_ID.test(rawPageId)) {
        issues.push({
          code: 'PAGE_ID_UNSAFE',
          message: 'Page id must be a safe single path segment.',
          pageId: rawPageId ?? undefined,
          field: 'pageId',
        });
      }
    }

    if (rawPageId !== null) {
      const duplicatePage = pageIds.get(rawPageId);
      if (duplicatePage) {
        issues.push({
          code: 'PAGE_ID_DUPLICATE',
          message: `Page id ${JSON.stringify(rawPageId)} is duplicated.`,
          pageId: rawPageId,
          conflictingPageId: duplicatePage.pageId,
          field: 'pageId',
        });
      } else {
        pageIds.set(rawPageId, page);
      }
    }

    if (typeof page.locale !== 'string') {
      issues.push({
        code: 'PAGE_LOCALE_INVALID',
        message: 'Page locale must be a string.',
        pageId: rawPageId ?? undefined,
      });
    } else if (isLocale(page.locale)) {
      authoredLocales.add(page.locale);
    } else {
      issues.push({
        code: 'PAGE_LOCALE_UNSUPPORTED',
        message: `Page locale ${JSON.stringify(page.locale)} is not supported.`,
        pageId: rawPageId ?? undefined,
        localeKey: String(page.locale),
      });
    }

    if (typeof page.slug !== 'string') {
      issues.push({
        code: 'PAGE_SLUG_INVALID',
        message: 'Page slug must be a string.',
        pageId: rawPageId ?? undefined,
        field: 'slug',
      });
    }

    for (const localeKey of Object.keys(page.slugByLocale ?? {})) {
      if (!isLocale(localeKey)) {
        issues.push({
          code: 'SLUG_LOCALE_UNSUPPORTED',
          message: `Localized slug key ${JSON.stringify(localeKey)} is not supported.`,
          pageId: rawPageId ?? undefined,
          localeKey,
          field: 'slugByLocale',
        });
      }
    }
    for (const localeKey of Object.keys(page.linkedPageIds ?? {})) {
      if (!isLocale(localeKey)) {
        issues.push({
          code: 'LINKED_PAGE_LOCALE_UNSUPPORTED',
          message: `Linked-page locale key ${JSON.stringify(localeKey)} is not supported.`,
          pageId: rawPageId ?? undefined,
          localeKey,
        });
      }
    }

    if (page.isHomePage && isLocale(page.locale)) {
      const homes = homesByLocale.get(page.locale) ?? [];
      homes.push(page);
      homesByLocale.set(page.locale, homes);
    }

    if (isLocale(page.locale) && typeof page.slug === 'string') {
      validateStoredRoute(issues, page, page.locale, page.slug, 'slug');
    }
    for (const [localeKey, slug] of Object.entries(page.slugByLocale ?? {})) {
      if (isLocale(localeKey) && typeof slug === 'string') {
        validateStoredRoute(issues, page, localeKey, slug, 'slugByLocale');
      }
    }
  }

  for (const locale of authoredLocales) {
    const homes = homesByLocale.get(locale) ?? [];
    if (homes.length === 0) {
      issues.push({
        code: 'AUTHORED_HOME_MISSING',
        message: `Authored locale ${locale} must have exactly one home page.`,
        locale,
        field: 'isHomePage',
      });
    } else if (homes.length > 1) {
      issues.push({
        code: 'AUTHORED_HOME_MULTIPLE',
        message: `Authored locale ${locale} has ${homes.length} home pages.`,
        pageId: homes[1]?.pageId,
        conflictingPageId: homes[0]?.pageId,
        locale,
        field: 'isHomePage',
      });
    }
  }

  const routeOwners = new Map<string, EffectiveRoute>();
  const validPages = (site.pages ?? []).filter((page) => (
    isLocale(page.locale) && typeof page.slug === 'string'
  ));
  const routes = collectEffectiveRoutes(validPages);
  for (const route of routes) {
    if (options.forbidInternalSandboxPages && isInternalSandboxPage({
      slug: route.slug,
      title: route.page.title,
    })) {
      issues.push({
        code: 'INTERNAL_SANDBOX_PAGE_FORBIDDEN',
        message: 'An internal sandbox or QA route is forbidden in the canonical production site.',
        pageId: typeof route.page.pageId === 'string' ? route.page.pageId : undefined,
        locale: route.locale,
        slug: route.slug,
      });
    }
    const authoredEffectiveSlug = resolveLocaleSlugForInvariant(route.page, route.locale);
    if (
      route.slug === ''
      && route.page.locale === route.locale
      && route.page.isHomePage
      && authoredEffectiveSlug !== ''
    ) {
      issues.push({
        code: 'HOME_ROUTE_NONEMPTY',
        message: `The authored home route for ${route.locale} must be empty.`,
        pageId: route.page.pageId,
        locale: route.locale,
        slug: authoredEffectiveSlug,
        field: route.field,
      });
    }
    if (!route.page.isHomePage && route.slug === '') {
      issues.push({
        code: 'NON_HOME_ROUTE_EMPTY',
        message: `A non-home route for ${route.locale} must not be empty.`,
        pageId: route.page.pageId,
        locale: route.locale,
        slug: route.slug,
        field: route.field,
      });
    }

    const key = `${route.locale}\u0000${route.slug}`;
    const owner = routeOwners.get(key);
    if (owner && owner.page.pageId !== route.page.pageId) {
      issues.push({
        code: 'ROUTE_DUPLICATE',
        message: `Route ${JSON.stringify(route.slug)} is duplicated in locale ${route.locale}.`,
        pageId: route.page.pageId,
        conflictingPageId: owner.page.pageId,
        locale: route.locale,
        slug: route.slug,
        field: route.field,
      });
    } else if (!owner) {
      routeOwners.set(key, route);
    }
  }

  return issues;
}

export function assertSiteDocumentInvariants(
  site: Pick<BuilderSiteDocument, 'pages'>,
  options: SiteInvariantValidationOptions = {},
): void {
  const issues = validateSiteDocumentInvariants(site, options);
  if (issues.length > 0) throw new SiteInvariantError(issues);
}
