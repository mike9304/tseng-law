import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { guardMutation } from '@/lib/builder/security/guard';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { captureBuilderError } from '@/lib/builder/errors/capture';
import { listErrorLog } from '@/lib/builder/errors/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const reportSchema = z.object({
  origin: z.enum(['builder', 'site', 'api', 'client']).default('client'),
  severity: z.enum(['info', 'warning', 'error', 'fatal']).default('error'),
  message: z.string().trim().min(1).max(2000),
  stack: z.string().max(8000).optional(),
  tags: z.record(z.string(), z.string().max(200)).optional(),
  extra: z.record(z.string(), z.unknown()).optional(),
});

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

/** Public surface: client/runtime code can POST without admin auth, just rate-limited. */
export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  const rate = await checkRateLimit(`errors-report:${ip}`, 60, 60_000);
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many error reports' }, { status: 429 });
  }
  const raw = await request.json().catch(() => null);
  const parsed = reportSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid error payload' }, { status: 400 });
  }
  const captured = await captureBuilderError({
    origin: parsed.data.origin,
    severity: parsed.data.severity,
    error: parsed.data.message,
    tags: parsed.data.tags ?? {},
    extra: { ...(parsed.data.extra ?? {}), stack: parsed.data.stack, ip },
  });
  return NextResponse.json({ ok: true, errorId: captured.errorId });
}

export async function GET(request: NextRequest) {
  const auth = await guardMutation(request, { allowReadOnly: true, permission: 'settings' });
  if (auth instanceof NextResponse) return auth;

  const log = await listErrorLog();
  const recent = log.slice(-200).reverse();
  const severityCount: Record<string, number> = {};
  for (const entry of log) {
    severityCount[entry.severity] = (severityCount[entry.severity] ?? 0) + 1;
  }
  return NextResponse.json({
    ok: true,
    total: log.length,
    severityCount,
    sentryConfigured: Boolean(process.env.SENTRY_DSN),
    recent,
  });
}
