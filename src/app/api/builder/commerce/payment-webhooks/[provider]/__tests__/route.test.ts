import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { signWebhookPayload } from '@/lib/builder/webhooks/signature';
import { listPaymentWebhookEvents } from '@/lib/builder/commerce/payment-webhooks-engine';
import * as route from '../route';

let tmpRoot = '';
let previousRoot: string | undefined;
let previousBackend: string | undefined;
let previousSecret: string | undefined;
let previousSharedSecret: string | undefined;

function request(
  rawBody: string,
  signature: string,
  options: { provider?: string; query?: string } = {},
): NextRequest {
  const provider = options.provider ?? 'sandbox-card';
  return new NextRequest(`https://law.example.test/api/builder/commerce/payment-webhooks/${provider}${options.query ? `?${options.query}` : ''}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'commerce-signature': signature,
    },
    body: rawBody,
  });
}

beforeEach(async () => {
  previousRoot = process.env.BUILDER_COMMERCE_ROOT;
  previousBackend = process.env.BUILDER_COMMERCE_BACKEND;
  previousSecret = process.env.COMMERCE_SANDBOX_CARD_WEBHOOK_SECRET;
  previousSharedSecret = process.env.COMMERCE_PAYMENT_WEBHOOK_SECRET;
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'commerce-payment-webhook-route-'));
  process.env.BUILDER_COMMERCE_ROOT = tmpRoot;
  process.env.BUILDER_COMMERCE_BACKEND = 'local';
  process.env.COMMERCE_SANDBOX_CARD_WEBHOOK_SECRET = 'test-commerce-secret';
  process.env.COMMERCE_PAYMENT_WEBHOOK_SECRET = '';
});

afterEach(async () => {
  process.env.BUILDER_COMMERCE_ROOT = previousRoot;
  process.env.BUILDER_COMMERCE_BACKEND = previousBackend;
  process.env.COMMERCE_SANDBOX_CARD_WEBHOOK_SECRET = previousSecret;
  process.env.COMMERCE_PAYMENT_WEBHOOK_SECRET = previousSharedSecret;
  vi.unstubAllEnvs();
  if (tmpRoot) await fs.rm(tmpRoot, { recursive: true, force: true });
});

describe('commerce payment webhook route', () => {
  it('returns localized provider and configuration errors without reading webhook payloads', async () => {
    const unknownProvider = await route.POST(request('', '', {
      provider: 'missing-provider',
      query: 'locale=zh-hant',
    }), {
      params: { provider: 'missing-provider' },
    });
    await expect(unknownProvider.json()).resolves.toEqual({
      ok: false,
      error: '不支援的付款服務提供者。',
      errorCode: 'payment_provider_not_found',
    });

    vi.stubEnv('NODE_ENV', 'production');
    process.env.COMMERCE_SANDBOX_CARD_WEBHOOK_SECRET = '';
    process.env.COMMERCE_PAYMENT_WEBHOOK_SECRET = '';

    const unconfigured = await route.POST(request('{}', '', { query: 'locale=en' }), {
      params: { provider: 'sandbox-card' },
    });

    expect(unknownProvider.status).toBe(404);
    expect(unconfigured.status).toBe(503);
    await expect(unconfigured.json()).resolves.toEqual({
      ok: false,
      error: 'Payment webhook is not configured.',
      errorCode: 'payment_webhook_not_configured',
    });
    await expect(listPaymentWebhookEvents()).resolves.toHaveLength(0);
  });

  it('rejects production sandbox webhooks even when a secret is configured', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    process.env.COMMERCE_SANDBOX_CARD_WEBHOOK_SECRET = 'configured-production-secret';
    const raw = JSON.stringify({
      id: 'evt_production_sandbox',
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_production_sandbox', amount: 1234, currency: 'twd' } },
    });

    const response = await route.POST(request(
      raw,
      signWebhookPayload('configured-production-secret', raw),
      { query: 'locale=ko' },
    ), { params: { provider: 'sandbox-card' } });

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: '결제 웹훅이 설정되지 않았습니다.',
      errorCode: 'payment_webhook_not_configured',
    });
    await expect(listPaymentWebhookEvents()).resolves.toHaveLength(0);
  });

  it('accepts valid signatures and stores masked unmatched events', async () => {
    const raw = JSON.stringify({
      id: 'evt_route_valid',
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_route_missing',
          amount: 1234,
          currency: 'twd',
          balance_transaction: {
            id: 'bt_route_valid',
            fee: 44,
            net: 1190,
            fee_details: [{ amount: 44, type: 'stripe_fee' }],
          },
          card: { last4: '4242' },
        },
      },
    });
    const response = await route.POST(request(raw, signWebhookPayload('test-commerce-secret', raw)), {
      params: { provider: 'sandbox-card' },
    });
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      event: {
        providerEventId: 'evt_route_valid',
        status: 'unmatched',
        paymentReferenceId: 'pi_route_missing',
        signatureVerified: true,
      },
    });

    const events = await listPaymentWebhookEvents();
    expect(events).toHaveLength(1);
    expect(events[0].signatureVerified).toBe(true);
    expect(events[0]).toMatchObject({
      feeCents: 44,
      netAmountCents: 1190,
      balanceTransactionId: 'bt_route_valid',
    });
    expect(JSON.stringify(events[0].payload)).toContain('[masked]');
  });

  it('rejects invalid and stale signatures without storing events', async () => {
    const raw = JSON.stringify({
      id: 'evt_route_invalid',
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_invalid', amount: 1234, currency: 'twd' } },
    });
    const invalid = await route.POST(request(raw, 't=1,v1=bad', { query: 'locale=en' }), {
      params: { provider: 'sandbox-card' },
    });
    expect(invalid.status).toBe(400);
    await expect(invalid.json()).resolves.toEqual({
      ok: false,
      error: 'Unable to verify the payment webhook signature.',
      errorCode: 'invalid_signature',
    });

    const stale = await route.POST(
      request(
        raw,
        signWebhookPayload('test-commerce-secret', raw, Math.floor(Date.now() / 1000) - 1000),
        { query: 'locale=zh-hant' },
      ),
      { params: { provider: 'sandbox-card' } },
    );
    expect(stale.status).toBe(400);
    await expect(stale.json()).resolves.toEqual({
      ok: false,
      error: '無法驗證付款 Webhook 簽章。',
      errorCode: 'invalid_signature',
    });
    expect(await listPaymentWebhookEvents()).toHaveLength(0);
  });

  it('returns localized invalid JSON and unsupported event errors without storing events', async () => {
    const invalidJson = '{';
    const invalidJsonResponse = await route.POST(request(
      invalidJson,
      signWebhookPayload('test-commerce-secret', invalidJson),
      { query: 'locale=zh-hant' },
    ), {
      params: { provider: 'sandbox-card' },
    });

    expect(invalidJsonResponse.status).toBe(400);
    await expect(invalidJsonResponse.json()).resolves.toEqual({
      ok: false,
      error: '請確認付款 Webhook 請求格式。',
      errorCode: 'invalid_json',
    });

    const unsupported = JSON.stringify({
      id: 'evt_route_unsupported',
      type: 'customer.created',
      data: { object: { id: 'cus_1' } },
    });
    const unsupportedResponse = await route.POST(request(
      unsupported,
      signWebhookPayload('test-commerce-secret', unsupported),
      { query: 'locale=en' },
    ), {
      params: { provider: 'sandbox-card' },
    });

    expect(unsupportedResponse.status).toBe(400);
    await expect(unsupportedResponse.json()).resolves.toEqual({
      ok: false,
      error: 'Unsupported payment webhook event.',
      errorCode: 'unsupported_payment_event',
    });
    expect(await listPaymentWebhookEvents()).toHaveLength(0);
  });
});
