import { randomBytes } from 'node:crypto';

import { usesBlobBookingStorage } from '@/lib/builder/bookings/storage';
import { createBlobVersionedJsonStore } from '@/lib/builder/storage/blob-cas';
import {
  PERSISTENCE_ERROR_CODES,
  PersistenceConflictError,
  PersistenceMissingError,
  isPersistenceError,
} from '@/lib/builder/storage/persistence-errors';
import type { VersionedJsonStore } from '@/lib/builder/storage/versioned-json-store';

/**
 * A short-lived, distributed lease for the interval between availability
 * checks and the booking write.  The owner token is deliberately opaque: it
 * is the capability required to release this particular acquisition.
 */
export interface SlotLockLease {
  readonly ownerToken: string;
  readonly keys: readonly string[];
  readonly expiresAt: number;
}

export interface SlotLockArgs {
  serviceId: string;
  staffId: string;
  startAt: string;
  resourceIds?: string[];
  /** Serialize updates for an existing booking while it is being changed. */
  bookingId?: string;
}

export interface SlotLockPersistedLease {
  format: 'booking-slot-lease-v1';
  ownerToken: string;
  expiresAt: number;
}

export interface CreateSlotLockManagerOptions {
  /**
   * Test seam and alternate durable backend.  Multiple managers can share a
   * store to model separate function instances deterministically.
   */
  store?: VersionedJsonStore<SlotLockPersistedLease>;
  now?: () => number;
  ttlMs?: number;
  createOwnerToken?: () => string;
}

export interface SlotLockManager {
  acquire(args: SlotLockArgs): Promise<SlotLockLease | null>;
  renew(lease: SlotLockLease): Promise<SlotLockLease | null>;
  release(lease: SlotLockLease): Promise<void>;
}

const LEASE_FORMAT = 'booking-slot-lease-v1' as const;
// Provider handoffs (for example Zoom) can take several seconds. Renewals
// bracket those calls, and this one-minute ceiling keeps normal handoffs from
// losing the availability→save lease while still bounding stale recovery.
const HOLD_MS = 60_000;
const BLOB_PREFIX = 'builder/bookings/slot-locks/';

function component(value: string): string {
  return encodeURIComponent(value);
}

/** Exported for focused tests and for callers that need to inspect lock scope. */
export function slotLockKeys(args: SlotLockArgs): string[] {
  const keys = [
    `slot:${component(args.serviceId)}|${component(args.staffId)}|${component(args.startAt)}`,
  ];
  const date = args.startAt.slice(0, 10);
  const resourceIds = Array.from(new Set(args.resourceIds ?? [])).sort();
  for (const resourceId of resourceIds) {
    keys.push(`resource:${component(resourceId)}|${component(date)}`);
  }
  if (args.bookingId) keys.push(`booking:${component(args.bookingId)}`);

  // Every multi-lock contender walks the same order.  This also makes the
  // partial-acquisition cleanup deterministic.
  return Array.from(new Set(keys)).sort();
}

function isUsablePersistedLease(
  value: unknown,
): value is SlotLockPersistedLease {
  if (value === null || typeof value !== 'object') return false;
  const lease = value as Partial<SlotLockPersistedLease>;
  return (
    lease.format === LEASE_FORMAT &&
    typeof lease.ownerToken === 'string' &&
    lease.ownerToken.length > 0 &&
    typeof lease.expiresAt === 'number' &&
    Number.isFinite(lease.expiresAt)
  );
}

function isConflict(error: unknown): boolean {
  return (
    error instanceof PersistenceConflictError ||
    (isPersistenceError(error) && error.code === PERSISTENCE_ERROR_CODES.CONFLICT)
  );
}

function createMemoryStore(): VersionedJsonStore<SlotLockPersistedLease> {
  const records = new Map<string, { value: SlotLockPersistedLease; version: string }>();
  let revision = 0;

  const nextVersion = () => `local-${++revision}`;
  return {
    async read(key) {
      const current = records.get(key);
      if (!current) throw new PersistenceMissingError('Slot lock is missing');
      return { value: { ...current.value }, version: current.version };
    },
    async create(key, value) {
      if (records.has(key)) throw new PersistenceConflictError('Slot lock exists');
      const version = nextVersion();
      records.set(key, { value: { ...value }, version });
      return { value: { ...value }, version };
    },
    async compareAndSet(key, expectedVersion, value) {
      const current = records.get(key);
      if (!current || current.version !== expectedVersion) {
        throw new PersistenceConflictError('Slot lock changed');
      }
      const version = nextVersion();
      records.set(key, { value: { ...value }, version });
      return { value: { ...value }, version };
    },
    async compareAndDelete(key, expectedVersion) {
      const current = records.get(key);
      if (!current || current.version !== expectedVersion) {
        throw new PersistenceConflictError('Slot lock changed');
      }
      records.delete(key);
    },
  };
}

function defaultStore(): VersionedJsonStore<SlotLockPersistedLease> {
  const token = process.env.BLOB_READ_WRITE_TOKEN?.trim();
  // Keep the lease backend aligned with booking persistence, including the
  // explicit local overrides used by development and isolated tests.
  if (!usesBlobBookingStorage() || !token) return localStore;

  return createBlobVersionedJsonStore<SlotLockPersistedLease>({
    pathnameForKey: (key) => `${BLOB_PREFIX}${encodeURIComponent(key)}.json`,
    token,
  });
}

const localStore = createMemoryStore();

function defaultOwnerToken(): string {
  return randomBytes(24).toString('base64url');
}

/**
 * Creates a lease manager.  Blob-backed managers use create-only writes,
 * ETag CAS for stale replacement, and compare-and-delete for release through
 * the VersionedJsonStore contract.  Without Blob credentials, the shared
 * in-process store remains safe for local development and unit tests.
 */
export function createSlotLockManager(
  options: CreateSlotLockManagerOptions = {},
): SlotLockManager {
  const store = options.store ?? defaultStore();
  const now = options.now ?? Date.now;
  const ttlMs = options.ttlMs ?? HOLD_MS;
  const createOwnerToken = options.createOwnerToken ?? defaultOwnerToken;

  const release = async (lease: SlotLockLease): Promise<void> => {
    if (!lease || typeof lease.ownerToken !== 'string' || !Array.isArray(lease.keys)) {
      return;
    }

    await Promise.all(
      lease.keys.map(async (key) => {
        try {
          const current = await store.read(key);
          // Reading before delete is intentional: a stale lease must never
          // remove a replacement owner's record.
          if (
            isUsablePersistedLease(current.value) &&
            current.value.ownerToken === lease.ownerToken
          ) {
            await store.compareAndDelete(key, current.version);
          }
        } catch {
          // Release is best-effort.  A conflict means a newer lease survived;
          // an unavailable backend will let the TTL expire instead.
        }
      }),
    );
  };

  return {
    async acquire(args) {
      if (!Number.isFinite(ttlMs) || ttlMs <= 0) return null;
      const acquiredAt = now();
      if (!Number.isFinite(acquiredAt)) return null;

      let ownerToken: string;
      try {
        ownerToken = createOwnerToken();
      } catch {
        return null;
      }
      if (!ownerToken) return null;

      const keys = slotLockKeys(args);
      const lease: SlotLockLease = {
        ownerToken,
        keys,
        expiresAt: acquiredAt + ttlMs,
      };
      const persisted: SlotLockPersistedLease = {
        format: LEASE_FORMAT,
        ownerToken,
        expiresAt: lease.expiresAt,
      };
      const acquiredKeys: string[] = [];

      for (const key of keys) {
        try {
          await store.create(key, persisted);
          acquiredKeys.push(key);
          continue;
        } catch (error) {
          if (!isConflict(error)) {
            await release({ ...lease, keys: acquiredKeys });
            return null;
          }
        }

        try {
          const current = await store.read(key);
          // A malformed persisted record is an unavailable lock, never a free
          // one.  Treat storage/decode problems the same fail-closed way.
          if (!isUsablePersistedLease(current.value) || current.value.expiresAt > acquiredAt) {
            await release({ ...lease, keys: acquiredKeys });
            return null;
          }
          await store.compareAndSet(key, current.version, persisted);
          acquiredKeys.push(key);
        } catch {
          await release({ ...lease, keys: acquiredKeys });
          return null;
        }
      }

      return lease;
    },
    async renew(lease) {
      if (!lease || typeof lease.ownerToken !== 'string' || !Array.isArray(lease.keys)) {
        return null;
      }
      const renewedAt = now();
      if (!Number.isFinite(renewedAt) || !Number.isFinite(ttlMs) || ttlMs <= 0) {
        return null;
      }
      const renewed: SlotLockLease = {
        ownerToken: lease.ownerToken,
        keys: lease.keys,
        expiresAt: renewedAt + ttlMs,
      };
      const persisted: SlotLockPersistedLease = {
        format: LEASE_FORMAT,
        ownerToken: renewed.ownerToken,
        expiresAt: renewed.expiresAt,
      };

      for (const key of renewed.keys) {
        try {
          const current = await store.read(key);
          // Do not revive an expired capability.  A contender may already be
          // attempting stale replacement, so the caller must acquire again.
          if (
            !isUsablePersistedLease(current.value) ||
            current.value.ownerToken !== renewed.ownerToken ||
            current.value.expiresAt <= renewedAt
          ) {
            return null;
          }
          await store.compareAndSet(key, current.version, persisted);
        } catch {
          // A CAS conflict or unavailable/malformed record means the caller
          // cannot prove exclusive ownership through its persistence write.
          return null;
        }
      }

      return renewed;
    },
    release,
  };
}

const defaultManager = createSlotLockManager();

/** Acquire an async lease; callers must release the returned lease in finally. */
export function acquireSlotLock(args: SlotLockArgs): Promise<SlotLockLease | null> {
  return defaultManager.acquire(args);
}

/** Releases only the owner represented by this exact lease capability. */
export function releaseSlotLock(lease: SlotLockLease): Promise<void> {
  return defaultManager.release(lease);
}

/** Extend an unexpired lease immediately before a slow downstream handoff/save. */
export function renewSlotLock(lease: SlotLockLease): Promise<SlotLockLease | null> {
  return defaultManager.renew(lease);
}
