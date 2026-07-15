import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  CommentParentNotFoundError,
  createComment,
  listComments,
  sanitizeCommentBody,
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
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;
  const locale = resolveLocale(request);

  const siteId = resolveCollabSiteIdFromRequest(request);
  const pageId = normalizeCollabId(request.nextUrl.searchParams.get('pageId'));
  if (!pageId) return badRequest(locale);
  const includeResolved = request.nextUrl.searchParams.get('includeResolved') === '1';
  const assignee = optionalCollabId(request.nextUrl.searchParams.get('assignee'));

  try {
    const comments = await listComments(siteId, pageId, { includeResolved, assignee });
    return NextResponse.json({ ok: true, comments });
  } catch (error) {
    console.error('[builder/collab/comments] GET failed:', error);
    return errorResponse(locale, 'comments_load_failed', 500);
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
  if (!pageId) return badRequest(locale);
  const nodeId = optionalCollabId(body.nodeId);
  const parentId = optionalCollabId(body.parentId);
  const assignee = optionalCollabId(body.assignee);
  const text = sanitizeCommentBody(body.body);
  if (!text) return badRequest(locale);

  try {
    const comment = await createComment({
      siteId,
      pageId,
      author: auth.username,
      body: text,
      nodeId,
      parentId,
      assignee,
    });
    return NextResponse.json({ ok: true, comment });
  } catch (error) {
    if (error instanceof CommentParentNotFoundError) return errorResponse(locale, 'comment_not_found', 404);
    console.error('[builder/collab/comments] POST failed:', error);
    return errorResponse(locale, 'comment_create_failed', 500);
  }
}
