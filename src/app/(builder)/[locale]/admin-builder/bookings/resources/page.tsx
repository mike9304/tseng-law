import type { Metadata } from 'next';
import BookingsAdminShell from '@/components/builder/bookings/BookingsAdminShell';
import BookingResourcesAdmin from '@/components/builder/bookings/BookingResourcesAdmin';
import { getBookingsAdminCopy } from '@/lib/builder/bookings/bookings-copy';
import { listResources } from '@/lib/builder/bookings/storage';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const locale: Locale = normalizeLocale(params.locale);
  const copy = getBookingsAdminCopy(locale);
  return { title: copy.pages.resources.title, robots: { index: false, follow: false } };
}

export default async function BookingResourcesPage(props: { params: Promise<{ locale: string }> }) {
  const params = await props.params;
  const locale: Locale = normalizeLocale(params.locale);
  const copy = getBookingsAdminCopy(locale);
  const resources = await listResources(true);

  return (
    <BookingsAdminShell
      locale={locale}
      active="resources"
      title={copy.pages.resources.title}
      subtitle={copy.pages.resources.subtitle}
    >
      <BookingResourcesAdmin locale={locale} initialResources={resources} />
    </BookingsAdminShell>
  );
}
