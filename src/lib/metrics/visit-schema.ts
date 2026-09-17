import { z } from 'zod';

import type { Channel } from './classify-referrer';

export const visitEventBaseSchema = z.strictObject({
  v: z.literal(1),
  sid: z.string().min(8).max(64).regex(/^[A-Za-z0-9_-]+$/),
  ts: z.iso.datetime(),
});

export const visitUtmSchema = z.strictObject({
  source: z.string().max(120).optional(),
  medium: z.string().max(120).optional(),
  campaign: z.string().max(120).optional(),
});

const visitPathSchema = z.string().min(1).max(512).regex(/^\//);

const CONTACT_BLOCKED_SEGMENTS = new Set(['admin-builder', 'admin-consultation']);

/** Public contact_intent path: no query/fragment, no protocol-relative/admin segments. */
export function isContactIntentPath(path: string): boolean {
  if (path.length < 1 || path.length > 512) return false;
  if (!path.startsWith('/') || path.startsWith('//')) return false;
  if (path.includes('?') || path.includes('#') || path.includes('\\')) return false;
  for (const segment of path.split('/')) {
    if (CONTACT_BLOCKED_SEGMENTS.has(segment)) return false;
  }
  return true;
}

const contactIntentPathSchema = z.string().min(1).max(512).refine(isContactIntentPath);

export const pageviewEventSchema = visitEventBaseSchema.extend({
  type: z.literal('pageview'),
  path: visitPathSchema,
  locale: z.enum(['ko', 'zh-hant', 'en', 'ja']),
  ref: z.string().max(512).optional(),
  utm: visitUtmSchema.optional(),
  lang: z.string().max(16).optional(),
  vw: z.number().int().min(0).max(10_000).optional(),
  firstLoad: z.boolean(),
  contactTracking: z.literal(1).optional(),
});

export const engagementEventSchema = visitEventBaseSchema.extend({
  type: z.literal('engagement'),
  path: visitPathSchema,
  dwellMs: z.number().int().min(0).max(1_800_000),
  scrollPct: z.number().int().min(0).max(100).optional(),
});

export const contactIntentEventSchema = visitEventBaseSchema.extend({
  type: z.literal('contact_intent'),
  action: z.literal('email_compose'),
  path: contactIntentPathSchema,
  locale: z.enum(['ko', 'zh-hant', 'en', 'ja']),
}).strict();

export const visitEventSchema = z.discriminatedUnion('type', [
  pageviewEventSchema,
  engagementEventSchema,
  contactIntentEventSchema,
]);

export const collectRequestSchema = z.strictObject({
  events: z.array(visitEventSchema).min(1).max(25),
});

export type VisitEventBase = z.infer<typeof visitEventBaseSchema>;
export type VisitUtm = z.infer<typeof visitUtmSchema>;
export type PageviewEvent = z.infer<typeof pageviewEventSchema>;
export type EngagementEvent = z.infer<typeof engagementEventSchema>;
export type ContactIntentEvent = z.infer<typeof contactIntentEventSchema>;
export type VisitEvent = z.infer<typeof visitEventSchema>;
export type CollectRequest = z.infer<typeof collectRequestSchema>;

export type EnrichedVisitEvent = VisitEvent & {
  receivedAt: string;
  country?: string;
  channel?: Channel;
  source?: string | null;
  keyword?: string | null;
};
