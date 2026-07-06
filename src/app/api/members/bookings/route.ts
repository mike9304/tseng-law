import { NextRequest, NextResponse } from 'next/server';
import { getCustomerBookingPortal } from '@/lib/builder/bookings/customer-portal';
import {
  MEMBER_SESSION_COOKIE,
  getMemberPortalEmails,
  validateSession,
} from '@/lib/builder/members/members-engine';
import {
  getMembersApiErrorPayload,
  type MembersApiErrorCode,
} from '@/lib/builder/members/members-api-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function errorResponse(
  locale: Locale,
  errorCode: MembersApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getMembersApiErrorPayload(locale, errorCode) },
    { status },
  );
}

export async function GET(request: NextRequest) {
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const sessionId = request.cookies.get(MEMBER_SESSION_COOKIE)?.value;
  const member = sessionId ? await validateSession(sessionId) : null;
  if (!member) return errorResponse(locale, 'not_authenticated', 401);

  try {
    const portal = await getCustomerBookingPortal(member.email, locale, undefined, getMemberPortalEmails(member));
    return NextResponse.json({
      ok: true,
      email: portal.email,
      upcoming: portal.upcoming.map(({ managePath, ...booking }) => booking),
      past: portal.past.map(({ managePath, ...booking }) => booking),
      counts: {
        upcoming: portal.upcoming.length,
        past: portal.past.length,
      },
    });
  } catch (error) {
    console.error('[members/bookings] GET failed:', error);
    return errorResponse(locale, 'member_bookings_failed', 500);
  }
}
