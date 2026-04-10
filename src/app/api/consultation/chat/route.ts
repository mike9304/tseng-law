import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale } from '@/lib/locales';
import { generateConsultationChatResponse } from '@/lib/consultation/engine';
import { logConsultationChatEvent, logConsultationFunnelEvent } from '@/lib/consultation/log-store';
import { checkChatRateLimit } from '@/lib/consultation/rate-limit';
import type { ConsultationChatRequestBody } from '@/lib/consultation/types';

export const runtime = 'nodejs';

function badRequest(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const userAgent = request.headers.get('user-agent');
  const ipHeader = request.headers.get('x-forwarded-for');

  // --- Rate limit (IP-based) ---
  const ip = ipHeader?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
  const rateCheck = checkChatRateLimit(ip);
  if (!rateCheck.allowed) {
    // Best-effort funnel log of rate-limit hit. Don't block the response on log failure.
    logConsultationFunnelEvent({
      funnelStage: 'chat_rate_limited',
      sessionId: 'rate-limited',
      metadata: { retryAfterMs: rateCheck.retryAfterMs },
      userAgent,
      ipAddress: ipHeader,
    }).catch((err) => console.error('[consultation] chat_rate_limited log failed:', err));

    return NextResponse.json(
      { success: false, error: 'Too many requests. Please wait a moment.' },
      {
        status: 429,
        headers: { 'Retry-After': String(Math.ceil(rateCheck.retryAfterMs / 1000)) },
      },
    );
  }

  let body: ConsultationChatRequestBody;

  try {
    body = (await request.json()) as ConsultationChatRequestBody;
  } catch {
    return badRequest('Invalid JSON body.');
  }

  const message = body.message?.trim() || '';
  const sessionId = body.sessionId?.trim() || '';
  if (!message || !message.replace(/\s+/g, '')) {
    return badRequest('Message is required.');
  }
  if (message.length > 2400) {
    return badRequest('Message is too long.');
  }
  if (!sessionId || sessionId.length > 120) {
    return badRequest('A valid sessionId is required.');
  }

  const locale = normalizeLocale(body.locale);

  // Always record that the chat was received before running the engine,
  // so we can measure receive → answer drop-off separately from engine errors.
  try {
    await logConsultationFunnelEvent({
      funnelStage: 'chat_received',
      sessionId,
      locale,
      metadata: { messageLength: message.length },
      userAgent,
      ipAddress: ipHeader,
    });
  } catch (err) {
    console.error('[consultation] chat_received log failed:', err);
  }

  try {
    const response = await generateConsultationChatResponse(locale, body);

    try {
      await logConsultationChatEvent({
        sessionId,
        locale,
        message,
        classification: response.classification,
        riskLevel: response.riskLevel,
        shouldEscalate: response.shouldEscalate,
        nextRequiredField: response.nextRequiredField,
        suggestedHandoffChannel: response.suggestedHandoffChannel,
        referencedColumns: response.referencedColumns,
        sourceFreshness: response.sourceFreshness,
        sourceConfidence: response.sourceConfidence,
        funnelStage: 'chat_answered',
        userAgent,
        ipAddress: ipHeader,
      });
    } catch (error) {
      console.error('[consultation] chat log failed:', error);
    }

    return NextResponse.json(response);
  } catch (error) {
    logConsultationFunnelEvent({
      funnelStage: 'chat_failed',
      sessionId,
      locale,
      metadata: {
        failureReason: error instanceof Error ? error.message : 'unknown_chat_failure',
      },
      userAgent,
      ipAddress: ipHeader,
    }).catch((err) => console.error('[consultation] chat_failed log failed:', err));

    console.error('[consultation] chat handler failed:', error);
    return NextResponse.json(
      { success: false, error: 'AI response could not be generated. Please try again or contact the firm directly.' },
      { status: 503 },
    );
  }
}
