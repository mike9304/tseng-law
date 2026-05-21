import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  heartbeat,
  listActive,
  type PresenceEntry,
} from '@/lib/builder/collab/presence-store';

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
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;

  const siteId = normalizeId(request.nextUrl.searchParams.get('siteId')) ?? 'default';
  const pageId = normalizeId(request.nextUrl.searchParams.get('pageId'));
  if (!pageId) return badRequest('Missing pageId');

  const active = listActive(siteId, pageId).map(projectEntry);
  return NextResponse.json({ ok: true, active });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  let body: { siteId?: unknown; pageId?: unknown; sessionId?: unknown; nodeId?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return badRequest('Invalid JSON body');
  }

  const siteId = normalizeId(body.siteId) ?? 'default';
  const pageId = normalizeId(body.pageId);
  const sessionId = normalizeId(body.sessionId);
  if (!pageId) return badRequest('Missing pageId');
  if (!sessionId) return badRequest('Missing sessionId');
  const nodeId = body.nodeId === undefined || body.nodeId === null
    ? undefined
    : normalizeId(body.nodeId) ?? undefined;

  const entry = heartbeat(siteId, pageId, sessionId, {
    username: auth.username,
    nodeId,
  });

  return NextResponse.json({
    ok: true,
    entry: projectEntry(entry),
    active: listActive(siteId, pageId).map(projectEntry),
  });
}