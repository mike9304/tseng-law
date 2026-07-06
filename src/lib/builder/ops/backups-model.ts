/**
 * Lightweight backup *register* — a stub copy of a single source file plus
 * a metadata index. NOT a replacement for the full backup engine under
 * src/lib/builder/backups/. This exists to give ops operators a one-click
 * "snapshot this JSON document right now" panel.
 */
export type BuilderBackupStatus = 'ok' | 'failed';

export interface BuilderBackupRecord {
  id: string;
  createdAt: string;
  sourcePath: string;
  sizeBytes: number;
  checksumSha256?: string;
  status: BuilderBackupStatus;
  note?: string;
}

export type BuilderRestoreResult =
  | {
    ok: true;
    restoredPath: string;
    verified: true;
    checksumSha256: string;
    sizeBytes: number;
  }
  | {
    ok: false;
    error: string;
    verified?: false;
  };

export interface BuilderBackupsIndex {
  backups: BuilderBackupRecord[];
}

export type BuilderBackupRestoreDrillStatus = 'ok' | 'failed';

export interface BuilderBackupRestoreDrillReport {
  id: string;
  ranAt: string;
  status: BuilderBackupRestoreDrillStatus;
  sourcePath: string;
  backupId?: string;
  restoredPath?: string;
  verified: boolean;
  checksumSha256?: string;
  sizeBytes?: number;
  durationMs: number;
  backupDeleted: boolean;
  error?: string;
}

export function emptyBackupsIndex(): BuilderBackupsIndex {
  return { backups: [] };
}
