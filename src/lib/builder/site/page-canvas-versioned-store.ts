import path from 'node:path';

import type { BlobCasClient } from '@/lib/builder/storage/blob-cas';
import { createBlobVersionedJsonStore } from '@/lib/builder/storage/blob-cas';
import { createFileVersionedJsonStore } from '@/lib/builder/storage/file-cas';
import {
  PersistenceBackendUnavailableError,
  PersistenceConflictError,
  PersistenceInvalidDataError,
} from '@/lib/builder/storage/persistence-errors';
import type {
  VersionedJsonRecord,
  VersionedJsonStore,
} from '@/lib/builder/storage/versioned-json-store';
import {
  builderCanvasDocumentSchema,
  type BuilderCanvasDocument,
} from '@/lib/builder/canvas/types';
import type { PageCanvasRecord } from '@/lib/builder/site/types';

export const PAGE_CANVAS_CAS_MODE_ENV = 'BUILDER_PAGE_CANVAS_CAS_MODE';
export const PAGE_CANVAS_CAS_MARKER_ENV = 'BUILDER_PAGE_CANVAS_CAS_MARKER';
export const PAGE_CANVAS_CAS_ROOT_ENV = 'BUILDER_PAGE_CANVAS_CAS_ROOT';
export const PAGE_CANVAS_CAS_ACTIVATION_MARKER = 'page-canvas-cas-v1';

export const PAGE_CANVAS_CAS_VALUE_FORMAT = 'builder-page-canvas-cas-v1';
const PAGE_CANVAS_CAS_BLOB_PREFIX = 'builder-site-cas/page-canvas-v1';
const PAGE_CANVAS_CAS_LOCAL_DIRECTORY = '.page-canvas-cas-v1';
const SAFE_STORAGE_SEGMENT = /^[A-Za-z0-9][A-Za-z0-9_-]*$/;
const PAGE_CANVAS_RECORD_KEYS = new Set<PropertyKey>([
  'revision',
  'savedAt',
  'updatedBy',
  'document',
]);
const PAGE_CANVAS_VALUE_KEYS = new Set<PropertyKey>([
  'format',
  'siteId',
  'pageId',
  'variant',
  'record',
]);

export type PageCanvasPersistenceMode = 'legacy' | 'expand' | 'cutover';
export type PageCanvasVariant = 'draft' | 'published';
export type PageCanvasCasBackend = 'blob' | 'local';

export interface PageCanvasCasCoordinate {
  siteId: string;
  pageId: string;
  variant: PageCanvasVariant;
}

/**
 * The opaque backend version deliberately lives beside the domain record.
 * It must never be copied into PageCanvasRecord or returned by an API route.
 */
export interface PageCanvasCasSnapshot {
  record: PageCanvasRecord;
  storageVersion: string;
}

export interface PageCanvasConflictCurrent {
  revision: number;
  savedAt: string;
}

interface StoredPageCanvasCasValue {
  format: typeof PAGE_CANVAS_CAS_VALUE_FORMAT;
  siteId: string;
  pageId: string;
  variant: PageCanvasVariant;
  record: PageCanvasRecord;
}

export interface PageCanvasVersionedStore {
  read(coordinate: PageCanvasCasCoordinate): Promise<PageCanvasCasSnapshot>;
  create(
    coordinate: PageCanvasCasCoordinate,
    record: PageCanvasRecord,
  ): Promise<PageCanvasCasSnapshot>;
  compareAndSet(
    coordinate: PageCanvasCasCoordinate,
    expectedStorageVersion: string,
    record: PageCanvasRecord,
  ): Promise<PageCanvasCasSnapshot>;
  compareAndDelete(
    coordinate: PageCanvasCasCoordinate,
    expectedStorageVersion: string,
  ): Promise<void>;
}

export interface CreatePageCanvasVersionedStoreOptions {
  backend: PageCanvasCasBackend;
  localRoot?: string;
  blobToken?: string;
  blobClient?: BlobCasClient;
  store?: VersionedJsonStore<unknown>;
  productionMutationPolicy?: 'allow' | 'fail-closed';
}

/**
 * A conditional write lost after the domain updater had already run once.
 * `current` is re-read after the failed CAS, but the storage version remains
 * private to the persistence boundary.
 */
export class PageCanvasCasConflictError extends PersistenceConflictError {
  constructor(
    readonly current: PageCanvasConflictCurrent | null,
    options: { cause?: unknown } = {},
  ) {
    super('Page canvas changed before the conditional write committed', {
      cause: options.cause,
      operation: 'compare-and-set',
    });
    this.name = 'PageCanvasCasConflictError';
    Object.defineProperty(this, 'cause', {
      configurable: false,
      enumerable: false,
      value: options.cause,
      writable: false,
    });
  }
}

/** Existing legacy bytes require an explicit, offline migration before CAS writes. */
export class PageCanvasCasMigrationRequiredError extends PersistenceBackendUnavailableError {
  constructor() {
    super('Page canvas CAS mutation is blocked until offline migration completes');
    this.name = 'PageCanvasCasMigrationRequiredError';
  }
}

function readTrimmedEnv(
  env: NodeJS.ProcessEnv,
  name: string,
): string | undefined {
  const value = env[name];
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

/**
 * Default is intentionally legacy. Enabling expand/cutover requires an exact
 * two-variable handshake so a typo cannot silently switch persistence modes.
 */
export function resolvePageCanvasPersistenceMode(
  env: NodeJS.ProcessEnv = process.env,
): PageCanvasPersistenceMode {
  const rawMode = env[PAGE_CANVAS_CAS_MODE_ENV];
  const rawMarker = env[PAGE_CANVAS_CAS_MARKER_ENV];
  const configuredMode = rawMode === undefined || rawMode === '' ? undefined : rawMode;
  const marker = rawMarker === undefined || rawMarker === '' ? undefined : rawMarker;

  if (configuredMode === undefined && marker === undefined) return 'legacy';
  if (configuredMode === 'legacy' && marker === undefined) return 'legacy';

  if (configuredMode !== 'expand' && configuredMode !== 'cutover') {
    throw new PersistenceInvalidDataError('Page canvas CAS mode is invalid');
  }
  if (marker !== PAGE_CANVAS_CAS_ACTIVATION_MARKER) {
    throw new PersistenceInvalidDataError('Page canvas CAS activation marker is invalid');
  }
  return configuredMode;
}

export function resolvePageCanvasCasLocalRoot(
  builderSiteRoot: string,
  env: NodeJS.ProcessEnv = process.env,
): string {
  const override = readTrimmedEnv(env, PAGE_CANVAS_CAS_ROOT_ENV);
  if (override !== undefined) {
    if (!path.isAbsolute(override) || path.normalize(override) !== override) {
      throw new PersistenceInvalidDataError(
        'Page canvas CAS root must be an absolute normalized path',
      );
    }
    return override;
  }
  return path.resolve(builderSiteRoot, PAGE_CANVAS_CAS_LOCAL_DIRECTORY);
}

function assertSafeCoordinate(
  coordinate: PageCanvasCasCoordinate,
): PageCanvasCasCoordinate {
  if (
    !coordinate
    || !SAFE_STORAGE_SEGMENT.test(coordinate.siteId)
    || !SAFE_STORAGE_SEGMENT.test(coordinate.pageId)
    || (coordinate.variant !== 'draft' && coordinate.variant !== 'published')
  ) {
    throw new PersistenceInvalidDataError('Page canvas CAS coordinate is invalid');
  }
  return coordinate;
}

export function pageCanvasCasKey(coordinate: PageCanvasCasCoordinate): string {
  const safe = assertSafeCoordinate(coordinate);
  return `${safe.siteId}/pages/${safe.pageId}.${safe.variant}`;
}

function assertExactOwnKeys(
  value: object,
  allowed: ReadonlySet<PropertyKey>,
  label: string,
): void {
  const unknownKey = Reflect.ownKeys(value).find((key) => !allowed.has(key));
  if (unknownKey !== undefined) {
    throw new PersistenceInvalidDataError(`${label} contains an unknown field`);
  }
}

export function validatePageCanvasCasRecord(value: unknown): PageCanvasRecord {
  if (!value || typeof value !== 'object') {
    throw new PersistenceInvalidDataError('Page canvas CAS record is invalid');
  }
  assertExactOwnKeys(value, PAGE_CANVAS_RECORD_KEYS, 'Page canvas CAS record');

  let revision: unknown;
  let savedAt: unknown;
  let updatedBy: unknown;
  let document: unknown;
  try {
    revision = Reflect.get(value, 'revision');
    savedAt = Reflect.get(value, 'savedAt');
    updatedBy = Reflect.get(value, 'updatedBy');
    document = Reflect.get(value, 'document');
  } catch (error) {
    throw new PersistenceInvalidDataError('Page canvas CAS record cannot be inspected', {
      cause: error,
    });
  }
  if (
    !Number.isSafeInteger(revision)
    || (revision as number) < 0
    || typeof savedAt !== 'string'
    || !Number.isFinite(Date.parse(savedAt))
    || (updatedBy !== undefined && typeof updatedBy !== 'string')
    || !document
    || typeof document !== 'object'
  ) {
    throw new PersistenceInvalidDataError('Page canvas CAS record is invalid');
  }

  let validatedDocument: BuilderCanvasDocument;
  try {
    validatedDocument = builderCanvasDocumentSchema.parse(document);
  } catch (error) {
    throw new PersistenceInvalidDataError('Page canvas CAS document is invalid', {
      cause: error,
    });
  }
  return {
    revision: revision as number,
    savedAt,
    ...(updatedBy === undefined ? {} : { updatedBy }),
    document: validatedDocument,
  };
}

function storedValue(
  coordinate: PageCanvasCasCoordinate,
  record: PageCanvasRecord,
): StoredPageCanvasCasValue {
  const safe = assertSafeCoordinate(coordinate);
  return {
    format: PAGE_CANVAS_CAS_VALUE_FORMAT,
    siteId: safe.siteId,
    pageId: safe.pageId,
    variant: safe.variant,
    record: validatePageCanvasCasRecord(record),
  };
}

function parseStoredValue(
  value: unknown,
  coordinate: PageCanvasCasCoordinate,
): PageCanvasRecord {
  const safe = assertSafeCoordinate(coordinate);
  if (
    !value
    || typeof value !== 'object'
    || Reflect.get(value, 'format') !== PAGE_CANVAS_CAS_VALUE_FORMAT
    || Reflect.get(value, 'siteId') !== safe.siteId
    || Reflect.get(value, 'pageId') !== safe.pageId
    || Reflect.get(value, 'variant') !== safe.variant
    || !Object.prototype.hasOwnProperty.call(value, 'record')
  ) {
    throw new PersistenceInvalidDataError('Page canvas CAS value envelope is invalid');
  }
  assertExactOwnKeys(value, PAGE_CANVAS_VALUE_KEYS, 'Page canvas CAS value envelope');
  return validatePageCanvasCasRecord(Reflect.get(value, 'record'));
}

function snapshotFromRecord(
  coordinate: PageCanvasCasCoordinate,
  result: VersionedJsonRecord<unknown>,
): PageCanvasCasSnapshot {
  if (typeof result.version !== 'string' || result.version.length === 0) {
    throw new PersistenceInvalidDataError('Page canvas CAS storage version is invalid');
  }
  return {
    record: parseStoredValue(result.value, coordinate),
    storageVersion: result.version,
  };
}

function createUnderlyingStore(
  options: CreatePageCanvasVersionedStoreOptions,
): VersionedJsonStore<unknown> {
  if (options.store) return options.store;
  if (options.backend === 'blob') {
    return createBlobVersionedJsonStore<unknown>({
      pathnameForKey: (key) => `${PAGE_CANVAS_CAS_BLOB_PREFIX}/${key}.json`,
      ...(options.blobToken === undefined ? {} : { token: options.blobToken }),
      ...(options.blobClient === undefined ? {} : { client: options.blobClient }),
    });
  }
  if (options.backend !== 'local' || !options.localRoot) {
    throw new PersistenceInvalidDataError('Page canvas local CAS root is required');
  }
  return createFileVersionedJsonStore<unknown>({
    root: options.localRoot,
    ...(options.productionMutationPolicy === undefined
      ? {}
      : { productionMutationPolicy: options.productionMutationPolicy }),
  });
}

export function createPageCanvasVersionedStore(
  options: CreatePageCanvasVersionedStoreOptions,
): PageCanvasVersionedStore {
  const store = createUnderlyingStore(options);
  return {
    async read(coordinate) {
      const result = await store.read(pageCanvasCasKey(coordinate));
      return snapshotFromRecord(coordinate, result);
    },
    async create(coordinate, record) {
      const result = await store.create(
        pageCanvasCasKey(coordinate),
        storedValue(coordinate, record),
      );
      return snapshotFromRecord(coordinate, result);
    },
    async compareAndSet(coordinate, expectedStorageVersion, record) {
      const result = await store.compareAndSet(
        pageCanvasCasKey(coordinate),
        expectedStorageVersion,
        storedValue(coordinate, record),
      );
      return snapshotFromRecord(coordinate, result);
    },
    async compareAndDelete(coordinate, expectedStorageVersion) {
      await store.compareAndDelete(
        pageCanvasCasKey(coordinate),
        expectedStorageVersion,
      );
    },
  };
}
