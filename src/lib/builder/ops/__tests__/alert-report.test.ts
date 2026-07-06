import { mkdir, mkdtemp, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  buildOpsAlertReport,
  persistOpsAlertReport,
  readLatestOpsAlertReport,
} from '@/lib/builder/ops/alert-report';
import type { OpsDashboardSnapshot, OpsDashboardTrendPoint } from '@/lib/builder/ops/dashboard';

let runtimeRoot: string;

function snapshotFixture(overrides: {
  readonly errorCount?: number;
  readonly deniedRequests?: number;
  readonly cacheKeys?: number;
  readonly backupCount?: number;
  readonly heapUsedBytes?: number;
  readonly heapTotalBytes?: number;
} = {}): OpsDashboardSnapshot {
  const heapUsedBytes = overrides.heapUsedBytes ?? 9_000;
  const heapTotalBytes = overrides.heapTotalBytes ?? 10_000;
  return {
    generatedAt: '2026-06-21T05:00:00.000Z',
    health: {
      gatheredAt: '2026-06-21T05:00:00.000Z',
      deploys: { status: 'ok', source: 'vercel' },
      cache: { runtimeCacheKeys: overrides.cacheKeys ?? 0 },
      storage: { backupCount: overrides.backupCount ?? 0 },
      logs: { last24hCount: 12, errorCount: overrides.errorCount ?? 3 },
      security: { last24hEvents: 5, deniedRequests: overrides.deniedRequests ?? 2 },
    },
    perf: {
      capturedAt: '2026-06-21T05:00:00.000Z',
      uptimeSeconds: 3600,
      memory: {
        rssBytes: 180_000,
        heapTotalBytes,
        heapUsedBytes,
        externalBytes: 1024,
      },
      node: { version: 'v20.0.0', platform: 'darwin', arch: 'arm64' },
    },
    security: {
      windowHours: 24,
      generatedAt: '2026-06-21T05:00:00.000Z',
      totalEvents: 5,
      deniedRequests: overrides.deniedRequests ?? 2,
      byType: [{ key: 'publish.blocked', count: overrides.deniedRequests ?? 2 }],
      topActors: [{ key: 'admin', count: overrides.deniedRequests ?? 2 }],
    },
    logs: {
      counts: { audit: 4, dev: 3, security: 2, error: overrides.errorCount ?? 3 },
      entries: [],
    },
    cmsLifecycle: {
      totalEvents: 0,
      requestedRecords: 0,
      changedRecords: 0,
      byAction: [],
      topCollections: [],
      recent: [],
    },
  };
}

beforeEach(async () => {
  runtimeRoot = await mkdtemp(path.join(os.tmpdir(), 'ops-alert-report-'));
  process.env.BUILDER_OPS_DATA_PATH = path.join(runtimeRoot, 'ops');
  await mkdir(process.env.BUILDER_OPS_DATA_PATH, { recursive: true });
});

afterEach(async () => {
  delete process.env.BUILDER_OPS_DATA_PATH;
  await rm(runtimeRoot, { recursive: true, force: true });
});

describe('ops alert report', () => {
  it('opens alert rules when logs security perf backup and cache thresholds trip', () => {
    const history: OpsDashboardTrendPoint[] = [
      {
        generatedAt: '2026-06-21T04:00:00.000Z',
        logs24h: 8,
        errors24h: 1,
        deniedRequests: 1,
        runtimeCacheKeys: 4,
        backupCount: 1,
        rssBytes: 100_000,
        heapUsedBytes: 4_000,
      },
      {
        generatedAt: '2026-06-21T05:00:00.000Z',
        logs24h: 12,
        errors24h: 3,
        deniedRequests: 2,
        runtimeCacheKeys: 0,
        backupCount: 0,
        rssBytes: 180_000,
        heapUsedBytes: 9_000,
      },
    ];

    const report = buildOpsAlertReport(snapshotFixture(), history);
    const openIds = report.openAlerts.map((alert) => alert.id);

    expect(report.generatedAt).toBe('2026-06-21T05:00:00.000Z');
    expect(report.historyWindow).toEqual({
      points: 2,
      firstAt: '2026-06-21T04:00:00.000Z',
      lastAt: '2026-06-21T05:00:00.000Z',
    });
    expect(openIds).toEqual([
      'security-denied-requests',
      'logs-error-volume',
      'perf-heap-ratio',
      'backup-missing',
      'cache-empty',
    ]);
    expect(report.openAlerts[0]).toMatchObject({
      severity: 'error',
      category: 'security',
      metricValue: 2,
      threshold: 1,
    });
    expect(report.okAlerts.some((alert) => alert.id === 'perf-rss-growth')).toBe(true);
  });

  it('persists and reads the latest alert report', async () => {
    const report = buildOpsAlertReport(snapshotFixture({
      errorCount: 0,
      deniedRequests: 0,
      cacheKeys: 3,
      backupCount: 1,
      heapUsedBytes: 2_000,
      heapTotalBytes: 10_000,
    }), []);

    await persistOpsAlertReport(report);
    const latest = await readLatestOpsAlertReport();

    expect(latest?.openAlerts).toHaveLength(0);
    expect(latest?.okAlerts.length).toBeGreaterThan(0);
    expect(latest?.generatedAt).toBe('2026-06-21T05:00:00.000Z');
  });
});
