import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'path';
import { del, get, put } from '@vercel/blob';
import { z } from 'zod';
import { devLogsRoot } from '@/lib/builder/ops/paths';
import type { DevLogEntry, DevLogSource } from './logs-store';

const LOG_FILE_VERSION = 1;
const BLOB_PREFIX = 'dev/logs/';
const DEV_LOG_SOURCES = ['function', 'webhook', 'app'] as const;

const devLogEntrySchema = z.object({
  id: z.string().min(1),
  source: z.enum(DEV_LOG_SOURCES),
  level: z.enum(['log', 'info', 'warn', 'error']),
  message: z.string(),
  timestamp: z.string().min(1),
  reference: z.string().optional(),
}).strict();

const devLogsFileSchema = z.object({
  version: z.literal(LOG_FILE_VERSION),
  entries: z.array(devLogEntrySchema),
}).strict();

function logsFilePath(source: DevLogSource): string {
  return path.join(devLogsRoot(), `${source}.json`);
}

function blobLogPath(source: DevLogSource): string {
  return `${BLOB_PREFIX}${source}.json`;
}

function toDevLogEntry(entry: z.infer<typeof devLogEntrySchema>): DevLogEntry {
  return {
    id: entry.id,
    source: entry.source,
    level: entry.level,
    message: entry.message,
    timestamp: entry.timestamp,
    ...(entry.reference ? { reference: entry.reference } : {}),
  };
}

function trimEntries(entries: readonly DevLogEntry[], maxEntries: number): DevLogEntry[] {
  return entries.slice(-maxEntries);
}

function fallbackEntriesForReadError(error: unknown): DevLogEntry[] {
  if (error instanceof SyntaxError) return [];
  if (error instanceof Error) return [];
  throw error;
}

export function shouldUseBlobDevLogs(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.BUILDER_DEV_LOGS_BACKEND === 'local') return false;
  if (process.env.BUILDER_DEV_LOGS_BACKEND === 'blob') return true;
  if (process.env.NODE_ENV === 'production') return true;
  return process.env.BUILDER_USE_BLOB_IN_DEV === '1';
}

export function readDiskLogEntries(source: DevLogSource, maxEntries: number): DevLogEntry[] {
  if (!existsSync(logsFilePath(source))) return [];
  try {
    const raw = readFileSync(logsFilePath(source), 'utf8');
    const parsed = devLogsFileSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return [];
    return trimEntries(
      parsed.data.entries
        .filter((entry) => entry.source === source)
        .map(toDevLogEntry),
      maxEntries,
    );
  } catch (error) {
    return fallbackEntriesForReadError(error);
  }
}

export function writeDiskLogEntries(
  source: DevLogSource,
  entries: readonly DevLogEntry[],
  maxEntries: number,
): void {
  mkdirSync(devLogsRoot(), { recursive: true, mode: 0o700 });
  writeFileSync(
    logsFilePath(source),
    JSON.stringify({ version: LOG_FILE_VERSION, entries: trimEntries(entries, maxEntries) }, null, 2),
    { encoding: 'utf8', mode: 0o600 },
  );
}

export function clearDiskLogEntries(source?: DevLogSource): void {
  if (source) {
    rmSync(logsFilePath(source), { force: true });
    return;
  }
  rmSync(devLogsRoot(), { force: true, recursive: true });
}

export async function readBlobLogEntries(source: DevLogSource, maxEntries: number): Promise<DevLogEntry[]> {
  try {
    const result = await get(blobLogPath(source), { access: 'private', useCache: false });
    if (result?.statusCode !== 200 || !result.stream) return [];
    const raw = await new Response(result.stream).text();
    const parsed = devLogsFileSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) return [];
    return trimEntries(
      parsed.data.entries
        .filter((entry) => entry.source === source)
        .map(toDevLogEntry),
      maxEntries,
    );
  } catch (error) {
    return fallbackEntriesForReadError(error);
  }
}

export async function writeBlobLogEntries(
  source: DevLogSource,
  entries: readonly DevLogEntry[],
  maxEntries: number,
): Promise<void> {
  await put(
    blobLogPath(source),
    JSON.stringify({ version: LOG_FILE_VERSION, entries: trimEntries(entries, maxEntries) }, null, 2),
    {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    },
  );
}

export async function clearBlobLogEntries(source?: DevLogSource): Promise<void> {
  if (source) {
    await del(blobLogPath(source));
    return;
  }
  await Promise.all(DEV_LOG_SOURCES.map((value) => del(blobLogPath(value))));
}
