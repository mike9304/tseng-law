import { NextRequest, NextResponse } from 'next/server';
import { normalizeBuilderHomeLocale, readBuilderHomeSnapshot } from '@/lib/builder/persistence';
import {
  BuilderPublishValidationError,
  validateBuilderHomeSnapshotForPublish,
} from '@/lib/builder/validation';
import type { BuilderHomeDocumentState, BuilderPageDocument, BuilderPageSnapshot } from '@/lib/builder/types';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';

export const runtime = 'nodejs';

function errorResponse(
  locale: ReturnType<typeof normalizeBuilderHomeLocale>,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode) },
    { status },
  );
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
        return errorResponse(locale, 'home_snapshot_page_unsupported', 400);
      }
      if (parsed.document.locale !== locale) {
        return errorResponse(locale, 'home_snapshot_locale_mismatch', 400);
      }
      snapshot = buildTransientSnapshot(locale, parsed);
      basis = 'request';
    } else {
      const draft = await readBuilderHomeSnapshot('draft', locale);
      if (!draft.persisted) {
        return errorResponse(locale, 'home_publish_draft_not_found', 404);
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

    return errorResponse(locale, 'home_publish_failed', 500);
  }
}
