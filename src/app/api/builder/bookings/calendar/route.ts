import { NextRequest, NextResponse } from 'next/server';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { listAvailability, listBookings, listServices, listStaff } from '@/lib/builder/bookings/storage';
import type { CalendarEntry } from '@/lib/builder/bookings/types';
import { textForLocale } from '@/lib/builder/bookings/types';
import { normalizeLocale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = request.nextUrl;
  const from = searchParams.get('from') || undefined;
  const to = searchParams.get('to') || undefined;
  const staffId = searchParams.get('staffId') || undefined;
  const locale = normalizeLocale(searchParams.get('locale') || undefined);

  const [bookings, services, staff, availability] = await Promise.all([
    listBookings({ from, to, staffId, includeCancelled: true }),
    listServices(true),
    listStaff(true),
    listAvailability(),
  ]);
  const serviceById = new Map(services.map((service) => [service.serviceId, service]));
  const staffById = new Map(staff.map((member) => [member.staffId, member]));

  const bookingEntries: CalendarEntry[] = bookings.map((booking) => {
    const service = serviceById.get(booking.serviceId);
    const member = staffById.get(booking.staffId);
    return {
      id: booking.bookingId,
      type: 'booking',
      title: `${textForLocale(service?.name, locale) || 'Booking'} · ${booking.customer.name}`,
      startAt: booking.startAt,
      endAt: booking.endAt,
      staffId: booking.staffId,
      status: booking.status,
      booking,
      reason: member ? textForLocale(member.name, locale) : undefined,
    };
  });

  const blockedEntries: CalendarEntry[] = availability
    .filter((item) => !staffId || item.staffId === staffId)
    .flatMap((item) => item.blockedDates.map((blocked, index) => ({
      id: `blocked-${item.staffId}-${index}`,
      type: 'blocked' as const,
      title: blocked.reason || 'Blocked',
      startAt: blocked.start,
      endAt: blocked.end,
      staffId: item.staffId,
      reason: blocked.reason,
    })))
    .filter((entry) => !from || entry.endAt >= from)
    .filter((entry) => !to || entry.startAt <= to);

  return NextResponse.json({ entries: [...bookingEntries, ...blockedEntries].sort((a, b) => a.startAt.localeCompare(b.startAt)) });
}
