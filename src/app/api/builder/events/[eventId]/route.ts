import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
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

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function GET(request: NextRequest, { params }: { params: { eventId: string } }) {
  const scope = request.nextUrl.searchParams.get('scope') ?? 'public';
  if (scope === 'all') {
    const auth = requireBuilderAdminAuth(request);
    if (auth instanceof NextResponse) return auth;
  }

  const event = await loadEvent(params.eventId);
  if (!event || (scope !== 'all' && event.status !== 'published')) {
    return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
  }
  return NextResponse.json({ ok: true, event });
}

export async function PATCH(request: NextRequest, { params }: { params: { eventId: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;

  try {
    const event = await loadEvent(params.eventId);
    if (!event) return NextResponse.json({ ok: false, error: 'not_found' }, { status: 404 });
    const patch = patchSchema.parse(await request.json());
    const saved = await saveEvent({ ...event, ...patch });
    const errors = validateEvent(saved);
    if (errors.length > 0) {
      return NextResponse.json({ ok: false, error: 'validation_error', errors }, { status: 400 });
    }
    return NextResponse.json({ ok: true, event: saved });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ ok: false, error: 'Invalid JSON payload.' }, { status: 400 });
    }
    console.error('[builder/events/:eventId] PATCH failed:', error);
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'unknown_error' },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { eventId: string } }) {
  const auth = await guardMutation(request, { bucket: 'mutation' });
  if (auth instanceof NextResponse) return auth;
  await deleteEvent(params.eventId);
  return NextResponse.json({ ok: true });
}
