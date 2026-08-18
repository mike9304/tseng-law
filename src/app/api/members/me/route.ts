import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import {
  MEMBER_SESSION_COOKIE,
  publicMember,
  updateMemberProfile,
  validateSession,
} from '@/lib/builder/members/members-engine';
import {
  getMembersApiErrorPayload,
  type MembersApiErrorCode,
} from '@/lib/builder/members/members-api-copy';
import { validateCsrf } from '@/lib/builder/security/csrf';
import { isLocale, normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const profileSchema = z.object({
  email: z.string().trim().email().max(180).optional(),
  name: z.string().trim().min(1).max(120).optional(),
  phone: z.string().trim().max(80).optional(),
  profilePhoto: z.string().trim().max(2000).optional(),
  customFields: z.record(z.string(), z.string().max(500)).optional(),
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

async function currentMember(request: NextRequest) {
  const sessionId = request.cookies.get(MEMBER_SESSION_COOKIE)?.value;
  return sessionId ? validateSession(sessionId) : null;
}

function isDuplicateEmailError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const { message } = error;
  return message === 'duplicate_email';
}

export async function GET(request: NextRequest) {
  const errorLocale = resolveRequestLocale(request);
  try {
    const member = await currentMember(request);
    return NextResponse.json({ ok: true, member: member ? publicMember(member) : null });
  } catch (error) {
    console.error('[members/me] GET failed:', error);
    return errorResponse(errorLocale, 'profile_update_failed', 500);
  }
}

export async function PATCH(request: NextRequest) {
  const csrfFailure = validateCsrf(request);
  if (csrfFailure) return csrfFailure;

  let errorLocale = resolveRequestLocale(request);

  try {
    const member = await currentMember(request);
    if (!member) return errorResponse(errorLocale, 'not_authenticated', 401);

    const body = await request.json();
    errorLocale = resolveRequestLocale(request, body);
    const patch = profileSchema.parse(body);
    // Self-service primary-email change is blocked. Bookings/billing carry no
    // memberId — the customer portal authorizes purely by email — so an
    // unverified, self-asserted email lets a member claim another customer's
    // records (IDOR). Re-enable only behind a verified email-change flow
    // (ownership token). See WIX-AUDIT-2026-06-02.md.
    if (patch.email && patch.email.trim().toLowerCase() !== member.email.trim().toLowerCase()) {
      return errorResponse(errorLocale, 'email_change_requires_verification', 403);
    }
    const saved = await updateMemberProfile(member.memberId, patch);
    if (!saved) return errorResponse(errorLocale, 'member_not_found', 404);
    return NextResponse.json({ ok: true, member: publicMember(saved) });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (isDuplicateEmailError(error)) {
      return errorResponse(errorLocale, 'duplicate_email', 409);
    }
    if (error instanceof SyntaxError) {
      return errorResponse(errorLocale, 'invalid_json', 400);
    }
    console.error('[members/me] PATCH failed:', error);
    return errorResponse(errorLocale, 'profile_update_failed', 500);
  }
}
