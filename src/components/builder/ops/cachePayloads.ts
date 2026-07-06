import { z } from 'zod';
import type {
  CacheInventorySummary,
  CacheKeyMeta,
  CachePurgeReport,
} from '@/lib/builder/ops/cache-introspection';

const cacheKeyMetaSchema = z.object({
  key: z.string(),
  sizeBytes: z.number(),
  lastWrittenAt: z.string().optional(),
  ageMs: z.number(),
  stale: z.boolean(),
  large: z.boolean(),
});

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

const cachePayloadSchema = z.object({
  keys: z.array(cacheKeyMetaSchema),
  summary: cacheInventorySummarySchema,
  latestPurge: cachePurgeReportSchema.nullable().optional(),
});

const cachePurgePayloadSchema = z.object({
  cleared: z.number().optional(),
  report: cachePurgeReportSchema.optional(),
  summary: cacheInventorySummarySchema.optional(),
  error: z.string().optional(),
});

export type CachePayload = {
  readonly keys: readonly CacheKeyMeta[];
  readonly summary: CacheInventorySummary;
  readonly latestPurge: CachePurgeReport | null;
};

export type CachePurgePayload = {
  readonly cleared: number;
  readonly report?: CachePurgeReport;
  readonly summary?: CacheInventorySummary;
  readonly error?: string;
};

export function emptyCacheSummary(): CacheInventorySummary {
  return {
    totalKeys: 0,
    totalBytes: 0,
    staleKeys: 0,
    largeKeys: 0,
  };
}

export async function readResponsePayload(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch (error) {
    if (error instanceof SyntaxError) return null;
    throw error;
  }
}

export function parseCachePayload(value: unknown): CachePayload {
  const parsed = cachePayloadSchema.safeParse(value);
  if (!parsed.success) {
    return {
      keys: [],
      summary: emptyCacheSummary(),
      latestPurge: null,
    };
  }
  return {
    keys: parsed.data.keys,
    summary: parsed.data.summary,
    latestPurge: parsed.data.latestPurge ?? null,
  };
}

export function parseCachePurgePayload(value: unknown): CachePurgePayload {
  const parsed = cachePurgePayloadSchema.safeParse(value);
  if (!parsed.success) return { cleared: 0 };
  return {
    cleared: parsed.data.cleared ?? 0,
    ...(parsed.data.report ? { report: parsed.data.report } : {}),
    ...(parsed.data.summary ? { summary: parsed.data.summary } : {}),
    ...(parsed.data.error ? { error: parsed.data.error } : {}),
  };
}
