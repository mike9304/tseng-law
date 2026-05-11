/**
 * PR #18 — Backup snapshot types.
 *
 * Snapshots are point-in-time captures of every JSON-backed collection
 * the builder relies on. Each snapshot is a single archive JSON file
 * containing entries keyed by their original storage path so a restore
 * can write them back verbatim.
 */
export interface BackupEntry {
  /** Original key, e.g. `builder-bookings/services/svc_x.json`. */
  key: string;
  /** Parsed body. Stored as `unknown` so the restore step doesn't need types. */
  body: unknown;
}

export interface BackupManifest {
  backupId: string;
  createdAt: string;
  triggeredBy: 'manual' | 'cron';
  prefixes: string[];
  entries: BackupEntry[];
  /** Bytes of the serialized JSON archive. Best-effort. */
  sizeBytes?: number;
  /** Backend used at snapshot time. */
  backend: 'blob' | 'file';
}

export interface BackupSummary {
  backupId: string;
  createdAt: string;
  triggeredBy: 'manual' | 'cron';
  prefixCount: number;
  entryCount: number;
  sizeBytes?: number;
}
