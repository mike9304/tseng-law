/**
 * PR #18 — Backup source registry.
 *
 * Lists every blob/file prefix and individual key the backup engine should
 * include. Add new entries here whenever a feature adds a new JSON
 * collection. Keys are blob pathnames or, on the file backend,
 * `runtime-data/<...>` relative paths normalized to forward slashes.
 */

export interface BackupSource {
  /** Logical label, used in admin UI and logs. */
  label: string;
  /**
   * Blob prefix to enumerate. When file backend is in use, the engine
   * walks the matching `runtime-data` subdirectory.
   */
  prefix: string;
}

export const BACKUP_SOURCES: BackupSource[] = [
  { label: 'Builder pages + revisions', prefix: 'builder-site/' },
  { label: 'Builder bookings', prefix: 'builder-bookings/' },
  { label: 'Builder forms (schemas + submissions)', prefix: 'builder-forms/' },
  { label: 'Marketing campaigns + subscribers', prefix: 'marketing/' },
  { label: 'Search index + query logs', prefix: 'search/' },
  { label: 'Webhooks subscriptions + deliveries', prefix: 'webhooks/' },
  { label: 'Error log', prefix: 'errors/' },
  { label: 'Migration journal', prefix: 'migrations/' },
  { label: 'Members / cases', prefix: 'members/' },
  { label: 'CRM contacts', prefix: 'crm/' },
  { label: 'Analytics', prefix: 'analytics/' },
];
