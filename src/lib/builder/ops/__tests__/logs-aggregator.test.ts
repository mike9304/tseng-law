import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AuditEvent } from '@/lib/builder/audit/types';
import { readRecentAuditEvents } from '@/lib/builder/audit/store';
import { listErrorLog } from '@/lib/builder/errors/storage';
import { aggregateLogs } from '@/lib/builder/ops/logs-aggregator';

vi.mock('@/lib/builder/audit/store', () => ({
  readRecentAuditEvents: vi.fn(),
}));

vi.mock('@/lib/builder/errors/storage', () => ({
  listErrorLog: vi.fn(),
}));

const cmsLifecycleEvent: AuditEvent = {
  type: 'cms.records.bulk_lifecycle',
  at: '2026-06-25T08:00:00.000Z',
  actorRef: 'admin',
  siteId: 'tseng-law-main-site',
  collectionId: 'recipes-ops-audit',
  action: 'status',
  recordIds: ['record-alpha', 'record-beta'],
  requestedCount: 2,
  changedCount: 1,
  locale: 'ko',
  status: 'archived',
  skippedRecordIds: ['record-beta'],
};

describe('ops logs aggregator', () => {
  beforeEach(() => {
    vi.mocked(readRecentAuditEvents).mockReset();
    vi.mocked(listErrorLog).mockReset();
    vi.mocked(readRecentAuditEvents).mockResolvedValue([cmsLifecycleEvent]);
    vi.mocked(listErrorLog).mockResolvedValue([]);
  });

  it('normalizes CMS lifecycle audit events for ops drilldown', async () => {
    const result = await aggregateLogs({ type: 'audit', limit: 10 });

    const [entry] = result.entries;
    expect(entry).toBeDefined();
    if (!entry) throw new Error('Expected one audit log entry.');
    expect(entry.summary).toContain('CMS lifecycle');
    expect(entry.summary).toContain('recipes-ops-audit');
    expect(entry.summary).toContain('1/2 changed');
    expect(entry.details).toEqual(expect.arrayContaining([
      { label: 'Collection', value: 'recipes-ops-audit' },
      { label: 'Action', value: 'status' },
      { label: 'Status', value: 'archived' },
      { label: 'Changed', value: '1/2' },
      { label: 'Records', value: 'record-alpha, record-beta' },
      { label: 'Skipped', value: 'record-beta' },
    ]));
  });
});
