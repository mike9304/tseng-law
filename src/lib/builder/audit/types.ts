import { z } from 'zod';

export type AuditEventType =
  | 'asset.upload'
  | 'asset.delete'
  | 'publish.success'
  | 'publish.blocked'
  | 'publish.failure'
  | 'page.rollback'
  | 'column.create'
  | 'column.update'
  | 'column.delete'
  | 'column.publish';

export interface AuditEventBase {
  type: AuditEventType;
  at: string;
  actorRef?: string;
  siteId?: string;
  pageId?: string;
}

export interface AssetUploadEvent extends AuditEventBase {
  type: 'asset.upload';
  assetId: string;
  mime: string;
  size: number;
}

export interface AssetDeleteEvent extends AuditEventBase {
  type: 'asset.delete';
  assetId: string;
}

export interface PublishSuccessEvent extends AuditEventBase {
  type: 'publish.success';
  siteId: string;
  pageId: string;
  revision: number;
  revisionId: string;
}

export interface PublishBlockedEvent extends AuditEventBase {
  type: 'publish.blocked';
  siteId: string;
  pageId: string;
  blockerCount: number;
}

export interface PublishFailureEvent extends AuditEventBase {
  type: 'publish.failure';
  siteId: string;
  pageId: string;
  reason: string;
}

export interface PageRollbackEvent extends AuditEventBase {
  type: 'page.rollback';
  siteId: string;
  pageId: string;
  revisionId: string;
  backupRevisionId?: string;
}

export interface ColumnEvent extends AuditEventBase {
  type: 'column.create' | 'column.update' | 'column.delete' | 'column.publish';
  slug: string;
  locale: string;
}

export type AuditEvent =
  | AssetUploadEvent
  | AssetDeleteEvent
  | PublishSuccessEvent
  | PublishBlockedEvent
  | PublishFailureEvent
  | PageRollbackEvent
  | ColumnEvent;

export const FORBIDDEN_KEYS = new Set([
  'body',
  'rawBody',
  'request',
  'response',
  'authorization',
  'cookie',
  'password',
  'token',
  'apiKey',
  'submission',
  'formValue',
  'webhook',
  'webhookUrl',
  'fileBytes',
  'imageBytes',
]);

const auditString = z.string().trim().min(1).max(240);
const auditIdString = z.string().trim().min(1).max(320);
const isoDateTime = z.string().datetime({ offset: true });

const auditEventBaseSchema = z.object({
  at: isoDateTime,
  actorRef: auditString.optional(),
  siteId: auditString.optional(),
  pageId: auditString.optional(),
});

export const auditEventSchema = z.discriminatedUnion('type', [
  auditEventBaseSchema
    .extend({
      type: z.literal('asset.upload'),
      assetId: auditIdString,
      mime: auditString,
      size: z.number().int().nonnegative(),
    })
    .strict(),
  auditEventBaseSchema
    .extend({
      type: z.literal('asset.delete'),
      assetId: auditIdString,
    })
    .strict(),
  auditEventBaseSchema
    .extend({
      type: z.literal('publish.success'),
      siteId: auditString,
      pageId: auditString,
      revision: z.number().int().nonnegative(),
      revisionId: auditIdString,
    })
    .strict(),
  auditEventBaseSchema
    .extend({
      type: z.literal('publish.blocked'),
      siteId: auditString,
      pageId: auditString,
      blockerCount: z.number().int().nonnegative(),
    })
    .strict(),
  auditEventBaseSchema
    .extend({
      type: z.literal('publish.failure'),
      siteId: auditString,
      pageId: auditString,
      reason: auditString.max(120),
    })
    .strict(),
  auditEventBaseSchema
    .extend({
      type: z.literal('page.rollback'),
      siteId: auditString,
      pageId: auditString,
      revisionId: auditIdString,
      backupRevisionId: auditIdString.optional(),
    })
    .strict(),
  auditEventBaseSchema
    .extend({
      type: z.literal('column.create'),
      slug: auditString,
      locale: auditString,
    })
    .strict(),
  auditEventBaseSchema
    .extend({
      type: z.literal('column.update'),
      slug: auditString,
      locale: auditString,
    })
    .strict(),
  auditEventBaseSchema
    .extend({
      type: z.literal('column.delete'),
      slug: auditString,
      locale: auditString,
    })
    .strict(),
  auditEventBaseSchema
    .extend({
      type: z.literal('column.publish'),
      slug: auditString,
      locale: auditString,
    })
    .strict(),
]) satisfies z.ZodType<AuditEvent>;

export function parseAuditEvent(event: unknown): AuditEvent {
  assertNoForbiddenKeys(event);
  return auditEventSchema.parse(event);
}

export function assertNoForbiddenKeys(value: unknown): void {
  visitAuditValue(value, new Set(), []);
}

function visitAuditValue(value: unknown, seen: Set<object>, path: string[]): void {
  if (!value || typeof value !== 'object') return;
  if (seen.has(value)) return;
  seen.add(value);

  if (Array.isArray(value)) {
    value.forEach((entry, index) => visitAuditValue(entry, seen, [...path, String(index)]));
    return;
  }

  for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
    const normalizedKey = key.toLowerCase();
    for (const forbiddenKey of FORBIDDEN_KEYS) {
      if (normalizedKey === forbiddenKey.toLowerCase()) {
        const dottedPath = [...path, key].join('.');
        throw new Error(`Audit event contains forbidden key: ${dottedPath}`);
      }
    }
    visitAuditValue(entry, seen, [...path, key]);
  }
}
