import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { appendFunnelEvent } from '@/lib/builder/forms/funnel/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const payloadSchema = z.object({
  formId: z.string().trim().min(1).max(120),
  kind: z.enum(['view', 'step', 'submit', 'abandon']),
  stepIndex: z.number().int().min(0).max(20).optional(),
});

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const rate = await checkRateLimit(`forms-track:${ip}`, 120, 60_000);
  if (!rate.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 });

  const parsed = payloadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  await appendFunnelEvent({ ...parsed.data, at: new Date().toISOString() });
  return NextResponse.json({ ok: true });
}
