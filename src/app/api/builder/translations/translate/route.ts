import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { guardMutation } from '@/lib/builder/security/guard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TARGET_LABELS: Record<Locale, string> = {
  ko: 'Korean',
  'zh-hant': 'Traditional Chinese for Taiwan',
  en: 'English',
};

function buildPrompt(sourceLocale: Locale, targetLocale: Locale, sourceText: string): string {
  return [
    `Translate ${TARGET_LABELS[sourceLocale]} legal website content to ${TARGET_LABELS[targetLocale]}.`,
    'Keep a professional, formal legal-service tone.',
    'Preserve names, URLs, phone numbers, email addresses, and HTML-like tokens exactly.',
    'Preferred brand terms: 호정국제 -> 浩正國際 in zh-hant, Hojeong International in English.',
    'Return only JSON in this shape: {"text":"..."}',
    '',
    `Source: ${sourceText}`,
  ].join('\n');
}

async function translateWithOpenAI(
  sourceLocale: Locale,
  targetLocale: Locale,
  sourceText: string,
): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_TRANSLATION_MODEL || 'gpt-4o-mini',
      temperature: 0.2,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'You are a professional legal translator. Return compact JSON only.',
        },
        {
          role: 'user',
          content: buildPrompt(sourceLocale, targetLocale, sourceText),
        },
      ],
    }),
  });

  const payload = await response.json().catch(() => null) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
  } | null;

  if (!response.ok) {
    throw new Error(payload?.error?.message || `OpenAI request failed (${response.status})`);
  }

  const content = payload?.choices?.[0]?.message?.content;
  if (!content) throw new Error('OpenAI response was empty');

  const parsed = JSON.parse(content) as { text?: unknown };
  if (typeof parsed.text !== 'string') throw new Error('OpenAI response did not contain text');
  return parsed.text.trim();
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json().catch(() => null) as {
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

    const sourceLocale = normalizeLocale(body.sourceLocale || 'ko');
    const targetLocale = normalizeLocale(body.targetLocale || 'en');
    if (sourceLocale === targetLocale) {
      return NextResponse.json({ ok: false, error: 'targetLocale must differ from sourceLocale' }, { status: 400 });
    }

    if (body.provider === 'mock') {
      return NextResponse.json({
        ok: true,
        provider: 'mock',
        text: sourceText,
      });
    }

    const text = await translateWithOpenAI(sourceLocale, targetLocale, sourceText);
    return NextResponse.json({
      ok: true,
      provider: 'ai-openai',
      text,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    const status = message.includes('OPENAI_API_KEY') ? 503 : 500;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
