import { describe, expect, it } from 'vitest';
import { signWebhookPayload, verifyWebhookSignature } from '@/lib/builder/webhooks/signature';

describe('webhook signature', () => {
  const secret = 'whsec_test_secret_value';
  const body = JSON.stringify({ event: 'form.submitted', payload: { x: 1 } });

  it('round-trips sign → verify', () => {
    const header = signWebhookPayload(secret, body);
    expect(verifyWebhookSignature(secret, body, header)).toBe(true);
  });

  it('rejects wrong secret', () => {
    const header = signWebhookPayload(secret, body);
    expect(verifyWebhookSignature('whsec_other', body, header)).toBe(false);
  });

  it('rejects tampered body', () => {
    const header = signWebhookPayload(secret, body);
    expect(verifyWebhookSignature(secret, `${body}.tampered`, header)).toBe(false);
  });

  it('rejects stale timestamps beyond tolerance', () => {
    const past = Math.floor(Date.now() / 1000) - 1000;
    const header = signWebhookPayload(secret, body, past);
    expect(verifyWebhookSignature(secret, body, header, 60)).toBe(false);
    expect(verifyWebhookSignature(secret, body, header, 2000)).toBe(true);
  });

  it('rejects malformed signature headers', () => {
    expect(verifyWebhookSignature(secret, body, 'not-a-signature')).toBe(false);
    expect(verifyWebhookSignature(secret, body, '')).toBe(false);
  });
});
