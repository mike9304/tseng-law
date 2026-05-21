import type { Metadata } from 'next';
import BookingsAdminShell from '@/components/builder/bookings/BookingsAdminShell';
import BookingResourcesAdmin from '@/components/builder/bookings/BookingResourcesAdmin';
import { listResources } from '@/lib/builder/bookings/storage';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bookings Resources',
  robots: { index: false, follow: false },
};

export default async function BookingResourcesPage({ params }: { params: { locale: string } }) {
  const locale: Locale = normalizeLocale(params.locale);
  const resources = await listResources(true);

  return (
    <BookingsAdminShell
      locale={locale}
      active="resources"
      title="Booking resources"
      subtitle="Manage rooms, equipment, and shared availability constraints for services."
    >
      <BookingResourcesAdmin locale={locale} initialResources={resources} />
    </BookingsAdminShell>
  );
}
