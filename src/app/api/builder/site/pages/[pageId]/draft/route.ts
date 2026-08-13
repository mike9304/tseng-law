import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  canProjectPageToLocale,
  readSiteDocument,
  readPageCanvasRecordState,
  updatePageCanvasRecord,
} from '@/lib/builder/site/persistence';
import { normalizeLocale } from '@/lib/locales';
import { normalizeCanvasDocument, normalizeCanvasDocumentForSave } from '@/lib/builder/canvas/types';
import { repairHomeCanvasLocale } from '@/lib/builder/canvas/home-locale-repair';
import { upgradeHomeEditorLayoutParity } from '@/lib/builder/canvas/home-editor-layout-parity';
import { upgradeHomeHeroSearchForm } from '@/lib/builder/canvas/home-hero-search-migration';
import { emitEditorPageSaveHook } from '@/lib/builder/apps/lifecycle-emitters';
import type { PageCanvasRecord } from '@/lib/builder/site/types';
import { PageCanvasCasConflictError } from '@/lib/builder/site/page-canvas-versioned-store';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import {
  resolveBuilderSiteIdForMutationFromRequest,
  resolveBuilderSiteIdFromRequest,
} from '@/lib/builder/site/admin-routing';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';

export const runtime = 'nodejs';

type DraftSaveRequestBody = {
  readonly siteId?: string;
  readonly expectedRevision?: unknown;
  readonly document?: unknown;
};

function draftMeta(record: PageCanvasRecord) {
  return {
    revision: record.revision,
    savedAt: record.savedAt,
    updatedBy: record.updatedBy,
  };
}

function errorResponse(
  locale: ReturnType<typeof normalizeLocale>,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
  extra: Record<string, unknown> = {},
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode), ...extra },
    { status },
  );
}

function draftWriteErrorCode(message: string): BuilderSiteApiErrorCode {
  return message === 'expected_revision_required'
    ? 'draft_expected_revision_required'
    : 'draft_conflict';
}

function sanitizePhysicalConflictCurrent(
  value: unknown,
): { revision: number; savedAt: string } | null {
  if (!value || typeof value !== 'object') return null;

  let revision: unknown;
  let savedAt: unknown;
  try {
    revision = Reflect.get(value, 'revision');
    savedAt = Reflect.get(value, 'savedAt');
  } catch {
    return null;
  }

  if (typeof savedAt !== 'string') return null;

  let canonicalSavedAt: string;
  try {
    const parsedSavedAt = Date.parse(savedAt);
    if (!Number.isFinite(parsedSavedAt)) return null;
    canonicalSavedAt = new Date(parsedSavedAt).toISOString();
  } catch {
    return null;
  }

  if (
    !Number.isSafeInteger(revision)
    || (revision as number) < 0
    || savedAt !== canonicalSavedAt
  ) {
    return null;
  }

  return { revision: revision as number, savedAt };
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

function isHomeCanvasDocument(document: BuilderCanvasDocument): boolean {
  return document.nodes.some((node) => node.id === 'home-hero-root');
}

// Applies the locale repair then the shared hero-search render migration for
// decomposed home documents. The hero-search migration runs read-only
// (stampMetadata: false): the GET response must reflect the corrected initial
// geometry without mutating record-level `updatedAt`/`updatedBy`, so a stored
// `updatedBy=admin` draft is never implicitly rewritten (data-loss safety —
// `canPersistHomeDraftRenderMigration` only governs persistence, not reads).
function prepareDraftDocument(document: BuilderCanvasDocument, locale: ReturnType<typeof normalizeLocale>): BuilderCanvasDocument {
  if (isHomeCanvasDocument(document)) {
    const repaired = repairHomeCanvasLocale({ ...document, locale }, locale);
    const layoutRepaired = upgradeHomeEditorLayoutParity(repaired, locale, { stampMetadata: false });
    return upgradeHomeHeroSearchForm(layoutRepaired, locale, { stampMetadata: false });
  }
  return normalizeCanvasDocument(document, locale);
}

async function localeMismatchResponse(
  pageId: string,
  locale: ReturnType<typeof normalizeLocale>,
  siteId: string,
): Promise<NextResponse | null> {
  const site = await readSiteDocument(siteId, locale);
  const page = site.pages.find((candidate) => candidate.pageId === pageId);
  if (!page || canProjectPageToLocale(page, site.pages, locale)) return null;
  return NextResponse.json(
    {
      ok: false,
      ...getBuilderSiteApiErrorPayload(locale, 'draft_locale_mismatch'),
      pageLocale: page.locale,
      requestedLocale: locale,
    },
    { status: 409 },
  );
}

export async function GET(request: NextRequest, props: { params: Promise<{ pageId: string }> }) {
  const params = await props.params;
  const auth = await guardBuilderReadWithPermission(request, 'edit-pages');
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteId = resolveBuilderSiteIdFromRequest(request);
  let mismatch: NextResponse | null = null;
  try {
    mismatch = await localeMismatchResponse(params.pageId, locale, siteId);
  } catch {
    return errorResponse(locale, 'draft_load_failed', 500);
  }
  if (mismatch) return mismatch;

  let draftState: Awaited<ReturnType<typeof readPageCanvasRecordState>> = null;
  let state: Awaited<ReturnType<typeof readPageCanvasRecordState>> = null;
  try {
    draftState = await readPageCanvasRecordState(siteId, params.pageId, 'draft');
    state = draftState ?? (await readPageCanvasRecordState(siteId, params.pageId, 'published'));
  } catch {
    return errorResponse(locale, 'draft_load_failed', 500);
  }

  if (!state) {
    return errorResponse(locale, 'draft_not_found', 404);
  }

  const document = prepareDraftDocument(state.record.document, locale);

  return NextResponse.json({
    ok: true,
    draft: draftState ? draftMeta(state.record) : null,
    recoveredFrom: draftState ? 'draft' : 'published',
    document,
  });
}

export async function PUT(request: NextRequest, props: { params: Promise<{ pageId: string }> }) {
  const params = await props.params;
  const auth = await guardMutation(request, { bucket: 'draft', permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  let body: DraftSaveRequestBody;
  try {
    body = (await request.json()) as DraftSaveRequestBody;
  } catch {
    const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
    return errorResponse(locale, 'invalid_json', 400);
  }

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  const siteResolution = resolveBuilderSiteIdForMutationFromRequest(request, body.siteId);
  if (!siteResolution.ok) return siteResolution.response;
  const siteId = siteResolution.siteId;
  let mismatch: NextResponse | null = null;
  try {
    mismatch = await localeMismatchResponse(params.pageId, locale, siteId);
  } catch {
    return errorResponse(locale, 'draft_save_failed', 500);
  }
  if (mismatch) return mismatch;
  const expectedRevision =
    typeof body.expectedRevision === 'number' && Number.isInteger(body.expectedRevision)
      ? body.expectedRevision
      : undefined;
  const normalized = normalizeCanvasDocumentForSave(body.document, locale);
  if (!normalized) {
    // Unrepairable payload: refuse instead of persisting the sandbox fallback
    // over the user's saved page (F15/R1 data-loss shape).
    return errorResponse(locale, 'draft_document_invalid', 400);
  }
  let record: PageCanvasRecord;

  try {
    record = await updatePageCanvasRecord(siteId, params.pageId, 'draft', (currentState) => {
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
      return errorResponse(locale, draftWriteErrorCode(error.message), error.status, {
        current: error.current,
      });
    }
    if (error instanceof PageCanvasCasConflictError) {
      return errorResponse(locale, 'draft_conflict', 409, {
        current: sanitizePhysicalConflictCurrent(error.current),
      });
    }
    return errorResponse(locale, 'draft_save_failed', 500);
  }

  emitEditorPageSaveHook({
    kind: 'editor.page-save',
    payload: {
      siteId,
      pageId: params.pageId,
      revision: record.revision,
      savedAt: record.savedAt,
    },
  });

  return NextResponse.json({
    ok: true,
    draft: draftMeta(record),
    document: normalized,
  });
}
