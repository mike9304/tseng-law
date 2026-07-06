import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/builder/security/rate-limit';
import { getService } from '@/lib/builder/bookings/storage';
import { findApplicablePackageCredit } from '@/lib/builder/bookings/packages';
import { bookingServicePriceSnapshot } from '@/lib/builder/bookings/pricing';
import {
  getPublicBookingApiErrorPayload,
  type PublicBookingApiErrorCode,
} from '@/lib/builder/bookings/bookings-copy';
import { normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Phase 25 (W197~W201) — Stripe Payment Intent creation.
 *
 * Creates a PaymentIntent for paid booking services. The client receives the
 * client_secret and confirms the payment via Stripe Payment Element. The
 * actual booking row is created later by /api/booking/book once the payment
 * succeeds (or by a webhook in a future iteration).
 *
 * Env: STRIPE_SECRET_KEY. When absent in dev, returns a stub client_secret
 * so the UI flow can be wired without a real key — clearly marked with
 * `stub: true` so production won't accidentally accept it.
 */

const payloadSchema = z.object({
  serviceId: z.string().min(1).max(120),
  staffId: z.string().min(1).max(120).optional(),
  customer: z.object({
    email: z.string().email().max(200),
    name: z.string().min(1).max(120),
  }),
  discountCode: z.string().trim().min(1).max(32).optional(),
});

function errorResponse(
  locale: Locale,
  errorCode: PublicBookingApiErrorCode,
  status: number,
  init?: ResponseInit,
): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      ...getPublicBookingApiErrorPayload(locale, errorCode),
    },
    { ...init, status },
  );
}

function clientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

export async function POST(request: NextRequest) {
  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || undefined);
  const ip = clientIp(request);
  const rate = await checkRateLimit(`booking-payment-intent:${ip}`, 8, 60_000);
  if (!rate.allowed) {
    return errorResponse(locale, 'too_many_requests', 429, {
      headers: { 'Retry-After': String(Math.ceil(rate.retryAfterMs / 1000)) },
    });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch (error) {
    console.error('[booking/payment-intent] POST JSON parse failed:', error instanceof Error ? error.message : String(error));
    return errorResponse(locale, 'invalid_json', 400);
  }
  const parsed = payloadSchema.safeParse(raw);
  if (!parsed.success) {
    return errorResponse(locale, 'booking_payment_invalid', 400);
  }

  try {
    const service = await getService(parsed.data.serviceId);
    if (!service || !service.isActive) {
      return errorResponse(locale, 'booking_payment_service_unavailable', 404);
    }
    if (service.paymentMode !== 'paid') {
      return errorResponse(locale, 'booking_payment_free_service', 400);
    }

    const packageCredit = await findApplicablePackageCredit({
      customerEmail: parsed.data.customer.email,
      serviceId: service.serviceId,
    });
    if (packageCredit) {
      return NextResponse.json({
        ok: true,
        coveredByPackage: true,
        packageCreditId: packageCredit.credit.creditId,
        packageId: packageCredit.package.packageId,
        packageName: packageCredit.package.name,
        remainingCredits: packageCredit.credit.remainingCredits,
      });
    }

    const price = bookingServicePriceSnapshot(service, (() => {
      const opts: Parameters<typeof bookingServicePriceSnapshot>[1] = {
        staffId: parsed.data.staffId,
        resourceIds: service.requiredResourceIds,
      };
      if (parsed.data.discountCode) {
        opts.discountCode = parsed.data.discountCode;
        opts.locale = locale;
      }
      return opts;
    })());
    const discountFields = price.discountCode && price.discountAmount && price.discountAmount > 0
      ? { discountCode: price.discountCode, discountAmount: price.discountAmount }
      : {};
    if (price.payLater) {
      return NextResponse.json({
        ok: true,
        collectPaymentLater: true,
        amount: 0,
        totalAmount: price.totalAmount,
        balanceDueAfterPayment: price.balanceDueAfterOnlinePayment,
        isDeposit: false,
        currency: price.currency.toLowerCase(),
        ...discountFields,
      });
    }
    if (!price.amountDueNow || price.amountDueNow <= 0 || !price.currency) {
      return errorResponse(locale, 'booking_payment_price_missing', 400);
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY ?? '';
    if (!stripeKey) {
      // BOOKING_PAYMENT_ALLOW_STUB=1 keeps the dev stub available when a
      // production build runs in a local/QA harness without Stripe keys.
      if (process.env.NODE_ENV === 'production' && process.env.BOOKING_PAYMENT_ALLOW_STUB !== '1') {
        console.warn('[booking/payment-intent] STRIPE_SECRET_KEY missing in production');
        return errorResponse(locale, 'booking_payment_provider_not_configured', 503);
      }
      return NextResponse.json({
        ok: true,
        stub: true,
        clientSecret: 'pi_stub_dev_secret',
        paymentIntentId: 'pi_stub_dev',
        amount: price.amountDueNow,
        totalAmount: price.totalAmount,
        depositAmount: price.depositAmount,
        balanceDueAfterPayment: price.balanceDueAfterOnlinePayment,
        isDeposit: price.isDeposit,
        currency: price.currency.toLowerCase(),
        ...discountFields,
        note: 'STRIPE_SECRET_KEY unset — returned stub client_secret for dev wiring only.',
      });
    }

    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? process.env.STRIPE_PUBLISHABLE_KEY;
    if (!publishableKey) {
      console.warn('[booking/payment-intent] Stripe publishable key missing');
      return errorResponse(locale, 'booking_payment_client_not_configured', 503);
    }

    const formBody = new URLSearchParams();
    formBody.set('amount', String(price.amountDueNow));
    formBody.set('currency', price.currency.toLowerCase());
    formBody.set('description', `Booking: ${service.slug}`);
    formBody.set('receipt_email', parsed.data.customer.email);
    formBody.set('automatic_payment_methods[enabled]', 'true');
    formBody.set('metadata[serviceId]', service.serviceId);
    if (parsed.data.staffId) formBody.set('metadata[staffId]', parsed.data.staffId);
    formBody.set('metadata[customerName]', parsed.data.customer.name);
    if (price.effectiveResourceId) formBody.set('metadata[resourceId]', price.effectiveResourceId);
    formBody.set('metadata[bookingTotalAmount]', String(price.totalAmount));
    formBody.set('metadata[bookingAmountDueNow]', String(price.amountDueNow));
    if (price.depositAmount) formBody.set('metadata[bookingDepositAmount]', String(price.depositAmount));
    if (price.discountCode && price.discountAmount) {
      formBody.set('metadata[bookingDiscountCode]', price.discountCode);
      formBody.set('metadata[bookingDiscountAmount]', String(price.discountAmount));
    }

    let res: Response;
    try {
      res = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${stripeKey}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formBody.toString(),
      });
    } catch (err) {
      console.warn('[booking/payment-intent] fetch failed', {
        error: err instanceof Error ? err.message : String(err),
      });
      return errorResponse(locale, 'booking_payment_provider_unreachable', 502);
    }

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.warn('[booking/payment-intent] stripe error', { status: res.status, body: body.slice(0, 200) });
      return errorResponse(locale, 'booking_payment_provider_failed', 502);
    }

    const data = (await res.json()) as { id?: string; client_secret?: string };
    if (!data.client_secret) {
      return errorResponse(locale, 'booking_payment_secret_missing', 502);
    }

    return NextResponse.json({
      ok: true,
      stub: false,
      clientSecret: data.client_secret,
      paymentIntentId: data.id,
      publishableKey,
      amount: price.amountDueNow,
      totalAmount: price.totalAmount,
      depositAmount: price.depositAmount,
      balanceDueAfterPayment: price.balanceDueAfterOnlinePayment,
      isDeposit: price.isDeposit,
      currency: price.currency.toLowerCase(),
      ...discountFields,
    });
  } catch (err) {
    console.warn('[booking/payment-intent] failed', {
      error: err instanceof Error ? err.message : String(err),
    });
    return errorResponse(locale, 'booking_payment_failed', 500);
  }
}
