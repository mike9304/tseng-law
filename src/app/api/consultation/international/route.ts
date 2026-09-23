import { createHash, randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { readBoundedJson } from '@/lib/ai-intake/http';
import { validateCsrf } from '@/lib/builder/security/csrf';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  createInternationalInquiry,
  internationalInquiryInputSchema,
  InternationalInquiryInvalidInputError,
  markInternationalInquiryNotified,
  type InternationalInquiryNotification,
  type InternationalInquiryRecord,
} from '@/lib/consultation/international-inquiry-store';
import { sendInternationalInquiryNotification } from '@/lib/email/send-consultation-email';
import {
  inquirySubmittedEventSchema,
  isContactIntentPath,
  type EnrichedVisitEvent,
} from '@/lib/metrics/visit-schema';
import { saveVisitEventBatch } from '@/lib/metrics/visit-store';

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

  // Only a newly created durable record counts; 'existing' (same requestId
  // resent) returned above, so a duplicate submission is recorded once.
  const response = await notifyCreated(outcome.record, outcome.notification);
  await recordInquirySubmitted(request, outcome.record);
  return response;
}

async function notifyCreated(
  record: InternationalInquiryRecord,
  notification: InternationalInquiryNotification,
): Promise<NextResponse> {
  if (notification === 'sent') {
    return accepted(201, record.intakeId, 'sent');
  }

  try {
    await sendInternationalInquiryNotification(record);
  } catch {
    return accepted(202, record.intakeId, 'pending');
  }

  try {
    await markInternationalInquiryNotified(record.payload.requestId);
    return accepted(201, record.intakeId, 'sent');
  } catch {
    return accepted(202, record.intakeId, 'pending');
  }
}

/** Same-origin, query/fragment-free submit page path from Referer, else undefined. */
function submitPagePath(request: NextRequest): string | undefined {
  const referer = request.headers.get('referer');
  if (!referer) return undefined;
  let url: URL;
  try {
    url = new URL(referer);
  } catch {
    return undefined;
  }
  // Compare with the Host the browser addressed (nextUrl.host may be
  // normalized, e.g. 127.0.0.1 -> localhost in dev). CSRF already ran.
  const requestHost = request.headers.get('host')?.trim().toLowerCase() || request.nextUrl.host;
  if (url.host !== requestHost) return undefined;
  return isContactIntentPath(url.pathname) ? url.pathname : undefined;
}

/**
 * Record one PII-free inquiry_submitted visit event. Isolated: any failure is
 * logged (without payload data) and never changes the inquiry response.
 */
async function recordInquirySubmitted(
  request: NextRequest,
  record: InternationalInquiryRecord,
): Promise<void> {
  try {
    const now = new Date().toISOString();
    const path = submitPagePath(request);
    const event = inquirySubmittedEventSchema.parse({
      v: 1,
      sid: `inq_${randomBytes(12).toString('hex')}`,
      ts: now,
      type: 'inquiry_submitted',
      locale: record.payload.uiLocale,
      ...(path ? { path } : {}),
    });
    const country = request.headers.get('x-vercel-ip-country')?.trim().toUpperCase();
    const enriched: EnrichedVisitEvent = {
      ...event,
      receivedAt: now,
      ...(country && /^[A-Z]{2}$/.test(country) ? { country } : {}),
    };
    await saveVisitEventBatch([enriched]);
  } catch (error) {
    console.error(
      '[visit-metrics] Failed to record inquiry_submitted',
      error instanceof Error ? error.name : 'UnknownError',
    );
  }
}
