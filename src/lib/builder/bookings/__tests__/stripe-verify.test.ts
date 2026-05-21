import { describe, expect, it } from 'vitest';
import { paymentIntentPriceMismatch, type PaymentIntentStatus } from '@/lib/builder/bookings/stripe-verify';

function intent(overrides: Partial<PaymentIntentStatus> = {}): PaymentIntentStatus {
  return {
    id: 'pi_test',
    status: 'succeeded',
    amount: 1500,
    currency: 'twd',
    metadata: { serviceId: 'svc_test' },
    ...overrides,
  };
}

describe('booking payment intent verification', () => {
  it('accepts matching amount and currency', () => {
    expect(paymentIntentPriceMismatch(intent(), { amount: 1500, currency: 'TWD' })).toBeNull();
  });

  it('rejects mismatched amounts', () => {
    expect(paymentIntentPriceMismatch(intent({ amount: 5000 }), { amount: 1500, currency: 'TWD' }))
      .toBe('PaymentIntent amount does not match this service.');
  });

  it('rejects mismatched currencies', () => {
    expect(paymentIntentPriceMismatch(intent({ currency: 'usd' }), { amount: 1500, currency: 'TWD' }))
      .toBe('PaymentIntent currency does not match this service.');
  });
});
