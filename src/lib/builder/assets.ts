import { del, get, list, put } from '@vercel/blob';
import { mkdir, readdir, readFile, rm, stat, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { normalizeBuilderHomeLocale } from '@/lib/builder/persistence';
import { isLocale, type Locale } from '@/lib/locales';

const BUILDER_ASSET_ROOT = 'builder/assets';
const BUILDER_ASSET_RUNTIME_ROOT = path.join(process.cwd(), 'runtime-data', 'builder-assets');
const MAX_BUILDER_ASSET_BYTES = 8 * 1024 * 1024;
const BUILDER_ASSET_URL_PREFIX = '/api/builder/assets/';
const BUILDER_IMAGE_TYPE_MAP = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
} as const;

export type BuilderAssetBackend = 'blob' | 'file';
export type BuilderImageMimeType = keyof typeof BUILDER_IMAGE_TYPE_MAP;

export interface BuilderAssetUrlReference {
  locale: Locale;
  filename: string;
  pathname: string;
  url: string;
}

export interface BuilderAssetUploadResult {
  backend: BuilderAssetBackend;
  locale: Locale;
  pathname: string;
  url: string;
  filename: string;
  contentType: BuilderImageMimeType;
  size: number;
  uploadedAt: string;
}

export interface BuilderAssetListItem {
  backend: BuilderAssetBackend;
  locale: Locale;
  pathname: string;
  url: string;
  filename: string;
  contentType: BuilderImageMimeType;
  size: number;
  uploadedAt: string;
}

export interface BuilderAssetReadResult {
  backend: BuilderAssetBackend;
  content: Buffer;
  contentType: BuilderImageMimeType;
}

interface BuilderAssetStore {
  backend: BuilderAssetBackend;
  read(pathname: string): Promise<Buffer | null>;
  write(pathname: string, content: Buffer, contentType: BuilderImageMimeType): Promise<void>;
  list(locale: Locale, limit: number): Promise<BuilderAssetListItem[]>;
  delete(pathname: string): Promise<void>;
}

export async function uploadBuilderImageAsset(input: {
  locale: string | null | undefined;
  file: File;
}): Promise<BuilderAssetUploadResult> {
  const locale = normalizeBuilderHomeLocale(input.locale);
  const validated = await validateImageFile(input.file);
  const extension = BUILDER_IMAGE_TYPE_MAP[validated.contentType];
  const filename = `${createAssetSlug(validated.name)}-${randomUUID()}.${extension}`;
  const pathname = `${BUILDER_ASSET_ROOT}/${locale}/${filename}`;
  const store = resolveBuilderAssetStore();
  const uploadedAt = new Date().toISOString();

  await store.write(pathname, validated.content, validated.contentType);

  return {
    backend: store.backend,
    locale,
    pathname,
    filename,
    contentType: validated.contentType,
    size: validated.content.byteLength,
    uploadedAt,
    url: buildBuilderAssetUrl(locale, filename),
  };
}

export async function listBuilderImageAssets(input: {
  locale: string | null | undefined;
  limit?: number;
}): Promise<BuilderAssetListItem[]> {
  const locale = normalizeBuilderHomeLocale(input.locale);
  const limit = normalizeListLimit(input.limit);
  const store = resolveBuilderAssetStore();
  return store.list(locale, limit);
}

export async function readBuilderImageAsset(input: {
  locale: string | null | undefined;
  assetPath: string[];
}): Promise<BuilderAssetReadResult | null> {
  const reference = parseBuilderAssetRouteReference(input.locale, input.assetPath);
  if (!reference) return null;

  const pathname = `${BUILDER_ASSET_ROOT}/${reference.locale}/${reference.filename}`;
  const contentType = inferImageContentType(reference.filename);
  if (!contentType) return null;

  const store = resolveBuilderAssetStore();
  const content = await store.read(pathname);
  if (!content) return null;

  return {
    backend: store.backend,
    content,
    contentType,
  };
}

export async function deleteBuilderImageAsset(input: {
  locale: string | null | undefined;
  filename: string | null | undefined;
}): Promise<void> {
  const locale = normalizeBuilderHomeLocale(input.locale);
  const filename = normalizeAssetPath([input.filename ?? '']);
  if (!filename) {
    throw new Error('A valid asset filename is required.');
  }

  const pathname = `${BUILDER_ASSET_ROOT}/${locale}/${filename}`;
  const store = resolveBuilderAssetStore();
  await store.delete(pathname);
}

export function buildBuilderAssetUrl(locale: Locale, filename: string) {
  return `/api/builder/assets/${locale}/${filename}`;
}

export function parseBuilderAssetUrl(value: string): BuilderAssetUrlReference | null {
  const trimmed = value.trim();
  if (!trimmed || !trimmed.startsWith(BUILDER_ASSET_URL_PREFIX)) {
    return null;
  }

  let url: URL;
  try {
    url = new URL(trimmed, 'https://builder.invalid');
  } catch {
    return null;
  }

  if (url.origin !== 'https://builder.invalid' || url.search || url.hash) {
    return null;
  }

  return parseBuilderAssetPathname(url.pathname);
}

export function parseBuilderAssetRouteReference(
  locale: string | null | undefined,
  assetPath: string[]
): BuilderAssetUrlReference | null {
  if (!isLocale(locale ?? undefined)) {
    return null;
  }

  const filename = normalizeAssetPath(assetPath);
  if (!filename) {
    return null;
  }

  return parseBuilderAssetPathname(`/api/builder/assets/${locale}/${filename}`);
}

function resolveBuilderAssetStore(): BuilderAssetStore {
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return createBlobBuilderAssetStore();
  }

  return createFileBuilderAssetStore();
}

function createBlobBuilderAssetStore(): BuilderAssetStore {
  return {
    backend: 'blob',
    async read(pathname: string) {
      try {
        const result = await get(pathname, {
          access: 'private',
          useCache: false,
        });
        if (!result || result.statusCode !== 200 || !result.stream) {
          return null;
        }

        return Buffer.from(await new Response(result.stream).arrayBuffer());
      } catch (error) {
        if (isBlobNotFoundError(error)) return null;
        throw error;
      }
    },
    async write(pathname: string, content: Buffer, contentType: BuilderImageMimeType) {
      await put(pathname, content, {
        access: 'private',
        allowOverwrite: false,
        contentType,
      });
    },
    async list(locale: Locale, limit: number) {
      const prefix = `${BUILDER_ASSET_ROOT}/${locale}/`;
      const result = await list({
        prefix,
        limit,
      });

      return result.blobs
        .map((blob) => {
          const filename = blob.pathname.slice(prefix.length);
          const contentType = inferImageContentType(filename);
          if (!filename || !contentType) return null;
          return {
            backend: 'blob' as const,
            locale,
            pathname: blob.pathname,
            url: buildBuilderAssetUrl(locale, filename),
            filename,
            contentType,
            size: blob.size,
            uploadedAt: blob.uploadedAt.toISOString(),
          };
        })
        .filter(Boolean)
        .sort((a, b) => Date.parse(b!.uploadedAt) - Date.parse(a!.uploadedAt))
        .slice(0, limit) as BuilderAssetListItem[];
    },
    async delete(pathname: string) {
      try {
        await del(pathname);
      } catch (error) {
        if (isBlobNotFoundError(error)) return;
        throw error;
      }
    },
  };
}

function createFileBuilderAssetStore(): BuilderAssetStore {
  return {
    backend: 'file',
    async read(pathname: string) {
      try {
        return await readFile(resolveRuntimeAssetPath(pathname));
      } catch (error) {
        if (isNodeNotFoundError(error)) return null;
        throw error;
      }
    },
    async write(pathname: string, content: Buffer) {
      const resolvedPath = resolveRuntimeAssetPath(pathname);
      await mkdir(path.dirname(resolvedPath), { recursive: true, mode: 0o700 });
      await writeFile(resolvedPath, content, { mode: 0o600 });
    },
    async list(locale: Locale, limit: number) {
      const localeRoot = resolveRuntimeAssetPath(`${BUILDER_ASSET_ROOT}/${locale}`);
      let entries;
      try {
        entries = await readdir(localeRoot, { withFileTypes: true });
      } catch (error) {
        if (isNodeNotFoundError(error)) return [];
        throw error;
      }

      const assets = await Promise.all(
        entries
          .filter((entry) => entry.isFile())
          .map(async (entry) => {
            const contentType = inferImageContentType(entry.name);
            if (!contentType) return null;
            const pathname = `${BUILDER_ASSET_ROOT}/${locale}/${entry.name}`;
            const metadata = await stat(path.join(localeRoot, entry.name));
            return {
              backend: 'file' as const,
              locale,
              pathname,
              url: buildBuilderAssetUrl(locale, entry.name),
              filename: entry.name,
              contentType,
              size: metadata.size,
              uploadedAt: metadata.mtime.toISOString(),
            };
          })
      );

      return assets
        .filter(Boolean)
        .sort((a, b) => Date.parse(b!.uploadedAt) - Date.parse(a!.uploadedAt))
        .slice(0, limit) as BuilderAssetListItem[];
    },
    async delete(pathname: string) {
      try {
        await rm(resolveRuntimeAssetPath(pathname), { force: true });
      } catch (error) {
        if (isNodeNotFoundError(error)) return;
        throw error;
      }
    },
  };
}

async function validateImageFile(file: File): Promise<{
  content: Buffer;
  contentType: BuilderImageMimeType;
  name: string;
}> {
  const contentType = isBuilderImageMimeType(file.type) ? file.type : null;
  if (!contentType) {
    throw new Error('Only JPG, PNG, WEBP, GIF, and AVIF images are supported.');
  }

  if (file.size <= 0) {
    throw new Error('The selected file is empty.');
  }

  if (file.size > MAX_BUILDER_ASSET_BYTES) {
    throw new Error('Image upload is limited to 8 MB.');
  }

  return {
    content: Buffer.from(await file.arrayBuffer()),
    contentType,
    name: file.name || 'builder-image',
  };
}

function createAssetSlug(filename: string) {
  const basename = filename.replace(/\.[^.]+$/, '').trim().toLowerCase();
  const normalized = basename
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);

  return normalized || 'builder-image';
}

function normalizeAssetPath(assetPath: string[]) {
  if (!Array.isArray(assetPath) || assetPath.length !== 1) return null;
  const [filename] = assetPath;
  if (!filename || filename.includes('/') || filename.includes('\\')) return null;
  return filename;
}

function normalizeListLimit(value: number | undefined) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 8;
  return Math.min(24, Math.max(1, Math.trunc(value)));
}

function parseBuilderAssetPathname(pathname: string): BuilderAssetUrlReference | null {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length !== 5) return null;
  if (segments[0] !== 'api' || segments[1] !== 'builder' || segments[2] !== 'assets') return null;

  const locale = segments[3];
  const filename = segments[4];
  if (!isLocale(locale) || !filename) return null;
  if (filename.includes('/') || filename.includes('\\')) return null;
  if (!inferImageContentType(filename)) return null;

  return {
    locale,
    filename,
    pathname: `/api/builder/assets/${locale}/${filename}`,
    url: `/api/builder/assets/${locale}/${filename}`,
  };
}

function resolveRuntimeAssetPath(pathname: string) {
  return path.join(BUILDER_ASSET_RUNTIME_ROOT, pathname);
}

function isBuilderImageMimeType(value: string): value is BuilderImageMimeType {
  return value in BUILDER_IMAGE_TYPE_MAP;
}

function inferImageContentType(filename: string): BuilderImageMimeType | null {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    case '.avif':
      return 'image/avif';
    default:
      return null;
  }
}

function isNodeNotFoundError(error: unknown): boolean {
  return (
    Boolean(error) &&
    typeof error === 'object' &&
    error !== null &&
    (error as { code?: unknown }).code === 'ENOENT'
  );
}

function isBlobNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  const candidate = error as {
    name?: unknown;
    status?: unknown;
    code?: unknown;
    message?: unknown;
  };

  return (
    candidate.name === 'BlobNotFoundError' ||
    candidate.status === 404 ||
    candidate.code === 'blob_not_found' ||
    (typeof candidate.message === 'string' && candidate.message.toLowerCase().includes('not found'))
  );
}
