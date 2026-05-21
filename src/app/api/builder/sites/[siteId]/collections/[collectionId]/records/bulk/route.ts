import { NextRequest, NextResponse } from 'next/server';
import {
  BuilderCmsPermissionError,
  BuilderCmsValidationError,
  bulkDeleteEditableBuilderCmsRecords,
  bulkUpdateEditableBuilderCmsRecordStatus,
} from '@/lib/builder/cms-editable';
import { isBuilderCollectionId } from '@/lib/builder/cms';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import { guardMutation } from '@/lib/builder/security/guard';
import { resolveBuilderCmsRouteActor } from '@/lib/builder/cms-route-actor';

type BulkRecordPayload = {
  action?: unknown;
  recordIds?: unknown;
  status?: unknown;
  moderationReason?: unknown;
};

export async function POST(
  request: NextRequest,
  { params }: { params: { siteId: string; collectionId: string } },
) {
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
    const payload = await request.json() as BulkRecordPayload;
    const action = String(payload.action ?? '');
    const routeActor = resolveBuilderCmsRouteActor(auth, request);

    if (action === 'delete') {
      const result = await bulkDeleteEditableBuilderCmsRecords(
        params.siteId,
        locale,
        params.collectionId,
        payload.recordIds,
        routeActor,
      );
      if (!result) {
        return NextResponse.json({ ok: false, error: 'Unknown builder collection.' }, { status: 404 });
      }
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
