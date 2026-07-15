import {
  PERSISTENCE_ERROR_CODES,
  PersistenceInvalidDataError,
  isPersistenceError,
} from './persistence-errors';

export interface VersionedJsonRecord<T> {
  value: T;
  version: string;
}

export interface VersionedJsonStore<T> {
  read(key: string): Promise<VersionedJsonRecord<T>>;
  create(key: string, value: T): Promise<VersionedJsonRecord<T>>;
  compareAndSet(
    key: string,
    expectedVersion: string,
    value: T,
  ): Promise<VersionedJsonRecord<T>>;
  compareAndDelete(key: string, expectedVersion: string): Promise<void>;
}

export type VersionedJsonReducer<T> = (
  value: T,
  record: VersionedJsonRecord<T>,
) => T | Promise<T>;

declare const retrySafeReducerBrand: unique symbol;

export type RetrySafeReducer<T> = VersionedJsonReducer<T> & {
  readonly [retrySafeReducerBrand]: true;
};

const RETRY_SAFE_REDUCER_BRAND = Symbol('retry-safe-versioned-json-reducer');

export const DEFAULT_VERSIONED_JSON_MUTATION_ATTEMPTS = 3;
export const MAX_VERSIONED_JSON_MUTATION_ATTEMPTS = 3;

export interface MutateVersionedJsonOptions {
  /** Maximum total read/reduce/CAS attempts; bounded to keep contention finite. */
  maxAttempts?: number;
}

/**
 * Declares that a reducer is safe to evaluate again against a fresher record.
 * Reducers must not perform side effects: a conflict can cause another call.
 */
export function defineRetrySafeReducer<T>(
  reducer: VersionedJsonReducer<T>,
): RetrySafeReducer<T> {
  if (typeof reducer !== 'function') {
    throw new PersistenceInvalidDataError('A retry-safe reducer must be a function');
  }

  Object.defineProperty(reducer, RETRY_SAFE_REDUCER_BRAND, {
    configurable: false,
    enumerable: false,
    value: true,
    writable: false,
  });
  return reducer as RetrySafeReducer<T>;
}

function isRetrySafeReducer<T>(reducer: unknown): reducer is RetrySafeReducer<T> {
  return (
    typeof reducer === 'function' &&
    Reflect.get(reducer, RETRY_SAFE_REDUCER_BRAND) === true
  );
}

function resolveMaxAttempts(options: MutateVersionedJsonOptions): number {
  const maxAttempts =
    options.maxAttempts ?? DEFAULT_VERSIONED_JSON_MUTATION_ATTEMPTS;
  if (
    !Number.isInteger(maxAttempts) ||
    maxAttempts < 1 ||
    maxAttempts > MAX_VERSIONED_JSON_MUTATION_ATTEMPTS
  ) {
    throw new PersistenceInvalidDataError(
      `maxAttempts must be an integer between 1 and ${MAX_VERSIONED_JSON_MUTATION_ATTEMPTS}`,
    );
  }
  return maxAttempts;
}

/**
 * Applies a retry-safe reducer to an existing record using bounded CAS retries.
 *
 * Missing records are intentionally not created here: callers must explicitly
 * choose create semantics. Only a typed persistence conflict is retried; all
 * backend, validation, read, and reducer failures escape immediately.
 */
export async function mutateVersionedJson<T>(
  store: VersionedJsonStore<T>,
  key: string,
  reducer: RetrySafeReducer<T>,
  options: MutateVersionedJsonOptions = {},
): Promise<VersionedJsonRecord<T>> {
  if (!isRetrySafeReducer<T>(reducer)) {
    throw new PersistenceInvalidDataError(
      'mutateVersionedJson requires a reducer from defineRetrySafeReducer',
    );
  }

  const maxAttempts = resolveMaxAttempts(options);

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const current = await store.read(key);
    const nextValue = await reducer(current.value, current);

    try {
      return await store.compareAndSet(key, current.version, nextValue);
    } catch (error) {
      if (
        !isPersistenceError(error) ||
        error.code !== PERSISTENCE_ERROR_CODES.CONFLICT ||
        attempt === maxAttempts - 1
      ) {
        throw error;
      }
    }
  }

  // The for-loop is finite and either returns or throws. Keep a fail-closed
  // guard for future maintenance rather than silently widening retry behavior.
  throw new PersistenceInvalidDataError('Versioned JSON mutation did not complete');
}
