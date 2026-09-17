import { createHash } from 'node:crypto';
import { z } from 'zod';
import {
  BlobPreconditionFailedError,
  del as blobDel,
  get as blobGet,
  put as blobPut,
} from '@vercel/blob';
import {
  AI_INTAKE_BACKEND_TIMEOUT_MS,
  AI_INTAKE_BLOB_PREFIX,
  AI_INTAKE_CLAIM_RECORD_VERSION,
  AI_INTAKE_CLAIM_TTL_MS,
  AI_INTAKE_INTAKE_ID_PATTERN,
  AI_INTAKE_MEMORY_CLAIM_CAP,
  AI_INTAKE_SHA256_HEX_PATTERN,
  AI_INTAKE_UPSTASH_KEY_PREFIX,
} from '@/lib/ai-intake/constants';
import { aiIntakeNowMs } from '@/lib/ai-intake/clock';
import {
  applyAiIntakeClaimUpdate,
  compareAiIntakeDigest,
  isAiIntakeClaimExpired,
  type AiIntakeClaimRecord,
  type AiIntakeFailureClass,
} from '@/lib/ai-intake/claim-state';
import {
  aiIntakeUpstashCommand,
  aiIntakeUpstashEval,
  resolveAiIntakeUpstash,
  type AiIntakeUpstashConfig,
} from '@/lib/ai-intake/upstash';
import type { AiIntakeDeliveryStatus } from '@/lib/ai-intake/schemas';

export type { AiIntakeClaimRecord, AiIntakeFailureClass };

export type AiIntakeClaimOutcome =
  | { type: 'acquired'; record: AiIntakeClaimRecord }
  | { type: 'duplicate'; record: AiIntakeClaimRecord }
  | { type: 'conflict' }
  | { type: 'unavailable' };

export type AiIntakeClaimLookupOutcome =
  | { type: 'found'; record: AiIntakeClaimRecord }
  | { type: 'absent' }
  | { type: 'unavailable' };

export type AiIntakeClaimUpdateOutcome = 'updated' | 'missing' | 'conflict' | 'unavailable';

export interface AiIntakeClaimStore {
  lookup(input: {
    clientId: string;
    idempotencyKey: string;
  }): Promise<AiIntakeClaimLookupOutcome>;
  claim(input: {
    clientId: string;
    idempotencyKey: string;
    intakeId: string;
    digest: string;
  }): Promise<AiIntakeClaimOutcome>;
  update(input: {
    clientId: string;
    idempotencyKey: string;
    digest: string;
    status: Exclude<AiIntakeDeliveryStatus, 'sending'>;
    failureClass?: AiIntakeFailureClass;
  }): Promise<AiIntakeClaimUpdateOutcome>;
}

export const AI_INTAKE_CLAIM_UPDATE_LUA = `
local raw = redis.call('GET', KEYS[1])
if not raw then
  return 'missing'
end
local ok, existing = pcall(cjson.decode, raw)
if not ok or type(existing) ~= 'table' then
  return 'unavailable'
end
if existing['digest'] ~= ARGV[1] then
  return 'conflict'
end
local status = existing['status']
if status == 'sent' or status == 'failed_unknown' then
  return 'conflict'
end
if status ~= 'sending' then
  return 'conflict'
end
existing['status'] = ARGV[2]
existing['updatedAt'] = ARGV[3]
if ARGV[4] ~= '' then
  existing['failureClass'] = ARGV[4]
else
  existing['failureClass'] = nil
end
local encoded = cjson.encode(existing)
local ttl = redis.call('PTTL', KEYS[1])
if type(ttl) ~= 'number' or ttl <= 0 then
  ttl = tonumber(ARGV[5])
end
if not ttl or ttl <= 0 then
  ttl = tonumber(ARGV[5])
end
redis.call('SET', KEYS[1], encoded, 'PX', ttl)
return 'updated'
`.trim();

const claimRecordSchema = z
  .object({
    v: z.literal(AI_INTAKE_CLAIM_RECORD_VERSION),
    intakeId: z.string().regex(AI_INTAKE_INTAKE_ID_PATTERN),
    digest: z.string().regex(AI_INTAKE_SHA256_HEX_PATTERN),
    status: z.enum(['sending', 'sent', 'failed_unknown']),
    createdAt: z.string().min(20).max(40),
    updatedAt: z.string().min(20).max(40),
    failureClass: z.enum(['delivery_unknown', 'state_update_unknown']).optional(),
  })
  .strict();

let injectedStore: AiIntakeClaimStore | null = null;
const memoryClaims = new Map<string, { record: AiIntakeClaimRecord; etag: string }>();
const memoryLocks = new Map<string, Promise<void>>();

export function setAiIntakeClaimStoreForTests(store: AiIntakeClaimStore | null): void {
  injectedStore = store;
}

export function resetAiIntakeClaimStoreForTests(): void {
  injectedStore = null;
  memoryClaims.clear();
  memoryLocks.clear();
}

export function aiIntakeMemoryClaimCountForTests(): number {
  return memoryClaims.size;
}

export function aiIntakeMemoryLockCountForTests(): number {
  return memoryLocks.size;
}

export function hashAiIntakeClaimKey(clientId: string, idempotencyKey: string): string {
  return createHash('sha256').update(`${clientId}\n${idempotencyKey}`, 'utf8').digest('hex');
}

function parseRecord(raw: unknown): AiIntakeClaimRecord | null {
  const parsed = claimRecordSchema.safeParse(raw);
  return parsed.success ? parsed.data : null;
}

function newSendingRecord(input: { intakeId: string; digest: string }, now: number): AiIntakeClaimRecord {
  const timestamp = new Date(now).toISOString();
  return {
    v: AI_INTAKE_CLAIM_RECORD_VERSION,
    intakeId: input.intakeId,
    digest: input.digest,
    status: 'sending',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

async function withMemoryLock<T>(key: string, task: () => Promise<T>): Promise<T> {
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

function pruneExpiredMemory(now: number): void {
  for (const [key, entry] of memoryClaims) {
    if (isAiIntakeClaimExpired(entry.record, now)) memoryClaims.delete(key);
  }
}

const memoryStore: AiIntakeClaimStore = {
  async lookup(input) {
    const key = hashAiIntakeClaimKey(input.clientId, input.idempotencyKey);
    return withMemoryLock(key, async () => {
      const existing = memoryClaims.get(key);
      if (!existing) return { type: 'absent' };
      if (isAiIntakeClaimExpired(existing.record, aiIntakeNowMs())) return { type: 'absent' };
      return { type: 'found', record: existing.record };
    });
  },
  async claim(input) {
    const key = hashAiIntakeClaimKey(input.clientId, input.idempotencyKey);
    return withMemoryLock(key, async () => {
      const now = aiIntakeNowMs();
      const existing = memoryClaims.get(key);
      if (existing && !isAiIntakeClaimExpired(existing.record, now)) {
        if (!compareAiIntakeDigest(existing.record.digest, input.digest)) return { type: 'conflict' };
        return { type: 'duplicate', record: existing.record };
      }
      pruneExpiredMemory(now);
      if (memoryClaims.size >= AI_INTAKE_MEMORY_CLAIM_CAP) {
        return { type: 'unavailable' };
      }
      const record = newSendingRecord(input, now);
      memoryClaims.set(key, { record, etag: `mem-${now}` });
      return { type: 'acquired', record };
    });
  },
  async update(input) {
    const key = hashAiIntakeClaimKey(input.clientId, input.idempotencyKey);
    return withMemoryLock(key, async () => {
      const existing = memoryClaims.get(key);
      if (!existing) return 'missing';
      const now = aiIntakeNowMs();
      const applied = applyAiIntakeClaimUpdate(existing.record, input, now);
      if (applied.type === 'missing') {
        memoryClaims.delete(key);
        return 'missing';
      }
      if (applied.type === 'conflict') return 'conflict';
      memoryClaims.set(key, { record: applied.record, etag: `mem-${now}` });
      return 'updated';
    });
  },
};

function resolveBlobToken(): string | null {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim() || null;
}

function allowsMemory(): boolean {
  return process.env.NODE_ENV !== 'production';
}

function parseUpdateOutcome(result: unknown): AiIntakeClaimUpdateOutcome | null {
  if (result === 'updated' || result === 'missing' || result === 'conflict' || result === 'unavailable') {
    return result;
  }
  return null;
}

async function setNxClaim(
  config: AiIntakeUpstashConfig,
  key: string,
  record: AiIntakeClaimRecord,
) {
  return aiIntakeUpstashCommand(config, [
    'SET',
    key,
    JSON.stringify(record),
    'NX',
    'PX',
    String(AI_INTAKE_CLAIM_TTL_MS),
  ]);
}

function classifyExistingClaim(
  raw: unknown,
  digest: string,
): AiIntakeClaimOutcome {
  if (typeof raw !== 'string') return { type: 'unavailable' };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { type: 'unavailable' };
  }
  const existing = parseRecord(parsed);
  if (!existing) return { type: 'unavailable' };
  if (!compareAiIntakeDigest(existing.digest, digest)) return { type: 'conflict' };
  return { type: 'duplicate', record: existing };
}

function classifyLookupRecord(raw: unknown): AiIntakeClaimLookupOutcome {
  if (raw === null) return { type: 'absent' };
  if (typeof raw !== 'string') return { type: 'unavailable' };
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { type: 'unavailable' };
  }
  const existing = parseRecord(parsed);
  if (!existing) return { type: 'unavailable' };
  return { type: 'found', record: existing };
}

const upstashStore: AiIntakeClaimStore = {
  async lookup(input) {
    const config = resolveAiIntakeUpstash();
    if (!config) return { type: 'unavailable' };
    const key = `${AI_INTAKE_UPSTASH_KEY_PREFIX}${hashAiIntakeClaimKey(input.clientId, input.idempotencyKey)}`;
    const got = await aiIntakeUpstashCommand(config, ['GET', key]);
    if (!got.ok) return { type: 'unavailable' };
    return classifyLookupRecord(got.result);
  },
  async claim(input) {
    const config = resolveAiIntakeUpstash();
    if (!config) return { type: 'unavailable' };
    const key = `${AI_INTAKE_UPSTASH_KEY_PREFIX}${hashAiIntakeClaimKey(input.clientId, input.idempotencyKey)}`;
    const firstRecord = newSendingRecord(input, aiIntakeNowMs());
    const firstSet = await setNxClaim(config, key, firstRecord);
    if (!firstSet.ok) return { type: 'unavailable' };
    if (firstSet.result === 'OK') return { type: 'acquired', record: firstRecord };
    if (firstSet.result !== null) return { type: 'unavailable' };

    const getResult = await aiIntakeUpstashCommand(config, ['GET', key]);
    if (!getResult.ok) return { type: 'unavailable' };
    if (getResult.result === null) {
      const retryRecord = newSendingRecord(input, aiIntakeNowMs());
      const secondSet = await setNxClaim(config, key, retryRecord);
      if (!secondSet.ok) return { type: 'unavailable' };
      if (secondSet.result === 'OK') return { type: 'acquired', record: retryRecord };
      return { type: 'unavailable' };
    }
    return classifyExistingClaim(getResult.result, input.digest);
  },
  async update(input) {
    const config = resolveAiIntakeUpstash();
    if (!config) return 'unavailable';
    const key = `${AI_INTAKE_UPSTASH_KEY_PREFIX}${hashAiIntakeClaimKey(input.clientId, input.idempotencyKey)}`;
    const evaluated = await aiIntakeUpstashEval(
      config,
      AI_INTAKE_CLAIM_UPDATE_LUA,
      [key],
      [
        input.digest,
        input.status,
        new Date(aiIntakeNowMs()).toISOString(),
        input.failureClass ?? '',
        AI_INTAKE_CLAIM_TTL_MS,
      ],
    );
    if (!evaluated.ok) return 'unavailable';
    if (evaluated.result === null) return 'unavailable';
    return parseUpdateOutcome(evaluated.result) ?? 'unavailable';
  },
};

type BlobReadOutcome =
  | { type: 'found'; record: AiIntakeClaimRecord; etag: string }
  | { type: 'absent' }
  | { type: 'unavailable' };

function isDefiniteBlobNotFound(item: unknown): boolean {
  if (item === null) return true;
  if (!item || typeof item !== 'object') return false;
  const status = (item as { statusCode?: unknown }).statusCode;
  return status === 404;
}

function isUsableBlobEtag(value: unknown): value is string {
  return typeof value === 'string'
    && value.length > 0
    && value.length <= 1_024
    && value === value.trim()
    && !/[\u0000-\u001f\u007f]/.test(value);
}

async function readBlobRecordDetailed(
  pathname: string,
  token: string,
): Promise<BlobReadOutcome> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_INTAKE_BACKEND_TIMEOUT_MS);
  try {
    const item = await blobGet(pathname, {
      access: 'private',
      useCache: false,
      token,
      abortSignal: controller.signal,
    });
    if (isDefiniteBlobNotFound(item)) return { type: 'absent' };
    if (!item || item.statusCode !== 200 || !item.stream) return { type: 'unavailable' };
    const etag = (item as { blob?: { etag?: unknown } }).blob?.etag;
    if (!isUsableBlobEtag(etag)) return { type: 'unavailable' };
    const text = await new Response(item.stream as ReadableStream<Uint8Array>).text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      return { type: 'unavailable' };
    }
    const record = parseRecord(parsed);
    if (!record) return { type: 'unavailable' };
    return { type: 'found', record, etag };
  } catch {
    return { type: 'unavailable' };
  } finally {
    clearTimeout(timeout);
  }
}

async function readBlobRecord(
  pathname: string,
  token: string,
): Promise<{ record: AiIntakeClaimRecord; etag: string } | null> {
  const result = await readBlobRecordDetailed(pathname, token);
  if (result.type === 'found') return { record: result.record, etag: result.etag };
  return null;
}

async function putBlobRecord(
  pathname: string,
  record: AiIntakeClaimRecord,
  token: string,
  options: { allowOverwrite: boolean; ifMatch?: string },
): Promise<'ok' | 'conflict' | 'unavailable'> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), AI_INTAKE_BACKEND_TIMEOUT_MS);
  try {
    await blobPut(pathname, JSON.stringify(record), {
      access: 'private',
      allowOverwrite: options.allowOverwrite,
      addRandomSuffix: false,
      contentType: 'application/json',
      ifMatch: options.ifMatch,
      token,
      abortSignal: controller.signal,
    });
    return 'ok';
  } catch (error) {
    if (error instanceof BlobPreconditionFailedError) return 'conflict';
    return 'unavailable';
  } finally {
    clearTimeout(timeout);
  }
}

async function deleteExpiredBlob(pathname: string, token: string, etag: string): Promise<void> {
  const controller = new AbortController();
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    const timedOut = new Promise<void>((resolve) => {
      timeout = setTimeout(() => {
        controller.abort();
        resolve();
      }, AI_INTAKE_BACKEND_TIMEOUT_MS);
    });
    const deletion = blobDel(pathname, {
      token,
      ifMatch: etag,
      abortSignal: controller.signal,
    }).catch(() => undefined);
    await Promise.race([deletion, timedOut]);
  } catch {
    // Best-effort expiry cleanup. Logical expiry still holds.
  } finally {
    if (timeout !== undefined) clearTimeout(timeout);
  }
}

const blobStore: AiIntakeClaimStore = {
  async lookup(input) {
    const token = resolveBlobToken();
    if (!token) return { type: 'unavailable' };
    const pathname = `${AI_INTAKE_BLOB_PREFIX}${hashAiIntakeClaimKey(input.clientId, input.idempotencyKey)}.json`;
    const result = await readBlobRecordDetailed(pathname, token);
    if (result.type === 'found') {
      if (isAiIntakeClaimExpired(result.record, aiIntakeNowMs())) {
        await deleteExpiredBlob(pathname, token, result.etag);
        return { type: 'absent' };
      }
      return { type: 'found', record: result.record };
    }
    if (result.type === 'absent') return { type: 'absent' };
    return { type: 'unavailable' };
  },
  async claim(input) {
    const token = resolveBlobToken();
    if (!token) return { type: 'unavailable' };
    const pathname = `${AI_INTAKE_BLOB_PREFIX}${hashAiIntakeClaimKey(input.clientId, input.idempotencyKey)}.json`;
    const now = aiIntakeNowMs();
    const record = newSendingRecord(input, now);
    const created = await putBlobRecord(pathname, record, token, { allowOverwrite: false });
    if (created === 'ok') return { type: 'acquired', record };
    const existing = await readBlobRecord(pathname, token);
    if (!existing) return { type: 'unavailable' };
    if (isAiIntakeClaimExpired(existing.record, now)) {
      const replaced = await putBlobRecord(pathname, record, token, {
        allowOverwrite: true,
        ifMatch: existing.etag,
      });
      if (replaced === 'ok') return { type: 'acquired', record };
      if (replaced === 'conflict') {
        const latest = await readBlobRecord(pathname, token);
        if (!latest) return { type: 'unavailable' };
        if (isAiIntakeClaimExpired(latest.record, now)) return { type: 'unavailable' };
        if (!compareAiIntakeDigest(latest.record.digest, input.digest)) return { type: 'conflict' };
        return { type: 'duplicate', record: latest.record };
      }
      return { type: 'unavailable' };
    }
    if (!compareAiIntakeDigest(existing.record.digest, input.digest)) return { type: 'conflict' };
    return { type: 'duplicate', record: existing.record };
  },
  async update(input) {
    const token = resolveBlobToken();
    if (!token) return 'unavailable';
    const pathname = `${AI_INTAKE_BLOB_PREFIX}${hashAiIntakeClaimKey(input.clientId, input.idempotencyKey)}.json`;
    const read = await readBlobRecordDetailed(pathname, token);
    if (read.type === 'absent') return 'missing';
    if (read.type === 'unavailable') return 'unavailable';
    const existing = { record: read.record, etag: read.etag };
    const now = aiIntakeNowMs();
    const applied = applyAiIntakeClaimUpdate(existing.record, input, now);
    if (applied.type === 'missing') {
      await deleteExpiredBlob(pathname, token, existing.etag);
      return 'missing';
    }
    if (applied.type === 'conflict') return 'conflict';
    const written = await putBlobRecord(pathname, applied.record, token, {
      allowOverwrite: true,
      ifMatch: existing.etag,
    });
    if (written === 'ok') return 'updated';
    if (written === 'conflict') return 'conflict';
    return 'unavailable';
  },
};

export function getAiIntakeClaimStore(): AiIntakeClaimStore | null {
  if (injectedStore) return injectedStore;
  if (resolveAiIntakeUpstash()) return upstashStore;
  if (resolveBlobToken()) return blobStore;
  if (allowsMemory()) return memoryStore;
  return null;
}
