import { NextRequest, NextResponse } from 'next/server';
import { readBuilderPageSnapshot } from '@/lib/builder/persistence';
import { isBuilderPageKey, isDefaultBuilderSiteId } from '@/lib/builder/site';
import {
  BuilderPublishValidationError,
  validateBuilderSnapshotForPublish,
} from '@/lib/builder/validation';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import type { BuilderPageDocument, BuilderPageSnapshot, BuilderPageState } from '@/lib/builder/types';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';

function errorResponse(
  locale: ReturnType<typeof normalizeLocale>,
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
  state: BuilderPageState;
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
    state: state as BuilderPageState,
    updatedBy: typeof record.updatedBy === 'string' ? record.updatedBy.trim() : undefined,
  };
}

function buildTransientSnapshot(
  pageKey: string,
  locale: ReturnType<typeof normalizeLocale>,
  input: {
    document: BuilderPageDocument;
    state: BuilderPageState;
    updatedBy?: string;
  }
): BuilderPageSnapshot<BuilderPageState> {
  const checkedAt = new Date().toISOString();
  return {
    version: 1,
    kind: 'draft',
    pageKey: pageKey as BuilderPageSnapshot['pageKey'],
    locale,
    revision: 0,
    savedAt: checkedAt,
    updatedBy: input.updatedBy || 'builder-preview-web',
    document: input.document,
    state: input.state,
  };
}

export async function POST(
  request: NextRequest,
  { params }: { params: { siteId: string; pageKey: string } }
) {
  const auth = await guardMutation(request, { bucket: 'publish' });
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
    body = null;
  }

  const checkedAt = new Date().toISOString();

  try {
    let snapshot: BuilderPageSnapshot<BuilderPageState>;
    let basis: 'request' | 'server-draft';

    const parsed = parseBody(body);
    if (parsed) {
      if (parsed.document.pageKey !== params.pageKey) {
        return errorResponse(locale, 'validation_error', 400);
      }
      if (parsed.document.locale !== locale) {
        return errorResponse(locale, 'draft_locale_mismatch', 400);
      }
      snapshot = buildTransientSnapshot(params.pageKey, locale, parsed);
      basis = 'request';
    } else {
      const draft = await readBuilderPageSnapshot(params.pageKey, 'draft', locale);
      if (!draft.persisted) {
        return errorResponse(locale, 'draft_not_found', 404);
      }
      snapshot = draft.snapshot;
      basis = 'server-draft';
    }

    await validateBuilderSnapshotForPublish(snapshot);

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

    return errorResponse(locale, 'publish_checks_failed', 500);
  }
}
