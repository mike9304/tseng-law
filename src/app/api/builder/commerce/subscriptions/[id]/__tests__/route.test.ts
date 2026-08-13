import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardBuilderReadWithPermission, guardMutation } from '@/lib/builder/security/guard';
import {
  deleteCustomerSubscription,
  deleteSubscriptionPlan,
  getCustomerSubscription,
  getSubscriptionPlan,
  transitionCustomerSubscription,
  updateSubscriptionPlan,
} from '@/lib/builder/commerce/subscriptions-store';
import { DELETE, GET, PATCH } from '../route';

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
  deleteCustomerSubscription: vi.fn(async () => true),
  deleteSubscriptionPlan: vi.fn(async () => true),
  getCustomerSubscription: vi.fn(async () => subscription),
  getSubscriptionPlan: vi.fn(async () => plan),
  transitionCustomerSubscription: vi.fn(async () => ({ value: subscription })),
  updateSubscriptionPlan: vi.fn(async () => plan),
}));

const plan = {
  id: 'plan_1',
  planId: 'plan_1',
  slug: 'monthly',
  name: { ko: '월간 플랜', en: 'Monthly plan' },
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

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const guardMutationMock = vi.mocked(guardMutation);
const deleteCustomerSubscriptionMock = vi.mocked(deleteCustomerSubscription);
const deleteSubscriptionPlanMock = vi.mocked(deleteSubscriptionPlan);
const getCustomerSubscriptionMock = vi.mocked(getCustomerSubscription);
const getSubscriptionPlanMock = vi.mocked(getSubscriptionPlan);
const transitionCustomerSubscriptionMock = vi.mocked(transitionCustomerSubscription);
const updateSubscriptionPlanMock = vi.mocked(updateSubscriptionPlan);

function getRequest(id = 'sub_1', query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/subscriptions/${id}${query ? `?${query}` : ''}`);
}

function mutationRequest(method: 'PATCH' | 'DELETE', id = 'sub_1', query = '', body: string | unknown = {
  kind: 'subscription',
  transition: 'pause',
}): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/subscriptions/${id}${query ? `?${query}` : ''}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: method === 'DELETE' ? undefined : typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function params(id = 'sub_1') {
  return { params: Promise.resolve({ id }) };
}

describe('builder commerce subscription detail API', () => {
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
    deleteCustomerSubscriptionMock.mockResolvedValue(true as never);
    deleteSubscriptionPlanMock.mockResolvedValue(true as never);
    getCustomerSubscriptionMock.mockResolvedValue(subscription as never);
    getSubscriptionPlanMock.mockResolvedValue(plan as never);
    transitionCustomerSubscriptionMock.mockResolvedValue({ value: subscription } as never);
    updateSubscriptionPlanMock.mockResolvedValue(plan as never);
  });

  it('returns localized invalid-id read errors', async () => {
    const response = await GET(getRequest('bad_id', 'locale=zh-hant'), params('bad_id'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認訂閱或方案 ID。',
      errorCode: 'invalid_id',
    });
  });

  it('returns localized missing-plan read errors', async () => {
    getSubscriptionPlanMock.mockResolvedValueOnce(null as never);

    const response = await GET(getRequest('plan_missing', 'locale=en'), params('plan_missing'));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: 'Subscription plan not found.',
      errorCode: 'plan_not_found',
    });
  });

  it('reads subscriptions while preserving success response shape', async () => {
    const response = await GET(getRequest('sub_1', 'locale=ko'), params('sub_1'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, kind: 'subscription', subscription });
    expect(guardBuilderReadWithPermissionMock).toHaveBeenCalledWith(
      expect.any(NextRequest),
      'view-commerce',
    );
    expect(getCustomerSubscriptionMock).toHaveBeenCalledWith('sub_1');
  });

  it('returns localized load failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    getCustomerSubscriptionMock.mockRejectedValueOnce(new Error('subscription load secret leaked'));

    const response = await GET(getRequest('sub_1', 'locale=ko'), params('sub_1'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '구독 정보를 불러오지 못했습니다.',
      errorCode: 'subscription_load_failed',
    });
    expect(payload.error).not.toContain('subscription load secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/subscriptions/:id] GET failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('returns localized invalid-json patch errors using the query locale', async () => {
    const response = await PATCH(mutationRequest('PATCH', 'sub_1', 'locale=zh-hant', '{'), params('sub_1'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請確認訂閱請求格式。',
      errorCode: 'invalid_json',
    });
    expect(transitionCustomerSubscriptionMock).not.toHaveBeenCalled();
  });

  it('returns localized ID-kind mismatch patch errors using the body locale', async () => {
    const response = await PATCH(mutationRequest('PATCH', 'plan_1', '', {
      kind: 'subscription',
      transition: 'pause',
      locale: 'zh-hant',
    }), params('plan_1'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: '請求的 ID 類型與操作類型不一致。',
      errorCode: 'id_kind_mismatch',
    });
  });

  it('returns localized missing-plan update errors', async () => {
    updateSubscriptionPlanMock.mockResolvedValueOnce(null as never);

    const response = await PATCH(mutationRequest('PATCH', 'plan_1', 'locale=en', {
      kind: 'plan',
      status: 'active',
    }), params('plan_1'));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: 'Subscription plan not found.',
      errorCode: 'plan_not_found',
    });
  });

  it('returns localized blocked transition errors', async () => {
    transitionCustomerSubscriptionMock.mockResolvedValueOnce({
      value: null,
      error: 'transition_not_allowed',
    } as never);

    const response = await PATCH(mutationRequest('PATCH', 'sub_1', 'locale=en'), params('sub_1'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'This subscription action is not allowed in the current state.',
      errorCode: 'transition_not_allowed',
    });
  });

  it('updates subscriptions while preserving success response shape', async () => {
    const response = await PATCH(mutationRequest('PATCH', 'sub_1', 'locale=ko'), params('sub_1'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, subscription });
    expect(transitionCustomerSubscriptionMock).toHaveBeenCalledWith('sub_1', 'pause', { note: undefined });
  });

  it('returns localized plan delete conflicts', async () => {
    deleteSubscriptionPlanMock.mockResolvedValueOnce(false as never);

    const response = await DELETE(mutationRequest('DELETE', 'plan_1', 'locale=ko'), params('plan_1'));
    const payload = await response.json();

    expect(response.status).toBe(409);
    expect(payload).toEqual({
      ok: false,
      error: '사용 중인 구독 플랜은 삭제할 수 없습니다.',
      errorCode: 'plan_delete_failed',
    });
  });

  it('returns localized missing-subscription delete errors', async () => {
    deleteCustomerSubscriptionMock.mockResolvedValueOnce(false as never);

    const response = await DELETE(mutationRequest('DELETE', 'sub_missing', 'locale=en'), params('sub_missing'));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: 'Subscription not found.',
      errorCode: 'subscription_not_found',
    });
  });

  it('deletes subscriptions while preserving success response shape', async () => {
    const response = await DELETE(mutationRequest('DELETE', 'sub_1', 'locale=ko'), params('sub_1'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, deleted: true });
    expect(deleteCustomerSubscriptionMock).toHaveBeenCalledWith('sub_1');
  });

  it('returns localized delete fallback failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    deleteCustomerSubscriptionMock.mockRejectedValueOnce(new Error('subscription delete secret leaked'));

    const response = await DELETE(mutationRequest('DELETE', 'sub_1', 'locale=en'), params('sub_1'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to delete subscription.',
      errorCode: 'subscription_delete_failed',
    });
    expect(payload.error).not.toContain('subscription delete secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/subscriptions/:id] DELETE failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });
});
