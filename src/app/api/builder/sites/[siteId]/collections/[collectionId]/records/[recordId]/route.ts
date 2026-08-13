import { NextRequest, NextResponse } from 'next/server';
import { recordCmsRecordEvent } from '@/lib/builder/audit/record';
import {
  BuilderCmsPermissionError,
  BuilderCmsValidationError,
  deleteEditableBuilderCmsRecord,
  readEditableBuilderCmsCollection,
  updateEditableBuilderCmsRecord,
} from '@/lib/builder/cms-editable';
import { isBuilderCollectionId } from '@/lib/builder/cms';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import { guardMutation } from '@/lib/builder/security/guard';
import { resolveBuilderCmsRouteActor } from '@/lib/builder/cms-route-actor';

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ siteId: string; collectionId: string; recordId: string }> }
) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }
  if (isBuilderCollectionId(params.collectionId)) {
    return NextResponse.json(
      { ok: false, error: 'Static source collection records are read through their detail endpoint.' },
      { status: 409 },
    );
  }

  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale');
    const routeActor = resolveBuilderCmsRouteActor(auth, request);
    const detail = await readEditableBuilderCmsCollection(
      params.siteId,
      locale,
      params.collectionId,
      routeActor,
    );
    const record = detail?.records.find((candidate) => candidate.recordId === params.recordId);
    if (!record) {
      return NextResponse.json({ ok: false, error: 'Unknown CMS record.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, actor: routeActor.actor, record });
  } catch (error) {
    if (error instanceof BuilderCmsPermissionError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 403 });
    }
    console.error('[builder-cms-record] read failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to read CMS record.' },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ siteId: string; collectionId: string; recordId: string }> }
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
    const payload = await request.json();
    const routeActor = resolveBuilderCmsRouteActor(auth, request);
    const record = await updateEditableBuilderCmsRecord(
      params.siteId,
      locale,
      params.collectionId,
      params.recordId,
      payload,
      routeActor,
    );
    if (!record) {
      return NextResponse.json({ ok: false, error: 'Unknown CMS record.' }, { status: 404 });
    }
    await recordCmsRecordEvent({
      request,
      type: 'updated',
      siteId: params.siteId,
      collectionId: params.collectionId,
      recordId: params.recordId,
    });
    return NextResponse.json({
      ok: true,
      actor: routeActor.actor,
      record,
      redirectCreated: record.redirectCreated ?? false,
      redirectWarnings: record.redirectWarnings ?? [],
    });
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
    console.error('[builder-cms-record] update failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update CMS record.' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ siteId: string; collectionId: string; recordId: string }> }
) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }
  if (isBuilderCollectionId(params.collectionId)) {
    return NextResponse.json(
      { ok: false, error: 'Static source collection records cannot be deleted here.' },
      { status: 409 },
    );
  }

  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale');
    const routeActor = resolveBuilderCmsRouteActor(auth, request);
    const deleted = await deleteEditableBuilderCmsRecord(
      params.siteId,
      locale,
      params.collectionId,
      params.recordId,
      routeActor,
    );
    if (!deleted) {
      return NextResponse.json({ ok: false, error: 'Unknown CMS record.' }, { status: 404 });
    }
    await recordCmsRecordEvent({
      request,
      type: 'deleted',
      siteId: params.siteId,
      collectionId: params.collectionId,
      recordId: params.recordId,
    });
    return NextResponse.json({ ok: true, actor: routeActor.actor });
  } catch (error) {
    if (error instanceof BuilderCmsPermissionError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 403 });
    }
    console.error('[builder-cms-record] delete failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete CMS record.' },
      { status: 500 },
    );
  }
}
