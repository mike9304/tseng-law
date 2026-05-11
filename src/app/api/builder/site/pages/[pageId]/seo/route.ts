import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { normalizeLocale } from '@/lib/locales';
import type { BuilderNavItem, BuilderSeoMetadata } from '@/lib/builder/site/types';
import { buildSitePagePath } from '@/lib/builder/site/paths';
import { buildDefaultSeoMetadata } from '@/lib/builder/seo/defaults';
import {
  buildHreflangAlternates,
  findMissingLocales,
  localeToHreflangTag,
} from '@/lib/builder/seo/hreflang';
import {
  normalizeSeoSlugInput,
  validateBuilderPageSeo,
} from '@/lib/builder/seo/validation';
import { generateRedirectId, validateRedirectInput } from '@/lib/builder/site/redirects';
import { getSiteUrl } from '@/lib/seo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const optionalSeoString = (max: number) =>
  z.preprocess(
    (value) => {
      if (typeof value !== 'string') return value;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    },
    z.string().max(max).optional(),
  );

const builderSeoMetadataSchema = z.object({
  title: optionalSeoString(300),
  description: optionalSeoString(500),
  ogTitle: optionalSeoString(300),
  ogDescription: optionalSeoString(500),
  ogImage: optionalSeoString(2000),
  twitterCard: z.enum(['summary', 'summary_large_image']).optional(),
  twitterTitle: optionalSeoString(300),
  twitterDescription: optionalSeoString(500),
  twitterImage: optionalSeoString(2000),
  canonical: optionalSeoString(2000),
  noIndex: z.boolean().optional(),
  noFollow: z.boolean().optional(),
  additionalMetaTags: z.array(z.object({
    id: z.string().trim().min(1).max(120),
    name: z.string().trim().min(1).max(120),
    content: z.string().trim().min(1).max(1000),
  }).strict()).max(10).optional(),
  structuredData: z.object({
    legalService: z.boolean().optional(),
    organization: z.boolean().optional(),
    localBusiness: z.boolean().optional(),
    faqPage: z.enum(['auto', 'off']).optional(),
    breadcrumbList: z.boolean().optional(),
  }).strict().optional(),
  overrideState: z.record(z.string(), z.boolean()).optional(),
  focusKeyword: optionalSeoString(80),
  structuredDataBlocks: z.array(z.object({
    id: z.string().trim().min(1).max(120),
    type: z.enum(['LegalService', 'Organization', 'LocalBusiness', 'FAQPage', 'BreadcrumbList', 'Custom']),
    label: optionalSeoString(120),
    enabled: z.boolean(),
    json: optionalSeoString(10000),
  }).strict()).max(5).optional(),
}).strict();

const seoRequestSchema = z.object({
  slug: optionalSeoString(200),
  seo: builderSeoMetadataSchema.optional(),
  createRedirect: z.boolean().optional(),
}).strict();

interface ParsedSeoRequest {
  slug?: string;
  seoPayload: BuilderSeoMetadata;
  rawSeoBody: unknown;
  createRedirect: boolean;
}

function validationErrorResponse(error: ZodError): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      error: 'validation_error',
      issues: error.flatten(),
    },
    { status: 400 },
  );
}

function unknownErrorResponse(error: unknown): NextResponse {
  const message = error instanceof Error ? error.message : 'unknown_error';
  return NextResponse.json({ ok: false, error: message }, { status: 500 });
}

function pageNotFoundResponse(pageId: string): NextResponse {
  return NextResponse.json(
    { ok: false, error: `Page not found: ${pageId}` },
    { status: 404 },
  );
}

function hasOwnKey(input: unknown, key: keyof BuilderSeoMetadata): boolean {
  return typeof input === 'object' && input !== null && Object.prototype.hasOwnProperty.call(input, key);
}

function parseSeoRequest(rawBody: unknown): ParsedSeoRequest {
  if (typeof rawBody === 'object' && rawBody !== null && ('seo' in rawBody || 'slug' in rawBody)) {
    const payload = seoRequestSchema.parse(rawBody);
    return {
      slug: payload.slug ? normalizeSeoSlugInput(payload.slug) : payload.slug,
      seoPayload: payload.seo ?? {},
      rawSeoBody: payload.seo ?? {},
      createRedirect: payload.createRedirect === true,
    };
  }

  const seoPayload = builderSeoMetadataSchema.parse(rawBody);
  return {
    seoPayload,
    rawSeoBody: rawBody,
    createRedirect: false,
  };
}

function updateNavigationHref(
  items: BuilderNavItem[],
  pageId: string,
  nextHref: string,
): BuilderNavItem[] {
  return items.map((item) => ({
    ...item,
    href: item.pageId === pageId ? nextHref : item.href,
    children: item.children ? updateNavigationHref(item.children, pageId, nextHref) : item.children,
  }));
}

function applySeoPatch(
  existingSeo: BuilderSeoMetadata | undefined,
  payload: BuilderSeoMetadata,
  rawBody: unknown,
): BuilderSeoMetadata | undefined {
  const nextSeo: BuilderSeoMetadata = { ...(existingSeo ?? {}) };

  if (hasOwnKey(rawBody, 'title')) {
    if (payload.title) nextSeo.title = payload.title;
    else delete nextSeo.title;
  }

  if (hasOwnKey(rawBody, 'description')) {
    if (payload.description) nextSeo.description = payload.description;
    else delete nextSeo.description;
  }

  if (hasOwnKey(rawBody, 'ogTitle')) {
    if (payload.ogTitle) nextSeo.ogTitle = payload.ogTitle;
    else delete nextSeo.ogTitle;
  }

  if (hasOwnKey(rawBody, 'ogDescription')) {
    if (payload.ogDescription) nextSeo.ogDescription = payload.ogDescription;
    else delete nextSeo.ogDescription;
  }

  if (hasOwnKey(rawBody, 'ogImage')) {
    if (payload.ogImage) nextSeo.ogImage = payload.ogImage;
    else delete nextSeo.ogImage;
  }

  if (hasOwnKey(rawBody, 'twitterCard')) {
    if (payload.twitterCard) nextSeo.twitterCard = payload.twitterCard;
    else delete nextSeo.twitterCard;
  }

  if (hasOwnKey(rawBody, 'twitterTitle')) {
    if (payload.twitterTitle) nextSeo.twitterTitle = payload.twitterTitle;
    else delete nextSeo.twitterTitle;
  }

  if (hasOwnKey(rawBody, 'twitterDescription')) {
    if (payload.twitterDescription) nextSeo.twitterDescription = payload.twitterDescription;
    else delete nextSeo.twitterDescription;
  }

  if (hasOwnKey(rawBody, 'twitterImage')) {
    if (payload.twitterImage) nextSeo.twitterImage = payload.twitterImage;
    else delete nextSeo.twitterImage;
  }

  if (hasOwnKey(rawBody, 'canonical')) {
    if (payload.canonical) nextSeo.canonical = payload.canonical;
    else delete nextSeo.canonical;
  }

  if (hasOwnKey(rawBody, 'noIndex')) {
    if (payload.noIndex) nextSeo.noIndex = true;
    else delete nextSeo.noIndex;
  }

  if (hasOwnKey(rawBody, 'noFollow')) {
    if (payload.noFollow) nextSeo.noFollow = true;
    else delete nextSeo.noFollow;
  }

  if (hasOwnKey(rawBody, 'additionalMetaTags')) {
    if (payload.additionalMetaTags && payload.additionalMetaTags.length > 0) {
      nextSeo.additionalMetaTags = payload.additionalMetaTags;
    } else {
      delete nextSeo.additionalMetaTags;
    }
  }

  if (hasOwnKey(rawBody, 'structuredData')) {
    if (payload.structuredData) nextSeo.structuredData = payload.structuredData;
    else delete nextSeo.structuredData;
  }

  if (hasOwnKey(rawBody, 'overrideState')) {
    if (payload.overrideState && Object.keys(payload.overrideState).length > 0) nextSeo.overrideState = payload.overrideState;
    else delete nextSeo.overrideState;
  }

  if (hasOwnKey(rawBody, 'focusKeyword')) {
    if (payload.focusKeyword) nextSeo.focusKeyword = payload.focusKeyword;
    else delete nextSeo.focusKeyword;
  }

  if (hasOwnKey(rawBody, 'structuredDataBlocks')) {
    if (payload.structuredDataBlocks && payload.structuredDataBlocks.length > 0) {
      nextSeo.structuredDataBlocks = payload.structuredDataBlocks;
    } else {
      delete nextSeo.structuredDataBlocks;
    }
  }

  return Object.keys(nextSeo).length > 0 ? nextSeo : undefined;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  try {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const site = await readSiteDocument('default', locale);
    const page = site.pages.find((entry) => entry.pageId === params.pageId);

    if (!page) {
      return pageNotFoundResponse(params.pageId);
    }

    const siteUrl = getSiteUrl();
    const hreflang = buildHreflangAlternates(page, siteUrl, site.pages);
    const missingLocales = findMissingLocales(page, site.pages);
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
      seo: page.seo ?? {},
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
        page,
        site,
        seo: page.seo,
        siteUrl,
      }),
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    return unknownErrorResponse(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  try {
    const rawBody = await request.json();
    const { slug, seoPayload, rawSeoBody, createRedirect } = parseSeoRequest(rawBody);
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const site = await readSiteDocument('default', locale);
    const page = site.pages.find((entry) => entry.pageId === params.pageId);

    if (!page) {
      return pageNotFoundResponse(params.pageId);
    }

    const now = new Date().toISOString();
    const nextSeo = applySeoPatch(page.seo, seoPayload, rawSeoBody);
    const nextSlug = slug !== undefined ? slug : page.slug;
    const previousSlug = page.slug;
    const previousPath = buildSitePagePath(page.locale, previousSlug);
    const nextPath = buildSitePagePath(page.locale, page.isHomePage ? '' : nextSlug);
    const validation = validateBuilderPageSeo({
      page: { ...page, slug: nextSlug, seo: nextSeo },
      site,
      seo: nextSeo,
      slug: nextSlug,
      siteUrl: getSiteUrl(),
    });
    const blockers = validation.filter((issue) => issue.severity === 'blocker');

    if (blockers.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          error: 'validation_error',
          issues: blockers,
          validation,
        },
        { status: 400 },
      );
    }

    page.slug = nextSlug;
    page.seo = nextSeo;
    page.updatedAt = now;
    site.updatedAt = now;
    let redirectCreated = false;
    if (createRedirect && !page.isHomePage && previousPath !== nextPath) {
      const redirectInput = {
        from: previousPath,
        to: nextPath,
        type: 301 as const,
        isActive: true,
        note: `Auto-created after SEO slug change for ${page.pageId}`,
      };
      const redirectError = validateRedirectInput(redirectInput, site.redirects ?? []);
      if (!redirectError) {
        site.redirects = [
          ...(site.redirects ?? []),
          {
            redirectId: generateRedirectId(),
            ...redirectInput,
            createdAt: now,
            updatedAt: now,
          },
        ];
        redirectCreated = true;
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
      seo: page.seo ?? {},
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
    });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    return unknownErrorResponse(error);
  }
}
