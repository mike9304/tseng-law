import { loadMigrationJournal, saveMigrationJournal } from './journal';
import type { Migration, MigrationContext, MigrationRecord } from './types';
import { JOURNAL_VERSION } from './types';

interface RunnerResult {
  ok: boolean;
  applied: MigrationRecord[];
  skipped: string[];
  failed?: { id: string; error: string };
}

/**
 * Apply every migration whose id has not yet been recorded in the journal.
 * Stops at the first failure and persists progress up to that point.
 *
 * The migrations array is sorted by id so applying in registration order
 * doesn't depend on the caller getting the array order right.
 */
export async function runMigrations(
  migrations: Migration[],
  options: { logger?: (line: string) => void } = {},
): Promise<RunnerResult> {
  const log = options.logger ?? ((line: string) => console.info(`[migrations] ${line}`));
  const journal = await loadMigrationJournal();
  const applied = new Set(journal.applied.map((r) => r.id));
  const sorted = [...migrations].sort((a, b) => a.id.localeCompare(b.id));

  const result: RunnerResult = { ok: true, applied: [], skipped: [] };

  const ctx: MigrationContext = {
    backend: process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file',
    log,
  };

  for (const migration of sorted) {
    if (applied.has(migration.id)) {
      result.skipped.push(migration.id);
      continue;
    }
    const start = Date.now();
    try {
      const outcome = await migration.up(ctx);
      const record: MigrationRecord = {
        id: migration.id,
        description: migration.description,
        appliedAt: new Date().toISOString(),
        durationMs: Date.now() - start,
        touched: outcome.touched,
        details: outcome.details,
      };
      result.applied.push(record);
      journal.applied.push(record);
      journal.version = JOURNAL_VERSION;
      await saveMigrationJournal(journal);
      log(`applied ${migration.id} (${record.durationMs}ms, ${record.touched} touched)`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      result.ok = false;
      result.failed = { id: migration.id, error: message };
      log(`FAILED ${migration.id}: ${message}`);
      break;
    }
  }

  return result;
}
