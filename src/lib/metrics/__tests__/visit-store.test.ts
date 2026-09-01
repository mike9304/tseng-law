import { mkdtemp, mkdir, rm, writeFile } from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  deleteRawBatches,
  listRawBatchKeys,
  listRawDays,
  listSummaryDays,
  readDailySummary,
  readRawBatch,
  saveDailyRollup,
  saveVisitEventBatch,
} from '../visit-store';
import type { EnrichedVisitEvent } from '../visit-schema';

const originalCwd = process.cwd();
const originalToken = process.env.BLOB_READ_WRITE_TOKEN;
let cwd = '';
const event: EnrichedVisitEvent = {
  v: 1, sid: 'visitor_123', ts: '2026-09-01T01:00:00.000Z', type: 'pageview', path: '/ko', locale: 'ko', firstLoad: true,
  receivedAt: '2026-09-01T01:00:01.000Z', channel: 'direct', source: null, keyword: null,
};

describe.sequential('visit store local backend', () => {
  beforeEach(async () => {
    cwd = await mkdtemp(path.join(os.tmpdir(), 'visit-store-'));
    process.chdir(cwd);
    delete process.env.BLOB_READ_WRITE_TOKEN;
  });

  afterEach(async () => {
    process.chdir(originalCwd);
    if (originalToken === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
    else process.env.BLOB_READ_WRITE_TOKEN = originalToken;
    await rm(cwd, { recursive: true, force: true });
  });

  it('saves and reads a raw batch under the dynamic local cwd', async () => {
    await saveVisitEventBatch([event], '2026-09-01');
    const keys = await listRawBatchKeys('2026-09-01');
    expect(keys).toHaveLength(1);
    expect(keys[0]).toMatch(/^metrics\/visits\/raw\/2026-09-01\/\d+-[a-z0-9]{6}\.json$/);
    expect(await readRawBatch(keys[0])).toEqual([event]);
    expect(await listRawDays()).toEqual(['2026-09-01']);
  });

  it('writes daily JSONL and its summary together', async () => {
    await saveDailyRollup('2026-09-01', [event], { day: '2026-09-01', totals: { pageviews: 1 } });
    expect(await readDailySummary('2026-09-01')).toEqual({ day: '2026-09-01', totals: { pageviews: 1 } });
    expect(await listSummaryDays()).toEqual(['2026-09-01']);
  });

  it('uses the current UTC day when no raw batch day is supplied', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-02T23:59:59.000Z'));
    try {
      await saveVisitEventBatch([event]);
      const [key] = await listRawBatchKeys('2026-10-02');
      expect(key).toMatch(/^metrics\/visits\/raw\/2026-10-02\/\d+-[0-9a-f]{6}\.json$/);
    } finally {
      vi.useRealTimers();
    }
  });

  it('deletes only supplied raw batch keys', async () => {
    await saveVisitEventBatch([event], '2026-09-01');
    const [key] = await listRawBatchKeys('2026-09-01');
    await deleteRawBatches([key]);
    expect(await listRawBatchKeys('2026-09-01')).toEqual([]);
    expect(await listRawDays()).toEqual([]);
  });

  it('rejects invalid day input and ignores malformed raw JSON with a warning', async () => {
    await expect(saveVisitEventBatch([], '../unsafe')).rejects.toThrow('Invalid UTC day');
    await expect(listRawBatchKeys('../unsafe')).rejects.toThrow('Invalid UTC day');
    await expect(saveDailyRollup('../unsafe', [], {})).rejects.toThrow('Invalid UTC day');
    await expect(readDailySummary('../unsafe')).rejects.toThrow('Invalid UTC day');
    const rawDir = path.join(cwd, '.data', 'metrics', 'visits', 'raw', '2026-09-01');
    await mkdir(rawDir, { recursive: true });
    await writeFile(path.join(rawDir, 'bad.json'), '{}');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(await readRawBatch('metrics/visits/raw/2026-09-01/bad.json')).toEqual([]);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });
});
