import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { locales } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import { deletePage, readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderMemberAccessMeta, BuilderNavItem, BuilderPageMeta } from '@/lib/builder/site/types';
import { buildSitePagePath } from '@/lib/builder/site/paths';
import {
  normalizeSeoSlugInput,
  validateBuilderPageSeo,
} from '@/lib/builder/seo/validation';
import { generateRedirectId, validateRedirectInput } from '@/lib/builder/site/redirects';
import { isLocaleSlugConflict } from '@/lib/builder/translations/locale-slug';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import { resolveBuilderSiteIdForMutationFromRequest } from '@/lib/builder/site/admin-routing';
import { SiteInvariantError, type SiteInvariantIssue } from '@/lib/builder/site/site-invariants';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const memberRoleSchema = z.enum(['free', 'premium', 'admin']);
const memberAccessSchema = z.object({
  requireLogin: z.literal(true),
  allowedRoles: z.array(memberRoleSchema).max(3).optional(),
  redirectPath: z.string().trim().max(500).regex(/^\//).optional(),
}).strict();

const updatePageSchema = z.object({
  siteId: z.string().trim().min(1).max(120).optional(),
  title: z.string().trim().min(1).max(200).optional(),
  slug: z.string().trim().max(200).optional(),
  slugByLocale: z.record(z.string().trim().max(200), z.string().trim().max(200)).optional(),
  createRedirect: z.boolean().optional(),
  memberAccess: memberAccessSchema.nullable().optional(),
}).strict();

interface RedirectCreationWarning {
  from: string;
  to: string;
  field: 'from' | 'to' | 'type';
  message: string;
}

class PageRouteError extends Error {
  constructor(
    readonly errorCode: BuilderSiteApiErrorCode,
    readonly status: number,
    readonly extra: Record<string, unknown> = {},
  ) {
    super(errorCode);
  }
}

function errorResponse(
  locale: Locale,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
  extra: Record<string, unknown> = {},
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getBuilderSiteApiErrorPayload(locale, errorCode),
      ...extra,
    },
    { status },
  );
}

function validationErrorResponse(locale: Locale, error: ZodError): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getBuilderSiteApiErrorPayload(locale, 'validation_error'),
      issues: error.flatten(),
    },
    { status: 400 },
  );
}

function sanitizeSiteInvariantIssues(issues: readonly SiteInvariantIssue[]) {
  return issues.map((issue) => ({
    code: issue.code,
    ...(issue.pageId !== undefined ? { pageId: issue.pageId } : {}),
    ...(issue.conflictingPageId !== undefined ? { conflictingPageId: issue.conflictingPageId } : {}),
    ...(issue.locale !== undefined ? { locale: issue.locale } : {}),
    ...(issue.slug !== undefined ? { slug: issue.slug } : {}),
    ...(issue.field !== undefined ? { field: issue.field } : {}),
  }));
}

function siteInvariantConflictResponse(
  locale: Locale,
  error: SiteInvariantError,
  operationErrorCode: 'page_update_failed' | 'page_delete_failed',
): NextResponse {
  const copy = getBuilderSiteApiErrorPayload(locale, operationErrorCode);
  return NextResponse.json(
    {
      ok: false,
      success: false,
      error: copy.error,
      errorCode: 'site_invariant_conflict',
      issues: sanitizeSiteInvariantIssues(error.issues),
    },
    { status: 409 },
  );
}

function pageHref(locale: string, slug: string, isHomePage?: boolean): string {
  return buildSitePagePath(locale, isHomePage ? '' : slug);
}

function normalizeLocalizedSlugs(
  input: Record<string, string> | undefined,
  page: BuilderPageMeta,
  site: Awaited<ReturnType<typeof readSiteDocument>>,
): Partial<Record<(typeof locales)[number], string>> | null {
  if (!input) return null;
  const out: Partial<Record<(typeof locales)[number], string>> = {};
  for (const [rawLocale, rawValue] of Object.entries(input)) {
    if (!locales.includes(rawLocale as (typeof locales)[number])) continue;
    const locale = rawLocale as (typeof locales)[number];
    const value = normalizeSeoSlugInput(rawValue);
    if (value === '') continue;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/.test(value)) {
      throw new PageRouteError('localized_slug_invalid', 400);
    }
    if (isLocaleSlugConflict(site.pages, locale, value, page.pageId)) {
      throw new PageRouteError('localized_slug_duplicate', 409);
    }
    out[locale] = value;
  }
  return Object.keys(out).length > 0 ? out : null;
}

function updateNavigationPageReference(
  items: BuilderNavItem[],
  page: BuilderPageMeta,
  nextHref: string,
): BuilderNavItem[] {
  return items.map((item) => ({
    ...item,
    href: item.pageId === page.pageId ? nextHref : item.href,
    label: item.pageId === page.pageId && item.id === `nav-${page.pageId}` ? page.title : item.label,
    children: item.children ? updateNavigationPageReference(item.children, page, nextHref) : item.children,
  }));
}

function normalizeMemberAccessPatch(memberAccess: z.infer<typeof memberAccessSchema>): BuilderMemberAccessMeta {
  const allowedRoles = Array.from(new Set(memberAccess.allowedRoles ?? []));
  return {
    requireLogin: true,
    ...(allowedRoles.length > 0 ? { allowedRoles } : {}),
    ...(memberAccess.redirectPath ? { redirectPath: memberAccess.redirectPath } : {}),
  };
}

function appendRedirectIfValid(
  site: Awaited<ReturnType<typeof readSiteDocument>>,
  input: {
    from: string;
    to: string;
    type: 301;
    isActive: true;
    note: string;
  },
  now: string,
): { created: boolean; warning?: RedirectCreationWarning } {
  const redirectError = validateRedirectInput(input, site.redirects ?? []);
  if (redirectError) {
    return {
      created: false,
      warning: {
        from: input.from,
        to: input.to,
        field: redirectError.field,
        message: redirectError.message,
      },
    };
  }
  site.redirects = [
    ...(site.redirects ?? []),
    {
      redirectId: generateRedirectId(),
      ...input,
      createdAt: now,
      updatedAt: now,
    },
  ];
  return { created: true };
}

export async function PATCH(request: NextRequest, props: { params: Promise<{ pageId: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');

  try {
    const rawPayload: unknown = await request.json();
    const explicitSiteId = rawPayload && typeof rawPayload === 'object' && !Array.isArray(rawPayload)
      ? (rawPayload as Record<string, unknown>).siteId
      : undefined;
    const siteResolution = resolveBuilderSiteIdForMutationFromRequest(request, explicitSiteId);
    if (!siteResolution.ok) return siteResolution.response;
    const siteId = siteResolution.siteId;
    const payload = updatePageSchema.parse(rawPayload);
    const site = await readSiteDocument(siteId, locale);
    const page = site.pages.find((entry) => entry.pageId === params.pageId);

    if (!page) {
      return errorResponse(locale, 'page_not_found', 404);
    }

    const now = new Date().toISOString();
    const nextSlug = payload.slug !== undefined ? normalizeSeoSlugInput(payload.slug) : page.slug;
    const previousSlug = page.slug;
    const previousPath = pageHref(page.locale, previousSlug, page.isHomePage);
    const nextPath = pageHref(page.locale, nextSlug, page.isHomePage);
    const validation = validateBuilderPageSeo({
      page: { ...page, slug: nextSlug },
      site,
      slug: nextSlug,
    });
    const blockers = validation.filter((issue) => issue.severity === 'blocker');

    if (blockers.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          ...getBuilderSiteApiErrorPayload(locale, 'validation_error'),
          issues: blockers,
          validation,
        },
        { status: 400 },
      );
    }

    if (payload.title !== undefined) {
      page.title[locale] = payload.title;
    }
    page.slug = nextSlug;
    if (payload.slugByLocale !== undefined) {
      const nextSlugByLocale = normalizeLocalizedSlugs(payload.slugByLocale, page, site);
      if (nextSlugByLocale) {
        page.slugByLocale = {
          ...(page.slugByLocale ?? {}),
          ...nextSlugByLocale,
        };
      } else {
        delete page.slugByLocale;
      }
    }
    if (payload.memberAccess !== undefined) {
      if (payload.memberAccess === null) {
        delete page.memberAccess;
      } else {
        page.memberAccess = normalizeMemberAccessPatch(payload.memberAccess);
      }
    }
    page.updatedAt = now;
    site.updatedAt = now;
    let redirectCreated = false;
    const redirectWarnings: RedirectCreationWarning[] = [];
    if (payload.createRedirect === true && !page.isHomePage && previousPath !== nextPath) {
      const exactRedirect = appendRedirectIfValid(site, {
        from: previousPath,
        to: nextPath,
        type: 301 as const,
        isActive: true,
        note: `Auto-created after page slug change for ${page.pageId}`,
      }, now);
      redirectCreated = exactRedirect.created || redirectCreated;
      if (exactRedirect.warning) redirectWarnings.push(exactRedirect.warning);

      if (page.dynamicItem) {
        const wildcardRedirect = appendRedirectIfValid(site, {
          from: `${previousPath}/*`,
          to: `${nextPath}/*`,
          type: 301 as const,
          isActive: true,
          note: `Auto-created for dynamic item URLs after page slug change for ${page.pageId}`,
        }, now);
        redirectCreated = wildcardRedirect.created || redirectCreated;
        if (wildcardRedirect.warning) redirectWarnings.push(wildcardRedirect.warning);
      }
    }
    site.navigation = updateNavigationPageReference(
      site.navigation,
      page,
      pageHref(page.locale, nextSlug, page.isHomePage),
    );

    await writeSiteDocument(site);

    return NextResponse.json({
      ok: true,
      page,
      redirectCreated,
      redirectWarnings,
    });
  } catch (error) {
    if (error instanceof PageRouteError) {
      return errorResponse(locale, error.errorCode, error.status, error.extra);
    }
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(locale, 'invalid_json', 400);
    }
    if (error instanceof SiteInvariantError) {
      return siteInvariantConflictResponse(locale, error, 'page_update_failed');
    }
    return errorResponse(locale, 'page_update_failed', 500);
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ pageId: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteResolution = resolveBuilderSiteIdForMutationFromRequest(request);
  if (!siteResolution.ok) return siteResolution.response;
  const siteId = siteResolution.siteId;

  try {
    const site = await readSiteDocument(siteId, locale);
    const page = site.pages.find((entry) => entry.pageId === params.pageId);

    if (!page) {
      return errorResponse(locale, 'page_not_found', 404);
    }

    if (page.isHomePage) {
      return errorResponse(locale, 'home_page_delete_blocked', 400);
    }

    await deletePage(siteId, params.pageId, locale);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof SiteInvariantError) {
      return siteInvariantConflictResponse(locale, error, 'page_delete_failed');
    }
    return errorResponse(locale, 'page_delete_failed', 500);
  }
}
