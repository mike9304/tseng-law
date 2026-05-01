import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  readPageCanvasRecordState,
  writePageCanvasRecord,
} from '@/lib/builder/site/persistence';
import { normalizeLocale } from '@/lib/locales';
import { normalizeCanvasDocument } from '@/lib/builder/canvas/types';
import type { PageCanvasRecord } from '@/lib/builder/site/types';

export const runtime = 'nodejs';

function draftMeta(record: PageCanvasRecord) {
  return {
    revision: record.revision,
    savedAt: record.savedAt,
    updatedBy: record.updatedBy,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  const state = await readPageCanvasRecordState('default', params.pageId, 'draft');

  if (!state) {
    return NextResponse.json({ ok: false, error: 'Draft not found' }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    draft: draftMeta(state.record),
    document: state.record.document,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  let body: { expectedRevision?: unknown; document?: unknown };
  try {
    body = (await request.json()) as { expectedRevision?: unknown; document?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const currentState = await readPageCanvasRecordState('default', params.pageId, 'draft');
  const current = currentState?.record ?? null;
  const expectedRevision =
    typeof body.expectedRevision === 'number' && Number.isInteger(body.expectedRevision)
      ? body.expectedRevision
      : undefined;

  if (currentState?.isEnvelope && expectedRevision === undefined) {
    return NextResponse.json(
      {
        ok: false,
        error: 'expected_revision_required',
        current: { revision: currentState.record.revision },
      },
      { status: 428 },
    );
  }

  if (current && expectedRevision !== undefined && expectedRevision !== current.revision) {
    return NextResponse.json(
      {
        ok: false,
        error: 'draft_conflict',
        current: {
          revision: current.revision,
          savedAt: current.savedAt,
        },
      },
      { status: 409 },
    );
  }

  if (!current && expectedRevision !== undefined && expectedRevision !== 0) {
    return NextResponse.json(
      {
        ok: false,
        error: 'draft_conflict',
        current: {
          revision: 0,
          savedAt: new Date(0).toISOString(),
        },
      },
      { status: 409 },
    );
  }

  const normalized = normalizeCanvasDocument(body.document, locale);
  const record: PageCanvasRecord = {
    revision: current ? current.revision + 1 : 0,
    savedAt: new Date().toISOString(),
    updatedBy: 'admin',
    document: normalized,
  };

  await writePageCanvasRecord('default', params.pageId, record, 'draft');

  return NextResponse.json({
    ok: true,
    draft: draftMeta(record),
    document: normalized,
  });
}
