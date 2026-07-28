import type { Metadata } from 'next';
import { listBackups } from '@/lib/builder/backups/backup-engine';
import BackupsAdmin from '@/components/builder/backups/BackupsAdmin';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const COPY: Record<Locale, { title: string; description: string; heading: string; body: string }> = {
  ko: {
    title: '백업',
    description: 'JSON 컬렉션 스냅샷과 복원 기록을 관리합니다.',
    heading: '백업',
    body: '모든 JSON 컬렉션(bookings / forms / marketing / search / webhooks / errors / migrations 등)의 스냅샷. 30일 retention.',
  },
  'zh-hant': {
    title: '備份',
    description: '管理 JSON 集合快照與還原記錄。',
    heading: '備份',
    body: '所有 JSON 集合（bookings / forms / marketing / search / webhooks / errors / migrations 等）的快照。保留 30 天。',
  },
  en: {
    title: 'Backups',
    description: 'Manage JSON collection snapshots and restores.',
    heading: 'Backups',
    body: 'Snapshots for all JSON collections (bookings / forms / marketing / search / webhooks / errors / migrations, and more). 30-day retention.',
  },
};

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: COPY[locale].title,
    description: COPY[locale].description,
    path: '/admin-builder/backups',
    alternateLocales: locales,
    noindex: true,
  });
}

export default async function BackupsPage({ params }: { params: { locale: string } }) {
  const locale = normalizeLocale(params.locale);
  const text = COPY[locale];
  const backups = await listBackups();
  return (
    <main>
      <header style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>{text.heading}</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: '#64748b' }}>{text.body}</p>
      </header>
      <BackupsAdmin locale={locale} initialBackups={backups} />
    </main>
  );
}
