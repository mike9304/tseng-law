import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { normalizeLocale } from '@/lib/locales';
import { readSiteDocument, writeSiteDocument } from '@/lib/builder/site/persistence';
import { guardMutation } from '@/lib/builder/security/guard';
import type { BuilderNavItem } from '@/lib/builder/site/types';
import { buildSitePagePath, normalizeSiteHref } from '@/lib/builder/site/paths';

export const runtime = 'nodejs';

function revalidateNavigationSurfaces(site: Awaited<ReturnType<typeof readSiteDocument>>, locale: ReturnType<typeof normalizeLocale>) {
  const paths = new Set<string>();

  for (const page of site.pages ?? []) {
    paths.add(buildSitePagePath(locale, page.slug || ''));
  }

  for (const item of site.navigation ?? []) {
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
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const site = await readSiteDocument('default', locale);
  return NextResponse.json({ navigation: site.navigation });
}

export async function PUT(request: NextRequest) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  let body: { navigation?: BuilderNavItem[]; locale?: string };
  try {
    body = (await request.json()) as { navigation?: BuilderNavItem[]; locale?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const locale = normalizeLocale(body.locale || 'ko');

  if (!Array.isArray(body.navigation)) {
    return NextResponse.json({ error: 'navigation array required' }, { status: 400 });
  }

  const site = await readSiteDocument('default', locale);
  site.navigation = body.navigation;
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site);
  revalidateNavigationSurfaces(site, locale);

  return NextResponse.json({ success: true, navigation: site.navigation });
}
