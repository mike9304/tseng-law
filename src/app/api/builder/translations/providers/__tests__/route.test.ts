import { NextRequest, NextResponse } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  buildTranslationProviderReadinessReport,
  recordTranslationProviderSmokeResult,
  runTranslationProviderSmoke,
} from '@/lib/builder/translations/providers/diagnostics';
import {
  appendTranslationProviderSmokeHistory,
  readTranslationProviderSmokeHistory,
} from '@/lib/builder/translations/providers/smoke-history';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'translator@example.test' })),
}));

vi.mock('@/lib/builder/translations/providers/diagnostics', () => ({
  translationProviderDiagnosticIds: ['openai', 'deepl'],
  buildTranslationProviderReadinessReport: vi.fn(() => ({
    ok: true,
    production: true,
    selectedProvider: 'openai',
    providers: [
      {
        id: 'openai',
        configured: true,
        selected: true,
        secretName: 'OPENAI_API_KEY',
        model: 'gpt-4o-mini',
      },
      {
        id: 'deepl',
        configured: false,
        selected: false,
        secretName: 'DEEPL_API_KEY',
      },
    ],
    checks: [
      {
        id: 'openai_secret',
        provider: 'openai',
        status: 'pass',
        label: 'OpenAI secret',
        detail: 'OPENAI_API_KEY is present.',
      },
    ],
    smokeHistory: [],
    smokeSummary: {
      total: 0,
      passed: 0,
      failed: 0,
      unconfigured: 0,
      freshness: 'missing',
      reviewerStatus: 'no_history',
      actionItems: ['run_provider_smoke'],
      providers: [
        { provider: 'openai', status: 'missing' },
        { provider: 'deepl', status: 'missing' },
      ],
    },
  })),
  recordTranslationProviderSmokeResult: vi.fn(),
  runTranslationProviderSmoke: vi.fn(async () => ({
    ok: true,
    provider: 'openai',
    status: 'pass',
    sourceLocale: 'ko',
    targetLocale: 'en',
    durationMs: 25,
    translatedTextPreview: 'Provider smoke check',
  })),
}));

vi.mock('@/lib/builder/translations/providers/smoke-history', () => ({
  appendTranslationProviderSmokeHistory: vi.fn(async (entry) => [entry]),
  readTranslationProviderSmokeHistory: vi.fn(async () => []),
}));

const guardMutationMock = vi.mocked(guardMutation);
const buildReportMock = vi.mocked(buildTranslationProviderReadinessReport);
const recordSmokeMock = vi.mocked(recordTranslationProviderSmokeResult);
const runSmokeMock = vi.mocked(runTranslationProviderSmoke);
const appendHistoryMock = vi.mocked(appendTranslationProviderSmokeHistory);
const readHistoryMock = vi.mocked(readTranslationProviderSmokeHistory);
const authorizedGuardResult: Awaited<ReturnType<typeof guardMutation>> = {
  username: 'translator@example.test',
};

function request(path: string, body?: unknown): NextRequest {
  return new NextRequest(`https://law.example.test${path}`, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}

describe('/api/builder/translations/providers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue(authorizedGuardResult);
    readHistoryMock.mockResolvedValue([]);
    recordSmokeMock.mockImplementation((smoke) => ({
      checkedAt: '2026-06-20T10:01:00.000Z',
      ...smoke,
    }));
  });

  it('returns guarded provider readiness without exposing secret values', async () => {
    const route = await import('../route');
    const response = await route.GET(request('/api/builder/translations/providers?locale=en'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      ok: true,
      report: {
        ok: true,
        selectedProvider: 'openai',
        smokeSummary: {
          freshness: 'missing',
          reviewerStatus: 'no_history',
          actionItems: ['run_provider_smoke'],
        },
      },
    });
    expect(payload.report.providers).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'openai', configured: true }),
    ]));
    expect(JSON.stringify(payload)).not.toContain('sk-secret');
    expect(buildReportMock).toHaveBeenCalled();
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), {
      allowReadOnly: true,
      permission: 'edit-pages',
    });
  });

  it('runs a guarded provider smoke test and returns the refreshed report', async () => {
    const route = await import('../route');
    const response = await route.POST(request('/api/builder/translations/providers?locale=en', {
      provider: 'openai',
      sourceLocale: 'ko',
      targetLocale: 'en',
      sourceText: '호정국제 번역 제공자 점검',
    }));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      ok: true,
      smoke: {
        ok: true,
        provider: 'openai',
        status: 'pass',
      },
      report: {
        selectedProvider: 'openai',
      },
    });
    expect(runSmokeMock).toHaveBeenCalledWith({
      provider: 'openai',
      sourceLocale: 'ko',
      targetLocale: 'en',
      sourceText: '호정국제 번역 제공자 점검',
    });
    expect(recordSmokeMock).toHaveBeenCalledWith(expect.objectContaining({
      ok: true,
      provider: 'openai',
      status: 'pass',
    }));
    expect(appendHistoryMock).toHaveBeenCalledWith(expect.objectContaining({
      checkedAt: '2026-06-20T10:01:00.000Z',
      provider: 'openai',
      status: 'pass',
    }));
  });

  it('passes guard failures through unchanged', async () => {
    const unauthorizedResponse: Awaited<ReturnType<typeof guardMutation>> = NextResponse.json(
      { error: 'unauthorized' },
      { status: 401 },
    );
    guardMutationMock.mockResolvedValueOnce(unauthorizedResponse);
    const route = await import('../route');
    const response = await route.GET(request('/api/builder/translations/providers'));

    expect(response.status).toBe(401);
  });
});
