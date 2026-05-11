import type { Locale } from '@/lib/locales';
import type {
  TranslationProvider,
  TranslationProviderArgs,
  TranslationProviderResult,
} from './types';

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

export const openaiProvider: TranslationProvider = {
  id: 'openai',
  isConfigured() {
    return Boolean(process.env.OPENAI_API_KEY);
  },
  async translate({ sourceLocale, targetLocale, sourceText }: TranslationProviderArgs): Promise<TranslationProviderResult> {
    const apiKey = process.env.OPENAI_API_KEY ?? '';
    if (!apiKey) return { ok: false, reason: 'unconfigured', provider: 'openai' };
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.OPENAI_TRANSLATION_MODEL || 'gpt-4o-mini',
          temperature: 0.2,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: 'You are a professional legal translator. Return compact JSON only.' },
            { role: 'user', content: buildPrompt(sourceLocale, targetLocale, sourceText) },
          ],
        }),
      });
      const payload = (await res.json().catch(() => null)) as {
        choices?: Array<{ message?: { content?: string } }>;
        error?: { message?: string };
      } | null;
      if (!res.ok) {
        return { ok: false, reason: 'send', provider: 'openai', error: payload?.error?.message ?? `${res.status}` };
      }
      const content = payload?.choices?.[0]?.message?.content;
      if (!content) return { ok: false, reason: 'parse', provider: 'openai', error: 'empty response' };
      try {
        const parsed = JSON.parse(content) as { text?: unknown };
        if (typeof parsed.text !== 'string') {
          return { ok: false, reason: 'parse', provider: 'openai', error: 'missing text field' };
        }
        return { ok: true, provider: 'openai', text: parsed.text.trim() };
      } catch {
        return { ok: false, reason: 'parse', provider: 'openai', error: 'invalid JSON' };
      }
    } catch (err) {
      return { ok: false, reason: 'network', provider: 'openai', error: err instanceof Error ? err.message : String(err) };
    }
  },
};
