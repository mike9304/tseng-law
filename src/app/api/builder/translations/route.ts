import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  DEFAULT_TRANSLATION_SOURCE_LOCALE,
  saveTranslationValue,
  syncTranslationsForSite,
} from '@/lib/builder/translations/sync';
import { translationStatuses, type TranslationProvider, type TranslationStatus } from '@/lib/builder/translations/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function badRequest(message: string): NextResponse {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
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

  try {
    const sourceLocale = normalizeLocale(
      request.nextUrl.searchParams.get('sourceLocale') || DEFAULT_TRANSLATION_SOURCE_LOCALE,
    );
    const payload = await syncTranslationsForSite('default', sourceLocale);
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json().catch(() => ({})) as { sourceLocale?: string };
    const sourceLocale = normalizeLocale(body.sourceLocale || DEFAULT_TRANSLATION_SOURCE_LOCALE);
    const payload = await syncTranslationsForSite('default', sourceLocale);
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json().catch(() => null) as {
      key?: unknown;
      targetLocale?: unknown;
      text?: unknown;
      status?: unknown;
      sourceLocale?: unknown;
      provider?: unknown;
    } | null;
    if (!body || typeof body.key !== 'string') return badRequest('key is required');
    if (typeof body.targetLocale !== 'string') return badRequest('targetLocale is required');
    if (typeof body.text !== 'string') return badRequest('text is required');

    const targetLocale = normalizeLocale(body.targetLocale);
    const sourceLocale = normalizeLocale(
      typeof body.sourceLocale === 'string' ? body.sourceLocale : DEFAULT_TRANSLATION_SOURCE_LOCALE,
    );
    if (targetLocale === sourceLocale) {
      return badRequest('targetLocale must differ from sourceLocale');
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
    const status = message === 'translation_entry_not_found' ? 404 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
