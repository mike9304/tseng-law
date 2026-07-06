import type { Metadata } from 'next';
import BookingsAdminShell from '@/components/builder/bookings/BookingsAdminShell';
import BookingPoliciesAdmin from '@/components/builder/bookings/BookingPoliciesAdmin';
import { getBookingsAdminCopy } from '@/lib/builder/bookings/bookings-copy';
import { listCancellationPolicies } from '@/lib/builder/bookings/storage';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale: Locale = normalizeLocale(params.locale);
  const copy = getBookingsAdminCopy(locale);
  return { title: copy.pages.policies.title, robots: { index: false, follow: false } };
}

export default async function BookingPoliciesPage({ params }: { params: { locale: string } }) {
  const locale: Locale = normalizeLocale(params.locale);
  const copy = getBookingsAdminCopy(locale);
  const policies = await listCancellationPolicies(true);

  return (
    <BookingsAdminShell
      locale={locale}
      active="policies"
      title={copy.pages.policies.title}
      subtitle={copy.pages.policies.subtitle}
    >
      <BookingPoliciesAdmin locale={locale} initialPolicies={policies} />
    </BookingsAdminShell>
  );
}
