/**
 * POST /api/builder/site/publish-checks
 *
 * Runs the publish gate against a `BuilderCanvasDocument` (canvas-scene-vnext
 * world). Accepts the document either inline (request body) or falls back to
 * the persisted draft for the supplied pageId.
 *
 * Body shape (all optional except siteId/pageId/locale):
 *   {
 *     siteId: string;          // defaults to 'default'
 *     pageId: string;
 *     locale?: 'ko' | 'zh-hant' | 'en';
 *     document?: BuilderCanvasDocument;  // inline; otherwise read from disk
 *   }
 *
 * Response:
 *   { ok: true, suite: PublishCheckSuite }
 *   { ok: false, error: string }
 */
import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale } from '@/lib/locales';
import { runAllChecks } from '@/lib/builder/publish-gate/gate-runner';
import { readPageCanvas, readSiteDocument } from '@/lib/builder/site/persistence';
import { guardMutation } from '@/lib/builder/security/guard';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';

export const runtime = 'nodejs';

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'publish' });
  if (auth instanceof NextResponse) return auth;

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const siteId = typeof body.siteId === 'string' && body.siteId.trim() ? body.siteId.trim() : 'default';
  const pageId = typeof body.pageId === 'string' && body.pageId.trim() ? body.pageId.trim() : null;
  const locale = normalizeLocale(
    typeof body.locale === 'string' ? body.locale : request.nextUrl.searchParams.get('locale') ?? undefined,
  );

  if (!pageId) return badRequest('pageId is required.');

  // Resolve canvas document
  let canvas: BuilderCanvasDocument | null = null;
  if (body.document && typeof body.document === 'object') {
    canvas = body.document as BuilderCanvasDocument;
  } else {
    canvas = await readPageCanvas(siteId, pageId, 'draft');
  }
  if (!canvas) {
    return NextResponse.json({ ok: false, error: 'Draft canvas not found.' }, { status: 404 });
  }

  // Resolve page + site for SEO + slug-based link checks
  const site = await readSiteDocument(siteId, locale).catch(() => null);
  const page = site?.pages.find((p) => p.pageId === pageId) ?? null;

  const suite = await runAllChecks(canvas, page, site);
  return NextResponse.json({ ok: true, suite });
}
