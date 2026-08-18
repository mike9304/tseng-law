import { NextRequest, NextResponse } from 'next/server';
import {
  BuilderCmsPermissionError,
  BuilderCmsValidationError,
  exportEditableBuilderCmsRecordsCsv,
  importEditableBuilderCmsRecordsCsv,
  type BuilderCmsCsvImportMode,
} from '@/lib/builder/cms-editable';
import { isBuilderCollectionId } from '@/lib/builder/cms';
import { isDefaultBuilderSiteId } from '@/lib/builder/site';
import { guardMutation } from '@/lib/builder/security/guard';
import { CMS_ACTOR_HEADER, resolveBuilderCmsRouteActor } from '@/lib/builder/cms-route-actor';

export async function GET(
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
      { ok: false, error: 'Static source collection records cannot be exported here.' },
      { status: 409 },
    );
  }

  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale');
    const recordIds = url.searchParams.getAll('recordIds');
    const routeActor = resolveBuilderCmsRouteActor(auth, request);
    const result = await exportEditableBuilderCmsRecordsCsv(
      params.siteId,
      locale,
      params.collectionId,
      { ...routeActor, recordIds: recordIds.length > 0 ? recordIds : undefined },
    );
    if (!result) {
      return NextResponse.json({ ok: false, error: 'Unknown builder collection.' }, { status: 404 });
    }
    return new NextResponse(result.csv, {
      status: 200,
      headers: {
        'content-disposition': `attachment; filename="${result.filename}"`,
        'content-type': 'text/csv; charset=utf-8',
        [CMS_ACTOR_HEADER]: routeActor.actor,
      },
    });
  } catch (error) {
    if (error instanceof BuilderCmsPermissionError) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 403 });
    }
    console.error('[builder-cms-records-csv] export failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to export CMS records.' },
      { status: 500 },
    );
  }
}

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
      { ok: false, error: 'Static source collection records cannot be imported here.' },
      { status: 409 },
    );
  }

  try {
    const url = new URL(request.url);
    const locale = url.searchParams.get('locale');
    const payload = await request.json() as { csv?: unknown; mode?: unknown; columnMap?: unknown; duplicateMode?: unknown };
    const mode: BuilderCmsCsvImportMode = payload.mode === 'replace' ? 'replace' : 'append';
    const csv = typeof payload.csv === 'string' ? payload.csv : '';
    const columnMap = isCsvColumnMap(payload.columnMap) ? payload.columnMap : undefined;
    const duplicateMode = payload.duplicateMode === true;
    const routeActor = resolveBuilderCmsRouteActor(auth, request);
    const result = await importEditableBuilderCmsRecordsCsv(
      params.siteId,
      locale,
      params.collectionId,
      csv,
      { mode, columnMap, duplicateMode, ...routeActor },
    );
    if (!result) {
      return NextResponse.json({ ok: false, error: 'Unknown builder collection.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, actor: routeActor.actor, ...result }, { status: 201 });
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
    console.error('[builder-cms-records-csv] import failed', error);
    return NextResponse.json(
      { ok: false, error: 'Failed to import CMS records.' },
      { status: 500 },
    );
  }
}

function isCsvColumnMap(input: unknown): input is Record<string, string> {
  return !!input &&
    typeof input === 'object' &&
    !Array.isArray(input) &&
    Object.values(input).every((value) => typeof value === 'string');
}
