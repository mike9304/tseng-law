import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import { deletePage, readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import type { BuilderNavItem } from '@/lib/builder/site/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const updatePageSchema = z.object({
  title: z.string().trim().min(1).max(200),
  slug: z.string().trim().max(200).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase alphanumeric with hyphens').optional(),
}).strict();

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
  if (isHomePage) return '/';
  return `/${locale}/p/${slug}`.replace(/\/+$/, '');
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = guardMutation(request);
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
    const nextSlug = payload.slug ?? page.slug;

    page.title[locale] = payload.title;
    page.slug = nextSlug;
    page.updatedAt = now;
    site.updatedAt = now;
    site.navigation = updateNavigationHref(
      site.navigation,
      page.pageId,
      pageHref(page.locale, nextSlug, page.isHomePage),
    );

    await writeSiteDocument(site);

    return NextResponse.json({
      ok: true,
      page,
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
  const auth = guardMutation(request);
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
