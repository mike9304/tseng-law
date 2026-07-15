/// <reference types="node" />

export type LocalJsonGeneration = {
  dev: string;
  ino: string;
  size: string;
  mtimeNs: string;
  ctimeNs: string;
  sha256: string;
};

export type LocalJsonSnapshot =
  | { kind: 'missing' }
  | { kind: 'present'; bytes: Buffer; generation: LocalJsonGeneration };

export type LocalJsonLeaseHookStage =
  | 'after-missing-parent-probe'
  | 'after-manifest-fsync'
  | 'after-target-detach'
  | 'after-candidate-link'
  | 'after-remove-detach';

export type LocalJsonLeaseHook = (
  event: { stage: LocalJsonLeaseHookStage; targetPath: string; nonce: string },
) => void | Promise<void>;

export type LocalJsonLeaseOptions = {
  allowedRoot: string;
  acquireTimeoutMs?: number;
  lockStaleMs?: number;
  retryDelayMs?: number;
  testHook?: LocalJsonLeaseHook;
};

export type LocalJsonWriteOptions = {
  expectedGeneration?: LocalJsonGeneration | null;
};

export class LocalJsonWriteConflictError extends Error {
  readonly code: 'LOCAL_JSON_WRITE_CONFLICT';
}

export class LocalJsonWriteUnavailableError extends Error {
  readonly code: 'LOCAL_JSON_WRITE_UNAVAILABLE';
}

export class LocalJsonWriteInvalidPathError extends Error {
  readonly code: 'LOCAL_JSON_WRITE_INVALID_PATH';
}

export interface LocalJsonWriteLease {
  readonly targetPath: string;
  readonly allowedRoot: string;
  read(options?: Record<string, never>): Promise<LocalJsonSnapshot>;
  atomicWrite(
    data: string | Buffer | Uint8Array,
    options?: LocalJsonWriteOptions,
  ): Promise<{ before: LocalJsonSnapshot; after: Extract<LocalJsonSnapshot, { kind: 'present' }> }>;
  atomicRemove(
    options?: LocalJsonWriteOptions,
  ): Promise<{ before: LocalJsonSnapshot; removed: boolean }>;
  recover(): Promise<void>;
  release(): Promise<void>;
}

export function acquireLocalJsonWriteLease(
  targetPath: string,
  options: LocalJsonLeaseOptions,
): Promise<LocalJsonWriteLease>;

export function releaseLocalJsonWriteLease(lease: LocalJsonWriteLease): Promise<void>;

export function withLocalJsonWriteLease<T>(
  targetPath: string,
  options: LocalJsonLeaseOptions,
  operation: (lease: LocalJsonWriteLease) => Promise<T> | T,
): Promise<T>;

export function withLocalJsonWriteLeases<T>(
  targetPaths: readonly string[],
  options: LocalJsonLeaseOptions,
  operation: (leases: LocalJsonWriteLease[]) => Promise<T> | T,
): Promise<T>;

export function readLocalJsonFile(
  targetOrLease: string | LocalJsonWriteLease,
  options?: LocalJsonLeaseOptions | Record<string, never>,
): Promise<LocalJsonSnapshot>;

export function atomicWriteLocalJson(
  targetOrLease: string | LocalJsonWriteLease,
  data: string | Buffer | Uint8Array,
  options?: (LocalJsonWriteOptions & Partial<LocalJsonLeaseOptions>),
): Promise<{ before: LocalJsonSnapshot; after: Extract<LocalJsonSnapshot, { kind: 'present' }> }>;

export function atomicRemoveLocalJson(
  targetOrLease: string | LocalJsonWriteLease,
  options?: (LocalJsonWriteOptions & Partial<LocalJsonLeaseOptions>),
): Promise<{ before: LocalJsonSnapshot; removed: boolean }>;

export function recoverLocalJsonTransaction(lease: LocalJsonWriteLease): Promise<void>;
