import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { columnLocaleSchema } from '@/lib/builder/columns/types';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getBuilderEventsApiErrorPayload,
  type BuilderEventsApiErrorCode,
} from '@/lib/builder/events/events-api-copy';
import {
  createEvent,
  filterEventsByCategory,
  filterEventsByLocale,
  filterEventsByStatus,
  filterEventsByTime,
  listEvents,
  searchEvents,
  sortEvents,
  validateEvent,
} from '@/lib/builder/events/events-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const querySchema = z.object({
  locale: columnLocaleSchema,
  scope: z.enum(['public', 'all']).default('public'),
  status: z.enum(['all', 'draft', 'published', 'cancelled']).default('published'),
  time: z.enum(['all', 'upcoming', 'past']).default('upcoming'),
  category: z.string().trim().max(80).optional(),
  q: z.string().trim().max(200).optional(),
  sort: z.enum(['date-asc', 'date-desc']).default('date-asc'),
  limit: z.coerce.number().int().min(1).max(100).default(50),
});

const eventInputSchema = z.object({
  locale: columnLocaleSchema.default('ko'),
  title: z.string().trim().min(1).max(180),
  slug: z.string().trim().max(100).optional(),
  description: z.string().trim().max(4000).default(''),
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().trim().regex(/^\d{2}:\d{2}$/),
  endDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endTime: z.string().trim().regex(/^\d{2}:\d{2}$/).optional(),
  location: z.string().trim().min(1).max(240),
  capacity: z.coerce.number().int().min(1).max(100000).default(80),
  imageUrl: z.string().trim().max(2000).optional(),
  category: z.string().trim().max(80).default('seminar'),
  status: z.enum(['draft', 'published', 'cancelled']).default('published'),
  rsvpEnabled: z.boolean().default(true),
  ticketType: z.enum(['free', 'paid']).default('free'),
  ticketPriceTwd: z.coerce.number().int().min(0).max(10_000_000).default(0),
  ticketCurrency: z.enum(['TWD', 'KRW', 'USD', 'JPY', 'EUR']).default('TWD'),
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

export async function GET(request: NextRequest) {
  const errorLocale = requestLocale(request);

  try {
    const sp = request.nextUrl.searchParams;
    const parsed = querySchema.parse({
      locale: sp.get('locale') ?? 'ko',
      scope: sp.get('scope') ?? 'public',
      status: sp.get('status') ?? (sp.get('scope') === 'all' ? 'all' : 'published'),
      time: sp.get('time') ?? 'upcoming',
      category: sp.get('category') ?? undefined,
      q: sp.get('q') ?? undefined,
      sort: sp.get('sort') ?? 'date-asc',
      limit: sp.get('limit') ?? 50,
    });

    if (parsed.scope === 'all') {
      const auth = requireBuilderAdminAuth(request);
      if (auth instanceof NextResponse) return auth;
    }

    let events = await listEvents();
    events = filterEventsByLocale(events, parsed.locale);
    events = filterEventsByStatus(events, parsed.scope === 'public' ? 'published' : parsed.status);
    events = filterEventsByTime(events, parsed.time);
    events = filterEventsByCategory(events, parsed.category);
    events = searchEvents(events, parsed.q);
    const total = events.length;
    events = sortEvents(events, parsed.sort).slice(0, parsed.limit);

    return NextResponse.json({ ok: true, locale: parsed.locale, total, events });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(errorLocale, error);
    console.error('[builder/events] GET failed:', error);
    return errorResponse(errorLocale, 'events_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  let body: unknown;
  try {
    body = await request.json();
  } catch (error) {
    console.error('[builder/events] POST JSON parse failed:', error);
    return errorResponse(requestLocale(request), 'invalid_json', 400);
  }

  const errorLocale = requestLocale(
    request,
    body && typeof body === 'object' && 'locale' in body ? (body as { locale?: unknown }).locale : undefined,
  );

  try {
    const input = eventInputSchema.parse(body);
    const event = await createEvent(input);
    const errors = validateEvent(event);
    if (errors.length > 0) {
      return errorResponse(input.locale, 'validation_error', 400);
    }
    return NextResponse.json({ ok: true, event }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return validationErrorResponse(errorLocale, error);
    console.error('[builder/events] POST failed:', error);
    return errorResponse(errorLocale, 'event_create_failed', 500);
  }
}
