import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  createReviewMarker,
  isReviewMarkerKind,
  listReviewMarkers,
  sanitizeMarkerText,
  type ReviewMarkerKind,
} from '@/lib/builder/collab/review-markers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_ID_LEN = 200;

function badRequest(message: string): NextResponse {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

function normalizeId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > MAX_ID_LEN) return null;
  return trimmed;
}

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;

  const siteId = normalizeId(request.nextUrl.searchParams.get('siteId')) ?? 'default';
  const pageId = normalizeId(request.nextUrl.searchParams.get('pageId')) ?? undefined;
  const nodeId = normalizeId(request.nextUrl.searchParams.get('nodeId')) ?? undefined;
  const rawKind = request.nextUrl.searchParams.get('kind');
  const kind: ReviewMarkerKind | undefined = isReviewMarkerKind(rawKind) ? rawKind : undefined;
  const includeResolved = request.nextUrl.searchParams.get('includeResolved') === '1';

  const markers = await listReviewMarkers(siteId, {
    pageId,
    nodeId,
    kind,
    includeResolved,
  });
  return NextResponse.json({ ok: true, markers });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  let body: {
    siteId?: unknown;
    pageId?: unknown;
    nodeId?: unknown;
    kind?: unknown;
    text?: unknown;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return badRequest('Invalid JSON body');
  }

  const siteId = normalizeId(body.siteId) ?? 'default';
  const pageId = normalizeId(body.pageId);
  const nodeId = normalizeId(body.nodeId);
  if (!pageId) return badRequest('Missing pageId');
  if (!nodeId) return badRequest('Missing nodeId');
  if (!isReviewMarkerKind(body.kind)) {
    return badRequest('kind must be "comment", "todo", or "approval"');
  }
  const text = sanitizeMarkerText(body.text);
  if (!text) return badRequest('Missing or empty text');

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
    return badRequest(err instanceof Error ? err.message : 'Failed to create marker');
  }
}