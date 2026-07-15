import { randomBytes } from "node:crypto";

import {
  BlobError,
  BlobNotFoundError,
  BlobPreconditionFailedError,
  BlobRequestAbortedError,
  BlobServiceNotAvailable,
  BlobServiceRateLimited,
  BlobStoreNotFoundError,
  BlobStoreSuspendedError,
  del as vercelBlobDelete,
  get as vercelBlobGet,
  put as vercelBlobPut,
} from "@vercel/blob";

import {
  PersistenceBackendFailureError,
  PersistenceBackendUnavailableError,
  PersistenceConflictError,
  PersistenceInvalidDataError,
  PersistenceMissingError,
  isPersistenceError,
} from "./persistence-errors";
import type {
  VersionedJsonRecord,
  VersionedJsonStore,
} from "./versioned-json-store";

export interface BlobCasGetResult {
  statusCode: 200 | 304;
  stream: ReadableStream<Uint8Array> | null;
  blob: {
    etag: string;
  };
}

export interface BlobCasPutResult {
  etag: string;
}

export interface BlobCasClient {
  get(
    pathname: string,
    options: {
      access: "private";
      useCache: false;
      token?: string;
    },
  ): Promise<BlobCasGetResult | null>;
  put(
    pathname: string,
    body: string,
    options: {
      access: "private";
      addRandomSuffix: false;
      allowOverwrite: boolean;
      contentType: "application/json";
      ifMatch?: string;
      token?: string;
    },
  ): Promise<BlobCasPutResult>;
  del(
    pathname: string,
    options: {
      ifMatch: string;
      token?: string;
    },
  ): Promise<void>;
}

export interface BlobVersionedJsonStoreOptions {
  pathnameForKey: (key: string) => string;
  token?: string;
  client?: BlobCasClient;
  randomId?: () => string;
}

export type BlobCasStoreOptions = BlobVersionedJsonStoreOptions;

type BlobOperation =
  "read" | "create" | "compare-and-set" | "compare-and-delete";

const BLOB_CAS_FORMAT = "blob-cas-v1";
const GENERATION_PATTERN = /^[a-f0-9]{32}$/;

interface BlobCasEnvelope<T> {
  format: typeof BLOB_CAS_FORMAT;
  key: string;
  generation: string;
  value: T;
}

const DEFAULT_BLOB_CLIENT: BlobCasClient = {
  async get(pathname, options) {
    const result = await vercelBlobGet(pathname, options);
    if (result === null) return null;
    return {
      statusCode: result.statusCode,
      stream: result.stream,
      blob: { etag: result.blob.etag },
    };
  },
  async put(pathname, body, options) {
    return vercelBlobPut(pathname, body, options);
  },
  async del(pathname, options) {
    await vercelBlobDelete(pathname, options);
  },
};

function assertNonEmptyEtag(etag: string, operation: BlobOperation): string {
  if (typeof etag !== "string" || etag.trim().length === 0) {
    throw new PersistenceInvalidDataError(
      `Blob ${operation} returned or received an empty ETag`,
    );
  }
  return etag;
}

function serializeEnvelope<T>(
  key: string,
  value: T,
  generation: string,
): { serialized: string; value: T } {
  try {
    const serialized = JSON.stringify({
      format: BLOB_CAS_FORMAT,
      key,
      generation,
      value,
    } satisfies BlobCasEnvelope<T>);
    if (serialized === undefined) {
      throw new TypeError("Value cannot be represented as JSON");
    }
    return {
      serialized,
      value: parseEnvelope<T>(serialized, key).value,
    };
  } catch (error) {
    if (isPersistenceError(error)) throw error;
    throw new PersistenceInvalidDataError(
      "Value cannot be represented as JSON",
      {
        cause: error,
      },
    );
  }
}

function decodeUtf8(
  decoder: TextDecoder,
  input?: Uint8Array,
  stream = false,
): string {
  try {
    return decoder.decode(input, { stream });
  } catch (error) {
    throw new PersistenceInvalidDataError("Blob contains invalid UTF-8", {
      cause: error,
    });
  }
}

async function readStreamText(
  stream: ReadableStream<Uint8Array>,
): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let text = "";
  let completed = false;

  try {
    while (true) {
      const result = await reader.read();
      if (result.done) break;
      text += decodeUtf8(decoder, result.value, true);
    }
    text += decodeUtf8(decoder);
    completed = true;
    return text;
  } finally {
    if (!completed) {
      try {
        await reader.cancel();
      } catch {
        // Preserve the primary read/decode error.
      }
    }
    reader.releaseLock();
  }
}

async function cancelStreamBestEffort(
  stream: ReadableStream<Uint8Array> | null,
): Promise<void> {
  if (stream === null) return;
  try {
    await stream.cancel();
  } catch {
    // Stream cleanup must not replace the already-known persistence error.
  }
}

function parseEnvelope<T>(
  serialized: string,
  expectedKey: string,
): BlobCasEnvelope<T> {
  try {
    const parsed = JSON.parse(serialized) as Partial<BlobCasEnvelope<T>> | null;
    if (
      parsed === null ||
      typeof parsed !== "object" ||
      parsed.format !== BLOB_CAS_FORMAT ||
      parsed.key !== expectedKey ||
      typeof parsed.generation !== "string" ||
      !GENERATION_PATTERN.test(parsed.generation) ||
      !Object.prototype.hasOwnProperty.call(parsed, "value")
    ) {
      throw new PersistenceInvalidDataError("Blob CAS envelope is invalid");
    }
    return parsed as BlobCasEnvelope<T>;
  } catch (error) {
    if (isPersistenceError(error)) throw error;
    throw new PersistenceInvalidDataError("Blob contains malformed JSON", {
      cause: error,
    });
  }
}

function nextGeneration(randomId: () => string): string {
  let generation: string;
  try {
    generation = randomId();
  } catch (error) {
    throw new PersistenceBackendFailureError("Blob CAS generation failed", {
      cause: error,
    });
  }
  if (!GENERATION_PATTERN.test(generation)) {
    throw new PersistenceInvalidDataError(
      "Blob CAS generation must be 32 lowercase hexadecimal characters",
    );
  }
  return generation;
}

function normalizeBlobError(error: unknown, operation: BlobOperation): never {
  if (isPersistenceError(error)) throw error;

  if (error instanceof BlobPreconditionFailedError) {
    throw new PersistenceConflictError(
      `Blob ${operation} precondition failed`,
      {
        cause: error,
      },
    );
  }

  if (error instanceof BlobNotFoundError) {
    if (operation === "read") {
      throw new PersistenceMissingError(`Blob is missing during ${operation}`, {
        cause: error,
      });
    }
    if (operation === "compare-and-set" || operation === "compare-and-delete") {
      throw new PersistenceConflictError(
        `Blob changed or disappeared during ${operation}`,
        { cause: error },
      );
    }
  }

  if (
    error instanceof BlobServiceNotAvailable ||
    error instanceof BlobServiceRateLimited ||
    error instanceof BlobStoreNotFoundError ||
    error instanceof BlobStoreSuspendedError ||
    error instanceof BlobRequestAbortedError
  ) {
    throw new PersistenceBackendUnavailableError(
      `Blob backend is unavailable during ${operation}`,
      { cause: error },
    );
  }

  if (error instanceof BlobError) {
    throw new PersistenceBackendFailureError(`Blob ${operation} failed`, {
      cause: error,
    });
  }

  throw new PersistenceBackendFailureError(`Blob ${operation} failed`, {
    cause: error,
  });
}

function isGenericBlobError(error: unknown): error is BlobError {
  return error instanceof BlobError && error.constructor === BlobError;
}

async function classifyGenericCreateFailure(
  client: BlobCasClient,
  pathname: string,
  tokenOptions: { token?: string },
  createError: BlobError,
): Promise<never> {
  try {
    const existing = await client.get(pathname, {
      access: "private",
      useCache: false,
      ...tokenOptions,
    });
    if (existing !== null) {
      try {
        await existing.stream?.cancel();
      } catch {
        // Existence is already proven; stream cleanup must not hide the conflict.
      }
      throw new PersistenceConflictError(
        "Blob create failed because the record already exists",
        { cause: createError },
      );
    }
  } catch (probeError) {
    if (isPersistenceError(probeError)) throw probeError;
    if (probeError instanceof BlobNotFoundError) {
      throw new PersistenceBackendFailureError("Blob create failed", {
        cause: createError,
      });
    }
    if (
      probeError instanceof BlobServiceNotAvailable ||
      probeError instanceof BlobServiceRateLimited ||
      probeError instanceof BlobStoreNotFoundError ||
      probeError instanceof BlobStoreSuspendedError ||
      probeError instanceof BlobRequestAbortedError
    ) {
      throw new PersistenceBackendUnavailableError(
        "Blob create classification probe is unavailable",
        { cause: probeError },
      );
    }
    throw new PersistenceBackendFailureError(
      "Blob create classification probe failed",
      { cause: probeError },
    );
  }

  throw new PersistenceBackendFailureError("Blob create failed", {
    cause: createError,
  });
}

export function createBlobVersionedJsonStore<T>(
  options: BlobVersionedJsonStoreOptions,
): VersionedJsonStore<T> {
  const client = options.client ?? DEFAULT_BLOB_CLIENT;
  const tokenOptions =
    options.token === undefined ? {} : { token: options.token };
  const randomId = options.randomId ?? (() => randomBytes(16).toString("hex"));

  const pathnameForKey = (key: string): string => {
    try {
      if (typeof key !== "string" || key.length === 0) {
        throw new PersistenceInvalidDataError("Blob key must not be empty");
      }
      const pathname = options.pathnameForKey(key);
      if (typeof pathname !== "string" || pathname.trim().length === 0) {
        throw new PersistenceInvalidDataError(
          "Blob pathname must not be empty",
        );
      }
      return pathname;
    } catch (error) {
      if (isPersistenceError(error)) throw error;
      throw new PersistenceInvalidDataError(
        "Blob key could not be mapped to a pathname",
        {
          cause: error,
        },
      );
    }
  };

  const read = async (key: string): Promise<VersionedJsonRecord<T>> => {
    try {
      const result = await client.get(pathnameForKey(key), {
        access: "private",
        useCache: false,
        ...tokenOptions,
      });
      if (result === null) {
        throw new PersistenceMissingError("Blob does not exist");
      }
      if (result.statusCode !== 200 || result.stream === null) {
        await cancelStreamBestEffort(result.stream);
        throw new PersistenceInvalidDataError(
          `Unexpected Blob read status ${result.statusCode}`,
        );
      }

      let version: string;
      try {
        version = assertNonEmptyEtag(result.blob.etag, "read");
      } catch (error) {
        await cancelStreamBestEffort(result.stream);
        throw error;
      }
      const envelope = parseEnvelope<T>(
        await readStreamText(result.stream),
        key,
      );
      return { value: envelope.value, version };
    } catch (error) {
      return normalizeBlobError(error, "read");
    }
  };

  return {
    read,
    async create(key, value) {
      const pathname = pathnameForKey(key);
      const normalized = serializeEnvelope(
        key,
        value,
        nextGeneration(randomId),
      );
      try {
        const result = await client.put(pathname, normalized.serialized, {
          access: "private",
          addRandomSuffix: false,
          allowOverwrite: false,
          contentType: "application/json",
          ...tokenOptions,
        });
        return {
          value: normalized.value,
          version: assertNonEmptyEtag(result.etag, "create"),
        };
      } catch (error) {
        if (isGenericBlobError(error)) {
          return classifyGenericCreateFailure(
            client,
            pathname,
            tokenOptions,
            error,
          );
        }
        return normalizeBlobError(error, "create");
      }
    },
    async compareAndSet(key, expectedVersion, value) {
      try {
        const ifMatch = assertNonEmptyEtag(expectedVersion, "compare-and-set");
        const normalized = serializeEnvelope(
          key,
          value,
          nextGeneration(randomId),
        );
        const result = await client.put(
          pathnameForKey(key),
          normalized.serialized,
          {
            access: "private",
            addRandomSuffix: false,
            allowOverwrite: true,
            contentType: "application/json",
            ifMatch,
            ...tokenOptions,
          },
        );
        return {
          value: normalized.value,
          version: assertNonEmptyEtag(result.etag, "compare-and-set"),
        };
      } catch (error) {
        return normalizeBlobError(error, "compare-and-set");
      }
    },
    async compareAndDelete(key, expectedVersion) {
      try {
        const ifMatch = assertNonEmptyEtag(
          expectedVersion,
          "compare-and-delete",
        );
        await client.del(pathnameForKey(key), {
          ifMatch,
          ...tokenOptions,
        });
      } catch (error) {
        return normalizeBlobError(error, "compare-and-delete");
      }
    },
  };
}

export const createBlobCasStore = createBlobVersionedJsonStore;
