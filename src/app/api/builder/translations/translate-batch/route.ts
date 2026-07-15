import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getBuilderTranslationsApiErrorPayload,
  type BuilderTranslationsApiErrorCode,
} from '@/lib/builder/translations/translations-api-copy';
import { translateBatchViaRouter } from '@/lib/builder/translations/providers/router';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const translationBatchRequestSchema = z.object({
  locale: z.string().optional(),
  sourceLocale: z.string().optional(),
  targetLocale: z.string().optional(),
  provider: z.enum(['openai', 'deepl', 'mock']).optional(),
  entries: z.array(z.object({
    key: z.string().min(1),
    sourceText: z.string().min(1),
  })).min(1),
});

const translationBatchLocaleSchema = z.object({
  locale: z.string().optional(),
  sourceLocale: z.string().optional(),
}).passthrough();

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

function resolveRequestLocale(body: unknown): Locale {
  const parsed = translationBatchLocaleSchema.safeParse(body);
  if (!parsed.success) return 'ko';
  const requestedLocale = parsed.data.locale ?? parsed.data.sourceLocale;
  if (requestedLocale) return normalizeLocale(requestedLocale);
  return 'ko';
}

function clientResults(
  batch: Awaited<ReturnType<typeof translateBatchViaRouter>>,
  locale: Locale,
) {
  return batch.results.map((result) => {
    if (result.ok) return { key: result.key, ok: true, text: result.text };
    const errorCode = result.reason === 'unconfigured'
      ? 'translation_provider_unconfigured'
      : 'translation_provider_failed';
    return {
      key: result.key,
      ok: false,
      error: getBuilderTranslationsApiErrorPayload(locale, errorCode).error,
      errorCode,
    };
  });
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  let rawBody: unknown = null;
  try {
    rawBody = await request.json().catch(() => null);
    const errorLocale = resolveRequestLocale(rawBody);
    const parsed = translationBatchRequestSchema.safeParse(rawBody);

    if (!parsed.success) {
      return errorResponse(errorLocale, 'invalid_request', 400);
    }

    const body = parsed.data;
    const sourceLocale = normalizeLocale(body.sourceLocale ?? 'ko');
    const targetLocale = normalizeLocale(body.targetLocale ?? 'en');
    if (sourceLocale === targetLocale) {
      return errorResponse(errorLocale, 'invalid_request', 400);
    }
    const entries = body.entries.slice(0, 25);
    const batch = await translateBatchViaRouter({
      sourceLocale,
      targetLocale,
      preferProvider: body.provider,
      items: entries,
    });
    const results = clientResults(batch, errorLocale);

    const ok = batch.summary.failed === 0;
    const allUnconfigured = batch.summary.succeeded === 0
      && batch.results.length > 0
      && batch.results.every((result) => !result.ok && result.reason === 'unconfigured');
    const status = ok ? 200 : allUnconfigured ? 503 : 502;

    return NextResponse.json({ ok, results, summary: batch.summary }, { status });
  } catch {
    console.error('[builder/translations/translate-batch] batch failed', {
      code: 'translation_batch_failed',
    });
    return errorResponse(resolveRequestLocale(rawBody), 'translation_batch_failed', 500);
  }
}
