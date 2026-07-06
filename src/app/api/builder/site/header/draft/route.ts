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
import { normalizeCanvasDocumentForSave } from '@/lib/builder/canvas/types';
import { buildSitePagePath, normalizeSiteHref } from '@/lib/builder/site/paths';
import { resolveLocaleSlug } from '@/lib/builder/translations/locale-slug';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import { resolveBuilderSiteIdFromRequest } from '@/lib/builder/site/admin-routing';

export const runtime = 'nodejs';

type GlobalHeaderDraftRequestBody = {
  readonly siteId?: string;
  readonly document?: unknown;
};

function revalidateGlobalHeaderSurfaces(
  site: Awaited<ReturnType<typeof readSiteDocument>>,
  locale: ReturnType<typeof normalizeLocale>,
) {
  const paths = new Set<string>();

  for (const page of site.pages ?? []) {
    paths.add(buildSitePagePath(locale, page.isHomePage ? '' : resolveLocaleSlug(page, locale)));
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

function errorResponse(
  locale: ReturnType<typeof normalizeLocale>,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json({ ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode) }, { status });
}

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteId = resolveBuilderSiteIdFromRequest(request);
  const draft = await readHeaderCanvas(siteId);
  if (!draft) {
    return errorResponse(locale, 'global_header_draft_not_found', 404);
  }
  return NextResponse.json({ ok: true, document: draft });
}

export async function PUT(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  let body: GlobalHeaderDraftRequestBody;
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  try {
    body = (await request.json()) as GlobalHeaderDraftRequestBody;
  } catch {
    return errorResponse(locale, 'invalid_json', 400);
  }

  const explicitSiteId = typeof body.siteId === 'string' ? body.siteId : null;
  const siteId = resolveBuilderSiteIdFromRequest(request, explicitSiteId);
  const normalized = normalizeCanvasDocumentForSave(body.document, locale);
  if (!normalized) {
    // Unrepairable payload: refuse instead of persisting the sandbox fallback
    // over the saved canvas (F15/R1 data-loss shape).
    return errorResponse(locale, 'draft_document_invalid', 400);
  }

  await writeHeaderCanvas(siteId, normalized);
  // Make sure the site doc references this canvas, so the public-page
  // resolver can detect that the global header has been authored.
  await ensureGlobalHeaderFooterIds(siteId, locale);
  const site = await readSiteDocument(siteId, locale);
  revalidateGlobalHeaderSurfaces(site, locale);

  return NextResponse.json({ ok: true, document: normalized });
}
