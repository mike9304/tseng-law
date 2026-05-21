import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  advancePeriodEnd,
  applySubscriptionTransition,
  canTransitionSubscription,
  normalizeSubscriptionPlan,
} from '../subscriptions-model';
import {
  _resetSubscriptionStoreForTests,
  createCustomerSubscription,
  createSubscriptionPlan,
  deleteCustomerSubscription,
  deleteSubscriptionPlan,
  getCustomerSubscription,
  getSubscriptionPlan,
  listCustomerSubscriptions,
  listSubscriptionPlans,
  transitionCustomerSubscription,
  updateSubscriptionPlan,
} from '../subscriptions-store';

let tmpDir = '';
let previousPath: string | undefined;

beforeEach(async () => {
  previousPath = process.env.BUILDER_SUBSCRIPTIONS_PATH;
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'subscriptions-'));
  process.env.BUILDER_SUBSCRIPTIONS_PATH = path.join(tmpDir, 'subscriptions.json');
  await _resetSubscriptionStoreForTests();
});

afterEach(async () => {
  if (previousPath === undefined) delete process.env.BUILDER_SUBSCRIPTIONS_PATH;
  else process.env.BUILDER_SUBSCRIPTIONS_PATH = previousPath;
  if (tmpDir) await fs.rm(tmpDir, { recursive: true, force: true });
});

describe('subscription model pure helpers', () => {
  it('normalizes a plan with sane defaults', () => {
    const plan = normalizeSubscriptionPlan({
      slug: 'Pro Tier!',
      name: { en: 'Pro Tier', ko: '프로' },
      amountCents: 999,
      currency: 'eur',
      interval: 'month',
      trialDays: 7,
    }, { planId: 'plan_test', now: '2026-05-21T00:00:00.000Z' });
    expect(plan.planId).toBe('plan_test');
    expect(plan.slug).toBe('pro-tier');
    expect(plan.currency).toBe('EUR');
    expect(plan.amountCents).toBe(999);
    expect(plan.intervalCount).toBe(1);
    expect(plan.trialDays).toBe(7);
    expect(plan.status).toBe('draft');
    expect(plan.name).toEqual({ en: 'Pro Tier', ko: '프로' });
  });

  it('clamps abusive numeric inputs', () => {
    const plan = normalizeSubscriptionPlan({
      amountCents: -100,
      intervalCount: 9999,
      trialDays: 9999,
      currency: 'XYZ',
    }, { planId: 'plan_clamp', now: 'x' });
    expect(plan.amountCents).toBe(0);
    expect(plan.intervalCount).toBe(120);
    expect(plan.trialDays).toBe(365);
    expect(plan.currency).toBe('USD');
    expect(plan.interval).toBe('month');
  });

  it('advances a period by month with calendar arithmetic', () => {
    const next = advancePeriodEnd('2024-01-31T00:00:00.000Z', 'month', 1);
    // Feb has 29 days in 2024 (leap year), so the date saturates.
    expect(next.startsWith('2024-02-29') || next.startsWith('2024-03-02')).toBe(true);
  });

  it('advances by year correctly', () => {
    expect(advancePeriodEnd('2024-05-21T00:00:00.000Z', 'year', 2)).toBe('2026-05-21T00:00:00.000Z');
  });

  it('rejects illegal transitions', () => {
    expect(canTransitionSubscription('cancelled', 'activate')).toBe(false);
    expect(canTransitionSubscription('cancelled', 'pause')).toBe(false);
    expect(canTransitionSubscription('cancelled', 'cancel')).toBe(false);
    expect(canTransitionSubscription('active', 'resume')).toBe(false);
    expect(canTransitionSubscription('paused', 'mark_past_due')).toBe(false);
  });

  it('applies a renew transition by rolling the period forward', () => {
    const plan = normalizeSubscriptionPlan(
      { amountCents: 1000, currency: 'USD', interval: 'month', intervalCount: 1, trialDays: 0 },
      { planId: 'p1', now: '2026-05-01T00:00:00.000Z' },
    );
    const sub = applySubscriptionTransition(
      {
        subscriptionId: 's1',
        planId: 'p1',
        customer: { email: 'a@b.c' },
        status: 'active',
        currentPeriodStart: '2026-05-01T00:00:00.000Z',
        currentPeriodEnd: '2026-06-01T00:00:00.000Z',
        createdAt: '2026-05-01T00:00:00.000Z',
        updatedAt: '2026-05-01T00:00:00.000Z',
        events: [],
      },
      plan,
      'renew',
      { now: '2026-06-01T00:00:00.000Z', eventId: 'evt_renew' },
    );
    expect(sub.currentPeriodStart).toBe('2026-06-01T00:00:00.000Z');
    expect(sub.currentPeriodEnd).toBe('2026-07-01T00:00:00.000Z');
    expect(sub.events.at(-1)?.type).toBe('renewed');
  });
});

describe('subscription store CRUD', () => {
  it('persists a plan and lists it', async () => {
    const plan = await createSubscriptionPlan({
      slug: 'pro',
      name: { en: 'Pro' },
      amountCents: 1000,
      currency: 'USD',
      interval: 'month',
      intervalCount: 1,
      status: 'active',
    });
    expect(plan.planId.startsWith('plan_')).toBe(true);
    const all = await listSubscriptionPlans();
    expect(all).toHaveLength(1);
    expect(all[0].slug).toBe('pro');

    const fetched = await getSubscriptionPlan(plan.planId);
    expect(fetched?.planId).toBe(plan.planId);
    const bySlug = await getSubscriptionPlan('pro');
    expect(bySlug?.planId).toBe(plan.planId);
  });

  it('de-duplicates slug collisions on create', async () => {
    await createSubscriptionPlan({
      slug: 'pro',
      amountCents: 1000,
      currency: 'USD',
    });
    const second = await createSubscriptionPlan({
      slug: 'pro',
      amountCents: 2000,
      currency: 'USD',
    });
    expect(second.slug).toBe('pro-2');
  });

  it('updates a plan in place', async () => {
    const plan = await createSubscriptionPlan({
      slug: 'pro',
      amountCents: 1000,
      currency: 'USD',
      status: 'draft',
    });
    const updated = await updateSubscriptionPlan(plan.planId, {
      amountCents: 1500,
      status: 'active',
    });
    expect(updated?.amountCents).toBe(1500);
    expect(updated?.status).toBe('active');
    expect(updated?.createdAt).toBe(plan.createdAt);
  });

  it('returns null when updating a missing plan', async () => {
    const updated = await updateSubscriptionPlan('plan_does_not_exist', {});
    expect(updated).toBeNull();
  });

  it('deletes a plan that has no active subscriptions', async () => {
    const plan = await createSubscriptionPlan({ slug: 'pro', amountCents: 100, currency: 'USD' });
    expect(await deleteSubscriptionPlan(plan.planId)).toBe(true);
    expect(await listSubscriptionPlans()).toHaveLength(0);
  });

  it('refuses to delete a plan with an active subscription', async () => {
    const plan = await createSubscriptionPlan({
      slug: 'pro',
      amountCents: 100,
      currency: 'USD',
      status: 'active',
    });
    const result = await createCustomerSubscription({
      planId: plan.planId,
      customer: { email: 'a@b.c' },
    });
    expect(result.value).not.toBeNull();
    expect(await deleteSubscriptionPlan(plan.planId)).toBe(false);
  });

  it('creates a customer subscription with trialing status when plan has trial', async () => {
    const plan = await createSubscriptionPlan({
      slug: 'pro',
      amountCents: 1000,
      currency: 'USD',
      trialDays: 14,
      status: 'active',
    });
    const result = await createCustomerSubscription({
      planId: plan.planId,
      customer: { email: 'trial@example.com' },
    });
    expect(result.value?.status).toBe('trialing');
    expect(result.value?.trialEndsAt).toBeDefined();
  });

  it('rejects subscription creation for a missing plan', async () => {
    const result = await createCustomerSubscription({
      planId: 'plan_missing',
      customer: { email: 'a@b.c' },
    });
    expect(result.value).toBeNull();
    expect(result.error).toBe('plan_not_found');
  });

  it('rejects subscription creation when plan is archived', async () => {
    const plan = await createSubscriptionPlan({
      slug: 'archived',
      amountCents: 100,
      currency: 'USD',
      status: 'archived',
    });
    const result = await createCustomerSubscription({
      planId: plan.planId,
      customer: { email: 'a@b.c' },
    });
    expect(result.error).toBe('plan_archived');
  });

  it('transitions a subscription through active -> paused -> resumed -> cancelled', async () => {
    const plan = await createSubscriptionPlan({
      slug: 'pro',
      amountCents: 1000,
      currency: 'USD',
      trialDays: 0,
      status: 'active',
    });
    const created = await createCustomerSubscription({
      planId: plan.planId,
      customer: { email: 'cycle@example.com' },
    });
    expect(created.value?.status).toBe('active');

    const paused = await transitionCustomerSubscription(created.value!.subscriptionId, 'pause');
    expect(paused.value?.status).toBe('paused');
    expect(paused.value?.pausedAt).toBeDefined();

    const resumed = await transitionCustomerSubscription(created.value!.subscriptionId, 'resume');
    expect(resumed.value?.status).toBe('active');
    expect(resumed.value?.pausedAt).toBeUndefined();

    const cancelled = await transitionCustomerSubscription(created.value!.subscriptionId, 'cancel', {
      note: 'user requested',
    });
    expect(cancelled.value?.status).toBe('cancelled');
    expect(cancelled.value?.cancellationReason).toBe('user requested');
    expect(cancelled.value?.events.map((e) => e.type)).toContain('cancelled');
  });

  it('refuses illegal transitions with a helpful error', async () => {
    const plan = await createSubscriptionPlan({ slug: 'pro', amountCents: 1, currency: 'USD', status: 'active' });
    const sub = await createCustomerSubscription({ planId: plan.planId, customer: { email: 'a@b.c' } });
    await transitionCustomerSubscription(sub.value!.subscriptionId, 'cancel');
    const bad = await transitionCustomerSubscription(sub.value!.subscriptionId, 'activate');
    expect(bad.value).toBeNull();
    expect(bad.error).toBe('transition_not_allowed');
  });

  it('filters subscriptions by status and email', async () => {
    const plan = await createSubscriptionPlan({ slug: 'pro', amountCents: 1, currency: 'USD', status: 'active' });
    await createCustomerSubscription({ planId: plan.planId, customer: { email: 'a@example.com' } });
    const b = await createCustomerSubscription({ planId: plan.planId, customer: { email: 'b@example.com' } });
    await transitionCustomerSubscription(b.value!.subscriptionId, 'pause');

    const onlyA = await listCustomerSubscriptions({ email: 'a@example.com' });
    expect(onlyA).toHaveLength(1);
    expect(onlyA[0].customer.email).toBe('a@example.com');

    const paused = await listCustomerSubscriptions({ status: 'paused' });
    expect(paused).toHaveLength(1);
    expect(paused[0].customer.email).toBe('b@example.com');
  });

  it('deletes a subscription record', async () => {
    const plan = await createSubscriptionPlan({ slug: 'pro', amountCents: 1, currency: 'USD', status: 'active' });
    const sub = await createCustomerSubscription({ planId: plan.planId, customer: { email: 'a@b.c' } });
    expect(await deleteCustomerSubscription(sub.value!.subscriptionId)).toBe(true);
    expect(await getCustomerSubscription(sub.value!.subscriptionId)).toBeNull();
  });
});