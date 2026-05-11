#!/usr/bin/env node
/**
 * PR #18 CLI — Restore from a backup snapshot.
 *
 * Usage:
 *   node scripts/restore-from-backup.mjs <backupId> [--dry-run]
 *
 * Operates in process — writes against whichever backend the surrounding
 * env points at (Vercel Blob if BLOB_READ_WRITE_TOKEN is set, otherwise
 * the local runtime-data/ tree).
 */

import { argv, exit } from 'node:process';

async function main() {
  const args = argv.slice(2);
  const backupId = args.find((a) => !a.startsWith('--'));
  const dryRun = args.includes('--dry-run');
  if (!backupId) {
    console.error('Usage: node scripts/restore-from-backup.mjs <backupId> [--dry-run]');
    exit(1);
  }

  // Dynamic import so the script can run from the repo root without a build step.
  const { restoreBackup } = await import('../src/lib/builder/backups/restore-engine.ts');
  console.info(`[restore] starting${dryRun ? ' (dry-run)' : ''} for backup=${backupId}`);
  const result = await restoreBackup(backupId, { dryRun });
  console.info('[restore] result', JSON.stringify(result, null, 2));
  if (!result.ok) exit(1);
}

main().catch((err) => {
  console.error('[restore] failed', err);
  exit(1);
});
