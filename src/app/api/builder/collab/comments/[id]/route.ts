import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  assignComment,
  deleteComment,
  reopenComment,
  resolveComment,
} from '@/lib/builder/collab/comments-store';
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
  return errorResponse(locale, 'comment_not_found', 404);
}

function resolveLocale(request: NextRequest): Locale {
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

function requireQuery(request: NextRequest, locale: Locale): { siteId: string; pageId: string } | NextResponse {
  const siteId = resolveCollabSiteIdFromRequest(request);
  const pageId = normalizeCollabId(request.nextUrl.searchParams.get('pageId'));
  if (!pageId) return badRequest(locale);
  return { siteId, pageId };
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

  const query = requireQuery(request, locale);
  if (query instanceof NextResponse) return query;

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
      const updated = await resolveComment(query.siteId, query.pageId, id, auth.username);
      if (!updated) return notFound(locale);
      return NextResponse.json({ ok: true, comment: updated });
    }
    if (body.action === 'reopen') {
      const updated = await reopenComment(query.siteId, query.pageId, id);
      if (!updated) return notFound(locale);
      return NextResponse.json({ ok: true, comment: updated });
    }
    if (body.action === 'assign') {
      const assignee = body.assignee === null ? undefined : optionalCollabId(body.assignee);
      if (body.assignee !== null && body.assignee !== undefined && !assignee) return badRequest(locale);
      const updated = await assignComment(query.siteId, query.pageId, id, assignee);
      if (!updated) return notFound(locale);
      return NextResponse.json({ ok: true, comment: updated });
    }
  } catch (error) {
    console.error('[builder/collab/comments/:id] PATCH failed:', error);
    return errorResponse(locale, 'comment_update_failed', 500);
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

  const query = requireQuery(request, locale);
  if (query instanceof NextResponse) return query;

  try {
    const deleted = await deleteComment(query.siteId, query.pageId, id);
    if (!deleted) return notFound(locale);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[builder/collab/comments/:id] DELETE failed:', error);
    return errorResponse(locale, 'comment_delete_failed', 500);
  }
}
