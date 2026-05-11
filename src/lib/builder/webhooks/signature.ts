import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * PR #13 — HMAC-SHA256 signing helper for outbound webhook payloads.
 *
 * The signature header included on every delivery is:
 *   `t=<unix-seconds>,v1=<hex(hmac_sha256(secret, `${t}.${rawBody}`))>`
 *
 * Receivers verify by recomputing the HMAC over `${t}.${rawBody}` and
 * comparing in constant time. This mirrors Stripe's webhook scheme.
 */
export function signWebhookPayload(secret: string, rawBody: string, nowSeconds = Math.floor(Date.now() / 1000)): string {
  const sig = createHmac('sha256', secret).update(`${nowSeconds}.${rawBody}`).digest('hex');
  return `t=${nowSeconds},v1=${sig}`;
}

export function verifyWebhookSignature(
  secret: string,
  rawBody: string,
  header: string,
  toleranceSeconds = 300,
): boolean {
  const parts = header.split(',');
  let timestamp = 0;
  const sigs: string[] = [];
  for (const part of parts) {
    const [key, value] = part.split('=');
    if (key === 't') timestamp = Number(value);
    else if (key === 'v1') sigs.push(value);
  }
  if (!timestamp || sigs.length === 0) return false;
  const ageSec = Math.abs(Date.now() / 1000 - timestamp);
  if (ageSec > toleranceSeconds) return false;
  const expected = createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
  const expectedBuf = Buffer.from(expected, 'hex');
  for (const sig of sigs) {
    try {
      const sigBuf = Buffer.from(sig, 'hex');
      if (sigBuf.length === expectedBuf.length && timingSafeEqual(sigBuf, expectedBuf)) {
        return true;
      }
    } catch {
      /* malformed */
    }
  }
  return false;
}
