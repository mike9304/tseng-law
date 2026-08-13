import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  listPaymentWebhookEvents,
  summarizePaymentWebhookEvents,
} from '@/lib/builder/commerce/payment-webhooks-engine';
import { guardBuilderReadWithPermission } from '@/lib/builder/security/guard';
import { GET } from '../route';

vi.mock('@/lib/builder/security/guard', () => ({
  guardBuilderReadWithPermission: vi.fn(async () => ({
    username: 'admin',
    permission: 'view-commerce',
  })),
}));

vi.mock('@/lib/builder/commerce/payment-webhooks-engine', () => ({
  listPaymentWebhookEvents: vi.fn(async () => []),
  summarizePaymentWebhookEvents: vi.fn(() => ({
    total: 0,
    processed: 0,
    failed: 0,
    unmatched: 0,
    ignored: 0,
    replayed: 0,
  })),
}));

const guardBuilderReadWithPermissionMock = vi.mocked(guardBuilderReadWithPermission);
const listPaymentWebhookEventsMock = vi.mocked(listPaymentWebhookEvents);
const summarizePaymentWebhookEventsMock = vi.mocked(summarizePaymentWebhookEvents);

function getRequest(query = ''): NextRequest {
  return new NextRequest(`https://law.example.test/api/builder/commerce/payment-webhooks${query ? `?${query}` : ''}`);
}

describe('builder commerce payment webhooks list API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    guardBuilderReadWithPermissionMock.mockResolvedValue({
      username: 'admin',
      permission: 'view-commerce',
    } as never);
    listPaymentWebhookEventsMock.mockResolvedValue([]);
    summarizePaymentWebhookEventsMock.mockReturnValue({
      total: 0,
      processed: 0,
      failed: 0,
      unmatched: 0,
      ignored: 0,
      replayed: 0,
    });
  });

  it('returns localized validation errors for invalid filters', async () => {
    const response = await GET(getRequest('locale=zh-hant&status=bad'));
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toMatchObject({
      ok: false,
      error: '請確認付款 Webhook 篩選條件。',
      errorCode: 'invalid_payment_webhook_filters',
    });
    expect(payload.issues).toBeDefined();
    expect(listPaymentWebhookEventsMock).not.toHaveBeenCalled();
  });

  it('returns localized list failures without leaking exception details', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    listPaymentWebhookEventsMock.mockRejectedValueOnce(new Error('webhook storage secret leaked'));

    const response = await GET(getRequest('locale=ko'));
    const payload = await response.json();

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      ok: false,
      error: '결제 웹훅 이벤트를 불러오지 못했습니다.',
      errorCode: 'payment_webhooks_failed',
    });
    expect(payload.error).not.toContain('webhook storage secret leaked');
    expect(consoleError).toHaveBeenCalledWith(
      '[builder/commerce/payment-webhooks] GET failed:',
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it('returns events and KPI summaries while preserving success response shape', async () => {
    const event = {
      version: 1,
      eventId: 'pwh_1',
      provider: 'sandbox-card',
      providerEventId: 'evt_1',
      eventType: 'payment_intent.succeeded',
      paymentReferenceId: 'pi_1',
      paymentStatus: 'paid',
      status: 'processed',
      replayCount: 0,
      signatureVerified: true,
      payload: {},
      receivedAt: '2026-06-03T00:00:00.000Z',
      updatedAt: '2026-06-03T00:00:00.000Z',
    };
    const kpis = { total: 1, processed: 1, failed: 0, unmatched: 0, ignored: 0, replayed: 0 };
    listPaymentWebhookEventsMock.mockResolvedValueOnce([event] as never);
    summarizePaymentWebhookEventsMock.mockReturnValueOnce(kpis);

    const response = await GET(getRequest('locale=en&provider=sandbox-card&status=processed&q=pi_1'));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({ ok: true, events: [event], kpis });
    expect(listPaymentWebhookEventsMock).toHaveBeenCalledWith({
      q: 'pi_1',
      provider: 'sandbox-card',
      status: 'processed',
    });
    expect(summarizePaymentWebhookEventsMock).toHaveBeenCalledWith([event]);
  });
});
