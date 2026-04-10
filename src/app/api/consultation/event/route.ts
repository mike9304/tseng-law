import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale } from '@/lib/locales';
import {
  logConsultationFunnelEvent,
  type ConsultationFunnelStage,
} from '@/lib/consultation/log-store';
import { checkChatRateLimit } from '@/lib/consultation/rate-limit';
import type {
  ConsultationCategory,
  ConsultationRiskLevel,
} from '@/lib/consultation/types';

export const runtime = 'nodejs';

/**
 * Allow-list of funnel stages that the client UI is permitted to emit.
 * Server-side stages (chat_*, submit_*) are NOT accepted from the client —
 * those are recorded by their own routes to prevent spoofing.
 */
const CLIENT_ALLOWED_STAGES: ReadonlySet<ConsultationFunnelStage> = new Set<ConsultationFunnelStage>([
  'session_started',
  'first_message_sent',
  'escalation_shown',
  'form_opened',
  'form_field_filled',
  'form_submit_attempted',
  'feedback_positive',
  'feedback_negative',
]);

const ALLOWED_CATEGORIES: ReadonlySet<ConsultationCategory> = new Set<ConsultationCategory>([
  'company_setup',
  'traffic_accident',
  'criminal_investigation',
  'labor',
  'divorce_family',
  'inheritance',
  'logistics',
  'cosmetics',
  'general',
  'unknown',
]);

const ALLOWED_RISK_LEVELS: ReadonlySet<ConsultationRiskLevel> = new Set<ConsultationRiskLevel>([
  'L1',
  'L2',
  'L3',
  'L4',
]);

interface ClientFunnelEventBody {
  stage?: string;
  sessionId?: string;
  locale?: string;
  classification?: string;
  riskLevel?: string;
  metadata?: Record<string, unknown>;
}

function badRequest(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

function sanitizeMetadata(raw: unknown): Record<string, unknown> | undefined {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return undefined;

  const out: Record<string, unknown> = {};
  let kept = 0;
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (kept >= 8) break; // cap field count to bound log size
    if (key.length > 40) continue;
    if (value === null || value === undefined) continue;
    const t = typeof value;
    if (t === 'string') {
      out[key] = (value as string).slice(0, 120);
      kept++;
    } else if (t === 'number' && Number.isFinite(value)) {
      out[key] = value;
      kept++;
    } else if (t === 'boolean') {
      out[key] = value;
      kept++;
    }
    // Drop nested objects, arrays, functions, BigInts, symbols.
  }
  return kept > 0 ? out : undefined;
}

export async function POST(request: NextRequest) {
  const userAgent = request.headers.get('user-agent');
  const ipHeader = request.headers.get('x-forwarded-for');

  // Reuse chat rate limit (per IP) so this endpoint cannot be weaponized
  // to flood disk with log writes.
  const ip = ipHeader?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
  const rateCheck = checkChatRateLimit(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many events. Please slow down.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(rateCheck.retryAfterMs / 1000)) },
      },
    );
  }

  let body: ClientFunnelEventBody;
  try {
    body = (await request.json()) as ClientFunnelEventBody;
  } catch {
    return badRequest('Invalid JSON body.');
  }

  const stage = body.stage;
  const sessionId = body.sessionId?.trim() || '';

  if (!stage || typeof stage !== 'string') {
    return badRequest('stage is required.');
  }
  if (!CLIENT_ALLOWED_STAGES.has(stage as ConsultationFunnelStage)) {
    return badRequest('stage is not allowed from the client.');
  }
  if (!sessionId || sessionId.length > 120) {
    return badRequest('A valid sessionId is required.');
  }

  const locale = normalizeLocale(body.locale);
  const classification = body.classification && ALLOWED_CATEGORIES.has(body.classification as ConsultationCategory)
    ? (body.classification as ConsultationCategory)
    : undefined;
  const riskLevel = body.riskLevel && ALLOWED_RISK_LEVELS.has(body.riskLevel as ConsultationRiskLevel)
    ? (body.riskLevel as ConsultationRiskLevel)
    : undefined;

  try {
    await logConsultationFunnelEvent({
      funnelStage: stage as ConsultationFunnelStage,
      sessionId,
      locale,
      classification,
      riskLevel,
      metadata: sanitizeMetadata(body.metadata),
      userAgent,
      ipAddress: ipHeader,
    });
  } catch (error) {
    console.error('[consultation] client funnel event log failed:', error);
    // We still return success because failing client telemetry should not
    // break the user experience. The error is captured server-side.
  }

  return NextResponse.json({ success: true });
}
