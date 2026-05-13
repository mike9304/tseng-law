import { promises as fs } from 'fs';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  deletePendingWebhook,
  drainPendingWebhooks,
  listPendingWebhooks,
  recordFailedWebhook,
  updatePendingWebhook,
} from '../webhook-retry';

const ROOT = path.join(process.cwd(), 'runtime-data', 'webhook-retry');

describe('webhook retry queue', () => {
  beforeEach(async () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', '');
    vi.stubEnv('FORM_WEBHOOK_RETRY_BACKEND', 'local');
    await fs.rm(ROOT, { recursive: true, force: true });
  });

  afterEach(async () => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    await fs.rm(ROOT, { recursive: true, force: true });
  });

  it('records failed webhook deliveries for later retry', async () => {
    await recordFailedWebhook('https://hooks.example.test/form', { ok: true }, new Error('network down'));

    const entries = await listPendingWebhooks();

    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      url: 'https://hooks.example.test/form',
      payload: { ok: true },
      attempts: 1,
      lastError: 'network down',
    });
    expect(entries[0]?.id).toMatch(/^wh_/);
    expect(Date.parse(entries[0]!.nextAttemptAt)).toBeGreaterThan(Date.now());
  });

  it('delivers due entries and removes them from the queue', async () => {
    await recordFailedWebhook('https://hooks.example.test/form', { ok: true }, new Error('network down'));
    const [entry] = await listPendingWebhooks();
    await updatePendingWebhook({
      ...entry!,
      nextAttemptAt: new Date(Date.now() - 1000).toISOString(),
    });
    const fetchMock = vi.fn(async () => new Response(null, { status: 204 }));
    vi.stubGlobal('fetch', fetchMock);

    const result = await drainPendingWebhooks();

    expect(result).toEqual({ processed: 1, delivered: 1, failed: 0, dropped: 0 });
    expect(fetchMock).toHaveBeenCalledWith(
      'https://hooks.example.test/form',
      expect.objectContaining({ method: 'POST', body: JSON.stringify({ ok: true }) }),
    );
    expect(await listPendingWebhooks()).toEqual([]);
  });

  it('reschedules failed due entries and drops exhausted entries', async () => {
    await recordFailedWebhook('https://hooks.example.test/form', { ok: true }, new Error('network down'));
    const [entry] = await listPendingWebhooks();
    await updatePendingWebhook({
      ...entry!,
      nextAttemptAt: new Date(Date.now() - 1000).toISOString(),
    });
    vi.stubGlobal('fetch', vi.fn(async () => new Response(null, { status: 503 })));

    const failed = await drainPendingWebhooks();
    const [rescheduled] = await listPendingWebhooks();

    expect(failed).toEqual({ processed: 1, delivered: 0, failed: 1, dropped: 0 });
    expect(rescheduled).toMatchObject({ attempts: 2, lastError: 'HTTP 503' });
    expect(Date.parse(rescheduled!.nextAttemptAt)).toBeGreaterThan(Date.now());

    await updatePendingWebhook({
      ...rescheduled!,
      attempts: 6,
      nextAttemptAt: new Date(Date.now() - 1000).toISOString(),
    });
    const dropped = await drainPendingWebhooks();

    expect(dropped).toEqual({ processed: 1, delivered: 0, failed: 0, dropped: 1 });
    expect(await listPendingWebhooks()).toEqual([]);
  });

  it('ignores invalid retry ids on delete', async () => {
    await deletePendingWebhook('../outside-root');

    expect(await listPendingWebhooks()).toEqual([]);
  });
});
