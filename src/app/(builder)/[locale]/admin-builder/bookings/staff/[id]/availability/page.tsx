import type { Metadata } from 'next';
import BookingsAdminShell from '@/components/builder/bookings/BookingsAdminShell';
import BookingAvailabilityAdmin from '@/components/builder/bookings/BookingAvailabilityAdmin';
import { getStaff, getStaffAvailability } from '@/lib/builder/bookings/storage';
import { getBookingsAdminCopy } from '@/lib/builder/bookings/bookings-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale: Locale = normalizeLocale(params.locale);
  const copy = getBookingsAdminCopy(locale);
  return { title: copy.pages.staffAvailability.title, robots: { index: false, follow: false } };
}

export default async function BookingAvailabilityPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const locale: Locale = normalizeLocale(params.locale);
  const copy = getBookingsAdminCopy(locale);
  const [staff, availability] = await Promise.all([
    getStaff(params.id),
    getStaffAvailability(params.id),
  ]);

  if (!staff) {
    return (
      <BookingsAdminShell locale={locale} active="staff" title={copy.pages.staffNotFound.title} subtitle={copy.pages.staffNotFound.subtitle}>
        <div />
      </BookingsAdminShell>
    );
  }

  return (
    <BookingsAdminShell
      locale={locale}
      active="staff"
      title={copy.pages.staffAvailability.title}
      subtitle={copy.pages.staffAvailability.subtitle}
    >
      <BookingAvailabilityAdmin locale={locale} staff={staff} initialAvailability={availability} />
    </BookingsAdminShell>
  );
}
