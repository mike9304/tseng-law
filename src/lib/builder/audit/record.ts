import { writeAuditEvent } from '@/lib/builder/audit/store';
import type {
  AuditEvent,
  AuditEventType,
  CommerceSettingsArea,
  CmsRecordsBulkLifecycleAction,
} from '@/lib/builder/audit/types';
import type { TranslationSiteReviewInput } from '@/lib/builder/publish-gate/translation-policy-review';

export async function recordAssetUpload(opts: {
  request: Request;
  assetId: string;
  mime: string;
  size: number;
}): Promise<void> {
  await recordAuditEvent({
    type: 'asset.upload',
    at: nowIso(),
    actorRef: extractActorRef(opts.request),
    assetId: opts.assetId,
    mime: opts.mime,
    size: opts.size,
  });
}

export async function recordAssetDelete(opts: {
  request: Request;
  assetId: string;
}): Promise<void> {
  await recordAuditEvent({
    type: 'asset.delete',
    at: nowIso(),
    actorRef: extractActorRef(opts.request),
    assetId: opts.assetId,
  });
}

export async function recordPublishSuccess(opts: {
  request: Request;
  siteId: string;
  pageId: string;
  revision: number;
  revisionId: string;
}): Promise<void> {
  await recordAuditEvent({
    type: 'publish.success',
    at: nowIso(),
    actorRef: extractActorRef(opts.request),
    siteId: opts.siteId,
    pageId: opts.pageId,
    revision: opts.revision,
    revisionId: opts.revisionId,
  });
}

export async function recordTranslationPublishPolicyReview(opts: {
  request: Request;
  siteId: string;
  pageId: string;
  action: 'publish' | 'schedule';
  review: TranslationSiteReviewInput;
  scheduledAt?: string;
  jobId?: string;
}): Promise<void> {
  await recordAuditEvent({
    type: 'publish.translation_site_review',
    at: nowIso(),
    actorRef: extractActorRef(opts.request),
    siteId: opts.siteId,
    pageId: opts.pageId,
    action: opts.action,
    sourceLocale: opts.review.sourceLocale,
    syncedAt: opts.review.syncedAt,
    totalCount: opts.review.totalCount,
    currentPageCount: opts.review.currentPageCount,
    otherPageCount: opts.review.otherPageCount,
    warningCount: opts.review.warningCount,
    errorCount: opts.review.errorCount,
    reviewHref: opts.review.reviewHref,
    ...(opts.scheduledAt ? { scheduledAt: opts.scheduledAt } : {}),
    ...(opts.jobId ? { jobId: opts.jobId } : {}),
  });
}

export async function recordPublishBlocked(opts: {
  request: Request;
  siteId: string;
  pageId: string;
  blockerCount: number;
}): Promise<void> {
  await recordAuditEvent({
    type: 'publish.blocked',
    at: nowIso(),
    actorRef: extractActorRef(opts.request),
    siteId: opts.siteId,
    pageId: opts.pageId,
    blockerCount: opts.blockerCount,
  });
}

export async function recordPublishFailure(opts: {
  request: Request;
  siteId: string;
  pageId: string;
  reason: string;
}): Promise<void> {
  await recordAuditEvent({
    type: 'publish.failure',
    at: nowIso(),
    actorRef: extractActorRef(opts.request),
    siteId: opts.siteId,
    pageId: opts.pageId,
    reason: sanitizeReason(opts.reason),
  });
}

export async function recordPageRollback(opts: {
  request: Request;
  siteId: string;
  pageId: string;
  revisionId: string;
  backupRevisionId?: string | null;
}): Promise<void> {
  await recordAuditEvent({
    type: 'page.rollback',
    at: nowIso(),
    actorRef: extractActorRef(opts.request),
    siteId: opts.siteId,
    pageId: opts.pageId,
    revisionId: opts.revisionId,
    ...(opts.backupRevisionId ? { backupRevisionId: opts.backupRevisionId } : {}),
  });
}

export async function recordColumnEvent(opts: {
  request: Request;
  type: 'create' | 'update' | 'delete' | 'publish';
  slug: string;
  locale: string;
}): Promise<void> {
  await recordAuditEvent({
    type: `column.${opts.type}` as Extract<AuditEventType, `column.${string}`>,
    at: nowIso(),
    actorRef: extractActorRef(opts.request),
    slug: opts.slug,
    locale: opts.locale,
  });
}

export async function recordCmsRecordsBulkLifecycle(opts: {
  request: Request;
  siteId: string;
  collectionId: string;
  action: CmsRecordsBulkLifecycleAction;
  recordIds: readonly string[];
  requestedCount: number;
  changedCount: number;
  locale?: string | null;
  status?: string;
  slugField?: string;
  sourceFieldKey?: string;
  slugPattern?: string;
  slugConflictRule?: string;
  missingRecordIds?: readonly string[];
  skippedRecordIds?: readonly string[];
}): Promise<void> {
  const locale = optionalAuditText(opts.locale);
  const status = optionalAuditText(opts.status);
  const slugField = optionalAuditText(opts.slugField);
  const sourceFieldKey = optionalAuditText(opts.sourceFieldKey);
  const slugPattern = optionalAuditText(opts.slugPattern);
  const slugConflictRule = optionalAuditText(opts.slugConflictRule);

  await recordAuditEvent({
    type: 'cms.records.bulk_lifecycle',
    at: nowIso(),
    actorRef: extractActorRef(opts.request),
    siteId: opts.siteId,
    collectionId: opts.collectionId,
    action: opts.action,
    recordIds: [...opts.recordIds],
    requestedCount: opts.requestedCount,
    changedCount: opts.changedCount,
    ...(locale ? { locale } : {}),
    ...(status ? { status } : {}),
    ...(slugField ? { slugField } : {}),
    ...(sourceFieldKey ? { sourceFieldKey } : {}),
    ...(slugPattern ? { slugPattern } : {}),
    ...(slugConflictRule ? { slugConflictRule } : {}),
    ...(opts.missingRecordIds?.length ? { missingRecordIds: [...opts.missingRecordIds] } : {}),
    ...(opts.skippedRecordIds?.length ? { skippedRecordIds: [...opts.skippedRecordIds] } : {}),
  });
}

export async function recordSecurityUserEvent(opts: {
  request: Request;
  type: 'created' | 'updated' | 'removed';
  username: string;
  role?: string;
}): Promise<void> {
  await recordAuditEvent({
    type: `security.user_${opts.type}` as Extract<AuditEventType, `security.user_${string}`>,
    at: nowIso(),
    actorRef: extractActorRef(opts.request),
    username: opts.username,
    ...(opts.role ? { role: opts.role } : {}),
  });
}

export async function recordCmsRecordEvent(opts: {
  request: Request;
  type: 'created' | 'updated' | 'deleted';
  siteId: string;
  collectionId: string;
  recordId: string;
}): Promise<void> {
  await recordAuditEvent({
    type: `cms.record_${opts.type}` as Extract<AuditEventType, `cms.record_${string}`>,
    at: nowIso(),
    actorRef: extractActorRef(opts.request),
    siteId: opts.siteId,
    collectionId: opts.collectionId,
    recordId: opts.recordId,
  });
}

export async function recordCommerceSettingsUpdated(opts: {
  request: Request;
  area: CommerceSettingsArea;
}): Promise<void> {
  await recordAuditEvent({
    type: 'commerce.settings_updated',
    at: nowIso(),
    actorRef: extractActorRef(opts.request),
    area: opts.area,
  });
}

async function recordAuditEvent(event: AuditEvent): Promise<void> {
  try {
    await writeAuditEvent(event);
  } catch (error) {
    console.warn('[builder-audit] rejected audit event', {
      type: event.type,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

function extractActorRef(request: Request): string | undefined {
  const header = request.headers.get('authorization');
  if (!header?.toLowerCase().startsWith('basic ')) return undefined;
  return 'admin';
}

function sanitizeReason(reason: string): string {
  const normalized = reason
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 120);

  return normalized || 'unknown_error';
}

function optionalAuditText(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}
