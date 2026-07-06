import { z } from 'zod';

import type { OpsDashboardAlert, OpsDashboardSnapshot, OpsDashboardTrendPoint } from '@/lib/builder/ops/dashboard';
import type { UnifiedLogType } from '@/lib/builder/ops/logs-aggregator';
import { opsAlertReportSchema, type OpsAlertReport } from '@/lib/builder/ops/alert-report-model';

const unifiedLogTypeSchema = z.union([
  z.literal('audit'),
  z.literal('dev'),
  z.literal('security'),
  z.literal('error'),
]);

const opsDashboardAlertSchema = z.object({
  severity: z.union([z.literal('info'), z.literal('warn'), z.literal('error')]),
  title: z.string(),
  detail: z.string(),
});

const opsDashboardTrendPointSchema = z.object({
  generatedAt: z.string(),
  logs24h: z.number(),
  errors24h: z.number(),
  deniedRequests: z.number(),
  runtimeCacheKeys: z.number(),
  backupCount: z.number(),
  rssBytes: z.number(),
  heapUsedBytes: z.number(),
});

const opsDeployHealthSchema = z.object({
  status: z.union([z.literal('ok'), z.literal('unknown')]),
  source: z.union([z.literal('vercel'), z.literal('local-build'), z.literal('unknown')]),
  lastDeployAt: z.string().optional(),
  environment: z.string().optional(),
  url: z.string().optional(),
  gitRef: z.string().optional(),
  gitCommitSha: z.string().optional(),
});

const opsHealthSnapshotSchema = z.object({
  gatheredAt: z.string(),
  deploys: opsDeployHealthSchema,
  cache: z.object({
    runtimeCacheKeys: z.number(),
    lastClearedAt: z.string().optional(),
  }),
  storage: z.object({
    backupCount: z.number(),
    lastBackupAt: z.string().optional(),
  }),
  logs: z.object({
    last24hCount: z.number(),
    errorCount: z.number(),
  }),
  security: z.object({
    last24hEvents: z.number(),
    deniedRequests: z.number(),
  }),
});

const opsPerfSnapshotSchema = z.object({
  capturedAt: z.string(),
  uptimeSeconds: z.number(),
  memory: z.object({
    rssBytes: z.number(),
    heapTotalBytes: z.number(),
    heapUsedBytes: z.number(),
    externalBytes: z.number(),
  }),
  node: z.object({
    version: z.string(),
    platform: z.string(),
    arch: z.string(),
  }),
});

const securitySummaryRowSchema = z.object({
  key: z.string(),
  count: z.number(),
});

const securitySummarySchema = z.object({
  windowHours: z.number(),
  generatedAt: z.string(),
  totalEvents: z.number(),
  deniedRequests: z.number(),
  byType: z.array(securitySummaryRowSchema),
  topActors: z.array(securitySummaryRowSchema),
});

const unifiedLogEntrySchema = z.object({
  source: unifiedLogTypeSchema,
  at: z.string(),
  level: z.union([z.literal('info'), z.literal('warning'), z.literal('error')]),
  summary: z.string(),
  actorRef: z.string().optional(),
});

const cmsLifecycleActionSchema = z.union([
  z.literal('delete'),
  z.literal('generate-slugs'),
  z.literal('repair-slug-conflicts'),
  z.literal('status'),
]);

const logAggregateResultSchema = z.object({
  counts: z.object({
    audit: z.number(),
    dev: z.number(),
    security: z.number(),
    error: z.number(),
  }),
  entries: z.array(unifiedLogEntrySchema),
});

const opsCmsLifecycleDashboardSchema = z.object({
  totalEvents: z.number(),
  requestedRecords: z.number(),
  changedRecords: z.number(),
  byAction: z.array(z.object({
    action: cmsLifecycleActionSchema,
    count: z.number(),
    requestedRecords: z.number(),
    changedRecords: z.number(),
  })),
  topCollections: z.array(z.object({
    collectionId: z.string(),
    count: z.number(),
    requestedRecords: z.number(),
    changedRecords: z.number(),
    lastAt: z.string(),
  })),
  recent: z.array(z.object({
    at: z.string(),
    collectionId: z.string(),
    action: cmsLifecycleActionSchema,
    requestedCount: z.number(),
    changedCount: z.number(),
    status: z.string().optional(),
    locale: z.string().optional(),
  })),
});

const opsDashboardSnapshotSchema = z.object({
  generatedAt: z.string(),
  health: opsHealthSnapshotSchema,
  perf: opsPerfSnapshotSchema,
  security: securitySummarySchema,
  logs: logAggregateResultSchema,
  cmsLifecycle: opsCmsLifecycleDashboardSchema,
});

const opsDashboardPayloadSchema = z.object({
  snapshot: opsDashboardSnapshotSchema.optional(),
  history: z.array(opsDashboardTrendPointSchema).optional(),
  alerts: z.array(opsDashboardAlertSchema).optional(),
  alertReport: opsAlertReportSchema.optional(),
});

export type OpsDashboardPayload = {
  readonly snapshot: OpsDashboardSnapshot | null;
  readonly history: readonly OpsDashboardTrendPoint[];
  readonly alerts: readonly OpsDashboardAlert[];
  readonly alertReport: OpsAlertReport | null;
};

export async function readResponsePayload(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    if (error instanceof SyntaxError) return null;
    throw error;
  }
}

export function parseDashboardPayload(value: unknown): OpsDashboardPayload {
  const parsed = opsDashboardPayloadSchema.safeParse(value);
  if (!parsed.success) {
    return {
      snapshot: null,
      history: [],
      alerts: [],
      alertReport: null,
    };
  }
  return {
    snapshot: parsed.data.snapshot ?? null,
    history: parsed.data.history ?? [],
    alerts: parsed.data.alerts ?? [],
    alertReport: parsed.data.alertReport ?? null,
  };
}

export function parseUnifiedLogTypeFilter(value: string): '' | UnifiedLogType {
  switch (value) {
    case '':
      return '';
    case 'audit':
    case 'dev':
    case 'security':
    case 'error':
      return value;
    default:
      return '';
  }
}
