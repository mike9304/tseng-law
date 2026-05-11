import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearTranslationCache,
  listAvailableProviders,
  translateViaRouter,
} from '@/lib/builder/translations/providers/router';
import { openaiProvider } from '@/lib/builder/translations/providers/openai';
import { deeplProvider } from '@/lib/builder/translations/providers/deepl';

describe('translation router', () => {
  beforeEach(() => {
    clearTranslationCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.OPENAI_API_KEY;
    delete process.env.DEEPL_API_KEY;
    delete process.env.TRANSLATION_PROVIDER;
  });

  it('returns source verbatim when source and target locales match', async () => {
    const result = await translateViaRouter({ sourceLocale: 'ko', targetLocale: 'ko', sourceText: '안녕' });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.text).toBe('안녕');
      expect(result.provider).toBe('mock');
    }
  });

  it('falls back to mock when no provider configured', async () => {
    const result = await translateViaRouter({ sourceLocale: 'ko', targetLocale: 'en', sourceText: '안녕' });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.provider).toBe('mock');
    }
  });

  it('caches successful results so the provider is only called once for repeats', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    const spy = vi.spyOn(openaiProvider, 'translate').mockResolvedValue({
      ok: true,
      provider: 'openai',
      text: 'translated',
    });

    await translateViaRouter({ sourceLocale: 'ko', targetLocale: 'en', sourceText: 'same' });
    await translateViaRouter({ sourceLocale: 'ko', targetLocale: 'en', sourceText: 'same' });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('honours preferProvider=mock even when other providers are configured', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    const spy = vi.spyOn(openaiProvider, 'translate');
    const result = await translateViaRouter({ sourceLocale: 'ko', targetLocale: 'en', sourceText: '안녕', preferProvider: 'mock' });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.provider).toBe('mock');
    expect(spy).not.toHaveBeenCalled();
  });

  it('selects DeepL first when both providers are configured (registration order)', async () => {
    process.env.OPENAI_API_KEY = 'sk-test';
    process.env.DEEPL_API_KEY = 'deepl-test';
    const deeplSpy = vi.spyOn(deeplProvider, 'translate').mockResolvedValue({
      ok: true,
      provider: 'deepl',
      text: 'deepl-translation',
    });
    const openaiSpy = vi.spyOn(openaiProvider, 'translate');
    const result = await translateViaRouter({ sourceLocale: 'ko', targetLocale: 'en', sourceText: '안녕' });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.provider).toBe('deepl');
    expect(deeplSpy).toHaveBeenCalled();
    expect(openaiSpy).not.toHaveBeenCalled();
  });

  it('listAvailableProviders reflects env config state', () => {
    const before = listAvailableProviders();
    expect(before.every((p) => !p.configured)).toBe(true);
    process.env.OPENAI_API_KEY = 'sk-test';
    const after = listAvailableProviders();
    expect(after.find((p) => p.id === 'openai')?.configured).toBe(true);
  });
});
