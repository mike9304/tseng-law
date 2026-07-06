import { del, get, list, put } from '@vercel/blob';
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'fs/promises';
import path from 'path';
import {
  buildSharedAssetUrl,
  inferSharedAssetContentType,
  sharedAssetBlobPathname,
  SHARED_ASSET_BLOB_PREFIX,
  type SharedAssetBackend,
  type SharedAssetListItem,
  type SharedAssetMimeType,
  type SharedAssetReadResult,
  type SharedAssetSummary,
} from '@/lib/builder/workspace/shared-assets-types';
import {
  emptySharedAssetSummary,
  mergeSharedAssetSummaries,
  summarizeSharedAssetListItems,
} from './shared-assets-summary';

interface SharedAssetWriteInput {
  readonly filename: string;
  readonly content: Buffer;
  readonly contentType: SharedAssetMimeType;
}

interface SharedAssetStore {
  readonly backend: SharedAssetBackend;
  write(input: SharedAssetWriteInput): Promise<void>;
  list(limit: number): Promise<SharedAssetListItem[]>;
  summarize(): Promise<SharedAssetSummary>;
  read(filename: string, contentType: SharedAssetMimeType): Promise<SharedAssetReadResult | null>;
  delete(filename: string): Promise<boolean>;
}

const BLOB_LIST_PAGE_SIZE = 1000;

let sharedAssetStorageRoot: string | null = null;

function defaultSharedAssetStorageRoot(): string {
  return path.join(process.cwd(), 'runtime-data', 'workspace', 'assets');
}

function sharedAssetDir(): string {
  return sharedAssetStorageRoot ?? defaultSharedAssetStorageRoot();
}

export function __setSharedAssetStorageRootForTests(root: string): void {
  sharedAssetStorageRoot = root;
}

export function __resetSharedAssetStorageRootForTests(): void {
  sharedAssetStorageRoot = null;
}

export function resolveSharedAssetBackend(): SharedAssetBackend {
  const override = process.env.BUILDER_SHARED_ASSETS_BACKEND?.trim().toLowerCase();
  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) return 'file';
  if (process.env.CONSULTATION_LOG_BACKEND === 'local') return 'file';
  if (override === 'local' || override === 'file') return 'file';
  if (override === 'blob') return 'blob';
  if (process.env.NODE_ENV === 'production') return 'blob';
  return process.env.BUILDER_USE_BLOB_IN_DEV === '1' ? 'blob' : 'file';
}

export function resolveSharedAssetStore(): SharedAssetStore {
  return resolveSharedAssetBackend() === 'blob'
    ? createBlobSharedAssetStore()
    : createFileSharedAssetStore();
}

function createBlobSharedAssetStore(): SharedAssetStore {
  return {
    backend: 'blob',
    async write(input) {
      await put(sharedAssetBlobPathname(input.filename), input.content, {
        access: 'private',
        allowOverwrite: false,
        contentType: input.contentType,
      });
    },
    async list(limit) {
      const prefix = `${SHARED_ASSET_BLOB_PREFIX}/`;
      const result = await list({ prefix, limit });
      return result.blobs
        .map((blob) => blobToSharedAssetListItem(blob.pathname, blob.size, blob.uploadedAt))
        .filter((item): item is SharedAssetListItem => item !== null)
        .sort(compareSharedAssetListItems)
        .slice(0, limit);
    },
    async summarize() {
      const prefix = `${SHARED_ASSET_BLOB_PREFIX}/`;
      let cursor: string | undefined;
      let summary = emptySharedAssetSummary();
      while (true) {
        const result = await list({ prefix, limit: BLOB_LIST_PAGE_SIZE, cursor });
        const pageSummary = summarizeSharedAssetListItems(
          result.blobs
            .map((blob) => blobToSharedAssetListItem(blob.pathname, blob.size, blob.uploadedAt))
            .filter((item): item is SharedAssetListItem => item !== null),
        );
        summary = mergeSharedAssetSummaries(summary, pageSummary);
        if (!result.hasMore || !result.cursor) return summary;
        cursor = result.cursor;
      }
    },
    async read(filename, contentType) {
      try {
        const result = await get(sharedAssetBlobPathname(filename), {
          access: 'private',
          useCache: false,
        });
        if (!result?.stream) return null;
        const content = Buffer.from(await new Response(result.stream).arrayBuffer());
        return { content, contentType };
      } catch (error) {
        if (isBlobNotFoundError(error)) return null;
        throw error;
      }
    },
    async delete(filename) {
      const pathname = sharedAssetBlobPathname(filename);
      try {
        const existing = await get(pathname, {
          access: 'private',
          useCache: false,
        });
        if (!existing) return false;
        await del(pathname);
        return true;
      } catch (error) {
        if (isBlobNotFoundError(error)) return false;
        throw error;
      }
    },
  };
}

function createFileSharedAssetStore(): SharedAssetStore {
  return {
    backend: 'file',
    async write(input) {
      await mkdir(sharedAssetDir(), { recursive: true, mode: 0o700 });
      await writeFile(path.join(sharedAssetDir(), input.filename), input.content, { mode: 0o600 });
    },
    async list(limit) {
      return (await listFileSharedAssetItems()).slice(0, limit);
    },
    async summarize() {
      return summarizeSharedAssetListItems(await listFileSharedAssetItems());
    },
    async read(filename, contentType) {
      try {
        const content = await readFile(path.join(sharedAssetDir(), filename));
        return { content, contentType };
      } catch (error) {
        if (isNodeNotFoundError(error)) return null;
        throw error;
      }
    },
    async delete(filename) {
      try {
        await rm(path.join(sharedAssetDir(), filename), { force: false });
        return true;
      } catch (error) {
        if (isNodeNotFoundError(error)) return false;
        throw error;
      }
    },
  };
}

async function listFileSharedAssetItems(): Promise<SharedAssetListItem[]> {
  try {
    const entries = await readdir(sharedAssetDir(), { withFileTypes: true });
    const items = await Promise.all(
      entries
        .filter((entry) => entry.isFile())
        .map(async (entry) => fileEntryToSharedAssetListItem(entry.name)),
    );
    return items
      .filter((item): item is SharedAssetListItem => item !== null)
      .sort(compareSharedAssetListItems);
  } catch (error) {
    if (isNodeNotFoundError(error)) return [];
    throw error;
  }
}

function blobToSharedAssetListItem(
  pathname: string,
  size: number,
  uploadedAt: Date,
): SharedAssetListItem | null {
  const prefix = `${SHARED_ASSET_BLOB_PREFIX}/`;
  if (!pathname.startsWith(prefix)) return null;
  const filename = pathname.slice(prefix.length);
  const contentType = inferSharedAssetContentType(filename);
  if (!filename || !contentType) return null;
  return {
    filename,
    contentType,
    size,
    uploadedAt: uploadedAt.toISOString(),
    url: buildSharedAssetUrl(filename),
    pathname,
  };
}

async function fileEntryToSharedAssetListItem(filename: string): Promise<SharedAssetListItem | null> {
  const contentType = inferSharedAssetContentType(filename);
  if (!contentType) return null;
  const meta = await stat(path.join(sharedAssetDir(), filename));
  return {
    filename,
    contentType,
    size: meta.size,
    uploadedAt: meta.mtime.toISOString(),
    url: buildSharedAssetUrl(filename),
    pathname: `workspace/assets/${filename}`,
  };
}

function compareSharedAssetListItems(a: SharedAssetListItem, b: SharedAssetListItem): number {
  return b.uploadedAt.localeCompare(a.uploadedAt);
}

function isNodeNotFoundError(error: unknown): boolean {
  return Boolean(
    error
      && typeof error === 'object'
      && 'code' in error
      && error.code === 'ENOENT',
  );
}

function isBlobNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  const name = 'name' in error ? error.name : undefined;
  const status = 'status' in error ? error.status : undefined;
  const code = 'code' in error ? error.code : undefined;
  const message = 'message' in error ? error.message : undefined;
  return (
    name === 'BlobNotFoundError'
    || status === 404
    || code === 'blob_not_found'
    || (typeof message === 'string' && message.toLowerCase().includes('not found'))
  );
}
