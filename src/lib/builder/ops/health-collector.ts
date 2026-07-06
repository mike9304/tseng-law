/**
 * Aggregates a lightweight health snapshot from existing builder
 * subsystems (audit log, error log, backups, cache files). Best-effort:
 * a failure in any sub-system collapses to its default in the snapshot
 * rather than failing the whole collect.
 */
import { mkdir, readFile, writeFile, stat } from 'fs/promises';
import path from 'path';

import { readRecentAuditEvents } from '@/lib/builder/audit/store';
import { listErrorLog } from '@/lib/builder/errors/storage';
import { listBackups as listLegacyBackups } from '@/lib/builder/backups/backup-engine';

import {
  emptyHealthSnapshot,
  type OpsDeployHealth,
  type OpsHealthSnapshot,
} from './health-model';
import { listCacheKeys } from './cache-introspection';
import { listOpsBackups } from './backups-store';
import { opsHealthSnapshotFile, opsRoot } from './paths';

const DAY_MS = 24 * 60 * 60 * 1000;

function isWithinLast24h(iso: string | undefined, now: number): boolean {
  if (!iso) return false;
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return false;
  return now - t <= DAY_MS;
}

function isoFromEnv(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return undefined;
  return new Date(parsed).toISOString();
}

function nonEmptyEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function vercelUrl(value: string | undefined): string | undefined {
  const trimmed = nonEmptyEnv(value);
  if (!trimmed) return undefined;
  if (trimmed.startsWith('https://') || trimmed.startsWith('http://')) return trimmed;
  return `https://${trimmed}`;
}

async function readDeployMetadata(): Promise<OpsDeployHealth> {
  const envDeployAt = isoFromEnv(process.env.VERCEL_DEPLOYMENT_CREATED_AT)
    ?? isoFromEnv(process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF_TIME);
  const environment = nonEmptyEnv(process.env.VERCEL_ENV);
  const url = vercelUrl(process.env.VERCEL_URL);
  const gitRef = nonEmptyEnv(process.env.VERCEL_GIT_COMMIT_REF);
  const gitCommitSha = nonEmptyEnv(process.env.VERCEL_GIT_COMMIT_SHA);
  if (envDeployAt || environment || url || gitRef || gitCommitSha) {
    return {
      status: envDeployAt ? 'ok' : 'unknown',
      source: 'vercel',
      ...(envDeployAt ? { lastDeployAt: envDeployAt } : {}),
      ...(environment ? { environment } : {}),
      ...(url ? { url } : {}),
      ...(gitRef ? { gitRef } : {}),
      ...(gitCommitSha ? { gitCommitSha } : {}),
    };
  }
  try {
    const buildIdPath = path.join(process.cwd(), '.next', 'BUILD_ID');
    const st = await stat(buildIdPath);
    return {
      status: 'ok',
      source: 'local-build',
      lastDeployAt: new Date(st.mtimeMs).toISOString(),
    };
  } catch {
    return { status: 'unknown', source: 'unknown' };
  }
}

export async function collectHealthSnapshot(now: Date = new Date()): Promise<OpsHealthSnapshot> {
  const snapshot = emptyHealthSnapshot(now.toISOString());
  const nowMs = now.getTime();

  // Deploys ────────────────────────────────────────────────────────
  try {
    snapshot.deploys = await readDeployMetadata();
  } catch { /* keep defaults */ }

  // Cache ──────────────────────────────────────────────────────────
  try {
    const keys = await listCacheKeys();
    snapshot.cache.runtimeCacheKeys = keys.length;
    const lastWritten = keys
      .map((k) => k.lastWrittenAt)
      .filter((v): v is string => Boolean(v))
      .sort()
      .pop();
    if (lastWritten) snapshot.cache.lastClearedAt = lastWritten;
  } catch { /* keep defaults */ }

  // Storage / backups (combine ops stub + legacy archive count) ────
  try {
    const [opsBackups, legacyBackups] = await Promise.all([
      listOpsBackups().catch(() => []),
      listLegacyBackups().catch(() => []),
    ]);
    snapshot.storage.backupCount = opsBackups.length + legacyBackups.length;
    const newest = [...opsBackups.map((b) => b.createdAt), ...legacyBackups.map((b) => b.createdAt)]
      .sort()
      .pop();
    if (newest) snapshot.storage.lastBackupAt = newest;
  } catch { /* keep defaults */ }

  // Logs (audit + errors as a unified count) ───────────────────────
  try {
    const [audit, errors] = await Promise.all([
      readRecentAuditEvents(500).catch(() => []),
      listErrorLog().catch(() => []),
    ]);
    const recentAudit = audit.filter((e) => isWithinLast24h(e.at, nowMs));
    const recentErrors = errors.filter((e) => isWithinLast24h(e.capturedAt, nowMs));
    snapshot.logs.last24hCount = recentAudit.length + recentErrors.length;
    snapshot.logs.errorCount = recentErrors.filter((e) => (
      e.severity === 'error' || e.severity === 'fatal'
    )).length;
  } catch { /* keep defaults */ }

  // Security (audit denials + publish.blocked are the visible signals) ─
  try {
    const audit = await readRecentAuditEvents(500).catch(() => []);
    const recent = audit.filter((e) => isWithinLast24h(e.at, nowMs));
    snapshot.security.last24hEvents = recent.length;
    snapshot.security.deniedRequests = recent.filter((e) => (
      e.type === 'publish.blocked' || e.type === 'publish.failure'
    )).length;
  } catch { /* keep defaults */ }

  await writeHealthSnapshot(snapshot);
  return snapshot;
}

async function writeHealthSnapshot(snapshot: OpsHealthSnapshot): Promise<void> {
  try {
    await mkdir(opsRoot(), { recursive: true });
    await writeFile(opsHealthSnapshotFile(), JSON.stringify(snapshot), 'utf8');
  } catch {
    // Snapshot is purely advisory; missing disk write is acceptable.
  }
}

export async function readLatestHealthSnapshot(): Promise<OpsHealthSnapshot | null> {
  try {
    const text = await readFile(opsHealthSnapshotFile(), 'utf8');
    return JSON.parse(text) as OpsHealthSnapshot;
  } catch {
    return null;
  }
}
