import type { Metadata } from 'next';
import { listErrorLog } from '@/lib/builder/errors/storage';
import ErrorsAdmin from '@/components/builder/errors/ErrorsAdmin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Errors',
  robots: { index: false, follow: false },
};

export default async function ErrorsPage() {
  const log = await listErrorLog();
  const severityCount: Record<string, number> = {};
  for (const entry of log) {
    severityCount[entry.severity] = (severityCount[entry.severity] ?? 0) + 1;
  }
  const recent = log.slice(-200).reverse();
  return (
    <main>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>Error Monitoring</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          captureBuilderError() 로 수집된 에러 로그. SENTRY_DSN 설정 시 자동 forward.
        </p>
      </header>
      <ErrorsAdmin
        initialEntries={recent}
        totalCount={log.length}
        severityCount={severityCount}
        sentryConfigured={Boolean(process.env.SENTRY_DSN)}
      />
    </main>
  );
}
