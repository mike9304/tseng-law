import { NextRequest, NextResponse } from 'next/server';
import { readBuilderPageSnapshot } from '@/lib/builder/persistence';
import { isBuilderPageKey, isDefaultBuilderSiteId } from '@/lib/builder/site';
import {
  BuilderPublishValidationError,
  validateBuilderSnapshotForPublish,
} from '@/lib/builder/validation';
import type { BuilderPageDocument, BuilderPageSnapshot, BuilderPageState } from '@/lib/builder/types';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
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
  const auth = guardMutation(request);
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
    body = null;
  }

  const checkedAt = new Date().toISOString();

  try {
    let snapshot: BuilderPageSnapshot<BuilderPageState>;
    let basis: 'request' | 'server-draft';

    const parsed = parseBody(body);
    if (parsed) {
      if (parsed.document.pageKey !== params.pageKey) {
        return badRequest('Page key mismatch.');
      }
      if (parsed.document.locale !== locale) {
        return badRequest('Locale mismatch.');
      }
      snapshot = buildTransientSnapshot(params.pageKey, locale, parsed);
      basis = 'request';
    } else {
      const draft = await readBuilderPageSnapshot(params.pageKey, 'draft', locale);
      if (!draft.persisted) {
        return NextResponse.json(
          { ok: false, error: 'No draft snapshot exists for this locale.' },
          { status: 404 }
        );
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

    throw error;
  }
}
