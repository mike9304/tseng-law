/**
 * POST /api/consultation/jhsu — 徐嘉駿律師 사이트(son-7.com, 정적) 상담 문의 접수.
 *
 * 정적 사이트에서 cross-origin fetch로 호출되므로 Origin 허용목록 + CORS 프리플라이트를 직접 처리한다.
 * 저장 없음: 메일 발송(徐嘉駿律師 + 曾雋崴律師)만 하고 본문은 로그에 남기지 않는다.
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { sendJhsuIntakeEmail } from '@/lib/email/send-jhsu-intake-email';

export const runtime = 'nodejs';

const RATE_LIMIT_WINDOW_MS = 10 * 60_000;
const DEFAULT_ALLOWED_ORIGINS = [
  'https://son-7.com',
  'https://www.son-7.com',
  'https://jhsu-son7.vercel.app',
  'http://127.0.0.1:8791',
  'http://localhost:8791',
] as const;

const text = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal('')).transform((v) => (v ? v : undefined));
const intakeSchema = z.object({
  name: text(120).min(1),
  phone: text(60).min(1),
  email: optionalText(254),
  role: text(60).min(1),
  stage: text(120).min(1),
  orgSize: optionalText(40),
  counterparty: optionalText(200),
  message: text(5_000).min(1),
  preferredTime: optionalText(120),
  consent: z.boolean(),
  pageUrl: optionalText(500),
  website: optionalText(200), // honeypot — 사람은 채우지 않는다
}).strict();

function allowedOrigins(): Set<string> {
  const configured = process.env.JHSU_ALLOWED_ORIGINS?.split(',').map((o) => o.trim()).filter(Boolean);
  return new Set(configured?.length ? configured : DEFAULT_ALLOWED_ORIGINS);
}

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = { Vary: 'Origin' };
  if (origin && allowedOrigins().has(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
    headers['Access-Control-Max-Age'] = '600';
  }
  return headers;
}

function json(origin: string | null, body: unknown, status = 200, extra: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers: { ...corsHeaders(origin), ...extra } });
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowed = origin ? allowedOrigins().has(origin) : false;
  return new NextResponse(null, { status: allowed ? 204 : 403, headers: corsHeaders(origin) });
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (!origin || !allowedOrigins().has(origin)) {
    return json(origin, { success: false, error: 'origin_not_allowed' }, 403);
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return json(origin, { success: false, error: 'invalid_json' }, 400);
  }
  const parsed = intakeSchema.safeParse(raw);
  if (!parsed.success) {
    return json(origin, { success: false, error: 'invalid_fields' }, 400);
  }
  const body = parsed.data;

  // 허니팟: 봇이 채운 요청은 성공처럼 응답하고 버린다.
  if (body.website) {
    return json(origin, { success: true, intakeId: 'JH-IGNORED' });
  }
  if (body.consent !== true) {
    return json(origin, { success: false, error: 'consent_required' }, 400);
  }

  const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip') || 'unknown';
  const ipRate = await checkRateLimit(`jhsu-intake:ip:${ipAddress}`, 5, RATE_LIMIT_WINDOW_MS);
  if (!ipRate.allowed) {
    return json(origin, { success: false, error: 'rate_limited' }, 429, {
      'Retry-After': String(Math.max(1, Math.ceil(ipRate.retryAfterMs / 1000))),
    });
  }

  try {
    const { intakeId } = await sendJhsuIntakeEmail({
      name: body.name, phone: body.phone, email: body.email, role: body.role, stage: body.stage,
      orgSize: body.orgSize, counterparty: body.counterparty, message: body.message,
      preferredTime: body.preferredTime, source: 'son-7.com', pageUrl: body.pageUrl,
    });
    return json(origin, { success: true, intakeId });
  } catch (error) {
    console.error('[jhsu-intake] send failed:', error instanceof Error ? error.message : error);
    return json(origin, { success: false, error: 'send_failed' }, 502);
  }
}
