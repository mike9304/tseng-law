import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { normalizeLocale } from '@/lib/locales';
import { buildSitePagePath } from '@/lib/builder/site/paths';
import { buildDefaultSeoMetadata } from '@/lib/builder/seo/defaults';
import {
  buildHreflangAlternates,
  findMissingLocales,
  localeToHreflangTag,
} from '@/lib/builder/seo/hreflang';
import {
  validateBuilderPageSeo,
} from '@/lib/builder/seo/validation';
import { resolveLocaleSeo } from '@/lib/builder/translations/seo-projection';
import { getSiteUrl } from '@/lib/seo';
import { resolveBuilderSiteIdFromRequest } from '@/lib/builder/site/admin-routing';
import {
  applyLocalizedSeoPatch,
  applySeoPatch,
  appendRedirectIfValid,
  type RedirectCreationWarning,
  updateNavigationHref,
} from './route-mutations';
import { parseSeoRequest } from './route-schema';
import {
  errorResponse,
  invalidJsonPayloadResponse,
  pageNotFoundResponse,
  unknownErrorResponse,
  validationErrorResponse,
} from './route-responses';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteId = resolveBuilderSiteIdFromRequest(request);

  try {
    const site = await readSiteDocument(siteId, locale);
    const page = site.pages.find((entry) => entry.pageId === params.pageId);

    if (!page) {
      return pageNotFoundResponse(params.pageId, locale);
    }

    const siteUrl = getSiteUrl();
    const hreflang = buildHreflangAlternates(page, siteUrl, site.pages);
    const missingLocales = findMissingLocales(page, site.pages);
    const effectiveSeoForLocale = resolveLocaleSeo(page, locale);
    const siblings = Object.entries(page.linkedPageIds ?? {})
      .map(([loc, linkedId]) => {
        if (!linkedId) return null;
        const linked = site.pages.find((p) => p.pageId === linkedId);
        if (!linked) return null;
        return {
          locale: loc,
          pageId: linked.pageId,
          slug: linked.slug,
          hreflang: localeToHreflangTag(linked.locale),
          noIndex: Boolean(linked.noIndex || linked.seo?.noIndex),
        };
      })
      .filter((value): value is NonNullable<typeof value> => value !== null);
    const sitemapIncluded = !(page.noIndex || page.seo?.noIndex);

    return NextResponse.json({
      ok: true,
      page: {
        pageId: page.pageId,
        slug: page.slug,
        title: page.title,
        locale: page.locale,
        isHomePage: page.isHomePage,
        linkedPageIds: page.linkedPageIds ?? {},
        noIndex: Boolean(page.noIndex),
      },
      seo: resolveLocaleSeo(page, locale),
      defaultSeo: buildDefaultSeoMetadata({
        page,
        site,
        siteUrl,
        locale,
      }),
      defaults: {
        publicPath: buildSitePagePath(page.locale, page.slug),
        canonical: `${siteUrl.replace(/\/+$/, '')}${buildSitePagePath(page.locale, page.slug)}`,
      },
      hreflang,
      siblings,
      missingLocales,
      sitemapIncluded,
      validation: validateBuilderPageSeo({
        page: { ...page, seo: { ...(page.seo ?? {}), ...effectiveSeoForLocale } },
        site,
        seo: { ...(page.seo ?? {}), ...effectiveSeoForLocale },
        siteUrl,
      }),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    return unknownErrorResponse(locale);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteId = resolveBuilderSiteIdFromRequest(request);

  try {
    const rawBody = await request.json();
    const { slug, seoPayload, rawSeoBody, createRedirect } = parseSeoRequest(rawBody);
    const site = await readSiteDocument(siteId, locale);
    const page = site.pages.find((entry) => entry.pageId === params.pageId);

    if (!page) {
      return pageNotFoundResponse(params.pageId, locale);
    }

    const now = new Date().toISOString();
    const sourceLocale = page.locale;
    const nextSeo = locale === sourceLocale
      ? applySeoPatch(page.seo, seoPayload, rawSeoBody)
      : applyLocalizedSeoPatch(page.seo, seoPayload, rawSeoBody, locale);
    const nextSlug = slug !== undefined ? slug : page.slug;
    const previousSlug = page.slug;
    const previousPath = buildSitePagePath(page.locale, previousSlug);
    const nextPath = buildSitePagePath(page.locale, page.isHomePage ? '' : nextSlug);
    const effectiveSeoForValidation = locale === sourceLocale
      ? nextSeo
      : resolveLocaleSeo({ ...page, seo: nextSeo }, locale);
    const validation = validateBuilderPageSeo({
      page: { ...page, slug: nextSlug, seo: effectiveSeoForValidation },
      site,
      seo: effectiveSeoForValidation,
      slug: nextSlug,
      siteUrl: getSiteUrl(),
    });
    const blockers = validation.filter((issue) => issue.severity === 'blocker');

    if (blockers.length > 0) {
      return errorResponse(locale, 'validation_error', 400, {
        issues: blockers,
        validation,
      });
    }

    page.slug = nextSlug;
    page.seo = nextSeo;
    page.updatedAt = now;
    site.updatedAt = now;
    let redirectCreated = false;
    const redirectWarnings: RedirectCreationWarning[] = [];
    if (createRedirect && !page.isHomePage && previousPath !== nextPath) {
      const redirectResult = appendRedirectIfValid(site, {
        from: previousPath,
        to: nextPath,
        type: 301 as const,
        isActive: true,
        note: `Auto-created after SEO slug change for ${page.pageId}`,
      }, now);
      redirectCreated = redirectResult.created || redirectCreated;
      if (redirectResult.warning) redirectWarnings.push(redirectResult.warning);

      if (page.dynamicItem) {
        const wildcardRedirectResult = appendRedirectIfValid(site, {
          from: `${previousPath}/*`,
          to: `${nextPath}/*`,
          type: 301 as const,
          isActive: true,
          note: `Auto-created for dynamic item URLs after SEO slug change for ${page.pageId}`,
        }, now);
        redirectCreated = wildcardRedirectResult.created || redirectCreated;
        if (wildcardRedirectResult.warning) redirectWarnings.push(wildcardRedirectResult.warning);
      }
    }
    site.navigation = updateNavigationHref(
      site.navigation,
      page.pageId,
      buildSitePagePath(page.locale, page.isHomePage ? '' : nextSlug),
    );

    await writeSiteDocument(site);

    return NextResponse.json({
      ok: true,
      page: {
        pageId: page.pageId,
        slug: page.slug,
        title: page.title,
        locale: page.locale,
        isHomePage: page.isHomePage,
      },
      seo: resolveLocaleSeo(page, locale),
      defaultSeo: buildDefaultSeoMetadata({
        page,
        site,
        siteUrl: getSiteUrl(),
        locale,
      }),
      defaults: {
        publicPath: buildSitePagePath(page.locale, page.slug),
        canonical: `${getSiteUrl().replace(/\/+$/, '')}${buildSitePagePath(page.locale, page.slug)}`,
      },
      validation,
      redirectCreated,
      redirectWarnings,
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    if (error instanceof SyntaxError) {
      return invalidJsonPayloadResponse(locale);
    }
    return unknownErrorResponse(locale);
  }
}
