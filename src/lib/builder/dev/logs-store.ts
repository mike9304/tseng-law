/**
 * F110 — Dev logs ring buffer (in-memory).
 *
 * NAIVE first slice: per-source ring buffer in module scope. This is
 * sufficient for local dev and single-region preview testing but is NOT
 * a real log system — Vercel serverless functions do not share memory
 * across invocations. Promote to KV / Blob / Logflare for production
 * before treating these logs as a source of truth.
 */

export type DevLogSource = 'function' | 'webhook' | 'app';
export type DevLogLevel = 'log' | 'info' | 'warn' | 'error';

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
const buffers = new Map<DevLogSource, DevLogEntry[]>();
let entryIdCounter = 0;

function nextEntryId(): string {
  entryIdCounter += 1;
  return `log-${Date.now()}-${entryIdCounter}`;
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
  const list = buffers.get(source) ?? [];
  list.push(persisted);
  while (list.length > MAX_ENTRIES) list.shift();
  buffers.set(source, list);
  return persisted;
}

export function listLogs(
  source: DevLogSource,
  options: { sinceTs?: string; limit?: number } = {},
): DevLogEntry[] {
  const list = buffers.get(source) ?? [];
  const sinceMs = options.sinceTs ? Date.parse(options.sinceTs) : null;
  const filtered = sinceMs !== null && Number.isFinite(sinceMs)
    ? list.filter((entry) => Date.parse(entry.timestamp) > sinceMs)
    : [...list];
  const limit = options.limit ?? MAX_ENTRIES;
  return filtered.slice(-limit);
}

export function clearLogs(source?: DevLogSource): void {
  if (source) buffers.delete(source);
  else buffers.clear();
}

export const DEV_LOG_MAX_ENTRIES = MAX_ENTRIES;