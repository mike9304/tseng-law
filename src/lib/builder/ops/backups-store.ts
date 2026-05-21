/**
 * Disk-backed store for the ops backup register. The actual backup
 * payload (a JSON copy of the source file) is written next to the index
 * under runtime-data/ops/backups/${id}.json.bak.
 */
import { mkdir, readFile, writeFile, copyFile, unlink, stat } from 'fs/promises';
import path from 'path';
import crypto from 'node:crypto';

import {
  emptyBackupsIndex,
  type BuilderBackupRecord,
  type BuilderBackupsIndex,
} from './backups-model';
import { opsBackupsDir, opsBackupsIndexFile, opsRoot } from './paths';

async function readIndex(): Promise<BuilderBackupsIndex> {
  try {
    const text = await readFile(opsBackupsIndexFile(), 'utf8');
    const parsed = JSON.parse(text) as BuilderBackupsIndex;
    return { backups: Array.isArray(parsed.backups) ? parsed.backups : [] };
  } catch {
    return emptyBackupsIndex();
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

export async function listOpsBackups(): Promise<BuilderBackupRecord[]> {
  const index = await readIndex();
  return [...index.backups].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
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
    await mkdir(opsBackupsDir(), { recursive: true });
    const dest = path.join(opsBackupsDir(), `${id}.json.bak`);
    await copyFile(sourcePath, dest);
    const record: BuilderBackupRecord = {
      id,
      createdAt,
      sourcePath,
      sizeBytes: st.size,
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
  try {
    await unlink(dest);
  } catch {
    /* file might already be gone */
  }
  return true;
}

/** Test helper — wipes the disk state. */
export async function _resetOpsBackupsForTests(): Promise<void> {
  try {
    await unlink(opsBackupsIndexFile());
  } catch {
    /* nothing to do */
  }
}