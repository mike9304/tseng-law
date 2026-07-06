import { aggregateLogs, type LogAggregateResult, type UnifiedLogType } from './logs-aggregator';
import { collectHealthSnapshot } from './health-collector';
import type { OpsHealthSnapshot } from './health-model';
import { capturePerfSnapshot, type OpsPerfSnapshot } from './perf-snapshot';
import { buildSecuritySummary, type SecuritySummary } from './security-summary';
import { appendOpsDashboardHistory, type OpsDashboardHistoryEntry, readOpsDashboardHistory } from './dashboard-history';
import { buildOpsAlertReport, legacyAlertsFromReport, persistOpsAlertReport } from './alert-report';
import type { OpsAlertReport } from './alert-report-model';
import { collectOpsCmsLifecycleDashboard, type OpsCmsLifecycleDashboard } from './cms-lifecycle-dashboard';

export interface OpsDashboardSnapshot {
  generatedAt: string;
  health: OpsHealthSnapshot;
  perf: OpsPerfSnapshot;
  security: SecuritySummary;
  logs: LogAggregateResult;
  cmsLifecycle: OpsCmsLifecycleDashboard;
}

export interface OpsDashboardAlert {
  severity: 'info' | 'warn' | 'error';
  title: string;
  detail: string;
}

export interface OpsDashboardExportFile {
  version: 1;
  generatedAt: string;
  filters: {
    type: '' | UnifiedLogType;
    limit: number;
  };
  snapshot: OpsDashboardSnapshot;
}

export type OpsDashboardTrendPoint = OpsDashboardHistoryEntry;

export interface OpsDashboardView {
  snapshot: OpsDashboardSnapshot;
  history: OpsDashboardTrendPoint[];
  alerts: OpsDashboardAlert[];
  alertReport: OpsAlertReport;
}

export function buildOpsDashboardExportFilename(type: '' | UnifiedLogType): string {
  return `ops-dashboard-${type || 'all'}.json`;
}

export function serializeOpsDashboardExportFile(file: OpsDashboardExportFile): string {
  return JSON.stringify(file, null, 2);
}

export async function collectOpsDashboardSnapshot(options: {
  type?: UnifiedLogType;
  limit?: number;
  now?: Date;
} = {}): Promise<OpsDashboardSnapshot> {
  const now = options.now ?? new Date();
  const limit = Math.max(1, Math.min(50, options.limit ?? 10));
  const type = options.type;

  const [health, perf, security, logs, cmsLifecycle] = await Promise.all([
    collectHealthSnapshot(now),
    Promise.resolve(capturePerfSnapshot(now)),
    buildSecuritySummary({ now }),
    aggregateLogs({ type, limit }),
    collectOpsCmsLifecycleDashboard(),
  ]);

  return {
    generatedAt: now.toISOString(),
    health,
    perf,
    security,
    logs,
    cmsLifecycle,
  };
}

export function deriveOpsDashboardAlerts(snapshot: OpsDashboardSnapshot): OpsDashboardAlert[] {
  return legacyAlertsFromReport(buildOpsAlertReport(snapshot, []));
}

export function buildOpsDashboardHistoryEntry(snapshot: OpsDashboardSnapshot): OpsDashboardHistoryEntry {
  return {
    generatedAt: snapshot.generatedAt,
    logs24h: snapshot.health.logs.last24hCount,
    errors24h: snapshot.health.logs.errorCount,
    deniedRequests: snapshot.health.security.deniedRequests,
    runtimeCacheKeys: snapshot.health.cache.runtimeCacheKeys,
    backupCount: snapshot.health.storage.backupCount,
    rssBytes: snapshot.perf.memory.rssBytes,
    heapUsedBytes: snapshot.perf.memory.heapUsedBytes,
  };
}

export async function collectOpsDashboardView(options: {
  type?: UnifiedLogType;
  limit?: number;
  now?: Date;
} = {}): Promise<OpsDashboardView> {
  const snapshot = await collectOpsDashboardSnapshot(options);
  const historyEntry = buildOpsDashboardHistoryEntry(snapshot);
  await appendOpsDashboardHistory(historyEntry);
  const history = await readOpsDashboardHistory();
  const alertReport = buildOpsAlertReport(snapshot, history);
  try {
    await persistOpsAlertReport(alertReport);
  } catch (error) {
    if (error instanceof Error) {
      console.warn('[builder:ops] failed to persist alert report', error.message);
    } else {
      throw error;
    }
  }
  return {
    snapshot,
    history,
    alerts: legacyAlertsFromReport(alertReport),
    alertReport,
  };
}

export function buildOpsDashboardExportFile(input: {
  snapshot: OpsDashboardSnapshot;
  type: '' | UnifiedLogType;
  limit: number;
}): OpsDashboardExportFile {
  return {
    version: 1,
    generatedAt: input.snapshot.generatedAt,
    filters: {
      type: input.type,
      limit: input.limit,
    },
    snapshot: input.snapshot,
  };
}
