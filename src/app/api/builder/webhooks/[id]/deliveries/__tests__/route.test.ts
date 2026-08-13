import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { guardMutation } from '@/lib/builder/security/guard';
import {
  getSubscription,
  listDeliveriesForWebhook,
} from '@/lib/builder/webhooks/storage';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ username: 'admin' })),
}));

vi.mock('@/lib/builder/webhooks/storage', () => ({
  getSubscription: vi.fn(),
  listDeliveriesForWebhook: vi.fn(),
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

const guardMutationMock = vi.mocked(guardMutation);
const getSubscriptionMock = vi.mocked(getSubscription);
const listDeliveriesForWebhookMock = vi.mocked(listDeliveriesForWebhook);

function request(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/webhooks/wh_test/deliveries${query ? `?${query}` : ''}`);
}

describe('/api/builder/webhooks/[id]/deliveries', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ username: 'admin' } as never);
    getSubscriptionMock.mockResolvedValue(subscription as never);
    listDeliveriesForWebhookMock.mockResolvedValue([delivery] as never);
  });

  it('returns deliveries while preserving success response shape', async () => {
    const response = await GET(request('locale=ko'), { params: Promise.resolve({ id: 'wh_test' }) });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(guardMutationMock).toHaveBeenCalledWith(expect.any(NextRequest), {
      allowReadOnly: true,
      permission: 'settings',
    });
    expect(payload).toEqual({
      ok: true,
      deliveries: [delivery],
      total: 1,
    });
  });

  it('returns localized not-found errors', async () => {
    getSubscriptionMock.mockResolvedValueOnce(null as never);

    const response = await GET(request('locale=zh-hant'), { params: Promise.resolve({ id: 'missing' }) });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到 Webhook。',
      errorCode: 'webhook_not_found',
    });
  });

  it('returns localized delivery list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listDeliveriesForWebhookMock.mockRejectedValueOnce(new Error('delivery list secret leaked'));

    const response = await GET(request('locale=en'), { params: Promise.resolve({ id: 'wh_test' }) });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: 'Unable to load webhook deliveries.',
      errorCode: 'webhook_deliveries_failed',
    });
    expect(JSON.stringify(payload)).not.toContain('delivery list secret leaked');
    expect(consoleError).toHaveBeenCalledWith('[builder/webhooks/:id/deliveries] GET failed:', expect.any(Error));
    consoleError.mockRestore();
  });
});
