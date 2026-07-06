import { NextRequest, NextResponse } from 'next/server';
import {
  isBuilderCollectionId,
  readBuilderCollectionDetailForSite,
} from '@/lib/builder/cms';
import {
  BuilderCmsValidationError,
  deleteEditableBuilderCmsCollection,
  readEditableBuilderCmsCollection,
  updateEditableBuilderCmsCollection,
} from '@/lib/builder/cms-editable';
import { readBuilderCmsDynamicItemRoutePoliciesForCollection } from '@/lib/builder/cms-dynamic-item-route-policy';
import { readEditableBuilderCmsCollectionTrash } from '@/lib/builder/cms-record-trash';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import { guardMutation } from '@/lib/builder/security/guard';

export async function GET(
  request: NextRequest,
  { params }: { params: { siteId: string; collectionId: string } }
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }

  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale');
    if (isBuilderCollectionId(params.collectionId)) {
      const detail = await readBuilderCollectionDetailForSite(params.siteId, params.collectionId, locale);
      return NextResponse.json({ ok: true, detail, source: 'static' });
    }

    const detail = await readEditableBuilderCmsCollection(params.siteId, locale, params.collectionId);
    if (!detail) {
      return NextResponse.json({ ok: false, error: 'Unknown builder collection.' }, { status: 404 });
    }
    const [trashedRecords, dynamicItemRoutePolicies] = await Promise.all([
      readEditableBuilderCmsCollectionTrash(
        params.siteId,
        locale,
        params.collectionId,
      ),
      readBuilderCmsDynamicItemRoutePoliciesForCollection(params.siteId, locale, params.collectionId),
    ]);
    return NextResponse.json({
      ok: true,
      detail: {
        ...detail,
        trashedRecords: trashedRecords ?? [],
        dynamicItemRoutePolicies,
      },
      source: 'editable',
    });
  } catch (error) {
    console.error('[builder-collection-detail] failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to read builder collection detail.' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { siteId: string; collectionId: string } }
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }
  if (isBuilderCollectionId(params.collectionId)) {
    return NextResponse.json(
      { ok: false, error: 'Static source collections cannot be edited here.' },
      { status: 409 },
    );
  }

  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale');
    const payload = await request.json();
    const detail = await updateEditableBuilderCmsCollection(
      params.siteId,
      locale,
      params.collectionId,
      payload,
    );
    if (!detail) {
      return NextResponse.json({ ok: false, error: 'Unknown builder collection.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, detail });
  } catch (error) {
    if (error instanceof BuilderCmsValidationError) {
      return NextResponse.json(
        { ok: false, error: error.message, issues: error.issues },
        { status: 400 },
      );
    }
    console.error('[builder-collection-detail] update failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to update builder collection.' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { siteId: string; collectionId: string } }
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }
  if (isBuilderCollectionId(params.collectionId)) {
    return NextResponse.json(
      { ok: false, error: 'Static source collections cannot be deleted here.' },
      { status: 409 },
    );
  }

  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale');
    const deleted = await deleteEditableBuilderCmsCollection(params.siteId, locale, params.collectionId);
    if (!deleted) {
      return NextResponse.json({ ok: false, error: 'Unknown builder collection.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[builder-collection-detail] delete failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to delete builder collection.' },
      { status: 500 },
    );
  }
}
