import { describe, expect, it } from 'vitest';
import {
  captureCommercePaymentIntent,
  createCommercePaymentIntent,
  normalizeCommercePaymentIntent,
  paymentIntentToOrderPayment,
  paymentIntentToOrderStatus,
} from '../payment-providers';

describe('commerce payment providers', () => {
  it('creates manual and sandbox test-mode intents with order status mapping', () => {
    const manual = createCommercePaymentIntent({
      provider: 'manual-invoice',
      locale: 'ko',
      currency: 'TWD',
      amountCents: 12000,
      now: '2026-05-20T00:00:00.000Z',
    });
    expect(manual).toMatchObject({
      provider: 'manual-invoice',
      status: 'requires_manual_payment',
      amountCents: 12000,
      stub: true,
    });
    expect(paymentIntentToOrderStatus(manual)).toBe('requires_manual_payment');

    const authorized = createCommercePaymentIntent({
      provider: 'sandbox-card',
      locale: 'ko',
      currency: 'TWD',
      amountCents: 12000,
      now: '2026-05-20T00:00:00.000Z',
    });
    expect(authorized.status).toBe('authorized');
    expect(authorized.clientSecret).toContain('_secret');
    expect(paymentIntentToOrderPayment(authorized, 'ko')).toMatchObject({
      adapter: 'sandbox-card',
      status: 'authorized_stub',
      referenceId: authorized.intentId,
    });
  });

  it('captures or fails sandbox intents', () => {
    const intent = createCommercePaymentIntent({
      provider: 'sandbox-card',
      locale: 'en',
      currency: 'USD',
      amountCents: 4200,
      now: '2026-05-20T00:00:00.000Z',
    });
    expect(captureCommercePaymentIntent(intent, { now: '2026-05-20T00:01:00.000Z' })).toMatchObject({
      status: 'captured',
      updatedAt: '2026-05-20T00:01:00.000Z',
    });
    expect(captureCommercePaymentIntent(intent, { simulateFailure: true })).toMatchObject({
      status: 'failed',
      failureCode: 'sandbox_capture_failed',
    });
  });

  it('normalizes stored provider intent payloads', () => {
    const intent = createCommercePaymentIntent({
      provider: 'sandbox-card',
      locale: 'zh-hant',
      currency: 'TWD',
      amountCents: 5000,
    });
    expect(normalizeCommercePaymentIntent(intent)).toMatchObject({
      intentId: intent.intentId,
      provider: 'sandbox-card',
      amountCents: 5000,
    });
    expect(normalizeCommercePaymentIntent({ ...intent, currency: 'BAD' })).toBeNull();
  });
});
