import { mkdir, mkdtemp, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  buildOpsDashboardExportFile,
  buildOpsDashboardExportFilename,
  collectOpsDashboardSnapshot,
  collectOpsDashboardView,
  serializeOpsDashboardExportFile,
} from '@/lib/builder/ops/dashboard';
import { writeAuditEvent } from '@/lib/builder/audit/store';
import type { AuditEvent } from '@/lib/builder/audit/types';

let runtimeRoot: string;

beforeEach(async () => {
  runtimeRoot = await mkdtemp(path.join(os.tmpdir(), 'ops-dashboard-'));
  process.env.BUILDER_OPS_DATA_PATH = path.join(runtimeRoot, 'ops');
  process.env.BUILDER_AUDIT_LOG_PATH = path.join(runtimeRoot, 'audit', 'builder-audit.jsonl');
  await mkdir(process.env.BUILDER_OPS_DATA_PATH, { recursive: true });
});

afterEach(async () => {
  delete process.env.BUILDER_OPS_DATA_PATH;
  delete process.env.BUILDER_AUDIT_LOG_PATH;
  await rm(runtimeRoot, { recursive: true, force: true });
});

describe('ops dashboard', () => {
  it('collects a unified snapshot', async () => {
    const snapshot = await collectOpsDashboardSnapshot({
      type: 'dev',
      limit: 3,
      now: new Date('2026-05-29T00:00:00.000Z'),
    });

    expect(snapshot.generatedAt).toBe('2026-05-29T00:00:00.000Z');
    expect(snapshot.health.gatheredAt).toBe('2026-05-29T00:00:00.000Z');
    expect(snapshot.perf.capturedAt).toBe('2026-05-29T00:00:00.000Z');
    expect(snapshot.logs.entries.length).toBeLessThanOrEqual(3);
    expect(snapshot.logs.entries.every((entry) => entry.source === 'dev')).toBe(true);
  });

  it('collects a unified view with history and alerts', async () => {
    const view = await collectOpsDashboardView({
      now: new Date('2026-05-29T00:00:00.000Z'),
    });

    expect(view.snapshot.generatedAt).toBe('2026-05-29T00:00:00.000Z');
    expect(view.history.length).toBeGreaterThan(0);
    expect(Array.isArray(view.alerts)).toBe(true);
  });

  it('summarizes CMS lifecycle audit events for the overview dashboard', async () => {
    await writeAuditEvent(cmsLifecycleEvent({
      at: '2026-05-29T00:10:00.000Z',
      collectionId: 'recipes-dashboard',
      action: 'status',
      requestedCount: 3,
      changedCount: 2,
      status: 'archived',
    }));
    await writeAuditEvent(cmsLifecycleEvent({
      at: '2026-05-29T00:20:00.000Z',
      collectionId: 'recipes-dashboard',
      action: 'delete',
      requestedCount: 1,
      changedCount: 1,
    }));
    await writeAuditEvent({
      type: 'asset.upload',
      at: '2026-05-29T00:30:00.000Z',
      actorRef: 'admin',
      assetId: 'asset-dashboard',
      mime: 'image/png',
      size: 12,
    });

    const snapshot = await collectOpsDashboardSnapshot({
      now: new Date('2026-05-29T00:30:00.000Z'),
    });

    expect(snapshot.cmsLifecycle).toMatchObject({
      totalEvents: 2,
      requestedRecords: 4,
      changedRecords: 3,
      byAction: [
        { action: 'delete', count: 1, changedRecords: 1 },
        { action: 'status', count: 1, changedRecords: 2 },
      ],
      topCollections: [
        { collectionId: 'recipes-dashboard', count: 2, changedRecords: 3 },
      ],
    });
    expect(snapshot.cmsLifecycle.recent[0]).toMatchObject({
      collectionId: 'recipes-dashboard',
      action: 'delete',
      changedCount: 1,
      requestedCount: 1,
    });
  });

  it('builds a stable export payload and filename', async () => {
    const snapshot = await collectOpsDashboardSnapshot({
      now: new Date('2026-05-29T00:00:00.000Z'),
    });
    const file = buildOpsDashboardExportFile({
      snapshot,
      type: '',
      limit: 10,
    });

    expect(file).toMatchObject({
      version: 1,
      generatedAt: '2026-05-29T00:00:00.000Z',
      filters: { type: '', limit: 10 },
    });
    expect(serializeOpsDashboardExportFile(file)).toContain('"version": 1');
    expect(buildOpsDashboardExportFilename('dev')).toBe('ops-dashboard-dev.json');
  });
});

function cmsLifecycleEvent(input: {
  readonly at: string;
  readonly collectionId: string;
  readonly action: 'delete' | 'status';
  readonly requestedCount: number;
  readonly changedCount: number;
  readonly status?: string;
}): AuditEvent {
  return {
    type: 'cms.records.bulk_lifecycle',
    at: input.at,
    actorRef: 'admin',
    siteId: 'tseng-law-main-site',
    collectionId: input.collectionId,
    action: input.action,
    recordIds: ['record-alpha'],
    requestedCount: input.requestedCount,
    changedCount: input.changedCount,
    ...(input.status === undefined ? {} : { status: input.status }),
  };
}
