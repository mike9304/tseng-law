import type { Metadata } from 'next';
import BookingsAdminShell from '@/components/builder/bookings/BookingsAdminShell';
import BookingEmailTemplatesAdmin from '@/components/builder/bookings/BookingEmailTemplatesAdmin';
import { listBookingEmailTemplates } from '@/lib/builder/bookings/email-templates';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Bookings Email Templates',
  robots: { index: false, follow: false },
};

export default async function BookingEmailTemplatesPage({ params }: { params: { locale: string } }) {
  const locale: Locale = normalizeLocale(params.locale);
  const templates = await listBookingEmailTemplates();

  return (
    <BookingsAdminShell
      locale={locale}
      active="email-templates"
      title="Booking email templates"
      subtitle="Customize confirmation, reminder, cancellation, and admin notification emails with live placeholders."
    >
      <BookingEmailTemplatesAdmin initialTemplates={templates} />
    </BookingsAdminShell>
  );
}
