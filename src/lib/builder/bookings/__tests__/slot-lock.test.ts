import { BlobNotFoundError, BlobPreconditionFailedError } from '@vercel/blob';
import { describe, expect, it } from 'vitest';

import {
  createSlotLockManager,
  slotLockKeys,
} from '@/lib/builder/bookings/slot-lock';
import type { SlotLockPersistedLease } from '@/lib/builder/bookings/slot-lock';
import type { BlobCasClient } from '@/lib/builder/storage/blob-cas';
import { createBlobVersionedJsonStore } from '@/lib/builder/storage/blob-cas';

function stream(body: string): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(body));
      controller.close();
    },
  });
}

/** A shared exact-path Blob simulation with create-only and ETag CAS rules. */
class AtomicBlobStore implements BlobCasClient {
  readonly records = new Map<string, { body: string; etag: string }>();
  private sequence = 0;

  async get(pathname: string) {
    const current = this.records.get(pathname);
    if (!current) return null;
    return {
      statusCode: 200 as const,
      stream: stream(current.body),
      blob: { etag: current.etag },
    };
  }

  async put(
    pathname: string,
    body: string,
    options: Parameters<BlobCasClient['put']>[2],
  ) {
    const current = this.records.get(pathname);
    if (options.ifMatch !== undefined) {
      if (!current || current.etag !== options.ifMatch) {
        throw new BlobPreconditionFailedError();
      }
    } else if (!options.allowOverwrite && current) {
      throw new BlobPreconditionFailedError();
    }
    const etag = `etag-${++this.sequence}`;
    this.records.set(pathname, { body, etag });
    return { etag };
  }

  async del(
    pathname: string,
    options: Parameters<BlobCasClient['del']>[1],
  ): Promise<void> {
    const current = this.records.get(pathname);
    if (!current) throw new BlobNotFoundError();
    if (current.etag !== options.ifMatch) throw new BlobPreconditionFailedError();
    this.records.delete(pathname);
  }
}

function sharedStore(client: AtomicBlobStore) {
  let generation = 0;
  return createBlobVersionedJsonStore<SlotLockPersistedLease>({
    pathnameForKey: (key) => `locks/${encodeURIComponent(key)}.json`,
    client,
    randomId: () => (++generation).toString(16).padStart(32, '0'),
  });
}

const slot = {
  serviceId: 'svc-a',
  staffId: 'staff-a',
  startAt: '2099-01-05T00:00:00.000Z',
  resourceIds: ['room-b', 'room-a', 'room-a'],
};

describe('booking slot locks', () => {
  it('uses a stable slot, sorted resource/day, and optional booking key set', () => {
    expect(slotLockKeys({ ...slot, bookingId: 'booking-a' })).toEqual([
      'booking:booking-a',
      'resource:room-a|2099-01-05',
      'resource:room-b|2099-01-05',
      'slot:svc-a|staff-a|2099-01-05T00%3A00%3A00.000Z',
    ]);
  });

  it('allows only one of two managers sharing the same atomic Blob store to acquire', async () => {
    const client = new AtomicBlobStore();
    const first = createSlotLockManager({
      store: sharedStore(client),
      createOwnerToken: () => 'first-owner',
    });
    const second = createSlotLockManager({
      store: sharedStore(client),
      createOwnerToken: () => 'second-owner',
    });

    const [firstLease, secondLease] = await Promise.all([
      first.acquire(slot),
      second.acquire(slot),
    ]);

    expect([firstLease, secondLease].filter(Boolean)).toHaveLength(1);
    await Promise.all([
      firstLease ? first.release(firstLease) : Promise.resolve(),
      secondLease ? second.release(secondLease) : Promise.resolve(),
    ]);
  });

  it('replaces an expired lease with ETag CAS', async () => {
    const client = new AtomicBlobStore();
    let firstNow = 100;
    const first = createSlotLockManager({
      store: sharedStore(client),
      now: () => firstNow,
      ttlMs: 10,
      createOwnerToken: () => 'expired-owner',
    });
    const expired = await first.acquire(slot);
    expect(expired).not.toBeNull();

    const replacement = createSlotLockManager({
      store: sharedStore(client),
      now: () => 111,
      ttlMs: 10,
      createOwnerToken: () => 'replacement-owner',
    });
    const lease = await replacement.acquire(slot);

    expect(lease?.ownerToken).toBe('replacement-owner');
    firstNow = 200;
    await replacement.release(lease!);
  });

  it('treats a malformed persisted lease as unavailable rather than free', async () => {
    const client = new AtomicBlobStore();
    const store = sharedStore(client);
    const singleKeySlot = { ...slot, resourceIds: [] };
    await store.create(slotLockKeys(singleKeySlot)[0], {
      format: 'not-a-slot-lease',
      ownerToken: 'bad-owner',
      expiresAt: 0,
    } as never);

    const manager = createSlotLockManager({
      store,
      now: () => 100,
      createOwnerToken: () => 'new-owner',
    });
    expect(await manager.acquire(singleKeySlot)).toBeNull();
  });

  it('renews only an unexpired lease still owned across every lock key', async () => {
    const client = new AtomicBlobStore();
    let now = 100;
    const manager = createSlotLockManager({
      store: sharedStore(client),
      now: () => now,
      ttlMs: 10,
      createOwnerToken: () => 'renew-owner',
    });
    const lease = await manager.acquire(slot);
    expect(lease).not.toBeNull();

    now = 105;
    expect((await manager.renew(lease!))?.expiresAt).toBe(115);

    now = 116;
    expect(await manager.renew(lease!)).toBeNull();
  });

  it('does not let a stale owner release a replacement lease', async () => {
    const client = new AtomicBlobStore();
    const original = createSlotLockManager({
      store: sharedStore(client),
      now: () => 100,
      ttlMs: 10,
      createOwnerToken: () => 'original-owner',
    });
    const staleLease = await original.acquire(slot);
    expect(staleLease).not.toBeNull();

    const replacement = createSlotLockManager({
      store: sharedStore(client),
      now: () => 111,
      ttlMs: 10,
      createOwnerToken: () => 'replacement-owner',
    });
    const replacementLease = await replacement.acquire(slot);
    expect(replacementLease).not.toBeNull();

    await original.release(staleLease!);
    const contender = createSlotLockManager({
      store: sharedStore(client),
      now: () => 112,
      createOwnerToken: () => 'contender-owner',
    });
    expect(await contender.acquire(slot)).toBeNull();

    await replacement.release(replacementLease!);
    expect(await contender.acquire(slot)).not.toBeNull();
  });
});
