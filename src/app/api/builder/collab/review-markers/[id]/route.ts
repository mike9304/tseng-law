import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteReviewMarker,
  isReviewMarkerKind,
  resolveReviewMarker,
  sanitizeMarkerText,
  unresolveReviewMarker,
  updateReviewMarker,
  type ReviewMarkerKind,
} from '@/lib/builder/collab/review-markers';
import {
  getBuilderCollabApiErrorPayload,
  type BuilderCollabApiErrorCode,
} from '@/lib/builder/collab/collab-api-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  normalizeCollabId,
  readJsonObject,
  resolveCollabSiteIdFromRequest,
} from '../../request-parsing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(
  locale: Locale,
  errorCode: BuilderCollabApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderCollabApiErrorPayload(locale, errorCode) },
    { status },
  );
}

function badRequest(locale: Locale): NextResponse {
  return errorResponse(locale, 'invalid_request', 400);
}

function notFound(locale: Locale): NextResponse {
  return errorResponse(locale, 'review_marker_not_found', 404);
}

function resolveLocale(request: NextRequest): Locale {
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

function requireSiteId(request: NextRequest): string {
  return resolveCollabSiteIdFromRequest(request);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;
  const locale = resolveLocale(request);

  const id = normalizeCollabId(params.id);
  if (!id) return badRequest(locale);
  const siteId = requireSiteId(request);

  let body: Record<string, unknown>;
  try {
    const parsed = await readJsonObject(request);
    if (!parsed) return badRequest(locale);
    body = parsed;
  } catch {
    return badRequest(locale);
  }

  try {
    if (body.action === 'resolve') {
      const updated = await resolveReviewMarker(siteId, id, auth.username);
      if (!updated) return notFound(locale);
      return NextResponse.json({ ok: true, marker: updated });
    }
    if (body.action === 'unresolve') {
      const updated = await unresolveReviewMarker(siteId, id);
      if (!updated) return notFound(locale);
      return NextResponse.json({ ok: true, marker: updated });
    }
    if (body.action === 'update' || body.action === undefined) {
      const patch: { text?: string; kind?: ReviewMarkerKind } = {};
      if (body.text !== undefined) {
        const cleaned = sanitizeMarkerText(body.text);
        if (!cleaned) return badRequest(locale);
        patch.text = cleaned;
      }
      if (body.kind !== undefined) {
        if (!isReviewMarkerKind(body.kind)) {
          return badRequest(locale);
        }
        patch.kind = body.kind;
      }
      if (patch.text === undefined && patch.kind === undefined) {
        return badRequest(locale);
      }
      const updated = await updateReviewMarker(siteId, id, patch);
      if (!updated) return notFound(locale);
      return NextResponse.json({ ok: true, marker: updated });
    }
  } catch (error) {
    console.error('[builder/collab/review-markers/:id] PATCH failed:', error);
    return errorResponse(locale, 'review_marker_update_failed', 500);
  }
  return badRequest(locale);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;
  const locale = resolveLocale(request);

  const id = normalizeCollabId(params.id);
  if (!id) return badRequest(locale);
  const siteId = requireSiteId(request);

  try {
    const deleted = await deleteReviewMarker(siteId, id);
    if (!deleted) return notFound(locale);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[builder/collab/review-markers/:id] DELETE failed:', error);
    return errorResponse(locale, 'review_marker_delete_failed', 500);
  }
}
