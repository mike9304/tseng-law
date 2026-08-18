import type { Metadata } from 'next';
import BookingsAdminShell from '@/components/builder/bookings/BookingsAdminShell';
import BookingStaffAdmin from '@/components/builder/bookings/BookingStaffAdmin';
import { getBookingsAdminCopy } from '@/lib/builder/bookings/bookings-copy';
import { listStaff } from '@/lib/builder/bookings/storage';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const locale: Locale = normalizeLocale(params.locale);
  const copy = getBookingsAdminCopy(locale);
  return { title: copy.pages.staff.title, robots: { index: false, follow: false } };
}

export default async function BookingStaffPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const locale: Locale = normalizeLocale(params.locale);
  const copy = getBookingsAdminCopy(locale);
  const staff = await listStaff(true);

  return (
    <BookingsAdminShell
      locale={locale}
      active="staff"
      title={copy.pages.staff.title}
      subtitle={copy.pages.staff.subtitle}
    >
      <BookingStaffAdmin locale={locale} initialStaff={staff} />
    </BookingsAdminShell>
  );
}
