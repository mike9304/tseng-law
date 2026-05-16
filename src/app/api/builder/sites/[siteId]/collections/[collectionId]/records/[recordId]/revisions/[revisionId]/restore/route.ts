import { NextRequest, NextResponse } from 'next/server';
import {
  BuilderCmsPermissionError,
  BuilderCmsValidationError,
  restoreEditableBuilderCmsRecordRevision,
} from '@/lib/builder/cms-editable';
import { isBuilderCollectionId } from '@/lib/builder/cms';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import { guardMutation } from '@/lib/builder/security/guard';
import { resolveBuilderCmsRouteActor } from '@/lib/builder/cms-route-actor';

export async function POST(
  request: NextRequest,
  { params }: { params: { siteId: string; collectionId: string; recordId: string; revisionId: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }
  if (isBuilderCollectionId(params.collectionId)) {
    return NextResponse.json(
      { ok: false, error: 'Static source collection records cannot restore revisions here.' },
      { status: 409 },
    );
  }

  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale');
    const routeActor = resolveBuilderCmsRouteActor(auth, request);
    const record = await restoreEditableBuilderCmsRecordRevision(
      params.siteId,
      locale,
      params.collectionId,
      params.recordId,
      params.revisionId,
      routeActor,
    );
    if (!record) {
      return NextResponse.json({ ok: false, error: 'Unknown CMS revision.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, actor: routeActor.actor, record });
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
    console.error('[builder-cms-record-revision] restore failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to restore CMS record revision.' },
      { status: 500 },
    );
  }
}
