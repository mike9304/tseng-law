import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { replayPaymentWebhookEvent } from '@/lib/builder/commerce/payment-webhooks-engine';
import { guardMutation } from '@/lib/builder/security/guard';
import { POST } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardMutation: vi.fn(async () => ({ user: { id: 'admin-1' } })),
}));

vi.mock('@/lib/builder/commerce/payment-webhooks-engine', () => ({
  replayPaymentWebhookEvent: vi.fn(async () => ({
    event: null,
    order: null,
    changed: false,
    reason: 'event_not_found',
  })),
}));

const guardMutationMock = vi.mocked(guardMutation);
const replayPaymentWebhookEventMock = vi.mocked(replayPaymentWebhookEvent);

function postRequest(eventId = 'pwh_1', query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/payment-webhooks/events/${eventId}/replay${query ? `?${query}` : ''}`, {
    method: 'POST',
  });
}

describe('builder commerce payment webhook replay API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardMutationMock.mockResolvedValue({ user: { id: 'admin-1' } } as never);
    replayPaymentWebhookEventMock.mockResolvedValue({
      event: null,
      order: null,
      changed: false,
      reason: 'event_not_found',
    } as never);
  });

  it('returns localized not-found errors', async () => {
    const response = await POST(postRequest('missing', 'locale=zh-hant'), {
      params: Promise.resolve({ eventId: 'missing' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      ok: false,
      error: '找不到付款 Webhook 事件。',
      errorCode: 'payment_webhook_event_not_found',
    });
    expect(replayPaymentWebhookEventMock).toHaveBeenCalledWith('missing');
  });

  it('returns localized replay failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    replayPaymentWebhookEventMock.mockRejectedValueOnce(new Error('replay secret leaked'));

    const response = await POST(postRequest('pwh_1', 'locale=ko'), {
      params: Promise.resolve({ eventId: 'pwh_1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '결제 웹훅 이벤트를 재시도하지 못했습니다.',
      errorCode: 'payment_webhook_replay_failed',
    });
    expect(payload.error).not.toContain('replay secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/payment-webhooks/replay] POST failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('replays payment webhooks while preserving success response shape', async () => {
    const event = {
      version: 1,
      eventId: 'pwh_1',
      provider: 'sandbox-card',
      providerEventId: 'evt_1',
      eventType: 'payment_intent.succeeded',
      paymentReferenceId: 'pi_1',
      paymentStatus: 'paid',
      status: 'processed',
      replayCount: 1,
      signatureVerified: true,
      payload: {},
      receivedAt: '2026-06-03T00:00:00.000Z',
      updatedAt: '2026-06-03T00:01:00.000Z',
    };
    const order = { orderId: 'order-1', currency: 'TWD', totals: {}, payment: {} };
    replayPaymentWebhookEventMock.mockResolvedValueOnce({
      event,
      order,
      changed: false,
      reason: 'payment_status_unchanged',
    } as never);

    const response = await POST(postRequest('pwh_1', 'locale=en'), {
      params: Promise.resolve({ eventId: 'pwh_1' }),
    });
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      event,
      order,
      changed: false,
      reason: 'payment_status_unchanged',
    });
  });
});
