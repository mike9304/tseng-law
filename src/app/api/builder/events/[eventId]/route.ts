import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getBuilderEventsApiErrorPayload,
  type BuilderEventsApiErrorCode,
} from '@/lib/builder/events/events-api-copy';
import {
  deleteEvent,
  loadEvent,
  saveEvent,
  validateEvent,
} from '@/lib/builder/events/events-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const patchSchema = z.object({
  title: z.string().trim().min(1).max(180).optional(),
  slug: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().max(4000).optional(),
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  time: z.string().trim().regex(/^\d{2}:\d{2}$/).optional(),
  endDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endTime: z.string().trim().regex(/^\d{2}:\d{2}$/).optional(),
  location: z.string().trim().min(1).max(240).optional(),
  capacity: z.coerce.number().int().min(1).max(100000).optional(),
  imageUrl: z.string().trim().max(2000).optional(),
  category: z.string().trim().max(80).optional(),
  status: z.enum(['draft', 'published', 'cancelled']).optional(),
  rsvpEnabled: z.boolean().optional(),
  ticketType: z.enum(['free', 'paid']).optional(),
  ticketPriceTwd: z.coerce.number().int().min(0).max(10_000_000).optional(),
  ticketCurrency: z.enum(['TWD', 'KRW', 'USD', 'JPY', 'EUR']).optional(),
});

function requestLocale(request: NextRequest, input?: unknown): Locale {
  if (typeof input === 'string') return normalizeLocale(input);
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

function errorResponse(
  locale: Locale,
  errorCode: BuilderEventsApiErrorCode,
  status: number,
  extra?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getBuilderEventsApiErrorPayload(locale, errorCode),
      ...(extra ?? {}),
    },
    { status },
  );
}

function validationErrorResponse(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

export async function GET(request: NextRequest, { params }: { params: { eventId: string } }) {
  const locale = requestLocale(request);
  const scope = request.nextUrl.searchParams.get('scope') ?? 'public';
  if (scope === 'all') {
    const auth = requireBuilderAdminAuth(request);
    if (auth instanceof NextResponse) return auth;
  }

  try {
    const event = await loadEvent(params.eventId);
    if (!event || (scope !== 'all' && event.status !== 'published')) {
      return errorResponse(locale, 'event_not_found', 404);
    }
    return NextResponse.json({ ok: true, event });
  } catch (error) {
    console.error('[builder/events/:eventId] GET failed:', error);
    return errorResponse(locale, 'event_load_failed', 500);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { eventId: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  const locale = requestLocale(request);

  try {
    const event = await loadEvent(params.eventId);
    if (!event) return errorResponse(locale, 'event_not_found', 404);

    let body: unknown;
    try {
      body = await request.json();
    } catch (error) {
      console.error('[builder/events/:eventId] PATCH JSON parse failed:', error);
      return errorResponse(locale, 'invalid_json', 400);
    }

    const patch = patchSchema.parse(body);
    const saved = await saveEvent({ ...event, ...patch });
    const errors = validateEvent(saved);
    if (errors.length > 0) {
      return errorResponse(locale, 'validation_error', 400);
    }
    return NextResponse.json({ ok: true, event: saved });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(locale, error);
    console.error('[builder/events/:eventId] PATCH failed:', error);
    return errorResponse(locale, 'event_update_failed', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { eventId: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;
  const locale = requestLocale(request);

  try {
    await deleteEvent(params.eventId);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[builder/events/:eventId] DELETE failed:', error);
    return errorResponse(locale, 'event_delete_failed', 500);
  }
}
