import { z } from 'zod';
import type { Locale } from '@/lib/locales';
import type {
  TranslationProvider,
  TranslationProviderArgs,
  TranslationProviderBatchEntryResult,
  TranslationProviderBatchResult,
  TranslationProviderResult,
} from './types';

const DEEPL_LANG: Record<Locale, string> = {
  ko: 'KO',
  'zh-hant': 'ZH-HANT',
  en: 'EN',
};

const deeplResponseSchema = z.object({
  translations: z.array(z.object({
    text: z.string().optional(),
  })).optional(),
});

function isPro(apiKey: string): boolean {
  return !apiKey.endsWith(':fx');
}

async function readResponseText(response: Response): Promise<string> {
  try {
    return await response.text();
  } catch (error) {
    if (error instanceof Error) return '';
    return '';
  }
}

async function readDeepLResponse(response: Response): Promise<z.infer<typeof deeplResponseSchema> | null> {
  try {
    const jsonPayload: unknown = await response.json();
    const parsed = deeplResponseSchema.safeParse(jsonPayload);
    return parsed.success ? parsed.data : null;
  } catch (error) {
    if (error instanceof SyntaxError) return null;
    if (error instanceof Error) return null;
    return null;
  }
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
        const detail = await readResponseText(res);
        return { ok: false, reason: 'send', provider: 'deepl', error: `${res.status} ${detail.slice(0, 200)}` };
      }
      const data = await readDeepLResponse(res);
      const text = data?.translations?.[0]?.text;
      if (!text) {
        return { ok: false, reason: 'parse', provider: 'deepl', error: 'missing translations' };
      }
      return { ok: true, provider: 'deepl', text };
    } catch (err) {
      return { ok: false, reason: 'network', provider: 'deepl', error: err instanceof Error ? err.message : String(err) };
    }
  },
  async translateBatch({ sourceLocale, targetLocale, items }): Promise<TranslationProviderBatchResult> {
    const apiKey = process.env.DEEPL_API_KEY ?? '';
    if (!apiKey) {
      const results = items.map((item) => ({
        key: item.key,
        ok: false,
        reason: 'unconfigured',
        provider: 'deepl',
      }) satisfies TranslationProviderBatchEntryResult);
      return { results, summary: { provider: 'deepl', mode: 'native-batch', requested: items.length, succeeded: 0, failed: items.length } };
    }

    const endpoint = isPro(apiKey)
      ? 'https://api.deepl.com/v2/translate'
      : 'https://api-free.deepl.com/v2/translate';

    try {
      const form = new URLSearchParams();
      form.set('source_lang', DEEPL_LANG[sourceLocale]);
      form.set('target_lang', DEEPL_LANG[targetLocale]);
      form.set('preserve_formatting', '1');
      for (const item of items) form.append('text', item.sourceText);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `DeepL-Auth-Key ${apiKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form.toString(),
      });
      if (!res.ok) {
        const detail = await readResponseText(res);
        const error = `${res.status} ${detail.slice(0, 200)}`;
        const results = items.map((item) => ({
          key: item.key,
          ok: false,
          reason: 'send',
          provider: 'deepl',
          error,
        }) satisfies TranslationProviderBatchEntryResult);
        return { results, summary: { provider: 'deepl', mode: 'native-batch', requested: items.length, succeeded: 0, failed: items.length } };
      }
      const data = await readDeepLResponse(res);
      const results = items.map((item, index) => {
        const text = data?.translations?.[index]?.text;
        if (!text) {
          return {
            key: item.key,
            ok: false,
            reason: 'parse',
            provider: 'deepl',
            error: 'missing translations',
          } satisfies TranslationProviderBatchEntryResult;
        }
        return { key: item.key, ok: true, provider: 'deepl', text } satisfies TranslationProviderBatchEntryResult;
      });
      const succeeded = results.filter((result) => result.ok).length;
      return {
        results,
        summary: {
          provider: 'deepl',
          mode: 'native-batch',
          requested: items.length,
          succeeded,
          failed: items.length - succeeded,
        },
      };
    } catch (err) {
      const error = err instanceof Error ? err.message : String(err);
      const results = items.map((item) => ({
        key: item.key,
        ok: false,
        reason: 'network',
        provider: 'deepl',
        error,
      }) satisfies TranslationProviderBatchEntryResult);
      return { results, summary: { provider: 'deepl', mode: 'native-batch', requested: items.length, succeeded: 0, failed: items.length } };
    }
  },
};
