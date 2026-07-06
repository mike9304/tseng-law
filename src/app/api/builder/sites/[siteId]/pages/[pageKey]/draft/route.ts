import { NextRequest, NextResponse } from 'next/server';
import {
  buildBuilderSnapshotResponse,
  BuilderSnapshotConflictError,
  writeBuilderPageSnapshot,
} from '@/lib/builder/persistence';
import { isBuilderPageKey, isDefaultBuilderSiteId } from '@/lib/builder/site';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import type { BuilderPageDocument, BuilderPageState } from '@/lib/builder/types';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';

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

function parseWritableBody(body: unknown): {
  document: BuilderPageDocument;
  state: BuilderPageState;
  updatedBy?: string;
  expectedRevision?: number;
  expectedSavedAt?: string;
} | null {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;

  const record = body as Record<string, unknown>;
  const document = record.document;
  const state = record.state;
  if (!document || typeof document !== 'object' || Array.isArray(document)) return null;
  if (!state || typeof state !== 'object' || Array.isArray(state)) return null;

  return {
    document: document as BuilderPageDocument,
    state: state as BuilderPageState,
    updatedBy: typeof record.updatedBy === 'string' ? record.updatedBy : undefined,
    expectedRevision:
      typeof record.expectedRevision === 'number' && Number.isFinite(record.expectedRevision)
        ? Math.trunc(record.expectedRevision)
        : undefined,
    expectedSavedAt:
      typeof record.expectedSavedAt === 'string' && record.expectedSavedAt.trim()
        ? record.expectedSavedAt.trim()
        : undefined,
  };
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { siteId: string; pageKey: string } }
) {
  const auth = await guardMutation(request, { bucket: 'draft', permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return errorResponse(locale, 'builder_site_not_found', 404);
  }

  if (!isBuilderPageKey(params.pageKey)) {
    return errorResponse(locale, 'builder_page_not_found', 404);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(locale, 'invalid_json', 400);
  }

  const writable = parseWritableBody(body);
  if (!writable) {
    return errorResponse(locale, 'validation_error', 400);
  }

  if (writable.document.pageKey !== params.pageKey) {
    return errorResponse(locale, 'validation_error', 400);
  }

  if (writable.document.locale !== locale) {
    return errorResponse(locale, 'draft_locale_mismatch', 400);
  }

  try {
    const result = await writeBuilderPageSnapshot({
      pageKey: params.pageKey,
      kind: 'draft',
      locale,
      document: writable.document,
      state: writable.state,
      updatedBy: writable.updatedBy,
      expectedRevision: writable.expectedRevision,
      expectedSavedAt: writable.expectedSavedAt,
    });

    return NextResponse.json(buildBuilderSnapshotResponse(result));
  } catch (error) {
    if (error instanceof BuilderSnapshotConflictError) {
      return errorResponse(locale, 'draft_conflict', 409, { conflict: error.conflict });
    }

    return errorResponse(locale, 'draft_save_failed', 500);
  }
}
