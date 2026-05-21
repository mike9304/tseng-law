import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteComment,
  reopenComment,
  resolveComment,
} from '@/lib/builder/collab/comments-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_ID_LEN = 200;

function badRequest(message: string): NextResponse {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

function notFound(): NextResponse {
  return NextResponse.json({ ok: false, error: 'Comment not found' }, { status: 404 });
}

function normalizeId(value: string | null | undefined): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > MAX_ID_LEN) return null;
  return trimmed;
}

function requireQuery(request: NextRequest): { siteId: string; pageId: string } | NextResponse {
  const siteId = normalizeId(request.nextUrl.searchParams.get('siteId')) ?? 'default';
  const pageId = normalizeId(request.nextUrl.searchParams.get('pageId'));
  if (!pageId) return badRequest('Missing pageId');
  return { siteId, pageId };
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  const id = normalizeId(params.id);
  if (!id) return badRequest('Missing comment id');

  const query = requireQuery(request);
  if (query instanceof NextResponse) return query;

  let body: { action?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return badRequest('Invalid JSON body');
  }

  if (body.action === 'resolve') {
    const updated = await resolveComment(query.siteId, query.pageId, id);
    if (!updated) return notFound();
    return NextResponse.json({ ok: true, comment: updated });
  }
  if (body.action === 'reopen') {
    const updated = await reopenComment(query.siteId, query.pageId, id);
    if (!updated) return notFound();
    return NextResponse.json({ ok: true, comment: updated });
  }
  return badRequest('Unknown action — expected "resolve" or "reopen"');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  const id = normalizeId(params.id);
  if (!id) return badRequest('Missing comment id');

  const query = requireQuery(request);
  if (query instanceof NextResponse) return query;

  const deleted = await deleteComment(query.siteId, query.pageId, id);
  if (!deleted) return notFound();
  return NextResponse.json({ ok: true });
}