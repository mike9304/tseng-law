import { NextRequest, NextResponse } from 'next/server';
import { readBuilderCollectionDetailsForSite } from '@/lib/builder/cms';
import {
  BuilderCmsValidationError,
  createEditableBuilderCmsCollection,
  listEditableBuilderCmsCollections,
} from '@/lib/builder/cms-editable';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import { guardMutation } from '@/lib/builder/security/guard';

export async function GET(
  request: NextRequest,
  { params }: { params: { siteId: string } }
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }

  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale');
    const collections = await readBuilderCollectionDetailsForSite(params.siteId, locale);
    const editableCollections = await listEditableBuilderCmsCollections(params.siteId, locale);
    return NextResponse.json({ ok: true, collections, editableCollections });
  } catch (error) {
    console.error('[builder-collections] failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to read builder collections.' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { siteId: string } }
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }

  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale');
    const payload = await request.json();
    const detail = await createEditableBuilderCmsCollection(params.siteId, locale, payload);
    return NextResponse.json({ ok: true, detail }, { status: 201 });
  } catch (error) {
    if (error instanceof BuilderCmsValidationError) {
      return NextResponse.json(
        { ok: false, error: error.message, issues: error.issues },
        { status: 400 },
      );
    }
    console.error('[builder-collections] create failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to create builder collection.' },
      { status: 500 },
    );
  }
}
