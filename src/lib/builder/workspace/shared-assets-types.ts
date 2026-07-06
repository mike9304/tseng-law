export const SHARED_ASSET_URL_PREFIX = '/api/builder/workspace/assets/';
export const SHARED_ASSET_BLOB_PREFIX = 'builder-workspace/assets';

export const SHARED_IMAGE_TYPE_MAP = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
} as const;

export type SharedAssetMimeType = keyof typeof SHARED_IMAGE_TYPE_MAP;
export type SharedAssetBackend = 'blob' | 'file';

export interface SharedAssetUploadResult {
  readonly filename: string;
  readonly contentType: SharedAssetMimeType;
  readonly size: number;
  readonly uploadedAt: string;
  readonly url: string;
}

export interface SharedAssetListItem extends SharedAssetUploadResult {
  readonly pathname: string;
}

export interface SharedAssetSummary {
  readonly count: number;
  readonly totalBytes: number;
  readonly latestUploadedAt: string | null;
}

export interface SharedAssetReadResult {
  readonly content: Buffer;
  readonly contentType: SharedAssetMimeType;
}

export function buildSharedAssetUrl(filename: string): string {
  return `${SHARED_ASSET_URL_PREFIX}${filename}`;
}

export function sharedAssetBlobPathname(filename: string): string {
  return `${SHARED_ASSET_BLOB_PREFIX}/${filename}`;
}

export function isSharedAssetMimeType(value: string): value is SharedAssetMimeType {
  return value in SHARED_IMAGE_TYPE_MAP;
}

export function sharedAssetExtension(contentType: SharedAssetMimeType): string {
  return SHARED_IMAGE_TYPE_MAP[contentType];
}

export function sanitizeSharedAssetFilename(filename: string): string | null {
  if (!filename) return null;
  if (filename.includes('/') || filename.includes('\\')) return null;
  if (filename.includes('..')) return null;
  if (!/^[A-Za-z0-9._-]{1,128}$/.test(filename)) return null;
  return filename;
}

export function inferSharedAssetContentType(filename: string): SharedAssetMimeType | null {
  const normalized = filename.toLowerCase();
  if (normalized.endsWith('.jpg') || normalized.endsWith('.jpeg')) return 'image/jpeg';
  if (normalized.endsWith('.png')) return 'image/png';
  if (normalized.endsWith('.webp')) return 'image/webp';
  if (normalized.endsWith('.gif')) return 'image/gif';
  if (normalized.endsWith('.avif')) return 'image/avif';
  if (normalized.endsWith('.svg')) return 'image/svg+xml';
  return null;
}

export function slugSharedAssetBasename(basename: string): string {
  return basename
    .replace(/\.[^.]+$/, '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'shared-asset';
}
