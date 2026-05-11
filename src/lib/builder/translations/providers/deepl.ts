import type { Locale } from '@/lib/locales';
import type {
  TranslationProvider,
  TranslationProviderArgs,
  TranslationProviderResult,
} from './types';

const DEEPL_LANG: Record<Locale, string> = {
  ko: 'KO',
  'zh-hant': 'ZH-HANT',
  en: 'EN',
};

function isPro(apiKey: string): boolean {
  return !apiKey.endsWith(':fx');
}

export const deeplProvider: TranslationProvider = {
  id: 'deepl',
  isConfigured() {
    return Boolean(process.env.DEEPL_API_KEY);
  },
  async translate({ sourceLocale, targetLocale, sourceText }: TranslationProviderArgs): Promise<TranslationProviderResult> {
    const apiKey = process.env.DEEPL_API_KEY ?? '';
    if (!apiKey) return { ok: false, reason: 'unconfigured', provider: 'deepl' };

    const endpoint = isPro(apiKey)
      ? 'https://api.deepl.com/v2/translate'
      : 'https://api-free.deepl.com/v2/translate';

    try {
      const form = new URLSearchParams();
      form.set('source_lang', DEEPL_LANG[sourceLocale]);
      form.set('target_lang', DEEPL_LANG[targetLocale]);
      form.set('text', sourceText);
      form.set('preserve_formatting', '1');

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `DeepL-Auth-Key ${apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form.toString(),
      });
      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        return { ok: false, reason: 'send', provider: 'deepl', error: `${res.status} ${detail.slice(0, 200)}` };
      }
      const data = (await res.json().catch(() => null)) as { translations?: Array<{ text?: string }> } | null;
      const text = data?.translations?.[0]?.text;
      if (!text) {
        return { ok: false, reason: 'parse', provider: 'deepl', error: 'missing translations' };
      }
      return { ok: true, provider: 'deepl', text };
    } catch (err) {
      return { ok: false, reason: 'network', provider: 'deepl', error: err instanceof Error ? err.message : String(err) };
    }
  },
};
