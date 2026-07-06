import type {
  SharedAssetListItem,
  SharedAssetSummary,
} from '@/lib/builder/workspace/shared-assets-types';

export function emptySharedAssetSummary(): SharedAssetSummary {
  return { count: 0, totalBytes: 0, latestUploadedAt: null };
}

function mergeTimestamp(current: string | null, next: string | null): string | null {
  if (!next) return current;
  if (!current) return next;
  return next > current ? next : current;
}

export function mergeSharedAssetSummaries(
  current: SharedAssetSummary,
  next: SharedAssetSummary,
): SharedAssetSummary {
  return {
    count: current.count + next.count,
    totalBytes: current.totalBytes + next.totalBytes,
    latestUploadedAt: mergeTimestamp(current.latestUploadedAt, next.latestUploadedAt),
  };
}

export function summarizeSharedAssetListItems(items: SharedAssetListItem[]): SharedAssetSummary {
  let totalBytes = 0;
  let latestUploadedAt: string | null = null;
  for (const item of items) {
    totalBytes += item.size;
    latestUploadedAt = mergeTimestamp(latestUploadedAt, item.uploadedAt);
  }
  return {
    count: items.length,
    totalBytes,
    latestUploadedAt,
  };
}
