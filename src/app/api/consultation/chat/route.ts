import { NextRequest, NextResponse } from 'next/server';
import { validateCsrf } from '@/lib/builder/security/csrf';
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
  ConsultationSafetySignals,
} from '@/lib/consultation/types';

export const runtime = 'nodejs';
/** Allow the streaming handler to hold the connection open for up to 5 minutes. */
export const maxDuration = 300;

const CHAT_STREAM_FAILURE_CODE = 'chat_stream_failed';
const CHAT_STREAM_FAILURE_MESSAGE = 'Unable to continue this chat right now. Please try again or contact the firm directly.';

function errorKind(error: unknown): string {
  if (error && typeof error === 'object' && 'constructor' in error) {
    const constructor = error.constructor;
    if (typeof constructor === 'function' && constructor.name) return constructor.name;
  }
  return 'unknown_error';
}

function logSafeChatFailure(operationCode: string, error: unknown): void {
  console.error('[consultation] operation failed', operationCode, errorKind(error));
}

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

function logConsultationSafetySignals(input: {
  sessionId: string;
  locale: ReturnType<typeof normalizeLocale>;
  classification?: ConsultationChatStreamMetadata['classification'];
  riskLevel?: ConsultationChatStreamMetadata['riskLevel'];
  signals?: ConsultationSafetySignals;
  userAgent: string | null;
  ipAddress: string | null;
}): void {
  const signals = input.signals;
  if (!signals) return;

  if (signals.piiBypass) {
    logConsultationFunnelEvent({
      funnelStage: 'chat_pii_blocked',
      sessionId: input.sessionId,
      locale: input.locale,
      classification: input.classification,
      riskLevel: input.riskLevel,
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
    }).catch((error) => logSafeChatFailure('chat_pii_bypass_log_failed', error));
  }

  if (signals.lowConfidenceBypass) {
    logConsultationFunnelEvent({
      funnelStage: 'chat_low_confidence_bypassed',
      sessionId: input.sessionId,
      locale: input.locale,
      classification: input.classification,
      riskLevel: input.riskLevel,
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
    }).catch((error) => logSafeChatFailure('chat_low_confidence_log_failed', error));
  }

  if (signals.groundednessFlagged) {
    logConsultationFunnelEvent({
      funnelStage: 'chat_groundedness_flagged',
      sessionId: input.sessionId,
      locale: input.locale,
      classification: input.classification,
      riskLevel: input.riskLevel,
      metadata: { verdict: signals.groundednessFlagged },
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
    }).catch((error) => logSafeChatFailure('chat_groundedness_log_failed', error));
  }

  if (signals.stalenessFlagged && signals.stalenessFlagged.length > 0) {
    logConsultationFunnelEvent({
      funnelStage: 'chat_staleness_flagged',
      sessionId: input.sessionId,
      locale: input.locale,
      classification: input.classification,
      riskLevel: input.riskLevel,
      metadata: { agedSlugs: signals.stalenessFlagged.join(',') },
      userAgent: input.userAgent,
      ipAddress: input.ipAddress,
    }).catch((error) => logSafeChatFailure('chat_staleness_log_failed', error));
  }
}

export async function POST(request: NextRequest) {
  const csrfFailure = validateCsrf(request);
  if (csrfFailure) return csrfFailure;

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
    }).catch((error) => logSafeChatFailure('chat_rate_limited_log_failed', error));

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
  } catch (error) {
    logSafeChatFailure('chat_received_log_failed', error);
  }

  // Streaming branch — return an SSE response. The generator does
  // all the same classify / retrieve / fact-check / staleness work
  // as the non-streaming path, but yields deltas as the LLM produces
  // them. Post-hoc log event is emitted from inside the stream after
  // the first metadata chunk has been captured.
  if (body.stream === true) {
    let capturedMetadata: ConsultationChatStreamMetadata | null = null;
    const capturedSafetySignals: ConsultationSafetySignals = {};
    const streamStartedAt = Date.now();
    const encoder = new TextEncoder();
    const readable = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of streamConsultationChatResponse(locale, body)) {
            if (chunk.type === 'metadata') {
              capturedMetadata = chunk.data;
              Object.assign(capturedSafetySignals, chunk.data.safetySignals ?? {});
              if (chunk.data.promptInjectionDetected) {
                logConsultationFunnelEvent({
                  funnelStage: 'chat_injection_blocked',
                  sessionId,
                  locale,
                  classification: chunk.data.classification,
                  riskLevel: chunk.data.riskLevel,
                  userAgent,
                  ipAddress: ipHeader,
                }).catch((error) =>
                  logSafeChatFailure('chat_injection_log_failed', error),
                );
              }
            } else if (chunk.type === 'warning') {
              if (chunk.variant === 'groundedness') {
                capturedSafetySignals.groundednessFlagged = chunk.verdict ?? 'PARTIAL';
              } else if (chunk.variant === 'staleness') {
                capturedSafetySignals.stalenessFlagged = chunk.agedSlugs ?? ['stream_warning'];
              }
            }
            controller.enqueue(encoder.encode(encodeSseChunk(chunk)));
          }
        } catch (error) {
          logSafeChatFailure(CHAT_STREAM_FAILURE_CODE, error);
          controller.enqueue(
            encoder.encode(
              encodeSseChunk({
                type: 'error',
                error: CHAT_STREAM_FAILURE_MESSAGE,
              }),
            ),
          );
          logConsultationFunnelEvent({
            funnelStage: 'chat_failed',
            sessionId,
            locale,
            metadata: {
              failureReason: CHAT_STREAM_FAILURE_CODE,
              errorKind: errorKind(error),
              streaming: true,
            },
            userAgent,
            ipAddress: ipHeader,
          }).catch((logError) => logSafeChatFailure('chat_failed_log_failed', logError));
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
              referencedKnowledgeIds: capturedMetadata.referencedKnowledgeIds,
              sourceFreshness: capturedMetadata.sourceFreshness,
              sourceConfidence: capturedMetadata.sourceConfidence,
              funnelStage: 'chat_answered',
              userAgent,
              ipAddress: ipHeader,
              // Streaming path can't (yet) capture per-call token usage
              // because the OpenAI streaming API does not return a usage
              // chunk by default. Wall time alone still feeds p50/p95/p99.
              latencyMs: Date.now() - streamStartedAt,
            }).catch((error) => logSafeChatFailure('streaming_chat_log_failed', error));
            logConsultationSafetySignals({
              sessionId,
              locale,
              classification: capturedMetadata.classification,
              riskLevel: capturedMetadata.riskLevel,
              signals: capturedSafetySignals,
              userAgent,
              ipAddress: ipHeader,
            });
          }
          controller.close();
        }
      },
    });

    return new Response(readable, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'private, no-store, no-transform',
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
      }).catch((error) => logSafeChatFailure('chat_injection_log_failed', error));
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
        referencedKnowledgeIds: response.referencedKnowledgeIds,
        sourceFreshness: response.sourceFreshness,
        sourceConfidence: response.sourceConfidence,
        funnelStage: 'chat_answered',
        userAgent,
        ipAddress: ipHeader,
        latencyMs: response.perfMetrics?.latencyMs,
        openAiCalls: response.perfMetrics?.openAiCalls,
        promptTokens: response.perfMetrics?.promptTokens,
        completionTokens: response.perfMetrics?.completionTokens,
      });
    } catch (error) {
      logSafeChatFailure('chat_event_log_failed', error);
    }

    logConsultationSafetySignals({
      sessionId,
      locale,
      classification: response.classification,
      riskLevel: response.riskLevel,
      signals: response.safetySignals,
      userAgent,
      ipAddress: ipHeader,
    });

    return NextResponse.json(response);
  } catch (error) {
    logConsultationFunnelEvent({
      funnelStage: 'chat_failed',
      sessionId,
      locale,
      metadata: {
        failureReason: 'chat_response_failed',
        errorKind: errorKind(error),
      },
      userAgent,
      ipAddress: ipHeader,
    }).catch((logError) => logSafeChatFailure('chat_failed_log_failed', logError));

    logSafeChatFailure('chat_response_failed', error);
    return NextResponse.json(
      { success: false, error: 'AI response could not be generated. Please try again or contact the firm directly.' },
      { status: 503 },
    );
  }
}
