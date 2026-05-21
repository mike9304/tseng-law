import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { columnLocaleSchema } from '@/lib/builder/columns/types';
import { guardMutation } from '@/lib/builder/security/guard';
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

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function GET(request: NextRequest) {
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
    if (error instanceof ZodError) return validationError(error);
    console.error('[builder/events] GET failed:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const input = eventInputSchema.parse(await request.json());
    const event = await createEvent(input);
    const errors = validateEvent(event);
    if (errors.length > 0) {
      return NextResponse.json({ ok: false, error: 'validation_error', errors }, { status: 400 });
    }
    return NextResponse.json({ ok: true, event }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    console.error('[builder/events] POST failed:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 500 },
    );
  }
}
