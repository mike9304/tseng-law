/**
 * Verify a Stripe PaymentIntent by id. Returns the resolved status when
 * the key is configured; returns null when not configured so callers can
 * decide whether to trust the client (dev) or refuse (prod).
 */
export interface PaymentIntentStatus {
  id: string;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action'
    | 'processing' | 'requires_capture' | 'canceled' | 'succeeded' | string;
  amount?: number;
  currency?: string;
  metadata?: Record<string, string>;
}

export async function fetchPaymentIntentStatus(intentId: string): Promise<PaymentIntentStatus | null> {
  const key = process.env.STRIPE_SECRET_KEY ?? '';
  if (!key) return null;
  if (!intentId || !/^pi_[A-Za-z0-9_]+$/.test(intentId)) return null;
  try {
    const res = await fetch(`https://api.stripe.com/v1/payment_intents/${encodeURIComponent(intentId)}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${key}` },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as PaymentIntentStatus;
    return data;
  } catch {
    return null;
  }
}

/** Returns true when the intent is settled enough to honor the booking. */
export function isPaymentIntentBookable(status: PaymentIntentStatus | null): boolean {
  if (!status) return false;
  return status.status === 'succeeded' || status.status === 'processing' || status.status === 'requires_capture';
}

export function paymentIntentPriceMismatch(
  status: PaymentIntentStatus,
  expected: { amount: number; currency: string },
): string | null {
  if (typeof status.amount !== 'number') return 'PaymentIntent amount could not be verified.';
  if (status.amount !== expected.amount) return 'PaymentIntent amount does not match this service.';
  if (!status.currency) return 'PaymentIntent currency could not be verified.';
  if (status.currency.toLowerCase() !== expected.currency.toLowerCase()) {
    return 'PaymentIntent currency does not match this service.';
  }
  return null;
}
