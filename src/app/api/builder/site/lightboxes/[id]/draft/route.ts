import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  readLightboxCanvas,
  writeLightboxCanvas,
} from '@/lib/builder/site/persistence';
import {
  resolveBuilderSiteIdForMutationFromRequest,
  resolveBuilderSiteIdFromRequest,
} from '@/lib/builder/site/admin-routing';
import { normalizeLocale } from '@/lib/locales';
import { normalizeCanvasDocumentForSave } from '@/lib/builder/canvas/types';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import type { Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteId = resolveBuilderSiteIdFromRequest(request);
  const draft = await readLightboxCanvas(siteId, params.id);
  if (!draft) {
    return errorResponse(locale, 'lightbox_draft_not_found', 404);
  }
  return NextResponse.json({ ok: true, document: draft });
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  let body: { document?: unknown; siteId?: unknown };
  try {
    body = (await request.json()) as { document?: unknown; siteId?: unknown };
  } catch {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    return errorResponse(locale, 'invalid_json', 400);
  }

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteResolution = resolveBuilderSiteIdForMutationFromRequest(request, body.siteId);
  if (!siteResolution.ok) return siteResolution.response;
  const siteId = siteResolution.siteId;
  const normalized = normalizeCanvasDocumentForSave(body.document, locale);
  if (!normalized) {
    // Unrepairable payload: refuse instead of persisting the sandbox fallback
    // over the saved canvas (F15/R1 data-loss shape).
    return errorResponse(locale, 'draft_document_invalid', 400);
  }

  await writeLightboxCanvas(siteId, params.id, normalized);

  return NextResponse.json({ ok: true, document: normalized });
}
