/**
 * Tracking click endpoint. PUBLIC — the HMAC token is the only auth and
 * the redirect URL is part of the signed payload (no open-redirect oracle).
 *
 * On invalid token: 404. On valid token but unsafe URL: 400.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  isSafeRedirectUrl,
  logClickEvent,
  resolveTrackingSecret,
  verifyTrackingToken,
} from '@/lib/builder/crm/tracking-model';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } },
) {
  const secret = resolveTrackingSecret();
  if (!secret) {
    return NextResponse.json({ error: 'Tracking not configured' }, { status: 503 });
  }
  const payload = verifyTrackingToken(params.token, secret, {
    expectedKind: 'click',
  });
  if (!payload || !isSafeRedirectUrl(payload.url)) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
  }

  try {
    await logClickEvent({
      contactId: payload.contactId,
      campaignId: payload.campaignId,
      url: payload.url,
      userAgent: request.headers.get('user-agent') ?? undefined,
      ip:
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        undefined,
    });
  } catch (err) {
    console.error('[crm/tracking/click] failed to log:', err);
  }

  return NextResponse.redirect(payload.url, { status: 302 });
}