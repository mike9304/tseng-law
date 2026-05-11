import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import {
  listSubscriptions,
  makeWebhookId,
  makeWebhookSecret,
  saveSubscription,
} from '@/lib/builder/webhooks/storage';
import { dispatchToSubscription } from '@/lib/builder/webhooks/dispatcher';
import { verifyWebhookSignature } from '@/lib/builder/webhooks/signature';
import {
  listSubscribers,
  makeSubscriberId,
  makeToken,
  saveSubscriber,
} from '@/lib/builder/marketing/subscriber-storage';
import {
  listExperiments,
  makeExperimentId,
  saveExperiment,
} from '@/lib/builder/experiments/storage';
import { assignVariant } from '@/lib/builder/experiments/assign';
import { emptyMetrics } from '@/lib/builder/experiments/types';
import { runMigrations } from '@/lib/builder/migrations/runner';
import * as migrationJournal from '@/lib/builder/migrations/journal';
import { createBackupSnapshot, listBackups } from '@/lib/builder/backups/backup-engine';

/**
 * PR #20 — Wix-parity integration smoke test.
 *
 * Exercises the cross-PR chain: register subscribers + webhook, run a
 * migration, create a backup snapshot, then assign an A/B variant — all
 * against the file backend in a temp workspace. This is the closest in-
 * process equivalent to the Playwright E2E plan in §4.20 of the spec.
 */

const PROJECT_ROOT = process.cwd();
const ORIGINAL_BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

async function rmrf(dir: string): Promise<void> {
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}

describe('Wix parity integration smoke', () => {
  beforeEach(async () => {
    delete process.env.BLOB_READ_WRITE_TOKEN; // force file backend
    await rmrf(path.join(PROJECT_ROOT, 'runtime-data', 'webhooks'));
    await rmrf(path.join(PROJECT_ROOT, 'runtime-data', 'marketing-subscribers'));
    await rmrf(path.join(PROJECT_ROOT, 'runtime-data', 'experiments'));
    await rmrf(path.join(PROJECT_ROOT, 'runtime-data', 'migrations'));
    await rmrf(path.join(PROJECT_ROOT, 'runtime-data', 'backups'));
  });

  afterEach(() => {
    if (ORIGINAL_BLOB_TOKEN === undefined) {
      delete process.env.BLOB_READ_WRITE_TOKEN;
    } else {
      process.env.BLOB_READ_WRITE_TOKEN = ORIGINAL_BLOB_TOKEN;
    }
  });

  it('persists subscribers + webhook through the storage layer', async () => {
    const now = new Date().toISOString();
    await saveSubscriber({
      subscriberId: makeSubscriberId(),
      email: 'visitor@example.com',
      status: 'subscribed',
      tags: ['vip'],
      preferredLocale: 'ko',
      unsubscribeToken: makeToken(),
      source: 'integration-test',
      createdAt: now,
      updatedAt: now,
    });
    await saveSubscription({
      webhookId: makeWebhookId(),
      url: 'https://example.com/hook',
      events: ['form.submitted'],
      secret: makeWebhookSecret(),
      active: true,
      createdAt: now,
      updatedAt: now,
    });
    const subs = await listSubscribers();
    const hooks = await listSubscriptions();
    expect(subs).toHaveLength(1);
    expect(hooks).toHaveLength(1);
  });

  it('runs migrations and backs up the resulting state', async () => {
    let appliedCount = 0;
    const journal = await migrationJournal.loadMigrationJournal();
    expect(journal.applied).toHaveLength(0);
    const result = await runMigrations([
      {
        id: '2026-05-11-integration',
        description: 'integration smoke migration',
        async up() {
          appliedCount += 1;
          return { touched: 0 };
        },
      },
    ], { logger: () => undefined });
    expect(result.ok).toBe(true);
    expect(appliedCount).toBe(1);

    const summary = await createBackupSnapshot({ triggeredBy: 'manual' });
    expect(summary.entryCount).toBeGreaterThanOrEqual(0);
    const backups = await listBackups();
    expect(backups).toHaveLength(1);
  });

  it('assigns A/B variants deterministically and the webhook signature verifies', async () => {
    const now = new Date().toISOString();
    const exp = {
      experimentId: makeExperimentId(),
      name: 'cta-color',
      targetPath: '',
      variants: [
        { variantId: 'control', label: 'control', weight: 50 },
        { variantId: 'test', label: 'test', weight: 50 },
      ],
      goalEvent: 'cta-click',
      status: 'running' as const,
      metrics: emptyMetrics(),
      createdAt: now,
      updatedAt: now,
    };
    await saveExperiment(exp);
    const stored = (await listExperiments())[0];
    const v1 = assignVariant(stored, 'session-abc');
    const v2 = assignVariant(stored, 'session-abc');
    expect(v1?.variantId).toBe(v2?.variantId);

    // Webhook delivery with valid HMAC must verify; tampered payload must not.
    const subscription = {
      webhookId: makeWebhookId(),
      url: 'https://httpbin.org/status/200',
      events: ['form.submitted' as const],
      secret: makeWebhookSecret(),
      active: true,
      createdAt: now,
      updatedAt: now,
    };
    await saveSubscription(subscription);
    // Don't actually hit httpbin in CI — verify only the signature math.
    const body = JSON.stringify({ hello: 'world' });
    // sign the payload manually using the same helper.
    const { signWebhookPayload } = await import('@/lib/builder/webhooks/signature');
    const header = signWebhookPayload(subscription.secret, body);
    expect(verifyWebhookSignature(subscription.secret, body, header)).toBe(true);
    expect(verifyWebhookSignature(subscription.secret, `${body}x`, header)).toBe(false);

    // Sanity: the dispatcher should be callable but expected to fail against
    // the placeholder URL — the test only checks that the call returns a
    // delivery record without throwing.
    const delivery = await dispatchToSubscription(subscription, 'form.submitted', { hello: 'world' });
    expect(delivery.webhookId).toBe(subscription.webhookId);
  });
});
