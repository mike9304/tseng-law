import { del, get, list, put } from '@vercel/blob';
import { lstat, realpath } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { normalizeBuilderHomeLocale } from '@/lib/builder/persistence';
import { getMaxUploadBytes, sanitizeSvgUploadText } from '@/lib/builder/canvas/upload-validation';
import {
  SafeLocalFsSafetyError,
  isSafeLocalFsNotFoundError,
  openSafeLocalFsRoot,
  type SafeLocalFsRoot,
} from '@/lib/builder/storage/safe-local-fs';
import { isLocale, type Locale } from '@/lib/locales';

const BUILDER_ASSET_ROOT = 'builder/assets';
const BUILDER_ASSET_URL_PREFIX = '/api/builder/assets/';
const BUILDER_ASSET_LIBRARY_FILENAME = '__library.json';
const RESERVED_ASSET_FOLDER_IDS = new Set(['all', 'recent', 'selected']);
const BUILDER_IMAGE_TYPE_MAP = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
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

export interface BuilderAssetFolder {
  id: string;
  name: string;
}

export interface BuilderAssetLibraryState {
  folders: BuilderAssetFolder[];
  tags: string[];
  assetFolderByFilename: Record<string, string>;
  assetTagsByFilename: Record<string, string[]>;
}

const DEFAULT_ASSET_LIBRARY_STATE: BuilderAssetLibraryState = {
  folders: [
    { id: 'uploads', name: 'Uploads' },
    { id: 'brand', name: 'Brand' },
  ],
  tags: ['hero', 'office', 'people'],
  assetFolderByFilename: {},
  assetTagsByFilename: {},
};

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

export async function readBuilderAssetLibraryState(input: {
  locale: string | null | undefined;
}): Promise<BuilderAssetLibraryState> {
  const locale = normalizeBuilderHomeLocale(input.locale);
  const pathname = `${BUILDER_ASSET_ROOT}/${locale}/${BUILDER_ASSET_LIBRARY_FILENAME}`;
  try {
    const raw = await readAssetLibraryJson(pathname);
    if (!raw) return defaultAssetLibraryState();
    return normalizeAssetLibraryState(JSON.parse(raw));
  } catch (error) {
    if (
      error instanceof BuilderAssetRootConfigurationError
      || error instanceof SafeLocalFsSafetyError
    ) {
      throw error;
    }
    return defaultAssetLibraryState();
  }
}

export async function writeBuilderAssetLibraryState(input: {
  locale: string | null | undefined;
  library: unknown;
}): Promise<BuilderAssetLibraryState> {
  const locale = normalizeBuilderHomeLocale(input.locale);
  const pathname = `${BUILDER_ASSET_ROOT}/${locale}/${BUILDER_ASSET_LIBRARY_FILENAME}`;
  const library = normalizeAssetLibraryState(input.library);
  await writeAssetLibraryJson(pathname, JSON.stringify(library));
  return library;
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

async function readAssetLibraryJson(pathname: string): Promise<string | null> {
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    try {
      const result = await get(pathname, {
        access: 'private',
        useCache: false,
      });
      if (!result || result.statusCode !== 200 || !result.stream) return null;
      return new Response(result.stream).text();
    } catch (error) {
      if (isBlobNotFoundError(error)) return null;
      throw error;
    }
  }

  const localRoot = await openBuilderAssetLocalFsRoot();
  try {
    return (await localRoot.readFile(pathname)).toString('utf8');
  } catch (error) {
    if (isSafeLocalFsNotFoundError(error)) return null;
    throw error;
  }
}

async function writeAssetLibraryJson(pathname: string, json: string): Promise<void> {
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    await put(pathname, json, {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return;
  }

  const localRoot = await openBuilderAssetLocalFsRoot();
  await localRoot.ensureDirectory(path.posix.dirname(pathname));
  await localRoot.writeFile(pathname, json, { overwrite: true, mode: 0o600 });
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
      const localRoot = await openBuilderAssetLocalFsRoot();
      try {
        return await localRoot.readFile(pathname);
      } catch (error) {
        if (isSafeLocalFsNotFoundError(error)) return null;
        throw error;
      }
    },
    async write(pathname: string, content: Buffer) {
      const localRoot = await openBuilderAssetLocalFsRoot();
      await localRoot.ensureDirectory(path.posix.dirname(pathname));
      await localRoot.writeFile(pathname, content, { mode: 0o600 });
    },
    async list(locale: Locale, limit: number) {
      const localRoot = await openBuilderAssetLocalFsRoot();
      const localeRoot = `${BUILDER_ASSET_ROOT}/${locale}`;
      let entries;
      try {
        entries = await localRoot.listRegularFiles(localeRoot);
      } catch (error) {
        if (isSafeLocalFsNotFoundError(error)) return [];
        throw error;
      }

      const assets = entries.map((entry) => {
        const contentType = inferImageContentType(entry.name);
        if (!contentType) return null;
        const pathname = `${BUILDER_ASSET_ROOT}/${locale}/${entry.name}`;
        return {
          backend: 'file' as const,
          locale,
          pathname,
          url: buildBuilderAssetUrl(locale, entry.name),
          filename: entry.name,
          contentType,
          size: entry.size,
          uploadedAt: entry.mtime.toISOString(),
        };
      });

      return assets
        .filter(Boolean)
        .sort((a, b) => Date.parse(b!.uploadedAt) - Date.parse(a!.uploadedAt))
        .slice(0, limit) as BuilderAssetListItem[];
    },
    async delete(pathname: string) {
      const localRoot = await openBuilderAssetLocalFsRoot();
      await localRoot.removeFile(pathname);
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

  const maxBytes = getMaxUploadBytes();
  if (file.size > maxBytes) {
    throw new Error(`Image upload is limited to ${Math.round(maxBytes / (1024 * 1024))} MB.`);
  }

  const rawContent = Buffer.from(await file.arrayBuffer());
  const content = contentType === 'image/svg+xml'
    ? sanitizeSvgContent(rawContent)
    : rawContent;

  if (content.byteLength > maxBytes) {
    throw new Error(`Image upload is limited to ${Math.round(maxBytes / (1024 * 1024))} MB.`);
  }

  return {
    content,
    contentType,
    name: file.name || 'builder-image',
  };
}

function sanitizeSvgContent(content: Buffer): Buffer {
  const sanitized = sanitizeSvgUploadText(content.toString('utf8'));
  if (!sanitized) {
    throw new Error('Unsafe SVG upload.');
  }
  return Buffer.from(sanitized, 'utf8');
}

function defaultAssetLibraryState(): BuilderAssetLibraryState {
  return {
    folders: DEFAULT_ASSET_LIBRARY_STATE.folders.map((folder) => ({ ...folder })),
    tags: [...DEFAULT_ASSET_LIBRARY_STATE.tags],
    assetFolderByFilename: {},
    assetTagsByFilename: {},
  };
}

function normalizeAssetLibraryState(input: unknown): BuilderAssetLibraryState {
  const candidate = input && typeof input === 'object'
    ? input as Partial<BuilderAssetLibraryState>
    : {};
  const folders = normalizeAssetFolders(candidate.folders);
  const folderIds = new Set(folders.map((folder) => folder.id));
  const tags = normalizeAssetTags(candidate.tags);
  const tagIds = new Set(tags);
  return {
    folders,
    tags,
    assetFolderByFilename: normalizeAssetFolderAssignments(candidate.assetFolderByFilename, folderIds),
    assetTagsByFilename: normalizeAssetTagAssignments(candidate.assetTagsByFilename, tagIds),
  };
}

function normalizeAssetFolders(input: unknown): BuilderAssetFolder[] {
  const folders = new Map<string, BuilderAssetFolder>();
  for (const folder of DEFAULT_ASSET_LIBRARY_STATE.folders) {
    folders.set(folder.id, { ...folder });
  }
  if (!Array.isArray(input)) return Array.from(folders.values());

  for (const item of input.slice(0, 32)) {
    if (!item || typeof item !== 'object') continue;
    const record = item as { id?: unknown; name?: unknown };
    const name = normalizeAssetLabel(record.name, 48);
    const fallbackId = typeof record.id === 'string' ? record.id : name;
    const id = normalizeAssetFolderId(fallbackId);
    if (!id || !name || RESERVED_ASSET_FOLDER_IDS.has(id)) continue;
    folders.set(id, { id, name });
  }
  return Array.from(folders.values());
}

function normalizeAssetTags(input: unknown): string[] {
  const tags = new Set(DEFAULT_ASSET_LIBRARY_STATE.tags);
  if (!Array.isArray(input)) return Array.from(tags);
  for (const tag of input.slice(0, 64)) {
    if (typeof tag !== 'string') continue;
    const normalized = normalizeAssetTag(tag);
    if (normalized) tags.add(normalized);
  }
  return Array.from(tags);
}

function normalizeAssetFolderAssignments(
  input: unknown,
  folderIds: Set<string>,
): Record<string, string> {
  if (!input || typeof input !== 'object') return {};
  const next: Record<string, string> = {};
  for (const [filename, folderId] of Object.entries(input as Record<string, unknown>)) {
    const safeFilename = normalizeAssetPath([filename]);
    if (!safeFilename || typeof folderId !== 'string' || !folderIds.has(folderId)) continue;
    next[safeFilename] = folderId;
  }
  return next;
}

function normalizeAssetTagAssignments(
  input: unknown,
  tagIds: Set<string>,
): Record<string, string[]> {
  if (!input || typeof input !== 'object') return {};
  const next: Record<string, string[]> = {};
  for (const [filename, tags] of Object.entries(input as Record<string, unknown>)) {
    const safeFilename = normalizeAssetPath([filename]);
    if (!safeFilename || !Array.isArray(tags)) continue;
    const safeTags = Array.from(new Set(tags.filter((tag): tag is string => (
      typeof tag === 'string' && tagIds.has(tag)
    ))));
    if (safeTags.length > 0) next[safeFilename] = safeTags;
  }
  return next;
}

function normalizeAssetLabel(input: unknown, maxLength: number): string {
  return typeof input === 'string'
    ? input.trim().replace(/\s+/g, ' ').slice(0, maxLength)
    : '';
}

function normalizeAssetFolderId(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

function normalizeAssetTag(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]+/g, '')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32);
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

class BuilderAssetRootConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BuilderAssetRootConfigurationError';
  }
}

function resolveBuilderAssetRuntimeRoot(): string {
  const configuredRoot = process.env.BUILDER_ASSETS_ROOT;
  if (configuredRoot === undefined) {
    return path.resolve(process.cwd(), 'runtime-data', 'builder-assets');
  }

  const trimmedRoot = configuredRoot.trim();
  if (!path.isAbsolute(trimmedRoot)) {
    throw new BuilderAssetRootConfigurationError(
      'BUILDER_ASSETS_ROOT must be an absolute path.',
    );
  }

  return path.resolve(trimmedRoot);
}

async function openBuilderAssetLocalFsRoot(): Promise<SafeLocalFsRoot> {
  const configuredRoot = resolveBuilderAssetRuntimeRoot();
  const physicalConstraint = resolveBuilderAssetPhysicalConstraint();
  let constraintRoot: SafeLocalFsRoot | null = null;
  let physicalRoot: string;

  if (physicalConstraint) {
    constraintRoot = await openExistingPhysicalRoot(physicalConstraint);
    const relativeRoot = path.relative(physicalConstraint, configuredRoot);
    if (!isContainedRelativePath(relativeRoot)) {
      throw new BuilderAssetRootConfigurationError(
        'BUILDER_ASSETS_ROOT must remain physically within BUILDER_QA_ISOLATION_ROOT.',
      );
    }
    await constraintRoot.ensureDirectory(relativeRoot || '.');
    await constraintRoot.ensureDirectory('.');
    physicalRoot = path.resolve(constraintRoot.root, relativeRoot);
  } else {
    physicalRoot = await ensurePhysicalDirectoryTree(configuredRoot);
  }

  const localRoot = await openSafeLocalFsRoot(physicalRoot);

  if (constraintRoot) {
    await constraintRoot.ensureDirectory('.');
    if (!isContainedPath(constraintRoot.root, localRoot.root)) {
      throw new BuilderAssetRootConfigurationError(
        'BUILDER_ASSETS_ROOT must remain physically within BUILDER_QA_ISOLATION_ROOT.',
      );
    }
  }

  return localRoot;
}

function resolveBuilderAssetPhysicalConstraint(): string | null {
  const configured = process.env.BUILDER_QA_ISOLATION_ROOT;
  if (configured === undefined) return null;
  const trimmed = configured.trim();
  if (!path.isAbsolute(trimmed)) {
    throw new BuilderAssetRootConfigurationError(
      'BUILDER_QA_ISOLATION_ROOT must be an absolute path.',
    );
  }
  return path.resolve(trimmed);
}

async function openExistingPhysicalRoot(root: string): Promise<SafeLocalFsRoot> {
  const physicalRoot = await realpath(root);
  if (physicalRoot !== root) {
    throw new BuilderAssetRootConfigurationError(
      'BUILDER_QA_ISOLATION_ROOT must use its attested physical path.',
    );
  }
  return openSafeLocalFsRoot(root);
}

async function ensurePhysicalDirectoryTree(root: string): Promise<string> {
  const missingSegments: string[] = [];
  let existingAncestor = root;
  while (true) {
    try {
      const stats = await lstat(existingAncestor);
      if (!stats.isDirectory() && !stats.isSymbolicLink()) {
        throw new BuilderAssetRootConfigurationError(
          'BUILDER_ASSETS_ROOT must resolve through directories only.',
        );
      }
      break;
    } catch (error) {
      if (!isNodeNotFoundError(error)) throw error;
      const parent = path.dirname(existingAncestor);
      if (parent === existingAncestor) {
        throw new BuilderAssetRootConfigurationError(
          'BUILDER_ASSETS_ROOT must resolve through an existing directory.',
        );
      }
      missingSegments.unshift(path.basename(existingAncestor));
      existingAncestor = parent;
    }
  }

  const physicalAncestor = await realpath(existingAncestor);
  const safeAncestor = await openSafeLocalFsRoot(physicalAncestor);
  if (missingSegments.length > 0) {
    await safeAncestor.ensureDirectory(missingSegments.join(path.sep));
  }
  return path.join(safeAncestor.root, ...missingSegments);
}

function isContainedRelativePath(relative: string): boolean {
  return relative === '' || (
    relative !== '..'
    && !relative.startsWith(`..${path.sep}`)
    && !path.isAbsolute(relative)
  );
}

function isContainedPath(root: string, candidate: string): boolean {
  return isContainedRelativePath(path.relative(root, candidate));
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
    case '.svg':
      return 'image/svg+xml';
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
