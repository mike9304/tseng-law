import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { loadMigrationJournal } from '@/lib/builder/migrations/journal';
import { MIGRATIONS } from '@/lib/builder/migrations/registry';
import MigrationsAdmin from '@/components/builder/migrations/MigrationsAdmin';

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  return {
    title: locale === 'ko' ? '스키마 마이그레이션' : locale === 'zh-hant' ? '結構遷移' : 'Schema migrations',
    description: locale === 'ko'
      ? '블롭 JSON 컬렉션 스키마 변경을 순서대로 적용하고 적용 이력을 검토합니다.'
      : locale === 'zh-hant'
        ? '依序套用 Blob JSON 集合結構變更，並檢視套用紀錄。'
        : 'Apply blob JSON collection schema changes in order and review the applied history.',
    robots: { index: false, follow: false },
  };
}

export default async function MigrationsPage({ params }: { params: { locale: Locale } }) {
  const locale = normalizeLocale(params.locale);
  const journal = await loadMigrationJournal();
  const appliedIds = new Set(journal.applied.map((r) => r.id));
  const pending = MIGRATIONS
    .filter((m) => !appliedIds.has(m.id))
    .map((m) => ({ id: m.id, description: m.description }));
  return <MigrationsAdmin locale={locale} initialJournal={journal} initialPending={pending} />;
}
