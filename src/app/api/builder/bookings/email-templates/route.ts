import { NextRequest, NextResponse } from 'next/server';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { listBookingEmailTemplates } from '@/lib/builder/bookings/email-templates';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  const templates = await listBookingEmailTemplates();
  return NextResponse.json({ templates });
}
