import { appendFile, mkdir, readdir, readFile } from 'fs/promises';
import path from 'path';
import { get, put } from '@vercel/blob';

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

export type LogKind = 'events' | 'feedback';

const FILE_PREFIX: Record<LogKind, string> = {
  events: 'consultation-events-',
  feedback: 'consultation-feedback-',
};

const BLOB_PREFIX: Record<LogKind, string> = {
  events: 'consultation-logs/events/',
  feedback: 'consultation-logs/feedback/',
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

/** Walk back from today, in UTC, until before windowStart. */
function enumerateDateKeys(windowStartTs: number): string[] {
  const out: string[] = [];
  const cursor = new Date();
  cursor.setUTCHours(0, 0, 0, 0);
  while (cursor.getTime() + 24 * 60 * 60 * 1000 - 1 >= windowStartTs) {
    out.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return out;
}

async function readLocalLogLines(kind: LogKind): Promise<string[]> {
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
  const out: string[] = [];
  for (const name of matching) {
    try {
      const text = await readFile(path.join(dir, name), 'utf8');
      for (const line of text.split('\n')) out.push(line);
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
  if (isBlobBackend()) {
    const dateKeys = enumerateDateKeys(windowStartTs);
    const days = await Promise.all(
      dateKeys.map(async (d) => {
        try {
          const body = await readBlobBody(kind, d);
          return body.split('\n');
        } catch {
          return [];
        }
      }),
    );
    return days.flat();
  }
  return readLocalLogLines(kind);
}
