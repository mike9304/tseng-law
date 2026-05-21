import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { signWebhookPayload } from '@/lib/builder/webhooks/signature';
import { listPaymentWebhookEvents } from '@/lib/builder/commerce/payment-webhooks-engine';
import * as route from '../route';

let tmpRoot = '';
let previousRoot: string | undefined;
let previousBackend: string | undefined;
let previousSecret: string | undefined;

function request(rawBody: string, signature: string): NextRequest {
  return new NextRequest('https://law.example.test/api/builder/commerce/payment-webhooks/sandbox-card', {
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
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'commerce-payment-webhook-route-'));
  process.env.BUILDER_COMMERCE_ROOT = tmpRoot;
  process.env.BUILDER_COMMERCE_BACKEND = 'local';
  process.env.COMMERCE_SANDBOX_CARD_WEBHOOK_SECRET = 'test-commerce-secret';
});

afterEach(async () => {
  process.env.BUILDER_COMMERCE_ROOT = previousRoot;
  process.env.BUILDER_COMMERCE_BACKEND = previousBackend;
  process.env.COMMERCE_SANDBOX_CARD_WEBHOOK_SECRET = previousSecret;
  if (tmpRoot) await fs.rm(tmpRoot, { recursive: true, force: true });
});

describe('commerce payment webhook route', () => {
  it('accepts valid signatures and stores masked unmatched events', async () => {
    const raw = JSON.stringify({
      id: 'evt_route_valid',
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_route_missing',
          amount: 1234,
          currency: 'twd',
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
      },
    });

    const events = await listPaymentWebhookEvents();
    expect(events).toHaveLength(1);
    expect(JSON.stringify(events[0].payload)).toContain('[masked]');
  });

  it('rejects invalid and stale signatures without storing events', async () => {
    const raw = JSON.stringify({
      id: 'evt_route_invalid',
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_invalid', amount: 1234, currency: 'twd' } },
    });
    const invalid = await route.POST(request(raw, 't=1,v1=bad'), {
      params: { provider: 'sandbox-card' },
    });
    expect(invalid.status).toBe(400);

    const stale = await route.POST(
      request(raw, signWebhookPayload('test-commerce-secret', raw, Math.floor(Date.now() / 1000) - 1000)),
      { params: { provider: 'sandbox-card' } },
    );
    expect(stale.status).toBe(400);
    expect(await listPaymentWebhookEvents()).toHaveLength(0);
  });
});
