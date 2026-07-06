import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import {
  getMember,
  loginMember,
  MEMBER_SESSION_COOKIE,
  publicMember,
} from '@/lib/builder/members/members-engine';
import {
  getMembersApiErrorPayload,
  type MembersApiErrorCode,
} from '@/lib/builder/members/members-api-copy';
import { isLocale, normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const loginSchema = z.object({
  email: z.string().trim().email().max(180),
  password: z.string().min(1).max(128),
  locale: z.string().trim().max(20).optional(),
});

function errorResponse(
  locale: Locale,
  errorCode: MembersApiErrorCode,
  status: number,
  extras?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getMembersApiErrorPayload(locale, errorCode), ...extras },
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

export async function POST(request: NextRequest) {
  let errorLocale = resolveRequestLocale(request);
  try {
    const body = await request.json();
    errorLocale = resolveRequestLocale(request, body);
    const input = loginSchema.parse(body);
    const session = await loginMember(input.email, input.password);
    if (!session) return errorResponse(errorLocale, 'invalid_credentials', 401);

    const member = await getMember(session.memberId);
    if (!member) return errorResponse(errorLocale, 'member_not_found', 404);

    const response = NextResponse.json({ ok: true, member: publicMember(member) });
    response.cookies.set(MEMBER_SESSION_COOKIE, session.sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: new Date(session.expiresAt),
    });
    return response;
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) {
      return errorResponse(errorLocale, 'invalid_json', 400);
    }
    console.error('[members/login] POST failed:', error);
    return errorResponse(errorLocale, 'member_login_failed', 500);
  }
}
