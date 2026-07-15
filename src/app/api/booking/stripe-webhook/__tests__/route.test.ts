import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { listBookings } from '@/lib/builder/bookings/storage';
import * as route from '../route';

vi.mock('@/lib/builder/bookings/storage', () => ({
  getBooking: vi.fn(async () => null),
  listBookings: vi.fn(async () => []),
  saveBooking: vi.fn(async () => undefined),
}));

vi.mock('@/lib/builder/billing-document-automation', () => ({
  runBookingBillingAutomation: vi.fn(async () => ({ actions: [] })),
}));

function request(body: string, signature = ''): NextRequest {
  return new NextRequest('https://law.example.test/api/booking/stripe-webhook', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'stripe-signature': signature,
    },
    body,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('booking Stripe webhook route configuration', () => {
  it('fails closed in production when the secret is missing even if the legacy override is enabled', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('STRIPE_WEBHOOK_SECRET', '');
    vi.stubEnv('BOOKING_STRIPE_WEBHOOK_ALLOW_UNSIGNED', '1');

    const raw = '{not-json-and-must-not-be-parsed';
    const response = await route.POST(request(raw));

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ error: 'Webhook not configured' });
    expect(listBookings).not.toHaveBeenCalled();
  });

  it('rejects invalid signatures without invoking booking storage', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('STRIPE_WEBHOOK_SECRET', 'booking-test-secret');
    const raw = JSON.stringify({
      id: 'evt_invalid_signature',
      type: 'payment_intent.succeeded',
      data: { object: { id: 'pi_invalid_signature', amount: 8800 } },
    });

    const response = await route.POST(request(raw, 't=1,v1=bad'));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'Invalid signature' });
    expect(listBookings).not.toHaveBeenCalled();
  });

  it('keeps unsigned webhook acceptance limited to non-production development', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.stubEnv('STRIPE_WEBHOOK_SECRET', '');
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const response = await route.POST(request(JSON.stringify({
      id: 'evt_unsigned_dev',
      type: 'unhandled.development_event',
    })));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      handled: false,
      type: 'unhandled.development_event',
    });
    expect(warn).toHaveBeenCalledWith(
      '[booking/stripe-webhook] STRIPE_WEBHOOK_SECRET unset — accepting unsigned events in dev only',
    );
  });
});
