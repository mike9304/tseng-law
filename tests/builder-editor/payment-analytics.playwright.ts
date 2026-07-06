import { createHmac } from 'node:crypto';
import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const LOCALE = 'ko';
const authHeader = `Basic ${Buffer.from(
  `${process.env.BUILDER_SMOKE_USERNAME ?? process.env.CMS_ADMIN_USERNAME ?? 'admin'}:${process.env.BUILDER_SMOKE_PASSWORD ?? process.env.CMS_ADMIN_PASSWORD ?? 'local-review-2026!'}`,
).toString('base64')}`;

function mutationHeaders(scope: string): Record<string, string> {
  const safeScope = scope.replace(/[^a-z0-9-]/gi, '-').slice(-48) || 'payment-analytics';
  return { Authorization: authHeader, 'x-forwarded-for': `pw-${safeScope}` };
}

function webhookSignature(secret: string, rawBody: string, nowSeconds = Math.floor(Date.now() / 1000)): string {
  return `t=${nowSeconds},v1=${createHmac('sha256', secret).update(`${nowSeconds}.${rawBody}`).digest('hex')}`;
}

test('/ko/admin-builder/commerce/payments shows payment analytics and stays mobile safe', async ({ page }) => {
  await page.setExtraHTTPHeaders({ Authorization: authHeader });
  await page.setViewportSize({ width: 390, height: 900 });
  const token = Date.now().toString(36);
  const webhookSecret = process.env.COMMERCE_SANDBOX_CARD_WEBHOOK_SECRET
    ?? process.env.COMMERCE_PAYMENT_WEBHOOK_SECRET
    ?? 'local-commerce-webhook-secret';
  const rawWebhook = JSON.stringify({
    id: `evt-payment-analytics-${token}`,
    type: 'payment_intent.succeeded',
    data: {
      object: {
        id: `pi-payment-analytics-${token}`,
        amount: 12345,
        currency: 'twd',
        balance_transaction: {
          id: `bt-payment-analytics-${token}`,
          fee: 360,
          net: 11985,
          fee_details: [{ amount: 360, type: 'stripe_fee' }],
        },
      },
    },
  });
  const webhookResponse = await page.request.post('/api/builder/commerce/payment-webhooks/sandbox-card', {
    headers: {
      ...mutationHeaders(`payment-analytics-webhook-${token}`),
      'content-type': 'application/json',
      'commerce-signature': webhookSignature(webhookSecret, rawWebhook),
    },
    data: rawWebhook,
  });
  expect(webhookResponse.status()).toBe(200);
  await expect(webhookResponse.json()).resolves.toMatchObject({
    ok: true,
    event: {
      providerEventId: `evt-payment-analytics-${token}`,
      status: 'unmatched',
      error: 'order_not_found',
    },
  });

  await page.goto(`/${LOCALE}/admin-builder/commerce/payments`, { waitUntil: 'domcontentloaded' });

  await expect(page.locator('[data-payment-analytics-page]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-summary]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-kpi="attempts"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-card="conversion"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-card="failed"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-card="refunds"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-source="orders"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-source="bookings"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-source-funnel]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-source-funnel-row="orders"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-webhook-reconciliation]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-webhook-event]').filter({ hasText: token })).toBeVisible();
  await expect(page.locator('[data-payment-analytics-webhook-fees]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-webhook-fee-provider="sandbox-card"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-alerts]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-alert="activity-snapshot"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-trend]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-providers]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-provider-fees]')).toBeVisible();
  const jsonDownload = page.waitForEvent('download');
  await page.locator('[data-payment-analytics-export="json"]').click();
  const jsonFile = await jsonDownload;
  expect(jsonFile.suggestedFilename()).toBe('payment-analytics-report.json');
  const jsonPath = await jsonFile.path();
  expect(jsonPath).not.toBeNull();
  const jsonText = await readFile(jsonPath!, 'utf8');
  expect(jsonText).toContain('"providerFeeBreakdown"');
  expect(jsonText).toContain('"sourceFunnel"');
  expect(jsonText).toContain('"webhookReconciliation"');
  expect(jsonText).toContain('"feeProviderBreakdown"');

  const csvDownload = page.waitForEvent('download');
  await page.locator('[data-payment-analytics-export="csv"]').click();
  const csvFile = await csvDownload;
  expect(csvFile.suggestedFilename()).toBe('payment-analytics-trend.csv');
  const csvPath = await csvFile.path();
  expect(csvPath).not.toBeNull();
  const csvText = await readFile(csvPath!, 'utf8');
  expect(csvText).toContain('day,paymentAttempts,successfulPayments,partialPayments,failedPayments,refundedPayments');
  await expect(page.getByRole('link', { name: /^(?:Orders|주문|訂單)$/ })).toHaveAttribute('href', `/${LOCALE}/admin-builder/commerce/orders`);
  await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).resolves.toBe(true);
});

test('/ko/admin-builder/commerce/orders links to payment analytics', async ({ page }) => {
  await page.setExtraHTTPHeaders({ Authorization: authHeader });
  await page.goto(`/${LOCALE}/admin-builder/commerce/orders`, { waitUntil: 'domcontentloaded' });

  await expect(page.getByRole('link', { name: 'Payments' })).toHaveAttribute('href', `/${LOCALE}/admin-builder/commerce/payments`);
});

test('/ko/admin-builder/commerce/documents exposes compact payment analytics strip', async ({ page }) => {
  await page.setExtraHTTPHeaders({ Authorization: authHeader });
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(`/${LOCALE}/admin-builder/commerce/documents`, { waitUntil: 'domcontentloaded' });

  await expect(page.locator('[data-payment-analytics]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-kpi="collected"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-kpi="balance-due"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-kpi="manual-pending"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-kpi="refunded"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-kpi="needs-review"]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-mix]')).toBeVisible();
  await expect(page.locator('[data-payment-analytics-segment]')).toHaveCount(3);
  await expect(page.locator('[data-payment-analytics-attention]')).toBeVisible();
  await expect(page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).resolves.toBe(true);
});
