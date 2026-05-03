import { appendFile, mkdir, readdir, readFile, writeFile } from 'fs/promises';
import path from 'path';
import { get, list, put } from '@vercel/blob';

/**
 * Durable storage for consultation operator logs (events + feedback).
 *
 * Two backends:
 *   1. Vercel Blob (private access) — used in production and any
 *      environment where BLOB_READ_WRITE_TOKEN is set. The repo
 *      already has the token provisioned for builder snapshots.
 *   2. Local filesystem — used for tests, CI, and developers without
 *      a blob token. Mirrors the original `runtime-data/...` layout.
 *
 * The blob backend is the one that matters for shipping: Vercel
 * serverless functions have a read-only deployment filesystem, so
 * the original appendFile-to-runtime-data approach silently failed
 * in production and left the operator dashboard empty.
 *
 * NOTE on race conditions: under the blob backend, two concurrent
 * writes to the same day blob can clobber each other because
 * read-modify-write is not atomic. At Hojeong's consultation traffic
 * (tens of events/day) the collision window is negligible. If volume
 * grows materially, switch to ETag-conditional PUT — this is a
 * deliberate trade-off, not an oversight.
 */

export type LogKind = 'events' | 'feedback' | 'knowledge';

export interface ConsultationLogLineEntry {
  dateKey: string;
  line: string;
}

const FILE_PREFIX: Record<LogKind, string> = {
  events: 'consultation-events-',
  feedback: 'consultation-feedback-',
  knowledge: 'consultation-knowledge-',
};

const BLOB_PREFIX: Record<LogKind, string> = {
  events: 'consultation-logs/events/',
  feedback: 'consultation-logs/feedback/',
  knowledge: 'consultation-logs/knowledge/',
};

function getLocalLogDir(): string {
  return (
    process.env.CONSULTATION_LOG_DIR
    || path.join(process.cwd(), 'runtime-data', 'consultation-logs')
  );
}

function isBlobBackend(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return false;
  }

  if (process.env.CONSULTATION_LOG_BACKEND === 'blob') {
    return true;
  }

  if (process.env.CONSULTATION_LOG_BACKEND === 'local') {
    return false;
  }

  // Local review/staging runs often inherit Vercel env vars in `.env.local`
  // without having the same network/runtime guarantees as a deployed Vercel
  // function. In those cases prefer the local filesystem mirror so the admin
  // dashboard degrades to real local data instead of erroring on blob access.
  return Boolean(process.env.VERCEL_URL);
}

function isBlobNotFoundError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const m = error.message.toLowerCase();
  return m.includes('not found') || m.includes('404') || m.includes('no such');
}

function blobPathname(kind: LogKind, dateKey: string): string {
  return `${BLOB_PREFIX[kind]}${dateKey}.jsonl`;
}

function localFilename(kind: LogKind, dateKey: string): string {
  return `${FILE_PREFIX[kind]}${dateKey}.jsonl`;
}

function extractDateKey(value: string): string | null {
  const match = value.match(/(\d{4}-\d{2}-\d{2})\.jsonl$/);
  return match?.[1] ?? null;
}

async function readBlobBody(kind: LogKind, dateKey: string): Promise<string> {
  const pathname = blobPathname(kind, dateKey);
  try {
    const result = await get(pathname, { access: 'private', useCache: false });
    if (!result || result.statusCode !== 200 || !result.stream) return '';
    return await new Response(result.stream).text();
  } catch (error) {
    if (isBlobNotFoundError(error)) return '';
    throw error;
  }
}

async function appendBlobLine(
  kind: LogKind,
  dateKey: string,
  line: string,
): Promise<void> {
  const existing = await readBlobBody(kind, dateKey);
  const sep = existing.length === 0 || existing.endsWith('\n') ? '' : '\n';
  const updated = `${existing}${sep}${line}\n`;
  await put(blobPathname(kind, dateKey), updated, {
    access: 'private',
    allowOverwrite: true,
    contentType: 'application/x-ndjson',
  });
}

async function appendLocalLine(
  kind: LogKind,
  dateKey: string,
  line: string,
): Promise<void> {
  const dir = getLocalLogDir();
  await mkdir(dir, { recursive: true, mode: 0o700 });
  await appendFile(path.join(dir, localFilename(kind, dateKey)), `${line}\n`, {
    encoding: 'utf8',
    mode: 0o600,
  });
}

async function replaceBlobLines(
  kind: LogKind,
  dateKey: string,
  lines: string[],
): Promise<void> {
  const body = lines.length === 0 ? '' : `${lines.join('\n')}\n`;
  await put(blobPathname(kind, dateKey), body, {
    access: 'private',
    allowOverwrite: true,
    contentType: 'application/x-ndjson',
  });
}

async function replaceLocalLines(
  kind: LogKind,
  dateKey: string,
  lines: string[],
): Promise<void> {
  const dir = getLocalLogDir();
  await mkdir(dir, { recursive: true, mode: 0o700 });
  const body = lines.length === 0 ? '' : `${lines.join('\n')}\n`;
  await writeFile(path.join(dir, localFilename(kind, dateKey)), body, {
    encoding: 'utf8',
    mode: 0o600,
  });
}

/**
 * Append one JSONL record to the day's log of the given kind.
 * Backend chosen via BLOB_READ_WRITE_TOKEN.
 */
export async function appendConsultationLogLine(
  kind: LogKind,
  dateKey: string,
  line: string,
): Promise<void> {
  if (isBlobBackend()) {
    await appendBlobLine(kind, dateKey, line);
  } else {
    await appendLocalLine(kind, dateKey, line);
  }
}

/** Replace all JSONL records for one day. Used by data-erasure routes. */
export async function replaceConsultationLogLines(
  kind: LogKind,
  dateKey: string,
  lines: string[],
): Promise<void> {
  if (isBlobBackend()) {
    await replaceBlobLines(kind, dateKey, lines);
  } else {
    await replaceLocalLines(kind, dateKey, lines);
  }
}

async function listBlobDateKeys(kind: LogKind, windowStartTs: number): Promise<string[]> {
  const dateKeys: string[] = [];
  let cursor: string | undefined;
  do {
    const result = await list({
      prefix: BLOB_PREFIX[kind],
      cursor,
    });
    for (const blob of result.blobs) {
      const dateKey = extractDateKey(blob.pathname);
      if (!dateKey) continue;
      const dateTs = Date.parse(`${dateKey}T23:59:59.999Z`);
      if (!Number.isNaN(dateTs) && dateTs < windowStartTs) continue;
      dateKeys.push(dateKey);
    }
    cursor = result.cursor;
  } while (cursor);
  return Array.from(new Set(dateKeys)).sort().reverse();
}

async function readBlobLogLineEntries(
  kind: LogKind,
  windowStartTs: number,
): Promise<ConsultationLogLineEntry[]> {
  const dateKeys = await listBlobDateKeys(kind, windowStartTs);
  const days = await Promise.all(
    dateKeys.map(async (dateKey) => {
      try {
        const body = await readBlobBody(kind, dateKey);
        return body
          .split('\n')
          .filter((line) => line.trim().length > 0)
          .map((line) => ({ dateKey, line }));
      } catch {
        return [];
      }
    }),
  );
  return days.flat();
}

async function readLocalLogLineEntries(kind: LogKind): Promise<ConsultationLogLineEntry[]> {
  const dir = getLocalLogDir();
  let names: string[];
  try {
    names = await readdir(dir);
  } catch {
    return [];
  }
  const matching = names
    .filter((n) => n.startsWith(FILE_PREFIX[kind]) && n.endsWith('.jsonl'))
    .sort()
    .reverse();
  const out: ConsultationLogLineEntry[] = [];
  for (const name of matching) {
    const dateKey = extractDateKey(name);
    if (!dateKey) continue;
    try {
      const text = await readFile(path.join(dir, name), 'utf8');
      for (const line of text.split('\n')) {
        if (line.trim()) out.push({ dateKey, line });
      }
    } catch {
      // skip unreadable file
    }
  }
  return out;
}

/**
 * Read all JSONL lines of the given kind. The caller is expected to
 * JSON.parse each line defensively and to filter on its own timestamp
 * field — we don't decode here so this module stays type-agnostic.
 *
 * Under blob backend we fetch each day's blob in parallel; missing
 * day blobs return empty arrays. Other errors (network, auth) also
 * degrade to empty so the dashboard never 500s on a single bad day.
 */
export async function readConsultationLogLines(
  kind: LogKind,
  windowStartTs: number,
): Promise<string[]> {
  const entries = await readConsultationLogLineEntries(kind, windowStartTs);
  return entries.map((entry) => entry.line);
}

/**
 * Read JSONL lines with their backing day key. This is required for
 * erasure: after filtering records we need to rewrite the same day
 * blob/file, not merely return a flattened list.
 */
export async function readConsultationLogLineEntries(
  kind: LogKind,
  windowStartTs: number,
): Promise<ConsultationLogLineEntry[]> {
  if (isBlobBackend()) {
    return readBlobLogLineEntries(kind, windowStartTs);
  }
  const entries = await readLocalLogLineEntries(kind);
  return entries.filter((entry) => {
    const ts = Date.parse(`${entry.dateKey}T23:59:59.999Z`);
    return Number.isNaN(ts) || ts >= windowStartTs;
  });
}

export interface ConsultationLogDeletionResult {
  totalScanned: number;
  totalRemoved: number;
  rewrittenDays: Array<{
    kind: LogKind;
    dateKey: string;
    kept: number;
    removed: number;
  }>;
}

/**
 * Permanently remove all event/feedback log records for a sessionId
 * from the backing JSONL files/blobs by rewriting affected days.
 */
export async function deleteConsultationLogRecordsBySession(
  sessionId: string,
): Promise<ConsultationLogDeletionResult> {
  const kinds: LogKind[] = ['events', 'feedback'];
  let totalScanned = 0;
  let totalRemoved = 0;
  const rewrittenDays: ConsultationLogDeletionResult['rewrittenDays'] = [];

  for (const kind of kinds) {
    const entries = await readConsultationLogLineEntries(kind, 0);
    totalScanned += entries.length;
    const byDate = new Map<string, { kept: string[]; removed: number }>();

    for (const entry of entries) {
      const bucket = byDate.get(entry.dateKey) ?? { kept: [], removed: 0 };
      try {
        const parsed = JSON.parse(entry.line) as { sessionId?: string };
        if (parsed.sessionId === sessionId) {
          bucket.removed += 1;
          totalRemoved += 1;
        } else {
          bucket.kept.push(entry.line);
        }
      } catch {
        // Preserve malformed lines; erasure should never lose unrelated data.
        bucket.kept.push(entry.line);
      }
      byDate.set(entry.dateKey, bucket);
    }

    for (const [dateKey, bucket] of byDate.entries()) {
      if (bucket.removed === 0) continue;
      await replaceConsultationLogLines(kind, dateKey, bucket.kept);
      rewrittenDays.push({
        kind,
        dateKey,
        kept: bucket.kept.length,
        removed: bucket.removed,
      });
    }
  }

  return { totalScanned, totalRemoved, rewrittenDays };
}
