import {
  BlobError,
  BlobNotFoundError,
  BlobPreconditionFailedError,
  BlobServiceNotAvailable,
  BlobServiceRateLimited,
  BlobStoreNotFoundError,
} from "@vercel/blob";
import { describe, expect, it, vi } from "vitest";

import { createBlobVersionedJsonStore, type BlobCasClient } from "../blob-cas";
import {
  PersistenceBackendFailureError,
  PersistenceBackendUnavailableError,
  PersistenceConflictError,
  PersistenceInvalidDataError,
  PersistenceMissingError,
} from "../persistence-errors";

type TestValue = { count: number; label?: string };

function generation(sequence: number): string {
  return sequence.toString(16).padStart(32, "0");
}

function blobEnvelope(value: unknown, sequence = 1, key = "item") {
  return {
    format: "blob-cas-v1",
    key,
    generation: generation(sequence),
    value,
  };
}

function jsonStream(value: unknown): ReadableStream<Uint8Array> {
  const bytes = new TextEncoder().encode(
    typeof value === "string" ? value : JSON.stringify(value),
  );
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    },
  });
}

function byteStream(bytes: number[]): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(Uint8Array.from(bytes));
      controller.close();
    },
  });
}

function nonClosingByteStream(
  bytes: number[],
  cancel: () => void | Promise<void>,
): ReadableStream<Uint8Array> {
  return new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(Uint8Array.from(bytes));
    },
    cancel,
  });
}

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((resolvePromise) => {
    resolve = resolvePromise;
  });
  return { promise, resolve };
}

class Barrier {
  private readonly allArrived = deferred();
  private readonly released = deferred();
  private arrivals = 0;

  constructor(private readonly expectedArrivals: number) {}

  async arrive(): Promise<void> {
    this.arrivals += 1;
    if (this.arrivals === this.expectedArrivals) this.allArrived.resolve();
    await this.released.promise;
  }

  async waitUntilAllArrive(): Promise<void> {
    await this.allArrived.promise;
  }

  release(): void {
    this.released.resolve();
  }
}

class AtomicFakeBlobClient implements BlobCasClient {
  readonly records = new Map<string, { body: string; etag: string }>();
  putBarrier: Barrier | undefined;
  deleteBarrier: Barrier | undefined;
  private revision = 0;

  forceWrite(pathname: string, value: TestValue): string {
    const etag = this.nextEtag();
    const key = pathname.replace(/^cas\//, "").replace(/\.json$/, "");
    this.records.set(pathname, {
      body: JSON.stringify(blobEnvelope(value, this.revision, key)),
      etag,
    });
    return etag;
  }

  async get(pathname: string) {
    const record = this.records.get(pathname);
    if (!record) return null;
    return {
      statusCode: 200 as const,
      stream: jsonStream(record.body),
      blob: { etag: record.etag },
    };
  }

  async put(
    pathname: string,
    body: string,
    options: Parameters<BlobCasClient["put"]>[2],
  ) {
    await this.putBarrier?.arrive();
    const current = this.records.get(pathname);

    if (options.ifMatch !== undefined) {
      if (!current || current.etag !== options.ifMatch) {
        throw new BlobPreconditionFailedError();
      }
    } else if (!options.allowOverwrite && current) {
      throw new BlobPreconditionFailedError();
    }

    const etag = this.nextEtag();
    this.records.set(pathname, { body, etag });
    return { etag };
  }

  async del(
    pathname: string,
    options: Parameters<BlobCasClient["del"]>[1],
  ): Promise<void> {
    await this.deleteBarrier?.arrive();
    const current = this.records.get(pathname);
    if (!current) throw new BlobNotFoundError();
    if (current.etag !== options.ifMatch) {
      throw new BlobPreconditionFailedError();
    }
    this.records.delete(pathname);
  }

  private nextEtag(): string {
    this.revision += 1;
    return `etag-${this.revision}`;
  }
}

class ContentDerivedFakeBlobClient implements BlobCasClient {
  private readonly records = new Map<string, { body: string; etag: string }>();

  async get(pathname: string) {
    const record = this.records.get(pathname);
    if (!record) return null;
    return {
      statusCode: 200 as const,
      stream: jsonStream(record.body),
      blob: { etag: record.etag },
    };
  }

  async put(
    pathname: string,
    body: string,
    options: Parameters<BlobCasClient["put"]>[2],
  ) {
    const current = this.records.get(pathname);
    if (options.ifMatch !== undefined) {
      if (!current || current.etag !== options.ifMatch) {
        throw new BlobPreconditionFailedError();
      }
    } else if (!options.allowOverwrite && current) {
      throw new BlobPreconditionFailedError();
    }

    const etag = `content:${body}`;
    this.records.set(pathname, { body, etag });
    return { etag };
  }

  async del(
    pathname: string,
    options: Parameters<BlobCasClient["del"]>[1],
  ): Promise<void> {
    const current = this.records.get(pathname);
    if (!current) throw new BlobNotFoundError();
    if (current.etag !== options.ifMatch) {
      throw new BlobPreconditionFailedError();
    }
    this.records.delete(pathname);
  }
}

function createStore(client: BlobCasClient, token?: string) {
  let sequence = 0;
  return createBlobVersionedJsonStore<TestValue>({
    pathnameForKey: (key) => `cas/${key}.json`,
    client,
    token,
    randomId: () => generation((sequence += 1)),
  });
}

describe("createBlobVersionedJsonStore", () => {
  it("reads private origin content and returns the provider ETag as version", async () => {
    const get = vi.fn<BlobCasClient["get"]>().mockResolvedValue({
      statusCode: 200,
      stream: jsonStream(blobEnvelope({ count: 2, label: "fresh" })),
      blob: { etag: "etag-read" },
    });
    const client: BlobCasClient = {
      get,
      put: vi.fn(),
      del: vi.fn(),
    };

    const record = await createStore(client, "test-token").read("item");

    expect(record).toEqual({
      value: { count: 2, label: "fresh" },
      version: "etag-read",
    });
    expect(get).toHaveBeenCalledWith("cas/item.json", {
      access: "private",
      useCache: false,
      token: "test-token",
    });
  });

  it("treats only null and the provider not-found class as missing reads", async () => {
    const nullClient: BlobCasClient = {
      get: vi.fn().mockResolvedValue(null),
      put: vi.fn(),
      del: vi.fn(),
    };
    const notFoundClient: BlobCasClient = {
      get: vi.fn().mockRejectedValue(new BlobNotFoundError()),
      put: vi.fn(),
      del: vi.fn(),
    };

    await expect(
      createStore(nullClient).read("missing"),
    ).rejects.toBeInstanceOf(PersistenceMissingError);
    await expect(
      createStore(notFoundClient).read("missing"),
    ).rejects.toBeInstanceOf(PersistenceMissingError);
  });

  it("rejects malformed JSON, impossible 304 reads, and empty ETags as invalid data", async () => {
    const malformed: BlobCasClient = {
      get: vi.fn().mockResolvedValue({
        statusCode: 200,
        stream: jsonStream("{not-json"),
        blob: { etag: "etag-valid" },
      }),
      put: vi.fn(),
      del: vi.fn(),
    };
    const notModified: BlobCasClient = {
      get: vi.fn().mockResolvedValue({
        statusCode: 304,
        stream: null,
        blob: { etag: "etag-valid" },
      }),
      put: vi.fn(),
      del: vi.fn(),
    };
    const emptyEtag: BlobCasClient = {
      get: vi.fn().mockResolvedValue({
        statusCode: 200,
        stream: jsonStream(blobEnvelope({ count: 1 })),
        blob: { etag: "   " },
      }),
      put: vi.fn(),
      del: vi.fn(),
    };
    const unenveloped: BlobCasClient = {
      get: vi.fn().mockResolvedValue({
        statusCode: 200,
        stream: jsonStream({ count: 1 }),
        blob: { etag: "etag-valid" },
      }),
      put: vi.fn(),
      del: vi.fn(),
    };
    const wrongKey: BlobCasClient = {
      get: vi.fn().mockResolvedValue({
        statusCode: 200,
        stream: jsonStream(blobEnvelope({ count: 1 }, 1, "other")),
        blob: { etag: "etag-valid" },
      }),
      put: vi.fn(),
      del: vi.fn(),
    };

    await expect(createStore(malformed).read("item")).rejects.toBeInstanceOf(
      PersistenceInvalidDataError,
    );
    await expect(createStore(notModified).read("item")).rejects.toBeInstanceOf(
      PersistenceInvalidDataError,
    );
    await expect(createStore(emptyEtag).read("item")).rejects.toBeInstanceOf(
      PersistenceInvalidDataError,
    );
    await expect(createStore(unenveloped).read("item")).rejects.toBeInstanceOf(
      PersistenceInvalidDataError,
    );
    await expect(createStore(wrongKey).read("item")).rejects.toBeInstanceOf(
      PersistenceInvalidDataError,
    );
  });

  it("rejects invalid UTF-8 instead of replacing corrupt bytes", async () => {
    const client: BlobCasClient = {
      get: vi.fn().mockResolvedValue({
        statusCode: 200,
        stream: byteStream([0xc3, 0x28]),
        blob: { etag: "etag-valid" },
      }),
      put: vi.fn(),
      del: vi.fn(),
    };

    await expect(createStore(client).read("item")).rejects.toBeInstanceOf(
      PersistenceInvalidDataError,
    );
  });

  it("cancels a non-closing corrupt stream without letting cancel failure replace invalid data", async () => {
    const successfulCancel = vi.fn().mockResolvedValue(undefined);
    const rejectedCancel = vi
      .fn()
      .mockRejectedValue(new Error("cancel failed"));

    for (const [client, cancel] of [
      [
        {
          get: vi.fn().mockResolvedValue({
            statusCode: 200,
            stream: nonClosingByteStream([0xc3, 0x28], successfulCancel),
            blob: { etag: "etag-valid" },
          }),
          put: vi.fn(),
          del: vi.fn(),
        } satisfies BlobCasClient,
        successfulCancel,
      ],
      [
        {
          get: vi.fn().mockResolvedValue({
            statusCode: 200,
            stream: nonClosingByteStream([0xc3, 0x28], rejectedCancel),
            blob: { etag: "etag-valid" },
          }),
          put: vi.fn(),
          del: vi.fn(),
        } satisfies BlobCasClient,
        rejectedCancel,
      ],
    ] as const) {
      await expect(createStore(client).read("item")).rejects.toBeInstanceOf(
        PersistenceInvalidDataError,
      );
      expect(cancel).toHaveBeenCalledOnce();
    }
  });

  it("cancels non-null bodies rejected before decoding", async () => {
    const emptyEtagCancel = vi.fn().mockResolvedValue(undefined);
    const statusCancel = vi.fn().mockRejectedValue(new Error("cancel failed"));
    const emptyEtag: BlobCasClient = {
      get: vi.fn().mockResolvedValue({
        statusCode: 200,
        stream: {
          cancel: emptyEtagCancel,
        } as unknown as ReadableStream<Uint8Array>,
        blob: { etag: "" },
      }),
      put: vi.fn(),
      del: vi.fn(),
    };
    const unexpectedStatus: BlobCasClient = {
      get: vi.fn().mockResolvedValue({
        statusCode: 304,
        stream: {
          cancel: statusCancel,
        } as unknown as ReadableStream<Uint8Array>,
        blob: { etag: "etag-valid" },
      }),
      put: vi.fn(),
      del: vi.fn(),
    };

    await expect(createStore(emptyEtag).read("item")).rejects.toBeInstanceOf(
      PersistenceInvalidDataError,
    );
    await expect(
      createStore(unexpectedStatus).read("item"),
    ).rejects.toBeInstanceOf(PersistenceInvalidDataError);
    expect(emptyEtagCancel).toHaveBeenCalledOnce();
    expect(statusCancel).toHaveBeenCalledOnce();
  });

  it("uses create-only put and conditional overwrite/delete options without blind writes", async () => {
    const put = vi
      .fn<BlobCasClient["put"]>()
      .mockResolvedValueOnce({ etag: "etag-created" })
      .mockResolvedValueOnce({ etag: "etag-updated" });
    const del = vi.fn<BlobCasClient["del"]>().mockResolvedValue(undefined);
    const client: BlobCasClient = {
      get: vi.fn(),
      put,
      del,
    };
    const store = createStore(client, "test-token");

    await expect(store.create("item", { count: 1 })).resolves.toEqual({
      value: { count: 1 },
      version: "etag-created",
    });
    await expect(
      store.compareAndSet("item", "etag-created", { count: 2 }),
    ).resolves.toEqual({
      value: { count: 2 },
      version: "etag-updated",
    });
    await expect(
      store.compareAndDelete("item", "etag-updated"),
    ).resolves.toBeUndefined();

    expect(put).toHaveBeenNthCalledWith(
      1,
      "cas/item.json",
      JSON.stringify(blobEnvelope({ count: 1 }, 1)),
      {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: false,
        contentType: "application/json",
        token: "test-token",
      },
    );
    expect(put).toHaveBeenNthCalledWith(
      2,
      "cas/item.json",
      JSON.stringify(blobEnvelope({ count: 2 }, 2)),
      {
        access: "private",
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: "application/json",
        ifMatch: "etag-created",
        token: "test-token",
      },
    );
    expect(del).toHaveBeenCalledWith("cas/item.json", {
      ifMatch: "etag-updated",
      token: "test-token",
    });
  });

  it("maps provider preconditions to conflict and rejects empty conditional versions", async () => {
    const client: BlobCasClient = {
      get: vi.fn(),
      put: vi.fn().mockRejectedValue(new BlobPreconditionFailedError()),
      del: vi.fn().mockRejectedValue(new BlobPreconditionFailedError()),
    };
    const store = createStore(client);

    await expect(store.create("item", { count: 1 })).rejects.toBeInstanceOf(
      PersistenceConflictError,
    );
    await expect(
      store.compareAndSet("item", "stale", { count: 2 }),
    ).rejects.toBeInstanceOf(PersistenceConflictError);
    await expect(
      store.compareAndDelete("item", "stale"),
    ).rejects.toBeInstanceOf(PersistenceConflictError);
    await expect(
      store.compareAndSet("item", " ", { count: 2 }),
    ).rejects.toBeInstanceOf(PersistenceInvalidDataError);
    await expect(store.compareAndDelete("item", "")).rejects.toBeInstanceOf(
      PersistenceInvalidDataError,
    );
  });

  it("maps a missing conditional target to conflict because expected state changed", async () => {
    const client: BlobCasClient = {
      get: vi.fn(),
      put: vi.fn().mockRejectedValue(new BlobNotFoundError()),
      del: vi.fn().mockRejectedValue(new BlobNotFoundError()),
    };
    const store = createStore(client);

    await expect(
      store.compareAndSet("item", "etag-old", { count: 2 }),
    ).rejects.toBeInstanceOf(PersistenceConflictError);
    await expect(
      store.compareAndDelete("item", "etag-old"),
    ).rejects.toBeInstanceOf(PersistenceConflictError);
  });

  it("does not misclassify a provider not-found during create as a missing record read", async () => {
    const client: BlobCasClient = {
      get: vi.fn(),
      put: vi.fn().mockRejectedValue(new BlobNotFoundError()),
      del: vi.fn(),
    };

    await expect(
      createStore(client).create("item", { count: 1 }),
    ).rejects.toBeInstanceOf(PersistenceBackendFailureError);
  });

  it("classifies a generic create bad-request as conflict only when a post-failure probe finds the record", async () => {
    const cancel = vi.fn().mockResolvedValue(undefined);
    const get = vi.fn<BlobCasClient["get"]>().mockResolvedValue({
      statusCode: 200,
      stream: { cancel } as unknown as ReadableStream<Uint8Array>,
      blob: { etag: "etag-existing" },
    });
    const client: BlobCasClient = {
      get,
      put: vi.fn().mockRejectedValue(new BlobError("bad request")),
      del: vi.fn(),
    };

    await expect(
      createStore(client, "test-token").create("item", { count: 1 }),
    ).rejects.toBeInstanceOf(PersistenceConflictError);
    expect(get).toHaveBeenCalledWith("cas/item.json", {
      access: "private",
      useCache: false,
      token: "test-token",
    });
    expect(cancel).toHaveBeenCalledOnce();
  });

  it("keeps a proven create conflict when existence-probe stream cancellation fails", async () => {
    const cancel = vi.fn().mockRejectedValue(new Error("cancel failed"));
    const client: BlobCasClient = {
      get: vi.fn().mockResolvedValue({
        statusCode: 200,
        stream: { cancel } as unknown as ReadableStream<Uint8Array>,
        blob: { etag: "etag-existing" },
      }),
      put: vi.fn().mockRejectedValue(new BlobError("bad request")),
      del: vi.fn(),
    };

    await expect(
      createStore(client).create("item", { count: 1 }),
    ).rejects.toBeInstanceOf(PersistenceConflictError);
    expect(cancel).toHaveBeenCalledOnce();
  });

  it("keeps a generic create error as backend failure when the post-failure probe is absent", async () => {
    const client: BlobCasClient = {
      get: vi.fn().mockResolvedValue(null),
      put: vi.fn().mockRejectedValue(new BlobError("bad request")),
      del: vi.fn(),
    };

    await expect(
      createStore(client).create("item", { count: 1 }),
    ).rejects.toBeInstanceOf(PersistenceBackendFailureError);
  });

  it("reports an unavailable post-failure existence probe honestly", async () => {
    const client: BlobCasClient = {
      get: vi.fn().mockRejectedValue(new BlobServiceNotAvailable()),
      put: vi.fn().mockRejectedValue(new BlobError("bad request")),
      del: vi.fn(),
    };

    await expect(
      createStore(client).create("item", { count: 1 }),
    ).rejects.toBeInstanceOf(PersistenceBackendUnavailableError);
  });

  it("rejects mapper failures and empty returned write ETags as invalid data", async () => {
    const client: BlobCasClient = {
      get: vi.fn(),
      put: vi.fn().mockResolvedValue({ etag: "" }),
      del: vi.fn(),
    };
    const mapperFailure = createBlobVersionedJsonStore<TestValue>({
      pathnameForKey() {
        throw new Error("mapper detail");
      },
      client,
    });

    await expect(mapperFailure.read("item")).rejects.toBeInstanceOf(
      PersistenceInvalidDataError,
    );
    await expect(
      createStore(client).create("item", { count: 1 }),
    ).rejects.toBeInstanceOf(PersistenceInvalidDataError);
    await expect(
      createStore(client).compareAndSet("item", "etag-old", { count: 2 }),
    ).rejects.toBeInstanceOf(PersistenceInvalidDataError);
  });

  it.each([
    new BlobServiceNotAvailable(),
    new BlobServiceRateLimited(1),
    new BlobStoreNotFoundError(),
  ])(
    "normalizes unavailable provider errors without exposing provider details",
    async (error) => {
      const client: BlobCasClient = {
        get: vi.fn().mockRejectedValue(error),
        put: vi.fn(),
        del: vi.fn(),
      };

      await expect(createStore(client).read("item")).rejects.toBeInstanceOf(
        PersistenceBackendUnavailableError,
      );
    },
  );

  it.each([new BlobError("provider detail"), new Error("network detail")])(
    "normalizes other provider and runtime failures as backend failures",
    async (error) => {
      const client: BlobCasClient = {
        get: vi.fn().mockRejectedValue(error),
        put: vi.fn(),
        del: vi.fn(),
      };

      await expect(createStore(client).read("item")).rejects.toBeInstanceOf(
        PersistenceBackendFailureError,
      );
    },
  );

  it("allows exactly one of two same-version conditional writes to win", async () => {
    const client = new AtomicFakeBlobClient();
    const initialEtag = client.forceWrite("cas/item.json", { count: 0 });
    const barrier = new Barrier(2);
    client.putBarrier = barrier;
    const store = createStore(client);

    const first = store.compareAndSet("item", initialEtag, { count: 1 });
    const second = store.compareAndSet("item", initialEtag, { count: 2 });
    await barrier.waitUntilAllArrive();
    barrier.release();
    const results = await Promise.allSettled([first, second]);

    expect(
      results.filter((result) => result.status === "fulfilled"),
    ).toHaveLength(1);
    const rejected = results.find((result) => result.status === "rejected");
    expect(rejected).toMatchObject({
      status: "rejected",
      reason: expect.any(PersistenceConflictError),
    });
    const current = await store.read("item");
    expect([1, 2]).toContain(current.value.count);
    expect(current.version).not.toBe(initialEtag);
  });

  it("allows exactly one of two duplicate creates to win", async () => {
    const client = new AtomicFakeBlobClient();
    const barrier = new Barrier(2);
    client.putBarrier = barrier;
    const store = createStore(client);

    const first = store.create("item", { count: 1 });
    const second = store.create("item", { count: 2 });
    await barrier.waitUntilAllArrive();
    barrier.release();
    const results = await Promise.allSettled([first, second]);

    expect(
      results.filter((result) => result.status === "fulfilled"),
    ).toHaveLength(1);
    expect(results.filter((result) => result.status === "rejected")).toEqual([
      expect.objectContaining({
        reason: expect.any(PersistenceConflictError),
      }),
    ]);
    expect([1, 2]).toContain((await store.read("item")).value.count);
  });

  it("cannot conditionally delete a newer version", async () => {
    const client = new AtomicFakeBlobClient();
    const staleEtag = client.forceWrite("cas/item.json", { count: 1 });
    const barrier = new Barrier(1);
    client.deleteBarrier = barrier;
    const store = createStore(client);

    const deletion = store.compareAndDelete("item", staleEtag);
    await barrier.waitUntilAllArrive();
    const newerEtag = client.forceWrite("cas/item.json", { count: 2 });
    barrier.release();

    await expect(deletion).rejects.toBeInstanceOf(PersistenceConflictError);
    await expect(store.read("item")).resolves.toEqual({
      value: { count: 2 },
      version: newerEtag,
    });
  });

  it("rejects an old token after same-value delete and recreate with content-derived ETags", async () => {
    const client = new ContentDerivedFakeBlobClient();
    let sequence = 0;
    const store = createBlobVersionedJsonStore<TestValue>({
      pathnameForKey: (key) => `cas/${key}.json`,
      client,
      randomId: () => generation((sequence += 1)),
    });

    const first = await store.create("aba", { count: 1 });
    await store.compareAndDelete("aba", first.version);
    const recreated = await store.create("aba", { count: 1 });

    expect(recreated.version).not.toBe(first.version);
    await expect(
      store.compareAndSet("aba", first.version, { count: 2 }),
    ).rejects.toBeInstanceOf(PersistenceConflictError);
    await expect(store.read("aba")).resolves.toEqual(recreated);
  });

  it("returns the JSON-persisted representation from create and compare-and-set", async () => {
    type JsonSemanticsValue = { finite: number | null; omitted?: string };
    const client = new AtomicFakeBlobClient();
    const store = createBlobVersionedJsonStore<JsonSemanticsValue>({
      pathnameForKey: (key) => `cas/${key}.json`,
      client,
    });
    const lossyInput = {
      finite: Number.NaN,
      omitted: undefined,
    } as unknown as JsonSemanticsValue;

    const created = await store.create("json-semantics", lossyInput);
    expect(created.value).toEqual({ finite: null });
    await expect(store.read("json-semantics")).resolves.toEqual(created);

    const updated = await store.compareAndSet(
      "json-semantics",
      created.version,
      lossyInput,
    );
    expect(updated.value).toEqual({ finite: null });
    await expect(store.read("json-semantics")).resolves.toEqual(updated);
  });
});
