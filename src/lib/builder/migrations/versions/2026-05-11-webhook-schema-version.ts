import type { Migration } from '../types';
import { listSubscriptions, saveSubscription } from '@/lib/builder/webhooks/storage';

/**
 * PR #17 — Example migration.
 *
 * Backfills every existing webhook subscription with the `schemaVersion`
 * tag so future schema changes can branch on the stored version.
 *
 * Idempotent: rows already carrying `schemaVersion: 1` are skipped, so
 * re-running has no effect.
 */
export const migration_2026_05_11_webhook_schema_version: Migration = {
  id: '2026-05-11-webhook-schema-version',
  description: 'Backfill schemaVersion=1 on WebhookSubscription records',
  async up(ctx) {
    const subscriptions = await listSubscriptions();
    let touched = 0;
    for (const sub of subscriptions) {
      const tagged = sub as typeof sub & { schemaVersion?: number };
      if (tagged.schemaVersion === 1) continue;
      await saveSubscription({ ...sub, ...{ schemaVersion: 1 } } as typeof sub);
      touched += 1;
    }
    ctx.log(`tagged ${touched}/${subscriptions.length} subscriptions`);
    return { touched, details: { total: subscriptions.length } };
  },
};
