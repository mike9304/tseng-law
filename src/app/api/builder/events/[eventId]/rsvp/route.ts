import { NextRequest, NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { registerAttendee, validateAttendee } from '@/lib/builder/events/events-engine';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const rsvpSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(180),
  phone: z.string().trim().max(80).optional(),
  ticketQuantity: z.coerce.number().int().min(1).max(20).default(1),
});

export async function POST(request: NextRequest, { params }: { params: { eventId: string } }) {
  
  // builder-route-guard: allow-public — intentional public visitor endpoint
try {
    const input = rsvpSchema.parse(await request.json());
    const errors = validateAttendee(input);
    if (errors.length > 0) {
      return NextResponse.json({ ok: false, error: 'validation_error', errors }, { status: 400 });
    }
    const attendee = await registerAttendee(params.eventId, input);
    return NextResponse.json({ ok: true, attendee }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { ok: false, error: 'validation_error', issues: error.flatten() },
        { status: 400 },
      );
    }
    const message = error instanceof Error ? error.message : 'unknown_error';
    const status = message.includes('찾을 수') ? 404 : 400;
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
