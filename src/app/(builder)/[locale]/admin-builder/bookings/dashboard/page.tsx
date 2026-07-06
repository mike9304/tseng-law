import type { Metadata } from 'next';
import BookingsAdminShell from '@/components/builder/bookings/BookingsAdminShell';
import BookingDashboardAdmin from '@/components/builder/bookings/BookingDashboardAdmin';
import { getBookingsAdminCopy } from '@/lib/builder/bookings/bookings-copy';
import { normalizeBookingDashboardActionFilter, normalizeBookingDashboardQuery } from '@/lib/builder/bookings/dashboard-url';
import { listAvailability, listBookings, listServices, listStaff, listWaitlistEntries } from '@/lib/builder/bookings/storage';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale: Locale = normalizeLocale(params.locale);
  const copy = getBookingsAdminCopy(locale);
  return { title: copy.pages.dashboard.title, robots: { index: false, follow: false } };
}

type PageProps = {
  params: { locale: string };
  searchParams?: { action?: string; q?: string };
};

export default async function BookingDashboardPage({ params, searchParams }: PageProps) {
  const locale: Locale = normalizeLocale(params.locale);
  const copy = getBookingsAdminCopy(locale);
  const initialActionFilter = normalizeBookingDashboardActionFilter(searchParams?.action);
  const initialQuery = normalizeBookingDashboardQuery(searchParams?.q);
  const [bookings, services, staff, waitlist, availability] = await Promise.all([
    listBookings({ includeCancelled: true }),
    listServices(true),
    listStaff(true),
    listWaitlistEntries({ includeClosed: true }),
    listAvailability(),
  ]);

  return (
    <BookingsAdminShell
      locale={locale}
      active="dashboard"
      title={copy.pages.dashboard.title}
      subtitle={copy.pages.dashboard.subtitle}
    >
      <BookingDashboardAdmin
        locale={locale}
        initialBookings={bookings}
        initialWaitlist={waitlist}
        services={services}
        staff={staff}
        availability={availability}
        initialActionFilter={initialActionFilter}
        initialQuery={initialQuery}
      />
    </BookingsAdminShell>
  );
}
