import { NextRequest, NextResponse } from 'next/server';
import {
  buildBuilderSnapshotResponse,
  BuilderSnapshotConflictError,
  writeBuilderPageSnapshot,
} from '@/lib/builder/persistence';
import { isBuilderPageKey, isDefaultBuilderSiteId } from '@/lib/builder/site';
import type { BuilderPageDocument, BuilderPageState } from '@/lib/builder/types';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
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
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  if (!isDefaultBuilderSiteId(params.siteId)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder site.' }, { status: 404 });
  }

  if (!isBuilderPageKey(params.pageKey)) {
    return NextResponse.json({ ok: false, error: 'Unknown builder page.' }, { status: 404 });
  }

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);

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

  if (writable.document.pageKey !== params.pageKey) {
    return badRequest('Page key mismatch.');
  }

  if (writable.document.locale !== locale) {
    return badRequest('Locale mismatch.');
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
