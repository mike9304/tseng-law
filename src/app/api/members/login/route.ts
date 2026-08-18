import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import {
  getMember,
  loginMember,
  MEMBER_SESSION_COOKIE,
  publicMember,
  revokeSession,
} from '@/lib/builder/members/members-engine';
import {
  getMembersApiErrorPayload,
  type MembersApiErrorCode,
} from '@/lib/builder/members/members-api-copy';
import { validateCsrf } from '@/lib/builder/security/csrf';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  isSiteLocale,
  normalizeSiteLocale,
  type SiteLocale,
} from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const loginSchema = z.object({
  email: z.string().trim().email().max(180),
  password: z.string().min(1).max(128),
  locale: z.string().trim().max(20).optional(),
});

const LOGIN_RATE_LIMIT_WINDOW_MS = 5 * 60_000;
const JA_LOGIN_ERRORS: Partial<Record<MembersApiErrorCode, string>> = {
  validation_error: '会員ログイン情報を確認してください。',
  invalid_json: '会員ログインのリクエスト形式を確認してください。',
  invalid_credentials: 'メールアドレスまたはパスワードが正しくありません。',
  member_login_failed: 'ログインできませんでした。',
};

function errorResponse(
  locale: SiteLocale,
  errorCode: MembersApiErrorCode,
  status: number,
  extras?: Record<string, unknown>,
): NextResponse {
  const payload = locale === 'ja'
    ? {
        error: JA_LOGIN_ERRORS[errorCode] ?? 'ログインできませんでした。',
        errorCode,
      }
    : getMembersApiErrorPayload(locale, errorCode);
  return NextResponse.json(
    { ok: false, ...payload, ...extras },
    { status },
  );
}

function validationError(locale: SiteLocale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

function resolveRequestLocale(request: NextRequest, payload?: unknown): SiteLocale {
  const queryLocale = request.nextUrl.searchParams.get('locale') ?? undefined;
  if (isSiteLocale(queryLocale)) return queryLocale;
  if (payload && typeof payload === 'object') {
    const locale = (payload as { locale?: unknown }).locale;
    if (typeof locale === 'string' && isSiteLocale(locale)) return locale;
  }
  return normalizeSiteLocale(queryLocale);
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown'
  );
}

function rateLimitResponse(retryAfterMs: number): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      error: 'Too many requests. Please try again later.',
      errorCode: 'too_many_requests',
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(Math.max(1, Math.ceil(retryAfterMs / 1000))),
      },
    },
  );
}

export async function POST(request: NextRequest) {
  const csrfFailure = validateCsrf(request);
  if (csrfFailure) return csrfFailure;

  let errorLocale = resolveRequestLocale(request);
  try {
    const body = await request.json();
    errorLocale = resolveRequestLocale(request, body);
    const input = loginSchema.parse(body);
    const normalizedEmail = input.email.toLowerCase();
    const [ipRate, emailRate] = await Promise.all([
      checkRateLimit(
        `members-login:ip:${clientIp(request)}`,
        20,
        LOGIN_RATE_LIMIT_WINDOW_MS,
      ),
      checkRateLimit(
        `members-login:email:${normalizedEmail}`,
        5,
        LOGIN_RATE_LIMIT_WINDOW_MS,
      ),
    ]);
    if (!ipRate.allowed || !emailRate.allowed) {
      return rateLimitResponse(Math.max(ipRate.retryAfterMs, emailRate.retryAfterMs));
    }

    const session = await loginMember(input.email, input.password);
    if (!session) return errorResponse(errorLocale, 'invalid_credentials', 401);

    const member = await getMember(session.memberId);
    if (!member) {
      await revokeSession(session.sessionId);
      return errorResponse(errorLocale, 'member_login_failed', 500);
    }
    if (!member.verified || member.blocked) {
      await revokeSession(session.sessionId);
      return errorResponse(errorLocale, 'invalid_credentials', 401);
    }

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
