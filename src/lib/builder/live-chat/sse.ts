/**
 * PR #14 — Server-Sent Events helpers for the live-chat surfaces.
 *
 * The Vercel platform supports streaming responses on Fluid Compute, so we
 * use raw SSE rather than WebSockets. Each subscriber gets a ReadableStream
 * that emits new messages by polling the blob/file store every 1s. Polling
 * is fine for the legal-firm scale (very low concurrent visitors); a future
 * version could swap to a fan-out service.
 */

import { listMessagesForConversation } from './storage';
import type { ChatMessage } from './types';
import { getLiveChatSseErrorPayload, type LiveChatSseErrorCode } from './widget-copy';
import { defaultLocale, type Locale } from '@/lib/locales';

interface StreamArgs {
  conversationId: string;
  /** Role that initiated the subscription — used to filter "self" messages out so the sender doesn't echo. */
  observerRole: 'visitor' | 'admin';
  locale?: Locale;
  /** Poll interval ms; clamped to [500, 5000]. */
  pollMs?: number;
  /** Max stream lifetime ms; clamped to [10_000, 600_000]. */
  maxDurationMs?: number;
}

export function buildChatStream(args: StreamArgs): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const pollMs = Math.max(500, Math.min(5000, args.pollMs ?? 1000));
  const maxDurationMs = Math.max(10_000, Math.min(600_000, args.maxDurationMs ?? 120_000));
  const started = Date.now();
  let cancelled = false;
  let lastSentAt = '';
  const locale = args.locale ?? defaultLocale;

  const errorEvent = (errorCode: LiveChatSseErrorCode) => (
    `event: error\ndata: ${JSON.stringify(getLiveChatSseErrorPayload(locale, errorCode))}\n\n`
  );

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        // Initial dump: send every message so reconnects show full history,
        // including the observer's own past messages. The "no echo" rule
        // applies only to live ticks below.
        const initial = await listMessagesForConversation(args.conversationId);
        for (const message of initial) {
          controller.enqueue(encoder.encode(`event: message\ndata: ${JSON.stringify(message)}\n\n`));
          lastSentAt = message.at;
        }
        controller.enqueue(encoder.encode(`event: ready\ndata: ${JSON.stringify({ ok: true })}\n\n`));
      } catch {
        controller.enqueue(encoder.encode(errorEvent('stream_initial_failed')));
      }

      const tick = async (): Promise<void> => {
        if (cancelled) return;
        if (Date.now() - started > maxDurationMs) {
          controller.enqueue(encoder.encode('event: close\ndata: {"reason":"timeout"}\n\n'));
          controller.close();
          return;
        }
        try {
          const messages = await listMessagesForConversation(args.conversationId);
          const fresh = messages.filter((m) => m.at > lastSentAt);
          for (const message of fresh) {
            // Don't echo the observer's own messages back to them.
            if (message.role === args.observerRole) {
              lastSentAt = message.at;
              continue;
            }
            controller.enqueue(encoder.encode(`event: message\ndata: ${JSON.stringify(message satisfies ChatMessage)}\n\n`));
            lastSentAt = message.at;
          }
          controller.enqueue(encoder.encode(`event: ping\ndata: ${JSON.stringify({ at: new Date().toISOString() })}\n\n`));
        } catch {
          controller.enqueue(encoder.encode(errorEvent('stream_poll_failed')));
        }
        setTimeout(tick, pollMs);
      };
      setTimeout(tick, pollMs);
    },
    cancel() {
      cancelled = true;
    },
  });
}
