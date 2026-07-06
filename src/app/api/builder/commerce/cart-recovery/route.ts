import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import {
  getCommerceCartRecoveryApiErrorPayload,
  type CommerceCartRecoveryApiErrorCode,
} from '@/lib/builder/commerce/cart-recovery-api-copy';
import { captureAbandonedCart } from '@/lib/builder/commerce/notifications-engine';
import { isLocale, normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const recoverySchema = z.object({
  locale: z.enum(['ko', 'zh-hant', 'en']).default('ko'),
  email: z.string().trim().email().max(200),
  currency: z.enum(['TWD', 'KRW', 'USD']).default('TWD'),
  cart: z.unknown(),
  recoveryUrl: z.string().trim().max(400).optional(),
});

const emptyRecoveryCartErrorMessage = ['commerce', 'recovery', 'cart', 'empty'].join('_');

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function errorResponse(
  locale: Locale,
  errorCode: CommerceCartRecoveryApiErrorCode,
  status: number,
  extras?: Record<string, unknown>,
  init?: ResponseInit,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getCommerceCartRecoveryApiErrorPayload(locale, errorCode), ...extras },
    { ...init, status },
  );
}

function validationError(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

function resolveRequestLocale(request: NextRequest, payload?: unknown): Locale {
  if (payload && typeof payload === 'object' && 'locale' in payload) {
    const locale = (payload as { locale?: unknown }).locale;
    if (typeof locale === 'string' && isLocale(locale)) return locale;
  }
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

function isEmptyRecoveryCartError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const { message } = error;
  return message === emptyRecoveryCartErrorMessage;
}

export async function POST(request: NextRequest) {
  let errorLocale = resolveRequestLocale(request);
  // builder-route-guard: allow-public — intentional public visitor endpoint
  const rate = await checkRateLimit(`commerce-cart-recovery:${clientIp(request)}`, 20, 60_000);
  if (!rate.allowed) {
    return errorResponse(
      errorLocale,
      'too_many_requests',
      429,
      undefined,
      { headers: { 'Retry-After': String(Math.ceil(rate.retryAfterMs / 1000)) } },
    );
  }

  try {
    const payload = await request.json();
    errorLocale = resolveRequestLocale(request, payload);
    const input = recoverySchema.parse(payload);
    const result = await captureAbandonedCart(input);
    return NextResponse.json({ ok: true, recovery: result.recovery, event: result.event });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) return errorResponse(errorLocale, 'invalid_json', 400);
    if (isEmptyRecoveryCartError(error)) {
      return errorResponse(errorLocale, 'cart_empty', 400);
    }
    console.error('[builder/commerce/cart-recovery] POST failed:', error);
    return errorResponse(errorLocale, 'cart_recovery_failed', 500);
  }
}
