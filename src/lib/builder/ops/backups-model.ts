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
  status: BuilderBackupStatus;
  note?: string;
}

export interface BuilderBackupsIndex {
  backups: BuilderBackupRecord[];
}

export function emptyBackupsIndex(): BuilderBackupsIndex {
  return { backups: [] };
}