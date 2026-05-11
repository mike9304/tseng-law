import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { computeFunnelStats, listFunnelEvents } from '@/lib/builder/forms/funnel/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'manage-forms' });
  if (auth instanceof NextResponse) return auth;

  const formId = request.nextUrl.searchParams.get('formId');
  const events = await listFunnelEvents();
  if (formId) {
    return NextResponse.json({ ok: true, stats: computeFunnelStats(events, formId) });
  }
  const formIds = Array.from(new Set(events.map((e) => e.formId)));
  return NextResponse.json({
    ok: true,
    perForm: formIds.map((id) => computeFunnelStats(events, id)),
  });
}
