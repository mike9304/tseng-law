import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getBuilderTranslationsApiErrorPayload,
  type BuilderTranslationsApiErrorCode,
} from '@/lib/builder/translations/translations-api-copy';
import {
  getUsageSnapshot,
  listAvailableProviders,
  translateViaRouter,
} from '@/lib/builder/translations/providers/router';
import type { TranslationProviderId } from '@/lib/builder/translations/providers/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface TranslationRequestBody {
  locale?: unknown;
  sourceLocale?: unknown;
  targetLocale?: unknown;
  sourceText?: unknown;
  provider?: unknown;
}

function errorResponse(
  locale: Locale,
  errorCode: BuilderTranslationsApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderTranslationsApiErrorPayload(locale, errorCode), ...(extra ?? {}) },
    { status },
  );
}

function resolveRequestLocale(body: TranslationRequestBody | null): Locale {
  if (typeof body?.locale === 'string') return normalizeLocale(body.locale) as Locale;
  if (typeof body?.sourceLocale === 'string') return normalizeLocale(body.sourceLocale) as Locale;
  return 'ko';
}

function parseProviderId(value: unknown): TranslationProviderId | undefined {
  if (value === 'openai' || value === 'deepl' || value === 'mock') return value;
  return undefined;
}

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;
  return NextResponse.json({
    ok: true,
    providers: listAvailableProviders(),
    usage: getUsageSnapshot(),
  });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  let body: TranslationRequestBody | null = null;
  try {
    body = (await request.json().catch(() => null)) as TranslationRequestBody | null;
    const errorLocale = resolveRequestLocale(body);

    if (!body || typeof body.sourceText !== 'string') {
      return errorResponse(errorLocale, 'invalid_request', 400);
    }
    const sourceText = body.sourceText.trim();
    if (!sourceText) {
      return errorResponse(errorLocale, 'invalid_request', 400);
    }

    const sourceLocale = normalizeLocale(typeof body.sourceLocale === 'string' ? body.sourceLocale : 'ko') as Locale;
    const targetLocale = normalizeLocale(typeof body.targetLocale === 'string' ? body.targetLocale : 'en') as Locale;
    if (sourceLocale === targetLocale) {
      return errorResponse(errorLocale, 'invalid_request', 400);
    }

    const result = await translateViaRouter({
      sourceLocale,
      targetLocale,
      sourceText,
      preferProvider: parseProviderId(body.provider),
    });

    if (!result.ok) {
      const status = result.reason === 'unconfigured' ? 503 : 502;
      return errorResponse(
        errorLocale,
        result.reason === 'unconfigured' ? 'translation_provider_unconfigured' : 'translation_provider_failed',
        status,
        { provider: result.provider },
      );
    }
    return NextResponse.json({ ok: true, provider: result.provider, text: result.text });
  } catch (error) {
    console.error('[builder/translations/translate] provider request failed:', error);
    return errorResponse(resolveRequestLocale(body), 'translation_provider_failed', 500);
  }
}
