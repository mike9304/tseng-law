import { NextRequest } from 'next/server';
import { mkdtempSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearTranslationProviderSmokeHistory } from '@/lib/builder/translations/providers/diagnostics';
import { clearTranslationProviderSmokeHistoryStore } from '@/lib/builder/translations/providers/smoke-history';
import { clearTranslationCache } from '@/lib/builder/translations/providers/router';
import { POST, GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'translator@example.test' })),
}));

function request(path: string, body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe('/api/builder/translations/providers smoke history', () => {
  const previousPath = process.env.BUILDER_TRANSLATION_PROVIDER_SMOKE_HISTORY_PATH;
  let tempRoot = '';

  beforeEach(async () => {
    if (tempRoot) rmSync(tempRoot, { recursive: true, force: true });
    tempRoot = mkdtempSync(path.join(os.tmpdir(), 'provider-route-smoke-history-'));
    process.env.BUILDER_TRANSLATION_PROVIDER_SMOKE_HISTORY_PATH = tempRoot;
    clearTranslationCache();
    clearTranslationProviderSmokeHistory();
    await clearTranslationProviderSmokeHistoryStore();
  });

  beforeEach(() => {
    process.env.OPENAI_API_KEY = 'sk-secret';
    vi.spyOn(Date, 'now')
      .mockReturnValueOnce(10_000)
      .mockReturnValue(10_042);
    vi.stubGlobal('fetch', vi.fn(async () => new Response(
      JSON.stringify({
        choices: [{
          message: {
            content: JSON.stringify({ text: 'Provider smoke check' }),
          },
        }],
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )));
  });

  afterEach(async () => {
    vi.restoreAllMocks();
    clearTranslationCache();
    clearTranslationProviderSmokeHistory();
    await clearTranslationProviderSmokeHistoryStore();
    delete process.env.OPENAI_API_KEY;
    if (previousPath === undefined) delete process.env.BUILDER_TRANSLATION_PROVIDER_SMOKE_HISTORY_PATH;
    else process.env.BUILDER_TRANSLATION_PROVIDER_SMOKE_HISTORY_PATH = previousPath;
    if (tempRoot) rmSync(tempRoot, { recursive: true, force: true });
  });

  it('returns the latest smoke run in POST and following GET readiness reports', async () => {
    const postResponse = await POST(request('/api/builder/translations/providers?locale=ko', {
      provider: 'openai',
      sourceLocale: 'ko',
      targetLocale: 'en',
      sourceText: '호정국제 번역 제공자 점검',
    }));
    const postPayload = await postResponse.json();

    expect(postResponse.status).toBe(200);
    expect(postPayload.smoke).toMatchObject({
      ok: true,
      provider: 'openai',
      status: 'pass',
      durationMs: 42,
      translatedTextPreview: 'Provider smoke check',
    });
    expect(postPayload.report.smokeHistory[0]).toMatchObject({
      ok: true,
      provider: 'openai',
      status: 'pass',
      sourceLocale: 'ko',
      targetLocale: 'en',
      durationMs: 42,
      translatedTextPreview: 'Provider smoke check',
    });
    const latestPostCheckedAt = postPayload.report.smokeHistory[0].checkedAt;
    expect(postPayload.report.smokeSummary).toMatchObject({
      total: 1,
      passed: 1,
      failed: 0,
      unconfigured: 0,
      lastCheckedAt: latestPostCheckedAt,
      freshness: 'fresh',
      ageMinutes: expect.any(Number),
      reviewerStatus: 'needs_attention',
      actionItems: ['run_provider_smoke'],
      providers: [
        {
          provider: 'openai',
          status: 'pass',
          checkedAt: latestPostCheckedAt,
          durationMs: 42,
        },
        {
          provider: 'deepl',
          status: 'missing',
        },
      ],
    });
    expect(JSON.stringify(postPayload)).not.toContain('sk-secret');

    const getResponse = await GET(request('/api/builder/translations/providers?locale=ko'));
    const getPayload = await getResponse.json();
    expect(getPayload.report.smokeHistory[0]).toMatchObject({
      provider: 'openai',
      status: 'pass',
      durationMs: 42,
    });
    expect(getPayload.report.smokeSummary).toMatchObject({
      total: 1,
      passed: 1,
      freshness: 'fresh',
      ageMinutes: expect.any(Number),
      reviewerStatus: 'needs_attention',
      actionItems: ['run_provider_smoke'],
      providers: [
        expect.objectContaining({ provider: 'openai', status: 'pass' }),
        expect.objectContaining({ provider: 'deepl', status: 'missing' }),
      ],
    });
  });

  it('keeps the latest smoke run after process memory is cleared', async () => {
    const postResponse = await POST(request('/api/builder/translations/providers?locale=ko', {
      provider: 'openai',
      sourceLocale: 'ko',
      targetLocale: 'en',
      sourceText: '호정국제 번역 제공자 점검',
    }));
    expect(postResponse.status).toBe(200);

    clearTranslationProviderSmokeHistory();

    const getResponse = await GET(request('/api/builder/translations/providers?locale=ko'));
    const getPayload = await getResponse.json();
    expect(getPayload.report.smokeHistory[0]).toMatchObject({
      provider: 'openai',
      status: 'pass',
      sourceLocale: 'ko',
      targetLocale: 'en',
      durationMs: 42,
    });
    const latestGetCheckedAt = getPayload.report.smokeHistory[0].checkedAt;
    expect(getPayload.report.smokeSummary).toMatchObject({
      total: 1,
      passed: 1,
      lastCheckedAt: latestGetCheckedAt,
      freshness: 'fresh',
      ageMinutes: expect.any(Number),
      reviewerStatus: 'needs_attention',
      actionItems: ['run_provider_smoke'],
    });
  });
});
