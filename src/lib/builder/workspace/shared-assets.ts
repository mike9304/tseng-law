/**
 * Account-level shared asset library.
 *
 * Mirrors `src/lib/builder/assets.ts` but lives under
 * `runtime-data/workspace/assets/` so binaries are namespaced to the
 * account rather than a single site. v1 is file-only — Blob parity is a
 * follow-up.
 */

import { mkdir, readdir, readFile, rm, stat, writeFile } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import type { Locale } from '@/lib/locales';

const SHARED_ASSET_DIR = path.join(process.cwd(), 'runtime-data', 'workspace', 'assets');
const SHARED_ASSET_URL_PREFIX = '/api/builder/workspace/assets/';

const SHARED_IMAGE_TYPE_MAP = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
} as const;

export type SharedAssetMimeType = keyof typeof SHARED_IMAGE_TYPE_MAP;

export interface SharedAssetUploadResult {
  filename: string;
  contentType: SharedAssetMimeType;
  size: number;
  uploadedAt: string;
  url: string;
}

export interface SharedAssetListItem extends SharedAssetUploadResult {
  pathname: string;
}

export interface SharedAssetReadResult {
  content: Buffer;
  contentType: SharedAssetMimeType;
}

export function buildSharedAssetUrl(filename: string): string {
  return `${SHARED_ASSET_URL_PREFIX}${filename}`;
}

function sanitizeFilenameForRead(filename: string): string | null {
  if (!filename) return null;
  if (filename.includes('/') || filename.includes('\\')) return null;
  if (filename.includes('..')) return null;
  if (!/^[A-Za-z0-9._-]{1,128}$/.test(filename)) return null;
  return filename;
}

function inferContentType(filename: string): SharedAssetMimeType | null {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.jpg':
    case '.jpeg': return 'image/jpeg';
    case '.png': return 'image/png';
    case '.webp': return 'image/webp';
    case '.gif': return 'image/gif';
    case '.avif': return 'image/avif';
    case '.svg': return 'image/svg+xml';
    default: return null;
  }
}

function slug(basename: string): string {
  return basename
    .replace(/\.[^.]+$/, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'shared-asset';
}

async function ensureDir(): Promise<void> {
  await mkdir(SHARED_ASSET_DIR, { recursive: true, mode: 0o700 });
}

function isMimeType(value: string): value is SharedAssetMimeType {
  return value in SHARED_IMAGE_TYPE_MAP;
}

/**
 * Locale arg is accepted for future per-locale shared collections but v1
 * stores all shared assets in a single bucket — the parameter is reserved.
 */
export async function uploadSharedAsset(input: {
  file: File;
  locale?: Locale | null;
}): Promise<SharedAssetUploadResult> {
  const file = input.file;
  if (!isMimeType(file.type)) {
    throw new Error('Only JPG, PNG, WEBP, GIF, AVIF, and SVG images are supported.');
  }
  if (file.size <= 0) throw new Error('The uploaded file is empty.');
  const extension = SHARED_IMAGE_TYPE_MAP[file.type];
  const filename = `${slug(file.name || 'shared-asset')}-${randomUUID()}.${extension}`;
  const content = Buffer.from(await file.arrayBuffer());
  await ensureDir();
  await writeFile(path.join(SHARED_ASSET_DIR, filename), content, { mode: 0o600 });
  return {
    filename,
    contentType: file.type,
    size: content.byteLength,
    uploadedAt: new Date().toISOString(),
    url: buildSharedAssetUrl(filename),
  };
}

export async function listSharedAssets(limit = 24): Promise<SharedAssetListItem[]> {
  const cap = Math.min(96, Math.max(1, Math.trunc(limit)));
  try {
    const entries = await readdir(SHARED_ASSET_DIR, { withFileTypes: true });
    const items = await Promise.all(
      entries
        .filter((entry) => entry.isFile())
        .map(async (entry) => {
          const contentType = inferContentType(entry.name);
          if (!contentType) return null;
          const meta = await stat(path.join(SHARED_ASSET_DIR, entry.name));
          return {
            filename: entry.name,
            contentType,
            size: meta.size,
            uploadedAt: meta.mtime.toISOString(),
            url: buildSharedAssetUrl(entry.name),
            pathname: `workspace/assets/${entry.name}`,
          } satisfies SharedAssetListItem;
        }),
    );
    return items
      .filter((item): item is SharedAssetListItem => Boolean(item))
      .sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt))
      .slice(0, cap);
  } catch (error) {
    if ((error as { code?: string }).code === 'ENOENT') return [];
    throw error;
  }
}

export async function readSharedAsset(filename: string): Promise<SharedAssetReadResult | null> {
  const safe = sanitizeFilenameForRead(filename);
  if (!safe) return null;
  const contentType = inferContentType(safe);
  if (!contentType) return null;
  try {
    const content = await readFile(path.join(SHARED_ASSET_DIR, safe));
    return { content, contentType };
  } catch (error) {
    if ((error as { code?: string }).code === 'ENOENT') return null;
    throw error;
  }
}

export async function deleteSharedAsset(filename: string): Promise<boolean> {
  const safe = sanitizeFilenameForRead(filename);
  if (!safe) return false;
  try {
    await rm(path.join(SHARED_ASSET_DIR, safe), { force: false });
    return true;
  } catch (error) {
    if ((error as { code?: string }).code === 'ENOENT') return false;
    throw error;
  }
}