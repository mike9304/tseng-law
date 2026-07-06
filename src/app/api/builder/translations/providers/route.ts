import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getBuilderTranslationsApiErrorPayload,
  type BuilderTranslationsApiErrorCode,
} from '@/lib/builder/translations/translations-api-copy';
import {
  buildTranslationProviderReadinessReport,
  recordTranslationProviderSmokeResult,
  runTranslationProviderSmoke,
  translationProviderDiagnosticIds,
  type TranslationProviderReadinessReport,
} from '@/lib/builder/translations/providers/diagnostics';
import {
  appendTranslationProviderSmokeHistory,
  readTranslationProviderSmokeHistory,
} from '@/lib/builder/translations/providers/smoke-history';
import { summarizeTranslationProviderSmokeHistory } from '@/lib/builder/translations/providers/smoke-summary';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const smokeRequestSchema = z.object({
  provider: z.enum(translationProviderDiagnosticIds),
  sourceLocale: z.string().optional(),
  targetLocale: z.string().optional(),
  sourceText: z.string().trim().min(1).max(500).optional(),
});

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

function requestLocale(request: NextRequest): Locale {
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? 'ko');
}

async function readinessReport(): Promise<TranslationProviderReadinessReport> {
  const report = buildTranslationProviderReadinessReport();
  const persistedHistory = await readTranslationProviderSmokeHistory();
  const smokeHistory = persistedHistory.length > 0 ? persistedHistory : report.smokeHistory;
  return {
    ...report,
    smokeHistory,
    smokeSummary: summarizeTranslationProviderSmokeHistory(smokeHistory, translationProviderDiagnosticIds),
  };
}

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;
  const locale = requestLocale(request);

  try {
    return NextResponse.json({
      ok: true,
      report: await readinessReport(),
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error('[builder/translations/providers] readiness failed:', error);
      return errorResponse(locale, 'translation_provider_failed', 500);
    }
    throw error;
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;
  const locale = requestLocale(request);

  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return errorResponse(locale, 'invalid_json', 400);
  }

  const parsed = smokeRequestSchema.safeParse(rawBody);
  if (!parsed.success) {
    return errorResponse(locale, 'invalid_request', 400, {
      details: parsed.error.issues.slice(0, 3),
    });
  }

  const sourceLocale = normalizeLocale(parsed.data.sourceLocale ?? 'ko');
  const targetLocale = normalizeLocale(parsed.data.targetLocale ?? 'en');
  if (sourceLocale === targetLocale) {
    return errorResponse(locale, 'invalid_request', 400);
  }

  try {
    const smoke = await runTranslationProviderSmoke({
      provider: parsed.data.provider,
      sourceLocale,
      targetLocale,
      sourceText: parsed.data.sourceText ?? '호정국제 번역 제공자 점검',
    });
    const smokeHistoryEntry = recordTranslationProviderSmokeResult(smoke);
    await appendTranslationProviderSmokeHistory(smokeHistoryEntry);
    const report = await readinessReport();
    if (!smoke.ok) {
      const errorCode = smoke.status === 'unconfigured'
        ? 'translation_provider_unconfigured'
        : 'translation_provider_failed';
      const status = smoke.status === 'unconfigured' ? 409 : 502;
      return errorResponse(locale, errorCode, status, { smoke, report });
    }
    return NextResponse.json({ ok: true, smoke, report });
  } catch (error) {
    if (error instanceof Error) {
      console.error('[builder/translations/providers] smoke failed:', error);
      return errorResponse(locale, 'translation_provider_failed', 500, {
        report: await readinessReport(),
      });
    }
    throw error;
  }
}
