import type { Metadata } from 'next';
import BookingsAdminShell from '@/components/builder/bookings/BookingsAdminShell';
import BookingDashboardAdmin from '@/components/builder/bookings/BookingDashboardAdmin';
import { listBookings, listServices, listStaff, listWaitlistEntries } from '@/lib/builder/bookings/storage';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bookings Dashboard',
  robots: { index: false, follow: false },
};

export default async function BookingDashboardPage({ params }: { params: { locale: string } }) {
  const locale: Locale = normalizeLocale(params.locale);
  const [bookings, services, staff, waitlist] = await Promise.all([
    listBookings({ includeCancelled: true }),
    listServices(true),
    listStaff(true),
    listWaitlistEntries({ includeClosed: true }),
  ]);

  return (
    <BookingsAdminShell
      locale={locale}
      active="dashboard"
      title="Bookings dashboard"
      subtitle="Search, filter, reschedule, and move consultations through Wix-style booking states."
    >
      <BookingDashboardAdmin locale={locale} initialBookings={bookings} initialWaitlist={waitlist} services={services} staff={staff} />
    </BookingsAdminShell>
  );
}
