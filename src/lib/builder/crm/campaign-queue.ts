/**
 * Per-contact campaign send queue. When an automation (or admin batch)
 * triggers a campaign, callers `enqueue` one entry per recipient. A worker
 * (cron or future job runner) dequeues pending entries, performs the send,
 * and calls `markStatus` with the outcome.
 *
 * Storage: `runtime-data/crm/send-queue.json`, single-file shape gated by a
 * serialized write queue. Entries persist until pruned (admin GC), so we
 * can answer "what bounced last week" without needing a separate log.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { randomBytes } from 'node:crypto';
import { get, put } from '@vercel/blob';

export type CrmSendStatus = 'pending' | 'sent' | 'failed' | 'bounced';

export interface CrmSendEntry {
  id: string;
  campaignId: string;
  contactId: string;
  contactEmail: string;
  status: CrmSendStatus;
  attempts: number;
  enqueuedAt: string;
  updatedAt: string;
  lastError?: string;
  /** Free-form metadata supplied by callers (template id, automation id, etc.) */
  metadata?: Record<string, unknown>;
}

export interface CrmSendQueueFile {
  version: 1;
  updatedAt: string;
  entries: CrmSendEntry[];
}

export interface CrmSendQueueStats {
  total: number;
  pending: number;
  sent: number;
  failed: number;
  bounced: number;
  byCampaign: Record<string, { total: number; pending: number; sent: number; failed: number; bounced: number }>;
  /** Most recent entries first, capped. */
  recent: CrmSendEntry[];
}

const MAX_ENTRIES = 10_000;
const STATUSES: CrmSendStatus[] = ['pending', 'sent', 'failed', 'bounced'];

function rootDir(): string {
  return path.join(process.cwd(), 'runtime-data', 'crm');
}
function queueFile(): string {
  return path.join(rootDir(), 'send-queue.json');
}
const BLOB_PATH = 'crm/send-queue.json';

function isBlobBackend(): boolean {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return false;
  if (process.env.CRM_BACKEND === 'local') return false;
  if (
    process.env.NODE_ENV !== 'production' &&
    process.env.BUILDER_USE_BLOB_IN_DEV !== '1'
  ) {
    return false;
  }
  return true;
}

function emptyFile(): CrmSendQueueFile {
  return { version: 1, updatedAt: new Date(0).toISOString(), entries: [] };
}

function normalizeStatus(value: unknown): CrmSendStatus {
  return STATUSES.includes(value as CrmSendStatus)
    ? (value as CrmSendStatus)
    : 'pending';
}

function normalizeEntry(raw: unknown): CrmSendEntry | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Partial<CrmSendEntry>;
  if (
    typeof r.id !== 'string' ||
    typeof r.campaignId !== 'string' ||
    typeof r.contactId !== 'string' ||
    typeof r.contactEmail !== 'string'
  ) {
    return null;
  }
  return {
    id: r.id,
    campaignId: r.campaignId,
    contactId: r.contactId,
    contactEmail: r.contactEmail.toLowerCase(),
    status: normalizeStatus(r.status),
    attempts: typeof r.attempts === 'number' ? r.attempts : 0,
    enqueuedAt: typeof r.enqueuedAt === 'string' ? r.enqueuedAt : new Date().toISOString(),
    updatedAt: typeof r.updatedAt === 'string' ? r.updatedAt : new Date().toISOString(),
    lastError: typeof r.lastError === 'string' ? r.lastError : undefined,
    metadata:
      r.metadata && typeof r.metadata === 'object'
        ? (r.metadata as Record<string, unknown>)
        : undefined,
  };
}

function normalizeFile(value: unknown): CrmSendQueueFile {
  if (!value || typeof value !== 'object') return emptyFile();
  const v = value as Partial<CrmSendQueueFile>;
  const entries = Array.isArray(v.entries)
    ? v.entries.map(normalizeEntry).filter((e): e is CrmSendEntry => e !== null)
    : [];
  return {
    version: 1,
    updatedAt: typeof v.updatedAt === 'string' ? v.updatedAt : new Date().toISOString(),
    entries,
  };
}

async function readFromBackend(): Promise<CrmSendQueueFile> {
  if (isBlobBackend()) {
    try {
      const result = await get(BLOB_PATH, { access: 'private', useCache: false });
      if (result?.statusCode === 200 && result.stream) {
        const text = await new Response(result.stream).text();
        return normalizeFile(JSON.parse(text));
      }
    } catch {
      /* fallthrough */
    }
    return emptyFile();
  }
  try {
    return normalizeFile(JSON.parse(await fs.readFile(queueFile(), 'utf8')));
  } catch {
    return emptyFile();
  }
}

async function writeToBackend(data: CrmSendQueueFile): Promise<void> {
  const body = JSON.stringify(data, null, 2);
  if (isBlobBackend()) {
    await put(BLOB_PATH, body, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }
  await fs.mkdir(rootDir(), { recursive: true });
  await fs.writeFile(queueFile(), body, 'utf8');
}

let queueLock: Promise<void> = Promise.resolve();

async function withQueue<T>(task: () => Promise<T>): Promise<T> {
  const previous = queueLock;
  let release!: () => void;
  queueLock = new Promise<void>((resolve) => {
    release = resolve;
  });
  await previous.catch(() => undefined);
  try {
    return await task();
  } finally {
    release();
  }
}

export function makeSendEntryId(): string {
  return `snd_${Date.now().toString(36)}_${randomBytes(5).toString('hex')}`;
}

export interface EnqueueInput {
  campaignId: string;
  contactId: string;
  contactEmail: string;
  metadata?: Record<string, unknown>;
}

/**
 * Append a batch of pending entries. Idempotency is per (campaignId,
 * contactId): if the queue already holds an entry for that pair, we skip
 * creating a duplicate so re-firing automations doesn't double-send.
 */
export async function enqueueSends(inputs: EnqueueInput[]): Promise<CrmSendEntry[]> {
  if (inputs.length === 0) return [];
  return withQueue(async () => {
    const current = await readFromBackend();
    const existingKeys = new Set(
      current.entries
        .filter((e) => e.status === 'pending' || e.status === 'sent')
        .map((e) => `${e.campaignId}::${e.contactId}`),
    );
    const now = new Date().toISOString();
    const created: CrmSendEntry[] = [];
    for (const input of inputs) {
      const key = `${input.campaignId}::${input.contactId}`;
      if (existingKeys.has(key)) continue;
      existingKeys.add(key);
      created.push({
        id: makeSendEntryId(),
        campaignId: input.campaignId,
        contactId: input.contactId,
        contactEmail: input.contactEmail.toLowerCase(),
        status: 'pending',
        attempts: 0,
        enqueuedAt: now,
        updatedAt: now,
        metadata: input.metadata,
      });
    }
    if (created.length === 0) return [];
    let next = [...current.entries, ...created];
    if (next.length > MAX_ENTRIES) {
      // Drop oldest terminal entries first to keep the queue bounded.
      next = pruneOldestTerminal(next, MAX_ENTRIES);
    }
    const file: CrmSendQueueFile = {
      version: 1,
      updatedAt: now,
      entries: next,
    };
    await writeToBackend(file);
    return created;
  });
}

/**
 * Pull up to `limit` pending entries in FIFO order. Returns a snapshot — it
 * does NOT atomically claim the entries, since the only worker today is the
 * single-process cron runner. Callers should follow up with `markStatus`.
 */
export async function dequeuePending(limit = 50): Promise<CrmSendEntry[]> {
  const current = await readFromBackend();
  return current.entries
    .filter((e) => e.status === 'pending')
    .sort((a, b) => a.enqueuedAt.localeCompare(b.enqueuedAt))
    .slice(0, Math.max(0, limit));
}

export async function markStatus(
  entryId: string,
  status: CrmSendStatus,
  options: { lastError?: string } = {},
): Promise<CrmSendEntry | null> {
  return withQueue(async () => {
    const current = await readFromBackend();
    const index = current.entries.findIndex((e) => e.id === entryId);
    if (index === -1) return null;
    const existing = current.entries[index];
    const next: CrmSendEntry = {
      ...existing,
      status,
      attempts: existing.attempts + (status === 'pending' ? 0 : 1),
      lastError: status === 'failed' || status === 'bounced' ? options.lastError : undefined,
      updatedAt: new Date().toISOString(),
    };
    const entries = [...current.entries];
    entries[index] = next;
    const file: CrmSendQueueFile = {
      version: 1,
      updatedAt: next.updatedAt,
      entries,
    };
    await writeToBackend(file);
    return next;
  });
}

export async function readSendQueue(): Promise<CrmSendEntry[]> {
  const file = await readFromBackend();
  return file.entries;
}

export async function getSendQueueStats(recentLimit = 20): Promise<CrmSendQueueStats> {
  const entries = await readSendQueue();
  const stats: CrmSendQueueStats = {
    total: entries.length,
    pending: 0,
    sent: 0,
    failed: 0,
    bounced: 0,
    byCampaign: {},
    recent: [],
  };
  for (const entry of entries) {
    stats[entry.status] += 1;
    const bucket =
      stats.byCampaign[entry.campaignId] ??
      { total: 0, pending: 0, sent: 0, failed: 0, bounced: 0 };
    bucket.total += 1;
    bucket[entry.status] += 1;
    stats.byCampaign[entry.campaignId] = bucket;
  }
  stats.recent = [...entries]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, Math.max(0, recentLimit));
  return stats;
}

function pruneOldestTerminal(entries: CrmSendEntry[], maxEntries: number): CrmSendEntry[] {
  if (entries.length <= maxEntries) return entries;
  const pending = entries.filter((e) => e.status === 'pending');
  const terminal = entries
    .filter((e) => e.status !== 'pending')
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const keepTerminalCount = Math.max(0, maxEntries - pending.length);
  return [...pending, ...terminal.slice(0, keepTerminalCount)];
}