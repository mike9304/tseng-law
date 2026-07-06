import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mkdtemp, rm } from 'fs/promises';
import os from 'os';
import path from 'path';
import { randomUUID } from 'crypto';
import {
  __resetSharedAssetStorageRootForTests,
  __setSharedAssetStorageRootForTests,
  deleteSharedAsset,
  listSharedAssets,
  readSharedAsset,
  summarizeSharedAssets,
  uploadSharedAsset,
} from '@/lib/builder/workspace/shared-assets';

type MockPutBody = string | Uint8Array | ArrayBuffer | Blob | ReadableStream<Uint8Array>;
type MockPutOptions = {
  readonly contentType?: string;
};

const blobStore = vi.hoisted(() => ({
  objects: new Map<string, {
    readonly body: Uint8Array;
    readonly contentType: string;
    readonly uploadedAt: Date;
  }>(),
}));

async function bytesFromMockBody(body: MockPutBody): Promise<Uint8Array> {
  if (typeof body === 'string') return new TextEncoder().encode(body);
  if (body instanceof Uint8Array) return new Uint8Array(body);
  if (body instanceof ArrayBuffer) return new Uint8Array(body);
  if (body instanceof Blob) return new Uint8Array(await body.arrayBuffer());
  return new Uint8Array(await new Response(body).arrayBuffer());
}

function arrayBufferFromBytes(bytes: Uint8Array): ArrayBuffer {
  const copy = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(copy).set(bytes);
  return copy;
}

vi.mock('@vercel/blob', () => ({
  put: vi.fn(async (pathname: string, body: MockPutBody, options: MockPutOptions) => {
    const contentType = options.contentType ?? 'application/octet-stream';
    blobStore.objects.set(pathname, {
      body: await bytesFromMockBody(body),
      contentType,
      uploadedAt: new Date('2026-06-21T00:00:00.000Z'),
    });
    return {
      url: `https://blob.example/${pathname}`,
      downloadUrl: `https://blob.example/${pathname}?download=1`,
      pathname,
      contentType,
      contentDisposition: 'inline',
      etag: `etag-${pathname}`,
    };
  }),
  get: vi.fn(async (pathname: string) => {
    const item = blobStore.objects.get(pathname);
    if (!item) return null;
    return {
      stream: new Blob([arrayBufferFromBytes(item.body)], { type: item.contentType }).stream(),
      blob: {
        pathname,
        size: item.body.byteLength,
        uploadedAt: item.uploadedAt,
        contentType: item.contentType,
      },
      headers: new Headers(),
    };
  }),
  list: vi.fn(async (options?: { readonly prefix?: string; readonly limit?: number }) => {
    const prefix = options?.prefix ?? '';
    const limit = options?.limit ?? 1000;
    const blobs = Array.from(blobStore.objects.entries())
      .filter(([pathname]) => pathname.startsWith(prefix))
      .slice(0, limit)
      .map(([pathname, item]) => ({
        url: `https://blob.example/${pathname}`,
        downloadUrl: `https://blob.example/${pathname}?download=1`,
        pathname,
        size: item.body.byteLength,
        uploadedAt: item.uploadedAt,
        etag: `etag-${pathname}`,
      }));
    return { blobs, hasMore: false };
  }),
  del: vi.fn(async (pathname: string) => {
    blobStore.objects.delete(pathname);
  }),
}));

let tempDir: string;
const previousBlobToken = process.env.BLOB_READ_WRITE_TOKEN;
const previousSharedAssetsBackend = process.env.BUILDER_SHARED_ASSETS_BACKEND;

beforeEach(async () => {
  tempDir = await mkdtemp(path.join(os.tmpdir(), `workspace-assets-${randomUUID()}-`));
  __setSharedAssetStorageRootForTests(tempDir);
  delete process.env.BLOB_READ_WRITE_TOKEN;
  delete process.env.BUILDER_SHARED_ASSETS_BACKEND;
  blobStore.objects.clear();
});

afterEach(async () => {
  __resetSharedAssetStorageRootForTests();
  if (previousBlobToken === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
  else process.env.BLOB_READ_WRITE_TOKEN = previousBlobToken;
  if (previousSharedAssetsBackend === undefined) delete process.env.BUILDER_SHARED_ASSETS_BACKEND;
  else process.env.BUILDER_SHARED_ASSETS_BACKEND = previousSharedAssetsBackend;
  await rm(tempDir, { recursive: true, force: true });
});

describe('workspace shared assets', () => {
  it('stores validated image bytes when the upload signature matches the MIME type', async () => {
    const file = new File(
      [new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
      'Office Hero.PNG',
      { type: 'image/png' },
    );

    const uploaded = await uploadSharedAsset({ file, locale: 'ko' });
    const assets = await listSharedAssets();
    const read = await readSharedAsset(uploaded.filename);

    expect(uploaded.filename).toMatch(/^office-hero-[0-9a-f-]+\.png$/);
    expect(assets).toHaveLength(1);
    expect(read).not.toBeNull();
    if (!read) return;
    expect(read.contentType).toBe('image/png');
    expect(Array.from(read.content)).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  });

  it('summarizes all local shared assets without using the UI list cap', async () => {
    const png = new File(
      [new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
      'hero.png',
      { type: 'image/png' },
    );
    const svg = new File(['<svg><rect /></svg>'], 'badge.svg', { type: 'image/svg+xml' });

    const first = await uploadSharedAsset({ file: png, locale: 'ko' });
    const second = await uploadSharedAsset({ file: svg, locale: 'ko' });
    const summary = await summarizeSharedAssets();

    expect(summary.count).toBe(2);
    expect(summary.totalBytes).toBe(first.size + second.size);
    expect(summary.latestUploadedAt).not.toBeNull();
  });

  it('rejects direct uploads when claimed MIME does not match image bytes', async () => {
    const forged = new File(['not really an image'], 'forged.png', { type: 'image/png' });

    await expect(uploadSharedAsset({ file: forged, locale: 'ko' })).rejects.toThrow(/signature|시그니처/i);
    await expect(listSharedAssets()).resolves.toEqual([]);
  });

  it('stores sanitized SVG bytes when the source contains removable script handlers', async () => {
    const svg = '<svg onload="evil()"><script>alert(1)</script><rect onclick="evil()" /></svg>';
    const file = new File([svg], 'badge.svg', { type: 'image/svg+xml' });

    const uploaded = await uploadSharedAsset({ file, locale: 'en' });
    const read = await readSharedAsset(uploaded.filename);

    expect(read).not.toBeNull();
    if (!read) return;
    const stored = read.content.toString('utf8');
    expect(stored).toContain('<svg');
    expect(stored).toContain('<rect');
    expect(stored).not.toContain('<script');
    expect(stored).not.toContain('onload');
    expect(stored).not.toContain('onclick');
  });

  it('stores, lists, reads, and deletes shared assets through Blob when explicitly enabled', async () => {
    process.env.BLOB_READ_WRITE_TOKEN = 'test-token';
    process.env.BUILDER_SHARED_ASSETS_BACKEND = 'blob';
    const file = new File(
      [new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])],
      'Office Hero.PNG',
      { type: 'image/png' },
    );

    const uploaded = await uploadSharedAsset({ file, locale: 'ko' });
    const pathname = `builder-workspace/assets/${uploaded.filename}`;
    const assets = await listSharedAssets();
    const read = await readSharedAsset(uploaded.filename);

    expect(blobStore.objects.has(pathname)).toBe(true);
    expect(assets).toEqual([
      expect.objectContaining({
        filename: uploaded.filename,
        contentType: 'image/png',
        pathname,
        url: `/api/builder/workspace/assets/${uploaded.filename}`,
      }),
    ]);
    expect(read).not.toBeNull();
    if (!read) return;
    expect(Array.from(read.content)).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    await expect(summarizeSharedAssets()).resolves.toEqual({
      count: 1,
      totalBytes: uploaded.size,
      latestUploadedAt: '2026-06-21T00:00:00.000Z',
    });
    const removed = await deleteSharedAsset(uploaded.filename);
    expect(removed).toBe(true);
    expect(blobStore.objects.has(pathname)).toBe(false);
  });
});
