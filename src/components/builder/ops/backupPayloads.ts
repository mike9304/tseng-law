import type { BuilderBackupRecord } from '@/lib/builder/ops/backups-model';

export interface BackupsPayload {
  readonly backups: readonly BuilderBackupRecord[];
}

export interface BackupCreatePayload {
  readonly record: BuilderBackupRecord | null;
  readonly error: string | null;
}

export interface BackupRestorePayload {
  readonly ok: boolean;
  readonly restoredPath: string | null;
  readonly verified: boolean;
  readonly checksumSha256: string | null;
  readonly error: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isBackupRecord(value: unknown): value is BuilderBackupRecord {
  return isRecord(value)
    && typeof value.id === 'string'
    && typeof value.createdAt === 'string'
    && typeof value.sourcePath === 'string'
    && typeof value.sizeBytes === 'number'
    && (value.status === 'ok' || value.status === 'failed')
    && (value.checksumSha256 === undefined || typeof value.checksumSha256 === 'string')
    && (value.note === undefined || typeof value.note === 'string');
}

export async function readResponsePayload(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    if (error instanceof Error) return null;
    throw error;
  }
}

export function parseBackupsPayload(value: unknown): BackupsPayload {
  if (!isRecord(value) || !Array.isArray(value.backups)) {
    return { backups: [] };
  }
  return { backups: value.backups.filter(isBackupRecord) };
}

export function parseBackupCreatePayload(value: unknown): BackupCreatePayload {
  if (!isRecord(value)) {
    return { record: null, error: null };
  }
  return {
    record: isBackupRecord(value.record) ? value.record : null,
    error: typeof value.error === 'string' ? value.error : null,
  };
}

export function parseBackupRestorePayload(value: unknown): BackupRestorePayload {
  if (!isRecord(value)) {
    return { ok: false, restoredPath: null, verified: false, checksumSha256: null, error: null };
  }
  return {
    ok: value.ok === true,
    restoredPath: typeof value.restoredPath === 'string' ? value.restoredPath : null,
    verified: value.verified === true,
    checksumSha256: typeof value.checksumSha256 === 'string' ? value.checksumSha256 : null,
    error: typeof value.error === 'string' ? value.error : null,
  };
}
