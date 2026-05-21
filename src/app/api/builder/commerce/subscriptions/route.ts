import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  createCustomerSubscription,
  createSubscriptionPlan,
  listCustomerSubscriptions,
  listSubscriptionPlans,
} from '@/lib/builder/commerce/subscriptions-store';

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
  scope: z.enum(['plans', 'subscriptions', 'all']).default('all'),
  planId: z.string().trim().optional(),
  status: z.enum(['trialing', 'active', 'past_due', 'paused', 'cancelled']).optional(),
  email: z.string().trim().email().optional(),
});

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

export async function GET(request: NextRequest) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const sp = request.nextUrl.searchParams;
    const parsed = querySchema.parse({
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
    if (error instanceof ZodError) return validationError(error);
    console.error('[builder/commerce/subscriptions] GET failed:', error);
    return NextResponse.json({ ok: false, error: 'subscriptions_list_failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const guard = await guardMutation(request, { bucket: 'mutation' });
  if (guard instanceof NextResponse) return guard;

  try {
    const body = await request.json();
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
      const status = result.error === 'plan_not_found' ? 404 : 400;
      return NextResponse.json({ ok: false, error: result.error ?? 'subscription_create_failed' }, { status });
    }
    return NextResponse.json({ ok: true, subscription: result.value }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
    console.error('[builder/commerce/subscriptions] POST failed:', error);
    return NextResponse.json({ ok: false, error: 'subscription_create_failed' }, { status: 500 });
  }
}