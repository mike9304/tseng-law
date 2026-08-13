import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  createCustomerSubscription,
  createSubscriptionPlan,
  listCustomerSubscriptions,
  listSubscriptionPlans,
} from '@/lib/builder/commerce/subscriptions-store';
import { GET, POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({
    username: 'admin',
    permission: 'view-commerce',
  })),
  guardMutation: vi.fn(async () => ({
    username: 'admin',
    permission: 'manage-commerce',
  })),
}));

vi.mock('@/lib/builder/commerce/subscriptions-store', () => ({
  createCustomerSubscription: vi.fn(async () => ({ value: subscription })),
  createSubscriptionPlan: vi.fn(async () => plan),
  listCustomerSubscriptions: vi.fn(async () => [subscription]),
  listSubscriptionPlans: vi.fn(async () => [plan]),
}));

const plan = {
  id: 'plan_1',
  planId: 'plan_1',
  slug: 'monthly',
  name: { ko: '월간 플랜', en: 'Monthly plan' },
  description: 'Monthly subscription',
  amountCents: 9900,
  currency: 'KRW',
  interval: 'month',
  intervalCount: 1,
  trialDays: 0,
  status: 'active',
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const subscription = {
  id: 'sub_1',
  subscriptionId: 'sub_1',
  planId: 'plan_1',
  customer: { email: 'customer@example.com', locale: 'ko' },
  status: 'active',
  currentPeriodStart: '2026-06-03T00:00:00.000Z',
  currentPeriodEnd: '2026-07-03T00:00:00.000Z',
  events: [],
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const planInput = {
  kind: 'plan',
  slug: 'monthly',
  name: { ko: '월간 플랜' },
  amountCents: 9900,
  currency: 'KRW',
};

const subscriptionInput = {
  kind: 'subscription',
  planId: 'plan_1',
  customer: { email: 'customer@example.com', locale: 'ko' },
};

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const guardMutationMock = vi.mocked(guardMutation);
const createCustomerSubscriptionMock = vi.mocked(createCustomerSubscription);
const createSubscriptionPlanMock = vi.mocked(createSubscriptionPlan);
const listCustomerSubscriptionsMock = vi.mocked(listCustomerSubscriptions);
const listSubscriptionPlansMock = vi.mocked(listSubscriptionPlans);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/subscriptions${query ? `?${query}` : ''}`);
}

function postRequest(query = '', body: string | unknown = subscriptionInput): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/subscriptions${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('builder commerce subscriptions API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({
      username: 'admin',
      permission: 'view-commerce',
    } as never);
    guardMutationMock.mockResolvedValue({
      username: 'admin',
      permission: 'manage-commerce',
    } as never);
    createCustomerSubscriptionMock.mockResolvedValue({ value: subscription } as never);
    createSubscriptionPlanMock.mockResolvedValue(plan as never);
    listCustomerSubscriptionsMock.mockResolvedValue([subscription] as never);
    listSubscriptionPlansMock.mockResolvedValue([plan] as never);
  });

  it('returns localized query validation errors with stable codes', async () => {
    const response = await GET(getRequest('locale=zh-hant&scope=bad'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認訂閱請求。',
      errorCode: 'validation_error',
    });
    expect(payload.issues).toBeDefined();
    expect(listSubscriptionPlansMock).not.toHaveBeenCalled();
    expect(listCustomerSubscriptionsMock).not.toHaveBeenCalled();
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listSubscriptionPlansMock.mockRejectedValueOnce(new Error('subscription storage secret leaked'));

    const response = await GET(getRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '구독 목록을 불러오지 못했습니다.',
      errorCode: 'subscriptions_list_failed',
    });
    expect(payload.error).not.toContain('subscription storage secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/subscriptions] GET failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('lists plans and subscriptions while preserving success response shape', async () => {
    const response = await GET(getRequest('locale=en&scope=all&email=customer@example.com'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      plans: [plan],
      subscriptions: [subscription],
      totals: { plans: 1, subscriptions: 1 },
    });
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'view-commerce',
    );
    expect(listCustomerSubscriptionsMock).toHaveBeenCalledWith({
      planId: undefined,
      status: undefined,
      email: 'customer@example.com',
    });
  });

  it('returns localized invalid-json create errors using the query locale', async () => {
    const response = await POST(postRequest('locale=zh-hant', '{'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認訂閱請求格式。',
      errorCode: 'invalid_json',
    });
    expect(createCustomerSubscriptionMock).not.toHaveBeenCalled();
    expect(createSubscriptionPlanMock).not.toHaveBeenCalled();
  });

  it('creates plans while preserving success response shape', async () => {
    const response = await POST(postRequest('locale=en', planInput));
    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload).toEqual({ ok: true, plan });
    expect(createSubscriptionPlanMock).toHaveBeenCalledWith(expect.objectContaining(planInput));
  });

  it('returns localized missing-plan create errors', async () => {
    createCustomerSubscriptionMock.mockResolvedValueOnce({ value: null, error: 'plan_not_found' } as never);

    const response = await POST(postRequest('locale=ko', {
      ...subscriptionInput,
      customer: { email: 'customer@example.com', locale: 'en' },
    }));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: 'Subscription plan not found.',
      errorCode: 'plan_not_found',
    });
  });

  it('returns localized archived-plan create errors using the customer locale', async () => {
    createCustomerSubscriptionMock.mockResolvedValueOnce({ value: null, error: 'plan_archived' } as never);

    const response = await POST(postRequest('', {
      ...subscriptionInput,
      customer: { email: 'customer@example.com', locale: 'zh-hant' },
    }));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '無法加入已封存的訂閱方案。',
      errorCode: 'plan_archived',
    });
  });

  it('returns localized fallback create failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    createSubscriptionPlanMock.mockRejectedValueOnce(new Error('subscription create secret leaked'));

    const response = await POST(postRequest('locale=ko', planInput));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '구독을 만들지 못했습니다.',
      errorCode: 'subscription_create_failed',
    });
    expect(payload.error).not.toContain('subscription create secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/subscriptions] POST failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });
});
