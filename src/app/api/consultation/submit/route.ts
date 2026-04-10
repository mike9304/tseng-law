import { NextRequest, NextResponse } from 'next/server';
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
import type { ConsultationSubmitRequestBody } from '@/lib/consultation/types';

export const runtime = 'nodejs';

function badRequest(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

function buildSubmitFallbackMessage(locale: ReturnType<typeof normalizeLocale>): string {
  const email = getConsultationPublicEmail();
  if (locale === 'ko') {
    return `지금은 자동 접수가 완료되지 않았습니다. LINE / KakaoTalk / 전화 또는 ${email} 로 직접 문의해 주세요.`;
  }

  if (locale === 'zh-hant') {
    return `目前自動送件未完成，請改用 LINE / KakaoTalk / 電話，或直接寄信至 ${email}。`;
  }

  return `Automatic intake is unavailable right now. Please use LINE, KakaoTalk, phone, or email ${email} directly.`;
}

export async function POST(request: NextRequest) {
  const userAgent = request.headers.get('user-agent');
  const ipHeader = request.headers.get('x-forwarded-for');

  let body: ConsultationSubmitRequestBody;

  try {
    body = (await request.json()) as ConsultationSubmitRequestBody;
  } catch {
    return badRequest('Invalid JSON body.');
  }

  const locale = normalizeLocale(body.locale);
  const sessionId = body.sessionId?.trim() || '';
  const fields = body.collectedFields ?? {};
  const transcript = body.transcript ?? [];

  if (!sessionId || sessionId.length > 120) {
    return badRequest('A valid sessionId is required.');
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
  if (!fields.email?.trim() && !fields.phoneOrMessenger?.trim()) {
    return badRequest('At least one contact method is required.');
  }
  if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    return badRequest('Email format is invalid.');
  }
  if (transcript.length > 30) {
    return badRequest('Transcript is too long.');
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
