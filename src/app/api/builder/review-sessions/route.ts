import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createReviewSession,
  listReviewSessions,
} from '@/lib/builder/security/review-tokens';
import {
  getBuilderReviewSessionsApiErrorPayload,
  type BuilderReviewSessionsApiErrorCode,
} from '@/lib/builder/security/review-sessions-api-copy';
import { isLocale, normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const createSchema = z.object({
  branchOrPageId: z.string().trim().min(1).max(180),
  ttlMs: z.number().int().positive().max(1000 * 60 * 60 * 24 * 30).optional(),
  locale: z.string().trim().max(20).optional(),
});

function errorResponse(
  locale: Locale,
  errorCode: BuilderReviewSessionsApiErrorCode,
  status: number,
  extras?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderReviewSessionsApiErrorPayload(locale, errorCode), ...extras },
    { status },
  );
}

function validationError(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

function resolveRequestLocale(request: NextRequest, payload?: unknown): Locale {
  const queryLocale = request.nextUrl.searchParams.get('locale') ?? undefined;
  if (isLocale(queryLocale)) return queryLocale;
  if (payload && typeof payload === 'object') {
    const locale = (payload as { locale?: unknown }).locale;
    if (typeof locale === 'string' && isLocale(locale)) return locale;
  }
  return normalizeLocale(queryLocale);
}

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, {
    bucket: 'mutation',
    permission: 'edit-pages',
  });
  if (auth instanceof NextResponse) return auth;
  const locale = resolveRequestLocale(request);
  try {
    const sessions = await listReviewSessions();
    return NextResponse.json({ ok: true, sessions });
  } catch (error) {
    console.error('[builder/review-sessions] GET failed:', error);
    return errorResponse(locale, 'review_sessions_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, {
    bucket: 'mutation',
    permission: 'edit-pages',
  });
  if (auth instanceof NextResponse) return auth;

  let errorLocale = resolveRequestLocale(request);
  try {
    const body = await request.json();
    errorLocale = resolveRequestLocale(request, body);
    const input = createSchema.parse(body);
    const result = await createReviewSession({
      branchOrPageId: input.branchOrPageId,
      ttlMs: input.ttlMs,
      createdBy: auth.username,
    });
    return NextResponse.json(
      { ok: true, session: result.session, token: result.token, url: result.url },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(errorLocale, 'invalid_json', 400);
    }
    console.error('[builder/review-sessions] POST failed:', error);
    return errorResponse(errorLocale, 'review_session_create_failed', 500);
  }
}
