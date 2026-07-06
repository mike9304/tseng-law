import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { clearTranslationProviderSmokeHistory } from '../diagnostics';
import {
  clearTranslationProviderSmokeHistoryStore,
  readTranslationProviderSmokeHistory,
} from '../smoke-history';
import { runScheduledTranslationProviderSmoke } from '../scheduled-smoke';

describe('scheduled translation provider smoke aggregation', () => {
  const previousPath = process.env.BUILDER_TRANSLATION_PROVIDER_SMOKE_HISTORY_PATH;
  const previousOpenAiKey = process.env.OPENAI_API_KEY;
  const previousDeepLKey = process.env.DEEPL_API_KEY;
  let tempRoot = '';

  beforeEach(async () => {
    if (tempRoot) rmSync(tempRoot, { recursive: true, force: true });
    tempRoot = mkdtempSync(path.join(os.tmpdir(), 'provider-scheduled-smoke-'));
    process.env.BUILDER_TRANSLATION_PROVIDER_SMOKE_HISTORY_PATH = tempRoot;
    delete process.env.OPENAI_API_KEY;
    delete process.env.DEEPL_API_KEY;
    clearTranslationProviderSmokeHistory();
    await clearTranslationProviderSmokeHistoryStore();
  });

  afterEach(async () => {
    clearTranslationProviderSmokeHistory();
    await clearTranslationProviderSmokeHistoryStore();
    if (previousPath === undefined) delete process.env.BUILDER_TRANSLATION_PROVIDER_SMOKE_HISTORY_PATH;
    else process.env.BUILDER_TRANSLATION_PROVIDER_SMOKE_HISTORY_PATH = previousPath;
    if (previousOpenAiKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousOpenAiKey;
    if (previousDeepLKey === undefined) delete process.env.DEEPL_API_KEY;
    else process.env.DEEPL_API_KEY = previousDeepLKey;
    if (tempRoot) rmSync(tempRoot, { recursive: true, force: true });
  });

  it('records one durable smoke result for every translation provider', async () => {
    const summary = await runScheduledTranslationProviderSmoke({
      sourceLocale: 'ko',
      targetLocale: 'en',
      sourceText: '호정국제 번역 제공자 정기 점검',
    });

    expect(summary.checked).toBe(2);
    expect(summary.passed).toBe(0);
    expect(summary.failed).toBe(0);
    expect(summary.unconfigured).toBe(2);
    expect(summary.results.map((result) => result.provider).sort()).toEqual(['deepl', 'openai']);
    expect(summary.results.every((result) => result.status === 'unconfigured')).toBe(true);

    const history = await readTranslationProviderSmokeHistory();
    expect(history).toHaveLength(2);
    expect(history.map((entry) => entry.provider).sort()).toEqual(['deepl', 'openai']);
    expect(history.every((entry) => entry.reason === 'unconfigured')).toBe(true);
  });
});
