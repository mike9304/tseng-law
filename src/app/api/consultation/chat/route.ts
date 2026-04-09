import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale } from '@/lib/locales';
import { generateConsultationChatResponse } from '@/lib/consultation/engine';
import { logConsultationChatEvent } from '@/lib/consultation/log-store';
import { checkChatRateLimit } from '@/lib/consultation/rate-limit';
import type { ConsultationChatRequestBody } from '@/lib/consultation/types';

export const runtime = 'nodejs';

function badRequest(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

export async function POST(request: NextRequest) {
  // --- Rate limit (IP-based) ---
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
  const rateCheck = checkChatRateLimit(ip);
  if (!rateCheck.allowed) {
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
      userAgent: request.headers.get('user-agent'),
      ipAddress: request.headers.get('x-forwarded-for'),
    });
  } catch (error) {
    console.error('[consultation] chat log failed:', error);
  }

  return NextResponse.json(response);
}
