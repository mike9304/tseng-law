import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  listActiveCursors,
  setCursor,
  type CursorPosition,
} from '@/lib/builder/collab/presence-cursors';
import {
  getBuilderCollabApiErrorPayload,
  type BuilderCollabApiErrorCode,
} from '@/lib/builder/collab/collab-api-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  normalizeCollabId,
  optionalCollabId,
  readJsonObject,
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

function projectCursor(cursor: CursorPosition): {
  userId: string;
  pageId: string;
  x: number;
  y: number;
  nodeId?: string;
  color: string;
  label: string;
  updatedAt: string;
} {
  return {
    userId: cursor.userId,
    pageId: cursor.pageId,
    x: cursor.x,
    y: cursor.y,
    nodeId: cursor.nodeId,
    color: cursor.color,
    label: cursor.label,
    updatedAt: new Date(cursor.updatedAt).toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;
  const locale = resolveLocale(request);

  const siteId = resolveCollabSiteIdFromRequest(request);
  const pageId = normalizeCollabId(request.nextUrl.searchParams.get('pageId'));
  if (!pageId) return badRequest(locale);

  try {
    const cursors = (await listActiveCursors(siteId, pageId)).map(projectCursor);
    return NextResponse.json({ ok: true, cursors });
  } catch (error) {
    console.error('[builder/collab/cursors] GET failed:', error);
    return errorResponse(locale, 'cursors_load_failed', 500);
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

  const siteId = resolveCollabSiteIdFromRequest(request, body.siteId);
  const pageId = normalizeCollabId(body.pageId);
  if (!pageId) return badRequest(locale);
  if (typeof body.x !== 'number' || typeof body.y !== 'number') {
    return badRequest(locale);
  }
  const nodeId = optionalCollabId(body.nodeId);
  const label = optionalCollabId(body.label);

  try {
    const cursor = await setCursor({
      siteId,
      userId: auth.username,
      pageId,
      x: body.x,
      y: body.y,
      nodeId,
      label,
    });
    const all = (await listActiveCursors(siteId, pageId)).map(projectCursor);
    return NextResponse.json({ ok: true, cursor: projectCursor(cursor), cursors: all });
  } catch (err) {
    console.error('[builder/collab/cursors] POST failed:', err);
    return errorResponse(locale, 'cursor_update_failed', 500);
  }
}
