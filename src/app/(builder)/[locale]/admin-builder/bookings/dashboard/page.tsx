import type { Metadata } from 'next';
import BookingsAdminShell from '@/components/builder/bookings/BookingsAdminShell';
import BookingDashboardAdmin from '@/components/builder/bookings/BookingDashboardAdmin';
import { listBookings, listServices, listStaff } from '@/lib/builder/bookings/storage';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bookings Dashboard',
  robots: { index: false, follow: false },
};

export default async function BookingDashboardPage({ params }: { params: { locale: string } }) {
  const locale: Locale = normalizeLocale(params.locale);
  const [bookings, services, staff] = await Promise.all([
    listBookings({ includeCancelled: true }),
    listServices(true),
    listStaff(true),
  ]);

  return (
    <BookingsAdminShell
      locale={locale}
      active="dashboard"
      title="Bookings dashboard"
      subtitle="Search, filter, reschedule, and move consultations through Wix-style booking states."
    >
      <BookingDashboardAdmin locale={locale} initialBookings={bookings} services={services} staff={staff} />
    </BookingsAdminShell>
  );
}
