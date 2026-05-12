import type { Metadata } from 'next';
import { listStaff } from '@/lib/builder/bookings/storage';
import { listConnections } from '@/lib/builder/bookings/calendar-sync/storage';
import { getGoogleEnv } from '@/lib/builder/bookings/calendar-sync/google';
import { getOutlookEnv } from '@/lib/builder/bookings/calendar-sync/outlook';
import CalendarSyncAdmin from '@/components/builder/bookings/CalendarSyncAdmin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Calendar Sync',
  robots: { index: false, follow: false },
};

export default async function CalendarSyncPage() {
  const [staff, connections] = await Promise.all([listStaff(true), listConnections()]);
  const google = getGoogleEnv();
  const outlook = getOutlookEnv();
  return (
    <main>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Calendar Sync (Google · Outlook)</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          스태프 OAuth 연결 후 예약은 외부 캘린더로 보내고, 외부 일정은 busy block으로 가져와 공개 예약 슬롯에서 제외합니다.
        </p>
      </header>
      <CalendarSyncAdmin
        initialConnections={connections}
        staff={staff.map((s) => ({ staffId: s.staffId, name: s.name.ko || s.name.en || s.staffId }))}
        googleConfigured={google.ok}
        outlookConfigured={outlook.ok}
      />
    </main>
  );
}
