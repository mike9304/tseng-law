import type { Metadata } from 'next';
import BookingsAdminShell from '@/components/builder/bookings/BookingsAdminShell';
import BookingServicesAdmin from '@/components/builder/bookings/BookingServicesAdmin';
import { getBookingsAdminCopy } from '@/lib/builder/bookings/bookings-copy';
import { listCancellationPolicies, listResources, listServices, listStaff } from '@/lib/builder/bookings/storage';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const locale: Locale = normalizeLocale(params.locale);
  const copy = getBookingsAdminCopy(locale);
  return { title: copy.pages.services.title, robots: { index: false, follow: false } };
}

export default async function BookingServicesPage(
  props: {
    params: Promise<{ locale: string }>;
    searchParams?: Promise<{ edit?: string | string[] }>;
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const locale: Locale = normalizeLocale(params.locale);
  const copy = getBookingsAdminCopy(locale);
  const initialEditServiceId = typeof searchParams?.edit === 'string' ? searchParams.edit : undefined;
  const [services, staff, resources, cancellationPolicies] = await Promise.all([
    listServices(true),
    listStaff(true),
    listResources(true),
    listCancellationPolicies(true),
  ]);

  return (
    <BookingsAdminShell
      locale={locale}
      active="services"
      title={copy.pages.services.title}
      subtitle={copy.pages.services.subtitle}
    >
      <BookingServicesAdmin
        locale={locale}
        initialServices={services}
        staff={staff}
        resources={resources}
        cancellationPolicies={cancellationPolicies}
        initialEditServiceId={initialEditServiceId}
      />
    </BookingsAdminShell>
  );
}
