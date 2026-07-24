import type { RateLimitResult } from '@/lib/builder/security/rate-limit';

export type PublicRateLimitDecision =
  | {
      kind: 'backend_unavailable';
      status: 503;
      errorCode: 'rate_limit_unavailable';
      headers?: undefined;
    }
  | {
      kind: 'throttled';
      status: 429;
      errorCode: 'too_many_requests';
      headers: { 'Retry-After': string };
    };

/**
 * Map checkRateLimit() denials for public routes.
 * backend_unavailable must not look like client abuse (429 + Retry-After: 0).
 */
export function mapPublicRateLimitDenial(rate: RateLimitResult): PublicRateLimitDecision {
  if (rate.reason === 'backend_unavailable') {
    return {
      kind: 'backend_unavailable',
      status: 503,
      errorCode: 'rate_limit_unavailable',
    };
  }

  const retryAfterSec = Math.max(1, Math.ceil((rate.retryAfterMs || 0) / 1000));
  return {
    kind: 'throttled',
    status: 429,
    errorCode: 'too_many_requests',
    headers: { 'Retry-After': String(retryAfterSec) },
  };
}
