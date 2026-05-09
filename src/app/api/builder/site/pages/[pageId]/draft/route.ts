import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  readPageCanvasRecordState,
  updatePageCanvasRecord,
} from '@/lib/builder/site/persistence';
import { normalizeLocale } from '@/lib/locales';
import { normalizeCanvasDocument } from '@/lib/builder/canvas/types';
import { repairHomeCanvasLocale } from '@/lib/builder/canvas/home-locale-repair';
import type { PageCanvasRecord } from '@/lib/builder/site/types';

export const runtime = 'nodejs';

function draftMeta(record: PageCanvasRecord) {
  return {
    revision: record.revision,
    savedAt: record.savedAt,
    updatedBy: record.updatedBy,
  };
}

class DraftWriteError extends Error {
  constructor(
    readonly status: 409 | 428,
    message: string,
    readonly current: { revision: number; savedAt?: string },
  ) {
    super(message);
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  const state = await readPageCanvasRecordState('default', params.pageId, 'draft');

  if (!state) {
    return NextResponse.json({ ok: false, error: 'Draft not found' }, { status: 404 });
  }

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const document = repairHomeCanvasLocale(
    normalizeCanvasDocument(state.record.document, locale),
    locale,
  );

  return NextResponse.json({
    ok: true,
    draft: draftMeta(state.record),
    document,
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  let body: { expectedRevision?: unknown; document?: unknown };
  try {
    body = (await request.json()) as { expectedRevision?: unknown; document?: unknown };
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const expectedRevision =
    typeof body.expectedRevision === 'number' && Number.isInteger(body.expectedRevision)
      ? body.expectedRevision
      : undefined;
  const normalized = normalizeCanvasDocument(body.document, locale);
  let record: PageCanvasRecord;

  try {
    record = await updatePageCanvasRecord('default', params.pageId, 'draft', (currentState) => {
      const current = currentState?.record ?? null;

      if (currentState?.isEnvelope && expectedRevision === undefined) {
        throw new DraftWriteError(
          428,
          'expected_revision_required',
          { revision: currentState.record.revision, savedAt: currentState.record.savedAt },
        );
      }

      if (current && expectedRevision !== undefined && expectedRevision !== current.revision) {
        throw new DraftWriteError(
          409,
          'draft_conflict',
          { revision: current.revision, savedAt: current.savedAt },
        );
      }

      if (!current && expectedRevision !== undefined && expectedRevision !== 0) {
        throw new DraftWriteError(
          409,
          'draft_conflict',
          { revision: 0, savedAt: new Date(0).toISOString() },
        );
      }

      return {
        revision: current ? current.revision + 1 : 0,
        savedAt: new Date().toISOString(),
        updatedBy: 'admin',
        document: normalized,
      };
    });
  } catch (error) {
    if (error instanceof DraftWriteError) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
          current: error.current,
        },
        { status: error.status },
      );
    }
    throw error;
  }

  return NextResponse.json({
    ok: true,
    draft: draftMeta(record),
    document: normalized,
  });
}
