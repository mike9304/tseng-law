import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { normalizeLocale } from '@/lib/locales';
import { saveConsultationLead } from '@/lib/consultation/db';
import {
  logConsultationFunnelEvent,
  logConsultationSubmitEvent,
} from '@/lib/consultation/log-store';
import { getConsultationPublicEmail } from '@/lib/consultation/public-contact';
import { checkSubmitRateLimit } from '@/lib/consultation/rate-limit';
import { hasAlreadySubmitted, markSubmitted } from '@/lib/consultation/idempotency';
import { sendConsultationEmail } from '@/lib/email/send-consultation-email';
import { validateCsrf } from '@/lib/builder/security/csrf';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';

export const runtime = 'nodejs';

const RATE_LIMIT_WINDOW_MS = 5 * 60_000;
const consultationCategorySchema = z.enum([
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
const boundedOptionalText = (max: number) => z.string().trim().max(max).optional();
const collectedFieldsSchema = z.object({
  name: boundedOptionalText(120),
  email: z.string().trim().email().max(254),
  phoneOrMessenger: boundedOptionalText(120),
  category: consultationCategorySchema.optional(),
  urgency: boundedOptionalText(40),
  summary: boundedOptionalText(10_000),
  preferredContact: boundedOptionalText(80),
  companyOrOrganization: boundedOptionalText(200),
  countryOrResidence: boundedOptionalText(120),
  preferredTime: boundedOptionalText(200),
  hasDocuments: boundedOptionalText(2_000),
  consent: z.boolean().optional(),
}).strict();
const consultationSubmitSchema = z.object({
  locale: z.enum(['ko', 'zh-hant', 'en']).optional(),
  sessionId: z.string().trim().min(1).max(120),
  collectedFields: collectedFieldsSchema,
  transcript: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    text: z.string().max(4_000),
    timestamp: z.string().max(80).optional(),
  }).strict()).max(30).default([]),
  classification: consultationCategorySchema.optional(),
  riskLevel: z.enum(['L1', 'L2', 'L3', 'L4']).optional(),
  referencedColumns: z.array(z.string().trim().min(1).max(500)).max(20).default([]),
}).strict();

function badRequest(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

function buildSubmitFallbackMessage(locale: ReturnType<typeof normalizeLocale>): string {
  const email = getConsultationPublicEmail();
  if (locale === 'ko') {
    return `지금은 자동 접수가 완료되지 않았습니다. 이메일 ${email}로 직접 문의해 주세요.`;
  }

  if (locale === 'zh-hant') {
    return `目前自動送件未完成，請直接寄信至 ${email}。`;
  }

  return `Automatic intake is unavailable right now. Please email ${email} directly.`;
}

export async function POST(request: NextRequest) {
  const csrfFailure = validateCsrf(request);
  if (csrfFailure) return csrfFailure;

  const userAgent = request.headers.get('user-agent');
  const ipHeader = request.headers.get('x-forwarded-for');
  const ipAddress = ipHeader?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return badRequest('Invalid JSON body.');
  }

  const parsed = consultationSubmitSchema.safeParse(raw);
  if (!parsed.success) {
    return badRequest('Consultation submission is invalid or too long.');
  }

  const body = parsed.data;
  const locale = normalizeLocale(body.locale);
  const sessionId = body.sessionId;
  const fields = body.collectedFields;
  const transcript = body.transcript;

  const [ipRateCheck, sessionRateCheck] = await Promise.all([
    checkRateLimit(`consultation-submit:ip:${ipAddress}`, 10, RATE_LIMIT_WINDOW_MS),
    checkRateLimit(`consultation-submit:session:${sessionId}`, 3, RATE_LIMIT_WINDOW_MS),
  ]);
  if (!ipRateCheck.allowed || !sessionRateCheck.allowed) {
    const retryAfterMs = Math.max(ipRateCheck.retryAfterMs, sessionRateCheck.retryAfterMs);
    return NextResponse.json(
      { success: false, error: 'Submission limit reached. Please wait before resubmitting.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.max(1, Math.ceil(retryAfterMs / 1000))) },
      },
    );
  }

  // Record every submission attempt at the earliest point we have a valid sessionId.
  logConsultationFunnelEvent({
    funnelStage: 'submit_received',
    sessionId,
    locale,
    classification: body.classification ?? fields.category,
    riskLevel: body.riskLevel,
    metadata: { transcriptLength: transcript.length },
    userAgent,
    ipAddress: ipHeader,
  }).catch((err) => console.error('[consultation] submit_received log failed:', err));

  // --- Rate limit (sessionId-based, max 3 per 5 min) ---
  const submitRateCheck = checkSubmitRateLimit(sessionId);
  if (!submitRateCheck.allowed) {
    logConsultationFunnelEvent({
      funnelStage: 'submit_rate_limited',
      sessionId,
      locale,
      metadata: { retryAfterMs: submitRateCheck.retryAfterMs },
      userAgent,
      ipAddress: ipHeader,
    }).catch((err) => console.error('[consultation] submit_rate_limited log failed:', err));

    return NextResponse.json(
      { success: false, error: 'Submission limit reached. Please wait before resubmitting.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(submitRateCheck.retryAfterMs / 1000)) },
      },
    );
  }

  // --- Idempotency: prevent duplicate successful submissions ---
  const existing = hasAlreadySubmitted(sessionId);
  if (existing) {
    logConsultationFunnelEvent({
      funnelStage: 'submit_duplicate',
      sessionId,
      locale,
      metadata: { existingIntakeId: existing.intakeId },
      userAgent,
      ipAddress: ipHeader,
    }).catch((err) => console.error('[consultation] submit_duplicate log failed:', err));

    return NextResponse.json({
      success: true,
      intakeId: existing.intakeId,
      message: 'This consultation was already submitted.',
      duplicate: true,
    });
  }

  if (fields.consent !== true) {
    logConsultationFunnelEvent({
      funnelStage: 'submit_consent_missing',
      sessionId,
      locale,
      userAgent,
      ipAddress: ipHeader,
    }).catch((err) => console.error('[consultation] submit_consent_missing log failed:', err));

    return badRequest('Consent is required before submission.');
  }
  if (!fields.name?.trim()) {
    return badRequest('Name is required.');
  }
  if (!fields.summary?.trim()) {
    return badRequest('Summary is required.');
  }
  // All validation passed; mark the funnel stage before expensive I/O (email send).
  logConsultationFunnelEvent({
    funnelStage: 'submit_validated',
    sessionId,
    locale,
    classification: body.classification ?? fields.category,
    riskLevel: body.riskLevel,
    userAgent,
    ipAddress: ipHeader,
  }).catch((err) => console.error('[consultation] submit_validated log failed:', err));

  try {
    const { intakeId } = await sendConsultationEmail({
      locale,
      sessionId,
      collectedFields: fields,
      transcript,
      classification: body.classification ?? fields.category ?? 'unknown',
      riskLevel: body.riskLevel ?? 'L2',
      referencedColumns: body.referencedColumns ?? [],
    });

    // --- Save lead to DB (best-effort, does not block response) ---
    try {
      await saveConsultationLead({
        sessionToken: sessionId,
        intakeId,
        locale,
        classification: body.classification ?? fields.category ?? 'unknown',
        riskLevel: body.riskLevel ?? 'L2',
        collectedFields: fields,
        referencedColumns: body.referencedColumns ?? [],
        transcript,
        emailDeliveryState: 'sent',
      });
    } catch (dbError) {
      console.error('[consultation] DB save failed (non-blocking):', dbError);
    }

    try {
      await logConsultationSubmitEvent({
        eventType: 'submit_success',
        sessionId,
        locale,
        classification: body.classification ?? fields.category ?? 'unknown',
        riskLevel: body.riskLevel ?? 'L2',
        referencedColumns: body.referencedColumns ?? [],
        summary: fields.summary,
        preferredContact: fields.preferredContact,
        urgency: fields.urgency,
        contactPresent: Boolean(fields.email?.trim() || fields.phoneOrMessenger?.trim()),
        intakeId,
        success: true,
        userAgent: request.headers.get('user-agent'),
        ipAddress: request.headers.get('x-forwarded-for'),
      });
    } catch (logError) {
      console.error('[consultation] submit success log failed:', logError);
    }

    markSubmitted(sessionId, intakeId);

    return NextResponse.json({
      success: true,
      intakeId,
      message: 'Consultation intake submitted.',
    });
  } catch (error) {
    console.error('[consultation] submit failed:', error);

    // Save lead even on email failure so data isn't lost
    try {
      await saveConsultationLead({
        sessionToken: sessionId,
        intakeId: `HC-FAIL-${Date.now()}`,
        locale,
        classification: body.classification ?? fields.category ?? 'unknown',
        riskLevel: body.riskLevel ?? 'L2',
        collectedFields: fields,
        referencedColumns: body.referencedColumns ?? [],
        transcript,
        emailDeliveryState: 'failed',
      });
    } catch (dbError) {
      console.error('[consultation] DB save on failure also failed:', dbError);
    }

    try {
      await logConsultationSubmitEvent({
        eventType: 'submit_failed',
        sessionId,
        locale,
        classification: body.classification ?? fields.category ?? 'unknown',
        riskLevel: body.riskLevel ?? 'L2',
        referencedColumns: body.referencedColumns ?? [],
        summary: fields.summary,
        preferredContact: fields.preferredContact,
        urgency: fields.urgency,
        contactPresent: Boolean(fields.email?.trim() || fields.phoneOrMessenger?.trim()),
        success: false,
        failureReason: error instanceof Error ? error.message : 'unknown_submit_failure',
        userAgent: request.headers.get('user-agent'),
        ipAddress: request.headers.get('x-forwarded-for'),
      });
    } catch (logError) {
      console.error('[consultation] submit failure log failed:', logError);
    }

    return NextResponse.json(
      {
        success: false,
        error: buildSubmitFallbackMessage(locale),
      },
      { status: 503 },
    );
  }
}
