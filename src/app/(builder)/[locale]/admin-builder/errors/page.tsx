import type { Metadata } from 'next';
import { listErrorLog } from '@/lib/builder/errors/storage';
import ErrorsAdmin from '@/components/builder/errors/ErrorsAdmin';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

function getErrorsAdminMetadata(locale: Locale): Metadata {
  return {
    title: locale === 'ko' ? '오류 모니터링' : locale === 'zh-hant' ? '錯誤監控' : 'Error Monitoring',
    robots: { index: false, follow: false },
  };
}

export default async function ErrorsPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale = normalizeLocale(params.locale);
  const log = await listErrorLog();
  const severityCount: Record<string, number> = {};
  for (const entry of log) {
    severityCount[entry.severity] = (severityCount[entry.severity] ?? 0) + 1;
  }
  const recent = log.slice(-200).reverse();
  return (
    <main>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>{locale === 'ko' ? '오류 모니터링' : locale === 'zh-hant' ? '錯誤監控' : 'Error Monitoring'}</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>
          {locale === 'ko'
            ? 'captureBuilderError()로 수집된 에러 로그. SENTRY_DSN 설정 시 자동 전송.'
            : locale === 'zh-hant'
              ? '由 captureBuilderError() 收集的錯誤記錄。設定 SENTRY_DSN 時會自動轉送。'
              : 'Error logs collected by captureBuilderError(). Automatically forwarded when SENTRY_DSN is configured.'}
        </p>
      </header>
      <ErrorsAdmin
        locale={locale}
        initialEntries={recent}
        totalCount={log.length}
        severityCount={severityCount}
        sentryConfigured={Boolean(process.env.SENTRY_DSN)}
      />
    </main>
  );
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  return getErrorsAdminMetadata(normalizeLocale(params.locale));
}
