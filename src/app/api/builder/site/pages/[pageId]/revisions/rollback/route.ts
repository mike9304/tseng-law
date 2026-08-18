/**
 * POST /api/builder/site/pages/[pageId]/revisions/rollback
 *
 * Body: { siteId?: string, revisionId: string }
 * Restores the supplied revision into the draft. Auto-snapshots the
 * current draft first so rollback itself is reversible.
 *
 * Returns: { ok: true, document: BuilderCanvasDocument, draft, backupRevisionId }
 */
import { NextRequest, NextResponse } from 'next/server';
import {
  readRevisionDocument,
  recordRevision,
  rollbackToRevision,
} from '@/lib/builder/site/publish';
import { readPageCanvasRecordState } from '@/lib/builder/site/persistence';
import { recordPageRollback } from '@/lib/builder/audit/record';
import { guardMutation } from '@/lib/builder/security/guard';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import { resolveBuilderSiteIdForMutationFromRequest } from '@/lib/builder/site/admin-routing';

export const runtime = 'nodejs';

function errorResponse(
  locale: Locale,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode) },
    { status },
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function readJsonObject(request: NextRequest): Promise<Record<string, unknown>> {
  try {
    const parsed = await request.json();
    return isRecord(parsed) ? parsed : {};
  } catch (error) {
    if (error instanceof Error) return {};
    throw error;
  }
}

function revisionIdFromResult(result: string | { readonly revisionId: string }): string {
  return typeof result === 'string' ? result : result.revisionId;
}

export async function POST(request: NextRequest, props: { params: Promise<{ pageId: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const pageId = params.pageId;
  const body = await readJsonObject(request);
  const siteResolution = resolveBuilderSiteIdForMutationFromRequest(request, body.siteId);
  if (!siteResolution.ok) return siteResolution.response;
  const siteId = siteResolution.siteId;

  const revisionId = typeof body.revisionId === 'string' ? body.revisionId.trim() : '';

  if (!revisionId) {
    return errorResponse(locale, 'rollback_revision_required', 400);
  }

  // Backup current draft before rollback (so the rollback is reversible).
  const currentDraftState = await readPageCanvasRecordState(siteId, pageId, 'draft').catch((error) => {
    if (error instanceof Error) return null;
    throw error;
  });
  let backupRevisionId: string | null = null;
  if (currentDraftState) {
    try {
      const result = await recordRevision(siteId, pageId, currentDraftState.record, { source: 'rollback-backup' });
      backupRevisionId = revisionIdFromResult(result);
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      backupRevisionId = null;
    }
  }

  let ok = false;
  try {
    ok = await rollbackToRevision(siteId, pageId, revisionId);
  } catch {
    return errorResponse(locale, 'rollback_failed', 500);
  }
  if (!ok) return errorResponse(locale, 'rollback_failed', 404);

  // Return the restored document and draft meta for client-side replaceDocument
  // plus revision-aware follow-up actions such as publish.
  const restored = await readRevisionDocument(siteId, pageId, revisionId).catch(() => null);
  const restoredState = await readPageCanvasRecordState(siteId, pageId, 'draft').catch((error) => {
    if (error instanceof Error) return null;
    throw error;
  });
  try {
    await recordPageRollback({
      request,
      siteId,
      pageId,
      revisionId,
      backupRevisionId,
    });
  } catch (error) {
    if (!(error instanceof Error)) throw error;
    // Rollback succeeded; audit logging should not make the response fail.
  }

  return NextResponse.json({
    ok: true,
    document: restored,
    draft: restoredState
      ? {
          revision: restoredState.record.revision,
          savedAt: restoredState.record.savedAt,
          updatedBy: restoredState.record.updatedBy,
        }
      : null,
    backupRevisionId,
  });
}
