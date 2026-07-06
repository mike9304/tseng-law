import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import { retryDelivery } from '@/lib/builder/webhooks/dispatcher';
import {
  getDelivery,
  getSubscription,
} from '@/lib/builder/webhooks/storage';
import { POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/webhooks/dispatcher', () => ({
  retryDelivery: vi.fn(),
}));

vi.mock('@/lib/builder/webhooks/storage', () => ({
  getDelivery: vi.fn(),
  getSubscription: vi.fn(),
}));

const subscription = {
  webhookId: 'wh_test',
  url: 'https://hooks.example.com/incoming',
  events: ['form.submitted'],
  secret: 'whsec_1234567890abcdef1234567890abcdef',
  active: true,
  createdAt: '2026-06-03T00:00:00.000Z',
  updatedAt: '2026-06-03T00:00:00.000Z',
};

const delivery = {
  deliveryId: 'dlv_1',
  webhookId: 'wh_test',
  event: 'form.submitted',
  payload: { formId: 'contact' },
  status: 'failed',
  attempts: 1,
  createdAt: '2026-06-03T00:00:00.000Z',
};

const retryResult = {
  ...delivery,
  deliveryId: 'dlv_2',
  status: 'success',
  attempts: 2,
  responseStatus: 200,
};

const guardMutationMock = vi.mocked(guardMutation);
const getDeliveryMock = vi.mocked(getDelivery);
const getSubscriptionMock = vi.mocked(getSubscription);
const retryDeliveryMock = vi.mocked(retryDelivery);

function request(query = '', body: string | unknown = { deliveryId: 'dlv_1' }): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/webhooks/wh_test/retry${query ? `?${query}` : ''}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

describe('/api/builder/webhooks/[id]/retry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'admin' } as never);
    getDeliveryMock.mockResolvedValue(delivery as never);
    getSubscriptionMock.mockResolvedValue(subscription as never);
    retryDeliveryMock.mockResolvedValue(retryResult as never);
  });

  it('retries deliveries while preserving success response shape', async () => {
    const response = await POST(request('locale=ko'), { params: { id: 'wh_test' } });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(retryDeliveryMock).toHaveBeenCalledWith(subscription, delivery);
    expect(payload).toEqual({
      ok: true,
      delivery: retryResult,
    });
  });

  it('returns localized missing webhook errors', async () => {
    getSubscriptionMock.mockResolvedValueOnce(null as never);

    const response = await POST(request('locale=zh-hant'), { params: { id: 'missing' } });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到 Webhook。',
      errorCode: 'webhook_not_found',
    });
  });

  it('returns localized invalid JSON errors', async () => {
    const response = await POST(request('locale=en', '{'), { params: { id: 'wh_test' } });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      ok: false,
      error: 'Check the webhook request format.',
      errorCode: 'invalid_json',
    });
  });

  it('returns localized validation errors', async () => {
    const response = await POST(request('locale=zh-hant', { deliveryId: '' }), { params: { id: 'wh_test' } });
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認 Webhook 請求內容。',
      errorCode: 'validation_error',
    });
    expect(payload.details).toBeDefined();
    expect(retryDeliveryMock).not.toHaveBeenCalled();
  });

  it('returns localized missing delivery errors', async () => {
    getDeliveryMock.mockResolvedValueOnce(null as never);

    const response = await POST(request('locale=en'), { params: { id: 'wh_test' } });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: 'Webhook delivery not found.',
      errorCode: 'delivery_not_found',
    });
  });

  it('returns localized retry failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    retryDeliveryMock.mockRejectedValueOnce(new Error('retry secret leaked'));

    const response = await POST(request('locale=ko'), { params: { id: 'wh_test' } });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Webhook 재시도를 완료하지 못했습니다.',
      errorCode: 'webhook_retry_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('retry secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/webhooks/:id/retry] POST failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
