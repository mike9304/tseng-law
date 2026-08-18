import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'node:crypto';
import { get, list, put } from '@vercel/blob';
import { createBlobVersionedJsonStore } from '@/lib/builder/storage/blob-cas';
import { createFileVersionedJsonStore } from '@/lib/builder/storage/file-cas';
import {
  PERSISTENCE_ERROR_CODES,
  PersistenceMissingError,
  isPersistenceError,
} from '@/lib/builder/storage/persistence-errors';
import {
  defineRetrySafeReducer,
  mutateVersionedJson,
  type VersionedJsonRecord,
  type VersionedJsonStore,
} from '@/lib/builder/storage/versioned-json-store';
import type { Experiment } from './types';

const DEFAULT_ROOT = path.join(process.cwd(), 'runtime-data', 'experiments');
const BLOB_PREFIX = 'experiments/';

export type ExperimentMetricKind = 'exposure' | 'conversion';

export interface IncrementExperimentMetricInput {
  experimentId: string;
  variantId: string;
  kind: ExperimentMetricKind;
}

type StoredExperimentEnvelope = {
  format: 'blob-cas-v1' | 'file-cas-v1';
  value: Experiment;
};

function root(): string {
  // This private override is intentionally useful only for isolated local/test
  // stores. Production mutations never use the file backend (see
  // versionedStore below).
  return process.env.EXPERIMENTS_FILE_STORE_ROOT ?? DEFAULT_ROOT;
}

function backend(): 'blob' | 'file' {
  return process.env.BLOB_READ_WRITE_TOKEN ? 'blob' : 'file';
}

function blobPath(id: string): string {
  return `${BLOB_PREFIX}${id}.json`;
}

function filePath(id: string): string {
  return path.join(root(), `${id}.json`);
}

function isStoredExperimentEnvelope(value: unknown): value is StoredExperimentEnvelope {
  return Boolean(
    value
      && typeof value === 'object'
      && ((value as Partial<StoredExperimentEnvelope>).format === 'blob-cas-v1'
        || (value as Partial<StoredExperimentEnvelope>).format === 'file-cas-v1')
      && 'value' in value
      && (value as Partial<StoredExperimentEnvelope>).value
      && typeof (value as Partial<StoredExperimentEnvelope>).value === 'object',
  );
}

function decodeExperiment(value: unknown): Experiment {
  return isStoredExperimentEnvelope(value) ? value.value : value as Experiment;
}

function isExperiment(value: unknown): value is Experiment {
  return Boolean(
    value
      && typeof value === 'object'
      && typeof (value as Partial<Experiment>).experimentId === 'string'
      && typeof (value as Partial<Experiment>).createdAt === 'string'
      && typeof (value as Partial<Experiment>).updatedAt === 'string'
      && (value as Partial<Experiment>).metrics
      && typeof (value as Partial<Experiment>).metrics === 'object',
  );
}

function ensureExperimentId(id: string): string {
  if (
    typeof id !== 'string'
    || id.length === 0
    || id.length > 160
    || !/^[A-Za-z0-9_-]+$/.test(id)
  ) {
    throw new Error('Invalid experiment id');
  }
  return id;
}

export function makeExperimentId(): string {
  return `exp_${Date.now()}_${crypto.randomBytes(6).toString('hex')}`;
}

async function readLegacyFileJson(id: string): Promise<Experiment | null> {
  try {
    const raw = await fs.readFile(filePath(id), 'utf8');
    return decodeExperiment(JSON.parse(raw));
  } catch {
    return null;
  }
}

async function readBlobJson(id: string): Promise<Experiment | null> {
  try {
    const result = await get(blobPath(id), { access: 'private', useCache: false });
    if (result?.statusCode === 200 && result.stream) {
      return decodeExperiment(JSON.parse(await new Response(result.stream).text()));
    }
    return null;
  } catch {
    return null;
  }
}

async function versionedStore(): Promise<VersionedJsonStore<Experiment>> {
  if (backend() === 'blob') {
    return createBlobVersionedJsonStore<Experiment>({
      pathnameForKey: blobPath,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
  }

  // Never turn a missing production Blob token into non-durable local metric
  // writes. File CAS is deliberately limited to local development and tests.
  if (process.env.NODE_ENV === 'production') {
    throw new Error('A Blob token is required for production experiment metrics');
  }

  await fs.mkdir(root(), { recursive: true });
  const canonicalRoot = await fs.realpath(root());
  return createFileVersionedJsonStore<Experiment>({
    root: canonicalRoot,
    productionMutationPolicy: 'allow',
  });
}

async function migrateLegacyBlobExperiment(
  id: string,
): Promise<Experiment> {
  const result = await get(blobPath(id), { access: 'private', useCache: false });
  if (result?.statusCode !== 200 || !result.stream) {
    throw new PersistenceMissingError('Experiment is missing');
  }

  const value = JSON.parse(await new Response(result.stream).text()) as unknown;
  if (isStoredExperimentEnvelope(value)) return value.value;
  const legacy = value as Experiment;
  const serialized = JSON.stringify({
    format: 'blob-cas-v1',
    key: id,
    generation: crypto.randomBytes(16).toString('hex'),
    value: legacy,
  });

  try {
    await put(blobPath(id), serialized, {
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
      ifMatch: result.blob.etag,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    return legacy;
  } catch (error) {
    // A concurrent migration or edit is safe to retry through the CAS store.
    // Do not overwrite blindly when the legacy ETag has changed.
    const store = await versionedStore();
    try {
      return (await store.read(id)).value;
    } catch {
      throw error;
    }
  }
}

/**
 * Ensures the canonical VersionedJsonStore record exists. Legacy plain JSON
 * experiment documents are migrated conditionally on first write so existing
 * builder/admin records remain readable during the transition.
 */
async function readOrMigrateVersionedExperiment(
  id: string,
): Promise<{ store: VersionedJsonStore<Experiment>; record: VersionedJsonRecord<Experiment> }> {
  const store = await versionedStore();
  try {
    return { store, record: await store.read(id) };
  } catch (error) {
    if (
      backend() === 'blob'
      && isPersistenceError(error)
      && error.code === PERSISTENCE_ERROR_CODES.INVALID_DATA
    ) {
      // Blob CAS rejects the old plain JSON representation. Migrate it with
      // an ETag condition before retrying the normal adapter read.
      await migrateLegacyBlobExperiment(id);
      return { store, record: await store.read(id) };
    }
    if (!(error instanceof PersistenceMissingError)) throw error;

    const legacy = await readLegacyFileJson(id);
    if (!legacy) throw error;
    try {
      return { store, record: await store.create(id, legacy) };
    } catch (createError) {
      if (
        isPersistenceError(createError)
        && createError.code === PERSISTENCE_ERROR_CODES.CONFLICT
      ) {
        return { store, record: await store.read(id) };
      }
      throw createError;
    }
  }
}

async function createVersionedExperiment(
  id: string,
  experiment: Experiment,
): Promise<VersionedJsonRecord<Experiment>> {
  const store = await versionedStore();
  try {
    return await store.create(id, experiment);
  } catch (error) {
    if (
      backend() === 'blob'
      && isPersistenceError(error)
      && error.code === PERSISTENCE_ERROR_CODES.CONFLICT
    ) {
      await migrateLegacyBlobExperiment(id);
      return mutateVersionedJson(
        store,
        id,
        defineRetrySafeReducer(() => experiment),
      );
    }
    throw error;
  }
}

async function listFileExperiments(): Promise<Experiment[]> {
  const directory = root();
  const files = await fs.readdir(directory).catch(() => []);
  const records = new Map<string, Experiment>();

  for (const file of files) {
    if (!file.startsWith('cas-') || !file.endsWith('.json')) continue;
    try {
      const value = JSON.parse(await fs.readFile(path.join(directory, file), 'utf8')) as unknown;
      if (isStoredExperimentEnvelope(value)) {
        records.set(value.value.experimentId, value.value);
      }
    } catch {
      // A malformed local record is skipped here; direct reads retain their
      // existing failure behavior for the precise requested experiment.
    }
  }
  for (const file of files) {
    if (!file.endsWith('.json') || file.startsWith('cas-')) continue;
    try {
      const value = decodeExperiment(JSON.parse(await fs.readFile(path.join(directory, file), 'utf8')));
      if (!records.has(value.experimentId)) records.set(value.experimentId, value);
    } catch {
      /* skip */
    }
  }
  return [...records.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listExperiments(): Promise<Experiment[]> {
  try {
    if (backend() === 'file') return await listFileExperiments();

    const result = await list({ prefix: BLOB_PREFIX });
    const out: Experiment[] = [];
    for (const blob of result.blobs) {
      try {
        const item = await get(blob.pathname, { access: 'private', useCache: false });
        if (
          /^experiments\/[A-Za-z0-9_-]+\.json$/.test(blob.pathname)
          && item?.statusCode === 200
          && item.stream
        ) {
          const experiment = decodeExperiment(
            JSON.parse(await new Response(item.stream).text()),
          );
          if (isExperiment(experiment)) out.push(experiment);
        }
      } catch {
        /* skip */
      }
    }
    return out.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export async function getExperiment(id: string): Promise<Experiment | null> {
  const safeId = ensureExperimentId(id);
  if (backend() === 'blob') return readBlobJson(safeId);

  try {
    const store = await versionedStore();
    return (await store.read(safeId)).value;
  } catch (error) {
    if (!(error instanceof PersistenceMissingError)) throw error;
    return readLegacyFileJson(safeId);
  }
}

export async function saveExperiment(experiment: Experiment): Promise<void> {
  const id = ensureExperimentId(experiment.experimentId);
  const next = { ...experiment, updatedAt: new Date().toISOString() };

  try {
    const { store } = await readOrMigrateVersionedExperiment(id);
    await mutateVersionedJson(
      store,
      id,
      defineRetrySafeReducer(() => next),
    );
  } catch (error) {
    if (!(error instanceof PersistenceMissingError)) throw error;
    await createVersionedExperiment(id, next);
  }
}

/**
 * Atomically increments one experiment metric through a bounded retry-safe
 * CAS reducer. It is intentionally the only metric write path used by the
 * public assignment/event endpoints.
 */
export async function incrementExperimentMetric(
  input: IncrementExperimentMetricInput,
): Promise<Experiment> {
  const id = ensureExperimentId(input.experimentId);
  if (
    (input.kind !== 'exposure' && input.kind !== 'conversion')
    || typeof input.variantId !== 'string'
    || input.variantId.length === 0
    || input.variantId.length > 160
  ) {
    throw new Error('Invalid experiment metric input');
  }

  const { store } = await readOrMigrateVersionedExperiment(id);
  const record = await mutateVersionedJson(
    store,
    id,
    defineRetrySafeReducer((current) => {
      const key = input.kind === 'exposure' ? 'exposures' : 'conversions';
      const bucket = current.metrics[key] ?? {};
      return {
        ...current,
        metrics: {
          ...current.metrics,
          [key]: {
            ...bucket,
            [input.variantId]: (bucket[input.variantId] ?? 0) + 1,
          },
        },
        // This timestamp is only persisted with the successful CAS write;
        // retry attempts never mutate the stored record in place.
        updatedAt: new Date().toISOString(),
      };
    }),
  );
  return record.value;
}
