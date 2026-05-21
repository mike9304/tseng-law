import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

const ORIGINAL_CWD = process.cwd();
let tmpRoot = '';

beforeEach(async () => {
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'crm-send-'));
  process.chdir(tmpRoot);
  delete process.env.BLOB_READ_WRITE_TOKEN;
  process.env.CRM_BACKEND = 'local';
});

afterEach(async () => {
  process.chdir(ORIGINAL_CWD);
  await fs.rm(tmpRoot, { recursive: true, force: true });
});

describe('campaign send queue', () => {
  it('enqueues fresh entries as pending', async () => {
    const { enqueueSends, readSendQueue } = await import(
      '@/lib/builder/crm/campaign-queue'
    );
    const created = await enqueueSends([
      { campaignId: 'cmp1', contactId: 'ct1', contactEmail: 'A@x.io' },
      { campaignId: 'cmp1', contactId: 'ct2', contactEmail: 'B@x.io' },
    ]);
    expect(created).toHaveLength(2);
    expect(created.every((e) => e.status === 'pending')).toBe(true);
    expect(created[0].contactEmail).toBe('a@x.io');

    const queue = await readSendQueue();
    expect(queue).toHaveLength(2);
  });

  it('dedupes by (campaignId, contactId) for non-terminal entries', async () => {
    const { enqueueSends, readSendQueue } = await import(
      '@/lib/builder/crm/campaign-queue'
    );
    await enqueueSends([
      { campaignId: 'cmp1', contactId: 'ct1', contactEmail: 'a@x.io' },
    ]);
    const second = await enqueueSends([
      { campaignId: 'cmp1', contactId: 'ct1', contactEmail: 'a@x.io' },
      { campaignId: 'cmp1', contactId: 'ct2', contactEmail: 'b@x.io' },
    ]);
    expect(second.map((e) => e.contactId)).toEqual(['ct2']);
    expect(await readSendQueue()).toHaveLength(2);
  });

  it('dequeuePending returns FIFO and ignores non-pending', async () => {
    const { enqueueSends, dequeuePending, markStatus } = await import(
      '@/lib/builder/crm/campaign-queue'
    );
    const created = await enqueueSends([
      { campaignId: 'c', contactId: 'ct1', contactEmail: 'a@x.io' },
      { campaignId: 'c', contactId: 'ct2', contactEmail: 'b@x.io' },
      { campaignId: 'c', contactId: 'ct3', contactEmail: 'c@x.io' },
    ]);
    await markStatus(created[0].id, 'sent');
    const pending = await dequeuePending(10);
    expect(pending.map((e) => e.contactId)).toEqual(['ct2', 'ct3']);
  });

  it('markStatus bumps attempts and stores lastError on failure', async () => {
    const { enqueueSends, markStatus } = await import(
      '@/lib/builder/crm/campaign-queue'
    );
    const [entry] = await enqueueSends([
      { campaignId: 'c', contactId: 'ct1', contactEmail: 'a@x.io' },
    ]);
    const failed = await markStatus(entry.id, 'failed', { lastError: 'SMTP timeout' });
    expect(failed?.status).toBe('failed');
    expect(failed?.attempts).toBe(1);
    expect(failed?.lastError).toBe('SMTP timeout');

    const bounced = await markStatus(entry.id, 'bounced', { lastError: '550 no such user' });
    expect(bounced?.attempts).toBe(2);
    expect(bounced?.lastError).toBe('550 no such user');
  });

  it('markStatus on missing id returns null', async () => {
    const { markStatus } = await import('@/lib/builder/crm/campaign-queue');
    expect(await markStatus('snd_does_not_exist', 'sent')).toBeNull();
  });

  it('getSendQueueStats aggregates totals per status and per campaign', async () => {
    const { enqueueSends, markStatus, getSendQueueStats } = await import(
      '@/lib/builder/crm/campaign-queue'
    );
    const created = await enqueueSends([
      { campaignId: 'cmpA', contactId: 'ct1', contactEmail: 'a@x.io' },
      { campaignId: 'cmpA', contactId: 'ct2', contactEmail: 'b@x.io' },
      { campaignId: 'cmpB', contactId: 'ct3', contactEmail: 'c@x.io' },
    ]);
    await markStatus(created[0].id, 'sent');
    await markStatus(created[1].id, 'bounced', { lastError: 'b' });

    const stats = await getSendQueueStats(5);
    expect(stats.total).toBe(3);
    expect(stats.pending).toBe(1);
    expect(stats.sent).toBe(1);
    expect(stats.bounced).toBe(1);
    expect(stats.failed).toBe(0);
    expect(stats.byCampaign.cmpA.total).toBe(2);
    expect(stats.byCampaign.cmpA.sent).toBe(1);
    expect(stats.byCampaign.cmpA.bounced).toBe(1);
    expect(stats.byCampaign.cmpB.pending).toBe(1);
    expect(stats.recent.length).toBeGreaterThan(0);
  });

  it('allows a re-enqueue after the prior attempt failed/bounced', async () => {
    const { enqueueSends, markStatus, readSendQueue } = await import(
      '@/lib/builder/crm/campaign-queue'
    );
    const [first] = await enqueueSends([
      { campaignId: 'c', contactId: 'ct1', contactEmail: 'a@x.io' },
    ]);
    await markStatus(first.id, 'failed', { lastError: 'temp' });

    const second = await enqueueSends([
      { campaignId: 'c', contactId: 'ct1', contactEmail: 'a@x.io' },
    ]);
    expect(second).toHaveLength(1);
    expect(await readSendQueue()).toHaveLength(2);
  });
});