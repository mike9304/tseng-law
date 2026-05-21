import { NextRequest, NextResponse } from 'next/server';
import { getCustomerBookingPortal } from '@/lib/builder/bookings/customer-portal';
import {
  MEMBER_SESSION_COOKIE,
  validateSession,
} from '@/lib/builder/members/members-engine';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const sessionId = request.cookies.get(MEMBER_SESSION_COOKIE)?.value;
  const member = sessionId ? await validateSession(sessionId) : null;
  if (!member) {
    return NextResponse.json({ ok: false, error: 'not_authenticated' }, { status: 401 });
  }

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const portal = await getCustomerBookingPortal(member.email, locale);
  return NextResponse.json({
    ok: true,
    email: portal.email,
    upcoming: portal.upcoming,
    past: portal.past,
    counts: {
      upcoming: portal.upcoming.length,
      past: portal.past.length,
    },
  });
}
