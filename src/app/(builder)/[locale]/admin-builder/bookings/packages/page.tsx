import BookingsAdminShell from '@/components/builder/bookings/BookingsAdminShell';
import BookingPackagesAdmin from '@/components/builder/bookings/BookingPackagesAdmin';
import { getBookingsAdminCopy } from '@/lib/builder/bookings/bookings-copy';
import { listPackageCredits, listPackages, listServices } from '@/lib/builder/bookings/storage';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: string } }): import('next').Metadata {
  const locale: Locale = normalizeLocale(params.locale);
  const copy = getBookingsAdminCopy(locale);
  return { title: copy.pages.packages.title, robots: { index: false, follow: false } };
}

export default async function BookingPackagesPage({ params }: { params: { locale: string } }) {
  const locale: Locale = normalizeLocale(params.locale);
  const copy = getBookingsAdminCopy(locale);
  const [packages, credits, services] = await Promise.all([
    listPackages(true),
    listPackageCredits({ includeInactive: true }),
    listServices(true),
  ]);
  return (
    <BookingsAdminShell
      locale={locale}
      active="packages"
      title={copy.pages.packages.title}
      subtitle={copy.pages.packages.subtitle}
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
