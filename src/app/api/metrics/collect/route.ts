import { NextRequest, NextResponse } from 'next/server';

import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { enrichEvents } from '@/lib/metrics/enrich-events';
import { collectRequestSchema } from '@/lib/metrics/visit-schema';
import { saveVisitEventBatch } from '@/lib/metrics/visit-store';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 32 * 1024;
const BOT_UA = /bot|crawl|spider|slurp|headless|lighthouse|pingdom|monitor|preview|scan|curl|wget|python-requests/i;
const NO_STORE = { 'Cache-Control': 'no-store' };

function response(status = 204, body?: unknown): NextResponse {
  return body === undefined
    ? new NextResponse(null, { status, headers: NO_STORE })
    : NextResponse.json(body, { status, headers: NO_STORE });
}

function clientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip') || 'unknown';
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (BOT_UA.test(request.headers.get('user-agent') ?? '')) return response();

  const declaredSize = Number(request.headers.get('content-length'));
  if (Number.isFinite(declaredSize) && declaredSize > MAX_BODY_BYTES) return response(413, { error: 'payload_too_large' });
  const body = await request.text();
  if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES) return response(413, { error: 'payload_too_large' });

  const rate = await checkRateLimit(`visit-collect:${clientIp(request)}`, 120, 60_000);
  if (!rate.allowed) return response(429, { error: 'rate_limited' });

  let raw: unknown;
  try {
    raw = JSON.parse(body);
  } catch {
    return response(400, { error: 'invalid_payload' });
  }
  const parsed = collectRequestSchema.safeParse(raw);
  if (!parsed.success) return response(400, { error: 'invalid_payload' });

  const events = enrichEvents(parsed.data.events, {
    country: request.headers.get('x-vercel-ip-country') ?? undefined,
    now: new Date(),
  });
  try {
    await saveVisitEventBatch(events);
  } catch (error) {
    console.error('[visit-metrics] Failed to save visit batch', error);
  }
  return response();
}

export function GET(): NextResponse {
  return methodNotAllowed();
}

function methodNotAllowed(): NextResponse {
  return NextResponse.json({ error: 'method_not_allowed' }, {
    status: 405,
    headers: { ...NO_STORE, Allow: 'POST' },
  });
}

export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
export const HEAD = methodNotAllowed;
export const OPTIONS = methodNotAllowed;
