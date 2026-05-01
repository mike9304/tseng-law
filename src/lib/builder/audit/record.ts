import { writeAuditEvent } from '@/lib/builder/audit/store';
import type { AuditEvent, AuditEventType } from '@/lib/builder/audit/types';

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
