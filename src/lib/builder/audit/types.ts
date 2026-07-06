import { auditEventSchema } from '@/lib/builder/audit/event-schemas';
import { assertNoForbiddenKeys } from '@/lib/builder/audit/sensitive-keys';
export { assertNoForbiddenKeys, FORBIDDEN_KEYS } from '@/lib/builder/audit/sensitive-keys';

export type AuditEventType =
  | 'asset.upload'
  | 'asset.delete'
  | 'publish.success'
  | 'publish.translation_site_review'
  | 'publish.blocked'
  | 'publish.failure'
  | 'page.rollback'
  | 'column.create'
  | 'column.update'
  | 'column.delete'
  | 'column.publish'
  | 'cms.records.bulk_lifecycle'
  | 'cms.record_created'
  | 'cms.record_updated'
  | 'cms.record_deleted'
  | 'security.user_created'
  | 'security.user_updated'
  | 'security.user_removed'
  | 'commerce.settings_updated';

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

export interface PublishTranslationSiteReviewEvent extends AuditEventBase {
  type: 'publish.translation_site_review';
  siteId: string;
  pageId: string;
  action: 'publish' | 'schedule';
  sourceLocale: string;
  syncedAt: string;
  totalCount: number;
  currentPageCount: number;
  otherPageCount: number;
  warningCount: number;
  errorCount: number;
  reviewHref: string;
  scheduledAt?: string;
  jobId?: string;
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

export type CmsRecordsBulkLifecycleAction =
  | 'delete'
  | 'generate-slugs'
  | 'repair-slug-conflicts'
  | 'status';

export interface CmsRecordsBulkLifecycleEvent extends AuditEventBase {
  type: 'cms.records.bulk_lifecycle';
  siteId: string;
  collectionId: string;
  action: CmsRecordsBulkLifecycleAction;
  recordIds: readonly string[];
  requestedCount: number;
  changedCount: number;
  locale?: string;
  status?: string;
  slugField?: string;
  sourceFieldKey?: string;
  slugPattern?: string;
  slugConflictRule?: string;
  missingRecordIds?: readonly string[];
  skippedRecordIds?: readonly string[];
}

export interface SecurityUserEvent extends AuditEventBase {
  type: 'security.user_created' | 'security.user_updated' | 'security.user_removed';
  username: string;
  role?: string;
}

export interface CmsRecordEvent extends AuditEventBase {
  type: 'cms.record_created' | 'cms.record_updated' | 'cms.record_deleted';
  siteId: string;
  collectionId: string;
  recordId: string;
}

export type CommerceSettingsArea = 'payments' | 'currency' | 'notifications' | 'webhooks';

export interface CommerceSettingsUpdatedEvent extends AuditEventBase {
  type: 'commerce.settings_updated';
  area: CommerceSettingsArea;
}

export type AuditEvent =
  | AssetUploadEvent
  | AssetDeleteEvent
  | PublishSuccessEvent
  | PublishTranslationSiteReviewEvent
  | PublishBlockedEvent
  | PublishFailureEvent
  | PageRollbackEvent
  | ColumnEvent
  | CmsRecordsBulkLifecycleEvent
  | SecurityUserEvent
  | CmsRecordEvent
  | CommerceSettingsUpdatedEvent;

export function parseAuditEvent(event: unknown): AuditEvent {
  assertNoForbiddenKeys(event);
  return auditEventSchema.parse(event);
}
