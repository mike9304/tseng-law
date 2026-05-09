/**
 * Revisions API for a single canvas-scene page.
 *
 *   GET  /api/builder/site/pages/[pageId]/revisions
 *        → { revisions: PageRevision[] }
 *
 *   GET  /api/builder/site/pages/[pageId]/revisions?revisionId=...
 *        → { revision: PageRevision, document: BuilderCanvasDocument }
 *
 *   POST /api/builder/site/pages/[pageId]/revisions
 *        Body: { document: BuilderCanvasDocument, source?: string }
 *        Manually snapshot the current draft to revisions store.
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  listRevisions,
  recordRevision,
  readRevisionDocument,
} from '@/lib/builder/site/publish';
import { readPageCanvas } from '@/lib/builder/site/persistence';
import { guardMutation } from '@/lib/builder/security/guard';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  const pageId = params.pageId;
  const revisionId = request.nextUrl.searchParams.get('revisionId');

  if (revisionId) {
    const detail = await readRevisionDocument(pageId, revisionId);
    if (!detail) {
      return NextResponse.json({ ok: false, error: 'Revision not found.' }, { status: 404 });
    }
    return NextResponse.json({ ok: true, revisionId, document: detail });
  }

  const revisions = await listRevisions(pageId);
  return NextResponse.json({ ok: true, revisions });
}

export async function POST(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  const pageId = params.pageId;

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  let doc = body.document as BuilderCanvasDocument | undefined;
  const siteId = typeof body.siteId === 'string' && body.siteId.trim() ? body.siteId.trim() : 'default';
  const source = typeof body.source === 'string' ? body.source : 'manual';

  if (!doc) {
    const draft = await readPageCanvas(siteId, pageId, 'draft');
    if (!draft) {
      return NextResponse.json({ ok: false, error: 'No draft to snapshot.' }, { status: 404 });
    }
    doc = draft;
  }

  const revisionId = await recordRevision(pageId, doc, { source });
  return NextResponse.json({ ok: true, revisionId });
}
