export const PERSISTENCE_ERROR_CODES = {
  MISSING: 'missing',
  CONFLICT: 'conflict',
  BACKEND_UNAVAILABLE: 'backend_unavailable',
  BACKEND_FAILURE: 'backend_failure',
  INVALID_DATA: 'invalid_data',
} as const;

export type PersistenceErrorCode =
  (typeof PERSISTENCE_ERROR_CODES)[keyof typeof PERSISTENCE_ERROR_CODES];

export type PersistenceOperation =
  | 'read'
  | 'create'
  | 'compare-and-set'
  | 'compare-and-delete';

export interface PersistenceErrorOptions {
  cause?: unknown;
  operation?: PersistenceOperation;
  key?: string;
}

const PERSISTENCE_ERROR_CODE_SET: ReadonlySet<string> = new Set(
  Object.values(PERSISTENCE_ERROR_CODES),
);

function hasOwn(value: object, key: PropertyKey): boolean {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function readProperty(value: object, key: PropertyKey): unknown {
  try {
    return Reflect.get(value, key);
  } catch {
    return undefined;
  }
}

function readOptionalString(value: object, key: PropertyKey): string | undefined {
  const candidate = readProperty(value, key);
  return typeof candidate === 'string' ? candidate : undefined;
}

function isPersistenceErrorCode(value: unknown): value is PersistenceErrorCode {
  return typeof value === 'string' && PERSISTENCE_ERROR_CODE_SET.has(value);
}

/**
 * Stable, provider-agnostic failure shape for the persistence boundary.
 *
 * The original error is retained as `cause`, but it is deliberately not folded
 * into this error's message: provider messages can contain implementation or
 * credential-adjacent details that callers should not expose to users.
 */
export class PersistenceError extends Error {
  readonly cause: unknown;
  readonly operation: PersistenceOperation | undefined;
  readonly key: string | undefined;

  constructor(
    message: string,
    readonly code: PersistenceErrorCode,
    options: PersistenceErrorOptions = {},
  ) {
    super(message);
    this.name = 'PersistenceError';
    this.operation = options.operation;
    this.key = options.key;
    this.cause = options.cause;
  }
}

export class PersistenceMissingError extends PersistenceError {
  constructor(message: string, options: PersistenceErrorOptions = {}) {
    super(message, PERSISTENCE_ERROR_CODES.MISSING, options);
    this.name = 'PersistenceMissingError';
  }
}

export class PersistenceConflictError extends PersistenceError {
  constructor(message: string, options: PersistenceErrorOptions = {}) {
    super(message, PERSISTENCE_ERROR_CODES.CONFLICT, options);
    this.name = 'PersistenceConflictError';
  }
}

export class PersistenceBackendUnavailableError extends PersistenceError {
  constructor(message: string, options: PersistenceErrorOptions = {}) {
    super(message, PERSISTENCE_ERROR_CODES.BACKEND_UNAVAILABLE, options);
    this.name = 'PersistenceBackendUnavailableError';
  }
}

export class PersistenceBackendFailureError extends PersistenceError {
  constructor(message: string, options: PersistenceErrorOptions = {}) {
    super(message, PERSISTENCE_ERROR_CODES.BACKEND_FAILURE, options);
    this.name = 'PersistenceBackendFailureError';
  }
}

export class PersistenceInvalidDataError extends PersistenceError {
  constructor(message: string, options: PersistenceErrorOptions = {}) {
    super(message, PERSISTENCE_ERROR_CODES.INVALID_DATA, options);
    this.name = 'PersistenceInvalidDataError';
  }
}

/**
 * Accepts both local instances and a safely-inspected cross-realm structural
 * equivalent. The latter matters when storage adapters are loaded in a
 * separate runtime bundle.
 */
export function isPersistenceError(error: unknown): error is PersistenceError {
  if (error instanceof PersistenceError) return true;
  if (typeof error !== 'object' || error === null) return false;

  const code = readProperty(error, 'code');
  const message = readProperty(error, 'message');
  return isPersistenceErrorCode(code) && typeof message === 'string';
}

function optionsFromUnknown(
  error: object,
  fallback: PersistenceErrorOptions,
): PersistenceErrorOptions {
  const operation = readOptionalString(error, 'operation');
  const key = readOptionalString(error, 'key');
  const hasCause = hasOwn(error, 'cause');

  return {
    ...(hasCause ? { cause: readProperty(error, 'cause') } : fallback.cause !== undefined
      ? { cause: fallback.cause }
      : {}),
    ...(operation === 'read' ||
    operation === 'create' ||
    operation === 'compare-and-set' ||
    operation === 'compare-and-delete'
      ? { operation }
      : fallback.operation !== undefined
        ? { operation: fallback.operation }
        : {}),
    ...(key !== undefined ? { key } : fallback.key !== undefined ? { key: fallback.key } : {}),
  };
}

function errorForCode(
  code: PersistenceErrorCode,
  message: string,
  options: PersistenceErrorOptions,
): PersistenceError {
  switch (code) {
    case PERSISTENCE_ERROR_CODES.MISSING:
      return new PersistenceMissingError(message, options);
    case PERSISTENCE_ERROR_CODES.CONFLICT:
      return new PersistenceConflictError(message, options);
    case PERSISTENCE_ERROR_CODES.BACKEND_UNAVAILABLE:
      return new PersistenceBackendUnavailableError(message, options);
    case PERSISTENCE_ERROR_CODES.INVALID_DATA:
      return new PersistenceInvalidDataError(message, options);
    case PERSISTENCE_ERROR_CODES.BACKEND_FAILURE:
      return new PersistenceBackendFailureError(message, options);
  }
}

/**
 * Converts an unknown adapter/runtime failure into the stable persistence
 * contract without leaking the underlying error text. Existing local typed
 * errors retain identity and their original cause.
 */
export function normalizePersistenceError(
  error: unknown,
  fallback: PersistenceErrorOptions = {},
): PersistenceError {
  if (error instanceof PersistenceError) return error;

  if (typeof error === 'object' && error !== null) {
    const code = readProperty(error, 'code');
    const message = readProperty(error, 'message');
    if (isPersistenceErrorCode(code) && typeof message === 'string') {
      return errorForCode(code, message, optionsFromUnknown(error, fallback));
    }
  }

  return new PersistenceBackendFailureError('Persistence backend failure', {
    ...fallback,
    cause: error,
  });
}
