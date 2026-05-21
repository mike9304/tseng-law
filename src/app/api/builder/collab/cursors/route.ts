import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  listActiveCursors,
  setCursor,
  type CursorPosition,
} from '@/lib/builder/collab/presence-cursors';

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

  const siteId = normalizeId(request.nextUrl.searchParams.get('siteId')) ?? 'default';
  const pageId = normalizeId(request.nextUrl.searchParams.get('pageId'));
  if (!pageId) return badRequest('Missing pageId');

  const cursors = (await listActiveCursors(siteId, pageId)).map(projectCursor);
  return NextResponse.json({ ok: true, cursors });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  let body: {
    siteId?: unknown;
    pageId?: unknown;
    x?: unknown;
    y?: unknown;
    nodeId?: unknown;
    label?: unknown;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return badRequest('Invalid JSON body');
  }

  const siteId = normalizeId(body.siteId) ?? 'default';
  const pageId = normalizeId(body.pageId);
  if (!pageId) return badRequest('Missing pageId');
  if (typeof body.x !== 'number' || typeof body.y !== 'number') {
    return badRequest('x and y must be numbers');
  }
  const nodeId = body.nodeId === undefined || body.nodeId === null
    ? undefined
    : normalizeId(body.nodeId) ?? undefined;
  const label = body.label === undefined || body.label === null
    ? undefined
    : normalizeId(body.label) ?? undefined;

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
    return badRequest(err instanceof Error ? err.message : 'Failed to set cursor');
  }
}