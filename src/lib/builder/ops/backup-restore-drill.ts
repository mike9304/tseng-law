import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import crypto from 'node:crypto';
import path from 'path';
import { z } from 'zod';

import type { BuilderBackupRestoreDrillReport } from './backups-model';
import {
  createOpsBackup,
  deleteOpsBackup,
  restoreOpsBackup,
} from './backups-store';
import { opsBackupRestoreDrillReportFile, opsRoot } from './paths';

const drillReportSchema = z.object({
  id: z.string(),
  ranAt: z.string(),
  status: z.union([z.literal('ok'), z.literal('failed')]),
  sourcePath: z.string(),
  backupId: z.string().optional(),
  restoredPath: z.string().optional(),
  verified: z.boolean(),
  checksumSha256: z.string().optional(),
  sizeBytes: z.number().optional(),
  durationMs: z.number(),
  backupDeleted: z.boolean(),
  error: z.string().optional(),
});

function makeDrillId(now: Date): string {
  const stamp = now.toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  return `opsdrill_${stamp}_${crypto.randomBytes(4).toString('hex')}`;
}

function drillSourcePath(id: string): string {
  return path.join(opsRoot(), 'restore-drills', `${id}.json`);
}

async function persistDrillReport(report: BuilderBackupRestoreDrillReport): Promise<BuilderBackupRestoreDrillReport> {
  await mkdir(opsRoot(), { recursive: true });
  await writeFile(opsBackupRestoreDrillReportFile(), JSON.stringify(report), 'utf8');
  return report;
}

function elapsedMs(startMs: number): number {
  return Math.max(0, Date.now() - startMs);
}

function failedReport(
  input: {
    id: string;
    ranAt: string;
    sourcePath: string;
    startMs: number;
    backupId?: string;
    backupDeleted: boolean;
    error: string;
  },
): BuilderBackupRestoreDrillReport {
  return {
    id: input.id,
    ranAt: input.ranAt,
    status: 'failed',
    sourcePath: input.sourcePath,
    ...(input.backupId ? { backupId: input.backupId } : {}),
    verified: false,
    durationMs: elapsedMs(input.startMs),
    backupDeleted: input.backupDeleted,
    error: input.error,
  };
}

export async function runOpsBackupRestoreDrill(now: Date = new Date()): Promise<BuilderBackupRestoreDrillReport> {
  const startMs = Date.now();
  const id = makeDrillId(now);
  const ranAt = now.toISOString();
  const sourcePath = drillSourcePath(id);
  const sourcePayload = JSON.stringify({ kind: 'ops-backup-restore-drill', marker: 'original', ranAt });
  const mutatedPayload = JSON.stringify({ kind: 'ops-backup-restore-drill', marker: 'mutated', ranAt });
  let backupId: string | undefined;
  let backupDeleted = false;

  try {
    await mkdir(path.dirname(sourcePath), { recursive: true });
    await writeFile(sourcePath, sourcePayload, 'utf8');
    const backup = await createOpsBackup(sourcePath, `restore drill ${id}`, now);
    backupId = backup.id;
    if (backup.status !== 'ok') {
      return persistDrillReport(failedReport({
        id,
        ranAt,
        sourcePath,
        startMs,
        backupId,
        backupDeleted,
        error: backup.note ?? 'backup creation failed',
      }));
    }

    await writeFile(sourcePath, mutatedPayload, 'utf8');
    const restored = await restoreOpsBackup(backup.id);
    if (!restored.ok) {
      return persistDrillReport(failedReport({
        id,
        ranAt,
        sourcePath,
        startMs,
        backupId,
        backupDeleted,
        error: restored.error,
      }));
    }

    const restoredPayload = await readFile(sourcePath, 'utf8');
    backupDeleted = await deleteOpsBackup(backup.id);
    if (restoredPayload !== sourcePayload || !backupDeleted) {
      return persistDrillReport(failedReport({
        id,
        ranAt,
        sourcePath,
        startMs,
        backupId,
        backupDeleted,
        error: restoredPayload !== sourcePayload ? 'restored bytes did not match drill source' : 'drill backup cleanup failed',
      }));
    }

    return persistDrillReport({
      id,
      ranAt,
      status: 'ok',
      sourcePath,
      backupId,
      restoredPath: restored.restoredPath,
      verified: restored.verified,
      checksumSha256: restored.checksumSha256,
      sizeBytes: restored.sizeBytes,
      durationMs: elapsedMs(startMs),
      backupDeleted,
    });
  } catch (error) {
    if (error instanceof Error) {
      return persistDrillReport(failedReport({
        id,
        ranAt,
        sourcePath,
        startMs,
        backupId,
        backupDeleted,
        error: error.message,
      }));
    }
    throw error;
  } finally {
    await rm(sourcePath, { force: true });
  }
}

export async function readLatestOpsBackupRestoreDrill(): Promise<BuilderBackupRestoreDrillReport | null> {
  try {
    const text = await readFile(opsBackupRestoreDrillReportFile(), 'utf8');
    return drillReportSchema.parse(JSON.parse(text));
  } catch (error) {
    if (error instanceof Error) return null;
    throw error;
  }
}
