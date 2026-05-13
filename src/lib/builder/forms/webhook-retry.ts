import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'node:crypto';
import { get, list, put, del } from '@vercel/blob';

const ROOT = path.join(process.cwd(), 'runtime-data', 'webhook-retry');
const BLOB_PREFIX = 'webhook-retry/entries/';
const MAX_ATTEMPTS = 6;
const ENTRY_ID_RE = /^wh_[A-Za-z0-9_-]{1,96}$/;
const ENTRY_FILENAME_RE = /^wh_[A-Za-z0-9_-]{1,96}\.json$/;

export interface PendingWebhookDelivery {
  id: string;
  url: string;
  payload: unknown;
  attempts: number;
  lastError?: string;
  nextAttemptAt: string;
  createdAt: string;
}

function backend(): 'blob' | 'file' {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return 'file';
  if (process.env.FORM_WEBHOOK_RETRY_BACKEND === 'local') return 'file';
  if (process.env.NODE_ENV !== 'production' && process.env.BUILDER_USE_BLOB_IN_DEV !== '1') {
    return 'file';
  }
  return 'blob';
}

function makeId(): string {
  return `wh_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
}

function backoffMsForAttempt(attempt: number): number {
  // Exponential 1m to 64m, capped.
  return Math.min(60_000 * 2 ** Math.max(0, attempt - 1), 64 * 60_000);
}

function safeEntryId(id: string): string | null {
  const value = id.trim();
  return ENTRY_ID_RE.test(value) ? value : null;
}

function fileEntryPath(id: string): string | null {
  const safeId = safeEntryId(id);
  return safeId ? path.join(ROOT, `${safeId}.json`) : null;
}

function blobEntryPath(id: string): string | null {
  const safeId = safeEntryId(id);
  return safeId ? `${BLOB_PREFIX}${safeId}.json` : null;
}

/**
 * Persist a failed form-submit webhook so it can be retried later by an
 * admin cron. Done as fire-and-forget so the form-submit request never
 * blocks on storage failures.
 */
export async function recordFailedWebhook(
  url: string,
  payload: unknown,
  error: unknown,
): Promise<void> {
  const id = makeId();
  const now = new Date();
  const entry: PendingWebhookDelivery = {
    id,
    url,
    payload,
    attempts: 1,
    lastError: error instanceof Error ? error.message : String(error),
    nextAttemptAt: new Date(now.getTime() + backoffMsForAttempt(1)).toISOString(),
    createdAt: now.toISOString(),
  };
  try {
    const body = JSON.stringify(entry);
    if (backend() === 'blob') {
      await put(`${BLOB_PREFIX}${id}.json`, body, {
        access: 'private',
        allowOverwrite: false,
        contentType: 'application/json',
      });
      return;
    }
    const target = fileEntryPath(id);
    if (!target) return;
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, body, 'utf8');
  } catch {
    // Last-resort: nothing else we can do; at least the dispatcher caller
    // already logged the original error via console.
  }
}

export async function listPendingWebhooks(): Promise<PendingWebhookDelivery[]> {
  try {
    return backend() === 'blob' ? await listBlob() : await listFile();
  } catch {
    return [];
  }
}

export async function deletePendingWebhook(id: string): Promise<void> {
  if (backend() === 'blob') {
    const pathname = blobEntryPath(id);
    if (!pathname) return;
    await del(pathname).catch(() => {});
    return;
  }
  const target = fileEntryPath(id);
  if (!target) return;
  await fs.unlink(target).catch(() => {});
}

export async function updatePendingWebhook(entry: PendingWebhookDelivery): Promise<void> {
  const safeId = safeEntryId(entry.id);
  if (!safeId) throw new Error('Invalid webhook retry id');
  const body = JSON.stringify({ ...entry, id: safeId });
  if (backend() === 'blob') {
    await put(`${BLOB_PREFIX}${safeId}.json`, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  const target = fileEntryPath(safeId);
  if (!target) throw new Error('Invalid webhook retry id');
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, body, 'utf8');
}

/**
 * Drains all pending webhook deliveries whose nextAttemptAt has passed.
 * Each successful POST is removed; each failure increments attempts and
 * reschedules. Entries exceeding MAX_ATTEMPTS are deleted to prevent
 * runaway buildup.
 */
export async function drainPendingWebhooks(): Promise<{
  processed: number;
  delivered: number;
  failed: number;
  dropped: number;
}> {
  const pending = await listPendingWebhooks();
  const now = Date.now();
  const due = pending.filter((entry) => Date.parse(entry.nextAttemptAt) <= now);
  let delivered = 0;
  let failed = 0;
  let dropped = 0;

  for (const entry of due) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);
    try {
      const res = await fetch(entry.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry.payload),
        signal: controller.signal,
      });
      if (res.ok) {
        await deletePendingWebhook(entry.id);
        delivered += 1;
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      const nextAttempts = entry.attempts + 1;
      if (nextAttempts > MAX_ATTEMPTS) {
        await deletePendingWebhook(entry.id);
        dropped += 1;
      } else {
        await updatePendingWebhook({
          ...entry,
          attempts: nextAttempts,
          lastError: err instanceof Error ? err.message : String(err),
          nextAttemptAt: new Date(Date.now() + backoffMsForAttempt(nextAttempts)).toISOString(),
        });
        failed += 1;
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  return { processed: due.length, delivered, failed, dropped };
}

async function listBlob(): Promise<PendingWebhookDelivery[]> {
  const result = await list({ prefix: BLOB_PREFIX });
  const out: PendingWebhookDelivery[] = [];
  for (const blob of result.blobs) {
    try {
      const item = await get(blob.pathname, { access: 'private', useCache: false });
      if (item?.statusCode === 200 && item.stream) {
        out.push(JSON.parse(await new Response(item.stream).text()) as PendingWebhookDelivery);
      }
    } catch {
      /* skip */
    }
  }
  return out;
}

async function listFile(): Promise<PendingWebhookDelivery[]> {
  const out: PendingWebhookDelivery[] = [];
  let entries: import('fs').Dirent[] = [];
  try {
    entries = await fs.readdir(ROOT, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) continue;
    if (!ENTRY_FILENAME_RE.test(entry.name)) continue;
    try {
      const raw = await fs.readFile(path.join(ROOT, entry.name), 'utf8');
      out.push(JSON.parse(raw) as PendingWebhookDelivery);
    } catch {
      /* skip */
    }
  }
  return out;
}
