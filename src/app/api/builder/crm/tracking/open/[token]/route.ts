/**
 * Tracking pixel endpoint. PUBLIC — the HMAC token is the only auth.
 *
 * Always returns the 1x1 pixel so mail clients render correctly even when
 * the token is bad/expired; we just skip logging in that case. Caching is
 * disabled so that repeat opens get counted.
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  TRACKING_PIXEL_GIF,
  logOpenEvent,
  resolveTrackingSecret,
  verifyTrackingToken,
} from '@/lib/builder/crm/tracking-model';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function pixelResponse(): NextResponse {
  return new NextResponse(new Uint8Array(TRACKING_PIXEL_GIF), {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Content-Length': String(TRACKING_PIXEL_GIF.length),
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });
}

export async function GET(request: NextRequest, props: { params: Promise<{ token: string }> }) {
  const params = await props.params;
  const secret = resolveTrackingSecret();
  if (!secret) {
    // Misconfigured deploy. Still serve the pixel so emails don't break.
    return pixelResponse();
  }
  const payload = verifyTrackingToken(params.token, secret, {
    expectedKind: 'open',
  });
  if (!payload) {
    return pixelResponse();
  }

  try {
    await logOpenEvent({
      contactId: payload.contactId,
      campaignId: payload.campaignId,
      userAgent: request.headers.get('user-agent') ?? undefined,
      ip:
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        undefined,
    });
  } catch (err) {
    console.error('[crm/tracking/open] failed to log:', err);
  }
  return pixelResponse();
}