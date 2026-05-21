import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { requireBuilderAdminAuth } from '@/lib/builder/columns/auth';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  deleteCustomerSubscription,
  deleteSubscriptionPlan,
  getCustomerSubscription,
  getSubscriptionPlan,
  transitionCustomerSubscription,
  updateSubscriptionPlan,
} from '@/lib/builder/commerce/subscriptions-store';

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

function validationError(error: ZodError): NextResponse {
  return NextResponse.json(
    { ok: false, error: 'validation_error', issues: error.flatten() },
    { status: 400 },
  );
}

function isPlanId(id: string): boolean {
  return id.startsWith('plan_');
}

function isSubscriptionId(id: string): boolean {
  return id.startsWith('sub_');
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireBuilderAdminAuth(request);
  if (auth instanceof NextResponse) return auth;

  if (isPlanId(params.id)) {
    const plan = await getSubscriptionPlan(params.id);
    if (!plan) return NextResponse.json({ ok: false, error: 'plan_not_found' }, { status: 404 });
    return NextResponse.json({ ok: true, kind: 'plan', plan });
  }
  if (isSubscriptionId(params.id)) {
    const sub = await getCustomerSubscription(params.id);
    if (!sub) return NextResponse.json({ ok: false, error: 'subscription_not_found' }, { status: 404 });
    return NextResponse.json({ ok: true, kind: 'subscription', subscription: sub });
  }
  return NextResponse.json({ ok: false, error: 'invalid_id' }, { status: 400 });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const guard = await guardMutation(request, { bucket: 'mutation' });
  if (guard instanceof NextResponse) return guard;

  try {
    const body = await request.json();
    const input = patchSchema.parse(body);

    if (input.kind === 'plan') {
      if (!isPlanId(params.id)) {
        return NextResponse.json({ ok: false, error: 'id_kind_mismatch' }, { status: 400 });
      }
      const plan = await updateSubscriptionPlan(params.id, input);
      if (!plan) return NextResponse.json({ ok: false, error: 'plan_not_found' }, { status: 404 });
      return NextResponse.json({ ok: true, plan });
    }

    if (!isSubscriptionId(params.id)) {
      return NextResponse.json({ ok: false, error: 'id_kind_mismatch' }, { status: 400 });
    }
    const result = await transitionCustomerSubscription(params.id, input.transition, { note: input.note });
    if (!result.value) {
      const status = result.error === 'subscription_not_found' ? 404 : 400;
      return NextResponse.json({ ok: false, error: result.error ?? 'transition_failed' }, { status });
    }
    return NextResponse.json({ ok: true, subscription: result.value });
  } catch (error) {
    if (error instanceof ZodError) return validationError(error);
    if (error instanceof SyntaxError) return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
    console.error('[builder/commerce/subscriptions/:id] PATCH failed:', error);
    return NextResponse.json({ ok: false, error: 'subscription_update_failed' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const guard = await guardMutation(request, { bucket: 'mutation' });
  if (guard instanceof NextResponse) return guard;

  if (isPlanId(params.id)) {
    const ok = await deleteSubscriptionPlan(params.id);
    if (!ok) return NextResponse.json({ ok: false, error: 'plan_delete_failed' }, { status: 409 });
    return NextResponse.json({ ok: true, deleted: true });
  }
  if (isSubscriptionId(params.id)) {
    const ok = await deleteCustomerSubscription(params.id);
    if (!ok) return NextResponse.json({ ok: false, error: 'subscription_not_found' }, { status: 404 });
    return NextResponse.json({ ok: true, deleted: true });
  }
  return NextResponse.json({ ok: false, error: 'invalid_id' }, { status: 400 });
}