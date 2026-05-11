import type { Metadata } from 'next';
import { listBackups } from '@/lib/builder/backups/backup-engine';
import BackupsAdmin from '@/components/builder/backups/BackupsAdmin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Backups',
  robots: { index: false, follow: false },
};

export default async function BackupsPage() {
  const backups = await listBackups();
  return (
    <main>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Backups</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          모든 JSON 컬렉션 (bookings / forms / marketing / search / webhooks /
          errors / migrations 등) 의 스냅샷. 30일 retention.
        </p>
      </header>
      <BackupsAdmin initialBackups={backups} />
    </main>
  );
}
