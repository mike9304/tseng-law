import { expect, test } from '@playwright/test';

type SmokeHistoryEntry = {
  readonly ok: boolean;
  readonly provider: 'openai' | 'deepl';
  readonly status: 'pass' | 'fail' | 'unconfigured';
  readonly sourceLocale: 'ko' | 'zh-hant' | 'en';
  readonly targetLocale: 'ko' | 'zh-hant' | 'en';
  readonly durationMs: number;
  readonly checkedAt: string;
  readonly translatedTextPreview?: string;
};

test('/ko/admin-builder/translations shows provider readiness and smoke result', async ({ page }) => {
  await page.route('**/api/builder/translations/providers**', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ok: true,
          smoke: {
            ok: true,
            provider: 'openai',
            status: 'pass',
            sourceLocale: 'ko',
            targetLocale: 'en',
            durationMs: 42,
            translatedTextPreview: 'Provider smoke check',
          },
          report: readinessReport([{
            ok: true,
            provider: 'openai',
            status: 'pass',
            sourceLocale: 'ko',
            targetLocale: 'en',
            durationMs: 42,
            checkedAt: '2026-06-20T10:01:00.000Z',
            translatedTextPreview: 'Provider smoke check',
          }]),
        }),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true, report: readinessReport() }),
    });
  });

  await page.goto('/ko/admin-builder/translations?sourceLocale=ko', { waitUntil: 'domcontentloaded' });

  const panel = page.locator('[data-translation-provider-readiness="true"]');
  await expect(panel).toBeVisible();
  await expect(panel).toContainText('번역 제공자 점검');
  await expect(panel).toContainText('openai');
  await expect(panel).toContainText('OPENAI_API_KEY');
  await expect(panel).toContainText('설정됨');
  await expect(panel).toContainText('deepl');
  await expect(panel).toContainText('시크릿 없음');

  await panel.getByRole('button', { name: 'openai 점검 실행' }).click();

  await expect(panel).toContainText('openai 점검 통과 · 42ms');
  await expect(panel).toContainText('점검 리포트');
  await expect(panel).toContainText('최근 1회 · 통과 1 · 실패 0 · 미설정 0');
  await expect(panel).toContainText('최근 점검 18분 전 · 정상');
  await expect(panel).toContainText('검토 상태: 검토 필요');
  await expect(panel).toContainText('다음 조치: 누락된 제공자 점검 실행');
  await expect(panel).toContainText('openai 최신 통과 · 42ms');
  await expect(panel).toContainText('최근 점검');
  await expect(panel).toContainText('openai · 통과 · ko→en · 42ms');
  const smokeSummary = panel.locator('[data-translation-provider-smoke-summary="true"]');
  await smokeSummary.evaluate((element) => {
    element.scrollIntoView({ block: 'center', inline: 'nearest' });
  });
  const smokeSummaryRows = smokeSummary.locator('p');
  await expect(smokeSummaryRows.nth(3)).toBeVisible();
  await expect(smokeSummaryRows.nth(3)).toHaveText('다음 조치: 누락된 제공자 점검 실행');
  const smokeSummaryBox = await smokeSummary.boundingBox();
  if (smokeSummaryBox === null) {
    throw new Error('Provider smoke summary should have a visible bounding box before screenshot.');
  }
  const smokeSummaryClip = await smokeSummary.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      x: rect.x + window.scrollX,
      y: rect.y + window.scrollY,
      width: rect.width,
      height: rect.height,
    };
  });
  await page.screenshot({
    path: '/private/tmp/translations-provider-readiness-smoke-summary-visible-ko.png',
    clip: smokeSummaryClip,
    fullPage: true,
  });
  await page.screenshot({ path: '/private/tmp/translations-provider-readiness-ko.png', fullPage: true });
});

function readinessReport(smokeHistory: readonly SmokeHistoryEntry[] = []) {
  return {
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
      {
        id: 'deepl_secret',
        provider: 'deepl',
        status: 'warn',
        label: 'DeepL secret',
        detail: 'DEEPL_API_KEY is missing.',
      },
    ],
    smokeSummary: {
      total: smokeHistory.length,
      passed: smokeHistory.filter((entry) => entry.status === 'pass').length,
      failed: smokeHistory.filter((entry) => entry.status === 'fail').length,
      unconfigured: smokeHistory.filter((entry) => entry.status === 'unconfigured').length,
      ...(smokeHistory[0]?.checkedAt ? { lastCheckedAt: smokeHistory[0].checkedAt } : {}),
      freshness: smokeHistory.length > 0 ? 'fresh' : 'missing',
      ...(smokeHistory.length > 0 ? { ageMinutes: 18 } : {}),
      reviewerStatus: smokeHistory.length > 0 ? 'needs_attention' : 'no_history',
      actionItems: ['run_provider_smoke'],
      providers: [
        smokeHistory.find((entry) => entry.provider === 'openai')
          ? {
            provider: 'openai',
            status: 'pass',
            checkedAt: '2026-06-20T10:01:00.000Z',
            durationMs: 42,
          }
          : { provider: 'openai', status: 'missing' },
        { provider: 'deepl', status: 'missing' },
      ],
    },
    smokeHistory,
  };
}
