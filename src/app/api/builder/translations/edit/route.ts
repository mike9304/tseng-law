import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  applyTranslationToLocaleDraft,
  setPageLocaleSeoOverride,
  type NodeUpdates,
  type PerLocaleSeoOverride,
} from '@/lib/builder/translations/edit-store';
import { DEFAULT_TRANSLATION_SOURCE_LOCALE } from '@/lib/builder/translations/sync';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function parseNodeUpdates(raw: unknown): NodeUpdates {
  if (!raw || typeof raw !== 'object') return {};
  const out: NodeUpdates = {};
  for (const [nodeId, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!value || typeof value !== 'object') continue;
    const candidate = value as { text?: unknown; path?: unknown };
    if (typeof candidate.text !== 'string') continue;
    out[nodeId] = {
      text: candidate.text,
      path: typeof candidate.path === 'string' ? candidate.path : undefined,
    };
  }
  return out;
}

function parseSeoOverride(raw: unknown): PerLocaleSeoOverride | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Record<string, unknown>;
  const out: PerLocaleSeoOverride = {};
  if (typeof candidate.title === 'string') out.title = candidate.title;
  if (typeof candidate.description === 'string') out.description = candidate.description;
  if (typeof candidate.ogImage === 'string') out.ogImage = candidate.ogImage;
  return Object.keys(out).length > 0 ? out : null;
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, {
    bucket: 'mutation',
    permission: 'edit-pages',
  });
  if (auth instanceof NextResponse) return auth;

  let body: {
    sourceLocale?: string;
    targetLocale?: string;
    pageId?: string;
    siteId?: string;
    nodeUpdates?: unknown;
    seoOverride?: unknown;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      { ok: false, error: 'invalid_json' },
      { status: 400 },
    );
  }

  if (typeof body.pageId !== 'string' || body.pageId.length === 0) {
    return NextResponse.json(
      { ok: false, error: 'pageId is required' },
      { status: 400 },
    );
  }
  if (typeof body.targetLocale !== 'string') {
    return NextResponse.json(
      { ok: false, error: 'targetLocale is required' },
      { status: 400 },
    );
  }
  const targetLocale = normalizeLocale(body.targetLocale) as Locale;
  const sourceLocale = normalizeLocale(
    body.sourceLocale || DEFAULT_TRANSLATION_SOURCE_LOCALE,
  ) as Locale;
  if (targetLocale === sourceLocale) {
    return NextResponse.json(
      { ok: false, error: 'targetLocale must differ from sourceLocale' },
      { status: 400 },
    );
  }
  const siteId = body.siteId || 'default';

  const nodeUpdates = parseNodeUpdates(body.nodeUpdates);
  const seoOverride = parseSeoOverride(body.seoOverride);

  let nodeResult = null as Awaited<ReturnType<typeof applyTranslationToLocaleDraft>> | null;
  if (Object.keys(nodeUpdates).length > 0) {
    nodeResult = await applyTranslationToLocaleDraft(
      siteId,
      sourceLocale,
      targetLocale,
      body.pageId,
      nodeUpdates,
    );
  }

  let seoApplied = false;
  if (seoOverride) {
    seoApplied = await setPageLocaleSeoOverride(
      siteId,
      sourceLocale,
      targetLocale,
      body.pageId,
      seoOverride,
    );
  }

  if (!nodeResult && !seoOverride) {
    return NextResponse.json(
      { ok: false, error: 'no_updates_provided' },
      { status: 400 },
    );
  }

  return NextResponse.json({
    ok: true,
    nodeUpdates: nodeResult
      ? {
          appliedCount: nodeResult.appliedCount,
          skipped: nodeResult.skipped,
          targetPageId: nodeResult.targetPageId,
        }
      : null,
    seoApplied,
  });
}