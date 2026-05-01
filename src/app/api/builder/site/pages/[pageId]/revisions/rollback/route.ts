/**
 * POST /api/builder/site/pages/[pageId]/revisions/rollback
 *
 * Body: { siteId?: string, revisionId: string }
 * Restores the supplied revision into the draft. Auto-snapshots the
 * current draft first so rollback itself is reversible.
 *
 * Returns: { ok: true, document: BuilderCanvasDocument, backupRevisionId }
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  readRevisionDocument,
  recordRevision,
  rollbackToRevision,
} from '@/lib/builder/site/publish';
import { readPageCanvas } from '@/lib/builder/site/persistence';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';

export async function POST(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  const pageId = params.pageId;

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }

  const siteId = typeof body.siteId === 'string' && body.siteId.trim() ? body.siteId.trim() : 'default';
  const revisionId = typeof body.revisionId === 'string' ? body.revisionId.trim() : '';

  if (!revisionId) {
    return NextResponse.json({ ok: false, error: 'revisionId is required.' }, { status: 400 });
  }

  // Backup current draft before rollback (so the rollback is reversible).
  const currentDraft = await readPageCanvas(siteId, pageId, 'draft');
  let backupRevisionId: string | null = null;
  if (currentDraft) {
    try {
      backupRevisionId = await recordRevision(pageId, currentDraft, { source: 'rollback-backup' });
    } catch {
      backupRevisionId = null;
    }
  }

  const ok = await rollbackToRevision(siteId, pageId, revisionId);
  if (!ok) {
    return NextResponse.json({ ok: false, error: 'Rollback failed.' }, { status: 404 });
  }

  // Return the restored document for client-side replaceDocument
  const restored = await readRevisionDocument(pageId, revisionId);

  return NextResponse.json({
    ok: true,
    document: restored,
    backupRevisionId,
  });
}
