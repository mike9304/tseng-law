import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getUsageSnapshot,
  listAvailableProviders,
  translateViaRouter,
} from '@/lib/builder/translations/providers/router';
import type { TranslationProviderId } from '@/lib/builder/translations/providers/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

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

  try {
    const body = (await request.json().catch(() => null)) as {
      sourceLocale?: string;
      targetLocale?: string;
      sourceText?: unknown;
      provider?: string;
    } | null;

    if (!body || typeof body.sourceText !== 'string') {
      return NextResponse.json({ ok: false, error: 'sourceText is required' }, { status: 400 });
    }
    const sourceText = body.sourceText.trim();
    if (!sourceText) {
      return NextResponse.json({ ok: false, error: 'sourceText is empty' }, { status: 400 });
    }

    const sourceLocale = normalizeLocale(body.sourceLocale || 'ko') as Locale;
    const targetLocale = normalizeLocale(body.targetLocale || 'en') as Locale;
    if (sourceLocale === targetLocale) {
      return NextResponse.json({ ok: false, error: 'targetLocale must differ from sourceLocale' }, { status: 400 });
    }

    const result = await translateViaRouter({
      sourceLocale,
      targetLocale,
      sourceText,
      preferProvider: parseProviderId(body.provider),
    });

    if (!result.ok) {
      const status = result.reason === 'unconfigured' ? 503 : 502;
      return NextResponse.json({ ok: false, error: result.error ?? result.reason, provider: result.provider }, { status });
    }
    return NextResponse.json({ ok: true, provider: result.provider, text: result.text });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
