import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import { validateCsrf } from '@/lib/builder/security/csrf';
import {
  resolveReviewTarget,
  verifyReviewToken,
} from '@/lib/builder/security/review-tokens';
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

function isReviewFormRequest(request: NextRequest): boolean {
  return request.headers.get('content-type')?.toLowerCase().startsWith(
    'application/x-www-form-urlencoded',
  ) ?? false;
}

function invalidReviewTokenResponse(): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'Invalid review session.', errorCode: 'review_token_invalid' },
    { status: 401 },
  );
}

/**
 * Public client-review comments are accepted only from the native review
 * form. Its token is a POST body field (never a query/referrer value), and
 * every routing/identity value is derived from the persisted review session.
 */
async function postReviewComment(request: NextRequest, locale: Locale): Promise<NextResponse> {
  const csrfFailure = validateCsrf(request);
  if (csrfFailure) return csrfFailure;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return badRequest(locale);
  }

  const token = form.get('reviewToken');
  const review = typeof token === 'string' ? await verifyReviewToken(token) : null;
  if (!review) return invalidReviewTokenResponse();

  // Re-resolve the persisted page before it reaches comments-store, whose
  // page IDs become filenames. This also fails closed after unpublish/removal.
  const target = await resolveReviewTarget(review);
  if (!target || target.siteId !== DEFAULT_BUILDER_SITE_ID || target.pageId !== review.branchOrPageId) {
    return invalidReviewTokenResponse();
  }

  const text = sanitizeCommentBody(form.get('body'));
  if (!text) return badRequest(locale);

  try {
    const comment = await createComment({
      siteId: target.siteId,
      pageId: target.pageId,
      author: 'Client reviewer',
      body: text,
    });
    return NextResponse.json({ ok: true, comment });
  } catch (error) {
    console.error('[builder/collab/comments] review POST failed:', error);
    return errorResponse(locale, 'comment_create_failed', 500);
  }
}

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'view-cms');
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
  const locale = resolveLocale(request);
  if (isReviewFormRequest(request)) return postReviewComment(request, locale);

  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

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
