import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  createComment,
  listComments,
  sanitizeCommentBody,
} from '@/lib/builder/collab/comments-store';

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
  const pageId = normalizeId(request.nextUrl.searchParams.get('pageId'));
  if (!pageId) return badRequest('Missing pageId');
  const includeResolved = request.nextUrl.searchParams.get('includeResolved') === '1';

  const comments = await listComments(siteId, pageId, includeResolved);
  return NextResponse.json({ ok: true, comments });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  let body: { siteId?: unknown; pageId?: unknown; nodeId?: unknown; body?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return badRequest('Invalid JSON body');
  }

  const siteId = normalizeId(body.siteId) ?? 'default';
  const pageId = normalizeId(body.pageId);
  if (!pageId) return badRequest('Missing pageId');
  const nodeId = body.nodeId === undefined || body.nodeId === null
    ? undefined
    : normalizeId(body.nodeId) ?? undefined;
  const text = sanitizeCommentBody(body.body);
  if (!text) return badRequest('Missing or empty body');

  const comment = await createComment({
    siteId,
    pageId,
    author: auth.username,
    body: text,
    nodeId,
  });
  return NextResponse.json({ ok: true, comment });
}