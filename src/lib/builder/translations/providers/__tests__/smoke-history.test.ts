import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import {
  appendTranslationProviderSmokeHistory,
  clearTranslationProviderSmokeHistoryStore,
  readTranslationProviderSmokeHistory,
} from '../smoke-history';

describe('translation provider smoke history store', () => {
  const previousPath = process.env.BUILDER_TRANSLATION_PROVIDER_SMOKE_HISTORY_PATH;
  const previousBlobToken = process.env.BLOB_READ_WRITE_TOKEN;
  const previousBackend = process.env.BUILDER_TRANSLATION_PROVIDER_SMOKE_BACKEND;
  let tempRoot = '';

  beforeEach(() => {
    if (tempRoot) rmSync(tempRoot, { recursive: true, force: true });
    tempRoot = mkdtempSync(path.join(os.tmpdir(), 'provider-smoke-history-'));
    process.env.BUILDER_TRANSLATION_PROVIDER_SMOKE_HISTORY_PATH = tempRoot;
    delete process.env.BLOB_READ_WRITE_TOKEN;
    delete process.env.BUILDER_TRANSLATION_PROVIDER_SMOKE_BACKEND;
  });

  afterAll(() => {
    if (previousPath === undefined) delete process.env.BUILDER_TRANSLATION_PROVIDER_SMOKE_HISTORY_PATH;
    else process.env.BUILDER_TRANSLATION_PROVIDER_SMOKE_HISTORY_PATH = previousPath;
    if (previousBlobToken === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
    else process.env.BLOB_READ_WRITE_TOKEN = previousBlobToken;
    if (previousBackend === undefined) delete process.env.BUILDER_TRANSLATION_PROVIDER_SMOKE_BACKEND;
    else process.env.BUILDER_TRANSLATION_PROVIDER_SMOKE_BACKEND = previousBackend;
    if (tempRoot) rmSync(tempRoot, { recursive: true, force: true });
  });

  it('persists recent smoke runs newest-first across reads', async () => {
    await clearTranslationProviderSmokeHistoryStore();
    await appendTranslationProviderSmokeHistory({
      checkedAt: '2026-06-20T10:00:00.000Z',
      ok: false,
      provider: 'deepl',
      status: 'unconfigured',
      sourceLocale: 'ko',
      targetLocale: 'en',
      durationMs: 0,
      reason: 'unconfigured',
    });
    await appendTranslationProviderSmokeHistory({
      checkedAt: '2026-06-20T10:01:00.000Z',
      ok: true,
      provider: 'openai',
      status: 'pass',
      sourceLocale: 'ko',
      targetLocale: 'en',
      durationMs: 42,
      translatedTextPreview: 'Provider smoke check',
    });

    expect(await readTranslationProviderSmokeHistory()).toEqual([
      expect.objectContaining({
        checkedAt: '2026-06-20T10:01:00.000Z',
        provider: 'openai',
        status: 'pass',
        durationMs: 42,
      }),
      expect.objectContaining({
        checkedAt: '2026-06-20T10:00:00.000Z',
        provider: 'deepl',
        status: 'unconfigured',
        reason: 'unconfigured',
      }),
    ]);
  });
});
