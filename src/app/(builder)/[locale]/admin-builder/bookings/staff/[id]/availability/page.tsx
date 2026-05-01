import type { Metadata } from 'next';
import BookingsAdminShell from '@/components/builder/bookings/BookingsAdminShell';
import BookingAvailabilityAdmin from '@/components/builder/bookings/BookingAvailabilityAdmin';
import { getStaff, getStaffAvailability } from '@/lib/builder/bookings/storage';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Staff Availability',
  robots: { index: false, follow: false },
};

export default async function BookingAvailabilityPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const locale: Locale = normalizeLocale(params.locale);
  const [staff, availability] = await Promise.all([
    getStaff(params.id),
    getStaffAvailability(params.id),
  ]);

  if (!staff) {
    return (
      <BookingsAdminShell locale={locale} active="staff" title="Staff not found" subtitle="Return to staff and choose an active profile.">
        <div />
      </BookingsAdminShell>
    );
  }

  return (
    <BookingsAdminShell
      locale={locale}
      active="staff"
      title="Staff availability"
      subtitle="Set weekly hours and blocked dates for slot generation."
    >
      <BookingAvailabilityAdmin locale={locale} staff={staff} initialAvailability={availability} />
    </BookingsAdminShell>
  );
}
