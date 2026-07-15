import { describe, expect, it } from 'vitest';

import {
  PERSISTENCE_ERROR_CODES,
  PersistenceBackendFailureError,
  PersistenceConflictError,
  PersistenceInvalidDataError,
  PersistenceMissingError,
  isPersistenceError,
  normalizePersistenceError,
} from '../persistence-errors';

describe('persistence errors', () => {
  it('uses stable codes and preserves explicit metadata and causes', () => {
    const cause = new Error('provider detail');
    const error = new PersistenceConflictError('record changed', {
      cause,
      operation: 'compare-and-set',
      key: 'site/home',
    });

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('PersistenceConflictError');
    expect(error.code).toBe(PERSISTENCE_ERROR_CODES.CONFLICT);
    expect(error.cause).toBe(cause);
    expect(error.operation).toBe('compare-and-set');
    expect(error.key).toBe('site/home');
    expect(isPersistenceError(error)).toBe(true);
  });

  it('recognizes safely-shaped cross-realm equivalents', () => {
    expect(
      isPersistenceError({
        code: PERSISTENCE_ERROR_CODES.MISSING,
        message: 'missing',
      }),
    ).toBe(true);
    expect(isPersistenceError({ code: 'unknown', message: 'missing' })).toBe(false);
    expect(isPersistenceError(null)).toBe(false);
  });

  it('returns local typed errors unchanged during normalization', () => {
    const error = new PersistenceMissingError('not found', { key: 'site/home' });

    expect(normalizePersistenceError(error)).toBe(error);
  });

  it('rehydrates a structural typed error while retaining its code and cause', () => {
    const cause = new Error('remote provider');
    const normalized = normalizePersistenceError({
      code: PERSISTENCE_ERROR_CODES.INVALID_DATA,
      message: 'malformed payload',
      cause,
      operation: 'read',
      key: 'site/home',
    });

    expect(normalized).toBeInstanceOf(PersistenceInvalidDataError);
    expect(normalized).toMatchObject({
      code: PERSISTENCE_ERROR_CODES.INVALID_DATA,
      message: 'malformed payload',
      operation: 'read',
      key: 'site/home',
      cause,
    });
  });

  it('normalizes unknown failures without leaking their message', () => {
    const cause = new Error('credential-bearing upstream detail');
    const normalized = normalizePersistenceError(cause, {
      operation: 'read',
      key: 'site/home',
    });

    expect(normalized).toBeInstanceOf(PersistenceBackendFailureError);
    expect(normalized).toMatchObject({
      code: PERSISTENCE_ERROR_CODES.BACKEND_FAILURE,
      message: 'Persistence backend failure',
      operation: 'read',
      key: 'site/home',
      cause,
    });
  });
});
