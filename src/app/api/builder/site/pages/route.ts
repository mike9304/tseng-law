import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { normalizeLocale } from '@/lib/locales';
import { listPages, createPage, readPageCanvas, readSiteDocument, writePageCanvas, writeSiteDocument } from '@/lib/builder/site/persistence';
import { normalizeCanvasDocument, createDefaultCanvasDocument, createBlankCanvasDocument } from '@/lib/builder/canvas/types';
import { guardMutation } from '@/lib/builder/security/guard';
import type { BuilderNavItem } from '@/lib/builder/site/types';
import { buildSitePagePath } from '@/lib/builder/site/paths';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const pages = await listPages('default', locale);
  return NextResponse.json({ pages });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  let body: {
    slug?: string;
    title?: string;
    locale?: string;
    document?: unknown;
    linkedFromPageId?: string;
    blank?: boolean;
    addToNavigation?: boolean;
  };
  try {
    body = (await request.json()) as {
      slug?: string;
      title?: string;
      locale?: string;
      document?: unknown;
      linkedFromPageId?: string;
      blank?: boolean;
      addToNavigation?: boolean;
    };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const locale = normalizeLocale(body.locale || 'ko');
  const rawSlug = body.slug?.trim() || '';
  const slug = rawSlug || `page-${Date.now().toString(36)}`;
  const title = body.title?.trim() || 'New Page';

  if (slug.length > 200 || (rawSlug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))) {
    return NextResponse.json({ error: 'Invalid slug: lowercase alphanumeric with hyphens only' }, { status: 400 });
  }

  const site = await readSiteDocument('default', locale);
  const duplicate = site.pages.find((entry) => entry.locale === locale && entry.slug === slug);
  if (duplicate) {
    return NextResponse.json(
      {
        success: false,
        error: 'duplicate_slug',
        message: 'A page with this slug already exists.',
        pageId: duplicate.pageId,
      },
      { status: 409 },
    );
  }

  const page = await createPage('default', locale, slug, title);

  if (body.linkedFromPageId) {
    const nextSite = await readSiteDocument('default', locale);
    const sourcePage = nextSite.pages.find((entry) => entry.pageId === body.linkedFromPageId);
    const createdPage = nextSite.pages.find((entry) => entry.pageId === page.pageId);
    if (sourcePage && createdPage) {
      sourcePage.linkedPageIds = { ...(sourcePage.linkedPageIds ?? {}), [locale]: page.pageId };
      createdPage.linkedPageIds = {
        ...(createdPage.linkedPageIds ?? {}),
        [sourcePage.locale]: sourcePage.pageId,
      };
      createdPage.title = { ...sourcePage.title, [locale]: title };
      nextSite.updatedAt = new Date().toISOString();
      await writeSiteDocument(nextSite);
    }
  }

  if (body.addToNavigation === true) {
    const nextSite = await readSiteDocument('default', locale);
    const createdPage = nextSite.pages.find((entry) => entry.pageId === page.pageId);
    if (createdPage) {
      const href = buildSitePagePath(locale, createdPage.slug || '');
      const hasNavigationItem = (items: BuilderNavItem[]): boolean => items.some((item) => (
        item.pageId === createdPage.pageId
        || item.href === href
        || Boolean(item.children?.length && hasNavigationItem(item.children))
      ));
      if (!hasNavigationItem(nextSite.navigation ?? [])) {
        nextSite.navigation = [
          ...(nextSite.navigation ?? []),
          {
            id: `nav-${createdPage.pageId}`,
            label: createdPage.title,
            pageId: createdPage.pageId,
            href,
          },
        ];
        nextSite.updatedAt = new Date().toISOString();
        await writeSiteDocument(nextSite);
        try {
          revalidatePath(buildSitePagePath(locale, ''));
          revalidatePath(href);
        } catch {
          // Best effort: local dev and tests read the latest site document directly.
        }
      }
    }
  }

  // Save the initial canvas document (template or blank)
  const sourceCanvas = body.linkedFromPageId
    ? await readPageCanvas('default', body.linkedFromPageId, 'draft')
    : null;
  const canvasDoc = body.document
    ? normalizeCanvasDocument(body.document, locale)
    : body.blank
      ? createBlankCanvasDocument(locale)
    : sourceCanvas
      ? normalizeCanvasDocument({ ...sourceCanvas, locale }, locale)
      : createDefaultCanvasDocument(locale);
  await writePageCanvas('default', page.pageId, 'draft', canvasDoc);

  return NextResponse.json({ success: true, pageId: page.pageId, page });
}
