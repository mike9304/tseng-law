import { NextRequest, NextResponse } from 'next/server';
import {
  buildBuilderHomeSnapshotResponse,
  BuilderSnapshotConflictError,
  isBuilderSnapshotKind,
  normalizeBuilderHomeLocale,
  readBuilderHomeSnapshot,
  writeBuilderHomeSnapshot,
} from '@/lib/builder/persistence';
import type { BuilderHomeDocumentState, BuilderPageDocument } from '@/lib/builder/types';
import { guardBuilderRead, guardMutation } from '@/lib/builder/security/guard';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';

export const runtime = 'nodejs';

function errorResponse(
  locale: ReturnType<typeof normalizeBuilderHomeLocale>,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
  extra: Record<string, unknown> = {},
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode), ...extra },
    { status },
  );
}

function parseKind(value: string | null): 'draft' | 'published' | null {
  if (!value) return 'draft';
  return isBuilderSnapshotKind(value) ? value : null;
}

function parseWritableBody(body: unknown): {
  document: BuilderPageDocument;
  state: BuilderHomeDocumentState;
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
    state: state as BuilderHomeDocumentState,
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

function assertRequestLocaleMatches(
  requestLocale: string | null,
  bodyLocale: unknown
): boolean {
  if (typeof bodyLocale !== 'string' || !bodyLocale) return true;
  if (!requestLocale) return true;
  return bodyLocale === requestLocale;
}

export async function GET(request: NextRequest) {
  const auth = guardBuilderRead(request);
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeBuilderHomeLocale(request.nextUrl.searchParams.get('locale'));
  const kind = parseKind(request.nextUrl.searchParams.get('kind'));

  if (!kind) {
    return errorResponse(locale, 'home_snapshot_kind_invalid', 400);
  }

  try {
    const result = await readBuilderHomeSnapshot(kind, locale);
    return NextResponse.json(buildBuilderHomeSnapshotResponse(result));
  } catch {
    return errorResponse(locale, 'home_snapshot_load_failed', 500);
  }
}

export async function PUT(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'draft', permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeBuilderHomeLocale(request.nextUrl.searchParams.get('locale'));
  const kind = parseKind(request.nextUrl.searchParams.get('kind'));

  if (!kind) {
    return errorResponse(locale, 'home_snapshot_kind_invalid', 400);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(locale, 'invalid_json', 400);
  }

  const writable = parseWritableBody(body);
  if (!writable) {
    return errorResponse(locale, 'home_snapshot_body_invalid', 400);
  }

  const record = body as Record<string, unknown>;
  if (record.document && typeof record.document === 'object') {
    const snapshotDocument = record.document as Record<string, unknown>;
    if (snapshotDocument.pageKey !== undefined && snapshotDocument.pageKey !== 'home') {
      return errorResponse(locale, 'home_snapshot_page_unsupported', 400);
    }
    if (!assertRequestLocaleMatches(request.nextUrl.searchParams.get('locale'), snapshotDocument.locale)) {
      return errorResponse(locale, 'home_snapshot_locale_mismatch', 400);
    }
  }

  try {
    const result = await writeBuilderHomeSnapshot({
      kind,
      locale,
      document: writable.document,
      state: writable.state,
      updatedBy: writable.updatedBy,
      expectedRevision: writable.expectedRevision,
      expectedSavedAt: writable.expectedSavedAt,
    });

    return NextResponse.json(buildBuilderHomeSnapshotResponse(result));
  } catch (error) {
    if (error instanceof BuilderSnapshotConflictError) {
      return errorResponse(locale, 'home_snapshot_save_conflict', 409, {
        conflict: error.conflict,
      });
    }

    return errorResponse(locale, 'home_snapshot_save_failed', 500);
  }
}
