/**
 * Rate limiting for builder APIs.
 *
 * Priority:
 * 1. BUILDER_RATE_LIMIT_BACKEND=isolated-qa → attested in-memory only
 * 2. Upstash Redis REST when fully configured
 * 3. production: Vercel Blob durable fallback when Upstash is missing or fails
 * 4. production: sanitized backend_unavailable if Blob is also missing/fails
 * 5. non-production: bounded in-memory fallback
 *
 * Blob fallback notes:
 * - Private blobs only (BLOB_READ_WRITE_TOKEN).
 * - Pathnames use a fixed-length SHA-256 of the rate-limit key, never raw IPs.
 * - Marker bodies are a non-empty fixed constant (Vercel Blob rejects empty body;
 *   never IP, key, token, or other secrets).
 * - list + put is not atomic under concurrency; overshoot is possible. This path is
 *   intentionally limited to authenticated builder mutation rate limiting as a
 *   durable production fallback, not a general-purpose atomic limiter.
 *
 * Limits:
 * - Publish: 10 per minute
 * - Asset upload: 30 per minute
 * - Draft autosave: 180 per minute
 * - General mutation: 60 per minute
 */

import { createHash, randomUUID } from 'crypto';
import { del, list, put } from '@vercel/blob';
import { getQaRuntimeAttestation } from '@/lib/builder/security/qa-runtime-attestation';

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();
const UPSTASH_TIMEOUT_MS = 1500;
/** Hard cap so the in-memory fallback can't grow unbounded under IP rotation. */
const STORE_CAP = 5000;

/** Private blob prefix for durable production rate-limit markers. */
const BLOB_RATE_PREFIX = 'builder/rate-limit/';
/** Max blobs returned per list page (bounded pagination). */
const BLOB_LIST_LIMIT = 100;
/** Max list pages inspected per check (hard bound). */
const BLOB_LIST_MAX_PAGES = 5;
/** Max expired markers deleted per check (best-effort bounded cleanup). */
const BLOB_CLEANUP_MAX_DELETES = 25;
const BLOB_TIMEOUT_MS = 2000;
/**
 * Non-empty Blob put body. Vercel Blob rejects empty bodies (`body is required`).
 * Fixed constant only — never raw IP, rate-limit key, token, or other secrets.
 */
export const BLOB_RATE_MARKER_BODY = '1';

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
  reason?: 'backend_unavailable';
}

function backendUnavailable(): RateLimitResult {
  return {
    allowed: false,
    remaining: 0,
    retryAfterMs: 0,
    reason: 'backend_unavailable',
  };
}

function allowsInMemoryFallback(): boolean {
  return process.env.NODE_ENV !== 'production';
}

export async function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): Promise<RateLimitResult> {
  if (process.env.BUILDER_RATE_LIMIT_BACKEND === 'isolated-qa') {
    try {
      const attestation = getQaRuntimeAttestation();
      if (
        !attestation
        || attestation.schemaVersion !== 3
        || attestation.state !== 'ready'
      ) {
        return backendUnavailable();
      }
      return checkInMemoryRateLimit(key, maxRequests, windowMs);
    } catch {
      return backendUnavailable();
    }
  }

  const upstash = resolveUpstashConfig();
  if (upstash) {
    try {
      return await checkUpstashRateLimit(upstash, key, maxRequests, windowMs);
    } catch {
      if (allowsInMemoryFallback()) {
        return checkInMemoryRateLimit(key, maxRequests, windowMs);
      }
      // production: Upstash failed → durable Blob fallback, then fail-closed
      return checkBlobRateLimitOrUnavailable(key, maxRequests, windowMs);
    }
  }

  if (allowsInMemoryFallback()) {
    return checkInMemoryRateLimit(key, maxRequests, windowMs);
  }

  // production: no Upstash → durable Blob fallback, then fail-closed
  return checkBlobRateLimitOrUnavailable(key, maxRequests, windowMs);
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

    const results: unknown = await response.json();
    if (
      !Array.isArray(results)
      || results.length < 4
      || results.slice(0, 4).some((item) => (
        !item
        || typeof item !== 'object'
        || !Object.prototype.hasOwnProperty.call(item, 'result')
        || Object.prototype.hasOwnProperty.call(item, 'error')
        || typeof (item as { result?: unknown }).result !== 'number'
        || !Number.isFinite((item as { result: number }).result)
        || (item as { result: number }).result < 0
      ))
    ) {
      throw new Error('upstash_rate_limit_invalid_response');
    }

    const countBefore = (results[1] as { result: number }).result;
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

function resolveBlobToken(): string | null {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  return token || null;
}

/** Fixed-length hash of the rate-limit key (never raw IP). */
export function hashRateLimitKey(key: string): string {
  return createHash('sha256').update(key, 'utf8').digest('hex');
}

function parseMarkerTimestamp(pathname: string): number | null {
  const base = pathname.split('/').pop() ?? '';
  const stamp = base.split('-')[0];
  if (!stamp || !/^\d+$/.test(stamp)) return null;
  const value = Number(stamp);
  return Number.isFinite(value) ? value : null;
}

/**
 * Durable production fallback using private Vercel Blob markers.
 * Not fully atomic under concurrent writers — see file header.
 */
async function checkBlobRateLimit(
  token: string,
  key: string,
  maxRequests: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const now = Date.now();
  const cutoff = now - windowMs;
  const keyHash = hashRateLimitKey(key);
  const prefix = `${BLOB_RATE_PREFIX}${keyHash}/`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), BLOB_TIMEOUT_MS);

  try {
    const inWindow: Array<{ pathname: string; ts: number }> = [];
    const expired: string[] = [];
    let cursor: string | undefined;
    let pages = 0;
    let incomplete = false;

    do {
      pages += 1;
      if (pages > BLOB_LIST_MAX_PAGES) {
        incomplete = true;
        break;
      }

      const page = await list({
        prefix,
        limit: BLOB_LIST_LIMIT,
        cursor,
        token,
        abortSignal: controller.signal,
      });

      if (!page || !Array.isArray(page.blobs)) {
        throw new Error('blob_rate_limit_invalid_list');
      }

      for (const blob of page.blobs) {
        if (!blob || typeof blob.pathname !== 'string') {
          throw new Error('blob_rate_limit_invalid_item');
        }
        const ts = parseMarkerTimestamp(blob.pathname);
        if (ts === null) {
          // Unparseable marker names are treated as backend failure (sanitized).
          throw new Error('blob_rate_limit_invalid_item');
        }
        if (ts > cutoff) {
          inWindow.push({ pathname: blob.pathname, ts });
        } else {
          expired.push(blob.pathname);
        }
      }

      cursor = page.hasMore ? page.cursor : undefined;
      if (page.hasMore && !cursor) {
        throw new Error('blob_rate_limit_invalid_list');
      }
    } while (cursor);

    // Bounded best-effort cleanup of expired markers (never unbounded delete).
    const toDelete = expired.slice(0, BLOB_CLEANUP_MAX_DELETES);
    if (toDelete.length > 0) {
      try {
        await del(toDelete, { token, abortSignal: controller.signal });
      } catch {
        // Cleanup is best-effort; rate decision still proceeds.
      }
    }

    // If listing was truncated, refuse to under-count (fail-closed).
    if (incomplete) {
      return backendUnavailable();
    }

    inWindow.sort((a, b) => a.ts - b.ts);

    if (inWindow.length >= maxRequests) {
      const oldest = inWindow[0]?.ts ?? now;
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: Math.max(0, oldest + windowMs - now),
      };
    }

    const markerName = `${now}-${randomUUID()}`;
    const pathname = `${prefix}${markerName}`;
    // Non-empty safe constant only — Vercel Blob rejects empty body; never IP/key/token.
    await put(pathname, BLOB_RATE_MARKER_BODY, {
      access: 'private',
      addRandomSuffix: false,
      contentType: 'text/plain',
      token,
      abortSignal: controller.signal,
    });

    return {
      allowed: true,
      remaining: Math.max(0, maxRequests - inWindow.length - 1),
      retryAfterMs: 0,
    };
  } finally {
    clearTimeout(timeout);
  }
}

async function checkBlobRateLimitOrUnavailable(
  key: string,
  maxRequests: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const token = resolveBlobToken();
  if (!token) return backendUnavailable();
  try {
    return await checkBlobRateLimit(token, key, maxRequests, windowMs);
  } catch {
    // Never surface Blob response/credential/raw upstream errors.
    return backendUnavailable();
  }
}

export function resetRateLimitStore(): void {
  store.clear();
}

// QA harnesses drive every browser mutation from one IP (127.0.0.1), so the
// per-IP buckets are env-tunable; production keeps the defaults.
function limitFromEnv(name: string, fallback: number): number {
  const raw = Number(process.env[name]);
  return Number.isFinite(raw) && raw > 0 ? Math.trunc(raw) : fallback;
}

export function checkPublishRateLimit(ip: string): Promise<RateLimitResult> {
  return checkRateLimit(`publish:${ip}`, limitFromEnv('BUILDER_PUBLISH_RATE_LIMIT', 10), 60_000);
}

export function checkAssetUploadRateLimit(ip: string): Promise<RateLimitResult> {
  return checkRateLimit(`asset:${ip}`, limitFromEnv('BUILDER_ASSET_RATE_LIMIT', 30), 60_000);
}

export function checkDraftSaveRateLimit(ip: string): Promise<RateLimitResult> {
  return checkRateLimit(`draft:${ip}`, limitFromEnv('BUILDER_DRAFT_RATE_LIMIT', 180), 60_000);
}

export function checkMutationRateLimit(ip: string): Promise<RateLimitResult> {
  return checkRateLimit(`mutation:${ip}`, limitFromEnv('BUILDER_MUTATION_RATE_LIMIT', 60), 60_000);
}
