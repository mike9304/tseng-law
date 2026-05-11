import type { Metadata } from 'next';
import { loadMigrationJournal } from '@/lib/builder/migrations/journal';
import { MIGRATIONS } from '@/lib/builder/migrations/registry';
import MigrationsAdmin from '@/components/builder/migrations/MigrationsAdmin';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Migrations',
  robots: { index: false, follow: false },
};

export default async function MigrationsPage() {
  const journal = await loadMigrationJournal();
  const appliedIds = new Set(journal.applied.map((r) => r.id));
  const pending = MIGRATIONS
    .filter((m) => !appliedIds.has(m.id))
    .map((m) => ({ id: m.id, description: m.description }));
  return <MigrationsAdmin initialJournal={journal} initialPending={pending} />;
}
