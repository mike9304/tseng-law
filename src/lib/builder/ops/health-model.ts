/**
 * Wix-class Ops/Infrastructure/Observability — first-slice health snapshot.
 *
 * The snapshot is gathered by `collectHealthSnapshot()` (health-collector.ts)
 * and surfaced by `/api/builder/ops/health`. All fields are best-effort —
 * unavailable sub-systems collapse to defaults rather than throwing.
 */

export interface OpsHealthSnapshot {
  gatheredAt: string;
  deploys: OpsDeployHealth;
  cache: {
    runtimeCacheKeys: number;
    lastClearedAt?: string;
  };
  storage: {
    backupCount: number;
    lastBackupAt?: string;
  };
  logs: {
    last24hCount: number;
    errorCount: number;
  };
  security: {
    last24hEvents: number;
    deniedRequests: number;
  };
}

export type OpsDeploySource = 'vercel' | 'local-build' | 'unknown';

export interface OpsDeployHealth {
  status: 'ok' | 'unknown';
  source: OpsDeploySource;
  lastDeployAt?: string;
  environment?: string;
  url?: string;
  gitRef?: string;
  gitCommitSha?: string;
}

export function emptyHealthSnapshot(now: string = new Date().toISOString()): OpsHealthSnapshot {
  return {
    gatheredAt: now,
    deploys: { status: 'unknown', source: 'unknown' },
    cache: { runtimeCacheKeys: 0 },
    storage: { backupCount: 0 },
    logs: { last24hCount: 0, errorCount: 0 },
    security: { last24hEvents: 0, deniedRequests: 0 },
  };
}

export const OPS_HEALTH_SNAPSHOT_TTL_MS = 60_000;
