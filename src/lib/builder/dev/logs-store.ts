/**
 * F110 — Dev logs store.
 *
 * Per-source ring buffer in process memory plus a file-backed
 * store under runtime-data/dev/logs so separate Next dev route bundles can
 * read the same history while the process is alive. When Blob storage is
 * configured, writes are also mirrored to a private Blob object and async
 * readers merge that durable copy with the process-local buffer.
 */

import {
  clearBlobLogEntries,
  clearDiskLogEntries,
  readBlobLogEntries,
  readDiskLogEntries,
  shouldUseBlobDevLogs,
  writeBlobLogEntries,
  writeDiskLogEntries,
} from './logs-storage';

export type DevLogSource = 'function' | 'webhook' | 'app';
export type DevLogLevel = 'log' | 'info' | 'warn' | 'error';

export const DEV_LOG_SOURCES = ['function', 'webhook', 'app'] as const satisfies readonly DevLogSource[];

export interface DevLogEntry {
  id: string;
  source: DevLogSource;
  level: DevLogLevel;
  message: string;
  timestamp: string;
  /** Optional contextual reference, e.g. function slug. */
  reference?: string;
}

const MAX_ENTRIES = 200;
let durableWriteQueue: Promise<void> = Promise.resolve();

export interface DevLogPruneSourceResult {
  source: DevLogSource;
  deleted: number;
  remaining: number;
}

export interface DevLogPruneResult {
  before: string;
  deleted: number;
  remaining: number;
  sources: DevLogPruneSourceResult[];
}

export class DevLogRetentionCutoffError extends Error {
  readonly before: string;

  constructor(before: string) {
    super('Invalid dev log retention cutoff');
    this.name = 'DevLogRetentionCutoffError';
    this.before = before;
  }
}

interface DevLogsGlobalState {
  buffers: Map<DevLogSource, DevLogEntry[]>;
  entryIdCounter: number;
}

const globalDevLogs = globalThis as typeof globalThis & {
  __builderDevLogsState?: DevLogsGlobalState;
};

function devLogsState(): DevLogsGlobalState {
  if (!globalDevLogs.__builderDevLogsState) {
    globalDevLogs.__builderDevLogsState = {
      buffers: new Map<DevLogSource, DevLogEntry[]>(),
      entryIdCounter: 0,
    };
  }
  return globalDevLogs.__builderDevLogsState;
}

function nextEntryId(): string {
  const state = devLogsState();
  state.entryIdCounter += 1;
  return `log-${Date.now()}-${state.entryIdCounter}`;
}

function normalizeEntries(entries: readonly DevLogEntry[]): DevLogEntry[] {
  const seen = new Set<string>();
  const normalized: DevLogEntry[] = [];
  for (const entry of entries) {
    if (!entry || typeof entry !== 'object') continue;
    if (seen.has(entry.id)) continue;
    seen.add(entry.id);
    normalized.push(entry);
  }
  return normalized.slice(-MAX_ENTRIES);
}

function readDiskEntries(source: DevLogSource): DevLogEntry[] {
  return readDiskLogEntries(source, MAX_ENTRIES);
}

function writeDiskEntries(source: DevLogSource, entries: DevLogEntry[]): void {
  writeDiskLogEntries(source, normalizeEntries(entries), MAX_ENTRIES);
}

function replaceEntries(source: DevLogSource, entries: readonly DevLogEntry[]): DevLogEntry[] {
  const next = normalizeEntries(entries);
  devLogsState().buffers.set(source, next);
  writeDiskEntries(source, next);
  queueBlobWrite(source, next);
  return next;
}

function mergedEntries(source: DevLogSource): DevLogEntry[] {
  const state = devLogsState();
  const buffer = state.buffers.get(source) ?? [];
  return normalizeEntries([...readDiskEntries(source), ...buffer]);
}

function ignoreDurableMirrorError(error: unknown): void {
  if (error instanceof Error) return;
  throw error;
}

function queueBlobWrite(source: DevLogSource, entries: readonly DevLogEntry[]): void {
  if (!shouldUseBlobDevLogs()) return;
  const snapshot = normalizeEntries([...entries]);
  const write = async () => {
    try {
      await writeBlobLogEntries(source, snapshot, MAX_ENTRIES);
    } catch (error) {
      ignoreDurableMirrorError(error);
    }
  };
  durableWriteQueue = durableWriteQueue.then(write, write);
}

function queueBlobClear(source?: DevLogSource): void {
  if (!shouldUseBlobDevLogs()) return;
  const clear = async () => {
    try {
      await clearBlobLogEntries(source);
    } catch (error) {
      ignoreDurableMirrorError(error);
    }
  };
  durableWriteQueue = durableWriteQueue.then(clear, clear);
}

function filterEntries(
  list: readonly DevLogEntry[],
  options: { sinceTs?: string; limit?: number; reference?: string },
): DevLogEntry[] {
  const sinceMs = options.sinceTs ? Date.parse(options.sinceTs) : null;
  const reference = options.reference?.trim();
  const byReference = reference
    ? list.filter((entry) => entry.reference === reference)
    : list;
  const filtered = sinceMs !== null && Number.isFinite(sinceMs)
    ? byReference.filter((entry) => Date.parse(entry.timestamp) > sinceMs)
    : [...byReference];
  return filtered.slice(-(options.limit ?? MAX_ENTRIES));
}

export function appendLog(
  source: DevLogSource,
  entry: Omit<DevLogEntry, 'id' | 'source' | 'timestamp'> & {
    timestamp?: string;
  },
): DevLogEntry {
  const persisted: DevLogEntry = {
    id: nextEntryId(),
    source,
    level: entry.level,
    message: entry.message,
    timestamp: entry.timestamp ?? new Date().toISOString(),
    reference: entry.reference,
  };
  const state = devLogsState();
  const list = mergedEntries(source);
  list.push(persisted);
  const next = normalizeEntries(list);
  state.buffers.set(source, next);
  writeDiskEntries(source, next);
  queueBlobWrite(source, next);
  return persisted;
}

export function listLogs(
  source: DevLogSource,
  options: { sinceTs?: string; limit?: number; reference?: string } = {},
): DevLogEntry[] {
  const list = mergedEntries(source);
  devLogsState().buffers.set(source, list);
  return filterEntries(list, options);
}

export async function listLogsAsync(
  source: DevLogSource,
  options: { sinceTs?: string; limit?: number; reference?: string } = {},
): Promise<DevLogEntry[]> {
  const state = devLogsState();
  const persisted = shouldUseBlobDevLogs()
    ? await readBlobLogEntries(source, MAX_ENTRIES)
    : readDiskEntries(source);
  const list = normalizeEntries([...persisted, ...(state.buffers.get(source) ?? [])]);
  state.buffers.set(source, list);
  return filterEntries(list, options);
}

function shouldPruneEntry(entry: DevLogEntry, beforeMs: number): boolean {
  const timestampMs = Date.parse(entry.timestamp);
  return Number.isFinite(timestampMs) && timestampMs < beforeMs;
}

export async function pruneLogsBefore(before: string, source?: DevLogSource): Promise<DevLogPruneResult> {
  const beforeMs = Date.parse(before);
  if (!Number.isFinite(beforeMs)) throw new DevLogRetentionCutoffError(before);
  const sources = source ? [source] : DEV_LOG_SOURCES;
  const summaries: DevLogPruneSourceResult[] = [];
  for (const target of sources) {
    const entries = await listLogsAsync(target, { limit: MAX_ENTRIES });
    const retained = entries.filter((entry) => !shouldPruneEntry(entry, beforeMs));
    replaceEntries(target, retained);
    summaries.push({
      source: target,
      deleted: entries.length - retained.length,
      remaining: retained.length,
    });
  }
  return {
    before,
    deleted: summaries.reduce((total, item) => total + item.deleted, 0),
    remaining: summaries.reduce((total, item) => total + item.remaining, 0),
    sources: summaries,
  };
}

export function clearLogs(source?: DevLogSource): void {
  const state = devLogsState();
  if (source) {
    state.buffers.delete(source);
    clearDiskLogEntries(source);
    queueBlobClear(source);
    return;
  }
  state.buffers.clear();
  clearDiskLogEntries();
  queueBlobClear();
}

export function resetDevLogsMemory(): void {
  const state = devLogsState();
  state.buffers.clear();
}

export async function flushDevLogWrites(): Promise<void> {
  await durableWriteQueue;
}

export const DEV_LOG_MAX_ENTRIES = MAX_ENTRIES;
