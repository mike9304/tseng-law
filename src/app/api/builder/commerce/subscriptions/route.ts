import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  getCommerceSubscriptionsApiErrorPayload,
  type CommerceSubscriptionsApiErrorCode,
} from '@/lib/builder/commerce/subscriptions-api-copy';
import {
  createCustomerSubscription,
  createSubscriptionPlan,
  listCustomerSubscriptions,
  listSubscriptionPlans,
} from '@/lib/builder/commerce/subscriptions-store';
import { isLocale, normalizeLocale, type Locale } from '@/lib/locales';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const localeName = z.object({
  ko: z.string().trim().max(200).optional(),
  'zh-hant': z.string().trim().max(200).optional(),
  en: z.string().trim().max(200).optional(),
}).partial();

const planCreateSchema = z.object({
  kind: z.literal('plan'),
  slug: z.string().trim().min(1).max(80).optional(),
  name: localeName.optional(),
  description: z.string().trim().max(1000).optional(),
  amountCents: z.number().int().nonnegative(),
  currency: z.enum(['TWD', 'KRW', 'USD', 'EUR', 'JPY', 'CNY']),
  interval: z.enum(['day', 'week', 'month', 'year']).default('month'),
  intervalCount: z.number().int().min(1).max(120).default(1),
  trialDays: z.number().int().min(0).max(365).default(0),
  status: z.enum(['draft', 'active', 'archived']).default('draft'),
});

const subscriptionCreateSchema = z.object({
  kind: z.literal('subscription'),
  planId: z.string().trim().min(1),
  customer: z.object({
    email: z.string().trim().email(),
    name: z.string().trim().max(200).optional(),
    locale: z.enum(['ko', 'zh-hant', 'en']).optional(),
  }),
  status: z.enum(['trialing', 'active', 'past_due', 'paused', 'cancelled']).optional(),
  currentPeriodStart: z.string().datetime().optional(),
  currentPeriodEnd: z.string().datetime().optional(),
  trialEndsAt: z.string().datetime().optional(),
});

const createSchema = z.discriminatedUnion('kind', [planCreateSchema, subscriptionCreateSchema]);

const querySchema = z.object({
  locale: z.enum(['ko', 'zh-hant', 'en']).default('ko'),
  scope: z.enum(['plans', 'subscriptions', 'all']).default('all'),
  planId: z.string().trim().optional(),
  status: z.enum(['trialing', 'active', 'past_due', 'paused', 'cancelled']).optional(),
  email: z.string().trim().email().optional(),
});

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
    const directLocale = (payload as { locale?: unknown }).locale;
    if (typeof directLocale === 'string' && isLocale(directLocale)) return directLocale;
    const customer = (payload as { customer?: unknown }).customer;
    if (customer && typeof customer === 'object') {
      const customerLocale = (customer as { locale?: unknown }).locale;
      if (typeof customerLocale === 'string' && isLocale(customerLocale)) return customerLocale;
    }
  }
  return normalizeLocale(request.nextUrl.searchParams.get('locale') ?? undefined);
}

function subscriptionCreateErrorCode(error: unknown): CommerceSubscriptionsApiErrorCode {
  return error === 'plan_not_found'
    || error === 'plan_archived'
    || error === 'customer_email_required'
    ? error
    : 'subscription_create_failed';
}

function statusForErrorCode(errorCode: CommerceSubscriptionsApiErrorCode): number {
  if (errorCode === 'plan_not_found' || errorCode === 'subscription_not_found') return 404;
  if (errorCode === 'subscription_create_failed' || errorCode === 'subscription_update_failed') return 500;
  return 400;
}

export async function GET(request: NextRequest) {
  const errorLocale = resolveRequestLocale(request);
  const auth = await guardBuilderReadWithPermission(request, 'view-commerce');
  if (auth instanceof NextResponse) return auth;

  try {
    const sp = request.nextUrl.searchParams;
    const parsed = querySchema.parse({
      locale: sp.get('locale') ?? 'ko',
      scope: sp.get('scope') ?? 'all',
      planId: sp.get('planId') ?? undefined,
      status: sp.get('status') ?? undefined,
      email: sp.get('email') ?? undefined,
    });

    const [plans, subscriptions] = await Promise.all([
      parsed.scope === 'subscriptions' ? Promise.resolve([]) : listSubscriptionPlans(),
      parsed.scope === 'plans' ? Promise.resolve([]) : listCustomerSubscriptions({
        planId: parsed.planId,
        status: parsed.status,
        email: parsed.email,
      }),
    ]);

    return NextResponse.json({
      ok: true,
      plans,
      subscriptions,
      totals: { plans: plans.length, subscriptions: subscriptions.length },
    });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    console.error('[builder/commerce/subscriptions] GET failed:', error);
    return errorResponse(errorLocale, 'subscriptions_list_failed', 500);
  }
}

export async function POST(request: NextRequest) {
  let errorLocale = resolveRequestLocale(request);
  const guard = await guardMutation(request, { bucket: 'mutation', permission: 'manage-commerce' });
  if (guard instanceof NextResponse) return guard;

  try {
    const body = await request.json();
    errorLocale = resolveRequestLocale(request, body);
    const input = createSchema.parse(body);

    if (input.kind === 'plan') {
      const plan = await createSubscriptionPlan(input);
      return NextResponse.json({ ok: true, plan }, { status: 201 });
    }

    const result = await createCustomerSubscription({
      planId: input.planId,
      customer: input.customer,
      status: input.status,
      currentPeriodStart: input.currentPeriodStart,
      currentPeriodEnd: input.currentPeriodEnd,
      trialEndsAt: input.trialEndsAt,
    });
    if (!result.value) {
      const errorCode = subscriptionCreateErrorCode(result.error);
      return errorResponse(errorLocale, errorCode, statusForErrorCode(errorCode));
    }
    return NextResponse.json({ ok: true, subscription: result.value }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return validationError(errorLocale, error);
    if (error instanceof SyntaxError) return errorResponse(errorLocale, 'invalid_json', 400);
    console.error('[builder/commerce/subscriptions] POST failed:', error);
    return errorResponse(errorLocale, 'subscription_create_failed', 500);
  }
}
