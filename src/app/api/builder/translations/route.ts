import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  DEFAULT_TRANSLATION_SOURCE_LOCALE,
  saveTranslationValue,
  syncTranslationsForSite,
} from '@/lib/builder/translations/sync';
import {
  getBuilderTranslationsApiErrorPayload,
  type BuilderTranslationsApiErrorCode,
} from '@/lib/builder/translations/translations-api-copy';
import { translationStatuses, type TranslationProvider, type TranslationStatus } from '@/lib/builder/translations/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface TranslationPatchRequestBody {
  key?: unknown;
  targetLocale?: unknown;
  text?: unknown;
  status?: unknown;
  sourceLocale?: unknown;
  provider?: unknown;
  locale?: unknown;
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

function badRequest(locale: Locale): NextResponse {
  return errorResponse(locale, 'invalid_request', 400);
}

function resolveRequestLocale(request: NextRequest, body?: { locale?: unknown; sourceLocale?: unknown } | null): Locale {
  const queryLocale = request.nextUrl.searchParams.get('locale') ?? undefined;
  if (queryLocale) return normalizeLocale(queryLocale);
  if (body) {
    if (typeof body.locale === 'string') return normalizeLocale(body.locale);
    if (typeof body.sourceLocale === 'string') return normalizeLocale(body.sourceLocale);
  }
  return normalizeLocale(request.nextUrl.searchParams.get('sourceLocale') ?? undefined);
}

function parseStatus(value: unknown): TranslationStatus {
  if (translationStatuses.includes(value as TranslationStatus)) {
    return value as TranslationStatus;
  }
  return 'manual';
}

function parseProvider(value: unknown): TranslationProvider {
  if (value === 'ai-openai' || value === 'ai-deepl' || value === 'mock') return value;
  return 'manual';
}

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;
  const locale = resolveRequestLocale(request);

  try {
    const sourceLocale = normalizeLocale(
      request.nextUrl.searchParams.get('sourceLocale') || DEFAULT_TRANSLATION_SOURCE_LOCALE,
    );
    const payload = await syncTranslationsForSite('default', sourceLocale);
    return NextResponse.json(payload);
  } catch (error) {
    console.error('[builder/translations] GET sync failed:', error);
    return errorResponse(locale, 'translation_sync_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  let body: { locale?: unknown; sourceLocale?: unknown } | null = null;
  try {
    body = await request.json().catch(() => ({})) as { locale?: unknown; sourceLocale?: unknown };
    const sourceLocale = normalizeLocale(
      typeof body.sourceLocale === 'string' ? body.sourceLocale : DEFAULT_TRANSLATION_SOURCE_LOCALE,
    );
    const payload = await syncTranslationsForSite('default', sourceLocale);
    return NextResponse.json(payload);
  } catch (error) {
    console.error('[builder/translations] POST sync failed:', error);
    return errorResponse(resolveRequestLocale(request, body), 'translation_sync_failed', 500);
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  let body: TranslationPatchRequestBody | null = null;
  try {
    body = await request.json().catch(() => null) as TranslationPatchRequestBody | null;
    const locale = resolveRequestLocale(request, body);
    if (!body || typeof body.key !== 'string') return badRequest(locale);
    if (typeof body.targetLocale !== 'string') return badRequest(locale);
    if (typeof body.text !== 'string') return badRequest(locale);

    const targetLocale = normalizeLocale(body.targetLocale);
    const sourceLocale = normalizeLocale(
      typeof body.sourceLocale === 'string' ? body.sourceLocale : DEFAULT_TRANSLATION_SOURCE_LOCALE,
    );
    if (targetLocale === sourceLocale) {
      return badRequest(locale);
    }

    const result = await saveTranslationValue({
      key: body.key,
      targetLocale,
      sourceLocale,
      text: body.text,
      status: parseStatus(body.status),
      provider: parseProvider(body.provider),
      reviewedBy: auth.username,
    });

    return NextResponse.json({
      ok: true,
      entry: result.entry,
      applied: result.applied,
      payload: result.payload,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    const locale = resolveRequestLocale(request, body);
    if (message === 'translation_entry_not_found') {
      return errorResponse(locale, 'translation_entry_not_found', 404);
    }
    console.error('[builder/translations] PATCH save failed:', error);
    return errorResponse(locale, 'translation_save_failed', 500);
  }
}
