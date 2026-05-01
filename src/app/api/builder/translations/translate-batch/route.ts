import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const auth = guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json().catch(() => null) as {
      sourceLocale?: string;
      targetLocale?: string;
      entries?: Array<{ key: string; sourceText: string }>;
      provider?: string;
    } | null;

    if (!body || !Array.isArray(body.entries)) {
      return NextResponse.json({ ok: false, error: 'entries array is required' }, { status: 400 });
    }

    const sourceLocale = normalizeLocale(body.sourceLocale || 'ko');
    const targetLocale = normalizeLocale(body.targetLocale || 'en');
    const entries = body.entries.slice(0, 25);
    const origin = request.nextUrl.origin;

    const results = [];
    for (const entry of entries) {
      if (!entry.key || !entry.sourceText) continue;
      const response = await fetch(`${origin}/api/builder/translations/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          cookie: request.headers.get('cookie') || '',
          authorization: request.headers.get('authorization') || '',
          origin,
        },
        body: JSON.stringify({
          sourceLocale,
          targetLocale,
          sourceText: entry.sourceText,
          provider: body.provider,
        }),
      });
      const payload = await response.json().catch(() => null) as { ok?: boolean; text?: string; error?: string } | null;
      results.push({
        key: entry.key,
        ok: Boolean(response.ok && payload?.ok && payload.text),
        text: payload?.text,
        error: payload?.error,
      });
    }

    return NextResponse.json({ ok: true, results });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
