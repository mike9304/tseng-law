import { z } from 'zod';
import type { AuditEvent } from '@/lib/builder/audit/types';

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
      type: z.literal('publish.translation_site_review'),
      siteId: auditString,
      pageId: auditString,
      action: z.enum(['publish', 'schedule']),
      sourceLocale: auditString,
      syncedAt: isoDateTime,
      totalCount: z.number().int().nonnegative(),
      currentPageCount: z.number().int().nonnegative(),
      otherPageCount: z.number().int().nonnegative(),
      warningCount: z.number().int().nonnegative(),
      errorCount: z.number().int().nonnegative(),
      reviewHref: auditIdString,
      scheduledAt: isoDateTime.optional(),
      jobId: auditIdString.optional(),
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
  auditEventBaseSchema
    .extend({
      type: z.literal('cms.records.bulk_lifecycle'),
      siteId: auditString,
      collectionId: auditIdString,
      action: z.enum(['delete', 'generate-slugs', 'repair-slug-conflicts', 'status']),
      recordIds: z.array(auditIdString),
      requestedCount: z.number().int().nonnegative(),
      changedCount: z.number().int().nonnegative(),
      locale: auditString.optional(),
      status: auditString.optional(),
      slugField: auditString.optional(),
      sourceFieldKey: auditString.optional(),
      slugPattern: auditString.optional(),
      slugConflictRule: auditString.optional(),
      missingRecordIds: z.array(auditIdString).optional(),
      skippedRecordIds: z.array(auditIdString).optional(),
    })
    .strict(),
  auditEventBaseSchema
    .extend({
      type: z.literal('security.user_created'),
      username: auditString,
      role: auditString,
    })
    .strict(),
  auditEventBaseSchema
    .extend({
      type: z.literal('security.user_updated'),
      username: auditString,
      role: auditString,
    })
    .strict(),
  auditEventBaseSchema
    .extend({
      type: z.literal('security.user_removed'),
      username: auditString,
      role: auditString.optional(),
    })
    .strict(),
  auditEventBaseSchema
    .extend({
      type: z.literal('cms.record_created'),
      siteId: auditString,
      collectionId: auditIdString,
      recordId: auditIdString,
    })
    .strict(),
  auditEventBaseSchema
    .extend({
      type: z.literal('cms.record_updated'),
      siteId: auditString,
      collectionId: auditIdString,
      recordId: auditIdString,
    })
    .strict(),
  auditEventBaseSchema
    .extend({
      type: z.literal('cms.record_deleted'),
      siteId: auditString,
      collectionId: auditIdString,
      recordId: auditIdString,
    })
    .strict(),
  auditEventBaseSchema
    .extend({
      type: z.literal('commerce.settings_updated'),
      area: z.enum(['payments', 'currency', 'notifications', 'webhooks']),
    })
    .strict(),
]) satisfies z.ZodType<AuditEvent>;
