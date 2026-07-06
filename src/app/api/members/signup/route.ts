import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import {
  createMember,
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

const signupSchema = z.object({
  email: z.string().trim().email().max(180),
  name: z.string().trim().min(1).max(120),
  password: z.string().min(8).max(128),
  locale: z.string().trim().max(20).optional(),
});

const duplicateEmailEngineMessages = new Set(['duplicate_email', '이미 가입된 이메일입니다.']);

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

function signupErrorCode(error: unknown): MembersApiErrorCode {
  if (error instanceof Error) {
    const { message } = error;
    if (duplicateEmailEngineMessages.has(message)) return 'duplicate_email';
  }
  return 'member_signup_failed';
}

export async function POST(request: NextRequest) {
  let errorLocale = resolveRequestLocale(request);
  try {
    const body = await request.json();
    errorLocale = resolveRequestLocale(request, body);
    const input = signupSchema.parse(body);
    const member = await createMember({
      email: input.email,
      name: input.name,
      password: input.password,
      role: 'free',
    });
    const session = await loginMember(input.email, input.password);
    if (!session) {
      return errorResponse(errorLocale, 'session_create_failed', 500);
    }

    const response = NextResponse.json({ ok: true, member: publicMember(member) }, { status: 201 });
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
    const errorCode = signupErrorCode(error);
    if (errorCode !== 'duplicate_email') console.error('[members/signup] POST failed:', error);
    return errorResponse(errorLocale, errorCode, errorCode === 'duplicate_email' ? 409 : 500);
  }
}
