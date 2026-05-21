import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteReviewMarker,
  isReviewMarkerKind,
  resolveReviewMarker,
  sanitizeMarkerText,
  unresolveReviewMarker,
  updateReviewMarker,
} from '@/lib/builder/collab/review-markers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_ID_LEN = 200;

function badRequest(message: string): NextResponse {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

function notFound(): NextResponse {
  return NextResponse.json({ ok: false, error: 'Review marker not found' }, { status: 404 });
}

function normalizeId(value: string | null | undefined): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > MAX_ID_LEN) return null;
  return trimmed;
}

function requireSiteId(request: NextRequest): string {
  return normalizeId(request.nextUrl.searchParams.get('siteId')) ?? 'default';
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  const id = normalizeId(params.id);
  if (!id) return badRequest('Missing marker id');
  const siteId = requireSiteId(request);

  let body: { action?: unknown; text?: unknown; kind?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return badRequest('Invalid JSON body');
  }

  if (body.action === 'resolve') {
    const updated = await resolveReviewMarker(siteId, id, auth.username);
    if (!updated) return notFound();
    return NextResponse.json({ ok: true, marker: updated });
  }
  if (body.action === 'unresolve') {
    const updated = await unresolveReviewMarker(siteId, id);
    if (!updated) return notFound();
    return NextResponse.json({ ok: true, marker: updated });
  }
  if (body.action === 'update' || body.action === undefined) {
    const patch: { text?: string; kind?: import('@/lib/builder/collab/review-markers').ReviewMarkerKind } = {};
    if (body.text !== undefined) {
      const cleaned = sanitizeMarkerText(body.text);
      if (!cleaned) return badRequest('text must be a non-empty string');
      patch.text = cleaned;
    }
    if (body.kind !== undefined) {
      if (!isReviewMarkerKind(body.kind)) {
        return badRequest('kind must be "comment", "todo", or "approval"');
      }
      patch.kind = body.kind;
    }
    if (patch.text === undefined && patch.kind === undefined) {
      return badRequest('Nothing to update — provide text or kind, or use action=resolve/unresolve');
    }
    const updated = await updateReviewMarker(siteId, id, patch);
    if (!updated) return notFound();
    return NextResponse.json({ ok: true, marker: updated });
  }
  return badRequest('Unknown action — expected "resolve", "unresolve", or "update"');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  const id = normalizeId(params.id);
  if (!id) return badRequest('Missing marker id');
  const siteId = requireSiteId(request);

  const deleted = await deleteReviewMarker(siteId, id);
  if (!deleted) return notFound();
  return NextResponse.json({ ok: true });
}