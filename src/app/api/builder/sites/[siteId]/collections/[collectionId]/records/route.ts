import { NextRequest, NextResponse } from 'next/server';
import {
  BuilderCmsPermissionError,
  BuilderCmsValidationError,
  createEditableBuilderCmsRecord,
  readEditableBuilderCmsCollection,
} from '@/lib/builder/cms-editable';
import { isBuilderCollectionId } from '@/lib/builder/cms';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import { guardMutation } from '@/lib/builder/security/guard';
import { resolveBuilderCmsRouteActor } from '@/lib/builder/cms-route-actor';

export async function GET(
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
    if (!detail) {
      return NextResponse.json({ ok: false, error: 'Unknown builder collection.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, actor: routeActor.actor, records: detail.records });
  } catch (error) {
    if (error instanceof BuilderCmsPermissionError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 403 });
    }
    console.error('[builder-cms-records] list failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to read CMS records.' },
      { status: 500 },
    );
  }
}

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
    const payload = await request.json();
    const routeActor = resolveBuilderCmsRouteActor(auth, request);
    const record = await createEditableBuilderCmsRecord(
      params.siteId,
      locale,
      params.collectionId,
      payload,
      routeActor,
    );
    if (!record) {
      return NextResponse.json({ ok: false, error: 'Unknown builder collection.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, actor: routeActor.actor, record }, { status: 201 });
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
    console.error('[builder-cms-records] create failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create CMS record.' },
      { status: 500 },
    );
  }
}
