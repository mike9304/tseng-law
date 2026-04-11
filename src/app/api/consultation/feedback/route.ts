import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale } from '@/lib/locales';
import { checkChatRateLimit } from '@/lib/consultation/rate-limit';
import {
  clipFeedbackComment,
  recordConsultationFeedback,
  type ConsultationFeedbackRating,
} from '@/lib/consultation/feedback-store';
import { logConsultationFunnelEvent } from '@/lib/consultation/log-store';
import { sendNegativeFeedbackAlert } from '@/lib/email/send-consultation-email';
import type {
  ConsultationCategory,
  ConsultationRiskLevel,
} from '@/lib/consultation/types';

export const runtime = 'nodejs';

const ALLOWED_RATINGS: ReadonlySet<ConsultationFeedbackRating> = new Set<ConsultationFeedbackRating>([
  'helpful',
  'unhelpful',
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

interface FeedbackRequestBody {
  sessionId?: string;
  messageId?: string;
  rating?: string;
  locale?: string;
  classification?: string;
  riskLevel?: string;
  comment?: string;
}

function badRequest(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const userAgent = request.headers.get('user-agent');
  const ipHeader = request.headers.get('x-forwarded-for');

  // Reuse chat rate limit window; feedback should never be higher-volume
  // than chat, and we don't want this endpoint to become a denial-of-disk vector.
  const ip = ipHeader?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
  const rateCheck = checkChatRateLimit(ip);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { success: false, error: 'Too many feedback submissions. Please slow down.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(rateCheck.retryAfterMs / 1000)) },
      },
    );
  }

  let body: FeedbackRequestBody;
  try {
    body = (await request.json()) as FeedbackRequestBody;
  } catch {
    return badRequest('Invalid JSON body.');
  }

  const sessionId = body.sessionId?.trim() || '';
  const messageId = body.messageId?.trim() || '';
  const rating = body.rating;

  if (!sessionId || sessionId.length > 120) {
    return badRequest('A valid sessionId is required.');
  }
  if (!messageId || messageId.length > 120) {
    return badRequest('A valid messageId is required.');
  }
  if (!rating || !ALLOWED_RATINGS.has(rating as ConsultationFeedbackRating)) {
    return badRequest('rating must be "helpful" or "unhelpful".');
  }
  if (body.comment && typeof body.comment !== 'string') {
    return badRequest('comment must be a string.');
  }
  if (body.comment && body.comment.length > 2000) {
    return badRequest('comment is too long (max 2000 chars).');
  }

  const locale = normalizeLocale(body.locale);
  const classification = body.classification && ALLOWED_CATEGORIES.has(body.classification as ConsultationCategory)
    ? (body.classification as ConsultationCategory)
    : undefined;
  const riskLevel = body.riskLevel && ALLOWED_RISK_LEVELS.has(body.riskLevel as ConsultationRiskLevel)
    ? (body.riskLevel as ConsultationRiskLevel)
    : undefined;

  const result = await recordConsultationFeedback({
    sessionId,
    messageId,
    rating: rating as ConsultationFeedbackRating,
    locale,
    classification,
    riskLevel,
    comment: body.comment,
    userAgent,
    ipAddress: ipHeader,
  });

  // Non-blocking: also drop a funnel event so we can see feedback in the
  // single unified funnel view.
  logConsultationFunnelEvent({
    funnelStage: rating === 'helpful' ? 'feedback_positive' : 'feedback_negative',
    sessionId,
    locale,
    classification,
    riskLevel,
    metadata: { messageId, accepted: result.accepted, reason: result.reason },
    userAgent,
    ipAddress: ipHeader,
  }).catch((err) => console.error('[consultation] feedback funnel log failed:', err));

  // Wave 8: fire-and-forget alert email when a fresh 👎 lands. Skipped
  // for duplicates so a refresh-happy user can't spam the lawyer's
  // inbox. SMTP latency stays off the user's response path because the
  // promise is intentionally not awaited.
  if (rating === 'unhelpful' && result.accepted) {
    const dashboardOrigin =
      process.env.PUBLIC_SITE_ORIGIN
      || process.env.NEXT_PUBLIC_SITE_ORIGIN
      || 'https://tseng-law.com';
    sendNegativeFeedbackAlert({
      locale,
      sessionId,
      messageId,
      classification,
      riskLevel,
      commentRedacted: body.comment ? clipFeedbackComment(body.comment) : undefined,
      dashboardUrl: `${dashboardOrigin.replace(/\/$/, '')}/${locale}/admin-consultation`,
    }).catch((err) =>
      console.error('[consultation] negative feedback alert failed:', err),
    );
  }

  if (!result.accepted && result.reason === 'duplicate') {
    // Treat duplicate as a soft success — the client already sent the feedback
    // once and we just ignore the redundant write.
    return NextResponse.json({
      success: true,
      duplicate: true,
      message: 'Feedback already recorded for this message.',
    });
  }

  if (!result.accepted && result.reason === 'write_failed') {
    return NextResponse.json(
      { success: false, error: 'Feedback could not be stored. Please try again later.' },
      { status: 503 },
    );
  }

  return NextResponse.json({ success: true });
}
