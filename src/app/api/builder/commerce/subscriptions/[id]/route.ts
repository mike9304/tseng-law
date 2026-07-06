import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getCommerceSubscriptionsApiErrorPayload,
  type CommerceSubscriptionsApiErrorCode,
} from '@/lib/builder/commerce/subscriptions-api-copy';
import {
  deleteCustomerSubscription,
  deleteSubscriptionPlan,
  getCustomerSubscription,
  getSubscriptionPlan,
  transitionCustomerSubscription,
  updateSubscriptionPlan,
} from '@/lib/builder/commerce/subscriptions-store';
import { isLocale, normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const planPatchSchema = z.object({
  kind: z.literal('plan'),
  slug: z.string().trim().min(1).max(80).optional(),
  name: z.object({
    ko: z.string().trim().max(200).optional(),
    'zh-hant': z.string().trim().max(200).optional(),
    en: z.string().trim().max(200).optional(),
  }).partial().optional(),
  description: z.string().trim().max(1000).optional(),
  amountCents: z.number().int().nonnegative().optional(),
  currency: z.enum(['TWD', 'KRW', 'USD', 'EUR', 'JPY', 'CNY']).optional(),
  interval: z.enum(['day', 'week', 'month', 'year']).optional(),
  intervalCount: z.number().int().min(1).max(120).optional(),
  trialDays: z.number().int().min(0).max(365).optional(),
  status: z.enum(['draft', 'active', 'archived']).optional(),
});

const subscriptionPatchSchema = z.object({
  kind: z.literal('subscription'),
  transition: z.enum(['activate', 'pause', 'resume', 'cancel', 'mark_past_due', 'renew']),
  note: z.string().trim().max(500).optional(),
});

const patchSchema = z.discriminatedUnion('kind', [planPatchSchema, subscriptionPatchSchema]);

function errorResponse(
  locale: Locale,
  errorCode: CommerceSubscriptionsApiErrorCode,
  status: number,
  extras?: Record<string, unknown>,
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getCommerceSubscriptionsApiErrorPayload(locale, errorCode), ...extras },
    { status },
  );
}

function validationError(locale: Locale, error: ZodError): NextResponse {
  return errorResponse(locale, 'validation_error', 400, { issues: error.flatten() });
}

function resolveRequestLocale(request: NextRequest, payload?: unknown): Locale {
  if (payload && typeof payload === 'object') {
    const locale = (payload as { locale?: unknown }).locale;
    if (typeof locale === 'string' && isLocale(locale)) return locale;
  }
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

function isPlanId(id: string): boolean {
  return id.startsWith('plan_');
}

function isSubscriptionId(id: string): boolean {
  return id.startsWith('sub_');
}

function transitionErrorCode(error: unknown): CommerceSubscriptionsApiErrorCode {
  return error === 'subscription_not_found'
    || error === 'plan_not_found'
    || error === 'transition_not_allowed'
    ? error
    : 'transition_failed';
}

function statusForErrorCode(errorCode: CommerceSubscriptionsApiErrorCode): number {
  if (errorCode === 'plan_not_found' || errorCode === 'subscription_not_found') return 404;
  if (errorCode === 'subscription_update_failed' || errorCode === 'subscription_delete_failed') return 500;
  if (errorCode === 'plan_delete_failed') return 409;
  return 400;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const errorLocale = resolveRequestLocale(request);
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    if (isPlanId(params.id)) {
      const plan = await getSubscriptionPlan(params.id);
      if (!plan) return errorResponse(errorLocale, 'plan_not_found', 404);
      return NextResponse.json({ ok: true, kind: 'plan', plan });
    }
    if (isSubscriptionId(params.id)) {
      const sub = await getCustomerSubscription(params.id);
      if (!sub) return errorResponse(errorLocale, 'subscription_not_found', 404);
      return NextResponse.json({ ok: true, kind: 'subscription', subscription: sub });
    }
    return errorResponse(errorLocale, 'invalid_id', 400);
  } catch (error) {
    console.error('[builder/commerce/subscriptions/:id] GET failed:', error);
    return errorResponse(errorLocale, 'subscription_load_failed', 500);
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  let errorLocale = resolveRequestLocale(request);
  const guard = await guardMutation(request, { bucket: 'mutation' });
  if (guard instanceof NextResponse) return guard;

  try {
    const body = await request.json();
    errorLocale = resolveRequestLocale(request, body);
    const input = patchSchema.parse(body);

    if (input.kind === 'plan') {
      if (!isPlanId(params.id)) {
        return errorResponse(errorLocale, 'id_kind_mismatch', 400);
      }
      const plan = await updateSubscriptionPlan(params.id, input);
      if (!plan) return errorResponse(errorLocale, 'plan_not_found', 404);
      return NextResponse.json({ ok: true, plan });
    }

    if (!isSubscriptionId(params.id)) {
      return errorResponse(errorLocale, 'id_kind_mismatch', 400);
    }
    const result = await transitionCustomerSubscription(params.id, input.transition, { note: input.note });
    if (!result.value) {
      const errorCode = transitionErrorCode(result.error);
      return errorResponse(errorLocale, errorCode, statusForErrorCode(errorCode));
    }
    return NextResponse.json({ ok: true, subscription: result.value });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) return errorResponse(errorLocale, 'invalid_json', 400);
    console.error('[builder/commerce/subscriptions/:id] PATCH failed:', error);
    return errorResponse(errorLocale, 'subscription_update_failed', 500);
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const errorLocale = resolveRequestLocale(request);
  const guard = await guardMutation(request, { bucket: 'mutation' });
  if (guard instanceof NextResponse) return guard;

  try {
    if (isPlanId(params.id)) {
      const ok = await deleteSubscriptionPlan(params.id);
      if (!ok) return errorResponse(errorLocale, 'plan_delete_failed', 409);
      return NextResponse.json({ ok: true, deleted: true });
    }
    if (isSubscriptionId(params.id)) {
      const ok = await deleteCustomerSubscription(params.id);
      if (!ok) return errorResponse(errorLocale, 'subscription_not_found', 404);
      return NextResponse.json({ ok: true, deleted: true });
    }
    return errorResponse(errorLocale, 'invalid_id', 400);
  } catch (error) {
    console.error('[builder/commerce/subscriptions/:id] DELETE failed:', error);
    return errorResponse(errorLocale, 'subscription_delete_failed', 500);
  }
}
