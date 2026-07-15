import { describe, expect, it, vi } from 'vitest';

import {
  PersistenceBackendUnavailableError,
  PersistenceConflictError,
  PersistenceInvalidDataError,
  PersistenceMissingError,
} from '../persistence-errors';
import {
  defineRetrySafeReducer,
  mutateVersionedJson,
  type VersionedJsonStore,
} from '../versioned-json-store';

type Value = { count: number };

function storeFrom(
  methods: Partial<VersionedJsonStore<Value>>,
): VersionedJsonStore<Value> {
  return {
    read: vi.fn(),
    create: vi.fn(),
    compareAndSet: vi.fn(),
    compareAndDelete: vi.fn(),
    ...methods,
  };
}

describe('versioned JSON store helpers', () => {
  it('brands reducers non-enumerably and requires the brand at runtime', async () => {
    const reducer = defineRetrySafeReducer<Value>((value) => ({
      count: value.count + 1,
    }));
    const store = storeFrom({
      read: vi.fn().mockResolvedValue({ value: { count: 1 }, version: 'v1' }),
      compareAndSet: vi.fn().mockResolvedValue({ value: { count: 2 }, version: 'v2' }),
    });

    await expect(mutateVersionedJson(store, 'counter', reducer)).resolves.toEqual({
      value: { count: 2 },
      version: 'v2',
    });
    expect(Object.keys(reducer)).toEqual([]);
    await expect(
      mutateVersionedJson(
        store,
        'counter',
        ((value: Value) => value) as never,
      ),
    ).rejects.toMatchObject({ code: 'invalid_data' });
  });

  it('retries a branded reducer only after a conflict and reads the fresh version', async () => {
    const reducer = defineRetrySafeReducer<Value>((value, record) => ({
      count: value.count + (record.version === 'v1' ? 1 : 2),
    }));
    const store = storeFrom({
      read: vi
        .fn()
        .mockResolvedValueOnce({ value: { count: 1 }, version: 'v1' })
        .mockResolvedValueOnce({ value: { count: 5 }, version: 'v2' }),
      compareAndSet: vi
        .fn()
        .mockRejectedValueOnce(new PersistenceConflictError('changed'))
        .mockResolvedValueOnce({ value: { count: 7 }, version: 'v3' }),
    });

    await expect(mutateVersionedJson(store, 'counter', reducer)).resolves.toEqual({
      value: { count: 7 },
      version: 'v3',
    });
    expect(store.read).toHaveBeenCalledTimes(2);
    expect(store.compareAndSet).toHaveBeenNthCalledWith(1, 'counter', 'v1', {
      count: 2,
    });
    expect(store.compareAndSet).toHaveBeenNthCalledWith(2, 'counter', 'v2', {
      count: 7,
    });
  });

  it('does not retry non-conflict persistence failures', async () => {
    const unavailable = new PersistenceBackendUnavailableError('offline');
    const store = storeFrom({
      read: vi.fn().mockResolvedValue({ value: { count: 1 }, version: 'v1' }),
      compareAndSet: vi.fn().mockRejectedValue(unavailable),
    });

    await expect(
      mutateVersionedJson(
        store,
        'counter',
        defineRetrySafeReducer<Value>((value) => ({ count: value.count + 1 })),
      ),
    ).rejects.toBe(unavailable);
    expect(store.read).toHaveBeenCalledTimes(1);
    expect(store.compareAndSet).toHaveBeenCalledTimes(1);
  });

  it('does not retry invalid-data failures from compareAndSet', async () => {
    const invalid = new PersistenceInvalidDataError('corrupt record');
    const store = storeFrom({
      read: vi.fn().mockResolvedValue({ value: { count: 1 }, version: 'v1' }),
      compareAndSet: vi.fn().mockRejectedValue(invalid),
    });

    await expect(
      mutateVersionedJson(
        store,
        'counter',
        defineRetrySafeReducer<Value>((value) => ({ count: value.count + 1 })),
      ),
    ).rejects.toBe(invalid);
    expect(store.read).toHaveBeenCalledTimes(1);
    expect(store.compareAndSet).toHaveBeenCalledTimes(1);
  });

  it('stops after the bounded number of conflicting attempts', async () => {
    const conflict = new PersistenceConflictError('still changing');
    const store = storeFrom({
      read: vi.fn().mockResolvedValue({ value: { count: 1 }, version: 'v1' }),
      compareAndSet: vi.fn().mockRejectedValue(conflict),
    });

    await expect(
      mutateVersionedJson(
        store,
        'counter',
        defineRetrySafeReducer<Value>((value) => ({ count: value.count + 1 })),
      ),
    ).rejects.toBe(conflict);
    expect(store.read).toHaveBeenCalledTimes(3);
    expect(store.compareAndSet).toHaveBeenCalledTimes(3);
  });

  it.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, 4])(
    'rejects invalid maxAttempts %s',
    async (maxAttempts) => {
      const store = storeFrom({
        read: vi.fn().mockResolvedValue({ value: { count: 1 }, version: 'v1' }),
      });

      await expect(
        mutateVersionedJson(
          store,
          'counter',
          defineRetrySafeReducer<Value>((value) => value),
          { maxAttempts },
        ),
      ).rejects.toMatchObject({ code: 'invalid_data' });
      expect(store.read).not.toHaveBeenCalled();
    },
  );

  it('mutates existing records only and never falls back to create', async () => {
    const missing = new PersistenceMissingError('counter missing');
    const store = storeFrom({ read: vi.fn().mockRejectedValue(missing) });

    await expect(
      mutateVersionedJson(
        store,
        'counter',
        defineRetrySafeReducer<Value>((value) => ({ count: value.count + 1 })),
      ),
    ).rejects.toBe(missing);
    expect(store.create).not.toHaveBeenCalled();
    expect(store.compareAndSet).not.toHaveBeenCalled();
  });

  it('returns exactly the version propagated by compareAndSet', async () => {
    const store = storeFrom({
      read: vi.fn().mockResolvedValue({ value: { count: 1 }, version: 'v1' }),
      compareAndSet: vi.fn().mockResolvedValue({
        value: { count: 2 },
        version: 'provider-etag-v2',
      }),
    });

    const result = await mutateVersionedJson(
      store,
      'counter',
      defineRetrySafeReducer<Value>((value) => ({ count: value.count + 1 })),
    );

    expect(result.version).toBe('provider-etag-v2');
    expect(result.value).toEqual({ count: 2 });
  });
});
