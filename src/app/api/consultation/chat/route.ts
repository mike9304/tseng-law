import { NextRequest, NextResponse } from 'next/server';
import { normalizeLocale } from '@/lib/locales';
import {
  generateConsultationChatResponse,
  streamConsultationChatResponse,
} from '@/lib/consultation/engine';
import { logConsultationChatEvent, logConsultationFunnelEvent } from '@/lib/consultation/log-store';
import { checkChatRateLimit } from '@/lib/consultation/rate-limit';
import type {
  ConsultationChatRequestBody,
  ConsultationChatStreamChunk,
  ConsultationChatStreamMetadata,
} from '@/lib/consultation/types';

export const runtime = 'nodejs';
/** Allow the streaming handler to hold the connection open for up to 5 minutes. */
export const maxDuration = 300;

function badRequest(message: string) {
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}

/**
 * Serialize a chunk event as a Server-Sent Events frame:
 *   `data: {json}\n\n`
 * The client reads these via fetch + getReader + TextDecoder and
 * splits on `\n\n` to recover each event boundary.
 */
function encodeSseChunk(chunk: ConsultationChatStreamChunk): string {
  return `data: ${JSON.stringify(chunk)}\n\n`;
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
      metadata: { messageLength: message.length, streaming: body.stream === true },
      userAgent,
      ipAddress: ipHeader,
    });
  } catch (err) {
    console.error('[consultation] chat_received log failed:', err);
  }

  // Streaming branch — return an SSE response. The generator does
  // all the same classify / retrieve / fact-check / staleness work
  // as the non-streaming path, but yields deltas as the LLM produces
  // them. Post-hoc log event is emitted from inside the stream after
  // the first metadata chunk has been captured.
  if (body.stream === true) {
    let capturedMetadata: ConsultationChatStreamMetadata | null = null;
    const encoder = new TextEncoder();
    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of streamConsultationChatResponse(locale, body)) {
            if (chunk.type === 'metadata') {
              capturedMetadata = chunk.data;
              if (chunk.data.promptInjectionDetected) {
                logConsultationFunnelEvent({
                  funnelStage: 'chat_injection_blocked',
                  sessionId,
                  locale,
                  classification: chunk.data.classification,
                  riskLevel: chunk.data.riskLevel,
                  userAgent,
                  ipAddress: ipHeader,
                }).catch((err) =>
                  console.error('[consultation] injection log failed:', err),
                );
              }
            }
            controller.enqueue(encoder.encode(encodeSseChunk(chunk)));
          }
        } catch (error) {
          console.error('[consultation] stream handler crashed:', error);
          controller.enqueue(
            encoder.encode(
              encodeSseChunk({
                type: 'error',
                error: error instanceof Error ? error.message : 'unknown_stream_failure',
              }),
            ),
          );
          logConsultationFunnelEvent({
            funnelStage: 'chat_failed',
            sessionId,
            locale,
            metadata: {
              failureReason: error instanceof Error ? error.message : 'unknown_stream_failure',
              streaming: true,
            },
            userAgent,
            ipAddress: ipHeader,
          }).catch((err) => console.error('[consultation] chat_failed log failed:', err));
        } finally {
          // Best-effort post-hoc funnel log for the answered stream.
          // If the stream crashed before metadata was captured, skip
          // the per-message chat event — we still have the earlier
          // chat_received funnel log.
          if (capturedMetadata) {
            logConsultationChatEvent({
              sessionId,
              locale,
              message,
              classification: capturedMetadata.classification,
              riskLevel: capturedMetadata.riskLevel,
              shouldEscalate: capturedMetadata.shouldEscalate,
              nextRequiredField: capturedMetadata.nextRequiredField,
              suggestedHandoffChannel: capturedMetadata.suggestedHandoffChannel,
              referencedColumns: capturedMetadata.referencedColumns,
              sourceFreshness: capturedMetadata.sourceFreshness,
              sourceConfidence: capturedMetadata.sourceConfidence,
              funnelStage: 'chat_answered',
              userAgent,
              ipAddress: ipHeader,
            }).catch((err) => console.error('[consultation] streaming chat log failed:', err));
          }
          controller.close();
        }
      },
    });

    return new Response(readable, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        // Some proxies buffer responses without this header.
        'X-Accel-Buffering': 'no',
      },
    });
  }

  try {
    const response = await generateConsultationChatResponse(locale, body);

    if (response.promptInjectionDetected) {
      logConsultationFunnelEvent({
        funnelStage: 'chat_injection_blocked',
        sessionId,
        locale,
        classification: response.classification,
        riskLevel: response.riskLevel,
        userAgent,
        ipAddress: ipHeader,
      }).catch((err) => console.error('[consultation] injection log failed:', err));
    }

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
