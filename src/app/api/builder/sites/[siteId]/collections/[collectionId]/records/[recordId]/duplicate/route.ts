import { NextRequest, NextResponse } from 'next/server';
import {
  BuilderCmsValidationError,
  duplicateEditableBuilderCmsRecord,
} from '@/lib/builder/cms-editable';
import { isBuilderCollectionId } from '@/lib/builder/cms';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import { guardMutation } from '@/lib/builder/security/guard';

export async function POST(
  request: NextRequest,
  { params }: { params: { siteId: string; collectionId: string; recordId: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }
  if (isBuilderCollectionId(params.collectionId)) {
    return NextResponse.json(
      { ok: false, error: 'Static source collection records cannot be duplicated here.' },
      { status: 409 },
    );
  }

  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale');
    const record = await duplicateEditableBuilderCmsRecord(
      params.siteId,
      locale,
      params.collectionId,
      params.recordId,
    );
    if (!record) {
      return NextResponse.json({ ok: false, error: 'Unknown CMS record.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, record }, { status: 201 });
  } catch (error) {
    if (error instanceof BuilderCmsValidationError) {
      return NextResponse.json(
        { ok: false, error: error.message, issues: error.issues },
        { status: 400 },
      );
    }
    console.error('[builder-cms-record] duplicate failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to duplicate CMS record.' },
      { status: 500 },
    );
  }
}
