/**
 * Centralized path helpers for the ops module so tests can redirect
 * storage via BUILDER_OPS_DATA_PATH without touching the real
 * runtime-data/ tree.
 */
import path from 'path';

export function opsRoot(): string {
  return process.env.BUILDER_OPS_DATA_PATH
    ?? path.join(process.cwd(), 'runtime-data', 'ops');
}

export function opsHealthSnapshotFile(): string {
  return path.join(opsRoot(), 'health-snapshot.json');
}

export function opsDashboardHistoryFile(): string {
  return path.join(opsRoot(), 'dashboard-history.json');
}

export function opsAlertReportFile(): string {
  return path.join(opsRoot(), 'alert-report.json');
}

export function opsBackupsIndexFile(): string {
  return path.join(opsRoot(), 'backups.json');
}

export function opsBackupsDir(): string {
  return path.join(opsRoot(), 'backups');
}

export function opsBackupRestoreDrillReportFile(): string {
  return path.join(opsRoot(), 'backup-restore-drill.json');
}

export function opsCachePurgeReportFile(): string {
  return path.join(opsRoot(), 'cache-purge-report.json');
}

export function cacheRoot(): string {
  return process.env.BUILDER_OPS_CACHE_PATH
    ?? path.join(process.cwd(), 'runtime-data', 'cache');
}

export function devLogsRoot(): string {
  return process.env.BUILDER_OPS_DEV_LOGS_PATH
    ?? path.join(process.cwd(), 'runtime-data', 'dev', 'logs');
}
