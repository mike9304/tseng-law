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

interface StreamArgs {
  conversationId: string;
  /** Role that initiated the subscription — used to filter "self" messages out so the sender doesn't echo. */
  observerRole: 'visitor' | 'admin';
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

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const initial = await listMessagesForConversation(args.conversationId);
        const filtered = initial.filter((m) => m.role !== args.observerRole || m.role === 'admin' && args.observerRole === 'admin');
        for (const message of filtered) {
          controller.enqueue(encoder.encode(`event: message\ndata: ${JSON.stringify(message)}\n\n`));
          lastSentAt = message.at;
        }
        controller.enqueue(encoder.encode(`event: ready\ndata: ${JSON.stringify({ ok: true })}\n\n`));
      } catch (err) {
        controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: err instanceof Error ? err.message : 'unknown' })}\n\n`));
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
        } catch (err) {
          controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: err instanceof Error ? err.message : 'poll' })}\n\n`));
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
