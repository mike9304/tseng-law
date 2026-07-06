import type { Metadata } from 'next';
import { listStaff } from '@/lib/builder/bookings/storage';
import { listConnections } from '@/lib/builder/bookings/calendar-sync/storage';
import { getGoogleEnv } from '@/lib/builder/bookings/calendar-sync/google';
import { getOutlookEnv } from '@/lib/builder/bookings/calendar-sync/outlook';
import CalendarSyncAdmin from '@/components/builder/bookings/CalendarSyncAdmin';
import { getBookingsAdminCopy } from '@/lib/builder/bookings/bookings-copy';
import { textForLocale } from '@/lib/builder/bookings/types';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale: Locale = normalizeLocale(params.locale);
  const copy = getBookingsAdminCopy(locale);
  return { title: copy.pages.calendarSync.title, robots: { index: false, follow: false } };
}

export default async function CalendarSyncPage({ params }: { params: { locale: string } }) {
  const locale: Locale = normalizeLocale(params.locale);
  const copy = getBookingsAdminCopy(locale);
  const [staff, connections] = await Promise.all([listStaff(true), listConnections()]);
  const google = getGoogleEnv();
  const outlook = getOutlookEnv();
  return (
    <main>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>{copy.pages.calendarSync.title}</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{copy.pages.calendarSync.subtitle}</p>
      </header>
      <CalendarSyncAdmin
        locale={locale}
        initialConnections={connections}
        staff={staff.map((s) => ({ staffId: s.staffId, name: textForLocale(s.name, locale) || s.staffId }))}
        googleConfigured={google.ok}
        outlookConfigured={outlook.ok}
      />
    </main>
  );
}
