import type { Migration } from './types';
import { migration_2026_05_11_webhook_schema_version } from './versions/2026-05-11-webhook-schema-version';

/**
 * PR #17 — Migration registry. Add new migrations here.
 *
 * Order doesn't matter — the runner sorts by `id` before applying.
 */
export const MIGRATIONS: Migration[] = [
  migration_2026_05_11_webhook_schema_version,
];
