import { z } from 'zod';

export const providerIdSchema = z.enum(['openai', 'deepl']);
const localeSchema = z.enum(['ko', 'zh-hant', 'en']);
const readinessStatusSchema = z.enum(['pass', 'warn', 'fail']);
const smokeStatusSchema = z.enum(['pass', 'fail', 'unconfigured']);
const smokeFreshnessSchema = z.enum(['missing', 'fresh', 'stale']);
const smokeReviewerStatusSchema = z.enum(['no_history', 'healthy', 'needs_attention', 'stale']);
const smokeActionItemSchema = z.enum([
  'run_provider_smoke',
  'check_scheduled_smoke',
  'inspect_failures',
  'configure_provider',
]);

const providerSchema = z.object({
  id: providerIdSchema,
  configured: z.boolean(),
  selected: z.boolean(),
  secretName: z.string(),
  model: z.string().optional(),
  endpoint: z.string().optional(),
});

const checkSchema = z.object({
  id: z.string(),
  provider: z.union([providerIdSchema, z.literal('router')]),
  status: readinessStatusSchema,
  label: z.string(),
  detail: z.string(),
});

const smokeHistorySchema = z.object({
  checkedAt: z.string(),
  ok: z.boolean(),
  provider: providerIdSchema,
  status: smokeStatusSchema,
  sourceLocale: localeSchema,
  targetLocale: localeSchema,
  durationMs: z.number(),
  translatedTextPreview: z.string().optional(),
  reason: z.string().optional(),
  error: z.string().optional(),
});

const smokeSummaryProviderSchema = z.object({
  provider: providerIdSchema,
  status: z.union([smokeStatusSchema, z.literal('missing')]),
  checkedAt: z.string().optional(),
  durationMs: z.number().optional(),
});

const smokeSummarySchema = z.object({
  total: z.number(),
  passed: z.number(),
  failed: z.number(),
  unconfigured: z.number(),
  lastCheckedAt: z.string().optional(),
  freshness: smokeFreshnessSchema,
  ageMinutes: z.number().optional(),
  reviewerStatus: smokeReviewerStatusSchema,
  actionItems: z.array(smokeActionItemSchema),
  providers: z.array(smokeSummaryProviderSchema),
});

export const reportSchema = z.object({
  ok: z.boolean(),
  production: z.boolean(),
  selectedProvider: z.union([providerIdSchema, z.literal('mock')]),
  providers: z.array(providerSchema),
  checks: z.array(checkSchema),
  smokeHistory: z.array(smokeHistorySchema).default([]),
  smokeSummary: smokeSummarySchema,
});

const smokeSchema = z.object({
  ok: z.boolean(),
  provider: providerIdSchema,
  status: smokeStatusSchema,
  sourceLocale: localeSchema,
  targetLocale: localeSchema,
  durationMs: z.number(),
  translatedTextPreview: z.string().optional(),
  reason: z.string().optional(),
  error: z.string().optional(),
});

export const payloadSchema = z.object({
  ok: z.boolean(),
  report: reportSchema.optional(),
  smoke: smokeSchema.optional(),
  error: z.string().optional(),
}).passthrough();

export type ProviderId = z.infer<typeof providerIdSchema>;
export type ProviderReport = z.infer<typeof reportSchema>;
export type ProviderSmoke = z.infer<typeof smokeSchema>;
export type ProviderPayload = z.infer<typeof payloadSchema>;
