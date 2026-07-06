/**
 * Disk-backed store for the ops backup register. The actual backup
 * payload (a JSON copy of the source file) is written next to the index
 * under runtime-data/ops/backups/${id}.json.bak.
 */
import { mkdir, readFile, writeFile, unlink, stat } from 'fs/promises';
import path from 'path';
import crypto from 'node:crypto';
import { z } from 'zod';

import {
  emptyBackupsIndex,
  type BuilderBackupRecord,
  type BuilderBackupsIndex,
  type BuilderRestoreResult,
} from './backups-model';
import { opsBackupsDir, opsBackupsIndexFile, opsRoot } from './paths';

const backupRecordSchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  sourcePath: z.string(),
  sizeBytes: z.number(),
  checksumSha256: z.string().optional(),
  status: z.union([z.literal('ok'), z.literal('failed')]),
  note: z.string().optional(),
});

const backupsIndexSchema = z.object({
  backups: z.array(backupRecordSchema),
});

function isMissingFileError(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

async function readIndex(): Promise<BuilderBackupsIndex> {
  let text: string;
  try {
    text = await readFile(opsBackupsIndexFile(), 'utf8');
  } catch (error) {
    if (isMissingFileError(error)) return emptyBackupsIndex();
    throw error;
  }

  try {
    return backupsIndexSchema.parse(JSON.parse(text));
  } catch (error) {
    if (error instanceof SyntaxError || error instanceof z.ZodError) {
      return emptyBackupsIndex();
    }
    throw error;
  }
}

async function unlinkIfExists(filePath: string): Promise<void> {
  try {
    await unlink(filePath);
  } catch (error) {
    if (isMissingFileError(error)) return;
    throw error;
  }
}

async function writeIndex(index: BuilderBackupsIndex): Promise<void> {
  await mkdir(opsRoot(), { recursive: true });
  await writeFile(opsBackupsIndexFile(), JSON.stringify(index), 'utf8');
}

function makeBackupId(now: Date): string {
  const stamp = now.toISOString().replace(/[^0-9]/g, '').slice(0, 14);
  return `opsbkp_${stamp}_${crypto.randomBytes(4).toString('hex')}`;
}

function isSafeSourcePath(sourcePath: string): boolean {
  if (!sourcePath) return false;
  const resolved = path.resolve(sourcePath);
  const runtimeRoot = path.resolve(path.join(process.cwd(), 'runtime-data'));
  return resolved.startsWith(`${runtimeRoot}${path.sep}`) && resolved.endsWith('.json');
}

function sha256Hex(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

export async function listOpsBackups(): Promise<BuilderBackupRecord[]> {
  const index = await readIndex();
  return [...index.backups].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOpsBackupById(id: string): Promise<BuilderBackupRecord | null> {
  const index = await readIndex();
  return index.backups.find((backup) => backup.id === id) ?? null;
}

export async function createOpsBackupStub(
  sourcePath: string,
  note?: string,
  now: Date = new Date(),
): Promise<BuilderBackupRecord> {
  const id = makeBackupId(now);
  const createdAt = now.toISOString();
  if (!isSafeSourcePath(sourcePath)) {
    const failed: BuilderBackupRecord = {
      id,
      createdAt,
      sourcePath,
      sizeBytes: 0,
      status: 'failed',
      note: note ?? 'source must be a .json file under runtime-data/',
    };
    await persistRecord(failed);
    return failed;
  }

  try {
    const st = await stat(sourcePath);
    if (!st.isFile()) throw new Error('not a file');
    const sourceBuffer = await readFile(sourcePath);
    await mkdir(opsBackupsDir(), { recursive: true });
    const dest = path.join(opsBackupsDir(), `${id}.json.bak`);
    await writeFile(dest, sourceBuffer);
    const record: BuilderBackupRecord = {
      id,
      createdAt,
      sourcePath,
      sizeBytes: sourceBuffer.byteLength,
      checksumSha256: sha256Hex(sourceBuffer),
      status: 'ok',
      note,
    };
    await persistRecord(record);
    return record;
  } catch (error) {
    const failed: BuilderBackupRecord = {
      id,
      createdAt,
      sourcePath,
      sizeBytes: 0,
      status: 'failed',
      note: note ?? (error instanceof Error ? error.message : 'copy failed'),
    };
    await persistRecord(failed);
    return failed;
  }
}

export async function restoreOpsBackupStub(id: string): Promise<BuilderRestoreResult> {
  const record = await getOpsBackupById(id);
  if (!record) {
    return { ok: false, error: 'backup not found' };
  }
  if (record.status !== 'ok') {
    return { ok: false, error: 'backup failed and cannot be restored' };
  }
  if (!isSafeSourcePath(record.sourcePath)) {
    return { ok: false, error: 'source path is not restorable' };
  }

  const backupPath = path.join(opsBackupsDir(), `${id}.json.bak`);
  try {
    const st = await stat(backupPath);
    if (!st.isFile()) {
      return { ok: false, error: 'backup payload missing' };
    }
    const backupBuffer = await readFile(backupPath);
    const backupChecksum = sha256Hex(backupBuffer);
    if (record.checksumSha256 && record.checksumSha256 !== backupChecksum) {
      return { ok: false, error: 'backup payload checksum mismatch' };
    }
    await mkdir(path.dirname(record.sourcePath), { recursive: true });
    await writeFile(record.sourcePath, backupBuffer);
    const restoredChecksum = sha256Hex(await readFile(record.sourcePath));
    if (restoredChecksum !== backupChecksum) {
      return { ok: false, error: 'restored file checksum mismatch' };
    }
    return {
      ok: true,
      restoredPath: record.sourcePath,
      verified: true,
      checksumSha256: restoredChecksum,
      sizeBytes: st.size,
    };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : 'restore failed' };
  }
}

async function persistRecord(record: BuilderBackupRecord): Promise<void> {
  const index = await readIndex();
  index.backups.push(record);
  await writeIndex(index);
}

export async function deleteOpsBackup(id: string): Promise<boolean> {
  if (!/^opsbkp_[0-9]+_[a-f0-9]+$/.test(id)) return false;
  const index = await readIndex();
  const next = index.backups.filter((b) => b.id !== id);
  if (next.length === index.backups.length) return false;
  await writeIndex({ backups: next });
  const dest = path.join(opsBackupsDir(), `${id}.json.bak`);
  await unlinkIfExists(dest);
  return true;
}

/** Test helper — wipes the disk state. */
export async function _resetOpsBackupsForTests(): Promise<void> {
  await unlinkIfExists(opsBackupsIndexFile());
}
