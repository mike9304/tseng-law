import type { Locale } from '@/lib/locales';

export type TranslationProviderId = 'openai' | 'deepl' | 'mock';

export interface TranslationProviderArgs {
  sourceLocale: Locale;
  targetLocale: Locale;
  sourceText: string;
}

export type TranslationProviderResult =
  | { ok: true; text: string; provider: TranslationProviderId }
  | { ok: false; reason: 'unconfigured' | 'send' | 'parse' | 'network'; provider: TranslationProviderId; error?: string };

export interface TranslationProvider {
  id: TranslationProviderId;
  isConfigured(): boolean;
  translate(args: TranslationProviderArgs): Promise<TranslationProviderResult>;
}
