/**
 * F67 — Subscription billing depth: file-backed store.
 *
 * Persists plans + customer subscriptions in a single JSON file at
 * `runtime-data/commerce/subscriptions.json`. The path is overridable via
 * `BUILDER_SUBSCRIPTIONS_PATH` so tests can isolate IO.
 *
 * Concurrency note: this is a single-writer store. Sequential writes use
 * a process-local serialization queue to avoid clobbering when an admin
 * page mutates multiple records in the same request.
 */
import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import {
  applySubscriptionTransition,
  canTransitionSubscription,
  emptySubscriptionsFile,
  normalizeCustomerSubscription,
  normalizeSubscriptionPlan,
  type CustomerSubscription,
  type CustomerSubscriptionStatus,
  type NormalizeCustomerSubscriptionInput,
  type NormalizeSubscriptionPlanInput,
  type SubscriptionPlan,
  type SubscriptionsFile,
  type SubscriptionTransition,
} from './subscriptions-model';

const DEFAULT_PATH = path.join(process.cwd(), 'runtime-data', 'commerce', 'subscriptions.json');

function storePath(): string {
  return process.env.BUILDER_SUBSCRIPTIONS_PATH?.trim() || DEFAULT_PATH;
}

let writeChain: Promise<void> = Promise.resolve();

async function readFile(): Promise<SubscriptionsFile> {
  try {
    const buf = await fs.readFile(storePath(), 'utf8');
    const parsed = JSON.parse(buf) as Partial<SubscriptionsFile>;
    return {
      version: 1,
      plans: Array.isArray(parsed.plans) ? parsed.plans : [],
      subscriptions: Array.isArray(parsed.subscriptions) ? parsed.subscriptions : [],
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : new Date().toISOString(),
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException)?.code === 'ENOENT') return emptySubscriptionsFile();
    return emptySubscriptionsFile();
  }
}

async function writeFile(data: SubscriptionsFile): Promise<void> {
  const filePath = storePath();
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const body = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, body, 'utf8');
}

function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const next = writeChain.then(task, task);
  writeChain = next.then(() => undefined, () => undefined);
  return next;
}

export interface SubscriptionStoreResult<T> {
  value: T | null;
  error?: string;
}

export async function listSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const file = await readFile();
  return file.plans;
}

export async function getSubscriptionPlan(planId: string): Promise<SubscriptionPlan | null> {
  const file = await readFile();
  return file.plans.find((plan) => plan.planId === planId || plan.slug === planId) ?? null;
}

export async function createSubscriptionPlan(input: NormalizeSubscriptionPlanInput): Promise<SubscriptionPlan> {
  return enqueue(async () => {
    const file = await readFile();
    const now = new Date().toISOString();
    const planId = `plan_${randomUUID()}`;
    const plan = normalizeSubscriptionPlan(input, { planId, now });
    // Ensure slug uniqueness across plans.
    let candidateSlug = plan.slug;
    let suffix = 1;
    while (file.plans.some((existing) => existing.slug === candidateSlug)) {
      suffix += 1;
      candidateSlug = `${plan.slug}-${suffix}`;
    }
    const finalPlan: SubscriptionPlan = { ...plan, slug: candidateSlug };
    const nextFile: SubscriptionsFile = {
      version: 1,
      plans: [...file.plans, finalPlan],
      subscriptions: file.subscriptions,
      updatedAt: now,
    };
    await writeFile(nextFile);
    return finalPlan;
  });
}

export async function updateSubscriptionPlan(
  planId: string,
  patch: NormalizeSubscriptionPlanInput,
): Promise<SubscriptionPlan | null> {
  return enqueue(async () => {
    const file = await readFile();
    const existing = file.plans.find((entry) => entry.planId === planId);
    if (!existing) return null;
    const now = new Date().toISOString();
    const merged: NormalizeSubscriptionPlanInput = {
      planId,
      slug: patch.slug ?? existing.slug,
      name: patch.name ?? existing.name,
      description: patch.description ?? existing.description,
      amountCents: patch.amountCents ?? existing.amountCents,
      currency: patch.currency ?? existing.currency,
      interval: patch.interval ?? existing.interval,
      intervalCount: patch.intervalCount ?? existing.intervalCount,
      trialDays: patch.trialDays ?? existing.trialDays,
      status: patch.status ?? existing.status,
    };
    const next = normalizeSubscriptionPlan(merged, { planId, now, createdAt: existing.createdAt });
    const nextFile: SubscriptionsFile = {
      version: 1,
      plans: file.plans.map((entry) => (entry.planId === planId ? next : entry)),
      subscriptions: file.subscriptions,
      updatedAt: now,
    };
    await writeFile(nextFile);
    return next;
  });
}

export async function deleteSubscriptionPlan(planId: string): Promise<boolean> {
  return enqueue(async () => {
    const file = await readFile();
    if (!file.plans.some((entry) => entry.planId === planId)) return false;
    const inUse = file.subscriptions.some((sub) => sub.planId === planId && sub.status !== 'cancelled');
    if (inUse) return false;
    const now = new Date().toISOString();
    await writeFile({
      version: 1,
      plans: file.plans.filter((entry) => entry.planId !== planId),
      subscriptions: file.subscriptions,
      updatedAt: now,
    });
    return true;
  });
}

export async function listCustomerSubscriptions(filter: {
  planId?: string;
  status?: CustomerSubscriptionStatus;
  email?: string;
} = {}): Promise<CustomerSubscription[]> {
  const file = await readFile();
  return file.subscriptions.filter((sub) => {
    if (filter.planId && sub.planId !== filter.planId) return false;
    if (filter.status && sub.status !== filter.status) return false;
    if (filter.email && sub.customer.email.toLowerCase() !== filter.email.toLowerCase()) return false;
    return true;
  });
}

export async function getCustomerSubscription(subscriptionId: string): Promise<CustomerSubscription | null> {
  const file = await readFile();
  return file.subscriptions.find((sub) => sub.subscriptionId === subscriptionId) ?? null;
}

export async function createCustomerSubscription(
  input: NormalizeCustomerSubscriptionInput,
): Promise<SubscriptionStoreResult<CustomerSubscription>> {
  return enqueue(async () => {
    const file = await readFile();
    const plan = file.plans.find((entry) => entry.planId === input.planId);
    if (!plan) return { value: null, error: 'plan_not_found' };
    if (plan.status === 'archived') return { value: null, error: 'plan_archived' };
    if (!input.customer?.email) return { value: null, error: 'customer_email_required' };
    const now = new Date().toISOString();
    const subscriptionId = `sub_${randomUUID()}`;
    const eventId = `evt_${randomUUID()}`;
    const initialEvents = [{
      eventId,
      type: 'created' as const,
      at: now,
    }];
    const subscription = normalizeCustomerSubscription(
      { ...input, events: initialEvents },
      plan,
      { subscriptionId, now },
    );
    const nextFile: SubscriptionsFile = {
      version: 1,
      plans: file.plans,
      subscriptions: [...file.subscriptions, subscription],
      updatedAt: now,
    };
    await writeFile(nextFile);
    return { value: subscription };
  });
}

export async function transitionCustomerSubscription(
  subscriptionId: string,
  transition: SubscriptionTransition,
  options: { note?: string } = {},
): Promise<SubscriptionStoreResult<CustomerSubscription>> {
  return enqueue(async () => {
    const file = await readFile();
    const existing = file.subscriptions.find((sub) => sub.subscriptionId === subscriptionId);
    if (!existing) return { value: null, error: 'subscription_not_found' };
    const plan = file.plans.find((entry) => entry.planId === existing.planId);
    if (!plan) return { value: null, error: 'plan_not_found' };
    if (!canTransitionSubscription(existing.status, transition)) {
      return { value: null, error: 'transition_not_allowed' };
    }
    const now = new Date().toISOString();
    const eventId = `evt_${randomUUID()}`;
    const updated = applySubscriptionTransition(existing, plan, transition, {
      now,
      eventId,
      note: options.note,
    });
    const nextFile: SubscriptionsFile = {
      version: 1,
      plans: file.plans,
      subscriptions: file.subscriptions.map((entry) => (
        entry.subscriptionId === subscriptionId ? updated : entry
      )),
      updatedAt: now,
    };
    await writeFile(nextFile);
    return { value: updated };
  });
}

export async function deleteCustomerSubscription(subscriptionId: string): Promise<boolean> {
  return enqueue(async () => {
    const file = await readFile();
    if (!file.subscriptions.some((sub) => sub.subscriptionId === subscriptionId)) return false;
    const now = new Date().toISOString();
    await writeFile({
      version: 1,
      plans: file.plans,
      subscriptions: file.subscriptions.filter((sub) => sub.subscriptionId !== subscriptionId),
      updatedAt: now,
    });
    return true;
  });
}

export async function _resetSubscriptionStoreForTests(): Promise<void> {
  await enqueue(async () => {
    await writeFile(emptySubscriptionsFile());
  });
}