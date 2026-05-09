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
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
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
  const locale = normalizeBuilderHomeLocale(request.nextUrl.searchParams.get('locale'));
  const kind = parseKind(request.nextUrl.searchParams.get('kind'));

  if (!kind) {
    return badRequest('Invalid snapshot kind.');
  }

  const result = await readBuilderHomeSnapshot(kind, locale);
  return NextResponse.json(buildBuilderHomeSnapshotResponse(result));
}

export async function PUT(request: NextRequest) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeBuilderHomeLocale(request.nextUrl.searchParams.get('locale'));
  const kind = parseKind(request.nextUrl.searchParams.get('kind'));

  if (!kind) {
    return badRequest('Invalid snapshot kind.');
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequest('Invalid JSON body.');
  }

  const writable = parseWritableBody(body);
  if (!writable) {
    return badRequest('document and state are required.');
  }

  const record = body as Record<string, unknown>;
  if (record.document && typeof record.document === 'object') {
    const snapshotDocument = record.document as Record<string, unknown>;
    if (snapshotDocument.pageKey !== undefined && snapshotDocument.pageKey !== 'home') {
      return badRequest('Only home snapshots are supported.');
    }
    if (!assertRequestLocaleMatches(request.nextUrl.searchParams.get('locale'), snapshotDocument.locale)) {
      return badRequest('Locale mismatch.');
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
      return NextResponse.json(
        {
          ok: false,
          error: 'Snapshot conflict. Reload the latest version before saving again.',
          conflict: error.conflict,
        },
        { status: 409 }
      );
    }

    throw error;
  }
}
