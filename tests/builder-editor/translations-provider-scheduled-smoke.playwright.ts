import { expect, test } from '@playwright/test';
import { mkdir, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { expectArray, expectRecord, mutationHeaders } from './helpers/apps-hooks';

test('/api/cron/translation-provider-smoke persists all-provider smoke history', async ({ page }) => {
  test.setTimeout(60_000);
  const historyRoot = process.env.BUILDER_TRANSLATION_PROVIDER_SMOKE_HISTORY_PATH;
  const cronSecret = process.env.CRON_SECRET;
  test.skip(!historyRoot, 'BUILDER_TRANSLATION_PROVIDER_SMOKE_HISTORY_PATH is required for isolated route proof');
  test.skip(!cronSecret, 'CRON_SECRET is required for cron route proof');
  if (!historyRoot || !cronSecret) return;

  await rm(historyRoot, { recursive: true, force: true });
  await mkdir(historyRoot, { recursive: true });

  const cronResponse = await page.request.post('/api/cron/translation-provider-smoke', {
    headers: { 'x-cron-secret': cronSecret },
  });
  expect(cronResponse.status()).toBe(200);
  const cronPayload = expectRecord(await cronResponse.json(), 'scheduled provider smoke response');
  expect(cronPayload.ok).toBe(true);
  expect(cronPayload.checked).toBe(2);
  expect(cronPayload.unconfigured).toBe(2);
  const cronResults = expectArray(cronPayload.results, 'scheduled provider smoke results');
  expect(cronResults).toHaveLength(2);
  expect(cronResults.map((result) => expectRecord(result, 'scheduled result').provider).sort()).toEqual([
    'deepl',
    'openai',
  ]);

  await expect(async () => {
    const raw = await readFile(path.join(historyRoot, 'smoke-history.json'), 'utf8');
    const parsed: unknown = JSON.parse(raw);
    const file = expectRecord(parsed, 'scheduled smoke history file');
    const entries = expectArray(file.entries, 'scheduled smoke history entries');
    expect(entries).toHaveLength(2);
    expect(entries.map((entry) => expectRecord(entry, 'scheduled history entry').provider).sort()).toEqual([
      'deepl',
      'openai',
    ]);
  }).toPass({ timeout: 10_000 });

  const token = `scheduled-provider-smoke-${Date.now().toString(36)}`;
  const readinessResponse = await page.request.get('/api/builder/translations/providers?locale=ko', {
    headers: mutationHeaders(token),
  });
  expect(readinessResponse.status()).toBe(200);
  const readinessPayload = expectRecord(await readinessResponse.json(), 'provider readiness response');
  const readinessReport = expectRecord(readinessPayload.report, 'provider readiness report');
  const readinessHistory = expectArray(readinessReport.smokeHistory, 'readiness smoke history');
  const readinessSummary = expectRecord(readinessReport.smokeSummary, 'readiness smoke summary');
  const readinessSummaryProviders = expectArray(readinessSummary.providers, 'readiness smoke summary providers');
  expect(readinessHistory.map((entry) => expectRecord(entry, 'readiness history entry').provider).sort()).toEqual([
    'deepl',
    'openai',
  ]);
  expect(readinessSummary).toMatchObject({
    total: 2,
    passed: 0,
    failed: 0,
    unconfigured: 2,
    freshness: 'fresh',
    reviewerStatus: 'needs_attention',
    actionItems: ['configure_provider'],
  });
  expect(typeof readinessSummary.ageMinutes).toBe('number');
  expect(readinessSummaryProviders.map((provider) => expectRecord(provider, 'readiness summary provider').status)).toEqual([
    'unconfigured',
    'unconfigured',
  ]);
});
