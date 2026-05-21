/**
 * F67 — Subscription billing depth: data model.
 *
 * Pure types + small pure helpers. No IO. Persistence lives in
 * `subscriptions-store.ts`.
 *
 * Two record types:
 *   - SubscriptionPlan: the admin-managed offering (price, interval, trial).
 *   - CustomerSubscription: a customer's enrollment in a plan with lifecycle
 *     state (trialing/active/paused/cancelled/past_due) and billing schedule.
 */

import type { Locale } from '@/lib/locales';
import type { MultiCurrencyCode } from './multi-currency';
import { isMultiCurrencyCode } from './multi-currency';

export const SUBSCRIPTION_MODEL_VERSION = 1;

export type SubscriptionInterval = 'day' | 'week' | 'month' | 'year';

export type SubscriptionPlanStatus = 'draft' | 'active' | 'archived';

export type CustomerSubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'paused'
  | 'cancelled';

export interface SubscriptionPlan {
  planId: string;
  /** Admin-facing slug used in admin UI / API routing. */
  slug: string;
  name: Partial<Record<Locale, string>>;
  description?: string;
  amountCents: number;
  currency: MultiCurrencyCode;
  interval: SubscriptionInterval;
  intervalCount: number;
  /** Trial length in days (0 disables trial). */
  trialDays: number;
  status: SubscriptionPlanStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerSubscriptionLifecycleEvent {
  eventId: string;
  type: 'created' | 'activated' | 'paused' | 'resumed' | 'cancelled' | 'past_due' | 'renewed';
  at: string;
  note?: string;
}

export interface CustomerSubscription {
  subscriptionId: string;
  planId: string;
  customer: {
    email: string;
    name?: string;
    locale?: Locale;
  };
  status: CustomerSubscriptionStatus;
  /** Start of the most recent billing period (ISO). */
  currentPeriodStart: string;
  /** End of the most recent billing period (ISO); next charge would be on this date. */
  currentPeriodEnd: string;
  /** Set when status === 'cancelled'. */
  cancelledAt?: string;
  cancellationReason?: string;
  /** Set when status === 'paused'. */
  pausedAt?: string;
  /** Set when status === 'trialing' and a trial is active. */
  trialEndsAt?: string;
  createdAt: string;
  updatedAt: string;
  events: CustomerSubscriptionLifecycleEvent[];
}

export interface SubscriptionsFile {
  version: typeof SUBSCRIPTION_MODEL_VERSION;
  plans: SubscriptionPlan[];
  subscriptions: CustomerSubscription[];
  updatedAt: string;
}

/** Returns an empty file payload — used to bootstrap an empty store. */
export function emptySubscriptionsFile(now = new Date().toISOString()): SubscriptionsFile {
  return {
    version: SUBSCRIPTION_MODEL_VERSION,
    plans: [],
    subscriptions: [],
    updatedAt: now,
  };
}

const SUBSCRIPTION_INTERVALS: readonly SubscriptionInterval[] = ['day', 'week', 'month', 'year'];
const PLAN_STATUSES: readonly SubscriptionPlanStatus[] = ['draft', 'active', 'archived'];
const CUSTOMER_STATUSES: readonly CustomerSubscriptionStatus[] = [
  'trialing', 'active', 'past_due', 'paused', 'cancelled',
];

function isSubscriptionInterval(value: unknown): value is SubscriptionInterval {
  return typeof value === 'string' && (SUBSCRIPTION_INTERVALS as readonly string[]).includes(value);
}

function isPlanStatus(value: unknown): value is SubscriptionPlanStatus {
  return typeof value === 'string' && (PLAN_STATUSES as readonly string[]).includes(value);
}

function isCustomerStatus(value: unknown): value is CustomerSubscriptionStatus {
  return typeof value === 'string' && (CUSTOMER_STATUSES as readonly string[]).includes(value);
}

function safeString(value: unknown, max = 200): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function normalizeLocaleName(value: unknown): Partial<Record<Locale, string>> {
  if (!value || typeof value !== 'object') return {};
  const source = value as Record<string, unknown>;
  const out: Partial<Record<Locale, string>> = {};
  for (const locale of ['ko', 'zh-hant', 'en'] as const) {
    const entry = source[locale];
    if (typeof entry === 'string') {
      const trimmed = entry.trim();
      if (trimmed.length) out[locale] = trimmed.slice(0, 200);
    }
  }
  return out;
}

function normalizeAmountCents(value: unknown): number {
  const numeric = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isFinite(numeric) || numeric < 0) return 0;
  return Math.floor(numeric);
}

function normalizeIntervalCount(value: unknown): number {
  const numeric = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isFinite(numeric) || numeric < 1) return 1;
  return Math.min(120, Math.floor(numeric));
}

function normalizeTrialDays(value: unknown): number {
  const numeric = typeof value === 'number' ? value : typeof value === 'string' ? Number(value) : NaN;
  if (!Number.isFinite(numeric) || numeric < 0) return 0;
  return Math.min(365, Math.floor(numeric));
}

function normalizeCurrency(value: unknown): MultiCurrencyCode {
  const upper = typeof value === 'string' ? value.trim().toUpperCase() : '';
  return isMultiCurrencyCode(upper) ? (upper as MultiCurrencyCode) : 'USD';
}

function normalizeSlug(value: unknown, fallback: string): string {
  const raw = safeString(value, 80).toLowerCase();
  const cleaned = raw.replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
  return cleaned || fallback;
}

export interface NormalizeSubscriptionPlanInput {
  planId?: string;
  slug?: unknown;
  name?: unknown;
  description?: unknown;
  amountCents?: unknown;
  currency?: unknown;
  interval?: unknown;
  intervalCount?: unknown;
  trialDays?: unknown;
  status?: unknown;
}

export function normalizeSubscriptionPlan(
  input: NormalizeSubscriptionPlanInput,
  defaults: { planId: string; now: string; createdAt?: string },
): SubscriptionPlan {
  return {
    planId: input.planId ?? defaults.planId,
    slug: normalizeSlug(input.slug, defaults.planId),
    name: normalizeLocaleName(input.name),
    description: safeString(input.description, 1000) || undefined,
    amountCents: normalizeAmountCents(input.amountCents),
    currency: normalizeCurrency(input.currency),
    interval: isSubscriptionInterval(input.interval) ? input.interval : 'month',
    intervalCount: normalizeIntervalCount(input.intervalCount),
    trialDays: normalizeTrialDays(input.trialDays),
    status: isPlanStatus(input.status) ? input.status : 'draft',
    createdAt: defaults.createdAt ?? defaults.now,
    updatedAt: defaults.now,
  };
}

function normalizeLocale(value: unknown): Locale | undefined {
  if (value === 'ko' || value === 'zh-hant' || value === 'en') return value;
  return undefined;
}

export interface NormalizeCustomerSubscriptionInput {
  subscriptionId?: string;
  planId: string;
  customer: {
    email: string;
    name?: string;
    locale?: unknown;
  };
  status?: unknown;
  currentPeriodStart?: unknown;
  currentPeriodEnd?: unknown;
  trialEndsAt?: unknown;
  pausedAt?: unknown;
  cancelledAt?: unknown;
  cancellationReason?: unknown;
  events?: CustomerSubscriptionLifecycleEvent[];
}

function safeIsoOrNow(value: unknown, fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return fallback;
  return new Date(parsed).toISOString();
}

function safeOptionalIso(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const parsed = Date.parse(value);
  if (!Number.isFinite(parsed)) return undefined;
  return new Date(parsed).toISOString();
}

/**
 * Compute the end of the next billing period given a start instant and the
 * plan's interval. Uses calendar arithmetic for month/year so 2024-01-31 +
 * 1 month -> 2024-02-29 (UTC).
 */
export function advancePeriodEnd(startIso: string, interval: SubscriptionInterval, intervalCount: number): string {
  const start = new Date(startIso);
  if (Number.isNaN(start.getTime())) return startIso;
  const next = new Date(start.getTime());
  switch (interval) {
    case 'day':
      next.setUTCDate(start.getUTCDate() + intervalCount);
      break;
    case 'week':
      next.setUTCDate(start.getUTCDate() + 7 * intervalCount);
      break;
    case 'month':
      next.setUTCMonth(start.getUTCMonth() + intervalCount);
      break;
    case 'year':
      next.setUTCFullYear(start.getUTCFullYear() + intervalCount);
      break;
  }
  return next.toISOString();
}

export function normalizeCustomerSubscription(
  input: NormalizeCustomerSubscriptionInput,
  plan: SubscriptionPlan,
  defaults: { subscriptionId: string; now: string; createdAt?: string },
): CustomerSubscription {
  const createdAt = defaults.createdAt ?? defaults.now;
  const currentPeriodStart = safeIsoOrNow(input.currentPeriodStart, defaults.now);
  const currentPeriodEnd = safeIsoOrNow(
    input.currentPeriodEnd,
    advancePeriodEnd(currentPeriodStart, plan.interval, plan.intervalCount),
  );
  const status: CustomerSubscriptionStatus = isCustomerStatus(input.status)
    ? input.status
    : (plan.trialDays > 0 ? 'trialing' : 'active');
  const trialEndsAt = status === 'trialing'
    ? (safeOptionalIso(input.trialEndsAt)
      ?? advancePeriodEnd(currentPeriodStart, 'day', plan.trialDays))
    : safeOptionalIso(input.trialEndsAt);

  return {
    subscriptionId: input.subscriptionId ?? defaults.subscriptionId,
    planId: input.planId,
    customer: {
      email: safeString(input.customer.email, 200),
      name: safeString(input.customer.name, 200) || undefined,
      locale: normalizeLocale(input.customer.locale),
    },
    status,
    currentPeriodStart,
    currentPeriodEnd,
    trialEndsAt,
    pausedAt: status === 'paused' ? (safeOptionalIso(input.pausedAt) ?? defaults.now) : safeOptionalIso(input.pausedAt),
    cancelledAt: status === 'cancelled' ? (safeOptionalIso(input.cancelledAt) ?? defaults.now) : safeOptionalIso(input.cancelledAt),
    cancellationReason: safeString(input.cancellationReason, 500) || undefined,
    createdAt,
    updatedAt: defaults.now,
    events: input.events ?? [],
  };
}

export type SubscriptionTransition = 'activate' | 'pause' | 'resume' | 'cancel' | 'mark_past_due' | 'renew';

/**
 * Returns true when a status transition is legal. Used both by the store
 * and by API route validation.
 *
 * Transition rules:
 *   - activate:      from trialing or paused or past_due -> active
 *   - pause:         from active or trialing -> paused
 *   - resume:        from paused -> active
 *   - cancel:        from any non-cancelled state -> cancelled
 *   - mark_past_due: from active or trialing -> past_due
 *   - renew:         from active or past_due -> active (period advance only)
 */
export function canTransitionSubscription(
  current: CustomerSubscriptionStatus,
  transition: SubscriptionTransition,
): boolean {
  switch (transition) {
    case 'activate':
      return current === 'trialing' || current === 'paused' || current === 'past_due';
    case 'pause':
      return current === 'active' || current === 'trialing';
    case 'resume':
      return current === 'paused';
    case 'cancel':
      return current !== 'cancelled';
    case 'mark_past_due':
      return current === 'active' || current === 'trialing';
    case 'renew':
      return current === 'active' || current === 'past_due';
    default:
      return false;
  }
}

/** Applies a transition to a record, returning the next snapshot. Pure. */
export function applySubscriptionTransition(
  subscription: CustomerSubscription,
  plan: SubscriptionPlan,
  transition: SubscriptionTransition,
  options: { now: string; eventId: string; note?: string } = { now: new Date().toISOString(), eventId: 'evt' },
): CustomerSubscription {
  if (!canTransitionSubscription(subscription.status, transition)) return subscription;
  const now = options.now;
  const event: CustomerSubscriptionLifecycleEvent = {
    eventId: options.eventId,
    type: transition === 'mark_past_due'
      ? 'past_due'
      : transition === 'activate' || transition === 'resume'
        ? (transition === 'resume' ? 'resumed' : 'activated')
        : transition === 'cancel'
          ? 'cancelled'
          : transition === 'pause'
            ? 'paused'
            : 'renewed',
    at: now,
    note: options.note,
  };

  switch (transition) {
    case 'activate':
      return {
        ...subscription,
        status: 'active',
        pausedAt: undefined,
        trialEndsAt: undefined,
        updatedAt: now,
        events: [...subscription.events, event],
      };
    case 'pause':
      return {
        ...subscription,
        status: 'paused',
        pausedAt: now,
        updatedAt: now,
        events: [...subscription.events, event],
      };
    case 'resume':
      return {
        ...subscription,
        status: 'active',
        pausedAt: undefined,
        updatedAt: now,
        events: [...subscription.events, event],
      };
    case 'cancel':
      return {
        ...subscription,
        status: 'cancelled',
        cancelledAt: now,
        cancellationReason: options.note,
        updatedAt: now,
        events: [...subscription.events, event],
      };
    case 'mark_past_due':
      return {
        ...subscription,
        status: 'past_due',
        updatedAt: now,
        events: [...subscription.events, event],
      };
    case 'renew': {
      const nextStart = subscription.currentPeriodEnd;
      const nextEnd = advancePeriodEnd(nextStart, plan.interval, plan.intervalCount);
      return {
        ...subscription,
        status: 'active',
        currentPeriodStart: nextStart,
        currentPeriodEnd: nextEnd,
        updatedAt: now,
        events: [...subscription.events, event],
      };
    }
    default:
      return subscription;
  }
}