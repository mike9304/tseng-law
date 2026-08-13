import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  createReviewMarker,
  isReviewMarkerKind,
  listReviewMarkers,
  sanitizeMarkerText,
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
  resolveCollabMutationSiteIdFromRequest,
  resolveCollabSiteIdFromRequest,
} from '../request-parsing';

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

function resolveLocale(request: NextRequest): Locale {
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'view-cms');
  if (auth instanceof NextResponse) return auth;
  const locale = resolveLocale(request);

  const siteId = resolveCollabSiteIdFromRequest(request);
  const pageId = normalizeCollabId(request.nextUrl.searchParams.get('pageId')) ?? undefined;
  const nodeId = normalizeCollabId(request.nextUrl.searchParams.get('nodeId')) ?? undefined;
  const rawKind = request.nextUrl.searchParams.get('kind');
  const kind: ReviewMarkerKind | undefined = isReviewMarkerKind(rawKind) ? rawKind : undefined;
  const includeResolved = request.nextUrl.searchParams.get('includeResolved') === '1';

  try {
    const markers = await listReviewMarkers(siteId, {
      pageId,
      nodeId,
      kind,
      includeResolved,
    });
    return NextResponse.json({ ok: true, markers });
  } catch (error) {
    console.error('[builder/collab/review-markers] GET failed:', error);
    return errorResponse(locale, 'review_markers_load_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;
  const locale = resolveLocale(request);

  let body: Record<string, unknown>;
  try {
    const parsed = await readJsonObject(request);
    if (!parsed) return badRequest(locale);
    body = parsed;
  } catch {
    return badRequest(locale);
  }

  const siteResolution = resolveCollabMutationSiteIdFromRequest(request, body.siteId);
  if (!siteResolution.ok) return siteResolution.response;
  const siteId = siteResolution.siteId;
  const pageId = normalizeCollabId(body.pageId);
  const nodeId = normalizeCollabId(body.nodeId);
  if (!pageId) return badRequest(locale);
  if (!nodeId) return badRequest(locale);
  if (!isReviewMarkerKind(body.kind)) {
    return badRequest(locale);
  }
  const text = sanitizeMarkerText(body.text);
  if (!text) return badRequest(locale);

  try {
    const marker = await createReviewMarker({
      siteId,
      pageId,
      nodeId,
      kind: body.kind,
      text,
      createdBy: auth.username,
    });
    return NextResponse.json({ ok: true, marker });
  } catch (err) {
    console.error('[builder/collab/review-markers] POST failed:', err);
    return errorResponse(locale, 'review_marker_create_failed', 500);
  }
}
