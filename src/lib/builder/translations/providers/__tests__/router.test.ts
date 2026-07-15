import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  clearTranslationCache,
  listAvailableProviders,
  translateBatchViaRouter,
  translateViaRouter,
} from '@/lib/builder/translations/providers/router';
import { openaiProvider } from '@/lib/builder/translations/providers/openai';
import { deeplProvider } from '@/lib/builder/translations/providers/deepl';

describe('translation router', () => {
  const mutableEnv = process.env as Record<string, string | undefined>;
  const initialNodeEnv = mutableEnv.NODE_ENV;

  beforeEach(() => {
    clearTranslationCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.OPENAI_API_KEY;
    delete process.env.DEEPL_API_KEY;
    delete process.env.TRANSLATION_PROVIDER;
    if (initialNodeEnv === undefined) delete mutableEnv.NODE_ENV;
    else mutableEnv.NODE_ENV = initialNodeEnv;
  });

  it('returns source verbatim when source and target locales match', async () => {
    mutableEnv.NODE_ENV = 'production';
    const result = await translateViaRouter({ sourceLocale: 'ko', targetLocale: 'ko', sourceText: '안녕' });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.text).toBe('안녕');
      expect(result.provider).toBe('mock');
    }
  });

  it('uses mock translation in non-production when no provider is configured', async () => {
    mutableEnv.NODE_ENV = 'test';
    const result = await translateViaRouter({ sourceLocale: 'ko', targetLocale: 'en', sourceText: '안녕' });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.provider).toBe('mock');
      expect(result.text).toBe('안녕');
    }
  });

  it('fails closed in production when no real provider is configured', async () => {
    mutableEnv.NODE_ENV = 'production';
    const result = await translateViaRouter({ sourceLocale: 'ko', targetLocale: 'en', sourceText: '안녕' });
    expect(result).toEqual({ ok: false, reason: 'unconfigured', provider: 'mock' });
  });

  it('fails closed in production when mock is explicitly preferred', async () => {
    mutableEnv.NODE_ENV = 'production';
    const result = await translateViaRouter({
      sourceLocale: 'ko',
      targetLocale: 'en',
      sourceText: '안녕',
      preferProvider: 'mock',
    });
    expect(result).toEqual({ ok: false, reason: 'unconfigured', provider: 'mock' });
  });

  it('fails closed in production when TRANSLATION_PROVIDER=mock', async () => {
    mutableEnv.NODE_ENV = 'production';
    process.env.TRANSLATION_PROVIDER = 'mock';
    const result = await translateViaRouter({ sourceLocale: 'ko', targetLocale: 'en', sourceText: '안녕' });
    expect(result).toEqual({ ok: false, reason: 'unconfigured', provider: 'mock' });
  });

  it.each(['openai', 'deepl'] as const)(
    'keeps an explicitly preferred unconfigured %s provider instead of falling back to mock',
    async (provider) => {
      mutableEnv.NODE_ENV = 'test';
      delete process.env.OPENAI_API_KEY;
      delete process.env.DEEPL_API_KEY;

      const result = await translateViaRouter({
        sourceLocale: 'ko',
        targetLocale: 'en',
        sourceText: '안녕',
        preferProvider: provider,
      });

      expect(result).toEqual({ ok: false, reason: 'unconfigured', provider });
    },
  );

  it.each([
    ['  OPENAI \n', 'openai'],
    ['\tDeEpL  ', 'deepl'],
  ] as const)(
    'normalizes whitespace and casing in TRANSLATION_PROVIDER=%j before selecting %s',
    async (configuredValue, provider) => {
      mutableEnv.NODE_ENV = 'test';
      delete process.env.OPENAI_API_KEY;
      delete process.env.DEEPL_API_KEY;
      process.env.TRANSLATION_PROVIDER = configuredValue;

      const result = await translateViaRouter({ sourceLocale: 'ko', targetLocale: 'en', sourceText: '안녕' });

      expect(result).toEqual({ ok: false, reason: 'unconfigured', provider });
    },
  );

  it.each(['openai', 'deepl'] as const)(
    'returns provider-specific unconfigured batch failures for explicitly preferred %s',
    async (provider) => {
      mutableEnv.NODE_ENV = 'test';
      delete process.env.OPENAI_API_KEY;
      delete process.env.DEEPL_API_KEY;
      const progress: Array<{ step?: { name?: string } }> = [];

      const result = await translateBatchViaRouter({
        sourceLocale: 'ko',
        targetLocale: 'en',
        preferProvider: provider,
        items: [{ key: 'title', sourceText: '제목' }],
        onProgress: (event) => progress.push(event),
      });

      expect(result.results).toEqual([
        { key: 'title', ok: false, provider, reason: 'unconfigured' },
      ]);
      expect(result.summary).toMatchObject({ provider, succeeded: 0, failed: 1 });
      expect(progress.map((event) => event.step?.name)).not.toContain('mock-complete');
    },
  );

  it('keeps direct same-locale batches as source-text no-op successes in production', async () => {
    mutableEnv.NODE_ENV = 'production';
    const result = await translateBatchViaRouter({
      sourceLocale: 'ko',
      targetLocale: 'ko',
      items: [{ key: 'title', sourceText: '제목' }],
    });

    expect(result).toEqual({
      results: [{ key: 'title', ok: true, provider: 'mock', text: '제목' }],
      summary: {
        provider: 'mock',
        mode: 'native-batch',
        requested: 1,
        succeeded: 1,
        failed: 0,
      },
    });
  });

  it('returns one failed unconfigured result per batch item in production without mock-complete telemetry', async () => {
    mutableEnv.NODE_ENV = 'production';
    const progress: Array<{ step?: { name?: string; succeeded: number; failed: number } }> = [];
    const result = await translateBatchViaRouter({
      sourceLocale: 'ko',
      targetLocale: 'en',
      items: [
        { key: 'title', sourceText: '제목' },
        { key: 'body', sourceText: '본문' },
      ],
      onProgress: (event) => progress.push(event),
    });

    expect(result).toEqual({
      results: [
        { key: 'title', ok: false, provider: 'mock', reason: 'unconfigured' },
        { key: 'body', ok: false, provider: 'mock', reason: 'unconfigured' },
      ],
      summary: {
        provider: 'mock',
        mode: 'native-batch',
        requested: 2,
        succeeded: 0,
        failed: 2,
      },
    });
    expect(progress.map((event) => event.step?.name)).not.toContain('mock-complete');
    expect(progress.at(-1)?.step).toMatchObject({ succeeded: 0, failed: 2 });
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
