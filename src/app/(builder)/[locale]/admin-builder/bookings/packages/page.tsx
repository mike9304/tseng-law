import BookingsAdminShell from '@/components/builder/bookings/BookingsAdminShell';
import BookingPackagesAdmin from '@/components/builder/bookings/BookingPackagesAdmin';
import { listPackageCredits, listPackages, listServices } from '@/lib/builder/bookings/storage';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export default async function BookingPackagesPage({ params }: { params: { locale: string } }) {
  const locale: Locale = normalizeLocale(params.locale);
  const [packages, credits, services] = await Promise.all([
    listPackages(true),
    listPackageCredits({ includeInactive: true }),
    listServices(true),
  ]);
  return (
    <BookingsAdminShell
      locale={locale}
      active="packages"
      title="Booking packages"
      subtitle="Create session packages and grant customer credits that can redeem paid booking services."
    >
      <BookingPackagesAdmin
        locale={locale}
        initialPackages={packages}
        initialCredits={credits}
        services={services}
      />
    </BookingsAdminShell>
  );
}
