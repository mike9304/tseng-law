/**
 * Rate limiting for builder APIs.
 *
 * Uses Upstash Redis REST when UPSTASH_REDIS_REST_URL and
 * UPSTASH_REDIS_REST_TOKEN are present. Local review and tests keep the
 * existing in-memory sliding window fallback.
 *
 * Limits:
 * - Publish: 10 per minute
 * - Asset upload: 30 per minute
 * - General mutation: 60 per minute
 */

import { randomUUID } from 'crypto';

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();
const UPSTASH_TIMEOUT_MS = 1500;
/** Hard cap so the in-memory fallback can't grow unbounded under IP rotation. */
const STORE_CAP = 5000;

function cleanOld(entry: RateLimitEntry, windowMs: number): void {
  const cutoff = Date.now() - windowMs;
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
}

function pruneStoreIfFull(): void {
  if (store.size < STORE_CAP) return;
  // Evict oldest insertion-order entries (Map preserves insertion order).
  const toDrop = Math.ceil(STORE_CAP * 0.1);
  let i = 0;
  for (const key of store.keys()) {
    if (i++ >= toDrop) break;
    store.delete(key);
  }
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const upstash = resolveUpstashConfig();
  if (upstash) {
    try {
      return await checkUpstashRateLimit(upstash, key, maxRequests, windowMs);
    } catch {
      return checkInMemoryRateLimit(key, maxRequests, windowMs);
    }
  }

  return checkInMemoryRateLimit(key, maxRequests, windowMs);
}

function checkInMemoryRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): RateLimitResult {
  let entry = store.get(key);
  if (!entry) {
    pruneStoreIfFull();
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

interface UpstashConfig {
  token: string;
  url: string;
}

function resolveUpstashConfig(): UpstashConfig | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;
  return { url: url.replace(/\/+$/, ''), token };
}

async function checkUpstashRateLimit(
  config: UpstashConfig,
  key: string,
  maxRequests: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const now = Date.now();
  const redisKey = `builder:rate:${key}`;
  const member = `${now}:${randomUUID()}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPSTASH_TIMEOUT_MS);

  try {
    const response = await fetch(`${config.url}/pipeline`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        ['ZREMRANGEBYSCORE', redisKey, 0, now - windowMs],
        ['ZCARD', redisKey],
        ['ZADD', redisKey, now, member],
        ['PEXPIRE', redisKey, windowMs],
      ]),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error('upstash_rate_limit_failed');
    }

    const results = await response.json() as Array<{ result?: unknown }>;
    const countBefore = Number(results[1]?.result ?? 0);
    if (countBefore >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: windowMs,
      };
    }

    return {
      allowed: true,
      remaining: Math.max(0, maxRequests - countBefore - 1),
      retryAfterMs: 0,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export function resetRateLimitStore(): void {
  store.clear();
}

export function checkPublishRateLimit(ip: string): Promise<RateLimitResult> {
  return checkRateLimit(`publish:${ip}`, 10, 60_000);
}

export function checkAssetUploadRateLimit(ip: string): Promise<RateLimitResult> {
  return checkRateLimit(`asset:${ip}`, 30, 60_000);
}

export function checkMutationRateLimit(ip: string): Promise<RateLimitResult> {
  return checkRateLimit(`mutation:${ip}`, 60, 60_000);
}
