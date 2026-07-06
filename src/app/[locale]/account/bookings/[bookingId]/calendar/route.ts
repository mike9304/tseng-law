import { NextRequest, NextResponse } from 'next/server';
import { buildBookingCalendarInvite, buildBookingCalendarInviteFilename } from '@/lib/builder/bookings/calendar-invite';
import { getCustomerBookingPortal } from '@/lib/builder/bookings/customer-portal';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import { getMemberPortalEmails } from '@/lib/builder/members/members-engine';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: { locale: string; bookingId: string } }) {
  const locale = normalizeLocale(params.locale);
  const member = await getCurrentSiteMember();
  if (!member) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const portal = await getCustomerBookingPortal(member.email, locale, undefined, getMemberPortalEmails(member));
  const booking = [...portal.upcoming, ...portal.past].find((item) => item.bookingId === params.bookingId);
  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  const ics = buildBookingCalendarInvite(
    {
      bookingId: booking.bookingId,
      serviceName: booking.serviceName,
      staffName: booking.staffName,
      startAt: booking.startAt,
      endAt: booking.endAt,
      detailPath: `/${locale}/account/bookings/${encodeURIComponent(booking.bookingId)}`,
      meetingLink: booking.meetingLink,
    },
    locale,
  );

  return new NextResponse(ics, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${buildBookingCalendarInviteFilename(booking.bookingId)}"`,
      'Cache-Control': 'no-store',
    },
  });
}
