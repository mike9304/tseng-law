/**
 * Account-level shared asset library.
 *
 * Mirrors `src/lib/builder/assets.ts` but namespaces binaries to the
 * account rather than a single site. Local development uses
 * `runtime-data/workspace/assets/`; production can use Vercel Blob.
 */

import { randomUUID } from 'crypto';
import {
  sanitizeSvgUploadText,
  validateImageBytes,
  validateUploadFile,
  type UploadValidationResult,
} from '@/lib/builder/canvas/upload-validation';
import type { Locale } from '@/lib/locales';
import {
  __resetSharedAssetStorageRootForTests,
  __setSharedAssetStorageRootForTests,
  resolveSharedAssetStore,
} from '@/lib/builder/workspace/shared-assets-storage';
import {
  buildSharedAssetUrl,
  inferSharedAssetContentType,
  isSharedAssetMimeType,
  sanitizeSharedAssetFilename,
  sharedAssetExtension,
  slugSharedAssetBasename,
  type SharedAssetListItem,
  type SharedAssetMimeType,
  type SharedAssetReadResult,
  type SharedAssetSummary,
  type SharedAssetUploadResult,
} from '@/lib/builder/workspace/shared-assets-types';

export {
  __resetSharedAssetStorageRootForTests,
  __setSharedAssetStorageRootForTests,
  buildSharedAssetUrl,
};
export type {
  SharedAssetListItem,
  SharedAssetMimeType,
  SharedAssetReadResult,
  SharedAssetSummary,
  SharedAssetUploadResult,
};

function validationErrorMessage(result: UploadValidationResult): string {
  return result.error ?? 'Shared asset upload did not pass image validation.';
}

async function prepareSharedAssetUpload(file: File): Promise<{
  content: Buffer;
  contentType: SharedAssetMimeType;
}> {
  const policyCheck = validateUploadFile(file);
  if (!policyCheck.valid) {
    throw new Error(validationErrorMessage(policyCheck));
  }

  const contentType = isSharedAssetMimeType(file.type) ? file.type : null;
  if (!contentType) {
    throw new Error('Only JPG, PNG, WEBP, GIF, AVIF, and SVG images are supported.');
  }

  const byteCheck = await validateImageBytes(file);
  if (!byteCheck.valid) {
    throw new Error(validationErrorMessage(byteCheck));
  }

  const rawContent = Buffer.from(await file.arrayBuffer());
  if (contentType !== 'image/svg+xml') {
    return { content: rawContent, contentType };
  }

  const sanitized = sanitizeSvgUploadText(rawContent.toString('utf8'));
  if (!sanitized) {
    throw new Error('Unsafe SVG upload.');
  }

  return {
    content: Buffer.from(sanitized, 'utf8'),
    contentType,
  };
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
  const prepared = await prepareSharedAssetUpload(file);
  const extension = sharedAssetExtension(prepared.contentType);
  const filename = `${slugSharedAssetBasename(file.name || 'shared-asset')}-${randomUUID()}.${extension}`;
  const store = resolveSharedAssetStore();
  await store.write({
    filename,
    content: prepared.content,
    contentType: prepared.contentType,
  });
  return {
    filename,
    contentType: prepared.contentType,
    size: prepared.content.byteLength,
    uploadedAt: new Date().toISOString(),
    url: buildSharedAssetUrl(filename),
  };
}

export async function listSharedAssets(limit = 24): Promise<SharedAssetListItem[]> {
  const cap = Math.min(96, Math.max(1, Math.trunc(limit)));
  return resolveSharedAssetStore().list(cap);
}

export async function summarizeSharedAssets(): Promise<SharedAssetSummary> {
  return resolveSharedAssetStore().summarize();
}

export async function readSharedAsset(filename: string): Promise<SharedAssetReadResult | null> {
  const safe = sanitizeSharedAssetFilename(filename);
  if (!safe) return null;
  const contentType = inferSharedAssetContentType(safe);
  if (!contentType) return null;
  return resolveSharedAssetStore().read(safe, contentType);
}

export async function deleteSharedAsset(filename: string): Promise<boolean> {
  const safe = sanitizeSharedAssetFilename(filename);
  if (!safe) return false;
  return resolveSharedAssetStore().delete(safe);
}
