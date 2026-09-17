import { createHash } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { readBoundedJson } from '@/lib/ai-intake/http';
import { validateCsrf } from '@/lib/builder/security/csrf';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  createInternationalInquiry,
  internationalInquiryInputSchema,
  InternationalInquiryInvalidInputError,
  markInternationalInquiryNotified,
} from '@/lib/consultation/international-inquiry-store';
import { sendInternationalInquiryNotification } from '@/lib/email/send-consultation-email';

export const runtime = 'nodejs';

const MAX_BODY_BYTES = 80_000;
const RATE_LIMIT_WINDOW_MS = 5 * 60_000;
const NO_STORE = { 'Cache-Control': 'no-store' } as const;

function json(body: unknown, status: number, extraHeaders?: HeadersInit): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: { ...NO_STORE, ...extraHeaders },
  });
}

function fail(status: number, error: string, extraHeaders?: HeadersInit): NextResponse {
  return json({ success: false, error }, status, extraHeaders);
}

function isJsonContentType(value: string | null): boolean {
  if (!value) return false;
  const mediaType = value.split(';', 1)[0]?.trim().toLowerCase();
  return mediaType === 'application/json';
}

function hashIdentifier(value: string): string {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const first = forwarded?.split(',')[0]?.trim();
  if (first) return first;
  const real = request.headers.get('x-real-ip')?.trim();
  if (real) return real;
  return 'unknown';
}

function accepted(
  status: 200 | 201 | 202,
  intakeId: string,
  notification: 'pending' | 'sent',
): NextResponse {
  return json({ success: true, intakeId, notification }, status);
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const csrfFailure = validateCsrf(request);
  if (csrfFailure) return csrfFailure;

  if (!isJsonContentType(request.headers.get('content-type'))) {
    return fail(415, 'Unsupported Media Type.');
  }

  const bounded = await readBoundedJson(request, MAX_BODY_BYTES);
  if (!bounded.ok) {
    if (bounded.reason === 'too_large') return fail(413, 'Request is too large.');
    return fail(400, 'Inquiry request is invalid.');
  }

  const parsed = internationalInquiryInputSchema.safeParse(bounded.value);
  if (!parsed.success) {
    return fail(400, 'Inquiry request is invalid.');
  }

  const requestId = parsed.data.requestId.toLowerCase();
  const [ipRate, requestRate] = await Promise.all([
    checkRateLimit(
      `consultation-international:ip:${hashIdentifier(clientIp(request))}`,
      10,
      RATE_LIMIT_WINDOW_MS,
    ),
    checkRateLimit(
      `consultation-international:request:${hashIdentifier(requestId)}`,
      3,
      RATE_LIMIT_WINDOW_MS,
    ),
  ]);

  if (ipRate.reason === 'backend_unavailable' || requestRate.reason === 'backend_unavailable') {
    return fail(503, 'Inquiry is unavailable.');
  }
  if (!ipRate.allowed || !requestRate.allowed) {
    const retryAfterMs = Math.max(ipRate.retryAfterMs, requestRate.retryAfterMs);
    return fail(
      429,
      'Submission limit reached. Please wait before resubmitting.',
      { 'Retry-After': String(Math.max(1, Math.ceil(retryAfterMs / 1000))) },
    );
  }

  let outcome;
  try {
    outcome = await createInternationalInquiry(parsed.data);
  } catch (error) {
    if (error instanceof InternationalInquiryInvalidInputError) {
      return fail(400, 'Inquiry request is invalid.');
    }
    return fail(503, 'Inquiry is unavailable.');
  }

  if (outcome.kind === 'conflict') {
    return fail(409, 'Inquiry could not be accepted.');
  }

  if (outcome.kind === 'existing') {
    return accepted(
      outcome.notification === 'sent' ? 200 : 202,
      outcome.record.intakeId,
      outcome.notification,
    );
  }

  if (outcome.notification === 'sent') {
    return accepted(201, outcome.record.intakeId, 'sent');
  }

  try {
    await sendInternationalInquiryNotification(outcome.record);
  } catch {
    return accepted(202, outcome.record.intakeId, 'pending');
  }

  try {
    await markInternationalInquiryNotified(outcome.record.payload.requestId);
    return accepted(201, outcome.record.intakeId, 'sent');
  } catch {
    return accepted(202, outcome.record.intakeId, 'pending');
  }
}
