import { mkdir, mkdtemp, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  appendOpsDashboardHistory,
  readOpsDashboardHistory,
} from '@/lib/builder/ops/dashboard-history';

let runtimeRoot: string;

beforeEach(async () => {
  runtimeRoot = await mkdtemp(path.join(os.tmpdir(), 'ops-dashboard-history-'));
  process.env.BUILDER_OPS_DATA_PATH = path.join(runtimeRoot, 'ops');
  await mkdir(process.env.BUILDER_OPS_DATA_PATH, { recursive: true });
});

afterEach(async () => {
  delete process.env.BUILDER_OPS_DATA_PATH;
  await rm(runtimeRoot, { recursive: true, force: true });
});

describe('ops dashboard history', () => {
  it('persists and caps recent entries', async () => {
    for (let index = 0; index < 30; index += 1) {
      await appendOpsDashboardHistory({
        generatedAt: `2026-05-29T00:${String(index).padStart(2, '0')}:00.000Z`,
        logs24h: index,
        errors24h: index % 3,
        deniedRequests: index % 2,
        runtimeCacheKeys: index,
        backupCount: index,
        rssBytes: index * 1024,
        heapUsedBytes: index * 2048,
      });
    }

    const history = await readOpsDashboardHistory();
    expect(history).toHaveLength(24);
    expect(history[0].generatedAt).toBe('2026-05-29T00:06:00.000Z');
    expect(history.at(-1)?.generatedAt).toBe('2026-05-29T00:29:00.000Z');
  });
});
