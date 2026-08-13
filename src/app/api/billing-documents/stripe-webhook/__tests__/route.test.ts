import { promises as fs } from 'fs';
import os from 'os';
import path from 'path';
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { signWebhookPayload } from '@/lib/builder/webhooks/signature';
import {
  listBillingDocumentWebhookEvents,
  receiveBillingDocumentWebhookEvent,
} from '@/lib/builder/billing-document-webhooks';
import * as route from '../route';
import * as adminListRoute from '@/app/api/builder/billing-documents/webhooks/route';
import * as adminReplayRoute from '@/app/api/builder/billing-documents/webhooks/events/[eventId]/replay/route';

vi.mock('@/lib/builder/billing-documents', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/billing-documents')>();
  return {
    ...actual,
    settleBillingDocumentHostedPayment: vi.fn(async () => ({
      row: {
        source: 'order',
        ownerId: 'order-route',
        documentId: 'doc-route',
        number: 'INV-ROUTE',
        paymentStatus: 'paid',
        paymentLinkStatus: 'unavailable',
      },
      order: {
        orderId: 'order-route',
        payment: { status: 'paid', referenceId: 'pi_route_billing' },
      },
      booking: null,
      changed: true,
    })),
  };
});

vi.mock('@/lib/builder/billing-document-automation', () => ({
  runOrderBillingAutomation: vi.fn(async () => ({ actions: [{ type: 'receipt', emailed: false }] })),
  runBookingBillingAutomation: vi.fn(async () => ({ actions: [] })),
}));

vi.mock('@/lib/builder/commerce/notifications-engine', () => ({
  queueBillingPaymentReceivedNotification: vi.fn(async () => null),
}));

vi.mock('@/lib/builder/billing-document-webhooks', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/builder/billing-document-webhooks')>();
  return {
    ...actual,
    receiveBillingDocumentWebhookEvent: vi.fn(actual.receiveBillingDocumentWebhookEvent),
  };
});

let tmpRoot = '';
let previousRoot: string | undefined;
let previousBackend: string | undefined;
let previousSecret: string | undefined;
let previousAdminUser: string | undefined;
let previousAdminPassword: string | undefined;

function request(rawBody: string, signature: string): NextRequest {
  return new NextRequest('https://law.example.test/api/billing-documents/stripe-webhook', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'stripe-signature': signature,
    },
    body: rawBody,
  });
}

function adminHeaders(): HeadersInit {
  return {
    authorization: `Basic ${Buffer.from('admin:test-password').toString('base64')}`,
    origin: 'https://tseng-law.com',
  };
}

beforeEach(async () => {
  vi.clearAllMocks();
  previousRoot = process.env.BUILDER_COMMERCE_ROOT;
  previousBackend = process.env.BUILDER_COMMERCE_BACKEND;
  previousSecret = process.env.BILLING_DOCUMENT_STRIPE_WEBHOOK_SECRET;
  previousAdminUser = process.env.CMS_ADMIN_USERNAME;
  previousAdminPassword = process.env.CMS_ADMIN_PASSWORD;
  tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'billing-document-stripe-route-'));
  process.env.BUILDER_COMMERCE_ROOT = tmpRoot;
  process.env.BUILDER_COMMERCE_BACKEND = 'local';
  process.env.BILLING_DOCUMENT_STRIPE_WEBHOOK_SECRET = 'test-billing-stripe-secret';
  process.env.CMS_ADMIN_USERNAME = 'admin';
  process.env.CMS_ADMIN_PASSWORD = 'test-password';
});

afterEach(async () => {
  vi.unstubAllEnvs();
  process.env.BUILDER_COMMERCE_ROOT = previousRoot;
  process.env.BUILDER_COMMERCE_BACKEND = previousBackend;
  process.env.BILLING_DOCUMENT_STRIPE_WEBHOOK_SECRET = previousSecret;
  process.env.CMS_ADMIN_USERNAME = previousAdminUser;
  process.env.CMS_ADMIN_PASSWORD = previousAdminPassword;
  vi.restoreAllMocks();
  if (tmpRoot) await fs.rm(tmpRoot, { recursive: true, force: true });
});

describe('billing document Stripe webhook route', () => {
  it('stores signed events, returns a sanitized response, and deduplicates retries', async () => {
    const raw = JSON.stringify({
      id: 'evt_billing_route_paid',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_billing_route',
          payment_status: 'paid',
          amount_total: 8800,
          currency: 'twd',
          payment_intent: 'pi_route_billing',
          metadata: {
            billing_source: 'order',
            billing_owner_id: 'order-route',
            billing_document_id: 'doc-route',
            billing_payment_link_id: 'pay-route',
            billing_document_number: 'INV-ROUTE',
          },
        },
      },
    });

    const first = await route.POST(request(raw, signWebhookPayload('test-billing-stripe-secret', raw)));
    expect(first.status).toBe(200);
    await expect(first.json()).resolves.toMatchObject({
      ok: true,
      handled: true,
      changed: true,
      duplicate: false,
      event: {
        providerEventId: 'evt_billing_route_paid',
        status: 'processed',
      },
      document: {
        source: 'order',
        ownerId: 'order-route',
        documentId: 'doc-route',
        paymentStatus: 'paid',
      },
    });

    const duplicate = await route.POST(request(raw, signWebhookPayload('test-billing-stripe-secret', raw)));
    expect(duplicate.status).toBe(200);
    await expect(duplicate.json()).resolves.toMatchObject({
      ok: true,
      handled: true,
      changed: false,
      duplicate: true,
      reason: 'duplicate_event',
    });

    const events = await listBillingDocumentWebhookEvents();
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      providerEventId: 'evt_billing_route_paid',
      status: 'processed',
      changed: true,
      replayCount: 0,
      signatureVerified: true,
    });

    const listDenied = await adminListRoute.GET(new NextRequest('https://law.example.test/api/builder/billing-documents/webhooks'));
    expect(listDenied.status).toBe(401);

    const list = await adminListRoute.GET(new NextRequest('https://law.example.test/api/builder/billing-documents/webhooks', {
      headers: adminHeaders(),
    }));
    expect(list.status).toBe(200);
    const listPayload = await list.json() as {
      events: Array<{ eventId: string; providerEventId: string; status: string; replayCount: number }>;
      kpis: { total: number; processed: number; replayed: number };
    };
    expect(listPayload.kpis).toMatchObject({ total: 1, processed: 1, replayed: 0 });
    expect(listPayload.events[0]).toMatchObject({
      providerEventId: 'evt_billing_route_paid',
      status: 'processed',
      replayCount: 0,
    });

    const replayDenied = await adminReplayRoute.POST(new NextRequest(
      `https://law.example.test/api/builder/billing-documents/webhooks/events/${events[0].eventId}/replay`,
      { method: 'POST' },
    ), { params: Promise.resolve({ eventId: events[0].eventId }) });
    expect(replayDenied.status).toBe(401);

    const replay = await adminReplayRoute.POST(new NextRequest(
      `https://law.example.test/api/builder/billing-documents/webhooks/events/${events[0].eventId}/replay`,
      { method: 'POST', headers: adminHeaders() },
    ), { params: Promise.resolve({ eventId: events[0].eventId }) });
    expect(replay.status).toBe(200);
    await expect(replay.json()).resolves.toMatchObject({
      ok: true,
      changed: true,
      event: {
        eventId: events[0].eventId,
        replayCount: 1,
        status: 'processed',
      },
    });

    const missingReplay = await adminReplayRoute.POST(new NextRequest(
      'https://law.example.test/api/builder/billing-documents/webhooks/events/missing/replay',
      { method: 'POST', headers: adminHeaders() },
    ), { params: Promise.resolve({ eventId: 'missing' }) });
    expect(missingReplay.status).toBe(404);
  });

  it('rejects invalid signatures without storing events', async () => {
    const raw = JSON.stringify({
      id: 'evt_billing_route_invalid',
      type: 'checkout.session.completed',
      data: {
        object: {
          payment_status: 'paid',
          amount_total: 8800,
          currency: 'twd',
          metadata: {
            billing_source: 'order',
            billing_owner_id: 'order-route',
            billing_document_id: 'doc-route',
            billing_payment_link_id: 'pay-route',
          },
        },
      },
    });

    const response = await route.POST(request(raw, 't=1,v1=bad'));
    expect(response.status).toBe(400);
    expect(await listBillingDocumentWebhookEvents()).toHaveLength(0);
  });

  it('fails closed in production without a secret even when legacy unsigned overrides are enabled', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('BILLING_DOCUMENT_STRIPE_WEBHOOK_SECRET', '');
    vi.stubEnv('STRIPE_WEBHOOK_SECRET', '');
    vi.stubEnv('BILLING_DOCUMENT_STRIPE_WEBHOOK_ALLOW_UNSIGNED', '1');
    vi.stubEnv('BOOKING_STRIPE_WEBHOOK_ALLOW_UNSIGNED', '1');

    const raw = '{not-json-and-must-not-be-parsed';
    const response = await route.POST(request(raw, ''));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({
      ok: false,
      error: 'stripe_webhook_not_configured',
    });
    expect(receiveBillingDocumentWebhookEvent).not.toHaveBeenCalled();
    expect(await listBillingDocumentWebhookEvents()).toHaveLength(0);
  });

  it('keeps unsigned webhook acceptance limited to non-production development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('BILLING_DOCUMENT_STRIPE_WEBHOOK_SECRET', '');
    vi.stubEnv('STRIPE_WEBHOOK_SECRET', '');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const raw = JSON.stringify({
      id: 'evt_billing_unsigned_dev',
      type: 'unhandled.development_event',
    });

    const response = await route.POST(request(raw, ''));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      handled: false,
      reason: 'unsupported_event',
    });
    expect(warn).toHaveBeenCalledWith(
      '[billing-documents/stripe-webhook] webhook secret unset; accepting unsigned dev events',
    );
    expect(receiveBillingDocumentWebhookEvent).not.toHaveBeenCalled();
  });
});
