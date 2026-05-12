import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { bookingEmailTemplateInputSchema } from '@/lib/builder/bookings/types';
import {
  isBookingEmailTemplateType,
  upsertBookingEmailTemplate,
} from '@/lib/builder/bookings/email-templates';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { type: string } }) {
  const auth = await guardMutation(request, { permission: 'manage-bookings' });
  if (auth instanceof NextResponse) return auth;
  if (!isBookingEmailTemplateType(params.type)) {
    return NextResponse.json({ error: 'Unknown booking email template type' }, { status: 404 });
  }

  const parsed = bookingEmailTemplateInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid email template payload', details: parsed.error.issues.slice(0, 3) },
      { status: 400 },
    );
  }

  const template = await upsertBookingEmailTemplate(params.type, parsed.data);
  return NextResponse.json({ template });
}
