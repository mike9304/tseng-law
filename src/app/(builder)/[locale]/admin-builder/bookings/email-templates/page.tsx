import type { Metadata } from 'next';
import BookingsAdminShell from '@/components/builder/bookings/BookingsAdminShell';
import BookingEmailTemplatesAdmin from '@/components/builder/bookings/BookingEmailTemplatesAdmin';
import { getBookingsAdminCopy } from '@/lib/builder/bookings/bookings-copy';
import { listBookingEmailTemplates } from '@/lib/builder/bookings/email-templates';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale: Locale = normalizeLocale(params.locale);
  const copy = getBookingsAdminCopy(locale);
  return { title: copy.pages.emailTemplates.title, robots: { index: false, follow: false } };
}

export default async function BookingEmailTemplatesPage({ params }: { params: { locale: string } }) {
  const locale: Locale = normalizeLocale(params.locale);
  const copy = getBookingsAdminCopy(locale);
  const templates = await listBookingEmailTemplates();

  return (
    <BookingsAdminShell
      locale={locale}
      active="email-templates"
      title={copy.pages.emailTemplates.title}
      subtitle={copy.pages.emailTemplates.subtitle}
    >
      <BookingEmailTemplatesAdmin locale={locale} initialTemplates={templates} />
    </BookingsAdminShell>
  );
}
