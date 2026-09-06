import { createHash, randomUUID } from 'node:crypto';
import { AI_INTAKE_MEMORY_RATE_CAP, AI_INTAKE_RATE_LIMITS, AI_INTAKE_RATE_WINDOW_MS, AI_INTAKE_UPSTASH_RATE_KEY_PREFIX } from '@/lib/ai-intake/constants';
import { aiIntakeNowMs } from '@/lib/ai-intake/clock';
import type { AiIntakeClient } from '@/lib/ai-intake/auth';
import type { AiIntakeRateDecision } from '@/lib/ai-intake/rate-limit';
import { aiIntakeUpstashEval, resolveAiIntakeUpstash } from '@/lib/ai-intake/upstash';

export const AI_INTAKE_SUBMIT_RATE_LUA = `
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local member = ARGV[4]
if not now or not window or not limit or not member then
  return {0, 0, -1}
end
redis.call('ZREMRANGEBYSCORE', KEYS[1], 0, now - window)
local count = redis.call('ZCARD', KEYS[1])
if count >= limit then
  local oldest = redis.call('ZRANGE', KEYS[1], 0, 0, 'WITHSCORES')
  local retry = window
  if type(oldest) == 'table' and oldest[2] then
    retry = tonumber(oldest[2]) + window - now
    if not retry or retry < 0 then retry = 0 end
  end
  return {0, count, retry}
end
redis.call('ZADD', KEYS[1], now, member)
redis.call('PEXPIRE', KEYS[1], window)
return {1, count + 1, 0}
`.trim();

type AtomicRateHit = {
  allowed: boolean;
  retryAfterMs: number;
  backendUnavailable?: boolean;
};

export interface AiIntakeSubmitRateLimiter {
  consume(key: string, max: number, windowMs: number, now: number): Promise<AtomicRateHit>;
}

const memoryWindows = new Map<string, number[]>();
const memoryLocks = new Map<string, Promise<void>>();
let injectedLimiter: AiIntakeSubmitRateLimiter | null = null;

export function setAiIntakeSubmitRateLimiterForTests(limiter: AiIntakeSubmitRateLimiter | null): void {
  injectedLimiter = limiter;
}

export function resetAiIntakeSubmitRateLimiterForTests(): void {
  injectedLimiter = null;
  memoryWindows.clear();
  memoryLocks.clear();
}

export function aiIntakeSubmitRateMemoryLockCountForTests(): number {
  return memoryLocks.size;
}

async function withMemoryLock<T>(key: string, task: () => Promise<T> | T): Promise<T> {
  const previous = memoryLocks.get(key) ?? Promise.resolve();
  let release!: () => void;
  const next = new Promise<void>((resolve) => {
    release = resolve;
  });
  const queued = previous.then(() => next);
  memoryLocks.set(key, queued);
  await previous;
  try {
    return await task();
  } finally {
    release();
    if (memoryLocks.get(key) === queued) memoryLocks.delete(key);
  }
}

function pruneMemory(): void {
  if (memoryWindows.size < AI_INTAKE_MEMORY_RATE_CAP) return;
  const toDrop = Math.ceil(AI_INTAKE_MEMORY_RATE_CAP * 0.1);
  let i = 0;
  for (const key of memoryWindows.keys()) {
    if (i++ >= toDrop) break;
    memoryWindows.delete(key);
  }
}

const memoryLimiter: AiIntakeSubmitRateLimiter = {
  async consume(key, max, windowMs, now) {
    return withMemoryLock(key, () => {
      let hits = memoryWindows.get(key);
      if (!hits) {
        pruneMemory();
        hits = [];
        memoryWindows.set(key, hits);
      }
      const cutoff = now - windowMs;
      const kept = hits.filter((stamp) => stamp > cutoff);
      memoryWindows.set(key, kept);
      if (kept.length >= max) {
        const oldest = kept[0] ?? now;
        return {
          allowed: false,
          retryAfterMs: Math.max(0, oldest + windowMs - now),
        };
      }
      kept.push(now);
      return { allowed: true, retryAfterMs: 0 };
    });
  },
};

function hashedRateKey(dimension: 'client' | 'ip', value: string): string {
  const digest = createHash('sha256').update(value, 'utf8').digest('hex');
  return `${AI_INTAKE_UPSTASH_RATE_KEY_PREFIX}${dimension}:${digest}`;
}

function parseLuaHit(result: unknown): AtomicRateHit | null {
  if (!Array.isArray(result) || result.length < 3) return null;
  const allowedRaw = result[0];
  const retryRaw = result[2];
  const allowedNum = typeof allowedRaw === 'number' ? allowedRaw : Number(allowedRaw);
  const retryNum = typeof retryRaw === 'number' ? retryRaw : Number(retryRaw);
  if (!Number.isFinite(allowedNum) || !Number.isFinite(retryNum)) return null;
  if (retryNum < 0) return { allowed: false, retryAfterMs: 0, backendUnavailable: true };
  return {
    allowed: allowedNum === 1,
    retryAfterMs: Math.max(0, retryNum),
  };
}

const upstashLimiter: AiIntakeSubmitRateLimiter = {
  async consume(key, max, windowMs, now) {
    const config = resolveAiIntakeUpstash();
    if (!config) return { allowed: false, retryAfterMs: 0, backendUnavailable: true };
    const member = `${now}:${randomUUID()}`;
    const evaluated = await aiIntakeUpstashEval(
      config,
      AI_INTAKE_SUBMIT_RATE_LUA,
      [key],
      [now, windowMs, max, member],
    );
    if (!evaluated.ok) return { allowed: false, retryAfterMs: 0, backendUnavailable: true };
    const parsed = parseLuaHit(evaluated.result);
    if (!parsed) return { allowed: false, retryAfterMs: 0, backendUnavailable: true };
    if (parsed.backendUnavailable) return parsed;
    return parsed;
  },
};

function resolveLimiter(): AiIntakeSubmitRateLimiter | null {
  if (injectedLimiter) return injectedLimiter;
  if (resolveAiIntakeUpstash()) return upstashLimiter;
  if (process.env.NODE_ENV !== 'production') return memoryLimiter;
  return null;
}

function worseDecision(a: AtomicRateHit, b: AtomicRateHit): AtomicRateHit {
  if (a.backendUnavailable) return a;
  if (b.backendUnavailable) return b;
  if (!a.allowed && !b.allowed) return a.retryAfterMs >= b.retryAfterMs ? a : b;
  if (!a.allowed) return a;
  if (!b.allowed) return b;
  return a;
}

export async function enforceAiIntakeSubmitRateLimit(input: {
  client: AiIntakeClient;
  ip: string;
}): Promise<AiIntakeRateDecision> {
  const limiter = resolveLimiter();
  if (!limiter) {
    return { allowed: false, kind: 'backend_unavailable' };
  }

  const clientMax = input.client.limits?.submitMax ?? AI_INTAKE_RATE_LIMITS.submit.client;
  const now = aiIntakeNowMs();
  try {
    const [clientHit, ipHit] = await Promise.all([
      limiter.consume(hashedRateKey('client', input.client.clientId), clientMax, AI_INTAKE_RATE_WINDOW_MS, now),
      limiter.consume(hashedRateKey('ip', input.ip), AI_INTAKE_RATE_LIMITS.submit.ip, AI_INTAKE_RATE_WINDOW_MS, now),
    ]);
    const result = worseDecision(clientHit, ipHit);
    if (result.backendUnavailable) {
      return { allowed: false, kind: 'backend_unavailable' };
    }
    if (!result.allowed) {
      return {
        allowed: false,
        kind: 'throttled',
        retryAfterSeconds: Math.max(1, Math.ceil(result.retryAfterMs / 1000)),
      };
    }
    return { allowed: true };
  } catch {
    return { allowed: false, kind: 'backend_unavailable' };
  }
}
