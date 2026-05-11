import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  ensureGlobalHeaderFooterIds,
  readHeaderCanvas,
  readSiteDocument,
  writeHeaderCanvas,
} from '@/lib/builder/site/persistence';
import { normalizeLocale } from '@/lib/locales';
import { normalizeCanvasDocument } from '@/lib/builder/canvas/types';
import { buildSitePagePath, normalizeSiteHref } from '@/lib/builder/site/paths';

export const runtime = 'nodejs';

function revalidateGlobalHeaderSurfaces(
  site: Awaited<ReturnType<typeof readSiteDocument>>,
  locale: ReturnType<typeof normalizeLocale>,
) {
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
      // Best effort: local dev and tests still read the freshly written header canvas.
    }
  }
}
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const draft = await readHeaderCanvas('default');
  if (!draft) {
    return NextResponse.json({ ok: false, error: 'Global header canvas not found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, document: draft });
}

export async function PUT(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  let body: { document?: unknown };
  try {
    body = (await request.json()) as { document?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const normalized = normalizeCanvasDocument(body.document, locale);

  await writeHeaderCanvas('default', normalized);
  // Make sure the site doc references this canvas, so the public-page
  // resolver can detect that the global header has been authored.
  await ensureGlobalHeaderFooterIds('default', locale);
  const site = await readSiteDocument('default', locale);
  revalidateGlobalHeaderSurfaces(site, locale);

  return NextResponse.json({ ok: true, document: normalized });
}
