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
import { readPageCanvasRecordState, readSiteDocument } from '@/lib/builder/site/persistence';
import { guardMutation } from '@/lib/builder/security/guard';
import { builderCanvasDocumentSchema } from '@/lib/builder/canvas/types';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import {
  resolveBuilderSiteIdForMutationFromRequest,
  resolveBuilderSiteIdFromRequest,
} from '@/lib/builder/site/admin-routing';

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

export async function GET(request: NextRequest, props: { params: Promise<{ pageId: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
  const pageId = params.pageId;
  const revisionId = request.nextUrl.searchParams.get('revisionId');
  const siteId = resolveBuilderSiteIdFromRequest(request);

  try {
    const site = await readSiteDocument(siteId, locale);
    if (!site.pages.some((page) => page.pageId === pageId)) {
      return errorResponse(locale, 'builder_page_not_found', 404);
    }

    if (revisionId) {
      const detail = await readRevisionDocument(siteId, pageId, revisionId);
      if (!detail) {
        return errorResponse(locale, 'revision_not_found', 404);
      }
      return NextResponse.json({ ok: true, revisionId, document: detail });
    }

    const revisions = await listRevisions(siteId, pageId);
    return NextResponse.json({ ok: true, revisions });
  } catch {
    return errorResponse(locale, 'revision_load_failed', 500);
  }
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
  const source = typeof body.source === 'string' ? body.source : 'manual';

  const parsedDocument = body.document === undefined
    ? null
    : builderCanvasDocumentSchema.safeParse(body.document);
  if (parsedDocument && !parsedDocument.success) {
    return errorResponse(locale, 'revision_create_failed', 400);
  }

  if (parsedDocument) {
    try {
      const result = await recordRevision(siteId, pageId, parsedDocument.data, { source });
      return NextResponse.json({ ok: true, revisionId: revisionIdFromResult(result) });
    } catch {
      return errorResponse(locale, 'revision_create_failed', 500);
    }
  }

  let draftState: Awaited<ReturnType<typeof readPageCanvasRecordState>> | null = null;
  try {
    draftState = await readPageCanvasRecordState(siteId, pageId, 'draft');
  } catch {
    return errorResponse(locale, 'revision_create_failed', 500);
  }
  if (!draftState) {
    return errorResponse(locale, 'revision_draft_not_found', 404);
  }

  try {
    const result = await recordRevision(siteId, pageId, draftState.record, { source });
    return NextResponse.json({ ok: true, revisionId: revisionIdFromResult(result) });
  } catch {
    return errorResponse(locale, 'revision_create_failed', 500);
  }
}
