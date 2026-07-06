import { z } from 'zod';

export const CACHE_STALE_MS = 24 * 60 * 60 * 1000;
export const CACHE_LARGE_KEY_BYTES = 1024 * 1024;

export type CachePurgeMode = 'all' | 'stale';

export type CacheKeyMeta = {
  readonly key: string;
  readonly sizeBytes: number;
  readonly lastWrittenAt?: string;
  readonly ageMs: number;
  readonly stale: boolean;
  readonly large: boolean;
};

export type CacheInventorySummary = {
  readonly totalKeys: number;
  readonly totalBytes: number;
  readonly staleKeys: number;
  readonly largeKeys: number;
  readonly oldestWrittenAt?: string;
  readonly newestWrittenAt?: string;
};

export type CacheInventory = {
  readonly keys: readonly CacheKeyMeta[];
  readonly summary: CacheInventorySummary;
};

export type CachePurgeReport = {
  readonly id: string;
  readonly purgedAt: string;
  readonly mode: CachePurgeMode;
  readonly clearedKeys: readonly string[];
  readonly failedKeys: readonly string[];
  readonly totalBytesCleared: number;
  readonly before: CacheInventorySummary;
  readonly after: CacheInventorySummary;
};

const cacheInventorySummarySchema = z.object({
  totalKeys: z.number(),
  totalBytes: z.number(),
  staleKeys: z.number(),
  largeKeys: z.number(),
  oldestWrittenAt: z.string().optional(),
  newestWrittenAt: z.string().optional(),
});

const cachePurgeReportSchema = z.object({
  id: z.string(),
  purgedAt: z.string(),
  mode: z.union([z.literal('all'), z.literal('stale')]),
  clearedKeys: z.array(z.string()),
  failedKeys: z.array(z.string()),
  totalBytesCleared: z.number(),
  before: cacheInventorySummarySchema,
  after: cacheInventorySummarySchema,
});

export function parseCachePurgeReportPayload(value: unknown): CachePurgeReport {
  return cachePurgeReportSchema.parse(value);
}

export function isCachePurgeReportPayloadError(error: unknown): boolean {
  return error instanceof z.ZodError;
}
