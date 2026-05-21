import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import { deletePage, readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderNavItem, BuilderPageMeta } from '@/lib/builder/site/types';
import { buildSitePagePath } from '@/lib/builder/site/paths';
import {
  normalizeSeoSlugInput,
  validateBuilderPageSeo,
} from '@/lib/builder/seo/validation';
import { generateRedirectId, validateRedirectInput } from '@/lib/builder/site/redirects';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const updatePageSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().max(200).optional(),
  createRedirect: z.boolean().optional(),
}).strict();

interface RedirectCreationWarning {
  from: string;
  to: string;
  field: 'from' | 'to' | 'type';
  message: string;
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

function pageHref(locale: string, slug: string, isHomePage?: boolean): string {
  return buildSitePagePath(locale, isHomePage ? '' : slug);
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  try {
    const payload = updatePageSchema.parse(await request.json());
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    const site = await readSiteDocument('default', locale);
    const page = site.pages.find((entry) => entry.pageId === params.pageId);

    if (!page) {
      return NextResponse.json({ ok: false, error: 'Page not found' }, { status: 404 });
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
        { ok: false, error: 'validation_error', issues: blockers, validation },
        { status: 400 },
      );
    }

    page.title[locale] = payload.title;
    page.slug = nextSlug;
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
    if (error instanceof ZodError) return validationErrorResponse(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
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
      return NextResponse.json({ ok: false, error: 'Page not found' }, { status: 404 });
    }

    if (page.isHomePage) {
      return NextResponse.json({ ok: false, error: 'Home page cannot be deleted' }, { status: 400 });
    }

    await deletePage('default', params.pageId, locale);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
