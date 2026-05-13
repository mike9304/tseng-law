/**
 * HMAC-signed OAuth state for calendar-sync flows.
 *
 * Format: `<provider>:<staffId>:<expiresAtMs>:<hexHmac>`
 *
 * Why: the OAuth callback writes the resulting refresh token to the staff
 * record encoded in `state`. Without server-side signing, anyone with a
 * valid OAuth code could forge `state` to attach their token to an
 * arbitrary staff member. Signing + expiration closes that window.
 *
 * Used by:
 *   - the admin UI when building the provider authorize URL → buildOauthState
 *   - the /api/builder/bookings/calendar-sync/oauth-callback route → verifyOauthState
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import type { CalendarProvider } from './types';

const STATE_MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes

function getStateSecret(): string {
  // Prefer dedicated OAUTH_STATE_SECRET; fall back to CRON_SECRET for envs
  // that haven't been re-provisioned yet. Both are server-only secrets.
  return process.env.OAUTH_STATE_SECRET || process.env.CRON_SECRET || '';
}

function hmacHex(secret: string, payload: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

export function buildOauthState(provider: CalendarProvider, staffId: string): string {
  const secret = getStateSecret();
  if (!secret) throw new Error('OAUTH_STATE_SECRET (or CRON_SECRET) is not configured');
  const expiresAt = Date.now() + STATE_MAX_AGE_MS;
  const payload = `${provider}:${staffId}:${expiresAt}`;
  return `${payload}:${hmacHex(secret, payload)}`;
}

export function verifyOauthState(
  state: string,
): { provider: CalendarProvider; staffId: string } | null {
  const parts = state.split(':');
  if (parts.length !== 4) return null;
  const [providerRaw, staffId, expiresAtRaw, hmac] = parts;
  if (providerRaw !== 'google' && providerRaw !== 'outlook') return null;
  if (!staffId) return null;
  const expiresAt = Number.parseInt(expiresAtRaw, 10);
  if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) return null;
  const secret = getStateSecret();
  if (!secret) return null;
  const expected = hmacHex(secret, `${providerRaw}:${staffId}:${expiresAtRaw}`);
  let expectedBuf: Buffer;
  let providedBuf: Buffer;
  try {
    expectedBuf = Buffer.from(expected, 'hex');
    providedBuf = Buffer.from(hmac, 'hex');
  } catch {
    return null;
  }
  if (expectedBuf.length !== providedBuf.length) return null;
  if (!timingSafeEqual(expectedBuf, providedBuf)) return null;
  return { provider: providerRaw as CalendarProvider, staffId };
}
