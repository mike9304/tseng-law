import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { isCronAuthorized } from '@/lib/builder/security/cron-auth';
import { buildDailySummary } from '@/lib/metrics/visit-rollup';
import {
  deleteRawBatches,
  listRawBatchKeys,
  listRawDays,
  readRawBatch,
  saveDailyRollup,
} from '@/lib/metrics/visit-store';
import type { EnrichedVisitEvent } from '@/lib/metrics/visit-schema';

vi.mock('@/lib/builder/security/cron-auth', () => ({
  isCronAuthorized: vi.fn(() => false),
}));

vi.mock('@/lib/metrics/visit-rollup', () => ({
  buildDailySummary: vi.fn(),
}));

vi.mock('@/lib/metrics/visit-store', () => ({
  deleteRawBatches: vi.fn(),
  listRawBatchKeys: vi.fn(),
  listRawDays: vi.fn(),
  readRawBatch: vi.fn(),
  saveDailyRollup: vi.fn(),
}));

const event: EnrichedVisitEvent = {
  v: 1,
  sid: 'visitor_123',
  ts: '2026-09-01T01:00:00.000Z',
  type: 'pageview',
  path: '/ko',
  locale: 'ko',
  firstLoad: true,
  receivedAt: '2026-09-01T01:00:01.000Z',
  channel: 'direct',
  source: null,
  keyword: null,
};

const summary = {
  day: '2026-09-01',
  totals: { pageviews: 1, sessions: 1, avgDwellMs: 0, bounceSessions: 1 },
  byChannel: { direct: 1 },
  bySource: {},
  aiBySource: {},
  aiLandingPages: {},
  byLocale: { ko: 1 },
  byCountry: {},
  topPages: [{ path: '/ko', views: 1, avgDwellMs: 0 }],
  topEntryPages: [{ path: '/ko', count: 1 }],
  keywords: [],
  localeSwitchSessions: 0,
};

function cronRequest(
  url = 'https://law.example.test/api/cron/metrics-rollup',
  method = 'POST',
): NextRequest {
  return new NextRequest(url, { method });
}

describe('/api/cron/metrics-rollup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(isCronAuthorized).mockReturnValue(true);
    vi.mocked(listRawDays).mockResolvedValue([]);
    vi.mocked(listRawBatchKeys).mockResolvedValue([]);
    vi.mocked(readRawBatch).mockResolvedValue([]);
    vi.mocked(buildDailySummary).mockReturnValue(summary);
    vi.mocked(saveDailyRollup).mockResolvedValue(undefined);
    vi.mocked(deleteRawBatches).mockResolvedValue(undefined);
  });

  it('returns 401 for an unauthorized GET without touching the store', async () => {
    vi.mocked(isCronAuthorized).mockReturnValue(false);
    const route = await import('../route');
    const response = await route.GET(cronRequest(undefined, 'GET'));

    expect(response.status).toBe(401);
    expect(listRawDays).not.toHaveBeenCalled();
    expect(listRawBatchKeys).not.toHaveBeenCalled();
    expect(saveDailyRollup).not.toHaveBeenCalled();
    expect(deleteRawBatches).not.toHaveBeenCalled();
  });

  it('returns 400 for an invalid explicit day', async () => {
    const route = await import('../route');
    const response = await route.POST(cronRequest(
      'https://law.example.test/api/cron/metrics-rollup?day=2026-02-31',
    ));

    expect(response.status).toBe(400);
    expect(listRawDays).not.toHaveBeenCalled();
    expect(listRawBatchKeys).not.toHaveBeenCalled();
  });

  it('reads every batch and deletes raw data only after saving the rollup', async () => {
    const order: string[] = [];
    vi.mocked(listRawBatchKeys).mockResolvedValue([
      'metrics/visits/raw/2026-09-01/1-aaaaaa.json',
      'metrics/visits/raw/2026-09-01/2-bbbbbb.json',
    ]);
    vi.mocked(readRawBatch)
      .mockResolvedValueOnce([event])
      .mockResolvedValueOnce([]);
    vi.mocked(saveDailyRollup).mockImplementation(async () => { order.push('save'); });
    vi.mocked(deleteRawBatches).mockImplementation(async () => { order.push('delete'); });

    const route = await import('../route');
    const response = await route.POST(cronRequest(
      'https://law.example.test/api/cron/metrics-rollup?day=2026-09-01',
    ));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      processed: [{ day: '2026-09-01', events: 1, batches: 2 }],
      errors: [],
    });
    expect(buildDailySummary).toHaveBeenCalledWith('2026-09-01', [event]);
    expect(saveDailyRollup).toHaveBeenCalledWith('2026-09-01', [event], summary);
    expect(deleteRawBatches).toHaveBeenCalledWith([
      'metrics/visits/raw/2026-09-01/1-aaaaaa.json',
      'metrics/visits/raw/2026-09-01/2-bbbbbb.json',
    ]);
    expect(order).toEqual(['save', 'delete']);
  });

  it('collects a save failure and does not delete that day raw batches', async () => {
    vi.mocked(listRawBatchKeys).mockResolvedValue([
      'metrics/visits/raw/2026-09-01/1-aaaaaa.json',
    ]);
    vi.mocked(readRawBatch).mockResolvedValue([event]);
    vi.mocked(saveDailyRollup).mockRejectedValue(new Error('storage unavailable'));

    const route = await import('../route');
    const response = await route.POST(cronRequest(
      'https://law.example.test/api/cron/metrics-rollup?day=2026-09-01',
    ));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: false,
      processed: [],
      errors: [{ day: '2026-09-01', error: 'storage unavailable' }],
    });
    expect(deleteRawBatches).not.toHaveBeenCalled();
  });

  it('does not overwrite an existing rollup when an explicit day has no raw batches', async () => {
    const route = await import('../route');
    const response = await route.POST(cronRequest(
      'https://law.example.test/api/cron/metrics-rollup?day=2026-09-01',
    ));

    expect(await response.json()).toEqual({
      ok: true,
      processed: [{ day: '2026-09-01', events: 0, batches: 0 }],
      errors: [],
    });
    expect(readRawBatch).not.toHaveBeenCalled();
    expect(buildDailySummary).not.toHaveBeenCalled();
    expect(saveDailyRollup).not.toHaveBeenCalled();
    expect(deleteRawBatches).not.toHaveBeenCalled();
  });

  it('selects at most seven pre-today raw days from oldest to newest', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-10T00:00:00.000Z'));
    vi.mocked(listRawDays).mockResolvedValue([
      '2026-09-10',
      '2026-09-09',
      '2026-09-08',
      '2026-09-07',
      '2026-09-06',
      '2026-09-05',
      '2026-09-04',
      '2026-09-03',
      '2026-09-02',
      '2026-09-01',
      '2026-09-11',
    ]);
    vi.mocked(listRawBatchKeys).mockImplementation(async (day) => [
      `metrics/visits/raw/${day}/1-aaaaaa.json`,
    ]);

    try {
      const route = await import('../route');
      const response = await route.POST(cronRequest());
      const payload = await response.json();

      expect(payload.processed.map((result: { day: string }) => result.day)).toEqual([
        '2026-09-01',
        '2026-09-02',
        '2026-09-03',
        '2026-09-04',
        '2026-09-05',
        '2026-09-06',
        '2026-09-07',
      ]);
      expect(listRawBatchKeys).toHaveBeenCalledTimes(7);
    } finally {
      vi.useRealTimers();
    }
  });

  it('continues with the next raw day after one day fails', async () => {
    vi.mocked(listRawDays).mockResolvedValue(['2026-08-30', '2026-08-31']);
    vi.mocked(listRawBatchKeys).mockImplementation(async (day) => [
      `metrics/visits/raw/${day}/1-aaaaaa.json`,
    ]);
    vi.mocked(saveDailyRollup).mockRejectedValueOnce(new Error('first day failed'));

    const route = await import('../route');
    const response = await route.POST(cronRequest());
    const payload = await response.json();

    expect(payload).toEqual({
      ok: false,
      processed: [{ day: '2026-08-31', events: 0, batches: 1 }],
      errors: [{ day: '2026-08-30', error: 'first day failed' }],
    });
    expect(saveDailyRollup).toHaveBeenCalledTimes(2);
    expect(deleteRawBatches).toHaveBeenCalledTimes(1);
    expect(deleteRawBatches).toHaveBeenCalledWith([
      'metrics/visits/raw/2026-08-31/1-aaaaaa.json',
    ]);
  });
});
