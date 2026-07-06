import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  applyTranslationToLocaleDraft,
  applyImageOverridesToLocaleDraft,
  setPageLocaleSeoOverride,
  type NodeUpdates,
  type PerLocaleSeoOverride,
} from '@/lib/builder/translations/edit-store';
import {
  getBuilderTranslationsApiErrorPayload,
  type BuilderTranslationsApiErrorCode,
} from '@/lib/builder/translations/translations-api-copy';
import { DEFAULT_TRANSLATION_SOURCE_LOCALE } from '@/lib/builder/translations/sync';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface TranslationEditRequestBody {
  locale?: unknown;
  sourceLocale?: unknown;
  targetLocale?: unknown;
  pageId?: unknown;
  siteId?: unknown;
  nodeUpdates?: unknown;
  seoOverride?: unknown;
  imageOverrides?: unknown;
}

function errorResponse(
  locale: Locale,
  errorCode: BuilderTranslationsApiErrorCode,
  status: number,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderTranslationsApiErrorPayload(locale, errorCode) },
    { status },
  );
}

function resolveRequestLocale(body: TranslationEditRequestBody | null): Locale {
  if (typeof body?.locale === 'string') return normalizeLocale(body.locale) as Locale;
  if (typeof body?.sourceLocale === 'string') return normalizeLocale(body.sourceLocale) as Locale;
  return DEFAULT_TRANSLATION_SOURCE_LOCALE;
}

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

function parseImageOverrides(raw: unknown): Record<string, { src?: string; alt?: string }> {
  if (!raw || typeof raw !== 'object') return {};
  const out: Record<string, { src?: string; alt?: string }> = {};
  for (const [nodeId, value] of Object.entries(raw as Record<string, unknown>)) {
    if (!value || typeof value !== 'object') continue;
    const candidate = value as { src?: unknown; alt?: unknown };
    const next: { src?: string; alt?: string } = {};
    if (typeof candidate.src === 'string') next.src = candidate.src;
    if (typeof candidate.alt === 'string') next.alt = candidate.alt;
    if (Object.keys(next).length > 0) out[nodeId] = next;
  }
  return out;
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, {
    bucket: 'mutation',
    permission: 'edit-pages',
  });
  if (auth instanceof NextResponse) return auth;

  let body: TranslationEditRequestBody | null = null;
  try {
    body = (await request.json()) as TranslationEditRequestBody;
  } catch {
    return errorResponse(DEFAULT_TRANSLATION_SOURCE_LOCALE, 'invalid_json', 400);
  }

  const errorLocale = resolveRequestLocale(body);
  if (typeof body.pageId !== 'string' || body.pageId.length === 0) {
    return errorResponse(errorLocale, 'invalid_request', 400);
  }
  if (typeof body.targetLocale !== 'string') {
    return errorResponse(errorLocale, 'invalid_request', 400);
  }
  const targetLocale = normalizeLocale(body.targetLocale) as Locale;
  const sourceLocale = normalizeLocale(
    typeof body.sourceLocale === 'string' ? body.sourceLocale : DEFAULT_TRANSLATION_SOURCE_LOCALE,
  ) as Locale;
  if (targetLocale === sourceLocale) {
    return errorResponse(errorLocale, 'invalid_request', 400);
  }
  const siteId = typeof body.siteId === 'string' && body.siteId.trim() ? body.siteId : 'default';

  const nodeUpdates = parseNodeUpdates(body.nodeUpdates);
  const seoOverride = parseSeoOverride(body.seoOverride);
  const imageOverrides = parseImageOverrides(body.imageOverrides);

  try {
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

    let imageResult = null as Awaited<ReturnType<typeof applyImageOverridesToLocaleDraft>> | null;
    if (Object.keys(imageOverrides).length > 0) {
      imageResult = await applyImageOverridesToLocaleDraft(
        siteId,
        sourceLocale,
        targetLocale,
        body.pageId,
        imageOverrides,
      );
    }

    if (!nodeResult && !seoOverride && !imageResult) {
      return errorResponse(errorLocale, 'no_updates_provided', 400);
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
      imageOverrides: imageResult
        ? {
            appliedCount: imageResult.appliedCount,
          }
        : null,
    });
  } catch (error) {
    console.error('[builder/translations/edit] save failed:', error);
    return errorResponse(errorLocale, 'translation_edit_failed', 500);
  }
}
