import type { Metadata } from 'next';
import BookingsAdminShell from '@/components/builder/bookings/BookingsAdminShell';
import BookingCalendarAdmin from '@/components/builder/bookings/BookingCalendarAdmin';
import { listAvailability, listBookings, listServices, listStaff } from '@/lib/builder/bookings/storage';
import { textForLocale, type CalendarEntry } from '@/lib/builder/bookings/types';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bookings Calendar',
  robots: { index: false, follow: false },
};

function currentMonthRange(): { from: string; to: string } {
  const now = new Date();
  return {
    from: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
    to: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString(),
  };
}

export default async function BookingCalendarPage({ params }: { params: { locale: string } }) {
  const locale: Locale = normalizeLocale(params.locale);
  const range = currentMonthRange();
  const [bookings, services, staff, availability] = await Promise.all([
    listBookings({ ...range, includeCancelled: true }),
    listServices(true),
    listStaff(true),
    listAvailability(),
  ]);
  const serviceById = new Map(services.map((service) => [service.serviceId, service]));
  const entries: CalendarEntry[] = [
    ...bookings.map((booking) => ({
      id: booking.bookingId,
      type: 'booking' as const,
      title: `${textForLocale(serviceById.get(booking.serviceId)?.name, locale) || 'Booking'} · ${booking.customer.name}`,
      startAt: booking.startAt,
      endAt: booking.endAt,
      staffId: booking.staffId,
      status: booking.status,
      booking,
    })),
    ...availability.flatMap((item) => item.blockedDates.map((blocked, index) => ({
      id: `blocked-${item.staffId}-${index}`,
      type: 'blocked' as const,
      title: blocked.reason || 'Blocked',
      startAt: blocked.start,
      endAt: blocked.end,
      staffId: item.staffId,
      reason: blocked.reason,
    }))),
  ];

  return (
    <BookingsAdminShell
      locale={locale}
      active="calendar"
      title="Bookings calendar"
      subtitle="Review consultation bookings and blocked calendar time in one dashboard."
    >
      <BookingCalendarAdmin locale={locale} initialEntries={entries} services={services} staff={staff} />
    </BookingsAdminShell>
  );
}
