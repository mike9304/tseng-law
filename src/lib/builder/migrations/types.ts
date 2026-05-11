/**
 * PR #17 — Schema migration framework.
 *
 * Each Migration is idempotent: applying it twice produces the same result.
 * The runner persists a version journal so already-applied migrations are
 * skipped, and any failure halts execution and reports which migration
 * blocked.
 */

export interface MigrationContext {
  /** Backend in use ('blob' or 'file') — for backend-specific quirks. */
  backend: 'blob' | 'file';
  /** Logger so migrations don't write directly to console. */
  log: (line: string) => void;
}

export interface Migration {
  /** Sort key — strictly increasing. Convention: `YYYY-MM-DD-slug`. */
  id: string;
  description: string;
  /** Apply the migration. Must be idempotent. */
  up(ctx: MigrationContext): Promise<{ touched: number; details?: Record<string, unknown> }>;
}

export interface MigrationRecord {
  id: string;
  description: string;
  appliedAt: string;
  durationMs: number;
  touched: number;
  details?: Record<string, unknown>;
}

export interface MigrationJournal {
  version: number;
  applied: MigrationRecord[];
}

export const JOURNAL_VERSION = 1;
