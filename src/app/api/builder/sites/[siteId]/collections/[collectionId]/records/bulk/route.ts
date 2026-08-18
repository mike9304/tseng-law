import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  BuilderCmsPermissionError,
  BuilderCmsValidationError,
  bulkUpdateEditableBuilderCmsRecordStatus,
} from '@/lib/builder/cms-editable';
import {
  bulkRestoreTrashedEditableBuilderCmsRecords,
  bulkTrashEditableBuilderCmsRecords,
} from '@/lib/builder/cms-record-trash';
import { bulkRepairEditableBuilderCmsRecordSlugConflicts } from '@/lib/builder/cms-slug-conflict-repair';
import { BUILDER_CMS_SLUG_CONFLICT_RULE_VALUES } from '@/lib/builder/cms-slug-conflict-rule';
import { bulkGenerateEditableBuilderCmsRecordSlugs } from '@/lib/builder/cms-slug-repair';
import { isBuilderCollectionId } from '@/lib/builder/cms';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import { guardMutation } from '@/lib/builder/security/guard';
import { resolveBuilderCmsRouteActor } from '@/lib/builder/cms-route-actor';
import { recordCmsRecordsBulkLifecycle } from '@/lib/builder/audit/record';

const bulkRecordPayloadSchema = z.object({
  action: z.string().optional(),
  recordIds: z.array(z.string()).optional(),
  status: z.unknown().optional(),
  moderationReason: z.unknown().optional(),
  slugField: z.string().optional(),
  sourceFieldKey: z.string().optional(),
  slugPattern: z.string().optional(),
  slugConflictRule: z.enum(BUILDER_CMS_SLUG_CONFLICT_RULE_VALUES).optional(),
});

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ siteId: string; collectionId: string }> }
) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }
  if (isBuilderCollectionId(params.collectionId)) {
    return NextResponse.json(
      { ok: false, error: 'Static source collection records cannot be edited here.' },
      { status: 409 },
    );
  }

  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale');
    const payload = bulkRecordPayloadSchema.parse(await request.json());
    const action = payload.action ?? '';
    const routeActor = resolveBuilderCmsRouteActor(auth, request);

    if (action === 'delete') {
      const result = await bulkTrashEditableBuilderCmsRecords(
        params.siteId,
        locale,
        params.collectionId,
        payload.recordIds,
        routeActor,
      );
      if (!result) {
        return NextResponse.json({ ok: false, error: 'Unknown builder collection.' }, { status: 404 });
      }
      await recordCmsRecordsBulkLifecycle({
        request,
        siteId: params.siteId,
        collectionId: params.collectionId,
        action,
        recordIds: auditRecordIds(payload.recordIds),
        requestedCount: result.requested,
        changedCount: result.deleted,
        locale,
        missingRecordIds: result.missingRecordIds,
      });
      return NextResponse.json({ ok: true, actor: routeActor.actor, action, ...result });
    }

    if (action === 'restore-deleted') {
      const result = await bulkRestoreTrashedEditableBuilderCmsRecords(
        params.siteId,
        locale,
        params.collectionId,
        payload.recordIds,
        routeActor,
      );
      if (!result) {
        return NextResponse.json({ ok: false, error: 'Unknown builder collection.' }, { status: 404 });
      }
      await recordCmsRecordsBulkLifecycle({
        request,
        siteId: params.siteId,
        collectionId: params.collectionId,
        action: 'status',
        recordIds: auditRecordIds(payload.recordIds),
        requestedCount: result.requested,
        changedCount: result.restored,
        locale,
        status: 'archived',
        missingRecordIds: result.missingRecordIds,
        skippedRecordIds: result.skippedRecordIds,
      });
      return NextResponse.json({ ok: true, actor: routeActor.actor, action, ...result });
    }

    if (action === 'generate-slugs') {
      const result = await bulkGenerateEditableBuilderCmsRecordSlugs(
        params.siteId,
        locale,
        params.collectionId,
        payload.recordIds,
        payload.slugField,
        routeActor,
        payload.sourceFieldKey,
        payload.slugPattern,
      );
      if (!result) {
        return NextResponse.json({ ok: false, error: 'Unknown builder collection.' }, { status: 404 });
      }
      await recordCmsRecordsBulkLifecycle({
        request,
        siteId: params.siteId,
        collectionId: params.collectionId,
        action,
        recordIds: auditRecordIds(payload.recordIds),
        requestedCount: result.requested,
        changedCount: result.updated,
        locale,
        slugField: result.slugField,
        sourceFieldKey: result.sourceFieldKey,
        slugPattern: result.slugPattern,
        missingRecordIds: result.missingRecordIds,
        skippedRecordIds: result.skippedRecordIds,
      });
      return NextResponse.json({ ok: true, actor: routeActor.actor, action, ...result });
    }

    if (action === 'repair-slug-conflicts') {
      const result = await bulkRepairEditableBuilderCmsRecordSlugConflicts(
        params.siteId,
        locale,
        params.collectionId,
        payload.recordIds,
        payload.slugField,
        routeActor,
        payload.sourceFieldKey,
        payload.slugPattern,
        payload.slugConflictRule,
      );
      if (!result) {
        return NextResponse.json({ ok: false, error: 'Unknown builder collection.' }, { status: 404 });
      }
      await recordCmsRecordsBulkLifecycle({
        request,
        siteId: params.siteId,
        collectionId: params.collectionId,
        action,
        recordIds: auditRecordIds(payload.recordIds),
        requestedCount: result.requested,
        changedCount: result.updated,
        locale,
        slugField: result.slugField,
        sourceFieldKey: result.sourceFieldKey,
        slugPattern: result.slugPattern,
        slugConflictRule: result.slugConflictRule,
        missingRecordIds: result.missingRecordIds,
        skippedRecordIds: result.skippedRecordIds,
      });
      return NextResponse.json({ ok: true, actor: routeActor.actor, action, ...result });
    }

    const status = statusFromBulkAction(action, payload.status);
    const result = await bulkUpdateEditableBuilderCmsRecordStatus(
      params.siteId,
      locale,
      params.collectionId,
      payload.recordIds,
      status,
      payload.moderationReason,
      routeActor,
    );
    if (!result) {
      return NextResponse.json({ ok: false, error: 'Unknown builder collection.' }, { status: 404 });
    }
    await recordCmsRecordsBulkLifecycle({
      request,
      siteId: params.siteId,
      collectionId: params.collectionId,
      action: 'status',
      recordIds: auditRecordIds(payload.recordIds),
      requestedCount: result.requested,
      changedCount: result.updated,
      locale,
      status: typeof status === 'string' ? status : undefined,
      missingRecordIds: result.missingRecordIds,
    });
    return NextResponse.json({ ok: true, actor: routeActor.actor, action: 'status', status, ...result });
  } catch (error) {
    if (error instanceof BuilderCmsPermissionError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 403 });
    }
    if (error instanceof BuilderCmsValidationError) {
      return NextResponse.json(
        { ok: false, error: error.message, issues: error.issues },
        { status: 400 },
      );
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, error: 'Invalid CMS records bulk payload.', issues: error.issues.map((issue) => issue.message) },
        { status: 400 },
      );
    }
    console.error('[builder-cms-records-bulk] mutation failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update CMS records.' },
      { status: 500 },
    );
  }
}

function statusFromBulkAction(action: string, status: unknown) {
  if (action === 'archive') return 'archived';
  if (action === 'publish') return 'published';
  if (action === 'draft') return 'draft';
  return status;
}

function auditRecordIds(recordIds: readonly string[] | undefined): readonly string[] {
  return [...new Set(recordIds ?? [])];
}
