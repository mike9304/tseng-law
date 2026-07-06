import { expect, test } from '@playwright/test';
import { mkdir, readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { expectArray, expectRecord, mutationHeaders } from './helpers/apps-hooks';

test('/api/builder/translations/providers persists smoke history to disk', async ({ page }) => {
  test.setTimeout(60_000);
  const historyRoot = process.env.BUILDER_TRANSLATION_PROVIDER_SMOKE_HISTORY_PATH;
  test.skip(!historyRoot, 'BUILDER_TRANSLATION_PROVIDER_SMOKE_HISTORY_PATH is required for isolated route proof');
  if (!historyRoot) return;

  await rm(historyRoot, { recursive: true, force: true });
  await mkdir(historyRoot, { recursive: true });

  const token = `provider-history-${Date.now().toString(36)}`;
  await page.setExtraHTTPHeaders(mutationHeaders(token));

  const postResponse = await page.request.post('/api/builder/translations/providers?locale=ko', {
    data: {
      provider: 'deepl',
      sourceLocale: 'ko',
      targetLocale: 'en',
      sourceText: '호정국제 번역 제공자 점검',
    },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(token) },
  });
  expect(postResponse.status()).toBe(409);
  const postPayload = expectRecord(await postResponse.json(), 'provider smoke response');
  const postReport = expectRecord(postPayload.report, 'post readiness report');
  const postHistory = expectArray(postReport.smokeHistory, 'post smoke history');
  const postSummary = expectRecord(postReport.smokeSummary, 'post smoke summary');
  const postSummaryProviders = expectArray(postSummary.providers, 'post smoke summary providers');
  expect(postHistory[0]).toMatchObject({
    provider: 'deepl',
    status: 'unconfigured',
    sourceLocale: 'ko',
    targetLocale: 'en',
    reason: 'unconfigured',
  });
  expect(postSummary).toMatchObject({
    total: 1,
    passed: 0,
    failed: 0,
    unconfigured: 1,
    freshness: 'fresh',
    reviewerStatus: 'needs_attention',
    actionItems: ['run_provider_smoke', 'configure_provider'],
  });
  expect(typeof postSummary.ageMinutes).toBe('number');
  expect(postSummaryProviders).toEqual(expect.arrayContaining([
    expect.objectContaining({ provider: 'openai', status: 'missing' }),
    expect.objectContaining({ provider: 'deepl', status: 'unconfigured' }),
  ]));

  await expect(async () => {
    const raw = await readFile(path.join(historyRoot, 'smoke-history.json'), 'utf8');
    const parsed: unknown = JSON.parse(raw);
    const file = expectRecord(parsed, 'smoke history file');
    const entries = expectArray(file.entries, 'smoke history file entries');
    expect(entries[0]).toMatchObject({
      provider: 'deepl',
      status: 'unconfigured',
      sourceLocale: 'ko',
      targetLocale: 'en',
      reason: 'unconfigured',
    });
  }).toPass({ timeout: 10_000 });

  const getResponse = await page.request.get('/api/builder/translations/providers?locale=ko', {
    headers: mutationHeaders(`${token}-read`),
  });
  expect(getResponse.status()).toBe(200);
  const getPayload = expectRecord(await getResponse.json(), 'provider readiness response');
  const getReport = expectRecord(getPayload.report, 'get readiness report');
  const getHistory = expectArray(getReport.smokeHistory, 'get smoke history');
  const getSummary = expectRecord(getReport.smokeSummary, 'get smoke summary');
  expect(getHistory[0]).toMatchObject({
    provider: 'deepl',
    status: 'unconfigured',
    sourceLocale: 'ko',
    targetLocale: 'en',
    reason: 'unconfigured',
  });
  expect(getSummary).toMatchObject({
    total: 1,
    unconfigured: 1,
    freshness: 'fresh',
    reviewerStatus: 'needs_attention',
    actionItems: ['run_provider_smoke', 'configure_provider'],
  });
  expect(typeof getSummary.ageMinutes).toBe('number');
});
