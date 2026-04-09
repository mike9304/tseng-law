/**
 * In-memory sliding-window rate limiter for consultation APIs.
 * Limits by IP and sessionId independently.
 *
 * - Chat API: max 15 requests per 60 seconds per IP
 * - Submit API: max 3 requests per 300 seconds per sessionId
 */

interface WindowEntry {
  timestamps: number[];
}

const chatByIp = new Map<string, WindowEntry>();
const submitBySession = new Map<string, WindowEntry>();

const CHAT_WINDOW_MS = 60_000;
const CHAT_MAX_REQUESTS = 15;

const SUBMIT_WINDOW_MS = 300_000;
const SUBMIT_MAX_REQUESTS = 3;

// Cleanup stale entries every 5 minutes
const CLEANUP_INTERVAL_MS = 300_000;

function pruneWindow(entry: WindowEntry, windowMs: number, now: number): number[] {
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);
  return entry.timestamps;
}

function checkLimit(
  store: Map<string, WindowEntry>,
  key: string,
  windowMs: number,
  maxRequests: number,
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  let entry = store.get(key);

  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  pruneWindow(entry, windowMs, now);

  if (entry.timestamps.length >= maxRequests) {
    const oldest = entry.timestamps[0]!;
    const retryAfterMs = windowMs - (now - oldest);
    return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 1000) };
  }

  entry.timestamps.push(now);
  return { allowed: true, retryAfterMs: 0 };
}

export function checkChatRateLimit(ip: string): { allowed: boolean; retryAfterMs: number } {
  return checkLimit(chatByIp, ip, CHAT_WINDOW_MS, CHAT_MAX_REQUESTS);
}

export function checkSubmitRateLimit(sessionId: string): { allowed: boolean; retryAfterMs: number } {
  return checkLimit(submitBySession, sessionId, SUBMIT_WINDOW_MS, SUBMIT_MAX_REQUESTS);
}

// Periodically clean up expired entries to prevent memory leak
function cleanup() {
  const now = Date.now();
  for (const [key, entry] of chatByIp) {
    pruneWindow(entry, CHAT_WINDOW_MS, now);
    if (entry.timestamps.length === 0) chatByIp.delete(key);
  }
  for (const [key, entry] of submitBySession) {
    pruneWindow(entry, SUBMIT_WINDOW_MS, now);
    if (entry.timestamps.length === 0) submitBySession.delete(key);
  }
}

if (typeof globalThis !== 'undefined') {
  const g = globalThis as unknown as { _consultationRateLimitCleanup?: ReturnType<typeof setInterval> };
  if (!g._consultationRateLimitCleanup) {
    g._consultationRateLimitCleanup = setInterval(cleanup, CLEANUP_INTERVAL_MS);
    if (g._consultationRateLimitCleanup.unref) {
      g._consultationRateLimitCleanup.unref();
    }
  }
}
