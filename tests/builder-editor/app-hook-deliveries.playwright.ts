import { expect, test } from '@playwright/test';
import {
  expectArray,
  expectRecord,
  isRecord,
  mutationHeaders,
} from './helpers/apps-hooks';

function firstMatchingDelivery(
  deliveries: unknown[],
  hookId: string,
  expectedError: string,
): Record<string, unknown> {
  const match = deliveries.find((delivery) => (
    isRecord(delivery)
    && delivery.hookId === hookId
    && delivery.error === expectedError
  ));
  if (!isRecord(match)) throw new Error(`Missing delivery for ${hookId}`);
  return match;
}

test('/api/builder/apps/hooks/deliveries lists and retries failed stored hook runs', async ({ page }) => {
  test.setTimeout(60_000);

  const token = `delivery-${Date.now().toString(36)}`;
  const appId = `pw-delivery-${token}`.toLowerCase().slice(0, 60);
  const hookId = `${appId}-publish`.slice(0, 60);
  const marker = `delivery-failure-${token}`;
  const pageId = `page-${token}`;

  await page.setExtraHTTPHeaders(mutationHeaders(token));

  const createRes = await page.request.post('/api/builder/apps/hooks', {
    data: {
      appId,
      kind: 'publish.completed',
      hookId,
      priority: 5,
      code: `function handler(event, ctx) { ctx.log("${marker}:" + event.payload.pageId); throw new Error("${marker}:" + event.payload.pageId); }`,
    },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(`${token}-create`) },
  });
  expect(createRes.status()).toBe(201);

  const invokeRes = await page.request.post('/api/builder/apps/hooks/invoke?locale=en', {
    data: {
      kind: 'publish.completed',
      payload: {
        siteId: 'site-a',
        pageId,
        revision: 3,
        publishedAt: new Date().toISOString(),
      },
    },
    headers: { 'Content-Type': 'application/json', ...mutationHeaders(`${token}-invoke`) },
  });
  expect(invokeRes.status()).toBe(200);

  const deliveriesRes = await page.request.get(
    `/api/builder/apps/hooks/deliveries?hookId=${encodeURIComponent(hookId)}&status=failed&limit=5`,
  );
  expect(deliveriesRes.status()).toBe(200);
  const deliveriesBody = expectRecord(await deliveriesRes.json(), 'deliveries response');
  const deliveries = expectArray(deliveriesBody.deliveries, 'delivery list');
  const expectedError = `${marker}:${pageId}`;
  const first = firstMatchingDelivery(deliveries, hookId, expectedError);
  const deliveryId = first.deliveryId;

  expect(deliveriesBody.ok).toBe(true);
  expect(typeof deliveryId).toBe('string');
  expect(first).toMatchObject({
    hookId,
    appId,
    kind: 'publish.completed',
    status: 'failed',
    attempt: 1,
    error: expectedError,
  });

  const cronRes = await page.request.post('/api/cron/app-hooks-retry?limit=1', {
    headers: { authorization: 'Bearer app-hook-retry-test-secret', ...mutationHeaders(`${token}-cron`) },
  });
  expect(cronRes.status()).toBe(200);
  const cronBody = expectRecord(await cronRes.json(), 'app hook retry cron response');
  expect(cronBody.ok).toBe(true);
  expect(typeof cronBody.failedTotal).toBe('number');
  expect(typeof cronBody.retried).toBe('number');
  expect(typeof cronBody.skipped).toBe('number');
  expect(typeof cronBody.gaveUp).toBe('number');
  expect(typeof cronBody.unavailable).toBe('number');

  const retryRes = await page.request.post(
    `/api/builder/apps/hooks/deliveries/${encodeURIComponent(String(deliveryId))}/retry?locale=en`,
    { headers: mutationHeaders(`${token}-retry`) },
  );
  expect(retryRes.status()).toBe(200);
  const retryBody = expectRecord(await retryRes.json(), 'retry response');
  const retried = expectRecord(retryBody.delivery, 'retried delivery');

  expect(retryBody.ok).toBe(false);
  expect(retried).toMatchObject({
    hookId,
    appId,
    kind: 'publish.completed',
    status: 'failed',
    attempt: 2,
    retryOfDeliveryId: deliveryId,
    error: expectedError,
  });
});
