import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  heartbeat,
  listActive,
  type PresenceEntry,
} from '@/lib/builder/collab/presence-store';
import {
  getBuilderCollabApiErrorPayload,
  type BuilderCollabApiErrorCode,
} from '@/lib/builder/collab/collab-api-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  normalizeCollabId,
  optionalCollabId,
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

function projectEntry(entry: PresenceEntry): {
  sessionId: string;
  username: string;
  color: string;
  lastSeenAt: string;
  nodeId?: string;
} {
  return {
    sessionId: entry.sessionId,
    username: entry.username,
    color: entry.color,
    lastSeenAt: new Date(entry.lastSeenAt).toISOString(),
    nodeId: entry.nodeId,
  };
}

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'view-cms');
  if (auth instanceof NextResponse) return auth;
  const locale = resolveLocale(request);

  const siteId = resolveCollabSiteIdFromRequest(request);
  const pageId = normalizeCollabId(request.nextUrl.searchParams.get('pageId'));
  if (!pageId) return badRequest(locale);

  try {
    const active = listActive(siteId, pageId).map(projectEntry);
    return NextResponse.json({ ok: true, active });
  } catch (error) {
    console.error('[builder/collab/presence] GET failed:', error);
    return errorResponse(locale, 'presence_load_failed', 500);
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
  const sessionId = normalizeCollabId(body.sessionId);
  if (!pageId) return badRequest(locale);
  if (!sessionId) return badRequest(locale);
  const nodeId = optionalCollabId(body.nodeId);

  try {
    const entry = heartbeat(siteId, pageId, sessionId, {
      username: auth.username,
      nodeId,
    });

    return NextResponse.json({
      ok: true,
      entry: projectEntry(entry),
      active: listActive(siteId, pageId).map(projectEntry),
    });
  } catch (error) {
    console.error('[builder/collab/presence] POST failed:', error);
    return errorResponse(locale, 'presence_update_failed', 500);
  }
}
