import type { Metadata } from 'next';
import BookingsAdminShell from '@/components/builder/bookings/BookingsAdminShell';
import BookingServicesAdmin from '@/components/builder/bookings/BookingServicesAdmin';
import { listServices, listStaff } from '@/lib/builder/bookings/storage';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bookings Services',
  robots: { index: false, follow: false },
};

export default async function BookingServicesPage({ params }: { params: { locale: string } }) {
  const locale: Locale = normalizeLocale(params.locale);
  const [services, staff] = await Promise.all([listServices(true), listStaff(true)]);

  return (
    <BookingsAdminShell
      locale={locale}
      active="services"
      title="Booking services"
      subtitle="Package consultations with duration, price, buffers, and eligible lawyers."
    >
      <BookingServicesAdmin locale={locale} initialServices={services} staff={staff} />
    </BookingsAdminShell>
  );
}
