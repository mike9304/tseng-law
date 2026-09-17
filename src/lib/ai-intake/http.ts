import { NextResponse } from 'next/server';
import type { AiIntakeErrorBody, AiIntakeErrorCode } from '@/lib/ai-intake/schemas';

export function aiIntakeJson(body: unknown, status: number, extraHeaders?: HeadersInit): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
}

export function aiIntakeError(
  status: number,
  code: AiIntakeErrorCode,
  message: string,
  extra?: Partial<Omit<AiIntakeErrorBody, 'code' | 'message'>> & {
    intakeId?: string;
    deliveryStatus?: 'failed_unknown';
    duplicate?: boolean;
  },
  extraHeaders?: HeadersInit,
): NextResponse {
  const error: AiIntakeErrorBody = {
    code,
    message,
  };
  if (extra?.fields && extra.fields.length > 0) error.fields = extra.fields;
  if (extra?.findings && extra.findings.length > 0) error.findings = extra.findings;
  if (extra?.retryAfterSeconds) error.retryAfterSeconds = extra.retryAfterSeconds;

  const body: Record<string, unknown> = { ok: false, error };
  if (extra?.intakeId) body.intakeId = extra.intakeId;
  if (extra?.deliveryStatus) body.status = extra.deliveryStatus;
  if (extra?.duplicate !== undefined) body.duplicate = extra.duplicate;
  return aiIntakeJson(body, status, extraHeaders);
}

export function clientIpFromRequest(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  if (first && first.length > 0 && first.length <= 64) return first;
  const real = headers.get('x-real-ip')?.trim();
  if (real && real.length > 0 && real.length <= 64) return real;
  return 'unknown';
}

export async function withAiIntakeRouteHandler(
  handler: () => Promise<NextResponse>,
  fallback: NextResponse,
): Promise<NextResponse> {
  try {
    return await handler();
  } catch {
    return fallback;
  }
}

function concatChunks(chunks: Uint8Array[], total: number): Uint8Array {
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

function honorContentLength(header: string | null, maxBytes: number): 'too_large' | 'continue' {
  if (!header) return 'continue';
  const trimmed = header.trim();
  if (!/^\d+$/.test(trimmed)) return 'continue';
  const length = Number(trimmed);
  if (!Number.isFinite(length)) return 'continue';
  if (length > maxBytes) return 'too_large';
  return 'continue';
}

export async function readBoundedJson(request: Request, maxBytes: number): Promise<
  { ok: true; value: unknown } | { ok: false; reason: 'too_large' | 'invalid_json' }
> {
  if (honorContentLength(request.headers.get('content-length'), maxBytes) === 'too_large') {
    return { ok: false, reason: 'too_large' };
  }

  const body = request.body;
  if (!body) {
    return { ok: false, reason: 'invalid_json' };
  }

  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value || value.byteLength === 0) continue;
      if (total + value.byteLength > maxBytes) {
        try {
          await reader.cancel();
        } catch {
          // The over-limit chunk is dropped and not buffered.
        }
        return { ok: false, reason: 'too_large' };
      }
      total += value.byteLength;
      chunks.push(value);
    }
  } catch {
    try {
      await reader.cancel();
    } catch {
      // ignore
    }
    return { ok: false, reason: 'invalid_json' };
  }

  if (total === 0) return { ok: false, reason: 'invalid_json' };

  let text: string;
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(concatChunks(chunks, total));
  } catch {
    return { ok: false, reason: 'invalid_json' };
  }
  if (!text.trim()) return { ok: false, reason: 'invalid_json' };
  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, reason: 'invalid_json' };
  }
}
