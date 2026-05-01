import type { Metadata } from 'next';
import BookingsAdminShell from '@/components/builder/bookings/BookingsAdminShell';
import BookingStaffAdmin from '@/components/builder/bookings/BookingStaffAdmin';
import { listStaff } from '@/lib/builder/bookings/storage';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bookings Staff',
  robots: { index: false, follow: false },
};

export default async function BookingStaffPage({ params }: { params: { locale: string } }) {
  const locale: Locale = normalizeLocale(params.locale);
  const staff = await listStaff(true);

  return (
    <BookingsAdminShell
      locale={locale}
      active="staff"
      title="Booking staff"
      subtitle="Manage lawyer booking profiles, specialties, photos, and notification emails."
    >
      <BookingStaffAdmin locale={locale} initialStaff={staff} />
    </BookingsAdminShell>
  );
}
