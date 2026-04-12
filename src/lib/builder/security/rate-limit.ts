/**
 * Phase 6 P6-17 — Rate limiting for builder APIs.
 *
 * In-memory sliding window rate limiter. For production, replace
 * with Upstash Ratelimit or Vercel Edge Middleware.
 *
 * Limits:
 * - Publish: 10 per minute
 * - Asset upload: 30 per minute
 * - General mutation: 60 per minute
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

function cleanOld(entry: RateLimitEntry, windowMs: number): void {
  const cutoff = Date.now() - windowMs;
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

export function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): RateLimitResult {
  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  cleanOld(entry, windowMs);

  if (entry.timestamps.length >= maxRequests) {
    const oldest = entry.timestamps[0] || Date.now();
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: oldest + windowMs - Date.now(),
    };
  }

  entry.timestamps.push(Date.now());
  return {
    allowed: true,
    remaining: maxRequests - entry.timestamps.length,
    retryAfterMs: 0,
  };
}

export function checkPublishRateLimit(ip: string): RateLimitResult {
  return checkRateLimit(`publish:${ip}`, 10, 60_000);
}

export function checkAssetUploadRateLimit(ip: string): RateLimitResult {
  return checkRateLimit(`asset:${ip}`, 30, 60_000);
}

export function checkMutationRateLimit(ip: string): RateLimitResult {
  return checkRateLimit(`mutation:${ip}`, 60, 60_000);
}
