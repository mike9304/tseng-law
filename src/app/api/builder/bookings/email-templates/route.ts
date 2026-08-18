import { NextRequest, NextResponse } from 'next/server';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { listBookingEmailTemplates } from '@/lib/builder/bookings/email-templates';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardBuilderReadWithPermission(request, 'view-bookings');
  if (auth instanceof NextResponse) return auth;

  const templates = await listBookingEmailTemplates();
  return NextResponse.json({ templates });
}
