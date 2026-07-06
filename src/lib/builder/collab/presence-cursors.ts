/**
 * F95 — Live cursor positions (presence depth slice).
 *
 * File-backed at runtime-data/collab/cursors/${siteId}/${pageId}.json so cursors
 * survive a process restart and are visible to all replicas reading the same
 * filesystem. (Task spec said `cursors-${pageId}.json` flat; scoped by siteId
 * here to match comments-store layout and avoid cross-site collisions.)
 *
 * Each cursor is a (sessionId, pageId) keyed record. We prune entries older
 * than CURSOR_TTL_MS (5 minutes) on every read and every write, inside the
 * write mutex. Colors are deterministic from username via `colorForUsername`
 * imported from presence-store so a user's cursor color matches their
 * presence avatar.
 *
 * NOTE: This sits alongside `presence-store.ts` (in-memory, fast heartbeats)
 * rather than replacing it. Heartbeats stay in-memory because they fire every
 * ~5s; cursor moves are sparser (debounced client-side) and benefit from
 * persistence so a refreshed editor sees the most recent positions
 * immediately.
 */

import { readFile, writeFile, mkdir, rename, rm } from 'fs/promises';
import path from 'path';
import { normalizeBuilderSiteId } from '@/lib/builder/site/identity';
import { colorForUsername } from '@/lib/builder/collab/presence-store';

export const CURSOR_TTL_MS = 5 * 60_000;

export interface CursorPosition {
  userId: string;
  pageId: string;
  x: number;
  y: number;
  nodeId?: string;
  color: string;
  label: string;
  updatedAt: number;
}

interface CursorsFile {
  version: 1;
  cursors: CursorPosition[];
}

const writeQueues = new Map<string, Promise<void>>();

function rootDir(): string {
  return path.join(process.cwd(), 'runtime-data', 'collab', 'cursors');
}

function fileFor(siteId: string, pageId: string): string {
  return path.join(rootDir(), normalizeBuilderSiteId(siteId), `${pageId}.json`);
}

function queueKey(siteId: string, pageId: string): string {
  return `${normalizeBuilderSiteId(siteId)}:${pageId}`;
}

async function withLock<T>(siteId: string, pageId: string, task: () => Promise<T>): Promise<T> {
  const key = queueKey(siteId, pageId);
  const previous = writeQueues.get(key) ?? Promise.resolve();
  let release!: () => void;
  const current = new Promise<void>((resolve) => {
    release = resolve;
  });
  const queued = previous.catch(() => undefined).then(() => current);
  writeQueues.set(key, queued);

  await previous.catch(() => undefined);
  try {
    return await task();
  } finally {
    release();
    if (writeQueues.get(key) === queued) writeQueues.delete(key);
  }
}

async function readFileSafe(siteId: string, pageId: string): Promise<CursorsFile> {
  try {
    const text = await readFile(fileFor(siteId, pageId), 'utf8');
    const parsed = JSON.parse(text) as Partial<CursorsFile>;
    if (parsed && Array.isArray(parsed.cursors)) {
      const filtered = parsed.cursors.filter((c): c is CursorPosition => isCursor(c));
      return { version: 1, cursors: filtered };
    }
  } catch { /* file missing or invalid → empty */ }
  return { version: 1, cursors: [] };
}

function isCursor(value: unknown): value is CursorPosition {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.userId === 'string' &&
    typeof v.pageId === 'string' &&
    typeof v.x === 'number' &&
    typeof v.y === 'number' &&
    typeof v.color === 'string' &&
    typeof v.label === 'string' &&
    typeof v.updatedAt === 'number'
  );
}

// temp-write + rename so a crash mid-write can never leave a truncated
// destination; rename(2) is atomic on the same filesystem.
async function writeFileAtomic(siteId: string, pageId: string, file: CursorsFile): Promise<void> {
  const target = fileFor(siteId, pageId);
  await mkdir(path.dirname(target), { recursive: true });
  const tmpPath = `${target}.tmp-${process.pid}-${Math.random().toString(36).slice(2)}`;
  try {
    await writeFile(tmpPath, JSON.stringify(file), 'utf8');
    await rename(tmpPath, target);
  } catch (error) {
    await rm(tmpPath, { force: true }).catch(() => {});
    throw error;
  }
}

function pruneInPlace(cursors: CursorPosition[], now: number): CursorPosition[] {
  return cursors.filter((c) => now - c.updatedAt <= CURSOR_TTL_MS);
}

const MAX_USER_LEN = 200;
const MAX_LABEL_LEN = 80;
const MAX_COORD = 1_000_000;

export interface SetCursorInput {
  siteId: string;
  userId: string;
  pageId: string;
  x: number;
  y: number;
  nodeId?: string;
  label?: string;
}

function sanitizeUserId(input: unknown): string | null {
  if (typeof input !== 'string') return null;
  const trimmed = input.trim();
  if (!trimmed || trimmed.length > MAX_USER_LEN) return null;
  return trimmed;
}

function sanitizeLabel(input: unknown, fallback: string): string {
  if (typeof input !== 'string') return fallback.slice(0, MAX_LABEL_LEN);
  const trimmed = input.trim();
  if (!trimmed) return fallback.slice(0, MAX_LABEL_LEN);
  return trimmed.slice(0, MAX_LABEL_LEN);
}

function clampCoord(value: number): number {
  if (!Number.isFinite(value)) return 0;
  if (value < -MAX_COORD) return -MAX_COORD;
  if (value > MAX_COORD) return MAX_COORD;
  return value;
}

export async function setCursor(
  input: SetCursorInput,
  now: number = Date.now(),
): Promise<CursorPosition> {
  const userId = sanitizeUserId(input.userId);
  if (!userId) throw new Error('setCursor: userId must be a non-empty string');
  if (!input.pageId) throw new Error('setCursor: pageId is required');

  const cursor: CursorPosition = {
    userId,
    pageId: input.pageId,
    x: clampCoord(input.x),
    y: clampCoord(input.y),
    nodeId: input.nodeId,
    color: colorForUsername(userId),
    label: sanitizeLabel(input.label, userId),
    updatedAt: now,
  };

  await withLock(input.siteId, input.pageId, async () => {
    const file = await readFileSafe(input.siteId, input.pageId);
    const pruned = pruneInPlace(file.cursors, now);
    const idx = pruned.findIndex((c) => c.userId === userId);
    if (idx >= 0) {
      pruned[idx] = cursor;
    } else {
      pruned.push(cursor);
    }
    await writeFileAtomic(input.siteId, input.pageId, { version: 1, cursors: pruned });
  });

  return cursor;
}

export async function listActiveCursors(
  siteId: string,
  pageId: string,
  now: number = Date.now(),
): Promise<CursorPosition[]> {
  const file = await readFileSafe(siteId, pageId);
  return pruneInPlace(file.cursors, now)
    .slice()
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function clearCursor(
  userId: string,
  pageId: string,
  siteId: string,
  now: number = Date.now(),
): Promise<boolean> {
  const normUserId = sanitizeUserId(userId);
  if (!normUserId) return false;
  let removed = false;
  await withLock(siteId, pageId, async () => {
    const file = await readFileSafe(siteId, pageId);
    const before = file.cursors.length;
    const pruned = pruneInPlace(file.cursors, now).filter((c) => c.userId !== normUserId);
    if (pruned.length !== before) {
      removed = true;
      await writeFileAtomic(siteId, pageId, { version: 1, cursors: pruned });
    }
  });
  return removed;
}

/** Test-only — clears in-memory write queues. File contents are scoped by cwd. */
export function __resetPresenceCursorsForTests(): void {
  writeQueues.clear();
}