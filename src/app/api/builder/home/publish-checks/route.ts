import { NextRequest, NextResponse } from 'next/server';
import { normalizeBuilderHomeLocale, readBuilderHomeSnapshot } from '@/lib/builder/persistence';
import {
  BuilderPublishValidationError,
  validateBuilderHomeSnapshotForPublish,
} from '@/lib/builder/validation';
import type { BuilderHomeDocumentState, BuilderPageDocument, BuilderPageSnapshot } from '@/lib/builder/types';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

function parseBody(body: unknown): {
  document: BuilderPageDocument;
  state: BuilderHomeDocumentState;
  updatedBy?: string;
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
    updatedBy: typeof record.updatedBy === 'string' ? record.updatedBy.trim() : undefined,
  };
}

function buildTransientSnapshot(
  locale: ReturnType<typeof normalizeBuilderHomeLocale>,
  input: {
    document: BuilderPageDocument;
    state: BuilderHomeDocumentState;
    updatedBy?: string;
  }
): BuilderPageSnapshot<BuilderHomeDocumentState> {
  const checkedAt = new Date().toISOString();
  return {
    version: 1,
    kind: 'draft',
    pageKey: 'home',
    locale,
    revision: 0,
    savedAt: checkedAt,
    updatedBy: input.updatedBy || 'builder-preview-web',
    document: input.document,
    state: input.state,
  };
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'publish' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeBuilderHomeLocale(request.nextUrl.searchParams.get('locale'));

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = null;
  }

  const checkedAt = new Date().toISOString();

  try {
    let snapshot: BuilderPageSnapshot<BuilderHomeDocumentState>;
    let basis: 'request' | 'server-draft';

    const parsed = parseBody(body);
    if (parsed) {
      if (parsed.document.pageKey !== 'home') {
        return badRequest('Only home builder checks are supported.');
      }
      if (parsed.document.locale !== locale) {
        return badRequest('Locale mismatch.');
      }
      snapshot = buildTransientSnapshot(locale, parsed);
      basis = 'request';
    } else {
      const draft = await readBuilderHomeSnapshot('draft', locale);
      if (!draft.persisted) {
        return NextResponse.json(
          { ok: false, error: 'No draft snapshot exists for this locale.' },
          { status: 404 }
        );
      }
      snapshot = draft.snapshot;
      basis = 'server-draft';
    }

    await validateBuilderHomeSnapshotForPublish(snapshot);

    return NextResponse.json({
      ok: true,
      passed: true,
      basis,
      checkedAt,
      issues: [],
    });
  } catch (error) {
    if (error instanceof BuilderPublishValidationError) {
      return NextResponse.json({
        ok: true,
        passed: false,
        checkedAt,
        issues: error.issues,
      });
    }

    throw error;
  }
}
