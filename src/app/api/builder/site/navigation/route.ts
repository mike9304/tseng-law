import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { normalizeLocale } from '@/lib/locales';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { guardMutation } from '@/lib/builder/security/guard';
import type { BuilderNavItem } from '@/lib/builder/site/types';
import { buildSitePagePath, normalizeSiteHref } from '@/lib/builder/site/paths';
import { resolveLocaleSlug } from '@/lib/builder/translations/locale-slug';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import {
  resolveBuilderSiteIdForMutationFromRequest,
  resolveBuilderSiteIdFromRequest,
} from '@/lib/builder/site/admin-routing';
import { upgradePublicHeaderNavigation } from '@/lib/builder/site/public-header-navigation';
import type { Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const NO_STORE_HEADERS = { 'Cache-Control': 'no-store' };

type NavigationRequestBody = {
  readonly siteId?: string;
  readonly navigation?: BuilderNavItem[];
  readonly locale?: string;
};

function errorResponse(
  locale: Locale,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode) },
    { status },
  );
}

function revalidateNavigationSurfaces(site: Awaited<ReturnType<typeof readSiteDocument>>, locale: ReturnType<typeof normalizeLocale>) {
  const paths = new Set<string>();
  const collectNavItems = (items: BuilderNavItem[]): BuilderNavItem[] => (
    items.flatMap((item) => [item, ...(item.children?.length ? collectNavItems(item.children) : [])])
  );

  for (const page of site.pages ?? []) {
    paths.add(buildSitePagePath(locale, page.isHomePage ? '' : resolveLocaleSlug(page, locale)));
  }

  for (const item of collectNavItems(site.navigation ?? [])) {
    const href = normalizeSiteHref(item.href, locale).split('#')[0]?.split('?')[0] ?? '';
    if (href.startsWith(`/${locale}`)) {
      paths.add(href || buildSitePagePath(locale, ''));
    }
  }

  for (const path of paths) {
    try {
      revalidatePath(path);
    } catch {
      // Best effort: local dev and tests still read the freshly written site document.
    }
  }
}

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteId = resolveBuilderSiteIdFromRequest(request);
  const site = upgradePublicHeaderNavigation(await readSiteDocument(siteId, locale));
  return NextResponse.json({ navigation: site.navigation }, { headers: NO_STORE_HEADERS });
}

export async function PUT(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  let body: NavigationRequestBody;
  try {
    body = (await request.json()) as NavigationRequestBody;
  } catch {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    return errorResponse(locale, 'invalid_json', 400);
  }

  const locale = normalizeLocale(body.locale || 'ko');
  const siteResolution = resolveBuilderSiteIdForMutationFromRequest(request, body.siteId);
  if (!siteResolution.ok) return siteResolution.response;
  const siteId = siteResolution.siteId;

  if (!Array.isArray(body.navigation)) {
    return errorResponse(locale, 'navigation_required', 400);
  }

  const site = await readSiteDocument(siteId, locale);
  site.navigation = body.navigation;
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site, { preserveMissingNavigation: false });
  revalidateNavigationSurfaces(site, locale);

  return NextResponse.json({ success: true, navigation: site.navigation }, { headers: NO_STORE_HEADERS });
}
