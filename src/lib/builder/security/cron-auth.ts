import type { NextRequest } from 'next/server';
import { safeEqualStrings } from './timing-safe';

/**
 * Constant-time CRON_SECRET check. Returns true when:
 *   • CRON_SECRET is set AND the request header matches (timing-safe), OR
 *   • CRON_SECRET is unset AND we're NOT in production (dev convenience).
 *
 * Header sources accepted: `x-cron-secret` or `authorization: Bearer <secret>`.
 */
export function isCronAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET ?? '';
  if (!secret) {
    return process.env.NODE_ENV !== 'production';
  }
  const provided =
    request.headers.get('x-cron-secret') ||
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ||
    '';
  return safeEqualStrings(provided, secret);
}
