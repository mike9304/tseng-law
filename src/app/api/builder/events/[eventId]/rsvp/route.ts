import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  getBuilderEventsApiErrorPayload,
  type BuilderEventsApiErrorCode,
} from '@/lib/builder/events/events-api-copy';
import { registerAttendee, validateAttendee } from '@/lib/builder/events/events-engine';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const rsvpSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().max(80).optional(),
  ticketQuantity: z.coerce.number().int().min(1).max(20).default(1),
});

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function requestLocale(request: NextRequest, input?: unknown): Locale {
  if (typeof input === 'string') return normalizeLocale(input);
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

function errorResponse(
  locale: Locale,
  errorCode: BuilderEventsApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
  init?: { headers?: Record<string, string> },
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getBuilderEventsApiErrorPayload(locale, errorCode),
      ...(extra ?? {}),
    },
    { status, ...(init ?? {}) },
  );
}

function validationErrorResponse(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

function classifyRsvpError(error: unknown): { code: BuilderEventsApiErrorCode; status: number } {
  const message = error instanceof Error ? error.message : '';
  if (message.includes('찾을 수')) return { code: 'event_not_found', status: 404 };
  if (message.includes('공개된 이벤트')) return { code: 'event_rsvp_unavailable', status: 400 };
  if (message.includes('신청을 받지')) return { code: 'event_rsvp_closed', status: 400 };
  if (message.includes('등록이 마감')) return { code: 'event_rsvp_full', status: 400 };
  return { code: 'event_rsvp_failed', status: 400 };
}

export async function POST(request: NextRequest, { params }: { params: { eventId: string } }) {
  // builder-route-guard: allow-public — intentional public visitor endpoint
  const rate = await checkRateLimit(`events-rsvp:${clientIp(request)}`, 10, 60_000);
  if (!rate.allowed) {
    return errorResponse(
      requestLocale(request),
      'too_many_requests',
      429,
      undefined,
      { headers: { 'Retry-After': String(Math.ceil(rate.retryAfterMs / 1000)) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    console.error('[builder/events/:eventId/rsvp] POST JSON parse failed:', error);
    return errorResponse(requestLocale(request), 'invalid_json', 400);
  }

  const locale = requestLocale(
    request,
    body && typeof body === 'object' && 'locale' in body ? (body as { locale?: unknown }).locale : undefined,
  );

  try {
    const input = rsvpSchema.parse(body);
    const errors = validateAttendee(input);
    if (errors.length > 0) {
      return errorResponse(locale, 'validation_error', 400);
    }
    const attendee = await registerAttendee(params.eventId, input);
    return NextResponse.json({ ok: true, attendee }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return validationErrorResponse(locale, error);
    }
    const { code, status } = classifyRsvpError(error);
    return errorResponse(locale, code, status);
  }
}
