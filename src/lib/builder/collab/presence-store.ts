/**
 * F95 — Presence store (first slice).
 *
 * In-memory only. Keyed by `${siteId}:${pageId}` → Map<sessionId, entry>.
 * Heartbeats are short (~5s client) and we prune entries older than TTL_MS
 * on every read. This is per-process; a follow-up will move to a shared
 * Redis/Upstash backend once multi-replica deploys land.
 */

export interface PresenceEntry {
  sessionId: string;
  username: string;
  color: string;
  lastSeenAt: number;
  nodeId?: string;
}

export interface PresenceHeartbeat {
  username: string;
  nodeId?: string;
}

export const PRESENCE_TTL_MS = 60_000;

type PageKey = string;
const rooms = new Map<PageKey, Map<string, PresenceEntry>>();

function pageKey(siteId: string, pageId: string): PageKey {
  return `${siteId}:${pageId}`;
}

/**
 * Deterministic HSL hue derived from a djb2-style hash of the username.
 * Keeps avatar colors stable per user across reloads.
 */
export function colorForUsername(username: string): string {
  let hash = 5381;
  for (let i = 0; i < username.length; i += 1) {
    hash = ((hash << 5) + hash + username.charCodeAt(i)) >>> 0;
  }
  const hue = hash % 360;
  return `hsl(${hue}, 65%, 48%)`;
}

function pruneRoom(room: Map<string, PresenceEntry>, now: number): void {
  for (const [sessionId, entry] of room) {
    if (now - entry.lastSeenAt > PRESENCE_TTL_MS) {
      room.delete(sessionId);
    }
  }
}

export function heartbeat(
  siteId: string,
  pageId: string,
  sessionId: string,
  meta: PresenceHeartbeat,
  now: number = Date.now(),
): PresenceEntry {
  const key = pageKey(siteId, pageId);
  let room = rooms.get(key);
  if (!room) {
    room = new Map();
    rooms.set(key, room);
  }
  pruneRoom(room, now);
  const entry: PresenceEntry = {
    sessionId,
    username: meta.username,
    color: colorForUsername(meta.username),
    lastSeenAt: now,
    nodeId: meta.nodeId,
  };
  room.set(sessionId, entry);
  return entry;
}

export function listActive(
  siteId: string,
  pageId: string,
  now: number = Date.now(),
): PresenceEntry[] {
  const room = rooms.get(pageKey(siteId, pageId));
  if (!room) return [];
  pruneRoom(room, now);
  return [...room.values()].sort((a, b) => b.lastSeenAt - a.lastSeenAt);
}

export function prune(now: number = Date.now()): void {
  for (const [key, room] of rooms) {
    pruneRoom(room, now);
    if (room.size === 0) rooms.delete(key);
  }
}

/** Test-only — reset module state between vitest cases. */
export function __resetPresenceStoreForTests(): void {
  rooms.clear();
}